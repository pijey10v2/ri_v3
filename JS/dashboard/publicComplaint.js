var pcData;

function conOpLink(process, status){
    var linkName = '';
    var linkWinTitle = '';
    var linkParamArr = '';
    var searchfilter = getFilterDocumentSarawak();
    var cardName;
    
    switch (process) {
        case 'PC':
            linkWinTitle = 'Public Complaint'
            linkName = 'dash_cons_PBS_card'
            linkParamArr = processFilterParamArr([status, searchfilter.dateFrom, searchfilter.dateTo])
			if(status == ''){
				cardName = 'Total Public Complaint'
			}else if(status == 'Pending'){
				cardName = 'Open'
			}else{
				cardName = status
			}
            break;
    }
    window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle + " - " + cardName);
}

function updatePCCard(ttl, ttlClosed, ttlOpen){
	var totalPBCCard = ttl;
	var totalPBCcloseCard = ttlClosed;
	var totalPBCopenCard = ttlOpen;

	if(totalPBCCard > 0){
		totalPBCCard = `<span class="clickableCard" onclick="conOpLink('PC', '', '')">`+ttl+`</span>`;
	}

	if(totalPBCcloseCard > 0){
		totalPBCcloseCard = `<span class="clickableCard" onclick="conOpLink('PC', 'Closed', '')">`+ttlClosed+`</span>`;
	}

	if(totalPBCopenCard){
		totalPBCopenCard = `<span class="clickableCard" onclick="conOpLink('PC', 'Pending', '')">`+ttlOpen+`</span>`;
	}
	
    $("#totalPBC").html(totalPBCCard);
    $("#totalPBCclose").html(totalPBCcloseCard);
    $("#totalPBCopen").html(totalPBCopenCard);
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
	
	var chart = Highcharts.chart('typePBC', {
		chart: {
		  	type: 'bar',
			events: {
				render() {
					const chart = this;

					if(localStorage.ui_pref == 'ri_v3'){
						if (document.fullscreenElement && chart.updateFlag) {
							chart.updateFlag = false;
							chart.update({
							chart: {
								marginTop: 90
							},
							title: {
								useHTML: true,
								enabled: true,
								text: '<span class="showLabel" style="display: flex; text-align: center; font-size: 15px">Report Summary Dashboard<br>'+localStorage.p_name+'<br>Public Complaint Type ('+monthYear+')</span>'
							}
							})
				
							chart.updateFlag = true;
						} else if (chart.updateFlag) {
							chart.updateFlag = false;
				
							chart.update({
							title: {
								useHTML: true,
								enabled: true,
								text: '<span class="showLabel">Report Summary Dashboard<br>'+localStorage.p_name+'<br>Public Complaint Type ('+monthYear+')</span>'
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
			text: '<span class="showLabel">Report Summary Dashboard<br>'+localStorage.p_name+'<br>Public Complaint Type ('+monthYear+')</span>'
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
			name: '',
            data: dataArr,
            showInLegend: false,
			colorByPoint: true,
			cursor : 'pointer',
            events: {
                click: function (event) {
					if(localStorage.ui_pref == 'ri_v3'){
						var searchfilter = getFilterDocumentSarawak();
						linkWinTitle = 'Public Complaint'
						linkName = 'dash_cons_PBS_card'
						linkParamArr = processFilterParamArr([searchfilter.status, searchfilter.dateFrom, searchfilter.dateTo, event.point.name])
						window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ event.point.name);
					}
                }
            }
		  }
		],
	});
	chart.updateFlag = true;

}
function refreshInformation(packId = 'overall', status = 'allstatus', year = 'all', month = 'all'){
    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year+ " - " + "Status:" +status;

    var cardInfo = (pcData && pcData[packId]) ? pcData[packId] : [];

    var totalReg = (cardInfo.card && cardInfo.card[year] && cardInfo.card[year][month] && cardInfo.card[year][month].total) ? cardInfo.card[year][month].total : 0;
    var totalClosed = (cardInfo.card && cardInfo.card[year] && cardInfo.card[year][month] && cardInfo.card[year][month]['CLOSED']) ? cardInfo.card[year][month]['CLOSED'] : 0;
    var totalOpen = (cardInfo.card && cardInfo.card[year] && cardInfo.card[year][month] && cardInfo.card[year][month]['OPEN']) ? cardInfo.card[year][month]['OPEN'] : 0;
    updatePCCard(totalReg, totalClosed, totalOpen);

    var pcChartData = (cardInfo.byType && cardInfo.byType[status] && cardInfo.byType[status][year] && cardInfo.byType[status][year][month]) ? cardInfo.byType[status][year][month] : [];
	drawPCCharts(pcChartData, dataYearMonth);
}

function refreshDashboard(){
    var selWPC = $('#wpcFilter').val();
    var selYear = $('#yearFilter').val();
	var selStatus = $("#statusFilter").val();
    if (selYear == 'all') {
    	$('#monthFilter').prop("disabled", true);	
		$('#monthFilter').val('all');
    }else{
    	$('#monthFilter').prop("disabled", false);
    }
	var selMonth = $('#monthFilter').val();
    refreshInformation(selWPC, selStatus, selYear, selMonth);
}

function refreshFromv3 (filterArr){
	var wpc = filterArr.wpc;
	var year = filterArr.year;
    var month = filterArr.month;
    var status = filterArr.statusSrwk;

    refreshInformation(wpc, status, year, month);
}

$(document).ready(function(){
    $('#wpcFilter').val('overall');
	$.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "publicComplaint"
        },
        success: function (obj) {
        	if (obj.status && obj.status == 'ok') {
                pcData = obj.data;
                refreshInformation();
        	}
        }
    });
})