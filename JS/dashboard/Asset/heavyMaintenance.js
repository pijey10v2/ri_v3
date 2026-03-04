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

function conOpLink(process, category){
    var linkName = '';
    var linkWinTitle = '';
    var linkParamArr = '';
	var catg = '';
    var searchfilter = getFilterDashboardAsset();

	if(category == 'Pavements'){
		catg = 'Pavement';
	}else{
		catg = category;
	}
    
    
    switch (process) {
        case 'Contract':
            linkWinTitle = 'Total Contract Amount - '+catg
            linkName = 'dash_asset_contract_card'
            linkParamArr = processFilterParamArr([category, searchfilter.dateFrom, searchfilter.dateTo])
            
        break;
		case 'Budget':
            linkWinTitle = 'Total Budget Amount - '+catg
            linkName = 'dash_asset_budget_card_pm'
            linkParamArr = processFilterParamArr([searchfilter.year, category])
            
        break;
		case 'Claim':
            linkWinTitle = 'Total Amount Claimed - '+catg
            linkName = 'dash_asset_claim_status_verified_card_all_asset'
            linkParamArr = processFilterParamArr([category, '', searchfilter.dateFrom, searchfilter.dateTo])
            
        break;
    }
    window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle);
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

function updateCard(contract,claim,budget,packId,month){

	var divFilter = $('#wpcFilter').val();
	var mthFilter = $('#monthFilter').val();

	var amtContractPave = 0;
	var amtContractNonPave = 0;
	var amtContractBr = 0;
	var amtContractSlp = 0;
	var amtContractEl = 0;

	var amtClaimPave = 0;
	var amtClaimNonPave = 0;
	var amtClaimBr = 0;
	var amtClaimSlp = 0;
	var amtClaimEl = 0;

	var amtBudgetPave = 0;
	var amtBudgetNonPave = 0;
	var amtBudgetBr = 0;
	var amtBudgetSlp = 0;
	var amtBudgetEl = 0;

	if(contract){
		amtContractPave = contract && contract.Pavement ? contract.Pavement : 0;
		amtContractNonPave = contract && contract['Non Pavement'] ? contract['Non Pavement'] :  0;
		amtContractBr = contract && contract.Bridge ? contract.Bridge : 0;
		amtContractSlp = contract && contract.Slope ? contract.Slope : 0;
		amtContractEl = contract && contract.Electrical ? contract.Electrical : 0;
	}

	if(claim){
		amtClaimPave = claim && claim.Pavement ? claim.Pavement : 0;
		amtClaimNonPave = claim && claim['Non Pavement'] ? claim['Non Pavement'] : 0;
		amtClaimBr = claim && claim.Bridge ? claim.Bridge : 0;
		amtClaimSlp = claim && claim.Slope ? claim.Slope : 0;
		amtClaimEl = claim && claim.Electrical ? claim.Electrical : 0;
	}

	if(budget){
		amtBudgetPave = budget && budget.Pavement ? budget.Pavement : 0;
		amtBudgetNonPave = budget && budget['Non Pavement'] ? budget['Non Pavement'] : 0;
		amtBudgetBr = budget && budget.Bridge ? budget.Bridge : 0;
		amtBudgetSlp = budget && budget.Slope ? budget.Slope : 0;
		amtBudgetEl = budget && budget.Electrical ? budget.Electrical : 0;
	}

	var amtRemainPave = contract.Pavement - claim.Pavement;
	var amtRemainNonPave = contract['Non Pavement'] - claim['Non Pavement'];
	var amtRemainBr = contract.Bridge - claim.Bridge;
	var amtRemainSlp = contract.Slope - claim.Slope;
	var amtRemainEl = contract.Electrical - claim.Electrical;

	var amtRemainBudgetPave = budget.Pavement - contract.Pavement;
	var amtRemainBudgetNonPave = budget['Non Pavement'] - contract['Non Pavement'];
	var amtRemainBudgetBr = budget.Bridge - contract.Bridge;
	var amtRemainBudgetSlp = budget.Slope - contract.Slope;
	var amtRemainBudgetEl = budget.Electrical - contract.Electrical;

	var contractPave;
	var contractNonPave;
	var contractBridge;
	var contractSlope;
	var contractEl;

	var budgetPave;
	var budgetNonPave;
	var budgetBridge;
	var budgetSlope;
	var budgetEl;

	var claimPave;
	var claimNonPave;
	var claimBridge;
	var claimSlope;
	var claimEl;

	//Contract
	if(amtContractPave != 0){
		contractPave = `<span class="clickableCard" onclick="conOpLink('Contract','Pavements','')">RM `+formatCurrency(amtContractPave)+`</span>`
	}else{
		contractPave = `RM `+formatCurrency(amtContractPave)+``
	}

	if(amtContractNonPave != 0){
		contractNonPave = `<span class="clickableCard" onclick="conOpLink('Contract','Non Pavement','')">RM `+formatCurrency(amtContractNonPave)+`</span>`
	}else{
		contractNonPave = `RM `+formatCurrency(amtContractNonPave)+``
	}

	if(amtContractBr != 0){
		contractBridge = `<span class="clickableCard" onclick="conOpLink('Contract','Bridge','')">RM `+formatCurrency(amtContractBr)+`</span>`
	}else{
		contractBridge = `RM `+formatCurrency(amtContractBr)+``
	}

	if(amtContractSlp != 0){
		contractSlope = `<span class="clickableCard" onclick="conOpLink('Contract','Slope','')">RM `+formatCurrency(amtContractSlp)+`</span>`
	}else{
		contractSlope = `RM `+formatCurrency(amtContractSlp)+``
	}

	if(amtContractEl != 0){
		contractEl = `<span class="clickableCard" onclick="conOpLink('Contract','Electrical','')">RM `+formatCurrency(amtContractEl)+`</span>`
	}else{
		contractEl = `RM `+formatCurrency(amtContractEl)+``
	}

	//Budget
	if(amtBudgetPave != 0){
		budgetPave = `<span class="clickableCard" onclick="conOpLink('Budget','Pavement','')">RM `+formatCurrency(amtBudgetPave)+`</span>`
	}else{
		budgetPave = `RM `+formatCurrency(amtBudgetPave)+``
	}

	if(amtBudgetNonPave != 0){
		budgetNonPave = `<span class="clickableCard" onclick="conOpLink('Budget','Non Pavement','')">RM `+formatCurrency(amtBudgetNonPave)+`</span>`
	}else{
		budgetNonPave = `RM `+formatCurrency(amtBudgetNonPave)+``
	}

	if(amtBudgetBr != 0){
		budgetBridge = `<span class="clickableCard" onclick="conOpLink('Budget','Bridge','')">RM `+formatCurrency(amtBudgetBr)+`</span>`
	}else{
		budgetBridge = `RM `+formatCurrency(amtBudgetBr)+``
	}

	if(amtBudgetSlp != 0){
		budgetSlope = `<span class="clickableCard" onclick="conOpLink('Budget','Slope','')">RM `+formatCurrency(amtBudgetSlp)+`</span>`
	}else{
		budgetSlope = `RM `+formatCurrency(amtBudgetSlp)+``
	}

	if(amtBudgetEl != 0){
		budgetEl = `<span class="clickableCard" onclick="conOpLink('Budget','Electrical','')">RM `+formatCurrency(amtBudgetEl)+`</span>`
	}else{
		budgetEl = `RM `+formatCurrency(amtBudgetEl)+``
	}

	//Claim
	if(amtClaimPave != 0){
		claimPave = `<span class="clickableCard" onclick="conOpLink('Claim','Pavement','')">RM `+formatCurrency(amtClaimPave)+`</span>`
	}else{
		claimPave = `RM `+formatCurrency(amtClaimPave)+``
	}

	if(amtClaimNonPave != 0){
		claimNonPave = `<span class="clickableCard" onclick="conOpLink('Claim','Non Pavement','')">RM `+formatCurrency(amtClaimNonPave)+`</span>`
	}else{
		claimNonPave = `RM `+formatCurrency(amtClaimNonPave)+``
	}

	if(amtClaimBr != 0){
		claimBridge = `<span class="clickableCard" onclick="conOpLink('Claim','Bridge','')">RM `+formatCurrency(amtClaimBr)+`</span>`
	}else{
		claimBridge = `RM `+formatCurrency(amtClaimBr)+``
	}

	if(amtClaimSlp != 0){
		claimSlope = `<span class="clickableCard" onclick="conOpLink('Claim','Slope','')">RM `+formatCurrency(amtClaimSlp)+`</span>`
	}else{
		claimSlope = `RM `+formatCurrency(amtClaimSlp)+``
	}

	if(amtClaimEl != 0){
		claimEl = `<span class="clickableCard" onclick="conOpLink('Claim','Electrical','')">RM `+formatCurrency(amtClaimEl)+`</span>`
	}else{
		claimEl = `RM `+formatCurrency(amtClaimEl)+``
	}

	$('#ttlContractPave').html(contractPave);
    $('#ttlContractNonPave').html(contractNonPave);
    $('#ttlContractBr').html(contractBridge);
    $('#ttlContractSlp').html(contractSlope);
    $('#ttlContractEl').html(contractEl);

	$('#ttlClaimPave').html(claimPave);
    $('#ttlClaimNonPave').html(claimNonPave);
    $('#ttlClaimBr').html(claimBridge);
    $('#ttlClaimSlp').html(claimSlope);
    $('#ttlClaimEl').html(claimEl);

	if(localStorage.ui_pref == 'ri_v3'){
		if(packId == 'overall'){
			$('#ttlBudgetPave').html(budgetPave);
			$('#ttlBudgetNonPave').html(budgetNonPave);
			$('#ttlBudgetBr').html(budgetBridge);
			$('#ttlBudgetSlp').html(budgetSlope);
			$('#ttlBudgetEl').html(budgetEl);

			if(month != 'all'){
				$('tbody tr:first-child').hide();
				$('tbody tr:last-child').hide();
			}else{
				$('tbody tr:first-child').show();
				$('tbody tr:last-child').show();
			}
		}else{		
			$('tbody tr:first-child').hide();
			$('tbody tr:last-child').hide();
		}	      
    }else{
        if(divFilter == 'overall'){
			$('#ttlBudgetPave').html(budgetPave);
			$('#ttlBudgetNonPave').html(budgetNonPave);
			$('#ttlBudgetBr').html(budgetBridge);
			$('#ttlBudgetSlp').html(budgetSlope);
			$('#ttlBudgetEl').html(budgetEl);
		
			if(mthFilter != 'all'){
				$('tbody tr:first-child').hide();
				$('tbody tr:last-child').hide();
			}else{
				$('tbody tr:first-child').show();
				$('tbody tr:last-child').show();
			}
		}else{		
			$('tbody tr:first-child').hide();
			$('tbody tr:last-child').hide();
		}	
    }

	$('#ttlRemainClaimPave').html(amtRemainPave ? 'RM ' +formatCurrency(amtRemainPave) : 'RM 0.00');
    $('#ttlRemainClaimNonPave').html(amtRemainNonPave ? 'RM ' +formatCurrency(amtRemainNonPave) : 'RM 0.00');
    $('#ttlRemainClaimBr').html(amtRemainBr ? 'RM ' +formatCurrency(amtRemainBr) : 'RM 0.00');
    $('#ttlRemainClaimSlp').html(amtRemainSlp ? 'RM ' +formatCurrency(amtRemainSlp) : 'RM 0.00');
    $('#ttlRemainClaimEl').html(amtRemainEl ? 'RM ' +formatCurrency(amtRemainEl) : 'RM 0.00');

	$('#ttlRemainBudgetPave').html(amtRemainBudgetPave ? 'RM ' +formatCurrency(amtRemainBudgetPave) : 'RM 0.00');
    $('#ttlRemainBudgetNonPave').html(amtRemainBudgetNonPave ? 'RM ' +formatCurrency(amtRemainBudgetNonPave) : 'RM 0.00');
    $('#ttlRemainBudgetBr').html(amtRemainBudgetBr ? 'RM ' +formatCurrency(amtRemainBudgetBr) : 'RM 0.00');
    $('#ttlRemainBudgetSlp').html(amtRemainBudgetSlp ? 'RM ' +formatCurrency(amtRemainBudgetSlp) : 'RM 0.00');
    $('#ttlRemainBudgetEl').html(amtRemainBudgetEl ? 'RM ' +formatCurrency(amtRemainBudgetEl) : 'RM 0.00');
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
				// events: {
				// 	click: function (event) {
				// 		var dateRange = getDateRange()
				// 		var dateFrom = dateRange.dateFrom;
				// 		var dateTo = dateRange.dateTo;
				// 		var linkParamArr = processFilterParamArr([dateFrom,dateTo,idx]);
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
			});
		}
	}

	var chart = Highcharts.chart('woChartParent', {
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
			headerFormat: '<span style="font-size:11px">{series.name} : <b>{point.y}</b></span><br>'
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
						var searchfilter = getFilterDashboardAsset();
						var category = event.point.series.name;
						var catg = event.point.series.name;
						var status = event.point.category.name;

						linkWinTitle = 'Work Order'
						linkName = 'dash_asset_wo_card'
						if(category == 'Pavement'){
							category = 'Pavements'
						}

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

						linkParamArr = processFilterParamArr([category, status, searchfilter.dateFrom, searchfilter.dateTo])
						window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ catg +' - '+ status);
					}
				}
			})
	
		}
	}

	var chart = Highcharts.chart('woStatusChartParent', {
		chart: {
			type: 'column',
			options3d: {
				enabled: false,
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
				skew3d: true,
				style: {
					fontSize: '10px'
				}
			}
		},
		yAxis: {
			allowDecimals : false,
			min: 0,
			title: {
				text: '',
				skew3d: true
			},
			stackLabels: {
				enabled: false
			}
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
						
						linkParamArr = processFilterParamArr(['', category, searchfilter.dateFrom, searchfilter.dateTo])
						window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle);
					}
				}
			});
		}
	}

	var chart = Highcharts.chart('claimChartParent', {
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
				enabled: false,
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
			headerFormat: '<span style="font-size:11px">{series.name} : <b>{point.y}<br>',
			pointFormat: '<span style="color:{point.color}">{point.name}</span><br/>'
		},

		credits:false,
		
		series: dataArr
	});
	chart.updateFlag = true;
}

function drawClaimChartByGrp(data, monthYear){
	var dataArr = [];
	var idxStatus;

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
						var searchfilter = getFilterDashboardAsset();
						linkWinTitle = 'Claim by Asset Group'
						linkName = 'dash_asset_claim_status_card'

						linkParamArr = processFilterParamArr([category, '', searchfilter.dateFrom, searchfilter.dateTo])
						window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ category);
					}
				}
			});

			dataArr.sort(function(a,b){

				if(a.name == 'Bridge' && b.name == 'Non Pavement') return -1;
				if(a.name == 'Bridge' && b.name == 'Slope') return -1;
				if(a.name == 'Bridge' && b.name == 'Pavement') return -1;
				if(a.name == 'Bridge' && b.name == 'Electrical') return -1;

				if(a.name == 'Non Pavement' && b.name == 'Slope') return -1;
				if(a.name == 'Non Pavement' && b.name == 'Pavement') return -1;
				if(a.name == 'Non Pavement' && b.name == 'Electrical') return -1;

                if(a.name == 'Slope' && b.name == 'Pavement') return -1;
				if(a.name == 'Slope' && b.name == 'Electrical') return -1;

				if(a.name == 'Pavement' && b.name == 'Electrical') return -1;
				//-----------------------------------------//
				if(b.name == 'Bridge' && a.name == 'Non Pavement') return 1;
				if(b.name == 'Bridge' && a.name == 'Slope') return 1;
				if(b.name == 'Bridge' && a.name == 'Pavement') return 1;
				if(b.name == 'Bridge' && a.name == 'Electrical') return 1;

                if(b.name == 'Non Pavement' && a.name == 'Slope') return 1;
				if(b.name == 'Non Pavement' && a.name == 'Pavement') return 1;
				if(b.name == 'Non Pavement' && a.name == 'Electrical') return 1;

                if(b.name == 'Slope' && a.name == 'Pavement') return 1;
				if(b.name == 'Slope' && a.name == 'Electrical') return 1;

                if(b.name == 'Pavement' && a.name == 'Electrical') return 1;
				return 0;
			});
		}

	}

	var chart = Highcharts.chart('claimChartStatusParent', {
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
									text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Periodic Maintenance Dashboard<br>'+localStorage.p_name+'<br>CLAIM BY ASSET GROUP ('+monthYear+')</span>'
								}
							})
				
							chart.updateFlag = true;
						}
						else if (chart.updateFlag) {
							chart.updateFlag = false;
				
							chart.update({
								title: {
									text: '<span class="showLabel">Periodic Maintenance Dashboard<br>'+localStorage.p_name+'<br>CLAIM BY ASSET GROUP ('+monthYear+')</span>'
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
			text: '<span class="showLabel">Periodic Maintenance Dashboard<br>'+localStorage.p_name+'<br>CLAIM BY ASSET GROUP ('+monthYear+')</span>'
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
			headerFormat: '<span style="font-size:11px">{series.name} : <b>{point.y}<br>',
			pointFormat: '<span style="color:{point.color}">{point.name}</span><br/>'
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

			progHTML += '<tr>'
			progHTML += '<td>'+ele.asset_type+'</td>'
			progHTML += '<td>'+ele.contract_no+'</td>'
			progHTML += '<td>'+ele.contract_name+'</td>'
			progHTML += '<td>'+ele.contract_amount+'</td>'
			progHTML += '<td>'+ele.wo_ref_no+'</td>'
			progHTML += '<td>'+ele.sum_wo+'</td>'
			progHTML += '<td>'+ele.duration+'</td>'

			if(wo_start_date == ""){
				status = 'Work Not Started';
				color = '#000000';
				
				progHTML += '<td class="condYellow"><span>'+ status +'</span></td>'

			}else if(wo_exp_complete_date > full_complete_date){
				status = 'Following';
				color = '#52BE80';

				progHTML += '<td class="condGreen">'+ status +'</td>'

			}else if(wo_exp_complete_date <= full_complete_date){
				status = 'Delay';
				color = '#E93232';

				progHTML += '<td class="condRed">'+ status +'</td>'

			}
			
				progHTML += '<td>'+ ele.rfiCnt +'</td>'
				progHTML += '<td>'+ ele.ncpCnt +'</td>'
				progHTML += '</tr>';
		}
	}

	$("#wo_record").html(progHTML);   
}

function refreshInformation(packId = 'overall', year = 'all', month = 'all', wpcName = 'all'){
	var parentFilter = "";
	var dataYearMonth = "";

	if(localStorage.isParent == 'isParent'){
		parentFilter = "Division:" +wpcName+ " - ";
		dataYearMonth = parentFilter+"Month:" +month+ " - " + "Year:" +year;
	}else{
		dataYearMonth = "Month:" +month+ " - " + "Year:" +year;
	}

	var data = (heavyData.heavy && heavyData.heavy[packId] && heavyData.heavy[packId][year] && heavyData.heavy[packId][year][month]) ? heavyData.heavy[packId][year][month] : [];
	var dataWO = (heavyData.wo && heavyData.wo[packId] && heavyData.wo[packId][year] && heavyData.wo[packId][year][month]) ? heavyData.wo[packId][year][month] : [];
	var dataRFI = (heavyData.rfi && heavyData.rfi[packId] && heavyData.rfi[packId][year] && heavyData.rfi[packId][year][month]) ? heavyData.rfi[packId][year][month] : [];
	var dataClaim = (heavyData.claimStatus && heavyData.claimStatus[packId] && heavyData.claimStatus[packId][year] && heavyData.claimStatus[packId][year][month]) ? heavyData.claimStatus[packId][year][month] : [];
	var budgetData = (heavyData.budgetAmt && heavyData.budgetAmt[packId] && heavyData.budgetAmt[packId][year] && heavyData.budgetAmt[packId][year][month]) ? heavyData.budgetAmt[packId][year][month] : [];
	var dataContract = (heavyData.contract && heavyData.contract[packId] && heavyData.contract[packId][year] && heavyData.contract[packId][year][month]) ? heavyData.contract[packId][year][month] : [];
	
	var dataWOstatus = (dataWO && dataWO.chartStatus) ? dataWO.chartStatus : [];
	var woData = (dataWO && dataWO.chart) ? dataWO.chart : [];
	var tableData = (dataRFI && dataRFI.cardRfi && dataRFI.cardRfi.raw) ? dataRFI.cardRfi.raw : [];
	var claimData = (dataClaim && dataClaim.chart) ? dataClaim.chart : [];
	var claimAssetGrp = (dataClaim && dataClaim.chartCatg) ? dataClaim.chartCatg : [];

	var contractSum = (dataContract && dataContract.cardContract && dataContract.cardContract.totalContract) ? dataContract.cardContract.totalContract : [];
	var claimSum = (dataClaim && dataClaim.cardClaim && dataClaim.cardClaim.totalClaim) ? dataClaim.cardClaim.totalClaim : [];
    var budgetSum = (budgetData && budgetData.cardBudget) ? budgetData.cardBudget : [];

	updateCard(contractSum,claimSum,budgetSum,packId,month);
	drawWOStatus(dataWOstatus, dataYearMonth)
	drawWOChart(woData, dataYearMonth);
	drawClaimChart(claimData, dataYearMonth);
	drawClaimChartByGrp(claimAssetGrp, dataYearMonth)
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
	var selCatg = $('#categoryFilter').val();

	refreshInformation(selWPC, selYear, selMonth);
}

function refreshFromv3 (filterArr){
	var wpc = filterArr.wpc;
	var year = filterArr.year;
	var month = filterArr.month;
	var wpcName = filterArr.wpcName;
  
	refreshInformation(wpc, year, month, wpcName);
	console.log("checking merge");
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
