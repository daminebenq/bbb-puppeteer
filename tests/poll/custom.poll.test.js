// File name: Custom Poll Creation
// Test Description:
//      1) Create a Custom Poll
//      2) Typing Custom Poll options
//      3) Publish Poll Result
//

const puppeteer = require('puppeteer');
const URL = process.argv[2];

let poll = {}
poll.init = puppeteer.launch({
        headless: false,
        args: [ '--use-fake-ui-for-media-stream',
                '--window-size=800,600']
    }).then(async browser => {
        browser.newPage().then(async page => {            
        await page.setViewport({ width: 1042, height: 617});
        try {
            await page.goto(`${URL}/demo/demoHTML5.jsp?username=customPollTest&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
            await page.waitFor(3000);
            await page.waitFor('[aria-describedby^="modalDismissDescription"]');
            await page.click('[aria-describedby^="modalDismissDescription"]');
            await page.waitFor(3000);

            // Starting a new Poll
            await page.waitFor('[class="lg--Q7ufB buttonWrapper--x8uow button--ZzeTUF"]');
            await page.click('[class="lg--Q7ufB buttonWrapper--x8uow button--ZzeTUF"]');
            await page.waitFor(3000);
            await page.waitFor('[aria-labelledby="dropdown-item-label-22"][aria-describedby="dropdown-item-desc-23"]');
            await page.click('[aria-labelledby="dropdown-item-label-22"][aria-describedby="dropdown-item-desc-23"]');
            await page.waitFor(3000);              

            // Writing custom Poll options
            await page.waitFor('[aria-label="Custom poll"]');
            await page.click('[aria-label="Custom poll"]');
            await page.waitFor(3000);
            await page.waitFor('[class="pollInput--Z2euEV9"]');
            await page.click('[class="pollInput--Z2euEV9"]');
            await page.keyboard.type('Poll option 1 !',{delay: 100});
            await page.keyboard.press('Tab');
            await page.keyboard.type('Poll option 2 !',{delay: 100})

            // Publishing Poll results
            await page.waitFor(3000);
            await page.waitFor('[aria-label="Start custom poll"]');
            await page.click('[aria-label="Start custom poll"]');
            await page.waitFor(3000);

            // Hiding Poll results from presentation
            await page.waitFor('[aria-label="Clear all annotations"]');
            await page.click('[aria-label="Clear all annotations"]');
            process.exit(0);
        } catch (error){
            console.log({error})
            process.exit(1);
        }
    browser.close();
    })
});
module.exports = poll;
