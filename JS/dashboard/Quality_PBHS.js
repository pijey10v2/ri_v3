var qualityData;
var monthHalftext = { 1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec" };
var textMonthtoNum = { "Jan": "1", "Feb": "2", "Mar": "3", "Apr": "4", "May": "5", "Jun": "6", "Jul": "7", "Aug": "8", "Sep": "9", "Oct": "10", "Nov": "11", "Dec": "12" };
var textMonthtoNumForFilter = {"Jan":1,"Feb":2,"Mar":3,"Apr":4,"May":5,"Jun":6,"Jul":7,"Aug":8,"Sep":9,"Oct":10,"Nov":11,"Dec":12};

function conOpLink(process, status = '', param1 = '') {
    if(localStorage.ui_pref != "ri_v3") return;

    var linkName;
    var linkWinTitle;
    var linkParamArr;
    var cardName;
    var searchilter = getSearchFilterSabah();
    var dateFrom = searchilter.dateFrom;

    switch (process) {
        case 'MA':
            linkWinTitle = 'Material Acceptance'
            linkName = 'dash_cons_MT_card'
            linkParamArr = processFilterParamArr([dateFrom, searchilter.dateTo])
            cardName = status
        break;
        case 'MS':
            linkWinTitle = 'Method Statement'
            linkName = 'dash_cons_MS_card'
            var acknowledge = '';
            cardName = status
            approvalStatus = status
            if (status == 'Total') {
                acknowledge = 'Acknowledged'
                approvalStatus = 'Under Review'
                cardName = 'Under Review'
            }else if (status == ''){
                cardName = 'Current Cumulative'
            }
            linkParamArr = processFilterParamArr([dateFrom, searchilter.dateTo, acknowledge, approvalStatus])
        break;
        case 'NCR':
            linkWinTitle = 'Non-Conformance Report'
            linkName = 'dash_cons_NCR_card'
            linkParamArr = processFilterParamArr([dateFrom, searchilter.dateTo, status, '', '', '', param1]);
            cardName = param1
        break;
        case 'RFIT':
            linkWinTitle = 'Request for Information'
            linkName = 'dash_cons_RFIT_card'
            var dateTo = searchilter.dateTo
            cardName = status
            if (status == 'Cumulative') {
                status = '';
                dateFrom = '';
            } else if (status == 'Current') {
                if (dateFrom == '') {
                    var currDateObj = new Date();
                    var currMth = parseInt(currDateObj.getMonth()) + 1;
                    var currYr = parseInt(currDateObj.getFullYear());
                    var endD = new Date(currYr, currMth, 0);
                    dateFrom = '01-' + currMth + '-' + currYr
                    dateTo = endD.getDate() + '-' + currMth + '-' + currYr;
                }
                status = '';
            }
            linkParamArr = processFilterParamArr([dateFrom, dateTo, status]);
        break;
        case 'SD':
            linkWinTitle = 'Site Daily Log'
            linkName = 'dash_cons_SDL_card'
            linkParamArr = processFilterParamArr([searchilter.dateFrom, searchilter.dateTo, param1]);
            cardName = status
        break;
    }

    window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle + " - " + cardName);

}

function drawNOIReceivedChart(monthYear, data, dataNOIYear) {
  var tempCatArr = [];
  var tempDataArr = [];
  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      tempCatArr.push(idx);
      tempDataArr.push(parseFloat(ele));
    }
  }
  var dataArr = tempDataArr.reverse();
  var catArr = tempCatArr.reverse();

  var chart = Highcharts.chart('NOIReceivedChart', {
    chart: {
      type: 'column',
      events: {
        render() {
          var chart = this;

          if (document.fullscreenElement && chart.updateFlag) {
            chart.updateFlag = false;
            chart.update({
              chart: {
                marginTop: 90,
              },
              title: {
                text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>SM / NOI RECEIVED (' + monthYear + ')</span>'
              }
            })

            chart.updateFlag = true;
          } else if (chart.updateFlag) {
            chart.updateFlag = false;

            chart.update({
              title: {
                text: '<span class="showLabel" style="text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>SM / NOI RECEIVED (' + monthYear + ')</span>'
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
      text: '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>SM / NOI RECEIVED (' + monthYear + ')</span>'
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
      },
      series: {
        dataLabels: {
          formatter: function () {
            return '<span class="showLabel" style="font-size: 12px">' + this.y + '</span>';
          },
          enabled: true,
          useHTML: true,
        }
      }
    },
    colors: ['#4DC7E3'],
    series: [{
      name: 'Total',
      data: dataArr,
      cursor: 'pointer',
      showInLegend: false,
      events: {
        click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;

            var searchfilter = getSearchFilterSabah();
            
            var yearUsed;
            var monthUsed;

            var selYear = searchfilter.selYr;
            var selMonth = searchfilter.month;

            var monthFromChart = textMonthtoNum[event.point.category.name];

            var currentYear = new Date().getFullYear()
            var currentMonth = new Date().getMonth()

            if(selYear == 'all'){
              yearUsed = currentYear
              monthUsed = currentMonth
            }
            else{
              yearUsed = selYear
              if(selMonth == 'all'){
                monthUsed = currentMonth
              }
              else{
                monthUsed = selMonth
              }
            }

            if(monthFromChart == 12 && monthFromChart != monthUsed){
              yearUsed = yearUsed - 1
            }
            else if (monthFromChart == 11 && monthFromChart != monthUsed - 1 ){
              yearUsed = yearUsed - 1
            }

            lastdayMnth = new Date(yearUsed, monthFromChart, 0);

            dateFrom = '01-'+monthFromChart+'-'+yearUsed;
            dateTo = lastdayMnth.getDate()+'-'+monthFromChart+'-'+yearUsed;

            var linkParamArr = processFilterParamArr([dateFrom, dateTo]);
            window.parent.widgetConopOpen("Notice of Improvement", "dash_cons_NOI_card", linkParamArr,"Notice of Improvement - " + event.point.category.name + " " + yearUsed);
        }
      }
    }],
    credits: false
  });
  chart.updateFlag = true;
}

function RFIStatusChart(monthYear, data) {
  var closeCnt = (data.Closed) ? parseInt(data.Closed) : 0;
  var openCnt = (data.Open) ? parseInt(data.Open) : 0;

  let chart = Highcharts.chart('RFIStatus', {
    chart: {
      type: 'bar',
      margin: [32, 5, 32, 5],
      spacingTop: 5,
      spacingBottom: -4,
      spacingLeft: 5,
      spacingRight: 5,
      events: {
        render() {
          const chart = this;

          if (document.fullscreenElement && chart.updateFlag) {
            chart.updateFlag = false;
            chart.update({
              chart: {
                marginTop: 90,
                marginBottom: 50
              },
              title: {
                useHTML: true,
                enabled: true,
                text: '<span class="hiddenLabel" style="font-size: 15px;">Quality Management Dashboard<br>' + localStorage.p_name + '<br>RFI STATUS (CUMULATIVE) (CUMULATIVE) (' + monthYear + ')</span>' +
                  '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>RFI STATUS (CUMULATIVE) (CUMULATIVE) (' + monthYear + ')</span>'
              },
              legend: {
                symbolHeight: 15,
                symbolWidth: 15,
                itemStyle: {
                  fontSize: '15px',
                }
              }
            })

            chart.updateFlag = true;
          } else if (chart.updateFlag) {
            chart.updateFlag = false;

            chart.update({
              title: {
                useHTML: true,
                enabled: true,
                text: '<span class="hiddenLabel" style="font-size: 9px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">RFI STATUS (CUMULATIVE) (' + monthYear + ')</span>' +
                  '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>RFI STATUS (CUMULATIVE) (' + monthYear + ')</span>'
              },
              legend: {
                symbolHeight: 7,
                symbolWidth: 7,
                itemStyle: {
                  fontSize: '9px',
                }
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
      text: '<span class="hiddenLabel" style="font-size: 9px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">RFI STATUS (CUMULATIVE) (' + monthYear + ')</span>' +
        '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>RFI STATUS (CUMULATIVE) (' + monthYear + ')</span>'
    },
    xAxis: {
      categories: ['']
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },
    legend: {
      reversed: true,
      symbolHeight: 7,
      symbolWidth: 7,
      itemStyle: {
        fontSize: '9px',
      }
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        dataLabels: {
          formatter: function () {
            return '<span class="showLabel" style="font-size: 12px">' + this.y + '</span>';
          },
          enabled: true,
          useHTML: true,
        }
      },
    },
    credits: false,
    series: [{
      name: 'Close',
      color: "#54F788",
      cursor: 'pointer',
      data: [closeCnt],
      events: {
        click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;

            var filter = getSearchFilterSabah();
            linkParamArr = processFilterParamArr([filter.dateFrom, filter.dateTo, 'Closed'])
            window.parent.widgetConopOpen("Request for Inspection", "dash_cons_RFI_card", linkParamArr, "Request for Inspection - Closed");
        }
      }
    }, {
      name: 'Open',
      color: "#cccccc",
      cursor: 'pointer',
      data: [openCnt],
      events: {
        click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;

            var filter = getSearchFilterSabah();
            linkParamArr = processFilterParamArr([filter.dateFrom, filter.dateTo, 'Pending'])
            window.parent.widgetConopOpen("Request for Inspection", "dash_cons_RFI_card", linkParamArr, "Request for Inspection - Open");
        }
      }
    }
    ]
  });
  chart.updateFlag = true;
}

function updateSDLCard(ttlManchinery, ttlManpower) {
  var totalManPowerCard = `<span class="clickableCard" onclick="conOpLink('SD', 'Total Manpower')">` + formatThousand(ttlManpower) + `</span>`;
  var totalMachineryCard = `<span class="clickableCard" onclick="conOpLink('SD', 'Total Machinery')">` + formatThousand(ttlManchinery) + `</span>`;

  $("#totalManPowerCard").html(totalManPowerCard);
  $("#totalMachineryCard").html(totalMachineryCard);
}

function updateSDLTable(data) {
  var sdTableHTML = "";
  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      sdTableHTML += '<tr class="clickableCard" onclick="conOpLink(`SD`, ``, `' + ele.ref_no + '`)">'
      sdTableHTML += '<td style="font-size: 10px !important">' + ele.ref_no + '</td>'
      sdTableHTML += '<td style="font-size: 10px !important">' + ((ele.total_manpower) ? formatThousand(parseInt(ele.total_manpower)) : 0) + '</span></td>'
      sdTableHTML += '<td style ="font-size: 10px !important">' + ((ele.total_machinery) ? formatThousand(parseInt(ele.total_machinery)) : 0) + '</span></td>'
      sdTableHTML += '</tr>'
    }
  }
  $("#siteDiaryTBody").html(sdTableHTML);
}

function drawSdlWeatherChart(monthYear, data) {
  var dataArr = [];
  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      var tempArr = { name: idx, y: (ele) ? ele : 0 };
      dataArr.push(tempArr);
    }
  }

  // riskCategoryCharts
  var chart = Highcharts.chart('weatherSDL', {
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
              chart: {
                marginTop: 90,
              },
              title: {
                text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>SITE DIARY (WEATHER) (' + monthYear + ')</span>'
              },
              legend: {
                symbolHeight: 15,
                symbolWidth: 15,
                itemStyle: {
                  fontSize: 15
                }
              }
            })

            chart.updateFlag = true;
          } else if (chart.updateFlag) {
            chart.updateFlag = false;

            chart.update({
              title: {
                text: '<span class="showLabel" style="text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>SITE DIARY (WEATHER) (' + monthYear + ')</span>'
              },
              legend: {
                symbolHeight: 10,
                symbolWidth: 10,
                itemStyle: {
                  fontSize: 10
                }
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
      text: '<span class="showLabel" style="font-size: 12px">Quality Management Dashboard<br>' + localStorage.p_name + '<br>SITE DIARY (WEATHER) (' + monthYear + ')</span>'
    },
    legend: {
      itemStyle: {
        fontSize: '10px'
      },
      layout: 'proximate',
      align: 'left',
      verticalAlign: 'top',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y} hrs</b>'
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
          format: '{series.name}: {point.y} hrs'
        },
        showInLegend: true,
        size: '90%'
      }
    },
    series: [{
      colorByPoint: true,
      name: 'Total',
      data: dataArr,
      events: {
        click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;

            var filter = getSearchFilterSabah();
            linkParamArr = processFilterParamArr([filter.dateFrom, filter.dateTo])
            window.parent.widgetConopOpen("Site Daily Log", "dash_cons_SDL_card", linkParamArr, "Site Daily Log - " + event.point.name);
        }
      }
    }],
    credits: false
  });
  chart.updateFlag = true;
}

function updateMSCard(cumul = 0) {
  var cumulMethodStatementCard = `<span class="clickableCard" onclick="conOpLink('MS','')">` + formatThousand(cumul) + `</span>`;

  $("#cumulMethodStatementCard").html(cumulMethodStatementCard);
}

// MSStatusCharts
function drawMMStatusChart(monthYear, data) {
  var dataArr = [];
  var clr;
  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      if (idx == 'Code A') {
        clr = '#6EE660';
      } else if (idx == 'Code B') {
        clr = '#EFFA50'
      } else if (idx == 'Code C') {
        clr = '#DC5356'
      } else if (idx == 'Under Review') {
        clr = '#cccccc'
      }
      var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0, color: clr };
      dataArr.push(tempArr);
    }
  }

  var chart = Highcharts.chart('MSStatusCharts', {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
      margin: [0, 0, 0, 0],
      spacingTop: 10,
      spacingBottom: 0,
      spacingLeft: 0,
      spacingRight: 0,
      events: {
        render() {
          var chart = this;

          if (document.fullscreenElement && chart.updateFlag) {
            chart.updateFlag = false;
            chart.update({
              chart: {
                marginTop: 90,
              },
              title: {
                text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>MS STATUS (' + monthYear + ')</span>'
              }
            })

            chart.updateFlag = true;
          } else if (chart.updateFlag) {
            chart.updateFlag = false;

            chart.update({
              title: {
                text: '<span class="showLabel" style="text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>MS STATUS (' + monthYear + ')</span>'
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
      text: '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>MS STATUS (' + monthYear + ')</span>'
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
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        },
        size: '90%'
      }
    },
    credits: false,
    series: [{
      name: 'Status',
      colorByPoint: true,
      data: dataArr,
      cursor: 'pointer',
      events: {
        click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;

            var filter = getSearchFilterSabah();
            var approval_status = '';
            var category = event.point.name;
            if (category == 'Code A') {
                approval_status = 'Code A: Accepted'
            } else if (category == 'Code B') {
                approval_status = 'Code B: Accepted with comments'
            } else if (category == 'Code C') {
                approval_status = 'Code C: Rejected'
            } else {
                approval_status = category
            }
            linkParamArr = processFilterParamArr([filter.dateFrom, filter.dateTo, 'Acknowledged', approval_status])
            window.parent.widgetConopOpen("Method Statement", "dash_cons_MS_card", linkParamArr, "Method Statement - " + category);
        }
      }
    }]
  });
  chart.updateFlag = true;
}

function drawNewMSSubmissionChart(monthYear, data, dataMsYear) {
  var tempCatArr = [];
  var tempDataArr = [];
  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      tempCatArr.push(idx);
      tempDataArr.push(parseFloat(ele));
    }
  }
  var dataArr = tempDataArr.reverse();
  var catArr = tempCatArr.reverse();

  var chart = Highcharts.chart('newMSSubmissionChart', {
    chart: {
      type: 'column',
      events: {
        render() {
          var chart = this;

          if (document.fullscreenElement && chart.updateFlag) {
            chart.updateFlag = false;
            chart.update({
              chart: {
                marginTop: 90,
              },
              title: {
                text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NEW MS SUBMISSION (' + monthYear + ')</span>'
              }
            })

            chart.updateFlag = true;
          } else if (chart.updateFlag) {
            chart.updateFlag = false;

            chart.update({
              title: {
                text: '<span class="showLabel" style="text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NEW MS SUBMISSION (' + monthYear + ')</span>'
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
      text: '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NEW MS SUBMISSION (' + monthYear + ')</span>'
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
      },
      series: {
        dataLabels: {
          formatter: function () {
            return '<span class="showLabel" style="font-size: 12px">' + this.y + '</span>';
          },
          enabled: true,
          useHTML: true,
        }
      }
    },
    colors: ['#8EC3A7'],
    series: [{
      name: 'Total',
      data: dataArr,
      cursor: 'pointer',
      showInLegend: false,
      events: {
        click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;

            var searchfilter = getSearchFilterSabah();

            var yearUsed;
            var monthUsed;

            var selYear = searchfilter.selYr;
            var selMonth = searchfilter.month;

            var monthFromChart = textMonthtoNum[event.point.category.name];

            var currentYear = new Date().getFullYear()
            var currentMonth = new Date().getMonth()

            if(selYear == 'all'){
              yearUsed = currentYear
              monthUsed = currentMonth
            }
            else{
              yearUsed = selYear
              if(selMonth == 'all'){
                monthUsed = currentMonth
              }
              else{
                monthUsed = selMonth
              }
            }

            if(monthFromChart == 12 && monthFromChart != monthUsed){
              yearUsed = yearUsed - 1
            }
            else if (monthFromChart == 11 && monthFromChart != monthUsed - 1 ){
              yearUsed = yearUsed - 1
            }

            lastdayMnth = new Date(yearUsed, monthFromChart, 0);

            dateFrom = '01-'+monthFromChart+'-'+yearUsed;
            dateTo = lastdayMnth.getDate()+'-'+monthFromChart+'-'+yearUsed;

            var linkParamArr = processFilterParamArr([dateFrom, dateTo]);
            window.parent.widgetConopOpen("Method Statement", "dash_cons_MS_card", linkParamArr, "Method Statement - " + event.point.category.name + " " + yearUsed);
        }
      }
    }],
    credits: false
  });
  chart.updateFlag = true;
}

function drawMSAgingChart(monthYear, data) {
  var lessHundred = (data.less100) ? parseInt(data.less100) : 0;
  var lessThreeHundred = (data.less300) ? parseInt(data.less300) : 0;
  var moreThreeHundred = (data.more300) ? parseInt(data.more300) : 0;

  var chart = Highcharts.chart('methodStatementChart', {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      events: {
        render() {
          var chart = this;

          if (document.fullscreenElement && chart.updateFlag) {
            chart.updateFlag = false;
            chart.update({
              chart: {
              },
              title: {
                text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>MS (' + monthYear + ')</span>'
              }
            })

            chart.updateFlag = true;
          } else if (chart.updateFlag) {
            chart.updateFlag = false;

            chart.update({
              title: {
                text: '<span class="hiddenLabel">MS</span><span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>MS (' + monthYear + ')</span>'
              }
            })
            chart.updateFlag = true;
          }
        }
      }
    },
    title: {
      enabled: true,
      useHTML: true,
      text: '<span class="hiddenLabel">MS</span><span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>MS (' + monthYear + ')</span>',
      align: 'center',
      verticalAlign: 'middle',
      style: {
        fontSize: '1em',
        fontWeight: 'bold'
      }
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
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
          format: '{point.name}: <b>{point.percentage:.1f}</b> %'
        }
      }
    },
    credits: false,
    series: [{
      type: 'pie',
      size: '90%',
      name: 'Aging',
      cursor: 'default',
      innerSize: '65%',
      data: [{
        name: '<100 Days',
        y: lessHundred,
        color: '#6EE660'
      }, {
        name: '< 100 days < 300 days',
        color: '#EFFA50',
        y: lessThreeHundred
      }, {
        name: '>300 days',
        color: '#DC5356 ',
        y: moreThreeHundred
      }]
    }]
  });
  chart.updateFlag = true;
}

function updateMACard(cumul = 0) {
  // MA - material approval
  var totalCard = `<span class="clickableCard" onclick="conOpLink('MA', 'Cumulative')">` + formatThousand(cumul) + `</span>`;

  $("#currentCumulativeMaterialCard").html(totalCard);
}

function drawMAStatusChart(monthYear, data) {
  var dataArr = [];
  var clr;
  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      if (idx == 'Code 1') {
        clr = '#6EE660';
      } else if (idx == 'Code 2') {
        clr = '#EFFA50'
      } else if (idx == 'Code 3') {
        clr = '#DC5356'
      } else if (idx == 'Code 4') {
        clr = '#FD6A37'
      } else if (idx == 'R') {
        clr = '#cccccc'
      }
      var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0, color: clr };
      dataArr.push(tempArr);
    }
  }

  var chart = Highcharts.chart('MAStatusCharts', {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
      margin: [0, 0, 0, 0],
      spacingTop: 5,
      spacingBottom: 0,
      spacingLeft: 0,
      spacingRight: 0,
      events: {
        render() {
          var chart = this;

          if (document.fullscreenElement && chart.updateFlag) {
            chart.updateFlag = false;
            chart.update({
              chart: {
                marginTop: 90,
              },
              title: {
                text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>MA STATUS (' + monthYear + ')</span>'
              }
            })

            chart.updateFlag = true;
          } else if (chart.updateFlag) {
            chart.updateFlag = false;

            chart.update({
              title: {
                text: '<span class="showLabel" style="text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>MA STATUS (' + monthYear + ')</span>'
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
      text: '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>MA STATUS (' + monthYear + ')</span>'
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
        size: '90%'
      }
    },
    credits: false,
    series: [{
      name: 'Status',
      colorByPoint: true,
      data: dataArr,
      events: {
        click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;

            var filter = getSearchFilterSabah();
            var linkParamArr = processFilterParamArr([filter.dateFrom, filter.dateTo, event.point.name, 'Acknowledged']);
            window.parent.widgetConopOpen("Material Approval", "dash_cons_MT_card", linkParamArr, 'Material Acceptance - '+event.point.name);
        }
      }
    }]
  });
  chart.updateFlag = true;
}

function drawNewMASubmissionChart(monthYear, data, dataMaYear) {
  var tempCatArr = [];
  var tempDataArr = [];
  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      tempCatArr.push(idx);
      tempDataArr.push(parseFloat(ele));
    }
  }
  var dataArr = tempDataArr.reverse();
  var catArr = tempCatArr.reverse();

  var chart = Highcharts.chart('newMTSubmissionChart', {
    chart: {
      type: 'column',
      events: {
        render() {
          var chart = this;

          if (document.fullscreenElement && chart.updateFlag) {
            chart.updateFlag = false;
            chart.update({
              chart: {
                marginTop: 90,
              },
              title: {
                text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NEW MA SUBMISSION (' + monthYear + ')</span>'
              }
            })

            chart.updateFlag = true;
          } else if (chart.updateFlag) {
            chart.updateFlag = false;

            chart.update({
              title: {
                text: '<span class="showLabel" style="text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NEW MA SUBMISSION (' + monthYear + ')</span>'
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
      text: '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NEW MA SUBMISSION (' + monthYear + ')</span>'
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
      },
      series: {
        dataLabels: {
          formatter: function () {
            return '<span class="showLabel" style="font-size: 12px">' + this.y + '</span>';
          },
          enabled: true,
          useHTML: true,
        }
      }
    },
    colors: ['#F0CB69'],
    series: [{
      name: 'Total',
      cursor: 'pointer',
      data: dataArr,
      events: {
        click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;

            var searchfilter = getSearchFilterSabah();

            var yearUsed;
            var monthUsed;

            var selYear = searchfilter.selYr;
            var selMonth = searchfilter.month;

            var monthFromChart = textMonthtoNum[event.point.category.name];

            var currentYear = new Date().getFullYear()
            var currentMonth = new Date().getMonth()

            if(selYear == 'all'){
              yearUsed = currentYear
              monthUsed = currentMonth
            }
            else{
              yearUsed = selYear
              if(selMonth == 'all'){
                monthUsed = currentMonth
              }
              else{
                monthUsed = selMonth
              }
            }

            if(monthFromChart == 12 && monthFromChart != monthUsed){
              yearUsed = yearUsed - 1
            }
            else if (monthFromChart == 11 && monthFromChart != monthUsed - 1 ){
              yearUsed = yearUsed - 1
            }

            lastdayMnth = new Date(yearUsed, monthFromChart, 0);

            dateFrom = '01-'+monthFromChart+'-'+yearUsed;
            dateTo = lastdayMnth.getDate()+'-'+monthFromChart+'-'+yearUsed;

            var linkParamArr = processFilterParamArr([dateFrom, dateTo]);
            window.parent.widgetConopOpen("Material Approval", "dash_cons_MT_card", linkParamArr, "Material Approval - " + event.point.category.name + " " + yearUsed);
        }
      },
      showInLegend: false
    }],
    credits: false
  });
  chart.updateFlag = true;
}

function drawMAAgingChart(monthYear, data) {
  var lessHundred = (data.less100) ? parseInt(data.less100) : 0;
  var lessThreeHundred = (data.less300) ? parseInt(data.less300) : 0;
  var moreThreeHundred = (data.more300) ? parseInt(data.more300) : 0;

  var chart = Highcharts.chart('matApprovalChart', {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      events: {
        render() {
          var chart = this;

          if (document.fullscreenElement && chart.updateFlag) {
            chart.updateFlag = false;
            chart.update({
              chart: {
              },
              title: {
                text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>MA (' + monthYear + ')</span>'
              }
            })

            chart.updateFlag = true;
          } else if (chart.updateFlag) {
            chart.updateFlag = false;

            chart.update({
              title: {
                text: '<span class="hiddenLabel">MA</span><span class="showLabel" style="text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>MA (' + monthYear + ')</span>'
              }
            })
            chart.updateFlag = true;
          }
        }
      }
    },
    title: {
      enabled: true,
      useHTML: true,
      text: '<span class="hiddenLabel">MA</span><span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>MA (' + monthYear + ')</span>',
      align: 'center',
      verticalAlign: 'middle',
      // y: 65,
      style: {
        fontSize: '1em',
        fontWeight: 'bold'
      }
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
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
          format: '{point.name} : <b>{point.percentage:.1f} %'
        }
      }
    },
    credits: false,
    series: [{
      type: 'pie',
      size: '90%',
      name: 'Aging',
      cursor: 'default',
      innerSize: '65%',
      data: [{
        name: '<100 Days',
        y: lessHundred,
        color: '#6EE660'
      }, {
        name: '< 100 days < 300 days',
        color: '#EFFA50',
        y: lessThreeHundred
      }, {
        name: '>300 days',
        color: '#DC5356 ',
        y: moreThreeHundred
      }]
    }]
  });
  chart.updateFlag = true;
}

function drawRFITAgingChart(monthYear, data) {
  var lessHundred = (data.less100) ? parseInt(data.less100) : 0;
  var lessThreeHundred = (data.less300) ? parseInt(data.less300) : 0;
  var moreThreeHundred = (data.more300) ? parseInt(data.more300) : 0;

  var chart = Highcharts.chart('rfitAgeChart', {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      events: {
        render() {
          var chart = this;

          if (document.fullscreenElement && chart.updateFlag) {
            chart.updateFlag = false;
            chart.update({
              chart: {
              },
              title: {
                text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>RFIT (' + monthYear + ')</span>'
              }
            })

            chart.updateFlag = true;
          } else if (chart.updateFlag) {
            chart.updateFlag = false;

            chart.update({
              title: {
                text: '<span class="hiddenLabel">RFIT</span><span class="showLabel" style="text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>RFIT (' + monthYear + ')</span>'
              }
            })
            chart.updateFlag = true;
          }
        }
      }
    },
    title: {
      enabled: true,
      useHTML: true,
      text: '<span class="hiddenLabel">RFIT</span><span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>RFIT (' + monthYear + ')</span>',
      align: 'center',
      verticalAlign: 'middle',
      // y: 65,
      style: {
        fontSize: '1em',
        fontWeight: 'bold'
      }
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
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
          format: '{point.name}: <b>{point.percentage:.1f} %'
        }
      }
    },
    credits: false,
    series: [{
      type: 'pie',
      size: '90%',
      name: 'Aging',
      cursor: 'default',
      innerSize: '65%',
      data: [{
        name: '<100 Days',
        y: lessHundred,
        color: '#6EE660'
      }, {
        name: '< 100 days < 300 days',
        color: '#EFFA50',
        y: lessThreeHundred
      }, {
        name: '>300 days',
        color: '#DC5356 ',
        y: moreThreeHundred
      }]
    }]
  });
  chart.updateFlag = true;
}

function updateRFICard(data) {
  var RFISubmittedCard = `<span class="clickableCard" onclick="conOpLink('RFIT','Current', '')">` + ((data.rfitTotal) ? formatThousand(parseInt(data.rfitTotal)) : 0) + `</span>`;
  var cummulativeSubmittedCard = `<span class="clickableCard" onclick="conOpLink('RFIT','Cumulative', '')">` + ((data.cumulTotal) ? formatThousand(parseInt(data.cumulTotal)) : 0) + `</span>`;
  var remainingCard = `<span class="clickableCard" onclick="conOpLink('RFIT','remaining', '')">` + ((data.remaining) ? formatThousand(parseInt(data.remaining)) : 0) + `</span>`;
  var repliedCard = `<span class="clickableCard" onclick="conOpLink('RFIT','replied', '')">` + ((data.replied) ? formatThousand(parseInt(data.replied)) : 0) + `</span>`;

  $('#RFISubmittedCard').html(RFISubmittedCard);
  $('#cummulativeSubmittedCard').html(cummulativeSubmittedCard);
  $('#remainingCard').html(remainingCard);
  $('#repliedCard').html(repliedCard);
}

function updateNCRWdTableData(data) {
  var ncrTableHTML = "";
  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      ncrTableHTML += '<tr>'
      ncrTableHTML += '<td>' + idx + '</td>'
      ncrTableHTML += '<td><span class="clickableCard" onclick="conOpLink(`NCR`, ``, `' + idx + '`)">' + ((ele.received) ? formatThousand(parseInt(ele.received)) : 0) + '</span></td>'
      ncrTableHTML += '<td><span class="clickableCard" onclick="conOpLink(`NCR`, `Pending`, `' + idx + '`)">' + ((ele.Open) ? formatThousand(parseInt(ele.Open)) : 0) + '</span></td>'
      ncrTableHTML += '</tr>'
    }
  }
  $("#ncrWdTbody").html(ncrTableHTML);
}

function drawNCRReceivedChart(monthYear, data, dataNcrYear) {
  var tempCatArr = [];
  var tempDataArr = [];
  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      tempCatArr.push(idx);
      tempDataArr.push(parseFloat(ele));
    }
  }
  var dataArr = tempDataArr.reverse();
  var catArr = tempCatArr.reverse();

  var chart = Highcharts.chart('NCRReceivedChart', {
    chart: {
      type: 'column',
      events: {
        render() {
          var chart = this;

          if (document.fullscreenElement && chart.updateFlag) {
            chart.updateFlag = false;
            chart.update({
              chart: {
                marginTop: 90,
              },
              title: {
                text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NCR RECEIVED (' + monthYear + ')</span>'
              }
            })

            chart.updateFlag = true;
          } else if (chart.updateFlag) {
            chart.updateFlag = false;

            chart.update({
              title: {
                text: '<span class="showLabel" style="text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NCR RECEIVED (' + monthYear + ')</span>'
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
      text: '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NCR RECEIVED (' + monthYear + ')</span>'
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
      },
      series: {
        dataLabels: {
          formatter: function () {
            return '<span class="showLabel" style="font-size: 12px">' + this.y + '</span>';
          },
          enabled: true,
          useHTML: true,
        }
      }
    },
    colors: ['#AB91C5'],
    series: [{
      name: 'Total',
      data: dataArr,
      cursor: 'pointer',
      showInLegend: false,
      events: {
        click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;
            
            var searchfilter = getSearchFilterSabah();

            var yearUsed;
            var monthUsed;

            var selYear = searchfilter.selYr;
            var selMonth = searchfilter.month;

            var monthFromChart = textMonthtoNum[event.point.category.name];

            var currentYear = new Date().getFullYear()
            var currentMonth = new Date().getMonth()

            if(selYear == 'all'){
              yearUsed = currentYear
              monthUsed = currentMonth
            }
            else{
              yearUsed = selYear
              if(selMonth == 'all'){
                monthUsed = currentMonth
              }
              else{
                monthUsed = selMonth
              }
            }

            if(monthFromChart == 12 && monthFromChart != monthUsed){
              yearUsed = yearUsed - 1
            }
            else if (monthFromChart == 11 && monthFromChart != monthUsed - 1 ){
              yearUsed = yearUsed - 1
            }

            lastdayMnth = new Date(yearUsed, monthFromChart, 0);

            dateFrom = '01-'+monthFromChart+'-'+yearUsed;
            dateTo = lastdayMnth.getDate()+'-'+monthFromChart+'-'+yearUsed;

            var linkParamArr = processFilterParamArr([dateFrom, dateTo]);
            window.parent.widgetConopOpen("NCR", "dash_cons_NCR_card_dashboard", linkParamArr, "Non Conformance Report - " + event.point.category.name + " " + yearUsed);
        }
      }
    }],
    credits: false
  });
  chart.updateFlag = true;
}

function drawNOIHSETStatusChart(monthYear, data) {
  var closeCnt = (data.Closed) ? parseInt(data.Closed) : 0;
  var openCnt = (data.Open) ? parseInt(data.Open) : 0;

  let chart = Highcharts.chart('NOIHSETStatus', {
    chart: {
      type: 'bar',
      margin: [35, 5, 35, 5],
      spacingTop: 5,
      spacingBottom: -4,
      spacingLeft: 5,
      spacingRight: 5,
      events: {
        render() {
          const chart = this;

          if (document.fullscreenElement && chart.updateFlag) {
            chart.updateFlag = false;
            chart.update({
              chart: {
                marginTop: 90,
                marginBottom: 50
              },
              title: {
                useHTML: true,
                enabled: true,
                text: '<span class="hiddenLabel" style="font-size: 15px;">Quality Management Dashboard<br>' + localStorage.p_name + '<br>SM/NOI HSET STATUS (CUMULATIVE) (' + monthYear + ')</span>' +
                  '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>SM/NOI HSET STATUS (CUMULATIVE) (' + monthYear + ')</span>'
              },
              legend: {
                symbolHeight: 15,
                symbolWidth: 15,
                itemStyle: {
                  fontSize: '15px',
                }
              }
            })

            chart.updateFlag = true;
          } else if (chart.updateFlag) {
            chart.updateFlag = false;

            chart.update({
              title: {
                useHTML: true,
                enabled: true,
                text: '<span class="hiddenLabel" style="font-size: 9px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">SM/NOI HSET STATUS (CUMULATIVE) (' + monthYear + ')</span>' +
                  '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>SM/NOI HSET STATUS (CUMULATIVE) (' + monthYear + ')</span>'
              },
              legend: {
                symbolHeight: 7,
                symbolWidth: 7,
                itemStyle: {
                  fontSize: '9px',
                }
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
      text: '<span class="hiddenLabel" style="font-size: 9px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">SM/NOI HSET STATUS (CUMULATIVE) (' + monthYear + ')</span>' +
        '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>SM/NOI HSET STATUS (CUMULATIVE) (' + monthYear + ')</span>'
    },
    xAxis: {
      categories: ['']
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },
    legend: {
      reversed: true,
      symbolHeight: 7,
      symbolWidth: 7,
      itemStyle: {
        fontSize: '9px',
      }
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        dataLabels: {
          formatter: function () {
            return '<span class="showLabel" style="font-size: 12px">' + this.y + '</span>';
          },
          enabled: true,
          useHTML: true,
        }
      },
    },
    credits: false,
    series: [{
      name: 'Close',
      color: "#4FD1CB",
      cursor: 'pointer',
      data: [closeCnt],
      events: {
        click: function (event) {
          if(localStorage.ui_pref != "ri_v3") return;

          var filter = getSearchFilterSabah();
          var linkParamArr = processFilterParamArr([filter.dateFrom, filter.dateTo, 'Health & Safety', 'Environment', 'Traffic', 'Closed']);
          window.parent.widgetConopOpen("Notice of Improvement", "dash_cons_NOI_card", linkParamArr, "Notice of Improvement - Closed");
        }
      }
    }, {
      name: 'Open',
      color: "#cccccc",
      cursor: 'pointer',
      data: [openCnt],
      events: {
        click: function (event) {
          if(localStorage.ui_pref != "ri_v3") return;

          var filter = getSearchFilterSabah();
          var linkParamArr = processFilterParamArr([filter.dateFrom, filter.dateTo, 'Health & Safety', 'Environment', 'Traffic', 'Pending']);
          window.parent.widgetConopOpen("Notice of Improvement", "dash_cons_NOI_card", linkParamArr, "Notice of Improvement - Pending");
        }
      }
    }
    ]
  });
  chart.updateFlag = true;
}

function drawNOIQualityStatusChart(monthYear, data) {
  var closeCnt = (data.Closed) ? parseInt(data.Closed) : 0;
  var openCnt = (data.Open) ? parseInt(data.Open) : 0;

  let chart = Highcharts.chart('QualityStatusCumulative', {
    chart: {
      type: 'bar',
      margin: [35, 5, 35, 5],
      spacingTop: 5,
      spacingBottom: -4,
      spacingLeft: 5,
      spacingRight: 5,
      events: {
        render() {
          const chart = this;

          if (document.fullscreenElement && chart.updateFlag) {
            chart.updateFlag = false;
            chart.update({
              chart: {
                marginTop: 90,
                marginBottom: 50
              },
              title: {
                useHTML: true,
                enabled: true,
                text: '<span class="hiddenLabel" style="font-size: 15px;">Quality Management Dashboard<br>' + localStorage.p_name + '<br>SM/NOI QUALITY STATUS (CUMULATIVE) (' + monthYear + ')</span>' +
                  '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>SM/NOI QUALITY STATUS (CUMULATIVE) (' + monthYear + ')</span>'
              },
              legend: {
                symbolHeight: 15,
                symbolWidth: 15,
                itemStyle: {
                  fontSize: '15px',
                }
              }
            })

            chart.updateFlag = true;
          } else if (chart.updateFlag) {
            chart.updateFlag = false;

            chart.update({
              title: {
                useHTML: true,
                enabled: true,
                text: '<span class="hiddenLabel" style="font-size: 9px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">SM/NOI QUALITY STATUS (CUMULATIVE) (' + monthYear + ')</span>' +
                  '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>SM/NOI QUALITY STATUS (CUMULATIVE) (' + monthYear + ')</span>'
              },
              legend: {
                symbolHeight: 7,
                symbolWidth: 7,
                itemStyle: {
                  fontSize: '9px',
                }
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
      text: '<span class="hiddenLabel" style="font-size: 9px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">SM/NOI QUALITY STATUS (CUMULATIVE) (' + monthYear + ')</span>' +
        '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>SM/NOI QUALITY STATUS (CUMULATIVE) (' + monthYear + ')</span>'
    },
    xAxis: {
      categories: ['']
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },
    legend: {
      symbolHeight: 7,
      symbolWidth: 7,
      itemStyle: {
        fontSize: '9px',
      }
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        dataLabels: {
          formatter: function () {
            return '<span class="showLabel" style="font-size: 12px">' + this.y + '</span>';
          },
          enabled: true,
          useHTML: true,
        }
      },
    },
    credits: false,
    series: [{
      name: 'Close',
      color: "#AB91C5",
      data: [closeCnt],
      events: {
        click: function (event) {
          if(localStorage.ui_pref != "ri_v3") return;
          
          var filter = getSearchFilterSabah();
          var linkParamArr = processFilterParamArr([filter.dateFrom, filter.dateTo, 'Quality', '', '', 'Closed']);
          window.parent.widgetConopOpen("Notice of Improvement", "dash_cons_NOI_card", linkParamArr, "Notice of Improvement - Close");
        }
      }
    }, {
      name: 'Open',
      color: "#cccccc",
      data: [openCnt],
      events: {
        click: function (event) {
          if(localStorage.ui_pref != "ri_v3") return;

          var filter = getSearchFilterSabah();
          var linkParamArr = processFilterParamArr([filter.dateFrom, filter.dateTo, 'Quality', '', '', 'Pending']);
          window.parent.widgetConopOpen("Notice of Improvement", "dash_cons_NOI_card", linkParamArr, "Notice of Improvement - Pending");
        }
      }
    }
    ]
  });
  chart.updateFlag = true;
}

function drawNCRAgingChart(monthYear, data) {
  var lessHundred = (data.less100) ? parseInt(data.less100) : 0;
  var lessThreeHundred = (data.less300) ? parseInt(data.less300) : 0;
  var moreThreeHundred = (data.more300) ? parseInt(data.more300) : 0;

  var chart = Highcharts.chart('NCRChart', {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false,
      events: {
        render() {
          var chart = this;

          if (document.fullscreenElement && chart.updateFlag) {
            chart.updateFlag = false;
            chart.update({
              chart: {
              },
              title: {
                text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NCR (' + monthYear + ')</span>'
              }
            })

            chart.updateFlag = true;
          } else if (chart.updateFlag) {
            chart.updateFlag = false;

            chart.update({
              title: {
                text: '<span class="hiddenLabel">NCR</span><span class="showLabel" style="text-align: center">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NCR (' + monthYear + ')</span>'
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
      text: '<span class="hiddenLabel">NCR</span><span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NCR (' + monthYear + ')</span>',
      align: 'center',
      verticalAlign: 'middle',
      // y: 40,
      style: {
        fontSize: '1em',
        fontWeight: 'bold'
      }
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
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
          format: '{point.name}: <b>{point.percentage:.1f} %'
        }
      }
    },
    credits: false,
    series: [{
      type: 'pie',
      size: '90%',
      name: 'Aging',
      cursor: 'default',
      innerSize: '65%',
      data: [{
        name: '<100 Days',
        y: lessHundred,
        color: '#6EE660'
      }, {
        name: '< 100 days < 300 days',
        color: '#EFFA50',
        y: lessThreeHundred
      }, {
        name: '>300 days',
        color: '#DC5356',
        y: moreThreeHundred
      }]
    }]
  });
  chart.updateFlag = true;
}

function drawNCRQualityStatusChart(monthYear, data) {
  var closeCnt = (data.Closed) ? parseInt(data.Closed) : 0;
  var openCnt = (data.Open) ? parseInt(data.Open) : 0;

  let chart = Highcharts.chart('NCRQualityStatus', {
    chart: {
      type: 'bar',
      margin: [35, 5, 35, 5],
      spacingTop: 5,
      spacingBottom: -4,
      spacingLeft: 5,
      spacingRight: 5,
      events: {
        render() {
          const chart = this;

          if (document.fullscreenElement && chart.updateFlag) {
            chart.updateFlag = false;
            chart.update({
              chart: {
                marginTop: 90,
                marginBottom: 50
              },
              title: {
                useHTML: true,
                enabled: true,
                text: '<span class="hiddenLabel" style="font-size: 15px;">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NCR QUALITY STATUS (CUMULATIVE) (' + monthYear + ')</span>' +
                  '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NCR QUALITY STATUS (CUMULATIVE) (' + monthYear + ')</span>'
              },
              legend: {
                symbolHeight: 15,
                symbolWidth: 15,
                itemStyle: {
                  fontSize: '15px',
                }
              }
            })

            chart.updateFlag = true;
          } else if (chart.updateFlag) {
            chart.updateFlag = false;

            chart.update({
              title: {
                useHTML: true,
                enabled: true,
                text: '<span class="hiddenLabel" style="font-size: 9px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">NCR QUALITY STATUS (CUMULATIVE) (' + monthYear + ')</span>' +
                  '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NCR QUALITY STATUS (CUMULATIVE) (' + monthYear + ')</span>'
              },
              legend: {
                symbolHeight: 7,
                symbolWidth: 7,
                itemStyle: {
                  fontSize: '9px',
                }
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
      text: '<span class="hiddenLabel" style="font-size: 9px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">NCR QUALITY STATUS (CUMULATIVE) (' + monthYear + ')</span>' +
        '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NCR QUALITY STATUS (CUMULATIVE) (' + monthYear + ')</span>'
    },
    xAxis: {
      categories: ['']
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },
    legend: {
      reversed: true,
      itemStyle: {
        fontSize: '9px'
      },
      symbolHeight: 7,
      symbolWidth: 7,
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        dataLabels: {
          formatter: function () {
            return '<span class="showLabel" style="font-size: 12px">' + this.y + '</span>';
          },
          enabled: true,
          useHTML: true,
        }
      },
    },
    credits: false,
    series: [{
      name: 'Close',
      color: "#AB91C5",
      cursor: 'pointer',
      data: [closeCnt],
      events: {
        click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;

            var filter = getSearchFilterSabah();
            var linkParamArr = processFilterParamArr([filter.dateFrom, filter.dateTo, 'Closed', 'Quality']);
            window.parent.widgetConopOpen("Non-Conformance Report", "dash_cons_NCR_card_dashboard", linkParamArr, "Non-Conformance Report - Close");
        }
      }
    }, {
      name: 'Open',
      color: "#cccccc",
      cursor: 'pointer',
      data: [openCnt],
      events: {
        click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;

            var filter = getSearchFilterSabah();
            var linkParamArr = processFilterParamArr([filter.dateFrom, filter.dateTo, 'Pending', 'Quality']);
            window.parent.widgetConopOpen("Non-Conformance Report", "dash_cons_NCR_card_dashboard", linkParamArr, "Non-Conformance Report (Quality) - Open");
        }
      }
    }
    ]
  });
  chart.updateFlag = true;
}

function drawNCRHSETStatusChart(monthYear, data) {
  var closeCnt = (data.Closed) ? parseInt(data.Closed) : 0;
  var openCnt = (data.Open) ? parseInt(data.Open) : 0;

  let chart = Highcharts.chart('NCRHSETStatus', {
    chart: {
      type: 'bar',
      margin: [35, 5, 35, 5],
      spacingTop: 5,
      spacingBottom: -4,
      spacingLeft: 5,
      spacingRight: 5,
      events: {
        render() {
          const chart = this;

          if (document.fullscreenElement && chart.updateFlag) {
            chart.updateFlag = false;
            chart.update({
              chart: {
                marginTop: 90,
                marginBottom: 50
              },
              title: {
                useHTML: true,
                enabled: true,
                text: '<span class="hiddenLabel" style="font-size: 15px;">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NCR HSET STATUS (CUMULATIVE) (' + monthYear + ')</span>' +
                  '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NCR HSET STATUS (CUMULATIVE) (' + monthYear + ')</span>'
              },
              legend: {
                symbolHeight: 15,
                symbolWidth: 15,
                itemStyle: {
                  fontSize: '15px',
                }
              }
            })

            chart.updateFlag = true;
          } else if (chart.updateFlag) {
            chart.updateFlag = false;

            chart.update({
              title: {
                useHTML: true,
                enabled: true,
                text: '<span class="hiddenLabel" style="font-size: 9px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">NCR HSET STATUS (CUMULATIVE) (' + monthYear + ')</span>' +
                  '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NCR HSET STATUS (CUMULATIVE) (' + monthYear + ')</span>'
              },
              legend: {
                symbolHeight: 7,
                symbolWidth: 7,
                itemStyle: {
                  fontSize: '9px',
                }
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
      text: '<span class="hiddenLabel" style="font-size: 9px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">NCR HSET STATUS (CUMULATIVE) (' + monthYear + ')</span>' +
        '<span class="showLabel">Quality Management Dashboard<br>' + localStorage.p_name + '<br>NCR HSET STATUS (CUMULATIVE) (' + monthYear + ')</span>'
    },
    xAxis: {
      categories: ['']
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },
    legend: {
      reversed: true,
      itemStyle: {
        fontSize: '9px'
      },
      symbolHeight: 7,
      symbolWidth: 7,
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        dataLabels: {
          formatter: function () {
            return '<span class="showLabel" style="font-size: 12px">' + this.y + '</span>';
          },
          enabled: true,
          useHTML: true,
        }
      },
    },
    credits: false,
    series: [{
      name: 'Close',
      color: "#4FD1CB",
      cursor: 'pointer',
      data: [closeCnt],
      events: {
        click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;

            var filter = getSearchFilterSabah();
            var linkParamArr = processFilterParamArr([filter.dateFrom, filter.dateTo, 'Closed', 'Health & Safety', 'Environment', 'Traffic']);
            window.parent.widgetConopOpen("Non-Conformance Report", "dash_cons_NCR_card_dashboard", linkParamArr, "Non-Conformance Report (HSET) - Close");
        }
      }
    }, {
      name: 'Open',
      color: "#cccccc",
      cursor: 'pointer',
      data: [openCnt],
      events: {
        click: function (event) {
            if(localStorage.ui_pref != "ri_v3") return;

            var filter = getSearchFilterSabah();
            var linkParamArr = processFilterParamArr([filter.dateFrom, filter.dateTo, 'Pending', 'Health & Safety', 'Environment', 'Traffic']);
            window.parent.widgetConopOpen("Non-Conformance Report", "dash_cons_NCR_card_dashboard", linkParamArr, "Non-Conformance Report (HSET) - Open");
        }
      }
    }
    ]
  });
  chart.updateFlag = true;
}

function updateCUnderReviewByRETCard(data,dataRev) {
  var retValue = 0;
  var plpsValue = 0;
  var underRevTtl = 0;

  if(data.retCard){
    retValue = data.retCard
  }

  if(data.plpsCard){
    plpsValue = data.plpsCard
  }

  if(dataRev.totalUnderRev){
    underRevTtl = dataRev.totalUnderRev
  }

  var totalReview = retValue + plpsValue;
  
  var card = `<span class="clickableCard" onclick="conOpLink('MS','Total', '')">` + formatThousand(underRevTtl) + `</span>`;
  $('#reviewMethodStatementCard').html(card);

}

function refreshInformation(packId = 'overall', year = 'all', month = 'all', fromV3 = false) {
	var dataYearMonth = "Month:" + month + " - " + "Year:" + year;
	if (!qualityData) return;

	var currDateObj = new Date();
	var currMth = parseInt(currDateObj.getMonth()) + 1;
	var currYr = parseInt(currDateObj.getFullYear());

	if (!fromV3) {
		var NcrYear = (year != 'all') ? year : currYr;
		var NcrMonth = (month != 'all') ? month : currMth;
		var NoiYear = (year != 'all') ? year : currYr;
		var NoiMonth = (month != 'all') ? month : currMth;
		var MsYear = (year != 'all') ? year : currYr;
		var MsMonth = (month != 'all') ? month : currMth;
		var MaYear = (year != 'all') ? year : currYr;
		var MaMonth = (month != 'all') ? month : currMth;

		if (month != 'all') {
		month = monthHalftext[month];
		}
	}
	else {
		var NcrYear = (year != 'all') ? year : currYr;
		var NcrMonth = (month != 'all') ? textMonthtoNumForFilter[month] : currMth;
		var NoiYear = (year != 'all') ? year : currYr;
		var NoiMonth = (month != 'all') ? textMonthtoNumForFilter[month] : currMth;
		var MsYear = (year != 'all') ? year : currYr;
		var MsMonth = (month != 'all') ? textMonthtoNumForFilter[month] : currMth;
		var MaYear = (year != 'all') ? year : currYr;
		var MaMonth = (month != 'all') ? textMonthtoNumForFilter[month] : currMth;
	}

	//ncr
	//for NCR Received bar graph (show three months data)
	var ncrData = (qualityData.ncr && qualityData.ncr[packId]) ? qualityData.ncr[packId] : [];
	var dataNcrReceived = (ncrData.cardNCR) ? ncrData.cardNCR : [];
	var tempNcrReceived = [];
	var dataNcrYear = [];
	for (var i = 2; i >= 0; i--) {
		tempNcrReceived[monthHalftext[NcrMonth]] = (dataNcrReceived[NcrYear] && dataNcrReceived[NcrYear][monthHalftext[NcrMonth]]) ? dataNcrReceived[NcrYear][monthHalftext[NcrMonth]] : [];
		dataNcrYear[monthHalftext[NcrMonth]] = parseInt(NcrYear)
		NcrMonth = NcrMonth - 1;
		if (NcrMonth == 0) {
		NcrMonth = 12;
		NcrYear = NcrYear - 1;
		}
	}
	drawNCRReceivedChart(dataYearMonth, tempNcrReceived, dataNcrYear);

	//noi
	//for NOI Received bar graph (show three months data)
	var noiData = (qualityData.noi && qualityData.noi[packId]) ? qualityData.noi[packId] : [];
	var dataNoiReceived = (noiData.cardNOI) ? noiData.cardNOI : [];
	var tempNoiReceived = [];
	var dataNOIYear = [];
	for (var i = 2; i >= 0; i--) {
		tempNoiReceived[monthHalftext[NoiMonth]] = (dataNoiReceived[NoiYear] && dataNoiReceived[NoiYear][monthHalftext[NoiMonth]]) ? dataNoiReceived[NoiYear][monthHalftext[NoiMonth]] : [];
		dataNOIYear[monthHalftext[NoiMonth]] = parseInt(NoiYear)
		NoiMonth = NoiMonth - 1;
		if (NoiMonth == 0) {
		NoiMonth = 12;
		NoiYear = NoiYear - 1;
		}
	}
	drawNOIReceivedChart(dataYearMonth, tempNoiReceived, dataNOIYear);

	//for ms Received bar graph (show three months data)
	var msData = (qualityData.ms && qualityData.ms[packId]) ? qualityData.ms[packId] : [];
	var dataMsReceived = (msData.cardMS) ? msData.cardMS : [];
	var dataMsYear = [];
	var tempMsReceived = [];
	for (var i = 2; i >= 0; i--) {
		tempMsReceived[monthHalftext[MsMonth]] = (dataMsReceived[MsYear] && dataMsReceived[MsYear][monthHalftext[MsMonth]]) ? dataMsReceived[MsYear][monthHalftext[MsMonth]] : [];
		dataMsYear[monthHalftext[MsMonth]] = parseInt(MsYear)
		MsMonth = MsMonth - 1;
		if (MsMonth == 0) {
		MsMonth = 12;
		MsYear = MsYear - 1;
		}
	}

	drawNewMSSubmissionChart(dataYearMonth, tempMsReceived, dataMsYear);

	//for ma Received bar graph (show three months data)
	var maData = (qualityData.ma && qualityData.ma[packId]) ? qualityData.ma[packId] : [];
	var dataMaReceived = (maData.cardMA) ? maData.cardMA : [];
	var tempMaReceived = [];
	var dataMaYear = [];
	for (var i = 2; i >= 0; i--) {
		tempMaReceived[monthHalftext[MaMonth]] = (dataMaReceived[MaYear] && dataMaReceived[MaYear][monthHalftext[MaMonth]]) ? dataMaReceived[MaYear][monthHalftext[MaMonth]] : [];
		dataMaYear[monthHalftext[MaMonth]] = parseInt(MaYear)
		MaMonth = MaMonth - 1;
		if (MaMonth == 0) {
		MaMonth = 12;
		MaYear = MaYear - 1;
		}
	}
	drawNewMASubmissionChart(dataYearMonth, tempMaReceived, dataMaYear);

	// sdl
	var sdData = (qualityData.sd && qualityData.sd[packId]) ? qualityData.sd[packId] : [];
	var sdTbData = (sdData[year] && sdData[year][month] && sdData[year][month].raw) ? sdData[year][month].raw : [];
	updateSDLTable(sdTbData);
	var ttl_machinery = (sdData[year] && sdData[year][month] && sdData[year][month].card && sdData[year][month].card.ttl_machinery) ? sdData[year][month].card.ttl_machinery : 0;
	var ttl_manpower = (sdData[year] && sdData[year][month] && sdData[year][month].card && sdData[year][month].card.ttl_manpower) ? sdData[year][month].card.ttl_manpower : 0;
	updateSDLCard(ttl_machinery, ttl_manpower);
	var sdWeatherData = (sdData[year] && sdData[year][month] && sdData[year][month].weather) ? sdData[year][month].weather : [];
	drawSdlWeatherChart(dataYearMonth, sdWeatherData)

	// ms
	var msData = (qualityData.ms && qualityData.ms[packId]) ? qualityData.ms[packId] : [];
	var msCumulCard = (msData.card && msData.card[year] && msData.card[year][month] && msData.card[year][month].cumulative) ? msData.card[year][month].cumulative : 0;
	updateMSCard(msCumulCard);
	var msStatusData = (msData.byStatus && msData.byStatus[year] && msData.byStatus[year][month]) ? msData.byStatus[year][month] : [];
	drawMMStatusChart(dataYearMonth, msStatusData);
	var msAgingData = (msData[year] && msData[year][month] && msData[year][month].byAging) ? msData[year][month].byAging : [];
	drawMSAgingChart(dataYearMonth, msAgingData);
	var msReviewBy = (msData.underCard && msData.underCard[year] && msData.underCard[year][month]) ? msData.underCard[year][month] : 0;
	var msUnderRev = (msData.underRevCard && msData.underRevCard[year] && msData.underRevCard[year][month]) ? msData.underRevCard[year][month] : 0;
	updateCUnderReviewByRETCard(msReviewBy,msUnderRev);

	// ma
	var maData = (qualityData.ma && qualityData.ma[packId]) ? qualityData.ma[packId] : [];
	var maCumulCard = (maData.card && maData.card[year] && maData.card[year][month] && maData.card[year][month].cumulative) ? maData.card[year][month].cumulative : 0;
	updateMACard(maCumulCard);
	var maStatusData = (maData.byStatus && maData.byStatus[year] && maData.byStatus[year][month]) ? maData.byStatus[year][month] : [];
	drawMAStatusChart(dataYearMonth, maStatusData);
	var maAgingData = (maData.byAging && maData.byAging[year] && maData.byAging[year][month]) ? maData.byAging[year][month] : [];
	drawMAAgingChart(dataYearMonth, maAgingData);

	// rfit
	var rfitCardData = (qualityData.rfit && qualityData.rfit[packId]) ? qualityData.rfit[packId] : [];
	var rfitCardYearMonth = (rfitCardData.card && rfitCardData.card[year] && rfitCardData.card[year][month]) ? rfitCardData.card[year][month] : [];
	updateRFICard(rfitCardYearMonth);
	var rfitAgingData = (rfitCardData[year] && rfitCardData[year][month] && rfitCardData[year][month].byAging) ? rfitCardData[year][month].byAging : [];
	drawRFITAgingChart(dataYearMonth, rfitAgingData);

	// ncr
	//for NCR quality & hse indicator graph
	var ncrQualityData = (ncrData.qualityStatus && ncrData.qualityStatus[year] && ncrData.qualityStatus[year][month]) ? ncrData.qualityStatus[year][month] : [];
	drawNCRQualityStatusChart(dataYearMonth, ncrQualityData);
	var ncrHSEData = (ncrData.hseStatus && ncrData.hseStatus[year] && ncrData.hseStatus[year][month]) ? ncrData.hseStatus[year][month] : [];
	drawNCRHSETStatusChart(dataYearMonth, ncrHSEData);

	//for NOI quality & hse indicator graph
	var noiQualityData = (noiData.qualityStatus && noiData.qualityStatus[year] && noiData.qualityStatus[year][month]) ? noiData.qualityStatus[year][month] : [];
	drawNOIQualityStatusChart(dataYearMonth, noiQualityData);
	var noiHSEData = (noiData.hseStatus && noiData.hseStatus[year] && noiData.hseStatus[year][month]) ? noiData.hseStatus[year][month] : [];
	drawNOIHSETStatusChart(dataYearMonth, noiHSEData);

	//for CONTROLLED OF NON CONFORMITY (NCR) BY ACTIVITIES
	var ncrWbTbData = (ncrData.table && ncrData.table[year] && ncrData.table[year][month]) ? ncrData.table[year][month] : [];
	updateNCRWdTableData(ncrWbTbData);

	// ageing ncr
	var ncrAgingData = (ncrData.byAging && ncrData.byAging[year] && ncrData.byAging[year][month]) ? ncrData.byAging[year][month] : [];
	drawNCRAgingChart(dataYearMonth, ncrAgingData);

	//rfi
	var rfiData = (qualityData.rfi && qualityData.rfi[packId]) ? qualityData.rfi[packId] : [];
	var rfiStatusCumul = (rfiData.rfiStatus && rfiData.rfiStatus[year] && rfiData.rfiStatus[year][month]) ? rfiData.rfiStatus[year][month] : [];
	RFIStatusChart(dataYearMonth, rfiStatusCumul)

}



function refreshDashboard() {
	var selWPC = $("#wpcFilter").val();
	var selYr = $('#yearFilter').val();
	if (selYr == 'all') {
		$('#monthFilter').prop("disabled", true);
		$('#monthFilter').val('all');
	} else {
		$('#monthFilter').prop("disabled", false);
	}
	var selMonth = $('#monthFilter').val();

	refreshInformation(selWPC, selYr, selMonth);
}

function refreshFromv3(filterArr) {
    var wpc = filterArr.wpc;
    var year = filterArr.year;
    var month = filterArr.month;

    refreshInformation(wpc, year, month, true);

}

$(function () {

  $.ajax({
    type: "POST",
    url: 'chartData.json.php',
    dataType: 'json',
    data: {
      page: "quality"
    },
    success: function (obj) {
      if (obj.status && obj.status == 'ok') {
        qualityData = obj.data;
        refreshInformation();
      }
    }
  });
})
