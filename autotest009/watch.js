const puppeteer = require('puppeteer');
const URL = process.argv[2]
const basePath = process.argv[3]
var path = require('path'); 
var fs = require("fs");
const TIMELIMIT_SECONDS = parseInt(process.argv[4])
const TIMELIMIT_MILLISECONDS = TIMELIMIT_SECONDS * 1000;
const metric = {};

var metricsJSON = path.join(__dirname,`./${basePath}/watch.json`)
var fs = require("fs");
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
    try{
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=Watch&isModerator=false&action=create`, { waitUntil : ['load', 'domcontentloaded']});
        await page.waitFor(3000);
        await page.click('[aria-label="Close Join audio modal"]');

        for (var i = TIMELIMIT_MILLISECONDS; i >= 0; i--) {
            await page.waitFor(5000)
            let isScreenShare = function() {
                document.querySelectorAll('video[id="screenshareVideo"]');
                return true;
            }

            const check = await page.evaluate(isScreenShare)

            if(check !== true) {
                log([`Exiting with Failure due to isScreenShare (${check}) !`])
                process.exit(1)
            }
            const metrics = await page.metrics();
            const performance = await page.evaluate(() => performance.toJSON())
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
watch()