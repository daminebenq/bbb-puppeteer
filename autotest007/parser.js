const fs = require('fs');
const readline = require('readline');
var path = require('path'); 
const moment = require('moment');
const basePath = process.argv[2]
const data = {};
var metricsMsgs = path.join(__dirname,`./${basePath}/watcher.json`)
var metricsProber = path.join(__dirname,`./${basePath}/prober.json`)
var msgsTSV = path.join(__dirname,`./${basePath}/watcher.tsv`)
var proberTSV = path.join(__dirname,`./${basePath}/prober.tsv`)

const parsedMsgsMetrics = readline.createInterface({
    input: fs.createReadStream(metricsMsgs),
});
const parsedProberMetrics = readline.createInterface({
    input: fs.createReadStream(metricsProber),
});

fs.writeFileSync(msgsTSV, 'dateObj\ttotalMsgsMiniMongoObj\ttotalMsgsDomObj\tJSHeapUsedSize\ttotalDomNodes\n','utf-8')
fs.writeFileSync(proberTSV, 'dateObj\ttotalMsgsMiniMongoObj\ttotalMsgsDomObj\tJSHeapUsedSize\ttotalDomNodes\n','utf-8')

parsedMsgsMetrics.on('line', (line)=>{
    try {
        const {dateObj,totalMsgsMiniMongoObj,totalMsgsDomObj, metricsObj:{JSHeapUsedSize ,Nodes}} = JSON.parse(line)
        let formattedDate = new Date(dateObj);
        const intervalBox = Math.floor(formattedDate.getSeconds() / 5)*5;
        formattedDate.setSeconds(intervalBox);
        formattedDate = moment(formattedDate).format('DD/MM/YYYY hh:mm:ss');
        if (!data[formattedDate]) {
            data[formattedDate] = {};
        }

        let formattedLine = `${dateObj}\t${totalMsgsMiniMongoObj}\t${totalMsgsDomObj}\t${JSHeapUsedSize}\t${Nodes}`;
        fs.appendFileSync(msgsTSV, formattedLine+'\n', 'utf-8')
    }
    catch(error){
        const time = new Date()
        console.log({error}, ' at => ',time)
    }
})

parsedProberMetrics.on('line', (line)=>{
    try {
        const {dateObj,totalMsgsMiniMongoObj,totalMsgsDomObj, metricsObj:{JSHeapUsedSize ,Nodes}} = JSON.parse(line)
        let formattedDate = new Date(dateObj);
        const intervalBox = Math.floor(formattedDate.getSeconds() / 5)*5;
        formattedDate.setSeconds(intervalBox);
        formattedDate = moment(formattedDate).format('DD/MM/YYYY hh:mm:ss');
        if (!data[formattedDate]) {
            data[formattedDate] = {};
        }

        let formattedLine = `${dateObj}\t${totalMsgsMiniMongoObj}\t${totalMsgsDomObj}\t${JSHeapUsedSize}\t${Nodes}`;
        fs.appendFileSync(proberTSV, formattedLine+'\n', 'utf-8')
    }
    catch(error){
        const time = new Date()
        console.log({error}, ' at => ',time)
    }
})
