var riskData;
var dashBoardTitle = 'Risk Register';

function conOpLink(process, status){
  if(localStorage.ui_pref != "ri_v3") return;

	var linkName = '';
	var linkWinTitle = '';
	var linkParamArr = '';
	var searchFilter = getSearchFilterSabah();
	var cardName;

	switch (process) {
		case 'Risk':
			linkWinTitle = dashBoardTitle
			linkName = 'dash_cons_RR_card'
			linkParamArr = processFilterParamArr([status, searchFilter.dateFrom, searchFilter.dateTo, searchFilter.riskCat, searchFilter.risk])
			if(status==''){
				cardName = 'Total';
			}else if(status=='Inactive'){
				cardName = 'Close';
			}else{
				cardName = 'Ongoing';
			}
			break;
		case 'Doc':
			linkWinTitle = 'Document'
			linkName = 'dash_doc_register_doc_card'
			linkParamArr = processFilterParamArr(['', '', 'Trend Alert'])
			cardName = 'Trend Alert'
			break;
	}
  
  	window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle + " - " + cardName);
}

function refreshDashboard(){
    var selWPC = $("#wpcFilter").val();
    var catFilter = $("#catFilter").val();
    var ratingFilter = $("#ratingFilter").val();
    var selYear = $('#yearFilter').val();

    if (selYear == 'all') {
    	$('#monthFilter').prop("disabled", true);	
		$('#monthFilter').val('all');
    }else{
    	$('#monthFilter').prop("disabled", false);
    }

	  var selMonth = $('#monthFilter').val();
    
    refreshInformation(selWPC, catFilter, ratingFilter, selYear, selMonth);
}

function getRiskStyle(rsk){
    var ret = 'background:white;color:black';
    switch(rsk) {
      case 'Low':
        ret = 'background:#FFD966;color:black';
        break;
      case 'Medium':
        ret = 'background:#00ff00;color:black';
        break;
      case 'Serious':
        ret = 'background:#4472C4;color:white';
        break;
      case 'Significant':
        ret = 'background:#4472C4;color:white';
        break;
      case 'High':
        ret = 'background:#FF0000;color:white';
        break;
      default:
        ret = 'background:white;color:black';
    } 
    return ret;
}

function populateRiskTable(data){
    var tbHTML = "";
    var noCnt = 1;
    if (data) {
        data.forEach(function(val){
            tbHTML += '<tr onclick=openRecordList(\'' + val.id + '\')>'
            tbHTML += '<td>' + noCnt + '</td>'
            tbHTML += '<td>' +( (val.c_risk_category) ? val.c_risk_category : '')+ '</td>'
            tbHTML += '<td>' +( (val.c_risk_subCategory) ? val.c_risk_subCategory : '')+ '</td>'
            tbHTML += '<td>' +( (val.c_risk_description) ? val.c_risk_description : '')+ '</td>'
            tbHTML += '<td>' +( (val.probability) ? val.probability : '')+ '</td>'
            tbHTML += '<td>' +( (val.impact) ? val.impact : '')+ '</td>'
            tbHTML += '<td>' +( (val.riskScore) ? val.riskScore : '')+ '</td>'
            tbHTML += '<td style="'+getRiskStyle(val.risk)+';">' +( (val.risk) ? val.risk : '')+ '</td>'
            tbHTML += '</tr>';
            noCnt++;
        })      
    }
    $("#riskTableData").html(tbHTML);

}

function openRecordList(recordId) {
  var linkParamArr = processFilterParamArr(['', '', '', '', '', recordId]);
  if (localStorage.ui_pref == "ri_v3") {
    window.parent.widgetConopOpen(dashBoardTitle, "dash_cons_RR_card", linkParamArr, dashBoardTitle);
  }
}

function drawRiskCategoryChart(monthYear, data) {
    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = { name: idx, y: (ele) ? ele : 0 };
            dataArr.push(tempArr);
        }
    }

    // riskCategoryCharts
    var chart = Highcharts.chart('riskCategoryCharts', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
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
                        text: '<span class="showLabel" style="display: flex; text-align: center; font-size: 15px">Risk Management Dashboard<br>'+localStorage.p_name+'<br>RISK CATEGORY (CUMULATIVE) ('+monthYear+')</span>'
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
                        text: '<span class="showLabel">Risk Management Dashboard<br>'+localStorage.p_name+'<br>RISK CATEGORY ('+monthYear+')</span>'
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
            text: '<span class="showLabel">Risk Management Dashboard<br>'+localStorage.p_name+'<br>RISK CATEGORY ('+monthYear+')</span>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                showInLegend: true,
                dataLabels: {
                    enabled: true,                        
                    format: '{series.name}: {point.y}'
                },
                size: '90%'								
            }
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
            data: dataArr,
            events: {
              click: function (event) {
                  if(localStorage.ui_pref != "ri_v3") return;

                  var searchFilter = getSearchFilterSabah();

                  var linkParamArr = processFilterParamArr(['', searchFilter.dateFrom, searchFilter.dateTo, event.point.name, searchFilter.risk]);
                  
                  window.parent.widgetConopOpen(dashBoardTitle, "dash_cons_RR_card", linkParamArr, dashBoardTitle + '-' + event.point.name);
              }
            }
        }],
        credits: false
    });
    chart.updateFlag = true;
}

function updateRiskCard(data){
  var riskTtlCard = `<span class="clickableCard" onclick="conOpLink('Risk','', '')">`+((data.total) ? formatThousand(data.total) : 0)+`</span>`;
  var riskCloseCard = `<span class="clickableCard" onclick="conOpLink('Risk','Inactive', '')">`+((data.Inactive) ? formatThousand(data.Inactive) : 0)+`</span>`;
  var riskOngoingCard = `<span class="clickableCard" onclick="conOpLink('Risk','Active', '')">`+((data.Active) ? formatThousand(data.Active) : 0)+`</span>`;

  $("#riskTtlCard").html(riskTtlCard);
  $("#riskCloseCard").html(riskCloseCard);
  $("#riskOngoingCard").html(riskOngoingCard);
}

function updateTrendAlertCard(ttl){
    var ttl = `<span class="clickableCard" onclick="conOpLink('Doc')">`+((ttl) ? formatThousand(ttl) : 0)+`</span>`;

    $("#trendAlertTtl").html(ttl);
}

function refreshInformation(packId = 'overall', cat = 'overall', rating = 'overall', year = 'all', month = 'all'){
    var dataYearMonth = "Month:" +month+ " - " + "Year:" +year;
    var riskDt = (riskData.risk && riskData.risk[packId] && riskData.risk[packId][cat] && riskData.risk[packId][cat][rating]) ? riskData.risk[packId][cat][rating] : [];

    var tbData = (riskDt.list) ? riskDt.list : [];
    populateRiskTable(tbData);

    var riskCat = (riskDt.category && riskDt.category[year] && riskDt.category[year][month]) ? riskDt.category[year][month] : [];
    drawRiskCategoryChart(dataYearMonth, riskCat);
 
    var riskCard = (riskDt.card && riskDt.card[year] && riskDt.card[year][month]) ? riskDt.card[year][month] : [];
    updateRiskCard(riskCard);

    var taDt = (riskData.trendAlert && riskData.trendAlert[packId] && riskData.trendAlert[packId].card && riskData.trendAlert[packId].card.total) ? riskData.trendAlert[packId].card.total : 0;
    updateTrendAlertCard(taDt);

}

function refreshFromv3 (filterArr){
	var wpc = filterArr.wpc;
	var year = filterArr.year;
	var month = filterArr.month;
	var riskCat = filterArr.riskCat;
	var riskRating = filterArr.riskRating;
	refreshInformation(wpc,riskCat,riskRating, year, month);
}

$(document).ready(function(){
    $('#wpcFilter').val('overall');
	$.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "risk"
        },
        success: function (obj) {
        	if (obj.status && obj.status == 'ok') {
                riskData = obj.data;
                refreshInformation();

                // populate the dropdown
                if(riskData.risk && riskData.risk.option){
                    if(riskData.risk.option.cat){
                        var catFilterHTML = "<option value='overall' selected>---</option>";
                        for (const [idx, ele] of Object.entries(riskData.risk.option.cat)) {
                            catFilterHTML += "<option value='"+ele+"'>"+ele+"</option>"
                        }
                        $("#catFilter").html(catFilterHTML);

                        //POPULATE FILTER OUTSIDE IFRAME (V3)
                        var catFilterHTMLV3 = "<option value='overall' selected>Select Category</option>";
                        for (const [idx, ele] of Object.entries(riskData.risk.option.cat)) {
                            catFilterHTMLV3 += "<option value='"+ele+"'>"+ele+"</option>"
                        }
                        $('#categoryRiskFilterId', window.parent.document).html(catFilterHTMLV3);
                    }

                        if(riskData.risk.option.rating){
                        var rateFilterHTML = "<option value='overall' selected>---</option>";
                        for (const [idx, ele] of Object.entries(riskData.risk.option.rating)) {
                            rateFilterHTML += "<option value='"+ele+"'>"+ele+"</option>"
                        }
                        $("#ratingFilter").html(rateFilterHTML);

                        //POPULATE FILTER OUTSIDE IFRAME (V3)
                        var rateFilterHTMLV3 = "<option value='overall' selected>Select Risk Rating</option>";
                        for (const [idx, ele] of Object.entries(riskData.risk.option.rating)) {
                            rateFilterHTMLV3 += "<option value='"+ele+"'>"+ele+"</option>"
                        }
                        $('#riskRatingFilterId', window.parent.document).html(rateFilterHTMLV3);
                    }
                }
        	}
        }
    });
})