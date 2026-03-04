var stakeData;
var monthHalftext = {"01":"Jan","02":"Feb","03":"Mar","04":"Apr","05":"May","06":"Jun","07":"Jul","08":"Aug","09":"Sep","10":"Oct","11":"Nov","12":"Dec"};
var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};

function drawTypeEvents(data, eventDate, monthYear){
    var dataArr = [];
    var colorArr;
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0 };
            dataArr.push(tempArr);
        }
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
    }else{
        colorArr = ['#a8caff', '#ffa8a8', '#f7b365', '#c9cc85', '#f0f582', '#a8ffc5', '#a8ffef', '#b5a8ff', '#dea8ff', '#ffa8f2', '#ffa8c9', '#ffa8a8']
    }

    var chart = Highcharts.chart('typeEvents', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Stakeholder Management<br>'+localStorage.p_name+'<br>TYPE OF EVENTS ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Stakeholder Management<br>'+localStorage.p_name+'<br>TYPE OF EVENTS ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Stakeholder Management<br>'+localStorage.p_name+'<br>TYPE OF EVENTS ('+monthYear+')</span>'
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
                    enabled: false,
                    format: '<b>{point.name}</b>:<br>{point.percentage:.1f} %<br>total: {point.total}',
                },
                showInLegend: true
            }
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b><br>{point.y} Event No.'
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
            colors: colorArr,
            data: dataArr,
            events: {
                click: function (event) {
                    var paramDateFrom = (eventDate.dateFrom) ? eventDate.dateFrom : [];
                    var paramDateTo = (eventDate.dateTo) ? eventDate.dateTo : []
                    var linkParamArr = processFilterParamArr([paramDateFrom, paramDateTo, event.point.name]);
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("EVNT", "construct_dash_conop_evnt", linkParamArr, "Event");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"EVNT", conOpTabId:"conopTab16", linkName:"construct_dash_conop_evnt", linkParam:linkParamArr, linkWinTitle: 'Event'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            }
        }],
        credits: false
    });
    chart.updateFlag = true;
}

function typeEventStackBar(data, monthYear){
    var catArr = [];
    var typeArr = [];
    var typeValArr = [];
    
    var dataArrSeries = [];
    var seriesArr = [];
    var colorArr;

    if(data){
        for (const [idx, ele] of Object.entries(data)) {
            if(idx == "") continue;
            catArr.push(idx);

            for (const [dataIdx, dataEle] of Object.entries(ele)) {
                if (typeArr.indexOf(dataIdx) === -1) typeArr.push(dataIdx);
                if (!typeValArr[dataIdx]) typeValArr[dataIdx] = [];
                typeValArr[dataIdx][idx] = dataEle;
            }
        }
        
        catArr.forEach(function(ele){
            typeArr.forEach(function(ele2){
                var val = (typeValArr[ele2] && typeValArr[ele2][ele] && typeValArr[ele2][ele]['val']) ? typeValArr[ele2][ele]['val'] : 0;
                var allData = (typeValArr[ele2] && typeValArr[ele2][ele] && typeValArr[ele2][ele]['allData']) ? typeValArr[ele2][ele]['allData'] : 0;
    
                if(!dataArrSeries[ele2]) dataArrSeries[ele2] = [];
                dataArrSeries[ele2].push({y:val, allData : allData});
            })
        })

        for (const [idx, ele] of Object.entries(dataArrSeries)) {
            seriesArr.push(
                {
                    name: idx,
                    data: ele,
                    cursor : 'pointer',
                    events: {
                        click: function (event) {
                            var allData = event.point.allData;
                            var paramDateTo = (allData.dateTo) ? allData.dateTo : '';
                            var paramDateFrom = (allData.dateFrom) ? allData.dateFrom : '';
                            var linkParamArr = processFilterParamArr([paramDateFrom, paramDateTo, event.point.series.name]);
                            
                            if(localStorage.ui_pref == "ri_v3"){
                                window.parent.widgetConopOpen("EVNT", "construct_dash_conop_evnt", linkParamArr, "Event");
                            }else{
                                var postParam = {function:"openConOpDashboard",processType:"EVNT", conOpTabId:"conopTab16", linkName:"construct_dash_conop_evnt", linkParam:linkParamArr, linkWinTitle: 'Event'};
                                parent.postMessage(postParam ,"*");
                            }
                        }
                    }
                }
            )
        };
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
        colorArr = ['#a8caff', '#ffa8a8', '#f7b365', '#c9cc85', '#f0f582', '#a8ffc5', '#a8ffef', '#b5a8ff', '#dea8ff', '#ffa8f2', '#ffa8c9', '#ffa8a8']
    }

    var chart = Highcharts.chart('eventType', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Stakeholder Management<br>'+localStorage.p_name+'<br>TYPE OF EVENTS ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Stakeholder Management<br>'+localStorage.p_name+'<br>TYPE OF EVENTS ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Stakeholder Management<br>'+localStorage.p_name+'<br>TYPE OF EVENTS ('+monthYear+')</span>'
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
                    enabled: false
                }
            },
            series: {
                colorByPoint: true
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        series: seriesArr,
        colors: colorArr,
    });
    chart.updateFlag = true;
}

function drawTableEvent(data, eventDate){
    let eventTbHTML = '';
    $("#eventTable").html("");
    if (data) {
        var paramDateFrom = (eventDate.dateFrom) ? eventDate.dateFrom : [];
        var paramDateTo = (eventDate.dateTo) ? eventDate.dateTo : []
        data.forEach(function(ele,idx){
             
            eventTbHTML += '<tr onclick="openConOpDashboardEVNT(\''+paramDateFrom+'\',\''+paramDateTo+'\')">'
            eventTbHTML += '<td>'+((ele.category) ? ele.category : '')+'</td>'
            eventTbHTML += '<td>'+((ele.type) ? ele.type : '')+'</td>'
            eventTbHTML += '<td>'+((ele.location) ? ele.location : '')+'</td>'
            eventTbHTML += '<td>'+((ele.description) ? ele.description : '')+'</td>'
            eventTbHTML += '<td>'+((ele.evt_status) ? ele.evt_status : '')+'</td>'
            eventTbHTML += '</tr>'; 
        })
        $("#eventTable").html(eventTbHTML);  
    }
}

function updateEventCard(data, eventDate){
    var paramDateFrom = (eventDate.dateFrom) ? eventDate.dateFrom : [];
    var paramDateTo = (eventDate.dateTo) ? eventDate.dateTo : []
    $("#noEvent").html((data.total) ?  '<span style="cursor: pointer;" onclick="openConOpDashboardEVNT(\''+paramDateFrom+'\',\''+paramDateTo+'\')">'+data.total+'</span>' : 0);
}

function drawTypePublic(data, eventDate, monthYear){
    var dataArr = [];
    var colorArr;
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0 };
            dataArr.push(tempArr);
        }
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
    }else{
        colorArr = ['#a8caff', '#ffa8a8', '#f7b365', '#c9cc85', '#f0f582', '#a8ffc5', '#a8ffef', '#b5a8ff', '#dea8ff', '#ffa8f2', '#ffa8c9', '#ffa8a8']
    }

    var chart = Highcharts.chart('categoryComplaint', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Stakeholder Management<br>'+localStorage.p_name+'<br>CATEGORY OF COMPLAINTS ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Stakeholder Management<br>'+localStorage.p_name+'<br>CATEGORY OF COMPLAINTS ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Stakeholder Management<br>'+localStorage.p_name+'<br>CATEGORY OF COMPLAINTS ('+monthYear+')</span>'
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
                    enabled: false,
                    format: '<b>{point.name}</b>:<br>{point.percentage:.1f} %<br>total: {point.total}',
                },
                showInLegend: true
            }
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b><br>{point.y} Complaints'
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
            colors: colorArr,
            data: dataArr,
            events: {
                click: function (event) {
                    var paramDateFrom = (eventDate.dateFrom) ? eventDate.dateFrom : [];
                    var paramDateTo = (eventDate.dateTo) ? eventDate.dateTo : []
                    var linkParamArr = processFilterParamArr([paramDateFrom, paramDateTo, event.point.name, '', '', '']);
                    
                    if(localStorage.ui_pref == "ri_v3"){
                        window.parent.widgetConopOpen("PUBC", "construct_dash_conop_pubc", linkParamArr, "Public Complaint");
                    }else{
                        var postParam = {function:"openConOpDashboard",processType:"PUBC", conOpTabId:"conopTab15", linkName:"construct_dash_conop_pubc", linkParam:linkParamArr, linkWinTitle: 'Public Complaint'};
                        parent.postMessage(postParam ,"*");
                    }
                }
            }
        }],
        credits: false
    });
    chart.updateFlag = true;
}

function typePublicStackBar(data, monthYear){
    var catArr = [];
    var typeArr = [];
    var typeValArr = [];
    
    var dataArrSeries = [];
    var seriesArr = [];
    var colorArr;

    if(localStorage.ui_pref == 'ri_v3'){
        colorArr = {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
                [0, '#003399'],
                [1, '#3366AA']
            ]
       }
    }else{
        colorArr = ['#a8caff', '#ffa8a8', '#f7b365', '#c9cc85', '#f0f582', '#a8ffc5', '#a8ffef', '#b5a8ff', '#dea8ff', '#ffa8f2', '#ffa8c9', '#ffa8a8']
    }

    if(data){
        for (const [idx, ele] of Object.entries(data)) {
            if(idx == "") continue;
            catArr.push(idx);
            
            for (const [dataIdx, dataEle] of Object.entries(ele)) {
                if (typeArr.indexOf(dataIdx) === -1) typeArr.push(dataIdx);
                if (!typeValArr[dataIdx]) typeValArr[dataIdx] = [];
                if (!typeValArr[dataIdx][idx]) typeValArr[dataIdx][idx] = [];
                typeValArr[dataIdx][idx] = dataEle;
            }
        }

        catArr.forEach(function(ele){
            typeArr.forEach(function(ele2){
                var val = (typeValArr[ele2] && typeValArr[ele2][ele] && typeValArr[ele2][ele]['val']) ? parseInt(typeValArr[ele2][ele]['val']) : 0;
                var allData = (typeValArr[ele2] && typeValArr[ele2][ele] && typeValArr[ele2][ele]['allData']) ? typeValArr[ele2][ele]['allData'] : 0;
    
                if(!dataArrSeries[ele2]) dataArrSeries[ele2] = [];
                dataArrSeries[ele2].push({y:val, allData : allData});
            })
        })

        for (const [idx, ele] of Object.entries(dataArrSeries)) {
            seriesArr.push(
                {
                    name: idx,
                    data: ele,
                    cursor : 'pointer',
                    events: {
                        click: function (event) {
                            var allData = event.point.allData;
                            var paramDateTo = (allData.dateTo) ? allData.dateTo : '';
                            var paramDateFrom = (allData.dateFrom) ? allData.dateFrom : '';
                            var linkParamArr = processFilterParamArr([paramDateFrom, paramDateTo, event.point.series.name, '', '', '']);
                            
                            if(localStorage.ui_pref == "ri_v3"){
                                window.parent.widgetConopOpen("PUBC", "construct_dash_conop_pubc", linkParamArr, "Public Complaint");
                            }else{
                                var postParam = {function:"openConOpDashboard",processType:"PUBC", conOpTabId:"conopTab15", linkName:"construct_dash_conop_pubc", linkParam:linkParamArr, linkWinTitle: 'Public Complaint'};
                                parent.postMessage(postParam ,"*");
                            }

                        }
                    }
                }
            )
        };
    }

    var chart = Highcharts.chart('pbcType', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Stakeholder Management<br>'+localStorage.p_name+'<br>CATEGORY OF COMPLAINTS ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Stakeholder Management<br>'+localStorage.p_name+'<br>CATEGORY OF COMPLAINTS ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Stakeholder Management<br>'+localStorage.p_name+'<br>CATEGORY OF COMPLAINTS ('+monthYear+')</span>'
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
                    enabled: false
                }
            },
            series: {
                colorByPoint: true
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        series: seriesArr,
        colors: colorArr,
    });
    chart.updateFlag = true;
}

function drawTablePublic(data, eventDate){
    let publicTbHTML = '';
    $("#publicTable").html("");
    if (data) {
        data.forEach(function(ele,idx){
            var paramDateFrom = (eventDate.dateFrom) ? eventDate.dateFrom : [];
            var paramDateTo = (eventDate.dateTo) ? eventDate.dateTo : []
            var refNo = (ele.ref_no) ? (ele.ref_no).substr(ele.ref_no.length - 4) : '';

            publicTbHTML += '<tr onclick="openConOpDashboardPUBC(\''+paramDateFrom+'\',\''+paramDateTo+'\')">'
            publicTbHTML += '<td style="text-align: center;">'+((ele.client_ref_no) ? ele.client_ref_no : '')+'</td>'
            publicTbHTML += '<td style="text-align: center;">'+refNo+'</td>'
            publicTbHTML += '<td style="text-align: center;">'+((ele.date_received) ? ele.date_received : '')+'</td>'
            publicTbHTML += '<td style="text-align: center;">'+((ele.category) ? ele.category : '')+'</td>'
            publicTbHTML += '<td>'+((ele.type) ? ele.type : '')+'</td>'
            publicTbHTML += '<td style="text-align: center;">'+((ele.pbc_status) ? ele.pbc_status : '')+'</td>'
            publicTbHTML += '<td style="text-align: center;">'+((ele.resolveDay) ? ele.resolveDay : '')+'</td>'
            publicTbHTML += '<td style="text-align: center;">'+((ele.non_project) ? ele.non_project : '')+'</td>'
            publicTbHTML += '</tr>';
        })
        $("#publicTable").html(publicTbHTML);  
    }
}

function openConOpDashboardEVNT(paramFrom, paramTo){
    var linkParamArr = processFilterParamArr([paramFrom, paramTo,""]);

    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("EVNT", "construct_dash_conop_evnt", linkParamArr, "Event");
    }else{
        var postParam = {function:"openConOpDashboard",processType:"EVNT", conOpTabId:"conopTab16", linkName:"construct_dash_conop_evnt", linkParam:linkParamArr, linkWinTitle: 'Event'};
        parent.postMessage(postParam ,"*");
    }
}

function openConOpDashboardPUBC(paramFrom, paramTo){
    var linkParamArr = processFilterParamArr([paramFrom, paramTo,"","","",""]);

    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("PUBC", "construct_dash_conop_pubc", linkParamArr, "Public Complaint");
    }else{
        var postParam = {function:"openConOpDashboard",processType:"PUBC", conOpTabId:"conopTab15", linkName:"construct_dash_conop_pubc", linkParam:linkParamArr, linkWinTitle: 'Public Complaint'};
        parent.postMessage(postParam ,"*");
    }
}

function updatePublicCard(data, eventDate){
    var paramDateFrom = (eventDate.dateFrom) ? eventDate.dateFrom : [];
    var paramDateTo = (eventDate.dateTo) ? eventDate.dateTo : []
    $("#noComplaint").html((data.total) ?  '<span style="cursor: pointer;" onclick="openConOpDashboardPUBC(\''+paramDateFrom+'\',\''+paramDateTo+'\')">'+data.total+'</span>' : 0);
}

function setCutOffDate(day, year, month){
    if(year == 'all' || month == 'all'){
        $("#cutOff-day").text('');
        $("#cutOff-month").text('');
        $("#cutOff-year").text('');
    }
    else{
        $("#cutOff-day").text(day);
        $("#cutOff-month").text(monthHalftext[month]);
        $("#cutOff-year").text(year);
    }

}

function refreshInformation(proj = 'overall', yr = 'all', mth = 'all'){
    var dataYearMonth = "Month:" +mth+ " - " + "Year:" +yr;
    var cutOffDay = parseInt(stakeData.packageCutOffDay[proj]);
    setCutOffDate(cutOffDay, yr, mth)

    var eventData = (stakeData && stakeData.event && stakeData.event[proj] && stakeData.event[proj][yr] && stakeData.event[proj][yr][mth]) ? stakeData.event[proj][yr][mth] : [];
    var dateFilterEvent = (eventData.allData) ? eventData.allData : [];
    
    var eventCount = (eventData && eventData.card) ? eventData.card : [];
    updateEventCard(eventCount, dateFilterEvent);
    var eventChart = (eventData && eventData.pieChart) ? eventData.pieChart : [];
    drawTypeEvents(eventChart, dateFilterEvent, dataYearMonth);
    var eventTable = (eventData && eventData.raw) ? eventData.raw : [];
    drawTableEvent(eventTable, dateFilterEvent)
    var eventStakeBar = (eventData && eventData.typeEvent) ? eventData.typeEvent : [];
    typeEventStackBar(eventStakeBar, dataYearMonth);

    var pbcData = (stakeData && stakeData.pbc && stakeData.pbc[proj] && stakeData.pbc[proj][yr] && stakeData.pbc[proj][yr][mth]) ? stakeData.pbc[proj][yr][mth] : [];
    var dateFilterPublic = (pbcData.allData) ? pbcData.allData : [];

    var pbcCount = (pbcData && pbcData.card) ? pbcData.card : [];
    updatePublicCard(pbcCount, dateFilterPublic);
    var pbcChart = (pbcData && pbcData.pieChart) ? pbcData.pieChart : [];
    drawTypePublic(pbcChart, dateFilterPublic, dataYearMonth);
    var pbcTable = (pbcData && pbcData.raw) ? pbcData.raw : [];
    drawTablePublic(pbcTable, dateFilterPublic);
    var pbcStakeBar = (pbcData && pbcData.typeEvent) ? pbcData.typeEvent : [];
    typePublicStackBar(pbcStakeBar, dataYearMonth);
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

$(document).ready(function(){
	$.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "stakeholder"
        },
        success: function (obj) {
        	if (obj.status && obj.status == 'ok') {
                stakeData = obj.data;
                refreshInformation();
        	}
        },
        complete: function (){
            window.parent.postMessage({functionName: 'loaderajaxEnd'})
        }
    });
})