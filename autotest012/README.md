# autotest012

## About

This script is about Closed Captions Testing.
This script Checks:
    - if Puppeteer1 is able to write and use Closed Captions dictation.
    - if Puppeteer2 is able to see the Closed Captions

## Details

This script runs 2 puppeteer instances and gets their Metrics, the Performance stats.

This script generates execution folder with the name `Date_ExecutionNum` (example: `data/01-01-2019_1`) inside autotest012 folder.

## IMPORTANT NOTE

To run this test, you should make sure that you have the audio dictation mode enabled in your `settings.yml` file; So let's make sure you have it enabled first.

Go to your BBB server terminal and execute this:
`locate settings.yml`

Once done, proceed editing the settings file:
`nano /root/dev/bigbluebutton/bigbluebutton-html5/private/config/settings.yml`

CTRL+W and try to find: `enableDictation`

Set it to `true` save and exit the file, or if it's already set to `true` just CTRL+X.

Next, restart your HTML5 service: `sudo systemctl restart bbb-html5`


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