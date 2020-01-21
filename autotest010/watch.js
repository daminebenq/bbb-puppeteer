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
async function watch() {
    const browser = await puppeteer.launch({
        headless: false,
	    args: ['--no-sandbox']
    });
    const page = await browser.newPage();

    log(['Starting Time'])
    page.on('console', async msg => console[msg._type](
        ...await Promise.all(msg.args().map(arg => arg.jsonValue()))
    ));
    try {
        await page.waitFor(3000)
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=WatchExternalSharedVideo&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
        await page.waitFor(3000)
        await page.evaluate(()=>document.querySelector('[class="icon--2q1XXw icon-bbb-close"]').parentNode.click());
        await page.waitFor(15000)

        const vidExists = await page.waitFor('[class="videoPlayer--1MGUuy"]')
        if(vidExists){
            log(['An External Video is displayed in the Presentation Area !'])
        } else {
            console.log('There was an ERROR !!')
            process.exit(1)
        }

        await page.waitFor(TIMELIMIT_MILLISECONDS)
        log(['End Time'])
        process.exit(0)
    } catch (error) {
        console.log({error});
        process.exit(1)
    }
}
watch()