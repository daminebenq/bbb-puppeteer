// File name: Promote Viewer to Presenter
// Test Description:
//      1) Promoting a Viewer to Presenter
//

const puppeteer = require('puppeteer');
const URL = process.argv[2]
const multiViewers = require('./multiViewers.bots.test');

let promoteToPresenter = {}
promoteToPresenter.init = puppeteer.launch({
    headless: false,
    args: [ '--use-fake-ui-for-media-stream',
            '--window-size=800,600']
    }).then(async browser => {
    browser.newPage().then(async page => {
    // promoting Messenger2 to Presenter
    try {
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=Moderator1&isModerator=true&action=create`);
        multiViewers;
        await page.waitFor(3000);
        await page.waitFor('[aria-describedby^="modalDismissDescription"]');
        await page.click('[aria-describedby^="modalDismissDescription"]');
        await page.waitFor(3000);
        
        await page.evaluate(() => document.querySelectorAll('[aria-label^="Bot-2"]')[0].click());

        await page.evaluate( () =>
        document.querySelector('[data-test="dropdownContent"][aria-expanded="true"]')
        .querySelector('[data-test="setPresenter"]')
            .click()
        );
        process.exit[0]
    }
    catch (error) {
        console.log({error})
        process.exit[1]
    }
    browser.close();
});
})
module.exports = promoteToPresenter;    