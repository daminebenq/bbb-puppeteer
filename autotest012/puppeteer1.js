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
async function dictate() {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: '/usr/bin/google-chrome',
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
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=RecordSessionTest&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
        await page.waitFor(3000);
        await page.evaluate(()=>document.querySelector('[aria-describedby^="modalDismissDescription"]').click());
        await page.waitFor(3000);

        // Start recording the Meeting
        await page.waitFor('[class="recordingControlOFF--26cqft"][role="button"]');
        await page.click('[class="recordingControlOFF--26cqft"][role="button"]');
        await page.waitFor(5000);
        await page.waitFor('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO button--Z28qGla"]');
        await page.click('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO button--Z28qGla"]');
        await page.waitFor(5000);

        // Pause recording the Meeting
        await page.waitFor('[class="recordingControlON--ZTT4Mq"][role="button"]');
        await page.click('[class="recordingControlON--ZTT4Mq"][role="button"]');
        await page.waitFor(5000);
        await page.waitFor('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO button--Z28qGla"]');
        await page.click('[class="button--Z2dosza md--Q7ug4 primary--1IbqAO button--Z28qGla"]');
        process.exit(0)
    } catch (error) {
        console.log({error});
        process.exit(1)
    }
}
dictate()