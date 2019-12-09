# autotest007

## About

This script is about Chat Virtualized List testing.

## Details

This script runs 3 puppeteer instances and gets the Metrics and the Performance stats.

This script generates execution folder with the name `Date_ExecutionNum` (example: `data/01-01-2019_1`) inside autotest007 folder.

This script generates the log files `puppeteer01.out`, `puppeteer02.out` and `puppeteer03.out` and the Metrics in `puppeteer02.json` and `puppeteer03.json` files.

## Running

To run, execute `./autotest007/run.sh -u URL -b BOTS -d TIMELIMIT_MINUTES`

or also running: 

```
cd autotest007
./run.sh
```

~~~bash
example: 

./autotest007/run.sh https://bbb-website.com
~~~

The default script will launch the clients it needs on the server you describe in the URL.

## Outputs

The outputs of `watcher.js` and `prober.js` will be displayed in `JSON` files: 
`watcher.json` and `prober.json`.

## Parsing the results

`parser.js` is used to parse the `watcher.json` and `prober.json` into 2 TSV files `watcher.tsv` and `prober.tsv`.

## Parsing result

Using `parser.js`, it will be executed at the end of the execution of the test.

This will create `watcher.tsv` and `prober.tsv` files, that we will simply import them in a Google SpreadSheet to draw our charts.

## Graphs

`watcher.tsv` and `prober.tsv` are used to draw charts in google spreadsheets:

for example: 

[With Virtualized Lists](https://docs.google.com/spreadsheets/d/1sWmln2iHUBrD5F4WEykgpFqAVwAItOcanB5mKKaaeho/edit?usp=sharing) => [pr-8287](https://github.com/bigbluebutton/bigbluebutton/pull/8287)

