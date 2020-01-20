# autotest010

## About

This script is about external videos sharing test.
This script checks: 
    - if all users can see the external video shared or not.
    - if all users have the same video playing at almost the same time (every 5 seconds a         forced synchronization).

## Details

This script runs 2 puppeteer instances and gets their Metrics, the Performance stats.

This script generates execution folder with the name `Date_ExecutionNum` (example: `data/01-01-2019_1`) inside autotest010 folder.

## The Use Case

- *TIMELIMIT_MINUTES* => TimeLimit to run the whole test in minutes (_Number_)
- *URL* => The BBB dev server link.

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