// File name: Full Screen Webcam
// Test Description:
//      1) Enabling webcam
//      2) Enabling full screen Webcam
//      3) Leaving Webcam Full Screen
//

const puppeteer = require('puppeteer');
const URL = process.argv[2];

let webcams = {}
webcams.init = puppeteer.launch({
        headless: false,
        args: [ '--use-fake-ui-for-media-stream',
                '--window-size=800,600']
    }).then(async browser => {
        browser.newPage().then(async page => {
        await page.setViewport({ width: 1042, height: 617});
        try {
            await page.goto(`${URL}/demo/demoHTML5.jsp?username=WebcamEnabled&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
            
            await page.waitFor(3000);
            await page.waitFor('[aria-describedby^="modalDismissDescription"]');
            await page.click('[aria-describedby^="modalDismissDescription"]');
            await page.waitFor(3000);

            // Enabling webcam
            await page.waitFor(9000);
            await page.waitFor('[class="lg--Q7ufB buttonWrapper--x8uow button--qv0Xy btn--29prju"]');
            await page.click('[class="lg--Q7ufB buttonWrapper--x8uow button--qv0Xy btn--29prju"]');
            await page.waitFor(9000);
            await page.waitFor('video[id="preview"][class="preview--25JmPP"]');
            await page.waitFor(9000);
            await page.waitFor('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO"]');
            await page.click('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO"]');
            await page.waitFor(9000);

            // Enabling full screen Webcam
            await page.evaluate(()=> document.querySelectorAll('[data-test="presentationFullscreenButton"]')[1].click());
            await page.waitFor(9000);

            // Leaving Webcam Full Screen
            await page.waitFor(9000);
            await page.evaluate(()=> document.querySelectorAll('[data-test="presentationFullscreenButton"]')[1].click());
            process.exit[0]
        }
        catch (error) {
            console.log({error});
            process.exit[1];
        }
        browser.close();
    });
});
module.exports = webcams;