# autotest015

## About

This script is connecting to a meeting with multiusers without doing anything.

## Details

This script runs 2 puppeteer instances and gets their Metrics, the Performance stats.

This script generates execution folder with the name `Date_ExecutionNum` (example: `data/01-01-2019_1`) inside autotest015 folder.

## The Use Case

- *TIMELIMIT_MINUTES* => TimeLimit to run the whole test in minutes (_Number_)
- *URL* => The BBB dev server link.

## Running

To run, execute `./autotest015/run.sh -u *URL* -d *TIMELIMIT_MINUTES*`

or also running: 

```
cd autotest015

./run.sh -u *URL* -d *TIMELIMIT_MINUTES*
```

~~~bash
example: 

./autotest015/run.sh -u https://bbb-website.com -d TIMELIMIT_MINUTES
~~~

The default script will launch the clients it needs on the server you describe in the URL.
