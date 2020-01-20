# autotest012

## About

This script is about Closed Captions Testing.
This script Checks:
    - if Puppeteer1 is able to write and use Closed Captions dictation.
    - if Puppeteer2 is able to see the Closed Captions

## Details

This script runs 2 puppeteer instances and gets their Metrics, the Performance stats.

This script generates execution folder with the name `Date_ExecutionNum` (example: `data/01-01-2019_1`) inside autotest012 folder.

## The Use Case

- *TIMELIMIT_MINUTES* => TimeLimit to run the whole test in minutes (_Number_)
- *URL* => The BBB dev server link.

## Running

To run, execute `./autotest012/run.sh -u *URL* -d *TIMELIMIT_MINUTES*`

or also running: 

```
cd autotest012

./run.sh -u *URL* -d *TIMELIMIT_MINUTES*
```

~~~bash
example: 

./autotest012/run.sh -u https://bbb-website.com -d TIMELIMIT_MINUTES
~~~

The default script will launch the clients it needs on the server you describe in the URL.