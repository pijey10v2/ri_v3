var heavyData;
var legendColorArr = {
	'green': '#52BE80', 
	'yellow': '#F4D03F',
	'orange' : '#E65C00',
	'red' : '#E93232',
	'blue': '#0066ff',
	'grey': '#A8A8A8',
	'lightblue':  '#66b3ff',
	'purple': 'purple',
	'greenish': '#5396ac',
	'pink': '#ff99ff'
}

var dcColorIdx = {
	'Bridge': legendColorArr['blue'], 
	'Culvert': legendColorArr['orange'],
	'Drainage': legendColorArr['grey'],
	'Slope': legendColorArr['yellow'],
	'Electrical': legendColorArr['purple'],
	'Road Furniture': legendColorArr['lightblue'],
	'Pavement': legendColorArr['green'],
	'Open': legendColorArr['blue'],
	'Completed': legendColorArr['orange'],
	'Closed (DLP)': legendColorArr['grey'],
	'Verified': legendColorArr['greenish'],                                     
	'Submitted': legendColorArr['pink'],                                     
	'Received': legendColorArr['grey'],                                     
	'Draft': legendColorArr['orange'],                                     
} 

function conOpLink(process, contractnum, contractname, title){
    var linkName = '';
    var linkWinTitle = '';
    var linkParamArr = '';
    var searchfilter = getFilterDashboardAsset();
    var category;
	var catTitle;
    
    switch (process) {
        case 'WO':
            linkWinTitle = 'Work Order Record'
            linkName = 'dash_asset_rfi_ttl_card'
            linkParamArr = processFilterParamArr([contractnum, contractname])
            
        break;
		case 'Contract':
            linkName = 'dash_asset_contract_card'
			if(searchfilter.group == 'Pavement'){
				category = 'Pavements';
				catTitle = 'Pavement';
			}else if(searchfilter.group == ''){
				category = '';
				catTitle = 'All Asset Group';
			}else{
				category = searchfilter.group;
				catTitle = searchfilter.group;
			}
			linkWinTitle = catTitle
            linkParamArr = processFilterParamArr([category, searchfilter.dateFrom, searchfilter.dateTo])
            
        break;
		case 'Claim':
            linkName = 'dash_asset_claim_status_verified_card_all_asset'
			if(searchfilter.group == ''){
				category = '';
				catTitle = 'All Asset Group';
			}else{
				category = searchfilter.group;
				catTitle = searchfilter.group;
			}
			linkWinTitle = catTitle
            linkParamArr = processFilterParamArr([category, '', searchfilter.dateFrom, searchfilter.dateTo])
            
        break;
    }
    window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle +' - '+ title);
}

//change date format to YYYY-MM-DD
function formatDate(date) {

    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function updateCard(dataContract, dataClaim){

	dataContract = (dataContract == "") ? 0 : dataContract;
	dataClaim = (dataClaim == "") ? 0 : dataClaim;

	var amtContract = dataContract ? dataContract : 0 ;
	var amtClaim = dataClaim ? dataClaim : 0 ;
	var amtRemain = (dataContract) - (dataClaim);

	amtRemain = amtRemain ? `RM `+formatCurrency(amtRemain) : `RM 0`;

	var amountContract;
	var amountClaim;

	if(amtContract != 0){
		amountContract = `<span class="clickableCard" onclick="conOpLink('Contract', '', '', 'Total Contract Amount' )">RM `+formatCurrency(amtContract)+`</span>`
	}else{
		amountContract = `RM `+formatCurrency(amtContract)+``
	}

	if(amtClaim != 0){
		amountClaim = `<span class="clickableCard" onclick="conOpLink('Claim', '', '', 'Total Amount Claimed')">RM `+formatCurrency(amtClaim)+`</span>`
	}else{
		amountClaim = `RM `+formatCurrency(amtClaim)+``
	}

    $('#amtContract').html(amountContract);
    $('#amtClaim').html(amountClaim);
    $('#amtRemain').html(amtRemain);
}

function drawWOChart(data, monthYear){

	var dataArr = [];

	if (data){
		for (const [idx, ele] of Object.entries(data)) {
			if(idx == "") continue;
			dataArr.push({  
				name: idx,
				data:  [(ele) ? parseInt((ele)) : 0],
				color:dcColorIdx[idx],
				cursor: 'pointer',
				events: {
					click: function (event) {
						var category = event.point.series.name;
						var catg = event.point.series.name;
						var searchfilter = getFilterDashboardAsset();
						linkWinTitle = 'Work Order'
						linkName = 'dash_asset_wo_card'

						if(category == 'Pavement'){
							category = 'Pavements'
						}

						linkParamArr = processFilterParamArr([category, '', searchfilter.dateFrom, searchfilter.dateTo])
						window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ catg);
					}
				}
			});
		}
	}

	var chart = Highcharts.chart('woChart', {
		chart: {
			type: 'column',
			options3d: {
				enabled: true,
				alpha: 15,
				beta: 15,
				viewDistance: 25,
				depth: 40
			},
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
									text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Periodic Maintenance Dashboard<br>'+localStorage.p_name+'<br>WORK ORDER ('+monthYear+')</span>'
								}
							})
				
							chart.updateFlag = true;
						}
						else if (chart.updateFlag) {
							chart.updateFlag = false;
				
							chart.update({
								title: {
									text: '<span class="showLabel">Periodic Maintenance Dashboard<br>'+localStorage.p_name+'<br>WORK ORDER ('+monthYear+')</span>'
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
			text: '<span class="showLabel">Periodic Maintenance Dashboard<br>'+localStorage.p_name+'<br>WORK ORDER ('+monthYear+')</span>'
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
			type: 'category',
			labels: {
				enabled: false
			}
		},
		yAxis: {
			title: {
			text: '',
			skew3d: true
			},
			allowDecimals: false,
		
		},
		legend: {
			enabled: true
		},
		plotOptions: {
			series: {
			borderWidth: 0,
			dataLabels: {
			enabled: true
			}
			},
			column: {
			depth: 40
			}
		},
		
		tooltip: {
			headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
		},

		credits:false,
		
		series: dataArr
	});
	chart.updateFlag = true;
}

function drawWOStatus(data, monthYear){

	var dataArr = [];
	var status;

	if (data){
		for (const [idx, ele] of Object.entries(data)) {

			if(idx == "") continue;

			if(idx == 'Work Order - Verified'){
				status = 'Work Order - Verified';
			}else if(idx == 'Work Order - Document Approved'){
				status = 'Work Order - Document Approved';
			}else if(idx == 'Work Order - Work Start Updated'){
				status = 'Work Order - Work Start Updated';
			}else if(idx == 'Work Order - Work Completion Updated'){
				status = 'Work Order - Work Completion Updated';
			}else if(idx == 'Work Order - Payment Details Updated'){
				status = 'Work Order - Payment Details Updated';
			}


			dataArr.push({
				name: idx,
				data: [
					((ele["Work Order - Verified"]) ? parseInt(ele["Work Order - Verified"]) : 0), 
					((ele["Work Order - Document Approved"]) ? parseInt(ele["Work Order - Document Approved"]) : 0), 
					((ele["Work Order - Work Start Updated"]) ? parseInt(ele["Work Order - Work Start Updated"]) : 0), 
					((ele["Work Order - Work Completion Updated"]) ? parseInt(ele["Work Order - Work Completion Updated"]) : 0), 
					((ele["Work Order - Payment Details Updated"]) ? parseInt(ele["Work Order - Payment Details Updated"]) : 0)
				],
				color:dcColorIdx[idx],
				cursor: 'pointer',
				events: {
					click: function (event) {
						var category = event.point.series.name;
						var catg = event.point.series.name;
						var status = event.point.category.name;
						var searchfilter = getFilterDashboardAsset();
						linkWinTitle = 'Work Order'
						linkName = 'dash_asset_wo_card'

						if(status == 'Issued'){
							status = 'Work Order - Verified'
						} else if (status == 'Not Started Yet'){
							status = 'Work Order - Document Approved'
						} else if (status == 'On-going'){
							status = 'Work Order - Work Start Updated'
						} else if (status == 'Completed'){
							status = 'Work Order - Work Completion Updated'
						} else if (status == 'Claim Process'){
							status = 'Work Order - Payment Details Updated'
						}

						if(category == 'Pavement'){
							category = 'Pavements'
						}

						linkParamArr = processFilterParamArr([category, status, searchfilter.dateFrom, searchfilter.dateTo])
						window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ catg +' - '+ status);
					}
				}
				// events: {
				// 	click: function (event) {
				// 		var dateRange = getDateRange()
				// 		var dateFrom = dateRange.dateFrom;
				// 		var dateTo = dateRange.dateTo;
				// 		var linkParamArr = processFilterParamArr([dateFrom,dateTo,idx,status]);
				// 		var postParam = {   function:"openConOpDashboard", 
				// 							processType:"periodicMaintenance", 
				// 							conOpTabId:"assetMtnTab5", 
				// 							linkName:"asset_dash_wo", 
				// 							iframeId : 'periodicMaintenance',
				// 							linkParam:linkParamArr, 
				// 							linkWinTitle: 'Periodic Maintenance'
				// 						};
				// 		parent.postMessage(postParam ,"*");
				// 	}
				// }
			})
	
		}
	}

	var chart = Highcharts.chart('woChartStatus', {
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
									text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Periodic Maintenance Dashboard<br>'+localStorage.p_name+'<br>WORK ORDER BY STATUS ('+monthYear+')</span>'
								}
							})
				
							chart.updateFlag = true;
						}
						else if (chart.updateFlag) {
							chart.updateFlag = false;
				
							chart.update({
								title: {
									text: '<span class="showLabel">Periodic Maintenance Dashboard<br>'+localStorage.p_name+'<br>WORK ORDER BY STATUS ('+monthYear+')</span>'
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
			text: '<span class="showLabel">Periodic Maintenance Dashboard<br>'+localStorage.p_name+'<br>WORK ORDER BY STATUS ('+monthYear+')</span>'
		},
		xAxis: {
			categories: ['Issued','Not Started Yet','On-going','Completed','Claim Process'],
			labels: {
				rotation: 0,
				style: {
					fontSize: '10px'
				}
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: ''
			},
			stackLabels: {
				enabled: false
			},
			allowDecimals: false,
		},
		tooltip: {
			headerFormat: '<b>{point.x}</b><br/>',
			pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
		},
		credits:false,
		plotOptions: {
			column: {
				stacking: 'normal',
				dataLabels: {
					enabled: false
				}
			}
		},
		series: dataArr
	});
	chart.updateFlag = true;
}

function drawClaimChart(data, monthYear){
	var dataArr = [];
	var idxStatus;

	if (data){
		for (const [idx, ele] of Object.entries(data)) {
			if(idx == "") continue;

			if(idx == "Draft"){
				idxStatus = "Concessionaire"
			}else if(idx == "Submitted"){
				idxStatus = "Division/Region"
			}else if(idx == "Received"){
				idxStatus = "HQ"
			}else if(idx == "Verified"){
				idxStatus = "KKR"
			}

			dataArr.push({  
				name: idxStatus,
				data:  [(ele) ? parseInt((ele)) : 0],
				color:dcColorIdx[idx],
				cursor: 'pointer',
				events: {
					click: function (event) {
						var category = event.point.series.name;
						var searchfilter = getFilterDashboardAsset();

						if(category == 'Concessionaire'){
							category = 'Draft'
						}else if (category == 'Division/Region'){
							category = 'Submitted'
						}else if (category == 'HQ'){
							category = 'Received'
						}else if (category == 'KKR'){
							category = 'Verified'
						}


						linkWinTitle = 'Claim by Status - ' + category
						linkName = 'dash_asset_claim_status_card_all_asset'
						
						linkParamArr = processFilterParamArr([searchfilter.group, category, searchfilter.dateFrom, searchfilter.dateTo])
						window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle);
					}
				}
			});
		}
	}

	var chart = Highcharts.chart('claimChart', {
		chart: {
			type: 'column',
			options3d: {
				enabled: true,
				alpha: 15,
				beta: 15,
				viewDistance: 25,
				depth: 40
			},
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
									text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Periodic Maintenance Dashboard<br>'+localStorage.p_name+'<br>CLAIM BY STATUS ('+monthYear+')</span>'
								}
							})
				
							chart.updateFlag = true;
						}
						else if (chart.updateFlag) {
							chart.updateFlag = false;
				
							chart.update({
								title: {
									text: '<span class="showLabel">Periodic Maintenance Dashboard<br>'+localStorage.p_name+'<br>CLAIM BY STATUS ('+monthYear+')</span>'
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
			text: '<span class="showLabel">Periodic Maintenance Dashboard<br>'+localStorage.p_name+'<br>CLAIM BY STATUS ('+monthYear+')</span>'
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
			type: 'category',
			labels: {
				enabled: false
			}
		},
		yAxis: {
			title: {
			text: '',
			skew3d: true
			},
			allowDecimals: false,
		
		},
		legend: {
			enabled: true
		},
		plotOptions: {
			series: {
			borderWidth: 0,
			dataLabels: {
			enabled: true
			}
			},
			column: {
			depth: 40
			}
		},
		
		tooltip: {
			headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
		},

		credits:false,
		
		series: dataArr
	});
	chart.updateFlag = true;
}

function updateTable(data){

	let progHTML = '';
	let status;
	let sduration;
	let cduration;

	if(data){

		for (const [idx, ele] of Object.entries(data)) {  

			// calculation for date
			var expect_start_date = ele.work_order_date;
			sduration = parseInt(ele.start_duration);		//start duration
			cduration = parseInt(ele.duration);		//complete duration
			var full_complete_date = ele.wo_full_complete_date //complete date (work_order_completion_verify)
			// var exp_completion_date = ele.expected_completion_date;		//expected completion date from form

			//get work start date after add start duration with work_order_date in form
			var date_start = new Date(expect_start_date);
			var result_start_date = new Date(date_start.getFullYear(),date_start.getMonth(),date_start.getDate() + sduration);
			var start_date = new Date(result_start_date);

			//get expected completed date after add start date with completion duration in form
			var result_expect_date = new Date(start_date.getFullYear(),start_date.getMonth(),start_date.getDate() + cduration);
			var expect_complete_date = new Date(result_expect_date);	

			var wo_start_date = formatDate(start_date);	
			var wo_exp_complete_date = formatDate(expect_complete_date); 	//expected completion date after calculation

			// var amt_contract = ele.contract_amount ? + formatCurrency(ele.contract_amount) : '0.00'

			progHTML += `<tr style="font-size: 10px" class="clickableCard" onclick="conOpLink('WO', '`+ele.contract_no+`', '`+ele.contract_name+`', '`+ele.contract_name+`')">`
			progHTML += '<td style="font-size: inherit">'+ele.asset_type+'</td>'
			progHTML += '<td style="font-size: inherit">'+ele.contract_no+'</td>'
			progHTML += '<td style="font-size: inherit">'+ele.contract_name+'</td>'
			progHTML += '<td style="font-size: inherit">'+ele.contract_amount+'</td>'
			progHTML += '<td style="font-size: inherit">'+ele.wo_ref_no+'</td>'
			progHTML += '<td style="font-size: inherit">'+ele.activity+'</td>'
			progHTML += '<td style="font-size: inherit">'+ele.sum_wo+'</td>'
			progHTML += '<td style="font-size: inherit">'+ele.duration+'</td>'

			if(wo_exp_complete_date > full_complete_date){
				status = 'Following';
				color = '#52BE80';

				progHTML += '<td class="condGreen" style="font-size: inherit">'+ status +'</td>'

			}else if(wo_exp_complete_date <= full_complete_date){
				status = 'Delay';
				color = '#E93232';

				progHTML += '<td class="condRed" style="font-size: inherit">'+ status +'</td>'

			}
			
				progHTML += '<td style="font-size: inherit">'+ ele.rfiCnt +'</td>'
				progHTML += '<td style="font-size: inherit">'+ ele.ncpCnt +'</td>'
				progHTML += '</tr>';
		}
	}

	$("#wo_record_package").html(progHTML);   
}

function refreshInformation(packId = 'overall', year = 'all', month = 'all', assetGrp = 'all'){
	var dataYearMonth = "Month:" +month+ " - " + "Year:" +year + " - " + "Asset Group:" +assetGrp;

	var data = (heavyData.heavy && heavyData.heavy[packId] && heavyData.heavy[packId][year] && heavyData.heavy[packId][year][month]) ? heavyData.heavy[packId][year][month] : [];
	var dataWO = (heavyData.wo && heavyData.wo[packId] && heavyData.wo[packId][year] && heavyData.wo[packId][year][month]) ? heavyData.wo[packId][year][month] : [];
	var dataRFI = (heavyData.rfi && heavyData.rfi[packId] && heavyData.rfi[packId][year] && heavyData.rfi[packId][year][month]) ? heavyData.rfi[packId][year][month] : [];
	var dataClaim = (heavyData.claimStatus && heavyData.claimStatus[packId] && heavyData.claimStatus[packId][year] && heavyData.claimStatus[packId][year][month]) ? heavyData.claimStatus[packId][year][month] : [];
	var dataContract = (heavyData.contract && heavyData.contract[packId] && heavyData.contract[packId][year] && heavyData.contract[packId][year][month]) ? heavyData.contract[packId][year][month] : [];
	
	var dataWOstatus = (dataWO && dataWO.chartStatus && dataWO.chartStatus[assetGrp]) ? dataWO.chartStatus[assetGrp] : [];
	var woData = (dataWO && dataWO.chart && dataWO.chart[assetGrp]) ? dataWO.chart[assetGrp] : [];
	var tableData = (dataRFI && dataRFI.cardRfi && dataRFI.cardRfi[assetGrp]) ? dataRFI.cardRfi[assetGrp] : [];
	var claimData = (dataClaim && dataClaim.chart && dataClaim.chart[assetGrp]) ? dataClaim.chart[assetGrp] : [];
	var contractSum = (dataContract && dataContract.cardContract && dataContract.cardContract.totalContract && dataContract.cardContract.totalContract[assetGrp]) ? dataContract.cardContract.totalContract[assetGrp] : [];
	var claimSum = (dataClaim && dataClaim.cardClaim && dataClaim.cardClaim.totalClaim && dataClaim.cardClaim.totalClaim[assetGrp]) ? dataClaim.cardClaim.totalClaim[assetGrp] : [];

	updateCard(contractSum,claimSum);
	drawWOStatus(dataWOstatus, dataYearMonth)
	drawWOChart(woData, dataYearMonth);
	drawClaimChart(claimData, dataYearMonth);
	updateTable(tableData)
}

function refreshDashboard(){
	var selWPC = $('#wpcFilter').val();
	var selYear = $('#yearFilter').val();
	if (selYear == 'all') {
		$('#monthFilter').prop("disabled", true);	
		$('#monthFilter').val('all');
	}else{
		$('#monthFilter').prop("disabled", false);
	}
	
	var selMonth = $('#monthFilter').val();
	var selCatg = $('#assetGroupFilter').val();

	refreshInformation(selWPC, selYear, selMonth, selCatg);
}

function refreshFromv3 (filterArr){
	var wpc = filterArr.wpc;
	var year = filterArr.year;
	var month = filterArr.month;
	var assetGroup = filterArr.assetGroup;
  
	refreshInformation(wpc, year, month, assetGroup);
	console.log("merge problem");
}

$(document).ready(function(){
	$.ajax({
		type: "POST",
		url: '../chartData.json.php',
		dataType: 'json',
		data: {
			page: "heavyMaintenance"
		},
		success: function (obj) {
			if (obj.status && obj.status == 'ok') {
				heavyData = obj.data;
				refreshInformation();
			}
		}
	});
})