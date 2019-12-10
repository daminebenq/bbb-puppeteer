const puppeteer = require('puppeteer');
const URL = process.argv[2]
const basePath = process.argv[3]
var path = require('path'); 
var fs = require("fs");
const TIMELIMIT_SECONDS = parseInt(process.argv[4])
const TIMELIMIT_MILLISECONDS = TIMELIMIT_SECONDS * 1000;
const metric = {};

var metricsJSON = path.join(__dirname,`./${basePath}/share.json`)
var fs = require("fs");
var log = function () {
    Array.prototype.unshift.call(
        arguments,
        '['+new Date()+']'
    );
    return console.log.apply(console, arguments);
};
async function share() {
    const browser = await puppeteer.launch({
        headless: false,
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
    await page.waitFor(20000)
    try{
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=Share&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
        await page.waitFor(3000);
        await page.click('[aria-label="Close Join audio modal"]');

        // Starting Screen Sharing
        await page.waitForSelector('[aria-label="Share your screen"]');
        await page.click('[aria-label="Share your screen"]');
        
        const dateA = new Date()
        await page.on('dialog',async dialog => {
            await dialog.accept();
        });
        await page.evaluate(()=>document.querySelector('video[id="screenshareVideo"]'))
        const dateB = new Date()
        var diffDate = dateB.getTime() - dateA.getTime();
        var loadTime = diffDate / 1000;

        for (var i = TIMELIMIT_MILLISECONDS; i >= 0; i--) {
            let isScreenShare = function() {
                document.querySelectorAll('video[id="screenshareVideo"]');
                return true;
            }
            const check = await page.evaluate(isScreenShare)

            if(check !== true) {
                log([`Exiting with Failure due to isScreenShare (${check}) !`])
                process.exit(1)
            }
            await page.waitFor(5000)
            const metrics = await page.metrics();
            const performance = await page.evaluate(() => performance.toJSON())
            metric['loadTime'] = loadTime;
            metric['metricsObj'] = metrics;
            metric['performancesObj'] = performance;
            fs.appendFileSync(metricsJSON, JSON.stringify(metric)+'\n');
        }
        log(['End Time'])
        process.exit(0)
    } catch (error) {
        console.log({error});
        process.exit(1)
    }
}
share()
