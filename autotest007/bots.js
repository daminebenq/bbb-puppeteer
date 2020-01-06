const puppeteer = require('puppeteer');
const URL = process.argv[2]
const bots = process.argv[4]
const TIMELIMIT_SECONDS = parseInt(process.argv[5])
const TIMELIMIT_MILLISECONDS = TIMELIMIT_SECONDS * 1000;
async function bot() {
    const browser = await puppeteer.launch({
        headless: true,
	    args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    try{
        page.setDefaultTimeout(120000);
        await page.goto(`${URL}/demo/demoHTML5.jsp?username=Bot-${bots}&isModerator=false&action=create`);
        await page.waitForSelector('[aria-describedby^="modalDismissDescription"]', { timeout: 0 });
        await page.click('[aria-describedby^="modalDismissDescription"]');
        await page.waitFor(10000)
        for (var i = TIMELIMIT_MILLISECONDS; i >= 0; i--) {
            await page.keyboard.type(`Message sent !`, {delay: 100});
            await page.keyboard.press('Enter', {delay: 100});
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
