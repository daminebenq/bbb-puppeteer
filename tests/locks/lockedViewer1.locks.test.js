// File name: Viewer Connection (Locked)
// Test Description:
//      1) Connecting as a Viewer to a Meeting
//
//  => NOTE: This File is used in locks.test.js
//

const puppeteer = require('puppeteer');
const URL = process.argv[2]

let lockedViewer1 = {}
lockedViewer1.init = puppeteer.launch({
        headless: true,
        args: [ '--use-fake-ui-for-media-stream',
                '--window-size=800,600']
    }).then(async browser => {
        browser.newPage().then(async page => {
        try {
            await page.goto(`${URL}/demo/demoHTML5.jsp?username=lockedViewer1&isModerator=false&action=create`);
            await page.waitFor(3000);
            await page.evaluate(()=>document.querySelector('[aria-describedby^="modalDismissDescription"]').click())
            await page.waitFor(3000);
            process.exit[0]
        } catch (error) {
            console.log({error});
            process.exit[0]
        }
    });
});
module.exports = lockedViewer1;
