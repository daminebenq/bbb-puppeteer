const fs = require('fs');
const readline = require('readline');
var path = require('path'); 
const moment = require('moment');
const data = {};
const basePath = process.argv[2]
var share = path.join(__dirname,`./${basePath}/share.json`)
var watch = path.join(__dirname,`./${basePath}/watch.json`)
var probe = path.join(__dirname,`./${basePath}/probe.json`)
var shareTSV = path.join(__dirname,`./${basePath}/shareTSV.tsv`)
var watchTSV = path.join(__dirname,`./${basePath}/watchTSV.tsv`)
var probeTSV = path.join(__dirname,`./${basePath}/probeTSV.tsv`)

const shareMetrics = readline.createInterface({
    input: fs.createReadStream(share),
});
const watchMetrics = readline.createInterface({
    input: fs.createReadStream(watch),
});
const probeMetrics = readline.createInterface({
    input: fs.createReadStream(probe),
});

fs.writeFileSync(shareTSV, 'secondsToInitiallyLoadMessages\n','utf-8')
fs.writeFileSync(watchTSV, 'secondsToInitiallyLoadMessages\n','utf-8')
fs.writeFileSync(probeTSV, 'dateObj\tdomDurationObj\ttotalMsgsMiniMongoObj\ttotalMsgsObj\tNodes\tJSHeapUsedSize\n','utf-8')

shareMetrics.on('line', (line)=>{
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

watchMetrics.on('line', (line)=>{
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

probeMetrics.on('line', (line)=>{
    try {
        const {loadTime, metricObj:{Nodes, JSHeapUsedSize}} = JSON.parse(line)


        let formattedLine = `${loadTime.toFixed(3).toString().replace(".", ",")}\t${Nodes}\t${JSHeapUsedSize}`;
        fs.appendFileSync(msgsTSV, formattedLine+'\n', 'utf-8')
    }
    catch(error){
        const time = new Date()
        console.log({error}, ' at => ',time)
    }
})