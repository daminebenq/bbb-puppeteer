# autotest001

## About

This script is about 2 Puppeteers connecting to a Meeting and checking for the avaibility of each others in the Userslist.

## Details

This script runs 2 puppeteer instances and gets the Metrics and the performance stats.

This script generates execution folder with the name `data/Date_ExecutionNum` (example: `data/01-01-2019_1`) inside autotest001 folder.

This script generates the log files `data/puppeteer01.out` and `data/puppeteer02.out` and the Metrics in `data/metrics1.json` and `data/metrics2.json` file.

## The Use Case

- *URL* => The BBB dev server link.

## Running

To run, execute `./autotest001/run.sh *URL*`

or also running: 

```
cd autotest001

./run.sh *URL*
```

~~~bash
example:

./autotest001/run.sh https://bbb-website.com
~~~

The default script will launch the clients it needs on the server you describe in the URL.