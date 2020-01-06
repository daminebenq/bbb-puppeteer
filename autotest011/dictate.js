const puppeteer = require('puppeteer');
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
async function dictate() {
    const browser = await puppeteer.launch({
        headless: true,
	    args: [
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
            '--use-file-for-fake-audio-capture=read.wav',
            '--no-sandbox'
        ]
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
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=DictateClosedCaptions&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
        await page.waitFor(3000);
        await page.evaluate(()=>document.querySelector('[aria-label="Microphone"]').click());
        await page.waitForSelector('[class="icon--2q1XXw icon-bbb-thumbs_up"]');
        await page.click('[class="icon--2q1XXw icon-bbb-thumbs_up"]')
        await page.waitFor(3000);

        // Opening Closed Captions Menu
        await page.evaluate(()=> document.querySelector('i[class="itemIcon--Z207zn1 icon-bbb-closed_caption"]').parentNode.click());
        await page.evaluate(()=>document.querySelectorAll('[class="icon--2q1XXw icon-bbb-settings"]')[0].click());

        await page.waitForSelector('[id="captionsLangSelector"]');
        await page.waitForSelector('[aria-label="Start writing captions"]')
        await page.click('[aria-label="Start writing captions"]');

        await page.waitFor(10000)
        await page.keyboard.type(`This is a test Text to show in Closed Captions !`, {delay: 100})
        // Starting Closed Captions
        await page.waitForSelector('[aria-label="Start dictation"]');
        await page.click('[aria-label="Start dictation"]');
        await page.waitFor(10000)
        
        await page.waitForSelector('[class="button--Z2dosza md--Q7ug4 default--Z19H5du startBtn--21jNH1"]');
        await page.click('[class="button--Z2dosza md--Q7ug4 default--Z19H5du startBtn--21jNH1"]');
        await page.waitFor(10000);

        // Writing in Closed Captions
        await page.keyboard.type('This is a Closed Caption Text !',{delay: 100})

        await page.waitFor(TIMELIMIT_MILLISECONDS)
        process.exit(0)
    } catch (error) {
        console.log({error});
        process.exit(1)
    }
}
dictate()