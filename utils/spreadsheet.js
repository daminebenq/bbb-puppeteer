const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

const creds = require('./client_secret.json');

function printOneDiffTime(diffTime){
    console.log(`LoopNumber: ${diffTime.loopnumber}`)
    console.log(`millisecondsToAppear: ${diffTime.millisecondstoappear}`)
    console.log('------------------------------')
}

async function accessSpreadsheet(){
    const doc = new GoogleSpreadsheet('12nEl47jqbLrAa1EAmvdHKp6x3Cp15ymCPvHNrBtxmes');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)()
    const sheet = info.worksheets[1];
    const rows = await promisify(sheet.getRows)({
        offset: 1
    })
    rows.forEach(row => {
        printOneDiffTime(row)
    })
}

accessSpreadsheet()