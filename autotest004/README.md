# autotest004

## About

This script is about Shared Notes testing, to check if Puppeteer01 is able to add, edit, format and export as PDF Shared Notes.

## Details

This script runs 1 puppeteer instance and gets the Metrics and the Performance stats.

This script generates execution folder with the name `Date_ExecutionNum` (example: `data/01-01-2019_1`) inside autotest004 folder.

This script generates the log file `data/puppeteer01.out` and the Metrics in `data/metrics1.json` file.

## Running

To run, execute `./autotest004/run.sh *URL*`

or also running: 

```
cd autotest004
./run.sh
```

~~~bash
example: 

./autotest004/run.sh https://bbb-website.com
~~~

The default script will launch the clients it needs on the server you describe in the URL.

## More informations

The downloaded PDF file will be found in your default download folder.
example: `~/Downloads/`

## Screenshots

The outputs of `puppeteer01.js` will be displayed as in the picture below:
<img align="left" src="../images/screenshot.png">

The metrics will show something like this:
<img align="left" src="../images/metrics.png">
