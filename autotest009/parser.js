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

fs.writeFileSync(shareTSV, 'dateObj\tloadTime\tNodes\tJSHeapUsedSize\n','utf-8')
fs.writeFileSync(watchTSV, 'dateObj\tNodes\tJSHeapUsedSize\n','utf-8')
fs.writeFileSync(probeTSV, 'dateObj\tloadTime\tNodes\tJSHeapUsedSize\n','utf-8')

shareMetrics.on('line', (line)=>{
    try {
        const {dateObj,loadTime, metricsObj:{Nodes, JSHeapUsedSize}} = JSON.parse(line)
        let formattedLine = `${dateObj}\t${loadTime.toFixed(3).toString().replace(".", ",")}\t${Nodes}\t${JSHeapUsedSize}`;
        fs.appendFileSync(shareTSV, formattedLine+'\n', 'utf-8')
    }
    catch(error){
        const time = new Date()
        console.log({error}, ' at => ',time)
    }
})

watchMetrics.on('line', (line)=>{
    try {
        const {dateObj,metricsObj:{Nodes, JSHeapUsedSize}} = JSON.parse(line)
        let formattedLine = `${dateObj}\t${Nodes}\t${JSHeapUsedSize}`;
        fs.appendFileSync(watchTSV, formattedLine+'\n', 'utf-8')
    }
    catch(error){
        const time = new Date()
        console.log({error}, ' at => ',time)
    }
})

probeMetrics.on('line', (line)=>{
    try {
        const {dateObj,loadTime, metricsObj:{Nodes, JSHeapUsedSize}} = JSON.parse(line)
        let formattedLine = `${dateObj}\t${loadTime.toFixed(3).toString().replace(".", ",")}\t${Nodes}\t${JSHeapUsedSize}`;
        fs.appendFileSync(probeTSV, formattedLine+'\n', 'utf-8')
    }
    catch(error){
        const time = new Date()
        console.log({error}, ' at => ',time)
    }
})