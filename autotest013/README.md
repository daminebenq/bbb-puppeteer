# autotest013

## About

This script is about Lock Settings.
This script Checks:
    - if Puppeteer01 (`bots.js`) is affected by the Lock or not
    - if Puppeteer02 (`getLocks.js`) is able to see and get the Locks Settings from miniMongo
    - if Puppeteer03 (`enableLock.js`) is able to enable a Lock Setting or not
    - if the server receives the Locks requested by Moderator/Presenter or not

## Details

This script runs 3 puppeteer instances and gets their Metrics, the Performance stats.

This script generates execution folder with the name `Date_ExecutionNum` (example: `data/01-01-2019_1`) inside autotest013 folder.

## The Use Case

- *BOTS* => The number of Bots to use in the Test (_Number_)
- *TIMELIMIT_MINUTES* => TimeLimit to run the whole test in minutes (_Number_)
- *TEST_CASE* =>
    - *1* => *Share webcam* Test Case ([REQUIRED STEP](#requirement))
    - *2* => *See other viewers webcams* Test Case ([REQUIRED STEP](#requirement)) (_requires atleast 2 Bots: *-b 2*_)
    - *3* => *Share microphone* Test Case
    - *4* => *Send Public chat messages* Test Case
    - *5* => *Send Private chat messages* Test Case (_requires atleast 2 Bots_)
    - *6* => *Edit Shared Notes* Test Case
    - *7* => *See other viewers in the Users list* Test Case (_requires atleast 2 Bots_)
- *URL* => The BBB dev server link.

## Requirement

This Test requires a very specific chrome video file,
[video_rgb.y4m](https://docs.google.com/uc?export=download&id=1I1ehFgKUraSCqCbB4VpxG5KkxQ1o7dKZ)

After downloading the file copy and paste it in `autotest013/` folder.
The name of the file should be `video_rgb.y4m`.

This file was used previously in *auotest006* and can be found in `autotest006/` folder. 

## Running

To run, execute `./autotest013/run.sh -u *URL* -b *BOTS* -d *TIMELIMIT_MINUTES* -t *TEST_CASE*` 

or also running: 

```
cd autotest013
./run.sh -u *URL* -b *BOTS* -d *TIMELIMIT_MINUTES* -t *TEST_CASE*
```

~~~bash
example: 

./autotest013/run.sh -u https://test.bigbluebutton.org -b 2 -d 1 -t 2
~~~

The default script will launch the clients it needs on the server you describe in the URL.