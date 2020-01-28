var GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

var creds = require('./client_secret.json');
var doc = new GoogleSpreadsheet('19zZ7Z1krgHO8Mv2ayL0wD0KQiZ5CMXnTtKoC78eWd0U');


doc.useServiceAccountAuth(creds, async function (err) {
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)()
    const sheet = info.worksheets[0];
    const rows = await promisify(sheet.getRows)({
        offset: 1
    })

    doc.getRows(1, function (err, rows) {
        rows[0].del()
    });
    // doc.addRow(1, { last_name: 'Agnew', first_name: 'Samuel' }, function(err) {
    //     if(err) {
    //         console.log(err);
    //     }
    // });
});
