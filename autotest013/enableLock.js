const puppeteer = require('puppeteer');
const URL = process.argv[2]
const TIMELIMIT_SECONDS = parseInt(process.argv[4])
const TIMELIMIT_MILLISECONDS = TIMELIMIT_SECONDS * 1000;

var log = function () {
    Array.prototype.unshift.call(
        arguments,
        '['+new Date()+']'
    );
    return console.log.apply(console, arguments);
};
async function puppeteer2() {
    const browser = await puppeteer.launch({
        headless: false,
	    args: ['--no-sandbox']
    });
    // const browser = await puppeteer.connect({
    //    browserWSEndpoint: `ws://209.133.209.137:3000/?token=joao`
    // });
    const page = await browser.newPage();

    page.on('console', async msg => console[msg._type](
        ...await Promise.all(msg.args().map(arg => arg.jsonValue()))
    ));
    log(['Starting Time'])
    
    try {
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=EnableLocks&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
        await page.waitForSelector('[aria-describedby^="modalDismissDescription"]');
        await page.click('[aria-describedby^="modalDismissDescription"]');        
        await page.evaluate(async ()=>await document.querySelectorAll('[class="icon--2q1XXw icon-bbb-settings"]')[0].click());
        await page.waitFor(3000)
        await page.evaluate(async ()=>await document.querySelector('i[class~="icon-bbb-lock"]').parentNode.click())
        await page.waitFor(3000)
        await page.evaluate(async()=>await document.querySelectorAll('[class="react-toggle-screenreader-only"][aria-label="Send Public chat messages"]')[0].parentElement.click());
        await page.waitFor(3000)
        await page.evaluate(
            async ()=>await document.querySelectorAll('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO"]')[0]
            .click()
        );
        await page.waitFor(TIMELIMIT_MILLISECONDS-21000)
        log(['End Time'])
        process.exit(0)
    } catch (error) {
        console.log({error});
        process.exit(1)
    }
}
puppeteer2()