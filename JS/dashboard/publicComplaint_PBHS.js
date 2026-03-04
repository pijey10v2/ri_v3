var pcData;
var textMonthtoNum = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};

function conOpLink(status=''){
    if(localStorage.ui_pref != "ri_v3") return;

    var searchilter = getSearchFilterSabah();
    var linkWinTitle = 'Public Complaint'
    var linkName = 'dash_cons_PBS_card'
    var linkParamArr = processFilterParamArr([status, searchilter.dateFrom, searchilter.dateTo])
    if(status == ''){
        status = 'Total';
    }
    window.parent.widgetConopOpen("", linkName, linkParamArr, linkWinTitle + " - " + status);
}

function updatePCCard(ttl, data){
    var closeAmt = (data && data.closed && data.closed.total) ? data.closed.total : 0;
    var pendingAmt = (data && data.pending && data.pending.total) ? data.pending.total : 0;

    var cardTtl = `<span class="clickableCard" onclick="conOpLink()">`+formatThousand(ttl)+`</span>`;
	var closeAmt = `<span class="clickableCard" onclick="conOpLink('Closed', '')">`+formatThousand(closeAmt)+`</span>`;
	var pendingAmt = `<span class="clickableCard" onclick="conOpLink('Pending', '')">`+formatThousand(pendingAmt)+`</span>`;

    $("#cardTtl").html(cardTtl);
    $("#cardClose").html(closeAmt);
    $("#cardPending").html(pendingAmt);
}

function drawPCCharts (monthYear, data) {
    var catArr = [];
    var dataArr = [];

    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);
            dataArr.push((ele) ? parseInt(ele) : 0);
        }
    }

    var title = $('h4').text();
    var projectName = $('h3').text();

    var chart = Highcharts.chart('pcStatusChart', {
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
                        text: '<span class="showLabel" style="display: flex; text-align: center; font-size: 15px">General Management Dashboard<br>'+localStorage.p_name+'<br>PUBLIC COMPLAINT CATEGORY ('+monthYear+')</span>'
                      }
                    })
        
                    chart.updateFlag = true;
                  } else if (chart.updateFlag) {
                    chart.updateFlag = false;
        
                    chart.update({
                      title: {
                        useHTML: true,
                        enabled: true,
                        text: '<span class="showLabel">General Management Dashboard<br>'+localStorage.p_name+'<br>PUBLIC COMPLAINT CATEGORY ('+monthYear+')</span>'
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
            text: '<span class="showLabel">General Management Dashboard<br>'+localStorage.p_name+'<br>PUBLIC COMPLAINT CATEGORY ('+monthYear+')</span>'
        },
        xAxis: {
            categories: catArr,
            crosshair: true
        },
        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: ''
            }
        },legend: {
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical',
            floating : false,
            y : -5,
            itemStyle : {
                fontSize : 8
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px;font-weight:bold;">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
            },
            series: {
                dataLabels: {
                  formatter: function() {
                    return '<span class="showLabel">'+this.y+'</span>';
                  },
                  enabled: true,
                  useHTML: true,
                }
              }
        },
        series: [{
            name: 'Total',
            data: dataArr,
            showInLegend: false,
			colorByPoint: true,
            cursor : 'pointer',
            events: {
                click: function (event) {
                    if(localStorage.ui_pref != "ri_v3") return;
                    
                    var searchilter = getSearchFilterSabah();
                    var status = searchilter.status;
                    var category = event.point.category.name;
                    var cardName = category;
                    if(category == ''){
                        category = 'N/A'
                        cardName = '';
                    }
                    linkParamArr = processFilterParamArr([status, searchilter.dateFrom, searchilter.dateTo, category])
                    window.parent.widgetConopOpen('Public Complaint', 'dash_cons_PBS_card', linkParamArr, 'Public Complaint - ' + (category));
                }
            }
            
        }],
        credits: {
            enabled: false
        }
    });
    chart.updateFlag = true;
}

function refreshInformation(packId = 'overall', year = 'all', month = 'all', status = 'allStatus'){
    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year;
    var cardInfo = (pcData[packId] && pcData[packId].card) ? pcData[packId].card : [];
    var otherDetails = (cardInfo[year] && cardInfo[year][month]) ? cardInfo[year][month] : 0;
    var ttl = (otherDetails.total) ? otherDetails.total : 0;
    updatePCCard(ttl, otherDetails);

    var pcChartData = (pcData[packId] && pcData[packId].cat) ? pcData[packId].cat : [];
    var pcYearMonthData = (pcChartData[year] && pcChartData[year][month] && pcChartData[year][month][status]) ? pcChartData[year][month][status] : [];
    drawPCCharts(dataYearMonth, pcYearMonthData);
}

function refreshDashboard(){
    var selWPC = $("#wpcFilter").val();
    var selStatus = $("#statusFilter").val();
    var selYear = $('#yearFilter').val();

    if (selYear == 'all') {
    	$('#monthFilter').prop("disabled", true);	
		$('#monthFilter').val('all');
    }else{
    	$('#monthFilter').prop("disabled", false);
    }

	var selMonth = $('#monthFilter').val();
    
    refreshInformation(selWPC, selYear, selMonth, selStatus);
}

function refreshFromv3 (filterArr){
    var wpc = filterArr.wpc;
	var year = filterArr.year;
    var month = filterArr.month;
    var status = filterArr.statusSbh;
    if(status=='allstatus'){
        status = 'allStatus'
    }
    refreshInformation(wpc, year, month, status);
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
    $("#yearFilter").change(function(){
        if($(this).val() != 'overall'){
            $("#monthFilter").attr('disabled', false);
        }else{
            $("#monthFilter").val('overall');
            $("#monthFilter").attr('disabled', true);
            refreshDashboard();
        }
    })
})