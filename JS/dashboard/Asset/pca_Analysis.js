var pcaAnalysisData;

if(localStorage.ui_pref == 'ri_v3'){
    const colors = ['#00DFCF', '#8FDAAE', '#C6E18F', '#F3E98E', '#FFDC6B', '#FFB265', '#FF7D61', '#D63C68', '#BC1052', '#7E2571', '#565697', '#6DB9D7']
    const gradients = ['#00BAAD', '#57C785', '#ADD45C', '#EDDD53', '#FFC300', '#FF8D1A', '#FF5733', '#C70039', '#900C3F', '#511849', '#3D3D6B', '#2A7B9B'] 
    Highcharts.setOptions({
    colors: Highcharts.map(colors, (color, i) => ({
        linearGradient: {
            x1: 1, x2: 0, y1: 0, y2: 1
        },
        stops: [
            [0, color],
            [1, gradients[i]]
        ]
        }))
    });

    var legendColorArr = {
        'green': Highcharts.getOptions().colors[1], 
        'yellow': Highcharts.getOptions().colors[3],
        'orange' : Highcharts.getOptions().colors[5],
        'red' : Highcharts.getOptions().colors[7]
    }
}else{
    var legendColorArr = {
        'green': '#52BE80', 
        'yellow': '#F4D03F',
        'orange' : '#DD9941',
        'red' : '#E93232'
    }
}

var dcColorIdx = {
    'Good': legendColorArr['green'], 
    'Fair': legendColorArr['yellow'],
    'Poor' : legendColorArr['red']
}

function drawCDchart(data, id, title, filter){
    var dataArr = [];
    var chartTitle;
    for (const [idx, ele] of Object.entries(data)) {
        dataArr.push({name: idx, y: parseFloat(ele), color:dcColorIdx[idx], sliced : (idx == 'Good') ? true : false});
    }

    var chart = Highcharts.chart(id, {
        chart: {
            type: 'pie',
            options3d: {
                enabled: false,
                alpha: 45,
                beta: 0
            },
            events: {
                render() {
                  const chart = this;
        
                  if (document.fullscreenElement && chart.updateFlag) {
                        console.log("pie")
                        chart.updateFlag = false;
                        chart.update({
                            chart: {
                                marginTop: 90,
                                marginBottom: 50
                            },
                            title: {
                                useHTML: true,
                                enabled: true,
                                text: '<span class="hiddenLabel" style="font-size: 15px; display: flex; text-align: center">PCA Analysis Dashboard - ' + localStorage.p_name + '<br>Central Deflection : '+title+'<br>'+filter+'</span>'+
                                    '<span class="showLabel">PCA Analysis Dashboard - ' + localStorage.p_name + '<br>Central Deflection : '+title+'<br>'+filter+'</span>'
                            },
                            plotOptions: {
                                pie: {
                                    enabled: true,
                                    showInLegend: true
                                }
                            }
                        })
        
                        chart.updateFlag = true;
                  } else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                            title: {
                                useHTML: true,
                                enabled: true,
                                text: '<span class="hiddenLabel" style="font-size: 10px; display: flex; text-align: center">'+title+'</span>'+
                                    '<span class="showLabel">PCA Analysis Dashboard - ' + localStorage.p_name + '<br>Central Deflection : '+title+'<br>'+filter+'</span>'
                            }
                        })
                        chart.updateFlag = true;
                    }
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="hiddenLabel" style="font-size: 10px; display: flex; text-align: center">'+title+'</span>'+
                  '<span class="showLabel">PCA Analysis Dashboard - ' + localStorage.p_name + '<br>Central Deflection : '+title+'<br>'+filter+'</span>'
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b><br/>Total :<b>{point.y}</b>'
        },
        accessibility: {
          point: {
            valueSuffix: '%'
          }
        },
        credits : {enabled:false},
        plotOptions: {
          pie: {
            borderWidth: 10,
            allowPointSelect: true,
            cursor: 'default',
            depth: 35,
            dataLabels : {enabled : false}
          }
        },
        series: [{
          type: 'pie',
          data: dataArr
        }]
    });
    chart.updateFlag = true;
}

getPercentage = (val, total) => (total) ? Math.round((val/total)*100 * 10) / 10 : 0;

function drawRMCharts(data, id, title, filter){
    var goodDataArr = [];
    var fairDataArr = [];
    var poorDataArr = [];

    for (const [idx, ele] of Object.entries(data)) {
        var goodTemp = ele.Good ? ele.Good : 0;
        var fairTemp = ele.Statisfactory ? ele.Statisfactory : 0;
        var poorTemp = ele.Poor ? ele.Poor : 0;

        var total = goodTemp + fairTemp + poorTemp;

        // get total then check percentage
        goodDataArr.push({ y: getPercentage(goodTemp, total), val : goodTemp});
        fairDataArr.push({ y: getPercentage(fairTemp, total), val : fairTemp});
        poorDataArr.push({ y: getPercentage(poorTemp, total), val : poorTemp});
    }

    var chart = Highcharts.chart(id, {
        chart: {
            type: 'column',
            options3d: {
                enabled: false,
                alpha: 15,
                beta: 15,
                viewDistance: 25,
                depth: 40
            },
            marginBottom: 78,
            events: {
                render() {
                  const chart = this;
        
                  if (document.fullscreenElement && chart.updateFlag) {
                        chart.updateFlag = false;
                        chart.update({
                            chart: {
                                marginTop: 90,
                                marginBottom: 80
                            },
                            title: {
                                useHTML: true,
                                enabled: true,
                                text: '<span class="hiddenLabel" style="font-size: 15px; display: flex; text-align: center">PCA Analysis Dashboard - ' + localStorage.p_name + '<br>Resilient Modulus : '+title+' <br>'+filter+'</span>'+
                                    '<span class="showLabel">PCA Analysis Dashboard - ' + localStorage.p_name + '<br>Resilient Modulus : '+title+' <br>'+filter+'</span>'
                            },
                            xAxis: {
                                labels: {
                                    rotation: 0
                                },
                            },
                            legend: {
                                enabled: true,
                                symbolHeight: 15,
                                symbolWidth: 15,
                                itemStyle: {
                                    fontSize: '15px',
                                }
                            }
                        })
        
                        chart.updateFlag = true;
                  } else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                        title: {
                            useHTML: true,
                            enabled: true,
                            text: '<span class="hiddenLabel" style="font-size: 12px;">'+title+'</span>'+
                                  '<span class="showLabel">PCA Analysis Dashboard - ' + localStorage.p_name + '<br>Resilient Modulus : '+title+' <br>'+filter+'</span>'
                        },
                        legend: {
                            symbolHeight: 7,
                            symbolWidth: 7,
                            itemStyle: {
                                fontSize: '9px',
                            }
                        }
                        })
                        chart.updateFlag = true;
                    }
                }
            }
        },
        credits : {enabled:false},
        legend : {enabled:false},
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="hiddenLabel" style="font-size: 12px;">'+title+'</span>'+
                  '<span class="showLabel">PCA Analysis Dashboard - ' + localStorage.p_name + '<br>Resilient Modulus : '+title+' <br>'+filter+'</span>'
        },
        xAxis: {
            categories: ['Asphalt (E1)', 'Roadbase (E2)', 'Subbase (E3)', 'Subgrade (E3)'],
            labels: {
                skew3d: true,
                rotation: 270,
                style: {
                    width: '40px',
                    fontSize: '10px'
                },
            },
        },
        yAxis: {
            allowDecimals: false,
            min: 0,
            max:100,
            title: {
                text: '',
                skew3d: true
            }
        },
        
        tooltip: {
            headerFormat: '<b>{point.key}</b><br>',
            pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name} <br> <br> Percentage :<strong>{point.y} %</strong> <br> Total :<strong>{point.val}</strong>'
        },
        
        plotOptions: {
            column: {
                depth: 40
            },
            series: {
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        return this.y + "%";
                    }
                }
            }
        },
        series: [{
            name: 'Good',
            data: goodDataArr,
            color : legendColorArr['green']
        }, {
            name: 'Statisfactory',
            data: fairDataArr,
            color : legendColorArr['yellow']
        }, {
            name: 'Poor',
            data: poorDataArr,
            color : legendColorArr['red']
        }]
    });
    chart.updateFlag = true;
}

function drawMLPCharts(data, id, title, filter){
    var goodDataArr = [];
    var fairDataArr = [];
    var poorDataArr = [];
    var badDataArr = [];

    for (const [idx, ele] of Object.entries(data)) {
        goodDataArr.push(ele.Good ? ele.Good : 0);
        fairDataArr.push(ele.Gair ? ele.Gair : 0);
        poorDataArr.push(ele.Poor ? ele.Poor : 0);
        badDataArr.push(ele.Bad ? ele.Bad : 0);
    } 

    var chart = Highcharts.chart(id, {
        chart: {
            type: 'column',
            options3d: {
                enabled: false,
                alpha: 15,
                beta: 15,
                viewDistance: 25,
                depth: 40,
            },
            events: {
                render() {
                  const chart = this;
        
                  if (document.fullscreenElement && chart.updateFlag) {
                        chart.updateFlag = false;
                        chart.update({
                            chart: {
                                marginTop: 90,
                                marginBottom: 80
                            },
                            title: {
                                useHTML: true,
                                enabled: true,
                                text: '<span class="hiddenLabel" style="font-size: 15px; display: flex; text-align: center">PCA Analysis Dashboard - ' + localStorage.p_name + '<br>Multi Level Profiler (MLP) : '+title+' <br>'+filter+'</span>'+
                                    '<span class="showLabel">PCA Analysis Dashboard - ' + localStorage.p_name + '<br>Multi Level Profiler (MLP) : '+title+' <br>'+filter+'</span>'
                            },
                            legend: {
                                enabled: true,
                                symbolHeight: 15,
                                symbolWidth: 15,
                                itemStyle: {
                                    fontSize: '15px',
                                }
                            }
                        })
        
                        chart.updateFlag = true;
                  } else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                        title: {
                            useHTML: true,
                            enabled: true,
                            text: '<span class="hiddenLabel" style="font-size: 12px; display: flex; text-align: center">'+title+'</span>'+
                                  '<span class="showLabel">PCA Analysis Dashboard - ' + localStorage.p_name + '<br>Multi Level Profiler (MLP) : '+title+' <br>'+filter+'</span>'
                        },
                        legend: {
                            symbolHeight: 7,
                            symbolWidth: 7,
                            itemStyle: {
                                fontSize: '9px',
                            }
                        }
                        })
                        chart.updateFlag = true;
                    }
                }
            }
        },
        credits : {enabled:false},
        legend : {enabled:false},
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="hiddenLabel" style="font-size: 12px; display: flex; text-align: center">'+title+'</span>'+
                  '<span class="showLabel">PCA Analysis Dashboard - ' + localStorage.p_name + '<br>Multi Level Profiler (MLP) : '+title+' <br>'+filter+'</span>'
        },
        xAxis: {
            categories: ['Crack', 'Roughness, IRI', 'Rutting'],
            labels: {
                allowOverlap: true,
                skew3d: true,
                style: {
                    textOverflow: 'allow',
                    width: '40px'
                },
            },
        },
        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
            text: '',
            skew3d: true
            }
        },
        tooltip: {
            headerFormat: '<b>{point.key}</b><br>',
            pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} '
        },
        plotOptions: {
            column: {
                depth: 40
            }
        },
        series: [{
            name: 'Good',
            data: goodDataArr,
            color : legendColorArr['green']
        }, {
            name: 'Fair',
            data: fairDataArr,
            color : legendColorArr['yellow']
        }, {
            name: 'Poor',
            data: poorDataArr,
            color : legendColorArr['orange']
        }, {
            name: 'Bad',
            data: badDataArr,
            color : legendColorArr['red']
        }]
    });
    chart.updateFlag = true;
}

function updateDateCard(dateArr){
    $('.cdDate').html(dateArr.cd);
    $('.rmDate').html(dateArr.rm);
    $('.mlpDate').html(dateArr.mlp);
}

function refreshInformation(date = '', lane = 'Fast', from = '', to = ''){
    var dateFilter = date;
    var titleFilter = '';

    if(dateFilter == ''){
        if(from == ''){
            if(to == ''){
                titleFilter = lane+' Lane';
            }else{
                titleFilter = lane+' Lane (to :'+to+')';
            }
        }else{
            if(to == ''){
                titleFilter = lane+' Lane (from :'+from+')';
            }else{
                titleFilter = lane+' Lane (from :'+from+' - to :'+to+')';
            }   
        }
    }else{
        if(from == ''){
            if(to == ''){
                titleFilter = 'Date :'+date+' - '+lane+' Lane';
            }else{
                titleFilter = 'Date :'+date+' - '+lane+' Lane (to :'+to+')';
            }   
        }else{
            if(to == ''){
                titleFilter = 'Date :'+date+' - '+lane+' Lane (from :'+from+')';
            }else{
                titleFilter = 'Date :'+date+' - '+lane+' Lane (from :'+from+' - to :'+to+')';
            }  
        }
    }
    var cdIncData = (pcaAnalysisData.cd && pcaAnalysisData.cd.Increasing) ? pcaAnalysisData.cd.Increasing : [];
    drawCDchart(cdIncData,'cdIncChart', 'Increasing', titleFilter);
    var cdDescData = (pcaAnalysisData.cd && pcaAnalysisData.cd.Decreasing) ? pcaAnalysisData.cd.Decreasing : [];
    drawCDchart(cdDescData,'cdDescChart', 'Decreasing', titleFilter);

    var rmIncData = (pcaAnalysisData.rm && pcaAnalysisData.rm.Increasing) ? pcaAnalysisData.rm.Increasing : [];
    drawRMCharts(rmIncData,'rmIncChart', 'Increasing', titleFilter);
    var rmDescData = (pcaAnalysisData.rm && pcaAnalysisData.rm.Decreasing) ? pcaAnalysisData.rm.Decreasing : [];
    drawRMCharts(rmDescData,'rmDescChart', 'Decreasing', titleFilter);

    var mlpIncData = (pcaAnalysisData.mlp && pcaAnalysisData.mlp.Increasing) ? pcaAnalysisData.mlp.Increasing : [];
    drawMLPCharts(mlpIncData,'mlpIncChart', 'Increasing', titleFilter);
    var mlpDescData = (pcaAnalysisData.mlp && pcaAnalysisData.mlp.Decreasing) ? pcaAnalysisData.mlp.Decreasing : [];
    drawMLPCharts(mlpDescData,'mlpDescChart', 'Decreasing', titleFilter);

    updateDateCard(pcaAnalysisData.currDate);
}

function populateDateOptions(data) {
    var optHTML = '<option value="" selected></option>';

    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            if(ele !== ""){
                optHTML += '<option value="' + ele + '">' + ele + '</option>';
            }
        }
    }

    $('#dateFilter').html(optHTML);
    window.parent.$('.assetDateFilter').html(optHTML);
    window.parent.$('.assetDateFilter option[value=""]').text('Select Date');
}

function populateChgOptions(data) {
    var optHTML = '<option value="" selected></option>';

    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            optHTML += '<option value="' + parseFloat(ele) + '">' + parseFloat(ele) + '</option>';
        }
    }

    $('.chgFilter').html(optHTML);
    window.parent.$('.assetChainFromFilter').html(optHTML);
    window.parent.$('.assetChainToFilter').html(optHTML);
    window.parent.$('.assetChainFromFilter option[value=""]').text('Select Chainage From');
    window.parent.$('.assetChainToFilter option[value=""]').text('Select Chainage To');
}

function refreshDashboard(filterArr = ''){
    var dateFilter = $('#dateFilter').val();
    var laneFilter = $('#laneFilter').val();
    var chgFromFilter = $('#chgFromFilter').val();
    var chgToFilter = $('#chgToFilter').val();

    if(localStorage.ui_pref == 'ri_v3'){
        dateFilter = filterArr.assetDate;
        laneFilter = filterArr.assetLane;
        if(laneFilter == 'Fast Lane'){
            laneFilter = 'Fast';
        }else{
            laneFilter = 'Slow';
        }
        chgFromFilter = filterArr.assetChainFrom;
        chgToFilter = filterArr.assetChainTo;
    }else{
        dateFilter = $('#dateFilter').val();
        laneFilter = $('#laneFilter').val();
        chgFromFilter = $('#chgFromFilter').val();
        chgToFilter = $('#chgToFilter').val();
    }
    
    $.ajax({
        type: "POST",
		url: 'chartData.json.php',
		dataType: 'json',
		data: {
            page: "PCA_Analysis",
            func: "updateData",
            dateFilter : dateFilter,
            laneFilter : laneFilter,
            chgFromFilter : chgFromFilter,
            chgToFilter : chgToFilter
		},
		success: function (obj) {
			if (obj.status && obj.status == 'ok') {
                pcaAnalysisData = obj.data;
                refreshInformation(dateFilter, laneFilter, chgFromFilter, chgToFilter);
			}
		}
	});
}

function refreshFromv3 (filterArr){
  
	refreshDashboard(filterArr);
}

$(document).ready(function(){
    $.ajax({
        type: "POST",
		url: 'chartData.json.php',
		dataType: 'json',
		data: {
            page: "PCA_Analysis"
		},
		success: function (obj) {
			if (obj.status && obj.status == 'ok') {
                pcaAnalysisData = obj.data;
                refreshInformation();
                if(pcaAnalysisData.dateOpts){
                    populateDateOptions(pcaAnalysisData.dateOpts);
                }
                if(pcaAnalysisData.chgOpts){
                    populateChgOptions(pcaAnalysisData.chgOpts);
                }
			}
		}
	});
})
