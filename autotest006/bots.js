const puppeteer = require('puppeteer');
const URL = process.argv[2]
const bot = parseInt(process.argv[3]);
const TIMELIMIT_SECONDS = process.argv[4];
const TIMELIMIT_MILLISECONDS = TIMELIMIT_SECONDS * 1000;

var log = function () {
    Array.prototype.unshift.call(
        arguments,
        '['+new Date()+']'
    );
    return console.log.apply(console, arguments);
};

log(['Starting Time'])
async function bots() {
    const pupeteerArgs = [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        '--use-file-for-fake-video-capture=video_rgb.y4m',
        '--no-sandbox'
    ];

    // const browser = await puppeteer.connect({
    //    browserWSEndpoint: `ws://209.133.209.137:3000/?token=joao`
    // });

    const browser = await puppeteer.launch({
        headless: true,
        args: pupeteerArgs
    });

    const page = await browser.newPage();
    await page.setViewport({
        width: 1024,
        height: 785
    })
    page.on('console', msg => {
        for (let i = 0; i < msg.args.length; ++i)
          console.log(`${i}: ${msg.args[i]}`);
    });
    try{

        await page.goto(`${URL}/demo/demoHTML5.jsp?username=Streamer_${bot}&isModerator=true&action=create`, { waitUntil : ['load', 'domcontentloaded']});
        await page.waitFor(3000);
        await page.waitForSelector('[aria-describedby^="modalDismissDescription"]');
        await page.click('[aria-describedby^="modalDismissDescription"]');
        await page.waitFor(3000);

        // Enabling webcam
        await page.waitForSelector('[aria-label="Share webcam"]');
        await page.click('[aria-label="Share webcam"]');
        await page.waitFor(3000);
        await page.waitForSelector('[class="videoCol--1FC5pn"]');
        await page.waitFor(3000);
        await page.waitForSelector('[aria-label="Start sharing"]');
        await page.click('[aria-label="Start sharing"]');

        const LOOP_INTERVAL = 1000;
        await page.waitFor(60000)
        const repeats = TIMELIMIT_MILLISECONDS / LOOP_INTERVAL / 2;
        log([`repeats ${repeats}`])
        for (var i = repeats; i >= 0; i--) {
            log([`loop ${i}`])
            let checkCameras = function(i) {
                var videos = document.querySelectorAll("video");
                const lastVideoColor = document.lastVideoColor || {};
                document.lastVideoColor = lastVideoColor;

                for (var v = 0; v<videos.length; v++){
                    console.log(`video ${v}`)
                    var video = videos[v];
                    var canvas = document.createElement("canvas");
                    var context = canvas.getContext('2d');
                    context.drawImage(video, 0,0 , video.videoWidth, video.videoHeight);
                    var pixel = context.getImageData(50, 50, 1, 1).data;
                    const pixelString = new Array(pixel).join(" ").toString();

                    if (lastVideoColor[v]){
                        if (lastVideoColor[v] == pixelString){
                            console.log(`Video N°${v} didn't change the color ! ${lastVideoColor[v]} = ${pixelString}`)
                            return false
                        }
                    }
                    lastVideoColor[v] = pixelString;
                    console.log(`Check_${i} Video_${v}`)
                }
                return true;
            }

            const check = await page.evaluate(checkCameras, i)

            if(check !== true) {
                log([`Exiting with Failure due to checkCameras (${check}) !`])
                process.exit(1)
            }

            const nbWebcams = await page.evaluate(()=>document.querySelectorAll('[class="videoContainer--rssHk"]').length)
            const nbBots = await page.evaluate(()=>document.querySelectorAll('[aria-label^="Streamer_"]').length)
            if(nbWebcams!==nbBots){
                log([`Exiting with Failure due to nbWebcams (${nbWebcams}) is different from nbBots (${nbBots}) !`])
                process.exit(1)
            }
            
            await page.waitFor(LOOP_INTERVAL);
        }
        log(['End Time'])
        process.exit(0);
    }
    catch(error){
        log([{error}])
        process.exit(1);
    }
}
bots();