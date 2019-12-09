const fs = require('fs');
const readline = require('readline');
var path = require('path'); 
const moment = require('moment');
const data = {};
const basePath = process.argv[2]
var metricsMsgs = path.join(__dirname,`./${basePath}/metricsMsgs.json`)
var metricsProber = path.join(__dirname,`./${basePath}/metricsProber.json`)
var proberTSV = path.join(__dirname,`./${basePath}/proberTSV.tsv`)
var msgsTSV = path.join(__dirname,`./${basePath}/msgsTSV.tsv`)

const parsedMsgsMetrics = readline.createInterface({
    input: fs.createReadStream(metricsMsgs),
});
const parsedProberMetrics = readline.createInterface({
    input: fs.createReadStream(metricsProber),
});

fs.writeFileSync(proberTSV, 'secondsToInitiallyLoadMessages\n','utf-8')
fs.writeFileSync(msgsTSV, 'dateObj\tdomDurationObj\ttotalMsgsMiniMongoObj\ttotalMsgsObj\tNodes\tJSHeapUsedSize\n','utf-8')

parsedProberMetrics.on('line', (line)=>{
    try {
        const {domDurationObj} = JSON.parse(line)
        let formattedLine = `${domDurationObj.toFixed(3).toString().replace(".", ",")}\t`;
        fs.appendFileSync(proberTSV, formattedLine+'\n', 'utf-8')
    }
    catch(error){
        const time = new Date()
        console.log({error}, ' at => ',time)
    }
})

parsedMsgsMetrics.on('line', (line)=>{
    try {
        const {dateObj,domDurationObj,totalMsgsMiniMongoObj,totalMsgsObj, metricObj:{Nodes, JSHeapUsedSize}} = JSON.parse(line)
        let formattedDate = new Date(dateObj);
        const intervalBox = Math.floor(formattedDate.getSeconds() / 5)*5;
        formattedDate.setSeconds(intervalBox);
        formattedDate = moment(formattedDate).format('DD/MM/YYYY hh:mm:ss');
        if (!data[formattedDate]) {
        data[formattedDate] = {};
        }

        let formattedLine = `${dateObj}\t${domDurationObj.toFixed(3).toString().replace(".", ",")}\t${totalMsgsMiniMongoObj}\t${totalMsgsObj}\t${Nodes}\t${JSHeapUsedSize}`;
        fs.appendFileSync(msgsTSV, formattedLine+'\n', 'utf-8')
    }
    catch(error){
        const time = new Date()
        console.log({error}, ' at => ',time)
    }
})