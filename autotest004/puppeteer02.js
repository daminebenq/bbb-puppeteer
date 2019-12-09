const puppeteer = require('puppeteer-core');
const URL = process.argv[2]
const basePath = process.argv[3]
var path = require('path');   
const metrics = {}

var metricsJSON = path.join(__dirname,`./${basePath}/metrics2.json`)
var fs = require("fs");

async function puppeteer2() {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 600,
        executablePath: '/usr/bin/google-chrome',
        args: [ '--use-fake-ui-for-media-stream',
                '--window-size=1024,768',
                '--unlimited-storage', 
                '--full-memory-crash-report',
                '--disable-dev-shm-usage'
        ]
    });
    const page = await browser.newPage();
    try{
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=Puppeteer2&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
            
        await page.waitFor('[aria-describedby^="modalDismissDescription"]');
        await page.click('[aria-describedby^="modalDismissDescription"]');
        await page.waitFor(20000);

        // Opening Shared Notes
        await page.waitFor('[class="noteLink--1Xz6Lp"]');
        await page.click('[class="noteLink--1Xz6Lp"]');
        await page.waitFor(10000);
        await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: '/home/imdt/puppeteer/autotest004/data'});
        
        // Exporting Shared Notes
        await page.evaluate (async () =>{
            let iframeDocument = await document.querySelectorAll('iframe')[0].contentWindow.document
                await iframeDocument.querySelectorAll('button[aria-label="Import/Export from/to different file formats"]')[0].click()
                await iframeDocument.querySelector('[aria-label="PDF"]').click()
            }
        );

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
    catch(error){
        console.log({error})
        process.exit(1);
    }
}
puppeteer2();