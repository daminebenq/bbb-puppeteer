// File name: Poll Creation from PDF file
// Test Description:
//      1) Upload a PDF to the Presentation
//      2) Starting a Poll from Options available in the PDF file
//      3) Publish Poll Result
//

const puppeteer = require('puppeteer');
const URL = process.argv[2];
var path = require('path');     
const pdf = path.join(__dirname,'../../files/customPoll.pdf');

let poll = {}
poll.init = puppeteer.launch({
        headless: false,
        args: [ '--use-fake-ui-for-media-stream',
                '--window-size=800,600']
    }).then(async browser => {
        browser.newPage().then(async page => {            
        await page.setViewport({ width: 1042, height: 617});
        try {
            await page.goto(`${URL}/demo/demoHTML5.jsp?username=pdfPollTest&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
            await page.waitFor(3000);
            await page.waitFor('[aria-describedby^="modalDismissDescription"]');
            await page.click('[aria-describedby^="modalDismissDescription"]');
            await page.waitFor(3000);
            // Starting Poll from Uploaded File
            await page.waitFor('[class="lg--Q7ufB buttonWrapper--x8uow button--ZzeTUF"]');
            await page.click('[class="lg--Q7ufB buttonWrapper--x8uow button--ZzeTUF"]');
            await page.waitFor(3000);
            await page.waitFor('[aria-labelledby="dropdown-item-label-24"][aria-describedby="dropdown-item-desc-25"]');
            await page.click('[aria-labelledby="dropdown-item-label-24"][aria-describedby="dropdown-item-desc-25"]');
            await page.waitFor(3000);
            const fileInput = await page.$('input[type=file]');
            
            await fileInput.uploadFile(pdf);
            await page.evaluate(()=>{
                document.querySelector('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO confirm--1BlGTz"]')
                .click()
            })
            await page.waitFor('[aria-label="Quick Poll"]');
            await page.click('[aria-label="Quick Poll"]');
            await page.waitFor(3000);
            await page.evaluate(()=>{document.querySelectorAll('[class="verticalList--Ghtxj"][role="menu"]')[2].click()});

            // Publishing Poll results
            await page.waitFor(3000);
            await page.evaluate(()=>document.querySelector('span[class="itemLabel--Z12glHA"]').click());
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
