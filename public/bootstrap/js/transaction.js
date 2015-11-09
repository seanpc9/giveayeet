var today = new Date()
var priorDate = new Date().setDate(today.getDate() - 30);

function makeItFake () {
    var names = [
        "McDonalds",
        "Taco Bell",
        "Walmart",
        "Starbucks",
        "Harris Teeter",
        "Target",
        "Chipotle",
        "Express",
        "Duke Store",
        "Champs",
        "Bojangles",
        "Foot Locker",
        "Amazon",
        "Netflix",
        "CVS Pharmacy"
    ];
    var price = parseFloat(Math.abs(Math.random() * 100 - Math.random() * 10).toFixed(2));
    var myTransaction = {
        amount: price,
        date: randomDate(priorDate, today),
        compName: names[Math.floor(Math.random() * 1000) % 14],
        donatedAmount: Math.ceil(price) - price,
        totalHolder: 0,
        totalDonated: 0
    }
    return myTransaction;
}

function drawCurveTypes() {
    values = [];
    for (var i = 0; i < 20; i++) {
        var trans = makeItFake();
        values.push(trans);
    }
    values.sort(function(a, b) {
        a = new Date(a.date);
        b = new Date(b.date);
        return a < b ? -1 : a > b ? 1 : 0;
    });
    totalSpent = 0;
    totalDonated = 0;
    dataArray = [];
    for (var i = 0; i < 20; i++) {
        var trans = values[i];
        totalSpent = trans.amount + totalSpent;
        totalDonated = trans.donatedAmount + totalDonated;
        trans.totalHolder = totalSpent;
        trans.totalDonated = totalDonated;
        dataArray.push(trans);
    }
    data = new google.visualization.DataTable();
    chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    data.addColumn('date', 'X');
    data.addColumn('number', 'Spent Money');
    data.addColumn('number', 'Donated Money');
    for (var i = 0; i < 20; i++) {
        var toPlot = dataArray[i];
        data.addRow([new Date(toPlot.date), toPlot.totalHolder, toPlot.totalDonated]);
    }
    var options = {
        hAxis: {
            title: 'Date'
        },
        vAxis: {
            title: 'Donated',
            minValue: 0
        },
        series: {
            1: {curveType: 'function'}
        }
    };    
    chart.draw(data, options);
    drawTableNow();
}

function randomDate(start, end) {
    return new Date(new Date(start).getTime() + Math.random() * (new Date(end).getTime() - new Date(start).getTime()));
}

function drawTableNow() {
    var tableData = new google.visualization.DataTable();
    var tableToDraw = new google.visualization.Table(document.getElementById('table_div'));
    tableData.addColumn('date', "Date");
    tableData.addColumn('string', "Company");
    tableData.addColumn('number', "Amount");
    tableData.addColumn('number', "Donated Amount");
    var totalDonated = 0;
    for (var i = 0; i < 20; i++) {
        var toPlot = values[i];
        var donatedHere = parseFloat(toPlot.donatedAmount.toFixed(2));
        tableData.addRow([new Date(toPlot.date), toPlot.compName, toPlot.amount, donatedHere]);
        totalDonated += donatedHere;
    }
    totalDonated = parseFloat(totalDonated.toFixed(2));
    tableToDraw.draw(tableData, {showRowNumber: true, width: '100%', height: '100%'});
    document.getElementById("totalDonated").innerHTML = "Total Donation: $" + totalDonated;
}