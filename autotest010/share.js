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
async function share() {
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
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=ShareExternalSharedVideo&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
        await page.waitFor(3000)
        await page.evaluate(()=>document.querySelector('[class="icon--2q1XXw icon-bbb-close"]').parentNode.click());
        await page.waitFor(5000)
        // Open and start external Video
        await page.evaluate(()=>document.querySelector('[class="icon--2q1XXw icon-bbb-plus"]').parentNode.click());
        await page.evaluate(()=> document.querySelectorAll('[class="item--yl1AH"]')[9].click());
        await page.focus('input[id="video-modal-input"][aria-describedby="exernal-video-note"]');
        await page.keyboard.type('https://www.youtube.com/watch?v=oplhZIiMmLs');
        await page.evaluate(async ()=>await document.querySelector('[class="button--Z2dosza md--Q7ug4 default--Z19H5du startBtn--ZifpQ9"]').click());
        const vidExists = await page.waitFor('[class="videoPlayer--1MGUuy"]')
        if(vidExists){
            log(['An External Video is displayed in the Presentation Area !'])
        } else {
            process.exit(1)
        }
        await page.waitFor(10000)
        const vidUrlminiMongo = await page.evaluate( ()=>{
            let collection = require('/imports/api/meetings/index.js');
            let url =  collection.default._collection.findOne({},{sort:{externalVideoUrl:-1}})
            return  url.externalVideoUrl
        })
        const vidUrlDom = await page.evaluate( ()=>{
            let url =  document.querySelector('div[class="videoPlayer--1MGUuy"] > div > iframe').getAttribute('src')
            return url
        });
        if (vidUrlminiMongo.includes('oplhZIiMmLs') && vidUrlDom.includes('oplhZIiMmLs')){
            log(['Video URL verification passed !'])
        } else {
            log([`Video URL Verification failed ! (miniMongoVidUrl=${vidUrlminiMongo}) != (vidUrlDom=${vidUrlDom})`])
            process.exit(1)
        }
        await page.waitFor(TIMELIMIT_MILLISECONDS)
        log(['End Time'])
        process.exit(0)
    } catch (error) {
        console.log({error});
        process.exit(1)
    }
}
share()