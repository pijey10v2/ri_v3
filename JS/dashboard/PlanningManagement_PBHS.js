var pcData;
var dashBoardTitle = 'Planning Management';
var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};
var monthFulltext = {'01':"January",'02':"February",'03':"March",'04':"April",'05':"May",'06':"June",'07':"July",'08':"August",'09':"September",'10':"October",'11':"November",'12':"December"}

function conOpLink(status){
	if(localStorage.ui_pref != "ri_v3") return;

	var linkWinTitle = dashBoardTitle
	var linkName = 'dash_cons_RS_card'
	var searchFilter = getSearchFilterSabah();
	var month = '';
	if(searchFilter.dateMon != ''){
		var monthNo = textMonthtoNum[searchFilter.dateMon];
		month = monthFulltext[monthNo];
	}
	var linkParamArr = processFilterParamArr([month, searchFilter.dateYr, status, searchFilter.reportCat])
	var cardName = status;
	if(status==''){
		cardName = 'Total';
	}
  	window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle + " - " + cardName);
}

function updatePCCard(ttl, ttlClosed, ttlOpen){
	var riskTtlCard = `<span class="clickableCard" onclick="conOpLink('', '')">`+(formatThousand(ttl))+`</span>`;
	var ttlClosed = `<span class="clickableCard" onclick="conOpLink('Closed', '')">`+(formatThousand(ttlClosed))+`</span>`;
	var ttlOpen = `<span class="clickableCard" onclick="conOpLink('Pending', '')">`+(formatThousand(ttlOpen))+`</span>`;

    $("#totalReport").html(riskTtlCard);
    $("#totalReportclose").html(ttlClosed);
    $("#totalReportopen").html(ttlOpen);
}

function drawPCCharts (data, monthYear) {
    var dataArr = [];

    if (data){
        for (const [idx, ele] of Object.entries(data)) {
        	if(idx == "") continue;
            var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0 };
            dataArr.push(tempArr);
        }

	}

	// Create the chart
	var chart = Highcharts.chart('categoryReport', {
		chart: {
		  type: 'bar',
		  events: {
			render() {
			  const chart = this;
	
			  if (document.fullscreenElement && chart.updateFlag) {
				chart.updateFlag = false;
				chart.update({
				  chart: {
					marginTop: 90
				  },
				  title: {
					useHTML: true,
					enabled: true,
					text: '<span class="showLabel" style="display: flex; text-align: center; font-size: 15px">Report Summary Dashboard<br>'+localStorage.p_name+'<br>Report Category ('+monthYear+')</span>'
				  }
				})
	
				chart.updateFlag = true;
			  } else if (chart.updateFlag) {
				chart.updateFlag = false;
	
				chart.update({
				  title: {
					useHTML: true,
					enabled: true,
					text: '<span class="showLabel">Report Summary Dashboard<br>'+localStorage.p_name+'<br>Report Category ('+monthYear+')</span>'
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
			text: '<span class="showLabel" style="">Report Summary Dashboard<br>'+localStorage.p_name+'<br>Report Category ('+monthYear+')</span>'
		},
		subtitle: {
		  text: ''
		},
		accessibility: {
		  announceNewData: {
			enabled: true
		  }
		},
		xAxis: {
		  type: 'category'
		},
		yAxis: {
		  title: {
			text: ''
		  },
		  allowDecimals: false,
	  
		},
		legend: {
		  enabled: false
		},
		plotOptions: {
		  series: {
			borderWidth: 0,
			dataLabels: {
			  enabled: true,
			  format: '{point.y}'
			}
		  }
		},
	  
		tooltip: {
		  headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
		  pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
		},

		credits:false,
	  
		series: [
		  {
			name: "",
			colorByPoint: true,
			cursor: 'pointer',
			data: dataArr,
			events: {
				click: function (event) {
					if(localStorage.ui_pref != "ri_v3") return;
					
					var filter = getSearchFilterSabah();

					var month = '';
					if(filter.dateMon != ''){
						var monthNo = textMonthtoNum[filter.dateMon];
						month = monthFulltext[monthNo];
					}

					var linkParamArr = processFilterParamArr([month, filter.dateYr, filter.reportStat, event.point.name]);
					window.parent.widgetConopOpen(dashBoardTitle, "dash_cons_RS_card", linkParamArr, dashBoardTitle + '-' + event.point.name);
				}
			  }
		  }
		],
	  });
	  chart.updateFlag = true;
}

function refreshInformation(packId = 'overall', year = 'all', month = 'all', cat = 'allcategory', status = 'allstatus'){
    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year;
    
	var cardInfo = (pcData && pcData[packId]) ? pcData[packId] : [];

    var totalReg = (cardInfo[year] && cardInfo[year][month] && cardInfo[year][month].card && cardInfo[year][month].card[cat] && cardInfo[year][month].card[cat]['total']) ? cardInfo[year][month].card[cat]['total'] : 0;
    var totalClosed = (cardInfo[year] && cardInfo[year][month] && cardInfo[year][month].card && cardInfo[year][month].card[cat] && cardInfo[year][month].card[cat]['closed']) ? cardInfo[year][month].card[cat]['closed'] : 0;
    var totalOpen = (cardInfo[year] && cardInfo[year][month] && cardInfo[year][month].card && cardInfo[year][month].card[cat] && cardInfo[year][month].card[cat]['pending']) ? cardInfo[year][month].card[cat]['pending'] : 0;
    updatePCCard(totalReg, totalClosed, totalOpen);

    var pcChartData = (cardInfo[year] && cardInfo[year][month] && cardInfo[year][month].chart && cardInfo[year][month].chart[status]) ? cardInfo[year][month].chart[status] : [];
	drawPCCharts(pcChartData, dataYearMonth);
}

function refreshDashboard(){
  var selWPC = $('#wpcFilter').val();
  var selYear = $('#yearFilter').val();
  var selCategory = $("#categoryFilter").val();
  var selStatus = $("#statusFilter").val();

  if (selYear == 'all') {
    $('#monthFilter').prop("disabled", true);	
  $('#monthFilter').val('all');
  }else{
    $('#monthFilter').prop("disabled", false);
  }
	var selMonth = $('#monthFilter').val();
  refreshInformation(selWPC, selYear, selMonth, selCategory, selStatus);
}

function refreshFromv3 (filterArr){
	var wpc = filterArr.wpc;
	var year = filterArr.year;
	var month = filterArr.month;
	var category = filterArr.reportCat;
	var status = filterArr.reportStat;

    refreshInformation(wpc, year, month, category, status);
}

$(document).ready(function(){
  $('#wpcFilter').val('overall');
	$.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "planningManagement"
        },
        success: function (obj) {
        	if (obj.status && obj.status == 'ok') {
                pcData = obj.data;
                refreshInformation();
        	}
        }
    });
})