var HSEData;
var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};
var CaptextMonthtoNum = {"JAN":"01","FEB":"02","MAR":"03","APR":"04","MAY":"05","JUN":"06","JULY":"07","AUG":"08","SEP":"09","OCT":"10","NOV":"11","DEC":"12"};
var monthFulltext = {'01':"January",'02':"February",'03':"March",'04':"April",'05':"May",'06':"June",'07':"July",'08':"August",'09':"September",'10':"October",'11':"November",'12':"December"}

function conOpLink(process, param='', title=''){
    if(localStorage.ui_pref != "ri_v3") return;

    var linkName = '';
    var linkWinTitle = '';
    var linkParamArr = '';
    var searchFilter = getSearchFilterSabah();
    var addtlparam = '';
    switch (process) {
        case 'SMH':
            linkWinTitle = "HSET"
            linkName = 'dash_cons_SMH_card'
            var monthNo =  '';
            var monthFull = '';
            if(searchFilter.dateMon != ''){
                monthNo = textMonthtoNum[searchFilter.dateMon];
                monthFull = monthFulltext[monthNo];
            }
            if(param){ // additional parameter - for project dashboard
              var ids = param.split(',')
              $.each(ids, function( key, value ) {
                addtlparam += '&d-3884178-fn_record_id='+value;
              });
            }
            linkParamArr = processFilterParamArr([searchFilter.dateYr, monthNo, monthFull])
        break;
        case 'Inc':
            linkWinTitle = "Incident"
            linkName = 'dash_cons_INC_card'
            linkParamArr = processFilterParamArr([searchFilter.dateFrom, searchFilter.dateTo])
        break;
  } 
  window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle + " - " + title, addtlparam);
}

function drawTotalManHrsWOLTI(monthYear, data){
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
  
            if (document.fullscreenElement && chart.updateFlag) {
              chart.updateFlag = false;
              chart.update({
                chart: {
                  marginTop: 90
                },
                title: {
                  text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>TOTAL MAN HOURS WITHOUT LTI (HRS) ('+monthYear+')</span>'
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
                  text: '<span class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>TOTAL MAN HOURS WITHOUT LTI (HRS) ('+monthYear+')</span>'
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
        crosshair: true,
        labels: {
          style: {
            fontSize: 8,
          }
        }
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
        pointFormat: '<tr>' +
                      '<td style="color:{series.color};padding:0">{series.name}: </td>' +
                      '<td style="padding:0"><b>{point.y}</b></td>' +
                    '</tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        },
        series: {
          dataLabels: {
            formatter: function() {
              return '<span class="showLabel" style="font-size: 12px">'+this.y+'</span>';
            },
            enabled: true,
            useHTML: true,
          }
        }
      },
      series: [{
        name: 'Total Man-Hours',
        data: ttlDataArr,
        cursor : 'pointer',
        color: Highcharts.getOptions().colors[0],
        events: {
          click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;

            var this_date = event.point.category.name.split('-');
						var month = this_date[0];
						var year = this_date[1];
            var monthNo = CaptextMonthtoNum[month];
            var monthFull = monthFulltext[monthNo];

            var linkParamArr = processFilterParamArr([year, monthNo, monthFull])
            window.parent.widgetConopOpen("Total Man Hours without LTI", "dash_cons_SMH_card", linkParamArr, "Total Man Hours without LTI" + '-' + event.point.category.name);
          }
        }
      }, {
        name: 'Cumulative Man-Hours',
        data: cumulDataArr,
        color: Highcharts.getOptions().colors[1],
        cursor : 'pointer',
        events: {
          click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;

            var this_date = event.point.category.name.split('-');
						var month = this_date[0];
						var year = this_date[1];
            var monthNo = CaptextMonthtoNum[month];
            var monthFull = monthFulltext[monthNo];

            var linkParamArr = processFilterParamArr([year, monthNo, monthFull])
            window.parent.widgetConopOpen("Total Man Hours without LTI", "dash_cons_SMH_card", linkParamArr, "Total Man Hours without LTI" + '-' + event.point.category.name);
          }
        }
      }]
    });
    chart.updateFlag = true
}

function updateTtlManHrsCard(data){
    var dataIds  = [];
    var recordIds = [];
    if(data.raw){
      for (const [idx, ele] of Object.entries(data.raw)) {
        if(ele.record_id != ''){
          dataIds.push(ele.record_id);
        }
      }
      if(dataIds.length > 0){
        recordIds = dataIds.join(',');
      }
    }

	  var CumulTotalManHrsWOLTI = ((data.woLTI) ? formatThousand(data.woLTI) : 0);
	  var CumulTotalManHrsWithTI = ((data.wLTI) ? formatThousand(data.wLTI) : 0);

    $('#CumulTotalManHrsWOLTI').html(CumulTotalManHrsWOLTI); 
    $('#CumulTotalManHrsWithTI').html(CumulTotalManHrsWithTI); 
}

function drawOverallIncidentsAndAccidentsRecord(monthYear, data){
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
                text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>OVERALL ACCIDENT / INCIDENTS RECORD ('+monthYear+')</span>'
              }
            })

            chart.updateFlag = true;
          }
          else if (chart.updateFlag) {
            chart.updateFlag = false;

            chart.update({
              title: {
                text: '<span class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>OVERALL ACCIDENT / INCIDENTS RECORD ('+monthYear+')</span>'
              }
            })
            chart.updateFlag = true;
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
      pointFormat: '{series.name}: <b>{point.y}</b>'
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
          format: '<b>{point.name}</b>: {point.y}'
        }								
      }
    },
    credits: false,
    series: [{
      name: 'Total',
      colorByPoint: true,
      data: dataArr,
      cursor : 'pointer',
      events: {
        click: function (event) {
          if(localStorage.ui_pref != "ri_v3") return;

          var filter = getSearchFilterSabah();
          linkWinTitle = 'Overall Accidents/Incidents'
          linkName = 'dash_cons_INC_cat_card'
          linkParamArr = processFilterParamArr([filter.dateFrom, filter.dateTo, event.point.name])

          window.parent.widgetConopOpen("Incident", "dash_cons_INC_cat_card", linkParamArr, "Incident" + ' - ' + event.point.name);
        }
      }
    }]
  });
  chart.updateFlag = true;
}

function updateIncidentCard(fatal = 0, ttlInc = 0){
	var NumOfFatality = formatThousand(fatal)
	var AccidentAndIncidentForm = `<span class="clickableCard" onclick="conOpLink('Inc', '', 'Total Accidents/Incidents')">`+(formatThousand(ttlInc))+`</span>`;

  $('#NumOfFatality').html(NumOfFatality); 
  $('#AccidentAndIncidentForm').html(AccidentAndIncidentForm); 
}

function drawHSEWalkaboutAndInduction(monthYear, data){
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
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
          },
          series: {
            dataLabels: {
              formatter: function() {
                return '<span class="showLabel" style="font-size: 12px">'+this.y+'</span>';
              },
              enabled: true,
              useHTML: true,
            }
          }
        },
        series: [{
          name: 'Safety Induction',
          data: indDataArr,
          cursor : 'pointer',
          color: Highcharts.getOptions().colors[0],
          events: {
            click: function (event) {
              if(localStorage.ui_pref != "ri_v3") return;

              var this_date = event.point.category.name.split('-');
              var month = this_date[0];
              var year = this_date[1];
              var monthNo = CaptextMonthtoNum[month];
              var month = monthFulltext[monthNo];
 
              var linkParamArr = processFilterParamArr([year, monthNo]);
              window.parent.widgetConopOpen("HSET", "dash_cons_SA_card", linkParamArr, "HSET" + ' - ' + event.point.category.name);
            }
          }
        }, {
          name: 'Safety Walkabout',
          data: walkDataArr,
          cursor : 'pointer',
          color: Highcharts.getOptions().colors[1],
          events: {
            click: function (event) {
              if(localStorage.ui_pref != "ri_v3") return;

              var this_date = event.point.category.name.split('-');
              var month = this_date[0];
              var year = this_date[1];
              var monthNo = CaptextMonthtoNum[month];
              var month = monthFulltext[monthNo];

              var linkParamArr = processFilterParamArr([year, monthNo]);
              window.parent.widgetConopOpen("HSET", "dash_cons_SA_card", linkParamArr, "HSET" + '- ' + event.point.category.name);
            }
          }
        }]
    });
    chart.updateFlag = true;
}

function drawSAChart(monthYear, data){
  var catArr = [];
  var dataArr = [];
  var tempArr2 = [];

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
    Highcharts.setOptions({
      colors: ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"],
    });
  }


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
        
        var tempArr = {
                        name: idx3,
                        data: ele3,color: clr,
                        cursor: 'pointer',
                        events: {
                          click: function (event) {   
                            if(localStorage.ui_pref != "ri_v3") return;
                                       
                            var linkParamArr = processFilterParamArr([]);
                            window.parent.widgetConopOpen("HSET", "dash_cons_SA_card", linkParamArr, "HSET" + ' - ' +idx3);
                          }
                        }
                      };
        dataArr.push(tempArr);
    }
  }
  
  var chart = Highcharts.chart('HSEActivityProgram', {
      chart: {
        type: 'column',
        marginTop: 50,
        events: {
          render() {
            var chart = this;
  
            if (document.fullscreenElement && chart.updateFlag) {
              chart.updateFlag = false;
              chart.update({
                chart:{
                  marginTop: 90,
                  marginBottom: 100,
                },
                title: {
                  text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>HSET PROGRAM AND RESPONSE ('+monthYear+')</span>'
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
                  text: '<span class="showLabel" style="text-align: center">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>HSET PROGRAM AND RESPONSE ('+monthYear+')</span>'
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
      },
      title: {
        useHTML: true,
        enabled: true,
        text: '<span class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>HSET PROGRAM AND RESPONSE ('+monthYear+')</span>'
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
        },
        series: {
          dataLabels: {
            formatter: function() {
              return '<span class="showLabelSmall" style="font-size:8px">'+this.y+'</span>';
            },
            enabled: true,
            useHTML: true,
          }
        }
      },
      series: dataArr,
    });
    chart.updateFlag = true;
}

function drawHSECommitteeMeetingChart(monthYear, data){
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
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
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
        cursor: 'pointer',
        events: {
          click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;
            
            var monthNo = '';
            var monthFull = '';
            var packageName = event.point.category.name;
            var filter = getSearchFilterSabah();
            if(filter.dateMon != ''){
                monthNo = textMonthtoNum[filter.dateMon];
                monthFull = monthFulltext[monthNo];
            }
            if (localStorage.isParent == "isParent") {
              var linkParamArr = ([packageName, filter.dateYr, monthNo, 'Yes'])
            }else{
              var linkParamArr = processFilterParamArr([filter.dateYr, monthNo, 'Yes'])
            }
            window.parent.widgetConopOpen("HSET", "dash_cons_SA_card", linkParamArr, "HSET" + ' - ' + 'Commitee Meeting');
          }
        }
      }]
    });
    chart.updateFlag = true;
}

function drawHSEToolboxMeetingChart(monthYear, data){
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
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
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
        cursor : 'pointer',
        events: {
          click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;

            var monthNo = '';
            var monthFull = '';
            var packageName = event.point.category.name;
            var filter = getSearchFilterSabah();
            if(filter.dateMon != ''){
                monthNo = textMonthtoNum[filter.dateMon];
                monthFull = monthFulltext[monthNo];
            }
            if (localStorage.isParent == "isParent") {
              var linkParamArr = ([packageName, filter.dateYr, monthNo, '', "Yes"])
            }else{
              var linkParamArr = processFilterParamArr([filter.dateYr, monthNo, '', "Yes"])
            }
            window.parent.widgetConopOpen("HSET", "dash_cons_SA_card", linkParamArr, "HSET" + ' - ' + 'Toolbox Briefing');
          }
        }
      }]
    });
    chart.updateFlag = true;
}

function drawHSEPreToolboxChart(monthYear, data){
  var catArr = [];
  var dataArr = [];

  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      catArr.push(idx);
      dataArr.push((ele) ? parseInt(ele) : 0);
    }
  }

  var chart = Highcharts.chart('HSEPreToolbox', {
      chart: {
        type: 'column',
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
                  text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>PRE-TOOLBOX MEETING ('+monthYear+')</span>'
                }
              })
  
              chart.updateFlag = true;
            }
            else if (chart.updateFlag) {
              chart.updateFlag = false;
  
              chart.update({
                title: {
                  text: '<span class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>PRE-TOOLBOX MEETING ('+monthYear+')</span>'
                }
              })
              chart.updateFlag = true;
            }
          }
        }
      },
      title: {
        useHTML: true,
        enabled: true,
        text: '<span class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>PRE-TOOLBOX MEETING ('+monthYear+')</span>'
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
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
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
        name: 'Pre Toolbox',
        showInLegend: false,
        data: dataArr,
        cursor : 'pointer',
        events: {
          click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;

            var monthNo = '';
            var monthFull = '';
            var packageName = event.point.category.name;
            var filter = getSearchFilterSabah();
            if(filter.dateMon != ''){
                monthNo = textMonthtoNum[filter.dateMon];
                monthFull = monthFulltext[monthNo];
            }
            if (localStorage.isParent == "isParent") {
              var linkParamArr = ([packageName, filter.dateYr, monthNo, '', '', '', 'Yes'])
            }else{
              var linkParamArr = processFilterParamArr([filter.dateYr, monthNo, '', '', '', 'Yes'])
            }
            window.parent.widgetConopOpen("HSET", "dash_cons_SA_card", linkParamArr, "HSET" + ' - ' + 'Pre Toolbox');
          }
        }
      }]
    });
    chart.updateFlag = true;
}

function drawHSEActiveTrafficDiversionChart(monthYear, data){
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
  
            if (document.fullscreenElement && chart.updateFlag) {
              chart.updateFlag = false;
              chart.update({
                chart:{
                  marginTop: 90
                },
                title: {
                  text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>SAFETY STAND DOWN ('+monthYear+')</span>'
                }
              })
  
              chart.updateFlag = true;
            }
            else if (chart.updateFlag) {
              chart.updateFlag = false;
  
              chart.update({
                title: {
                  text: '<span class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>SAFETY STAND DOWN ('+monthYear+')</span>'
                }
              })
              chart.updateFlag = true;
            }
          }
        }
      },
      title: {
        useHTML: true,
        enabled: true,
        text: '<span class="showLabel">Health, Safety, Environment and Traffic<br>'+localStorage.p_name+'<br>SAFETY STAND DOWN ('+monthYear+')</span>'
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
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
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
        name: 'Safety Stand Down',
        showInLegend: false,
        data: dataArr,
        cursor : 'pointer',
        events: {
          click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;

            var monthNo = '';
            var monthFull = '';
            var packageName = event.point.category.name;
            var filter = getSearchFilterSabah();
            if(filter.dateMon != ''){
                monthNo = textMonthtoNum[filter.dateMon];
                monthFull = monthFulltext[monthNo];
            }
            if (localStorage.isParent == "isParent") {
              var linkParamArr = ([packageName, filter.dateYr, monthNo, '', '', 'Yes'])
            }else{
              var linkParamArr = processFilterParamArr([filter.dateYr, monthNo, '', '', 'Yes'])
            }
            window.parent.widgetConopOpen("HSET", "dash_cons_SA_card", linkParamArr, "HSET" + ' - ' + 'Safety Stand Down');
          }
        }
      }]
    });
    chart.updateFlag = true;
}

function refreshInformation(packid = 'overall', sectionId = 'overall', year = 'all', month = 'all') {
    // incident
    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year;
    var incidentData = (HSEData.IR && HSEData.IR[packid] && HSEData.IR[packid][sectionId]) ? HSEData.IR[packid][sectionId] : [];
    var incidentCatChartData = (incidentData.byCat && incidentData.byCat[year] && incidentData.byCat[year][month]) ? incidentData.byCat[year][month] : [];
    drawOverallIncidentsAndAccidentsRecord(dataYearMonth, incidentCatChartData);
    var fatalityCnt = (incidentData.fatalityCnt && incidentData.fatalityCnt[year] && incidentData.fatalityCnt[year][month] && incidentData.fatalityCnt[year][month].total) ? incidentData.fatalityCnt[year][month].total :0;
    var totalCnt = (incidentData.card && incidentData.card[year] && incidentData.card[year][month] && incidentData.card[year][month].total) ? incidentData.card[year][month].total :0;
    updateIncidentCard(fatalityCnt, totalCnt);

    // safety man hours
    ttlManHrsWOLtiData = (HSEData.ttlManHrsWOLTI && HSEData.ttlManHrsWOLTI[packid] && HSEData.ttlManHrsWOLTI[packid][sectionId]) ? HSEData.ttlManHrsWOLTI[packid][sectionId] : [];
    ttlManHrsWOLtiChartData = (ttlManHrsWOLtiData.chart && ttlManHrsWOLtiData.chart[year] && ttlManHrsWOLtiData.chart[year][month]) ? ttlManHrsWOLtiData.chart[year][month] : [];
    drawTotalManHrsWOLTI(dataYearMonth, ttlManHrsWOLtiChartData);
    ttlManHrsWOLtiCardData = (ttlManHrsWOLtiData.card && ttlManHrsWOLtiData.card[year] && ttlManHrsWOLtiData.card[year][month]) ? ttlManHrsWOLtiData.card[year][month] : [];
    updateTtlManHrsCard(ttlManHrsWOLtiCardData);

    // safety activity
    var saData = (HSEData.activity && HSEData.activity[packid] && HSEData.activity[packid][sectionId]) ? HSEData.activity[packid][sectionId] : [];
    var saDataYearMonth = (saData.activityChart && saData.activityChart[year] && saData.activityChart[year][month]) ? saData.activityChart[year][month] : [];
    drawSAChart(dataYearMonth, saDataYearMonth);

    var walkaboutChartData = (saData.safetyWalkInd && saData.safetyWalkInd[year] && saData.safetyWalkInd[year][month]) ? saData.safetyWalkInd[year][month] : [];
    drawHSEWalkaboutAndInduction(dataYearMonth, walkaboutChartData);
    // var saActCharData = (saData.activityChart)

    var saCMChartData = (saData.hseCommMeet && saData.hseCommMeet[year] && saData.hseCommMeet[year][month]) ? saData.hseCommMeet[year][month] : [];
    drawHSECommitteeMeetingChart(dataYearMonth, saCMChartData);
    var saTBChartData = (saData.hseToolboxBriefing && saData.hseToolboxBriefing[year] && saData.hseToolboxBriefing[year][month]) ? saData.hseToolboxBriefing[year][month] : [];
    drawHSEToolboxMeetingChart(dataYearMonth, saTBChartData);
    var saPreTBChartData = (saData.hsePreToolbox && saData.hsePreToolbox[year] && saData.hsePreToolbox[year][month]) ? saData.hsePreToolbox[year][month] : [];
    drawHSEPreToolboxChart(dataYearMonth, saPreTBChartData);
    var saTCChartData = (saData.hseSafetyStandDown && saData.hseSafetyStandDown[year] && saData.hseSafetyStandDown[year][month]) ? saData.hseSafetyStandDown[year][month] : [];
    drawHSEActiveTrafficDiversionChart(dataYearMonth, saTCChartData);
}

function refreshDashboard(){
  var selWPC = $("#wpcFilter").val();
  var selYear = $('#yearFilter').val();
	var selSection = 'overall';
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
            refreshInformation();
        }
      }
  });
})



