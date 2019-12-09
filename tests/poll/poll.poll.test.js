// File name: Normal Poll Creation
// Test Description:
//      1) Starting a normal Poll
//      2) Publishing Poll Result
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
            await page.goto(`${URL}/demo/demoHTML5.jsp?username=PollTest&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
            await page.waitFor(3000);
            await page.waitFor('[aria-describedby^="modalDismissDescription"]');
            await page.click('[aria-describedby^="modalDismissDescription"]');
            await page.waitFor(3000);

            // Starting a Poll
            await page.waitFor('[class="lg--Q7ufB buttonWrapper--x8uow button--ZzeTUF"]');
            await page.click('[class="lg--Q7ufB buttonWrapper--x8uow button--ZzeTUF"]');
            await page.waitFor(3000);
            await page.waitFor('[aria-labelledby="dropdown-item-label-22"][aria-describedby="dropdown-item-desc-23"]');
            await page.click('[aria-labelledby="dropdown-item-label-22"][aria-describedby="dropdown-item-desc-23"]');
            await page.waitFor(3000);
            await page.evaluate(()=>document.querySelectorAll('[class="button--Z2dosza md--Q7ug4 default--Z19H5du pollBtn--119tJ5"]')[5].click());
            await page.waitFor(5000)
        
            // Publishing Poll results
            await page.evaluate(()=>document.querySelectorAll('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO btn--dDLST"]')[0].click());
            await page.waitFor(3000);

            // Hiding Poll results from presentation
            await page.waitFor('[aria-label="Clear all annotations"]');
            await page.click('[aria-label="Clear all annotations"]');
            process.exit[0];
        } catch (error){
            console.log({error})
            process.exit[1];
        }
    browser.close();
    })
});
module.exports = poll;
