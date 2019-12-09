# autotest001

## About

This script is about 2 Puppeteers connecting to a Meeting and checking for the avaibility of each others in the Userslist.

## Details

This script runs 2 puppeteer instances and gets the Metrics and the performance stats.

This script generates execution folder with the name `data/Date_ExecutionNum` (example: `data/01-01-2019_1`) inside autotest001 folder.

This script generates the log files `data/puppeteer01.out` and `data/puppeteer02.out` and the Metrics in `data/metrics1.json` and `data/metrics2.json` file.

## Running

To run, execute `./autotest001/run.sh *URL*`

or also running: 

```
cd autotest001
./run.sh
```

~~~bash
example:

./autotest001/run.sh https://bbb-website.com
~~~

The default script will launch the clients it needs on the server you describe in the URL.

## Screenshots

The outputs of `puppeteer01.js` and `puppeteer02.js` will be displayed as in the picture below:
![outputs](../images/screenshot.png "outputs")

The metrics will show something like this:
![metrics](../images/metrics.png "metrics")