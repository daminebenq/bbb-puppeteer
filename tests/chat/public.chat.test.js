const puppeteer = require('puppeteer');
const URL = process.argv[2]

let sendPublicMessage = {}
sendPublicMessage.init = puppeteer.launch({
    headless: true,
    args: [ '--use-fake-ui-for-media-stream',
            '--window-size=800,600']
    }).then(async browser => {
        browser.newPage().then(async page => {
        try{     
            await page.goto(`${URL}/demo/demoHTML5.jsp?username=Messenger1&isModerator=false&action=create`);
            
            await page.waitFor('[aria-describedby^="modalDismissDescription"]');
            await page.click('[aria-describedby^="modalDismissDescription"]');
            await page.waitFor(3000);

            for(i=1;i<=30000;i++){
                // Writing Public Chat Message
                await page.keyboard.type( "message "+i+" sent !", {
                    delay: 1
                });

                // Sending Message to Public Chat
                await page.keyboard.press('Enter', {
                    delay: 1
                });
                await page.waitFor(1000);
            }
                    
            await page.waitFor(35000)
            process.exit[0]
        }
        catch (error) {
            console.log({error})
            process.exit[1]
        }
        browser.close();
    });
});
module.exports = sendPublicMessage;