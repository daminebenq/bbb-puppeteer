# autotest013

## About

This script is about Lock Settings.
This script Checks:
    - if Puppeteer01 is able to see the Locks Settings or not
    - if Puppeteer02 is able to check if the enabled Lock Setting is affecting the meeting or not
    - if Puppeteer03 is able to enable a Lock Setting or not
    - if the server receives the Locks requested by Moderator/Presenter or not

## Details

This script runs 3 puppeteer instances and gets their Metrics, the Performance stats.

This script generates execution folder with the name `Date_ExecutionNum` (example: `data/01-01-2019_1`) inside autotest013 folder.

## Running

To run, execute `./autotest013/run.sh -u *URL* -b *BOTS* -d *TIMELIMIT_MINUTES*` 

or also running: 

```
cd autotest013
./run.sh -u *URL* -b *BOTS* -d *TIMELIMIT_MINUTES*
```

~~~bash
example: 

./autotest013/run.sh -u https://bbb-website.com -b 3 -d TIMELIMIT_MINUTES
~~~

The default script will launch the clients it needs on the server you describe in the URL.