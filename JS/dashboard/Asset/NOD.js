var nodData;
var fullNameAPJKPJ = "Anggaran/Kelulusan Penyelenggaraan Jalan";
var legendColorArr = {
    'green': '#52BE80', 
    'blue': 'rgb(124, 181, 236)',
    'yellow': '#F4D03F',
    'orange' : '#DD9941',
    'red' : '#E93232'
}
var qualityStatusColor = {
    'Good': legendColorArr['green'], 
    'Mild': legendColorArr['blue'],
    'Bad' : legendColorArr['yellow'],
    'Serious': legendColorArr['orange'],
    'Critical' : legendColorArr['red']
}

function conOpLink(process, priority, id){
    var linkName = '';
    var linkWinTitle = '';
    var linkParamArr = '';
    var searchfilter = getFilterDashboardAsset();
    var cardName;
  
    switch (process) {
        case 'APJ':
            linkWinTitle = 'Anggaran Penyenggaraan Jalan (APJ)'
            linkName = 'dash_asset_nod_apj_card'
  
            if(priority == 'Critical'){
              priority = '1';
              cardName = 'Critical';
            }else if(priority == 'Serious'){
              priority = '2';
              cardName = 'Serious';
            }else if(priority == 'Bad'){
              priority = '3';
              cardName = 'Bad';
            }else if(priority == 'Mild'){
              priority = '4';
              cardName = 'Mild';
            }else if(priority == 'Good'){
              priority = '5';
              cardName = 'Good';
            }else if(priority == ''){
              priority = ''
              cardName = 'Total Item'
            }else{
                priority = priority
                cardName = priority == '1' ? 'Critical' : (priority == '2' ? 'Serious' : (priority == '3' ? 'Bad' : (priority == '4' ? 'Mild' : (priority == '5' ? 'Good' : ''))))
            }
  
            linkParamArr = processFilterParamArr([priority, id, searchfilter.dateFrom, searchfilter.dateTo])
            break;

        case 'KPJ':
            linkWinTitle = 'Kelulusan Penyelenggaraan Jalan (KPJ)'
            linkName = 'dash_asset_nod_kpj_card'
  
            if(priority == 'Critical'){
              priority = '1';
              cardName = 'Critical';
            }else if(priority == 'Serious'){
              priority = '2';
              cardName = 'Serious';
            }else if(priority == 'Bad'){
              priority = '3';
              cardName = 'Bad';
            }else if(priority == 'Mild'){
              priority = '4';
              cardName = 'Mild';
            }else if(priority == 'Good'){
              priority = '5';
              cardName = 'Good';
            }else if(priority == ''){
                priority = ''
                cardName = 'Total Item'
              }else{
                  priority = priority
                  cardName = priority == '1' ? 'Critical' : (priority == '2' ? 'Serious' : (priority == '3' ? 'Bad' : (priority == '4' ? 'Mild' : (priority == '5' ? 'Good' : ''))))
              }
  
            linkParamArr = processFilterParamArr([priority, id, searchfilter.dateFrom, searchfilter.dateTo])
            break;

        case 'APJPriority':
            linkWinTitle = 'APJ based on Priority'
            linkName = 'dash_asset_nod_apj_card'
  
            if(priority == 'Critical'){
              priority = '1';
              cardName = 'Critical';
            }else if(priority == 'Serious'){
              priority = '2';
              cardName = 'Serious';
            }else if(priority == 'Bad'){
              priority = '3';
              cardName = 'Bad';
            }else if(priority == 'Mild'){
              priority = '4';
              cardName = 'Mild';
            }else if(priority == 'Good'){
              priority = '5';
              cardName = 'Good';
            }else if(priority == ''){
              priority = ''
              cardName = 'Total Item'
            }else{
                priority = priority
                cardName = priority == '1' ? 'Critical' : (priority == '2' ? 'Serious' : (priority == '3' ? 'Bad' : (priority == '4' ? 'Mild' : (priority == '5' ? 'Good' : ''))))
            }
  
            linkParamArr = processFilterParamArr([priority, id, searchfilter.dateFrom, searchfilter.dateTo])
            break;

        case 'KPJPriority':
            linkWinTitle = 'KPJ based on Priority'
            linkName = 'dash_asset_nod_kpj_card'
  
            if(priority == 'Critical'){
              priority = '1';
              cardName = 'Critical';
            }else if(priority == 'Serious'){
              priority = '2';
              cardName = 'Serious';
            }else if(priority == 'Bad'){
              priority = '3';
              cardName = 'Bad';
            }else if(priority == 'Mild'){
              priority = '4';
              cardName = 'Mild';
            }else if(priority == 'Good'){
              priority = '5';
              cardName = 'Good';
            }else if(priority == ''){
                priority = ''
                cardName = 'Total Item'
              }else{
                  priority = priority
                  cardName = priority == '1' ? 'Critical' : (priority == '2' ? 'Serious' : (priority == '3' ? 'Bad' : (priority == '4' ? 'Mild' : (priority == '5' ? 'Good' : ''))))
              }
  
            linkParamArr = processFilterParamArr([priority, id, searchfilter.dateFrom, searchfilter.dateTo])
            break;

        case 'totalApj':
            linkWinTitle = 'Anggaran Penyenggaraan Jalan (APJ)'
            linkName = 'dash_asset_nod_apj_ttl_card'
            cardName = 'Total'
            linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo])
            break;

        case 'totalKpj':
            linkWinTitle = 'Kelulusan Penyelenggaraan Jalan (KPJ)'
            linkName = 'dash_asset_nod_kpj_ttl_card'
            cardName = 'Total'
            linkParamArr = processFilterParamArr([searchfilter.dateFrom, searchfilter.dateTo])
            break;
    }
    window.parent.widgetConopOpen(process, linkName, linkParamArr, linkWinTitle + " - " + cardName);
}

function updateCard(dataKPJ, dataAPJ, apjTtl, kpjTtl){

    // FOR APJ CARD
    var ttlCrit = 0;
    var ttlSer = 0;
    var ttlBad = 0;
    var ttlMild = 0;
    var ttlGood = 0;
    var ttlAmt = 0;
    var ttlNod = 0;
    var totalKPJ = 0;
    var totalAmtKPJ = 0;
    var totalKpjCrit = 0;
    var totalKpjSerious = 0;
    var totalKpjBad = 0;
    var totalKpjMild = 0;
    var totalKpjGood = 0;
    var totalNODKpj = 0;

    //Critical
    ttlCrit = (dataKPJ && dataKPJ.yearDate &&  dataKPJ.yearDate.Critical);
    if (isNaN(ttlCrit)) ttlCrit = 0;
    totalKpjCrit = 'default' ? ttlCrit : 0;

    if(totalKpjCrit > 0){
        $('#ttlCriticalKPJ').attr('onclick', "conOpLink('KPJ', 'Critical' , '')").attr('class', "clickableCard").html('RM ' + formatCurrency(totalKpjCrit));
    }else{
        $('#ttlCriticalKPJ').html('RM ' + formatCurrency(totalKpjCrit));
    }

    //Serious
    ttlSer = (dataKPJ && dataKPJ.yearDate && dataKPJ.yearDate.Serious);
    if (isNaN(ttlSer)) ttlSer = 0;
    totalKpjSerious = 'default' ? ttlSer : 0;

    if(totalKpjSerious > 0){
        $('#ttlSeriousKPJ').attr('onclick', "conOpLink('KPJ', 'Serious', '')").attr('class', "clickableCard").html('RM ' + formatCurrency(totalKpjSerious));
    }else{
        $('#ttlSeriousKPJ').html('RM ' + formatCurrency(totalKpjSerious));
    }

    //Bad
    ttlBad = (dataKPJ && dataKPJ.yearDate && dataKPJ.yearDate.Bad);
    if (isNaN(ttlBad)) ttlBad = 0;
    totalKpjBad = 'default' ? ttlBad : 0;

    if(totalKpjBad > 0){
        $('#ttlBadKPJ').attr('onclick', "conOpLink('KPJ', 'Bad', '')").attr('class', "clickableCard").html('RM ' + formatCurrency(totalKpjBad));
    }else{
        $('#ttlBadKPJ').html('RM ' + formatCurrency(totalKpjBad));
    }

    //Mild
    ttlMild = (dataKPJ && dataKPJ.yearDate && dataKPJ.yearDate.Mild);
    if (isNaN(ttlMild)) ttlMild = 0;
    totalKpjMild = 'default' ? ttlMild : 0;

    if(totalKpjMild > 0){
        $('#ttlMildKPJ').attr('onclick', "conOpLink('KPJ', 'Mild', '')").attr('class', "clickableCard").html('RM ' + formatCurrency(totalKpjMild));
    }else{
        $('#ttlMildKPJ').html('RM ' + formatCurrency(totalKpjMild));
    }

    //Good
    ttlGood = (dataKPJ && dataKPJ.yearDate && dataKPJ.yearDate.Good);
    if (isNaN(ttlGood)) ttlGood = 0;
    totalKpjGood = 'default' ? ttlGood : 0;

    if(totalKpjGood > 0){
        $('#ttlGoodKPJ').attr('onclick', "conOpLink('KPJ', 'Good', '')").attr('class', "clickableCard").html('RM ' + formatCurrency(totalKpjGood));
    }else{
        $('#ttlGoodKPJ').html('RM ' + formatCurrency(totalKpjGood));
    }

    totalNODKpj = (kpjTtl != "") ? kpjTtl : 0;

    if(totalNODKpj > 0){
        $('#ttlKPJ').attr('onclick', "conOpLink('totalKpj', '', '')").attr('class', "clickableCard").html(totalNODKpj);
    }else{
        $('#ttlKPJ').html(totalNODKpj);
    }

    //total nod
    ttlNod = dataKPJ && dataKPJ.quantityStatus && dataKPJ.quantityStatus.total;
    totalKPJ = ttlNod ? ttlNod : 0;
    
    if(totalKPJ > 0){
        $('#ttlKPJitem').attr('onclick', "conOpLink('KPJ', '', '')").attr('class', "clickableCard").html(totalKPJ);
    }else{
        $('#ttlKPJitem').html(totalKPJ);
    }

    ttlAmt = ttlCrit + ttlSer + ttlBad + ttlMild + ttlGood;
    totalAmtKPJ = ttlAmt ? ttlAmt : 0;

    if(totalAmtKPJ > 0){
        $('#ttlAmtKPJ').attr('onclick', "conOpLink('KPJ', '', '')").attr('class', "clickableCard").html('RM ' + formatCurrency(totalAmtKPJ));
    }else{
        $('#ttlAmtKPJ').html('RM ' + formatCurrency(totalAmtKPJ));
    }
    
    //FOR APJ CARD
    var ttlCritAPJ = 0;
    var ttlSerAPJ = 0;
    var ttlBadAPJ = 0;
    var ttlMildAPJ = 0;
    var ttlGoodAPJ = 0;
    var ttlAmtAPJ = 0;
    var ttlNodAPJ = 0;
    var totalAPJ = 0;
    var totalAmtAPJ = 0;
    var totalApjCrit = 0;
    var totalApjSerious = 0;
    var totalApjBad = 0;
    var totalApjMild = 0;
    var totalApjGood = 0;
    var totalNODApj = 0;

    //Critical
    ttlCritAPJ = (dataAPJ && dataAPJ.yearDate &&  dataAPJ.yearDate.Critical);
    if (isNaN(ttlCritAPJ)) ttlCritAPJ = 0;
    totalApjCrit = 'default' ? ttlCritAPJ : 0;

    if(totalApjCrit > 0){
        $('#ttlCriticalAPJ').attr('onclick', "conOpLink('APJ', 'Critical', '')").attr('class', "clickableCard").html('RM ' + formatCurrency(totalApjCrit));
    }else{
        $('#ttlCriticalAPJ').html('RM ' + formatCurrency(totalApjCrit));
    }

    //Serious
    ttlSerAPJ = (dataAPJ && dataAPJ.yearDate && dataAPJ.yearDate.Serious);
    if (isNaN(ttlSerAPJ)) ttlSerAPJ = 0;
    totalApjSerious = 'default' ? ttlSerAPJ : 0;

    if(totalApjSerious > 0){
        $('#ttlSeriousAPJ').attr('onclick', "conOpLink('APJ', 'Serious', '')").attr('class', "clickableCard").html('RM ' + formatCurrency(totalApjSerious));
    }else{
        $('#ttlSeriousAPJ').html('RM ' + formatCurrency(totalApjSerious));
    }

    //Bad
    ttlBadAPJ = (dataAPJ && dataAPJ.yearDate && dataAPJ.yearDate.Bad);
    if (isNaN(ttlBadAPJ)) ttlBadAPJ = 0;
    totalApjBad = 'default' ? ttlBadAPJ : 0;

    if(totalApjBad > 0){
        $('#ttlBadAPJ').attr('onclick', "conOpLink('APJ', 'Bad', '')").attr('class', "clickableCard").html('RM ' + formatCurrency(totalApjBad));
    }else{
        $('#ttlBadAPJ').html('RM ' + formatCurrency(totalApjBad));
    }

    //Mild
    ttlMildAPJ = (dataAPJ && dataAPJ.yearDate && dataAPJ.yearDate.Mild);
    if (isNaN(ttlMildAPJ)) ttlMildAPJ = 0;
    totalApjMild = 'default' ? ttlMildAPJ : 0;

    if(totalApjMild > 0){
        $('#ttlMildAPJ').attr('onclick', "conOpLink('APJ', 'Mild', '')").attr('class', "clickableCard").html('RM ' + formatCurrency(totalApjMild));
    }else{
        $('#ttlMildAPJ').html('RM ' + formatCurrency(totalApjMild));
    }

    //Good
    ttlGoodAPJ = (dataAPJ && dataAPJ.yearDate && dataAPJ.yearDate.Good);
    if (isNaN(ttlGoodAPJ)) ttlGoodAPJ = 0;
    totalApjGood = 'default' ? ttlGoodAPJ : 0;

    if(totalApjGood > 0){
        $('#ttlGoodAPJ').attr('onclick', "conOpLink('APJ', 'Good', '')").attr('class', "clickableCard").html('RM ' + formatCurrency(totalApjGood));
    }else{
        $('#ttlGoodAPJ').html('RM ' + formatCurrency(totalApjGood));
    }

    totalNODApj = (apjTtl != "") ? apjTtl : 0;

    if(totalNODApj > 0){
        $('#ttlAPJ').attr('onclick', "conOpLink('totalApj', '', '')").attr('class', "clickableCard").html(totalNODApj);
    }else{
        $('#ttlAPJ').html(totalNODApj);
    }

    //total nod
    ttlNodAPJ = dataAPJ && dataAPJ.quantityStatus && dataAPJ.quantityStatus.total;
    totalAPJ = ttlNodAPJ ? ttlNodAPJ : 0;
    
    if(totalAPJ > 0){
        $('#ttlAPJitem').attr('onclick', "conOpLink('APJ', '', '')").attr('class', "clickableCard").html(totalAPJ);
    }else{
        $('#ttlAPJitem').html(totalAPJ);
    }

    ttlAmtAPJ = ttlCritAPJ + ttlSerAPJ + ttlBadAPJ + ttlMildAPJ + ttlGoodAPJ;
    totalAmtAPJ = ttlAmtAPJ ? ttlAmtAPJ : 0;

    if(totalAmtAPJ > 0){
        $('#ttlAmtAPJ').attr('onclick', "conOpLink('APJ', '', '')").attr('class', "clickableCard").html('RM ' + formatCurrency(totalAmtAPJ));
    }else{
        $('#ttlAmtAPJ').html('RM ' + formatCurrency(totalAmtAPJ));
    }

}

function drawQuantityStatus(data, monthYear){

    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
              var tempArr = {name: idx, color:qualityStatusColor[idx], y: (ele) ? ele : 0,};
              dataArr.push(tempArr);
        } 
    }

    var i;

    var chart = Highcharts.chart('pieQuantityStatusKPJ', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
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
                                    text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">'+fullNameAPJKPJ+' Dashboard<br>'+localStorage.p_name+'<br>KPJ ('+monthYear+')</span>'
                                }
                            })
                
                            chart.updateFlag = true;
                        }
                        else if (chart.updateFlag) {
                            chart.updateFlag = false;
                
                            chart.update({
                                title: {
                                    text: '<span class="showLabel">'+fullNameAPJKPJ+' Dashboard<br>'+localStorage.p_name+'<br>KPJ ('+monthYear+')</span>'
                                }
                            })
                            chart.updateFlag = true;
                        }
                    }
                }
            }
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">'+fullNameAPJKPJ+' Dashboard<br>'+localStorage.p_name+'<br>KPJ ('+monthYear+')</span>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                showInLegend: true,
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        return '<span class="">'+this.key+': '+this.y+'</span>';
                      },
                    fontSize: 14,
                    distance: '10'
                },
                size: '65%'				
            }
        },
        legend: {
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical',
            itemStyle: {
                fontSize: 15
            }
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
            data: dataArr,
            events: {
              click: function (event) {
                var cardName;
                var priority;
                var searchfilter = getFilterDashboardAsset();
                  linkWinTitle = 'KPJ Quantity based on Priority'
                  linkName = 'dash_asset_nod_kpj_card'
                  if(event.point.name == 'Critical'){
                    priority= '1';
                    cardName = 'Critical';
                  }else if(event.point.name == 'Serious'){
                    priority = '2';
                    cardName = 'Serious';
                  }else if(event.point.name == 'Bad'){
                    priority = '3';
                    cardName = 'Bad';
                  }else if(event.point.name == 'Mild'){
                    priority = '4';
                    cardName = 'Mild';
                  }else if(event.point.name == 'Good'){
                    priority = '5';
                    cardName = 'Good';
                  }
                  linkParamArr = processFilterParamArr([priority, '', searchfilter.dateFrom, searchfilter.dateTo])
                  window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ cardName);
              }
            }
        }],
        credits: false
    });
    chart.updateFlag = true;
}

function drawQuantityStatusAPJ(data, monthYear){

    var dataArr = [];
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
              var tempArr = {name: idx, color:qualityStatusColor[idx], y: (ele) ? ele : 0,};
              dataArr.push(tempArr);
        } 
    }

    var chart = Highcharts.chart('pieQuantityStatusAPJ', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
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
                                    text: '<span class="showLabel" style="display: flex; font-size: 15px; text-align: center">'+fullNameAPJKPJ+' Dashboard<br>'+localStorage.p_name+'<br>APJ ('+monthYear+')</span>'
                                }
                            })
                
                            chart.updateFlag = true;
                        }
                        else if (chart.updateFlag) {
                            chart.updateFlag = false;
                
                            chart.update({
                                title: {
                                    text: '<span class="showLabel">'+fullNameAPJKPJ+' Dashboard<br>'+localStorage.p_name+'<br>APJ ('+monthYear+')</span>'
                                }
                            })
                            chart.updateFlag = true;
                        }
                    }
                }
            }
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        title: {
            useHTML: true,
            enabled: true,
            text: '<span class="showLabel">'+fullNameAPJKPJ+' Dashboard<br>'+localStorage.p_name+'<br>APJ ('+monthYear+')</span>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                showInLegend: true,
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        return '<span class="">'+this.key+': '+this.y+'</span>';
                      },
                    fontSize: 14,
                    distance: '5'
                },
                size: '65%'						
            }
        },
        legend: {
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical',
            itemStyle: {
                fontSize: 15
            }
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
            data: dataArr,
            events: {
                click: function (event) {
                  var cardName;
                  var priority;
                  var searchfilter = getFilterDashboardAsset();
                    linkWinTitle = 'APJ Quantity based on Priority'
                    linkName = 'dash_asset_nod_apj_card'
                    if(event.point.name == 'Critical'){
                        priority= '1';
                        cardName = 'Critical';
                    }else if(event.point.name == 'Serious'){
                        priority = '2';
                        cardName = 'Serious';
                    }else if(event.point.name == 'Bad'){
                        priority = '3';
                        cardName = 'Bad';
                    }else if(event.point.name == 'Mild'){
                        priority = '4';
                        cardName = 'Mild';
                    }else if(event.point.name == 'Good'){
                        priority = '5';
                        cardName = 'Good';
                    }
                    linkParamArr = processFilterParamArr([priority, '', searchfilter.dateFrom, searchfilter.dateTo])
                    window.parent.widgetConopOpen('', linkName, linkParamArr, linkWinTitle +' - '+ cardName);
                }
              }
        }],
        credits: false
    });
    chart.updateFlag = true
}

function updateTableStatus(dataKPJ, dataAPJ){

    let tbHTML = '';
    let tbHTMLAPJ = '';

    if (dataKPJ) {
        dataKPJ.forEach(function(ele,idx){
              tbHTML += `<tr class="border" onclick="conOpLink('KPJPriority', '`+ele.keutamaan+`', '`+ele.id+`')">`
              tbHTML += '<td class="border">'+((ele.nama_laluan) ? ele.nama_laluan : '')+'</td>'
              tbHTML += '<td class="border">'+((ele.no_laluan) ? ele.no_laluan : '')+'</td>'
              tbHTML += '<td class="border">'+((ele.seksyen_dari) ? ele.seksyen_dari : '')+'</td>'
              tbHTML += '<td class="border">'+((ele.seksyen_ke) ? ele.seksyen_ke : '')+'</td>'
              tbHTML += '<td class="border">'+((ele.panjang) ? ele.panjang : '')+'</td>'
              tbHTML += '<td class="border">'+((ele.lokasi_kerja) ? ele.lokasi_kerja : '')+'</td>'
              tbHTML += '<td class="border">'+((ele.kos_anggaran) ? formatCurrency(ele.kos_anggaran) : '0')+'</td>'
              tbHTML += '</tr>';
        })
        $("#statusTableKPJ").html(tbHTML);  
    }

    if (dataAPJ) {
        dataAPJ.forEach(function(ele,idx){

              tbHTMLAPJ += `<tr class="border" onclick="conOpLink('APJPriority', '`+ele.keutamaan+`', '`+ele.id+`')">`
              tbHTMLAPJ += '<td class="border">'+((ele.nama_laluan) ? ele.nama_laluan : '')+'</td>'
              tbHTMLAPJ += '<td class="border">'+((ele.no_laluan) ? ele.no_laluan : '')+'</td>'
              tbHTMLAPJ += '<td class="border">'+((ele.seksyen_dari) ? ele.seksyen_dari : '')+'</td>'
              tbHTMLAPJ += '<td class="border">'+((ele.seksyen_ke) ? ele.seksyen_ke : '')+'</td>'
              tbHTMLAPJ += '<td class="border">'+((ele.panjang) ? ele.panjang : '')+'</td>'
              tbHTMLAPJ += '<td class="border">'+((ele.lokasi_kerja) ? ele.lokasi_kerja : '')+'</td>'
              tbHTMLAPJ += '<td class="border">'+((ele.kos_anggaran) ? formatCurrency(ele.kos_anggaran) : '0')+'</td>'
              tbHTMLAPJ += '</tr>';
        })
        $("#statusTableAPJ").html(tbHTMLAPJ);  
    }

}   

function refreshInformation(packId = 'overall', year = 'all', month = 'all', status = 'default', wpcName = 'all'){
    var parentFilter = "";
	var dataYearMonth = "";

	if(localStorage.isParent == 'isParent'){
		parentFilter = "Division:" +wpcName+ " - ";
		dataYearMonth = parentFilter+"Month:" +month+ " - " + "Year:" +year;
	}else{
		dataYearMonth = "Month:" +month+ " - " + "Year:" +year;
	}
    var data = (nodData && nodData.nod && nodData.nod[packId] && nodData.nod[packId][year] && nodData.nod[packId][year][month]) ? nodData.nod[packId][year][month] : [];
    var dataAPJ = (nodData && nodData.nodAPJ && nodData.nodAPJ[packId] && nodData.nodAPJ[packId][year] && nodData.nodAPJ[packId][year][month]) ? nodData.nodAPJ[packId][year][month] : [];
    var dataTtlAPJ = (nodData && nodData.nodTtlAPJ && nodData.nodTtlAPJ[packId] && nodData.nodTtlAPJ[packId][year] && nodData.nodTtlAPJ[packId][year][month]) ? nodData.nodTtlAPJ[packId][year][month] : [];
    var dataTtlKPJ = (nodData && nodData.nodTtlKPJ && nodData.nodTtlKPJ[packId] && nodData.nodTtlKPJ[packId][year] && nodData.nodTtlKPJ[packId][year][month]) ? nodData.nodTtlKPJ[packId][year][month] : [];

    var dataYtD = (data && data.card) ? data.card : [];
    var dataYtDAPJ = (dataAPJ && dataAPJ.card) ? dataAPJ.card : [];

    var ttlAPJ = (dataTtlAPJ && dataTtlAPJ.card && dataTtlAPJ.card.total) ? dataTtlAPJ.card.total : [];
    var ttlKPJ = (dataTtlKPJ && dataTtlKPJ.card && dataTtlKPJ.card.total) ? dataTtlKPJ.card.total : [];

    updateCard(dataYtD, dataYtDAPJ, ttlAPJ, ttlKPJ);

    var chartQuantity = (data && data.chart && data.chart.quantityStatus) ? data.chart.quantityStatus : [];
    var chartQuantityAPJ = (dataAPJ && dataAPJ.chart && dataAPJ.chart.quantityStatus) ? dataAPJ.chart.quantityStatus : [];
    drawQuantityStatus(chartQuantity, dataYearMonth)
    drawQuantityStatusAPJ(chartQuantityAPJ, dataYearMonth)

    var tableData = (data && data.table && data.table[status] && data.table[status].raw) ? data.table[status].raw : [];
    var tableDataAPJ = (dataAPJ && dataAPJ.table && dataAPJ.table[status] && dataAPJ.table[status].raw) ? dataAPJ.table[status].raw : [];
    updateTableStatus(tableData, tableDataAPJ)
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
	var selStatus = $("#statusFilter").val();

  if(selStatus == "default"){
      $('#nodTableContainer').css('display', 'none')
      $('#nodPieChartContainerAPJ').css('display', 'block')
      $('#nodPieChartContainerKPJ').css('display', 'block')
      $('.hiddenContainer').show()
  }else{
      $('#nodPieChartContainerAPJ').css('display', 'none')
      $('#nodPieChartContainerKPJ').css('display', 'none')
      $('#nodTableContainer').css('display', 'block')
      $('.hiddenContainer').hide()
  }

  refreshInformation(selWPC, selYear, selMonth, selStatus);
}

function refreshFromv3 (filterArr){
	var wpc = filterArr.wpc;
	var year = filterArr.year;
	var month = filterArr.month;
    var assetApj = filterArr.assetAPJ;
    var wpcName = filterArr.wpcName;

    if(assetApj == "default"){
        $('#nodTableContainer').css('display', 'none')
        $('#nodPieChartContainerAPJ').css('display', 'block')
        $('#nodPieChartContainerKPJ').css('display', 'block')
        $('.hiddenContainer').show()
    }else{
        $('#nodPieChartContainerAPJ').css('display', 'none')
        $('#nodPieChartContainerKPJ').css('display', 'none')
        $('#nodTableContainer').css('display', 'block')
        $('.hiddenContainer').hide()
    }

	refreshInformation(wpc, year, month, assetApj, wpcName);
}

$(document).ready(function(){
	$.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "nod"
        },
        success: function (obj) {
        	if (obj.status && obj.status == 'ok') {
                nodData = obj.data;

                refreshInformation();

        	}
        }
    });

    var apjTable = $('#APJTable').height();
    var kpjTable = $('#KPJTable').height();

    if(apjTable !== 0){
        $('#APJContainer').css('height', `calc(${apjTable}px + 10px)`)
        $('#APJPie').css('height', `calc(100% - ${apjTable}px - 10px)`)
    }

    if(kpjTable !== 0){
        $('#KPJContainer').css('height', `calc(${kpjTable}px + 10px)`)
        $('#KPJPie').css('height', `calc(100% - ${kpjTable}px - 10px)`)
    }
})