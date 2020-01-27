var GoogleSpreadsheets = require("google-spreadsheets");

GoogleSpreadsheets({
    key: "12nEl47jqbLrAa1EAmvdHKp6x3Cp15ymCPvHNrBtxmes"
}, function(err, spreadsheet) {
    spreadsheet.worksheets[0].cells({
        range: "R1C1:R1C2"
    }, function(err, result) {
    	console.log(result.cells[1][1].value + result.cells[1][2].value);
    });
});