var landData;

function updateLandIssueCard(total, pending, Completed){
    $('#landTotalIssueCard').html(total);
    $('#landPendingCard').html(pending);
    $('#landClosedCard').html(Completed);
}

function updateLandEncCard(ttlFoe, ttlEnc){
    ttlFoe = (ttlFoe > 0) ? ttlFoe : 0;
    ttlEnc = (ttlEnc > 0) ? ttlEnc : 0;
    
    $('#landTotalFOECard').html(ttlFoe);
    $('#landTotalEnCard').html(ttlEnc);
}

function drawDeliverableChart(data){
    var catArr = [];
    var ttlLength = [];
    var freeEnc = [];
    var ttlEnc = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);
            var ttlLengthVal = (ele.total_length) ? parseFloat(ele.total_length) : 0;
            var freeEncVal = (ele.free_encumbrances) ? parseFloat(ele.free_encumbrances) : 0;
            var ttlEncVal = (ele.total_encumbrances) ? parseFloat(ele.total_encumbrances) : 0;

            ttlLength.push((ttlLengthVal < 0) ? 0 : ttlLengthVal);
            freeEnc.push((freeEncVal < 0) ? 0 : freeEncVal);
            ttlEnc.push((ttlEncVal < 0) ? 0 : ttlEncVal);
        }
    }
    var chart = Highcharts.chart('land-deliverable', {
        chart: {
            type: 'bar',
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
                        text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>DELIVERABLE</span>'
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
                        text: '<span class="showLabel" style="text-align: center">Quality Management Dashboard<br>'+localStorage.p_name+'<br>DELIVERABLE</span>'
                      },
                      legend: {
                        floating: true,
                        verticalAlign: 'top',
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
            text: '<span class="showLabel">Quality Management Dashboard<br>'+localStorage.p_name+'<br>DELIVERABLE</span>'
          },
        xAxis: {
            categories: catArr
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        legend: {
            align: 'center',
            verticalAlign: 'top',
            floating: true,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        series: [{
            type: 'column',
            name: 'Sum of Total Length',
            data: ttlLength,
            dataLabels: {
                enabled: true,
            },
            color: Highcharts.getOptions().colors[0]
        },{
            type: 'column',
            name: 'Sum of Total of Encumbrances (km)',
            data: ttlEnc,
            dataLabels: {
                enabled: true,
            },
            color: Highcharts.getOptions().colors[1]
        },{
            type: 'column',
            name: 'Sum of Free of Encumbrances (km)',
            data: freeEnc,
            dataLabels: {
                enabled: true,
            },
            color: Highcharts.getOptions().colors[2]
        }],
        credits: false,
    });
    chart.updateFlag = true;
}

function populateLandIssueTable(data){
    let tbHTML = '';
    if (data) {
        data.forEach(function(ele,idx){
            tbHTML += '<tr>'
            tbHTML += '<td>'+((ele.wpc) ? ele.wpc : '')+'</td>'
            tbHTML += '<td>'+((ele.c_issue) ? ele.c_issue : '')+'</td>'
            tbHTML += '<td>'+((ele.c_issue_date) ? ele.c_issue_date : '')+'</td>'
            tbHTML += '<td>'+((ele.c_source) ? ele.c_source : '')+'</td>'
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
    $('#sourceFilter').html(optHtml);

    let optHtmlV3 = '<option value="all">Select Status</option>';
    if (opt) {
        opt.forEach(function(ele,idx){
            optHtmlV3 += '<option value="'+ele+'">'+ele+'</option>'; 
        });
    }
	$('#sourceFilterId', window.parent.document).html(optHtmlV3);

}

function refreshInformation(selWPC = 'overall', selStatus = 'all', selSource = 'all'){
    // projectid -> status -> sources
    var selWPC = $("#wpcFilter").val();
    var selStatus = $("#issueStatusFilter").val();
    var selSource = $("#sourceFilter").val();

    var tbData = (landData && landData.issue && landData.issue[selWPC] && landData.issue[selWPC][selStatus] && landData.issue[selWPC][selStatus][selSource]) ? landData.issue[selWPC][selStatus][selSource] : [];

    populateLandIssueTable(tbData);

    var ttlIssue = (landData && landData.issue && landData.issue[selWPC] && landData.issue[selWPC][selStatus] && landData.issue[selWPC][selStatus][selSource]) ? landData.issue[selWPC][selStatus][selSource].length : 0;
    var ttlClosed = ((selStatus == 'Completed' || selStatus == 'all') && landData && landData.issue && landData.issue[selWPC] && landData.issue[selWPC]['Completed'] && landData.issue[selWPC]['Completed'][selSource]) ? landData.issue[selWPC]['Completed'][selSource].length : 0;
    var ttlPending = ((selStatus == 'Pending' || selStatus == 'all') && landData && landData.issue && landData.issue[selWPC] && landData.issue[selWPC]['Pending'] && landData.issue[selWPC]['Pending'][selSource]) ? landData.issue[selWPC]['Pending'][selSource].length : 0;
    updateLandIssueCard(ttlIssue, ttlPending, ttlClosed);

    var encChartData = [];
    if (selWPC != 'overall') {
        encChartData = (landData.encumbrances && landData.encumbrances.encData && landData.encumbrances.encData[selWPC]) ? {[selWPC] : landData.encumbrances.encData[selWPC]} : {[selWPC] : []}; 
    }else{
        encChartData = (landData.encumbrances && landData.encumbrances.encData) ? landData.encumbrances.encData : []; 
    }
    drawDeliverableChart(encChartData);  

    if (selWPC == 'overall'){
        var ttlFoe = (landData.encumbrances && landData.encumbrances.encCardData && landData.encumbrances.encCardData.totalFOE) ?  landData.encumbrances.encCardData.totalFOE : 0; 
        var ttlEnc = (landData.encumbrances && landData.encumbrances.encCardData && landData.encumbrances.encCardData.totalFOE) ?  landData.encumbrances.encCardData.totalFOE : 0;  
    }
    else{
        var ttlFoe = (landData.encumbrances && landData.encumbrances.encData && landData.encumbrances.encData[selWPC] && landData.encumbrances.encData[selWPC].foc) ?  landData.encumbrances.encData[selWPC].foc : 0; 
        var ttlEnc = (landData.encumbrances && landData.encumbrances.encData && landData.encumbrances.encData[selWPC] && landData.encumbrances.encData[selWPC].encumbrances) ?  landData.encumbrances.encData[selWPC].encumbrances : 0;  
    }
    updateLandEncCard(ttlFoe, ttlEnc);
}

function refreshDashboard(){
    var selWPC = $("#wpcFilter").val();
    var issueStatus = $("#issueStatusFilter").val();
    var source = $('#sourceFilter').val();

    refreshInformation(selWPC, issueStatus, source);
}

function refreshFromv3 (filterArr){
	var wpc = filterArr.wpc;
    var status = filterArr.statusLand;
    var source = filterArr.sourceLand;

    refreshInformation(wpc, status, source);
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
                var opt = (landData.issue && landData.issue.issueSourcesOption) ? landData.issue.issueSourcesOption : [];
                populateStatusOption(opt);

                // projectid -> status -> sources
                var tbData = (landData.issue && landData.issue.overall && landData.issue.overall.all && landData.issue.overall.all.all) ? landData.issue.overall.all.all : [];
                populateLandIssueTable(tbData);

                refreshInformation();
            }
        }
    });
})