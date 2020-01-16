const puppeteer = require('puppeteer');
const URL = process.argv[2]
const bots = process.argv[4]
const TIMELIMIT_SECONDS = parseInt(process.argv[5])
const TIMELIMIT_MILLISECONDS = TIMELIMIT_SECONDS * 1000;

function repeat_string(string, count) {
    if ((string == null) || (count < 0) || (count === Infinity) || (count == null))
      {
        return('Error in string or count.');
      }
        count = count | 0; // Floor count.
    return new Array(count + 1).join(string);
}

async function bot() {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
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
                    console.log(repeat_string('Share WebCam Lock is active !', 1));
                } while (await page.evaluate(async()=>await $('button[aria-label="Share webcam"][aria-disabled="false"]')))
                do {
                    log([{error},"Error at Share Webcam Lock !"])
                    process.exit(1)
                } while (await page.evaluate(async()=>await $('button[aria-label="Share webcam"][aria-disabled="true"]')))
            }

            // // Checking See other viewers webcams Lock
            // if (meetinglocksList.userPropsLocksListObj.usersProp.webcamsOnlyForModerator === true){
            //     do{
                    
            //     } while (await page.evaluate(()=>document.querySelector('')))
            // }

            // Checking Share Microphone Lock
            while (cases.disableMic === true){
                await page.waitFor(15000)
                await page.waitForSelector('button[aria-label="Join audio"]')
                await page.click('button[aria-label="Join audio"]')

                const countButtons = await page.evaluate(()=>{
                    let count = document.querySelectorAll('button[class="jumbo--Z12Rgj4 buttonWrapper--x8uow audioBtn--1H6rCK"]').length
                    return count
                })
                countButtons === 1 ? console.log(repeat_string("Share Microphone Lock is Active !", 1)) : process.exit(1, console.log("The was an Error !"))
            }

            // Checking Public Chat Lock
            while (cases.disablePublicChat === true){
                await page.waitFor(15000)
                const attr = await page.evaluate(()=>document.querySelector('[aria-label="Send message"]').getAttribute("aria-disabled"));   
                attr === "true" ? console.log(repeat_string("Public Chat Lock is Active !", 1)) : process.exit(1, console.log("The was an Error !")) 
            }

            // Checking Private Chat Lock
            while (cases.disablePrivateChat === true){
                await page.waitFor(15000)
                await page.evaluate(()=>
                    document.querySelectorAll('[aria-label^="Bot-"]')[1]
                    .parentElement.parentElement
                    .parentElement.querySelector('[class="content--ZmitSl right-top--Z1QyptE dropdownContent--ZpTliS"]') === null
                     ? console.log("Private Chat Lock is Active !") 
                     : process.exit(1, console.log("The was an Error !"))
                );
            }

            // Checking See other viewers in the Users list Lock
            while (cases.hideUserList === true){
                await page.waitFor(15000)
                await page.evaluate(()=>
                    document.querySelectorAll('div.avatar--Z2lyL8K:not(.moderator--24bqCT)').length === 1
                    ? console.log("See other viewers in the Users list Lock is Active !")
                    : console.log("The was an Error !")
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
