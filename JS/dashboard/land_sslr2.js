var landData;
var txtMthToNum = {"1":"01","2":"02","3":"03","4":"04","5":"05","6":"06","7":"07","8":"08","9":"09","10":"10","11":"11","12":"12"};

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
    var dateFrom;

    switch (process) {
        case 'LI':
            linkWinTitle = 'Land Issue'
            linkName = 'dash_cons_LI_card'
            linkParamArr = processFilterParamArr([searchFilter.dateFrom, searchFilter.dateTo, searchFilter.section, status])
            
        break;
        case 'LE':
            linkWinTitle = 'Land Encumbrances'
            linkName = 'dash_cons_LE_card'
            var dateString = searchFilter.dateTo;
            var dateParts = dateString.split("-");
            var year = dateParts[2];    
            dateFrom = '01-01-'+year;
            linkParamArr = processFilterParamArr([dateFrom, searchFilter.dateTo, searchFilter.section, status])
            
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

function updateLandEncCard(data, ttlQty){

    var ttlFoe = (data.total_encumbrances) ? data.total_encumbrances : 0.00;
    var ttlLength = (data.total_length) ? data.total_length : 0.00;
    var foePercent = (ttlFoe / ttlLength) * 100;
    var encPercent = 100 - foePercent;

    // Format percentages to 2 decimal places
    foePercent = (foePercent) ? foePercent.toFixed(2) : 0;
    encPercent = (encPercent) ? encPercent.toFixed(2) : 0;
    ttlQty = (ttlQty > 0) ? ttlQty : 0;
    
    $('#landTotalFOECard').html(`<span class="clickableCard" onclick="conOpLink('LE', '')">`+encPercent+`</span>`);
    $('#landTotalEnCard').html(`<span class="clickableCard" onclick="conOpLink('LE', '')">`+foePercent+`</span>`);
    $('#landTtlEncQty').html(`<span class="clickableCard" onclick="conOpLink('LE', '')">`+ttlQty+`</span>`);
}

function drawDeliverableChart(data, status){
    var dataArr = [];
    var statusVal = (status != 'all') ? status : '';
    var idxStatus;
    var dateFrom;

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

                            var dateString = searchFilter.dateTo;
                            var dateParts = dateString.split("-");
                            var year = dateParts[2];    
                            dateFrom = '01-01-'+year;

                            linkParamArr = processFilterParamArr([dateFrom, searchFilter.dateTo, searchFilter.section, statusVal])
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

    var ttlEnc = (landData && landData.encumbrances && landData.encumbrances.totalEnc && landData.encumbrances.totalEnc[packId] && landData.encumbrances.totalEnc[packId][year] && landData.encumbrances.totalEnc[packId][year][month]) ? landData.encumbrances.totalEnc[packId][year][month] : [];
    var encDataPercent = (landData && landData.encumbrances && landData.encumbrances.encData && landData.encumbrances.encData[packId] && landData.encumbrances.encData[packId][year] && landData.encumbrances.encData[packId][year][month]) ? landData.encumbrances.encData[packId][year][month] : [];
    var ttlFoeData = (encDataPercent.foe) ? encDataPercent.foe : 0.00;
    var ttlEncData = (encDataPercent.encumbrances) ? encDataPercent.encumbrances : 0.00;

    drawDeliverableChart(encChart, selStatus); 
    updateLandEncCard(encDataPercent, ttlEnc);
}

function refreshFromv3 (filterArr){
	var wpc = filterArr.wpc;
	var year = filterArr.year;
	var month = filterArr.month;
	var section = filterArr.section;
	var status = filterArr.issueStatus;

	refreshInformation(wpc, year, month, section, status);
}

// Caching the common elements
var $packFilter = window.parent.$('.packFilter');
var $yrFilter = window.parent.$('.yrFilter');
var $mthFilter = window.parent.$('.mthFilter');

function fetchData(packFilter, yrFilter, mthFilter) {
    $.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "land",
            packageId: packFilter,
            year: yrFilter,
            month: mthFilter
        },
        success: function (obj) {
            if (obj.status && obj.status == 'ok') {
                landData = obj.data;
                var opt = (landData.issue && landData.issue.issueStatusOption) ? landData.issue.issueStatusOption : [];
                populateStatusOption(opt);
                refreshInformation(packFilter, yrFilter, mthFilter);
            }
        }
    });
}

function handleFilterChange() {
    var packFilter = (localStorage.isParent == "isParent") ? $packFilter.val() : "overall";
    var yrFilter = $yrFilter.val();
    var mthFilter = $mthFilter.val();

    fetchData(packFilter, yrFilter, mthFilter);
}

// Attach the event listeners to all filters
$packFilter.on('change', handleFilterChange);
$yrFilter.on('change', handleFilterChange);
$mthFilter.on('change', handleFilterChange);

// Initial call on page load
$(document).ready(function() {
    var packFilter = (localStorage.isParent == "isParent") ? $packFilter.val() : "overall";
    var yrFilter = $yrFilter.val();
    var mthFilter = $mthFilter.val();

    fetchData(packFilter, yrFilter, mthFilter);
});
