const puppeteer = require('puppeteer');
const URL = process.argv[2]
const basePath = process.argv[3]
var path = require('path');   
const metrics = {}

var metricsJSON = path.join(__dirname,`./${basePath}/metrics1.json`)
var fs = require("fs");

async function puppeteer1() {
    const browser = await puppeteer.launch({
        headless: false,
        args: [ '--use-fake-ui-for-media-stream',
                '--window-size=800,600',
                '--unlimited-storage', 
                '--full-memory-crash-report'
        ]
    });
    const page = await browser.newPage();
    try {
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=Puppeteer1&isModerator=false&action=create`);

        // Joining audio
        await page.waitFor('i[class="icon--2q1XXw icon-bbb-listen"]');
        await page.click('i[class="icon--2q1XXw icon-bbb-listen"]');
        await page.waitFor(9000);

        // Leaving Audio
        await page.waitFor('i[class="icon--2q1XXw icon-bbb-listen"]');
        await page.click('i[class="icon--2q1XXw icon-bbb-listen"]');
        await page.waitFor(9000);
        const metric = await page.metrics();
        const performance = await page.evaluate(() => performance.toJSON())

        metrics['metricObj'] = metric;
        metrics['performanceObj'] = performance;
        
        fs.appendFileSync(metricsJSON, JSON.stringify(metrics, null, 4), 'utf-8', (err) => {
            if (err) {
                console.error(err);
                return;
            };
            console.log("puppeteer1 log file has been created !");
        });
        process.exit(0)
    }
    catch (error) {
        console.log({error});
        process.exit(1)
    }
    browser.close();
    browser.close()
}
puppeteer1()