const puppeteer = require('puppeteer');
const URL = process.argv[2]
const bots = process.argv[4]
const TIMELIMIT_SECONDS = parseInt(process.argv[5])
const TIMELIMIT_MILLISECONDS = TIMELIMIT_SECONDS * 1000;
var repeat;
var log = function () {
    Array.prototype.unshift.call(
        arguments,
        '['+new Date()+']'
    );
    return console.log.apply(console, arguments);
};
async function bot() {
    const browser = await puppeteer.launch({
        headless: false,
        args: [ '--use-fake-ui-for-media-stream',
        '--window-size=800,600',
        '--unlimited-storage', 
        '--full-memory-crash-report',
        '--no-sandbox'
        ]
    });

    const page = await browser.newPage();
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
            if (cases.disableCam === true){
                repeat = 1;
                do {
                    if(repeat < 2){
                        console.log('Share WebCam Lock is active !');
                        repeat++;
                    }
                } while (await page.evaluate(async()=>await $('button[aria-label="Share webcam"][aria-disabled="false"]')))
                do {
                    console.log('Share WebCam Lock isn\'t active !');
                    console.log('Error occured !')
                    process.exit(1)
                } while (await page.evaluate(async()=>await $('button[aria-label="Share webcam"][aria-disabled="true"]')))
            }

            // // Checking See other viewers webcams Lock
            // if (meetinglocksList.userPropsLocksListObj.usersProp.webcamsOnlyForModerator === true){
            //     do{
                    
            //     } while (await page.evaluate(()=>document.querySelector('')))
            // }

            // Checking Share Microphone Lock
            if (cases.disableMic === true){

                const checkToastify = (string)=>{
                    const checkExistance = page.evaluate(()=>{
                        const numerOfLastToastifyElement = document.querySelector('[class="Toastify__toast-container Toastify__toast-container--top-right container--ZT6KKx"]').childNodes.length + 1
                        const str = document.querySelectorAll('div.message--Z1R4N9M')[numerOfLastToastifyElement].innerHTML
                        return str === "Viewers' microphones are enabled"
                    })
                    return string
                }
                
                switch(checkToastify()){
                    case true:
                        console.log('Share Microphone Lock isn\'t active !');
                        console.log('Error occured !')
                        process.exit(1)
                    case false:
                        console.log('Share Microphone Lock is active !');
                }
            }
        }
        log(['End Time'])
        process.exit(0)
    }   
    catch(error){
        const time = new Date()
        console.log({error}, ' at => ',time)
        process.exit(1);
    }
}
bot();
