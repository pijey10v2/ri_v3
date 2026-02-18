var procurement;

function conOpLink(process, pro_id ='', ref_id){
    var linkName = '';
    var linkWinTitle = '';
    var linkParamArr = '';
    var searchfilter = getFilterDocumentSarawak();
   
    var cardName ;
    
    switch (process) {
        case 'PFS':
            linkWinTitle = 'CONTRACT DETAILS'
            linkName = 'finance_contract_dash_card'
            cardName = "Contract -" + ref_id;
            linkParamArr = processFilterParamArr([ searchfilter.section, ref_id])
          
            break;
        case 'CLAIM':
            linkWinTitle = 'INTERIM PAYMENT Claim'
            linkName = 'finance_dash_claim_card'
    
            cardName = "Claim -" + ref_id;
            if(localStorage.isParent == 'isParent'){
                linkParamArr = processFilterParamArr([ ref_id])
            }else {
                linkParamArr = processFilterParamArr([pro_id, ref_id])
            }
            break;
    }

    if(localStorage.isParent == 'isParent'){
        var project_id = linkParamArr[0];
        project_id = project_id.substring(project_id.indexOf('_')+1);
        project_id = project_id.substring(0, project_id.lastIndexOf('_'));
        linkParamArr[0] = project_id;
    }
   
    window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle + " - " + cardName);
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

function updateContractParticularCard(data) {
    var contractNoCard = (data.contract_no) ? data.contract_no : 'N/A';
    var origCompDateCard = (data.completion_date) ? data.completion_date : 'N/A';
    var commencementDateCard = (data.loa_date) ? data.loa_date : 'N/A';
    var extensionOfTimeCard = (data.extension_of_time) ? data.extension_of_time : '0';
    var revisedCompletionDateCard = (data.revised_completion_date) ? data.revised_completion_date : 'N/A';
    var subContractorValue = (data.total_subcontractor_amount) ? data.total_subcontractor_amount : 'N/A';

    $("#contractNoCard").html(contractNoCard);
    $("#origCompDateCard").html(origCompDateCard);
    $("#commencementDateCard").html(commencementDateCard);
    $("#extensionOfTimeCard").html(extensionOfTimeCard);
    $("#revisedCompletionDateCard").html(revisedCompletionDateCard);
    $("#subConVal").html(subContractorValue);

}

function updateSumCard(orig, revised, nett) {
    $("#origContractSumCard").html(orig);
    $("#revisedContractSumCard").html(revised);
    $("#nettVariationSumCard").html(nett);
}

function updateCumulativeCard(claim, claimCertified, payment) {
    $('#claimCumulCard').html(claim);
    $('#claimCumulCertifiedCard').html(claimCertified);
    $('#cumulPaymentCard').html(payment);
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
            claimTableHTML += '<tr class="clickableCard" onclick="conOpLink(\'CLAIM\',  \'' + ele.project_id + '\', \'' + ele.claim_id + '\')">'
            claimTableHTML += '<td>' + ((ele.contract_id_string) ? ele.contract_id_string : 0) + '</td>'
            claimTableHTML += '<td>' + ((ele.ipa_no) ? ele.ipa_no : 0) + '</td>'
            claimTableHTML += '<td>' + ((ele.pay_period_to) ? ele.pay_period_to : 0) + '</td>'
            claimTableHTML += '<td>' + ((ele.total_claim_value) ? ele.total_claim_value : 0) + '</td>' //Net Interim Amount Claim
            claimTableHTML += '<td>' + ((ele.ipc_no) ? ele.ipc_no : 0) + '</td>'
            claimTableHTML += '<td>' + ((ele.certifiedClaimDate) ? ele.certifiedClaimDate : 0) + '</td>' //Date of recommended
            claimTableHTML += '<td>' + ((ele.certified_claim_amount) ? ele.certified_claim_amount : 0) + '</td>' //IPC Recommended Amount
            claimTableHTML += '<td>' + ((ele.paymentReceivedDate) ? ele.paymentReceivedDate : 0) + '</td>' //Payment received date
            claimTableHTML += '<td>' + ((ele.payment_received_amount) ? ele.payment_received_amount : 0) + '</td>' //Payment received amount
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
    var uselRecommendAmount;

    var claimAmoutAfterRetain;
    var remainingClaimAmount;
    
    var conNameCard = (data.contract_title)? data.contract_title : "N/A";
	var contractSumCard = (data.original_amount)? formatCurrency(data.original_amount) : 0;
	var conOriDurationCard = (data.original_duration)? data.original_duration : 0;
    var conRetainage = (data.vor_retainage)? parseInt(data.vor_retainage) : 0;

    if(window.parent.$(".sectFilter.myFinance").is(":visible")){
        var sectionValue = window.parent.$(".sectFilter.myFinance").val();
    }
    else if(window.parent.$(".sectFilter.myDashboard").is(":visible")){
        var sectionValue = window.parent.$(".sectFilter.myDashboard").val();
    }

    if(conNameCard != "N/A"){
        conNameCard = `<span class="clickableCard" onclick="conOpLink('PFS', '', '')">`+((data.contract_title)? data.contract_title : "N/A")+`</span>`;
    }

    if(contractSumCard != 0){
        contractSumCard = `<span class="clickableCard" onclick="conOpLink('PFS', '', '')">`+((data.original_amount)? formatCurrency(data.original_amount) : 0)+`</span>`;
    }

    if(conOriDurationCard != 0){
        conOriDurationCard = `<span class="clickableCard" onclick="conOpLink('PFS', '', '')">`+((data.original_duration)? data.original_duration : 0)+`</span>`;
    }

    if(conRetainage != 0){
        conRetainage = `<span class="clickableCard" onclick="conOpLink('PFS', '', '')">`+((data.vor_retainage)? parseInt(data.vor_retainage) : 0)+`</span>`;
    }

    $('#conName').html(conNameCard);
	$('#contractSum').html(contractSumCard);
    $('#conOriDuration').html(conOriDurationCard);
    $('#conRetainage').html(conRetainage); //Retainage %

    totaltlIpaAmount = (data.total_claim_vo_and_claim)? data.total_claim_vo_and_claim : 0;

    var ttlIpaAmount = formatCurrency(totaltlIpaAmount);
    var ttlRecomAmount = (data.cumulative_certified_amount)? formatCurrency(data.cumulative_certified_amount) : 0;
    uselRecommendAmount = (data.cumulative_certified_amount)? data.cumulative_certified_amount : 0

    var ttlRecedAmount = (data.cumulative_payment_received)? formatCurrency(data.cumulative_payment_received) : 0;

    if(ttlIpaAmount != 0){
        ttlIpaAmount = `<span class="clickableCard" onclick="conOpLink('PFS', '', '')">`+(formatCurrency(totaltlIpaAmount))+`</span>`;
    }
    if(ttlRecomAmount != 0){
        ttlRecomAmount = `<span class="clickableCard" onclick="conOpLink('PFS', '', '')">`+((data.cumulative_certified_amount)? formatCurrency(data.cumulative_certified_amount) : 0)+`</span>`;
    }

    if(ttlRecedAmount != 0){
        ttlRecedAmount = `<span class="clickableCard" onclick="conOpLink('PFS', '', '')">`+((data.cumulative_payment_received)? formatCurrency(data.cumulative_payment_received) : 0)+`</span>`;
    }

    $('#ttlIpaAmount').html(ttlIpaAmount); //Total IPA Amount
    $('#ttlRecomAmount').html(ttlRecomAmount);
    $('#ttlRecedAmount').html(ttlRecedAmount);
    

    if(data.new_amount_after_revised){
        var revConSum = (data.new_amount_after_revised)? formatCurrency(data.new_amount_after_revised) : 0;

        if(revConSum != 0){
            revConSum = `<span class="clickableCard" onclick="conOpLink('PFS', '', '')">`+((data.new_amount_after_revised)? formatCurrency(data.new_amount_after_revised) : 0)+`</span>`;
        }
        $('#revConSum').html(revConSum);
    }
    else{
        var revConSum = (data.new_amount)? formatCurrency(data.new_amount) : 0;

        if(revConSum != 0){
            revConSum = `<span class="clickableCard" onclick="conOpLink('PFS', '', '')">`+((data.new_amount)? formatCurrency(data.new_amount) : 0)+`</span>`;
        }

        $('#revConSum').html(revConSum);
    }
    var eotGrant = (data.extension_of_time)? data.extension_of_time : 0;

    if(eotGrant != 0){
        eotGrant = `<span class="clickableCard" onclick="conOpLink('PFS','', '')">`+((data.extension_of_time)? data.extension_of_time : 0)+`</span>`;
    }

    $('#eotGrant').html(eotGrant)

    if(data.contract_type){
        if(data.contract_type == "Retainage"){
            if (data.retainage_held_on == "Original Contract Amount"){
                var originalAmountRetain = (data.orignal_amount_retainage)? data.orignal_amount_retainage : 0;
                var voAmount = (data.variation_amount)? data.variation_amount : 0;

                claimAmoutAfterRetain = parseFloat(originalAmountRetain) + parseFloat(voAmount); //have to add VO amount also
                var claimAmountAfterRetainage = formatCurrency(claimAmoutAfterRetain);

                if(claimAmountAfterRetainage != 0){
                    claimAmountAfterRetainage = `<span class="clickableCard" onclick="conOpLink('PFS', '', '')">`+(formatCurrency(claimAmoutAfterRetain))+`</span>`;
                }

                $('#claimAmountAfterRetainage').html(claimAmountAfterRetainage); //Claimable Ori Amount	
            }
            else{
                claimAmoutAfterRetain = (data.field62)? data.field62 : 0;
                var claimAmountAfterRetainage = formatCurrency(claimAmoutAfterRetain);

                if(claimAmountAfterRetainage != 0){
                    claimAmountAfterRetainage = `<span class="clickableCard" onclick="conOpLink('PFS', '', '')">`+(formatCurrency(claimAmoutAfterRetain))+`</span>`;
                }

                $('#claimAmountAfterRetainage').html(claimAmountAfterRetainage); //Claimable Ori Amount	
            }
        }
        else{
            claimAmoutAfterRetain = (data.new_amount)? data.new_amount : 0;
            var claimAmountAfterRetainage = formatCurrency(claimAmoutAfterRetain);

            if(claimAmountAfterRetainage != 0){
                claimAmountAfterRetainage = `<span class="clickableCard" onclick="conOpLink('PFS', '', '')">`+(formatCurrency(claimAmoutAfterRetain))+`</span>`;

            }

            $('#claimAmountAfterRetainage').html(claimAmountAfterRetainage); //Claimable Ori Amount	
        }
    }
    else{
        claimAmoutAfterRetain = (data.new_amount_after_revised)? data.new_amount_after_revised : 0;
        var claimAmountAfterRetainage = (0);

        $('#claimAmountAfterRetainage').html(claimAmountAfterRetainage); //Claimable Ori Amount	
    }

    if(data.remaining_claim_amount){
       
        var balClaimAmount = formatCurrency((data.remaining_claim_amount)? data.remaining_claim_amount : 0);

        if(balClaimAmount != 0){
            balClaimAmount = `<span class="clickableCard" onclick="conOpLink('PFS', '', '')">`+(formatCurrency((data.remaining_claim_amount)? data.remaining_claim_amount : 0))+`</span>`;
        }

        $('#balClaimAmount').html(balClaimAmount); //Remaining Claimable Amount
    }
    else{
        remainingClaimAmount = claimAmoutAfterRetain - uselRecommendAmount;
        var balClaimAmount = formatCurrency(remainingClaimAmount);
        
        if(balClaimAmount != 0){
            balClaimAmount = `<span class="clickableCard" onclick="conOpLink('PFS', '', '')">`+(formatCurrency(remainingClaimAmount))+`</span>`;
        }
        
        $('#balClaimAmount').html(balClaimAmount); //Remaining Claimable Amount
    }

    var revDuration = (data.new_duration)? data.new_duration : 0;

    if(revDuration != 0){
        revDuration = `<span class="clickableCard" onclick="conOpLink('PFS', '', '')">`+((data.new_duration)? data.new_duration : 0)+`</span>`;
    }

    $('#revDuration').html(revDuration)
	
}

function refreshInformation(projid = 'overall', section = 'overall', year = 'all') {
	var contractDetails = (procurement.contract_particular && procurement.contract_particular[projid] && procurement.contract_particular[projid][section]) ? procurement.contract_particular[projid][section] : [];
	updateProcurementCard(contractDetails);

    var dataClaim = (procurement.claim_detail && procurement.claim_detail[projid] && procurement.claim_detail[projid][section] && procurement.claim_detail[projid][section][year]) ? procurement.claim_detail[projid][section][year] : [];
	var claimDetails =  (dataClaim && dataClaim.raw) ? dataClaim.raw : [];
	drawTableclaim(claimDetails);

	var totalCardDetails = (dataClaim && dataClaim.calculateCard) ? dataClaim.calculateCard : [];
    updateTableCount(totalCardDetails, contractDetails);

}

function refreshDashboard() {
    var selWPC = $("#wpcFilter").val();
	var selSection = $("#sectionFilter").val();
    if(selWPC == 'overall'){
		selSection == 'overall';
	}
    var selYear = $('#yearFilter').val();

    refreshInformation(selWPC, selSection, selYear);
}

function refreshFromv3 (filterArr){
    var wpc = filterArr.wpc;
    var section = filterArr.section;
	var year = filterArr.year;
    refreshInformation(wpc, section, year);
}

function populateSectionFilter(data) {
    var optHTML = '<option selected="true" value="overall">- Choose Section -</option> ';
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            optHTML += '<option value="' + ele + '">' + ele + '</option>';
        }
    }
    $('#sectionFilter').html(optHTML);
  }

$(function () {
    $('#wpcFilter').val('overall');

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
                var sectionData = (procurement.section && procurement.section['overall']) ? procurement.section['overall'] : [];
                populateSectionFilter(sectionData);
                refreshInformation();
            }
        }
    });

    // only update section filter when overall changed
    $("#wpcFilter").change(function () {
        var sectionData = (procurement.section && procurement.section[$(this).val()]) ? procurement.section[$(this).val()] : [];
        populateSectionFilter(sectionData);
		refreshDashboard()

    })

})