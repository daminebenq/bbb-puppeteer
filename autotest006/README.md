# autotest006

## About

This script is about Webcams testing and full screen Webcam.

## Requirement

This Test requires a very specific chrome video file,
[video_rgb.y4m](https://docs.google.com/uc?export=download&id=1I1ehFgKUraSCqCbB4VpxG5KkxQ1o7dKZ)

After downloading the file copy and paste it in `autotest006/` folder.
The name of the file should be `video_rgb.y4m`.

*NOTE:* This file will be used also in autotest013, so please Note that you're going to copy and paste it in `autotest013/` folder also.

## Details

This script runs 2 puppeteer instances and gets the Metrics and the Performance stats.

This script generates execution folder with the name `Date_ExecutionNum` (example: `data/01-01-2019_1`) inside autotest006 folder.

This script generates the log files `puppeteer01.out` and `puppeteer02.out` and the Metrics in `metrics1.json` and `metrics2.json` files.

## The Use Case

- *BOTS* => The number of Bots to use in the Test (_Number_)
- *TIMELIMIT_MINUTES* => TimeLimit to run the whole test in minutes (_Number_)
- *URL* => The BBB dev server link.

## Running

To run, execute `./autotest006/run.sh -u *URL* -b *BOTS* -d *TIMELIMIT_MINUTES*`

or also running: 

```
cd autotest006

./run.sh -u *URL* -b *BOTS* -d *TIMELIMIT_MINUTES*
```

~~~bash
example: 

./autotest006/run.sh -u https://bbb-website.com -b BOTS -d TIMELIMIT_MINUTES
~~~

The default script will launch the clients it needs on the server you describe in the URL.
