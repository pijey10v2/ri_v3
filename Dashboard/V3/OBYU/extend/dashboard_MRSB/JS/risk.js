var riskData;
var monthFulltext = {0:"December",1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"}
var monthTextFull = {"Jan":"January","Feb":"February","Mar":"March","Apr":"April","May":"May","Jun":"June","Jul":"July","Aug":"August","Sep":"September","Oct":"October","Nov":"November","Dec":"December"}
var monthPrev = {"January":"December","February":"January","March":"February","April":"March","May":"April","June":"May","July":"June","August":"July","September":"August","October":"September","November":"October","December":"November"};

function openConOpDashboard(ele){
    var allDataArr = $(ele).data('allData') ? $(ele).data('allData') : [];
    var paramYr = (allDataArr.year) ? allDataArr.year : [];
    var paramMonth = (allDataArr.month) ? allDataArr.month : [];
    var linkParamArr = processFilterParamArr([paramYr, paramMonth]);

    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("RR", "construct_dash_conop_ra_overall", linkParamArr, "Risk Analysis");
    }else{
        var postParam = {function:"openConOpDashboard",processType:"RR", conOpTabId:"riskAnalysisOverall", linkName:"construct_dash_conop_ra_overall", linkParam:linkParamArr, linkWinTitle: 'Risk Analysis'};
        parent.postMessage(postParam ,"*");
    }
}

function updateRiskCard (data) {
    $('#riskPlannedProgressCard').html((data.planProgress) ?  data.planProgress : 0).data("allData", (data.allData) ? data.allData : []);
    $('#riskActualProgressCard').html((data.actualProgress) ?  data.actualProgress : 0).data("allData", (data.allData) ? data.allData : []);
    $('#riskVarianceCard').html((data.variance) ?  data.variance : 0).data("allData", (data.allData) ? data.allData : []);
    $('#riskScoreCard').html((data.riskScore) ?  data.riskScore : 0).data("allData", (data.allData) ? data.allData : []);

    var riskColor = (data.riskScore) ?  data.riskScore : 0;

    if (riskColor >= 1 && riskColor < 4){
        $('.riskScoreBackground').css({
            'background-color': '#ABEBC6',
            'border-radius': '5px'
        })
    }else if (riskColor >= 4 && riskColor < 8){
        $('.riskScoreBackground').css({
            'background-color': '#2ECC71',
            'border-radius': '5px'
        })
    }else if (riskColor >= 8 && riskColor < 13){
        $('.riskScoreBackground').css({
            'background-color': '#F39C12',
            'border-radius': '5px'
        });
    }else if (riskColor >= 13 && riskColor < 16){
        $('.riskScoreBackground').css({
            'background-color': 'red',
            'border-radius': '5px',
            'color': 'white'
        })
    }else if (riskColor >= 16){
        $('.riskScoreBackground').css({
            'background-color': '#C0392B',
            'border-radius': '5px',
            'color': 'white'
        })
    }else if(riskColor == 0) {
        $('.riskScoreBackground').css({
            'background-color': '#d9ecff',
            'border-radius': '5px',
            'color': 'black'
        })
    }
}

function updateTablePackage (data){
    var packTableHTML = "";
    var tempArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
          var tempId = 'tbEle_'+idx.replace(/\s+/g, '');
          packTableHTML += '<tr id="'+tempId+'" onClick="openConOpDashboard(this);">'
          packTableHTML += '<td>' + idx + '</td>'
          packTableHTML += '<td>' + ((ele.estCompletion) ? (ele.estCompletion) : 'N/A') + '</td>'
          packTableHTML += '</tr>'
          tempArr[tempId] = (ele.allData) ? (ele.allData) : 'N/A';
        }
    }
    $("#estPackage").html(packTableHTML); 
    if (tempArr) {
        for (const [idx, ele] of Object.entries(tempArr)) {
            $('#'+idx).data('allData', ele);
        }    
    }

}

function drawIndexChart(data, monthYear) {
    var dataArr = [{y:(data.pbbCompletion) ? parseInt(data.pbbCompletion) : 0, allData:((data.allData) ? data.allData:[])}];
    
    var chart = Highcharts.chart('risk-prob-complete', {

        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
            events: {
                render() {
                  var chart = this;

                  if(localStorage.ui_pref == 'ri_v3'){
                      if (document.fullscreenElement && chart.updateFlag) {
                        chart.updateFlag = false;
                        chart.update({
                          chart:{
                            marginTop: 90
                          },
                          title: {
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Risk Management<br>'+localStorage.p_name+'<br>PROBABILITY OF COMPLETION ('+monthYear+')</span>'
                          }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>PROBABILITY OF COMPLETION ('+monthYear+')</span>'
                          },
                        })
                        chart.updateFlag = true;
                      }
                  }
        
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>PROBABILITY OF COMPLETION ('+monthYear+')</span>'
        },
        pane: {
            startAngle: -150,
            endAngle: 150
        },
    
        // the value axis
        yAxis: {
            min: 0,
            max: 100,
    
            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',
    
            tickPixelInterval: 30,
            tickWidth: 0,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: '%'
            },
            plotBands: [{
                from: 0,
                to: 33,
                color: '#DF5353' // red
            }, {
                from: 33,
                to: 66,
                color: '#DDDF0D' // yellow
            }, {
                from: 66,
                to: 100,
                color: '#55BF3B' // green

            }]
        },
        credits: false,
        series: [{
            name: 'Probability',
            data: dataArr,
            tooltip: {
                valueSuffix: ' %'
            },
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var paramYr = (allDataArr.year) ? allDataArr.year : [];
                    var paramMonth = (allDataArr.month) ? allDataArr.month : [];
                    var linkParamArr = processFilterParamArr([paramYr, paramMonth]);
                    if (paramYr.length != 0 || paramMonth.length != 0) {
                        if(localStorage.ui_pref == "ri_v3"){
                            window.parent.widgetConopOpen("RR", "construct_dash_conop_ra_overall", linkParamArr, "Risk Analysis");
                        }else{
                            var postParam = {function:"openConOpDashboard",processType:"RR", conOpTabId:"riskAnalysisOverall", linkName:"construct_dash_conop_ra_overall", linkParam:linkParamArr, linkWinTitle: 'Risk Analysis'};
                            parent.postMessage(postParam ,"*");
                        }
                    }
                }
            }
        }]
    
    });
    chart.updateFlag = true;
}

function drawTimelyCompChart (data, monthYear) {
    var catArr = [];
    var dataArr = [];
    var red;
    var orange;
    var green;
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);
            dataArr.push({y:((ele.pbbCompletion) ? parseInt(ele.pbbCompletion) : 0), allData:((ele.allData) ? ele.allData:[])});
        }
    }
    if(localStorage.ui_pref == "ri_v3"){
        red = Highcharts.getOptions().colors[6];
        orange = Highcharts.getOptions().colors[5];
        green = Highcharts.getOptions().colors[2];
    }else{
        red = 'red';
        orange = 'orange';
        green = 'green';
    }
    var chart = Highcharts.chart('risk-timely-comp', {
        chart: {
            type: 'bar',
            events: {
                render() {
                  var chart = this;

                  if(localStorage.ui_pref == 'ri_v3'){
                      if (document.fullscreenElement && chart.updateFlag) {
                        chart.updateFlag = false;
                        chart.update({
                          chart:{
                            marginTop: 90
                          },
                          title: {
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Risk Management<br>'+localStorage.p_name+'<br>PROBABILITY OF COMPLETING WITHIN SCHEDULE ('+monthYear+')</span>'
                          },
                          legend: {
                            symbolHeight: 15,
                            symbolWidth: 15,
                            itemStyle : {
                              fontSize : '15px'
                            }
                          }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>PROBABILITY OF COMPLETING WITHIN SCHEDULE ('+monthYear+')</span>'
                          },
                        })
                        chart.updateFlag = true;
                      }
                  }
        
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>PROBABILITY OF COMPLETING WITHIN SCHEDULE ('+monthYear+')</span>'
        },
        xAxis: {
            categories: catArr,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            max: 100,
            tickAmount: 5,
            title: {
                text: ''
            },
            labels: {
              format: '{value}%'
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    format: '{y}%'
                },
                zones: [{
                    value: 50,
                    color: red
                },{
                    value: 70,
                    color: orange
                },{
                    color: green
                }]
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            showInLegend: false,
            name: 'Probability of Completion',
            data: dataArr,
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var paramYr = (allDataArr.year) ? allDataArr.year : [];
                    var paramMonth = (allDataArr.month) ? allDataArr.month : [];
                    var linkParamArr = processFilterParamArr([paramYr, paramMonth]);

                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("RR", "construct_dash_conop_ra_overall", linkParamArr, "Risk Analysis");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"RR", conOpTabId:"riskAnalysisOverall", linkName:"construct_dash_conop_ra_overall", linkParam:linkParamArr, linkWinTitle: 'Risk Analysis'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            }
        }]
    });
    chart.updateFlag = true;
}

function drawProjPDPDurChart (data, monthYear) {
    var catArr = [];
    var countArr =  [];
    var cumArr = [];
    if (data) {
        if (data.bin) {
            for (const [idx, ele] of Object.entries(data.bin)) {
                catArr.push(parseInt(ele));
            }
        }
        if (data.count) {
            for (const [idx, ele] of Object.entries(data.count)) {
                countArr.push(parseFloat(ele));
            }
        }
        if (data.cum) {
            for (const [idx, ele] of Object.entries(data.cum)) {
                cumArr.push(parseFloat(ele));
            }
        }
    }

    var chart = Highcharts.chart('risk-pdp-overall-dur', {
        chart: {
            events: {
                render() {
                  var chart = this;

                  if(localStorage.ui_pref == 'ri_v3'){
                      if (document.fullscreenElement && chart.updateFlag) {
                        chart.updateFlag = false;
                        chart.update({
                          chart:{
                            marginTop: 90
                          },
                          title: {
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Risk Management<br>'+localStorage.p_name+'<br>OVERALL DURATION ANALYSIS ('+monthYear+')</span>'
                          },
                          legend: {
                            symbolHeight: 15,
                            symbolWidth: 15,
                            itemStyle : {
                              fontSize : '15px'
                            }
                          }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>OVERALL DURATION ANALYSIS ('+monthYear+')</span>'
                          },
                        })
                        chart.updateFlag = true;
                      }
                  }
        
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>OVERALL DURATION ANALYSIS ('+monthYear+')</span>'
        },
        xAxis: {
            categories: catArr,
            title: {
                text: null
            }
        },
        yAxis: [{ // Primary yAxis
            gridLineWidth: 0,
            labels: {
                style: {
                }
            },
            title: {
                text: 'Cumulative',
                style: {
                }
            },
            opposite: true

        }, { // Secondary yAxis
            gridLineWidth: 0,
            title: {
                text: 'Count',
                style: {
                }
            },
            labels: {
                style: {
                }
            }
        }],
        series: [{
            type: 'column',
            name: 'Count',
            data: countArr,
            yAxis: 1,
            events: {
                click: function (event) {
                    var postParam = {function:"openConOpRiskUpload",processType:"RR", conOpTabId:"riskUploadTab", linkWinTitle: 'Risk Upload Analysis'};
                    parent.postMessage(postParam ,"*");
                }
            }
        }, {
            type: 'spline',
            name: 'Cumulative',
            data: cumArr,
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[3],
                fillColor: 'white'
            },
            yAxis: 0,
            events: {
                click: function (event) {
                    var postParam = {function:"openConOpRiskUpload",processType:"RR", conOpTabId:"riskUploadTab", linkWinTitle: 'Risk Upload Analysis'};
                    parent.postMessage(postParam ,"*");
                }
            }
        }],
        credits: {
            enabled: false
        }
    });
    chart.updateFlag = true;
}

function drawTopRiskChart (data, monthYear) {
    var catArr = [];
    var dataArr = [];
    var red;
    var orange;
    var green;
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            if(idx == "") continue;
            catArr.push(idx);
            dataArr.push({y:((ele.val) ? parseInt(ele.val) : 0), allData:((ele.allData) ? ele.allData:[])});
        }
    }
    if(localStorage.ui_pref == "ri_v3"){
        red = Highcharts.getOptions().colors[6];
        orange = Highcharts.getOptions().colors[5];
        green = Highcharts.getOptions().colors[2];
    }else{
        red = 'red';
        orange = 'orange';
        green = 'green';
    }
    var chart = Highcharts.chart('risk-pdp-crit-risk-curr', {
        chart: {
            type: 'bar',
            events: {
                render() {
                  var chart = this;

                  if(localStorage.ui_pref == 'ri_v3'){
                      if (document.fullscreenElement && chart.updateFlag) {
                        chart.updateFlag = false;
                        chart.update({
                          chart:{
                            marginTop: 90
                          },
                          title: {
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Risk Management<br>'+localStorage.p_name+'<br>PROJECT RISK CURRENT MONTH ('+monthYear+')</span>'
                          },
                          legend: {
                            symbolHeight: 15,
                            symbolWidth: 15,
                            itemStyle : {
                              fontSize : '15px'
                            }
                          }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>PROJECT RISK CURRENT MONTH ('+monthYear+')</span>'
                          },
                        })
                        chart.updateFlag = true;
                      }
                  }
        
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>PROJECT RISK CURRENT MONTH ('+monthYear+')</span>'
        },
        xAxis: {
            categories: catArr,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            max: 100,
            tickAmount: 5,
            title: {
                text: ''
            },
            labels: {
              format: '{value}'
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    format: '{y}%'
                },
                zones: [{
                    value: 50,
                    color: red
                },{
                    value: 70,
                    color: orange
                },{
                    color: green
                }]
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            showInLegend: false,
            data: dataArr,
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var paramYr = (allDataArr.year) ? allDataArr.year : [];
                    var paramMonth = (allDataArr.month) ? allDataArr.month : [];
                    var linkParamArr = processFilterParamArr([paramYr, paramMonth]);

                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("RR", "construct_dash_conop_ra_overall", linkParamArr, "Risk Analysis");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"RR", conOpTabId:"riskAnalysisOverall", linkName:"construct_dash_conop_ra_overall", linkParam:linkParamArr, linkWinTitle: 'Risk Analysis'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            }
        }]
    });
    chart.updateFlag = true;
}

function drawTopRiskChartPrev (data, monthYear) {
    var catArr = [];
    var dataArr = [];
    var red;
    var orange;
    var green;
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            if(idx == "") continue;
            catArr.push(idx);
            dataArr.push({y:((ele.val) ? parseInt(ele.val) : 0), allData:((ele.allData) ? ele.allData:[])});
        }
    }
    if(localStorage.ui_pref == "ri_v3"){
        red = Highcharts.getOptions().colors[6];
        orange = Highcharts.getOptions().colors[5];
        green = Highcharts.getOptions().colors[2];
    }else{
        red = 'red';
        orange = 'orange';
        green = 'green';
    }
    var chart = Highcharts.chart('risk-pdp-crit-risk-prev', {
        chart: {
            type: 'bar',
            events: {
                render() {
                  var chart = this;

                  if(localStorage.ui_pref == 'ri_v3'){
                      if (document.fullscreenElement && chart.updateFlag) {
                        chart.updateFlag = false;
                        chart.update({
                          chart:{
                            marginTop: 90
                          },
                          title: {
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Risk Management<br>'+localStorage.p_name+'<br>PROJECT RISK PREVIOUS MONTH ('+monthYear+')</span>'
                          },
                          legend: {
                            symbolHeight: 15,
                            symbolWidth: 15,
                            itemStyle : {
                              fontSize : '15px'
                            }
                          }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>PROJECT RISK PREVIOUS MONTH ('+monthYear+')</span>'
                          },
                        })
                        chart.updateFlag = true;
                      }
                  }
        
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>PROJECT RISK PREVIOUS MONTH ('+monthYear+')</span>'
        },
        xAxis: {
            categories: catArr,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            max: 100,
            tickAmount: 5,
            title: {
                text: ''
            },
            labels: {
              format: '{value}'
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    format: '{y}%'
                },
                zones: [{
                    value: 50,
                    color: red
                },{
                    value: 70,
                    color: orange
                },{
                    color: green
                }]
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            showInLegend: false,
            data: dataArr,
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var paramYr = (allDataArr.year) ? allDataArr.year : [];
                    var paramMonth = (allDataArr.month) ? allDataArr.month : [];
                    var linkParamArr = processFilterParamArr([paramYr, paramMonth]);
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("RR", "construct_dash_conop_ra_overall", linkParamArr, "Risk Analysis");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"RR", conOpTabId:"riskAnalysisOverall", linkName:"construct_dash_conop_ra_overall", linkParam:linkParamArr, linkWinTitle: 'Risk Analysis'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            }
        }]
    });
    chart.updateFlag = true;
}

function refreshDashboard(){
    var selYear = $('#yearFilter').val();
    if (selYear == 'all') {
    	$('#monthFilter').prop("disabled", true);	
		$('#monthFilter').val('all');
    }else{
    	$('#monthFilter').prop("disabled", false);
    }
	var selMonth = $('#monthFilter').val();
    
    refreshInformation(selYear, selMonth);
}

function refreshInformation(year = 'all', month = 'all'){

    if(month != 'all'){
        month = monthTextFull[month];
    }

    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year;
    var pdpData = (riskData.pdp && riskData.pdp[year] && riskData.pdp[year][month]) ? riskData.pdp[year][month] : []; 
    var chartProbability = (pdpData.chartPbb) ? pdpData.chartPbb : []; 
    drawTimelyCompChart(chartProbability, dataYearMonth);

    var cardData = (pdpData.card && pdpData.card.overall) ? pdpData.card.overall : [];
    updateRiskCard(cardData);

    var tableData = (pdpData.tableEst) ? pdpData.tableEst : [];
    updateTablePackage(tableData)

    var speedProbability = (pdpData.chartPbb && pdpData.chartPbb.overall) ? pdpData.chartPbb.overall : [];
    drawIndexChart(speedProbability, dataYearMonth);

    var today = new Date();
    var todayYear;
    var todayMonth;
    var previousMonth;
    var yearPrev;
    if(year == 'all'){
        todayYear = today.getFullYear();
        todayMonth = monthFulltext[today.getMonth() + 1];
        previousMonth = monthFulltext[today.getMonth()];
        yearPrev = todayYear
        if(todayMonth == "January"){
            yearPrev = parseInt(todayYear) - 1;
        }
    }
    if(year != 'all'){
        todayYear = year;

        if(month != 'all'){
            todayMonth = month;
            previousMonth = monthPrev[month];
            yearPrev = year;

            if(month == "January"){
                yearPrev = parseInt(year) - 1;
            }
        }
    }

    var topRisk = (riskData.pdp && riskData.pdp[todayYear] && riskData.pdp[todayYear][todayMonth] && riskData.pdp[todayYear][todayMonth].chartRisk && riskData.pdp[todayYear][todayMonth].chartRisk.projectRisk) ? riskData.pdp[todayYear][todayMonth].chartRisk.projectRisk : []; 
    drawTopRiskChart(topRisk, dataYearMonth);

    var topPrevData = (riskData.pdp && riskData.pdp[yearPrev] && riskData.pdp[yearPrev][previousMonth] && riskData.pdp[yearPrev][previousMonth].chartRisk && riskData.pdp[yearPrev][previousMonth].chartRisk.projectRisk) ? riskData.pdp[yearPrev][previousMonth].chartRisk.projectRisk : []; 
    drawTopRiskChartPrev(topPrevData, dataYearMonth)

    var pdpHistData = (riskData && riskData.pdpODAHistogram) ? riskData.pdpODAHistogram : [];
    drawProjPDPDurChart(pdpHistData, dataYearMonth);
}

function refreshFromv3 (filterArr){
    var year = filterArr.year;
    var month = filterArr.month;
  
    refreshInformation(year, month);
}

$(document).ready(function(){
	$.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "risk"
        },
        success: function (obj) {
        	if (obj.status && obj.status == 'ok') {
                riskData = obj.data;
                refreshInformation();
        	}
        },
        complete: function (){
            window.parent.postMessage({functionName: 'loaderajaxEnd'})
        }
    });
})