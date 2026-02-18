var summaryData;
var monthHalftext = {"01":"Jan","02":"Feb","03":"Mar","04":"Apr","05":"May","06":"Jun","07":"Jul","08":"Aug","09":"Sep","10":"Oct","11":"Nov","12":"Dec"};
var monthFulltext = {'01':"January",'02':"February",'03':"March",'04':"April",'05':"May",'06':"June",'07':"July",'08':"August",'09':"September",'10':"October",'11':"November",'12':"December"}
var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};

function openProgressSummaryUpload(plannedVal = '', plannedFinVal = ''){
    var postParam = {function:"openProgressSummaryUpload",plannedVal:plannedVal, plannedFinVal:plannedFinVal};
    if(localStorage.isParent && localStorage.isParent == 'isParent'){
        var selWpc = $('#wpcFilter').val();
        if (selWpc == 'overall') selWpc = '';
        var postParam = {function:"openProgressSummaryUpload",plannedVal:plannedVal, plannedFinVal:plannedFinVal, selectedWPC : selWpc};
    }
    parent.postMessage(postParam ,"*");
}

function conOpSMHLink(yrFilter = '', mthFilter = '', title){
    var linkParamArr = processFilterParamArr([mthFilter, yrFilter]);
    var postParam = {function:"openConOpDashboard",processType:"SMH", conOpTabId:"conopTab10", linkName:"construct_dash_conop_smh", linkParam:linkParamArr, linkWinTitle: 'Safe Man-Hour'};
    var cardName;

    if(localStorage.ui_pref == "ri_v3"){
        (title == "smhWOLti") ? cardName = "W/O LTI" : cardName = "WITH LTI";
        window.parent.widgetConopOpen("SMH", "construct_dash_conop_smh", linkParamArr, "Safe Man-Hour - " + cardName);
    }else{
        postMessageParent(postParam)
    }
}

function conOpLink(process, status, param1='', param2=''){
    var conOpTabId = '';
    var linkName = '';
    var linkWinTitle = '';
    var linkParamArr = '';
    var dateFilter = getDateFromToFilter()
    var dateFilterQuality = getDateFromToFilterClaim()

    switch (process) {
        case 'NCR':
            conOpTabId = 'conopTab1'
            linkName = 'construct_dash_conop_ncr'
            linkWinTitle = 'Non Conformance Report'
            linkParamArr = processFilterParamArr(['', dateFilterQuality.dateTo, status, 'Quality']);
            break;
        case 'MOS':
            conOpTabId = 'conopTab4'
            linkName = 'construct_dash_conop_ms'
            linkWinTitle = 'Method Statement'
            if (status == 'Open'){
                linkParamArr = processFilterParamArr([dateFilterQuality.dateFrom, dateFilterQuality.dateTo, 'Approved', 'Unapproved', 'Rejected', 'Under Review', 'Cancel'])
            }else if(status == 'Close'){
                linkParamArr = processFilterParamArr([dateFilterQuality.dateFrom, dateFilterQuality.dateTo, 'Close', '', '', ''])
            }else{
                linkParamArr = processFilterParamArr([dateFilterQuality.dateFrom, dateFilterQuality.dateTo, '', '', '', '', ''])
            }
            break;
        case 'MS':
            conOpTabId = 'conopTab5'
            linkName = 'construct_dash_conop_ma'
            linkWinTitle = 'Material Submission'
            if (status == 'Open'){
                linkParamArr = processFilterParamArr([dateFilterQuality.dateFrom, dateFilterQuality.dateTo, 'Approved', 'Rejected', 'Under Review', 'Cancel'])
            }else if(status == 'Close'){
                linkParamArr = processFilterParamArr([dateFilterQuality.dateFrom, dateFilterQuality.dateTo, 'Close', '', '', ''])
            }else{
                linkParamArr = processFilterParamArr([dateFilterQuality.dateFrom, dateFilterQuality.dateTo, '', '', '', ''])
            }
            break;
        case 'Contract':
            linkWinTitle = 'Original Contract'
            linkName = 'finance_list_contract_list_card'
            linkParamArr = processFilterParamArr(['', param1, param2])
            cardName = status
            break;
        case 'Claim':
            linkWinTitle = 'Claim'
            linkName = 'finance_list_claim_list_card'
            var dateFilterClaim = getDateFromToFilterClaim()
            if(status=='claim'){
                linkParamArr = processFilterParamArr([param1, '', '', '', dateFilterClaim.dateTo])
            }else{
                linkParamArr = processFilterParamArr([param1, '', dateFilterClaim.dateTo])
            }
            cardName = status
            break;
        case 'INC':
            linkWinTitle = 'Document Incoming'
            linkName = 'document_corr_list_card'
            var docDate = getDocumentDate(dateFilter);
            linkParamArr = processFilterParamArr([docDate.dateFrom, docDate.dateTo,, 'Incoming'])
            cardName = status
            break;

        case 'OUT':
            linkWinTitle = 'Document Outcoming'
            linkName = 'document_corr_list_card'
            var docDate = getDocumentDate(dateFilter);
            linkParamArr = processFilterParamArr([docDate.dateFrom, docDate.dateTo, 'Outgoing'])
            cardName = status
            break;
        
    }

    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle);
    }else{
        var postParam = {function:"openConOpDashboard",processType:process, conOpTabId:conOpTabId, linkName:linkName, linkParam:linkParamArr, linkWinTitle: linkWinTitle};
        postMessageParent(postParam)
    }
}

function format_number(n){
    return Number(parseFloat(n).toFixed(2));
}

function drawPhySCurve(data, showLateInfo = true, yrFilter, mthFilter) {
    var phyEarly = [];
    var phyPlan = [];
    var phyAct = [];
    var monthYear = [];
    var seriesArr = [];

    var filterFlag = true;
    var actKey = '';
    if(yrFilter != 'all' && mthFilter != 'all'){
        actKey = monthHalftext[mthFilter]+'-'+yrFilter;
    }

    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            monthYear.push(idx);
            phyPlan.push((ele.phyPlan) ? format_number(ele.phyPlan) : 0);
            phyEarly.push((ele.phyEarly) ? format_number(ele.phyEarly) : 0);
            if(actKey){
                if(filterFlag) phyAct.push(format_number(ele.phyAct));
                if(idx == actKey) filterFlag = false;
            }else{
                phyAct.push(format_number(ele.phyAct));
            }
        }
    }

    if (showLateInfo) {
        seriesArr = [{
            name: 'Early',
            data: phyEarly,
            color: 'red',
            events: {
                click: function (event) {
                    openProgressSummaryUpload()
                }
            }
        }, {
            name: 'Planned',
            data: phyPlan,
            color: 'blue',
            events: {
                click: function (event) {
                    openProgressSummaryUpload()
                }
            }
        }, {
            name: 'Actual',
            data: phyAct,
            color: 'green'
        }];
    } else {
        seriesArr = [{
            name: 'Early',
            data: phyEarly,
            color: 'red',
            events: {
                click: function (event) {
                    openProgressSummaryUpload()
                }
            }
        }, {
            name: 'Actual',
            data: phyAct,
            color: 'green'
        }];
    }

    var range = "";

    if(monthYear.length > 0){
        let first = monthYear[0];
        let last = monthYear[monthYear.length-1]

        range = first+" to "+last;
    }

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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Project Summary<br>'+localStorage.p_name+'<br>PHYSICAL ('+range+')</span>'
                          },
                          legend: {
                            symbolHeight: 15,
                            symbolWidth: 15,
                            align: 'right',
                            verticalAlign: 'middle',
                            layout: 'vertical',
                            floating: true,
                            y: -60,
                            x: 0,
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
                            text: '<span class="showLabel">Project Summary<br>'+localStorage.p_name+'<br>PHYSICAL ('+range+')</span>'
                          },
                          legend: {
                            symbolHeight: 8,
                            symbolWidth: 8,
                            itemStyle : {
                              fontSize : '8px'
                            }
                          }
                        })
                      }
                  }
        
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Project Summary<br>'+localStorage.p_name+'<br>PHYSICAL '+range+'</span>'
        },
        xAxis: {
            categories: monthYear
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
            series: {
                cursor: 'pointer',
                label: {
                    connectorAllowed: false
                }
            }
        },
        legend: {
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical',
            floating: true,
            y: -60,
            x: 55,
            itemStyle: {
                fontSize: 8
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
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

function drawFinSCurve(data, showLateInfo = true, yrFilter, mthFilter) {
    var finEarly = [];
    var finPlan = [];
    var finActual = [];
    var monthYear = [];
    var seriesArr = [];

    var filterFlag = true;
    var actKey = '';
    if(yrFilter != 'all' && mthFilter != 'all'){
        actKey = monthHalftext[mthFilter]+'-'+yrFilter;
    }

    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            monthYear.push(idx);
            finPlan.push((ele.finPlan) ? format_number(ele.finPlan) : 0);
            finEarly.push((ele.finEarly) ? format_number(ele.finEarly) : 0);
            if(actKey){
                if(filterFlag) finActual.push(format_number(ele.finActual));
                if(idx == actKey) filterFlag = false;
            }else{
                finActual.push(format_number(ele.finActual));
            }
        }
    }
    if (showLateInfo) {
        seriesArr = [{
            name: 'Early',
            data: finEarly,
            color: 'red',
            events: {
                click: function (event) {
                    openProgressSummaryUpload()
                }
            }
        }, {
            name: 'Planned',
            data: finPlan,
            color: 'blue',
            events: {
                click: function (event) {
                    openProgressSummaryUpload()
                }
            }
        }, {
            name: 'Actual',
            data: finActual,
            color: 'green'
        }];
    } else {
        seriesArr = [{
            name: 'Early',
            data: finEarly,
            color: 'red',
            events: {
                click: function (event) {
                    openProgressSummaryUpload()
                }
            }
        }, {
            name: 'Actual',
            data: finActual,
            color: 'green'
        }];
    }

    var range = "";

    if(monthYear.length > 0){
        let first = monthYear[0];
        let last = monthYear[monthYear.length-1]

        range = first+" to "+last;
    }

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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Project Summary<br>'+localStorage.p_name+'<br>FINANCIAL ('+range+')</span>'
                          },
                          legend: {
                            symbolHeight: 15,
                            symbolWidth: 15,
                            align: 'right',
                            verticalAlign: 'middle',
                            layout: 'vertical',
                            floating: true,
                            y: -60,
                            x: 0,
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
                            text: '<span class="showLabel">Project Summary<br>'+localStorage.p_name+'<br>FINANCIAL ('+range+')</span>'
                          },
                          legend: {
                            symbolHeight: 8,
                            symbolWidth: 8,
                            itemStyle : {
                              fontSize : '8px'
                            }
                          }
                        })
                      }
                  }
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Progress Summary<br>'+localStorage.p_name+'<br>FINANCIAL ('+range+')</span>'
        },
        xAxis: {
            categories: monthYear
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
        legend: {
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical',
            floating: true,
            y: -60,
            x: 55,
            itemStyle: {
                fontSize: 8
            }
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                label: {
                    connectorAllowed: false
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.2f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
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

function updateContractParticularCard(data, contract_id='') {    
    var contractNoCard = (data.contract_no) ? `<span class="clickableCard" onclick="conOpLink('Contract', '', '`+contract_id+`', '`+data.contract_no+`')">`+ (data.contract_no) +`</span>` : 'N/A';
    var origCompDateCard = (data.completion_date) ? `<span class="clickableCard" onclick="conOpLink('Contract', '', '`+contract_id+`', '`+data.contract_no+`')">`+ (data.completion_date) +`</span>`  : 'N/A';
    var commencementDateCard = (data.loa_date) ? `<span class="clickableCard" onclick="conOpLink('Contract','',  '`+contract_id+`', '`+data.contract_no+`')">`+ (data.loa_date) +`</span>`  : 'N/A';
    var extensionOfTimeCard = (data.extension_of_time) ? `<span class="clickableCard" onclick="conOpLink('Contract', '', '`+contract_id+`', '`+data.contract_no+`')">`+ (data.extension_of_time) +`</span>`  : '0';
    var revisedCompletionDateCard = (data.revised_completion_date) ? `<span class="clickableCard" onclick="conOpLink('Contract', '',  '`+contract_id+`', '`+data.contract_no+`')">`+ (data.revised_completion_date) +`</span>`  : 'N/A';
    var subContractorValue = (data.total_subcontractor_amount) ? `<span class="clickableCard" onclick="conOpLink('Contract', '', '`+contract_id+`', '`+data.contract_no+`')">`+ ('RM ' + formatCurrency(data.total_subcontractor_amount)) +`</span>`  : 'N/A';

    $("#contractNoCard").html(contractNoCard);
    $("#origCompDateCard").html(origCompDateCard);
    $("#commencementDateCard").html(commencementDateCard);
    $("#extensionOfTimeCard").html(extensionOfTimeCard);
    $("#revisedCompletionDateCard").html(revisedCompletionDateCard);
    $("#subConVal").html(subContractorValue);
}

function drawFinancialGaugeCharts(planFin, actFin, planPhy, actPhy, monthYear) {
    planFin = format_number(planFin);
    actFin = format_number(actFin);
    planPhy = format_number(planPhy);
    actPhy = format_number(actPhy);
    var gaugeOptions = {
        chart: {
            type: 'solidgauge'
        },
        title: null,
        tooltip: {
            enabled: false
        },
        pane: {
            startAngle: 0,
            endAngle: 360,
            background: [{
                outerRadius: '100%',
                innerRadius: '88%',
                backgroundColor: Highcharts.color(Highcharts.getOptions().colors[0])
                    .setOpacity(0.3)
                    .get(),
                borderWidth: 0
            }]
        },
        series: [{
            data: [{
                radius: '112%',
                innerRadius: '88%',
                y: planFin
            }],
            dataLabels: {
                enabled : true,
                formatter: function () {
                    return '<div style="text-align:center">' +
                    '<span style="font-size:11.5px">'+Highcharts.numberFormat(this.y,2)+' %</span>' +
                    '</div>';
                }
            }
        }],
        credits: false
    };

    var dataLabelOptions =  {
        enabled : true,
        formatter: function () {
            return '<div style="text-align:center; displa">' +
            '<span style="font-size:11.5px">'+Highcharts.numberFormat(this.y,2)+' %</span>' +
            '</div>';
        }
    };

    var chart1 = Highcharts.chart('plannedFinancialGaugeCharts', Highcharts.merge(gaugeOptions, {
        chart: {
            events: {
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
                                text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Project Summary<br>'+localStorage.p_name+'<br>PLANNED FINANCIAL ('+monthYear+')</span>'
                              },
                            })
                
                            chart.updateFlag = true;
                          }
                          else if (chart.updateFlag) {
                            chart.updateFlag = false;
                
                            chart.update({
                              chart:{
                                marginTop: 10
                              },
                              title: {
                                text: '<span class="showLabel">Project Summary<br>'+localStorage.p_name+'<br>PLANNED FINANCIAL ('+monthYear+')</span>'
                              },
                            })
                          }
                      }
            
                    }
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Progress Summary<br>'+localStorage.p_name+'<br>PLANNED FINANCIAL ('+monthYear+')</span>'
        },
        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
        },
        plotOptions: {
            solidgauge: {
                linecap: 'round',
                cursor: 'pointer',
                stickyTracking: false,
                rounded: true,
                dataLabels: {
                    y: -12,
                    borderWidth: 0,
                    useHTML: true
                }
            },
        },
        series: [{
            data: [{
                radius: '112%',
                innerRadius: '88%',
                y: planFin,
                events: {
                    click: function (event) {
                        openProgressSummaryUpload(planPhy)
                    }
                }
            }],
            dataLabels: dataLabelOptions
        }]
    }));
    chart1.updateFlag = true;

    var chart2 = Highcharts.chart('actualFinancialGaugeCharts', Highcharts.merge(gaugeOptions, {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Progress Summary<br>'+localStorage.p_name+'<br>ACTUAL FINANCIAL ('+monthYear+')</span>'
                          },
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">Progress Summary<br>'+localStorage.p_name+'<br>ACTUAL FINANCIAL ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Progress Summary<br>'+localStorage.p_name+'<br>ACTUAL FINANCIAL ('+monthYear+')</span>'
        },
        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
        },
        plotOptions: {
            solidgauge: {
                linecap: 'round',
                stickyTracking: false,
                rounded: true,
                dataLabels: {
                    y: -12,
                    borderWidth: 0,
                    useHTML: true
                }
            },
        },
        series: [{
            data: [{
                radius: '112%',
                innerRadius: '88%',
                y: actFin
            }],
            dataLabels: dataLabelOptions
        }]
    }));
    chart2.updateFlag = true;

    var chart3 = Highcharts.chart('plannedPhysicalGaugeCharts', Highcharts.merge(gaugeOptions, {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Progress Summary<br>'+localStorage.p_name+'<br>PLANNED PHYSICAL ('+monthYear+')</span>'
                          },
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">Progress Summary<br>'+localStorage.p_name+'<br>PLANNED PHYSICAL ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Progress Summary<br>'+localStorage.p_name+'<br>PLANNED PHYSICAL ('+monthYear+')</span>'
        },
        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
        },
        plotOptions: {
            solidgauge: {
                linecap: 'round',
                cursor: 'pointer',
                stickyTracking: false,
                rounded: true,
                dataLabels: {
                    y: -12,
                    borderWidth: 0,
                    useHTML: true
                }
            },
        },
        series: [{
            data: [{
                radius: '112%',
                innerRadius: '88%',
                y: planPhy,
                events: {
                    click: function (event) {
                        openProgressSummaryUpload(planPhy)
                    }
                }
            }],
            dataLabels: dataLabelOptions
        }]
    }));
    chart3.updateFlag = true;

    var chart4 = Highcharts.chart('actualPhysicalGaugeCharts', Highcharts.merge(gaugeOptions, {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Progress Summary<br>'+localStorage.p_name+'<br>ACTUAL PHYSICAL ('+monthYear+')</span>'
                          },
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">Progress Summary<br>'+localStorage.p_name+'<br>ACTUAL PHYSICAL ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Progress Summary<br>'+localStorage.p_name+'<br>ACTUAL PHYSICAL ('+monthYear+')</span>'
        },
        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
        },
        plotOptions: {
            solidgauge: {
                linecap: 'round',
                stickyTracking: false,
                rounded: true,
                dataLabels: {
                    y: -12,
                    borderWidth: 0,
                    useHTML: true
                }
            },
        },
        series: [{
            data: [{
                radius: '112%',
                innerRadius: '88%',
                y: actPhy
            }],
            dataLabels: dataLabelOptions
        }]
    }));
    chart4.updateFlag = true;
}

function updateSumCard(orig, revised, nett, contract_id='') {
    var origCard = `<span class="clickableCard" onclick="conOpLink('Contract', '', '`+contract_id+`')">`+orig+`</span>`;
    var revisedCard = `<span class="clickableCard" onclick="conOpLink('Contract', '', '`+contract_id+`')">`+revised+`</span>`;
    var nettCard = `<span class="clickableCard" onclick="conOpLink('Contract', '', '`+contract_id+`')">`+nett+`</span>`;

    $("#origContractSumCard").html(origCard);
    $("#revisedContractSumCard").html(revisedCard);
    $("#nettVariationSumCard").html(nettCard);
}

function updateCumulativeCard(claim, payment, contractId) {
    var claimCard = `<span class="clickableCard" onclick="conOpLink('Claim','claim','`+contractId+`')">`+claim+`</span>`;
    var paymentCard = `<span class="clickableCard" onclick="conOpLink('Claim','received', '`+contractId+`')">`+payment+`</span>`;

    $('#claimCumulCard').html(claimCard);
    $('#cumulPaymentCard').html(paymentCard);    
}

function drawIncCorrStatusChart(data) {
    var responded = (data.Responded) ? data.Responded : 0;
    var pending = (data.Pending) ? data.Pending : 0;
    var total = responded + pending;
    var perc = 0;
    if (total) {
        perc = (responded / total) * 100;
    }
    $('.corrStatusPercDiv').css('width', perc + '%');
    $('.corrStatusPercDiv').attr('title', ' Responded : ' + responded);
    $('.corrStatusBarDiv').attr('title', ' Pending : ' + pending);
}

function getDocumentDate(date)
{   
    var dateFrom 
    if(date.dateFrom == '')  return {dateFrom : '', dateTo: ''}

    if(date.selMth == 'all'){
        dateFrom = (parseInt($("#document-cutOff-day").text())+1) +'-12-'+(date.selYr-1);
        dateTo = (parseInt($("#document-cutOff-day").text()))+'-12-'+date.selYr;
        return {dateFrom : dateFrom, dateTo: dateTo}
    }else{
        var d = new Date(date.dateFrom);
        var month = d.getMonth() + 1;
        var cutoffDay = parseInt($("#document-cutOff-day").text());
        var dateFromM =  month - 1;
        var dateFromD = cutoffDay + 1;
        var dateFrom = dateFromD + '-'+ dateFromM + '-'+ d.getFullYear();
        var dateTo = cutoffDay + '-' + month + '-'+ d.getFullYear();
    
        return {dateFrom : dateFrom, dateTo: dateTo}
    }
 
}

function updateDocumentCard(ttlInc, ttlOut) {
    var totalCardInc = `<span class="clickableCard" onclick="conOpLink('INC','')">`+ttlInc+`</span>`;
    var totalCardOut = `<span class="clickableCard" onclick="conOpLink('OUT','')">`+ttlOut+`</span>`;

    $('#incTotalCard').html(totalCardInc);
    $('#outTotalCard').html(totalCardOut);
}

function updateManHrsCard(woLTI, wLTI, filterArr) {
    var smhWOLti = (filterArr) ? `<span class='clickableCard' onclick='conOpSMHLink("`+filterArr.yr+`","`+filterArr.mth+`", "smhWOLti")'>`+woLTI+`</span>` : woLTI;
    var smhWLti = (filterArr) ? `<span class='clickableCard' onclick='conOpSMHLink("`+filterArr.yr+`","`+filterArr.mth+`", "smhWLti")'>`+wLTI+`</span>` : wLTI;
    $("#smhWOLti").html(smhWOLti);
    $("#smhWLti").html(smhWLti);
}

function drawFatalityChart(data, monthYear) {
    // fatalityChart
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            if (idx == "") continue;
            var tempArr = { name: idx, y: ((ele) ? ele : 0) };
            dataArr.push(tempArr);
        }
    }
    var chart = Highcharts.chart('fatalityChart', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Progress Summary<br>'+localStorage.p_name+'<br>FATALITY ('+monthYear+')</span>'
                          }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">Progress Summary<br>'+localStorage.p_name+'<br>FATALITY ('+monthYear+')</span>'
                          }
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
            text: '<span class="showLabel">Progress Summary<br>'+localStorage.p_name+'<br>FATALITY ('+monthYear+')</span>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                cursor : "pointer",
                dataLabels: {
                    enabled: true,
                    distance: 0,
                    style: {
                        fontWeight: 'normal',
                        color: 'black'
                    }
                },
                size: '100%'
            }
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
            innerSize: '40%',
            data: dataArr,
            events: {
                click: function (event) {
                    var dateFilter = getDateFromToFilter();
                    var linkParamArr = processFilterParamArr([dateFilter.dateFrom, dateFilter.dateTo, event.point.name, '', '']);
                    var postParam = {function:"openConOpDashboard",processType:"IR", conOpTabId:"conopTab6", linkName:"construct_dash_conop_inc", linkParam:linkParamArr, linkWinTitle: 'Incident'};
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("IR", "construct_dash_conop_inc", linkParamArr, "Incident - " + event.point.name);
                    }else{
                        postMessageParent(postParam);
                    }
                }
            }
        }],
        credits: false
    });
    chart.updateFlag = true;
}

function drawTypeOfPropDamageChart(data, monthYear) {
    // fatalityChart
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            if (idx == "") continue;
            var tempArr = { name: idx, y: ((ele.total) ? ele.total : 0) };
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

                  if(localStorage.ui_pref == 'ri_v3'){
                      if (document.fullscreenElement && chart.updateFlag) {
                        chart.updateFlag = false;
                        chart.update({
                          chart:{
                            marginTop: 90
                          },
                          title: {
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Progress Summary<br>'+localStorage.p_name+'<br>TYPE OF PROPERTY DAMAGE ('+monthYear+')</span>'
                          },
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">Progress Summary<br>'+localStorage.p_name+'<br>TYPE OF PROPERTY DAMAGE ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Progress Summary<br>'+localStorage.p_name+'<br>TYPE OF PROPERTY DAMAGE ('+monthYear+')</span>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    distance: 0,
                    style: {
                        fontWeight: 'normal',
                        color: 'black'
                    }
                },
                size: '100%'
            }
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
            innerSize: '40%',
            data: dataArr,
            events: {
                click: function (event) {
                    var dateFilter = getDateFromToFilter();
                    var linkParamArr = processFilterParamArr([dateFilter.dateFrom, dateFilter.dateTo, '', event.point.name, 'Property Damage']);
                    var postParam = {function:"openConOpDashboard",processType:"IR", conOpTabId:"conopTab6", linkName:"construct_dash_conop_inc", linkParam:linkParamArr, linkWinTitle: 'Incident'};
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("IR", "construct_dash_conop_inc", linkParamArr, "Incident - "+ event.point.name);
                    }else{
                        postMessageParent(postParam);
                    }
                }
            }
        }],
        credits: false
    });
    chart.updateFlag = true;
}

function drawCostChart(data, monthYear) {
    var paymentData = [];
    var claimData = [];
    var catArr = [];
    var colorPayment;
    var colorClaim;

    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);
            paymentData.push((ele && ele.payment) ? parseInt(ele.payment) : 0);
            claimData.push((ele && ele.claim) ? parseInt(ele.claim) : 0);
        }
    }

    if(localStorage.ui_pref == 'ri_v3'){
        colorPayment = Highcharts.getOptions().colors[0];
        colorClaim = Highcharts.getOptions().colors[4];
    }else{
        colorPayment = 'rgb(124, 181, 236)';
        colorClaim = 'rgb(124, 181, 236)';
    }

    var chart = Highcharts.chart('costClaimPaymentChart', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Project Summary<br>'+localStorage.p_name+'<br>COST ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Project Summary<br>'+localStorage.p_name+'<br>COST ('+monthYear+')</span>'
                          },
                          legend: {
                            symbolHeight: 8,
                            symbolWidth: 8,
                            itemStyle : {
                              fontSize : '8px'
                            }
                          }
                        })
                      }
                  }
        
                }
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Progress Summary<br>'+localStorage.p_name+'<br>COST ('+monthYear+')</span>'
        },
        credits: {
            enabled: false
        }, yAxis: {
            title: {
                text: ''
            }
        },
        xAxis: {
            categories: catArr,
            title: {
                text: null
            }
        },
        legend: {
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical',
            itemStyle: {
                fontSize: 8
            }
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                }
            }
        },
        series: [{
            name: 'Payment',
            data: paymentData,
            color: colorPayment
        }, {
            name: 'Claim',
            data: claimData,
            color: colorClaim
        }],
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
    });
    chart.updateFlag = true;
}


function updateQualityNCRCard(ttl, close, pending) {
    var ncrTtlHTML = (ttl) ? `<span class="clickableCard" onclick="conOpLink('NCR','')">`+ttl+`</span>` : ttl;
    var ncrCloseHTML = (close) ? `<span class="clickableCard" onclick="conOpLink('NCR','Closed')">`+close+`</span>` : close;
    var ncrPendingHTML = (pending) ? `<span class="clickableCard" onclick="conOpLink('NCR','Open')">`+pending+`</span>` : pending;

    $('#ncrTotal').html(ncrTtlHTML);
    $('#ncrClosed').html(ncrCloseHTML);
    $('#ncrPending').html(ncrPendingHTML);
}

function updateQualityMSCard(ttl, close, pending) {
    var msTtlHTML = (ttl) ? `<span class="clickableCard" onclick="conOpLink('MOS','')">`+ttl+`</span>` : ttl;
    var msCloseHTML = (close) ? `<span class="clickableCard" onclick="conOpLink('MOS','Close')">`+close+`</span>` : close;
    var msPendingHTML = (pending) ? `<span class="clickableCard" onclick="conOpLink('MOS','Open')">`+pending+`</span>` : pending;

    $('#msTotal').html(msTtlHTML);
    $('#msClosed').html(msCloseHTML);
    $('#msPending').html(msPendingHTML);
}

function updateQualityMACard(ttl, close, pending) {
    var maTtlHTML = (ttl) ? `<span class="clickableCard" onclick="conOpLink('MS','')">`+ttl+`</span>` : ttl;
    var maCloseHTML = (close) ? `<span class="clickableCard" onclick="conOpLink('MS','Close')">`+close+`</span>` : close;
    var maPendingHTML = (pending) ? `<span class="clickableCard" onclick="conOpLink('MS','Open')">`+pending+`</span>` : pending;

    $('#maTotal').html(maTtlHTML);
    $('#maClosed').html(maCloseHTML);
    $('#maPending').html(maPendingHTML);
}

function setCutOffDate(day, year, month){
    if(year == 'all' || month == 'all'){
        $("#cutOff-day").text('');
        $("#cutOff-month").text('');
        $("#cutOff-year").text('');
    }
    else{
        $("#cutOff-day").text(day);
        $("#cutOff-month").text(monthFulltext[month]);
        $("#cutOff-year").text(year);
    }
}

function refreshInformation(projid = 'overall', yr = 'all', mth = 'all'){
    var dataYearMonth = "Month:" +mth+ " - " + "Year:" +yr;
    // store the original data
    var yrOrig = yr;
    var mthOrig = mth;

    var sCurveData = (summaryData.progressSummaryData && summaryData.progressSummaryData[projid] && summaryData.progressSummaryData[projid].overall) ? summaryData.progressSummaryData[projid].overall : [];
    var sCurveDataByMthYr = (sCurveData.byMonYr) ? sCurveData.byMonYr : [];
    drawPhySCurve(sCurveDataByMthYr, false, yr, mth);
    drawFinSCurve(sCurveDataByMthYr, false, yr, mth);

    var currDateObj = new Date();
    var currDate = parseInt(currDateObj.getDate());
    var currMth;
    var currYr;
    var cutOffDay = parseInt(summaryData.packageCutOffDay[projid]);
    
    setCutOffDate(cutOffDay, yr, mth)

    // document
    var corrInfo = (summaryData.document && summaryData.document.corr && summaryData.document.corr[projid] && summaryData.document.corr[projid][yr] && summaryData.document.corr[projid][yr][mth]) ? summaryData.document.corr[projid][yr][mth] : [];
    var corrIncomingStatus = (corrInfo.Incoming && corrInfo.Incoming.byStatus) ? corrInfo.Incoming.byStatus : [];
    drawIncCorrStatusChart(corrIncomingStatus);

    var totalInc = (corrInfo.Incoming && corrInfo.Incoming.total) ? corrInfo.Incoming.total : 0;
    var totalOut = (corrInfo.Outgoing && corrInfo.Outgoing.total) ? corrInfo.Outgoing.total : 0;
    updateDocumentCard(totalInc, totalOut);

    // quality
    var qualityInfo = (summaryData.quality) ? summaryData.quality : [];
    var smhData = (qualityInfo.overallManHours && qualityInfo.overallManHours[projid] && qualityInfo.overallManHours[projid][yr] && qualityInfo.overallManHours[projid][yr][mth]) ? qualityInfo.overallManHours[projid][yr][mth] : [];
    var filterArr = (smhData && smhData.filterArr) ? smhData.filterArr : false;
    var totalWoLTI = (smhData && smhData.withoutLTI) ? smhData.withoutLTI : 0;
    var totalWLTI = (smhData && smhData.withLTI) ? smhData.withLTI : 0;
    updateManHrsCard(totalWoLTI, totalWLTI, filterArr);

    var incData = (qualityInfo.incident && qualityInfo.incident[projid] && qualityInfo.incident[projid][yr] && qualityInfo.incident[projid][yr][mth]) ? qualityInfo.incident[projid][yr][mth] : [];
    var fatalityInfo = (incData && incData.fatality) ? incData.fatality : [];
    drawFatalityChart(fatalityInfo, dataYearMonth);

    var typeOfPropDamageData = (incData && incData.byPropDamageType) ? incData.byPropDamageType : [];
    drawTypeOfPropDamageChart(typeOfPropDamageData, dataYearMonth);

    var ncrInfo = (qualityInfo.ncr && qualityInfo.ncr[projid] && qualityInfo.ncr[projid][yr] && qualityInfo.ncr[projid][yr][mth]) ? qualityInfo.ncr[projid][yr][mth] : [];
    var ncrTotal = (ncrInfo.total) ? ncrInfo.total : 0;
    var ncrClosed = (ncrInfo.byStatus && ncrInfo.byStatus.Closed) ? ncrInfo.byStatus.Closed : 0;
    var ncrPending = (ncrInfo.byStatus && ncrInfo.byStatus.Pending) ? ncrInfo.byStatus.Pending : 0;
    updateQualityNCRCard(ncrTotal, ncrClosed, ncrPending);

    var maInfo = (qualityInfo.ma && qualityInfo.ma[projid] && qualityInfo.ma[projid][yr] && qualityInfo.ma[projid][yr][mth]) ? qualityInfo.ma[projid][yr][mth] : [];
    var maTotal = (maInfo.card && maInfo.card.total && maInfo.card.total.submitted) ? maInfo.card.total.submitted : 0;
    var maClosed = (maInfo.onCutOff && maInfo.onCutOff.byStatus && maInfo.onCutOff.byStatus.Closed) ? maInfo.onCutOff.byStatus.Closed : 0;
    var maPending = (maInfo.onCutOff && maInfo.onCutOff.byStatus && maInfo.onCutOff.byStatus.Pending) ? maInfo.onCutOff.byStatus.Pending : 0;
    updateQualityMACard(maTotal, maClosed, maPending);

    var msInfo = (qualityInfo.ms && qualityInfo.ms[projid] && qualityInfo.ms[projid][yr] && qualityInfo.ms[projid][yr][mth]) ? qualityInfo.ms[projid][yr][mth] : [];
    var msTotal = (msInfo.card && msInfo.card.total && msInfo.card.total.submitted) ? msInfo.card.total.submitted : 0;
    var msClosed = (msInfo.onCutOff && msInfo.onCutOff.byStatus && msInfo.onCutOff.byStatus.Closed) ? msInfo.onCutOff.byStatus.Closed : 0;
    var msPending = (msInfo.onCutOff && msInfo.onCutOff.byStatus && msInfo.onCutOff.byStatus.Pending) ? msInfo.onCutOff.byStatus.Pending : 0;
    updateQualityMSCard(msTotal, msClosed, msPending);

    if (yr == 'all') {
        currYr = parseInt(currDateObj.getFullYear());
        yr = String(currYr).padStart(2, '0');
    }
    if(mth == 'all'){
        currMth = parseInt(currDateObj.getMonth() + 1);
        mth = String(currMth).padStart(2, '0');
    }

    // progress
    var phyActual = (sCurveData.card && sCurveData.card[yr] && sCurveData.card[yr][monthHalftext[mth]] && sCurveData.card[yr][monthHalftext[mth]].phyAct) ? sCurveData.card[yr][monthHalftext[mth]].phyAct : 0;
    var phyPlan = (sCurveData.card && sCurveData.card[yr] && sCurveData.card[yr][monthHalftext[mth]] && sCurveData.card[yr][monthHalftext[mth]].phyEarly) ? sCurveData.card[yr][monthHalftext[mth]].phyEarly : 0;
    var finActual = (sCurveData.card && sCurveData.card[yr] && sCurveData.card[yr][monthHalftext[mth]] && sCurveData.card[yr][monthHalftext[mth]].finActual) ? sCurveData.card[yr][monthHalftext[mth]].finActual : 0;
    var finPlan = (sCurveData.card && sCurveData.card[yr] && sCurveData.card[yr][monthHalftext[mth]] && sCurveData.card[yr][monthHalftext[mth]].finEarly) ? sCurveData.card[yr][monthHalftext[mth]].finEarly : 0;
    drawFinancialGaugeCharts(finPlan, finActual, phyPlan, phyActual, dataYearMonth);

    // contract particular
    var contractInfo = (summaryData.contractInfo && summaryData.contractInfo[projid] && summaryData.contractInfo[projid].sum) ? summaryData.contractInfo[projid].sum : [];
    var contractIDCost =  (contractInfo.contract_ids) ? contractInfo.contract_ids.join(',') : '';
    updateContractParticularCard(contractInfo, contractIDCost);

    //Cost
    var origContractSum = (contractInfo.original_amount) ? formatCurrency(contractInfo.original_amount) : 0;
    var revisedContractSum = (contractInfo.new_amount) ? formatCurrency(contractInfo.new_amount) : 0;
    var nettVarSum = (contractInfo.total_vo_amount_completed) ? formatCurrency(contractInfo.total_vo_amount_completed) : 0;
    updateSumCard(origContractSum, revisedContractSum, nettVarSum, contractIDCost);
    
    var mthTxtOrig = (mthOrig != 'all') ? monthHalftext[mthOrig] : mthOrig;
    var cpInfo = (summaryData.paymentAndClaimByMthYr && summaryData.paymentAndClaimByMthYr[projid] && summaryData.paymentAndClaimByMthYr[projid].overall && summaryData.paymentAndClaimByMthYr[projid].overall[yrOrig] && summaryData.paymentAndClaimByMthYr[projid].overall[yrOrig][mthTxtOrig]) ? summaryData.paymentAndClaimByMthYr[projid].overall[yrOrig][mthTxtOrig] : [];
    var cumulClaimToDate = (cpInfo.claim) ? formatCurrency(cpInfo.claim) : 0;
    var cumulPayReceived = (cpInfo.payment) ? formatCurrency(cpInfo.payment) : 0;
    var contractId = (cpInfo.contract_id) ? cpInfo.contract_id : '-';
    updateCumulativeCard(cumulClaimToDate, cumulPayReceived, contractId);

    var paymentAndClaimDataOrig = (summaryData.paymentAndClaim && summaryData.paymentAndClaim[projid] && summaryData.paymentAndClaim[projid].overall) ? summaryData.paymentAndClaim[projid].overall : [];
    drawCostChart(paymentAndClaimDataOrig, dataYearMonth);
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
            page: "summary"
        },
        success: function (obj) {
            if (obj.status && obj.status == 'ok') {
                summaryData = obj.data;
                refreshInformation('overall');
            }
        },
        complete: function (){
            window.parent.postMessage({functionName: 'loaderajaxEnd'})
        }
    });
    $('.scrollbar-inner').scrollbar();
})