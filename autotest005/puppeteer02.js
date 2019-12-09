const puppeteer = require('puppeteer');
const URL = process.argv[2]
const basePath = process.argv[3]
var path = require('path');   
const metrics = {}
var fs = require("fs");

var metricsJSON = path.join(__dirname,`./${basePath}/metrics2.json`)

async function puppeteer2() {
    const browser = await puppeteer.launch({
        headless: false,
        args: [ '--use-fake-ui-for-media-stream',
                '--unlimited-storage', 
                '--full-memory-crash-report',
                '--window-size=1024,785'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({
        width: 1024,
        height: 785
    })
    try{
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=Puppeteer2&isModerator=false&action=create`, { waitUntil : ['load', 'domcontentloaded']});
            
        await page.waitFor('[aria-describedby^="modalDismissDescription"]');
        await page.click('[aria-describedby^="modalDismissDescription"]');
        await page.waitFor(3000);

        // Drawing in Violet color
        await page.waitFor('[aria-label="Colors"]');
        await page.click('[aria-label="Colors"]');
        await page.waitFor(3000);
        await page.waitFor('rect[fill="#8800ff"]');
        await page.click('rect[fill="#8800ff"]');
        await page.waitFor(3000);

        const whiteboard = await page.$('div[role=presentation]');                
        await page.waitFor(3000);
        const bounds = await page.evaluate((whiteboard) => {
            const { top, left, bottom, right } = whiteboard.getBoundingClientRect();
            return { top, left, bottom, right };
            }, whiteboard);
        const drawingOffset = 15;
        const steps = 5;

        for (i = 0; i <= 15; i++) {
            await page.mouse.move(bounds.left + (i * drawingOffset), bounds.top + (i * drawingOffset), { steps });
            await page.mouse.down();
            await page.mouse.move(bounds.left + (i * drawingOffset), bounds.bottom - (i * drawingOffset)), { steps };
            await page.mouse.move(bounds.right - (i * drawingOffset), bounds.bottom - (i * drawingOffset), { steps });
            await page.mouse.move(bounds.right - (i * drawingOffset), bounds.top + (i * drawingOffset), { steps });
            await page.mouse.move(bounds.left + (i * drawingOffset), bounds.top + (i * drawingOffset), { steps });
            await page.mouse.up();
        }

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
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=Puppeteer2&isModerator=false&action=create`, { waitUntil : ['load', 'domcontentloaded']});
            
        await page.waitFor('[aria-describedby^="modalDismissDescription"]');
        await page.click('[aria-describedby^="modalDismissDescription"]');

        let svg = await page.evaluate(()=>{
            return document.querySelectorAll('[class="svgContainer--Z1z3wO0"]')[0].innerHTML
        })
        fs.appendFileSync(`../autotest005/${basePath}/shapes02.svg`, svg, 'utf-8');
        
        await page.waitFor(3000)
        process.exit(0);
    }   
    catch(error){
        console.log({error})
        process.exit(1);
    }
}
puppeteer2();