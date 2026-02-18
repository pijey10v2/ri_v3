var assetChart
var lineChart
var barChart

//for asset data demo
function getAssetChartData(path){
	$.get(path).done(function( data ) {
		var skipFirstRow = false
        var obj = Object.getOwnPropertyNames(data[0])
        var xUnit; 
        var y1Unit; 
        var y2Unit; 
        var assetChartMonth = [];
        var assetChartPressure = [];
        var assetChartFlow = []; 
		data.forEach(function(item){
			if(skipFirstRow == false){
				xUnit = item[obj[0]]
				y1Unit = item[obj[1]]
				y2Unit = item[obj[2]]
				skipFirstRow = true
			}
			else{
				assetChartMonth.push(item[obj[0]])
				assetChartPressure.push(item[obj[1]])
				assetChartFlow.push(item[obj[2]])
			}
		})
		plotAssetChart(xUnit, y1Unit, y2Unit,assetChartMonth,assetChartPressure, assetChartFlow);
	});
}

function plotAssetChart(xUnit, y1Unit, y2Unit,assetChartMonth,assetChartPressure, assetChartFlow){
	let ctx = document.getElementById('assetChart').getContext('2d');
	assetChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: assetChartMonth,
			datasets: [{
					radius: 0,
					label: y1Unit,
					backgroundColor: 'rgb(255, 0, 0)',
					borderColor: 'rgb(255, 0, 0)',
					borderWidth: 1,
					yAxisID: 'assetFlow',
					fill:false,
					data: assetChartFlow                        
					}, {
					radius: 0,
					label: y2Unit,
					backgroundColor: 'rgb(0, 0, 255)',
					borderColor: 'rgb(0, 0, 255)',
					borderWidth: 1,
					yAxisID: 'assetPressure',
					fill:false,
					data: assetChartPressure
				}],
		},
		options: { 
			scales: {
				xAxes: [{
						distribution: 'series',
						offset: true,
						display: true,
						scaleLabel: {
							display: true,
							labelString: xUnit
						}
					}],
				yAxes: [{
					id: 'assetFlow',
					type: 'linear',
					position: 'left',
					offsetGridLines: true,
					display: true,
					gridLines: {
						display: false
					},
					scaleLabel: {
							display: true,
							labelString: 'Flow (l/s)'
					}
				},
				{
					id: 'assetPressure',
					type: 'linear',
					offsetGridLines: true,
					position: 'right',
					display: true,
					scaleLabel: {
							display: true,
							labelString: 'Pressure (mH)'
					}
				}                
			]
			}
		}
	});
}

//for kml demo
function getChartData(path){
    $.get(path).done(function( data ) {
        var chartLabels = []
        var lineData = []
        var barData1 = []
        var barData2 = []
        var barData3 = []
        var barData4 = []
        data.records.forEach(function(item){
            chartLabels.push(item.month)
            lineData.push(item.pressure)
            barData1.push(item.bmac)
            barData2.push(item.nrw)
            barData3.push(item.bmacest)
            barData4.push(item.inflow)
        })
        plotLineChart(chartLabels,lineData)
        plotBarChart(chartLabels,barData1,barData2,barData3,barData4)
		plotTable(data)
		plotLineChartLand(chartLabels, Encumbrances, FOE)
    });
}

function plotsillychart(){
	parseSheetLBUSCurve()
	plotLineChartLand()
	PlotPiechart2()
	PlotPiechart3()
	PlotPiechart4()
	PlotPiechart5()
}

function plotLineChart(chartLabels,lineData){
	var ctx = document.getElementById('lineChart').getContext('2d');
	lineChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: chartLabels,
			datasets: [{
				label: 'Pressure',
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(255, 99, 132)',
				fill:false,
				data: lineData,
				lineTension: 0
			}],
		},
		options: { 
			scales: {
				xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Month'
						}
					}],
				yAxes: [{
					display: true,
						scaleLabel: {
							display: true,
							labelString: 'Average Monthly Zone Pressure [mH]'
						},
					ticks: {
						max: 16,
						min: 0,
						stepSize: 2
					}
				}]
			}
		}
	});
}


function plotBarChart(chartLabels,barData1,barData2,barData3,barData4){
	var ctx = document.getElementById('barChart').getContext('2d');
	barChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: chartLabels,
			datasets: [{
				label: 'BMAC',
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(255, 99, 132)',
				data: barData1,
			},
			{
				label: 'NRW',
				backgroundColor: 'rgb(0, 99, 132)',
				borderColor: 'rgb(0, 99, 132)',
				data: barData2,
			},
			{
				label: 'BMAC (Est)',
				backgroundColor: 'rgb(0, 255, 132)',
				borderColor: 'rgb(0, 255, 132)',
				data: barData3,
			},
			{
				label: 'Inflow',
				backgroundColor: 'rgb(0,0, 132)',
				borderColor: 'rgb(0, 0, 132)',
				data: barData4,
			}
		
		],
		},
		options: {
				responsive: true,
				legend: {
					position: 'top',
				},
				scales: {
					xAxes: [{
						stacked: true,
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Month'
						},
					}],
					yAxes: [{
						stacked: true,
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Average Monthly Zone Inflow [m3/d]'
						},
					}]
				}
			}
    });
}

function plotScadaTable(data){
	var body = document.getElementById("scadaTable");
	var content
	data.records.forEach(function(item){
		let bmacest = (item.nrw/item.inflow) * 100
		content += "<tr>"
		content += "<td>"+item.month+"</td>"
		content += "<td>"+item.pressure+"</td>"
		content += "<td>"+item.inflow+"</td>"
		content += "<td>"+item.bmac+"</td>"
		content += "<td>"+item.bmacest+"</td>"
		content += "<td>"+item.nrw+"</td>"
		content += "<td>"+bmacest.toFixed(2)+"%</td>"
		content += "</tr>"
	})
	body.innerHTML = content
}

function destroyCharts(){ //and table
	if(barChart){
		barChart.destroy()
	}
	if(lineChart){
		lineChart.destroy()
	}
	if(assetChart){
		assetChart.destroy()
	}
	//document.getElementById("scadaTable").innerHTML = ""
}

function parseSheetLBUSCurve(){
	var url = "Data/Others/DOTr/LBU-S-CURVE FINANCIAL-PHYSICAL v2.xlsx";
	var oReq = new XMLHttpRequest();
	oReq.open("GET", url, true);
	oReq.responseType = "arraybuffer";
	
    oReq.onload = function(e) {
        var arraybuffer = oReq.response;
        var data = new Uint8Array(arraybuffer);
		var wb = XLSX.read(data,{type:'array'})
		var first_sheet = wb.SheetNames[0]
		var htmlstr = XLSX.write(wb,{sheet:first_sheet, type:"binary",bookType:"html"})
	//	$("#scadaTable")[0].innerHTML = htmlstr
		var worksheet = wb.Sheets[first_sheet]
		var jsondata = XLSX.utils.sheet_to_json(worksheet,{raw:false})
		//console.log(jsondata);
		var chartLabels = [];
		var lineData = [];
		var lineDataActual = [];
		jsondata.forEach(function(data){
			chartLabels.push(data.Date);
			lineData.push(parseFloat(data['WPC-01']));
			lineDataActual.push(parseFloat(data['WPC-01 Actual']))

		});
		console.log(chartLabels);
		console.log(lineData);
		console.log(lineDataActual);
		plotLineChartCP101(chartLabels,lineData,lineDataActual);
	
	}
	oReq.send();
}

function plotLineChartCP101(chartLabels,lineData, lineDataActual){
	var ctx = document.getElementById('scurve').getContext('2d');
	lineChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: chartLabels,
			datasets: [{
				radius: 0,
				label: 'Financial Planned',
				backgroundColor: 'rgb(0, 0, 0)',
				borderColor: 'rgb(0, 0, 0)',
				fill:false,
				data: lineData,
				lineTension: 0
			},
			{
				radius: 0,
				label: 'Financial actual',
				backgroundColor: 'rgb(100, 100, 100)',
				borderColor: 'rgb(100, 100, 100)',
				fill:false,
				data: lineDataActual,
				lineTension: 0
			}],
		},
		options: { 
			scales: {
				xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Month'
						}
					}],
				yAxes: [{
					display: true,
						scaleLabel: {
							display: true,
							labelString: 'Financial Actual & Finacial Planned'
						},
					ticks: {
						max: 100,
						min: 0,
						stepSize:5
					}
				}]
			},
			title: {
				display: true,
				text: 'Some Importatnt S-Curve',
				position: 'top'
			}
		}
	});
}

function parseSheetLBULand(){
	var url = "Data/Others/DOTr/LBU-Land.xlsx";

	var oReq = new XMLHttpRequest();
	oReq.open("GET", url, true);
	oReq.responseType = "arraybuffer";
	
    oReq.onload = function(e) {
        var arraybuffer = oReq.response;
        var data = new Uint8Array(arraybuffer);
		var wb = XLSX.read(data,{type:'array'})
		var first_sheet = wb.SheetNames[1]
		var htmlstr = XLSX.write(wb,{sheet:first_sheet, type:"binary",bookType:"html"})
		var worksheet = wb.Sheets[first_sheet]
		var jsondata = XLSX.utils.sheet_to_json(worksheet,{raw:false})
		
		var chartLabels = [];
		var Encumbrances = [];
		var FOE = [];
		jsondata.forEach(function(data){
			chartLabels.push(data['WPC-01']);
			Encumbrances.push(parseFloat(data['Encumbrances Percentage (%)']));
			FOE.push(parseFloat(data['FOE Percentage (%)']))
		});
		plotLineChartLand();
	
	}
	oReq.send();
}

function plotLineChartLand(){
	var ctx = document.getElementById('landchart').getContext('2d');
	lineChart = new Chart(ctx, {
		type: 'pie',
		options: {
			title: {
				display: true,
				text: 'Important Pie Chart',
				position: 'top'
			}
		},
		data: {
			labels: ['Encumbrances Percentage (%)' , 'FOE Percentage (%)'],
			datasets: [{
				backgroundColor: ['rgb(0, 0, 0)', 'rgb(100, 100, 100)'],
				data: [40,60]
			}]
		}
	});
}

function PlotPiechart2(){
	var ctx = document.getElementById('piechart2').getContext('2d');
	lineChart = new Chart(ctx, {
		type: 'pie',
		options: {
			title: {
				display: true,
				text: 'Daily Activities',
				position: 'top'
			}
		},
		data: {
			labels: ['Eat' , 'Thinking what to eat', 'Work', 'Sleep'],
			datasets: [{
				backgroundColor: ['rgb(0, 0, 0)', 'rgb(60, 60, 60)', 'rgb(100, 100, 100)', 'rgb(162, 162, 162)'],
				data: [20,30,40,10]
			}]
		}
	});
}

function PlotPiechart5(){
	var ctx = document.getElementById('scurve').getContext('2d');
	lineChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['Floor1', 'Floor2'],
			datasets: [{
				label: 'ME',
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(0, 99, 132)',
				data: ["13", "20"],
			},
			{
				label: 'Civil',
				backgroundColor: 'rgb(30, 0, 0)',
				borderColor: 'rgb(30, 0, 0)',
				data: ["18", "15"],
			},
		],
		},
		options: {
				responsive: true,
				legend: {
					position: 'top',
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Improtant Graph'
						},
					}],
					yAxes: [{
						display: true,
						ticks: {
							beginAtZero: true
						},
						scaleLabel: {
							display: true,
							labelString: 'Value'
						},
					}]
				}
			}
	});
}

function PlotPiechart3(){
	var ctx = document.getElementById('piechart3').getContext('2d');
	lineChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['ME', 'Civil'],
			datasets: [{
				label: 'ELC',
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(0, 99, 132)',
				data: ["15", "18"],
			},
			{
				label: 'FPS',
				backgroundColor: 'rgb(30, 0, 0)',
				borderColor: 'rgb(30, 0, 0)',
				data: ["14", "17"],
			},
			{
				label: 'FAS',
				backgroundColor: 'rgb(0, 0, 200)',
				borderColor: 'rgb(30, 0, 0)',
				data: ["15", "20"],
			},
			{
				label: 'SAS',
				backgroundColor: 'rgb(0, 100, 0)',
				borderColor: 'rgb(30, 0, 0)',
				data: ["12", "13"],
			},
		],
		},
		options: {
				responsive: true,
				legend: {
					position: 'top',
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Floor1'
						},
					}],
					yAxes: [{
						display: true,
						ticks: {
							beginAtZero: true
						},
						scaleLabel: {
							display: true,
							labelString: 'Value'
						},
					}]
				}
			}
	});
}

function PlotPiechart4(){
	var ctx = document.getElementById('piechart4').getContext('2d');
	lineChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['ME', 'Civil'],
			datasets: [{
				label: 'ELC',
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(0, 99, 132)',
				data: ["13", "20"],
			},
			{
				label: 'FPS',
				backgroundColor: 'rgb(30, 0, 0)',
				borderColor: 'rgb(30, 0, 0)',
				data: ["11", "18"],
			},
			{
				label: 'FAS',
				backgroundColor: 'rgb(0, 0, 200)',
				borderColor: 'rgb(30, 0, 0)',
				data: ["13", "17"],
			},
			{
				label: 'SAS',
				backgroundColor: 'rgb(0, 100, 0)',
				borderColor: 'rgb(30, 0, 0)',
				data: ["10", "12"],
			},
		],
		},
		options: {
				responsive: true,
				legend: {
					position: 'top',
				},
				scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Floor2'
						},
					}],
					yAxes: [{
						display: true,
						ticks: {
							beginAtZero: true
						},
						scaleLabel: {
							display: true,
							labelString: 'Value'
						},
					}]
				}
			}
	});
}


function prepData(jsondata,chartData,Org,dotr, gc, arup,dashBoardArray){
	var orgArray = [dotr, gc, arup]
	jsondata.forEach(function(user){
		switch (user.Organization){
			case "ARUP":
				loopHeader(user,orgArray[0])
				break;
			case "DOTr":
				loopHeader(user,orgArray[1])
				break;
			case "GC":
				loopHeader(user,orgArray[2])
				break;
		}
	})
	createArrays(orgArray,chartData,Org,dashBoardArray,plotScadaBar)
}

function loopHeader(user,array){
	array.totalUser +=1	
	for (x in array) {
		if(user[x]){
			array[x] += user[x]
		}
	}
}

function createArrays(orgArray,chartData,Org,dashBoardArray,callback){
	for (x in orgArray) {
		for (y in orgArray[x]) {
			if(!chartData[y])
			{chartData[y] = []}
			chartData[y].push(orgArray[x][y])
		}
	}
	drawDashBoard(dashBoardArray,chartData)
	callback(Org,chartData)
}

function drawDashBoard(dashBoardArray,chartData){
	for(j in chartData){
		if(j == "totalUser"){
			delete dashBoardArray[j]; 
			continue
		}
		for(i in chartData[j]){
			dashBoardArray[j] += chartData[j][i]
		}
	}
	$("#ProjectCostControl")[0].innerHTML = dashBoardArray['ProjectWise CM'] + "/30"
	$("#EDMSPassport")[0].innerHTML = dashBoardArray['ProjectWise DI Passport'] + "/50"
	$("#EDMSVisa")[0].innerHTML = dashBoardArray['ProjectWise DI Visa (50)'] + "/50"
	$("#ComplyPro")[0].innerHTML = dashBoardArray['ComplyPro'] + "/15"
	$("#Synchro")[0].innerHTML = dashBoardArray['Synchro'] + "/4"
	$("#MSPowerBI")[0].innerHTML = dashBoardArray['MS Power BI'] + "/4"
	$("#MSTeams")[0].innerHTML = dashBoardArray['MS Teams - Office 365'] + "/60"
	
}

