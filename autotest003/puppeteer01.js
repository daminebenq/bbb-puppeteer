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
    await page.goto(`${URL}/demo/demoHTML5.jsp?username=Puppeteer1&isModerator=true&action=create`);

    await page.waitFor(3000);

    // Connecting using Microphone
    await page.waitForSelector('[class="jumbo--Z12Rgj4 buttonWrapper--x8uow audioBtn--1H6rCK"]');
    await page.click('[class="jumbo--Z12Rgj4 buttonWrapper--x8uow audioBtn--1H6rCK"]');

    // Echo test
    await page.waitForSelector('[aria-label="Echo is audible"][class="jumbo--Z12Rgj4 buttonWrapper--x8uow button--1JElwW"]');
    await page.click('[aria-label="Echo is audible"][class="jumbo--Z12Rgj4 buttonWrapper--x8uow button--1JElwW"]');
    await page.waitFor(3000);
    try {
        await page.evaluate( () => 
        document.querySelectorAll('[aria-label="Manage users"]')[0]
            .click()
        );

        await page.waitFor(3000);
        await page.waitForSelector('[class="itemIcon--Z207zn1 icon-bbb-rooms"]');
        await page.click('[class="itemIcon--Z207zn1 icon-bbb-rooms"]');
        await page.waitFor(3000);

        await page.waitForSelector('[aria-label="Randomly assign"]');
        await page.click('[aria-label="Randomly assign"]');

        await page.waitForSelector('input[aria-label="Duration (minutes)"]');
        await page.click('input[aria-label="Duration (minutes)"]');

        await page.keyboard.down('Control', {
            delay: 100
        });
        await page.keyboard.press('KeyA', {
            delay: 100
        });
        await page.keyboard.up('Control', {
            delay: 100
        });

        await page.keyboard.press('Backspace', {
            delay: 100
        });
        
        await page.keyboard.type('2', {
            delay: 100
        });
        
        await page.waitFor(3000);
        await page.waitForSelector('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO confirm--1BlGTz"]');
        await page.click('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO confirm--1BlGTz"]');

        await page.waitForSelector('[aria-label="Breakout Rooms"]');
        await page.click('[aria-label="Breakout Rooms"]');
        await page.waitFor(10000);

        await page.waitForSelector('[aria-label="Join audio"]');
        await page.click('[aria-label="Join audio"]');
        await page.waitFor(10000);

        await page.waitForSelector('[aria-label="Return audio"]');
        await page.click('[aria-label="Return audio"]');
        await page.waitFor(20000)

        await page.bringToFront();

        await page.waitForSelector('[class="button--Z2dosza lg--Q7ufB primary--1IbqAO endButton--ozfo8"]');
        await page.waitFor(3000);
        await page.click('[class="button--Z2dosza lg--Q7ufB primary--1IbqAO endButton--ozfo8"]');
        await page.waitFor(3000);
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