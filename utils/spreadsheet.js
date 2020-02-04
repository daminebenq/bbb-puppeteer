var GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

const googleSpreadSheet = async function googleSpreadSheet(botsNb,SHEETID,duration) {
    var creds = require('./client_secret.json');
    var doc = new GoogleSpreadsheet(SHEETID);
    doc.useServiceAccountAuth(creds, async function (err) {
        await promisify(doc.useServiceAccountAuth)(creds);
        const info = await promisify(doc.getInfo)()
        const sheet = info.worksheets[0];
        const rows = await promisify(sheet.getRows)({
            offset: 1
        })
        doc.addRow(botsNb, {loopnumber: duration.loopNumber, millisecondstoappear: duration.millisecondsToAppear },()=>{
            if(err){
                console.log({err, rows})
            }
        });
        doc.getInfo((err)=>{
            if(err){
                console.log({err, rows})
            }
        })
    });
}
module.exports = googleSpreadSheet;