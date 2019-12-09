const puppeteer = require('puppeteer');

(async() => {
    const URL = process.argv[2]
    const browser = await puppeteer.launch({
        headless: true,
        args: [ '--use-fake-ui-for-media-stream',
                '--window-size=800,600',
                '--unlimited-storage', 
                '--full-memory-crash-report'
        ]
    });
  const page = await browser.newPage();
  num = Math.floor(Math.random() * (+8999)) + 1000
  await page.goto( `${URL}`+'/demo/demoHTML5.jsp?username=Bot' + num + '&isModerator=false&action=create' );
  await page.waitFor(3000);
  await page.waitFor('[aria-describedby^="modalDismissDescription"]');
  await page.click('[aria-describedby^="modalDismissDescription"]');
  await page.waitFor(3000);
  try {
    await page.waitForSelector('[aria-label="Join room  (opens new tab)"]');
    await page.click('[aria-label="Join room  (opens new tab)"]');
    // Linger for 30 seconds
    await page.waitFor(30000);

    browser.close();
    process.exit(0)

  } catch (error) {
    console.error({ error }, 'Something happened!');
    browser.close();
    process.exit(1)
  }
})();
