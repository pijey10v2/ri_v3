var qaqcData;
var monthHalftext = {0:"Dec",1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};
var monthPrev = {"Jan":"Dec","Feb":"Jan","Mar":"Feb","Apr":"Mar","May":"Apr","Jun":"May","Jul":"Jun","Aug":"Jul","Sep":"Aug","Oct":"Sep","Nov":"Oct","Dec":"Nov"};


function drawWorkDiscipline(data, monthYear) {
    var catArr = [];
    var dataArr = [];
    var colorArr;
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            if(idx == '') continue;
            catArr.push(idx);
            var tempArr = { name: idx, y: (ele.val) ? ele.val : 0, allData : (ele.allData) ? ele.allData : []};
            dataArr.push(tempArr);
        }
    }

    if(localStorage.ui_pref == 'ri_v3'){
        colorArr = {
                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                        stops: [
                            [0, '#003399'],
                            [1, '#3366AA']
                        ]
                   }
    }else{
        colorArr = ['#69ffb6', '#69ebff', '#696eff', '#de69ff', '#ff69c3', '#ff6969','#ff6969', '#ffcb69', '#f8ff69', '#b6fc65']
    }

    var chart = Highcharts.chart('workDiscipline', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management<br>'+localStorage.p_name+'<br>NCR WORK DISCIPLINE ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Quality Management<br>'+localStorage.p_name+'<br>NCR WORK DISCIPLINE ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Quality Management<br>'+localStorage.p_name+'<br>NCR WORK DISCIPLINE ('+monthYear+')</span>'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: catArr
        },
        yAxis: {
            allowDecimals: false,
            min: 0,
            tickAmount: 5,
            title: {
                enabled: false
            },
            labels: {
                format:'{value}'
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
        legend: {
            enabled: false
        },
        plotOptions: {
            column: {
                pointPadding: 0.5,
                borderWidth: 0
            },
            series: {
                dataLabels: {
                    enabled: true,
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            colorByPoint: true,
            name: '',
            data: dataArr,
            color: colorArr,
            pointWidth: 15,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var paramSubDisc = (allDataArr.subDicipline) ? allDataArr.subDicipline : '';
                    var paramFromDt = (allDataArr.dateFrom) ? allDataArr.dateFrom : '';
                    var paramToDt = (allDataArr.dateTo) ? allDataArr.dateTo : '';
                    var linkParamArr = processFilterParamArr(["", "Quality", paramSubDisc, paramFromDt, paramToDt, ""]);

                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr", linkParamArr, "Non Conformance Report - " + event.point.name);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr", linkParam:linkParamArr, linkWinTitle: 'NCR'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            } 
        }]
    });
    chart.updateFlag = true;
}

function drawNcrAgeing(data, monthYear){
    var catArr = [];
    var dataArr14 = [];
    var dataArr60 = [];
    var dataArr100 = [];
    var dataArrmore100 = [];
    var color1;
    var color2;
    var color3;
    var color4;

    if(data){
        for (const [idx, ele] of Object.entries(data)) {
            if(idx == "") continue;
            catArr.push(idx);
            dataArr14.push({y: (ele.less14 && ele.less14.val) ? ele.less14.val : 0, allData: (ele.less14 && ele.less14.allData) ? ele.less14.allData : []});
            dataArr60.push({y: (ele.less60 && ele.less60.val) ? ele.less60.val : 0, allData: (ele.less14 && ele.less60.allData) ? ele.less60.allData : []});
            dataArr100.push({y: (ele.less100 && ele.less100.val) ? ele.less100.val : 0, allData: (ele.less14 && ele.less100.allData) ? ele.less100.allData : []});
            dataArrmore100.push({y: (ele.more100 && ele.more100.val) ? ele.more100.val : 0, allData: (ele.less14 && ele.more100.allData) ? ele.more100.allData : []});
        }
    }

    if(localStorage.ui_pref == 'ri_v3'){
        color1 = Highcharts.getOptions().colors[7];
        color2 = Highcharts.getOptions().colors[6];
        color3 = Highcharts.getOptions().colors[3];
        color4 = Highcharts.getOptions().colors[1];
    }else{
        color1 = '#E93232';
        color2 = '#FF7F50';
        color3 = '#F4D03F';
        color4 = '#52BE80';
    }

    var chart = Highcharts.chart('ncrAge', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management<br>'+localStorage.p_name+'<br>NCR AGEING ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Quality Management<br>'+localStorage.p_name+'<br>NCR AGEING ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Quality Management<br>'+localStorage.p_name+'<br>NCR AGEING ('+monthYear+')</span>'
        },
        xAxis: {
            categories: catArr
        },
        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: ''
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: ( // theme
                        Highcharts.defaultOptions.title.style &&
                        Highcharts.defaultOptions.title.style.color
                    ) || 'gray'
                }
            }
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    verticalAlign: 'top',
                    color: 'black',
                    formatter: function(){
                        var val = this.y;
                        if (val == 0) {
                            return '';
                        }
                        return val;
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        series: [{
            name: '>100 days',
            data: dataArrmore100,
            color: color1,
            pointWidth: 15,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var packageFilter = (event.point.category) ? event.point.category : [];
                    var paramFromDt = (allDataArr.dateFrom) ? allDataArr.dateFrom : '';
                    var paramToDt = (allDataArr.dateTo) ? allDataArr.dateTo : '';
                    var linkParamArr = (localStorage.isParent && localStorage.isParent == 'isParent') ? [packageFilter, "", "Quality", "", paramFromDt, paramToDt, "Pending"] : ["", "Quality", "", paramFromDt, paramToDt, "Pending"] ;
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr", linkParamArr, "Non Conformance Report - " + event.point.category);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr", linkParam:linkParamArr, linkWinTitle: 'NCR'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            } 
        }, {
            name: '>60-100 days',
            data: dataArr100,
            color: color2,
            pointWidth: 15,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var packageFilter = (event.point.category) ? event.point.category : [];
                    var paramFromDt = (allDataArr.dateFrom) ? allDataArr.dateFrom : '';
                    var paramToDt = (allDataArr.dateTo) ? allDataArr.dateTo : '';
                    var linkParamArr = (localStorage.isParent && localStorage.isParent == 'isParent') ? [packageFilter, "", "Quality", "", paramFromDt, paramToDt, "Pending"] : ["", "Quality", "", paramFromDt, paramToDt, "Pending"] ;
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr", linkParamArr, "Non Conformance Report - " + event.point.category);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr", linkParam:linkParamArr, linkWinTitle: 'NCR'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            } 
        }, {
            name: '>14-60 days',
            data: dataArr60,
            color: color3,
            pointWidth: 15,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var packageFilter = (event.point.category) ? event.point.category : [];
                    var paramFromDt = (allDataArr.dateFrom) ? allDataArr.dateFrom : '';
                    var paramToDt = (allDataArr.dateTo) ? allDataArr.dateTo : '';
                    var linkParamArr = (localStorage.isParent && localStorage.isParent == 'isParent') ? [packageFilter, "", "Quality", "", paramFromDt, paramToDt, "Pending"] : ["", "Quality", "", paramFromDt, paramToDt, "Pending"] ;
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr", linkParamArr, "Non Conformance Report - " + event.point.category);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr", linkParam:linkParamArr, linkWinTitle: 'NCR'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            } 
        }, {
            name: '<14 days',
            data: dataArr14,
            color: color4,
            pointWidth: 15,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var packageFilter = (event.point.category) ? event.point.category : [];
                    var paramFromDt = (allDataArr.dateFrom) ? allDataArr.dateFrom : '';
                    var paramToDt = (allDataArr.dateTo) ? allDataArr.dateTo : '';
                    var linkParamArr = (localStorage.isParent && localStorage.isParent == 'isParent') ? [packageFilter, "", "Quality", "", paramFromDt, paramToDt, "Pending"] : ["", "Quality", "", paramFromDt, paramToDt, "Pending"] ;
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr", linkParamArr, "Non Conformance Report - " + event.point.category);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr", linkParam:linkParamArr, linkWinTitle: 'NCR'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            } 
        }]
    });
    chart.updateFlag = true;
}

function drawClassifyNOI(data, idChart, monthYear) {
    var dataArr = [];
    var colorArr;
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            if(idx == '')continue;
            var tempArr = { name: idx, y: (ele.val) ? ele.val : 0, allData : (ele.allData) ? ele.allData : []};
            dataArr.push(tempArr);
        }
    }

    if(localStorage.ui_pref == 'ri_v3'){
        colorArr = {
                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                        stops: [
                            [0, '#003399'],
                            [1, '#3366AA']
                        ]
                   }
    }else{
        colorArr = ['#fc6f65', '#fcd465', '#b6fc65', '#65fc74', '#65fcd9', '#65abfc', '#9765fc', '#ed65fc', '#fc658b']
    }

    var chart = Highcharts.chart(idChart, {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management<br>'+localStorage.p_name+'<br>NOI CLASSIFICATION ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Quality Management<br>'+localStorage.p_name+'<br>NOI CLASSIFICATION ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Quality Management<br>'+localStorage.p_name+'<br>NOI CLASSIFICATION ('+monthYear+')</span>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        legend: {
            itemStyle: {
                fontSize: '10px',
                fontWeight: 'normal'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.percentage:.1f}%',
                    distance: 10,
                },
                showInLegend: true
            }
        },
        credits: false,
        series: [{
            colorByPoint: true,
            name: 'Classification',
            data: dataArr,
            color: colorArr,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var paramClassIf = (allDataArr.classification) ? allDataArr.classification : '';
                    var paramFromDt = (allDataArr.dateFrom) ? allDataArr.dateFrom : '';
                    var paramToDt = (allDataArr.dateTo) ? allDataArr.dateTo : '';
                    var linkParamArr = processFilterParamArr([paramClassIf, paramFromDt, paramToDt, ""]);
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NOI", "construct_dash_conop_qaqc_noi", linkParamArr, "Notice of Improvement - " + event.point.name);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NOI", conOpTabId:"conopTab14", linkName:"construct_dash_conop_qaqc_noi", linkParam:linkParamArr, linkWinTitle: 'NOI'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            } 
        }]
    });
    chart.updateFlag = true;
}

function drawClassifyNCR(data, idChart, monthYear) {
    var dataArr = [];
    var colorArr;

    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = { name: idx, y: (ele.val) ? ele.val : 0, allData: (ele.allData) ? ele.allData : [] };
            dataArr.push(tempArr);
        }
    }

    if(localStorage.ui_pref == 'ri_v3'){
        colorArr = {
                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                        stops: [
                            [0, '#003399'],
                            [1, '#3366AA']
                        ]
                   }
    }else{
        colorArr = ['#fc6f65', '#fcd465', '#b6fc65', '#65fc74', '#65fcd9', '#65abfc', '#9765fc', '#ed65fc', '#fc658b']
    }

    var chart = Highcharts.chart(idChart, {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management<br>'+localStorage.p_name+'<br>NCR CLASSIFICATION ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Quality Management<br>'+localStorage.p_name+'<br>NCR CLASSIFICATION ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Quality Management<br>'+localStorage.p_name+'<br>NCR CLASSIFICATION ('+monthYear+')</span>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        legend: {
            itemStyle: {
                fontSize: '10px',
                fontWeight: 'normal'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.percentage:.1f}%',
                    distance: 10,
                },
                showInLegend: true
            }
        },
        credits: false,
        series: [{
            colorByPoint: true,
            name: 'Classification',
            data: dataArr,
            color: colorArr,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var paramClassIf = (allDataArr.classification) ? allDataArr.classification : '';
                    var paramDisp = (allDataArr.dicipline) ? allDataArr.dicipline : '';
                    var paramFromDt = (allDataArr.dateFrom) ? allDataArr.dateFrom : '';
                    var paramToDt = (allDataArr.dateTo) ? allDataArr.dateTo : '';
                    var linkParamArr = processFilterParamArr([paramClassIf, paramDisp, "", paramFromDt, paramToDt, ""]);
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr", linkParamArr, "Non Conformance Report - " + event.point.name);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr", linkParam:linkParamArr, linkWinTitle: 'NCR'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            } 
        }]
    });
    chart.updateFlag = true;
}

function openConOpDashboardNCR(paramStatus, paramFromDt, paramToDt, cardName){
    var linkParamArr = processFilterParamArr(["", "Quality", "", paramFromDt, paramToDt, paramStatus, ""]);
    
    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr", linkParamArr, "Non Conformance Report - " + cardName);
    }else{
        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr", linkParam:linkParamArr, linkWinTitle: 'NCR'};
        parent.postMessage(postParam ,"*");
    }
}

function updateCardNCR(data, data2, data3){
    var prevNCRVal = (data3.current && data3.current.val) ? data3.current.val : 0;
    var prevNCRAllData = (data3.current && data3.current.allData) ? data3.current.allData : [];
    var prevNCRFilterStatus = (prevNCRAllData.status) ? prevNCRAllData.status : '';
    var prevNCRFilterFromDt = (prevNCRAllData.dateFrom) ? prevNCRAllData.dateFrom : '';
    var prevNCRFilterToDt = (prevNCRAllData.dateTo) ? prevNCRAllData.dateTo : '';
    var prevNCRHtml = prevNCRVal;
    if(prevNCRVal != 0){
        var prevNCRHtml = "<span onclick='openConOpDashboardNCR(\""+prevNCRFilterStatus+"\",\""+prevNCRFilterFromDt+"\",\""+prevNCRFilterToDt+"\", \"Previous Month\");'>"+prevNCRVal+"<span/>";
    }
    $("#prevNCR").html(prevNCRHtml);

    var currNCRVal = (data2.current && data2.current.val) ? data2.current.val : 0;
    var currNCRAllData = (data2.current && data2.current.allData) ? data2.current.allData : [];
    var currNCRFilterStatus = (currNCRAllData.status) ? currNCRAllData.status : '';
    var currNCRFilterFromDt = (currNCRAllData.dateFrom) ? currNCRAllData.dateFrom : '';
    var currNCRFilterToDt = (currNCRAllData.dateTo) ? currNCRAllData.dateTo : '';
    var currNCRHtml = currNCRVal;
    if(currNCRVal != 0){
        currNCRHtml = "<span onclick='openConOpDashboardNCR(\""+currNCRFilterStatus+"\",\""+currNCRFilterFromDt+"\",\""+currNCRFilterToDt+"\", \"Current Month\");'>"+currNCRVal+"<span/>";
    }
    $("#currNCR").html(currNCRHtml);

    var cumulNCRVal = (data.cumulative && data.cumulative.val) ? data.cumulative.val : 0;
    var cumulNCRAllData = (data.cumulative && data.cumulative.allData) ? data.cumulative.allData : [];
    var cumulNCRFilterStatus = (cumulNCRAllData.status) ? cumulNCRAllData.status : '';
    var cumulNCRFilterFromDt = (cumulNCRAllData.dateFrom) ? cumulNCRAllData.dateFrom : '';
    var cumulNCRFilterToDt = (cumulNCRAllData.dateTo) ? cumulNCRAllData.dateTo : '';
    var cumulNCRHtml = cumulNCRVal;
    if(cumulNCRVal != 0){
        cumulNCRHtml = "<span onclick='openConOpDashboardNCR(\""+cumulNCRFilterStatus+"\",\""+cumulNCRFilterFromDt+"\",\""+cumulNCRFilterToDt+"\", \"Cumulative\");'>"+cumulNCRVal+"<span/>";
    }
    $("#cumulNCR").html(cumulNCRHtml);

    var pendNCRVal = (data.Pending && data.Pending.val) ? data.Pending.val : 0;
    var pendNCRAllData = (data.Pending && data.Pending.allData) ? data.Pending.allData : [];
    var pendNCRFilterStatus = (pendNCRAllData.status) ? pendNCRAllData.status : '';
    var pendNCRFilterFromDt = (pendNCRAllData.dateFrom) ? pendNCRAllData.dateFrom : '';
    var pendNCRFilterToDt = (pendNCRAllData.dateTo) ? pendNCRAllData.dateTo : '';
    var pendNCRHtml = pendNCRVal;
    if(pendNCRVal != 0){
        pendNCRHtml = "<span onclick='openConOpDashboardNCR(\""+pendNCRFilterStatus+"\",\"\",\""+pendNCRFilterToDt+"\", \"Pending\");'>"+pendNCRVal+"<span/>";
    }
    $("#pendNCR").html(pendNCRHtml);

    var closeNCRVal = (data.Closed && data.Closed.val) ? data.Closed.val : 0;
    var closeNCRAllData = (data.Closed && data.Closed.allData) ? data.Closed.allData : [];
    var closeNCRFilterStatus = (closeNCRAllData.status) ? closeNCRAllData.status : '';
    var closeNCRFilterFromDt = (closeNCRAllData.dateFrom) ? closeNCRAllData.dateFrom : '';
    var closeNCRFilterToDt = (closeNCRAllData.dateTo) ? closeNCRAllData.dateTo : '';
    var closeNCRHtml = closeNCRVal;
    if(closeNCRVal != 0){
        closeNCRHtml = "<span onclick='openConOpDashboardNCR(\""+closeNCRFilterStatus+"\",\"\",\""+closeNCRFilterToDt+"\", \"Closed\");'>"+closeNCRVal+"<span/>";
    }
    $("#closeNCR").html(closeNCRHtml);
}

function openConOpDashboardNOI(paramStatus, paramFromDt, paramToDt, cardName){
    var linkParamArr = processFilterParamArr(["", paramFromDt, paramToDt, paramStatus]);
    
    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("NOI", "construct_dash_conop_qaqc_noi", linkParamArr, "Notice of Improvement - " + cardName);
    }else{
        var postParam = {function:"openConOpDashboard",processType:"NOI", conOpTabId:"conopTab14", linkName:"construct_dash_conop_qaqc_noi", linkParam:linkParamArr, linkWinTitle: 'NOI'};
        parent.postMessage(postParam ,"*");
    }
}

function updateCardNOI(data, data2, data3){
    var prevNOIVal = (data3.current && data3.current.val) ? data3.current.val : 0;
    var prevNOIAllData = (data3.current && data3.current.allData) ? data3.current.allData : [];
    var prevNOIFilterStatus = (prevNOIAllData.status) ? prevNOIAllData.status : '';
    var prevNOIFilterFromDt = (prevNOIAllData.dateFrom) ? prevNOIAllData.dateFrom : '';
    var prevNOIFilterToDt = (prevNOIAllData.dateTo) ? prevNOIAllData.dateTo : '';
    var prevNOIHtml = prevNOIVal;
    if(prevNOIVal != 0){
        var prevNOIHtml = "<span onclick='openConOpDashboardNOI(\""+prevNOIFilterStatus+"\",\""+prevNOIFilterFromDt+"\",\""+prevNOIFilterToDt+"\", \"Previous Month\");'>"+prevNOIVal+"<span/>";
    }
    $("#prevNOI").html(prevNOIHtml);

    var currNOIVal = (data2.current && data2.current.val) ? data2.current.val : 0;
    var currNOIAllData = (data2.current && data2.current.allData) ? data2.current.allData : [];
    var currNOIFilterStatus = (currNOIAllData.status) ? currNOIAllData.status : '';
    var currNOIFilterFromDt = (currNOIAllData.dateFrom) ? currNOIAllData.dateFrom : '';
    var currNOIFilterToDt = (currNOIAllData.dateTo) ? currNOIAllData.dateTo : '';
    var currNOIHtml = currNOIVal;
    if(currNOIVal != 0){
        currNOIHtml = "<span onclick='openConOpDashboardNOI(\""+currNOIFilterStatus+"\",\""+currNOIFilterFromDt+"\",\""+currNOIFilterToDt+"\", \"Current Month\");'>"+currNOIVal+"<span/>";
    }
    $("#currNOI").html(currNOIHtml);
    
    var cumulNOIVal = (data.cumulative && data.cumulative.val) ? data.cumulative.val : 0;
    var cumulNOIAllData = (data.cumulative && data.cumulative.allData) ? data.cumulative.allData : [];
    var cumulNOIFilterStatus = (cumulNOIAllData.status) ? cumulNOIAllData.status : '';
    var cumulNOIFilterFromDt = (cumulNOIAllData.dateFrom) ? cumulNOIAllData.dateFrom : '';
    var cumulNOIFilterToDt = (cumulNOIAllData.dateTo) ? cumulNOIAllData.dateTo : '';
    var cumulNOIHtml = cumulNOIVal;
    if(cumulNOIVal != 0){
        cumulNOIHtml = "<span onclick='openConOpDashboardNOI(\""+cumulNOIFilterStatus+"\",\""+cumulNOIFilterFromDt+"\",\""+cumulNOIFilterToDt+"\", \"Cumulative\");'>"+cumulNOIVal+"<span/>";
    }
    $("#cumulNOI").html(cumulNOIHtml);
    
    var pendNOIVal = (data.Pending && data.Pending.val) ? data.Pending.val : 0;
    var pendNOIAllData = (data.Pending && data.Pending.allData) ? data.Pending.allData : [];
    var pendNOIFilterStatus = (pendNOIAllData.status) ? pendNOIAllData.status : '';
    var pendNOIFilterFromDt = (pendNOIAllData.dateFrom) ? pendNOIAllData.dateFrom : '';
    var pendNOIFilterToDt = (pendNOIAllData.dateTo) ? pendNOIAllData.dateTo : '';
    var pendNOIHtml = pendNOIVal;
    if(pendNOIVal != 0){
        pendNOIHtml = "<span onclick='openConOpDashboardNOI(\""+pendNOIFilterStatus+"\",\"\",\""+pendNOIFilterToDt+"\", \"Pending\");'>"+pendNOIVal+"<span/>";
    }
    $("#pendNOI").html(pendNOIHtml);

    var closeNOIVal = (data.Closed && data.Closed.val) ? data.Closed.val : 0;
    var closeNOIAllData = (data.Closed && data.Closed.allData) ? data.Closed.allData : [];
    var closeNOIFilterStatus = (closeNOIAllData.status) ? closeNOIAllData.status : '';
    var closeNOIFilterFromDt = (closeNOIAllData.dateFrom) ? closeNOIAllData.dateFrom : '';
    var closeNOIFilterToDt = (closeNOIAllData.dateTo) ? closeNOIAllData.dateTo : '';
    var closeNOIHtml = closeNOIVal;
    if(closeNOIVal != 0){
        closeNOIHtml = "<span onclick='openConOpDashboardNOI(\"Closed\",\"\",\""+closeNOIFilterToDt+"\", \"Closed\");'>"+closeNOIVal+"<span/>";
    }
    $("#closeNOI").html(closeNOIHtml);
}

function openConOpDashboardRFI(paramMth, paramYr, cardName){
    var linkParamArr = processFilterParamArr([paramYr, paramMth]);
    
    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("RFI", "construct_dash_conop_qaqc_rfi", linkParamArr, "Request For Information - " + cardName);
    }else{
        var postParam = {function:"openConOpDashboard",processType:"RFI", conOpTabId:"conopTab3", linkName:"construct_dash_conop_qaqc_rfi", linkParam:linkParamArr, linkWinTitle: 'RFI'};
        parent.postMessage(postParam ,"*");
    }
}

function updateCardRFI(data){
    var RFIAllData = (data.allData) ? data.allData : [];
    var RFIFilterMonth = (RFIAllData.month) ? RFIAllData.month : '';
    var RFIFilterYear = (RFIAllData.year) ? RFIAllData.year : '';

    var cumulRFIVal = (data.ttlSubmit) ? data.ttlSubmit : 0;
    var cumulRFIHtml = cumulRFIVal;
    if(cumulRFIVal != 0){
        cumulRFIHtml = "<span onclick='openConOpDashboardRFI(\""+RFIFilterMonth+"\",\""+RFIFilterYear+"\", \"Total Submitted\");'>"+cumulRFIVal+"<span/>";
    }
    $("#cumulRFI").html(cumulRFIHtml);

    var openRFIVal = (data.ttlOpen) ? data.ttlOpen : 0;
    var openRFIHtml = openRFIVal;
    if(openRFIVal != 0){
        openRFIHtml = "<span onclick='openConOpDashboardRFI(\""+RFIFilterMonth+"\",\""+RFIFilterYear+"\", \"Total Open\");'>"+openRFIVal+"<span/>";
    }
    $("#openRFI").html(openRFIHtml);
    
    var closeRFIVal = (data.ttlClose) ? data.ttlClose : 0;
    var closeRFIHtml = closeRFIVal;
    if(closeRFIVal != 0){
        closeRFIHtml = "<span onclick='openConOpDashboardRFI(\""+RFIFilterMonth+"\",\""+RFIFilterYear+"\", \"Total Closed\");'>"+closeRFIVal+"<span/>";
    }
    $("#closeRFI").html(closeRFIHtml);
}

function openConOpDashboardWIR(mtFilterMth, mtFilterYear, cardName){
    var linkParamArr = processFilterParamArr([mtFilterYear, mtFilterMth]);
    
    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("WIR", "construct_dash_conop_qaqc_wir", linkParamArr, "Work Inspection Request - " + cardName);
    }else{
        var postParam = {function:"openConOpDashboard",processType:"WIR", conOpTabId:"conopTab2", linkName:"construct_dash_conop_qaqc_wir", linkParam:linkParamArr, linkWinTitle: 'WIR'};
        parent.postMessage(postParam ,"*");
    }
}

function updateCardWIR(data){
    var WIRAllData = (data.allData) ? data.allData : [];
    var WIRFilterMonth = (WIRAllData.month) ? WIRAllData.month : '';
    var WIRFilterYear = (WIRAllData.year) ? WIRAllData.year : '';

    var submitWIRVal = (data.ttlSubmit) ? data.ttlSubmit : 0;
    var submitWIRHtml = submitWIRVal;
    if(submitWIRVal != 0){
        submitWIRHtml = "<span onclick='openConOpDashboardWIR(\""+WIRFilterMonth+"\",\""+WIRFilterYear+"\", \"Submitted\");'>"+submitWIRVal+"<span/>";
    }
    $("#submitWIR").html(submitWIRHtml);
    
    var approvedWIRVal = (data.ttlApproved) ? data.ttlApproved : 0;
    var approvedWIRHtml = approvedWIRVal;
    if(approvedWIRVal != 0){
        approvedWIRHtml = "<span onclick='openConOpDashboardWIR(\""+WIRFilterMonth+"\",\""+WIRFilterYear+"\", \"Approved\");'>"+approvedWIRVal+"<span/>";
    }
    $("#approvedWIR").html(approvedWIRHtml);

    var unapprovedWIRVal = (data.ttlUnApproved) ? data.ttlUnApproved : 0;
    var unapprovedWIRHtml = unapprovedWIRVal;
    if(unapprovedWIRVal != 0){
        unapprovedWIRHtml = "<span onclick='openConOpDashboardWIR(\""+WIRFilterMonth+"\",\""+WIRFilterYear+"\", \"Unapproved\");'>"+unapprovedWIRVal+"<span/>";
    }
    $("#unapprovedWIR").html(unapprovedWIRHtml);

    var cancelWIRVal = (data.ttlCancel) ? data.ttlCancel : 0;
    var cancelWIRHtml = cancelWIRVal;
    if(cancelWIRVal != 0){
        cancelWIRHtml = "<span onclick='openConOpDashboardWIR(\""+WIRFilterMonth+"\",\""+WIRFilterYear+"\", \"Cancelled\");'>"+cancelWIRVal+"<span/>";
    }
    $("#cancelWIR").html(cancelWIRHtml);

    var pendWIRVal = (data.ttlPending) ? data.ttlPending : 0;
    var pendWIRHtml = pendWIRVal;
    if(pendWIRVal != 0){
        pendWIRHtml = "<span onclick='openConOpDashboardWIR(\""+WIRFilterMonth+"\",\""+WIRFilterYear+"\", \"Pending\");'>"+pendWIRVal+"<span/>";
    }
    $("#pendWIR").html(pendWIRHtml);

    var closedWIRVal = (data.ttlClose) ? data.ttlClose : 0;
    var closedWIRHtml = closedWIRVal;
    if(closedWIRVal != 0){
        closedWIRHtml = "<span onclick='openConOpDashboardWIR(\""+WIRFilterMonth+"\",\""+WIRFilterYear+"\", \"Closed\");'>"+closedWIRVal+"<span/>";
    }
    $("#closedWIR").html(closedWIRHtml);
}

function openConOpDashboardMS(cardName, msFilterDtFrom, msFilterDtTo, msFilterApprovalCode, msFilterApprovalStatusFlag = 'no'){
    var linkParamArr = processFilterParamArr([msFilterDtFrom, msFilterDtTo, msFilterApprovalCode, msFilterApprovalStatusFlag]);
    
    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("MOS", "construct_dash_conop_qaqc_mos", linkParamArr, "Method Statement - " + cardName);
    }else{
        var postParam = {function:"openConOpDashboard",processType:"MOS", conOpTabId:"conopTab4", linkName:"construct_dash_conop_qaqc_mos", linkParam:linkParamArr, linkWinTitle: 'MS'};
        parent.postMessage(postParam ,"*");
    }
}

function updateCardMS(data, dataRec, dataAging, dataAgingCode2){
    var msAllData = (data.allData) ? data.allData : [];
    var msFilterDtFrom = (msAllData.dateFrom) ? msAllData.dateFrom : '';
    var msFilterDtTo = (msAllData.dateTo) ? msAllData.dateTo : '';

    var msAllDataCurr = (dataRec.allDataCurr) ? dataRec.allDataCurr : [];
    var msFilterDtFromCurr = (msAllDataCurr.dateFrom) ? msAllDataCurr.dateFrom : '';
    var msFilterDtToCurr = (msAllDataCurr.dateTo) ? msAllDataCurr.dateTo : '';

    var msAllDataCumul = (data.allDataCumul) ? data.allDataCumul : [];
    var msFilterDtToCumul = (msAllDataCumul.dateTo) ? msAllDataCumul.dateTo : '';

    var receivedMSVal = (dataRec.ttlSubmit) ? dataRec.ttlSubmit : 0;
    var receivedMSHtml = receivedMSVal;
    if(receivedMSVal != 0){
        receivedMSHtml = "<span onclick='openConOpDashboardMS(\"Received\", \""+msFilterDtFromCurr+"\",\""+msFilterDtToCurr+"\", \"\");'>"+receivedMSVal+"<span/>";
    }
    $("#receivedMS").html(receivedMSHtml);

    var cumulMSVal = (data.cumul) ? data.cumul : 0;
    var cumulMSHtml = cumulMSVal;
    if(cumulMSVal != 0){
        cumulMSHtml = "<span onclick='openConOpDashboardMS(\"Cumulative\", \"\",\""+msFilterDtToCumul+"\", \"\");'>"+cumulMSVal+"<span/>";
    }
    $("#cumulMS").html(cumulMSHtml);

    var reviewMSVal = (data.totalNoCode) ? data.totalNoCode : 0;
    var reviewMSHtml = reviewMSVal;
    if(reviewMSVal != 0){
        reviewMSHtml = "<span onclick='openConOpDashboardMS(\"Under Review\", \""+msFilterDtFrom+"\",\""+msFilterDtTo+"\", \"\", \"yes\");'>"+reviewMSVal+"<span/>";
    }
    $("#reviewMS").html(reviewMSHtml);

    var code1MSVal = (data['Code 1: Approved']) ? data['Code 1: Approved'] : 0;
    var code1MSHtml = code1MSVal;
    if(code1MSVal != 0){
        code1MSHtml = "<span onclick='openConOpDashboardMS(\"Code 1\", \""+msFilterDtFrom+"\",\""+msFilterDtTo+"\", \"Code 1: Approved\");'>"+code1MSVal+"<span/>";
    }
    $("#code1MS").html(code1MSHtml);

    var code2MSVal = (data['Code 2: Approved with Comment']) ? data['Code 2: Approved with Comment'] : 0;
    var code2MSHtml = code2MSVal;
    if(code2MSVal != 0){
        code2MSHtml = "<span onclick='openConOpDashboardMS(\"Code 2\", \""+msFilterDtFrom+"\",\""+msFilterDtTo+"\", \"Code 2: Approved with Comment\");'>"+code2MSVal+"<span/>";
    }
    $("#code2MS").html(code2MSHtml);

    var code3MSVal = (data['Code 3: Rejected']) ? data['Code 3: Rejected'] : 0;
    var code3MSHtml = code3MSVal;
    if(code3MSVal != 0){
        code3MSHtml = "<span onclick='openConOpDashboardMS(\"Code 3\", \""+msFilterDtFrom+"\",\""+msFilterDtTo+"\", \"Code 3: Rejected\");'>"+code3MSVal+"<span/>";
    }
    $("#code3MS").html(code3MSHtml);

    if(dataAging.length != 0){
        var aging = Object.keys(dataAging).reduce((a, b) => dataAging[a] > dataAging[b] ? a : b);
        if (aging == 'less14'){
            $('#reviewMSBackground').css({
                'background-color': '#52BE80',
                'border-radius': '0 0 5px 5px'
            })
        }else if (aging == 'less60'){
            $('#reviewMSBackground').css({
                'background-color': '#F4D03F',
                'border-radius': '0 0 5px 5px'
            })
        }else if (aging == 'less100'){
            $('#reviewMSBackground').css({
                'background-color': '#FF7F50',
                'border-radius': '0 0 5px 5px',
                'color': 'white'
            })
        }else if (aging == 'more100'){
            $('#reviewMSBackground').css({
                'background-color': '#E93232',
                'border-radius': '0 0 5px 5px',
                'color': 'white'
            })
        }
        else{
            $('#reviewMSBackground').css({
                'background-color': '#d9ecff',
                'border-radius': '0 0 5px 5px',
                'color': 'black'
            })
        }
    }
    else{
        $('#reviewMSBackground').css({
            'background-color': '#d9ecff',
            'border-radius': '0 0 5px 5px',
            'color': 'black'
        })
    }

    if(dataAgingCode2.length != 0){
        var aging = Object.keys(dataAgingCode2).reduce((a, b) => dataAgingCode2[a] > dataAgingCode2[b] ? a : b);
        if (aging == 'less14'){
            $('#reviewMSCode2Background').css({
                'background-color': '#52BE80',
                'border-radius': '0 0 5px 5px'
            })
        }else if (aging == 'less60'){
            $('#reviewMSCode2Background').css({
                'background-color': '#F4D03F',
                'border-radius': '0 0 5px 5px'
            })
        }else if (aging == 'less100'){
            $('#reviewMSCode2Background').css({
                'background-color': '#FF7F50',
                'border-radius': '0 0 5px 5px',
                'color': 'white'
            })
        }else if (aging == 'more100'){
            $('#reviewMSCode2Background').css({
                'background-color': '#E93232',
                'border-radius': '0 0 5px 5px',
                'color': 'white'
            })
        }
        else{
            $('#reviewMSCode2Background').css({
                'background-color': '#d9ecff',
                'border-radius': '0 0 5px 5px',
                'color': 'black'
            })
        }
    }
    else{
        $('#reviewMSCode2Background').css({
            'background-color': '#d9ecff',
            'border-radius': '0 0 5px 5px',
            'color': 'black'
        })
    }
    
}

function openConOpDashboardMT(cardName, mtFilterDtFrom, mtFilterDtTo, mtFilterApprovalStatus, mtFilterApprovalFlag = 'no'){
    var linkParamArr = processFilterParamArr([mtFilterDtFrom, mtFilterDtTo, mtFilterApprovalStatus, mtFilterApprovalFlag]);
    
    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("MS", "construct_dash_conop_qaqc_ms", linkParamArr, "Material Submission - " + cardName);
    }else{
        var postParam = {function:"openConOpDashboard",processType:"MS", conOpTabId:"conopTab5", linkName:"construct_dash_conop_qaqc_ms", linkParam:linkParamArr, linkWinTitle: 'MT'};
        parent.postMessage(postParam ,"*");
    }
}

function updateCardMT(data, dataRec, dataAging, dataAgingCode2){
    var MTAllData = (data.allData) ? data.allData : [];
    var MTFilterDtFrom = (MTAllData.dateFrom) ? MTAllData.dateFrom : '';
    var MTFilterDtTo = (MTAllData.dateTo) ? MTAllData.dateTo : '';

    var mtAllDataCurr = (dataRec.allDataCurr) ? dataRec.allDataCurr : [];
    var mtFilterDtFromCurr = (mtAllDataCurr.dateFrom) ? mtAllDataCurr.dateFrom : '';
    var mtFilterDtToCurr = (mtAllDataCurr.dateTo) ? mtAllDataCurr.dateTo : '';

    var msAllDataCumul = (data.allDataCumul) ? data.allDataCumul : [];
    var msFilterDtToCumul = (msAllDataCumul.dateTo) ? msAllDataCumul.dateTo : '';

    var receivedMTVal = (dataRec.ttlSubmit) ? dataRec.ttlSubmit : 0;
    var receivedMTHtml = receivedMTVal;
    if(receivedMTVal != 0){
        receivedMTHtml = "<span onclick='openConOpDashboardMT(\"Received\", \""+mtFilterDtFromCurr+"\",\""+mtFilterDtToCurr+"\", \"\");'>"+receivedMTVal+"<span/>";
    }
    $("#receivedMT").html(receivedMTHtml);

    var cumulMTVal = (data.cumul) ? data.cumul : 0;
    var cumulMTHtml = cumulMTVal;
    if(cumulMTVal != 0){
        cumulMTHtml = "<span onclick='openConOpDashboardMT(\"Cumulative\", \"\",\""+msFilterDtToCumul+"\", \"\");'>"+cumulMTVal+"<span/>";
    }
    $("#cumulMT").html(cumulMTHtml);

    var reviewMTVal = (data.totalNoCode) ? data.totalNoCode : 0;
    var reviewMTHtml = reviewMTVal;
    if(reviewMTVal != 0){
        reviewMTHtml = "<span onclick='openConOpDashboardMT(\"Under Review\", \""+MTFilterDtFrom+"\",\""+MTFilterDtTo+"\", \"\", \"yes\");'>"+reviewMTVal+"<span/>";
    }
    $("#reviewMT").html(reviewMTHtml);

    var code1MTVal = (data['Code 1: Approved']) ? data['Code 1: Approved'] : 0;
    var code1MTHtml = code1MTVal;
    if(code1MTVal != 0){
        code1MTHtml = "<span onclick='openConOpDashboardMT(\"Code 1\", \""+MTFilterDtFrom+"\",\""+MTFilterDtTo+"\", \"Code 1: Approved\");'>"+code1MTVal+"<span/>";
    }
    $("#code1MT").html(code1MTHtml);

    var code2MTVal = (data['Code 2: Approved with Comment']) ? data['Code 2: Approved with Comment'] : 0;
    var code2MTHtml = code2MTVal;
    if(code2MTVal != 0){
        code2MTHtml = "<span onclick='openConOpDashboardMT(\"Code 2\", \""+MTFilterDtFrom+"\",\""+MTFilterDtTo+"\", \"Code 2: Approved with Comment\");'>"+code2MTVal+"<span/>";
    }
    $("#code2MT").html(code2MTHtml);

    var code3MTVal = (data['Code 3: Rejected']) ? data['Code 3: Rejected'] : 0;
    var code3MTHtml = code3MTVal;
    if(code3MTVal != 0){
        code3MTHtml = "<span onclick='openConOpDashboardMT(\"Code 3\", \""+MTFilterDtFrom+"\",\""+MTFilterDtTo+"\", \"Code 3: Rejected\");'>"+code3MTVal+"<span/>";
    }
    $("#code3MT").html(code3MTHtml);

    if(dataAging.length != 0){
        var aging = Object.keys(dataAging).reduce((a, b) => dataAging[a] > dataAging[b] ? a : b);
        if (aging == 'less14'){
            $('#reviewMTBackground').css({
                'background-color': '#52BE80',
                'border-radius': '0 0 5px 5px'
            })
        }else if (aging == 'less60'){
            $('#reviewMTBackground').css({
                'background-color': '#F4D03F',
                'border-radius': '0 0 5px 5px'
            })
        }else if (aging == 'less100'){
            $('#reviewMTBackground').css({
                'background-color': '#FF7F50',
                'border-radius': '0 0 5px 5px',
                'color': 'white'
            })
        }else if (aging == 'more100'){
            $('#reviewMTBackground').css({
                'background-color': '#E93232',
                'border-radius': '0 0 5px 5px',
                'color': 'white'
            })
        }
        else{
            $('#reviewMTBackground').css({
                'background-color': '#d9ecff',
                'border-radius': '0 0 5px 5px',
                'color': 'black'
            })
        }
    }
    else{
        $('#reviewMTBackground').css({
            'background-color': '#d9ecff',
            'border-radius': '0 0 5px 5px',
            'color': 'black'
        })
    }

    if(dataAgingCode2.length != 0){
        var aging = Object.keys(dataAgingCode2).reduce((a, b) => dataAgingCode2[a] > dataAgingCode2[b] ? a : b);
        if (aging == 'less14'){
            $('#reviewMTCode2Background').css({
                'background-color': '#52BE80',
                'border-radius': '0 0 5px 5px'
            })
        }else if (aging == 'less60'){
            $('#reviewMTCode2Background').css({
                'background-color': '#F4D03F',
                'border-radius': '0 0 5px 5px'
            })
        }else if (aging == 'less100'){
            $('#reviewMTCode2Background').css({
                'background-color': '#FF7F50',
                'border-radius': '0 0 5px 5px',
                'color': 'white'
            })
        }else if (aging == 'more100'){
            $('#reviewMTCode2Background').css({
                'background-color': '#E93232',
                'border-radius': '0 0 5px 5px',
                'color': 'white'
            })
        }
        else{
            $('#reviewMTCode2Background').css({
                'background-color': '#d9ecff',
                'border-radius': '0 0 5px 5px',
                'color': 'black'
            })
        }
    }
    else{
        $('#reviewMTCode2Background').css({
            'background-color': '#d9ecff',
            'border-radius': '0 0 5px 5px',
            'color': 'black'
        })
    }
    
}

function refreshInformation(package = 'overall', year = 'all', month = 'all'){
    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year;
    var ncrDetails = (qaqcData && qaqcData.ncr && qaqcData.ncr[package] && qaqcData.ncr[package][year] && qaqcData.ncr[package][year][month]) ? qaqcData.ncr[package][year][month] : [];
    var noiDetails = (qaqcData && qaqcData.noi && qaqcData.noi[package] && qaqcData.noi[package][year] && qaqcData.noi[package][year][month]) ? qaqcData.noi[package][year][month] : [];
    var rfiDetails = (qaqcData && qaqcData.rfi && qaqcData.rfi[package] && qaqcData.rfi[package][year] && qaqcData.rfi[package][year][month]) ? qaqcData.rfi[package][year][month] : [];
    var msDetails = (qaqcData && qaqcData.ms && qaqcData.ms[package] && qaqcData.ms[package][year] && qaqcData.ms[package][year][month]) ? qaqcData.ms[package][year][month] : [];
    var mtDetails = (qaqcData && qaqcData.mt && qaqcData.mt[package] && qaqcData.mt[package][year] && qaqcData.mt[package][year][month]) ? qaqcData.mt[package][year][month] : [];
    var wirDetails = (qaqcData && qaqcData.wir && qaqcData.wir[package] && qaqcData.wir[package][year] && qaqcData.wir[package][year][month]) ? qaqcData.wir[package][year][month] : [];

    var ncrChart = (ncrDetails && ncrDetails.chartNCRSub) ? ncrDetails.chartNCRSub : [];
    drawWorkDiscipline(ncrChart, dataYearMonth);
    var ncrAge = (qaqcData && qaqcData.ncr[package] && qaqcData.ncr[package][year] && qaqcData.ncr[package][year][month] && qaqcData.ncr[package][year][month].byAgingQuality) ? qaqcData.ncr[package][year][month].byAgingQuality : [];
    drawNcrAgeing(ncrAge, dataYearMonth);
    var ncrClass = (ncrDetails && ncrDetails.pieChartClassify) ? ncrDetails.pieChartClassify : [];
    drawClassifyNCR(ncrClass, 'ncrClassify', dataYearMonth);
    var ncrData = (ncrDetails && ncrDetails.card) ? ncrDetails.card : [];

    var noiClass = (noiDetails && noiDetails.chartNOIclassify) ? noiDetails.chartNOIclassify : [];
    drawClassifyNOI(noiClass, 'noiClassify', dataYearMonth);
    var noiData = (noiDetails && noiDetails.card) ? noiDetails.card : [];

    var rfiCard = (rfiDetails && rfiDetails.card) ? rfiDetails.card : [];
    updateCardRFI(rfiCard);

    var wirCard = (wirDetails && wirDetails.card) ? wirDetails.card : [];
    updateCardWIR(wirCard);

    var msCard = (msDetails && msDetails.card) ? msDetails.card : [];
    var msAging = (msDetails && msDetails.byAgingNull) ? msDetails.byAgingNull : [];
    var msCode2Aging = (msDetails && msDetails.byAgingWith) ? msDetails.byAgingWith : [];

    var mtCard = (mtDetails && mtDetails.card) ? mtDetails.card : [];
    var mtAging = (mtDetails && mtDetails.byAgingNull) ? mtDetails.byAgingNull : [];
    var mtCode2Aging = (mtDetails && mtDetails.byAgingWith) ? mtDetails.byAgingWith : [];

    var today = new Date();
    var todayYear;
    var todayMonth;
    var previousMonth;
    var yearPrev;

    if(year == 'all'){
        todayYear = today.getFullYear();
        todayMonth = monthHalftext[today.getMonth() + 1];
        previousMonth = monthHalftext[today.getMonth()];
        yearPrev = todayYear;
        if(todayMonth == 'Jan'){
            yearPrev = parseInt(todayYear) - 1;
            previousMonth = monthPrev[todayMonth];
        }
    }
    if(year != 'all'){
        todayYear = year;

        if(month != 'all'){
            todayMonth = month;
            previousMonth = monthPrev[month];
            yearPrev = year;

            if(month == "Jan"){
                yearPrev = parseInt(year) - 1;
            }
        }
    }

    var ncrCurrentCumul = (qaqcData && qaqcData.ncr && qaqcData.ncr[package] && qaqcData.ncr[package][todayYear] && qaqcData.ncr[package][todayYear][todayMonth] && qaqcData.ncr[package][todayYear][todayMonth].card) ? qaqcData.ncr[package][todayYear][todayMonth].card : [];
    var ncrPrevCumul = (qaqcData && qaqcData.ncr && qaqcData.ncr[package] && qaqcData.ncr[package][yearPrev] && qaqcData.ncr[package][yearPrev][previousMonth] && qaqcData.ncr[package][yearPrev][previousMonth].card) ? qaqcData.ncr[package][yearPrev][previousMonth].card : [];

    var noiCurrentCumul = (qaqcData && qaqcData.noi && qaqcData.noi[package] && qaqcData.noi[package][todayYear] && qaqcData.noi[package][todayYear][todayMonth] && qaqcData.noi[package][todayYear][todayMonth].card) ? qaqcData.noi[package][todayYear][todayMonth].card : [];
    var noiPrevCumul = (qaqcData && qaqcData.noi && qaqcData.noi[package] && qaqcData.noi[package][yearPrev] && qaqcData.noi[package][yearPrev][previousMonth] && qaqcData.noi[package][yearPrev][previousMonth].card) ? qaqcData.noi[package][yearPrev][previousMonth].card : [];

    var msCurrentCumul = (qaqcData && qaqcData.ms && qaqcData.ms[package] && qaqcData.ms[package][todayYear] && qaqcData.ms[package][todayYear][todayMonth] && qaqcData.ms[package][todayYear][todayMonth].card) ? qaqcData.ms[package][todayYear][todayMonth].card : [];
    
    var mtCurrentCumul = (qaqcData && qaqcData.mt && qaqcData.mt[package] && qaqcData.mt[package][todayYear] && qaqcData.mt[package][todayYear][todayMonth] && qaqcData.mt[package][todayYear][todayMonth].card) ? qaqcData.mt[package][todayYear][todayMonth].card : [];
    updateCardNCR(ncrData, ncrCurrentCumul, ncrPrevCumul);
    updateCardNOI(noiData, noiCurrentCumul, noiPrevCumul);
    updateCardMS(msCard, msCurrentCumul, msAging, msCode2Aging);
    updateCardMT(mtCard, mtCurrentCumul, mtAging, mtCode2Aging);

}

function refreshDashboard(){
    var selWPC = $("#wpcFilter").val();
    var selYear = $('#yearFilter').val();
    if (selYear == 'all') {
    	$('#monthFilter').prop("disabled", true);	
		$('#monthFilter').val('all');
    }else{
    	$('#monthFilter').prop("disabled", false);
    }
	var selMonth = $('#monthFilter').val();
    refreshInformation(selWPC, selYear, selMonth);
}

function refreshFromv3 (filterArr){
    var wpc = filterArr.wpc;
    var year = filterArr.year;
    var month = filterArr.month;
  
    refreshInformation(wpc, year, month);
}

$(document).ready(function(){
	$.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "qaqc"
        },
        success: function (obj) {
        	if (obj.status && obj.status == 'ok') {
                qaqcData = obj.data;
                refreshInformation();
        	}
        },
        complete: function (){
            window.parent.postMessage({functionName: 'loaderajaxEnd'})
        }
    });
})