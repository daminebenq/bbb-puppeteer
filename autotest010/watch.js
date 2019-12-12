const puppeteer = require('puppeteer-core');
const URL = process.argv[2]
const TIMELIMIT_SECONDS = parseInt(process.argv[4])
const TIMELIMIT_MILLISECONDS = TIMELIMIT_SECONDS * 1000;

var log = function () {
    Array.prototype.unshift.call(
        arguments,
        '['+new Date()+']'
    );
    return console.log.apply(console, arguments);
};
async function watch() {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: '/usr/bin/google-chrome',
	    args: ['--no-sandbox']
    });
    // const browser = await puppeteer.connect({
    //    browserWSEndpoint: `ws://209.133.209.137:3000/?token=joao`
    // });
    const page = await browser.newPage();

    log(['Starting Time'])
    page.on('console', async msg => console[msg._type](
        ...await Promise.all(msg.args().map(arg => arg.jsonValue()))
    ));
    try {
        await page.waitFor(3000)
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=WatchExternalSharedVideo&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
        await page.waitFor(3000)
        await page.evaluate(()=>document.querySelector('[class="icon--2q1XXw icon-bbb-close"]').parentNode.click());
        await page.waitFor(15000)

        const vidExists = await page.waitFor('[class="videoPlayer--1MGUuy"]')
        if(vidExists){
            log(['An External Video is displayed in the Presentation Area !'])
        } else {
            process.exit(1)
        }
        await page.waitFor(10000)
        const VidUrlminiMongo = await page.evaluate( ()=>{
            let collection = require('/imports/api/meetings/index.js');
            let url =  collection.default._collection.findOne({},{sort:{externalVideoUrl:-1}})
            return  url.externalVideoUrl
        })

        const vidUrlDom = await page.evaluate( ()=>{
            let url =  document.querySelector('div[class="videoPlayer--1MGUuy"] > div > iframe').getAttribute('src')
            return url
        });
        if (VidUrlminiMongo.includes('oplhZIiMmLs') && vidUrlDom.includes('oplhZIiMmLs')){
            log(['Video URL verification passed !'])
        } else {
            log([`Video URL Verification failed ! (miniMongoVidUrl=${VidUrlminiMongo}) != (vidUrlDom=${vidUrlDom})`])
            process.exit(1)
        }

        const externalVideoIframe = await page.evaluateHandle(()=>('[div[class="videoPlayer--1MGUuy"] > div > iframe]'));
        const iframe = await externalVideoIframe.contentFrame();

        const videoTimeFirstCheck = await iframe.evaluate(()=>{
            let time = document.querySelector('[class="ytp-time-current"]');
            return time.innerHTML
        })

        await page.waitFor(5000)
        const videoTimeSecondCheck = await iframe.evaluate(()=>{
            let time = document.querySelector('[class="ytp-time-current"]');
            return time.innerHTML
        })

        if(videoTimeFirstCheck==videoTimeSecondCheck){
            log(['Video Timing Check passed !'])
        } else {
            log(['Video Timing Check failed !'])
            process.exit(1)
        }

        await page.waitFor(TIMELIMIT_MILLISECONDS-8000)
        log(['End Time'])
        process.exit(0)
    } catch (error) {
        console.log({error});
        process.exit(1)
    }
}
watch()