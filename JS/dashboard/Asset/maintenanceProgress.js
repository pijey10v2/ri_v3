var progData;

function conOpLink(process, title, category){
    if(localStorage.ui_pref != "ri_v3") return;

    var linkName = '';
    var linkWinTitle = '';
    var linkParamArr = '';
    var searchfilter = getFilterDashboardAsset();
    
    
    switch (process) {
        case 'Budget':
            linkWinTitle = title
            linkName = 'dash_asset_budget_card_mp'
            linkParamArr = processFilterParamArr([searchfilter.year, category])
            
        break;
        case 'Claim':
            linkWinTitle = title
            linkName = 'dash_asset_claim_ttl_card'
            linkParamArr = processFilterParamArr([searchfilter.month, searchfilter.year, category])
            
        break;
    }
    window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle);
  }

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
        'red' : Highcharts.getOptions().colors[7],
        'blue': Highcharts.getOptions().colors[11],
        'grey': Highcharts.getOptions().colors[10]
    }
}else{
    var legendColorArr = {
        'green': '#52BE80', 
        'yellow': '#F4D03F',
        'orange' : '#E65C00',
        'red' : '#E93232',
        'blue': '#0066ff',
        'grey': '#A8A8A8'
    }
}

var dcColorIdx = {
    'Open': legendColorArr['blue'], 
    'Close': legendColorArr['orange'],
    'Satisfactory': legendColorArr['blue'],
    'Unsatisfactory': legendColorArr['orange']
}

var monthToNumAr = {"Jan" : '01',"Feb" : '02',"Mar" : '03',"Apr" : '04',"May" : '05',"Jun" : '06',"Jul" : '07',"Aug" : '08',"Sep" : '09',"Oct" : '10',"Nov" : '11',"Dec" : '12'};

function updateCard(data,dataBudget){
    //data = DATA CLAIM
    //dataBudget = DATA BUDGET

    var amtRemain = (dataBudget.totalBudget - data.totalClaim);
    var amtClaimRoutine = (data && data.Routine) ? data.Routine : 0 ;
    var amtClaimEmergency = (data && data.Emergency) ? data.Emergency : 0 ;
    var amtClaim = (data && data.totalClaim) ? data.totalClaim : 0 ;
	var amtBudget = (dataBudget && dataBudget.Routine) ? dataBudget.Routine : 0 ;
    var amountRemain = (amtRemain) ? amtRemain : 0 ;

    if(amtClaimRoutine != 0 ){
        amtClaimRoutine = `<span class="clickableCard" onclick="conOpLink('Claim', 'TOTAL ROUTINE MAINTENANCE AMOUNT CLAIMED', 'Routine')">`+(data && data.Routine ? formatCurrency(data.Routine) : 0)+`</span>`;
    }

    if(amtClaimEmergency != 0){
        amtClaimEmergency = `<span class="clickableCard" onclick="conOpLink('Claim', 'TOTAL EMERGENCY AMOUNT CLAIMED', 'Emergency')">`+(data && data.Emergency ? formatCurrency(data.Emergency) : 0)+`</span>`;
	}

    if(amtClaim != 0){
        amtClaim = `<span class="clickableCard" onclick="conOpLink('Claim', 'TOTAL CLAIM AMOUNT', '')">`+(data && data.totalClaim ?  formatCurrency(data.totalClaim) : 0)+`</span>`;
	}

    if(amtBudget != 0){
        amtBudget = `<span class="clickableCard" onclick="conOpLink('Budget', 'ROUTINE MAINTENANCE BUDGET AMOUNT', 'Routine')">`+(dataBudget && dataBudget.Routine ? formatCurrency(dataBudget && dataBudget.Routine) : 0)+`</span>`;
	}

    if(amountRemain != 0){
		amountRemain = (amtRemain ? formatCurrency(amtRemain) : 0);
	}

    $('#ttlClaim').html('RM '+amtClaim);
    $('#ttlRoutine').html('RM '+amtClaimRoutine);
    $('#ttlEmergency').html('RM '+amtClaimEmergency);
    $('#ttlRemain').html('RM '+amountRemain);
    $('#ttlBudget').html('RM '+amtBudget);
}

function drawChartClaim(data, monthYear){

    var catArr = [];
    var emergArr = [];
    var routineArr = [];

    for (const [idx, ele] of Object.entries(data)) {

        catArr.push(idx)
        emergArr.push(ele.Emergency ? parseInt(ele.Emergency) : 0)
        routineArr.push(ele.Routine ? parseInt(ele.Routine) : 0)
    } 

    var chart = Highcharts.chart("chartAmtClaim", {
        chart: {
            type: 'column',
            options3d: {
                enabled: false,
                alpha: 15,
                beta: 15,
                viewDistance: 25,
                depth: 40
            },
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
                                    text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Maintenance Progress Dashboard<br>'+localStorage.p_name+'<br>AMOUNT CLAIMED ('+monthYear+')</span>'
                                }
                            })
                
                            chart.updateFlag = true;
                        }
                        else if (chart.updateFlag) {
                            chart.updateFlag = false;
                
                            chart.update({
                                title: {
                                    text: '<span class="showLabel">Maintenance Progress Dashboard<br>'+localStorage.p_name+'<br>AMOUNT CLAIMED ('+monthYear+')</span>'
                                }
                            })
                            chart.updateFlag = true;
                        }
                    }
                }
            }
        },
        credits : {enabled:false},
        legend : {
            enabled : true,
            itemStyle : {
                fontSize: '13px'
                }
            },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Maintenance Progress Dashboard<br>'+localStorage.p_name+'<br>AMOUNT CLAIMED ('+monthYear+')</span>'
        },
        xAxis: {
            categories: catArr,
            labels: {
            skew3d: true,
            style: {
                fontSize: '12px'
            }
            }
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
            name: 'Emergency',
            data: emergArr,
            color : legendColorArr['blue'],
            cursor: 'pointer',
            events: {
                click: function (event) {
                    if(localStorage.ui_pref != "ri_v3") return;

                    var mthYear = event.point.category.name;
                    const myArray = mthYear.split("-");
                    var mth = myArray[0];
                    var year = myArray[1];

                    //get date from and date to
                    var month = monthToNumAr[mth];

                    linkWinTitle = 'AMOUNT CLAIMED'
                    linkName = 'dash_asset_claim_ttl_card'
                    linkParamArr = processFilterParamArr([month, year, event.point.series.name])
                    window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ event.point.series.name);
                }
            }
        }, {
            name: 'Routine',
            data: routineArr,
            color : legendColorArr['orange'],
            cursor: 'pointer',
            events: {
                click: function (event) {
                    if(localStorage.ui_pref != "ri_v3") return;

                    var mthYear = event.point.category.name;
                    const myArray = mthYear.split("-");
                    var mth = myArray[0];
                    var year = myArray[1];

                    //get date from and date to
                    var month = monthToNumAr[mth];

                    linkWinTitle = 'AMOUNT CLAIM'
                    linkName = 'dash_asset_claim_ttl_card'
                    linkParamArr = processFilterParamArr([month, year, event.point.series.name])
                    window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ event.point.series.name);
                }
            }
        }]
    });
    chart.updateFlag = true;
}

function drawCyclicChart(wiData, id, status, monthYear){

    var catArr = [];
    var draftDataArr = [];
    var instructDataArr = [];
    var completeDataArr = [];
    var title;

    for (const [idx, ele] of Object.entries(wiData)) {
        catArr.push(idx)
        draftDataArr.push(ele.Draft ? parseInt(ele.Draft) : 0)
        instructDataArr.push(ele.Instructed ? parseInt(ele.Instructed) : 0)
        completeDataArr.push(ele.Completed ? parseInt(ele.Completed) : 0)
    }

    if(id == 'cyclicBarChart'){
        title = 'CYCLIC';
    }else{
        title = 'NON-CYCLIC';
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
                                    text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Maintenance Progress Dashboard<br>'+localStorage.p_name+'<br>'+title+' MAINTENANCE BY STATUS & MONTH ('+monthYear+')</span>'
                                }
                            })
                
                            chart.updateFlag = true;
                        }
                        else if (chart.updateFlag) {
                            chart.updateFlag = false;
                
                            chart.update({
                                title: {
                                    text: '<span class="showLabel">Maintenance Progress Dashboard<br>'+localStorage.p_name+'<br>'+title+'  ('+monthYear+')</span>'
                                }
                            })
                            chart.updateFlag = true;
                        }
                    }
                }
            }
        },
        credits : {enabled:false},
        legend : {
            enabled : true,
            itemStyle : {
                fontSize: '13px'
                }
            },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Maintenance Progress Dashboard<br>'+localStorage.p_name+'<br>'+title+'  ('+monthYear+')</span>'
        },
        xAxis: {
            categories: catArr,
            labels: {
            skew3d: true,
            style: {
                fontSize: '12px'
            }
            }
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
            name: 'Draft',
            data: draftDataArr,
            color : legendColorArr['blue'],
            cursor: 'pointer',
            events: {
                click: function (event) {
                    if(localStorage.ui_pref != "ri_v3") return;

                    if(title == 'CYCLIC'){
                        title = 'Cyclic'
                    }else if(title == 'NON-CYCLIC'){
                        title = 'Non Cyclic'
                    }
                    var mthYear = event.point.category.name;
                    const myArray = mthYear.split("-");
                    var mth = myArray[0];
                    var year = myArray[1];
                    var searchfilter = getFilterDashboardAsset();

                    //get date from and date to
                    dateFrom = year+"-"+monthToNumAr[mth]+"-01";
                    var t = new Date(year, monthToNumAr[mth], 0).getDate();
                    dateTo = year+"-"+monthToNumAr[mth]+"-"+t;

                    linkWinTitle = title
                    if(status == 'Cyclic'){
                        linkName = 'dash_asset_workInstructCyclic_card'
                    }else if (status == 'Non Cyclic'){
                        linkName = 'dash_asset_workInstructNonCyclic_card'
                    }
                    linkParamArr = processFilterParamArr([status, event.point.series.name, dateFrom, dateTo, searchfilter.activity])
                    window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ event.point.series.name);
                }
            }
        }, {
            name: 'Instructed',
            data: instructDataArr,
            color : legendColorArr['orange'],
            cursor: 'pointer',
            events: {
                click: function (event) {
                    if(localStorage.ui_pref != "ri_v3") return;

                    if(title == 'CYCLIC'){
                        title = 'Cyclic'
                    }else if(title == 'NON-CYCLIC'){
                        title = 'Non Cyclic'
                    }
                    var mthYear = event.point.category.name;
                    const myArray = mthYear.split("-");
                    var mth = myArray[0];
                    var year = myArray[1];
                    var searchfilter = getFilterDashboardAsset();

                    //get date from and date to
                    dateFrom = year+"-"+monthToNumAr[mth]+"-01";
                    var t = new Date(year, monthToNumAr[mth], 0).getDate();
                    dateTo = year+"-"+monthToNumAr[mth]+"-"+t;

                    linkWinTitle = title
                    if(status == 'Cyclic'){
                        linkName = 'dash_asset_workInstructCyclic_card'
                    }else if (status == 'Non Cyclic'){
                        linkName = 'dash_asset_workInstructNonCyclic_card'
                    }
                    linkParamArr = processFilterParamArr([status, event.point.series.name, dateFrom, dateTo, searchfilter.activity])
                    window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ event.point.series.name);
                }
            }
        }, {
            name: 'Completed',
            data: completeDataArr,
            color : legendColorArr['grey'],
            cursor: 'pointer',
            events: {
                click: function (event) {
                    if(localStorage.ui_pref != "ri_v3") return;
                    
                    if(title == 'CYCLIC'){
                        title = 'Cyclic'
                    }else if(title == 'NON-CYCLIC'){
                        title = 'Non Cyclic'
                    }
                    var mthYear = event.point.category.name;
                    const myArray = mthYear.split("-");
                    var mth = myArray[0];
                    var year = myArray[1];
                    var searchfilter = getFilterDashboardAsset();

                    //get date from and date to
                    dateFrom = year+"-"+monthToNumAr[mth]+"-01";
                    var t = new Date(year, monthToNumAr[mth], 0).getDate();
                    dateTo = year+"-"+monthToNumAr[mth]+"-"+t;

                    linkWinTitle = title
                    if(status == 'Cyclic'){
                        linkName = 'dash_asset_workInstructCyclic_card'
                    }else if (status == 'Non Cyclic'){
                        linkName = 'dash_asset_workInstructNonCyclic_card'
                    }
                    linkParamArr = processFilterParamArr([status, event.point.series.name, dateFrom, dateTo, searchfilter.activity])
                    window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ event.point.series.name);
                }
            }
        }]
    });
    chart.updateFlag = true;
}

function drawNCPChart(data, monthYear){

    var dataArr = [];
    for (const [idx, ele] of Object.entries(data)) {
        if(idx == "" || idx == "NULL") continue;
            dataArr.push({name: idx, y: parseFloat(ele), color:dcColorIdx[idx], sliced : idx ? true : false});
    } 

    var chart = Highcharts.chart('ncpPieChart', {
        chart: {
            type: 'pie',
            options3d: {
              enabled: false,
              alpha: 45,
              beta: 0
            },
            events: {
                render() {
                    var chart = this;
        
                    if(localStorage.ui_pref == 'ri_v3'){
                        if (document.fullscreenElement && chart.updateFlag) {
                            chart.updateFlag = false;
                            chart.update({
                                chart:{
                                    marginTop: 90,
                                },
                                title: {
                                    text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Maintenance Progress Dashboard<br>'+localStorage.p_name+'<br>NCP STATUS ('+monthYear+')</span>'
                                }
                            })
            
                            chart.updateFlag = true;
                        } else if (chart.updateFlag) {
                            chart.updateFlag = false;
                
                            chart.update({
                                title: {
                                    text: '<span class="showLabel" style="text-align: center">Maintenance Progress Dashboard<br>'+localStorage.p_name+'<br>NCP STATUS ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Maintenance Progress Dashboard<br>'+localStorage.p_name+'<br>NCP STATUS ('+monthYear+')</span>'
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
        legend : {
            enabled : true,
            itemStyle : {
                fontSize: '13px'
                }
        },
        plotOptions: {
            pie: {
                borderWidth: 10,
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                dataLabels : {enabled : false},
                showInLegend: true
            },
        },
        series: [{
            type: 'pie',
            data: dataArr,
            cursor: 'pointer',
            events: {
                click: function (event) {
                    if(localStorage.ui_pref != "ri_v3") return;

                    var activity = '';
                    var searchfilter = getFilterDashboardAsset();

                    if(searchfilter.activity == 'R01 : PAVEMENT'){
                        activity = 'RO1';
                    }else if(searchfilter.activity == 'R02 : ROAD SHOULDER'){
                        activity = 'RO2';
                    }else if(searchfilter.activity == 'R03 : GRASS CUTTING'){
                        activity = 'RO3';
                    }else if(searchfilter.activity == 'R04 : MAINTENANCE OF ROAD FURNITURES'){
                        activity = 'RO4';
                    }else if(searchfilter.activity == 'R05 : MAINTENANCE OF BRIDGES/CULVERT'){
                        activity = 'RO5';
                    }else if(searchfilter.activity == 'R06: PAINTING OF ROAD MARKING'){
                        activity = 'RO6';
                    }else if(searchfilter.activity == 'R07 : CLEANING OF DRAINS'){
                        activity = 'RO7';
                    }else if(searchfilter.activity == 'B : ROUTINE INSPECTION'){
                        activity = 'B';
                    }else{
                        activity = '';
                    }

                    linkWinTitle = "NCP STATUS"
                    linkName = 'dash_asset_ncp_card'
                    linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, 'Routine', event.point.name, '', activity])
                    window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ event.point.name);
                }
            }
        }]
    });
    chart.updateFlag = true;
}

function drawNCPStatusChart(data, monthYear){

    var dataArr = [];
    var idxName;

    for (const [idx, ele] of Object.entries(data)) {

        if(idx == 'Close'){
            if(idx !== ""){
                for (const [idx1, ele1] of Object.entries(ele)){
    
                    idStatus = idx1;
    
                    if(idx1 == 'memuaskan mengikut spesifikasi dan seperti Appendix VIII/Klausa 8.4.4'){
                        idxName = 'Satisfactory';
                    }else if(idx1 == 'tidak memuaskan mengikut spesifikasi dan seperti Appendix VIII/Klausa 8.4.4'){
                        idxName = 'Unsatisfactory';
                    }else{
                        idxName = '';
                    }
            
                    if(idxName !== ''){
                        dataArr.push({name: idxName, y: parseFloat(ele1), color:dcColorIdx[idxName], sliced : (idxName == 'Satisfactory') ? true : false});
                    }
                }
            } 
        }
        
    } 

    var chart = Highcharts.chart('ncpStatusPieChart', {
        chart: {
            type: 'pie',
            options3d: {
                enabled: false,
                alpha: 35,
                beta: 0
            },
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
                                        text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Maintenance Progress Dashboard<br>'+localStorage.p_name+'<br>NCP SATISFACTORY ('+monthYear+')</span>'
                                }
                            })
                
                            chart.updateFlag = true;
                        }
                        else if (chart.updateFlag) {
                            chart.updateFlag = false;
                
                            chart.update({
                                title: {
                                    text: '<span class="showLabel">Maintenance Progress Dashboard<br>'+localStorage.p_name+'<br>NCP SATISFACTORY ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Maintenance Progress Dashboard<br>'+localStorage.p_name+'<br>NCP SATISFACTORY ('+monthYear+')</span>',
            layout: 'vertical'
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
        legend : {
            enabled : true,
            itemStyle : {
                fontSize: '13px'
                }
        },
        plotOptions: {
            pie: {
                borderWidth: 10,
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                dataLabels : {enabled : false},
                showInLegend: true
            }
        },
        series: [{
            type: 'pie',
            data: dataArr,
            cursor: 'pointer',
            events: {
                click: function (event) {
                    if(localStorage.ui_pref != "ri_v3") return;

                    var satisfaction;
                    if(event.point.name == 'Satisfactory'){
                        satisfaction = 'memuaskan mengikut spesifikasi dan seperti Appendix VIII/Klausa 8.4.4';
                    }else if(event.point.name == 'Unsatisfactory'){
                        satisfaction = 'tidak memuaskan mengikut spesifikasi dan seperti Appendix VIII/Klausa 8.4.4';
                    }else{
                        satisfaction = event.point.name;
                    }

                    var ncpStatus = 'Close';
                    var activity = '';
                    var searchfilter = getFilterDashboardAsset();

                    if(searchfilter.activity == 'R01 : PAVEMENT'){
                        activity = 'RO1';
                    }else if(searchfilter.activity == 'R02 : ROAD SHOULDER'){
                        activity = 'RO2';
                    }else if(searchfilter.activity == 'R03 : GRASS CUTTING'){
                        activity = 'RO3';
                    }else if(searchfilter.activity == 'R04 : MAINTENANCE OF ROAD FURNITURES'){
                        activity = 'RO4';
                    }else if(searchfilter.activity == 'R05 : MAINTENANCE OF BRIDGES/CULVERT'){
                        activity = 'RO5';
                    }else if(searchfilter.activity == 'R06: PAINTING OF ROAD MARKING'){
                        activity = 'RO6';
                    }else if(searchfilter.activity == 'R07 : CLEANING OF DRAINS'){
                        activity = 'RO7';
                    }else if(searchfilter.activity == 'B : ROUTINE INSPECTION'){
                        activity = 'B';
                    }else{
                        activity = '';
                    }

                    linkWinTitle = "NCP SATISFACTORY"
                    linkName = 'dash_asset_ncp_dashcard'
                    linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, 'Routine', ncpStatus, satisfaction, activity])
                    window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ satisfaction);
                }
            }
        }]
    });
}

function drawNCPRoutine(data, monthYear){

    var catArr = [];
    var dataArrOpen = [];
    var dataArrClose = [];

    for (const [idx, ele] of Object.entries(data)) {

            catArr.push(idx)

            var tempDataOpen = { name: idx, y: (ele.Open) ? parseInt((ele.Open)) : 0 };
			var tempDataClose = { name: idx, y: (ele.Close) ? parseInt((ele.Close)) : 0 };
			dataArrOpen.push(tempDataOpen);
			dataArrClose.push(tempDataClose);

            dataArrOpen.sort(function(a,b){

				if(a.name == 'B' && b.name == 'RO1') return -1;
				if(a.name == 'B' && b.name == 'RO2') return -1;
				if(a.name == 'B' && b.name == 'RO3') return -1;
				if(a.name == 'B' && b.name == 'RO4') return -1;
				if(a.name == 'B' && b.name == 'RO5') return -1;
				if(a.name == 'B' && b.name == 'RO6') return -1;
				if(a.name == 'B' && b.name == 'RO7') return -1;
				if(a.name == 'B' && b.name == '') return -1;

                if(a.name == 'RO1' && b.name == 'RO2') return -1;
				if(a.name == 'RO1' && b.name == 'RO3') return -1;
				if(a.name == 'RO1' && b.name == 'RO4') return -1;
				if(a.name == 'RO1' && b.name == 'RO5') return -1;
				if(a.name == 'RO1' && b.name == 'RO6') return -1;
				if(a.name == 'RO1' && b.name == 'RO7') return -1;
				if(a.name == 'RO1' && b.name == '') return -1;

                if(a.name == 'RO2' && b.name == 'RO3') return -1;
				if(a.name == 'RO2' && b.name == 'RO4') return -1;
				if(a.name == 'RO2' && b.name == 'RO5') return -1;
				if(a.name == 'RO2' && b.name == 'RO6') return -1;
				if(a.name == 'RO2' && b.name == 'RO7') return -1;
				if(a.name == 'RO2' && b.name == '') return -1;

                if(a.name == 'RO3' && b.name == 'RO4') return -1;
				if(a.name == 'RO3' && b.name == 'RO5') return -1;
				if(a.name == 'RO3' && b.name == 'RO6') return -1;
				if(a.name == 'RO3' && b.name == 'RO7') return -1;
				if(a.name == 'RO3' && b.name == '') return -1;

                if(a.name == 'RO4' && b.name == 'RO5') return -1;
				if(a.name == 'RO4' && b.name == 'RO6') return -1;
				if(a.name == 'RO4' && b.name == 'RO7') return -1;
				if(a.name == 'RO4' && b.name == '') return -1;

                if(a.name == 'RO5' && b.name == 'RO6') return -1;
				if(a.name == 'RO5' && b.name == 'RO7') return -1;
				if(a.name == 'RO5' && b.name == '') return -1;

                if(a.name == 'RO6' && b.name == 'RO7') return -1;
                if(a.name == 'RO6' && b.name == '') return -1;

                if(a.name == 'RO7' && b.name == '') return -1;
				//-----------------------------------------//
				if(b.name == 'B' && a.name == 'RO1') return 1;
				if(b.name == 'B' && a.name == 'RO2') return 1;
				if(b.name == 'B' && a.name == 'RO3') return 1;
				if(b.name == 'B' && a.name == 'RO4') return 1;
				if(b.name == 'B' && a.name == 'RO5') return 1;
				if(b.name == 'B' && a.name == 'RO6') return 1;
				if(b.name == 'B' && a.name == 'RO7') return 1;
				if(b.name == 'B' && a.name == '') return 1;

                if(b.name == 'RO1' && a.name == 'RO2') return 1;
				if(b.name == 'RO1' && a.name == 'RO3') return 1;
				if(b.name == 'RO1' && a.name == 'RO4') return 1;
				if(b.name == 'RO1' && a.name == 'RO5') return 1;
				if(b.name == 'RO1' && a.name == 'RO6') return 1;
				if(b.name == 'RO1' && a.name == 'RO7') return 1;
				if(b.name == 'RO1' && a.name == '') return 1;

                if(b.name == 'RO2' && a.name == 'RO3') return 1;
				if(b.name == 'RO2' && a.name == 'RO4') return 1;
				if(b.name == 'RO2' && a.name == 'RO5') return 1;
				if(b.name == 'RO2' && a.name == 'RO6') return 1;
				if(b.name == 'RO2' && a.name == 'RO7') return 1;
				if(b.name == 'RO2' && a.name == '') return 1;

                if(b.name == 'RO3' && a.name == 'RO4') return 1;
				if(b.name == 'RO3' && a.name == 'RO5') return 1;
				if(b.name == 'RO3' && a.name == 'RO6') return 1;
				if(b.name == 'RO3' && a.name == 'RO7') return 1;
				if(b.name == 'RO3' && a.name == '') return 1;

                if(b.name == 'RO4' && a.name == 'RO5') return 1;
				if(b.name == 'RO4' && a.name == 'RO6') return 1;
				if(b.name == 'RO4' && a.name == 'RO7') return 1;
				if(b.name == 'RO4' && a.name == '') return 1;

                if(b.name == 'RO5' && a.name == 'RO6') return 1;
				if(b.name == 'RO5' && a.name == 'RO7') return 1;
				if(b.name == 'RO5' && a.name == '') return 1;

                if(b.name == 'RO6' && a.name == 'RO7') return 1;
                if(b.name == 'RO6' && a.name == '') return 1;

                if(b.name == 'RO7' && a.name == '') return 1;

				return 0;
			});

            dataArrClose.sort(function(a,b){
				if(a.name == 'B' && b.name == 'RO1') return -1;
				if(a.name == 'B' && b.name == 'RO2') return -1;
				if(a.name == 'B' && b.name == 'RO3') return -1;
				if(a.name == 'B' && b.name == 'RO4') return -1;
				if(a.name == 'B' && b.name == 'RO5') return -1;
				if(a.name == 'B' && b.name == 'RO6') return -1;
				if(a.name == 'B' && b.name == 'RO7') return -1;
				if(a.name == 'B' && b.name == '') return -1;

                if(a.name == 'RO1' && b.name == 'RO2') return -1;
				if(a.name == 'RO1' && b.name == 'RO3') return -1;
				if(a.name == 'RO1' && b.name == 'RO4') return -1;
				if(a.name == 'RO1' && b.name == 'RO5') return -1;
				if(a.name == 'RO1' && b.name == 'RO6') return -1;
				if(a.name == 'RO1' && b.name == 'RO7') return -1;
				if(a.name == 'RO1' && b.name == '') return -1;

                if(a.name == 'RO2' && b.name == 'RO3') return -1;
				if(a.name == 'RO2' && b.name == 'RO4') return -1;
				if(a.name == 'RO2' && b.name == 'RO5') return -1;
				if(a.name == 'RO2' && b.name == 'RO6') return -1;
				if(a.name == 'RO2' && b.name == 'RO7') return -1;
				if(a.name == 'RO2' && b.name == '') return -1;

                if(a.name == 'RO3' && b.name == 'RO4') return -1;
				if(a.name == 'RO3' && b.name == 'RO5') return -1;
				if(a.name == 'RO3' && b.name == 'RO6') return -1;
				if(a.name == 'RO3' && b.name == 'RO7') return -1;
				if(a.name == 'RO3' && b.name == '') return -1;

                if(a.name == 'RO4' && b.name == 'RO5') return -1;
				if(a.name == 'RO4' && b.name == 'RO6') return -1;
				if(a.name == 'RO4' && b.name == 'RO7') return -1;
				if(a.name == 'RO4' && b.name == '') return -1;

                if(a.name == 'RO5' && b.name == 'RO6') return -1;
				if(a.name == 'RO5' && b.name == 'RO7') return -1;
				if(a.name == 'RO5' && b.name == '') return -1;

                if(a.name == 'RO6' && b.name == 'RO7') return -1;
                if(a.name == 'RO6' && b.name == '') return -1;

                if(a.name == 'RO7' && b.name == '') return -1;
				//-----------------------------------------//
				if(b.name == 'B' && a.name == 'RO1') return 1;
				if(b.name == 'B' && a.name == 'RO2') return 1;
				if(b.name == 'B' && a.name == 'RO3') return 1;
				if(b.name == 'B' && a.name == 'RO4') return 1;
				if(b.name == 'B' && a.name == 'RO5') return 1;
				if(b.name == 'B' && a.name == 'RO6') return 1;
				if(b.name == 'B' && a.name == 'RO7') return 1;
				if(b.name == 'B' && a.name == '') return 1;

                if(b.name == 'RO1' && a.name == 'RO2') return 1;
				if(b.name == 'RO1' && a.name == 'RO3') return 1;
				if(b.name == 'RO1' && a.name == 'RO4') return 1;
				if(b.name == 'RO1' && a.name == 'RO5') return 1;
				if(b.name == 'RO1' && a.name == 'RO6') return 1;
				if(b.name == 'RO1' && a.name == 'RO7') return 1;
				if(b.name == 'RO1' && a.name == '') return 1;

                if(b.name == 'RO2' && a.name == 'RO3') return 1;
				if(b.name == 'RO2' && a.name == 'RO4') return 1;
				if(b.name == 'RO2' && a.name == 'RO5') return 1;
				if(b.name == 'RO2' && a.name == 'RO6') return 1;
				if(b.name == 'RO2' && a.name == 'RO7') return 1;
				if(b.name == 'RO2' && a.name == '') return 1;

                if(b.name == 'RO3' && a.name == 'RO4') return 1;
				if(b.name == 'RO3' && a.name == 'RO5') return 1;
				if(b.name == 'RO3' && a.name == 'RO6') return 1;
				if(b.name == 'RO3' && a.name == 'RO7') return 1;
				if(b.name == 'RO3' && a.name == '') return 1;

                if(b.name == 'RO4' && a.name == 'RO5') return 1;
				if(b.name == 'RO4' && a.name == 'RO6') return 1;
				if(b.name == 'RO4' && a.name == 'RO7') return 1;
				if(b.name == 'RO4' && a.name == '') return 1;

                if(b.name == 'RO5' && a.name == 'RO6') return 1;
				if(b.name == 'RO5' && a.name == 'RO7') return 1;
				if(b.name == 'RO5' && a.name == '') return 1;

                if(b.name == 'RO6' && a.name == 'RO7') return 1;
                if(b.name == 'RO6' && a.name == '') return 1;

                if(b.name == 'RO7' && a.name == '') return 1;
				return 0;
			});

    } 

    if(catArr.length > 0){
		catArr.sort(function(a,b){
			    if(a == 'B' && b == 'RO1') return -1;
				if(a == 'B' && b == 'RO2') return -1;
				if(a == 'B' && b == 'RO3') return -1;
				if(a == 'B' && b == 'RO4') return -1;
				if(a == 'B' && b == 'RO5') return -1;
				if(a == 'B' && b == 'RO6') return -1;
				if(a == 'B' && b == 'RO7') return -1;
				if(a == 'B' && b == '') return -1;

                if(a == 'RO1' && b == 'RO2') return -1;
				if(a == 'RO1' && b == 'RO3') return -1;
				if(a == 'RO1' && b == 'RO4') return -1;
				if(a == 'RO1' && b == 'RO5') return -1;
				if(a == 'RO1' && b == 'RO6') return -1;
				if(a == 'RO1' && b == 'RO7') return -1;
				if(a == 'RO1' && b == '') return -1;

                if(a == 'RO2' && b == 'RO3') return -1;
				if(a == 'RO2' && b == 'RO4') return -1;
				if(a == 'RO2' && b == 'RO5') return -1;
				if(a == 'RO2' && b == 'RO6') return -1;
				if(a == 'RO2' && b == 'RO7') return -1;
				if(a == 'RO2' && b == '') return -1;

                if(a == 'RO3' && b == 'RO4') return -1;
				if(a == 'RO3' && b == 'RO5') return -1;
				if(a == 'RO3' && b == 'RO6') return -1;
				if(a == 'RO3' && b == 'RO7') return -1;
				if(a == 'RO3' && b == '') return -1;

                if(a == 'RO4' && b == 'RO5') return -1;
				if(a == 'RO4' && b == 'RO6') return -1;
				if(a == 'RO4' && b == 'RO7') return -1;
				if(a == 'RO4' && b == '') return -1;

                if(a == 'RO5' && b == 'RO6') return -1;
				if(a == 'RO5' && b == 'RO7') return -1;
				if(a == 'RO5' && b == '') return -1;

                if(a == 'RO6' && b == 'RO7') return -1;
                if(a == 'RO6' && b == '') return -1;

                if(a == 'RO7' && b == '') return -1;
				//-----------------------------------------//
				if(b == 'B' && a == 'RO1') return 1;
				if(b == 'B' && a == 'RO2') return 1;
				if(b == 'B' && a == 'RO3') return 1;
				if(b == 'B' && a == 'RO4') return 1;
				if(b == 'B' && a == 'RO5') return 1;
				if(b == 'B' && a == 'RO6') return 1;
				if(b == 'B' && a == 'RO7') return 1;
				if(b == 'B' && a == '') return 1;

                if(b == 'RO1' && a == 'RO2') return 1;
				if(b == 'RO1' && a == 'RO3') return 1;
				if(b == 'RO1' && a == 'RO4') return 1;
				if(b == 'RO1' && a == 'RO5') return 1;
				if(b == 'RO1' && a == 'RO6') return 1;
				if(b == 'RO1' && a == 'RO7') return 1;
				if(b == 'RO1' && a == '') return 1;

                if(b == 'RO2' && a == 'RO3') return 1;
				if(b == 'RO2' && a == 'RO4') return 1;
				if(b == 'RO2' && a == 'RO5') return 1;
				if(b == 'RO2' && a == 'RO6') return 1;
				if(b == 'RO2' && a == 'RO7') return 1;
				if(b == 'RO2' && a == '') return 1;

                if(b == 'RO3' && a == 'RO4') return 1;
				if(b == 'RO3' && a == 'RO5') return 1;
				if(b == 'RO3' && a == 'RO6') return 1;
				if(b == 'RO3' && a == 'RO7') return 1;
				if(b == 'RO3' && a == '') return 1;

                if(b == 'RO4' && a == 'RO5') return 1;
				if(b == 'RO4' && a == 'RO6') return 1;
				if(b == 'RO4' && a == 'RO7') return 1;
				if(b == 'RO4' && a == '') return 1;

                if(b == 'RO5' && a == 'RO6') return 1;
				if(b == 'RO5' && a == 'RO7') return 1;
				if(b == 'RO5' && a == '') return 1;

                if(b == 'RO6' && a == 'RO7') return 1;
                if(b == 'RO6' && a == '') return 1;

                if(b == 'RO7' && a == '') return 1;

				return 0;
		});
	}

    var chart = Highcharts.chart('ncpRoutineChart', {
        chart: {
            type: 'column',
            options3d: {
                enabled: false,
                alpha: 15,
                beta: 15,
                viewDistance: 25,
                depth: 40
            },
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
                                    text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Maintenance Progress Dashboard<br>'+localStorage.p_name+'<br>NCP BY ROUTINE MAINTENANCE ('+monthYear+')</span>'
                                }
                            })
            
                            chart.updateFlag = true;
                        }
                        else if (chart.updateFlag) {
                            chart.updateFlag = false;
                
                            chart.update({
                                title: {
                                    text: '<span class="showLabel">Maintenance Progress Dashboard<br>'+localStorage.p_name+'<br>NCP BY ROUTINE MAINTENANCE ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Maintenance Progress Dashboard<br>'+localStorage.p_name+'<br>NCP BY ROUTINE MAINTENANCE ('+monthYear+')</span>'
        },
        credits : {enabled:false},
        legend : {
            enabled : true,
            itemStyle : {
                fontSize: '13px'
                }
        },
        xAxis: {
            categories: catArr,
            labels: {
            skew3d: true,
            style: {
                fontSize: '10px'
            }
            }
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
            name: 'Open',
            data: dataArrOpen,
            color : legendColorArr['blue'],
            cursor: 'pointer',
            events: {
                click: function (event) {
                    if(localStorage.ui_pref != "ri_v3") return;

                    var searchfilter = getFilterDashboardAsset();
                    var scope = event.point.category.name;
                    linkWinTitle = "NCP BY ROUTINE MAINTENANCE"
                    linkName = 'dash_asset_ncp_card'
                    linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, 'Routine', 'Open', '', scope])
                    window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Open');
                }
            }
        
        }, {
            name: 'Close',
            data: dataArrClose,
            color : legendColorArr['orange'],
            cursor: 'pointer',
            events: {
                click: function (event) {
                    if(localStorage.ui_pref != "ri_v3") return;

                    var searchfilter = getFilterDashboardAsset();
                    var scope = event.point.category.name;
                    linkWinTitle = "NCP BY ROUTINE MAINTENANCE"
                    linkName = 'dash_asset_ncp_card'
                    linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, 'Routine', 'Close', '', scope])
                    window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Close');
                }
            }
        }]
    });
    chart.updateFlag = true;
}

getPercentage = (val, total) => (total) ? Math.round((val/total)*100 * 10) / 10 : 0;

function refreshInformation(packId = 'overall', year = 'all', month = 'all', activity = 'default', assetTyp = 'default', wpcName = 'all'){

    console.log(progData)
    let act_routine = "";

    if(activity == 'R01 : PAVEMENT'){
        act_routine = "RO1";
        assetTyp = 'default'
    }else if(activity == 'R02 : ROAD SHOULDER'){
        act_routine = "RO2";
        assetTyp = 'default'
    }else if(activity == 'R03 : GRASS CUTTING'){
        act_routine = "RO3";
        assetTyp = 'default'
    }else if(activity == 'R04 : MAINTENANCE OF ROAD FURNITURES'){
        act_routine = "RO4";
        assetTyp = 'default'
    }else if(activity == 'R05 : MAINTENANCE OF BRIDGES/CULVERT'){
        act_routine = "RO5";
        assetTyp = assetTyp
    }else if(activity == 'R06: PAINTING OF ROAD MARKING'){
        act_routine = "RO6";
        assetTyp = 'default'
    }else if(activity == 'R07 : CLEANING OF DRAINS'){
        act_routine = "RO7";
        assetTyp = 'default'
    }else if(activity == 'B : ROUTINE INSPECTION'){
        act_routine = "B";
        assetTyp = 'default'
    }else{
        act_routine = "default"
    }

    var dataYearMonth = '';
    if(localStorage.isParent && localStorage.isParent == 'isParent' && localStorage.ui_pref == 'ri_v3'){
        dataYearMonth = "Division:"+wpcName+" - ";
    }
    dateYearMonthWOActivity = dataYearMonth +"Month:" +month+ " - " + "Year:" +year;
    dataYearMonth = dataYearMonth +"Month:" +month+ " - " + "Year:" +year+ " - " + "Activity:" +activity;

    var wiData = (progData.wi && progData.wi[packId] && progData.wi[packId][year] && progData.wi[packId][year][month]) ? progData.wi[packId][year][month] : [];
    var ncpData = (progData.ncp && progData.ncp[packId] && progData.ncp[packId][year] && progData.ncp[packId][year][month]) ? progData.ncp[packId][year][month] : [];
	var claimData = (progData.claim && progData.claim[packId] && progData.claim[packId][year] && progData.claim[packId][year][month]) ? progData.claim[packId][year][month] : [];
	var budgetData = (progData.budget && progData.budget[packId] && progData.budget[packId][year][month]) ? progData.budget[packId][year][month] : [];

    // var dataCyclic = (wiData && wiData.chart && wiData.chart[activity] && wiData.chart[activity][assetTyp] && wiData.chart[activity][assetTyp]['Cyclic']) ? wiData.chart[activity][assetTyp]['Cyclic'] : [];
    // var dataNonCyclic = (wiData && wiData.chart && wiData.chart[activity] && wiData.chart[activity][assetTyp] && wiData.chart[activity][assetTyp]['Non Cyclic']) ? wiData.chart[activity][assetTyp]['Non Cyclic'] : [];
    var dataPie = (ncpData && ncpData.chart && ncpData.chart[act_routine]) ? ncpData.chart[act_routine] : [];
    var dataPieStatus = (ncpData && ncpData.ncpChart && ncpData.ncpChart[act_routine]) ? ncpData.ncpChart[act_routine] : [];
    var dataRoutine = (ncpData && ncpData.ncpRoutine && ncpData.ncpRoutine[act_routine]) ? ncpData.ncpRoutine[act_routine] : [];
    var dataClaim = (claimData && claimData.cardClaim) ? claimData.cardClaim : [];
    var dataChartClaim = (claimData && claimData.chartClaim) ? claimData.chartClaim : [];

    var dataCyclic = (wiData && wiData.chart && wiData.chart['Cyclic'] && wiData.chart['Cyclic'][activity] && wiData.chart['Cyclic'][activity][assetTyp]) ? wiData.chart['Cyclic'][activity][assetTyp] : [];
    var dataNonCyclic = (wiData && wiData.chart && wiData.chart['Non Cyclic'] && wiData.chart['Non Cyclic'][activity]) && wiData.chart['Non Cyclic'][activity][assetTyp] ? wiData.chart['Non Cyclic'][activity][assetTyp] : [];

    var dataBudget = (budgetData && budgetData.cardBudget) ? budgetData.cardBudget : [];

    if(assetTyp == 'default'){
        dataPie = dataPie;
        dataPieStatus = dataPieStatus;
        dataRoutine = dataRoutine;
    }else{
        dataPie = '';
        dataPieStatus = '';
        dataRoutine = '';
    }

    updateCard(dataClaim,dataBudget)
    drawCyclicChart(dataCyclic, 'cyclicBarChart', 'Cyclic', dataYearMonth)
    drawCyclicChart(dataNonCyclic, 'nonCyclicBarChart', 'Non Cyclic', dataYearMonth)
    drawNCPChart(dataPie, dataYearMonth)
    drawNCPStatusChart(dataPieStatus, dataYearMonth)
    drawNCPRoutine(dataRoutine, dataYearMonth)
    drawChartClaim(dataChartClaim, dateYearMonthWOActivity)
}

function refreshDashboard(){
    var selWPC = $('#wpcFilter').val();
    var selYear = $('#yearFilter').val();
    if (selYear == 'all') {
        $('#monthFilter').prop("disabled", true);	
        $('#monthFilter').val('all');
    }else{
        $('#monthFilter').prop("disabled", false);
    }
    var selMonth = $('#monthFilter').val();
    var selActivity = $('#activityFilter').val();
    var selAssetType = $('#assetTypeFilter').val();

    refreshInformation(selWPC, selYear, selMonth, selActivity, selAssetType);
}

function refreshFromv3 (filterArr){
	var wpc = filterArr.wpc;
	var wpcName = filterArr.wpcName; // get package name for chart label
	var year = filterArr.year;
	var month = filterArr.month;
    var assetRoutine = filterArr.assetRoutine;
	var assetType = filterArr.assetType;

    refreshInformation(wpc, year, month, assetRoutine, assetType, wpcName);
}

function populateAssetActivity(data) {
    var optHTML;
    if (data) {
        if(data == "R05 : MAINTENANCE OF BRIDGES/CULVERT"){
            optHTML += '<option value="default">Select Asset Type</option>';
            optHTML += '<option value="BR">Bridge</option>';
            optHTML += '<option value="CL">Culvert</option>';
        }else{
            optHTML += '<option value="default">Select Asset Type</option>';
        }
    }
    if(localStorage.ui_pref == 'ri_v3'){
        window.parent.$('.assetTypeFilter').html(optHTML);
    }else{
        $('.assetTypeFilter').html(optHTML);
    }
}

$(document).ready(function(){
    $('#activityFilter').change(function () {
        var selActivity = $('#activityFilter').val();
        populateAssetActivity(selActivity);
    })

    window.parent.$('.assetRoutineActivityFilter.myDashboard').change(function(){
        var selActivity = $(this).val();
        populateAssetActivity(selActivity);
    })

    $.ajax({
        type: "POST",
		url: 'chartData.json.php',
		dataType: 'json',
		data: {
            page: "maintenanceProg"
		},
		success: function (obj) {
			if (obj.status && obj.status == 'ok') {
                progData = obj.data;
                refreshInformation();
			}
		}
	});
})