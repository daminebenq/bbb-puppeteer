const puppeteer = require('puppeteer');
const URL = process.argv[2]
const basePath = process.argv[3]
var path = require('path');   
const metrics = {}

var metricsJSON = path.join(__dirname,`./${basePath}/metrics2.json`)
var fs = require("fs");

async function puppeteer2() {
    const browser = await puppeteer.launch({
        headless: false,
        args: [ '--use-fake-ui-for-media-stream',
                '--window-size=1024,768',
                '--unlimited-storage', 
                '--full-memory-crash-report'
        ]
    });
    const page = await browser.newPage();
    try {
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=Puppeteer2&isModerator=true&action=create`);
        await page.waitFor(3000);
        await page.waitForSelector('[aria-describedby^="modalDismissDescription"]');
        await page.click('[aria-describedby^="modalDismissDescription"]');
        await page.waitFor(3000);

        // joining available breakoutrooms sessions
        await page.waitForSelector('[aria-label="Breakout Rooms"]');
        await page.click('[aria-label="Breakout Rooms"]')
        await page.waitForSelector('[aria-label="Join room 1"]');
        await page.click('[aria-label="Join room 1"]');

        await page.waitFor(12000);

        const metric = await page.metrics();
        const performance = await page.evaluate(() => performance.toJSON())

        metrics['metricObj'] = metric;
        metrics['performanceObj'] = performance;
        
        fs.appendFileSync(metricsJSON, JSON.stringify(metrics, null, 4), 'utf-8', (err) => {
            if (err) {
                console.error(err);
                return;
            };
            console.log("puppeteer2 log file has been created !");
        });
        process.exit(0);
    }
    catch (error) {
        console.log({error})
        process.exit(1)
    }
    browser.close()
}
puppeteer2()