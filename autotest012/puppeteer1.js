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
async function puppeteer1() {
    const browser = await puppeteer.launch({
        headless: false,
	    args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    page.on('console', async msg => console[msg._type](
        ...await Promise.all(msg.args().map(arg => arg.jsonValue()))
    ));
    log(['Starting Time'])

    try {
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=RecordSessionTest&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
        await page.waitFor(3000);
        await page.evaluate(()=>document.querySelector('[aria-describedby^="modalDismissDescription"]').click());
        await page.waitFor(3000);

        // Start recording the Meeting
        await page.evaluate(()=>document.querySelector('[class="recordingIndicatorIcon--1aoKxW"]').parentNode.click());
        await page.waitFor(5000);
        await page.waitFor('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO button--Z28qGla"]');
        await page.click('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO button--Z28qGla"]');
        await page.waitFor(5000);

        // Pause recording the Meeting
        await page.evaluate(()=>document.querySelector('[class="recordingIndicatorIcon--1aoKxW"]').parentNode.click());
        await page.waitFor(5000);
        await page.waitFor('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO button--Z28qGla"]');
        await page.click('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO button--Z28qGla"]');
        
        // Resume recording the Meeting
        await page.evaluate(()=>document.querySelector('[class="recordingIndicatorIcon--1aoKxW"]').parentNode.click());
        await page.waitFor(5000);
        await page.waitFor('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO button--Z28qGla"]');
        await page.click('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO button--Z28qGla"]');
        
        await page.waitFor(TIMELIMIT_MILLISECONDS)
        log(['End Time'])
        process.exit(0)
    } catch (error) {
        console.log({error});
        process.exit(1)
    }
}
puppeteer1()