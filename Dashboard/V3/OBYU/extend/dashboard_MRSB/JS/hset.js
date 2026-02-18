var hsetData;
var fullMonthtoDigitArr = {"January":"01","February":"02","March":"03","April":"04","May":"05","June":"06","July":"07","August":"08","September":"09","October":"10","November":"11","December":"12"};

function drawOverallAccidentRecord(data, monthYear){
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = { name: idx, y: (ele.val) ? ele.val : 0, allData : (ele.allData) ? ele.allData : []};
            dataArr.push(tempArr);
        }
    }

    var chart = Highcharts.chart('overallAccidentRecord', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">HSET Management<br>'+localStorage.p_name+'<br>OVERALL ACCIDENT RECORD ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">HSET Management<br>'+localStorage.p_name+'<br>OVERALL ACCIDENT RECORD ('+monthYear+')</span>'
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
            text: '<span class="showLabel">HSET Management<br>'+localStorage.p_name+'<br>OVERALL ACCIDENT RECORD ('+monthYear+')</span>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
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
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        credits: false,
        series: [{
            colorByPoint: true,
            name: 'Incident Category',
            data: dataArr,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var paramIncDtFrom = (allDataArr.incDateFrom) ? allDataArr.incDateFrom : '';
                    var paramIncDtTo = (allDataArr.incDateTo) ? allDataArr.incDateTo : '';
                    var paramCat = (allDataArr.incCat) ? allDataArr.incCat : '';
                    var linkParamArr = processFilterParamArr([paramCat, paramIncDtFrom, paramIncDtTo, '', 'Yes']);
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("IR", "construct_dash_conop_inc", linkParamArr, "Incident - " + event.point.name);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"IR", conOpTabId:"conopTab6", linkName:"construct_dash_conop_inc", linkParam:linkParamArr, linkWinTitle: 'Incident'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            } 
        }]
    });
    chart.updateFlag = true;
}

function drawTrafficAccidentLocation(data, monthYear){
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = { name: idx, y: (ele.val) ? ele.val : 0, allData: (ele.allData) ? ele.allData : []};
            dataArr.push(tempArr);
        }
    }

    var chart = Highcharts.chart('trafficAccidentLocation', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">HSET Management<br>'+localStorage.p_name+'<br>TRAFFIC ACCIDENT BY LOCATION ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">HSET Management<br>'+localStorage.p_name+'<br>TRAFFIC ACCIDENT BY LOCATION ('+monthYear+')</span>'
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
            text: '<span class="showLabel">HSET Management<br>'+localStorage.p_name+'<br>TRAFFIC ACCIDENT BY LOCATION ('+monthYear+')</span>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
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
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        credits: false,
        series: [{
            colorByPoint: true,
            name: 'Incident by Location',
            data: dataArr,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var paramIncDtFrom = (allDataArr.incDateFrom) ? allDataArr.incDateFrom : '';
                    var paramIncDtTo = (allDataArr.incDateTo) ? allDataArr.incDateTo : '';
                    var paramCat = (allDataArr.incCat) ? allDataArr.incCat : '';
                    var paramLoc = (event.point && event.point.name) ? event.point.name : '';
                    var linkParamArr = processFilterParamArr([paramCat, paramIncDtFrom, paramIncDtTo, paramLoc, 'Yes']);
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("IR", "construct_dash_conop_inc", linkParamArr, "Incident - " + event.point.name);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"IR", conOpTabId:"conopTab6", linkName:"construct_dash_conop_inc", linkParam:linkParamArr, linkWinTitle: 'Incident'};
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
            dataArr14.push({y:((ele.less14 && ele.less14.val) ? ele.less14.val : 0), allData:((ele.less14 && ele.less14.allData) ? ele.less14.allData : [])});
            dataArr60.push({y:((ele.less60 && ele.less60.val) ? ele.less60.val : 0), allData:((ele.less60 && ele.less60.allData) ? ele.less60.allData : [])});
            dataArr100.push({y:((ele.less100 && ele.less100.val) ? ele.less100.val : 0), allData:((ele.less100 && ele.less100.allData) ? ele.less100.allData : [])});
            dataArrmore100.push({y:((ele.more100 && ele.more100.val) ? ele.more100.val : 0), allData:((ele.more100 && ele.more100.allData) ? ele.more100.allData : [])});
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

    var chart = Highcharts.chart('ncrAging', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">HSET Management<br>'+localStorage.p_name+'<br>NCR AGEING ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">HSET Management<br>'+localStorage.p_name+'<br>NCR AGEING ('+monthYear+')</span>'
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
            text: '<span class="showLabel">HSET Management<br>'+localStorage.p_name+'<br>NCR AGEING ('+monthYear+')</span>'
        },
        xAxis: {
            categories: catArr
        },
        yAxis: {
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
            pointFormat: 'Total: {point.stackTotal}<br/>{series.name}: {point.y}'
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
        series: [{
            name: '>100 days',
            data: dataArrmore100,
            color: color1,
            pointWidth: 15,
            cursor: 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var packageFilter = (event.point.category) ? event.point.category : [];
                    var paramDtFrom = (allDataArr.dateFrom) ? allDataArr.dateFrom : '';
                    var paramDtTo = (allDataArr.dateTo) ? allDataArr.dateTo : '';
                    var paramStatus = (allDataArr.status) ? allDataArr.status : '';
                    var linkParamArr = (localStorage.isParent && localStorage.isParent == 'isParent') ? [packageFilter, paramStatus, paramDtFrom, paramDtTo] : [paramStatus, paramDtFrom, paramDtTo] ;
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_ncr", linkParamArr, "Non Conformance Report - " + event.point.allData.status);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_ncr", linkParam:linkParamArr, linkWinTitle: 'NCR'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            } 
        }, {
            name: '>60-100 days',
            data: dataArr100,
            color: color2,
            pointWidth: 15,            
            cursor: 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var packageFilter = (event.point.category) ? event.point.category : [];
                    var paramDtFrom = (allDataArr.dateFrom) ? allDataArr.dateFrom : '';
                    var paramDtTo = (allDataArr.dateTo) ? allDataArr.dateTo : '';
                    var paramStatus = (allDataArr.status) ? allDataArr.status : '';
                    var linkParamArr = (localStorage.isParent && localStorage.isParent == 'isParent') ? [packageFilter, paramStatus, paramDtFrom, paramDtTo] : [paramStatus, paramDtFrom, paramDtTo] ;
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_ncr", linkParamArr, "Non Conformance Report - " + event.point.allData.status);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_ncr", linkParam:linkParamArr, linkWinTitle: 'NCR'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            } 

        }, {
            name: '>14-60 days',
            data: dataArr60,
            color: color3,
            pointWidth: 15,
            cursor: 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var packageFilter = (event.point.category) ? event.point.category : [];
                    var paramDtFrom = (allDataArr.dateFrom) ? allDataArr.dateFrom : '';
                    var paramDtTo = (allDataArr.dateTo) ? allDataArr.dateTo : '';
                    var paramStatus = (allDataArr.status) ? allDataArr.status : '';
                    var linkParamArr = (localStorage.isParent && localStorage.isParent == 'isParent') ? [packageFilter, paramStatus, paramDtFrom, paramDtTo] : [paramStatus, paramDtFrom, paramDtTo] ;
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_ncr", linkParamArr, "Non Conformance Report - " + event.point.allData.status);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_ncr", linkParam:linkParamArr, linkWinTitle: 'NCR'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            } 

        }, {
            name: '<14 days',
            data: dataArr14,
            color: color4,
            pointWidth: 15,
            cursor: 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var packageFilter = (event.point.category) ? event.point.category : [];
                    var paramDtFrom = (allDataArr.dateFrom) ? allDataArr.dateFrom : '';
                    var paramDtTo = (allDataArr.dateTo) ? allDataArr.dateTo : '';
                    var paramStatus = (allDataArr.status) ? allDataArr.status : '';
                    var linkParamArr = (localStorage.isParent && localStorage.isParent == 'isParent') ? [packageFilter, paramStatus, paramDtFrom, paramDtTo] : [paramStatus, paramDtFrom, paramDtTo] ;
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_ncr", linkParamArr, "Non Conformance Report - " + event.point.allData.status);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_ncr", linkParam:linkParamArr, linkWinTitle: 'NCR'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            } 

        }]
    });
    chart.updateFlag = true;
}

function drawHseNonConformanceReport(data, monthYear){
    var catArr = [];
    var dataArrPending = [];
    var dataArrClose = [];
    var color1;
    var color2;

    if(data){
        for (const [idx, ele] of Object.entries(data)) {
            if(idx == "") continue;
            catArr.push(idx);
            dataArrPending.push({y:((ele.Pending && ele.Pending.val) ? ele.Pending.val : 0), allData:((ele.Pending && ele.Pending.allData) ? ele.Pending.allData : [])});
            dataArrClose.push({y:((ele.Closed && ele.Closed.val) ? ele.Closed.val : 0), allData:((ele.Closed && ele.Closed.allData) ? ele.Closed.allData : [])});
        }
    }

    if(localStorage.ui_pref == 'ri_v3'){
        color1 = Highcharts.getOptions().colors[3];
        color2 = Highcharts.getOptions().colors[1];
    }else{
        color1 = '#F4D03F';
        color2 = '#52BE80';
    }

    var chart = Highcharts.chart('hseNonConformanceReport', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">HSET Management<br>'+localStorage.p_name+'<br>HSET NON-CONFORMANCE REPORT ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">HSET Management<br>'+localStorage.p_name+'<br>HSET NON-CONFORMANCE REPORT ('+monthYear+')</span>'
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
            text: '<span class="showLabel">HSET Management<br>'+localStorage.p_name+'<br>HSET NON-CONFORMANCE REPORT ('+monthYear+')</span>'
        },
        xAxis: {
              categories: catArr
        },
        yAxis: {
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
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
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
        series: [{
            name: 'Pending',
            data: dataArrPending,
            color: color1,
            cursor: 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var packageFilter = (event.point.category) ? event.point.category : [];
                    var paramDtFrom = (allDataArr.dateFrom) ? allDataArr.dateFrom : '';
                    var paramDtTo = (allDataArr.dateTo) ? allDataArr.dateTo : '';
                    var linkParamArr = (localStorage.isParent && localStorage.isParent == 'isParent') ? [packageFilter, 'Pending', paramDtFrom, paramDtTo] : ['Pending', paramDtFrom, paramDtTo] ;
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_ncr", linkParamArr, "Non Conformance Report - " + event.point.allData.status);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_ncr", linkParam:linkParamArr, linkWinTitle: 'NCR'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            } 
        }, {
            name: 'Closed',
            data: dataArrClose,
            color: color2,
            cursor: 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var packageFilter = (event.point.category) ? event.point.category : [];
                    var paramDtFrom = (allDataArr.dateFrom) ? allDataArr.dateFrom : '';
                    var paramDtTo = (allDataArr.dateTo) ? allDataArr.dateTo : '';
                    var linkParamArr = (localStorage.isParent && localStorage.isParent == 'isParent') ? [packageFilter, 'Closed', paramDtFrom, paramDtTo] : ['Closed', paramDtFrom, paramDtTo] ;
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_ncr", linkParamArr, "Non Conformance Report - " + event.point.allData.status);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_ncr", linkParam:linkParamArr, linkWinTitle: 'NCR'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            } 
        }]
    });
    chart.updateFlag = true;
}

function drawManHourWithoutLti(data, monthYear){
    var catArr = [];
    var dataArr = [];
    var color1;

    if(data){
        for (const [idx, ele] of Object.entries(data)) {
            if(idx == "") continue;
            catArr.push(idx);
            dataArr.push({y:((ele.totalWithoutLTI) ? ele.totalWithoutLTI : 0), allData:((ele.allData) ? ele.allData : [])});
        }
    }

    if(localStorage.ui_pref == 'ri_v3'){
        color1 = Highcharts.getOptions().colors[7];
    }else{
        color1 = '#C70039';
    }

    var chart = Highcharts.chart('manHourWithoutLti', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">HSET Management<br>'+localStorage.p_name+'<br>TOTAL MAN-HOURS WORKS WIHOUT LTI ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">HSET Management<br>'+localStorage.p_name+'<br>TOTAL MAN-HOURS WORKS WIHOUT LTI ('+monthYear+')</span>'
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
            text: '<span class="showLabel">HSET Management<br>'+localStorage.p_name+'<br>TOTAL MAN-HOURS WORKS WIHOUT LTI ('+monthYear+')</span>'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: catArr,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Hours'
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
            name: 'Total Man Hour',
            data: dataArr,
            pointWidth: 15,
            color: color1,
            cursor: 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var paramYr = (allDataArr.year) ? allDataArr.year : [];
                    var paramMonth = (allDataArr.month) ? allDataArr.month : [];
                    var linkParamArr = processFilterParamArr([paramMonth, paramYr]);
                    if (linkParamArr) {
                        if(localStorage.ui_pref == "ri_v3"){
                            window.parent.widgetConopOpen("SMH", "construct_dash_conop_smh", linkParamArr, "Total Man-Hours");
                        }else{
                            var postParam = {function:"openConOpDashboard",processType:"SMH", conOpTabId:"conopTab10", linkName:"construct_dash_conop_smh", linkParam:linkParamArr, linkWinTitle: 'Total Safe Man-Hour Works Without LTI'};
                            parent.postMessage(postParam ,"*");
                        }
                    }
                }
            } 
        }]
    });
    chart.updateFlag = true;
}

function drawHseToolboxBriefing(data, monthYear){

    var catArr = [];
    var dataArr = [];
    var dataArr2 = [];
    var color1;
    var color2;

    if(data){
        for (const [idx, ele] of Object.entries(data)) {
            if(idx == "") continue;
            catArr.push(idx);
            dataArr.push({y:((ele.cumulToolboxMeet) ? ele.cumulToolboxMeet : 0), allData:((ele.allData) ? ele.allData : [])});
            dataArr2.push({y:((ele.cumulInduction) ? ele.cumulInduction : 0), allData:((ele.allData) ? ele.allData : [])});
        }
    }

    if(localStorage.ui_pref == 'ri_v3'){
        color1 = Highcharts.getOptions().colors[1];
        color2 = Highcharts.getOptions().colors[11]
    }else{
        color1 = '#52BE80';
        color2 = '#5898D6';
    }

    var chart = Highcharts.chart('hseToolboxBriefing', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">HSET Management<br>'+localStorage.p_name+'<br>HSET INDUCTION + TOOLBOX MEETING ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">HSET Management<br>'+localStorage.p_name+'<br>HSET INDUCTION + TOOLBOX MEETING ('+monthYear+')</span>'
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
            text: '<span class="showLabel">HSET Management<br>'+localStorage.p_name+'<br>HSET INDUCTION + TOOLBOX MEETING ('+monthYear+')</span>'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: catArr,
            crosshair: true,
            title: {
                text: ''
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            min: 0,
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
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
            name: 'HSET Induction',
            data: dataArr2,
            pointWidth: 15,
            color: color1,
            cursor: 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var paramYr = (allDataArr.year) ? allDataArr.year : [];
                    var paramMonth = (allDataArr.month) ? allDataArr.month : [];
                    var category = (event.point.category) ? event.point.category : "";
                    var linkParamArr = processFilterParamArr([paramMonth, paramYr,category]); 
                    if (linkParamArr) {
                        if(localStorage.ui_pref == "ri_v3"){
                            window.parent.widgetConopOpen("SA", "construct_dash_conop_sa", linkParamArr, "Safety Activity - HSET Induction");
                        }else{
                            var postParam = {function:"openConOpDashboard",processType:"SA", conOpTabId:"conopTab9", linkName:"construct_dash_conop_sa", linkParam:linkParamArr, linkWinTitle: 'Safety Activity'};
                            parent.postMessage(postParam ,"*");
                        }
                    }
                }
            }   
        }, {
            name: 'HSET Meeting',
            data: dataArr,
            pointWidth: 15,
            color: color2,
            cursor: 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var paramYr = (allDataArr.year) ? allDataArr.year : [];
                    var paramMonth = (allDataArr.month) ? allDataArr.month : [];
                    var category = (event.point.category) ? event.point.category : "";
                    var linkParamArr = processFilterParamArr([paramMonth, paramYr,category]);
                    if (linkParamArr) {
                        if(localStorage.ui_pref == "ri_v3"){
                            window.parent.widgetConopOpen("SA", "construct_dash_conop_sa", linkParamArr, "Safety Activity - HSET Meeting");
                        }else{
                            var postParam = {function:"openConOpDashboard",processType:"SA", conOpTabId:"conopTab9", linkName:"construct_dash_conop_sa", linkParam:linkParamArr, linkWinTitle: 'Safety Activity'};
                            parent.postMessage(postParam ,"*");
                        }
                    }
                }
            }
        }]
    });
    chart.updateFlag = true;
}

function drawHseCommitteeMeeting(data, monthYear){
    var catArr = [];
    var dataArr = [];
    var color1;

    if(data){
        for (const [idx, ele] of Object.entries(data)) {
            if(idx == "") continue;
            catArr.push(idx);
            dataArr.push({y:((ele.cumulCommiteeMeet) ? ele.cumulCommiteeMeet : 0), allData:((ele.allData) ? ele.allData : [])});
        }
    }

    if(localStorage.ui_pref == 'ri_v3'){
        color1 = Highcharts.getOptions().colors[7];
    }else{
        color1 = '#C70039';
    }

    var chart = Highcharts.chart('hseCommitteeMeeting', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">HSET Management<br>'+localStorage.p_name+'<br>HSET COMMITTEE MEETING ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">HSET Management<br>'+localStorage.p_name+'<br>HSET COMMITTEE MEETING ('+monthYear+')</span>'
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
            text: '<span class="showLabel">HSET Management<br>'+localStorage.p_name+'<br>HSET COMMITTEE MEETING ('+monthYear+')</span>'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: catArr,
            crosshair: true
        },
        yAxis: {
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
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
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
            name: 'HSET Committee Meeting',
            data: dataArr,
            pointWidth: 15,
            color: color1,
            cursor: 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var paramYr = (allDataArr.year) ? allDataArr.year : [];
                    var paramMonth = (allDataArr.month) ? allDataArr.month : [];
                    var category = (event.point.category) ? event.point.category : "";
                    var linkParamArr = processFilterParamArr([paramMonth, paramYr,category]);
                    if (linkParamArr) {
                        if(localStorage.ui_pref == "ri_v3"){
                            window.parent.widgetConopOpen("SA", "construct_dash_conop_sa", linkParamArr, "Safety Activity - HSET Committee Meeting");
                        }else{
                            var postParam = {function:"openConOpDashboard",processType:"SA", conOpTabId:"conopTab9", linkName:"construct_dash_conop_sa", linkParam:linkParamArr, linkWinTitle: 'Safety Activity'};
                            parent.postMessage(postParam ,"*");
                        }
                    }
                }
            }  
        }]
    });
    chart.updateFlag = true;
}

function drawHseWalkabout(data, monthYear){
    var catArr = [];
    var dataArr = [];
    var color1;

    if(data){
        for (const [idx, ele] of Object.entries(data)) {
            if(idx == "") continue;
            catArr.push(idx);
            dataArr.push({y:((ele.cumulWalkabout) ? ele.cumulWalkabout : 0), allData:((ele.allData) ? ele.allData : [])});
        }
    }

    if(localStorage.ui_pref == 'ri_v3'){
        color1 = Highcharts.getOptions().colors[3];
    }else{
        color1 = '#F4D03F';
    }

    var chart = Highcharts.chart('hseWalkabout', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">HSET Management<br>'+localStorage.p_name+'<br>HSET WALKABOUT ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">HSET Management<br>'+localStorage.p_name+'<br>HSET WALKABOUT ('+monthYear+')</span>'
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
            text: '<span class="showLabel">HSET Management<br>'+localStorage.p_name+'<br>HSET WALKABOUT ('+monthYear+')</span>'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: catArr,
            crosshair: true
        },
        yAxis: {
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
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
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
            name: 'HSET Walkabout',
            data: dataArr,
            pointWidth: 15,
            color: color1,
            cursor: 'pointer',
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var paramYr = (allDataArr.year) ? allDataArr.year : [];
                    var paramMonth = (allDataArr.month) ? allDataArr.month : [];
                    var category = (event.point.category) ? event.point.category : "";
                    var linkParamArr = processFilterParamArr([paramMonth, paramYr,category]);
                    if (linkParamArr) {
                        if(localStorage.ui_pref == "ri_v3"){
                            window.parent.widgetConopOpen("SA", "construct_dash_conop_sa", linkParamArr, "Safety Activity - HSET Walkabout");
                        }else{
                            var postParam = {function:"openConOpDashboard",processType:"SA", conOpTabId:"conopTab9", linkName:"construct_dash_conop_sa", linkParam:linkParamArr, linkWinTitle: 'Safety Activity'};
                            parent.postMessage(postParam ,"*");
                        }
                    }
                }
            } 
        }]
    });
    chart.updateFlag = true;
}

function openConOpDashboard(paramYr, paramMonth){
    var linkParamArr = processFilterParamArr([paramMonth, paramYr]);

    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("SMH", "construct_dash_conop_smh", linkParamArr, "Total Man-Hours - Cumulative");
    }else{
        var postParam = {function:"openConOpDashboard",processType:"SMH", conOpTabId:"conopTab10", linkName:"construct_dash_conop_smh", linkParam:linkParamArr, linkWinTitle: 'Total Safe Man-Hour Works Without LTI'};
        parent.postMessage(postParam ,"*");
    }
}

function updateCardCumul(data){
    var allDataArr = data.allData ?  data.allData : {};

    var paramYr = (allDataArr.year) ? allDataArr.year : {};
    var paramMonth = (allDataArr.month) ? allDataArr.month : {};

    if(! jQuery.isEmptyObject(allDataArr)){
        $('#cumulLTI').html((data.cardCumulWithoutLti) ?  '<span style="cursor:pointer;" onclick="openConOpDashboard(\''+paramYr+'\',\''+paramMonth+'\')">'+data.cardCumulWithoutLti+'</span>' : 0);
    }
    else{
        $('#cumulLTI').html((data.cardCumulWithoutLti) ?  data.cardCumulWithoutLti : 0);
    }
}
function refreshInformation(package = 'overall', year = 'all', month = 'all'){
    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year;
    var incData = (hsetData && hsetData.inc[package] && hsetData.inc[package] && hsetData.inc[package][year] && hsetData.inc[package][year][month]) ? hsetData.inc[package][year][month] : [];
    var categoryInc = (incData && incData.chartCategory) ? incData.chartCategory : [];
    var locationInc = (incData && incData.chartLocation) ? incData.chartLocation : [];
    drawOverallAccidentRecord(categoryInc, dataYearMonth);
    drawTrafficAccidentLocation(locationInc, dataYearMonth);

    //bar chart NCR Ageing
    var ncrAge = (hsetData && hsetData.ncr[package] && hsetData.ncr[package] && hsetData.ncr[package][year] && hsetData.ncr[package][year][month] && hsetData.ncr[package][year][month].byAging) ? hsetData.ncr[package][year][month].byAging : [];
    drawNcrAgeing(ncrAge, dataYearMonth);

    //bar chart HSET NCR Status
    var ncrStatus = (hsetData && hsetData.ncr[package] && hsetData.ncr[package] && hsetData.ncr[package][year] && hsetData.ncr[package][year][month] && hsetData.ncr[package][year][month].statusNCR) ? hsetData.ncr[package][year][month].statusNCR : [];
    drawHseNonConformanceReport(ncrStatus, dataYearMonth);

    //bar chart SA data
    var saData = (hsetData && hsetData.sa[package] && hsetData.sa[package] && hsetData.sa[package][year] && hsetData.sa[package][year][month]) ? hsetData.sa[package][year][month] : [];
    var walkSa = (saData && saData.chartSA) ? saData.chartSA : [];
    drawHseWalkabout(walkSa, dataYearMonth);
    drawHseCommitteeMeeting(walkSa, dataYearMonth);
    drawHseToolboxBriefing(walkSa, dataYearMonth);

    var smhData = (hsetData && hsetData.smh[package] && hsetData.smh[package] && hsetData.smh[package][year] && hsetData.smh[package][year][month]) ? hsetData.smh[package][year][month] : [];
    var smhChart = (smhData && smhData.chart) ? smhData.chart : [];
    drawManHourWithoutLti(smhChart, dataYearMonth);
    updateCardCumul(smhData);
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
            page: "hset"
        },
        success: function (obj) {
        	if (obj.status && obj.status == 'ok') {
                hsetData = obj.data;
                refreshInformation();
        	}
        },
        complete: function (){
            window.parent.postMessage({functionName: 'loaderajaxEnd'})
        }
    });
})