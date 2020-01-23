# autotest014

## About

This script is about Time for a message to appear testing.
This script gets:
    - duration time that Puppeteer01 (`bot.js`) take to send a message until it appears in chat box.

## Details

This script runs 1 puppeteer instance and gets from it time for a message to appear.

This script generates execution folder with the name `Date_ExecutionNum` (example: `data/01-01-2019_1`) inside autotest013 folder.

## Parsing the results

`parser.js` is used to parse the `receiveMsgDuration.json` into a TSV files `receiveMsgDuration.tsv`.

## The Use Case

- *TIMELIMIT_MINUTES* => TimeLimit to run the whole test in minutes (_Number_)
- *URL* => The BBB dev server link.

## Running

To run, execute `./autotest014/run.sh -u *URL* -d *TIMELIMIT_MINUTES*

or also running: 

```
cd autotest014
./run.sh -u *URL*-d *TIMELIMIT_MINUTES*
```

~~~bash
example: 

./autotest014/run.sh -u https://test.bigbluebutton.org -d 1
~~~

The default script will launch the clients it needs on the server you describe in the URL.