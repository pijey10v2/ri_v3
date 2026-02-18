var qualityData;
var monthHalftext = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};
var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};
var textMonthtoNumForFilter = {"Jan":1,"Feb":2,"Mar":3,"Apr":4,"May":5,"Jun":6,"Jul":7,"Aug":8,"Sep":9,"Oct":10,"Nov":11,"Dec":12};

function conOpLink(process, status, workDiscipline, current, title){
  var linkName = '';
  var linkWinTitle = '';
  var linkParamArr = '';
  var searchfilter = getFilterDocumentSarawak();
  var cardName;

  switch (process) {
      case 'MS':
          linkWinTitle = 'Method Statement'
          linkName = 'dash_cons_MS_card'
          
          linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, '', searchfilter.section, '', '', status])
          cardName = status
          break;
      case 'MSCard':
          linkWinTitle = 'Method Statement'
          linkName = 'dash_cons_MS_card'
    
          linkParamArr = processFilterParamArr(['', searchfilter.dateTo, '', searchfilter.section, '', '', status])
          cardName = 'Cumulative'
          break;
      case 'MA':
          linkWinTitle = 'Method Approval'
          linkName = 'dash_cons_MT_card'
          
          linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, searchfilter.section])
          if(status == ''){
            status = "Cumulative";
          }
          cardName = status
          break;
      case 'MACard':
          linkWinTitle = 'Method Approval'
          linkName = 'dash_cons_MT_card'
            
          linkParamArr = processFilterParamArr(['', searchfilter.dateTo, searchfilter.section])
          if(status == ''){
            status = "Cumulative";
          }
          cardName = status
          break;
      case 'NCR':
          linkWinTitle = 'Non Conformance Report'
          linkName = 'dash_cons_NCR_card'
          
          linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, workDiscipline, searchfilter.section, status])
          
          cardName = workDiscipline
          break;
      case 'RFI':
          linkWinTitle = 'Request For Information'
          linkName = 'dash_cons_RFI_card'
          var dateFromRFI = searchfilter.dateFrom;
          cardName = status
          if(status == ''){
            if(current == ''){
                cardName = "Cumulative";
                dateFromRFI = '';
            }else{
                cardName = "Current";
                if(dateFromRFI!== ''){
                    current = "";
                }
            }
          }else if(status == 'Approved'){
            cardName = "Replied";
            dateFromRFI = '';
          }else if(status == 'Remaining'){
            cardName = "Remaining";
            dateFromRFI = '';
          }
          linkParamArr = processFilterParamArr([dateFromRFI, searchfilter.dateTo, searchfilter.section, status, current])
          
          break;
      case 'SDL':
          linkWinTitle = 'Site Diary Log'
          linkName = 'dash_cons_SDL_card'
          
          linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, searchfilter.section, status])
          if(status == ''){
            if(title != ''){
              cardName = title
            }else{
              cardName = ''
            }
          }else{
            cardName = status
          }
          break;
  }
  window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle + " - " + cardName);
}

function updateCUnderReviewByRETCard(data) {
  var underReviewRETCard = (data.retCard)? data.retCard: 0;
  var underReviewPLPSCard = (data.plpsCard)? data.plpsCard: 0;

  if(underReviewRETCard > 0 ){
    underReviewRETCard = `<span class="clickableCard" onclick="conOpLink('MS','RET')">`+((data.retCard)? data.retCard: 0)+`</span>`;
  }
  
  if(underReviewPLPSCard > 0){
    underReviewPLPSCard = `<span class="clickableCard" onclick="conOpLink('MS','PLPS')">`+((data.plpsCard)? data.plpsCard: 0)+`</span>`;
  }

  $('#underReviewRETCard').html(underReviewRETCard);
  $('#underReviewPLPSCard').html(underReviewPLPSCard); 
}

function drawNOIReceivedChart(data, monthYear) {
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

              if(localStorage.ui_pref == 'ri_v3'){
                if (document.fullscreenElement && chart.updateFlag) {
                  chart.updateFlag = false;
                  chart.update({
                    chart:{
                      marginTop: 90,
                    },
                    title: {
                      text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NOI RECEIVED ('+monthYear+')</span>'
                    }
                  })
      
                  chart.updateFlag = true;
                } else if (chart.updateFlag) {
                  chart.updateFlag = false;
      
                  chart.update({
                    title: {
                      text: '<span class="showLabel" style="text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NOI RECEIVED ('+monthYear+')</span>'
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
        text: '<span class="showLabel" style="text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NOI RECEIVED ('+monthYear+')</span>'
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
              formatter: function() {
                return '<span class="showLabel" style="font-size: 12px">'+this.y+'</span>';
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

                if(localStorage.ui_pref == 'ri_v3'){
                  var year = new Date().getFullYear()
                  var searchfilter = getFilterDocumentSarawak();
                  linkWinTitle = 'Notice of Improvement'
                  linkName = 'dash_cons_NOI_card'
      
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
      
                  linkParamArr = processFilterParamArr([dateFrom, dateTo, searchfilter.section])
                  window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle);
                }
            }
          }
      }],
      credits: false
  });
  chart.updateFlag = true;
}

function drawNOIQualityStatusChart(data, monthYear){
  var closeCnt = (data.Closed) ? parseInt(data.Closed) : 0;
  var openCnt = (data.Open) ? parseInt(data.Open) : 0;

  let chart = Highcharts.chart('QualityStatusCumulative', {
    chart: {
      type: 'bar',
      margin: [10, 5, 35, 5],
      spacingTop: 5,
      spacingBottom: 0,
      spacingLeft: 5,
      spacingRight: 5,
      events: {
        render() {
          const chart = this;

          if(localStorage.ui_pref == 'ri_v3'){
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
                  text: '<span class="showLabel" style="display: flex;font-size: 15px; text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NOI QUALITY STATUS ('+monthYear+')</span>'
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
                  text: '<span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NOI QUALITY STATUS ('+monthYear+')</span>'
                },
                legend: {
                  symbolHeight: 9,
                  symbolWidth: 9,
                  itemStyle: {
                    "fontSize": "9px",
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
      text: '<span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NOI QUALITY STATUS ('+monthYear+')</span>'
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
      align: 'center',
      verticalAlign: 'bottom',
      y: 5,
      symbolHeight: 9,
      symbolWidth: 9,
      itemStyle: {
        "fontSize": "9px",
      }
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        dataLabels: {
          formatter: function() {
            return '<span class="showLabel" style="font-size: 12px">'+this.y+'</span>';
          },
          enabled: true,
          useHTML: true,
        }
      },
    },
    credits: false,
    series: [{
      name: 'Close',
      color:"#AB91C5",
      cursor: 'pointer',
      data: [closeCnt],
      events: {
        click: function (event) {

            if(localStorage.ui_pref == 'ri_v3'){
              var searchfilter = getFilterDocumentSarawak();
              linkWinTitle = 'Notice of Improvement'
              linkName = 'dash_cons_NOI_card'
  
              if(event.point.series.name == "Close"){
                event.point.series.name = "Closed";
              }
  
              linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, searchfilter.section, event.point.series.name, 'Quality'])
              window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Closed');
            }
        }
      }
    }, {
      name: 'Open',
      color:"#7f8287",
      cursor: 'pointer',
      data: [openCnt],
      events: {
        click: function (event) {
            if(localStorage.ui_pref == 'ri_v3'){
              var searchfilter = getFilterDocumentSarawak();
              linkWinTitle = 'Notice of Improvement'
              linkName = 'dash_cons_NOI_card'
  
              linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, searchfilter.section, event.point.series.name, 'Quality'])
              window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Open');
            }
        }
      }
    } 
  ]
  });
  chart.updateFlag = true;
}

function drawNOIHSETStatusChart(data, monthYear){
  var closeCnt = (data.Closed) ? parseInt(data.Closed) : 0;
  var openCnt = (data.Open) ? parseInt(data.Open) : 0;

  let chart = Highcharts.chart('NOIHSETStatus', {
    chart: {
      type: 'bar',
      margin: [10, 5, 35, 5],
      spacingTop: 5,
      spacingBottom: 0,
      spacingLeft: 5,
      spacingRight: 5,
      events: {
        render() {
          const chart = this;

          if(localStorage.ui_pref == 'ri_v3'){
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
                  text: '<span class="showLabel" style="display: flex;font-size: 15px; text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NOI HSET STATUS ('+monthYear+')</span>'
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
                  text: '<span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NOI HSET STATUS ('+monthYear+')</span>'
                },
                legend: {
                  symbolHeight: 9,
                  symbolWidth: 9,
                  itemStyle: {
                    "fontSize": "9px",
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
      text: '<span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NOI HSET STATUS ('+monthYear+')</span>'
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
      align: 'center',
      verticalAlign: 'bottom',
      symbolHeight: 9,
      symbolWidth: 9,
      itemStyle: {
        "fontSize": "9px",
      },
      y: 5
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        dataLabels: {
          formatter: function() {
            return '<span class="showLabel" style="font-size: 12px">'+this.y+'</span>';
          },
          enabled: true,
          useHTML: true,
        }
      },
    },
    credits: false,
    series: [{
      name: 'Close',
      cursor: 'pointer',
      color:"#4FD1CB",
      data: [closeCnt],
      events: {
        click: function (event) {
            if(localStorage.ui_pref == 'ri_v3'){
              var searchfilter = getFilterDocumentSarawak();
              linkWinTitle = 'Notice of Improvement'
              linkName = 'dash_cons_NOI_card'
  
              if(event.point.series.name == "Close"){
                event.point.series.name = "Closed";
              }
  
              linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, searchfilter.section, event.point.series.name, 'HSET'])
              window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Closed');
            }
        }
      }
    }, {
      name: 'Open',
      cursor: 'pointer',
      color:"#7f8287",
      data: [openCnt],
      events: {
        click: function (event) {
            if(localStorage.ui_pref == 'ri_v3'){
              var searchfilter = getFilterDocumentSarawak();
              linkWinTitle = 'Notice of Improvement'
              linkName = 'dash_cons_NOI_card'
  
              linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, searchfilter.section, event.point.series.name, 'HSET'])
              window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Open');
            }
        }
      }
    } 
  ]
  });
  chart.updateFlag = true;
}

function updateSDLCard (ttlManchinery, ttlManpower){
  var totalManPowerCard = ttlManpower;
  var totalMachineryCard = ttlManchinery;

  if(totalManPowerCard > 0){
    totalManPowerCard = `<span class="clickableCard" onclick="conOpLink('SDL', '', '', '', 'Total Man Power')">`+ttlManpower+`</span>`;
  }

  if(totalMachineryCard > 0){
    totalMachineryCard = `<span class="clickableCard" onclick="conOpLink('SDL', '', '', '', 'Total Machinery')">`+ttlManchinery+`</span>`;
  }

  $("#totalManPowerCard").html(totalManPowerCard);
  $("#totalMachineryCard").html(totalMachineryCard);
}

function updateSDLTable(data){
  var sdTableHTML = "";
  if (data) {
      for (const [idx, ele] of Object.entries(data)) {
        sdTableHTML += `<tr class="clickableCard" onclick="conOpLink('SDL', '`+ele.ref_no+`')">`
        sdTableHTML += '<td>' + ele.ref_no + '</td>'
        sdTableHTML += '<td>' + ((ele.total_manpower) ? parseInt(ele.total_manpower) : 0) + '</td>'
        sdTableHTML += '<td>' + ((ele.total_machinery) ? parseInt(ele.total_machinery) : 0) + '</td>'
        sdTableHTML += '</tr>'
      }
  }
  $("#siteDiaryTBody").html(sdTableHTML); 
}

function updateMSCard(cumul = 0){
  var cumulMethodStatementCard = cumul;
  
  if(cumulMethodStatementCard > 0){
    cumulMethodStatementCard = `<span class="clickableCard" onclick="conOpLink('MSCard','', '')">`+cumul+`</span>`;
  }

  $("#cumulMethodStatementCard").html(cumulMethodStatementCard);
}

function formatMSMAData(data) {
  var dataArr = [
    {name: 'Approved', y: 0, color : ''},
    {name: 'Not Approved', y: 0, color : ''},
    {name: 'R', y: 0, color : ''}
  ];

  if (data) {
    for (const [idx, ele] of Object.entries(data)) {
      var tempArr = {name: idx, y: (ele) ? parseInt(ele) : 0, color : ''};
      var orderName = ['Approved', 'Not Approved', 'R'];
      var highestIndex = Math.max(...Object.keys(dataArr).map(Number));

      switch (idx) {
        case 'Code 1':
        case 'Closed':
        case 'Approved':
          tempArr.color='#6EE660';
          dataArr[0] = tempArr;
          break;
        case 'Code 2':
        case 'Closed':
          tempArr.color='#EFFA50';
          highestIndex < (orderName.length - 1) ?
            dataArr.splice(orderName.length, 0, tempArr) : dataArr.splice((highestIndex + 1), 0, tempArr);
          break;
        case 'Code 3':
        case 'Rejected':
        case 'Not Approved':
          tempArr.color='#DC5356';
          dataArr[1] = tempArr;
          break;
        case 'R':
        case 'Pending':
          tempArr.color='#7f8287';
          dataArr[2] = tempArr;
          break;
        default:
          highestIndex < (orderName.length - 1) ?
            dataArr.splice(orderName.length, 0, tempArr) : dataArr.splice((highestIndex + 1), 0, tempArr);
          break;
      }
    }
  }

  return dataArr;
}

function printChart(chart, type = '', data) {
  // Save legend + size
  chart.oldLegend = Highcharts.merge(chart.legend.options);

  // Legend override
  chart.legend.update({
    align: 'right',
    verticalAlign: 'bottom',
    layout: 'vertical',
    floating: true
  });

  // Check if aging chart to update title
  if (type == 'aging') {
    chart.title.update({
        align: 'center',
        verticalAlign: 'top',
        y: 30,
        style: {
            fontWeight: 'normal',
        },
        text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>MA ('+data.monthYear+')</span>'
    });
  }

  // Get the SVG of the chart
  const svg = chart.getSVG({
    plotOptions: {
      pie: {
        dataLabels: {
          distance: 60,
          connectorPadding: 30,
          style: {
            fontWeight: 'bold',
            fontSize: '16px',
            color: 'black'
          }
        },
      }
    }
  });

  // Open a new blank tab
  const printWindow = window.open('', '_blank');

  // Write chart HTML into it
  printWindow.document.write(`
    <html>
      <head>
        <title>Chart Preview</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            text-align: center;
          }
          .chart-container {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
          }
        </style>
      </head>
      <body>
        <div class="chart-container">
          ${svg}
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.onload = function () {
    printWindow.focus();

    // Listen for print cancel/finish
    printWindow.onafterprint = function () {
      printWindow.close();
    };

    // Open print dialog
    printWindow.print();

    // Restore old legend
    chart.setSize(null, null, false);
    chart.legend.update(chart.oldLegend);
  };
}

// MSStatusCharts
function drawMMStatusChart (data, monthYear) {
  var dataArr = formatMSMAData(data);

  var chart = Highcharts.chart('MSStatusCharts', {
    legend: {
      enabled: true,
      useHTML: true,
      align: 'left',
      verticalAlign: 'left',
      layout: 'vertical',
      paddingBottom: 12,
      marginBottom: 20,
      itemStyle: {
        fontSize: '12px',
        color: '#333'
      },
      itemHoverStyle: {
        color: '#000'
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 250
        },
        chartOptions: {
          legend: {
            enabled: false
          }
        }
      }]
    },
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
                legend: {
                  align: 'right',
                  verticalAlign: 'bottom',
                  layout: 'vertical',
                  floating: true,
                  itemStyle: {
                    fontSize: '16px'
                  }
                },
                title: {
                    useHTML: true,
                    enabled: true,
                    text: '<span class="showLabel" style="display:flex; font-size: 15px; text-align: center; font-color: black;">Quality Management Dashboard<br>'+localStorage.p_name+'<br>MS STATUS ('+monthYear+')</span>',
                    align: 'center',
                    verticalAlign: 'top',
                    y: 30,
                    style: {
                        fontWeight: 'normal',
                        fontSize: '15px'
                    },
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            distance: 60,
                            connectorPadding: 30,
                            style: {
                                fontWeight: 'bold',
                                fontSize: '16px',
                                color: 'black'
                            }
                        }
                    }
                }
              });

              chart.updateFlag = true;
            }
             else if (chart.updateFlag) {
              chart.updateFlag = false;
  
              chart.update({
                title: {
                  text: '<span class="showLabel" style="text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>MS STATUS ('+monthYear+')</span>'
                }
              })
              chart.updateFlag = true;
            }
          }
        },
      }
    },
    exporting: {
      enabled: true,
      chartOptions: {
        chart: {
          width: null,
          height: null,
          backgroundColor: 'white'
        }
      },
      menuItemDefinitions: {
        printChart: {
          text: 'Print chart',
          onclick: function () {
            printChart(this);
          }
        }
      }
    },
    title: {
        useHTML: true,
        enabled: true,
        text: '<span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>MS STATUS ('+monthYear+')</span>',
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
        center: ['50%', '65%'],
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          // allowedOverlap: true,
          distance: 7,
          formatter: function () {
            if (window.innerWidth >= 1280 && this.point.percentage > 0) {              
              return '<span style="color: black; -webkit-text-stroke: 1px white; text-stroke: 1px white; font-weight: bold;">' + 
                (this.point.percentage).toFixed(1) + '%' 
                + '</span>'; 
            }

            return null;
          },
          connectorColor: 'black',
          style: {
            fontWeight: 'bold',
            fontSize: '12px',
            color: 'black'
          }
        },
        size:'55%'
      }
    },
    credits: false, 
    series: [{
      name: 'Status',
      cursor: 'pointer',
      colorByPoint: true,
      data: dataArr,
      showInLegend: true,
      events: {
        click: function (event) {
          if(localStorage.ui_pref){
            var searchfilter = getFilterDocumentSarawak();
            var codefilter = event.point.name;
            linkWinTitle = 'Method Statement'
            linkName = 'dash_cons_MS_card'

            linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, codefilter, searchfilter.section])
            window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ event.point.name);
          }
        }
      }
    }]
  });
  chart.updateFlag = true;

}

function drawNewMASubmissionChart(data, monthYear) {
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

              if(localStorage.ui_pref == 'ri_v3'){
                if (document.fullscreenElement && chart.updateFlag) {
                  chart.updateFlag = false;
                  chart.update({
                    chart:{
                      marginTop: 90,
                    },
                    title: {
                      text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NEW MA SUBMISSION ('+monthYear+')</span>'
                    }
                  })
      
                  chart.updateFlag = true;
                } else if (chart.updateFlag) {
                  chart.updateFlag = false;
      
                  chart.update({
                    title: {
                      text: '<span class="showLabel" style="text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NEW MA SUBMISSION ('+monthYear+')</span>'
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
        text: '<span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NEW MA SUBMISSION ('+monthYear+')</span>'
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
              formatter: function() {
                return '<span class="showLabel" style="font-size: 12px">'+this.y+'</span>';
              },
              enabled: true,
              useHTML: true,
            }
          }
      },
      colors: ['#F0CB69'],
      series: [{
          name: 'Total',
          data: dataArr,
          cursor: 'pointer',
          showInLegend: false,
          events: {
            click: function (event) {
                if(localStorage.ui_pref == 'ri_v3'){
                  var year = new Date().getFullYear()
                  var searchfilter = getFilterDocumentSarawak();
                  linkWinTitle = 'Method Approval'
                  linkName = 'dash_cons_MT_card'
      
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
      
                  linkParamArr = processFilterParamArr([dateFrom, dateTo, searchfilter.section])
                  window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle);
                }
            }
          }
      }],
      credits: false
  });
  chart.updateFlag = true;
}

function drawNewMSSubmissionChart(data, monthYear) {
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

              if(localStorage.ui_pref == 'ri_v3'){
                if (document.fullscreenElement && chart.updateFlag) {
                  chart.updateFlag = false;
                  chart.update({
                    chart:{
                      marginTop: 90,
                    },
                    title: {
                      text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NEW MS SUBMISSION ('+monthYear+')</span>'
                    }
                  })
      
                  chart.updateFlag = true;
                } else if (chart.updateFlag) {
                  chart.updateFlag = false;
      
                  chart.update({
                    title: {
                      text: '<span class="showLabel" style="text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NEW MS SUBMISSION ('+monthYear+')</span>'
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
        text: '<span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NEW MS SUBMISSION ('+monthYear+')</span>'
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
              formatter: function() {
                return '<span class="showLabel" style="font-size: 12px">'+this.y+'</span>';
              },
              enabled: true,
              useHTML: true,
            }
          },
      },
      colors: ['#8EC3A7'],
      series: [{
          name: 'Total',
          cursor: 'pointer',
          data: dataArr,
          showInLegend: false,
          events: {
            click: function (event) {
                if(localStorage.ui_pref == 'ri_v3'){
                  var year = new Date().getFullYear()
                  var searchfilter = getFilterDocumentSarawak();
                  linkWinTitle = 'Method Statement'
                  linkName = 'dash_cons_MS_card'
      
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
      
                  linkParamArr = processFilterParamArr([dateFrom, dateTo, '', searchfilter.section])
                  window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle);
                }
            }
          }
      }],
      credits: false
  });
  chart.updateFlag = true;
}

function drawMSAgingChart(data, monthYear){
  var lessHundred = (data.less100) ? parseInt(data.less100) : 0; 
  var lessThreeHundred =  (data.less300) ? parseInt(data.less300) : 0;
  var moreThreeHundred = (data.more300) ? parseInt(data.more300) : 0; 
  let chart = Highcharts.chart('methodStatementChart', {
    legend: {
      enabled: true,
      useHTML: true,
      align: 'left',
      verticalAlign: 'left',
      layout: 'vertical',
      floating: true, 
      backgroundColor: '#fff',
      padding: 6,
      itemStyle: {
        fontSize: '12px',
        color: '#333'
      },
      itemHoverStyle: {
        color: '#000'
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 250
        },
        chartOptions: {
          legend: {
            enabled: false
          }
        }
      }]
    },
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        events: {
          render() {
            var chart = this;

            if(localStorage.ui_pref == 'ri_v3'){
              if (document.fullscreenElement && chart.updateFlag) {
                chart.updateFlag = false;
                chart.update({
                  title: {
                        align: 'center',
                        verticalAlign: 'top',
                        y: 30,
                        style: {
                            fontWeight: 'normal',
                        },                    
                        text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>MS ('+monthYear+')</span>'
                 },
                  legend: {
                    align: 'right',
                    verticalAlign: 'bottom',
                    layout: 'vertical',
                    floating: true,
                    itemStyle: {
                        fontSize: '16px'
                    }
                  },
                  plotOptions: {
                    pie: {
                        dataLabels: {
                            distance: 60,
                            connectorPadding: 30,
                            style: {
                                fontWeight: 'bold',
                                fontSize: '16px',
                                color: 'black'
                            }
                        }
                    }
                  }
                })
    
                chart.updateFlag = true;
              } else if (chart.updateFlag) {
                chart.updateFlag = false;
    
                chart.update({
                  title: {
                    text: '<span class="hiddenLabel">MS</span><span class="showLabel" style="text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>MS ('+monthYear+')</span>'
                  }
                })
                chart.updateFlag = true;
              }
            }
  
          }
        }
    },
    exporting: {
      enabled: true,
      chartOptions: {
        chart: {
          width: null,
          height: null,
          backgroundColor: 'white'
        }
      },
      menuItemDefinitions: {
        printChart: {
          text: 'Print chart',
          onclick: function () {
            printChart(this, 'aging', {'monthYear' : monthYear});
          }
        }
      }
    },
    title: {
      enabled: true,
      useHTML: true,
      text: '<span class="hiddenLabel">MS Ageing</span><span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>MS ('+monthYear+')</span>',
      align: 'center',
      verticalAlign: 'middle',
      y: 45,
      style:{
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
        center: ['50%', '65%'],
        dataLabels: {
            enabled: true,
            distance: 5,
            formatter: function () {
              if (window.innerWidth >= 1280 && this.point.percentage > 0) {              
                return '<span style="color: black; -webkit-text-stroke: 1px white; text-stroke: 1px white; font-weight: bold;">' + (this.point.percentage).toFixed(1) + '</span>'; 
              }

              return null;
            },
            connectorColor: 'black',
            style: {
              fontWeight: 'bold',
              fontSize: '12px',
              color: 'black'
            }
        },
        startAngle: 0,
        endAngle: 360,
        size: '110%'
        }
    },
    credits: false, 
    series: [{
      type: 'pie',
      size: '55%',
      name: 'Aging',
      innerSize: '65%',
      showInLegend: true,
      data: [{
        name: '<100 Days',
        y: lessHundred,
        color:'#6EE660'
      }, {
        name: '< 100 days < 300 days',
        color:'#EFFA50',
        y: lessThreeHundred
      }, {
        name: '>300 days',
        color:'#DC5356',
        y: moreThreeHundred
      }]
    }]
  });
  chart.updateFlag = true;
}

function updateMACard(cumul = 0){
    var currentCumulativeMaterialCard = cumul;

    if(currentCumulativeMaterialCard > 0){
        currentCumulativeMaterialCard = `<span class="clickableCard" onclick="conOpLink('MACard','')">`+cumul+`</span>`;
    }

    $("#currentCumulativeMaterialCard").html(currentCumulativeMaterialCard);
}

function drawMAStatusChart (data, monthYear){
  var dataArr = formatMSMAData(data);

  var chart = Highcharts.chart('MAStatusCharts', {
    legend: {
      enabled: true,
      useHTML: true,
      align: 'left',
      verticalAlign: 'left',
      layout: 'vertical',
      backgroundColor: '#fff',
      paddingBottom: 12,
      marginBottom: 20,
      itemStyle: {
        fontSize: '12px',
        color: '#333'
      },
      itemHoverStyle: {
        color: '#000'
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 250
        },
        chartOptions: {
          legend: {
            enabled: false
          }
        }
      }]
    },
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
                legend: {
                  align: 'right',
                  verticalAlign: 'bottom',
                  layout: 'vertical',
                  floating: true,
                  itemStyle: {
                    fontSize: '16px'
                  }
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            distance: 60,
                            connectorPadding: 30,
                            style: {
                                fontWeight: 'bold',
                                fontSize: '16px',
                                color: 'black'
                            }
                        },
                    },                    
                },
                title: {
                    align: 'center',
                    verticalAlign: 'top',
                    y: 30,
                    style: {
                        fontWeight: 'normal',
                    },
                    text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center;">Quality Management Dashboard<br>'+localStorage.p_name+'<br>MA STATUS ('+monthYear+')</span>'
                },
              })
  
              chart.updateFlag = true;
            } else if (chart.updateFlag) {
              chart.updateFlag = false;
  
              chart.update({
                title: {
                  text: '<span class="showLabel" style="text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>MA STATUS ('+monthYear+')</span>'
                }
              })
              chart.updateFlag = true;
            }
          }

        }
      }
    },
    exporting: {
      enabled: true,
      chartOptions: {
        chart: {
          width: null,
          height: null,
          backgroundColor: 'white'
        }
      },
      menuItemDefinitions: {
        printChart: {
          text: 'Print chart',
          onclick: function () {
            printChart(this);
          }
        }
      }
    },
    title: {
      useHTML: true,
      enabled: true,
      text: '<span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>MA STATUS ('+monthYear+')</span>'
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
        center: ['50%', '65%'],
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          // allowedOverlap: true,
          distance: 5,
          formatter: function () {
            if (window.innerWidth >= 1280 && this.point.percentage > 0) {              
              return '<span style="color: black; -webkit-text-stroke: 1px white; text-stroke: 1px white; font-weight: bold;">' + (this.point.percentage).toFixed(1) + '%' + '</span>'; 
            }

            return null;
          },
          connectorColor: 'black',
          style: {
            fontWeight: 'bold',
            fontSize: '12px',
            color: 'black'
          }
        },
        size:'55%'
      }
    },
    credits: false, 
    series: [{
      name: 'Status',
      cursor: 'pointer',
      colorByPoint: true,
      data: dataArr,
      showInLegend: true,
      events: {
        click: function (event) {
            if(localStorage.ui_pref == 'ri_v3'){
              var searchfilter = getFilterDocumentSarawak();
              linkWinTitle = 'Method Approval'
              linkName = 'dash_cons_MT_card'
  
              linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, searchfilter.section, event.point.name])
              window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ event.point.name);
            }
        }
      }
    }]
  });
  chart.updateFlag = true;
}

function drawMAAgingChart(data, monthYear){
  var lessHundred = (data.less100) ? parseInt(data.less100) : 0; 
  var lessThreeHundred =  (data.less300) ? parseInt(data.less300) : 0;
  var moreThreeHundred = (data.more300) ? parseInt(data.more300) : 0; 
  let chart = Highcharts.chart('matApprovalChart', {
    legend: {
      enabled: true,
      useHTML: true,
      labelFormatter: function () {

        if (typeof this.name === 'undefined' || typeof this.percentage === 'undefined') {
          setTimeout(() => chartRef.redraw(), 0);
          
          return 'Loading...';
        }

        if (window.innerWidth >= 1280) {              
          return 'Aging: ' + this.name;
        }

        return '';
      },
      align: 'left',
      verticalAlign: 'left',
      layout: 'vertical',
      floating: true, 
      backgroundColor: '#fff',
      padding: 6,
      itemStyle: {
        fontSize: '12px',
        color: '#333'
      },
      itemHoverStyle: {
        color: '#000'
      }
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 250
        },
        chartOptions: {
          legend: {
            enabled: false
          }
        }
      }]
    },
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        events: {
          render() {
            var chart = this;

            if(localStorage.ui_pref == 'ri_v3'){
              if (document.fullscreenElement && chart.updateFlag) {
                chart.updateFlag = false;
                chart.update({
                  chart:{
                    title: {
                        align: 'center',
                        verticalAlign: 'top',
                        y: 0,
                        style: {
                            fontSize: '15px',
                            color: 'black',
                            textAlign: 'center',
                            marginTop: '40px !important'
                        },
                        text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>MA ('+monthYear+')</span>'
                    },
                  },
                  title: {
                    align: 'center',
                    verticalAlign: 'top',
                    y: 30,
                    style: {
                        fontWeight: 'normal',
                    },
                    text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>MA ('+monthYear+')</span>'
                  },
                  legend: {
                        align: 'right',
                        verticalAlign: 'bottom',
                        layout: 'vertical',
                        floating: true,
                        itemStyle: {
                            fontSize: '16px'
                        }
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            distance: 60,
                            connectorPadding: 30,
                            style: {
                                fontWeight: 'bold',
                                fontSize: '16px',
                                color: 'black'
                            }
                        }
                    }
                }
                })
    
                chart.updateFlag = true;
              } else if (chart.updateFlag) {
                chart.updateFlag = false;
    
                chart.update({
                  title: {
                    text: '<span class="hiddenLabel">MA</span><span class="showLabel" style="text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>MA ('+monthYear+')</span>'
                  }
                })
                chart.updateFlag = true;
              }
            }
  
          }
        }
    },
    exporting: {
      enabled: true,
      chartOptions: {
        chart: {
          width: null,
          height: null,
          backgroundColor: 'white'
        }
      },
      menuItemDefinitions: {
        printChart: {
          text: 'Print chart',
          onclick: function () {
            printChart(this, 'aging', {'monthYear' : monthYear});
          }
        }
      }
    },
    title: {
      useHTML: true,
      enabled: true,
      text: '<span class="hiddenLabel">MA Ageing</span><span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>MA ('+monthYear+')</span>',
        align: 'center',
        verticalAlign: 'middle',
        y: 45,
        style:{
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
        center: ['50%', '65%'],
        dataLabels: {
            enabled: true,
            allowedOverlap: true,
            distance: 5,
            formatter: function () {
              if (window.innerWidth >= 1280 && this.point.percentage > 0) {              
                return '<span style="color: black; -webkit-text-stroke: 1px white; text-stroke: 1px white; font-weight: bold;">' + (this.point.percentage).toFixed(1) + '</span>'; 
              }

              return null;
            },
            connectorColor: 'black',
            style: {
              fontWeight: 'bold',
              fontSize: '12px'
            }
        },
        startAngle: 0,
        endAngle: 360,
        size: '110%'
        }
    },
    credits: false, 
    series: [{
      type: 'pie',
      size: '55%',
      name: 'Aging',
      innerSize: '65%',
      showInLegend: true,
      data: [{
        name: '<100 Days',
        y: lessHundred,
        color:'#6EE660'
      }, {
        name: '< 100 days < 300 days',
        color:'#EFFA50',
        y: lessThreeHundred
      }, {
        name: '>300 days',
        color:'#DC5356 ',
        y: moreThreeHundred
      }]
    }]
  });
  chart.updateFlag = true;
}

function updateRFICard(data){
    var RFISubmittedCard = (data.current) ? parseInt(data.current) : 0;
    var remainingCard = (data.remaining && data.remaining.cumul) ? parseInt(data.remaining.cumul) : 0;
    var repliedCard = (data.replied && data.replied.cumul) ? parseInt(data.replied.cumul) : 0;
    var cummulativeSubmittedCard = (data.cumul) ? parseInt(data.cumul) : 0;

    if(RFISubmittedCard > 0){
        RFISubmittedCard = `<span class="clickableCard" onclick="conOpLink('RFI', '', '', 'Yes')">`+(RFISubmittedCard)+`</span>`;
    }
    
    if(remainingCard > 0){
        remainingCard = `<span class="clickableCard" onclick="conOpLink('RFI','Remaining','','')">`+(remainingCard)+`</span>`;
    }

    if(repliedCard > 0){
        repliedCard = `<span class="clickableCard" onclick="conOpLink('RFI','Approved','','')">`+(repliedCard)+`</span>`;
    }

    if(cummulativeSubmittedCard > 0){
        cummulativeSubmittedCard = `<span class="clickableCard" onclick="conOpLink('RFI','','','')">`+cummulativeSubmittedCard+`</span>`;
    }

    $('#RFISubmittedCard').html(RFISubmittedCard); 
    $('#remainingCard').html(remainingCard); 
    $('#repliedCard').html(repliedCard); 
    $('#cummulativeSubmittedCard').html(cummulativeSubmittedCard); 
}

function updateNCRWdTableData(data){
  var ncrTableHTML = "";

  if (data) {
      for (const [idx, ele] of Object.entries(data)) {
        if(idx == ''){
        var WD = 'NODATA';
        }else{
          WD = idx;
        }
        ncrTableHTML += `<tr class="clickableCard" >`
        ncrTableHTML += '<td>' + idx + '</td>'
        ncrTableHTML += `<td onclick="conOpLink('NCR','', '`+WD+`')" >` + ((ele.received) ? parseInt(ele.received) : 0) + '</td>'
        ncrTableHTML += `<td onclick="conOpLink('NCR','Open', '`+WD+`')" >` + ((ele.Open) ? parseInt(ele.Open) : 0) + '</td>'
        ncrTableHTML += `<td onclick="conOpLink('NCR','Closed', '`+WD+`')" >` + ((ele.Closed) ? parseInt(ele.Closed) : 0) + '</td>'
        ncrTableHTML += '</tr>'
      }
  }

  $("#ncrWdTbody").html(ncrTableHTML); 
}

function drawNCRReceivedChart(data, monthYear) {
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

              if(localStorage.ui_pref == 'ri_v3'){
                if (document.fullscreenElement && chart.updateFlag) {
                  chart.updateFlag = false;
                  chart.update({
                    chart:{
                      marginTop: 90,
                    },
                    title: {
                      text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NCR RECEIVED ('+monthYear+')</span>'
                    }
                  })
      
                  chart.updateFlag = true;
                } else if (chart.updateFlag) {
                  chart.updateFlag = false;
      
                  chart.update({
                    title: {
                      text: '<span class="showLabel" style="text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NCR RECEIVED ('+monthYear+')</span>'
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
        text: '<span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NCR RECEIVED ('+monthYear+')</span>'
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
              formatter: function() {
                return '<span class="showLabel" style="font-size: 12px">'+this.y+'</span>';
              },
              enabled: true,
              useHTML: true,
            }
          }
      },
      colors: ['#AB91C5'],
      series: [{
          name: 'Total',
          cursor: 'pointer',
          data: dataArr,
          showInLegend: false,
          events: {
            click: function (event) {
                if(localStorage.ui_pref == 'ri_v3'){
                  var year = new Date().getFullYear()
                  var searchfilter = getFilterDocumentSarawak();
                  linkWinTitle = 'Non Conformance Report'
                  linkName = 'dash_cons_NCR_card'
      
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

                  linkParamArr = processFilterParamArr([dateFrom, dateTo, '', searchfilter.section])
                  window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle);
                }
            }
          }
      }],
      credits: false
  });
  chart.updateFlag = true;
}

function drawNCRAgingChart(data, monthYear){
  var lessHundred = (data.less100) ? parseInt(data.less100) : 0; 
  var lessThreeHundred =  (data.less300) ? parseInt(data.less300) : 0;
  var moreThreeHundred = (data.more300) ? parseInt(data.more300) : 0; 
  let chart = Highcharts.chart('NCRChart', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        events: {
          render() {
            var chart = this;

            if(localStorage.ui_pref == 'ri_v3'){
              if (document.fullscreenElement && chart.updateFlag) {
                chart.updateFlag = false;
                chart.update({
                  chart:{
                  },
                  title: {
                    text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NCR ('+monthYear+')</span>'
                  }
                })
    
                chart.updateFlag = true;
              } else if (chart.updateFlag) {
                chart.updateFlag = false;
    
                chart.update({
                  title: {
                    text: '<span class="hiddenLabel">NCR</span><span class="showLabel" style="text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NCR ('+monthYear+')</span>'
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
      text: '<span class="hiddenLabel">NCR</span><span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NCR ('+monthYear+')</span>',
        align: 'center',
        verticalAlign: 'middle',
        // y: 40,
        style:{
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
        dataLabels: {
            enabled: false,
            distance: -50,
            style: {
            fontWeight: 'bold',
            color: 'white'
            }
        },
        startAngle: 0,
        endAngle: 360,
        center: ['50%', '55%'],
        size: '110%'
        }
    },
    credits: false, 
    series: [{
      type: 'pie',
      size: '90%',
      name: 'Aging',
      innerSize: '65%',
      data: [{
        name: '<100 Days',
        y: lessHundred,
        color:'#6EE660'
      }, {
        name: '< 100 days < 300 days',
        color:'#EFFA50',
        y: lessThreeHundred
      }, {
        name: '>300 days',
        color:'#DC5356',
        y: moreThreeHundred
      }]
    }]
  });
  chart.updateFlag = true;
}

function drawNCRQualityStatusChart(data, monthYear){
  var closeCnt = (data.Closed) ? parseInt(data.Closed) : 0;
  var openCnt = (data.Open) ? parseInt(data.Open) : 0;

  let chart = Highcharts.chart('NCRQualityStatus', {
    chart: {
      type: 'bar',
      margin: [10, 5, 35, 5],
      spacingTop: 5,
      spacingBottom: 0,
      spacingLeft: 5,
      spacingRight: 5,
      events: {
        render() {
          const chart = this;

          if(localStorage.ui_pref == 'ri_v3'){
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
                  text: '<span class="showLabel" style="display: flex;font-size: 15px; text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NCR QUALITY STATUS ('+monthYear+')</span>'
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
                  text: '<span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NCR QUALITY STATUS ('+monthYear+')</span>'
                },
                legend: {
                  symbolHeight: 9,
                  symbolWidth: 9,
                  itemStyle: {
                    "fontSize": "9px",
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
      text: '<span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NCR QUALITY STATUS ('+monthYear+')</span>'
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
      align: 'center',
      verticalAlign: 'bottom',
      x: 0,
      y: 5,
      symbolHeight: 9,
      symbolWidth: 9,
      itemStyle: {
        "fontSize": "9px",
      }
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        dataLabels: {
          formatter: function() {
            return '<span class="showLabel" style="font-size: 12px">'+this.y+'</span>';
          },
          enabled: true,
          useHTML: true,
        }
      },
    },
    credits: false,
    series: [{
      name: 'Close',
      cursor: 'pointer',
      color:"#AB91C5",
      data: [closeCnt],
      events: {
        click: function (event) {
            if(localStorage.ui_pref == 'ri_v3'){
              var searchfilter = getFilterDocumentSarawak();
              linkWinTitle = 'Non Conformance Report'
              linkName = 'dash_cons_NCR_card'
  
              if(event.point.series.userOptions.name == "Close"){
                event.point.series.userOptions.name = "Closed";
              }
  
              linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, '', searchfilter.section, event.point.series.userOptions.name, 'Quality'])
              window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Closed');
            }
        }
      }
    }, {
      name: 'Open',
      cursor: 'pointer',
      color:"#7f8287",
      data: [openCnt],
      events: {
        click: function (event) {
            if(localStorage.ui_pref == 'ri_v3'){
              var searchfilter = getFilterDocumentSarawak();
              linkWinTitle = 'Non Conformance Report'
              linkName = 'dash_cons_NCR_card'
  
              linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, '', searchfilter.section, event.point.series.userOptions.name, 'Quality'])
              window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Open');
            }
        }
      }
    } 
  ]
  });
  chart.updateFlag = true;
}

function drawNCRHSETStatusChart(data, monthYear){
  var closeCnt = (data.Closed) ? parseInt(data.Closed) : 0;
  var openCnt = (data.Open) ? parseInt(data.Open) : 0;

  let chart = Highcharts.chart('NCRHSETStatus', {
    chart: {
      type: 'bar',
      margin: [10, 5, 35, 5],
      spacingTop: 5,
      spacingBottom: 0,
      spacingLeft: 5,
      spacingRight: 5,
      events: {
        render() {
          const chart = this;

          if(localStorage.ui_pref == 'ri_v3'){
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
                  text: '<span class="showLabel" style="display: flex;font-size: 15px; text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NCR HSET STATUS ('+monthYear+')</span>'
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
                  text: '<span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NCR HSET STATUS ('+monthYear+')</span>'
                },
                legend: {
                  symbolHeight: 9,
                  symbolWidth: 9,
                  itemStyle: {
                    "fontSize": "9px",
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
      text: '<span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>NCR HSET STATUS ('+monthYear+')</span>'
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
      align: 'center',
      verticalAlign: 'bottom',
      y: 5,
      symbolHeight: 9,
      symbolWidth: 9,
      itemStyle: {
        "fontSize": "9px",
      }
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        dataLabels: {
          formatter: function() {
            return '<span class="showLabel" style="font-size: 12px">'+this.y+'</span>';
          },
          enabled: true,
          useHTML: true,
        }
      },
    },
    credits: false,
    series: [{
      name: 'Close',
      cursor: 'pointer',
      color:"#4FD1CB",
      data: [closeCnt],
      events: {
        click: function (event) {
            if(localStorage.ui_pref == 'ri_v3'){
              var searchfilter = getFilterDocumentSarawak();
              linkWinTitle = 'Non Conformance Report'
              linkName = 'dash_cons_NCR_card'
  
              if(event.point.series.userOptions.name == "Close"){
                event.point.series.userOptions.name = "Closed";
              }
  
              linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, '', searchfilter.section, event.point.series.userOptions.name, 'HSET'])
              window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Closed');
            }
        }
      }
    }, {
      name: 'Open',
      cursor: 'pointer',
      color:"#7f8287",
      data: [openCnt],
      events: {
        click: function (event) {
            if(localStorage.ui_pref == 'ri_v3'){
              var searchfilter = getFilterDocumentSarawak();
              linkWinTitle = 'Non Conformance Report'
              linkName = 'dash_cons_NCR_card'
  
              linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, '', searchfilter.section, event.point.series.userOptions.name, 'HSET'])
              window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Open');
            }
        }
      }
    } 
  ]
  });
  chart.updateFlag = true;
}

function drawWIRQualityStatusChart(data, monthYear){
  var closeCnt = (data.Closed) ? parseInt(data.Closed) : 0;
  var openCnt = (data.Open) ? parseInt(data.Open) : 0;

  let chart = Highcharts.chart('WIRQualityStatus', {
    chart: {
      type: 'bar',
      margin: [10, 5, 35, 5],
      spacingTop: 5,
      spacingBottom: 0,
      spacingLeft: 5,
      spacingRight: 5,
      events: {
        render() {
          const chart = this;

          if(localStorage.ui_pref == 'ri_v3'){
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
                  text: '<span class="showLabel" style="display: flex;font-size: 15px; text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>WIR QUALITY STATUS ('+monthYear+')</span>'
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
                  text: '<span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>WIR QUALITY STATUS ('+monthYear+')</span>'
                },
                legend: {
                  symbolHeight: 9,
                  symbolWidth: 9,
                  itemStyle: {
                    "fontSize": "9px",
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
      text: '<span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>WIR QUALITY STATUS ('+monthYear+')</span>'
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
      align: 'center',
      verticalAlign: 'bottom',
      y: 5,
      symbolHeight: 9,
      symbolWidth: 9,
      itemStyle: {
        "fontSize": "9px",
      }
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        dataLabels: {
          formatter: function() {
            return '<span class="showLabel" style="font-size: 12px">'+this.y+'</span>';
          },
          enabled: true,
          useHTML: true,
        }
      },
    },
    credits: false,
    series: [{
      name: 'Close',
      cursor: 'pointer',
      color:"#AB91C5",
      data: [closeCnt],
      events: {
        click: function (event) {
            if(localStorage.ui_pref == 'ri_v3'){
              var searchfilter = getFilterDocumentSarawak();
              linkWinTitle = 'Work Inspection Request'
              linkName = 'dash_cons_WIR_card'
  
              if(event.point.series.name == "Close"){
                event.point.series.name = "Closed";
              }
  
              linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, searchfilter.section, event.point.series.name, 'Quality'])
              window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Closed');
            }
        }
      }
    }, {
      name: 'Open',
      cursor: 'pointer',
      color:"#7f8287",
      data: [openCnt],
      events: {
        click: function (event) {
            if(localStorage.ui_pref == 'ri_v3'){
              var searchfilter = getFilterDocumentSarawak();
              linkWinTitle = 'Work Inspection Request'
              linkName = 'dash_cons_WIR_card'
  
              if(event.point.series.name == "Open"){
                event.point.series.name = "Pending";
              }
  
              linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, searchfilter.section, event.point.series.name, 'Quality'])
              window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Open');
            }
        }
      }
    } 
  ]
  });
  chart.updateFlag = true;
}

function drawWIRHSETStatusChart(data, monthYear){
  var closeCnt = (data.Closed) ? parseInt(data.Closed) : 0;
  var openCnt = (data.Open) ? parseInt(data.Open) : 0;

  let chart = Highcharts.chart('WIRHSETStatus', {
    chart: {
      type: 'bar',
      margin: [10, 5, 35, 5],
      spacingTop: 5,
      spacingBottom: 0,
      spacingLeft: 5,
      spacingRight: 5,
      events: {
        render() {
          const chart = this;

          if(localStorage.ui_pref == 'ri_v3'){
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
                  text: '<span class="showLabel" style="display: flex;font-size: 15px; text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>WIR HSET STATUS ('+monthYear+')</span>'
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
                  text: '<span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>WIR HSET STATUS ('+monthYear+')</span>'
                },
                legend: {
                  symbolHeight: 9,
                  symbolWidth: 9,
                  itemStyle: {
                    "fontSize": "9px",
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
      text: '<span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>WIR HSET STATUS ('+monthYear+')</span>'
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
      align: 'center',
      verticalAlign: 'bottom',
      y: 5,
      symbolHeight: 9,
      symbolWidth: 9,
      itemStyle: {
        "fontSize": "9px",
      }
    },
    plotOptions: {
      series: {
        stacking: 'normal',
      },
    },
    credits: false,
    series: [{
      name: 'Close',
      cursor: 'pointer',
      color:"#4FD1CB",
      data: [closeCnt],
      events: {
        click: function (event) {
            if(localStorage.ui_pref == 'ri_v3'){
              var searchfilter = getFilterDocumentSarawak();
              linkWinTitle = 'Work Inspection Request'
              linkName = 'dash_cons_WIR_card'
  
              if(event.point.series.name == "Close"){
                event.point.series.name = "Closed";
              }
  
              linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, searchfilter.section, event.point.series.name, 'HSET'])
              window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Closed');
            }
        }
      }
    }, {
      name: 'Open',
      cursor: 'pointer',
      color:"#7f8287",
      data: [openCnt],
      events: {
        click: function (event) {
            if(localStorage.ui_pref == 'ri_v3'){
              var searchfilter = getFilterDocumentSarawak();
              linkWinTitle = 'Work Inspection Request'
              linkName = 'dash_cons_WIR_card'
  
              if(searchfilter.section == "overall"){
                searchfilter.section = "";
              }
  
              if(event.point.series.name == "Open"){
                event.point.series.name = "Pending";
              }
  
              linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo, searchfilter.section, event.point.series.name, 'HSET'])
              window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - Open');
            }
        }
      }
    } 
  ]
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

function refreshInformation(packId = 'overall', sectionId = 'overall', year = 'all', month = 'all', fromV3 = false) {
    if (!qualityData) return;
    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year; 

    var currDateObj = new Date();
    var currMth = parseInt(currDateObj.getMonth())+1;
    var currYr = parseInt(currDateObj.getFullYear());
    if(!fromV3){
      var NcrYear = (year != 'all') ? year : currYr;
      var NcrMonth = (month != 'all') ? month : currMth;
      var NoiYear = (year != 'all') ? year : currYr;
      var NoiMonth = (month != 'all') ? month : currMth;
      var MsYear = (year != 'all') ? year : currYr;
      var MsMonth = (month != 'all') ? month : currMth;
      var MaYear = (year != 'all') ? year : currYr;
      var MaMonth = (month != 'all') ? month : currMth;

      if(month != 'all'){
        month = monthHalftext[month];
      }
    }
    else{
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
    var ncrData = (qualityData.ncr && qualityData.ncr[packId] && qualityData.ncr[packId][sectionId]) ? qualityData.ncr[packId][sectionId] : [];
    var noiData = (qualityData.noi && qualityData.noi[packId] && qualityData.noi[packId][sectionId]) ? qualityData.noi[packId][sectionId] : [];
    var wirData = (qualityData.wir && qualityData.wir[packId] && qualityData.wir[packId][sectionId]) ? qualityData.wir[packId][sectionId] : [];
    
    var dataNcrReceived = (ncrData.cardNCR) ? ncrData.cardNCR : [];
    var tempNcrReceived = [];
    for (var i = 2; i >= 0; i--) {
        tempNcrReceived[monthHalftext[NcrMonth]] = (dataNcrReceived[NcrYear] && dataNcrReceived[NcrYear][monthHalftext[NcrMonth]]) ? parseInt(dataNcrReceived[NcrYear][monthHalftext[NcrMonth]]) : 0;
        NcrMonth = NcrMonth-1;
        if (NcrMonth == 0) {
            NcrMonth = 12;
            NcrYear = NcrYear - 1;
        }
    }
    drawNCRReceivedChart(tempNcrReceived, dataYearMonth);

    //for NCR quality & hse indicator graph
    var ncrQualityData = (ncrData.qualityStatus && ncrData.qualityStatus[year] && ncrData.qualityStatus[year][month] ) ? ncrData.qualityStatus[year][month] : [];
    drawNCRQualityStatusChart(ncrQualityData, dataYearMonth);
    var ncrHSEData = (ncrData.hseStatus && ncrData.hseStatus[year] && ncrData.hseStatus[year][month]) ? ncrData.hseStatus[year][month] : [];
    drawNCRHSETStatusChart(ncrHSEData, dataYearMonth);

    //for NOI quality & hse indicator graph
    var noiQualityData = (noiData.qualityStatus && noiData.qualityStatus[year] && noiData.qualityStatus[year][month] ) ? noiData.qualityStatus[year][month] : [];
    drawNOIQualityStatusChart(noiQualityData, dataYearMonth);
    var noiHSEData = (noiData.hseStatus && noiData.hseStatus[year] && noiData.hseStatus[year][month]) ? noiData.hseStatus[year][month] : [];
    drawNOIHSETStatusChart(noiHSEData, dataYearMonth);

    //for WIR quality & hse indicator graph
    var wirQualityData = (wirData.qualityStatus && wirData.qualityStatus[year] && wirData.qualityStatus[year][month] ) ? wirData.qualityStatus[year][month] : [];
    drawWIRQualityStatusChart(wirQualityData, dataYearMonth);
    var wirHSEData = (wirData.hseStatus && wirData.hseStatus[year] && wirData.hseStatus[year][month]) ? wirData.hseStatus[year][month] : [];
    drawWIRHSETStatusChart(wirHSEData, dataYearMonth);

    //for CONTROLLED OF NON CONFORMITY (NCR) BY ACTIVITIES
    var ncrWbTbData = (ncrData.table && ncrData.table[year] && ncrData.table[year][month]) ? ncrData.table[year][month] : [];
    updateNCRWdTableData(ncrWbTbData);

    // ageing ncr
    var ncrAgingData = (ncrData.byAging && ncrData.byAging[year] && ncrData.byAging[year][month]) ? ncrData.byAging[year][month] : [];
    drawNCRAgingChart(ncrAgingData, dataYearMonth);

    // rfi
    var rfiCardData = (qualityData.rfi && qualityData.rfi[packId] && qualityData.rfi[packId][sectionId] && qualityData.rfi[packId][sectionId]) ? qualityData.rfi[packId][sectionId] : [];
    var rfiDetailsData = (rfiCardData.card && rfiCardData.card[year] && rfiCardData.card[year][month]) ? rfiCardData.card[year][month] : 0;
    updateRFICard(rfiDetailsData);

    //noi
    //for NOI Received bar graph (show three months data)
    var noiData = (qualityData.noi && qualityData.noi[packId] && qualityData.noi[packId][sectionId]) ? qualityData.noi[packId][sectionId] : [];
    var dataNoiReceived = (noiData.cardNOI) ? noiData.cardNOI : [];
    var tempNoiReceived = [];
    for (var i = 2; i >= 0; i--) {
      tempNoiReceived[monthHalftext[NoiMonth]] = (dataNoiReceived[NoiYear] && dataNoiReceived[NoiYear][monthHalftext[NoiMonth]]) ? parseInt(dataNoiReceived[NoiYear][monthHalftext[NoiMonth]]) : 0;
        NoiMonth = NoiMonth-1;
        if (NoiMonth == 0) {
            NoiMonth = 12;
            NoiYear = NoiYear - 1;
        }
    }
    drawNOIReceivedChart(tempNoiReceived);

    // sdl
    var sdData = (qualityData.sd && qualityData.sd[packId] && qualityData.sd[packId][sectionId] && qualityData.sd[packId][sectionId][year] && qualityData.sd[packId][sectionId][year][month]) ? qualityData.sd[packId][sectionId][year][month] : [];
    var sdTbData = (sdData.raw) ? sdData.raw : [];
    updateSDLTable(sdTbData);
    var ttl_machinery = (sdData.card && sdData.card.avg_machinery) ? sdData.card.avg_machinery : 0;
    var ttl_manpower = (sdData.card && sdData.card.avg_manpower) ? sdData.card.avg_manpower : 0;
    updateSDLCard(ttl_machinery, ttl_manpower);

    // ms
    var msData = (qualityData.ms && qualityData.ms[packId] && qualityData.ms[packId][sectionId]) ? qualityData.ms[packId][sectionId] : [];
    var msCumulCard = '';
    if(year != 'all'){
      msCumulCard = (msData.card && msData.card.cumulative && msData.card.cumulative[year] && msData.card.cumulative[year][month]) ? msData.card.cumulative[year][month] : 0;
    } else {
      msCumulCard = (msData.card && msData.card.cumul && msData.card.cumul[year] && msData.card.cumul[year][month]) ? msData.card.cumul[year][month] : 0;
    }
    updateMSCard(msCumulCard);

    var msStatusData = (msData.byStatus && msData.byStatus[year] && msData.byStatus[year][month]) ? msData.byStatus[year][month] : [];
    drawMMStatusChart(msStatusData, dataYearMonth);
    var msAgingData = (msData.byAging && msData.byAging[year] && msData.byAging[year][month]) ? msData.byAging[year][month] : [];
    drawMSAgingChart(msAgingData, dataYearMonth);

    var msReviewBy = (msData && msData.underCard && msData.underCard[year] && msData.underCard[year][month]) ? msData.underCard[year][month] : [];
    updateCUnderReviewByRETCard(msReviewBy);

    //for ms Received bar graph (show three months data)
    var msData = (qualityData.ms && qualityData.ms[packId] && qualityData.ms[packId][sectionId]) ? qualityData.ms[packId][sectionId] : [];
    var dataMsReceived = (msData.cardMS) ? msData.cardMS : [];
    var tempMsReceived = [];
    for (var i = 2; i >= 0; i--) {
      tempMsReceived[monthHalftext[MsMonth]] = (dataMsReceived[MsYear] && dataMsReceived[MsYear][monthHalftext[MsMonth]]) ? parseInt(dataMsReceived[MsYear][monthHalftext[MsMonth]]) : 0;
        MsMonth = MsMonth-1;
        if (MsMonth == 0) {
            MsMonth = 12;
            MsYear = MsYear - 1;
        }
    }
    drawNewMSSubmissionChart(tempMsReceived, dataYearMonth);

    // ma
    var maCumulCard = '';
    var maData = (qualityData.ma && qualityData.ma[packId] && qualityData.ma[packId][sectionId]) ? qualityData.ma[packId][sectionId] : [];

    if(year != 'all'){
      maCumulCard = (maData.card && maData.card.cumulative && maData.card.cumulative[year] && maData.card.cumulative[year][month]) ? maData.card.cumulative[year][month] : 0;
    } else {
      maCumulCard = (maData.card && maData.card.cumul && maData.card.cumul[year] && maData.card.cumul[year][month]) ? maData.card.cumul[year][month] : 0;
    }
    
    updateMACard(maCumulCard);

    var maStatusData = (maData.byStatus && maData.byStatus[year] && maData.byStatus[year][month]) ? maData.byStatus[year][month] : [];
    drawMAStatusChart(maStatusData, dataYearMonth);
    var maAgingData = (maData.byAging && maData.byAging[year] && maData.byAging[year][month]) ? maData.byAging[year][month] : [];
    drawMAAgingChart(maAgingData, dataYearMonth);

    //for ma Received bar graph (show three months data)
    var maData = (qualityData.ma && qualityData.ma[packId] && qualityData.ma[packId][sectionId]) ? qualityData.ma[packId][sectionId] : [];
    var dataMaReceived = (maData.cardMA) ? maData.cardMA : [];
    var tempMaReceived = [];
    for (var i = 2; i >= 0; i--) {
      tempMaReceived[monthHalftext[MaMonth]] = (dataMaReceived[MaYear] && dataMaReceived[MaYear][monthHalftext[MaMonth]]) ? parseInt(dataMaReceived[MaYear][monthHalftext[MaMonth]]) : 0;
        MaMonth = MaMonth-1;
        if (MaMonth == 0) {
            MaMonth = 12;
            MaYear = MaYear - 1;
        }
    }
    drawNewMASubmissionChart(tempMaReceived, dataYearMonth); 
}

function refreshDashboard(){
  var selWPC = $("#wpcFilter").val();
  var selYr = $('#yearFilter').val();
	var selSection = $("#sectionFilter").val();
  if(selWPC == 'overall'){
		selSection == 'overall';
	}
  if (selYr == 'all') {
    $('#monthFilter').prop("disabled", true);	
    $('#monthFilter').val('all');
  }else{
    $('#monthFilter').prop("disabled", false);
  }
	var selMonth = $('#monthFilter').val();

  refreshInformation(selWPC, selSection, selYr, selMonth);
}

function refreshFromv3 (filterArr){
  var wpc = filterArr.wpc;
  var section = filterArr.section;
	var year = filterArr.year;
  var month = filterArr.month;
  refreshInformation(wpc, section, year, month, true);
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
            var sectionData = (qualityData.section && qualityData.section['overall']) ? qualityData.section['overall'] : [];
				    populateSectionFilter(sectionData);
            refreshInformation();
        }
      }
  });

  // only update section filter when overall changed
  $("#wpcFilter").change(function () {
    var sectionData = (qualityData.section && qualityData.section[$(this).val()]) ? qualityData.section[$(this).val()] : [];
    populateSectionFilter(sectionData);
		refreshDashboard()

  })

})
