#!/bin/bash
cd "$( dirname "${BASH_SOURCE[0]}" )"

pids=()

while getopts u:d:b:s: option
do
case "${option}"
in
u) URL=${OPTARG};;
b) BOTS=${OPTARG};;
d) TIMELIMIT_MINUTES=${OPTARG};;
s) SHEETID=${OPTARG};;
esac
done

if [ -z "$URL" ] ; then
   echo -e "Enter BBB Base Server URL:"
   read URL
fi;
if [ -z "$URL" ] ; then
    echo "No URL provided";
    exit 1; 
fi;

if  [ -z "$TIMELIMIT_MINUTES" ] ; then
    echo -e "Enter TIMELIMIT_MINUTES (Duration to run the Test in minutes):"
    read TIMELIMIT_MINUTES;
fi;
if ! [[ "$TIMELIMIT_MINUTES" =~ ^[0-9]+$ ]] ; then
    echo "TIMELIMIT_MINUTES is not valid !"
    exit 1; 
fi

if [ -z "$SHEETID" ] ; then
   echo -e "Enter the Google SpreadSheet ID:"
   read URL
fi;
if [ -z "$SHEETID" ] ; then
    echo "No SHEETID provided";
    exit 1; 
fi;

echo URL: $URL;
echo BOTS: $BOTS;
echo TIMELIMIT_MINUTES: $TIMELIMIT_MINUTES "minute(s)";
echo SpreadSheet_Link: "https://docs.google.com/spreadsheets/d/$SHEETID/edit?usp=sharing"

echo "Executing..."

date=$(date +"%d-%m-%Y")

n=1
while [[ -d "data/${date}_${n}" ]] ; do
    n=$(($n+1))
done

basePath=data/${date}_${n}
bots=$BOTS
mkdir -p $basePath

TIMELIMIT_SECONDS=$(($TIMELIMIT_MINUTES * 60))
TIMELIMIT_UPPER=$(($TIMELIMIT_MINUTES * 60 * 2))

while [ "$bots" -gt 0 ]; do
    timeout $TIMELIMIT_UPPER node bot.js "$URL" "$basePath" $TIMELIMIT_SECONDS $bots $SHEETID &> $basePath/bots.out &
    pids+=($!)
    bots=$(($bots-1))
done

function killprocs()
{
    echo killing ${pids[@]}
    rm -rf $basePath
    kill ${pids[@]}
}

trap killprocs EXIT 

wait "${pids[@]}"
node parser.js $basePath $bots &> $basePath/parser.out &
curl -s -d /dev/null https://docs.google.com/spreadsheets/d/$SHEETID/export\?format\=xlsx\&id\=$SHEETID > Test.xls &
exitcode=$?
trap - EXIT

if [ $exitcode -eq 0 ]
    then
    echo "The Test was ran successfully !"
    exit 0
    else
    echo "There was an error while running your Test !"
    exit 1
fi