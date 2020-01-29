const puppeteer = require('puppeteer');
const URL = process.argv[2]
const basePath = process.argv[3]
const name = process.argv[5]
const SHEETID = process.argv[6]
const TIMELIMIT_SECONDS = parseInt(process.argv[4])
const TIMELIMIT_MILLISECONDS = TIMELIMIT_SECONDS * 1000;
var path = require('path'); 
var fs = require("fs");
const metric = {};
var metricsJSON = path.join(__dirname,`./${basePath}/receiveMsgDuration${name}.json`)

async function bot() {
    const browser = await puppeteer.launch({
        headless: true,
	    args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    var log = function () {
        Array.prototype.unshift.call(
            arguments,
            '['+new Date()+']'
        );
        return console.log.apply(console, arguments);
    };
    page.on('console', async msg => console[msg._type](
        ...await Promise.all(msg.args().map(arg => arg.jsonValue()))
    ));
    log(['Starting Time'])
    try{
        page.setDefaultTimeout(120000);
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=${name}&meetingname=puppeteer&isModerator=false&action=create`);
        await page.waitForSelector('[aria-describedby^="modalDismissDescription"]', { timeout: 0 });
        await page.click('[aria-describedby^="modalDismissDescription"]');
        await page.waitFor(10000)
        var loop = 1;
        for (var i = 1; i <= TIMELIMIT_MILLISECONDS-10000; i++) {
            const textSent = 'B' + name + 'M' + i;
            await page.keyboard.type(textSent);
            await page.keyboard.press('Enter');

            var send = Date.now()

            while(true) {
                const lastMessageArrived = await page.evaluate(async(textSent)=>{
                    return [...document.querySelectorAll('[class="message--Z2n2nXu"]')].filter (e => e.innerText == textSent).length == 1;
                });

                if(lastMessageArrived===false)
                 break;
            }
            var receive = Date.now()
            await page.waitFor(5)
            var diffTime = receive - send;
            const duration = {
                loopNumber: loop++,
                millisecondsToAppear: diffTime
            }
            console.log(JSON.stringify(duration))
            const metricObject = metric['durationObj'] = duration;
            const googleSpreadSheet = require('../utils/spreadsheet')
            googleSpreadSheet(name,SHEETID,duration);
            await page.waitFor(1000)
            fs.appendFileSync(metricsJSON, JSON.stringify(metricObject)+'\n');
        }
        process.exit(0)
    }
    catch(error){
        const time = new Date()
        console.log({error}, ' at => ',time)
        process.exit(1);
    }
}
bot();
