// File name: Record Meeting
// Test Description:
//      1) Start recording the Meeting
//      2) Pause recording the Meeting
//

const puppeteer = require('puppeteer');
const URL = process.argv[2]

let recording = {}
recording.init = puppeteer.launch({
        headless: false,
        args: [ '--use-fake-ui-for-media-stream',
                '--window-size=800,600']
    }).then(async browser => {
        browser.newPage().then(async page => {
        page.setDefaultTimeout(1200000);
        await page.setViewport({ width: 1042, height: 617});
        try {
            await page.goto(`${URL}/demo/demoHTML5.jsp?username=RecordSessionTest&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
            await page.waitFor(3000);
            await page.evaluate(()=>document.querySelector('[aria-describedby^="modalDismissDescription"]').click());
            await page.waitFor(3000);

            // Start recording the Meeting
            await page.waitFor('[class="recordingControlOFF--26cqft"][role="button"]');
            await page.click('[class="recordingControlOFF--26cqft"][role="button"]');
            await page.waitFor(5000);
            await page.waitFor('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO button--Z28qGla"]');
            await page.click('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO button--Z28qGla"]');
            await page.waitFor(5000);

            // Pause recording the Meeting
            await page.waitFor('[class="recordingControlON--ZTT4Mq"][role="button"]');
            await page.click('[class="recordingControlON--ZTT4Mq"][role="button"]');
            await page.waitFor(5000);
            await page.waitFor('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO button--Z28qGla"]');
            await page.click('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO button--Z28qGla"]');
            process.exit[0]
        } catch (error) {
            console.log({error});
            process.exit[1]
        }
        browser.close();
    });
});
module.exports = recording;
