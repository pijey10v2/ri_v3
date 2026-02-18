var procurement;

function conOpLink(proj_id, ref_no=''){
    var linkWinTitle = 'Contract'
    var linkName = 'finance_dash_contract_card'
    var linkParamArr = [proj_id, ref_no];
    window.parent.widgetConopOpen("Contract", linkName, linkParamArr, linkWinTitle);
}
function conOpClaimLink(proj_id, id=''){
    var linkWinTitle = 'Claim'
    var linkName = 'finance_dash_claim_card'
    var linkParamArr = [proj_id, id];
    window.parent.widgetConopOpen("Claim", linkName, linkParamArr, linkWinTitle);
}

function drawIndexChart(level, id, tooltip = false, subTitle) {
    var val;
    switch (level) {
        case 1:
            val = 30;
            break;
        case 0:
            val = 90;
            break;
        case -1:
            val = 150;
            break;
        default:
            val = 0;
    }
    Highcharts.chart(id, {
        chart: {
            type: 'gauge',
            height: '60%',
            events: {
                load: function () {
                    $('.gauge-chart').css('height', '80%');
                }
            }
        },
        title: {
            text: ''
        },
        subtitle: {
            useHTML : true,
            text: subTitle,
            verticalAlign: 'bottom',
            align: 'center'
        },
        pane: {
            startAngle: -90,
            endAngle: 90,
            background: [{
                // default background
                backgroundColor: '#fff',
                borderWidth: 0
            }]
        },
        // the value axis
        yAxis: {
            min: 0,
            max: 180,
            plotBands: [{
                from: 0,
                to: 60,
                color: '#55BF3B' // green
            }, {
                from: 60,
                to: 120,
                color: '#DDDF0D' // yellow
            }, {
                from: 120,
                to: 180,
                color: '#DF5353' // red
            }],
            labels: {
                enabled: false
            }
        },
        series: [{
            showInLegend: false,
            data: [val]
        }],
        tooltip: {
            formatter: function () {
                if (tooltip) {
                    return tooltip;
                } else {
                    return false;
                }
            }
        },
        credits: false,
        plotOptions: {
            gauge: {
                dataLabels: {
                    enabled: false
                }
            }
        }
    });
}


function updateSumCard(orig, revised, nett) {
    $("#origContractSumCard").html(formatThousand(orig));
    $("#revisedContractSumCard").html(formatThousand(revised));
    $("#nettVariationSumCard").html(formatThousand(nett));
}

function updateCumulativeCard(claim, claimCertified, payment) {
    $('#claimCumulCard').html(formatThousand(claim));
    $('#claimCumulCertifiedCard').html(formatThousand(claimCertified));
    $('#cumulPaymentCard').html(formatThousand(payment));
}

function drawFinSCurve(data) {
    var finPlan = [];
    var finActual = [];
    var monthYear = [];

    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            monthYear.push(idx);
            finPlan.push((ele.finPlan) ? parseFloat(ele.finPlan) : 0);
            finActual.push(parseFloat(ele.finActual));

            // if (ele.finActual == null) continue;
        }
    }
    Highcharts.chart('finScurve', {
        chart: {
            type: 'line'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: monthYear
        },
        yAxis: {
            min: 0,
            max: 100,
            tickAmount: 5,
            title: {
                text: ''
            },
            labels: {
                format: '{value}%'
            }
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                }
            }
        },
        series: [{
            name: 'Planned',
            data: finPlan,
            color: 'blue'
        }, {
            name: 'Actual',
            data: finActual,
            color: 'green'
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        },
        credits: false
    });

}

function drawTableclaim(data){
    var claimTableHTML = "";
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {

            claimTableHTML += '<tr  onclick="conOpClaimLink(\'' + ele.project_id + '\', \'' + ele.claim_id + '\')">'
            claimTableHTML += '<td>' + ((ele.ipa_no) ? ele.ipa_no : 0) + '</td>'
            claimTableHTML += '<td>' + ((ele.pay_period_to) ? ele.pay_period_to : 0) + '</td>'
            claimTableHTML += '<td>' + ((ele.total_claim_value) ? formatThousand(ele.total_claim_value) : 0) + '</td>' //Net IPA Amount
            claimTableHTML += '<td>' + ((ele.ipc_no) ? ele.ipc_no : 0) + '</td>' //Client Interim Payment Certificate
            claimTableHTML += '<td>' + ((ele.certifiedClaimDate) ? ele.certifiedClaimDate : 0) + '</td>' //Certified Payment Date
            claimTableHTML += '<td>' + ((ele.certified_claim_amount) ? formatThousand(ele.certified_claim_amount) : 0) + '</td>' //Certified Payment Amount
            claimTableHTML += '<td>' + ((ele.paymentReceivedDate) ? ele.paymentReceivedDate : 0) + '</td>' //Date of Payment Received for Client
            claimTableHTML += '<td>' + ((ele.payment_received_amount) ? formatThousand(ele.payment_received_amount) : 0) + '</td>' //Nett Amout Recieved for Client
            claimTableHTML += '</tr>'
        }
    }

    $("#claimTbBody").html(claimTableHTML); 
    

}

function updateTableCount(data, contractData){
    var tNetInterim = (data.totalInterimAmount) ? data.totalInterimAmount : 0;
    var tIpcRecommentAmount = (data.totalIpcRecAmount) ? data.totalIpcRecAmount : 0;
    var tNetAmountRec = (data.totalNetAmountRec) ? data.totalNetAmountRec : 0;

    $('#totalCumulClaim').html(formatCurrency(tNetInterim)); //Total IPA Amount
    $('#totalRecommendAmount').html(formatCurrency(tIpcRecommentAmount));
    $('#totalReceivedClaimAmount').html(formatCurrency(tNetAmountRec));

    var originalContractAmount = (contractData.original_amount) ? contractData.original_amount : 0;

    var percenCumul = ((tNetInterim / originalContractAmount) * 100).toFixed(2);
    var percenRecAmount = ((tIpcRecommentAmount / originalContractAmount) * 100).toFixed(2);
    var percenRecClaimAmount = ((tNetAmountRec / originalContractAmount) * 100).toFixed(2);

    $('#percentCumulClaim').html(percenCumul); //Total IPA Amount
    $('#percentRecommendAmount').html(percenRecAmount);
    $('#percentReceivedClaimAmount').html(percenRecClaimAmount);

}

function updateProcurementCard(data){
    var totaltlIpaAmount;
    var claimAmoutAfterRetain;
    var remainingClaimAmount;
    var claimToUsed;
    var ipaToUsed;
    var useTtlRecomAmount;

    var conName = ((data.contract_title) ? data.contract_title : "N/A");
    var contractSum = `<span class="clickableCard" onclick="conOpLink('`+data.project_id+`', '`+data.contract_id+`')">`+((data.original_amount)? formatCurrency(data.original_amount) : 0) +`</span>`;
    var conOriDuration = `<span class="clickableCard" onclick="conOpLink('`+data.project_id+`', '`+data.contract_id+`')">`+((data.original_duration)? data.original_duration : 0)+`</span>`;
    var conRetainage = `<span class="clickableCard" onclick="conOpLink('`+data.project_id+`', '`+data.contract_id+`')">`+((data.vor_retainage)? parseInt(data.vor_retainage) : 0)+`</span>`;
    
    $('#conName').html(conName);
	$('#contractSum').html(contractSum);
    $('#conOriDuration').html(conOriDuration);
    $('#conRetainage').html(conRetainage); //Retainage %
    
    ipaToUsed = (data.total_claim_vo_and_claim)? data.total_claim_vo_and_claim : 0;

    totaltlIpaAmount = `<span class="clickableCard" onclick="conOpLink('`+data.project_id+`', '`+data.contract_id+`')">`+ formatCurrency((data.total_claim_vo_and_claim)? data.total_claim_vo_and_claim : 0)+`</span>`;
    $('#ttlIpaAmount').html(totaltlIpaAmount); //Total IPA Amount

    useTtlRecomAmount = (data.cumulative_certified_amount) ? data.cumulative_certified_amount : 0;
    
    var ttlRecomAmount = `<span class="clickableCard" onclick="conOpLink('`+data.project_id+`', '`+data.contract_id+`')">`+((data.cumulative_certified_amount)? formatCurrency(data.cumulative_certified_amount) : 0)+`</span>`;
    var ttlRecedAmount = `<span class="clickableCard" onclick="conOpLink('`+data.project_id+`', '`+data.contract_id+`')">`+((data.cumulative_payment_received)? formatCurrency(data.cumulative_payment_received) : 0)+`</span>`;

    $('#ttlRecomAmount').html(ttlRecomAmount);
    $('#ttlRecedAmount').html(ttlRecedAmount); 

    var revConSum = `<span class="clickableCard" onclick="conOpLink('`+data.project_id+`', '`+data.contract_id+`')">`+((data.new_amount)? formatCurrency(data.new_amount) : 0)+`</span>`;
    var eotGrant = `<span class="clickableCard" onclick="conOpLink('`+data.project_id+`', '`+data.contract_id+`')">`+((data.extension_of_time)? data.extension_of_time : 0)+`</span>`;
    $('#revConSum').html(revConSum);
    $('#eotGrant').html(eotGrant)

    if(data.contract_type == "Retainage"){
       
        if (data.retainage_held_on == "Original Contract Amount"){
            var originalAmountRetain = (data.orignal_amount_retainage)? data.orignal_amount_retainage : 0;
            var voAmount = (data.variation_amount)? data.variation_amount : 0;
            claimToUsed = parseFloat(originalAmountRetain) + parseFloat(voAmount);
            claimAmoutAfterRetain = `<span class="clickableCard" onclick="conOpLink('`+data.project_id+`', '`+data.contract_id+`')">`+formatCurrency(parseFloat(originalAmountRetain) + parseFloat(voAmount))+`</span>`; //have to add VO amount also
            $('#claimAmountAfterRetainage').html(claimAmoutAfterRetain); //Claimable Ori Amount	
        }
        else{
            claimToUsed = (data.field62)? data.field62 : 0;
            claimAmoutAfterRetain = `<span class="clickableCard" onclick="conOpLink('`+data.project_id+`', '`+data.contract_id+`')">`+((data.field62)? data.field62 : 0)+`</span>`;
            $('#claimAmountAfterRetainage').html(claimAmoutAfterRetain); //Claimable Ori Amount	
        }
    }
    else{
      
        claimToUsed = (data.new_amount)? data.new_amount : 0;
        claimAmoutAfterRetain = `<span class="clickableCard" onclick="conOpLink('`+data.project_id+`', '`+data.contract_id+`')">`+formatCurrency((data.new_amount)? data.new_amount : 0)+`</span>`;
        $('#claimAmountAfterRetainage').html(claimAmoutAfterRetain); //Claimable Ori Amount	
    }

    remainingClaimAmount =  `<span class="clickableCard" onclick="conOpLink('`+data.project_id+`', '`+data.contract_id+`')">`+formatCurrency(claimToUsed - useTtlRecomAmount)+`</span>`;
    $('#balClaimAmount').html(remainingClaimAmount); //Remaining Claim Amount
    var revDuration = `<span class="clickableCard" onclick="conOpLink('`+data.project_id+`', '`+data.contract_id+`')">`+(data.new_duration)? data.new_duration : 0+`</span>`;
    $('#revDuration').html(revDuration)
}

function refreshInformation(projid = 'overall', year = 'all') {
	var contractDetails = (procurement.contract_particular && procurement.contract_particular[projid]) ? procurement.contract_particular[projid] : [];
	updateProcurementCard(contractDetails);

	var claimDetails = (procurement.claim_detail && procurement.claim_detail[projid] && procurement.claim_detail[projid][year] && procurement.claim_detail[projid][year].raw) ? procurement.claim_detail[projid][year].raw : [];
	drawTableclaim(claimDetails);

	var totalCardDetails = (procurement.claim_detail && procurement.claim_detail[projid] && procurement.claim_detail[projid][year] && procurement.claim_detail[projid][year].calculateCard) ? procurement.claim_detail[projid][year].calculateCard : [];
    updateTableCount(totalCardDetails, contractDetails);

}

function refreshDashboard(package_id = '') {
    var selWPC = $("#wpcFilter").val();
    var selYear = $('#yearFilter').val();
    selWPC = (selWPC) ? selWPC : 'overall';
    if(package_id != ''){
        selWPC = package_id;
    }
    refreshInformation(selWPC, selYear);
}

function refreshFromv3 (filterArr){
    var wpc = filterArr.wpc;
	var year = filterArr.year;
    refreshInformation(wpc, year);
}

$(function () {
    // load all the chart
    $.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "procurement"
        },
        success: function (obj) {
            if (obj.status && obj.status == 'ok') {
                procurement = obj.data;
                var package_id = '';
                if(localStorage.ui_pref == "ri_v3"){
                    var projid = '';
                    if(localStorage.isParent == 'isParent'){
                        $('.filterContainer .packFilter', window.parent.document).prop("selectedIndex", 1);
                        package_id =  $('.filterContainer .packFilter', window.parent.document).val();
                    }else{
                        package_id = 'overall';
                    }
                    refreshDashboard(projid);
                }
                refreshDashboard(package_id)
            }
        }
    });

})
