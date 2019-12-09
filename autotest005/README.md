# autotest005

## About

This script is about Drawing and Multi-Users Whiteboard testing, to check if Puppeteer01 and Puppeteer02 are able to draw in the Whiteboard at the same time and it collects the metrics of this process.

Also this script is comparing the shapes of what both of the Viewers see in the Presentation.

## Details

This script runs 2 puppeteer instances and gets the Metrics and the Performance stats.

This script generates execution folder with the name `Date_ExecutionNum` (example: `data/01-01-2019_1`) inside autotest005 folder.

This script generates the log files `puppeteer01.out` and `puppeteer02.out` and the Metrics in `metrics1.json` and `data/metrics2.json` files.

The shapes files will be found in the `data` folder as `shapes01.svg` and `shapes02.svg`.

The content of the `shapes01.svg` and `shapes02.svg` is checked by `contentCheck.js` and it's logging the error log in `contentCheck.out`

## Running

To run, execute `./autotest005/run.sh *URL*`

or also running: 

```
cd autotest005
./run.sh
```

~~~bash
example: 

./autotest005/run.sh https://bbb-website.com
~~~

The default script will launch the clients it needs on the server you describe in the URL.

## Screenshots

The outputs of `puppeteer01.js` and `puppeteer02.js` will be displayed as in the picture below:
![outputs](../images/screenshot.png "outputs")

The metrics will show something like this:
![metrics](../images/metrics.png "metrics")
