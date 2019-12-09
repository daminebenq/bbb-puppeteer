// File name: Closed Captions
// Test Description:
//      1) Opening Closed Captions Menu
//      2) Starting Closed Captions
//      3) Writing in Closed Captions
//      4) Export Closed Captions as PDF
//      5) Hiding Closed Captions
//

const puppeteer = require('puppeteer');
const URL = process.argv[2]

let closedCaptions = {}
closedCaptions.init = puppeteer.launch({
        headless: false,
        args: [ '--use-fake-ui-for-media-stream',
                '--window-size=800,600']
    }).then(async browser => {
        browser.newPage().then(async page => {
        page.setDefaultTimeout(1200000);
        await page.setViewport({ width: 1042, height: 617});
        try {
            await page.goto(`${URL}/demo/demoHTML5.jsp?username=ClosedCaptionsTest&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
            await page.waitFor(3000);
            await page.evaluate(()=>document.querySelector('[aria-describedby^="modalDismissDescription"]').click());
            await page.waitFor(3000);

            // Opening Closed Captions Menu
            await page.evaluate(()=> document.querySelector('i[class="itemIcon--Z207zn1 icon-bbb-closed_caption"]').parentNode.click());
            await page.evaluate(()=>document.querySelectorAll('[class="icon--2q1XXw icon-bbb-settings"]')[0].click());
            await page.waitFor(3000);

            // Starting Closed Captions
            await page.waitFor('[class="select--Z1QuDod"]');
            await page.waitFor('[class="button--Z2dosza md--Q7ug4 default--Z19H5du startBtn--21jNH1"]');
            await page.click('[class="button--Z2dosza md--Q7ug4 default--Z19H5du startBtn--21jNH1"]');
            await page.waitFor(3000);

            // Writing in Closed Captions
            await page.keyboard.type('This is a Closed Caption Text !',{delay: 100})
            await page.waitFor(3000);

            // Export Closed Captions as PDF
            await page.waitFor('[class=" buttonicon buttonicon-import_export"]');
            await page.click('[class=" buttonicon buttonicon-import_export"]');
            await page.waitFor(3000);
            await page.waitFor('[data-l10n-id="pad.importExport.exportpdf"]');
            await page.click('[data-l10n-id="pad.importExport.exportpdf"]');
            await page.waitFor(3000);

            // Hiding Closed Captions
            await page.waitFor('[class="button--Z2dosza md--Q7ug4 default--Z19H5du hideBtn--Zyj8Gc"]');
            await page.click('[class="button--Z2dosza md--Q7ug4 default--Z19H5du hideBtn--Zyj8Gc"]');
            await page.waitFor(3000);

        } catch (error) {
            console.log({error});
        }
        page.waitFor(50000);
    });
});
module.exports = closedCaptions;
