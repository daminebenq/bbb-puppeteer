// File name: Private Chat
// Test Description:
//      1) Selecting a User
//      2) Open Private Chat with User
//      3) Sending private message
//      4) Close Private Chat
//

const puppeteer = require('puppeteer');
const URL = process.argv[2]
const sendPublicMessage = require('./public.chat.test')

let sendPrivateMessage = {}
sendPrivateMessage.init = puppeteer.launch({
    headless: true,
    args: [ '--use-fake-ui-for-media-stream',
            '--window-size=800,600']
    }).then(async browser => {
        browser.newPage().then(async page => {
        try {
            await page.goto(`${URL}/demo/demoHTML5.jsp?username=Messenger2&isModerator=true&action=create`);
            sendPublicMessage;
            await page.waitFor('[aria-describedby^="modalDismissDescription"]');
            await page.click('[aria-describedby^="modalDismissDescription"]');
            await page.waitFor(3000);
            
            // Selecting a User
            await page.evaluate(() => document.querySelectorAll('[aria-label^="Messenger1"]')[0].click());
            
            // Open Private Chat with User
            await page.evaluate( () => 
            document.querySelector('[data-test="dropdownContent"][aria-expanded="true"]')
            .querySelector('[data-test="activeChat"]')
                .click()
            );

            // Sending private message
            await page.keyboard.type( "message sent to Messenger1", {
                delay: 100
            });

            await page.keyboard.press('Enter', {
                delay: 100
            });
            await page.waitFor(5000);
            
            // Close Private Chat
            await page.evaluate(
                () => document.querySelectorAll('[accesskey="G"]')[0]
                .click());

            await page.waitFor(3500);
            process.exit[0]
        }
        catch (error) {
            console.log({error})
            process.exit[1]
        }
        browser.close();
    });

});
module.exports = sendPrivateMessage;