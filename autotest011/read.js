const puppeteer = require('puppeteer-core');
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
async function read() {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: '/usr/bin/google-chrome',
	    args: ['--no-sandbox']
    });
    // const browser = await puppeteer.connect({
    //    browserWSEndpoint: `ws://209.133.209.137:3000/?token=joao`
    // });
    const page = await browser.newPage();

    log(['Starting Time'])
    page.on('console', async msg => console[msg._type](
        ...await Promise.all(msg.args().map(arg => arg.jsonValue()))
    ));
    try {
        await page.waitFor(3000)
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=ReadClosedCaptions&isModerator=false&action=create`, { waitUntil : ['load', 'domcontentloaded']});
        await page.waitFor(3000)
        await page.evaluate(()=>document.querySelector('[class="icon--2q1XXw icon-bbb-close"]').parentNode.click());
        await page.waitFor(10000)
        const closedCaptionsButton = await page.evaluate(async ()=>{
            let button = await document.querySelector('[aria-label="Start viewing closed captions"]')
            return button
        })
        await page.waitForSelector('[aria-label="Start viewing closed captions"]')
        if(closedCaptionsButton){
            log(['Closed Captions button is visible !'])
        } else {
            log(['Closed Captions button isn\'t visible !'])
            process.exit(1)
        }
        await closedCaptionsButton.click()
        await page.waitForSelector('[class="captionsWrapper--17itqY"]');
        const closedCaptionsArea = await page.evaluate(async()=>{
            let getClosedCaptions = document.querySelector('div[aria-live="polite"]')
            return getClosedCaptions.innerHTML
        })
        if(closedCaptionsArea.length > 0){
            log(['Closed Captions check passed !'])
        } else {
            log(['Closed Captions check failed !'])
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
read()