# autotest008

## About

This script is about FPS in a BBB web Session.

## Details

This script runs 1 puppeteer instance and gets its Metrics and the Performance stats.

This script generates execution folder with the name `Date_ExecutionNum` (example: `data/01-01-2019_1`) inside autotest008 folder.

This script generates the log file `puppeteer01.out` and the Metrics in `metrics01.json` file.

## The Use Case

- *TIMELIMIT_MINUTES* => TimeLimit to run the whole test in minutes (_Number_)
- *URL* => The BBB dev server link.

## Running

To run, execute `./autotest008/run.sh *URL* -d *TIMELIMIT_MINUTES*`

or also running: 

```
cd autotest008

./run.sh *URL* -d *TIMELIMIT_MINUTES*
```

~~~bash
example: 

./autotest008/run.sh https://bbb-website.com -d TIMELIMIT_MINUTES
~~~

The default script will launch the clients it needs on the server you describe in the URL.

## Outputs

The outputs of `puppeteer01.js` is displayed in `JSON` files.

## Parsing the results

`parser.js` is used to parse the `metrics01.json` into a TSV file `metrics01.tsv`.

## Graphs

`metrics01.tsv` is used to draw graphs in google spreadsheets.