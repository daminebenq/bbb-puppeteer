const puppeteer = require('puppeteer');
const URL = process.argv[2]
const basePath = process.argv[3]
var path = require('path'); 
var fs = require("fs");
const TIMELIMIT_SECONDS = parseInt(process.argv[4])
const TIMELIMIT_MILLISECONDS = TIMELIMIT_SECONDS * 1000;
const metric = {};
const moment = require('moment');

var metricsJSON = path.join(__dirname,`./${basePath}/metrics.json`)
var fs = require("fs");
var log = function () {
    Array.prototype.unshift.call(
        arguments,
        '['+new Date()+']'
    );
    return console.log.apply(console, arguments);
};

async function puppeteer03() {
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
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=screenShareTest&isModerator=false&action=create`, { waitUntil : ['load', 'domcontentloaded']});
        await page.waitFor(3000);
        await page.click('[aria-label="Close Join audio modal"]');

        // Starting Screen Sharing
        await page.evaluate(()=>document.querySelectorAll('[aria-label="Share your screen"]')[0].click());
        page.on('dialog', async dialog => {
            await dialog.accept();
        });
        await page.waitFor(10000);

        // Make Screen Share Full Screen
        await page.waitForSelector('[aria-label="Make Screen share fullscreen"]');
        await page.click('[aria-label="Make Screen share fullscreen"]');
        await page.waitFor(5000);

        // Leave Screen Share Full Screen
        await page.keyboard.press('Escape');
        await page.waitFor(5000);

        process.exit(0)
    } catch (error) {
        console.log({error});
        process.exit(1)
    }
}
puppeteer03()