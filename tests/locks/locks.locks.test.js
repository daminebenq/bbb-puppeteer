// File name: Locks Test
// Test Description:
//      1) Opening Locks Menu
//      2) Stop external Video Sharing
//      3) Enabling first available unlocked Lock option
//      4) Applying selected Lock options
//      5) Unlocking lockedViewer1
//      6) Unlock or Locking a Viewer
//

const puppeteer = require('puppeteer');
const lockedViewer1 = require('./lockedViewer1.locks.test')
const URL = process.argv[2]

let lock = {}
lock.init = puppeteer.launch({
        headless: false,
        args: [ '--use-fake-ui-for-media-stream',
                '--window-size=800,600']
    }).then(async browser => {
        browser.newPage().then(async page => {
        page.setDefaultTimeout(1200000);
        try {
            await page.goto(`${URL}/demo/demoHTML5.jsp?username=LocksTest&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
            await page.waitFor(3000);
            lockedViewer1;
            await page.waitFor('[aria-describedby^="modalDismissDescription"]');
            await page.click('[aria-describedby^="modalDismissDescription"]');
            await page.waitFor(3000);

            // Opening Locks Menu
            await page.evaluate(()=>document.querySelectorAll('[class="icon--2q1XXw icon-bbb-settings"]')[0].click());
            await page.waitFor(3000);
            await page.evaluate(()=> document.querySelector('i[class~="icon-bbb-lock"]').parentNode.click())
            await page.waitFor(3000);

            // Enabling first unlocked Lock option
            await page.waitForSelector('[class="react-toggle-track invertBackground--xefHH"]', {timeout: 0});
            await page.click('[class="react-toggle-track invertBackground--xefHH"]');
            await page.waitFor(3000);

            // Applying selected Lock options
            await page.evaluate(
                ()=>document.querySelectorAll('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO"]')[0]
                .click()
            );

            // Unlocking lockedViewer1
            await page.evaluate(() => document.querySelectorAll('[aria-label^="lockedViewer1"]')[0].click());
            await page.waitFor(5000);

            const element = page.waitForSelector('span[class="userNameSub--1RuGj6"] > span');
            var length = element.length;

            if(length > 0 ){
                // Unlock him if he's Locked
                await page.evaluate(()=>document.querySelector('i[class="itemIcon--Z207zn1 icon-bbb-unlock"]').click());
            } else if (length = null ) {
                // Lock him if he's Unlocked
                await page.evaluate(()=>document.querySelector('i[class="itemIcon--Z207zn1 icon-bbb-lock"]').click());
            }
        } catch (error) {
            console.log({error});
        }
        browser.close();
    });
});
module.exports = lock;
