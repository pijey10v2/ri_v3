var utilitiesInfo;
var dashBoardTitle = 'URW';
var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};
var monthFulltext = {'01':"January",'02':"February",'03':"March",'04':"April",'05':"May",'06':"June",'07':"July",'08':"August",'09':"September",'10':"October",'11':"November",'12':"December"}


function conOpLink(process, status='', param1=''){
  if(localStorage.ui_pref != "ri_v3") return;

	var linkName = '';
	var linkWinTitle = '';
	var linkParamArr = '';
	var cardName;
	var searchilter = getSearchFilterSabah();
	switch (process) {
		case 'MS':
		linkWinTitle = 'Method Statement'
		linkName = 'dash_cons_MS_card'
		linkParamArr = processFilterParamArr([searchilter.dateFrom, searchilter.dateTo, '', '', '', '', status, "Utilities Relocation Work"])
		cardName = status
		break;
		case 'NCR':
		linkWinTitle = 'Non-Conformance Report'
		linkName = 'dash_cons_NCR_card'
		linkParamArr = processFilterParamArr([searchilter.dateFrom, searchilter.dateTo, status, '', '', '', "Utilities Relocation Work"]);
		cardName = status
		break;
		case 'RFIT':
		linkWinTitle = 'Request for Information Technical'
		linkName = 'dash_cons_RFIT_card'
		linkParamArr = processFilterParamArr([searchilter.dateFrom, searchilter.dateTo, '', '', '', status, "Utilities Relocation Work"]);
		cardName = status
		break;
		case 'RFI':
		linkWinTitle = 'Request for Inspection'
		linkName = 'dash_cons_RFI_card'
		linkParamArr = processFilterParamArr([searchilter.dateFrom, searchilter.dateTo, '', status, "Utilities Relocation Work"]);
		cardName = status
		break;
		case 'NOI':
		linkWinTitle = 'Notice Of Improvement'
		linkName = 'dash_cons_NOI_card'
		linkParamArr = processFilterParamArr([searchilter.dateFrom, searchilter.dateTo, '', '', '', status, "Utilities Relocation Work"]);
		cardName = status
		break;
		case 'DCR':
		linkWinTitle = 'Design Change Request'
		linkName = 'dash_cons_DCR_card'
		linkParamArr = processFilterParamArr([searchilter.dateFrom, searchilter.dateTo, status, "Utilities Relocation Work"]);
		cardName = status
		break;
	}
	if(status == ''){
		cardName = 'Cumulative';
	}
	window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle + " - " + cardName);
}

function updateTableOtherRFI(data){
    var rfiHTML = "";
	if (data) {
        for (const [key, value] of Object.entries(data)) {
            rfiHTML += '<tr>'
            rfiHTML += '<td>'+((key) ? key : 'N/A')+'</td>'
            rfiHTML += '<td onclick="conOpLink(`'+key+'`)"><span class="clickableCard" >'+((value.cumulative) ? formatThousand(value.cumulative) : '0')+'</span></td>'
            rfiHTML += '<td onclick="conOpLink(`'+key+'`, `Pending`)"><span class="clickableCard" >'+((value.open) ? formatThousand(value.open) : '0')+'</span></td>'
            rfiHTML += '<td onclick="conOpLink(`'+key+'`, `Closed`)"><span class="clickableCard" >'+((value.closed) ? formatThousand(value.closed) : '0')+'</span></td>'
            rfiHTML += '</tr>';
        }
	}
	$("#tableURWOthers").html(rfiHTML);
}

function updateTableRFI(data){
    var rfiHTML = "";
	if (data) {
        data.forEach(function(ele,idx){
            rfiHTML += '<tr onclick=openRecordList(\'' + ele.id + '\')>'
            rfiHTML += '<td>'+((ele.ref_no) ? ele.ref_no : '')+'</td>'
            rfiHTML += '<td>'+((ele.description) ? ele.description : '')+'</td>'
            rfiHTML += '<td>'+((ele.propose_date) ? ele.propose_date : '')+'</td>'
            rfiHTML += '<td>'+((ele.propose_time) ? ele.propose_time : '')+'</td>'
            rfiHTML += '</tr>';
        })
	}
	$("#rfiTBody").html(rfiHTML);
}

function openRecordList(recordId) {
  var linkParamArr = processFilterParamArr(['', '', '', '', '', recordId]);
  if (localStorage.ui_pref == "ri_v3") {
    window.parent.widgetConopOpen(dashBoardTitle, "dash_cons_RFI_card", linkParamArr, dashBoardTitle);
  }
}

function chartUtilityWorkProgress(urwChartDataArr, monthYear){
    var currDataArr = [];
    var prevDataArr = [];

    if(urwChartDataArr){
        for (const [key, value] of Object.entries(urwChartDataArr)) {
            currDataArr.push((value.current_progress) ? parseInt((value.current_progress)) : 0)
            currDataArr.push((value.current_schedule) ? parseInt((value.current_schedule)) : 0)

            prevDataArr.push((value.previous_progress) ? parseInt((value.previous_progress)) : 0)
            prevDataArr.push((value.previous_schedule) ? parseInt((value.previous_schedule)) : 0)

            var title = $('h4').text();
            var projectName = $('h3').text();

            var chart = Highcharts.chart(key, {
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
                                text: '<span class="showLabel" style="display: flex; text-align: center; font-size: 15px">Utilities Relocation Work Dashboard<br>'+localStorage.p_name+'<br>UTILITY WORK PROGRESS ('+monthYear+')</span>'
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
                                text: '<span class="showLabel">Utilities Relocation Work Dashboard<br>'+localStorage.p_name+'<br>UTILITY WORK PROGRESS (CUMULATIVE) ('+monthYear+')</span>'
                              },
                              legend: {
                                symbolHeight: 12,
                                symbolWidth: 12,
                                itemStyle: {
                                  fontSize: '12px',
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
                    text: '<span class="showLabel">Utilities Relocation Work Dashboard<br>'+localStorage.p_name+'<br>UTILITY WORK PROGRESS ('+monthYear+')</span>'
                },
                xAxis: {
                    categories: ['Progress', 'Schedule'],
                    title: {
                        text: null
                    }
                },
                credits:false,
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    }
                },
                legend: {
                    reversed: true
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
                series: [{
                    name: 'Current',
                    data: currDataArr,
                    color: Highcharts.getOptions().colors[0],
                    events: {
                      click: function (event) {
                        if(localStorage.ui_pref != "ri_v3") return;

                        var linkParamArr = processFilterParamArr([value.ref_no, value.utility_provider]);
                        window.parent.widgetConopOpen(dashBoardTitle, "dash_cons_PU_card", linkParamArr, dashBoardTitle + '- Current' );
                      }
                    }
                },
                {
                    name: 'Previous',
                    data: prevDataArr,
                    color: Highcharts.getOptions().colors[1],
                    events: {
                      click: function (event) {
                        if(localStorage.ui_pref != "ri_v3") return;
                        
                        var linkParamArr = processFilterParamArr([value.ref_no, value.utility_provider]);
                        window.parent.widgetConopOpen(dashBoardTitle, "dash_cons_PU_card", linkParamArr, dashBoardTitle + '- Previous' );
                      }
                    }
                }]
            });
            chart.updateFlag = true;
            currDataArr = [];
            prevDataArr = [];
            
        }
    }

    
}

function updateTableURW(data, monthYear){
    var urwHTML = "";
    var urwChartArr = [];
    var chartId = "";
	if (data) {
        data.forEach(function(ele,idx){
            chartId = 'utilityProgressChart_'+idx;

            urwHTML += '<tr style=" border-top: 1px solid black;">'
            urwHTML += '<td class="utilityProvider" rowspan="4" scope="rowgroup" style="width: 10%; text-align: center;">'+((ele.utility_provider) ? ele.utility_provider : '')+'</td>'
            urwHTML += '<td style="width: 10%; font-weight: bold;">Status:</td>'
            urwHTML += '<td style="width: 10%; font-weight: bold;">Status:</td>'
            urwHTML += '<td rowspan="4" class="chart-dash tableChart" scope="rowgroup" style="width: 70%; height: 400px;" id="'+chartId+'"></td>'
            urwHTML += '</tr>'
            urwHTML += '<tr>'
            urwHTML += '<td class="status1">'+((ele.design_status) ? ele.design_status : '')+'</td>'
            urwHTML += '<td class="status1">'+((ele.appointment_contractor_status) ? ele.appointment_contractor_status : '')+'</td>'
            urwHTML += '</tr>'
            urwHTML += '<tr>'
            urwHTML += '<td style="font-weight: bold;">Designed By:</td>'
            urwHTML += '<td style="font-weight: bold;">Subcontractors:</td>'
            urwHTML += '</tr>'
            urwHTML += '<tr>'
            urwHTML += '<td class="consultantName">'+((ele.designed_by) ? ele.designed_by : '')+'</td>'
            urwHTML += '<td class="subconName">'+((ele.subcontractor) ? ele.subcontractor : '')+'</td>'
            urwHTML += '</tr>';
            
            urwChartArr[chartId] = ele;
        })
	}
    $("#dataUtility").html(urwHTML);
    chartUtilityWorkProgress(urwChartArr, monthYear);
}

function refreshInformation(packId = 'overall', section = 'overall', year = 'all', month = 'all'){
	var URWMonth = month;
	if(month != 'all'){
		var monthNo = textMonthtoNum[month]
		URWMonth = monthFulltext [monthNo];
	}
    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year;

	var currData = (utilitiesInfo && utilitiesInfo.utilities && utilitiesInfo.utilities[packId] && utilitiesInfo.utilities[packId][section]) ? utilitiesInfo.utilities[packId][section] : [];
	var currRFIData = (utilitiesInfo && utilitiesInfo.rfi && utilitiesInfo.rfi[packId] && utilitiesInfo.rfi[packId][section]) ? utilitiesInfo.rfi[packId][section] : [];
	var currOtherRFIData = (utilitiesInfo && utilitiesInfo.all && utilitiesInfo.all[packId] && utilitiesInfo.all[packId][section]) ? utilitiesInfo.all[packId][section] : [];

    var tableURW = (currData[year] && currData[year][URWMonth] && currData[year][URWMonth]['raw']) ? currData[year][URWMonth]['raw'] : [];
	updateTableURW(tableURW, dataYearMonth);

    var tableRFI = (currRFIData[year] && currRFIData[year][month] && currRFIData[year][month]['raw']) ? currRFIData[year][month]['raw'] : [];
	updateTableRFI(tableRFI);

    var tableOtherRFI = (currOtherRFIData.card && currOtherRFIData.card[year] && currOtherRFIData.card[year][month]) ? currOtherRFIData.card[year][month] : [];
	updateTableOtherRFI(tableOtherRFI);

}

function refreshDashboard(){
    var selWPC = $('#wpcFilter').val();
    var selYear = $('#yearFilter').val();
	var selSection = 'overall';
    if (selYear == 'all') {
    	$('#monthFilter').prop("disabled", true);	
		$('#monthFilter').val('all');
    }else{
    	$('#monthFilter').prop("disabled", false);
    }
	var selMonth = $('#monthFilter').val();
    refreshInformation(selWPC, selSection, selYear, selMonth);
}

function refreshFromv3 (filterArr){
	var wpc = filterArr.wpc;
	var section = filterArr.section;
	var year = filterArr.year;
	var month = filterArr.month;

	refreshInformation(wpc, section, year, month);
}

$(document).ready(function(){
	$.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "utilities"
        },
        success: function (obj) {
        	utilitiesInfo = obj.data;
        	if (obj.status && obj.status == 'ok') {
        		refreshInformation();
        	}
        }
    });
})