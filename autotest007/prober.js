const puppeteer = require('puppeteer');
const URL = process.argv[2]
const basePath = process.argv[3]
const TIMELIMIT_SECONDS = parseInt(process.argv[4])
const TIMELIMIT_MILLISECONDS = TIMELIMIT_SECONDS * 1000;

var path = require('path');   
const metric = {}
const moment = require('moment');

var metricsJSON = path.join(__dirname,`./${basePath}/prober.json`)
var fs = require("fs");

async function prober() {
    const browser = await puppeteer.launch({
        headless: true,
	    args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    try{
        page.setDefaultTimeout(120000);
        for (var i = TIMELIMIT_MILLISECONDS; i >= 0; i--) {

            await page.goto(`${URL}/demo/demoHTML5.jsp?username=Prober&isModerator=false&action=create`);
            await page.waitForSelector('[aria-describedby^="modalDismissDescription"]', {timeout: 0});
            await page.click('[aria-describedby^="modalDismissDescription"]');
            
            const performance = await page.evaluate(() => performance.toJSON())
            const msgs = await page.evaluateHandle(async ()=> {
                let x = require('/imports/api/group-chat-msg/index.js');
                let y = x.GroupChatMsg.find({},{sort:{timestamp:-1}}).count();
                return y
            }); 

            let totalMsgs = await page.evaluate(async()=> {
                let n = await document.querySelectorAll('[class="message--Z2n2nXu"]').length
                return n
            }); 
            
            const miniMongoMsgsNb = await msgs.jsonValue()
            const date = new Date()
            const metrics = await page.metrics();

            metric['dateObj'] = moment(date).format('DD/MM/YYYY hh:mm:ss');
            metric['totalMsgsDomObj'] = totalMsgs;
            metric['totalMsgsMiniMongoObj'] = miniMongoMsgsNb;
            metric['metricsObj'] = metrics;
            metric['performancesObj'] = performance;
            
            fs.appendFileSync(metricsJSON, JSON.stringify(metric)+'\n', (err) => {
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
        console.log({error})
        process.exit(1);
    }
}
prober();
