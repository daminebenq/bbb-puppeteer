const puppeteer = require('puppeteer');
const URL = process.argv[2]
const basePath = process.argv[3]
const moment = require('moment');
var path = require('path');   
const metric = {} 
var metricsMsgs = path.join(__dirname,`./${basePath}/watcher.json`)
var fs = require("fs");
const TIMELIMIT_SECONDS = parseInt(process.argv[4])
const TIMELIMIT_MILLISECONDS = TIMELIMIT_SECONDS * 1000;

async function watcher() {
    const browser = await puppeteer.launch({
        headless: true,
	    args: ['--no-sandbox']
   });

    const page = await browser.newPage();
    try{
        page.setDefaultTimeout(120000);
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=Watcher&isModerator=false&action=create`);
        await page.waitForSelector('[aria-describedby^="modalDismissDescription"]', {timeout: 0});
        await page.click('[aria-describedby^="modalDismissDescription"]');
        for (var i = TIMELIMIT_MILLISECONDS; i >= 0; i--) {
            let totalMsgs = await page.evaluate(async()=> {
                let x = await document.querySelectorAll('[class="message--Z2n2nXu"]').length
                return x
            });

            const date = new Date()
            const msgs = await page.evaluateHandle(async ()=> {
                let x = require('/imports/api/group-chat-msg/index.js');
                let y = x.GroupChatMsg.find({},{sort:{timestamp:-1}}).count();
                return y
            });

            const totalMsgsMiniMongo = await msgs.jsonValue()
            const metrics = await page.metrics();
            const performance = await page.evaluate(() => performance.toJSON())

            metric['dateObj'] = moment(date).format('DD/MM/YYYY hh:mm:ss');
            metric['totalMsgsDomObj'] = totalMsgs;
            metric['totalMsgsMiniMongoObj'] = totalMsgsMiniMongo;
            metric['metricsObj'] = metrics;
            metric['performancesObj'] = performance;
            
            fs.appendFileSync(metricsMsgs, JSON.stringify(metric)+'\n', (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
            });
            await page.waitFor(60000)
        }
        process.exit(0)
    }   
    catch(error){
        const time = new Date()
        console.log({error}, ' at => ',time)
        process.exit(1);
    }
}
watcher();
