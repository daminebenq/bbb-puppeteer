const puppeteer = require('puppeteer');
const URL = process.argv[2]
const basePath = process.argv[3]
var path = require('path'); 
var fs = require("fs");
const TIMELIMIT_SECONDS = parseInt(process.argv[4])
const TIMELIMIT_MILLISECONDS = TIMELIMIT_SECONDS * 1000;
const metric = {};
const moment = require('moment');

var metricsJSON = path.join(__dirname,`./${basePath}/probe.json`)
var fs = require("fs");
var log = function () {
    Array.prototype.unshift.call(
        arguments,
        '['+new Date()+']'
    );
    return console.log.apply(console, arguments);
};

async function probe() {
    const browser = await puppeteer.launch({
        headless: false,
	    args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    log(['Starting Time'])
    page.on('console', async msg => console[msg._type](
        ...await Promise.all(msg.args().map(arg => arg.jsonValue()))
    ));
    try{
        for (var i = TIMELIMIT_MILLISECONDS; i >= 0; i--) {
            await page.waitFor(5000)
            await page.goto(`${URL}/demo/demoHTML5.jsp?username=Probe&isModerator=false&action=create`, { waitUntil : ['load', 'domcontentloaded']});
            await page.waitForSelector('[aria-label="Close Join audio modal"]');
            await page.click('[aria-label="Close Join audio modal"]');
            const dateA = new Date()
            let isScreenShare = function() {
                document.querySelectorAll('video[id="screenshareVideo"]');
                return true;
            }

            const check = await page.evaluate(isScreenShare)

            if(check !== true) {
                log([`Exiting with Failure due to isScreenShare (${check}) !`])
                process.exit(1)
            }
            const dateB = new Date()
            var diffDate = dateB.getTime() - dateA.getTime();
            var loadTime = diffDate / 1000;
            const metrics = await page.metrics();
            const performance = await page.evaluate(() => performance.toJSON())
            const date = new Date()
            metric['dateObj'] = moment(date).format('DD/MM/YYYY hh:mm:ss');
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
probe()