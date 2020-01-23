const fs = require('fs');
const readline = require('readline');
var path = require('path'); 
const basePath = process.argv[2];
const name = process.argv[3];
var metricsMsgs = path.join(__dirname,`./${basePath}/receiveMsgDuration${name}.json`)
var msgsTSV = path.join(__dirname,`./${basePath}/receiveMsgDurationParsed${name}.tsv`)

const parsedMsgsMetrics = readline.createInterface({
    input: fs.createReadStream(metricsMsgs),
});

fs.writeFileSync(msgsTSV, 'loopNumber\tmillisecondsToAppear\n','utf-8')
fs.writeFileSync(msgsTSV, 'loopNumber\tmillisecondsToAppear\n','utf-8')

parsedMsgsMetrics.on('line', (line)=>{
    try {
        const {durationObj:{loopNumber ,millisecondsToAppear}} = JSON.parse(line)
        let formattedLine = `${loopNumber}\t${millisecondsToAppear}`;
        fs.appendFileSync(msgsTSV, formattedLine+'\n', 'utf-8')
    }
    catch(error){
        const time = new Date()
        console.log({error}, ' at => ',time)
    }
})