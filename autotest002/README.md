# autotest002

## About

This script is about Audio and Microphone testing while connecting to a Meeting conference.

## Details

This script runs 2 puppeteer instances and gets the Metrics and the performance stats.

This script generates execution folder with the name `data/Date_ExecutionNum` (example: `data/01-01-2019_1`) inside autotest002 folder.

This script generates the log files `data/puppeteer01.out` and `data/puppeteer02.out` and the Metrics in `data/metrics1.json` and `data/metrics2.json` file.

## The Use Case

- *URL* => The BBB dev server link.

## Running

To run, execute `./autotest002/run.sh *URL*`

or also running: 

```
cd autotest002

./run.sh *URL*
```

~~~bash
example: 

./autotest002/run.sh https://bbb-website.com
~~~

The default script will launch the clients it needs on the server you describe in the URL.