var landData;
var monthHalftext = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};
var monthNumtoHalftext = {"01":"Jan","02":"Feb","03":"Mar","04":"Apr","05":"May","06":"Jun","07":"Jul","08":"Aug","09":"Sep","10":"Oct","11":"Nov","12":"Dec"};
var dataColorArr = ['#54a992', '#8fb59c', '#eddbc3', '#e8c571', '#d94c3a', '#813a26', '#E74C3C']
var monthHalfPrev = {"Jan":"Dec","Feb":"Jan","Mar":"Feb","Apr":"Mar","May":"Apr","Jun":"May","Jul":"Jun","Aug":"Jul","Sep":"Aug","Oct":"Sep","Nov":"Oct","Dec":"Nov"};

var currYear;
var currMonth;
var prevYear;
var prevMonth;
var timelineJSON;

function openConOpDashboardLand(year, month){
    if(year == '' || month == '') return 

    var linkParamArr = [year, month];
    var postParam = {function:"openConOpDashboard",processType:"LAND", conOpTabId:"conopTab18", linkName:"construct_dash_conop_land_management", linkParam:linkParamArr, linkWinTitle: 'Land Management'};
    if(localStorage.ui_pref == 'ri_v3'){
        window.parent.widgetConopOpen("LAND", "construct_dash_conop_land_management", linkParamArr, "Land Management");
    }else{
        parent.postMessage(postParam ,"*");
    }
}

function openConOpDashboardLandTimeData(idFilter){
    if(idFilter == '') return 
    var linkParamArr = [idFilter];
    var postParam = {function:"openConOpDashboard",processType:"LAND", conOpTabId:"conopTab17", linkName:"construct_dash_conop_land_timeline", linkParam:linkParamArr, linkWinTitle: 'Land Timeline & Database'};
    if(localStorage.ui_pref == 'ri_v3'){
        window.parent.widgetConopOpen("LAND", "construct_dash_conop_land_timeline", linkParamArr, "Land Management");
    }else{
        parent.postMessage(postParam ,"*");
    }
}

function updateSynopsis(data, allData){
    let landTbHTML = '';
    $("#landSynopsis").html("");

    var year = (allData && allData.year) ? allData.year : '';
    var month = (allData && allData.month) ? allData.month : '';

    data.forEach(function(ele,idx){
        landTbHTML += '<div class="paragraph" ><i class="fa-solid fa-chart-column"></i><p><span style="cursor: pointer;" onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+ele+'</p></div>'; 
    })

    $("#landSynopsis").html(landTbHTML);  
}

function updateLandDatabase(data, allData, monthYear){
    var catArr = [];
    var dataArr = [];
    var tempArr2 = [];
    var tempArr3 = [];

    var tempAdd = 0;
    if(data){
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);
            tempAdd = 0;
            for (const [idx2, ele2] of Object.entries(ele)) {
                //tempArr2 for COLUMN CHART
                if (!tempArr2[idx2]) tempArr2[idx2] = [];
                tempArr2[idx2].push({y: (ele2) ? parseFloat(ele2) : 0, allData : allData});
                tempAdd = tempAdd + parseFloat(ele2);
            }
            //tempArr3 for SPLINE CHART
            tempArr3.push(Math.round(parseFloat(tempAdd)));
        }

        let counter = 0;

        //FOR COLUMN
        for (const [idx3, ele3] of Object.entries(tempArr2)) {
            var tempArr = {
                type: 'column',
                name: idx3,
                data: ele3,
                cursor: 'pointer',
                color: Highcharts.getOptions().colors[counter],
                events: {
                    click: function (event) {
                        var allData = (event.point.allData) ? event.point.allData : [];
                        var idFilter = (allData['Database'] && allData['Database'].idForConop) ? allData['Database'].idForConop : '';

                        if(idFilter == '') return 
                        var linkParamArr = [idFilter];
                        var postParam = {function:"openConOpDashboard",processType:"LAND", conOpTabId:"conopTab17", linkName:"construct_dash_conop_land_timeline", linkParam:linkParamArr, linkWinTitle: 'Land Timeline & Database'};
                        if(localStorage.ui_pref == "ri_v3"){
                            window.parent.widgetConopOpen("LAND", "construct_dash_conop_land_timeline", linkParamArr, "Land Timeline & Database");
                        }else{
                            parent.postMessage(postParam ,"*");
                        }
                    }
                }
            };
            dataArr.push(tempArr);
            counter++;
        }

        //FOR SPLINE
        var tempArr = {type: 'spline', name: 'TOTAL', data: tempArr3, color: Highcharts.getOptions().colors[7]};
        dataArr.push(tempArr);
    }

    var chart = Highcharts.chart('landDatabase', {
        chart: {
            marginTop: 55,
            events: {
                render() {
                  var chart = this;
                  if(localStorage.ui_pref == 'ri_v3'){
                      if (document.fullscreenElement && chart.updateFlag) {
                        chart.updateFlag = false;
                        chart.update({
                            chart:{
                                marginTop: 90,
                                marginBottom: 100,
                            },
                            title: {
                                text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Land Management<br>'+localStorage.p_name+'<br>Land Database ('+monthYear+')</span>'
                            },
                            legend: {
                                symbolHeight: 10,
                                symbolWidth: 10,
                                verticalAlign: 'bottom',
                                y: -20,
                                floating: false,
                                itemStyle : {
                                  fontSize : 10
                                }
                            }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">Land Management<br>'+localStorage.p_name+'<br>Land Database ('+monthYear+')</span>'
                          },
                          legend: {
                            floating: true,
                            verticalAlign: 'top',
                            symbolHeight: 9,
                            symbolWidth: 9,
                            itemStyle: {
                              fontSize: '9px',
                            },
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
            text: '<span class="showLabel">Land Management<br>'+localStorage.p_name+'<br>Land Database ('+monthYear+')</span>'
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
                text: ''
            }
        },
        legend: {
            align: 'center',
            verticalAlign: 'top',
            floating: true,
            itemStyle : {
                fontSize : 9
            },
            labelFormatter: function() {
                return this.name;
            },
        },
        credits: false,
        tooltip: {
            formatter: function(){
                var points = this.points;
                var tableHTML = '<span style="font-size:0.9rem"><b>'+this.point.category+'</b></span><table>';
                points.forEach(function(idx, ele){
                    switch(ele){
                        case 0:
                            section = 'Limbang 1';
                        break;
                        case 1:
                            section = 'Limbang 2';
                        break;
                        case 2:
                            section = 'Limbang 3';
                        break;
                        case 3:
                            section = 'Lawas 1';
                        break;
                        case 4:
                            section = 'Lawas 2';
                        break;
                        case 5:
                            section = 'TOTAL';
                        break;
                        default:
                        break
                    }
                    tableHTML += '<tr><td style="white-space:pre;padding:0;font-size:0.9rem">'+section+': </td>' +
                                 '<td style="padding:0;font-size:0.9rem"><b>'+idx.y+'</b></td></tr>'
                })

                tableHTML += '</table>';
                return tableHTML;
            },
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: dataArr
    });
    chart.updateFlag = true;
}

function updateLandTimeline(data, allData){
    let timeHeadTbHTML = '';
    let timeBodyTbHTML = '';

    $("#timelineHead").html("");
    $("#timelineBody").html("");

    flagThFirst = false;
    flagMilestonesFirst = false;
    flagEventFirst = false;
    flagEventSecond = false;
    flagHaveAssump = false;

    var dateAssumpt = '';
    var textAssumpt = '';
    var indicatorAssumpt = '';
    var indicatorClass = '';

    var count = 0;

    var idConop = (allData && allData['Timeline'] && allData['Timeline'].idForConop) ? allData['Timeline'].idForConop : '';
    
    var lengthData = (data && data.data) ? (data.data).length : 0;
    var eleCount = 0;
    if(data){

        //FIRST LOOP IS FOR DATA
        for (const [idx, ele] of Object.entries(data.data)) {
            eleCount ++;
            var createDate = new Date (ele.year + "-" + ele.month + "-01");
            var createYear = createDate.getFullYear();
            var createMonth = createDate.getMonth();
            var mthYr = monthNumtoHalftext[ele.month] +' '+ ele.year;

            dateAssumpt = '';
            textAssumpt = '';
            indicatorAssumpt = '';
            indicatorClass = '';
            indicatorFixed = '';
            
            //SECOND LOOP IS FOR ASSUMPTION
            if(data.assumption){
                for (const [idx2, ele2] of Object.entries(data.assumption)) {
                    var createDate2 = new Date (ele2.date);
                    var createYear2 = createDate2.getFullYear();
                    var createMonth2 = createDate2.getMonth();
                    var createDay2 = createDate2.getDate();
    
                    if((createYear == createYear2) && (createMonth == createMonth2)){
                        var createMonthNeedChange = createDate2.getMonth() + 1;
                        dateAssumpt = createDay2 + '/' + createMonthNeedChange + '/' +createYear2;
                        textAssumpt = ele2.target_assumption;
    
                        if(createDay2 == 1){
                            indicatorClass = 'early';
                        }
                        else if(createDay2 == 30 || createDay2 == 31 || createDay2 == 28 || createDay2 == 29){
                            indicatorClass = 'late';
                        }
                        else{
                            indicatorClass = 'mid';
                        }
    
                        if (eleCount == lengthData){
                            indicatorFixed = 'fixed'
                        }
    
                        flagHaveAssump = true;
                        break;
                    }
                }
            }

            if(ele.month_timeline){
                
                if(flagHaveAssump){
                    indicatorAssumpt = '<div class="indicator '+indicatorClass+' '+indicatorFixed+'" ><div class="text">'+textAssumpt+'<br>'+dateAssumpt+'</div><i class="fa-sharp fa-solid fa-arrow-down"></i></div>';
                }

                if(!flagThFirst){
                    timeHeadTbHTML += '<tr>'
                    timeHeadTbHTML += '<th></th>'
                    timeHeadTbHTML += '<th>'+indicatorAssumpt+''+ele.month_timeline+'</th>'
    
                    flagThFirst = true;
                }
                else{
                    timeHeadTbHTML += '<th>'+indicatorAssumpt+''+ele.month_timeline+'</th>'
                }
            }

            flagHaveAssump = false;
            count++;

        }
        timeHeadTbHTML += '</tr>'

        flagThFirst = false;
        for (const [idx, ele] of Object.entries(data.data)) {
            if(ele.month || ele.year){
                var useMonthYear = monthNumtoHalftext[ele.month] +' '+ ele.year;


                if(!flagThFirst){
                    timeHeadTbHTML += '<tr>'
                    timeHeadTbHTML += '<th></th>'
                    timeHeadTbHTML += '<th>'+useMonthYear+'</th>'
    
                    flagThFirst = true;
                }
                else{
                    timeHeadTbHTML += '<th>'+useMonthYear+'</th>'
                }

            }
        }
        timeHeadTbHTML += '</tr>'

        for (const [idx, ele] of Object.entries(data.data)) {
            var milesWords = (ele.milestone) ? ele.milestone : 'N/A';
            var milesVal = '';

            if(ele.milestone == "LAP Submission" || ele.milestone == "Funds Available"){
                milesVal = ele.milestone;
            }else{
                milesVal = '';
            }

            if(milesWords){
                if(!flagMilestonesFirst){
                    timeBodyTbHTML += '<tr>'
                    timeBodyTbHTML += '<th>KEY LAND MILESTONES</th>'

                    flagMilestonesFirst = true;
                }
                
                timeBodyTbHTML += '<td onclick="openConOpDashboardLandTimeData(\''+idConop+'\')">'+milesVal+'</td>'
            }
        }
        timeBodyTbHTML += '</tr>'

        timeBodyTbHTML += '<tr>'
        timeBodyTbHTML += '<th>Land Acquisition Stage 1 (AIWI) - 88KM</th>'

        for (const [idx, ele] of Object.entries(data.data)) {
            var eventWords = (ele.event) ? ele.event : 'N/A';
            var eventPercent = (ele.partial_delivery) ? ele.partial_delivery + '%' : '';

            if(ele.milestone == "Land Acquisition Stage 1 (AIWI) - 88KM"){
                if(eventWords){
                    if(!flagEventFirst){
                        flagEventFirst = true;
                    }
                    timeBodyTbHTML += '<td onclick="openConOpDashboardLandTimeData(\''+idConop+'\')">'+ele.event+'</td>'
                }
            }else{
                timeBodyTbHTML += '<td></td>'
            }
        }

        timeBodyTbHTML += '</tr>'

        timeBodyTbHTML += '<tr>'
        timeBodyTbHTML += '<th>Land Acquisition Stage 2 (FOE) - 88KM</th>'

        for (const [idx, ele] of Object.entries(data.data)) {
            var eventWords = (ele.event) ? ele.event : 'N/A';
            var eventPercent = (ele.partial_delivery) ? ele.partial_delivery + '%' : '';

            if(ele.milestone == "LAP Submission" || ele.milestone == "Funds Available" || ele.milestone == "Land Acquisition Stage 1 (AIWI) - 88KM"){
                timeBodyTbHTML += '<td></td>'
            }else{
                if(eventWords){
                    if(!flagEventSecond){
                        flagEventSecond = true;
                    }
                    timeBodyTbHTML += '<td onclick="openConOpDashboardLandTimeData(\''+idConop+'\')">'+ele.event+'</td>'
                }
            }
        }
        timeBodyTbHTML += '</tr>'

    }

    $("#timelineHead").html(timeHeadTbHTML);
    $("#timelineBody").html(timeBodyTbHTML);
}

function drawAiwiChart(data, allData, monthYear, month){
    var catArr = [];
    var dataArr = [];
    var valueAdd = 0;

    if(data){
        for (const [idx, ele] of Object.entries(data)) {
            if(idx == '') continue;
            valueAdd =  valueAdd + parseInt(ele);

            var tempArr = {name: idx, y: (ele) ? parseInt(ele) : 0, allData: (allData) ? allData : [], upColor: dataColorArr[0]};
            dataArr.push(tempArr);
        }

        if(valueAdd == 100){
            catArr.push('Balance');
            var tempArr = {name: 'Balance', y: - 100, color: dataColorArr[6]};
            dataArr.push(tempArr);
        }else{
            catArr.push('Balance');
            var tempArr = {name: 'Balance', y: valueAdd - 100, color: dataColorArr[6]};
            dataArr.push(tempArr);
        }

        catArr.push('Target');
        var tempArr = {name: 'Target', y: 100, color: dataColorArr[2]};
        dataArr.push(tempArr);


    }

    var chart = Highcharts.chart('aiwiChart', {
        chart: {
            type: 'waterfall',
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Land Management<br>'+localStorage.p_name+'<br>AIWI STATUS STAGE 1 ('+monthYear+')</span>'
                          }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">Land Management<br>'+localStorage.p_name+'<br>AIWI ('+monthYear+')</span>'
                          },
                        })
                        chart.updateFlag = true;
                      }
                  }
        
                }
            }
        },
        credits: false,
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Land Management<br>'+localStorage.p_name+'<br>AIWI ('+monthYear+')</span>'
        },
        xAxis: {
            type: 'category',
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: '<b>{point.y:,.1f}%</b>'
        },
        series: [{
            label: {
                enabled: false
            },
            data: dataArr,
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return this.y + '%';
                },
                style: {
                    fontWeight: 'bold'
                }
            },
            pointPadding: 0,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var monthEachChart = event.point.category;
                    if(monthEachChart == 'Balance' || monthEachChart == 'Target') return

                    var monthPass = (monthEachChart) ? monthEachChart : '';
                    var yearPass;
                    
                    if (localStorage.ui_pref == 'ri_v3'){
                        yearPass = window.parent.$('.mainPage.myDashboard').find('.yrFilter').val();
                    }else{
                        yearPass = $('#yearFilter').val();
                    }

                    if(yearPass == 'all'){
                        var currDate = new Date();
                        currYear = currDate.getFullYear();
                        yearPass = currYear;
                    }

                    var linkParamArr = [yearPass, monthPass];

                    var postParam = {function:"openConOpDashboard",processType:"LAND", conOpTabId:"conopTab18", linkName:"construct_dash_conop_land_managementAiwiFoe", linkParam:linkParamArr, linkWinTitle: 'Land Management'};
                    if(localStorage.ui_pref == 'ri_v3'){
                        window.parent.widgetConopOpen("LAND", "construct_dash_conop_land_managementAiwiFoe", linkParamArr, "Land Management - " + event.point.category);
                    }else{
                        parent.postMessage(postParam ,"*");
                    }
                }
            }
        }]
    });
    chart.updateFlag = true;

    if(valueAdd == 100){
        var negativeBar = $('#aiwiChart').find('.highcharts-series.highcharts-waterfall-series').children().eq(useMonth)
        negativeBar.css('opacity', '0')

        var negativeText = $('#aiwiChart').find('.highcharts-data-labels.highcharts-waterfall-series').children().eq(useMonth)
        negativeText.css('opacity', '0')
    }
}

function drawFoeChart(data, allData, monthYear, month){
    var catArr = [];
    var dataArr = [];
    var valueAdd = 0;

    if(data){
        for (const [idx, ele] of Object.entries(data)) {
            if(idx == '' || idx == 'M0') continue;
            catArr.push(idx);
            valueAdd =  valueAdd + parseInt(ele);

            var tempArr = {name: idx, y: (ele) ? parseInt(ele) : 0, allData: (allData) ? allData : [], upColor: dataColorArr[0]};
            dataArr.push(tempArr);
        }

        catArr.push('Balance');

        if(valueAdd == 100){
            var tempArr = {name: 'Balance', y: - 100, color: dataColorArr[6]};
            dataArr.push(tempArr);
        }else{
            var tempArr = {name: 'Balance', y: valueAdd - 100, color: dataColorArr[6]};
            dataArr.push(tempArr);
        }

        catArr.push('Target');
        var tempArr = {name: 'Target', y: 100, color: dataColorArr[2]};
        dataArr.push(tempArr);
    }

    var chart = Highcharts.chart('foeChart', {
        chart: {
            type: 'waterfall',
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Land Management<br>'+localStorage.p_name+'<br>FOE STATUS STAGE 2 ('+monthYear+')</span>'
                          }
                        })
            
                        chart.updateFlag = true;
                      }
                      else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                          title: {
                            text: '<span class="showLabel">Land Management<br>'+localStorage.p_name+'<br>FOE ('+monthYear+')</span>'
                          },
                        })
                        chart.updateFlag = true;
                      }
                  }
        
                }
            }
        },
        credits: false,
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Land Management<br>'+localStorage.p_name+'<br>FOE ('+monthYear+')</span>'
        },
        xAxis: {
            type: 'category',
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: '<b>{point.y:,.1f}%</b>'
        },
        series: [{
            label: {
                enabled: false
            },
            data: dataArr,
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return this.y + '%';
                },
                style: {
                    fontWeight: 'bold'
                }
            },
            pointPadding: 0,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    var monthEachChart = event.point.category;
                    if(monthEachChart == 'Balance' || monthEachChart == 'Target') return

                    var monthPass = (monthEachChart) ? monthEachChart : '';
                    var yearPass;

                    if (localStorage.ui_pref == 'ri_v3'){
                        yearPass = window.parent.$('.mainPage.myDashboard').find('.yrFilter').val();
                    }else{
                        yearPass = $('#yearFilter').val();
                    }

                    if(yearPass == 'all'){
                        var currDate = new Date();
                        currYear = currDate.getFullYear();
                        yearPass = currYear;
                    }
                    
                    var linkParamArr = [yearPass, monthPass];

                    var postParam = {function:"openConOpDashboard",processType:"LAND", conOpTabId:"conopTab18", linkName:"construct_dash_conop_land_managementAiwiFoe", linkParam:linkParamArr, linkWinTitle: 'Land Management'};
                    if(localStorage.ui_pref == 'ri_v3'){
                        window.parent.widgetConopOpen("LAND", "construct_dash_conop_land_managementAiwiFoe", linkParamArr, "Land Management - " + event.point.category);
                    }else{
                        parent.postMessage(postParam ,"*");
                    }
                }
            }
        }]
    });
    chart.updateFlag = true;

    if(valueAdd == 100){
        var negativeBar = $('#foeChart').find('.highcharts-series.highcharts-waterfall-series').children().eq(useMonth)
        negativeBar.css('opacity', '0')

        var negativeText = $('#foeChart').find('.highcharts-data-labels.highcharts-waterfall-series').children().eq(useMonth)
        negativeText.css('opacity', '0')
    }
}

function updateTableLMRSection(currData, prevData, ttlCurrData, ttlPrevData, allData, allDataPrev){
    var tempArr = [];
    var arrayForTable = [];
    let lmrSectionTbHTML = '';
    let lmrFootTbHTML = '';
    let accumulativeIssueTbHTML = '';

    $("#lmrSectionTable").html("");
    $("#lmrFootTable").html("");

    var year = (allData && allData.year) ? allData.year : '';
    var month = (allData && allData.month) ? allData.month : '';

    var yearPrev = (allDataPrev && allDataPrev.year) ? allDataPrev.year : '';
    var monthPrev = (allDataPrev && allDataPrev.month) ? allDataPrev.month : '';

    // total km-run % for current
    var ttlUnresolvedPercentCurr = 0;
    var ttlNewKMPercentCurr = 0;
    var ttlSolvedKMPercentCurr = 0;
    var ttlBalKMPercentCurr = 0;

    // total km-run % for previous
    var ttlUnresolvedPercentPrev = 0;
    var ttlNewKMPercentPrev = 0;
    var ttlSolvedKMPercentPrev = 0;
    var ttlBalKMPercentPrev = 0;

    var unresolvedKMPercent = 0;
    var newKMPercent = 0;
    var solvedKMPercent = 0;
    var balKMPercent = 0;

    var unresolvedVar = 0;
    var newVar = 0;
    var solvedVar = 0;
    var balVar = 0;

    var ttlUnresolvedVar = 0;
    var ttlNewVar = 0;
    var ttlSolvedVar = 0;
    var ttlBalVar = 0;

    // previous data
    var totalUnresolvedIssuesPrev = (ttlPrevData.ttlCFIssue) ? ttlPrevData.ttlCFIssue : 0;
    var totalNewIssuePrev = (ttlPrevData.ttlNewIssue) ? ttlPrevData.ttlNewIssue : 0;
    var totalSolvedIssuePrev = (ttlPrevData.ttlSolvedIssue) ? ttlPrevData.ttlSolvedIssue : 0;
    var totalBalIssuePrev = (ttlPrevData.ttlBalIssue) ? ttlPrevData.ttlBalIssue : 0;
    var totalUnresolvedKMPrev = (ttlPrevData.ttlCFKM) ? ttlPrevData.ttlCFKM : 0;
    var totalNewKMPrev = (ttlPrevData.ttlNewKM) ? ttlPrevData.ttlNewKM : 0;
    var totalSolvedKMPrev = (ttlPrevData.ttlSolvedKM) ? ttlPrevData.ttlSolvedKM : 0;
    var totalBalKMPrev = (ttlPrevData.ttlBalKM) ? ttlPrevData.ttlBalKM : 0;

    // previous accumulative total data
    var totalAccumulCFIssuePrev = (ttlPrevData.ttlAccCFIssue) ? ttlPrevData.ttlAccCFIssue : 0;
    var totalAccumulCFkmPrev = (ttlPrevData.ttlAccCFkm) ? ttlPrevData.ttlAccCFkm : 0;
    var totalAccCTDIssuePrev = (ttlPrevData.ttlAccCTDIssue) ? ttlPrevData.ttlAccCTDIssue : 0;
    var totalAccCTDkmPrev = (ttlPrevData.ttlAccCTDkm) ? ttlPrevData.ttlAccCTDkm : 0;

    // current data
    var totalUnresolvedIssuesCurr = (ttlCurrData.ttlCFIssue) ? ttlCurrData.ttlCFIssue : 0;
    var totalNewIssueCurr = (ttlCurrData.ttlNewIssue) ? ttlCurrData.ttlNewIssue : 0;
    var totalSolvedIssueCurr = (ttlCurrData.ttlSolvedIssue) ? ttlCurrData.ttlSolvedIssue : 0;
    var totalBalIssueCurr = (ttlCurrData.ttlBalIssue) ? ttlCurrData.ttlBalIssue : 0;
    var totalUnresolvedKMCurr = (ttlCurrData.ttlCFKM) ? ttlCurrData.ttlCFKM : 0;
    var totalNewKMCurr = (ttlCurrData.ttlNewKM) ? ttlCurrData.ttlNewKM : 0;
    var totalSolvedKMCurr = (ttlCurrData.ttlSolvedKM) ? ttlCurrData.ttlSolvedKM : 0;
    var totalBalKMCurr = (ttlCurrData.ttlBalKM) ? ttlCurrData.ttlBalKM : 0;

    var totalCFPercentPrev = 0;
    var totalNewIssuePercentPrev = 0;
    var totalSolvedPercentPrev = 0;
    var totalBalPercentPrev = 0;

    var totalCFPercentCurr = 0;
    var totalNewIssuePercentCurr = 0;
    var totalSolvedPercentCurr = 0;
    var totalBalPercentCurr = 0;

    // current accumulative total data
    var totalAccumulCFIssueCurr = (ttlCurrData.ttlAccCFIssue) ? ttlCurrData.ttlAccCFIssue : 0;
    var totalAccumulCFkmCurr = (ttlCurrData.ttlAccCFkm) ? ttlCurrData.ttlAccCFkm : 0;
    var totalAccCTDIssueCurr = (ttlCurrData.ttlAccCTDIssue) ? ttlCurrData.ttlAccCTDIssue : 0;
    var totalAccCTDkmCurr = (ttlCurrData.ttlAccCTDkm) ? ttlCurrData.ttlAccCTDkm : 0;

    if(currData){
        for (const [idx, ele] of Object.entries(currData)) {
            if (!tempArr[idx]) tempArr[idx] = [];
            if (!tempArr[idx]['current']) tempArr[idx]['current'] = [];
            tempArr[idx]['current'].push(ele);
        }
    }

    if(prevData){
        for (const [idx, ele] of Object.entries(prevData)) {
            if (!tempArr[idx]) tempArr[idx] = [];
            if (!tempArr[idx]['previous']) tempArr[idx]['previous'] = [];
            tempArr[idx]['previous'].push(ele);
        }
    }

    for (const [idx, ele] of Object.entries(tempArr)) {
        for (const [idx2, ele2] of Object.entries(ele)) {
            //idx2 = current / previous
            if(idx2 == 'current'){
                for (const [idx3, ele3] of Object.entries(ele2)) {
                    if (!arrayForTable[idx]) arrayForTable[idx] = [];

                    // for # of issues
                    if (!arrayForTable[idx]['unresolvedIssue']) arrayForTable[idx]['unresolvedIssue'] = [];
                    if (!arrayForTable[idx]['unresolvedIssue']['current']) arrayForTable[idx]['unresolvedIssue']['current'] = [];

                    var unresolvedIssue = (ele3.unresolved_issues) ? ele3.unresolved_issues : 0;
                    var unresolvedIssueKM = (ele3.unresolved_issues_km) ? ele3.unresolved_issues_km : 0;
                    unresolvedKMPercent = (unresolvedIssueKM / totalUnresolvedKMCurr) * 100;

                    arrayForTable[idx]['unresolvedIssue']['current'].push(unresolvedIssue,unresolvedIssueKM,unresolvedKMPercent);

                    if (!arrayForTable[idx]['newIssue']) arrayForTable[idx]['newIssue'] = [];
                    if (!arrayForTable[idx]['newIssue']['current']) arrayForTable[idx]['newIssue']['current'] = [];

                    var newIssue = (ele3.new_issues) ? ele3.new_issues : 0;
                    var newIssueKM = (ele3.new_issues_km) ? ele3.new_issues_km : 0;
                    newKMPercent = (newIssueKM / totalNewKMCurr) * 100;

                    arrayForTable[idx]['newIssue']['current'].push(newIssue,newIssueKM,newKMPercent);

                    if (!arrayForTable[idx]['solvedIssue']) arrayForTable[idx]['solvedIssue'] = [];
                    if (!arrayForTable[idx]['solvedIssue']['current']) arrayForTable[idx]['solvedIssue']['current'] = [];

                    var solvedIssue = (ele3.solved_issues) ? ele3.solved_issues : 0;
                    var solvedIssueKM = (ele3.solved_issues_km) ? ele3.solved_issues_km : 0;
                    solvedKMPercent = (solvedIssueKM / totalSolvedKMCurr) * 100;

                    arrayForTable[idx]['solvedIssue']['current'].push(solvedIssue,solvedIssueKM,solvedKMPercent);

                    if (!arrayForTable[idx]['balUnresolvedIssue']) arrayForTable[idx]['balUnresolvedIssue'] = [];
                    if (!arrayForTable[idx]['balUnresolvedIssue']['current']) arrayForTable[idx]['balUnresolvedIssue']['current'] = [];

                    var balUnresolvedIssue = (ele3.bal_unresolved_issues) ? ele3.bal_unresolved_issues : 0;
                    var balUnresolvedIssueKM = (ele3.bal_unresolved_issues_km) ? ele3.bal_unresolved_issues_km : 0;
                    balKMPercent = (balUnresolvedIssueKM / totalBalKMCurr) * 100;

                    arrayForTable[idx]['balUnresolvedIssue']['current'].push(balUnresolvedIssue,balUnresolvedIssueKM,balKMPercent);

                }

                // total for current percent km-run
                ttlUnresolvedPercentCurr = unresolvedKMPercent++;
                ttlNewKMPercentCurr = newKMPercent++;
                ttlSolvedKMPercentCurr = solvedKMPercent++;
                ttlBalKMPercentCurr = balKMPercent++;
            }

            else if(idx2 == 'previous'){
                for (const [idx4, ele4] of Object.entries(ele2)) {
                    if (!arrayForTable[idx]) arrayForTable[idx] = [];

                    // for # of issues
                    if (!arrayForTable[idx]['unresolvedIssue']) arrayForTable[idx]['unresolvedIssue'] = [];
                    if (!arrayForTable[idx]['unresolvedIssue']['previous']) arrayForTable[idx]['unresolvedIssue']['previous'] = [];
                    
                    var unresolvedIssue = (ele4.unresolved_issues) ? ele4.unresolved_issues : 0;
                    var unresolvedIssueKM = (ele4.unresolved_issues_km) ? ele4.unresolved_issues_km : 0;
                    var unresolvedKMPercent = (unresolvedIssueKM / totalUnresolvedKMPrev) * 100;

                    arrayForTable[idx]['unresolvedIssue']['previous'].push(unresolvedIssue,unresolvedIssueKM,unresolvedKMPercent);

                    if (!arrayForTable[idx]['newIssue']) arrayForTable[idx]['newIssue'] = [];
                    if (!arrayForTable[idx]['newIssue']['previous']) arrayForTable[idx]['newIssue']['previous'] = [];

                    var newIssue = (ele4.new_issues) ? ele4.new_issues : 0;
                    var newIssueKM = (ele4.new_issues_km) ? ele4.new_issues_km : 0;
                    var newKMPercent = (newIssueKM / totalNewKMPrev) * 100;

                    arrayForTable[idx]['newIssue']['previous'].push(newIssue,newIssueKM,newKMPercent);

                    if (!arrayForTable[idx]['solvedIssue']) arrayForTable[idx]['solvedIssue'] = [];
                    if (!arrayForTable[idx]['solvedIssue']['previous']) arrayForTable[idx]['solvedIssue']['previous'] = [];

                    var solvedIssue = (ele4.solved_issues) ? ele4.solved_issues : 0;
                    var solvedIssueKM = (ele4.solved_issues_km) ? ele4.solved_issues_km : 0;
                    var solvedKMPercent = (solvedIssueKM / totalSolvedKMPrev) * 100;

                    arrayForTable[idx]['solvedIssue']['previous'].push(solvedIssue,solvedIssueKM,solvedKMPercent);

                    if (!arrayForTable[idx]['balUnresolvedIssue']) arrayForTable[idx]['balUnresolvedIssue'] = [];
                    if (!arrayForTable[idx]['balUnresolvedIssue']['previous']) arrayForTable[idx]['balUnresolvedIssue']['previous'] = [];

                    var balUnresolvedIssue = (ele4.bal_unresolved_issues) ? ele4.bal_unresolved_issues : 0;
                    var balUnresolvedIssueKM = (ele4.bal_unresolved_issues_km) ? ele4.bal_unresolved_issues_km : 0;
                    var balKMPercent = (balUnresolvedIssueKM / totalBalKMPrev) * 100;

                    arrayForTable[idx]['balUnresolvedIssue']['previous'].push(balUnresolvedIssue,balUnresolvedIssueKM,balKMPercent);
                }

                // total for previous percent km-run
                ttlUnresolvedPercentPrev = unresolvedKMPercent++;
                ttlNewKMPercentPrev = newKMPercent++;
                ttlSolvedKMPercentPrev = solvedKMPercent++;
                ttlBalKMPercentPrev = balKMPercent++;
            }
        }
    }

    //LAST LOOP FOR TABLE
    for (const [idx, ele] of Object.entries(arrayForTable)) {
        for (const [idx2, ele2] of Object.entries(ele)) {
            var classUsed = '';

            if(idx2 == 'unresolvedIssue'){
                var prevIssueNo = (ele2['previous'] && ele2['previous'][0]) ? ele2['previous'][0] : 0;
                var prevIssueKM = (ele2['previous'] && ele2['previous'][1]) ? ele2['previous'][1] : 0;
                var prevKMPercent = (ele2['previous'] && ele2['previous'][2]) ? ele2['previous'][2] : 0;
                var currIssueNo = (ele2['current'] && ele2['current'][0]) ? ele2['current'][0] : 0;
                var currIssueKM = (ele2['current'] && ele2['current'][1]) ? ele2['current'][1] : 0;
                var currKMPercent = (ele2['current'] && ele2['current'][2]) ? ele2['current'][2] : 0;

                unresolvedVar = currIssueNo - prevIssueNo;
                totalCFPercentPrev = totalCFPercentPrev + prevKMPercent;
                totalCFPercentCurr = totalCFPercentCurr + currKMPercent;

                if(unresolvedVar == 0){
                    classUsed = 'fa-hyphen';
                }
                else if(unresolvedVar > 0){
                    classUsed = 'fa-caret-up';
                }
                else if(unresolvedVar < 0){
                    classUsed = 'fa-caret-down';
                }

                lmrSectionTbHTML += '<tr>'
                lmrSectionTbHTML += '<th rowspan="4">'+idx+'</td>'
                lmrSectionTbHTML += '<td>C/F Unresolved Issue</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+prevIssueNo+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+prevIssueKM+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+prevKMPercent.toFixed(2)+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+currIssueNo+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+currIssueKM+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+currKMPercent.toFixed(2)+'</td>'
                lmrSectionTbHTML += '<td style = "text-align: right;"><i class="fa-solid '+classUsed+'"></i>'+unresolvedVar+'</td>'
                lmrSectionTbHTML += '</tr>';
            }

            if(idx2 == 'newIssue'){
                var prevNewIssue = (ele2['previous'] && ele2['previous'][0]) ? ele2['previous'][0] : 0;
                var prevNewIssueKM = (ele2['previous'] && ele2['previous'][1]) ? ele2['previous'][1] : 0;
                var prevNewIssuePercent = (ele2['previous'] && ele2['previous'][2]) ? ele2['previous'][2] : 0;
                var currNewIssue = (ele2['current'] && ele2['current'][0]) ? ele2['current'][0] : 0;
                var currNewIssueKM = (ele2['current'] && ele2['current'][1]) ? ele2['current'][1] : 0;
                var currNewIssuePercent = (ele2['current'] && ele2['current'][2]) ? ele2['current'][2] : 0;

                newVar = currNewIssue - prevNewIssue;
                totalNewIssuePercentPrev = totalNewIssuePercentPrev + prevNewIssuePercent;
                totalNewIssuePercentCurr = totalNewIssuePercentCurr + currNewIssuePercent;

                if(newVar == 0){
                    classUsed = 'fa-hyphen';
                }
                else if(newVar > 0){
                    classUsed = 'fa-caret-up';
                }
                else if(newVar < 0){
                    classUsed = 'fa-caret-down';
                }
                
                lmrSectionTbHTML += '<tr>'
                lmrSectionTbHTML += '<td>NEW Issue</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+prevNewIssue+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+prevNewIssueKM+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+prevNewIssuePercent.toFixed(2)+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+currNewIssue+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+currNewIssueKM+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+currNewIssuePercent.toFixed(2)+'</td>'
                lmrSectionTbHTML += '<td style = "text-align: right;"><i class="fa-solid '+classUsed+'"></i>'+newVar+'</td>'
                lmrSectionTbHTML += '</tr>';
            }

            if(idx2 == 'solvedIssue'){
                var prevSolvedIssue = (ele2['previous'] && ele2['previous'][0]) ? ele2['previous'][0] : 0;
                var prevSolvedIssueKM = (ele2['previous'] && ele2['previous'][1]) ? ele2['previous'][1] : 0;
                var prevSolvedPercent = (ele2['previous'] && ele2['previous'][2]) ? ele2['previous'][2] : 0;
                var currSolvedIssue = (ele2['current'] && ele2['current'][0]) ? ele2['current'][0] : 0;
                var currSolvedIssueKM = (ele2['current'] && ele2['current'][1]) ? ele2['current'][1] : 0;
                var currSolvedPercent = (ele2['current'] && ele2['current'][2]) ? ele2['current'][2] : 0;

                solvedVar = currSolvedIssue - prevSolvedIssue;
                totalSolvedPercentPrev = totalSolvedPercentPrev + prevSolvedPercent;
                totalSolvedPercentCurr = totalSolvedPercentCurr + currSolvedPercent;

                if(solvedVar == 0){
                    classUsed = 'fa-hyphen';
                }
                else if(solvedVar > 0){
                    classUsed = 'fa-caret-up';
                }
                else if(solvedVar < 0){
                    classUsed = 'fa-caret-down';
                }

                lmrSectionTbHTML += '<tr>'
                lmrSectionTbHTML += '<td>Solved Issue</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+prevSolvedIssue+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+prevSolvedIssueKM+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+prevSolvedPercent.toFixed(2)+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+currSolvedIssue+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+currSolvedIssueKM+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+currSolvedPercent.toFixed(2)+'</td>'
                lmrSectionTbHTML += '<td style = "text-align: right;"><i class="fa-solid '+classUsed+'"></i>'+solvedVar+'</td>'
                lmrSectionTbHTML += '</tr>';
            }

            if(idx2 == 'balUnresolvedIssue'){
                var prevBalUnresolvedIssue = (ele2['previous'] && ele2['previous'][0]) ? ele2['previous'][0] : 0;
                var prevBalUnresolvedIssueKM = (ele2['previous'] && ele2['previous'][1]) ? ele2['previous'][1] : 0;
                var prevBalPercent = (ele2['previous'] && ele2['previous'][2]) ? ele2['previous'][2] : 0;
                var currBalUnresolvedIssue = (ele2['current'] && ele2['current'][0]) ? ele2['current'][0] : 0;
                var currBalUnresolvedIssueKM = (ele2['current'] && ele2['current'][1]) ? ele2['current'][1] : 0;
                var currBalPercent = (ele2['current'] && ele2['current'][2]) ? ele2['current'][2] : 0;

                balVar = currBalUnresolvedIssue - prevBalUnresolvedIssue;
                totalBalPercentPrev = totalBalPercentPrev + prevBalPercent;
                totalBalPercentCurr = totalBalPercentCurr + currBalPercent;

                if(balVar == 0){
                    classUsed = 'fa-hyphen';
                }
                else if(balVar > 0){
                    classUsed = 'fa-caret-up';
                }
                else if(balVar < 0){
                    classUsed = 'fa-caret-down';
                }

                lmrSectionTbHTML += '<tr>'
                lmrSectionTbHTML += '<td><b>Balance Unresolved Issue</b></td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+prevBalUnresolvedIssue+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+prevBalUnresolvedIssueKM+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+prevBalPercent.toFixed(2)+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+currBalUnresolvedIssue+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+currBalUnresolvedIssueKM+'</td>'
                lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+currBalPercent.toFixed(2)+'</td>'
                lmrSectionTbHTML += '<td style = "text-align: right;"><i class="fa-solid '+classUsed+'"></i>'+balVar+'</td>'
                lmrSectionTbHTML += '</tr>';
            }
        }

        ttlUnresolvedVar = unresolvedVar++;
        var classUnresolved = '';

        if(ttlUnresolvedVar == 0){
            classUnresolved = 'fa-hyphen';
        }
        else if(ttlUnresolvedVar > 0){
            classUnresolved = 'fa-caret-up';
        }
        else if(ttlUnresolvedVar < 0){
            classUnresolved = 'fa-caret-down';
        }

        ttlNewVar = newVar++;
        var classNew = '';

        if(ttlNewVar == 0){
            classNew = 'fa-hyphen';
        }
        else if(ttlNewVar > 0){
            classNew = 'fa-caret-up';
        }
        else if(ttlNewVar < 0){
            classNew = 'fa-caret-down';
        }

        ttlSolvedVar = solvedVar++;
        var classSolved = '';

        if(ttlSolvedVar == 0){
            classSolved = 'fa-hyphen';
        }
        else if(ttlSolvedVar > 0){
            classSolved = 'fa-caret-up';
        }
        else if(ttlSolvedVar < 0){
            classSolved = 'fa-caret-down';
        }

        ttlBalVar = balVar++;
        var classBal = '';

        if(ttlBalVar == 0){
            classBal = 'fa-hyphen';
        }
        else if(ttlBalVar > 0){
            classBal = 'fa-caret-up';
        }
        else if(ttlBalVar < 0){
            classBal = 'fa-caret-down';
        }
    }

    $("#lmrSectionTable").html(lmrSectionTbHTML);

    totalCFPercentPrev = (totalCFPercentPrev) ? totalCFPercentPrev.toFixed(2) : '0.00';
    totalCFPercentCurr = (totalCFPercentCurr) ? totalCFPercentCurr.toFixed(2) : '0.00';
    totalNewIssuePercentPrev = (totalNewIssuePercentPrev) ? totalNewIssuePercentPrev.toFixed(2) : '0.00';
    totalNewIssuePercentCurr = (totalNewIssuePercentCurr) ? totalNewIssuePercentCurr.toFixed(2) : '0.00';
    totalSolvedPercentPrev = (totalSolvedPercentPrev) ? totalSolvedPercentPrev.toFixed(2) : '0.00';
    totalSolvedPercentCurr = (totalSolvedPercentCurr) ? totalSolvedPercentCurr.toFixed(2) : '0.00';
    totalBalPercentPrev = (totalBalPercentPrev) ? totalBalPercentPrev.toFixed(2) : '0.00';
    totalBalPercentCurr = (totalBalPercentCurr) ? totalBalPercentCurr.toFixed(2) : '0.00';

    //FOR FOOTER
    lmrFootTbHTML += '<tr>'
    lmrFootTbHTML += '<th rowspan="5">TOTAL</th>'
    lmrFootTbHTML += '</tr>'

    lmrFootTbHTML += '<tr>'
    lmrFootTbHTML += '<th>C/F Unresolved Issues</th>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalUnresolvedIssuesPrev+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalUnresolvedKMPrev+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalCFPercentPrev+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalUnresolvedIssuesCurr+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalUnresolvedKMCurr+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalCFPercentCurr+'</td>'
    lmrFootTbHTML += '<td style = "text-align: right;"><i class="fa-solid '+classUnresolved+'"></i>'+ttlUnresolvedVar+'</td>'
    lmrFootTbHTML += '</tr>'

    lmrFootTbHTML += '<tr>'
    lmrFootTbHTML += '<th>NEW Issues</th>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalNewIssuePrev+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalNewKMPrev+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalNewIssuePercentPrev+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalNewIssueCurr+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalNewKMCurr+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalNewIssuePercentCurr+'</td>'
    lmrFootTbHTML += '<td style = "text-align: right;"><i class="fa-solid '+classNew+'"></i>'+ttlNewVar+'</td>'
    lmrFootTbHTML += '</tr>'

    lmrFootTbHTML += '<tr>'
    lmrFootTbHTML += '<th>Solved Issues</th>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalSolvedIssuePrev+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalSolvedKMPrev+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalSolvedPercentPrev+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalSolvedIssueCurr+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalSolvedKMCurr+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalSolvedPercentCurr+'</td>'
    lmrFootTbHTML += '<td style = "text-align: right;"><i class="fa-solid '+classSolved+'"></i>'+ttlSolvedVar+'</td>'
    lmrFootTbHTML += '</tr>'

    lmrFootTbHTML += '<tr>'
    lmrFootTbHTML += '<th><b>Balance Unresolved Issues</b></th>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalBalIssuePrev+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalBalKMPrev+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalBalPercentPrev+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalBalIssueCurr+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalBalKMCurr+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalBalPercentCurr+'</td>'
    lmrFootTbHTML += '<td style = "text-align: right; border-bottom-right-radius: 5px;"><i class="fa-solid '+classBal+'"></i>'+ttlBalVar+'</td>'
    lmrFootTbHTML += '</tr>'
    
    $("#lmrFootTable").html(lmrFootTbHTML);

    var ctdCFKMpercentPrev = (totalAccumulCFkmPrev/totalAccCTDkmPrev) * 100;
    var ctdNewKMpercentPrev = (totalNewKMPrev/totalAccCTDkmPrev) * 100;
    var accumulCTDPercentPrev = ctdCFKMpercentPrev + ctdNewKMpercentPrev;

    var ctdCFKMpercentCurr = (totalAccumulCFkmCurr/totalAccCTDkmCurr) * 100;
    var ctdNewKMpercentCurr = (totalNewKMCurr/totalAccCTDkmCurr) * 100;
    var accumulCTDPercentCurr = ctdCFKMpercentCurr + ctdNewKMpercentCurr;

    var ctdVarCF = totalAccumulCFIssueCurr - totalAccumulCFIssuePrev;
    var ctdVarNewIssue = totalNewIssueCurr - totalNewIssuePrev;
    var ctdVarAccumul = totalAccCTDIssueCurr - totalAccCTDIssuePrev;

    var classCFctd = '';
    var classNewctd = '';
    var classAccumulctd = '';

    if(ctdVarCF == 0){
        classCFctd = 'fa-hyphen';
    }
    else if(ctdVarCF > 0){
        classCFctd = 'fa-caret-up';
    }
    else if(ctdVarCF < 0){
        classCFctd = 'fa-caret-down';
    }

    if(ctdVarNewIssue == 0){
        classNewctd = 'fa-hyphen';
    }
    else if(ctdVarNewIssue > 0){
        classNewctd = 'fa-caret-up';
    }
    else if(ctdVarNewIssue < 0){
        classNewctd = 'fa-caret-down';
    }

    if(ctdVarAccumul == 0){
        classAccumulctd = 'fa-hyphen';
    }
    else if(ctdVarAccumul > 0){
        classAccumulctd = 'fa-caret-up';
    }
    else if(ctdVarAccumul < 0){
        classAccumulctd = 'fa-caret-down';
    }

    accumulativeIssueTbHTML += '<tr>'
    accumulativeIssueTbHTML += '<th style="width: 50px">C/F ACCUMULATIVE</th>'
    accumulativeIssueTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalAccumulCFIssuePrev+'</td>'
    accumulativeIssueTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalAccumulCFkmPrev+'</td>'
    accumulativeIssueTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+((isNaN(ctdCFKMpercentPrev.toFixed(2))) ? '0.00' : ctdCFKMpercentPrev.toFixed(2))+'</td>'
    accumulativeIssueTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalAccumulCFIssueCurr+'</td>'
    accumulativeIssueTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalAccumulCFkmCurr+'</td>'
    accumulativeIssueTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+((isNaN(ctdCFKMpercentCurr.toFixed(2))) ? '0.00' : ctdCFKMpercentCurr.toFixed(2))+'</td>'
    accumulativeIssueTbHTML += '<td style = "text-align: right;"><i class="fa-solid '+classCFctd+'"></i>'+ctdVarCF+'</td>'
    accumulativeIssueTbHTML += '</tr>'

    accumulativeIssueTbHTML += '<tr>'
    accumulativeIssueTbHTML += '<th>NEW ISSUES</th>'
    accumulativeIssueTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalNewIssuePrev+'</td>'
    accumulativeIssueTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalNewKMPrev+'</td>'
    accumulativeIssueTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+((isNaN(ctdNewKMpercentPrev.toFixed(2))) ? '0.00' : ctdNewKMpercentPrev.toFixed(2))+'</td>'
    accumulativeIssueTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalNewIssueCurr+'</td>'
    accumulativeIssueTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalNewKMCurr+'</td>'
    accumulativeIssueTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+((isNaN(ctdNewKMpercentCurr.toFixed(2))) ? '0.00' : ctdNewKMpercentCurr.toFixed(2))+'</td>'
    accumulativeIssueTbHTML += '<td style = "text-align: right;"><i class="fa-solid '+classNewctd+'"></i>'+ctdVarNewIssue+'</td>'
    accumulativeIssueTbHTML += '</tr>'

    accumulativeIssueTbHTML += '<tr>'
    accumulativeIssueTbHTML += '<th style="border-bottom-left-radius: 5px;">ACCUMULATIVE CTD</th>'
    accumulativeIssueTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalAccCTDIssuePrev+'</td>'
    accumulativeIssueTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalAccCTDkmPrev+'</td>'
    accumulativeIssueTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+((isNaN(accumulCTDPercentPrev.toFixed(2))) ? '0.00' : accumulCTDPercentPrev.toFixed(2))+'</td>'
    accumulativeIssueTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalAccCTDIssueCurr+'</td>'
    accumulativeIssueTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalAccCTDkmCurr+'</td>'
    accumulativeIssueTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+((isNaN(accumulCTDPercentCurr.toFixed(2))) ? '0.00' : accumulCTDPercentCurr.toFixed(2))+'</td>'
    accumulativeIssueTbHTML += '<td style = "text-align: right; border-bottom-right-radius: 5px;"><i class="fa-solid '+classAccumulctd+'"></i>'+ctdVarAccumul+'</td>'
    accumulativeIssueTbHTML += '</tr>';

    $("#accumulativeIssueTable").html(accumulativeIssueTbHTML);
}

function updateTableLMRType(currData, prevData, ttlCurrData, ttlPrevData, allData, allDataPrev, ctdData){

    var tempArr = [];
    var arrayForTable = [];

    let lmrSectionTbHTML = '';
    let lmrFootTbHTML = '';

    var ttlIssuePrev = 0;
    var ttlIssueCurr = 0;

    var ttlPercentPrev = 0;
    var ttlPercentCurr = 0;

    var ttlLengthPrev = 0;
    var ttlLengthCurr = 0;

    $("#lmrTypeTable").html("");
    $("#lmrTypeFootTable").html("");

    var year = (allData && allData.year) ? allData.year : '';
    var month = (allData && allData.month) ? allData.month : '';

    var yearPrev = (allDataPrev && allDataPrev.year) ? allDataPrev.year : '';
    var monthPrev = (allDataPrev && allDataPrev.month) ? allDataPrev.month : '';

    var issueBlockade = 0;
    var lengthBlockade = 0;
    var issueCourt = 0;
    var lengthCourt = 0;
    var issueDesign = 0;
    var lengthDesign = 0;
    var issueOthers = 0;
    var lengthOthers = 0;

    if(ctdData){
        for (const [idx, ele] of Object.entries(ctdData)) {
            if(idx == '') continue;

            if(idx == 'Blockade'){
                issueBlockade = (ele.ctd_issue) ? parseInt (ele.ctd_issue) : 0;
                lengthBlockade = (ele.ctd_length) ? parseFloat (ele.ctd_length) : 0;
            }else if(idx == 'Court Case'){
                issueCourt = (ele.ctd_issue) ? parseInt (ele.ctd_issue) : 0;
                lengthCourt = (ele.ctd_length) ? parseFloat (ele.ctd_length) : 0;
            }else if(idx == 'Design/Technical'){
                issueDesign = (ele.ctd_issue) ? parseInt (ele.ctd_issue) : 0;
                lengthDesign = (ele.ctd_length) ? parseFloat (ele.ctd_length) : 0;
            }else if(idx == 'Others'){
                issueOthers = (ele.ctd_issue) ? parseInt (ele.ctd_issue) : 0;
                lengthOthers = (ele.ctd_length) ? parseFloat (ele.ctd_length) : 0;
            }
        }
    }

    if(currData){
        for (const [idx, ele] of Object.entries(currData)) {
            var useIdx = idx;
            if(useIdx == 'length') useIdx = 'lengthType';

            if (!tempArr[useIdx]) tempArr[useIdx] = [];
            if (!tempArr[useIdx]['current']) tempArr[useIdx]['current'] = [];

            tempArr[useIdx]['current'].push(ele);

        }
    }

    if(prevData){
        for (const [idx, ele] of Object.entries(prevData)) {
            var useIdx = idx;
            if(useIdx == 'length') useIdx = 'lengthType';

            if (!tempArr[useIdx]) tempArr[useIdx] = [];
            if (!tempArr[useIdx]['previous']) tempArr[useIdx]['previous'] = [];

            tempArr[useIdx]['previous'].push(ele);
        }
    }

    for (const [idx, ele] of Object.entries(tempArr)) {
        for (const [idx2, ele2] of Object.entries(ele)) {
            //idx2 = current / previous
            if(idx2 == 'current'){
                for (const [idx3, ele3] of Object.entries(ele2)) {
                    if (!arrayForTable[idx]) arrayForTable[idx] = [];
                    if (!arrayForTable[idx]['current']) arrayForTable[idx]['current'] = [];

                    arrayForTable[idx]['current'].push((ele3) ? ele3 : '');
                }
            }

            else if(idx2 == 'previous'){
                for (const [idx3, ele3] of Object.entries(ele2)) {
                    if (!arrayForTable[idx]) arrayForTable[idx] = [];
                    if (!arrayForTable[idx]['previous']) arrayForTable[idx]['previous'] = [];

                    arrayForTable[idx]['previous'].push((ele3) ? ele3 : '');
                }
            }
        }
    }

    var classUsedIssue = '';
    var classUsedPercent = '';
    var classUsedLength = '';

    var currIssue = 0;
    var currPercentage = 0;
    var currLength = 0;
    var prevIssue = 0;
    var prevPercentage = 0;
    var prevLength = 0;
    var ttlAccumulIssue = 0;
    var ttlAccumulLength = 0;
    var accumulIssueTtl = 0;
    var accumulLengthTtl = 0;

    //LAST LOOP FOR TABLE
    for (const [idx, ele] of Object.entries(arrayForTable)) {
        for (const [idx2, ele2] of Object.entries(ele)) {
            for (const [idx3, ele3] of Object.entries(ele2)) {
                if(idx2 == 'current'){
                    currIssue = (ele3.no_of_issue) ? parseInt (ele3.no_of_issue) : 0;
                    currPercentage = (ele3.percentage) ? parseInt (ele3.percentage) : 0;
                    currLength = (ele3.length) ? parseInt (ele3.length) : 0;
                }
                
                if(idx2 == 'previous'){
                    prevIssue = (ele3.no_of_issue) ? parseInt (ele3.no_of_issue) : 0;
                    prevPercentage = (ele3.percentage) ? parseInt (ele3.percentage) : 0;
                    prevLength = (ele3.length) ? parseInt (ele3.length) : 0;
                }

                var varIssue = currIssue - prevIssue;
                var varPercentage = currPercentage - prevPercentage;
                var varLength = currLength - prevLength;

                if(idx == 'Blockade'){
                    ttlAccumulIssue = currIssue + parseInt(issueBlockade);
                    ttlAccumulLength = currLength + parseFloat(lengthBlockade);
                }else if(idx == 'Court Case'){
                    ttlAccumulIssue = currIssue + parseInt(issueCourt);
                    ttlAccumulLength = currLength + parseFloat(lengthCourt);
                }else if(idx == 'Design/Technical'){
                    ttlAccumulIssue = currIssue + parseInt(issueDesign);
                    ttlAccumulLength = currLength + parseFloat(lengthDesign);
                }else if(idx == 'Others'){
                    ttlAccumulIssue = currIssue + parseInt(issueOthers);
                    ttlAccumulLength = currLength + parseFloat(lengthOthers);
                }

                if(varIssue == 0){
                    classUsedIssue = 'fa-hyphen';
                }
                else if(varIssue > 0){
                    classUsedIssue = 'fa-caret-up';
                }
                else if(varIssue < 0){
                    classUsedIssue = 'fa-caret-down';
                }

                if(varPercentage == 0){
                    classUsedPercent = 'fa-hyphen';
                }
                else if(varPercentage > 0){
                    classUsedPercent = 'fa-caret-up';
                }
                else if(varPercentage < 0){
                    classUsedPercent = 'fa-caret-down';
                }

                if(varLength == 0){
                    classUsedLength = 'fa-hyphen';
                }
                else if(varLength > 0){
                    classUsedLength = 'fa-caret-up';
                }
                else if(varLength < 0){
                    classUsedLength = 'fa-caret-down';
                }

                ttlIssuePrev = ttlIssuePrev + parseInt(prevIssue);
                ttlIssueCurr = ttlIssueCurr + parseInt(currIssue);

                ttlPercentPrev = ttlPercentPrev + parseInt(prevPercentage);
                ttlPercentCurr = ttlPercentCurr + parseInt(currPercentage);

                ttlLengthPrev = ttlLengthPrev + parseInt(prevLength);
                ttlLengthCurr = ttlLengthCurr + parseInt(currLength);
            }

        }

        lmrSectionTbHTML += '<tr>'
        lmrSectionTbHTML += '<th rowspan="2">'+idx+'</td>'
        lmrSectionTbHTML += '<td>No. of Issue</td>'
        lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+prevIssue+'</td>'
        lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+currIssue+'</td>'
        lmrSectionTbHTML += '<td><i class="fa-solid '+classUsedIssue+'"></i>'+varIssue+'</td>'
        lmrSectionTbHTML += '<td style = "text-align: right;">'+ttlAccumulIssue.toFixed(2)+'</td>'
        lmrSectionTbHTML += '</tr>';

        lmrSectionTbHTML += '<tr>'
        lmrSectionTbHTML += '<td>Length (M)</td>'
        lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+prevLength+'</td>'
        lmrSectionTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+currLength+'</td>'
        lmrSectionTbHTML += '<td><i class="fa-solid '+classUsedLength+'"></i>'+varLength+'</td>'
        lmrSectionTbHTML += '<td style = "text-align: right;">'+ttlAccumulLength.toFixed(2)+'</td>'
        lmrSectionTbHTML += '</tr>';

        accumulIssueTtl = accumulIssueTtl + ttlAccumulIssue;
        accumulLengthTtl = accumulLengthTtl + ttlAccumulLength;
    }
    
    $("#lmrTypeTable").html(lmrSectionTbHTML);

    //FOR FOOTER

    var totalBalIssuePrev = (ttlPrevData.ttlIssueType) ? ttlPrevData.ttlIssueType : 0;
    var totalLengthPrev = (ttlPrevData.ttlLengthType) ? ttlPrevData.ttlLengthType : 0;

    var totalBalIssueCurr = (ttlCurrData.ttlIssueType) ? ttlCurrData.ttlIssueType : 0;
    var totalLengthCurr = (ttlCurrData.ttlLengthType) ? ttlCurrData.ttlLengthType : 0;

    var varTotalIssue = totalBalIssueCurr - totalBalIssuePrev;
    var varTotalLength = totalLengthCurr - totalLengthPrev;

    var totalCTDaccumulIssue = accumulIssueTtl + parseInt(totalBalIssueCurr);
    var totalCTDaccumulLength = parseFloat(accumulLengthTtl) + parseInt(totalLengthCurr);

    // var totalCTDaccumulIssue = varTotalIssue -totalBalIssueCurr;
    // var totalCTDaccumulLength = varTotalLength -totalLengthCurr;

    var classIssue = '';

    if(varTotalIssue == 0){
        classIssue = 'fa-hyphen';
    }
    else if(varTotalIssue > 0){
        classIssue = 'fa-caret-up';
    }
    else if(varTotalIssue < 0){
        classIssue = 'fa-caret-down';
    }

    var classLength = '';

    if(varTotalLength == 0){
        classLength = 'fa-hyphen';
    }
    else if(varTotalLength > 0){
        classLength = 'fa-caret-up';
    }
    else if(varTotalLength < 0){
        classLength = 'fa-caret-down';
    }

    lmrFootTbHTML += '<tr>'
    lmrFootTbHTML += '<th colspan="2">TOTAL # OF ISSUES</th>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalBalIssuePrev+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalBalIssueCurr+'</td>'
    lmrFootTbHTML += '<td><i class="fa-solid '+classIssue+'"></i>'+varTotalIssue+'</td>'
    lmrFootTbHTML += '<td style = "text-align: right;">'+totalCTDaccumulIssue.toFixed(2)+'</td>'
    lmrFootTbHTML += '</tr>'

    lmrFootTbHTML += '<tr>'
    lmrFootTbHTML += '<th colspan="2">Length (M)</th>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+yearPrev+'\', \''+monthPrev+'\')">'+totalLengthPrev+'</td>'
    lmrFootTbHTML += '<td onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+totalLengthCurr+'</td>'
    lmrFootTbHTML += '<td><i class="fa-solid '+classLength+'"></i>'+varTotalLength+'</td>'
    lmrFootTbHTML += '<td style = "text-align: right;">'+totalCTDaccumulLength.toFixed(2)+'</td>'
    lmrFootTbHTML += '</tr>';
    
    $("#lmrTypeFootTable").html(lmrFootTbHTML);

}

function updateTableLandTrack(data, dataWTG, allData){
    var lengthPackage = '';
    var lengthSection = '';
    var arrlength = [];
    var arrlengthSection = [];
    var arrlengthWTG = [];

    var flagFirstTr = false;
    var flagSecondTr = false;
    var flagThirdTrStart = false;
    var flagMileCheck = false;

    var totalCompletion = 0;
    var countCompletion = 0;
    var lengthToUsed = 0;
    var countHeadSec = 0;

    let landTrackHead = '';
    let landTrackingBody = '';

    $("#landTrackHead").html("");
    $("#landTrackingBody").html("");

    var year = (allData && allData.year) ? allData.year : '';
    var month = (allData && allData.month) ? allData.month : '';

    if(dataWTG){
        for (const [idx, ele] of Object.entries(dataWTG.mileStage)){
            //idx = 1. SPA APPROVAL
            lengthStage = Object.keys(ele).length;
            if (!arrlengthWTG) arrlengthWTG = [];
            if (!arrlengthWTG[idx]) arrlengthWTG[idx] = [];

            arrlengthWTG[idx].push(lengthStage)
        }
    }

    if(data.count){
        for (const [idx, ele] of Object.entries(data.count)) {
            lengthPackage = Object.keys(ele).length;
            for (const [idx2, ele2] of Object.entries(ele)) {
                lengthSection = Object.keys(ele2).length;
                if (!arrlength) arrlength = [];
                arrlength.push(lengthSection)
                ele2.sort()
                for (const [idx3, ele3] of Object.entries(ele2)) {
                    if (!arrlengthSection[idx2]) arrlengthSection[idx2] = [];
                    arrlengthSection[idx2].push(ele3)
                }

            }

        }

        //START DOING FOR TABLE HEAD
        if(!flagFirstTr){

            landTrackHead += '<tr class="firstTr">'
            landTrackHead += '<th rowspan="4">Critical Milestone</th>'
            landTrackHead += '<th rowspan="4">Stage</th>'

            for (let i = 0; i < lengthPackage; i++) {
                var needToAdd = arrlength[i] + 1
                landTrackHead += '<th scope="col" colspan="'+arrlength[i]+'">% Dynamic Progress (Stage)</th>'
                landTrackHead += '<th scope="col" colspan="'+needToAdd+'">% Completion (Stage)</th>'
            }

            landTrackHead += '<th rowspan="4">WTG % Level 1 (Stage)</th>'
            landTrackHead += '<th scope="col">% Completion (Stage)</th>'
            landTrackHead += '<th scope="col" rowspan="4">WTG % Level 2 (Critical Milestones)</th>'
            landTrackHead += '<th scope="col" colspan="2">% Completion (Critical Milestones)</th>'
            landTrackHead += '</tr>'

            flagFirstTr = true;
        }

        if(!flagSecondTr){

            landTrackHead += '<tr class="secondTr">'
            
            for (const [idx3, ele3] of Object.entries(arrlengthSection)) {
                var lengthEach = Object.keys(ele3).length;
                var addForTotal = lengthEach + 1; 
                landTrackHead += '<th colspan="'+lengthEach+'">'+idx3+'</th>'
                landTrackHead += '<th colspan="'+addForTotal+'">'+idx3+'</th>'
            }

            landTrackHead += '<th rowspan="3" id = "ttlId_1">Total</th>'
            landTrackHead += '<th rowspan="3" id = "ttlId_2">Total</th>'

            landTrackHead += '</tr>'

            flagSecondTr = true;
        }

        if(!flagThirdTrStart){
            landTrackHead += '<tr class="thirdTr">'

            for (const [idx3, ele3] of Object.entries(arrlengthSection)) {
                countHeadSec++;

                var lengthEach = Object.keys(ele3).length;
                for (let i = 0; i < 2; i++) {
                    for (const [idx4, ele4] of Object.entries(ele3)) {
                        landTrackHead += '<th>'+ele4+'</th>'
                    }
                }
                landTrackHead += '<th id = "ttlSecId_'+countHeadSec+'">Total</th>'
            }
            landTrackHead += '</tr>'

            flagThirdTrStart = true;

        }

        //START DOING TABLE FOR BODY
        for (const [idx, ele] of Object.entries(data.data)) {
            flagMileCheck = false;
            var calTtlWTGmilePercent = 0;
            var calTtlWTGmileComplete = 0;
            var countLoopWTG = 0;
            var countLoopWTGBefore = 0;

            for (const [idx2, ele2] of Object.entries(ele)) {
                landTrackingBody += '<tr>'
                landTrackingBody += '<th>'+idx+'</th>'
                landTrackingBody += '<th>'+idx2+'</th>'

                var countToCalculate = 0
                var ttlCompletionAll = 0

                for (const [idx11, ele11] of Object.entries(arrlengthWTG)) {
                    if(idx == idx11){
                        lengthToUsed = ele11[0]
                    }
                }

                //idx3 = LAWAS
                for (const [idx3, ele3] of Object.entries(ele2)) {
                    totalCompletion = 0;
                    countCompletion = 0;

                    for (const [idxDynamic, eleDynamic] of Object.entries(ele3)) {
                        //DYNAMIC
                        for (const [idx5, ele5] of Object.entries(eleDynamic)) {
                            for (const [idxLength, eleLength] of Object.entries(arrlengthSection)) {
                                if(idx3 == idxLength){
                                    for (const [idxLength2, eleLength2] of Object.entries(eleLength)) {
                                        if(idxDynamic == eleLength2){
                                            var dynaProgress = (ele5.dynamic_progress) ? ele5.dynamic_progress : 0;
                                            landTrackingBody += '<th onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+dynaProgress+' %</th>'
                                            break
    
                                        }
                                    }
                                    break
                                }
                            }
                            break
                        }
                    }

                    countToCalculate ++;
                    for (const [idxCompletion, eleCompletion] of Object.entries(ele3)) {
                        //COMPLETION
                        for (const [idx5, ele5] of Object.entries(eleCompletion)) {
                            for (const [idxLength, eleLength] of Object.entries(arrlengthSection)) {
    
                                if(idx3 == idxLength){
                                    for (const [idxLength2, eleLength2] of Object.entries(eleLength)) {
                                        if(idxCompletion == eleLength2){
                                            var compleProgress = (ele5.completion_progress) ? ele5.completion_progress : 0;
                                            totalCompletion = totalCompletion + parseInt(compleProgress);

                                            landTrackingBody += '<th onclick="openConOpDashboardLand(\''+year+'\', \''+month+'\')">'+compleProgress+' %</th>'
                                            break
    
                                        }
                                    }
                                    break
                                }
                            }
                            break
                        }
                        countCompletion ++;
                    }

                    var averageCompletion = Math.round (totalCompletion / countCompletion);
                    ttlCompletionAll = ttlCompletionAll + averageCompletion;

                    landTrackingBody += '<th>'+averageCompletion+' %</th>'

                }
                
                for (const [idxwtg, elewtg] of Object.entries(dataWTG)) {

                    if(idxwtg == 'stage'){
                        for (const [idxwtg2, elewtg2] of Object.entries(elewtg)) {
                            for (const [idxwtg3, elewtg3] of Object.entries(elewtg2)) {
                                if(idxwtg2 == idx2){
                                    var wtgPercentStage = (elewtg3.wtg_percentage) ? parseInt (elewtg3.wtg_percentage) : 0;
                                    var calculateWtgStage = 0
                                    if(ttlCompletionAll != 0){
                                        calculateWtgStage = Math.round (ttlCompletionAll / countToCalculate);
                                    }
                                    
                                    calTtlWTGmilePercent = calTtlWTGmilePercent + wtgPercentStage;
                                    calTtlWTGmileComplete = calTtlWTGmileComplete + calculateWtgStage;

                                    landTrackingBody += '<th>'+elewtg3.wtg_percentage+' %</th>'
                                    landTrackingBody += '<th>'+calculateWtgStage+' %</th>'
                                    break;
                                }
                            }
                        }
                    }

                    if(idxwtg == 'mile'){
                        countLoopWTGBefore ++;

                        if(countLoopWTGBefore < lengthToUsed){
                            for (const [idxwtg2, elewtg2] of Object.entries(elewtg)) {
                                for (const [idxwtg3, elewtg3] of Object.entries(elewtg2)) {
                                    if(idxwtg2 == idx){
                                        landTrackingBody += '<th></th>'
                                        landTrackingBody += '<th></th>'
                                        break;
                                    }
                                }
    
                            }
                        }

                    }

                }

                for (const [idxwtg, elewtg] of Object.entries(dataWTG)) {
                    if(idxwtg == 'mile'){
                        countLoopWTG ++;

                        if(lengthToUsed == countLoopWTG){
                            for (const [idxwtg2, elewtg2] of Object.entries(elewtg)) {
                                for (const [idxwtg3, elewtg3] of Object.entries(elewtg2)) {
                                    if(idxwtg2 == idx){
                                        wtgPercentMile = (elewtg3.wtg_percentage) ? parseInt (elewtg3.wtg_percentage) : 0;
                                        calculateWtgMile = 0

                                        if(calTtlWTGmileComplete != 0){
                                            calculateWtgMile = Math.round (calTtlWTGmileComplete / calTtlWTGmilePercent * wtgPercentMile);
                                        }

                                        landTrackingBody += '<th>'+wtgPercentMile+' %</th>'
                                        landTrackingBody += '<th>'+calculateWtgMile+' %</th>'
                                        break;
                                    }
                                }
                            }

                        }

                    }

                }

                landTrackingBody += '</tr>'

            }

        }
    }

    $("#landTrackHead").html(landTrackHead);
    $("#landTrackingBody").html(landTrackingBody);

    //FOR CALCULATION AT THE END OF TABLE
    var j = 0;
    var l = 0;

    var tdToAdd = 0;
    var prevIndex = 0;
    var indexStage = 0;
    var indexStageCompletion = 0;
    var indexMile = 0;
    var indexMileCompletion = 0;

    var totalStage = 0;
    var totalStageCompletion = 0;
    var totalMile = 0;
    var totalMileCompletion = 0;

    landTrackingBody += '<tr>'

    $("#landTrackHead").find("#ttlSecId_" +countHeadSec).each(function () {
        indexStage = $(this).index() + 3;
        indexStageCompletion = $(this).index() + 4;
        indexMile = $(this).index() + 5;
        indexMileCompletion = $(this).index() + 6;

    })

    //FOR WTG PART
    $("#landTrackingBody").find("tr").each(function () {
        var valueTdStage = $(this).find("th:eq(" + indexStage + ")").html();
        var valueTdStageCompletion = $(this).find("th:eq(" + indexStageCompletion + ")").html();
        var valueTdMile = $(this).find("th:eq(" + indexMile + ")").html();
        var valueTdMileCompletion = $(this).find("th:eq(" + indexMileCompletion + ")").html();

        var usedLastValueStage = 0
        if(valueTdStage){
            var onlyValue = valueTdStage.split(" ");
            usedLastValueStage = onlyValue[0]
        }

        var usedLastValueStageCompletion = 0
        if(valueTdStageCompletion){
            var onlyValue = valueTdStageCompletion.split(" ");
            usedLastValueStageCompletion = onlyValue[0]
        }

        var usedLastValueMile = 0
        if(valueTdMile){
            var onlyValue = valueTdMile.split(" ");
            usedLastValueMile = onlyValue[0]
        }

        var usedLastValueMileCompletion = 0
        if(valueTdMileCompletion){
            var onlyValue = valueTdMileCompletion.split(" ");
            usedLastValueMileCompletion = onlyValue[0]
        }
        
        totalStage = totalStage + parseInt(usedLastValueStage)
        totalStageCompletion = totalStageCompletion + parseInt(usedLastValueStageCompletion)
        totalMile = totalMile + parseInt(usedLastValueMile)
        totalMileCompletion = totalMileCompletion + parseInt(usedLastValueMileCompletion)

    });

    for (let i = 0; i < countHeadSec; i++) {
        j ++;
        var totalAll = 0;
        var totalPercent = 0;

        $("#landTrackHead").find("#ttlSecId_" +j).each(function () {
            var indexTotal = $(this).index()
            if(j == 1){
                tdToAdd = indexTotal + 2;
            } 
            else{
                tdToAdd = indexTotal - prevIndex - 1;
            }
            $("#landTrackingBody").find("tr").each(function () {
                var useIndex = indexTotal + 2;
                var valueTd = $(this).find("th:eq(" + useIndex + ")").html();
                var usedLastValue = 0
                if(valueTd){
                    var onlyValue = valueTd.split(" ");
                    usedLastValue = onlyValue[0]
                }
                totalAll = totalAll + parseInt(usedLastValue);

                

            });

            prevIndex = indexTotal

        });

        totalPercent = Math.round (totalAll / totalStage * 100)

        for (let k = 0; k < tdToAdd; k++) {
            landTrackingBody += '<th> </th>'
        }
        landTrackingBody += '<th>'+totalPercent+' %</th>'

    }

    var valueCalculate1 = 0;
    var valueCalculate2 = 0;

    if(totalStageCompletion != 0){
        valueCalculate1 = Math.round (totalStageCompletion / totalStage * 100)
    }

    if(totalMileCompletion != 0){
        valueCalculate2 = Math.round (totalMileCompletion / totalMile * 100)
    }

    landTrackingBody += '<th></th>'
    landTrackingBody += '<th>'+valueCalculate1+' %</th>'

    landTrackingBody += '<th></th>'
    landTrackingBody += '<th>'+valueCalculate2+' %</th>'

    landTrackingBody += '</tr>'
    $("#landTrackingBody").html(landTrackingBody);



    
}

function refreshInformation(proj = 'overall', year = 'all', month = 'all'){
    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year;
    var landManage = (landData && landData.landManagement && landData.landManagement[proj] && landData.landManagement[proj]) ? landData.landManagement[proj] : [];
    var landTimelineDb = (landData && landData.landTimelineDatabase && landData.landTimelineDatabase[proj]) ? landData.landTimelineDatabase[proj] : [];
    var landWtg= (landData && landData.landWTG && landData.landWTG[proj]) ? landData.landWTG[proj] : [];

    var allData = (landTimelineDb && landTimelineDb['all'] && landTimelineDb['all']['all'] && landTimelineDb['all']['all'].allData) ? landTimelineDb['all']['all'].allData : [];

    var landDb = (landTimelineDb && landTimelineDb['all'] && landTimelineDb['all']['all'] && landTimelineDb['all']['all'].landDatabase) ? landTimelineDb['all']['all'].landDatabase : [];
    updateLandDatabase(landDb, allData, dataYearMonth);

    var landTime = (landTimelineDb && landTimelineDb['all'] && landTimelineDb['all']['all'] && landTimelineDb['all']['all'].landTimeline) ? landTimelineDb['all']['all'].landTimeline : [];
    updateLandTimeline(landTime, allData);
    timelineJSON = landTime['data'];

    var currDate = new Date();

    if(year == 'all'){
        currYear = currDate.getFullYear();
        prevYear = currDate.getFullYear();

        currMonth = monthHalftext[currDate.getMonth() + 1];
        prevMonth = monthHalftext[currDate.getMonth()];

        if(prevMonth == 'Jan'){
            prevYear = currDate.getFullYear() - 1;
        }
    }
    else{
        currYear = year;
        prevYear = year;

        if(month == 'all'){
            currMonth = monthHalftext[currDate.getMonth() + 1];
            prevMonth = monthHalftext[currDate.getMonth()];
        }
        else{
            currMonth = month;
            prevMonth = monthHalfPrev[month];

            if(prevMonth == 'Dec'){
                prevYear = prevYear - 1;
            }
        }
    }

    //set AIWI & FOE month timeline title

    var timelineMonth = '';
    for (const [idx, ele] of Object.entries(timelineJSON)) {
        var reMonth = new RegExp(monthNumtoHalftext[ele.month]);
        var reYear = new RegExp(ele.year);

        if(currMonth.match(reMonth) && String(currYear).match(reYear)){
            timelineMonth = ele.month_timeline;
            break;
        }else{
            timelineMonth = 'NOT SET';
        }
    }

    $('#AIWITitle').html(timelineMonth);
    $('#FOETitle').html(timelineMonth);

    setCutOffDateCurr(currYear, currMonth)
    setCutOffDatePrev(prevYear, prevMonth)

    var landId = (landData && landData.landManagement && landData.landManagement && landData.landManagement['idForEach'] && landData.landManagement['idForEach'][currYear] && landData.landManagement['idForEach'][currYear][currMonth]) ? landData.landManagement['idForEach'][currYear][currMonth] : [];
    var landIdPrev = (landData && landData.landManagement && landData.landManagement && landData.landManagement['idForEach'] && landData.landManagement['idForEach'][prevYear] && landData.landManagement['idForEach'][prevYear][prevMonth]) ? landData.landManagement['idForEach'][prevYear][prevMonth] : [];

    var allData = (landManage && landManage[currYear] && landManage[currYear][currMonth] && landManage[currYear][currMonth].allData) ? landManage[currYear][currMonth].allData : [];
    var allDataPrev = (landManage && landManage[prevYear] && landManage[prevYear][prevMonth] && landManage[prevYear][prevMonth].allData) ? landManage[prevYear][prevMonth].allData : [];

    var synopsisData = (landManage && landManage[currYear] && landManage[currYear][currMonth] && landManage[currYear][currMonth][landId] && landManage[currYear][currMonth][landId].synopsis) ? landManage[currYear][currMonth][landId].synopsis : [];
    updateSynopsis(synopsisData, allData);

    var aiwiData = (landManage && landManage[currYear] && landManage[currYear][currMonth] && landManage[currYear][currMonth].aiwi) ? landManage[currYear][currMonth].aiwi : [];
    drawAiwiChart(aiwiData, allData, dataYearMonth, month);

    var foeData = (landManage && landManage[currYear] && landManage[currYear][currMonth] && landManage[currYear][currMonth].foe) ? landManage[currYear][currMonth].foe : [];
    drawFoeChart(foeData, allData, dataYearMonth, month);

    var lmrSectCurrData = (landManage && landManage[currYear] && landManage[currYear][currMonth] && landManage[currYear][currMonth][landId] && landManage[currYear][currMonth][landId]['lmr-section']) ? landManage[currYear][currMonth][landId]['lmr-section'] : [];
    var lmrSectPrevData = (landManage && landManage[prevYear] && landManage[prevYear][prevMonth] && landManage[prevYear][prevMonth][landIdPrev] && landManage[prevYear][prevMonth][landIdPrev]['lmr-section']) ? landManage[prevYear][prevMonth][landIdPrev]['lmr-section'] : [];
    
    var ttlDataCurr = (landManage && landManage[currYear] && landManage[currYear][currMonth] && landManage[currYear][currMonth][landId] && landManage[currYear][currMonth][landId]['total']) ? landManage[currYear][currMonth][landId]['total'] : [];
    var ttlDataPrev = (landManage && landManage[prevYear] && landManage[prevYear][prevMonth] && landManage[prevYear][prevMonth][landIdPrev] && landManage[prevYear][prevMonth][landIdPrev]['total']) ? landManage[prevYear][prevMonth][landIdPrev]['total'] : [];

    updateTableLMRSection(lmrSectCurrData, lmrSectPrevData, ttlDataCurr, ttlDataPrev, allData, allDataPrev)

    var lmrTypeCurrData = (landManage && landManage[currYear] && landManage[currYear][currMonth] && landManage[currYear][currMonth][landId] && landManage[currYear][currMonth][landId]['lmr-type']) ? landManage[currYear][currMonth][landId]['lmr-type'] : [];
    var lmrTypePrevData = (landManage && landManage[prevYear] && landManage[prevYear][prevMonth] && landManage[prevYear][prevMonth][landIdPrev] && landManage[prevYear][prevMonth][landIdPrev]['lmr-type']) ? landManage[prevYear][prevMonth][landIdPrev]['lmr-type'] : [];
    var lmrTypeCTD = (landManage['lmr-type-ctd']) ? landManage['lmr-type-ctd'] : [];
    updateTableLMRType(lmrTypeCurrData, lmrTypePrevData, ttlDataCurr, ttlDataPrev, allData, allDataPrev, lmrTypeCTD)
    
    var landTracking = (landManage && landManage[currYear] && landManage[currYear][currMonth] && landManage[currYear][currMonth][landId] && landManage[currYear][currMonth][landId]['landTracking']) ? landManage[currYear][currMonth][landId]['landTracking'] : [];
    var landWTGData = (landWtg && landWtg['all'] && landWtg['all']['all'] && landWtg['all']['all'].wtg) ? landWtg['all']['all'].wtg : [];
    updateTableLandTrack(landTracking, landWTGData, allData);
}

function setCutOffDateCurr(year, month){
    $("#cutOff-month-curr-section").text(month);
    $("#cutOff-year-curr-section").text(year);

    $("#cutOff-month-curr-type").text(month);
    $("#cutOff-year-curr-type").text(year);

    $("#cutOff-month-curr-section-ctd").text(month);
    $("#cutOff-year-curr-section-ctd").text(year);
}

function setCutOffDatePrev(year, month){
    $("#cutOff-month-prev-section").text(month);
    $("#cutOff-year-prev-section").text(year);

    $("#cutOff-month-prev-type").text(month);
    $("#cutOff-year-prev-type").text(year);

    $("#cutOff-month-prev-section-ctd").text(month);
    $("#cutOff-year-prev-section-ctd").text(year);

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

    setTimeout(() => {
        setSecondThirdRow()
    }, 100);
    
}

function refreshFromv3 (filterArr){
    var wpc = filterArr.wpc;
    var year = filterArr.year;
    var month = filterArr.month;

    if(year != 'all'){
        if(month != 'all'){
            refreshInformation(wpc, year, month);
        }
    }
}

$(document).ready(function(){
	$.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "land"
        },
        success: function (obj) {
        	if (obj.status && obj.status == 'ok') {
                landData = obj.data;
                refreshInformation();

                var currDate = new Date();
                var currYear = currDate.getFullYear();
                var currMonth = monthHalftext[currDate.getMonth() + 1];

                $("#yearFilter").val(currYear);
                $("#monthFilter").val(currMonth);

                $('.filterContainer .yrFilter', window.parent.document).val(currYear);
								
                $('.filterContainer .mthFilter', window.parent.document).prop('disabled', false);
                $('.filterContainer .mthFilter', window.parent.document).val(currMonth);
        	}
        },
        complete: function (){
            window.parent.postMessage({functionName: 'loaderajaxEnd'})
        }
    });

})