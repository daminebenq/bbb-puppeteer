# autotest008

## About

This script is about FPS testing.

## Details

This script runs 1 puppeteer instance and gets its Metrics and the Performance stats.

This script generates execution folder with the name `Date_ExecutionNum` (example: `data/01-01-2019_1`) inside autotest008 folder.

This script generates the log file `puppeteer01.out` and the Metrics in `metrics01.json` file.

## Running

To run, execute `./autotest008/run.sh *URL*`

or also running: 

```
cd autotest008
./run.sh
```

~~~bash
example: 

./autotest008/run.sh https://bbb-website.com
~~~

The default script will launch the clients it needs on the server you describe in the URL.

## Outputs

The outputs of `puppeteer01.js` will be displayed in `JSON` files.

## Parsing the results

`parser.js` is used to parse the `metrics01.json` into a TSV file `metrics01.tsv`.

## Graphs

`metrics01.tsv` is used to draw graphs in google spreadsheets: