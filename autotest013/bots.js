const puppeteer = require('puppeteer');
const URL = process.argv[2]
const bots = process.argv[4]
const TIMELIMIT_SECONDS = parseInt(process.argv[5])
const TIMELIMIT_MILLISECONDS = TIMELIMIT_SECONDS * 1000;

async function bot() {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        '--use-file-for-fake-video-capture=video_rgb.y4m',    
        '--window-size=800,600',
        '--unlimited-storage', 
        '--full-memory-crash-report',
        '--no-sandbox'
        ]
    });
    const page = await browser.newPage();
    var log = function () {
        Array.prototype.unshift.call(
            arguments,
            '['+new Date()+']'
        );
        return console.log.apply(console, arguments);
    };
    page.on('console', async msg => console[msg._type](
        ...await Promise.all(msg.args().map(arg => arg.jsonValue()))
    ));
    page.on("error", function (err) {  
        var errValue = err.toString();
        console.log("Error: " + errValue)
        process.exit(1)
    })
    log(['Starting Time'])
    try{
        page.setDefaultTimeout(120000);
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=Bot-${bots}&isModerator=false&action=create`);

        await page.waitFor('[aria-describedby^="modalDismissDescription"]');
        await page.click('[aria-describedby^="modalDismissDescription"]');
        
        for (var i = TIMELIMIT_MILLISECONDS; i >= 0; i--) {
            const meetinglocksList = await page.evaluate(()=>{
                let collection = require('/imports/api/meetings/index.js');
                function locksObjects(){
                    let meetingLocksListObj = collection.default._collection.find({},{fields: {lockSettingsProps: 1}}).fetch()[0]
                    let userPropsLocksListObj = collection.default._collection.find({},{fields: {usersProp: 1}}).fetch()[0]
                    return {
                        meetingLocksListObj: meetingLocksListObj,
                        userPropsLocksListObj: userPropsLocksListObj
                    }
                }
                var locksListObj = locksObjects()
                return locksListObj
            })

            let cases =  {
                disableCam: meetinglocksList.meetingLocksListObj.lockSettingsProps.disableCam,
                webcamsOnlyForModerator: meetinglocksList.userPropsLocksListObj.usersProp.webcamsOnlyForModerator,
                disableMic: meetinglocksList.meetingLocksListObj.lockSettingsProps.disableMic,
                disablePublicChat: meetinglocksList.meetingLocksListObj.lockSettingsProps.disablePublicChat,
                disablePrivateChat: meetinglocksList.meetingLocksListObj.lockSettingsProps.disablePrivateChat,
                disableNote: meetinglocksList.meetingLocksListObj.lockSettingsProps.disableNote,
                hideUserList: meetinglocksList.meetingLocksListObj.lockSettingsProps.hideUserList
            }

            // Checking Share Webcam Lock
            while (cases.disableCam === true){
                await page.waitFor(15000)
                do {
                    console.log('Share WebCam Lock is active !');
                } while (await page.evaluate(async()=>await $('button[aria-label="Share webcam"][aria-disabled="false"]')))
                do {
                    log(["Error at Share Webcam Lock !"])
                    console.log('There was an error') 
                } while (await page.evaluate(async()=>await $('button[aria-label="Share webcam"][aria-disabled="true"]')))
            }

            // Checking See other viewers webcams Lock
            if (cases.webcamsOnlyForModerator === true){
                await page.waitFor(15000)
                // Enabling webcam
                await page.waitForSelector('[aria-label="Share webcam"]');
                await page.click('[aria-label="Share webcam"]');
                await page.waitFor(3000);
                await page.waitForSelector('[class="videoCol--1FC5pn"]');
                await page.waitFor(3000);
                await page.waitForSelector('[aria-label="Start sharing"]');
                await page.click('[aria-label="Start sharing"]');
                await page.waitFor(3000)
                // Counting the webcams visible for the Bot
                const webcamsCount = await page.evaluate(()=>{
                    countWebcams = document.querySelectorAll('[class="videoListItem--ZP5lQT"]').length
                    return countWebcams
                })
                // Counting the viewers in the users list
                const viewersCount = await page.evaluate(()=>
                    document.querySelectorAll('div.avatar--Z2lyL8K:not(.moderator--24bqCT)').length
                )
                viewersCount !== webcamsCount ? console.log("See other viewers webcams Lock is Active !") : console.log('There was an error') 
            }

            // Checking Share Microphone Lock
            while (cases.disableMic === true){
                await page.waitFor(15000)
                await page.waitForSelector('button[aria-label="Join audio"]')
                await page.click('button[aria-label="Join audio"]')

                const countButtons = await page.evaluate(()=>{
                    let count = document.querySelectorAll('button[class="jumbo--Z12Rgj4 buttonWrapper--x8uow audioBtn--1H6rCK"]').length
                    return count
                })
                countButtons === 1 ? console.log("Share Microphone Lock is Active !") : console.error('There was an error', err) 
            }

            // Checking Public Chat Lock
            while (cases.disablePublicChat === true){
                await page.waitFor(15000)
                const attr = await page.evaluate(()=>document.querySelector('[aria-label="Send message"]').getAttribute("aria-disabled"));   
                attr === "true" ? console.log("Public Chat Lock is Active !") : console.log('There was an error') 
            }

            // Checking Private Chat Lock
            while (cases.disablePrivateChat === true){
                await page.waitFor(15000)
                await page.evaluate(()=>
                    document.querySelectorAll('[aria-label^="Bot-"]')[1]
                    .parentElement.parentElement
                    .parentElement.querySelector('[class="content--ZmitSl right-top--Z1QyptE dropdownContent--ZpTliS"]') === null
                     ? console.log("Private Chat Lock is Active !") 
                     : console.log('There was an error') 
                );
            }

            // Checking Edit Shared Notes Lock
            while (cases.disableNote === true){
                await page.waitFor(15000)
                await page.waitForSelector('div[role^="button"][class^="noteLink--1Xz6Lp"]')
                await page.click('div[role^="button"][class^="noteLink--1Xz6Lp"]')
                await page.waitFor(3000)
                await page.evaluate (() =>
                    document.querySelectorAll('iframe')[0].contentDocument
                    .querySelectorAll('[class="menu_left"]')[0].querySelectorAll('li').length === 0
                     ? console.log("Edit Shared Notes Lock is Active !")
                      : console.log('There was an error') 
                )
            }

            // Checking See other viewers in the Users list Lock
            while (cases.hideUserList === true){
                await page.waitFor(15000)
                await page.evaluate(()=>
                    document.querySelectorAll('div.avatar--Z2lyL8K:not(.moderator--24bqCT)').length === 1
                    ? console.log("See other viewers in the Users list Lock is Active !")
                    : console.log('There was an error') 
                )
            }
        }
        log(['End Time'])
        process.exit(0)
    }   
    catch(error){
        log([{error},"There was an ERROR !"])
        process.exit(1)
    }
}
bot();
