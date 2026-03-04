var pcData;
var rsData;
var dashBoardTitle = 'Planning Management';
var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};
var monthFulltext = {'01':"January",'02':"February",'03':"March",'04':"April",'05':"May",'06':"June",'07':"July",'08':"August",'09':"September",'10':"October",'11':"November",'12':"December"}
var txtMthToNum = {"1":"01","2":"02","3":"03","4":"04","5":"05","6":"06","7":"07","8":"08","9":"09","10":"10","11":"11","12":"12"};
var filter; 
var inPackageUuid = initInPackageUuid()
  

function initInPackageUuid(){
	return localStorage.inPackageUuid ? localStorage.inPackageUuid : ''
}


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
	var addtlparam = '&inPackageUuid='+inPackageUuid;

  	window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle + " - " + cardName, addtlparam);
}

function conOpLinkRS(action, wp){
	if(localStorage.ui_pref != "ri_v3") return;

	var wpFilter = window.parent.$('.packFilter').val();
	var yrFilter = window.parent.$('.yrFilter').val()
	var mthFilter = window.parent.$('.mthFilter').val()
	var yr = (yrFilter == 'all') ? new Date().getFullYear() : yrFilter;
	var mth = (mthFilter == 'all') ? txtMthToNum[new Date().getMonth()+1] : textMonthtoNum[mthFilter];
	var prevMth = (mth == '01') ? 12 : txtMthToNum[mth-1];
	var prevYr = (mth == '01') ? new Date().getFullYear()-1 : yr;
	var cardName = "";

	var startDate = prevYr+'-'+prevMth+'-26';
	var endDate = yr+'-'+mth+'-25';

	var status = (action == 'Reviewed') ? 'Verified' : action;

	var linkWinTitle = dashBoardTitle;
	var linkName = 'dash_cons_RS_card_1B';
	var linkParamArr = processFilterParamArr([status, startDate, endDate, wp]);
	if(localStorage.isParent == "isParent"){
		cardName = 'Total of '+action+' records for '+wp;
	}else{
		cardName = 'Total of '+action+' records.';
	}
	
	var addtlparam = '&inPackageUuid='+inPackageUuid;

	window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle + " - " + cardName, addtlparam);
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
					var addtlparam = '&inPackageUuid='+inPackageUuid;

					window.parent.widgetConopOpen(dashBoardTitle, "dash_cons_RS_card", linkParamArr, dashBoardTitle + '-' + event.point.name, addtlparam);
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

function updateMonthlyTable(data, dataWP){
	var wpcVal = window.parent.$('.packFilter').val();
	var rsTableRow = "";
	var rsTableHTML = "";
	var action;
	let count = 1;
	const idxSet = new Set(); 
	const rowCounts = {};

	if (data) {

		if(localStorage.isParent == 'isParent'){

			if(wpcVal == 'overall'){
				rsTableRow += '<tr>'
				rsTableRow += '<th colspan="3" style="text-align: center">Monthly Report Status</td>'
				rsTableRow += '</tr>'
				rsTableRow += '<tr>'
				rsTableRow += '<th>WP</td>'
				rsTableRow += '<th>Action</td>'
				rsTableRow += '<th>Quantity</td>'
				rsTableRow += '</tr>'
			}else{
				rsTableRow += '<tr>'
				rsTableRow += '<th colspan="2" style="text-align: center">Monthly Report Status</td>'
				rsTableRow += '</tr>'
				rsTableRow += '<tr>'
				rsTableRow += '<th>Action</td>'
				rsTableRow += '<th>Quantity</td>'
				rsTableRow += '</tr>'
			}

			$("#tblHeader").html(rsTableRow);

			if(wpcVal == 'overall'){
				if(data.parentTbl == undefined) return;

				const dataEntries = Object.entries(data.parentTbl);

				// Calculate the number of rows for each idx
				for (const [idx, ele] of dataEntries) {
					if (!rowCounts[idx]) {
						rowCounts[idx] = 0;
					}
					rowCounts[idx] += Object.keys(ele).length; // Increment count based on the number of properties
				}

				for (const [idx, ele] of Object.entries(data.parentTbl)) {
					const cntRow = rowCounts[idx]; 

					for (const key in ele) {
						if (Object.prototype.hasOwnProperty.call(ele, key)) {
							const value = ele[key];
							action = (key == 'Verified') ? 'Reviewed' : key;
							rsTableHTML += '<tr>';

							if (!idxSet.has(idx)) {
								// If idx has not been processed, add it to the Set and create the <td rowspan='...'>
								rsTableHTML += '<td rowspan = "'+ cntRow +'">' + idx + '</td>'
								idxSet.add(idx); // Mark this idx as processed
							}
				
							// Construct the HTML row for each property
							rsTableHTML += `<td><span class="clickableCard" onclick="conOpLinkRS('`+action+`', '`+idx+`')">` + action + `</span></td>`; // First column with the property key
							rsTableHTML += `<td><span class="clickableCard" onclick="conOpLinkRS('`+action+`', '`+idx+`')">` + value + `</span></td>`; // Second column with the property value
							rsTableHTML += `</tr>`;
							
						}
						count++;
					}
	
				}
			}else{
				if(dataWP == undefined) return;

				for (const [idx, ele] of Object.entries(dataWP)) {

					action = (idx == 'Verified') ? 'Reviewed' : idx;
	
					rsTableHTML += '<tr>'
					rsTableHTML += `<td><span class="clickableCard" onclick="conOpLinkRS('`+action+`', '`+wpcVal+`')">` + action + `</span></td>`
					rsTableHTML += `<td><span class="clickableCard" onclick="conOpLinkRS('`+action+`', '`+wpcVal+`')">` + ((ele) ? ele : 0) + `</span></td>`
					rsTableHTML += '</tr>'
	
				}
			}

			$("#rsInfoMonthly").html(rsTableHTML);
			
		}else{

			rsTableRow += '<tr>'
			rsTableRow += '<th colspan="2" style="text-align: center">Monthly Report Status</td>'
			rsTableRow += '</tr>'
			rsTableRow += '<tr>'
			rsTableRow += '<th>Action</td>'
			rsTableRow += '<th>Quantity</td>'
			rsTableRow += '</tr>'

			$("#tblHeader").html(rsTableRow);

			if(data.byAction == undefined) return;
			for (const [idx, ele] of Object.entries(data.byAction)) {

				action = (idx == 'Verified') ? 'Reviewed' : idx;

				rsTableHTML += '<tr>'
				rsTableHTML += `<td><span class="clickableCard" onclick="conOpLinkRS('`+action+`', '')">` + action + `</span></td>`
				rsTableHTML += `<td><span class="clickableCard" onclick="conOpLinkRS('`+action+`', '')">` + ((ele) ? ele : 0) + `</span></td>`
				rsTableHTML += '</tr>'

			}

			$("#rsInfoMonthly").html(rsTableHTML);
		}
	}
}

function reportMonthlyData(packId = 'overall', year = 'all', month = 'all'){
	var monthInfo = (rsData && rsData[packId]) ? rsData[packId] : [];
	var rsInfoStatus = (rsData && rsData[packId] && rsData[packId].byStatus) ? rsData[packId].byStatus : [];
	var rsInfoAction = (rsData && rsData[packId] && rsData[packId].byAction) ? rsData[packId].byAction : [];
	var dataMthly = (monthInfo[year] && monthInfo[year][month] && monthInfo[year][month].reportRS) ? monthInfo[year] && monthInfo[year][month] && monthInfo[year][month].reportRS : '';
	var dataByWP = (rsData && rsData[packId] && rsData[packId].byAction) ? rsData[packId].byAction : '';

	if(localStorage.isParent == 'isParent'){
		updateMonthlyTable(monthInfo, dataByWP)
	}else{
		updateMonthlyTable(monthInfo, '')
	}
	
}

window.parent.$('.yrFilter').on('change', function(){

	$("#rsInfoMonthly").html("");
	var wpcVal = (localStorage.isParent == 'isParent') ? window.parent.$('.packFilter').val() : 'overall';
	var yrFilter = $(this).val()
	var mthFilter = window.parent.$('.mthFilter').val()
	var yr = (yrFilter == 'all') ? new Date().getFullYear() : yrFilter;
	var mth = (mthFilter == 'all') ? txtMthToNum[new Date().getMonth()+1] : textMonthtoNum[mthFilter];
	var prevMth = (mth == '01') ? 12 : txtMthToNum[mth-1];
	var prevYr = (mth == '01') ? new Date().getFullYear()-1 : yr;

	$.ajax({
		type: "POST",
		url: 'chartData.json.php',
		dataType: 'json',
		data: {
			page: "planningManagement",
			currYr: yr,
			currMth: mth,
			prevYr: prevYr,
			prevMth: prevMth
		},
		success: function (obj) {
			if (obj.status && obj.status == 'ok') {
				var rsDataNew = obj.data['reportRS'];
				var monthInfo = (rsDataNew && rsDataNew[wpcVal]) ? rsDataNew[wpcVal] : [];
				updateMonthlyTable(monthInfo, '')
			}
		}
	});
});

window.parent.$('.mthFilter').on('change', function(){

	$("#rsInfoMonthly").html("");
	var wpcVal = (localStorage.isParent == 'isParent') ? window.parent.$('.packFilter').val() : 'overall';
	var yrFilter = window.parent.$('.yrFilter').val()
	var mthFilter = $(this).val()
	var yr = (yrFilter == 'all') ? new Date().getFullYear() : yrFilter;
	var mth = (mthFilter == 'all') ? txtMthToNum[new Date().getMonth()+1] : textMonthtoNum[mthFilter];
	var prevMth = (mth == '01') ? 12 : txtMthToNum[mth-1];
	var prevYr = (mth == '01') ? new Date().getFullYear()-1 : yr;

	$.ajax({
		type: "POST",
		url: 'chartData.json.php',
		dataType: 'json',
		data: {
			page: "planningManagement",
			currYr: yr,
			currMth: mth,
			prevYr: prevYr,
			prevMth: prevMth
		},
		success: function (obj) {
			console.log(obj)
			if (obj.status && obj.status == 'ok') {
				var rsDataNew = obj.data['reportRS'];
				var monthInfo = (rsDataNew && rsDataNew[wpcVal]) ? rsDataNew[wpcVal] : [];
				updateMonthlyTable(monthInfo, '')
			}
		}
	});
});

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
	filter = filterArr;

    refreshInformation(wpc, year, month, category, status);
}

$(document).ready(function(){

	var yrFilter = window.parent.$('.yrFilter').val()
	var mthFilter = window.parent.$('.mthFilter').val()
	var yr = (yrFilter == 'all') ? new Date().getFullYear() : yrFilter;
	var mth = (mthFilter == 'all') ? txtMthToNum[new Date().getMonth()+1] : textMonthtoNum[mthFilter];
	var prevMth = (mth == '01') ? 12 : txtMthToNum[mth-1];
	var prevYr = (mth == '01') ? new Date().getFullYear()-1 : yr;

	$('#wpcFilter').val('overall');
		$.ajax({
			type: "POST",
			url: 'chartData.json.php',
			dataType: 'json',
			data: {
				page: "planningManagement",
				currYr: yr,
				currMth: mth,
				prevYr: prevYr,
				prevMth: prevMth
			},
			success: function (obj) {
				if (obj.status && obj.status == 'ok') {
					pcData = obj.data['reportInfo'];
					rsData = obj.data['reportRS'];
					refreshInformation();
					reportMonthlyData();
				}
			}
		});
})