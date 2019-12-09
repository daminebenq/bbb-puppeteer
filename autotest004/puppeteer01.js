const puppeteer = require('puppeteer-core');
const URL = process.argv[2]
const basePath = process.argv[3]
var path = require('path');   
const metrics = {}

var metricsJSON = path.join(__dirname,`./${basePath}/metrics1.json`)
var fs = require("fs");

async function puppeteer1() {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: '/usr/bin/google-chrome',
        args: [ '--use-fake-ui-for-media-stream',
                '--window-size=1024,768',
                '--unlimited-storage', 
                '--full-memory-crash-report'
        ]
    });
    const page = await browser.newPage();
    try{
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=Puppeteer1&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
        await page.waitFor(3000);
        await page.waitFor('[aria-describedby^="modalDismissDescription"]');
        await page.click('[aria-describedby^="modalDismissDescription"]');
        await page.waitFor(3000);

        // Opening Shared Notes
        await page.waitFor('[class="noteLink--1Xz6Lp"]');
        await page.click('[class="noteLink--1Xz6Lp"]');
        await page.waitFor(6000);

        // writing in Shared Notes
        await page.keyboard.type('This is a shared notes text to export !', {
            delay: 100
        });

        // Selecting all written shared notes
        await page.keyboard.down('Control', {
            delay: 100
        });
        await page.keyboard.press('KeyA', {
            delay: 100
        });
        await page.keyboard.up('Control', {
            delay: 100
        });

        // Formatting Shared Notes in Text Bold
        await page.keyboard.down('Control', {
            delay: 100
        });
        await page.keyboard.press('KeyB', {
            delay: 100
        });
        await page.keyboard.up('Control', {
            delay: 100
        });

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
        process.exit(0);
    }   
    catch(error){
        console.log({error})
        process.exit(1);
    }
    browser.close()
}
puppeteer1();