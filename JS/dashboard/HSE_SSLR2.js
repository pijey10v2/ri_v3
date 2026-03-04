var HSEData;
var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};
var textMthtoNum = {"JAN":"01","FEB":"02","MAR":"03","APR":"04","MAY":"05","JUN":"06","JUL":"07","AUG":"08","SEP":"09","OCT":"10","NOV":"11","DEC":"12"};

function conOpLink(process, status, wolti, wtlti){
  var linkName = '';
  var linkWinTitle = '';
  var linkParamArr = '';
  var searchfilter = getFilterDocumentSSLR2();
  var cardName;
  var incident_category_filter;
  
  switch (process) {
      case 'SMH':
          linkWinTitle = 'HSET Total Man Hours'
          linkName = 'dash_cons_SMH_card'

          linkParamArr = processFilterParamArr([searchfilter.section, searchfilter.year, searchfilter.month, status, wolti, wtlti])
          if (status == ''){
            if(wolti == ''){
              cardName = 'CUMULATIVE TOTAL MAN-HOURS WITH LTI'
            }else{
              cardName = 'CUMULATIVE TOTAL MAN-HOURS WITHOUT LTI'
            }
          }else{
            cardName = status
          }
          break;
      case 'SA':
          linkWinTitle = 'HSET Safety Activity'
          linkName = 'dash_cons_SA_card'

          linkParamArr = processFilterParamArr([])
          cardName = status
          break;
      case 'INC':
          linkWinTitle = 'HSET Incident'
          linkName = 'dash_cons_INC_card'
          
          if(status == 'Yes'){
            cardName = 'FATALITY'
            incident_category_filter = 'Fatality'
            linkParamArr = processFilterParamArr(['', searchfilter.section, searchfilter.dateFrom, searchfilter.dateTo, 'Fatality'])
          }else if(status == ''){
            cardName = 'TOTAL ACCIDENTS/INCIDENTS'
            linkParamArr = processFilterParamArr([status, searchfilter.section, searchfilter.dateFrom, searchfilter.dateTo, ''])
          }else{
            cardName = status
            linkParamArr = processFilterParamArr([status, searchfilter.section, searchfilter.dateFrom, searchfilter.dateTo, ''])
          }
          break;
  }
  window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle + " - " + cardName);
}

function drawTotalManHrsWOLTI(data , monthYear){
  var catArr = [];
  var ttlDataArr = [];
  var cumulDataArr = [];

  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      if(idx == "all")continue;
      catArr.push(idx);
      ttlDataArr.push((ele.total_mh_wtlti) ? parseInt(ele.total_mh_wtlti) : 0);
      cumulDataArr.push((ele.culmulative_mh_wtlti) ? parseInt(ele.culmulative_mh_wtlti) : 0);
    }
  }
  var chart = Highcharts.chart('TotalManHrsWOLTI', {
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
                    marginTop: 90,
                  },
                  title: {
                    text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>TOTAL MAN HOURS WITHOUT LTI (HRS) ('+monthYear+')</span>'
                  },
                  legend: {
                    symbolHeight: 15,
                    symbolWidth: 15,
                    itemStyle : {
                      fontSize : 15
                    }
                  }
                })
    
                chart.updateFlag = true;
              } else if (chart.updateFlag) {
                chart.updateFlag = false;
    
                chart.update({
                  title: {
                    text: '<span class="showLabel" style="text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>TOTAL MAN HOURS WITHOUT LTI (HRS) ('+monthYear+')</span>'
                  },
                  legend: {
                    symbolHeight: 12,
                    symbolWidth: 12,
                    itemStyle : {
                      fontSize : 12
                    }
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
        text: '<span class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>TOTAL MAN HOURS WITHOUT LTI (HRS) ('+monthYear+')</span>'
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

      credits: false,

      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:var(--on-surface);padding:0">{series.name}: </td>' +
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
        name: 'Total Man-Hours',
        data: ttlDataArr,
        cursor : 'pointer',
        color: Highcharts.getOptions().colors[0],
        dataLabels: {
          formatter: function() {
            return '<span class="showLabel">'+this.y+'</span>';
          },
          enabled: true,
          useHTML: true,
        },
        events: {
          click: function (event) {
              if(localStorage.ui_pref == 'ri_v3'){
                var searchfilter = getFilterDocumentSSLR2();
                if(searchfilter.section == "overall"){
                  searchfilter.section = "";
                }
  
                var monthYr = event.point.category.name
                var month = monthYr.slice(0, 3);
                var year = monthYr.slice(4, 8);
                var selMthNo = textMthtoNum[month];
  
                linkWinTitle = 'TOTAL MAN HOURS WITHOUT LTI (HRS) - Total Man-Hours'
                linkName = 'dash_cons_SMH_card'
  
                linkParamArr = processFilterParamArr([searchfilter.section, year, selMthNo, event.point.options.y])
                window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle);
              }
            }
        }
      }, {
        name: 'Cumulative Man-Hours',
        data: cumulDataArr,
        cursor : 'pointer',
        color: Highcharts.getOptions().colors[1],
        dataLabels: {
          formatter: function() {
            return '<span class="showLabel">'+this.y+'</span>';
          },
          enabled: true,
          useHTML: true,
        },
        events: {
          click: function (event) {

              if(localStorage.ui_pref == 'ri_v3'){
                var searchfilter = getFilterDocumentSSLR2();
    
                if(searchfilter.section == "overall"){
                  searchfilter.section = "";
                }
                
                var monthYr = event.point.category.name
                var month = monthYr.slice(0, 3);
                var year = monthYr.slice(4, 8);
                var selMthNo = textMthtoNum[month];
  
                linkWinTitle = 'TOTAL MAN HOURS WITHOUT LTI (HRS) - Cumulative Man-Hours'
                linkName = 'dash_cons_SMH_card'
                linkParamArr = processFilterParamArr([searchfilter.section, year, selMthNo, '', '', event.point.options.y])
                window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle);
              }

            }
        }
      }]
    });
    chart.updateFlag = true;
}

/**
 * changed the CUMULATIVE TOTAL MAN-HOURS WITH LTI to TOTAL MAN-HOURS
 * use the drawTotalManHrsWOLTI() function instead
 */
function updateTtlManHrsCard(data){
  console.log(data.length);
    if (data) {
      if(data.length == 0){
        CumulTotalManHrsWithTI = `<span style="cursor:default">0</span>`;
        CumulTotalManHrsWOLTI = `<span style="cursor:default">0</span>`;
      }

      for (const [idx, ele] of Object.entries(data)) {
        if(idx == "all") continue;

        if(idx == idx){
          CumulTotalManHrsWithTI = `<span style="cursor:default">`+ele.total_mh_wtlti+`</span>`;
          CumulTotalManHrsWOLTI = `<span style="cursor:default">`+ele.culmulative_mh_wtlti+`</span>`;
      }
    }
    $('#CumulTotalManHrsWOLTI').html(CumulTotalManHrsWOLTI); 
    $('#CumulTotalManHrsWithTI').html(CumulTotalManHrsWithTI); 
  } 
}

function drawOverallIncidentsAndAccidentsRecord(data, monthYear){
  var dataArr = [];
  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      var tempArr = {name: idx, y: (ele) ? parseInt(ele) : 0};
      dataArr.push(tempArr);
    }
  }

 var chart = Highcharts.chart('OverallIncidentsAndAccidentsRecord', {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      marginTop: 10,
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
                  text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>OVERALL ACCIDENT / INCIDENTS RECORD ('+monthYear+')</span>'
                }
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
                  text: '<span class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>OVERALL ACCIDENT / INCIDENTS RECORD ('+monthYear+')</span>'
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
      text: '<span class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>OVERALL ACCIDENT / INCIDENTS RECORD ('+monthYear+')</span>'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        },
        size:'70%'
      }
    },
    credits: false,
    series: [{
      colorByPoint: true,
      cursor : 'pointer',
      data: dataArr,
      events: {
        click: function (event) {
            if(localStorage.ui_pref == 'ri_v3'){
              var searchfilter = getFilterDocumentSSLR2();
              if(searchfilter.section == "overall"){
                searchfilter.section = "";
              }
  
              var category = '';
              if(event.point.name == ''){
                category = '-';
              }else if(event.point.name == 'Incident (Property Damage)'){
                category = 'IPD';
              }else{
                category = event.point.name;
              }
  
              linkWinTitle = 'OVERALL ACCIDENT / INCIDENTS RECORD'
              linkName = 'dash_cons_INC_card'
              linkParamArr = processFilterParamArr(['', searchfilter.section, searchfilter.dateFrom, searchfilter.dateTo, category])
              window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle + " - " + event.point.name);
            }
          }
      }
    }]
  });
  chart.updateFlag = true;
}

function updateIncidentCard(fatal = 0, ttlInc = 0){
    var NumOfFatality = fatal;
    var AccidentAndIncidentForm = ttlInc;

    if(NumOfFatality > 0){
      NumOfFatality = `<span class="clickableCard" onclick="conOpLink('INC','Yes', '')">`+fatal+`</span>`;
    }

    if(AccidentAndIncidentForm > 0){
      AccidentAndIncidentForm = `<span class="clickableCard" onclick="conOpLink('INC','', '')">`+ttlInc+`</span>`;
    }
    
    $('#NumOfFatality').html(NumOfFatality); 
    $('#AccidentAndIncidentForm').html(AccidentAndIncidentForm); 
}

function drawHSEWalkaboutAndInduction(data, monthYear){
  var catArr = [];
  var indDataArr = [];
  var walkDataArr = [];

  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      catArr.push(idx);
      indDataArr.push((ele.safeInduction) ? parseInt(ele.safeInduction) : 0);
      walkDataArr.push((ele.safeWalkabout) ? parseInt(ele.safeWalkabout) : 0);
    }
  }

  var chart = Highcharts.chart('HSEWalkaboutAndInduction', {
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
                      text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>HSET WALKABOUT AND INDUCTION ('+monthYear+')</span>'
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
                      text: '<span class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>HSET WALKABOUT AND INDUCTION ('+monthYear+')</span>'
                    },
                    legend: {
                      symbolHeight: 12,
                      symbolWidth: 12,
                      itemStyle: {
                        fontSize: '12px',
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
          text: '<span class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>HSET WALKABOUT AND INDUCTION ('+monthYear+')</span>'
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

        credits: false,
        
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:var(--on-surface);padding:0">{series.name}: </td>' +
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
          name: 'Safety Induction',
          data: indDataArr,
          cursor : 'pointer',
          color: Highcharts.getOptions().colors[0],
          dataLabels: {
            formatter: function() {
              return '<span class="showLabel">'+this.y+'</span>';
            },
            enabled: true,
            useHTML: true,
          },
          events: {
            click: function (event) {

                if(localStorage.ui_pref = 'ri_v3'){
                  var searchfilter = getFilterDocumentSSLR2();
      
                  if(searchfilter.section == "overall"){
                    searchfilter.section = "";
                  }
                  
                  var monthYr = event.point.category.name
                  var month = monthYr.slice(0, 3);
                  var year = monthYr.slice(4, 8);
                  var selMthNo = textMthtoNum[month];
    
                  linkWinTitle = 'HSET WALKABOUT AND INDUCTION - Safety Induction'
                  linkName = 'dash_cons_SA_card'
                  linkParamArr = processFilterParamArr([searchfilter.section, year, selMthNo])
                  window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle);
                }
            }
          }
        }, {
          name: 'Safety Walkabout',
          data: walkDataArr,
          color: Highcharts.getOptions().colors[1],
          dataLabels: {
            formatter: function() {
              return '<span class="showLabel">'+this.y+'</span>';
            },
            enabled: true,
            useHTML: true,
          },
          events: {
            click: function (event) {
                if(localStorage.ui_pref == 'ri_v3'){
                  var searchfilter = getFilterDocumentSSLR2();
                  var monthYr = event.point.category.name
                  var month = monthYr.slice(0, 3);
                  var year = monthYr.slice(4, 8);
                  var selMthNo = textMthtoNum[month];
    
                  linkWinTitle = 'HSET WALKABOUT AND INDUCTION - Safety Walkabout'
                  linkName = 'dash_cons_SA_card'
                  linkParamArr = processFilterParamArr([searchfilter.section, year, selMthNo])
                  window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle);
                }
            }
          }
        }]
      });
      chart.updateFlag = true;
}

function drawSAChart(data , monthYear){
  var catArr = [];
  var dataArr = [];
  var tempArr2 = [];

  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      catArr.push(idx);
      for (const [idx2, ele2] of Object.entries(ele)) {
        if (!tempArr2[idx2]) tempArr2[idx2] = [];
        tempArr2[idx2].push((ele2) ? parseInt(ele2) : 0);
      }
    }

    for (const [idx3, ele3] of Object.entries(tempArr2)) {
      if (idx3 == 'CIDB Green Card Induction Course'){
        clr= Highcharts.getOptions().colors[1];
      }else if(idx3 == "ERT Oil Spilage"){
        clr=Highcharts.getOptions().colors[2]
      }else if(idx3 == "ERT Fire Evacuation and Response"){
        clr=Highcharts.getOptions().colors[3]
      }else if(idx3 == "ERT Accident Road Plant"){
        clr=Highcharts.getOptions().colors[4]
      }else if(idx3 == "Fire Extinguisher Training"){
        clr=Highcharts.getOptions().colors[5]
      }else if(idx3 == "Safety Awareness Programme"){
        clr=Highcharts.getOptions().colors[6]
      }
      var tempArr = {name: idx3, data: ele3, color: clr,
      events: {
        click: function (event){
          if(localStorage.ui_pref == 'ri_v3'){
            var searchfilter = getFilterDocumentSSLR2();
            linkWinTitle = 'HSET ACTIVITY PROGRAM'
            linkName = 'dash_cons_SA_card'
  
            linkParamArr = processFilterParamArr([searchfilter.section, searchfilter.year, searchfilter.month, event.point.category.name])
            window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +" - "+ event.point.category.name);
          }
        }
      }};
      dataArr.push(tempArr);
    }
  }
  
  var chart = Highcharts.chart('HSEActivityProgram', {
      chart: {
        type: 'column',
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
                    text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>HSET ACTIVITY / PROGRAM ('+monthYear+')</span>'
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
              } else if (chart.updateFlag) {
                chart.updateFlag = false;
    
                chart.update({
                  title: {
                    text: '<span class="showLabel" style="text-align: center">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>HSET ACTIVITY / PROGRAM ('+monthYear+')</span>'
                  },
                  legend: {
                    floating: true,
                    verticalAlign: 'top',
                    symbolHeight: 7,
                    symbolWidth: 7,
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
        text: '<span class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>HSET ACTIVITY / PROGRAM ('+monthYear+')</span>'
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
      },legend: {
        align: 'center',
        floating: true,
        y: 10,
        verticalAlign: 'top',
        itemStyle : {
          fontSize : 9
        }
      },
      credits: false,
      tooltip: {
        pointFormat: '<div style="display: flex; flex-direction: row;"><div style="color:var(--on-surface);padding:0;font-size: 10px;">{series.name}: </div>' +
                      '<div style="padding:0;font-size: 10px;color:var(--on-surface)"><b>{point.y:.1f}</b></div></div>',
        // footerFormat: '</div>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
          series: {
            dataLabels: {
              formatter: function() {
                return '<span class="showLabel" style="font-size: 10px">'+this.y+'</span>';
              },
              enabled: true,
              useHTML: true,
            }
          }
        },
      },
      series: dataArr
    });
    chart.updateFlag = true;
}

function drawHSECommitteeMeetingChart(data, monthYear){
  var catArr = [];
  var dataArr = [];

  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      catArr.push(idx);
      dataArr.push((ele) ? parseInt(ele) : 0);
    }
  }
  var chart = Highcharts.chart('HSECommitteeMeeting', {
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
                  text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>HSET COMMITTEE MEETING ('+monthYear+')</span>'
                }
              })
  
              chart.updateFlag = true;
            }
            else if (chart.updateFlag) {
              chart.updateFlag = false;
  
              chart.update({
                title: {
                  text: '<span class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>HSET COMMITTEE MEETING ('+monthYear+')</span>'
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
      text: '<div class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>HSET COMMITTEE MEETING ('+monthYear+')</div>'
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
      credits: false,
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:var(--on-surface);padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
			    colorByPoint: true,
        },
        series: {
          dataLabels: {
            formatter: function() {
              return '<span class="showLabel" style="font-size: 10px">'+this.y+'</span>';
            },
            enabled: true,
            useHTML: true,
          }
        }
      },
      series: [{
        name: 'Commitee Meeting',
        showInLegend: false,
        data: dataArr,
        events: {
          click: function (event) {
              if(localStorage.ui_pref == 'ri_v3'){
                var searchfilter = getFilterDocumentSSLR2();
                linkWinTitle = 'HSET COMMITTEE Commitee Meeting'
                linkName = 'dash_cons_SA_card'
  
                linkParamArr = processFilterParamArr([searchfilter.section, searchfilter.year, searchfilter.month, event.point.category.name, 'Yes'])
                window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +" - "+ event.point.category.name);
              }
            }
        }
      }]
    });
    chart.updateFlag = true
}

function drawHSEToolboxMeetingChart(data, monthYear){
  var catArr = [];
  var dataArr = [];

  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      catArr.push(idx);
      dataArr.push((ele) ? parseInt(ele) : 0);
    }
  }
  var chart = Highcharts.chart('HSEToolboxMeeting', {
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
                    text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>HSET TOOLBOX MEETING ('+monthYear+')</span>'
                  }
                })
    
                chart.updateFlag = true;
              }
              else if (chart.updateFlag) {
                chart.updateFlag = false;
    
                chart.update({
                  title: {
                    text: '<span class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>HSET TOOLBOX MEETING ('+monthYear+')</span>'
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
        text: '<span class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>HSET TOOLBOX MEETING ('+monthYear+')</span>'
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
      credits: false,
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:var(--on-surface);padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
			    colorByPoint: true,

        },
        series: {
          dataLabels: {
            formatter: function() {
              return '<span class="showLabel">'+this.y+'</span>';
            },
            enabled: true,
            useHTML: true,
          }
        }
      },
      series: [{
        name: 'Toolbox Briefing',
        showInLegend: false,
        data: dataArr,
        events: {
          click: function (event) {
              if(localStorage.ui_pref == 'ri_v3'){
                var searchfilter = getFilterDocumentSSLR2();
                linkWinTitle = 'HSET COMMITTEE Toolbox Briefing'
                linkName = 'dash_cons_SA_card'
  
                linkParamArr = processFilterParamArr([searchfilter.section, searchfilter.year, searchfilter.month, event.point.category.name, '', 'Yes'])
                window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +" - "+ event.point.category.name);
              }
            }
        }
      }]
    });
    chart.updateFlag = true
}

function drawHSEActiveTrafficDiversionChart(data, monthYear){
  var catArr = [];
  var dataArr = [];

  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      catArr.push(idx);
      dataArr.push((ele) ? parseInt(ele) : 0);
    }
  }
  var chart = Highcharts.chart('HSEActiveTrafficDiversion', {
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
                    text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>HSET ACTIVE TRAFFIC ('+monthYear+')</span>'
                  }
                })
    
                chart.updateFlag = true;
              }
              else if (chart.updateFlag) {
                chart.updateFlag = false;
    
                chart.update({
                  title: {
                    text: '<span class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>HSET ACTIVE TRAFFIC ('+monthYear+')</span>'
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
        text: '<span class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>HSET ACTIVE TRAFFIC ('+monthYear+')</span>'
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
      credits: false,
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:var(--on-surface);padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
			    colorByPoint: true,

        }
      },
      series: [{
        name: 'Traffic Diversion',
        showInLegend: false,
        data: dataArr,
        dataLabels: {
          formatter: function() {
            return '<span class="showLabel">'+this.y+'</span>';
          },
          enabled: true,
          useHTML: true,
        },
        events: {
          click: function (event) {
              if(localStorage.ui_pref == 'ri_v3'){
                var searchfilter = getFilterDocumentSSLR2();
                linkWinTitle = 'HSET COMMITTEE Traffic Diversion'
                linkName = 'dash_cons_SA_card'
  
                linkParamArr = processFilterParamArr([searchfilter.section, searchfilter.year, searchfilter.month, event.point.category.name, '', '', 'Yes'])
                window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +" - "+ event.point.category.name);
              }
            }
        }
      }]
    });
    chart.updateFlag = true
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

function refreshInformation(packid = 'overall', sectionId = 'overall', year = 'all', month = 'all') {
    // incident
    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year;

    var incidentData = (HSEData.IR && HSEData.IR[packid] && HSEData.IR[packid][sectionId]) ? HSEData.IR[packid][sectionId] : [];
    var incidentCatChartData = (incidentData.byCat && incidentData.byCat[year] && incidentData.byCat[year][month]) ? incidentData.byCat[year][month] : [];
    drawOverallIncidentsAndAccidentsRecord(incidentCatChartData, dataYearMonth);
    var totalCnt = (incidentData.card && incidentData.card[year] && incidentData.card[year][month] && incidentData.card[year][month].total) ? incidentData.card[year][month].total :0;
    updateIncidentCard(incidentCatChartData.Fatality, totalCnt);

    // safety man hours
    ttlManHrsWOLtiData = (HSEData.ttlManHrsWOLTI && HSEData.ttlManHrsWOLTI[packid] && HSEData.ttlManHrsWOLTI[packid][sectionId]) ? HSEData.ttlManHrsWOLTI[packid][sectionId] : [];
    ttlManHrsWOLtiChartData = (ttlManHrsWOLtiData.chart && ttlManHrsWOLtiData.chart[year] && ttlManHrsWOLtiData.chart[year][month]) ? ttlManHrsWOLtiData.chart[year][month] : [];
    drawTotalManHrsWOLTI(ttlManHrsWOLtiChartData, dataYearMonth);
    // ttlManHrsWOLtiCardData = (ttlManHrsWOLtiData.card && ttlManHrsWOLtiData.card[year] && ttlManHrsWOLtiData.card[year][month]) ? ttlManHrsWOLtiData.card[year][month] : [];
    updateTtlManHrsCard(ttlManHrsWOLtiChartData);

    // safety activity
    var saData = (HSEData.activity && HSEData.activity[packid] && HSEData.activity[packid][sectionId]) ? HSEData.activity[packid][sectionId] : [];
    var saDataYearMonth = (saData.activityChart && saData.activityChart[year] && saData.activityChart[year][month]) ? saData.activityChart[year][month] : [];
    drawSAChart(saDataYearMonth, dataYearMonth);

    var walkaboutChartData = (saData.safetyWalkInd && saData.safetyWalkInd[year] && saData.safetyWalkInd[year][month]) ? saData.safetyWalkInd[year][month] : [];
    drawHSEWalkaboutAndInduction(walkaboutChartData, dataYearMonth);
    // var saActCharData = (saData.activityChart)

    var saCMChartData = (saData.hseCommMeet && saData.hseCommMeet[year] && saData.hseCommMeet[year][month]) ? saData.hseCommMeet[year][month] : [];
    drawHSECommitteeMeetingChart(saCMChartData, dataYearMonth);
    var saTBChartData = (saData.hseToolboxBriefing && saData.hseToolboxBriefing[year] && saData.hseToolboxBriefing[year][month]) ? saData.hseToolboxBriefing[year][month] : [];
    drawHSEToolboxMeetingChart(saTBChartData, dataYearMonth);
    var saTCChartData = (saData.hseTrafficController && saData.hseTrafficController[year] && saData.hseTrafficController[year][month]) ? saData.hseTrafficController[year][month] : [];
    drawHSEActiveTrafficDiversionChart(saTCChartData, dataYearMonth);
}

function refreshDashboard(){
  var selWPC = $("#wpcFilter").val();
  var selYear = $('#yearFilter').val();
	var selSection = $("#sectionFilter").val();
  if(selWPC == 'overall'){
		selSection == 'overall';
	}
	if (selYear == 'all') {
		$('#monthFilter').prop("disabled", true);	
		$('#monthFilter').val('all');
	}else{
		$('#monthFilter').prop("disabled", false);
	}
	var selMonth = $('#monthFilter').val();
	refreshInformation(selWPC, selSection, selYear, selMonth);
}

function refreshFromv3 (filterArr){
  var wpc = filterArr.wpc;
  var section = filterArr.section;
  var year = filterArr.year;
  var month = filterArr.month;

  refreshInformation(wpc, section, year, textMonthtoNum[month]);
}

$(function () {
	$.ajax({
		type: "POST",
		url: 'chartData.json.php',
		dataType: 'json',
		data: {
			page: "HSE"
		},
		success: function (obj) {
			if (obj.status && obj.status == 'ok') {
				HSEData = obj.data;
				var sectionData = (HSEData.section && HSEData.section['overall']) ? HSEData.section['overall'] : [];
				populateSectionFilter(sectionData);
				refreshInformation();
			}
		}
	});

	// only update section filter when overall changed
	$("#wpcFilter").change(function () {
		var sectionData = (HSEData.section && HSEData.section[$(this).val()]) ? HSEData.section[$(this).val()] : [];
		populateSectionFilter(sectionData);
			refreshDashboard()

	})

})



