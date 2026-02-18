var riskData;
var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};

function conOpLink(process, status){
  var linkName = '';
  var linkWinTitle = '';
  var linkParamArr = '';
  var searchfilter = getFilterDocumentSarawak();
  var cardName;
  
  switch (process) {
      case 'RR':
          linkWinTitle = 'Risk Register'
          linkName = 'dash_cons_RR_card'
          linkParamArr = processFilterParamArr([status, searchfilter.dateFrom, searchfilter.dateTo])
          cardName = status
          break;
  }
  window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle + " - " + cardName);
}

function updateRiskCard (data) {
    var dur = 0;
    var prob = 0;

    if (data) {
      for (const [idx, ele] of Object.entries(data)) {   
        dur = (ele.rpd_project_remain_dur) ?  ele.rpd_project_remain_dur : 0;
        prob = (ele.rpd_project_prob_complete) ?  ele.rpd_project_prob_complete : 0;
      }
    }

    $('#riskDurRemainCard').html(dur);
    $('#riskProbCompleteCard').html(prob);
}

function drawTimelyCompChart (data, monthYear) {
    var catArr = [];
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);
            dataArr.push((ele.rpd_timely_completion_prob) ? parseInt(ele.rpd_timely_completion_prob) : 0);
        }
    }
    var chart = Highcharts.chart('risk-timely-comp', {
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
                          marginTop: 90,
                        },
                        title: {
                          text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Risk Management Dashboard<br>'+localStorage.p_name+'<br>TIME COMPLETION PROBABILITY ('+monthYear+')</span>'
                        }
                      })
          
                      chart.updateFlag = true;
                    } else if (chart.updateFlag) {
                      chart.updateFlag = false;
          
                      chart.update({
                        title: {
                          text: '<span class="showLabel" style="text-align: center">Risk Management Dashboard<br>'+localStorage.p_name+'<br>TIME COMPLETION PROBABILITY ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Risk Management Dashboard<br>'+localStorage.p_name+'<br>TIME COMPLETION PROBABILITY ('+monthYear+')</span>'
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
                text: ''
            },
            labels: {
              format: '{value}%'
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    format: '{y}%'
                },
                zones: [{
                    value: 50,
                    color: 'red'
                },{
                    value: 70,
                    color: 'orange'
                },{
                    color: 'green'
                }]
            },
        },
        credits: {
            enabled: false
        },
        series: [{
            showInLegend: false,
            name: 'Timely Completion Prob.',
            data: dataArr,
            color: Highcharts.getOptions().colors[1],
        }]
    });
    chart.updateFlag = true;
}

function drawProjScheduleChart (data, monthYear) {
    var catArr = [];
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);
            dataArr.push(ele.rpd_overall_schedule_impact_uncer ? parseInt(ele.rpd_overall_schedule_impact_uncer) : 0);
        }
    }

    var chart = Highcharts.chart('risk-schedule-impact', {
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
                          marginTop: 90,
                        },
                        title: {
                          text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Risk Management Dashboard<br>'+localStorage.p_name+'<br>OVERALL PROJECT SCHEDULE IMPACT UNCERTAINTY ('+monthYear+')</span>'
                        }
                      })
          
                      chart.updateFlag = true;
                    } else if (chart.updateFlag) {
                      chart.updateFlag = false;
          
                      chart.update({
                        title: {
                          text: '<span class="showLabel" style="text-align: center">Risk Management Dashboard<br>'+localStorage.p_name+'<br>OVERALL PROJECT SCHEDULE IMPACT UNCERTAINTY ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Risk Management Dashboard<br>'+localStorage.p_name+'<br>OVERALL PROJECT SCHEDULE IMPACT UNCERTAINTY ('+monthYear+')</span>'
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
                text: ''
            },
            labels: {
              format: '{value}%'
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    format: '{y}%'
                },
                zones: [{
                    value: 50,
                    color: 'red'
                },{
                    value: 70,
                    color: 'orange'
                },{
                    color: 'green'
                }]
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            showInLegend: false,
            name: 'Overall Project Schedule Impact Uncertainty',
            data: dataArr,
            color: Highcharts.getOptions().colors[2],
        }]
    });
    chart.updateFlag = true;
}

function drawProjProbCompleteChart (data, monthYear) {
    var catArr = [];
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);
            dataArr.push(ele.rpd_project_prob_complete ? parseInt(ele.rpd_project_prob_complete) : 0);
        }
    }

    var chart = Highcharts.chart('risk-prob-complete', {
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
                          marginTop: 90,
                        },
                        title: {
                          text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Risk Management Dashboard<br>'+localStorage.p_name+'<br>PROBABILITY OF COMPLETING WITHIN SCHEDULE ('+monthYear+')</span>'
                        }
                      })
          
                      chart.updateFlag = true;
                    } else if (chart.updateFlag) {
                      chart.updateFlag = false;
          
                      chart.update({
                        title: {
                          text: '<span class="showLabel" style="text-align: center">Risk Management Dashboard<br>'+localStorage.p_name+'<br>PROBABILITY OF COMPLETING WITHIN SCHEDULE ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Risk Management Dashboard<br>'+localStorage.p_name+'<br>PROBABILITY OF COMPLETING WITHIN SCHEDULE ('+monthYear+')</span>'
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
                text: ''
            },
            labels: {
              format: '{value}%'
            }
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    format: '{y}%'
                },
                zones: [{
                    value: 50,
                    color: 'red'
                },{
                    value: 70,
                    color: 'orange'
                },{
                    color: 'green'
                }]
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            showInLegend: false,
            name: 'Probability of Completing Within Schedule',
            data: dataArr,
            color: Highcharts.getOptions().colors[4],
        }]
    });
    chart.updateFlag = true;
}
function drawProjPDPRiskChart (data, monthYear) {
    var catArr = [];
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            if (idx == "") continue;
            catArr.push(idx);
            var t = { name : ele.package_id , y: parseInt(ele.c_percentage), color: ((ele.bar_color) ? ele.bar_color : 'blue')};
            dataArr.push(t);
        }
    }
    var chart = Highcharts.chart('risk-pdp-crit-risk', {
        chart: {
            type: 'bar',
            events: {
                render() {
                  const chart = this;

                  if(localStorage.ui_pref == 'ri_v3'){
                    if (document.fullscreenElement && chart.updateFlag && chart.updateFlagPrint == false) {
                      chart.updateFlag = false;
          
                      chart.update({
                          chart:{
                              marginTop: 90,
                          },
                          title: {
                              text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Risk Management Dashboard<br>'+localStorage.p_name+'<br>CRITICAL RISK DRIVER ('+monthYear+')</span>'
                          },
                          xAxis: {
                              labels: {
                                  style: {
                                    color: 'black',
                                    textOverflow: 'unset',
                                    whiteSpace: 'unset',
                                    width: 0,
                                  }
                                }
                          }
                      })
          
                      chart.updateFlag = true;
                    } else if (chart.updateFlag && chart.updateFlagPrint == false) {
                      chart.updateFlag = false;
          
                      chart.update({
                          title: {
                              text: '<span class="showLabel" style="text-align: center">Risk Management Dashboard<br>'+localStorage.p_name+'<br>CRITICAL RISK DRIVER ('+monthYear+')</span>'
                          },
                          xAxis: {
                            labels: {
                                style: {
                                  color: 'black',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  width: 80,
                                }
                            }
                         }
                      })
                      chart.updateFlag = true;
                    }
                  }
        
                }
              }
        },
        tooltip: {
            valueSuffix: ' %',
            formatter: function () {
                return this.x + '<br/>Work Package - <b>' + this.series.name + '</b> : ' + this.y + '%';
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">Risk Management Dashboard<br>'+localStorage.p_name+'<br>CRITICAL RISK DRIVER ('+monthYear+')</span>'
        },
        xAxis: {
            categories: catArr,
            title: {
                text: null
            },
            labels: {
              style: {
                color: 'black',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: 80,
              }
            }
        },
        yAxis: {
            min: 0,
            max: 100,
            tickAmount: 5,
            title: {
                text: null
            },
            labels: {
              format: '{value}%'
            }
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
            showInLegend: false,
            name: 'Percentage',
            data: dataArr,
            cursor : 'pointer',
            events: {
              click: function (event) {

                  if(localStorage.ui_pref == 'ri_v3'){
                    var searchfilter = getFilterDocumentSarawak();
                    linkWinTitle = 'Risk Register'
                    linkName = 'dash_cons_RR_card'
                    linkParamArr = processFilterParamArr([event.point.category.name, searchfilter.dateFrom, searchfilter.dateTo, event.point.options.y])
  
                    window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ event.point.category.name);
                    }
                  }
                }
        }]
    });
    chart.updateFlag = true;
    chart.updateFlagPrint = false;
}

function drawProjPDPDurChart (data, monthYear) {
    var catArr = [];
    var countArr =  [];
    var cumArr = [];
    if (data) {
        if (data.bin) {
            for (const [idx, ele] of Object.entries(data.bin)) {
                catArr.push(parseInt(ele));
            }
        }
        if (data.count) {
            for (const [idx, ele] of Object.entries(data.count)) {
                countArr.push(parseFloat(ele));
            }
        }
        if (data.cum) {
            for (const [idx, ele] of Object.entries(data.cum)) {
                cumArr.push(parseFloat(ele));
            }
        }
    }

    var chart = Highcharts.chart('risk-pdp-overall-dur', {
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
                          marginTop: 120,
                        },
                        title: {
                          text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Risk Management Dashboard<br>'+localStorage.p_name+'<br>OVERALL DURATION ANALYSIS ('+monthYear+')</span>'
                        }
                      })
          
                      chart.updateFlag = true;
                    } else if (chart.updateFlag) {
                      chart.updateFlag = false;
          
                      chart.update({
                        title: {
                          text: '<span class="showLabel" style="text-align: center">Risk Management Dashboard<br>'+localStorage.p_name+'<br>OVERALL DURATION ANALYSIS ('+monthYear+')</span>'
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
          text: '<span class="showLabel">Risk Management Dashboard<br>'+localStorage.p_name+'<br>OVERALL DURATION ANALYSIS ('+monthYear+')</span>'
        },
        xAxis: {
            categories: catArr,
            title: {
                text: null
            }
        },
        yAxis: [{ // Primary yAxis
            gridLineWidth: 0,
            labels: {
                style: {
                }
            },
            title: {
                text: 'Cumulative',
                style: {
                }
            },
            opposite: true

        }, { // Secondary yAxis
            gridLineWidth: 0,
            title: {
                text: 'Count',
                style: {
                }
            },
            labels: {
                style: {
                }
            }
        }],
        series: [{
            type: 'column',
            name: 'Count',
            data: countArr,
            color: Highcharts.getOptions().colors[0],
            yAxis: 1
        }, {
            type: 'spline',
            name: 'Cumulative',
            data: cumArr,
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[3],
                fillColor: 'white'
            },
            yAxis: 0
        }],
        credits: {
            enabled: false
        }
    });
    chart.updateFlag = true;
}

function refreshDashboard(){
    var selWPC = $("#wpcFilter").val();
    var selYr = $('#yearFilter').val();

  if (selYr == 'all') {
    $('#monthFilter').prop("disabled", true);	
    $('#monthFilter').val('all');
  }else{
    $('#monthFilter').prop("disabled", false);
  }
	var selMonth = $('#monthFilter').val();
    refreshInformation(selWPC, selYr, selMonth);
}

function refreshInformation(packId = 'overall', year = 'all', month = 'all') {
    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year;
    var progD = (riskData.riskProb && riskData.riskProb[packId] && riskData.riskProb[packId][year] && riskData.riskProb[packId][year][month]) ? riskData.riskProb[packId][year][month] : []; 
    drawTimelyCompChart(progD, dataYearMonth);
    drawProjScheduleChart(progD, dataYearMonth);
    drawProjProbCompleteChart(progD, dataYearMonth);

    var cardData = (riskData.riskProb && riskData.riskProb[packId] && riskData.riskProb[packId][year] && riskData.riskProb[packId][year][month]) ?  riskData.riskProb[packId][year][month] : [];
    updateRiskCard(cardData);

    var pdpDur = (riskData.pdpODAHistogram && riskData.pdpODAHistogram[packId] && riskData.pdpODAHistogram[packId][year] && riskData.pdpODAHistogram[packId][year][month]) ? riskData.pdpODAHistogram[packId][year][month] : []; 
    drawProjPDPDurChart(pdpDur, dataYearMonth);
    
    var pdpRiskChartData = (riskData.pdp && riskData.pdp[packId] && riskData.pdp[packId][year] && riskData.pdp[packId][year][month]) ? riskData.pdp[packId][year][month] : []; 
    drawProjPDPRiskChart(pdpRiskChartData, dataYearMonth);

}

function refreshFromv3 (filterArr){
    var wpc = filterArr.wpc;
	  var year = filterArr.year;
    var month = textMonthtoNum[filterArr.month];

    refreshInformation(wpc, year, month);
}

$(document).ready(function(){
    $('#wpcFilter').val('overall');
    $('#yearFilter').val('all');
    $('#monthFilter').val('all');
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

                refreshInformation()
                
        	}
        }
    });
})