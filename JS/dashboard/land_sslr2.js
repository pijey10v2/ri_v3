var landData;

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
	'total_length': legendColorArr['lightblue'], 
	'free_encumbrances': legendColorArr['grey'],
	'total_encumbrances': legendColorArr['green'],
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

function conOpLink(process, status){
    var linkWinTitle = ''
    var linkName = ''
    var linkParamArr = '';
    var searchFilter = getFilterDocumentSarawak();
    var status = status ? status : '';
    var ref_no;

    switch (process) {
        case 'LI':
            linkWinTitle = 'Land Issue'
            linkName = 'dash_cons_LI_card'
            linkParamArr = processFilterParamArr([searchFilter.dateFrom, searchFilter.dateTo, searchFilter.section, status])
            
        break;
        case 'LE':
            linkWinTitle = 'Land Encumbrances'
            linkName = 'dash_cons_LE_card'
            linkParamArr = processFilterParamArr([searchFilter.dateFrom, searchFilter.dateTo, searchFilter.section, status])
            
        break;
        case 'LI_TBL':
            linkWinTitle = 'Land Issue'
            linkName = 'dash_cons_LI_table'
            ref_no = status
            linkParamArr = processFilterParamArr([searchFilter.dateFrom, searchFilter.dateTo, ref_no])
            
        break;
    }

    window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle);
}

function updateLandIssueCard(total, ttlNew, ttlOngoing, ttlClose){
    $('#landTotalIssueCard').html(`<span class="clickableCard" onclick="conOpLink('LI', '')">`+total+`</span>`);
    $('#landTotalNewIssueCard').html(`<span class="clickableCard" onclick="conOpLink('LI', 'New')">`+ttlNew+`</span>`);
    $('#landTotalOngoingIssueCard').html(`<span class="clickableCard" onclick="conOpLink('LI', 'Ongoing')">`+ttlOngoing+`</span>`);
    $('#landClosedIssueCard').html(`<span class="clickableCard" onclick="conOpLink('LI', 'Close')">`+ttlClose+`</span>`);
}

function updateLandEncCard(ttlFoe, ttlEnc, ttlQty){
    ttlFoe = (ttlFoe > 0) ? parseFloat(ttlFoe) : 0.00;
    ttlEnc = (ttlEnc > 0) ? parseFloat(ttlEnc) : 0.00;
    ttlQty = (ttlQty > 0) ? ttlQty : 0;
    
    $('#landTotalFOECard').html(`<span class="clickableCard" onclick="conOpLink('LE', '')">`+ttlFoe+`</span>`);
    $('#landTotalEnCard').html(`<span class="clickableCard" onclick="conOpLink('LE', '')">`+ttlEnc+`</span>`);
    $('#landTtlEncQty').html(`<span class="clickableCard" onclick="conOpLink('LE', '')">`+ttlQty+`</span>`);
}

function drawDeliverableChart(data, status){
    var dataArr = [];
    var statusVal = (status != 'all') ? status : '';
    var idxStatus;

    if (data){
		for (const [idx, ele] of Object.entries(data)) {
			if(idx == "") continue;

			if(idx == "total_length"){
				idxStatus = "Sum of Total Length"
			}else if(idx == "free_encumbrances"){
				idxStatus = "Sum of Free Encumbrances (km)"
			}else if(idx == "total_encumbrances"){
				idxStatus = "Sum of Total Encumbrances (km)"
			}

            if(idx == "total_length" || idx == "free_encumbrances" || idx == "total_encumbrances"){

                dataArr.push({  
                    name: idxStatus,
                    data:  [((ele)) ? ((ele)) : 0.0],
                    color: dcColorIdx[idx],
                    cursor: 'pointer',
                    events: {
                        click: function (event) {

                            var searchFilter = getFilterDocumentSSLR2();
                            var linkWinTitle = 'Land Encumbrances'
                            var linkName = 'dash_cons_LE_card'

                            linkParamArr = processFilterParamArr([searchFilter.dateFrom, searchFilter.dateTo, searchFilter.section, statusVal])
                            window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle);
                        }
                    }
                });
            }
		}
	}

    var chart = Highcharts.chart('land-deliverable', {
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
            
                    if (document.fullscreenElement && chart.updateFlag) {
                        chart.updateFlag = false;
                        chart.update({
                        chart:{
                            marginTop: 90,
                            marginBottom: 100,
                        },
                        title: {
                            text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Land Dashboard<br>'+localStorage.p_name+'<br>DELIVERABLE</span>'
                        },
                        legend: {
                            verticalAlign: 'bottom',
                            y: -20,
                            floating: false,
                        }
                        })
            
                        chart.updateFlag = true;
                    } else if (chart.updateFlag) {
                        chart.updateFlag = false;
            
                        chart.update({
                        title: {
                            text: '<span class="showLabel" style="text-align: center">Land Dashboard<br>'+localStorage.p_name+'<br>DELIVERABLE</span>'
                        },
                        legend: {
                            verticalAlign: 'bottom',
                            y: -20,
                            floating: false,
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
			text: '<span class="showLabel">Land Dashboard<br>'+localStorage.p_name+'<br>DELIVERABLE</span>'
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
			    enabled: true,
                formatter: function () {
                    return this.y.toFixed(2);
                }
			}
			},
			column: {
			depth: 40
			}
		},
		
		tooltip: {
			headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			pointFormat: '<span style="color:var(--on-surface)">{point.name}</span>: <b>{point.y}</b><br/>'
		},

		credits:false,
		
		series: dataArr
	});
	chart.updateFlag = true;
}

function populateLandIssueTable(data){
    let tbHTML = '';
    if (data) {
        data.forEach(function(ele,idx){
            tbHTML += `<tr class="clickableCard" onclick="conOpLink('LI_TBL', '`+ele.c_title+`')">`
            tbHTML += '<td>'+((ele.wpc) ? ele.wpc : '')+'</td>'
            tbHTML += '<td>'+((ele.c_title) ? ele.c_title : '')+'</td>'
            tbHTML += '<td>'+((ele.c_issue_date) ? ele.c_issue_date : '')+'</td>'
            tbHTML += '<td>'+((ele.view_issue_status) ? ele.view_issue_status : '')+'</td>'
            tbHTML += '<td>'+((ele.c_aging) ? ele.c_aging : '')+'</td>'
            tbHTML += '<td>'+((ele.c_remarks) ? ele.c_remarks : '')+'</td>'
            tbHTML += '</tr>';
        })
        $("#landTBody").html(tbHTML);  
    }
}

function populateStatusOption(opt){
    let optHtml = '<option value="all">All</option>';
    if (opt) {
        opt.forEach(function(ele,idx){
            optHtml += '<option value="'+ele+'">'+ele+'</option>'; 
        });
    }
    $('#issueStatus').html(optHtml);

    let optHtmlV3 = '<option value="all">Select Status</option>';
    if (opt) {
        opt.forEach(function(ele,idx){
            optHtmlV3 += '<option value="'+ele+'">'+ele+'</option>'; 
        });
    }
	$('#issueStatusId', window.parent.document).html(optHtmlV3);

}

function refreshInformation(packId = 'overall', year = 'all', month = 'all', selSection = 'overall', selStatus = 'all'){

    var tbData = (landData && landData.issue && landData.issue[packId] && landData.issue[packId][year] && landData.issue[packId][year][month]) ? landData.issue[packId][year][month] : [];

    var tableIssue = (tbData && tbData.tableLi && tbData.tableLi[selSection] && tbData.tableLi[selSection][selStatus]) ? tbData.tableLi[selSection][selStatus] : [];
    var ttlIssue = (tbData && tbData.tableLi && tbData.tableLi[selSection] && tbData.tableLi[selSection]['all']) ? tbData.tableLi[selSection]['all'].length : 0;
    var ttlNewIssue = (tbData && tbData.tableLi && tbData.tableLi[selSection] && tbData.tableLi[selSection]['New']) ? tbData.tableLi[selSection]['New'].length : 0;
    var ttlOngoingIssue = (tbData && tbData.tableLi && tbData.tableLi[selSection] && tbData.tableLi[selSection]['Ongoing']) ? tbData.tableLi[selSection]['Ongoing'].length : 0;
    var ttlCloseIssue = (tbData && tbData.tableLi && tbData.tableLi[selSection] && tbData.tableLi[selSection]['Close']) ? tbData.tableLi[selSection]['Close'].length : 0;

    populateLandIssueTable(tableIssue);
    updateLandIssueCard(ttlIssue, ttlNewIssue, ttlOngoingIssue, ttlCloseIssue);

    var encData = (landData && landData.encumbrances && landData.encumbrances.encData) ? landData.encumbrances.encData : [];
    var encChart = (encData && encData[packId] && encData[packId][year] && encData[packId][year][month]) ? encData[packId][year][month] : [];
    var encChartData = (encChart && encChart[selSection] && encChart[selSection][selStatus]) ? encChart[selSection][selStatus] : [];

    var ttlEnc = (landData && landData.encumbrances && landData.encumbrances.totalEnc && landData.encumbrances.totalEnc[packId] && landData.encumbrances.totalEnc[packId][year] && landData.encumbrances.totalEnc[packId][year][month]) ? landData.encumbrances.totalEnc[packId][year][month] : [];
    var ttlDataEnc = (ttlEnc && ttlEnc[selSection] && ttlEnc[selSection][selStatus]) ? ttlEnc[selSection][selStatus].length : 0;

    drawDeliverableChart(encChartData, selStatus);  

    var ttlFoeData = [];
    var ttlEncData = [];
    var encCardData = [];

    if (packId == 'overall'){
        encCardData = (landData && landData.encumbrances && landData.encumbrances.encCardData && landData.encumbrances.encCardData[packId] && landData.encumbrances.encCardData[packId][year] && landData.encumbrances.encCardData[packId][year][month]) ? landData.encumbrances.encCardData[packId][year][month] : [];
        ttlFoeData = (encCardData&& encCardData[selSection] && encCardData[selSection][selStatus] && encCardData[selSection][selStatus].totalFOE) ? encCardData[selSection][selStatus].totalFOE : 0;
        ttlEncData = (encCardData&& encCardData[selSection] && encCardData[selSection][selStatus] && encCardData[selSection][selStatus].totalEnc) ? encCardData[selSection][selStatus].totalEnc : 0;
    }
    else{
        encCardData = (landData && landData.encumbrances && landData.encumbrances.encData && landData.encumbrances.encData[packId] && landData.encumbrances.encData[packId][year] && landData.encumbrances.encData[packId][year][month]) ? landData.encumbrances.encData[packId][year][month] : [];
        ttlFoeData = (encCardData && encCardData[selSection] && encCardData[selSection][selStatus] && encCardData[selSection][selStatus].foe) ? encCardData[selSection][selStatus].foe : 0;
        ttlEncData = (encCardData && encCardData[selSection] && encCardData[selSection][selStatus] && encCardData[selSection][selStatus].encumbrances) ? encCardData[selSection][selStatus].encumbrances : 0;
    }

    updateLandEncCard(ttlFoeData, ttlEncData, ttlDataEnc);
}

function refreshFromv3 (filterArr){
	var wpc = filterArr.wpc;
	var year = filterArr.year;
	var month = filterArr.month;
	var section = filterArr.section;
	var status = filterArr.issueStatus;

	refreshInformation(wpc, year, month, section, status);
}

$(document).ready(function(){
	$.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "land"
        },
        success: function (obj) {
        	if (obj.status && obj.status == 'ok') {
                landData = obj.data;
                var opt = (landData.issue && landData.issue.issueStatusOption) ? landData.issue.issueStatusOption : [];
                populateStatusOption(opt);

                refreshInformation();
            }
        }
    });
})