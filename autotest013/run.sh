#!/bin/bash
cd "$( dirname "${BASH_SOURCE[0]}" )"

pids=()

while getopts u:b:d:t: option
do
case "${option}"
in
u) URL=${OPTARG};;
b) BOTS=${OPTARG};;
d) TIMELIMIT_MINUTES=${OPTARG};;
t) TEST_CASE=${OPTARG};;
esac
done

case $TEST_CASE in
1) TESTCASE="1";;#"Share webcam";;
2) TESTCASE="2";;#"See other viewers webcams";;
3) TESTCASE="3";;#"Share microphone";;
4) TESTCASE="4";;#"Send Public chat messages";;
5) TESTCASE="5";;#"Send Private chat messages";;
6) TESTCASE="6";;#"Edit Shared Notes";;
7) TESTCASE="7";;#"See other viewers in the Users list";;
*) echo "Please select a real Lock Setting Test Case !";;
esac

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

if  [ -z "$TESTCASE" ] ; then
    echo -e "Enter TESTCASE:"
    read TESTCASE;
fi;
if ! [[ "$TESTCASE" =~ ^[1-7]+$ ]] ; then
    echo "No TESTCASE provided";
    exit 1; 
fi;

echo URL: $URL;
echo BOTS: $BOTS;
echo TIMELIMIT_MINUTES: $TIMELIMIT_MINUTES "minute(s)";
if [ "$TESTCASE" -eq "1" ]; then
   echo "TESTCASE: Share webcam";
fi
if [ "$TESTCASE" -eq "2" ]; then
   echo "TESTCASE: See other viewers webcams";
fi
if [ "$TESTCASE" -eq "3" ]; then
   echo "TESTCASE: Share microphone";
fi
if [ "$TESTCASE" -eq "4" ]; then
   echo "TESTCASE: Send Public chat messages";
fi
if [ "$TESTCASE" -eq "5" ]; then
   echo "TESTCASE: Send Private chat messages";
fi
if [ "$TESTCASE" -eq "6" ]; then
   echo "TESTCASE: Edit Shared Notes";
fi
if [ "$TESTCASE" -eq "7" ]; then
   echo "TESTCASE: See other viewers in the Users list";
fi


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
TIMELIMIT_UPPER=$(($TIMELIMIT_MINUTES * 60 * 2))

while [ "$bots" -gt 0 ]; do
    timeout $TIMELIMIT_UPPER node bots.js "$URL" "$basePath" $bots $TIMELIMIT_SECONDS "$TESTCASE" &> $basePath/bots.out &
    pids+=($!)
    bots=$(($bots-1))
done
timeout $TIMELIMIT_UPPER node getLocks.js "$URL" "$basePath" $TIMELIMIT_SECONDS &> $basePath/getLocks.out &
pids+=($!)
timeout $TIMELIMIT_UPPER node enableLock.js "$URL" "$basePath" $TIMELIMIT_SECONDS "$TESTCASE" &> $basePath/enableLock.out &
pids+=($!)

function killprocs()
{
    echo killing ${pids[@]}
    rm -rf $basePath
    kill ${pids[@]}
}

trap killprocs EXIT 

wait "${pids[@]}"
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