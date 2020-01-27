const express = require('express')
const GoogleSpreadsheets = require('google-spreadsheets')

require('dotenv').config()

const app = express()
const port = 1337

// declare variable for charts
let charts

// bootstrap server
app.listen(port, () => {
	console.log(`App is running on port ${port}.`)
})

GoogleSpreadsheets({
    key: process.env.SPREADSHEET_KEY
}, function(err, spreadsheet) {
    spreadsheet.worksheets[0].cells({
        range: "R1C1:R1C2"
    }, function(err, result) {
    	console.log(result.cells[1][1].value + result.cells[1][2].value);
    });
});