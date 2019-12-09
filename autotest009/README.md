# autotest009

## About

This script is about Checking if Puppeteer1 can start screenshare, if Puppeteer2 can see Puppeteer1's screenshare and if Puppeteer3 can load the screenshare everytime he connects to the meeting and collects page metrics, loadTime and durationTime.

## Details

This script runs 3 puppeteer instances and gets their Metrics, the Performance stats, screenshare durationTime & screenshare loadTime.

This script generates execution folder with the name `Date_ExecutionNum` (example: `data/01-01-2019_1`) inside autotest009 folder.

This script generates the log file `puppeteer01.out`, `puppeteer02.out` and `puppeteer03.out` and the Metrics in `metrics01.json`, `metrics02.json`and `metrics03.json` file.

## Running

To run, execute `./autotest009/run.sh *URL*`

or also running: 

```
cd autotest009
./run.sh
```

~~~bash
example: 

./autotest009/run.sh https://bbb-website.com
~~~

The default script will launch the clients it needs on the server you describe in the URL.

## Outputs

The outputs of `puppeteer01.js`, `puppeteer02.js` and `puppeteer03.js` are displayed in `JSON` files.

## Parsing the results

`parser.js` is used to parse the `metrics01.json`, `metrics02.json` and `metrics03.json` into TSV files `metrics01.tsv`, `metrics02.tsv` and `metrics03.tsv`.

## Graphs

`metrics01.tsv`, `metrics02.tsv` and `metrics03.tsv` are used to draw graphs in google spreadsheets.