// File name: External Video Player
// Test Description:
//      1) Open and start external Video
//      2) Stop external Video Sharing
//

const puppeteer = require('puppeteer');
const URL = process.argv[2]

let externalVideos = {}
externalVideos.init = puppeteer.launch({
        headless: false,
        args: [ '--use-fake-ui-for-media-stream',
                '--window-size=800,600']
    }).then(async browser => {
        browser.newPage().then(async page => {
        page.setDefaultTimeout(1200000);
        await page.setViewport({ width: 1042, height: 617});
        try {
            await page.goto(`${URL}/demo/demoHTML5.jsp?username=externalVideosTest&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
            await page.waitFor(3000);
            await page.evaluate(()=>document.querySelector('[aria-describedby^="modalDismissDescription"]').click());
            await page.waitFor(3000);

            // Open and start external Video
            await page.evaluate(()=> document.querySelector('[class="icon--2q1XXw icon-bbb-plus"]').parentNode.click());
            await page.evaluate(()=> document.querySelectorAll('[class="item--yl1AH"]')[9].click());
            await page.waitFor(3000);
            await page.focus('input[id="video-modal-input"][aria-describedby="exernal-video-note"]');
            await page.keyboard.type('https://www.youtube.com/watch?v=oplhZIiMmLs',{delay: 50});
            await page.evaluate(()=> document.querySelector('[class="button--Z2dosza md--Q7ug4 default--Z19H5du startBtn--ZifpQ9"]').click());
            await page.waitFor(5000);

            // Stop external Video Sharing
            await page.evaluate(()=> document.querySelector('[class="icon--2q1XXw icon-bbb-plus"]').parentNode.click());
            await page.evaluate(()=> document.querySelectorAll('[class="item--yl1AH"]')[9].click());
            process.exit[0]
        } catch (error) {
            console.log({error});
            process.exit[1]
        }

        browser.close();
    });
});
module.exports = externalVideos;
