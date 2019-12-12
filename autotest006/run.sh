#!/bin/bash
cd "$( dirname "${BASH_SOURCE[0]}" )"

pids=()

while getopts u:b:d: option
do
case "${option}"
in
u) URL=${OPTARG};;
b) BOTS=${OPTARG};;
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

if [ -z "$BOTS" ] ; then
    echo -e "Enter a number of BOTS:"
    read BOTS
fi;
if ! [[ "$BOTS" =~ ^[0-9]+$ ]] ; then
    echo "BOTS is not valid !"
    exit 1; 
fi

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

# Increment $N as long as a directory with that name exists
while [[ -d "data/${date}_${n}" ]] ; do
    n=$(($n+1))
done

basePath=data/${date}_${n}

mkdir -p $basePath

bots=$BOTS
TIMELIMIT_SECONDS=$(($TIMELIMIT_MINUTES * 60))
TIMELIMIT_UPPER=$(($TIMELIMIT_MINUTES * 60 * 5))
while [ "$bots" -gt 0 ]; do
    timeout $TIMELIMIT_UPPER node bots.js "$URL" $bots $TIMELIMIT_SECONDS &> $basePath/bots.out &
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

