var pcData;

function conOpLink(process, status, catg){
    var linkName = '';
    var linkWinTitle = '';
    var linkParamArr = '';
    var searchfilter = getFilterDocumentSSLR2();
    var cardName;
	var catgFilter;

	if(catg == 'all'){
		catgFilter = '';
	}else{
		catgFilter = catg;
	}

    switch (process) {
        case 'PC':
            linkWinTitle = 'Public Complaint'
            linkName = 'dash_cons_PBS_card'
            linkParamArr = processFilterParamArr([status, searchfilter.dateFrom, searchfilter.dateTo, '', catgFilter])
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

function updatePCCard(ttl, ttlClosed, ttlOpen, catg){
	var totalPBCCard = ttl;
	var totalPBCcloseCard = ttlClosed;
	var totalPBCopenCard = ttlOpen;

	if(totalPBCCard > 0){
		totalPBCCard = `<span class="clickableCard" onclick="conOpLink('PC', '', '`+catg+`')">`+ttl+`</span>`;
	}

	if(totalPBCcloseCard > 0){
		totalPBCcloseCard = `<span class="clickableCard" onclick="conOpLink('PC', 'Closed', '`+catg+`')">`+ttlClosed+`</span>`;
	}

	if(totalPBCopenCard){
		totalPBCopenCard = `<span class="clickableCard" onclick="conOpLink('PC', 'Pending', '`+catg+`')">`+ttlOpen+`</span>`;
	}
	
    $("#totalPBC").html(totalPBCCard);
    $("#totalPBCclose").html(totalPBCcloseCard);
    $("#totalPBCopen").html(totalPBCopenCard);
}

function drawPCChartsType(data, monthYear) {
    var dataArr = [];

    if (data){
		var cnt = Object.keys(Highcharts.getOptions().colors).length - 1;
        for (const [idx, ele] of Object.entries(data)) {
        	if(idx == "") continue;
            var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0, color: Highcharts.getOptions().colors[cnt] };
            dataArr.push(tempArr);

			cnt--;
        }

	}
	// Create the chart
	
	var chart = Highcharts.chart('typePBC', {
		chart: {
		  	type: 'column',
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
								text: '<span class="showLabel" style="display: flex; text-align: center; font-size: 15px">General Management Dashboard<br>'+localStorage.p_name+'<br>Public Complaint Type ('+monthYear+')</span>'
							}
							})
				
							chart.updateFlag = true;
						} else if (chart.updateFlag) {
							chart.updateFlag = false;
				
							chart.update({
							title: {
								useHTML: true,
								enabled: true,
								text: '<span class="showLabel">General Management Dashboard<br>'+localStorage.p_name+'<br>Public Complaint Type ('+monthYear+')</span>'
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
			text: '<span class="showLabel">General Management Dashboard<br>'+localStorage.p_name+'<br>Public Complaint Type ('+monthYear+')</span>'
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
		  pointFormat: '<span style="color:var(--on-surface)">{point.name}</span>: <b>{point.y}</b><br/>'
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

function drawPCChartsCatg(data, monthYear) {
    var dataArr = [];

    if (data){
		var cnt = 0;
        for (const [idx, ele] of Object.entries(data)) {
        	if(idx == "") continue;
            var tempArr = { name: idx, y: (ele) ? parseInt((ele)) : 0, color: Highcharts.getOptions().colors[cnt] };
            dataArr.push(tempArr);

			cnt++;
        }

	}
	// Create the chart
	
	var chart = Highcharts.chart('catgPBC', {
		chart: {
		  	type: 'column',
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
								text: '<span class="showLabel" style="display: flex; text-align: center; font-size: 15px">General Management Dashboard<br>'+localStorage.p_name+'<br>Public Complaint Category ('+monthYear+')</span>'
							}
							})
				
							chart.updateFlag = true;
						} else if (chart.updateFlag) {
							chart.updateFlag = false;
				
							chart.update({
							title: {
								useHTML: true,
								enabled: true,
								text: '<span class="showLabel">General Management Dashboard<br>'+localStorage.p_name+'<br>Public Complaint Category ('+monthYear+')</span>'
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
			text: '<span class="showLabel">General Management Dashboard<br>'+localStorage.p_name+'<br>Public Complaint Category ('+monthYear+')</span>'
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
		  pointFormat: '<span style="color:var(--on-surface)">{point.name}</span>: <b>{point.y}</b><br/>'
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
						linkParamArr = processFilterParamArr([searchfilter.status, searchfilter.dateFrom, searchfilter.dateTo, '', event.point.name])
						window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ event.point.name);
					}
                }
            }
		  }
		],
	});
	chart.updateFlag = true;

}

function populateCatgOption(opt){

    let optHtmlV3 = '<option value="all">Select Category</option>';
    if (opt) {
        opt.forEach(function(ele,idx){
            optHtmlV3 += '<option value="'+ele+'">'+ele+'</option>'; 
        });
    }
	$('#catgGenMgmtId', window.parent.document).html(optHtmlV3);

}

function populateTypeOption(opt){

    let optHtmlV3 = '<option value="all">Select Type</option>';
    if (opt) {
        opt.forEach(function(ele,idx){
            optHtmlV3 += '<option value="'+ele+'">'+ele+'</option>'; 
        });
    }
	$('#typeGenMgmtId', window.parent.document).html(optHtmlV3);

}

function refreshInformation(packId = 'overall', status = 'allstatus', year = 'all', month = 'all', catg = 'all'){
    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year+ " - " + "Status:" +status;

    var cardInfo = (pcData && pcData[packId]) ? pcData[packId] : [];
	var cardInfoYrMth = (cardInfo.card && cardInfo.card[year] && cardInfo.card[year][month]) ? cardInfo.card[year][month] : [];

	var totalReg = (cardInfoYrMth.total && cardInfoYrMth.total[catg]) ? cardInfoYrMth.total[catg] : 0;
	var totalClosed = (cardInfoYrMth['CLOSED'] && cardInfoYrMth['CLOSED'][catg]) ? cardInfoYrMth['CLOSED'][catg] : 0;
	var totalOpen = (cardInfoYrMth['OPEN'] && cardInfoYrMth['OPEN'][catg]) ? cardInfoYrMth['OPEN'][catg] : 0;
	
	updatePCCard(totalReg, totalClosed, totalOpen, catg);

    var pcChartData = (cardInfo.byType && cardInfo.byType[status] && cardInfo.byType[status][year] && cardInfo.byType[status][year][month] && cardInfo.byType[status][year][month][catg]) ? cardInfo.byType[status][year][month][catg] : [];
	drawPCChartsType(pcChartData, dataYearMonth, catg);

	var pcChartData = (cardInfo.byCategory && cardInfo.byCategory[status] && cardInfo.byCategory[status][year] && cardInfo.byCategory[status][year][month] && cardInfo.byCategory[status][year][month][catg]) ? cardInfo.byCategory[status][year][month][catg] : [];
	drawPCChartsCatg(pcChartData, dataYearMonth, catg);
}

function refreshFromv3 (filterArr){
	var wpc = filterArr.wpc;
	var year = filterArr.year;
    var month = filterArr.month;
    var status = filterArr.statusSrwk;
	var catg = filterArr.catgPubc;
	// var type = filterArr.typePubc;

    refreshInformation(wpc, status, year, month, catg);
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
				var optCatg = (pcData && pcData.pubcCatgOption) ? pcData.pubcCatgOption : [];
				var optType = (pcData && pcData.pubcTypeOption) ? pcData.pubcTypeOption : [];
                populateCatgOption(optCatg);
                // populateTypeOption(optType);
                refreshInformation();
        	}
        }
    });
})