// File name: Start and Stop Screen Sharing
// Test Description:
//      1) Starting Screen Sharing
//      2) Stopping Screen Sharing
//

const puppeteer = require('puppeteer');
const URL = process.argv[2]

let screenShare = {}
screenShare.init = puppeteer.launch({
        headless: false,
        args: [ '--use-fake-ui-for-media-stream',
                '--window-size=800,600']
    }).then(async browser => {
        browser.newPage().then(async page => {
        page.setDefaultTimeout(1200000);
        await page.setViewport({ width: 1042, height: 617});
        try {
            await page.goto(`${URL}/demo/demoHTML5.jsp?username=screenShareTest&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
            await page.waitFor(3000);
            await page.click('[aria-label="Close Join audio modal"]');

            // Starting Screen Sharing
            await page.waitForSelector('[aria-label="Share your screen"]');
            await page.click('[aria-label="Share your screen"]');
            page.on('dialog', async dialog => {
                await dialog.accept();
            });
            await page.waitFor(10000);

            // Stopping Screen Sharing
            await page.waitForSelector('[aria-label="Stop sharing your screen"]');
            await page.click('[aria-label="Stop sharing your screen"]');
            page.on('dialog', async dialog => {
                await dialog.accept();
            });
            await page.waitFor(5000);
            process.exit[0]
        } catch (error) {
            console.log({error});
            process.exit[1]
        }
        browser.close();
    });
});
module.exports = screenShare;
