var timeData;
var monthHalftext = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};
var textMonthtoNum = {"Jan":"1","Feb":"2","Mar":"3","Apr":"4","May":"5","Jun":"6","Jul":"7","Aug":"8","Sep":"9","Oct":"10","Nov":"11","Dec":"12"};
var monthFulltext = {
    "Jan" :"January",
    "Feb" :"February",
    "Mar" :"March",
    "Apr" :"April",
    "May" :"May",
    "Jun" :"June",
    "Jul" :"July",
    "Aug" :"August",
    "Sep" :"September",
    "Oct" :"October",
    "Nov" :"November",
    "Dec" :"December",
};

function format_number(n, type){
    return Number(parseFloat(n).toFixed(2));
}

function drawFinSCurve(data, showLateInfo = true, yrFilter, mthFilter) {
    var finEarly = [];
    var finPlan = [];
    var finActual = [];
    var monthYear = [];
    var seriesArr = [];
    var cnt = 0;
    var crossHair = []

    var actKey = monthHalftext[mthFilter]+'-'+yrFilter
    var filterFlag = true;

    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            monthYear.push(idx);
            finPlan.push((ele.finPlan) ? format_number(ele.finPlan) : 0);
            finEarly.push((ele.finEarly) ? format_number(ele.finEarly) : 0);
            if(idx.indexOf('Dec') !== -1){
                crossHair.push(cnt)
            }
            cnt = cnt + 1;
            if(filterFlag) finActual.push(format_number(ele.finActual));
            if(idx == actKey) filterFlag = false;
        }
    }

    var crossArr = []
    
    crossHair.forEach(function(idx, ele){
        crossArr.push({
            color: 'gray',
            width: 1,
            value: idx,
            dashStyle: 'dash'
        })
    })

    if (showLateInfo) {
        seriesArr = [{
            name: 'Early',
            data: finEarly,
            color: '#f1701a'
        }, {
            name: 'Late',
            data: finPlan,
            color: 'blue'
        }, {
            name: 'Actual',
            data: finActual,
            color: 'green'
        }];
    } else {
        seriesArr = [{
            name: 'Planned',
            data: finEarly,
            color: '#f1701a'
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
                                text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Time Management<br>'+localStorage.p_name+'<br>FINANCIAL S-CURVE ('+range+')</span>'
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
                                text: '<span class="showLabel">Time Management<br>'+localStorage.p_name+'<br>FINANCIAL S-CURVE ('+range+')</span>'
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
            text: '<span class="showLabel">Time Management<br>'+localStorage.p_name+'<br>FINANCIAL S-CURVE ('+range+')</span>'
        },
        xAxis: {
            categories: monthYear,
            crosshair: {
                width: 0.5,
                color: 'gray',
            },
            plotLines: crossArr

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

function drawPhySCurve(data, showLateInfo = true, yrFilter, mthFilter, monthYear) {
    var phyEarly = [];
    var phyPlan = [];
    var phyAct = [];
    var monthYear = [];
    var seriesArr = [];
    var cnt = 0;
    var crossHair = [];

    var actKey = monthHalftext[mthFilter]+'-'+yrFilter
    var filterFlag = true;

    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            monthYear.push(idx);
            phyPlan.push((ele.phyPlan) ? format_number(ele.phyPlan) : 0);
            phyEarly.push((ele.phyEarly) ? format_number(ele.phyEarly) : 0);
            if(idx.indexOf('Dec') !== -1){
                crossHair.push(cnt)
            }
            cnt = cnt + 1;
            if(filterFlag) phyAct.push(format_number(ele.phyAct));
            if(idx == actKey) filterFlag = false;
        }
    }

    var crossArr = []
    
    crossHair.forEach(function(idx, ele){
        crossArr.push({
            color: 'gray',
            width: 1,
            value: idx,
            dashStyle: 'dash'
        })
    })

    if (showLateInfo) {
        seriesArr = [{
            name: 'Early',
            data: phyEarly,
            color: '#f1701a'
        }, {
            name: 'Late',
            data: phyPlan,
            color: 'blue'
        }, {
            name: 'Actual',
            data: phyAct,
            color: 'green'
        }];
    } else {
        seriesArr = [{
            name: 'Planned',
            data: phyEarly,
            color: '#f1701a'
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
                                text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Time Management<br>'+localStorage.p_name+'<br>PHYSICAL S-CURVE ('+range+')</span>'
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
                                text: '<span class="showLabel">Time Management<br>'+localStorage.p_name+'<br>PHYSICAL S-CURVE ('+range+')</span>'
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
            text: '<span class="showLabel">Time Management<br>'+localStorage.p_name+'<br>PHYSICAL S-CURVE ('+range+')</span>'
        },
        xAxis: {
            categories: monthYear,
            crosshair: {
                width: 0.5,
                color: 'gray',
            },
            plotLines: crossArr
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


function populateTableData(data, showLateInfo = true) {
    if (showLateInfo) {
        $('.lateInfoTh').show();
    } else {
        $('.lateInfoTh').hide();
    }

    let progHTML = '';
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            progHTML += '<tr>'
            progHTML += '<td>' + idx + '</td>'
            progHTML += '<td>' + ((ele.finEarly) ? format_number(ele.finEarly).toFixed(2) : '0.00') + '</td>'
            if (showLateInfo) {
                progHTML += '<td>' + ((ele.finPlan) ? format_number(ele.finPlan).toFixed(2) : '0.00') + '</td>'
            }
            progHTML += '<td>' + ((ele.finActual != null) ? format_number(ele.finActual).toFixed(2) : 'N/A') + '</td>'
            progHTML += '<td>' + ((ele.phyEarly) ? format_number(ele.phyEarly).toFixed(2) : '0.00') + '</td>'
            if (showLateInfo) {
                progHTML += '<td>' + ((ele.phyPlan) ? format_number(ele.phyPlan).toFixed(2) : '0.00') + '</td>'
            }
            progHTML += '<td>' + ((ele.phyAct != null) ? format_number(ele.phyAct).toFixed(2) : 'N/A') + '</td>'
            progHTML += '</tr>';
        }
    }
    $("#progressSummaryTBody").html(progHTML);
}

function drawSideDiaryWeatherCharts(data, divId, subTitle, allData, monthYear) {
    // sideDiaryWeatherCharts
    let seriesArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            let dt = { name: idx, y: parseFloat(ele) };
            seriesArr.push(dt)
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
                            }
                            })
                
                            chart.updateFlag = true;
                        }
                        else if (chart.updateFlag) {
                            chart.updateFlag = false;
                
                            chart.update({
                            title: {
                                text: '<span class="showLabel">Time Management<br>'+localStorage.p_name+'<br>WEATHER RECORDS ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Time Management<br>'+localStorage.p_name+'<br>WEATHER RECORDS ('+monthYear+')</span>'
        },
        subtitle: {
            useHTML: true,
            floating: true,
            text: '<span style="font-size:0.8em">'+subTitle+'<span>',
            verticalAlign: 'bottom',
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
            name: '',
            colorByPoint: true,
            data: seriesArr,
            cursor : 'pointer',
            events: {
                click: function () {
                    var section = (allData && allData.section) ? allData.section : '';
                    var dateFrom = (allData && allData.dateFrom) ? allData.dateFrom : '';
                    var dateTo = (allData && allData.dateTo) ? allData.dateTo : '';
                    var linkParamArr = processFilterParamArr([dateFrom,dateTo,section]);
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("SDL", "construct_dash_conop_sdl", linkParamArr, "Site Diary - Weather Records");
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

function populateSectionFilter(data) {
    var optHTML = '<option selected="true" value="overall">- Choose Section -</option> ';
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            optHTML += '<option value="' + ele + '">' + ele + '</option>';
        }
    }
    $('#sectionFilter').html(optHTML);
}

function drawMachineryCharts(data, monthYear, flagCumul = false, allData) {
    var color1;

    if(localStorage.ui_pref == 'ri_v3'){
        color1 = Highcharts.getOptions().colors[1];
    }else{
        color1 = '#7cb5ec';
    }

    if(flagCumul){
        var section = (allData && allData.section) ? allData.section : '';
        var cumulData = (data && data > 0) ? `<span class="clickableCard" onclick="conOpLink(\'`+section+`\')">`+data+`</span>` : 0;
        $('#machineryChart').html(`<div>${cumulData}<br>Cumulative</div>`)
        $('#machineryChart').addClass("textCard")
    }
    else{
        $('#machineryChart').removeClass("textCard")

        var tempCatArr = [];
        var tempDataArr = [];
        if (data) {
            for (const [idx, ele] of Object.entries(data)) {
                tempCatArr.push(idx);
                tempDataArr.push({
                    y:(ele.val) ? parseFloat(ele.val) : 0,
                    allData : (ele.allData) ? ele.allData : []
                });
            }
        }
        
        var dataArr = tempDataArr.reverse();
        var catArr = tempCatArr.reverse();
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
                name: 'Total',
                data: dataArr,
                showInLegend: false,
                color: color1,
                cursor : 'pointer',
                events: {
                    click: function (event) {
                        var section = (event.point.allData && event.point.allData.section) ? event.point.allData.section : '';
                        var dateFrom = (event.point.allData && event.point.allData.dateFrom) ? event.point.allData.dateFrom : '';
                        var dateTo = (event.point.allData && event.point.allData.dateTo) ? event.point.allData.dateTo : '';
                        var linkParamArr = processFilterParamArr([dateFrom,dateTo,section]);
                        
                        if(localStorage.ui_pref == "ri_v3"){
                            window.parent.widgetConopOpen("SDL", "construct_dash_conop_sdl", linkParamArr, "Site Diary - Plant & Machineries");
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
    
}

function drawWorkerCharts(data, monthYear, flagCumul = false, allData) {
    if(flagCumul){
        var section = (allData && allData.section) ? allData.section : '';
        var cumulData = (data && data > 0) ? `<span class="clickableCard" onclick="conOpLink(\'`+section+`\')">`+data+`</span>` : 0;
        $('#workerChart').html(`<div>${cumulData}<br>Cumulative</div>`)
        $('#workerChart').addClass("textCard")
    }
    else{
        $('#workerChart').removeClass("textCard")

        var tempCatArr = [];
        var tempDataArr = [];
        if (data) {
            for (const [idx, ele] of Object.entries(data)) {
                tempCatArr.push(idx);
                tempDataArr.push({
                    y:(ele.val) ? parseFloat(ele.val) : 0,
                    allData : (ele.allData) ? ele.allData : []
                });
            }
        }
    
        var dataArr = tempDataArr.reverse();
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
                name: 'Total',
                data: dataArr,
                showInLegend: false,
                color: Highcharts.getOptions().colors[1],
                cursor : 'pointer',
                events: {
                    click: function (event) {
                        var section = (event.point.allData && event.point.allData.section) ? event.point.allData.section : '';
                        var dateFrom = (event.point.allData && event.point.allData.dateFrom) ? event.point.allData.dateFrom : '';
                        var dateTo = (event.point.allData && event.point.allData.dateTo) ? event.point.allData.dateTo : '';
                        var linkParamArr = processFilterParamArr([dateFrom,dateTo,section]);
                        
                        if(localStorage.ui_pref == "ri_v3"){
                            window.parent.widgetConopOpen("SDL", "construct_dash_conop_sdl", linkParamArr, "Site Diary - Manpower");
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
    
}

function conOpLink(section){
    var sectionFilter = (section == undefined) ? '' : section;
    var dateFrom = '';
    var dateTo = '';
    var linkParamArr = processFilterParamArr([dateFrom,dateTo,sectionFilter]);

    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("SDL", "construct_dash_conop_sdl", linkParamArr, "Site Diary");
    }else{
        var postParam = {function:"openConOpDashboard",processType:"SDL", conOpTabId:"conopTab7", linkName:"construct_dash_conop_sdl", linkParam:linkParamArr, linkWinTitle: 'Site Diary'};
        parent.postMessage(postParam ,"*");
    }
}

function updateContractCard(data, cutOffDateObj) {
    var contractAmt = (data.new_amount) ? formatCurrency(data.new_amount) : ((data.original_amount) ? formatCurrency(data.original_amount) : 'N/A');
    var contractDur = (data.new_duration) ? parseFloat(data.new_duration) : ((data.original_duration) ? parseFloat(data.original_duration) : 'N/A');
    var completionDateCard = (data.completion_date) ? data.completion_date : 'N/A';
    var revisedCompletionDateCard = (data.revised_completion_date) ? data.revised_completion_date : 'N/A';
    var SPDateCard = (data.site_possession_date) ? data.site_possession_date : 'N/A';
    var LOADateCard = (data.loa_date_kacc) ? data.loa_date_kacc : 'N/A';
    var EOTCard = (data.extension_of_time) ? data.extension_of_time : 'N/A';
    var clientCard = (data.contractee) ? data.contractee : 'N/A';
    var commencementDateCard = (data.loa_date) ? data.loa_date : 'N/A';
    
    $("#contractClientCard").html(clientCard);
    $("#contractAmountCard").html(contractAmt);
    $("#contractLADateCard").html(LOADateCard);
    $("#contractSPDateCard").html(SPDateCard);
    $("#contractCompDateCard").html(completionDateCard);
    $("#contractEOTCard").html(EOTCard);
    $("#contractDurationCard").html(contractDur);
    $("#contractRevisedDateCard").html(revisedCompletionDateCard);

    $('#projDur').html(contractDur);
    var diffInDays = 'N/A';
    var commenceDateFormat = 'N/A';
    if(data.loa_date && cutOffDateObj){
        var commDateStrArr = commencementDateCard.split('-');
        var commDateObj = new Date(commDateStrArr.reverse().join('-'));
        var diffInTime = cutOffDateObj.getTime() - commDateObj.getTime();
        var diffInDays = (((diffInTime / (1000 * 3600 * 24))/contractDur)*100).toFixed(2) + ' %';
        
        var commenceDateObj = new Date(commencementDateCard.split('-').reverse().join('-'));
        commenceDateFormat = commenceDateObj.getDate()+" "+ monthHalftext[commenceDateObj.getMonth() +1]+" "+ commenceDateObj.getFullYear();
    }
    $('#timeElapse').html(diffInDays);
    $('#startDateProj').html(commenceDateFormat);
}

function openMonthlyAttachment(e){
    var url = $(e).data('url');
    if (url.length > 0){
        if(localStorage.ui_pref == "ri_v3"){
            window.parent.widgetConopOpen("", "", url, "Monthly Attachment");
        }else{
            var postParam = {function:"openConOpLink",url:url, title:"Monthly Attachment"};
            parent.postMessage(postParam ,"*");
        }
    }
}

// to show and hide if link is not available
function monthlyAttachmentCheck(){
    var selWPC = ($("#wpcFilter").val() != undefined) ? $("#wpcFilter").val() : filterArr.wpc;

    var selYr = ($("#yearFilter").val() != undefined) ? $("#yearFilter").val() : filterArr.year;
    var selMonthText = ($("#monthFilter option:selected").text() != undefined) ? $("#monthFilter option:selected").text() : filterArr.month;

    var url = (timeData.monthlyAttachment && timeData.monthlyAttachment[selWPC] && timeData.monthlyAttachment[selWPC]['overall'] && timeData.monthlyAttachment[selWPC]['overall'][selYr] && timeData.monthlyAttachment[selWPC]['overall'][selYr][selMonthText]) ? timeData.monthlyAttachment[selWPC]['overall'][selYr][selMonthText] : '';

    $('#monthlyAttachment').data('url', url);
    if(url.length > 0){
        $('#monthlyAttachment').css({
            'opacity': '1',
            'cursor': 'pointer'
        });
    }else{
        $('#monthlyAttachment').css({
            'opacity': '0.5',
            'cursor': 'default'
        });
    }
}

function monthlyAttachmentCheckV3(){

    window.parent.getFilterForDashboard();

    if(filterForListDashboard){
        var selYr = filterForListDashboard.year;
        var selMth = filterForListDashboard.month;
        var selWpc = filterForListDashboard.wpc;
    }

    var url = (timeData.monthlyAttachment && timeData.monthlyAttachment[selWpc] && timeData.monthlyAttachment[selWpc]['overall'] && timeData.monthlyAttachment[selWpc]['overall'][selYr] && timeData.monthlyAttachment[selWpc]['overall'][selYr][monthFulltext[selMth]]) ? timeData.monthlyAttachment[selWpc]['overall'][selYr][monthFulltext[selMth]] : '';
    $('#monthlyAttachmentV3').data('url', url);

    if(url.length > 0){
        $('#monthlyAttachmentV3').css({
            'opacity': '1',
            'cursor': 'pointer'
        });

    }else{
        $('#monthlyAttachmentV3').css({
            'opacity': '0.5',
            'cursor': 'default'
        });
    }
}

function refreshInformation(projid = 'overall', secId = 'overall', yr = 'all', mth = 'all') {
    var currDateObj = new Date();
    var currDate = parseInt(currDateObj.getDate());
    var currMth;
    var currYr;
    var cutOffDay = parseInt(timeData.packageCutOffDay[projid]);

    var sCurveData = (timeData.progressSummaryData && timeData.progressSummaryData[projid] && timeData.progressSummaryData[projid][secId]) ? timeData.progressSummaryData[projid][secId] : [];
    var sCurveDataByMthYr = (sCurveData.byMonYr) ? sCurveData.byMonYr : [];
    var showLateInfo = (sCurveData.flag) ? sCurveData.flag.showLateCurve : true;

    populateTableData(sCurveDataByMthYr, showLateInfo);
    // as we need to cut the actual, will send the filter
    drawFinSCurve(sCurveDataByMthYr, showLateInfo, yr, mth, dataYearMonth);
    drawPhySCurve(sCurveDataByMthYr, showLateInfo, yr, mth, dataYearMonth);
    
    var sdMth = mth;
    var sdYr = yr;
    var machineryMth = mth;
    var machineryYr = yr;
    var monthFulltext = {1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"}
    var dataYearMonth = "Month:" +machineryMth+ " - " + "Year:" +machineryYr;

    var sdData = (timeData.sideDiary && timeData.sideDiary[projid] && timeData.sideDiary[projid] && timeData.sideDiary[projid][secId]) ? timeData.sideDiary[projid][secId] : [];
    if(mth !== 'all'){
        $('#sideDiaryWeatherCharts2').css("display", "block")
        $('#sideDiaryWeatherCharts3').css("display", "block")

        $('#sideDiaryWeatherCharts').addClass("M")
        $('#sideDiaryWeatherCharts').parent().addClass("threeRow")
        $('#sideDiaryWeatherCharts').parent().removeClass("oneRow ")

        mthStr = String(sdMth).padStart(2, '0');
        var allData1 = (sdData.allData && sdData.allData[sdYr] && sdData.allData[sdYr][mthStr]) ? sdData.allData[sdYr][mthStr] : [];
        var sdDataWeather1 = (sdData.weather && sdData.weather[sdYr] && sdData.weather[sdYr][mthStr]) ? sdData.weather[sdYr][mthStr] : [];
        drawSideDiaryWeatherCharts(sdDataWeather1, 'sideDiaryWeatherCharts3', monthFulltext[sdMth], allData1, dataYearMonth);
        sdMth = sdMth-1;
        if (sdMth == 0) {
            sdMth = 12;
            sdYr = sdYr - 1;
        }
        mthStr = String(sdMth).padStart(2, '0');
        var allData2 = (sdData.allData && sdData.allData[sdYr] && sdData.allData[sdYr][mthStr]) ? sdData.allData[sdYr][mthStr] : [];
        var sdDataWeather2 = (sdData.weather && sdData.weather[sdYr] && sdData.weather[sdYr][mthStr]) ? sdData.weather[sdYr][mthStr] : [];
        drawSideDiaryWeatherCharts(sdDataWeather2, 'sideDiaryWeatherCharts2', monthFulltext[sdMth], allData2, dataYearMonth);

        sdMth = sdMth-1;
        if (sdMth == 0) {
            sdMth = 12;
            sdYr = sdYr - 1;
        }
        mthStr = String(sdMth).padStart(2, '0');
        var allData3 = (sdData.allData && sdData.allData[sdYr] && sdData.allData[sdYr][mthStr]) ? sdData.allData[sdYr][mthStr] : [];
        var sdDataWeather3 = (sdData.weather && sdData.weather[sdYr] && sdData.weather[sdYr][mthStr]) ? sdData.weather[sdYr][mthStr] : [];
        drawSideDiaryWeatherCharts(sdDataWeather3, 'sideDiaryWeatherCharts', monthFulltext[sdMth], allData3, dataYearMonth);

        //FOR MANPOWER & PLANT MACHINERY
        var sdDataMachinery = (sdData.machinery) ? sdData.machinery : [];
        var sdDataWorker = (sdData.worker) ? sdData.worker : [];
        var tempSdMachinery = [];
        var tempSdWorker = [];
        var sdAllData = [];

        for (var i = 5; i >= 0; i--) {
            machineryMthStr = String(machineryMth).padStart(2, '0');
            sdAllData = (sdData.allData && sdData.allData[machineryYr] && sdData.allData[machineryYr][machineryMthStr]) ? sdData.allData[machineryYr][machineryMthStr] : [];
            
            if(!tempSdMachinery[monthFulltext[machineryMth]]) tempSdMachinery[monthFulltext[machineryMth]] = [];
            tempSdMachinery[monthFulltext[machineryMth]]['val'] = (sdDataMachinery[machineryYr] && sdDataMachinery[machineryYr][machineryMthStr]) ? parseInt(sdDataMachinery[machineryYr][machineryMthStr]) : 0;
            tempSdMachinery[monthFulltext[machineryMth]]['allData'] = sdAllData;

            if(!tempSdWorker[monthFulltext[machineryMth]]) tempSdWorker[monthFulltext[machineryMth]] = [];
            tempSdWorker[monthFulltext[machineryMth]]['val'] = (sdDataWorker[machineryYr] && sdDataWorker[machineryYr][machineryMthStr]) ? parseInt(sdDataWorker[machineryYr][machineryMthStr]) : 0;
            tempSdWorker[monthFulltext[machineryMth]]['allData'] = sdAllData;

            machineryMth = machineryMth-1;
            if (machineryMth == 0) {
                machineryMth = 12;
                machineryYr = machineryYr - 1;
            }
        }
        // handle all data here 
        drawMachineryCharts(tempSdMachinery, dataYearMonth);
        drawWorkerCharts(tempSdWorker, dataYearMonth);

    }else{
        $('#sideDiaryWeatherCharts2').css("display", "none")
        $('#sideDiaryWeatherCharts3').css("display", "none")

        $('#sideDiaryWeatherCharts').removeClass("M")
        $('#sideDiaryWeatherCharts').parent().removeClass("threeRow")
        $('#sideDiaryWeatherCharts').parent().addClass("oneRow ")

        sdYr = sdYr - 1;
        var allData3 = (sdData.allData && sdData.allData[yr] && sdData.allData[yr][mth]) ? sdData.allData[yr][mth] : [];
        var sdDataWeather3 = (sdData.weather && sdData.weather[yr] && sdData.weather[yr][mth]) ? sdData.weather[yr][mth] : [];
        drawSideDiaryWeatherCharts(sdDataWeather3, 'sideDiaryWeatherCharts', 'Cumulative', allData3, dataYearMonth);

        //FOR MANPOWER & PLANT MACHINERY
        var sdDataMachinery = (sdData.machinery && sdData.machinery[yr] && sdData.machinery[yr][mth]) ? sdData.machinery[yr][mth] : 0;
        var sdDataWorker = (sdData.worker && sdData.worker[yr] && sdData.worker[yr][mth]) ? sdData.worker[yr][mth] : 0;

        // handle all data here 
        drawMachineryCharts(sdDataMachinery, dataYearMonth, true, allData3);
        drawWorkerCharts(sdDataWorker, dataYearMonth, true, allData3);
    }

    if (yr == 'all') {
        currYr = parseInt(currDateObj.getFullYear());
        yr = String(currYr).padStart(2, '0');
    }
    if(mth == 'all'){
        currMth = parseInt(currDateObj.getMonth() + 1);
        mth = currMth;
    }

    // draw the four gouge
    var phyActual = (sCurveData.card && sCurveData.card[yr] && sCurveData.card[yr][monthHalftext[mth]] && sCurveData.card[yr][monthHalftext[mth]].phyAct) ? sCurveData.card[yr][monthHalftext[mth]].phyAct : 0;
    var phyPlan = (sCurveData.card && sCurveData.card[yr] && sCurveData.card[yr][monthHalftext[mth]] && sCurveData.card[yr][monthHalftext[mth]].phyEarly) ? sCurveData.card[yr][monthHalftext[mth]].phyEarly : 0;
    var finActual = (sCurveData.card && sCurveData.card[yr] && sCurveData.card[yr][monthHalftext[mth]] && sCurveData.card[yr][monthHalftext[mth]].finActual) ? sCurveData.card[yr][monthHalftext[mth]].finActual : 0;
    var finPlan = (sCurveData.card && sCurveData.card[yr] && sCurveData.card[yr][monthHalftext[mth]] && sCurveData.card[yr][monthHalftext[mth]].finEarly) ? sCurveData.card[yr][monthHalftext[mth]].finEarly : 0;
    drawFinancialGaugeCharts(finPlan, finActual, phyPlan, phyActual, dataYearMonth);

    var sec = (secId == 'overall') ? 'sum' : secId;
    var contractData = (timeData.contractInfo && timeData.contractInfo[projid] && timeData.contractInfo[projid][sec]) ? timeData.contractInfo[projid][sec] : [];
    var cutOffDateObj = new Date(mth+"/"+cutOffDay+"/"+yr);
    updateContractCard(contractData, cutOffDateObj);
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

    monthlyAttachmentCheck();
    setCutOffDate(selMonth, selYr);

    // check if data has been fetch, if not refetch
    if (selYr != '' && selMonth != '' && timeData.sideDiary && timeData.sideDiary.sys && timeData.sideDiary.sys.data) {
        var fetchedDateArr = timeData.sideDiary.sys.data;
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
                timeData.sideDiary = MergeRecursive(timeData.sideDiary, obj.data)
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

function drawFinancialGaugeCharts(planFin, actFin, planPhy, actPhy, monthYear) {
    planFin = format_number(planFin);
    actFin = format_number(actFin);
    planPhy = format_number(planPhy);
    actPhy = format_number(actPhy);
    var title;

    var gaugeOptions = {
        chart: {
            type: 'solidgauge',
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
                                text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Time Management<br>'+localStorage.p_name+'<br>('+monthYear+')</span>'
                            }
                            })
                
                            chart.updateFlag = true;
                        }
                        else if (chart.updateFlag) {
                            chart.updateFlag = false;
                
                            chart.update({
                            title: {
                                text: '<span class="showLabel">Time Management<br>'+localStorage.p_name+'<br>('+monthYear+')</span>'
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
            text: '<span class="showLabel">Time Management<br>'+localStorage.p_name+'<br>('+monthYear+')</span>'
        },
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

    var dataLabelOptions = {
        enabled : true,
        formatter: function () {
            return '<div style="text-align:center">' +
            '<span style="font-size:11.5px">'+Highcharts.numberFormat(this.y,2)+' %</span>' +
            '</div>';
        }
    };

    var chart1 = Highcharts.chart('plannedFinancialGaugeCharts', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
        },
        series: [{
            data: [{
                radius: '112%',
                innerRadius: '88%',
                y: planFin
            }],
            dataLabels: dataLabelOptions
        }]
    }));
    chart1.updateFlag = true;

    var chart2 = Highcharts.chart('actualFinancialGaugeCharts', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
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
        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
        },
        series: [{
            data: [{
                radius: '112%',
                innerRadius: '88%',
                y: planPhy
            }],
            dataLabels: dataLabelOptions
        }]
    }));
    chart3.updateFlag = true;

    var chart4 = Highcharts.chart('actualPhysicalGaugeCharts', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
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

function setCutOffDate(month, year){
    var fullMonth;
    switch (month){
        case "1":
            fullMonth = "Jan";
            break;
        case "2":
            fullMonth = "Feb";
            break;
        case "3":
            fullMonth = "Mar";
            break;
        case "4":
            fullMonth = "Apr";
            break;
        case "5":
            fullMonth = "May";
            break;
        case "6":
            fullMonth = "Jun";
            break;
        case "7":
            fullMonth = "Jul";
            break;
        case "8":
            fullMonth = "Aug";
            break;
        case "9":
            fullMonth = "Sep";
            break;
        case "10":
            fullMonth = "Oct";
            break;
        case "11":
            fullMonth = "Nov";
            break;
        case "12":
            fullMonth = "Dec";
            break;
        default:
            fullMonth = month;
            break;
    }

    //CHANGES FOR V3
    if(fullMonth == 'all'){
        var currentTime = new Date()
        monthtoUse = currentTime.getMonth() + 2
        fullMonth = monthHalftext[monthtoUse];
    }

    if(year != 'all'){
        if(month != 'all'){
            $("#cutOff-month").text(fullMonth);
            $("#cutOff-year").text(year); 
        }
        $("#cutOff-year").text(year); 
    }
    
}

function calcTimeElapse(month, year, packid = 'overall'){
    var yearIfEmpty,yeartoUse, monthIfEmpty, monthtoUse;
    var currentTime = new Date()
    if(!month){
        // returns the month (from 0 to 11)
        monthIfEmpty = currentTime.getMonth()
        monthtoUse = monthIfEmpty
    }
    else{
        monthtoUse = month - 1;
    }
    if (!year){
        // returns the year (four digits)
        yearIfEmpty = currentTime.getFullYear()
        yeartoUse = yearIfEmpty;
    }
    else{
        yeartoUse = year;
    }

    var startDateProject = (timeData.projInfo && timeData.projInfo[packid] && timeData.projInfo[packid]['start_date']) ? timeData.projInfo[packid]['start_date'] : 0;
    var startDateFormatObj = new Date(startDateProject);
    var startDateFormat = startDateFormatObj.getDate()+" "+ monthHalftext[startDateFormatObj.getMonth() +1]+" "+ startDateFormatObj.getFullYear();
    var cutOffDay = (timeData.packageCutOffDay && timeData.packageCutOffDay[packid]) ? timeData.packageCutOffDay[packid] : 0;
    var durationDay = (timeData.projInfo && timeData.projInfo[packid] && timeData.projInfo[packid]['duration']) ? timeData.projInfo[packid]['duration'] : 0;

    var cutOffDate = new Date(yeartoUse,monthtoUse,cutOffDay);
    var diffDay = cutOffDate - new Date(startDateProject);
    var jsCutOffDate = diffDay / (1000 * 60 * 60 * 24);
    var timeElapse = (durationDay && durationDay != 0) ? ((jsCutOffDate / durationDay) * 100) : 'N/A';
    var roundTimeElapse = (typeof timeElapse == 'number') ? timeElapse.toFixed(2): 'N/A';
    var setValTimeElapse = (roundTimeElapse > 0 ) ? roundTimeElapse : 'N/A';
    $("#timeElapse").text(setValTimeElapse);
    $("#projDur").text(durationDay);
    $("#startDateProj").text(startDateFormat);
    
}

function refreshFromv3 (filterArr){
    var wpc = filterArr.wpc;
    var section = filterArr.section;

    var year = filterArr.year;
    var month = filterArr.month;

    monthlyAttachmentCheck();
    setCutOffDate(month, year);

    // check if data has been fetch, if not refetch
    if (year != 'all' && month != 'all' && timeData.sideDiary && timeData.sideDiary.sys && timeData.sideDiary.sys.data) {
        var fetchedDateArr = timeData.sideDiary.sys.data;
        if (textMonthtoNum[month] < 7) {
            minusMth = 12-(6-textMonthtoNum[month]);
            minusYr = year-1;
        }else{
            minusMth = textMonthtoNum[month]-6;
            minusYr = year;
        }

        if (fetchedDateArr[minusYr+"-"+String(minusMth).padStart(2, '0')] === undefined || fetchedDateArr[year+"-"+String(textMonthtoNum[month]).padStart(2, '0')] === undefined) {
            updateAndRefreshData(wpc, section, year, textMonthtoNum[month], year, textMonthtoNum[month]);
        }else{
            refreshInformation(wpc, section, year, textMonthtoNum[month]);
        }
    }else{
        refreshInformation(wpc, section, year, textMonthtoNum[month]);
    }

    refreshInformation(wpc, section, year, textMonthtoNum[month]);
    monthlyAttachmentCheckV3();
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
                var sectionData = (timeData.sectionList && timeData.sectionList['overall']) ? timeData.sectionList['overall'] : [];
                populateSectionFilter(sectionData);
                
                var currDate =  new Date();
                var currYear = currDate.getFullYear();
                var currMonth = currDate.getMonth() + 1;
                var currDay = currDate.getDate();
                if(timeData.packageCutOffDay && timeData.packageCutOffDay.overall && currDay >= timeData.packageCutOffDay.overall){
                    currMonth = currMonth + 1;
                    if(currMonth == 13){
                        currYear = currYear + 1;
                        currMonth = 1;
                    }
                }
                $('#yearFilter').val(currYear);
                $('#monthFilter').val(currMonth);

                filterArr = {
                    wpc: 'overall', 
                    year: currYear,
                    month: currMonth,
                };

                refreshInformation('overall', 'overall');
                
                if(localStorage.ui_pref == 'ri_v3'){
                    monthlyAttachmentCheckV3();
                }else{
                    monthlyAttachmentCheck();
                }
            }
        },
        complete: function (){
            window.parent.postMessage({functionName: 'loaderajaxEnd'})
        }
    });
    $('.scrollbar-inner').scrollbar();

    // only update section filter when overall changed
    $("#wpcFilter").change(function () {
        var sectionData = (timeData && timeData.sectionList && timeData.sectionList[$(this).val()]) ? timeData.sectionList[$(this).val()] : [];
        populateSectionFilter(sectionData);
        refreshDashboard('overall');
        monthlyAttachmentCheck();
    })
})