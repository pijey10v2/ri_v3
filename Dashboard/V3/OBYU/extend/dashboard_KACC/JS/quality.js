var qualityData;
var monthFulltext = {"01":"January","02":"February","03":"March","04":"April","05":"May","06":"June","07":"July","08":"August","09":"September","10":"October","11":"November","12":"December"}
var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};

function conOpSMHLink(yrFilter = '', mthFilter = '', title){
    var linkParamArr = processFilterParamArr([mthFilter, yrFilter]);
    var cardName;
    
    if(localStorage.ui_pref == "ri_v3"){
        (title == "ttlManHrsWOLTI") ? cardName = "W/O LTI" : cardName = "WITH LTI";
        window.parent.widgetConopOpen("SMH", "construct_dash_conop_smh", linkParamArr, "Safe Man-Hour - " + cardName);
    }else{
        var postParam = {function:"openConOpDashboard",processType:"SMH", conOpTabId:"conopTab10", linkName:"construct_dash_conop_smh", linkParam:linkParamArr, linkWinTitle: 'Safe Man-Hour'};
        postMessageParent(postParam)
    }
}

function conOpIncidentLink(cat, cases = '', cumul = false){
    var cardName;
    var dateFilter = getDateFromToFilter();
    var linkParamArr = (cumul) ? processFilterParamArr(['', dateFilter.dateTo, cat, '', cases]) : processFilterParamArr([dateFilter.dateFrom, dateFilter.dateTo, cat, '', cases]);
    
    if(localStorage.ui_pref == "ri_v3"){
        (cat == "")? cardName = "Category" : cardName = cat;
        window.parent.widgetConopOpen("IR", "construct_dash_conop_inc", linkParamArr, "Incident - " + cardName);
    }else{
        var postParam = {function:"openConOpDashboard",processType:"IR", conOpTabId:"conopTab6", linkName:"construct_dash_conop_inc", linkParam:linkParamArr, linkWinTitle: 'Incident'};
        postMessageParent(postParam);
    }
}

function updateManHrsCard(data) {
    var wLTI = (data.withLTI) ? parseInt(data.withLTI) : 0;
    var woLTI = (data.withoutLTI) ? parseInt(data.withoutLTI) : 0;    
    var filterArr = (data.filterArr) ? data.filterArr : [];

    var ttlManHrsWOLTI = (filterArr) ? `<span class='clickableCard' onclick='conOpSMHLink("`+filterArr.yr+`","`+filterArr.mth+`", "ttlManHrsWOLTI")'>`+woLTI+`</span>` : woLTI;
    var ttlManHrsWLTI = (filterArr) ? `<span class='clickableCard' onclick='conOpSMHLink("`+filterArr.yr+`","`+filterArr.mth+`", "ttlManHrsWLTI")'>`+wLTI+`</span>` : wLTI;

    $('#smhWLti').html(ttlManHrsWLTI);
    $('#smhWOLti').html(ttlManHrsWOLTI);
}

function drawHSETCommMeetChart(data, monthYear) {
    var catArr = [];
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);
            dataArr.push((ele) ? parseInt(ele) : 0);
        }
    }

    // hsetCommMeetChart
    var chart = Highcharts.chart('hsetCommMeetChart', {
        chart: {
            type: 'column',
            events: {
                events: {
                    render() {
                      var chart = this;
            
                      if (document.fullscreenElement && chart.updateFlag) {
                        chart.updateFlag = false;
                        chart.update({
                          chart:{
                            marginTop: 90
                          },
                          title: {
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">SHE Management<br>'+localStorage.p_name+'<br>HSET COMMITTE MEETING ('+monthYear+')</span>'
                          }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>HSET COMMITTE MEETING ('+monthYear+')</span>'
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
            text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>HSET COMMITTE MEETING ('+monthYear+')</span>'
        },
        xAxis: {
            categories: catArr,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        plotOptions: {
            series: {
                cursor: 'pointer'
            },
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Total',
            data: dataArr,
            showInLegend: false,
            colorByPoint: true,
            events: {
                click: function (event) {
                    var mthYrFilter = getMthYrFromFilter();
                    var linkParamArr = [event.point.category, ((monthFulltext[mthYrFilter.mth]) ? monthFulltext[mthYrFilter.mth] : ''), mthYrFilter.yr];
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("SA", "construct_dash_conop_sa", linkParamArr, "Safety Activity - HSET Committe Meeting");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"SA", conOpTabId:"conopTab9", linkName:"construct_dash_conop_sa", linkParam:linkParamArr, linkWinTitle: 'Safety Activity'};
                        postMessageParent(postParam);
                    }
                }
            }
        }]
    });
    chart.updateFlag = true;
}

function drawMassToolBoxBriefChart(data, monthYear) {
    var catArr = [];
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);
            dataArr.push((ele) ? parseInt(ele) : 0);
        }
    }

    // massToolboxBriefChart
    var chart = Highcharts.chart('massToolboxBriefChart', {
        chart: {
            type: 'column',
            events: {
                events: {
                    render() {
                      var chart = this;
            
                      if (document.fullscreenElement && chart.updateFlag) {
                        chart.updateFlag = false;
                        chart.update({
                          chart:{
                            marginTop: 90
                          },
                          title: {
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">SHE Management<br>'+localStorage.p_name+'<br>MASS TOOLBOX BRIEFING ('+monthYear+')</span>'
                          }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>MASS TOOLBOX BRIEFING ('+monthYear+')</span>'
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
            text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>MASS TOOLBOX BRIEFING ('+monthYear+')</span>'
        },
        xAxis: {
            categories: catArr,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        plotOptions: {
            series: {
                cursor: 'pointer'
            },
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Total No.',
            data: dataArr,
            showInLegend: false,
            colorByPoint: true,
            events: {
                click: function (event) {
                    var mthYrFilter = getMthYrFromFilter();
                    var linkParamArr = [event.point.category, ((monthFulltext[mthYrFilter.mth]) ? monthFulltext[mthYrFilter.mth] : ''), mthYrFilter.yr];
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("SA", "construct_dash_conop_sa", linkParamArr, "Safety Activity - Mass Toolbox Briefing");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"SA", conOpTabId:"conopTab9", linkName:"construct_dash_conop_sa", linkParam:linkParamArr, linkWinTitle: 'Safety Activity'};
                        postMessageParent(postParam);
                    }
                }
            }
        }]
    });
    chart.updateFlag = true;
}

function drawHSEWalkaboutChart(data, monthYear) {
    var catArr = [];
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);
            dataArr.push(ele);
        }
    }
    // hsetWalkaboutChart
    var chart = Highcharts.chart('hsetWalkaboutChart', {
        chart: {
            type: 'column',
            events: {
                events: {
                    render() {
                      var chart = this;
            
                      if (document.fullscreenElement && chart.updateFlag) {
                        chart.updateFlag = false;
                        chart.update({
                          chart:{
                            marginTop: 90
                          },
                          title: {
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">SHE Management<br>'+localStorage.p_name+'<br>HSET WALKABOUT & INDUCTION ('+monthYear+')</span>'
                          }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>HSET WALKABOUT & INDUCTION ('+monthYear+')</span>'
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
            text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>HSET WALKABOUT & INDUCTION ('+monthYear+')</span>'
        },
        xAxis: {
            categories: catArr,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        plotOptions: {
            series: {
                cursor: 'pointer'
            },
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Total No.',
            data: dataArr,
            showInLegend: false,
            colorByPoint: true,
            events: {
                click: function (event) {
                    var mthYrFilter = getMthYrFromFilter();
                    var linkParamArr = [event.point.category, ((monthFulltext[mthYrFilter.mth]) ? monthFulltext[mthYrFilter.mth] : ''), mthYrFilter.yr];
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("SA", "construct_dash_conop_sa", linkParamArr, "Safety Activity - HSET Walkabout & Induction");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"SA", conOpTabId:"conopTab9", linkName:"construct_dash_conop_sa", linkParam:linkParamArr, linkWinTitle: 'Safety Activity'};
                        postMessageParent(postParam);
                    }
                }
            }
        }]
    });
    chart.updateFlag = true;
}

function drawHSETActivityChart(data, monthYear) {
    // column name dot bracket
    var actToShowArr = { 'fire_ext_training': 'Fire Extinguisher Training' };
    var catArr = [];
    var seriesArr = [];
    var counter = 1;
    if (data) {
        for (const [idx, ele] of Object.entries(actToShowArr)) {
            var tempArr = [];
            for (const [dataIdx, dataEle] of Object.entries(data)) {
                catArr.push(dataIdx);
                tempArr.push((dataEle) ? parseInt(dataEle) : 0);
            }
            seriesArr.push({ 
                name: ele, 
                data: tempArr,
                color: Highcharts.getOptions().colors[counter],
                events: {
                    click: function (event) {
                        var mthYrFilter = getMthYrFromFilter();
                        var linkParamArr = [event.point.category, ((monthFulltext[mthYrFilter.mth]) ? monthFulltext[mthYrFilter.mth] : ''), mthYrFilter.yr];
                        
                        if(localStorage.ui_pref == "ri_v3"){
                            window.parent.widgetConopOpen("SA", "construct_dash_conop_sa", linkParamArr, "Safety Activity - HSET Activity/Program");
                        }else{
                            var postParam = {function:"openConOpDashboard",processType:"SA", conOpTabId:"conopTab9", linkName:"construct_dash_conop_sa", linkParam:linkParamArr, linkWinTitle: 'Safety Activity - HSET Activity/Program'};
                            postMessageParent(postParam);
                        }
                    }
                }
            });
            counter++
        }
    }

    // hsetActivityChart
    var chart = Highcharts.chart('hsetActivityChart', {
        chart: {
            type: 'column',
            events: {
                events: {
                    render() {
                      var chart = this;
            
                      if (document.fullscreenElement && chart.updateFlag) {
                        chart.updateFlag = false;
                        chart.update({
                          chart:{
                            marginTop: 90
                          },
                          title: {
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">SHE Management<br>'+localStorage.p_name+'<br>HSET ACTIVITY/PROGRAM ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>HSET ACTIVITY/PROGRAM ('+monthYear+')</span>'
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
            text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>HSET ACTIVITY/PROGRAM ('+monthYear+')</span>'
        },
        xAxis: {
            categories: catArr,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' '
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            },
            series: {
                colorByPoint: true
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                cursor: 'pointer'
            }
        },
        series: seriesArr
    });
    chart.updateFlag = true;
}

function drawTypeOfPropDamageChart(data, monthYear) {
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = { name: idx, y: (ele && ele.total) ? ele.total : 0 };
            dataArr.push(tempArr);
        }
    }

    var chart = Highcharts.chart('typeOfPropDamageChart', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            events: {
                render() {
                  var chart = this;
        
                  if (document.fullscreenElement && chart.updateFlag) {
                    chart.updateFlag = false;
                    chart.update({
                      chart:{
                        marginTop: 90
                      },
                      title: {
                        text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">SHE Management<br>'+localStorage.p_name+'<br>TYPES OF PROPERTY DAMAGE ('+monthYear+')</span>'
                      }
                    })
        
                    chart.updateFlag = true;
                  }
                  else if (chart.updateFlag) {
                    chart.updateFlag = false;
        
                    chart.update({
                      title: {
                        text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>TYPES OF PROPERTY DAMAGE ('+monthYear+')</span>'
                      }
                    })
                  }
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>TYPES OF PROPERTY DAMAGE ('+monthYear+')</span>'
        },
        title: {
            text: ''
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
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            colorByPoint: true,
            name: 'No. of Incident',
            data: dataArr,
            events: {
                click: function (event) {
                    var dateFilter = getDateFromToFilter();
                    var linkParamArr = processFilterParamArr([dateFilter.dateFrom, dateFilter.dateTo, '', event.point.name, 'Property Damage']);
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("IR", "construct_dash_conop_inc", linkParamArr, "Incident - " + event.point.name);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"IR", conOpTabId:"conopTab6", linkName:"construct_dash_conop_inc", linkParam:linkParamArr, linkWinTitle: 'Incident'};
                        postMessageParent(postParam);
                    }
                }
            }
        }],
        credits: false
    });
    chart.updateFlag = true;
}

function updateIncidentByCatTable(data) {
    var cumulHTML = "";
    var currHTML = "";
    var incTabHTML = "";
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            currHTML = ((ele.current) ? `<span class='clickableCard' onclick="conOpIncidentLink('','`+idx+`')">`+ele.current+`</span>` : "0");
            cumulHTML = ((ele.cumulative) ? `<span class='clickableCard' onclick="conOpIncidentLink('','`+idx+`', true)">`+ele.cumulative+`</span>` : "0");
            incTabHTML += "<tr><td>" + idx + "</td><td>" + currHTML + "</td><td>" + cumulHTML + "</td></tr>"
        }
    }
    $("#incidentTbBody").html(incTabHTML);
}

function conOpNCR(status, category='', issuer='', consultant=''){
    var dateFilter = getDateFromToFilter();
    var dateFrom = dateFilter.dateFrom;
    var cardName;

    if(status=='current'){
        status = '';
        cardName = 'Current';
        if(getMonthFilter()==false){
            status = '-';
        }
    }else if(status == 'cumulative'){
        dateFrom = '';
        status = '';
        cardName = 'Cumulative';
    }else{
        cardName = status;
    }

    var linkParamArr = processFilterParamArr([dateFrom, dateFilter.dateTo, status, category, issuer, consultant, '']);
    
    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr_card", linkParamArr, "Non Conformance Report - " + category + " : " + cardName);
    }else{
        var postParam = {function:"openConOpDashboard",processType:'NCR', conOpTabId:'conopTab1', linkName:'construct_dash_conop_qaqc_ncr_card', linkParam:linkParamArr, linkWinTitle: 'Non Conformance Report'};
        postMessageParent(postParam)
    }
}

function updateNcrSafetyCard(curr = 0, cumul = 0, open = 0, closed = 0) {
    var category = 'Safety and Health';
    var issuer = 'Consultant';
    var receiver = '';
    var ncrSafetyPrevMonth = `<span class='clickableCard' onclick='conOpNCR("current", "`+category+`", "`+issuer+`", "`+receiver+`", "")'>`+curr+`</span>`;
    var ncrSafetyCurrMonth = `<span class='clickableCard' onclick='conOpNCR("cumulative", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+cumul+`</span>`;
    var ncrSafetyPending = `<span class='clickableCard' onclick='conOpNCR("Open", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+open+`</span>`;
    var ncrSafetyClosed = `<span class='clickableCard' onclick='conOpNCR("Closed", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+closed+`</span>`;

    $('#ncrSafetyPrevMonthCard').html(ncrSafetyPrevMonth);
    $('#ncrSafetyCurrMonthCard').html(ncrSafetyCurrMonth);
    $('#ncrSafetyPendingCard').html(ncrSafetyPending);
    $('#ncrSafetyClosedCard').html(ncrSafetyClosed);
}

function updateNcrEnviromentCard(curr = 0, cumul = 0, open = 0, closed = 0) {
    var category = 'Environment';
    var issuer = 'Consultant';
    var receiver = '';

    var ncrEnviromentPrevMonth = `<span class='clickableCard' onclick='conOpNCR("current", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+curr+`</span>`;
    var ncrEnviromentCurrMonth = `<span class='clickableCard' onclick='conOpNCR("cumulative", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+cumul+`</span>`;
    var ncrEnviromentPending = `<span class='clickableCard' onclick='conOpNCR("Open", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+open+`</span>`;
    var ncrEnviromentClosed = `<span class='clickableCard' onclick='conOpNCR("Closed", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+closed+`</span>`;

    $('#ncrEnviromentPrevMonthCard').html(ncrEnviromentPrevMonth);
    $('#ncrEnviromentCurrMonthCard').html(ncrEnviromentCurrMonth);
    $('#ncrEnviromentPendingCard').html(ncrEnviromentPending);
    $('#ncrEnviromentClosedCard').html(ncrEnviromentClosed);

}

function updateNcrTrafficCard(curr = 0, cumul = 0, open = 0, closed = 0) {
    var category = 'Traffic';
    var issuer = 'Consultant';
    var receiver = '';

    var ncrTrafficPrevMonth = `<span class='clickableCard' onclick='conOpNCR("current", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+curr+`</span>`;
    var ncrTrafficCurrMonth = `<span class='clickableCard' onclick='conOpNCR("cumulative", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+cumul+`</span>`;
    var ncrTrafficPending = `<span class='clickableCard' onclick='conOpNCR("Open", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+open+`</span>`;
    var ncrTrafficClosed = `<span class='clickableCard' onclick='conOpNCR("Closed", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+closed+`</span>`;

    $('#ncrTrafficPrevMonthCard').html(ncrTrafficPrevMonth);
    $('#ncrTrafficCurrMonthCard').html(ncrTrafficCurrMonth);
    $('#ncrTrafficPendingCard').html(ncrTrafficPending);
    $('#ncrTrafficClosedCard').html(ncrTrafficClosed);

}


function drawCumulNcrSafetyChart(data, proj='', monthYear) {
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0 };
            dataArr.push(tempArr);
        }
    }

    // cumNcrSafetyChart
    var chart = Highcharts.chart('cumNcrSafetyChart', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            events: {
                render() {
                  var chart = this;
        
                  if (document.fullscreenElement && chart.updateFlag) {
                    chart.updateFlag = false;
                    chart.update({
                      chart:{
                        marginTop: 90
                      },
                      title: {
                        text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">SHE Management<br>'+localStorage.p_name+'<br>NCR BY SOR : SAFETY & HEALTH ('+monthYear+')</span>'
                      }
                    })
        
                    chart.updateFlag = true;
                  }
                  else if (chart.updateFlag) {
                    chart.updateFlag = false;
        
                    chart.update({
                      title: {
                        text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>NCR BY SOR : SAFETY & HEALTH ('+monthYear+')</span>'
                      }
                    })
                  }
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>NCR BY SOR : SAFETY & HEALTH ('+monthYear+')</span>'
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
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
            innerSize: '65%',
            data: dataArr,
            events: {
                click: function (event) {                    
                    var dateFilter = getDateFromToFilter();
                    var category = event.point.name;
                    if(category=='Others'){
                        category = ' ';
                    }

                    var linkParamArr = processFilterParamArr(['', dateFilter.dateTo, '', 'Safety and Health', 'Consultant', '', category]);                    
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr_card", linkParamArr, "Non Conformance Report - Safety and Health : " + event.point.name);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr_card", linkParam:linkParamArr, linkWinTitle: 'Non Conformance Report'};
                        postMessageParent(postParam);
                    }
                }
            }
        }],
        credits: false
    });
    chart.updateFlag = true;
}

function drawCumulNcrEnviromentChart(data, proj, monthYear) {
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0 };
            dataArr.push(tempArr);
        }
    }
    // cumNcrEnvChart
    var chart = Highcharts.chart('cumNcrEnvChart', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            events: {
                render() {
                  var chart = this;
        
                  if (document.fullscreenElement && chart.updateFlag) {
                    chart.updateFlag = false;
                    chart.update({
                      chart:{
                        marginTop: 90
                      },
                      title: {
                        text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">SHE Management<br>'+localStorage.p_name+'<br>NCR BY SOR : ENVIRONMENTAL ('+monthYear+')</span>'
                      }
                    })
        
                    chart.updateFlag = true;
                  }
                  else if (chart.updateFlag) {
                    chart.updateFlag = false;
        
                    chart.update({
                      title: {
                        text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>NCR BY SOR : ENVIRONMENTAL ('+monthYear+')</span>'
                      }
                    })
                  }
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>NCR BY SOR : ENVIRONMENTAL ('+monthYear+')</span>'
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
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
            innerSize: '65%',
            data: dataArr,
            events: {
                click: function (event) {                    
                    var dateFilter = getDateFromToFilter();
                    var category = event.point.name;
                    if(category=='Others'){
                        category = ' ';
                    }
                    var linkParamArr = processFilterParamArr(['', dateFilter.dateTo, '', 'Environment', 'Consultant', '', category]);                    
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr_card", linkParamArr, "Non Conformance Report - Environmental : " + event.point.name);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr_card", linkParam:linkParamArr, linkWinTitle: 'Non Conformance Report'};
                        postMessageParent(postParam);
                    }
                }
            }
        }],
        credits: false
    });
    chart.updateFlag = true;
}

function drawCumulNcrTrafficChart(data, proj, monthYear) {
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0 };
            dataArr.push(tempArr);
        }
    }
    // cumNcrTrafficChart
    var chart = Highcharts.chart('cumNcrTrafficChart', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            events: {
                render() {
                  var chart = this;
        
                  if (document.fullscreenElement && chart.updateFlag) {
                    chart.updateFlag = false;
                    chart.update({
                      chart:{
                        marginTop: 90
                      },
                      title: {
                        text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">SHE Management<br>'+localStorage.p_name+'<br>NCR BY SOR : TRAFFIC MANAGEMENT ('+monthYear+')</span>'
                      }
                    })
        
                    chart.updateFlag = true;
                  }
                  else if (chart.updateFlag) {
                    chart.updateFlag = false;
        
                    chart.update({
                      title: {
                        text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>NCR BY SOR : TRAFFIC MANAGEMENT ('+monthYear+')</span>'
                      }
                    })
                  }
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>NCR BY SOR : TRAFFIC MANAGEMENT ('+monthYear+')</span>'
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
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
            innerSize: '65%',
            data: dataArr,
            events: {
                click: function (event) {                    
                    var dateFilter = getDateFromToFilter();
                    var category = event.point.name;
                    if(category=='Others'){
                        category = ' ';
                    }
                    var linkParamArr = processFilterParamArr(['', dateFilter.dateTo, '', 'Traffic', 'Consultant', '', category]);                    
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr_card", linkParamArr, "Non Conformance Report - Traffic Management : " + event.point.name);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr_card", linkParam:linkParamArr, linkWinTitle: 'Non Conformance Report'};
                        postMessageParent(postParam);
                    }
                }
            }
        }],
        credits: false
    });
    chart.updateFlag = true;
}

//TO SUBCON

function updateNcrSafetyCardSubCon(curr = 0, cumul = 0, open = 0, closed = 0) {
    var category = 'Safety and Health';
    var issuer = '';
    var receiver = 'SubCon';

    var ncrSubConSafetyPrevMonth = `<span class='clickableCard' onclick='conOpNCR("current", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+curr+`</span>`;
    var ncrSubConSafetyCurrMonth = `<span class='clickableCard' onclick='conOpNCR("cumulative", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+cumul+`</span>`;
    var ncrSubConSafetyPending = `<span class='clickableCard' onclick='conOpNCR("Open", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+open+`</span>`;
    var ncrSubConSafetyClosed = `<span class='clickableCard' onclick='conOpNCR("Closed", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+closed+`</span>`;

    $('#ncrSubConSafetyPrevMonthCard').html(ncrSubConSafetyPrevMonth);
    $('#ncrSubConSafetyCurrMonthCard').html(ncrSubConSafetyCurrMonth);
    $('#ncrSubConSafetyPendingCard').html(ncrSubConSafetyPending);
    $('#ncrSubConSafetyClosedCard').html(ncrSubConSafetyClosed);
}

function updateNcrEnviromentCardSubCon(curr = 0, cumul = 0, open = 0, closed = 0) {
    var category = 'Environment';
    var issuer = '';
    var receiver = 'SubCon';

    var ncrSubConEnviromentPrevMonth = `<span class='clickableCard' onclick='conOpNCR("current", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+curr+`</span>`;
    var ncrSubConEnviromentCurrMonth = `<span class='clickableCard' onclick='conOpNCR("cumulative", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+cumul+`</span>`;
    var ncrSubConEnviromentPending = `<span class='clickableCard' onclick='conOpNCR("Open", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+open+`</span>`;
    var ncrSubConEnviromentClosed = `<span class='clickableCard' onclick='conOpNCR("Closed", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+closed+`</span>`;

    $('#ncrSubConEnviromentPrevMonthCard').html(ncrSubConEnviromentPrevMonth);
    $('#ncrSubConEnviromentCurrMonthCard').html(ncrSubConEnviromentCurrMonth);
    $('#ncrSubConEnviromentPendingCard').html(ncrSubConEnviromentPending);
    $('#ncrSubConEnviromentClosedCard').html(ncrSubConEnviromentClosed);
}

function updateNcrTrafficCardSubCon(curr = 0, cumul = 0, open = 0, closed = 0) {
    var category = 'Traffic';
    var issuer = '';
    var receiver = 'SubCon';

    var ncrSubConTrafficPrevMonth = `<span class='clickableCard' onclick='conOpNCR("current", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+curr+`</span>`;
    var ncrSubConTrafficCurrMonth = `<span class='clickableCard' onclick='conOpNCR("cumulative", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+cumul+`</span>`;
    var ncrSubConTrafficPending = `<span class='clickableCard' onclick='conOpNCR("Open", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+open+`</span>`;
    var ncrSubConTrafficClosed = `<span class='clickableCard' onclick='conOpNCR("Closed", "`+category+`", "`+issuer+`", "`+receiver+`")'>`+closed+`</span>`;

    $('#ncrSubConTrafficPrevMonthCard').html(ncrSubConTrafficPrevMonth);
    $('#ncrSubConTrafficCurrMonthCard').html(ncrSubConTrafficCurrMonth);
    $('#ncrSubConTrafficPendingCard').html(ncrSubConTrafficPending);
    $('#ncrSubConTrafficClosedCard').html(ncrSubConTrafficClosed);
}

function drawCumulNcrSafetyChartSubCon(data, proj, monthYear) {
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0 };
            dataArr.push(tempArr);
        }
    }
    // cumNcrSafetyChart
    var chart = Highcharts.chart('cumNcrSubConSafetyChart', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            events: {
                render() {
                  var chart = this;
        
                  if (document.fullscreenElement && chart.updateFlag) {
                    chart.updateFlag = false;
                    chart.update({
                      chart:{
                        marginTop: 90
                      },
                      title: {
                        text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">SHE Management<br>'+localStorage.p_name+'<br>NCR TO SUBCON : SAFE & HEALTH ('+monthYear+')</span>'
                      }
                    })
        
                    chart.updateFlag = true;
                  }
                  else if (chart.updateFlag) {
                    chart.updateFlag = false;
        
                    chart.update({
                      title: {
                        text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>NCR TO SUBCON : SAFE & HEALTH ('+monthYear+')</span>'
                      }
                    })
                  }
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>NCR TO SUBCON : SAFE & HEALTH ('+monthYear+')</span>'
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
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
            innerSize: '65%',
            data: dataArr,
            events: {
                click: function (event) {                    
                    var dateFilter = getDateFromToFilter();
                    var category = event.point.name;
                    if(category=='Others'){
                        category = ' ';
                    }
                    var linkParamArr = processFilterParamArr(['', dateFilter.dateTo, '', 'Safety and Health', '', 'SubCon', category]);                    
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr_card", linkParamArr, "Non Conformance Report - Safety and Health : " + event.point.name);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr_card", linkParam:linkParamArr, linkWinTitle: 'Non Conformance Report'};
                        postMessageParent(postParam);
                    }
                }
            }
        }],
        credits: false
    });
    chart.updateFlag = true;
}

function drawCumulNcrEnviromentChartSubCon(data, proj, monthYear) {
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0 };
            dataArr.push(tempArr);
        }
    }
    // cumNcrEnvChart
    var chart = Highcharts.chart('cumNcrSubConEnvChart', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            events: {
                render() {
                  var chart = this;
        
                  if (document.fullscreenElement && chart.updateFlag) {
                    chart.updateFlag = false;
                    chart.update({
                      chart:{
                        marginTop: 90
                      },
                      title: {
                        text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">SHE Management<br>'+localStorage.p_name+'<br>NCR TO SUBCON : ENVIRONMENTAL ('+monthYear+')</span>'
                      }
                    })
        
                    chart.updateFlag = true;
                  }
                  else if (chart.updateFlag) {
                    chart.updateFlag = false;
        
                    chart.update({
                      title: {
                        text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>NCR TO SUBCON : ENVIRONMENTAL ('+monthYear+')</span>'
                      }
                    })
                  }
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>NCR TO SUBCON : ENVIRONMENTAL ('+monthYear+')</span>'
        },
        title: {
            text: ''
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
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
            innerSize: '65%',
            data: dataArr,
            events: {
                click: function (event) {                    
                    var dateFilter = getDateFromToFilter();
                    var category = event.point.name;
                    if(category=='Others'){
                        category = ' ';
                    }
                    var linkParamArr = processFilterParamArr(['', dateFilter.dateTo, '', 'Environment', '', 'SubCon', category]);                    
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr_card", linkParamArr, "Non Conformance Report - Environmental : " + event.point.name);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr_card", linkParam:linkParamArr, linkWinTitle: 'Non Conformance Report'};
                        postMessageParent(postParam);
                    }
                }
            }
        }],
        credits: false
    });
    chart.updateFlag = true;
}

function drawCumulNcrTrafficChartSubCon(data, proj, monthYear) {
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0 };
            dataArr.push(tempArr);
        }
    }
    // cumNcrTrafficChart
    var chart = Highcharts.chart('cumNcrSubConTrafficChart', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            events: {
                render() {
                  var chart = this;
        
                  if (document.fullscreenElement && chart.updateFlag) {
                    chart.updateFlag = false;
                    chart.update({
                      chart:{
                        marginTop: 90
                      },
                      title: {
                        text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">SHE Management<br>'+localStorage.p_name+'<br>NCR TO SUBCON : TRAFFIC MANAGEMENT ('+monthYear+')</span>'
                      }
                    })
        
                    chart.updateFlag = true;
                  }
                  else if (chart.updateFlag) {
                    chart.updateFlag = false;
        
                    chart.update({
                      title: {
                        text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>NCR TO SUBCON : TRAFFIC MANAGEMENT ('+monthYear+')</span>'
                      }
                    })
                  }
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">SHE Management<br>'+localStorage.p_name+'<br>NCR TO SUBCON : TRAFFIC MANAGEMENT ('+monthYear+')</span>'
        },
        title: {
            text: ''
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
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
            innerSize: '65%',
            data: dataArr,
            events: {
                click: function (event) {                    
                    var dateFilter = getDateFromToFilter();
                    var category = event.point.name;
                    if(category=='Others'){
                        category = ' ';
                    }
                    var linkParamArr = processFilterParamArr(['', dateFilter.dateTo, '', 'Traffic', '', 'SubCon', category]);                    
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("NCR", "construct_dash_conop_qaqc_ncr_card", linkParamArr, "Non Conformance Report - Traffic Management : " + event.point.name);
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"NCR", conOpTabId:"conopTab1", linkName:"construct_dash_conop_qaqc_ncr_card", linkParam:linkParamArr, linkWinTitle: 'Non Conformance Report'};
                        postMessageParent(postParam);
                    }
                }
            }
        }],
        credits: false
    });
    chart.updateFlag = true;
}

function updateFatalityCard(data) {
    var publicRelated = (data['Public Related']) ? parseInt(data['Public Related']) : 0;
    var wpcRelated = (data['Contractor Related']) ? parseInt(data['Contractor Related']) : 0;

    var publicRelatedHTML = (publicRelated) ? `<span class='clickableCard' onclick='conOpIncidentLink("Public Related")'>`+publicRelated+`</span>` : publicRelated;
    var wpcRelatedHTML = (wpcRelated) ? `<span class='clickableCard' onclick='conOpIncidentLink("Contractor Related")'>`+wpcRelated+`</span>` : wpcRelated;

    $('#fatalityPublicTtl').html(publicRelatedHTML);
    $('#fatalityWpcTtl').html(wpcRelatedHTML);
}

function refreshInformation(proj = 'overall', yr = 'all', mth = 'all') {
    var dataYearMonth = "Month:" +mth+ " - " + "Year:" +yr;
    var incByCat = (qualityData.incident && qualityData.incident[proj] && qualityData.incident[proj][yr] && qualityData.incident[proj][yr][mth] && qualityData.incident[proj][yr][mth].byCategory) ? qualityData.incident[proj][yr][mth].byCategory : [];
    updateIncidentByCatTable(incByCat);

    var typeOfPropDamageData = (qualityData.incident && qualityData.incident[proj] && qualityData.incident[proj][yr] && qualityData.incident[proj][yr][mth] && qualityData.incident[proj][yr][mth].byPropDamageType) ? qualityData.incident[proj][yr][mth].byPropDamageType : [];
    drawTypeOfPropDamageChart(typeOfPropDamageData, dataYearMonth);

    var activityData = (qualityData.safetyActivity && qualityData.safetyActivity[proj] && qualityData.safetyActivity[proj][yr] && qualityData.safetyActivity[proj][yr][mth]) ? qualityData.safetyActivity[proj][yr][mth] : [];
    var sCData = (activityData && activityData.siteComm) ? activityData.siteComm : [];
    var tBData = (activityData && activityData.toolboxBrief) ? activityData.toolboxBrief : [];
    var combineSAData = (activityData && activityData.safe) ? activityData.safe : [];
    var fEData = (activityData && activityData.fireExt) ? activityData.fireExt : [];

    drawHSETCommMeetChart(sCData, dataYearMonth);
    drawMassToolBoxBriefChart(tBData, dataYearMonth);
    drawHSEWalkaboutChart(combineSAData, dataYearMonth);
    drawHSETActivityChart(fEData, dataYearMonth);

    //BY SOR
    var safetyNcrData = (qualityData.ncr && qualityData.ncr[proj] && qualityData.ncr[proj][yr] && qualityData.ncr[proj][yr][mth] && qualityData.ncr[proj][yr][mth]['issueConsultant'] && qualityData.ncr[proj][yr][mth]['issueConsultant'].byCategory && qualityData.ncr[proj][yr][mth]['issueConsultant'].byCategory['Safety and Health']) ? qualityData.ncr[proj][yr][mth]['issueConsultant'].byCategory['Safety and Health'] : [];
    var safetyBySubCatData = (safetyNcrData.bySubCategory) ? safetyNcrData.bySubCategory : [];
    drawCumulNcrSafetyChart(safetyBySubCatData, proj, dataYearMonth);
    var safetyCurrCnt = (safetyNcrData.byTotal && safetyNcrData.byTotal.current) ? parseInt(safetyNcrData.byTotal.current) : 0;
    var safetyCumulCnt = (safetyNcrData.byTotal && safetyNcrData.byTotal.cumulative) ? parseInt(safetyNcrData.byTotal.cumulative) : 0;
    var safetyOpenCnt = (safetyNcrData.byStatus && safetyNcrData.byStatus.Open) ? parseInt(safetyNcrData.byStatus.Open) : 0;
    var safetyCloseCnt = (safetyNcrData.byStatus && safetyNcrData.byStatus.Closed) ? parseInt(safetyNcrData.byStatus.Closed) : 0;
    updateNcrSafetyCard(safetyCurrCnt, safetyCumulCnt, safetyOpenCnt, safetyCloseCnt);

    var enviromentNcrData = (qualityData.ncr && qualityData.ncr[proj] && qualityData.ncr[proj][yr] && qualityData.ncr[proj][yr][mth] && qualityData.ncr[proj][yr][mth]['issueConsultant'] && qualityData.ncr[proj][yr][mth]['issueConsultant'].byCategory  && qualityData.ncr[proj][yr][mth]['issueConsultant'].byCategory['Environment']) ? qualityData.ncr[proj][yr][mth]['issueConsultant'].byCategory['Environment'] : [];
    var enviromentBySubCatData = (enviromentNcrData.bySubCategory) ? enviromentNcrData.bySubCategory : [];
    drawCumulNcrEnviromentChart(enviromentBySubCatData, proj, dataYearMonth);
    var enviromentCurrCnt = (enviromentNcrData.byTotal && enviromentNcrData.byTotal.current) ? parseInt(enviromentNcrData.byTotal.current) : 0;
    var enviromentCumulCnt = (enviromentNcrData.byTotal && enviromentNcrData.byTotal.cumulative) ? parseInt(enviromentNcrData.byTotal.cumulative) : 0;
    var enviromentOpenCnt = (enviromentNcrData.byStatus && enviromentNcrData.byStatus.Open) ? parseInt(enviromentNcrData.byStatus.Open) : 0;
    var enviromentCloseCnt = (enviromentNcrData.byStatus && enviromentNcrData.byStatus.Closed) ? parseInt(enviromentNcrData.byStatus.Closed) : 0;
    updateNcrEnviromentCard(enviromentCurrCnt, enviromentCumulCnt, enviromentOpenCnt, enviromentCloseCnt);

    var trafficNcrData =  (qualityData.ncr && qualityData.ncr[proj] && qualityData.ncr[proj][yr] && qualityData.ncr[proj][yr][mth] && qualityData.ncr[proj][yr][mth]['issueConsultant'] && qualityData.ncr[proj][yr][mth]['issueConsultant'].byCategory  && qualityData.ncr[proj][yr][mth]['issueConsultant'].byCategory['Traffic']) ? qualityData.ncr[proj][yr][mth]['issueConsultant'].byCategory['Traffic'] : [];  
    var trafficBySubCatData = (trafficNcrData.bySubCategory) ? trafficNcrData.bySubCategory : [];
    drawCumulNcrTrafficChart(trafficBySubCatData, proj, dataYearMonth);
    var trafficCurrCnt = (trafficNcrData.byTotal && trafficNcrData.byTotal.current) ? parseInt(trafficNcrData.byTotal.current) : 0;
    var trafficCumulCnt = (trafficNcrData.byTotal && trafficNcrData.byTotal.cumulative) ? parseInt(trafficNcrData.byTotal.cumulative) : 0;
    var trafficOpenCnt = (trafficNcrData.byStatus && trafficNcrData.byStatus.Open) ? parseInt(trafficNcrData.byStatus.Open) : 0;
    var trafficCloseCnt = (trafficNcrData.byStatus && trafficNcrData.byStatus.Closed) ? parseInt(trafficNcrData.byStatus.Closed) : 0;
    updateNcrTrafficCard(trafficCurrCnt, trafficCumulCnt, trafficOpenCnt, trafficCloseCnt);


    //TO SUBCON
    var safetyNcr = (qualityData.ncr && qualityData.ncr[proj] && qualityData.ncr[proj][yr] && qualityData.ncr[proj][yr][mth] && qualityData.ncr[proj][yr][mth]['receivedSubcon'] && qualityData.ncr[proj][yr][mth]['receivedSubcon'].byCategory && qualityData.ncr[proj][yr][mth]['receivedSubcon'].byCategory['Safety and Health']) ? qualityData.ncr[proj][yr][mth]['receivedSubcon'].byCategory['Safety and Health'] : [];
    var safetyBySubCat = (safetyNcr.bySubCategory) ? safetyNcr.bySubCategory : [];
    drawCumulNcrSafetyChartSubCon(safetyBySubCat, proj, dataYearMonth);
    var safeCurrCnt = (safetyNcr.byTotal && safetyNcr.byTotal.current) ? parseInt(safetyNcr.byTotal.current) : 0;
    var safeCumulCnt = (safetyNcr.byTotal && safetyNcr.byTotal.cumulative) ? parseInt(safetyNcr.byTotal.cumulative) : 0;
    var safeOpenCnt = (safetyNcr.byStatus && safetyNcr.byStatus.Open) ? parseInt(safetyNcr.byStatus.Open) : 0;
    var safeCloseCnt = (safetyNcr.byStatus && safetyNcr.byStatus.Closed) ? parseInt(safetyNcr.byStatus.Closed) : 0;
    updateNcrSafetyCardSubCon(safeCurrCnt, safeCumulCnt, safeOpenCnt, safeCloseCnt);

    var enviromentNcr = (qualityData.ncr && qualityData.ncr[proj] && qualityData.ncr[proj][yr] && qualityData.ncr[proj][yr][mth] && qualityData.ncr[proj][yr][mth]['receivedSubcon'] && qualityData.ncr[proj][yr][mth]['receivedSubcon'].byCategory  && qualityData.ncr[proj][yr][mth]['receivedSubcon'].byCategory['Environment']) ? qualityData.ncr[proj][yr][mth]['receivedSubcon'].byCategory['Environment'] : [];
    var enviromentBySubCat = (enviromentNcr.bySubCategory) ? enviromentNcr.bySubCategory : [];
    drawCumulNcrEnviromentChartSubCon(enviromentBySubCat, proj, dataYearMonth);
    var enviromentCurr = (enviromentNcr.byTotal && enviromentNcr.byTotal.current) ? parseInt(enviromentNcr.byTotal.current) : 0;
    var enviromentCumul = (enviromentNcr.byTotal && enviromentNcr.byTotal.cumulative) ? parseInt(enviromentNcr.byTotal.cumulative) : 0;
    var enviromentOpen = (enviromentNcr.byStatus && enviromentNcr.byStatus.Open) ? parseInt(enviromentNcr.byStatus.Open) : 0;
    var enviromentClose = (enviromentNcr.byStatus && enviromentNcr.byStatus.Closed) ? parseInt(enviromentNcr.byStatus.Closed) : 0;
    updateNcrEnviromentCardSubCon(enviromentCurr, enviromentCumul, enviromentOpen, enviromentClose);

    var trafficNcr =  (qualityData.ncr && qualityData.ncr[proj] && qualityData.ncr[proj][yr] && qualityData.ncr[proj][yr][mth] && qualityData.ncr[proj][yr][mth]['receivedSubcon'] && qualityData.ncr[proj][yr][mth]['receivedSubcon'].byCategory  && qualityData.ncr[proj][yr][mth]['receivedSubcon'].byCategory['Traffic']) ? qualityData.ncr[proj][yr][mth]['receivedSubcon'].byCategory['Traffic'] : [];  
    var trafficBySubCat = (trafficNcr.bySubCategory) ? trafficNcr.bySubCategory : [];
    drawCumulNcrTrafficChartSubCon(trafficBySubCat, proj, dataYearMonth);
    var trafficCurr = (trafficNcr.byTotal && trafficNcr.byTotal.current) ? parseInt(trafficNcr.byTotal.current) : 0;
    var trafficCumul = (trafficNcr.byTotal && trafficNcr.byTotal.cumulative) ? parseInt(trafficNcr.byTotal.cumulative) : 0;
    var trafficOpen = (trafficNcr.byStatus && trafficNcr.byStatus.Open) ? parseInt(trafficNcr.byStatus.Open) : 0;
    var trafficClose = (trafficNcr.byStatus && trafficNcr.byStatus.Closed) ? parseInt(trafficNcr.byStatus.Closed) : 0;
    updateNcrTrafficCardSubCon(trafficCurr, trafficCumul, trafficOpen, trafficClose);

    var overallManHrsData = (qualityData.overallManHours && qualityData.overallManHours[proj] && qualityData.overallManHours[proj][yr] && qualityData.overallManHours[proj][yr][mth]) ? qualityData.overallManHours[proj][yr][mth] : [];
    updateManHrsCard(overallManHrsData);

    var fatalityData = (qualityData.incident && qualityData.incident[proj] && qualityData.incident[proj][yr] && qualityData.incident[proj][yr][mth] && qualityData.incident[proj][yr][mth].fatality) ? qualityData.incident[proj][yr][mth].fatality : [];
    updateFatalityCard(fatalityData);
}

function refreshDashboard() {
    var selWPC = $("#wpcFilter").val();
    var selYr = $("#yearFilter").val();
    if (selYr == 'all') {
    	$('#monthFilter').prop("disabled", true);	
		$('#monthFilter').val('all');
    }else{
    	$('#monthFilter').prop("disabled", false);
    }
	var selMonth = $('#monthFilter').val();

    refreshInformation(selWPC, selYr, selMonth);

}

function refreshFromv3 (filterArr){
    var wpc = filterArr.wpc;
    var year = filterArr.year;
    var month = filterArr.month;
  
    refreshInformation(wpc, year, textMonthtoNum[month]);
}

$(function () {
    // load all the chart
    $.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "quality"
        },
        success: function (obj) {
            if (obj.status && obj.status == 'ok') {
                qualityData = obj.data;
                refreshInformation();
            }
        },
        complete: function (){
            window.parent.postMessage({functionName: 'loaderajaxEnd'})
        }
    });

    $(".outer").css("height", "100%");
    $(".outer").css("margin", '0')
    $('.scrollbar-inner').scrollbar();
})