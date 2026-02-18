var HSEData;
var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};
var CaptextMonthtoNum = {"JAN":"01","FEB":"02","MAR":"03","APR":"04","MAY":"05","JUN":"06","JULY":"07","AUG":"08","SEP":"09","OCT":"10","NOV":"11","DEC":"12"};
var monthFulltext = {'01':"January",'02':"February",'03':"March",'04':"April",'05':"May",'06':"June",'07':"July",'08':"August",'09':"September",'10':"October",'11':"November",'12':"December"}
var monthTextToNum = {
  "January": "01",
  "February": "02",
  "March": "03",
  "April": "04",
  "May": "05",
  "June": "06",
  "July": "07",
  "August": "08",
  "September": "09",
  "October": "10",
  "November": "11",
  "December": "12"
};
var inPackageUuid = initInPackageUuid()

function initInPackageUuid(){
	return localStorage.inPackageUuid ? localStorage.inPackageUuid : ''
}

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
    
    addtlparam += '&inPackageUuid='+inPackageUuid;
  window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle + " - " + title, addtlparam);
}

function drawTotalManHrsWOLTI(monthYear, data, isPrintFilter = false) {
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

  const pointWidth = 70; // as requested to lessen the bar graph visible
	const minChartWidth = catArr.length * pointWidth;
  const chartPrintOptions = {
      chart: {
        type: 'column',
      },
      title: {
        enabled: false,
        text: null
      },
      exporting: {
        enabled: false
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
            enabled: false,
          }
        }
      },
      series: [{
        name: 'Total Man-Hours',
        data: ttlDataArr,
        cursor : 'pointer',
        color: Highcharts.getOptions().colors[0]
      }, {
        name: 'Cumulative Man-Hours',
        data: cumulDataArr,
        color: Highcharts.getOptions().colors[1],
        cursor : 'pointer'
      }]
  };

 	var chart = Highcharts.chart(isPrintFilter ? window.parent.document.getElementById('p-hset-1') : 'TotalManHrsWOLTI', isPrintFilter ? chartPrintOptions : {
      chart: {
        type: 'column',
        scrollablePlotArea: {
          minWidth: minChartWidth,
          scrollPositionX: 0
        },
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
      exporting: {
        menuItemDefinitions: {
          printChart: {
          text: 'Print chart',
            onclick: function () {
              printChart("TotalManHrsWOLTI", monthYear, chart);
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
            var addtlparam  = '&inPackageUuid='+inPackageUuid;

            window.parent.widgetConopOpen("Total Man Hours without LTI", "dash_cons_SMH_card", linkParamArr, "Total Man Hours without LTI" + '-' + event.point.category.name, addtlparam);
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
            var addtlparam = '&inPackageUuid='+inPackageUuid;

            var linkParamArr = processFilterParamArr([year, monthNo, monthFull])
            window.parent.widgetConopOpen("Total Man Hours without LTI", "dash_cons_SMH_card", linkParamArr, "Total Man Hours without LTI" + '-' + event.point.category.name, addtlparam);
          }
        }
      }]
    });

    chart.updateFlag = true
}

function updateTtlManHrsCard(data, isPrintFilter = false){
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

    if (isPrintFilter) {
      window.parent.document.getElementById('p-hset-2-1').innerHTML = CumulTotalManHrsWOLTI;
      window.parent.document.getElementById('p-hset-2-2').innerHTML = CumulTotalManHrsWithTI;
    } else {
      $('#CumulTotalManHrsWOLTI').html(CumulTotalManHrsWOLTI); 
      $('#CumulTotalManHrsWithTI').html(CumulTotalManHrsWithTI);
    } 
}

function drawOverallIncidentsAndAccidentsRecord(monthYear, data, isPrintFilter = false){
  var dataArr = [];
  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      var tempArr = {name: idx, y: (ele) ? parseInt(ele) : 0};
      dataArr.push(tempArr);
    }
  }
  dataArr.sort((a, b) => a.name.localeCompare(b.name));
  const chartId = isPrintFilter ? window.parent.document.getElementById('p-hset-4') : 'OverallIncidentsAndAccidentsRecord';
  const chartPrintOptions = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    title: {
      enabled: false,
      text: null
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
          enabled: false,
          format: '<b>{point.name}</b>: {point.y}'
        }								
      }
    },
    exporting: {
      enabled: false
    },
    credits: false,
    series: [{
      name: 'Total',
      colorByPoint: true,
      data: dataArr,
      cursor : 'pointer'
    }]
  };
  var chart = Highcharts.chart(chartId, isPrintFilter ? chartPrintOptions : {
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
          var addtlparam = '&inPackageUuid='+inPackageUuid;

          window.parent.widgetConopOpen("Incident", "dash_cons_INC_cat_card", linkParamArr, "Incident" + ' - ' + event.point.name, addtlparam);
        }
      }
    }]
  });
  chart.updateFlag = true;
}

function updateIncidentCard(fatal = 0, ttlInc = 0, isPrintFilter = false){
	var NumOfFatality = formatThousand(fatal)
	var AccidentAndIncidentForm = `<span class="clickableCard" onclick="conOpLink('Inc', '', 'Total Accidents/Incidents')">`+(formatThousand(ttlInc))+`</span>`;

  $('#NumOfFatality').html(NumOfFatality); 
  $('#AccidentAndIncidentForm').html(AccidentAndIncidentForm); 

  if (isPrintFilter) {
    window.parent.document.getElementById('p-hset-2-3').innerHTML = formatThousand(ttlInc);
    window.parent.document.getElementById('p-hset-2-4').innerHTML = formatThousand(fatal);
  } else {
    $('#NumOfFatality').html(NumOfFatality); 
    $('#AccidentAndIncidentForm').html(AccidentAndIncidentForm);
  }
}

function drawHSEWalkaboutAndInduction(monthYear, data, isPrintFilter = false){
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

  const pointWidth = 70; // as requested to lessen the bar graph visible
	const minChartWidth = catArr.length * pointWidth;
  const chartId = isPrintFilter ? window.parent.document.getElementById('p-hset-3') : 'HSEWalkaboutAndInduction';
  const chartPrintOptions = {
    chart: {
      type: 'column',
    },
    title: {
      enabled: false,
      text: null
    },
    exporting: {
      enabled: false
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
              enabled: false
            }
          }
        },
        series: [{
          name: 'Safety Induction',
          data: indDataArr,
          cursor : 'pointer',
          color: Highcharts.getOptions().colors[0]
        }, {
          name: 'Safety Walkabout',
          data: walkDataArr,
          cursor : 'pointer',
          color: Highcharts.getOptions().colors[1]
        }]
  };
  	var chart = Highcharts.chart(chartId, isPrintFilter ? chartPrintOptions : {
        chart: {
          type: 'column',
          scrollablePlotArea: {
            minWidth: minChartWidth,
            scrollPositionX: 0
          },
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
        exporting: {
          menuItemDefinitions: {
            printChart: {
              text: 'Print chart',
                onclick: function () {
                  printChart("HSEWalkaboutAndInduction", monthYear, chart);
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
              var addtlparam = '&inPackageUuid='+inPackageUuid;

 
              var linkParamArr = processFilterParamArr([year, monthNo]);
              window.parent.widgetConopOpen("HSET", "dash_cons_SA_card", linkParamArr, "HSET" + ' - ' + event.point.category.name, addtlparam);
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
              var addtlparam = '&inPackageUuid='+inPackageUuid;

              window.parent.widgetConopOpen("HSET", "dash_cons_SA_card", linkParamArr, "HSET" + '- ' + event.point.category.name, addtlparam);
            }
          }
        }]
    });
    chart.updateFlag = true;
}

function drawSAChart(monthYear, data, isPrintFilter = false){
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
                            var addtlparam = '&inPackageUuid='+inPackageUuid;

                            window.parent.widgetConopOpen("HSET", "dash_cons_SA_card", linkParamArr, "HSET" + ' - ' +idx3, addtlparam);
                          }
                        }
                      };
        dataArr.push(tempArr);
    }
  }

  const chartId = isPrintFilter ? window.parent.document.getElementById('p-hset-9') : 'HSEActivityProgram';
  const chartPrintOptions = {
    chart: {
      type: 'column'
    },
    title: {
      enabled: false,
      text: null
    },
    exporting: {
      enabled: false
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
      series: dataArr,
  };
  
  var chart = Highcharts.chart(chartId, isPrintFilter ? chartPrintOptions : {
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

function drawHSECommitteeMeetingChart(monthYear, data, isPrintFilter = false){
  var catArr = [];
  var dataArr = [];

  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      catArr.push(idx);
      dataArr.push((ele) ? parseInt(ele) : 0);
    }
  }
  const chartId = isPrintFilter ? window.parent.document.getElementById('p-hset-5') : 'HSECommitteeMeeting';
  const chartPrintOptions = {
    chart: {
      type: 'column'
    },
    title: {
      enabled: false,
      text: null
    },
    exporting: {
      enabled: false
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
        shared: false,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
			    colorByPoint: true,

        },
        series: {
          dataLabels: {
            enabled: false,
          }
        }
      },
      series: [{
        name: 'Commitee Meeting',
        showInLegend: false,
        data: dataArr,
        cursor: 'pointer'
      }]
  };

  var chart = Highcharts.chart(chartId, isPrintFilter ? chartPrintOptions : {
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
            var addtlparam = '&inPackageUuid='+inPackageUuid;

            window.parent.widgetConopOpen("HSET", "dash_cons_SA_card", linkParamArr, "HSET" + ' - ' + 'Commitee Meeting', addtlparam);
          }
        }
      }]
    });
    chart.updateFlag = true;
}

function drawHSEToolboxMeetingChart(monthYear, data, isPrintFilter = false){
  var catArr = [];
  var dataArr = [];

  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      catArr.push(idx);
      dataArr.push((ele) ? parseInt(ele) : 0);
    }
  }

  const chartId = isPrintFilter ? window.parent.document.getElementById('p-hset-6') : 'HSEToolboxMeeting';
  const chartPrintOptions = {
    chart: {
      type: 'column',
    },
    title: {
      enabled: false,
      text: null
    },
    exporting: {
      enabled: false
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
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        colorByPoint: true,

      },
      series: {
        dataLabels: {
          enabled: false,
        }
      }
    },
    series: [{
      name: 'Toolbox Briefing',
      showInLegend: false,
      data: dataArr,
      cursor : 'pointer'
    }]
  };

  var chart = Highcharts.chart(chartId, isPrintFilter ? chartPrintOptions : {
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
            var addtlparam = '&inPackageUuid='+inPackageUuid;

            window.parent.widgetConopOpen("HSET", "dash_cons_SA_card", linkParamArr, "HSET" + ' - ' + 'Toolbox Briefing', addtlparam);
          }
        }
      }]
    });
    chart.updateFlag = true;
}

function drawHSEPreToolboxChart(monthYear, data, isPrintFilter = false){
  var catArr = [];
  var dataArr = [];

  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      catArr.push(idx);
      dataArr.push((ele) ? parseInt(ele) : 0);
    }
  }

  const chartId = isPrintFilter ? window.parent.document.getElementById('p-hset-8') : 'HSEPreToolbox';
  const chartPrintOptions = {
    chart: {
      type: 'column',
    },
    title: {
      enabled: false,
      text: null
    },
    exporting: {
      enabled: false
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
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
			    colorByPoint: true,

        },
        series: {
          dataLabels: {
            enabled: false,
          }
        }
      },
      series: [{
        name: 'Pre Toolbox',
        showInLegend: false,
        data: dataArr,
        cursor : 'pointer'
      }]
  };

  var chart = Highcharts.chart(chartId, isPrintFilter ? chartPrintOptions : {
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
            var addtlparam = '&inPackageUuid='+inPackageUuid;
            window.parent.widgetConopOpen("HSET", "dash_cons_SA_card", linkParamArr, "HSET" + ' - ' + 'Pre Toolbox', addtlparam);
          }
        }
      }]
    });
    chart.updateFlag = true;
}

function drawHSEActiveTrafficDiversionChart(monthYear, data, isPrintFilter = false){
  var catArr = [];
  var dataArr = [];

  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      catArr.push(idx);
      dataArr.push((ele) ? parseInt(ele) : 0);
    }
  }

  const chartId = isPrintFilter ? window.parent.document.getElementById('p-hset-7') : 'HSEActiveTrafficDiversion';
  const chartPrintOptions = {
    chart: {
      type: 'column'
    },
    title: {
      enabled: false,
      text: null
    },
    exporting: {
      enabled: false
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
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
			    colorByPoint: true,

        },
        series: {
          dataLabels: {
            enabled: false,
          }
        }
      },
      series: [{
        name: 'Safety Stand Down',
        showInLegend: false,
        data: dataArr,
        cursor : 'pointer'
      }]
  };

  var chart = Highcharts.chart(chartId, isPrintFilter ? chartPrintOptions : {
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
            var addtlparam = '&inPackageUuid='+inPackageUuid;

            window.parent.widgetConopOpen("HSET", "dash_cons_SA_card", linkParamArr, "HSET" + ' - ' + 'Safety Stand Down', addtlparam);
          }
        }
      }]
    });
    chart.updateFlag = true;
}

function parseMonthYear(value) {
  const [month, year] = value.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

function refreshInformation(packid = 'overall', sectionId = 'overall', year = 'all', month = 'all', isPrintFilter = false) {
    const fromDate = window.parent.document.getElementById('from-date-js').value;
    const toDate = window.parent.document.getElementById('to-date-js').value;
    const hasFilterValues = fromDate !== '' && toDate !== '' && (parseMonthYear(fromDate) <= parseMonthYear(toDate));

    // incident
    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year;
    var incidentData = (HSEData.IR && HSEData.IR[packid] && HSEData.IR[packid][sectionId]) ? HSEData.IR[packid][sectionId] : [];
    var incidentCatChartData = (incidentData.byCat && incidentData.byCat[year] && incidentData.byCat[year][month]) ? incidentData.byCat[year][month] : [];
    // incidentCatChartData = hasFilterValues && isPrintFilter ? formatOverallPrintData('smallCharts', incidentData.byCat) : incidentCatChartData;
    drawOverallIncidentsAndAccidentsRecord(dataYearMonth, incidentCatChartData, isPrintFilter);
    var fatalityCnt = (incidentData.fatalityCnt && incidentData.fatalityCnt[year] && incidentData.fatalityCnt[year][month] && incidentData.fatalityCnt[year][month].total) ? incidentData.fatalityCnt[year][month].total :0;
    var totalCnt = (incidentData.card && incidentData.card[year] && incidentData.card[year][month] && incidentData.card[year][month].total) ? incidentData.card[year][month].total :0;
    // fatalityCnt = hasFilterValues && isPrintFilter ? formatOverallPrintData('cardsDown', incidentData.fatalityCnt).total : fatalityCnt;
    // totalCnt = hasFilterValues && isPrintFilter ? formatOverallPrintData('cardsDown', incidentData.card).total : totalCnt;
    updateIncidentCard(fatalityCnt, totalCnt, isPrintFilter);

    // safety man hours
    ttlManHrsWOLtiData = (HSEData.ttlManHrsWOLTI && HSEData.ttlManHrsWOLTI[packid] && HSEData.ttlManHrsWOLTI[packid][sectionId]) ? HSEData.ttlManHrsWOLTI[packid][sectionId] : [];
    ttlManHrsWOLtiChartData = (ttlManHrsWOLtiData.chart && ttlManHrsWOLtiData.chart[year] && ttlManHrsWOLtiData.chart[year][month]) ? ttlManHrsWOLtiData.chart[year][month] : [];
    ttlManHrsWOLtiChartData = hasFilterValues && isPrintFilter ? sortMonthYearObject(formatOverallPrintData('bigCharts', ttlManHrsWOLtiData.chart)) : ttlManHrsWOLtiChartData;
    drawTotalManHrsWOLTI(dataYearMonth, ttlManHrsWOLtiChartData, isPrintFilter);
    ttlManHrsWOLtiCardData = (ttlManHrsWOLtiData.card && ttlManHrsWOLtiData.card[year] && ttlManHrsWOLtiData.card[year][month]) ? ttlManHrsWOLtiData.card[year][month] : [];
    // ttlManHrsWOLtiCardData = hasFilterValues && isPrintFilter ? formatOverallPrintData('cardsUp', ttlManHrsWOLtiData.card) : ttlManHrsWOLtiCardData;
    updateTtlManHrsCard(ttlManHrsWOLtiCardData, isPrintFilter);

    // safety activity
    var saData = (HSEData.activity && HSEData.activity[packid] && HSEData.activity[packid][sectionId]) ? HSEData.activity[packid][sectionId] : [];
    var saDataYearMonth = (saData.activityChart && saData.activityChart[year] && saData.activityChart[year][month]) ? saData.activityChart[year][month] : [];
    // saDataYearMonth = hasFilterValues && isPrintFilter ? formatOverallPrintData('smallCharts', saData.activityChart) : saDataYearMonth;
    drawSAChart(dataYearMonth, saDataYearMonth, isPrintFilter);

    var walkaboutChartData = (saData.safetyWalkInd && saData.safetyWalkInd[year] && saData.safetyWalkInd[year][month]) ? saData.safetyWalkInd[year][month] : [];
    walkaboutChartData = hasFilterValues && isPrintFilter ? sortMonthYearObject(formatOverallPrintData('bigCharts', saData.safetyWalkInd)) : walkaboutChartData;
    drawHSEWalkaboutAndInduction(dataYearMonth, walkaboutChartData, isPrintFilter);
    var saActCharData = (saData.activityChart)

    var saCMChartData = (saData.hseCommMeet && saData.hseCommMeet[year] && saData.hseCommMeet[year][month]) ? saData.hseCommMeet[year][month] : [];
    // saCMChartData = hasFilterValues && isPrintFilter ? formatOverallPrintData('smallCharts', saData.hseCommMeet) : saCMChartData;
    drawHSECommitteeMeetingChart(dataYearMonth, saCMChartData, isPrintFilter);
    var saTBChartData = (saData.hseToolboxBriefing && saData.hseToolboxBriefing[year] && saData.hseToolboxBriefing[year][month]) ? saData.hseToolboxBriefing[year][month] : [];
    // saCMChartData = hasFilterValues && isPrintFilter ? formatOverallPrintData('smallCharts', saData.hseToolboxBriefing) : saTBChartData;
    drawHSEToolboxMeetingChart(dataYearMonth, saCMChartData, isPrintFilter);
    var saPreTBChartData = (saData.hsePreToolbox && saData.hsePreToolbox[year] && saData.hsePreToolbox[year][month]) ? saData.hsePreToolbox[year][month] : [];
    // saPreTBChartData = hasFilterValues && isPrintFilter ? formatOverallPrintData('smallCharts', saData.hsePreToolbox) : saPreTBChartData;
    drawHSEPreToolboxChart(dataYearMonth, saPreTBChartData, isPrintFilter);
    var saTCChartData = (saData.hseSafetyStandDown && saData.hseSafetyStandDown[year] && saData.hseSafetyStandDown[year][month]) ? saData.hseSafetyStandDown[year][month] : [];
    // saTCChartData = hasFilterValues && isPrintFilter ? formatOverallPrintData('smallCharts', saData.hseSafetyStandDown) : saTCChartData;
    drawHSEActiveTrafficDiversionChart(dataYearMonth, saTCChartData, isPrintFilter);
}

function sortMonthYearObject(data) {
  var MONTH_MAP = {
    JAN: 0,
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11
  };

  var keys = Object.keys(data);

  keys.sort(function (a, b) {
    var aParts = a.split('-'); 
    var bParts = b.split('-');

    var aMonth = MONTH_MAP[aParts[0]];
    var aYear = parseInt(aParts[1], 10);

    var bMonth = MONTH_MAP[bParts[0]];
    var bYear = parseInt(bParts[1], 10);

    var dateA = new Date(aYear, aMonth, 1);
    var dateB = new Date(bYear, bMonth, 1);

    return dateA - dateB; // ascending
  });

  var sortedObj = {};
  for (var i = 0; i < keys.length; i++) {
    sortedObj[keys[i]] = data[keys[i]];
  }

  return sortedObj;
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

function formatOverallPrintData(chartType, data) {
  let fromDate = window.parent.document.getElementById('from-date-js').value;
  let toDate = window.parent.document.getElementById('to-date-js').value;
  let origFrom = fromDate;
  let origTo = toDate;

  if (!fromDate && !toDate) {
    return data;
  }

  fromDate = fromDate.split('-');
  toDate = toDate.split('-');
  const monthsAbbrev = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  let filtered = {};

  if (chartType === 'cardsUp') {
    filtered = {
      woLTI : 0,
      wLTI : 0
    };
  }

  if (chartType === 'cardsDown') {
    filtered = {
      total : 0
    };
  }

  const [fromMonth, fromYear] = origFrom.split('-').map(Number);
  const [toMonth, toYear]     = origTo.split('-').map(Number);
  const fromKey = fromYear * 100 + fromMonth;
  const toKey   = toYear * 100 + toMonth;

  for (let year = Number(fromDate[1]); year <= Number(toDate[1]); year++) {
    if (Object.hasOwn(data, String(year)) || Object.hasOwn(data, Number(year))) {
      const isRangedYear = year === Number(Number(toDate[1]));
      Object.entries(data[String(year)] ?? data[Number(year)]).forEach(([month, yearMonthData]) => {
        if (month !== 'all') {
          switch(chartType) {
            case 'bigCharts':

              Object.entries(yearMonthData).forEach(([ymKey, ymData]) => {
                const [currentMonth, currentYear] = ymKey.split('-');
                thisMOnth = CaptextMonthtoNum[currentMonth];

                const currentKey = Number(year) * 100 + Number(thisMOnth);

                if (currentKey >= fromKey && currentKey <= toKey) {
                  filtered[ymKey] = ymData;
                }
              });
            break;
            case 'cardsUp':
              if (!(isRangedYear && Number(month) > Number(toDate[0]))) {
                filtered.woLTI = filtered.woLTI + Number(yearMonthData.woLTI);
                filtered.wLTI = filtered.wLTI + Number(yearMonthData.wLTI);
              }
            break;
            case 'cardsDown':
              if (!(isRangedYear && Number(month) > Number(toDate[0]))) {
                filtered.total += Number(yearMonthData.total);
              }
            break;
            // pie graphs and HSET small charts below
            case 'smallCharts':
              Object.entries(yearMonthData).forEach(([ymKey, ymData]) => {
                if (!(isRangedYear && Number(month) > Number(toDate[0]))) {
                  if (typeof ymData === 'object') {
                    Object.entries(ymData).forEach(([ymdKey, ymdData]) => {
                      filtered[ymKey] = Object.hasOwn(filtered, ymKey) ? filtered[ymKey] : [];
                      filtered[ymKey][ymdKey] = Object.hasOwn(filtered[ymKey], ymdKey) ? (filtered[ymKey][ymdKey] + Number(ymdData)) : Number(ymdData);
                    });
                  } else {
                    filtered[ymKey] = Object.hasOwn(filtered, ymKey) ? (filtered[ymKey] + Number(ymData)) : Number(ymData);
                  }
                }
              });
            break;
          }
        }
      });
    }
  }
  if(chartType =='bigCharts'){
  console.log('filtered', filtered);

  }

  return filtered;
}

function isNumber(str) {
  return str !== '' && !isNaN(str) && !isNaN(Number(str));
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

$(document).ready(function(){

  window.addEventListener('message', function(event) {
      const data = event.data;

      if (data.command === 'filterCharts') {
        refreshInformation('overall', 'overall', 'all', 'all', true);
        return;
      }

      if (data.command === 'updateFilterCharts') {
        console.log(data.wpc);
        console.log(data);
        refreshInformation(data.wpc, 'overall', data.year, data.month, true);
        window.parent.postMessage(
          { command: 'overallPrintChartUpdated' },
          '*'
        );
        return;
      }
  });
})

function getChartSVG(divId, monthYear, chart) {
  try {

    const xAxis = chart.xAxis[0];
    const extremes = xAxis.getExtremes();
    const totalRange = (extremes.max - extremes.min) || 1;
 
    // Locate scrollable container
    let scrollEl =
    chart.container.closest('.highcharts-scrolling') ||
    (chart.container.parentElement &&
     chart.container.parentElement.querySelector('.highcharts-scrolling'));
 
    // compute scrollPx, visibleWidthPx, fullWidthPx (fall back to helper)
    let scrollPx = 0;
    let visibleWidthPx = chart.plotWidth;
    let fullWidthPx = chart.plotWidth;
 
    if (scrollEl) {
      scrollPx = scrollEl.scrollLeft;
      visibleWidthPx = scrollEl.clientWidth;
      fullWidthPx = scrollEl.scrollWidth;
    } else {
      // use your helper if container isn't found
      const helperOffset = (typeof getHighchartsScrollOffset === 'function')
        ? getHighchartsScrollOffset(chart) || 0
        : 0;
      scrollPx = helperOffset;
 
      if (typeof chart.scrollablePixelsX === 'number' && chart.scrollablePixelsX > 0) {
        fullWidthPx = chart.plotWidth + chart.scrollablePixelsX;
      } else {
        try {
          let maxBBoxWidth = 0;
          chart.series.forEach(s => {
            if (s.group && typeof s.group.getBBox === 'function') {
              const bb = s.group.getBBox();
              if (bb && bb.width) maxBBoxWidth = Math.max(maxBBoxWidth, (bb.x || 0) + bb.width);
            }
          });
          if (maxBBoxWidth > 0) fullWidthPx = Math.max(fullWidthPx, maxBBoxWidth);
        } catch (e) { }
      }
      visibleWidthPx = chart.plotWidth;
    }
 
    if (!fullWidthPx || isNaN(fullWidthPx) || fullWidthPx <= 0) fullWidthPx = visibleWidthPx;

    // exact pixels no rounding
    const visibleFraction = visibleWidthPx / fullWidthPx;
    let visibleMin = extremes.min + (scrollPx / fullWidthPx) * totalRange;
    let visibleMax = visibleMin + (totalRange * visibleFraction);
 
    // Clamp to bounds
    visibleMin = Math.max(extremes.min, Math.min(extremes.max, visibleMin));
    visibleMax = Math.max(extremes.min, Math.min(extremes.max, visibleMax));
 
    // export dimensions
    // const svgWidth = Math.max(600, Math.round(visibleWidthPx)); // fallback min ORII
    const svgWidth = Math.max(600, visibleWidthPx);
    const svgHeight = 500;
 
    // clone light weight
    const baseOpts = Highcharts.merge({}, chart.options);
 
    if (baseOpts.chart) {
      baseOpts.chart = Highcharts.merge({}, baseOpts.chart);
      delete baseOpts.chart.events;
 
      delete baseOpts.chart.renderTo;
 
      baseOpts.chart.animation = false;
    } else {
      baseOpts.chart = { animation: false };
    }
 
    baseOpts.series = (chart.series || []).map(s => Highcharts.merge({}, s.options || {}));
 
    // print specific layout into the clone options
    baseOpts.chart.width = svgWidth;
    baseOpts.chart.height = svgHeight;
    baseOpts.chart.spacingBottom = 80; // reserve space for legendssss
 
    baseOpts.title = Highcharts.merge({}, baseOpts.title || {});
    baseOpts.title.text = null;
 
    baseOpts.legend = Highcharts.merge({}, baseOpts.legend || {}, {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      floating: false,
      width: '100%', 
      itemWidth: null, // Essential: tells Highcharts not to restrict item width
      useHTML: false, // This is often used to ensure proper rendering in the SVG export process
      x: 225, // centered legends | per chart
      margin: 10,
      y: 10,
      symbolPadding: 8,
      itemMarginTop: 4,
      itemMarginBottom: 4,
      itemStyle: {
          fontSize: '12px'
      }
    });
 
    // temp container
    const tmpDiv = document.createElement('div');
    tmpDiv.style.position = 'absolute';
    tmpDiv.style.left = '-9999px';
    tmpDiv.style.top = '-9999px';
    tmpDiv.style.width = svgWidth + 'px';
    tmpDiv.style.height = svgHeight + 'px';
    document.body.appendChild(tmpDiv);
 
    const cloneChart = Highcharts.chart(tmpDiv, baseOpts);
 
    if (cloneChart && cloneChart.xAxis && cloneChart.xAxis[0]) {
      try {
        cloneChart.xAxis[0].setExtremes(visibleMin, visibleMax, false, false);
        cloneChart.redraw(false);
      } catch (e) {}
    }
 
    // At the end of the cloning and SVG generation:
    const svg = cloneChart.getSVG({
        exporting: { sourceWidth: svgWidth, sourceHeight: svgHeight },
        chart: { width: svgWidth, height: svgHeight }
    });

    try { cloneChart.destroy(); } catch (e) { /* ignore */ }
    try { tmpDiv.parentNode && tmpDiv.parentNode.removeChild(tmpDiv); } catch (e) { /* ignore */ }
    
    // Construct the title HTML that was being used in the print window:
    const titleHtml = `
        <div class="chart-title">
            <strong>Land Summary Dashboard</strong><br>
            ${localStorage.p_name}<br>
            (${divId} - ${monthYear})
        </div>
    `;

    return { 
        titleHtml: titleHtml, 
        svg: svg 
    };
 
  } catch (err) {
    console.error('printChart (clone) failed, falling back to original approach:', err);
    try {
      const svg = chart.getSVG();
      const w = window.open('', '_blank');
      w.document.write(`<html><body>${svg}</body></html>`);
      w.document.close();
      w.onload = function () { w.print(); w.onafterprint = () => w.close(); };
    } catch (err2) {
      console.error('fallback export failed:', err2);
      alert('Export failed: ' + (err2 && err2.message));
    }
  }
}

function getChartSVGgeneralPrintPreview(divId, monthYear, chart) {
try {

        const xAxis = chart.xAxis[0];
        const extremes = xAxis.getExtremes();
        const totalRange = (extremes.max - extremes.min) || 1;

        // Locate scrollable container (RESTORED ORIGINAL LOGIC)
        let scrollEl =
        chart.container.closest('.highcharts-scrolling') ||
        (chart.container.parentElement &&
        chart.container.parentElement.querySelector('.highcharts-scrolling'));

        // compute scrollPx, visibleWidthPx, fullWidthPx (fall back to helper)
        let scrollPx = 0;
        let visibleWidthPx = chart.plotWidth;
        let fullWidthPx = chart.plotWidth;

        if (scrollEl) {
            scrollPx = scrollEl.scrollLeft;
            visibleWidthPx = scrollEl.clientWidth;
            fullWidthPx = scrollEl.scrollWidth;
        } else {
            // use your helper if container isn't found
            const helperOffset = (typeof getHighchartsScrollOffset === 'function')
                ? getHighchartsScrollOffset(chart) || 0
                : 0;
            scrollPx = helperOffset;

            if (typeof chart.scrollablePixelsX === 'number' && chart.scrollablePixelsX > 0) {
                fullWidthPx = chart.plotWidth + chart.scrollablePixelsX;
            } else {
                try {
                    let maxBBoxWidth = 0;
                    chart.series.forEach(s => {
                        if (s.group && typeof s.group.getBBox === 'function') {
                            const bb = s.group.getBBox();
                            if (bb && bb.width) maxBBoxWidth = Math.max(maxBBoxWidth, (bb.x || 0) + bb.width);
                        }
                    });
                    if (maxBBoxWidth > 0) fullWidthPx = Math.max(fullWidthPx, maxBBoxWidth);
                } catch (e) { }
            }
            visibleWidthPx = chart.plotWidth;
        }

        if (!fullWidthPx || isNaN(fullWidthPx) || fullWidthPx <= 0) fullWidthPx = visibleWidthPx;

        // exact pixels no rounding
        const visibleFraction = visibleWidthPx / fullWidthPx;
        let visibleMin = extremes.min + (scrollPx / fullWidthPx) * totalRange;
        let visibleMax = visibleMin + (totalRange * visibleFraction);

        // Clamp to bounds
        visibleMin = Math.max(extremes.min, Math.min(extremes.max, visibleMin));
        visibleMax = Math.max(extremes.min, Math.min(extremes.max, visibleMax));

        // export dimensions
        const svgWidth = Math.max(600, visibleWidthPx);
        
        // --- CRITICAL CHANGE: REDUCED FIXED HEIGHT ---
        const svgHeight = 320; // Significantly reduced from 500 to fit multiple charts per page
        // --- END CRITICAL CHANGE ---

        // clone light weight
        const baseOpts = Highcharts.merge({}, chart.options);

        if (baseOpts.chart) {
            baseOpts.chart = Highcharts.merge({}, baseOpts.chart);
            delete baseOpts.chart.events;
            delete baseOpts.chart.renderTo;
            baseOpts.chart.animation = false;
        } else {
            baseOpts.chart = { animation: false };
        }

        baseOpts.series = (chart.series || []).map(s => Highcharts.merge({}, s.options || {}));

        // print specific layout into the clone options
        baseOpts.chart.width = svgWidth;
        baseOpts.chart.height = svgHeight;
        
        // Reduced spacing to account for shorter height
        baseOpts.chart.spacingBottom = 40; 

        baseOpts.title = Highcharts.merge({}, baseOpts.title || {});
        baseOpts.title.text = null;

        baseOpts.legend = Highcharts.merge({}, baseOpts.legend || {}, {
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'horizontal',
            floating: false,
            width: '100%',
            itemWidth: null,
            useHTML: false,
            x: 0, // Let Highcharts position horizontally, usually best for printing
            margin: 5, // Reduced margin
            y: 0,
            symbolPadding: 5,
            itemMarginTop: 2,
            itemMarginBottom: 2,
            itemStyle: {
                fontSize: '10px' // Smaller font for compactness
            }
        });

        // temp container
        const tmpDiv = document.createElement('div');
        tmpDiv.style.position = 'absolute';
        tmpDiv.style.left = '-9999px';
        tmpDiv.style.top = '-9999px';
        tmpDiv.style.width = svgWidth + 'px';
        tmpDiv.style.height = svgHeight + 'px';
        document.body.appendChild(tmpDiv);

        const cloneChart = Highcharts.chart(tmpDiv, baseOpts);

        if (cloneChart && cloneChart.xAxis && cloneChart.xAxis[0]) {
            try {
                // Apply the calculated visible extremes
                cloneChart.xAxis[0].setExtremes(visibleMin, visibleMax, false, false);
                cloneChart.redraw(false);
            } catch (e) { }
        }

        // At the end of the cloning and SVG generation:
        const svg = cloneChart.getSVG({
            exporting: { sourceWidth: svgWidth, sourceHeight: svgHeight },
            chart: { width: svgWidth, height: svgHeight }
        });

        try { cloneChart.destroy(); } catch (e) { /* ignore */ }
        try { tmpDiv.parentNode && tmpDiv.parentNode.removeChild(tmpDiv); } catch (e) { /* ignore */ }

        // Construct the title HTML that was being used in the print window:
        const titleHtml = `
            <div class="chart-title">
                <strong>Land Summary Dashboard</strong><br>
                ${localStorage.p_name}<br>
                (${divId} - ${monthYear})
            </div>
        `;

        return {
            titleHtml: titleHtml,
            svg: svg
        };

    } catch (err) {
        console.error('printChart (clone) failed, falling back to original approach:', err);
        return {
            titleHtml: '',
            svg: `<div style="text-align: center; color: red;">Error exporting chart: ${err.message}</div>`
        };
    }
}

/**
 * param for divId eg: TotalManHrsWOLTI || HSEWalkaboutAndInduction
 * replicate from the Land same implementation
 */
function printChart(divId, monthYear, chart){
  try {
    const xAxis = chart.xAxis[0];
    const extremes = xAxis.getExtremes();
    const totalRange = (extremes.max - extremes.min) || 1;

    // Locate scrollable container
    let scrollEl =
    chart.container.closest('.highcharts-scrolling') ||
    (chart.container.parentElement &&
     chart.container.parentElement.querySelector('.highcharts-scrolling'));

    // compute scrollPx, visibleWidthPx, fullWidthPx (fall back to helper)
    let scrollPx = 0;
    let visibleWidthPx = chart.plotWidth;
    let fullWidthPx = chart.plotWidth;

    if (scrollEl) {
      scrollPx = scrollEl.scrollLeft;
      visibleWidthPx = scrollEl.clientWidth;
      fullWidthPx = scrollEl.scrollWidth;
    } else {
      // use your helper if container isn't found
      const helperOffset = (typeof getHighchartsScrollOffset === 'function')
        ? getHighchartsScrollOffset(chart) || 0
        : 0;
      scrollPx = helperOffset;

      if (typeof chart.scrollablePixelsX === 'number' && chart.scrollablePixelsX > 0) {
        fullWidthPx = chart.plotWidth + chart.scrollablePixelsX;
      } else {
        try {
          let maxBBoxWidth = 0;
          chart.series.forEach(s => {
            if (s.group && typeof s.group.getBBox === 'function') {
              const bb = s.group.getBBox();
              if (bb && bb.width) maxBBoxWidth = Math.max(maxBBoxWidth, (bb.x || 0) + bb.width);
            }
          });
          if (maxBBoxWidth > 0) fullWidthPx = Math.max(fullWidthPx, maxBBoxWidth);
        } catch (e) { }
      }
      visibleWidthPx = chart.plotWidth;
    }

    if (!fullWidthPx || isNaN(fullWidthPx) || fullWidthPx <= 0) fullWidthPx = visibleWidthPx;

    const visibleFraction = visibleWidthPx / fullWidthPx;
    let visibleMin = extremes.min + (scrollPx / fullWidthPx) * totalRange;
    let visibleMax = visibleMin + visibleFraction * totalRange;

    visibleMin = Math.max(extremes.min, Math.min(extremes.max, visibleMin));
    visibleMax = Math.max(extremes.min, Math.min(extremes.max, visibleMax));

    // export dimensions 
    const svgWidth = Math.max(600, Math.round(visibleWidthPx)); // fallback min
    const svgHeight = 500; 

	// clone light weight
    const baseOpts = Highcharts.merge({}, chart.options); 

    if (baseOpts.chart) {
      baseOpts.chart = Highcharts.merge({}, baseOpts.chart);
      delete baseOpts.chart.events;

      delete baseOpts.chart.renderTo;

      baseOpts.chart.animation = false;
    } else {
      baseOpts.chart = { animation: false };
    }

    baseOpts.series = (chart.series || []).map(s => Highcharts.merge({}, s.options || {}));

    // print specific layout into the clone options
    baseOpts.chart.width = svgWidth;
    baseOpts.chart.height = svgHeight;
    baseOpts.chart.spacingBottom = 80; // reserve space for legendssss

    baseOpts.title = Highcharts.merge({}, baseOpts.title || {});
    baseOpts.title.text = null;

    baseOpts.legend = Highcharts.merge({}, baseOpts.legend || {}, {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      floating: false,
      y: 10,
	//   opacity: '100%',
      symbolPadding: 8,
      itemMarginTop: 4,
      itemMarginBottom: 4,
      itemStyle: { 
			fontSize: '12px' 
		}
    });

    // temp container 
    const tmpDiv = document.createElement('div');
    tmpDiv.style.position = 'absolute';
    tmpDiv.style.left = '-9999px';
    tmpDiv.style.top = '-9999px';
    tmpDiv.style.width = svgWidth + 'px';
    tmpDiv.style.height = svgHeight + 'px';
    document.body.appendChild(tmpDiv);

    const cloneChart = Highcharts.chart(tmpDiv, baseOpts);

    if (cloneChart && cloneChart.xAxis && cloneChart.xAxis[0]) {
      try {
        cloneChart.xAxis[0].setExtremes(visibleMin, visibleMax, false, false);
        cloneChart.redraw(false);
      } catch (e) {}
    }

    const svg = cloneChart.getSVG({
      exporting: { sourceWidth: svgWidth, sourceHeight: svgHeight },
      chart: { width: svgWidth, height: svgHeight }
    });

    try { cloneChart.destroy(); } catch (e) { /* ignore */ }
    try { tmpDiv.parentNode && tmpDiv.parentNode.removeChild(tmpDiv); } catch (e) { /* ignore */ }

    //  print window with styling
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Chart Preview</title>
          <style>
            @media print {
              @page { size: landscape; margin: 10mm; }
              body { margin: 0; padding: 0; }
              svg { max-width: 100%; height: auto; display: block; margin: 0 auto; }
              .highcharts-root { overflow: visible !important; }
            }
            body { margin: 0; padding: 10px; text-align: center; font-family: sans-serif; }
            .chart-title { font-size: 12px; line-height: 1.2; margin-bottom: 6px; }
            .chart-container { width: 100%; height: auto; display: flex; justify-content: center; align-items: center; padding-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="chart-title">
            <strong>Health, Safety, Environment and Traffic</strong><br>
            ${localStorage.p_name}<br>
            ${
              divId === "TotalManHrsWOLTI"
                ? "TOTAL MAN HOURS WITHOUT LTI (HRS)"
                : "HSET WALKABOUT AND INDUCTION"
            } - (${monthYear})
            </div>
          <div class="chart-container">${svg}</div>
        </body>
      </html>
    `);
    printWindow.document.close();

    printWindow.onload = function () {
      printWindow.focus();

      const beforeUnloadHandler = () => printWindow.close();
      printWindow.addEventListener('beforeunload', beforeUnloadHandler);

      const closeIfCanceled = setTimeout(() => {
        try { if (!printWindow.closed) printWindow.close(); } catch (e) {}
      }, 1200);

      printWindow.print();

      printWindow.onafterprint = function () {
        clearTimeout(closeIfCanceled);
        try { printWindow.close(); } catch (e) {}
        printWindow.removeEventListener('beforeunload', beforeUnloadHandler);
      };
    };

  } catch (err) {
    console.error('printChart (clone) failed, falling back to original approach:', err);
    try {
      const svg = chart.getSVG();
      const w = window.open('', '_blank');
      w.document.write(`<html><body>${svg}</body></html>`);
      w.document.close();
      w.onload = function () { w.print(); w.onafterprint = () => w.close(); };
    } catch (err2) {
      console.error('fallback export failed:', err2);
      alert('Export failed: ' + (err2 && err2.message));
    }
  }

}

// Helper function for fallback scroll detection
function getHighchartsScrollOffset(chart) {
  const scrollEl =
    chart.container.closest('.highcharts-scrolling') ||
    (chart.container.parentElement &&
     chart.container.parentElement.querySelector('.highcharts-scrolling'));
  if (scrollEl) return scrollEl.scrollLeft || 0;

  const inner = chart.container.querySelector('.highcharts-inner-container');
  if (inner && inner.style.transform) {
    const m = inner.style.transform.match(/translateX\((-?\d+(?:\.\d+)?)px\)/);
    if (m) return Math.abs(parseFloat(m[1]));
  }

  const groups = chart.container.querySelectorAll('svg g');
  for (const g of groups) {
    const t = g.getAttribute('transform');
    if (t) {
      const m = t.match(/translate\(\s*(-?\d+(?:\.\d+)?)/);
      if (m) return Math.abs(parseFloat(m[1]));
    }
  }

  return 0;
}