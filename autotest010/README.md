# autotest010

## About

This script is about external videos sharing test.
This script checks: 
    - if all users can see the external video shared or not.
    - if all users have the same video playing at almost the same time (every 5 seconds a         forced synchronization).

## Details

This script runs 2 puppeteer instances and gets their Metrics, the Performance stats.

This script generates execution folder with the name `Date_ExecutionNum` (example: `data/01-01-2019_1`) inside autotest010 folder.

This script generates the log file `puppeteer01.out` and `puppeteer02.out` and the Metrics in `metrics01.json` and `metrics02.json` file.

## Running

To run, execute `./autotest010/run.sh -u *URL* -d *TIMELIMIT_MINUTES*`

or also running: 

```
cd autotest010

./run.sh -u *URL* -d *TIMELIMIT_MINUTES*
```

~~~bash
example: 

./autotest010/run.sh -u https://bbb-website.com -d TIMELIMIT_MINUTES
~~~

The default script will launch the clients it needs on the server you describe in the URL.

## Outputs

The outputs of `puppeteer01.js` and `puppeteer02.js` are displayed in `JSON` files.

## Parsing the results

`parser.js` is used to parse the `metrics01.json` and `metrics02.json` into TSV files `metrics01.tsv` and `metrics02.tsv`.

## Graphs

`metrics01.tsv` and `metrics02.tsv` are used to draw graphs in google spreadsheets.