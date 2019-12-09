#!/bin/bash
cd "$( dirname "${BASH_SOURCE[0]}" )"

pids=()

while getopts u:d: option
do
case "${option}"
in
u) URL=${OPTARG};;
d) TIMELIMIT_MINUTES=${OPTARG};;
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

echo URL: $URL;
echo BOTS: $BOTS;
echo TIMELIMIT_MINUTES: $TIMELIMIT_MINUTES "minute(s)";

echo "Executing..."

date=$(date +"%d-%m-%Y")

n=1
while [[ -d "data/${date}_${n}" ]] ; do
    n=$(($n+1))
done

basePath=data/${date}_${n}

mkdir -p $basePath

bots=$BOTS
TIMELIMIT_SECONDS=$(($TIMELIMIT_MINUTES * 60))
timeout $TIMELIMIT_SECONDS node puppeteer01.js "$URL" "$basePath" $TIMELIMIT_SECONDS &> $basePath/puppeteer01.out &
pids+=($!)


function killprocs()
{
    echo killing ${pids[@]}
    rm -rf $basePath
    kill ${pids[@]}
}

trap killprocs EXIT 

wait "${pids[@]}"

trap - EXIT

if [ $? -eq 0 ]
    then
    echo "The Test was ran successfully !"
    exit 0
    else
    echo "There was an error while running your Test !" >&2
    exit 1
fi