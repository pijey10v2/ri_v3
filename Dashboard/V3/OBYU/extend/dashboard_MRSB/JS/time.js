var timeData;
var monthHalftext = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};
var textMonthtoNum = {"Jan":"1","Feb":"2","Mar":"3","Apr":"4","May":"5","Jun":"6","Jul":"7","Aug":"8","Sep":"9","Oct":"10","Nov":"11","Dec":"12"};

function drawFinSCurve(data, showLateInfo = true, monthYear) {
    var finPlan = [];
    var finActual = [];
    var monthYear = [];
    var seriesArr = [];
    var lightGreen;
    var red;

    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            monthYear.push(idx);
            finPlan.push((ele.finPlan) ? parseFloat(ele.finPlan) : 0);
            finActual.push(parseFloat(ele.finActual));
        }
    }

    if(localStorage.ui_pref == "ri_v3"){
        lightGreen = Highcharts.getOptions().colors[1];
        red = Highcharts.getOptions().colors[7];
    }else{
        lightGreen = 'lightGreen';
        red = 'red';
    }

    seriesArr = [{
        name: 'Planned',
        data: finPlan,
        color: lightGreen
    }, {
        name: 'Actual',
        data: finActual,
        color: red
    }];
    

    var chart = Highcharts.chart('finScurve', {
        chart: {
            type: 'line',
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Time Management<br>'+localStorage.p_name+'<br>FINANCIAL PROGRESS ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Time Management<br>'+localStorage.p_name+'<br>FINANCIAL PROGRESS ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Time Management<br>'+localStorage.p_name+'<br>FINANCIAL PROGRESS ('+monthYear+')</span>'
        },
        xAxis: {
            categories: monthYear
        },
        yAxis: {
            min: 0,
            max: 100,
            tickAmount: 6,
            title: {
                text: ''
            },
            labels: {
                format: '{value}%'
            }
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                }
            }
        },
        series: seriesArr,
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        },
        credits: false
    });
    chart.updateFlag = true;
}

function drawPhySCurve(data, monthYear) {
    var phyPlan = [];
    var phyAct = [];
    var monthYear = [];
    var seriesArr = [];
    var lightGreen;
    var red;

    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            monthYear.push(idx);
            phyPlan.push((ele.phyPlan) ? parseFloat(ele.phyPlan) : 0);
            phyAct.push(parseFloat(ele.phyAct));
        }
    }

    if(localStorage.ui_pref == "ri_v3"){
        lightGreen = Highcharts.getOptions().colors[1];
        red = Highcharts.getOptions().colors[7];
    }else{
        lightGreen = 'lightGreen';
        red = 'red';
    }

    seriesArr = [{
        name: 'Planned',
        data: phyPlan,
        color: lightGreen
    }, {
        name: 'Actual',
        data: phyAct,
        color: red
    }];

    var chart = Highcharts.chart('phyScurve', {
        chart: {
            type: 'line',
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Time Management<br>'+localStorage.p_name+'<br>PHYSICAL PROGRESS ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Time Management<br>'+localStorage.p_name+'<br>PHYSICAL PROGRESS ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Time Management<br>'+localStorage.p_name+'<br>PHYSICAL PROGRESS ('+monthYear+')</span>'
        },
        xAxis: {
            categories: monthYear
        },
        yAxis: {
            min: 0,
            max: 100,
            tickAmount: 6,
            title: {
                text: ''
            },
            labels: {
                format: '{value}%'
            }
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                }
            }
        },
        series: seriesArr,
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        },
        credits: false
    });
    chart.updateFlag = true;
}

function populateTableData(data) {
    let projectTbHTML = '';
    $("#projectTBody").html("");
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            projectTbHTML += '<tr>'
            projectTbHTML += '<td>' + ((ele.project_id)?(ele.project_id):'') + '</td>'
            projectTbHTML += '<td>' + ((ele.original_contract_sum)? formatCurrency(ele.original_contract_sum) :'') + '</td>'
            projectTbHTML += '<td>' + ((ele.start_date)?(ele.start_date):'') + '</td>'
            projectTbHTML += '<td>' + ((ele.end_date)?(ele.end_date):'') + '</td>'
            projectTbHTML += '<td>' + ((ele.duration)?(ele.duration):'') + '</td>'
            projectTbHTML += '<td>' + ((ele.time_elapse)?(ele.time_elapse):0) + '</td>'
            projectTbHTML += '<td>' + ((ele.remain_dur)?(ele.remain_dur):0) + '</td>'
            projectTbHTML += '<td>' + (ele.planned_progress) + '</td>'
            projectTbHTML += '<td>' + (ele.actual_progress) + '</td>'
            projectTbHTML += '</tr>';
        }
    }
    $("#projectTBody").html(projectTbHTML);
}

function drawSideDiaryWeatherCharts(data, divId, monthYear) {
    // sideDiaryWeatherCharts
    let seriesArr = [];
    if (data) {
        if (data.val) {
            for (const [idx, ele] of Object.entries(data.val)) {
                let dt = {allData:data, name: idx, y: parseFloat(ele) };
                seriesArr.push(dt)
            }
        }
    }
    var chart = Highcharts.chart(divId, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Time Management<br>'+localStorage.p_name+'<br>WEATHER RECORDS ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Time Management<br>'+localStorage.p_name+'<br>WEATHER RECORDS ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Time Management<br>'+localStorage.p_name+'<br>WEATHER RECORDS ('+monthYear+')</span>'
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b><br>{point.y} hrs'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            floating: false,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || 'white',
            borderColor: '#CCC',
            borderWidth: 0,
            shadow: false,
            itemStyle: {
                fontSize: '8px',
                color: '#000000',
                fontWeight: 'bold'
            }
        },
        credits: false,
        series: [{
            name: 'Weather',
            colorByPoint: true,
            data: seriesArr,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var dateFrom = (event.point.allData && event.point.allData.dateFrom) ? event.point.allData.dateFrom : '';
                    var dateTo = (event.point.allData && event.point.allData.dateTo) ? event.point.allData.dateTo : '';
                    var linkParamArr = processFilterParamArr([dateFrom,dateTo]);
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("SDL", "construct_dash_conop_sdl", linkParamArr, "Site Diary - Weather");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"SDL", conOpTabId:"conopTab7", linkName:"construct_dash_conop_sdl", linkParam:linkParamArr, linkWinTitle: 'Site Diary'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            }
        }]
    });
    chart.updateFlag = true;
}

function drawMachineryCharts(data, monthYear) {
    var tempCatArr = [];
    var tempDataPlanArr = [];
    var tempDataActArr = [];
    var green;
    var blue;

    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            tempCatArr.push(idx);
            tempDataPlanArr.push({allData:ele,y:parseFloat((ele.planned && ele.planned.average)?ele.planned.average:0)});
            tempDataActArr.push({allData:ele,y:parseFloat(ele.actual)});
        }
    }
    var tempDataPlanArr = tempDataPlanArr.reverse();
    var tempDataActArr = tempDataActArr.reverse();
    var catArr = tempCatArr.reverse();

    if(localStorage.ui_pref == "ri_v3"){
        green = Highcharts.getOptions().colors[2];
        blue = Highcharts.getOptions().colors[11];
    }else{
        green = 'Green';
        blue = 'Blue';
    }

    var chart = Highcharts.chart('machineryChart', {
        chart: {
            type: 'column',
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Time Management<br>'+localStorage.p_name+'<br>PLANT & MACHINERIES ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Time Management<br>'+localStorage.p_name+'<br>PLANT & MACHINERIES ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Time Management<br>'+localStorage.p_name+'<br>PLANT & MACHINERIES ('+monthYear+')</span>'
        },
        xAxis: {
            categories: catArr,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Planned',
            data: tempDataPlanArr,
            color: green,
            showInLegend: true,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var dateFrom = (event.point.allData && event.point.allData.dateFrom) ? event.point.allData.dateFrom : '';
                    var dateTo = (event.point.allData && event.point.allData.dateTo) ? event.point.allData.dateTo : '';
                    var linkParamArr = processFilterParamArr([dateFrom,dateTo]);
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("SDL", "construct_dash_conop_sdl", linkParamArr, "Site Diary - Plant & Machineries : Planned");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"SDL", conOpTabId:"conopTab7", linkName:"construct_dash_conop_sdl", linkParam:linkParamArr, linkWinTitle: 'Site Diary'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            }
        },
        {
            name: 'Actual',
            data: tempDataActArr,
            color: blue,
            showInLegend: true,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var dateFrom = (event.point.allData && event.point.allData.dateFrom) ? event.point.allData.dateFrom : '';
                    var dateTo = (event.point.allData && event.point.allData.dateTo) ? event.point.allData.dateTo : '';
                    var linkParamArr = processFilterParamArr([dateFrom,dateTo]);
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("SDL", "construct_dash_conop_sdl", linkParamArr, "Site Diary - Plant & Machineries : Actual");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"SDL", conOpTabId:"conopTab7", linkName:"construct_dash_conop_sdl", linkParam:linkParamArr, linkWinTitle: 'Site Diary'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            }
        }],
        credits: false
    });
    chart.updateFlag = true;
}

function drawWorkerCharts(data, monthYear) {
    var tempCatArr = [];
    var tempDataPlanArr = [];
    var tempDataActArr = [];
    var green;
    var blue;
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            tempCatArr.push(idx);
            tempDataPlanArr.push({allData:ele,y:parseFloat((ele.planned && ele.planned.average)?ele.planned.average:0)});
            tempDataActArr.push({allData:ele,y:parseFloat(ele.actual)});
        }
    }

    if(localStorage.ui_pref == "ri_v3"){
        green = Highcharts.getOptions().colors[2];
        blue = Highcharts.getOptions().colors[11];
    }else{
        green = 'Green';
        blue = 'Blue';
    }

    var tempDataPlanArr = tempDataPlanArr.reverse();
    var tempDataActArr = tempDataActArr.reverse();
    var catArr = tempCatArr.reverse();
    var chart = Highcharts.chart('workerChart', {
        chart: {
            type: 'column',
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Time Management<br>'+localStorage.p_name+'<br>MANPOWER ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Time Management<br>'+localStorage.p_name+'<br>MANPOWER ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Time Management<br>'+localStorage.p_name+'<br>MANPOWER ('+monthYear+')</span>'
        },
        xAxis: {
            categories: catArr,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Planned',
            data: tempDataPlanArr,
            color: green,
            showInLegend: true,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var dateFrom = (event.point.allData && event.point.allData.dateFrom) ? event.point.allData.dateFrom : '';
                    var dateTo = (event.point.allData && event.point.allData.dateTo) ? event.point.allData.dateTo : '';
                    var linkParamArr = processFilterParamArr([dateFrom,dateTo]);
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("SDL", "construct_dash_conop_sdl", linkParamArr, "Site Diary - Manpower : Planned");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"SDL", conOpTabId:"conopTab7", linkName:"construct_dash_conop_sdl", linkParam:linkParamArr, linkWinTitle: 'Site Diary'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            }
        },
        {
            name: 'Actual',
            data: tempDataActArr,
            color: blue,
            showInLegend: true,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var dateFrom = (event.point.allData && event.point.allData.dateFrom) ? event.point.allData.dateFrom : '';
                    var dateTo = (event.point.allData && event.point.allData.dateTo) ? event.point.allData.dateTo : '';
                    var linkParamArr = processFilterParamArr([dateFrom,dateTo]);
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("SDL", "construct_dash_conop_sdl", linkParamArr, "Site Diary - Manpower : Actual");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"SDL", conOpTabId:"conopTab7", linkName:"construct_dash_conop_sdl", linkParam:linkParamArr, linkWinTitle: 'Site Diary'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            }
        }],
        credits: false
    });
    chart.updateFlag = true;
}

function updateContractCard(data) {
    var commenceDate = (data.loa_date) ? data.loa_date : 'N/A';
    var contractAmt = (data.new_amount) ? formatCurrency(data.new_amount) : ((data.original_amount) ? formatCurrency(data.original_amount) : 'N/A');
    var contractDur = (data.new_duration) ? parseFloat(data.new_duration) : ((data.original_duration) ? parseFloat(data.original_duration) : 'N/A');
    var revisedCompletionDateCard = (data.revised_completion_date) ? data.revised_completion_date : 'N/A';
    var SPDateCard = (data.site_possession_date) ? data.site_possession_date : 'N/A';
    var LOADateCard = (data.loa_date) ? data.loa_date : 'N/A';
    var EOTCard = (data.extension_of_time) ? data.extension_of_time : 'N/A';
    var clientCard = (data.contractee) ? data.contractee : 'N/A';

    $("#contractClientCard").html(clientCard);
    $("#contractAmountCard").html(contractAmt);
    $("#contractLADateCard").html(LOADateCard);
    $("#contractSPDateCard").html(SPDateCard);
    $("#contractCompDateCard").html(revisedCompletionDateCard);
    $("#contractEOTCard").html(EOTCard);
    $("#contractDurationCard").html(contractDur);
    $("#contractCommenceCard").html(commenceDate);
}
function refreshInformation(projid = 'overall', secId = 'overall', yr = false, mth = false) {
    if(yr == 'all'){
        yr = '';
        mth = '';
    }
    else{
        if(mth == 'all'){
            mth = '';
        }
    }

    var dataYearMonth = "Month:" +mth+ " - " + "Year:" +yr;
    if (!yr || !mth) {
        var currDateObj = new Date();
        var currDay = parseInt(currDateObj.getDate());
        var currMth = parseInt(currDateObj.getMonth())+1;
        var currYr = parseInt(currDateObj.getFullYear());
        var cutOffDay = (timeData.info && timeData.info.cut_off_day && timeData.info.cut_off_day[projid]) ? parseInt(timeData.info.cut_off_day[projid]) : 25;

        if(currDay <= cutOffDay){
            currMth = currMth -1;
            if(currMth == 0){
                currMth = 12;
                currYr = currYr-1;
            }
        }
        yr = (yr) ? yr : currYr;
        mth = (mth) ? mth : currMth;
    }
    // scurve
    var sCurveData = (timeData.progress && timeData.progress[projid] && timeData.progress[projid][secId]) ? timeData.progress[projid][secId] : [];
    var sCurveDataByMthYr = (sCurveData.byMonYr) ? sCurveData.byMonYr : [];
    drawFinSCurve(sCurveDataByMthYr ,dataYearMonth);
    drawPhySCurve(sCurveDataByMthYr ,dataYearMonth);
    
    var tbData = (timeData.info && timeData.info[projid] && timeData.info[projid][yr] && timeData.info[projid][yr][mth]) ? timeData.info[projid][yr][mth] : [];
    populateTableData(tbData);
    
    // weather data
    var sdMth = mth;
    var sdYr = yr;
    var mthStr = String(sdMth).padStart(2, '0');
    var sdData = (timeData.sd && timeData.sd[projid] && timeData.sd[projid] && timeData.sd[projid][secId]) ? timeData.sd[projid][secId] : [];
    var sdDataWeather = (sdData.weather && sdData.weather[sdYr] && sdData.weather[sdYr][mthStr]) ? sdData.weather[sdYr][mthStr] : [];
    drawSideDiaryWeatherCharts(sdDataWeather, 'sideDiaryWeatherCharts', dataYearMonth);
   
    // machinery data
    var machineryMth = mth;
    var machineryYr = yr;
    var monthFulltext = {1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"}

    var sdDataWorker = (sdData.manpower) ? sdData.manpower : [];
    var sdDataMachinery = (sdData.machinery) ? sdData.machinery : [];
    var tempSdMachinery = [];
    var tempSdWorker = [];

    var defArr = {"planned":{average :0}, "actual":0};
    for (var i = 5; i >= 0; i--) {
        machineryMthStr = String(machineryMth).padStart(2, '0');
        tempSdMachinery[monthFulltext[machineryMth]] = (sdDataMachinery[machineryYr] && sdDataMachinery[machineryYr][machineryMthStr]) ? sdDataMachinery[machineryYr][machineryMthStr] : defArr;
        tempSdWorker[monthFulltext[machineryMth]] = (sdDataWorker[machineryYr] && sdDataWorker[machineryYr][machineryMthStr]) ? sdDataWorker[machineryYr][machineryMthStr] : defArr;
        machineryMth = machineryMth-1;
        if (machineryMth == 0) {
            machineryMth = 12;
            machineryYr = machineryYr - 1;
        }
    }

    drawMachineryCharts(tempSdMachinery, dataYearMonth);
    drawWorkerCharts(tempSdWorker, dataYearMonth);
}

function refreshDashboard() {
    var selWPC = $("#wpcFilter").val();
    var selSection = $("#sectionFilter").val();
    var selYr = $("#yearFilter").val();

    if (selYr == 'all') {
    	$('#monthFilter').prop("disabled", true);	
		$('#monthFilter').val('all');
    }else{
    	$('#monthFilter').prop("disabled", false);
    }

    var selMonth = $("#monthFilter").val();

    // check if data has been fetch, if not refetch
    if (selYr != 'all' && selMonth != 'all' && timeData.sd && timeData.sd.sys && timeData.sd.sys.data) {
        var fetchedDateArr = timeData.sd.sys.data;
        if (selMonth < 7) {
            minusMth = 12-(6-selMonth);
            minusYr = selYr-1;
        }else{
            minusMth = selMonth-6;
            minusYr = selYr;
        }

        if (fetchedDateArr[minusYr+"-"+String(minusMth).padStart(2, '0')] === undefined || fetchedDateArr[selYr+"-"+String(selMonth).padStart(2, '0')] === undefined) {
            updateAndRefreshData(selWPC, selSection, selYr, selMonth, selYr, selMonth);
        }else{
            refreshInformation(selWPC, selSection, selYr, selMonth);
        }
    }else{
        refreshInformation(selWPC, selSection, selYr, selMonth);
    }

}

function updateAndRefreshData(selWPC, selSection, yr, mth, selYr, selMonth){
    if (!timeData) return;

    $.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "time",
            function: "updateInfo",
            year: yr,
            month: mth,
        },
        success: function (obj) {
            if (obj.status && obj.status == 'ok') {
                timeData.sd = MergeRecursive(timeData.sd, obj.data.sd)
                timeData.info = MergeRecursive(timeData.info, obj.data.info)
                refreshInformation(selWPC, selSection, selYr, selMonth);
            }
        }
    });
}
// https://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
function MergeRecursive(obj1, obj2) {
  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if ( obj2[p].constructor==Object ) {
        obj1[p] = MergeRecursive(obj1[p], obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }
    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];
    }
  }
  return obj1;
}

function refreshFromv3 (filterArr){
    var wpc = filterArr.wpc;
    var year = filterArr.year;
    var month = filterArr.month;
    var section = filterArr.section;

    refreshInformation(wpc, section, year, textMonthtoNum[month]);
}

$(function () {
    // load all the chart
    $.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "time"
        },
        success: function (obj) {
            if (obj.status && obj.status == 'ok') {
                timeData = obj.data;
                refreshInformation();
            }
        },
        complete: function (){
            window.parent.postMessage({functionName: 'loaderajaxEnd'})
        }
    });
    $('.scrollbar-inner').scrollbar();
})