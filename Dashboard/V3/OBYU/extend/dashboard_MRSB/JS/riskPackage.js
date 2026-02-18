var monthHalftext = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};

function drawProbabilityExceedingTargetDate (data, monthYear){
    var catArr = [];
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            if(idx == "") continue;
            catArr.push(idx);
            dataArr.push({y:((ele.probExceedTarget) ? parseFloat(ele.probExceedTarget) : 0),allData:((ele.allData) ? ele.allData : 0)});
        }
    }

    var chart = Highcharts.chart('probabilityExceedingTargetData', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Risk Management<br>'+localStorage.p_name+'<br>PROBABILITY OF EXCEEDING N/A TARGET COMPLETION DATE ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>PROBABILITY OF EXCEEDING N/A TARGET COMPLETION DATE ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>PROBABILITY OF EXCEEDING N/A TARGET COMPLETION DATE ('+monthYear+')</span>'
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
                enabled: false
            },
            labels: {
                format:'{value}%'
            }
        },
        tooltip: {
            valueSuffix: '%'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    format: '{y}%'
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Probability',
            data: dataArr,
            color: Highcharts.getOptions().colors[0],
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var paramYr = (allDataArr.year) ? allDataArr.year : [];
                    var paramMonth = (allDataArr.month) ? allDataArr.month : [];
                    var linkParamArr = [paramMonth, paramYr];
                    if (paramYr.length != 0 || paramMonth.length != 0) {
                        if(localStorage.ui_pref == "ri_v3"){
                            window.parent.widgetConopOpen("RR", "construct_dash_conop_ra_section", linkParamArr, "Risk Register - Probability");
                        }else{
                            var postParam = {function:"openConOpDashboard",processType:"RR", conOpTabId:"riskAnalysisSection", linkName:"construct_dash_conop_ra_section", linkParam:linkParamArr, linkWinTitle: 'Risk Analysis'};
                            parent.postMessage(postParam ,"*");
                        }
                    }
                }
            }
        }]
    });
    chart.updateFlag = true;
}

function drawActivitiesImpactDate(data, monthYear){
    var catArr = [];
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            if(idx == "") continue;
            catArr.push(idx);
            dataArr.push({y:((ele.val) ? ele.val : 0),allData:((ele.allData) ? ele.allData : 0)});
        }
    }

    var chart = Highcharts.chart('activitiesImpactDate', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Risk Management<br>'+localStorage.p_name+'<br>AREAS OF CONCERN - ACTIVITIES THAT MIGHT IMPACT COMPLETION DATE ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>AREAS OF CONCERN - ACTIVITIES THAT MIGHT IMPACT COMPLETION DATE ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>AREAS OF CONCERN - ACTIVITIES THAT MIGHT IMPACT COMPLETION DATE ('+monthYear+')</span>'
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
                enabled: false
            },
            labels: {
                format:'{value}%'
            }
        },
        tooltip: {
            valueSuffix: '%'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    format: '{y}%'
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Percentage of Activities Impact Completion Date',
            data: dataArr,
            color: Highcharts.getOptions().colors[0],
            events: {
                click: function (event) {
                    var allDataArr = (event.point.allData) ? event.point.allData : [];
                    var paramYr = (allDataArr.year) ? allDataArr.year : [];
                    var paramMonth = (allDataArr.month) ? allDataArr.month : [];
                    var linkParamArr = [paramMonth, paramYr];
                    if (paramYr.length != 0 || paramMonth.length != 0) {
                        if(localStorage.ui_pref == "ri_v3"){
                            window.parent.widgetConopOpen("RR", "construct_dash_conop_ra_section", linkParamArr, "Risk Register - Percentage of Activities Impact Completion Date");
                        }else{
                            var postParam = {function:"openConOpDashboard",processType:"RR", conOpTabId:"riskAnalysisSection", linkName:"construct_dash_conop_ra_section", linkParam:linkParamArr, linkWinTitle: 'Risk Analysis'};
                            parent.postMessage(postParam ,"*");
                        }
                    }
                }
            }
        }]
    });
    chart.updateFlag = true;
}

function drawOverallDurationAnalysis(data, data2, monthYear){
    var chart = Highcharts.chart('overallDurationAnalysis', {
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
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
        credits: false,
        series: [{
            colorByPoint: true,
            data: [{
                name: 'Elapsed',
                y: data
            }, {
                name: 'Remaining',
                y: data2,
                color: '#808080',
            }]
        }]
    });
    chart.updateFlag = true;
}

function drawPlannedProgress(data, monthYear){
    var afterphyPlan = (data.phyPlan) ? parseFloat(data.phyPlan).toFixed(2) : 0;
    var remValue = (100 - afterphyPlan).toFixed(2);

    Highcharts.chart('plannedProgress', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Risk Management<br>'+localStorage.p_name+'<br>PLANNED PROGRESS ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>PLANNED PROGRESS ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>PLANNED PROGRESS ('+monthYear+')</span>'
        },
        subtitle: {
            verticalAlign: 'middle',
            floating: true,
            text: +afterphyPlan+'%',
            y: 20,
            style: {
                fontSize: 18
            }
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point. :.1f}%</b>'
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
                dataLabels: {
                    enabled: false
                },
                showInLegend: false
            }
        },
        series: [{
            colorByPoint: true,
            name: '',
            innerSize: '65%',
            cursor: 'default',
            data: [{
                name: 'Planned',
                y: parseFloat(afterphyPlan),
                className: 'clickable'
            },{
                name: '',
                y: parseFloat(remValue),
                showInLegend: false,
                color: '#808080',
            }],
            events: {
                click: function (event) { 
                    if(event.point.name != ""){
                        if(localStorage.ui_pref == "ri_v3"){
                            openProgressSummaryUpload(parseFloat(data.phyPlan).toFixed(2));
                        }else{
                            var postParam = {function:"openProgressSummaryUpload", plannedVal:parseFloat(data.phyPlan).toFixed(2)};
                            parent.postMessage(postParam ,"*");
                        }
                    }
                }
            }
        }],
        credits: false,
        tooltip: { enabled: true },
    });
}

function drawActualProgress(data, monthYear){
    var afteractPlan = (data.phyAct) ? parseFloat(data.phyAct).toFixed(2) : 0;
    var remValue = (100 - afteractPlan).toFixed(2);

    var chart = Highcharts.chart('actualProgress', {
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
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Risk Management<br>'+localStorage.p_name+'<br>ACTUAL PROGRESS ('+monthYear+')</span>'
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
                            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>ACTUAL PROGRESS ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>ACTUAL PROGRESS ('+monthYear+')</span>'
        },
        subtitle: {
            verticalAlign: 'middle',
            floating: true,
            text: +afteractPlan+'%',
            y: 20,
            style: {
                fontSize: 18
            }
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
                showInLegend: false
            }
        },
        series: [{
            colorByPoint: true,
            name: '',
            innerSize: '65%',
            data: [{
                name: 'Actual',
                y: parseFloat(afteractPlan),
            },{
                name: '',
                y: parseFloat(remValue),
                showInLegend: false,
                color: '#808080',
            }],
        }],
        credits: false,
        tooltip: { enabled: true },
    });
    chart.updateFlag = true;
}

function renderIcons() {
    // Move icon
    if (!this.series[0].icon) {
        this.series[0].icon = this.renderer.path(['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8])
            .attr({
                stroke: '#303030',
                zIndex: 10
            })
            .add(this.series[1].group);
    }
    this.series[0].icon.translate(
        this.chartWidth / 2 - 10,
        this.plotHeight / 2 - this.series[0].points[0].shapeArgs.innerR -
            (this.series[0].points[0].shapeArgs.r - this.series[0].points[0].shapeArgs.innerR) / 2
    );

    // Exercise icon
    if (!this.series[1].icon) {
        this.series[1].icon = this.renderer.path(
            ['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8,
                'M', 8, -8, 'L', 16, 0, 8, 8]
        )
            .attr({
                stroke: '#ffffff',
                zIndex: 10
            })
            .add(this.series[1].group);
    }
    this.series[1].icon.translate(
        this.chartWidth / 2 - 10,
        this.plotHeight / 2 - this.series[1].points[0].shapeArgs.innerR -
            (this.series[1].points[0].shapeArgs.r - this.series[1].points[0].shapeArgs.innerR) / 2
    );
}

function drawVariance(data, monthYear){
    var varData = parseFloat(data.phyAct - data.phyPlan);
    varData = (varData) ? varData.toFixed(2) : 0;

    var fontColor = ""
    if (varData < 0){
        fontColor = "red"

    }else{
        fontColor = "green"
    }

    var afterphyAct = (data.phyAct) ? parseFloat(data.phyAct).toFixed(2) : 0;
    var afterphyPlan = (data.phyPlan) ? parseFloat(data.phyPlan).toFixed(2) : 0;

    var chart = Highcharts.chart('variance', {
        chart: {
            type: 'solidgauge',
            height: '70%',
            events: {
                render: renderIcons,
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
                              text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Risk Management<br>'+localStorage.p_name+'<br>VARIANCE ('+monthYear+')</span>'
                            },
                            legend: {
                              symbolHeight: 15,
                              symbolWidth: 15,
                              itemStyle : {
                                fontSize : '15px'
                              }
                            },
                            subtitle: {
                                y: 80,
                            },
                          })
              
                          chart.updateFlag = true;
                        }
                        else if (chart.updateFlag) {
                          chart.updateFlag = false;
              
                          chart.update({
                            title: {
                              text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>VARIANCE ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Risk Management<br>'+localStorage.p_name+'<br>VARIANCE ('+monthYear+')</span>'
        },
        subtitle: {
            verticalAlign: 'top',
            floating: false,
            text: 'Variance: '+varData,
            y: 10,
            style: {
                fontSize: 12
            }
        },
        tooltip: {
            valueSuffix: '%',
            pointFormat: '{series.name}<br><span style="font-size:1em; color: {black};">{point.y}</span>',
            positioner: function (labelWidth) {
                return {
                    x: (this.chart.chartWidth - labelWidth) / 2,
                    y: (this.chart.plotHeight / 2) + 15
                };
            }
        },
        pane: {
            startAngle: 0,
            endAngle: 360,
            background: [{
                outerRadius: '87%',
                innerRadius: '63%',
                backgroundColor: Highcharts.color(Highcharts.getOptions().colors[1])
                    .setOpacity(0.3)
                    .get(),
                borderWidth: 0
            }, {
                outerRadius: '62%',
                innerRadius: '38%',
                backgroundColor: Highcharts.color(Highcharts.getOptions().colors[2])
                    .setOpacity(0.3)
                    .get(),
                borderWidth: 0
            }],
            center: ['50%', '40%']
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
                    enabled: false
                },
            },
        },
        series: [{
            name: 'Actual',
            data: [{
                color: Highcharts.getOptions().colors[2],
                radius: '87%',
                innerRadius: '63%',
                y: parseFloat(afterphyAct)
            }],
            cursor: 'default'
        }, {
            name: 'Planned',
            data: [{
                color: Highcharts.getOptions().colors[11],
                radius: '62%',
                innerRadius: '38%',
                y: parseFloat(afterphyPlan)
            }],
            cursor: 'pointer',
            events: {
                click: function (event) {
                    if(localStorage.ui_pref == "ri_v3"){
                        openProgressSummaryUpload(afterphyPlan)
                    }else{
                        var postParam = {function:"openProgressSummaryUpload",plannedVal:afterphyPlan};
                        parent.postMessage(postParam ,"*");
                    }
                }
            }
        }],
        credits: false,
    });
    chart.updateFlag = true;
}

function openConOpDashboard(paramYr, paramMonth){
    var linkParamArr = [paramMonth, paramYr];
    
    if(localStorage.ui_pref == "ri_v3"){
        window.parent.widgetConopOpen("RR", "construct_dash_conop_ra_section", linkParamArr, "Risk Analysis");
    }else{
        var postParam = {function:"openConOpDashboard",processType:"RR", conOpTabId:"riskAnalysisSection", linkName:"construct_dash_conop_ra_section", linkParam:linkParamArr, linkWinTitle: 'Risk Analysis'};
        parent.postMessage(postParam ,"*");

    }
}

function updateRiskCard (data) {
    var allDataArr = data.allData ?  data.allData : [];
    var paramYr = (allDataArr.year) ? allDataArr.year : [];
    var paramMonth = (allDataArr.month) ? allDataArr.month : [];

    $('#planDate').html((data.planCompleteDate) ?  '<span onclick="openConOpDashboard(\''+paramYr+'\',\''+paramMonth+'\')">'+data.planCompleteDate+'</span>' : 'N/A');
    $('#forecaseDate').html((data.forecastCompleteDate) ?  '<span onclick="openConOpDashboard(\''+paramYr+'\',\''+paramMonth+'\')">'+data.forecastCompleteDate+'</span>' : 0);
    $('#probTargetDate').html((data.probMeetPlan) ?  '<span onclick="openConOpDashboard(\''+paramYr+'\',\''+paramMonth+'\')">'+data.probMeetPlan+'</span>' : 0);

    $('#planDate').css('cursor', 'pointer');
    $('#forecaseDate').css('cursor', 'pointer');
    $('#probTargetDate').css('cursor', 'pointer');

    var dateExceed = (data.planCompleteDate) ? data.planCompleteDate : 'N/A';
    var sentenceProbability = 'PROBABILITY OF EXCEEDING '+dateExceed+' TARGET COMPLETION DATE';
    $('#probExceedComplete').html(sentenceProbability);
}

function calculatePackage(data){
    var currentTime = new Date();
    if (data){
        var startDate = new Date(data.start_date);
        var duration = data.duration;

        var diffTime = Math.abs(currentTime - startDate);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        var elapseDay = ((diffDays/duration) * 100);
        var remainingValue = 100 - elapseDay;

        drawOverallDurationAnalysis(elapseDay, remainingValue)
    }

}

function populateTableData(data, dataSection, dataPSU, eventDate) {
    var sDateFormat;
    var eDateFormat;
    
    var dataPhyAct = (dataPSU.phyAct) ? dataPSU.phyAct : 0;
    var dataPhyPlan = (dataPSU.phyPlan) ? dataPSU.phyPlan : 0;
    var varSection = parseFloat(dataPhyAct - dataPhyPlan).toFixed(2);

    var sDate = (data.start_date) ? new Date(data.start_date) : "N/A";
    if(sDate == "N/A"){
        sDateFormat = "N/A";
    }
    else{
        sDateFormat = sDate.getDate() + "/" + (sDate.getMonth() + 1) + "/" + sDate.getFullYear();
    }
    
    var eDate = (data.end_date) ? new Date(data.end_date) : "N/A";
    if(eDate == "N/A"){
        eDateFormat = "N/A";
    }
    else{
        eDateFormat = eDate.getDate() + "/" + (eDate.getMonth() + 1) + "/" + eDate.getFullYear();
    }


    var paramYr =  (eventDate && eventDate.year) ? eventDate.year : [];
    var paramMonth =  (eventDate && eventDate.month) ? eventDate.month : [];

    let projectTbHTML = '';
    $("#sectionTBody").html("");
    if (data) {
        projectTbHTML += '<tr style="cursor: default;">'
        projectTbHTML += '<td style="cursor: default;">' + ((data.project_name) ? (data.project_name):'') + '</td>'
        projectTbHTML += '<td style="cursor: default;">' + sDateFormat + '</td>'
        projectTbHTML += '<td style="cursor: default;">' + eDateFormat + '</td>'
        projectTbHTML += '<td onclick="openConOpDashboard(\''+paramYr+'\',\''+paramMonth+'\')">' + ((dataSection.estimatedComplete) ? (dataSection.estimatedComplete):'') + '</td>'
        projectTbHTML += '<td onclick="openProgressSummaryUpload(\''+ (parseFloat(dataPSU.phyPlan).toFixed(2)) +'\')" >' + ((dataPSU.phyPlan) ? (parseFloat(dataPSU.phyPlan).toFixed(2)):'') + '</td>'  
        projectTbHTML += '<td onclick="openConOpDashboard(\''+paramYr+'\',\''+paramMonth+'\')">' + ((dataSection.estimatedProgress) ? (dataSection.estimatedProgress):'') + '</td>'
        projectTbHTML += '<td style="cursor: default;">' + ((varSection) ? (varSection):'') + '</td>'
        projectTbHTML += '</tr>';
    }
    $("#sectionTBody").html(projectTbHTML); 
}

function openProgressSummaryUpload(plannedVal){
    if(localStorage.ui_pref == "ri_v3"){
        //mimic onclick trigger for v3
        if($('#mimicTrigger').length == 0){
            $('#lOne').append('<div id="mimicTrigger" style="display: none" data-width="70" rel="process"></div>')
        }
    
        $('#valueProceessConstruct', window.parent.document).change(function(){
            window.parent.wizardOpenPage($('#mimicTrigger'));
        });
    
        $('#valueProceessConstruct', window.parent.document).val("PSU").trigger('change');
    }
    var postParam = {function:"openProgressSummaryUpload",plannedVal:plannedVal};
    parent.postMessage(postParam ,"*");
}

function refreshInformation(year = 'all', month = 'all'){
    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year;
    var packageDetails = (riskData.projInfo) ? riskData.projInfo : [];
    calculatePackage(packageDetails);

    var pdpData = (riskData.pdp && riskData.pdp[year] && riskData.pdp[year][month]) ? riskData.pdp[year][month] : [];

    var currentDate = new Date();
    var yearPSU;
    var monthPSU;
    if(year == 'all'){
        yearPSU = currentDate.getFullYear();
        monthPSU = monthHalftext[currentDate.getMonth() + 1];
    }
    else{
        yearPSU = year;
        if(month == 'all'){
            monthPSU = monthHalftext[currentDate.getMonth() + 1];

        }
        else{
            monthPSU = month;
        }
    }
    
    var psuData = (riskData.pSU && riskData.pSU.overall && riskData.pSU.overall.overall && riskData.pSU.overall.overall.card[yearPSU] && riskData.pSU.overall.overall.card[yearPSU][monthPSU]) ? riskData.pSU.overall.overall.card[yearPSU][monthPSU] : [];

    var packageCard = (pdpData.packageCard) ? pdpData.packageCard : [];
    updateRiskCard(packageCard);

    var areaDetails = (pdpData.areaChart) ? pdpData.areaChart : [];
    drawActivitiesImpactDate(areaDetails, dataYearMonth);

    var secData = (pdpData.sectionCard) ? pdpData.sectionCard : [];
    populateTableData(packageDetails, secData, psuData, packageCard.allData);

    var probSection = (pdpData.sectionChart) ? pdpData.sectionChart : [];
    drawProbabilityExceedingTargetDate(probSection, dataYearMonth);

    // drawOverallDurationAnalysis();
    drawPlannedProgress(psuData, dataYearMonth);
    drawActualProgress(psuData, dataYearMonth);
    drawVariance(psuData, dataYearMonth)
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