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

    const page = await browser.newPage();

    log(['Starting Time'])
    page.on('console', async msg => console[msg._type](
        ...await Promise.all(msg.args().map(arg => arg.jsonValue()))
    ));
    try {
        await page.waitFor(3000)
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=ViewOnlyRecord&isModerator=false&action=create`, { waitUntil : ['load', 'domcontentloaded']});
        await page.waitFor(3000)
        await page.evaluate(()=>document.querySelector('[aria-describedby^="modalDismissDescription"]').click());
        await page.waitFor(15000);
        await page.waitForSelector('[class="recordingStatusViewOnly--Z9UOXT"]');
        const timerContainer = await page.evaluate(async ()=>{
            let timer = await document.querySelector('[class="presentationTitle--Z1JrxcV"]').innerHTML
            return timer
        })
        if(await timerContainer.length > 0){
            log(['Session Recording visibility check passed !'])
        } else {
            log(['Session Recording visibility check failed !'])
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
puppeteer2()