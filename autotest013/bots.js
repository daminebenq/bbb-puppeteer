const puppeteer = require('puppeteer');
const URL = process.argv[2]
const bots = process.argv[4]
const TIMELIMIT_SECONDS = parseInt(process.argv[5])
const TIMELIMIT_MILLISECONDS = TIMELIMIT_SECONDS * 1000;
var repeat = 1;
var log = function () {
    Array.prototype.unshift.call(
        arguments,
        '['+new Date()+']'
    );
    return console.log.apply(console, arguments);
};
async function bot() {
    const browser = await puppeteer.launch({
        headless: true,
	    args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    page.on('console', async msg => console[msg._type](
        ...await Promise.all(msg.args().map(arg => arg.jsonValue()))
    ));
    log(['Starting Time'])
    try{
        page.setDefaultTimeout(120000);
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=Bot-${bots}&meetingname=puppeteer&isModerator=false&action=create`);
        await page.waitForSelector('[aria-describedby^="modalDismissDescription"]', { timeout: 0 });
        await page.click('[aria-describedby^="modalDismissDescription"]');
        await page.waitFor(10000)
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

            // Checking Share Webcam Lock
            if (meetinglocksList.meetingLocksListObj.lockSettingsProps.disableCam === true){
                do {
                    while(repeat < 2){
                        console.log('Share WebCam Lock is active !');
                        repeat++;
                    }
                } while (await page.evaluate(async()=>await $('button[aria-label="Share webcam"][aria-disabled="false"]')))
                do {
                    console.log('Share WebCam Lock isn\'t active !');
                    process.exit(1)
                } while (await page.evaluate(async()=>await $('button[aria-label="Share webcam"][aria-disabled="true"]')))
            }

            // // Checking See other viewers webcams Lock
            // if (meetinglocksList.userPropsLocksListObj.usersProp.webcamsOnlyForModerator === true){
            //     do{
                    
            //     } while (await page.evaluate(()=>document.querySelector('')))
            // }
            
        }
        process.exit(0)
    }   
    catch(error){
        const time = new Date()
        console.log({error}, ' at => ',time)
        process.exit(1);
    }
}
bot();
