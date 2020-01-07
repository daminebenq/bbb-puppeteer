const puppeteer = require('puppeteer');
const URL = process.argv[2]
const TIMELIMIT_SECONDS = parseInt(process.argv[4])
const TIMELIMIT_MILLISECONDS = TIMELIMIT_SECONDS * 1000;
const objectObservableLite = require('object-observable-lite');

var log = function () {
    Array.prototype.unshift.call(
        arguments,
        '['+new Date()+']'
    );
    return console.log.apply(console, arguments);
};
async function puppeteer1() {
    const browser = await puppeteer.launch({
        headless: false,
	    args: ['--no-sandbox']
    });
    // const browser = await puppeteer.connect({
    //    browserWSEndpoint: `ws://209.133.209.137:3000/?token=joao`
    // });
    const page = await browser.newPage();

    page.on('console', async msg => console[msg._type](
        ...await Promise.all(msg.args().map(arg => arg.jsonValue()))
    ));
    log(['Starting Time'])

    try {
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=getLocks&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
        await page.waitFor(3000);
        await page.waitFor('[aria-describedby^="modalDismissDescription"]');
        await page.click('[aria-describedby^="modalDismissDescription"]');
        await page.waitFor(3000);        await page.waitFor(3000);
        
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

        console.log('\n|---- Locks Settings List ----|')
        console.log('Share Webcam => ', meetinglocksList.meetingLocksListObj.lockSettingsProps.disableCam === false ? 'Unlocked' : 'Locked')
        console.log('See other viewers webcams => ', meetinglocksList.userPropsLocksListObj.usersProp.webcamsOnlyForModerator === false ? 'Unlocked' : 'Locked')
        console.log('Share microphone => ', meetinglocksList.meetingLocksListObj.lockSettingsProps.disableMic === false ? 'Unlocked' : 'Locked')
        console.log('Send Public chat messages => ', meetinglocksList.meetingLocksListObj.lockSettingsProps.disablePublicChat === false ? 'Unlocked' : 'Locked')
        console.log('Send Private chat messages => ', meetinglocksList.meetingLocksListObj.lockSettingsProps.disablePrivateChat === false ? 'Unlocked' : 'Locked')
        console.log('Edit Shared Notes => ', meetinglocksList.meetingLocksListObj.lockSettingsProps.disableNote === false ? 'Unlocked' : 'Locked')
        console.log('See other viewers in the Users list => ', meetinglocksList.meetingLocksListObj.lockSettingsProps.hideUserList === false ? 'Unlocked' : 'Locked\n')

        await page.waitFor(TIMELIMIT_MILLISECONDS)
        log(['\nEnd Time'])
        process.exit(0)
    } catch (error) {
        console.log({error});
        process.exit(1)
    }
}
puppeteer1()