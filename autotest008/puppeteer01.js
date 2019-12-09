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

async function puppeteer1() {
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
        page.setDefaultTimeout(120000);
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=Probe&isModerator=false&action=create`);
        await page.waitForSelector('[aria-describedby^="modalDismissDescription"]', {timeout: 0});
        await page.click('[aria-describedby^="modalDismissDescription"]');
        for (var i = TIMELIMIT_MILLISECONDS; i >= 0; i--) {
            // // Show FPS Panel in the browser
            // function(){
            //     var script=document.createElement('script');
            //     script.onload=function(){
            //         var stats=new Stats();
            //         document.body.appendChild(stats.dom);
            //         requestAnimationFrame(function loop(){
            //             stats.update();
            //             requestAnimationFrame(loop)});
            //         };
            //         script.src='//mrdoob.github.io/stats.js/build/stats.min.js';
            //         document.head.appendChild(script);
            //     }
            //   )
            let x = await page.evaluate(()=>{
                var frameCount = 0;
                var fps, fpsInterval, startTime, now, then, elapsed;
                
                startAnimating(60);
                
                function startAnimating(fps) {
                    fpsInterval = 1000 / fps;
                    then = Date.now();
                    startTime = then;
                    animate()
                }
                function animate() {
                    requestAnimationFrame(animate);
                    now = Date.now();
                    elapsed = now - then;
                    
                    then = now - (elapsed % fpsInterval);
                    var sinceStart = now - startTime;
                    var currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
                    console.log(currentFps," FPS")      
                }
            })
            
            const date = new Date()
            const metrics = await page.metrics();
            const performance = await page.evaluate(() => performance.toJSON())
            metric['dateObj'] = moment(date).format('DD/MM/YYYY hh:mm:ss');
            metric['metricsObj'] = metrics;
            metric['performancesObj'] = performance;

            fs.appendFileSync(metricsJSON, JSON.stringify(metric)+'\n', (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
            });
            await page.waitFor(60000)
            log(['End Time'])
            process.exit(0)
        }  
    } 
    catch(error){
        console.log({error})
        process.exit(1);
    }
}
puppeteer1();
