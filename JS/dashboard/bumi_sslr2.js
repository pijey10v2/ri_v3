var bumiInfo;

function conOpLink(category=''){
	var searchfilter = getSearchFilterSabah();
	var cardname = '';
	var catgFilter = searchfilter.category;

	if(category == 'Consortium'){
		if(catgFilter == 'all'){
			category = '';
			cardname = 'Consortium';
		}else{
			if(category == 'Consortium'){
				cardname = category;
			}else{
				cardname = category;
			}
			category = catgFilter;
		}
	}else{
		if(catgFilter == 'all'){
			category = category;
			cardname = category;
		}else{
			cardname = category;
			category = catgFilter;
		}
	}
	
	var linkParamArr = processFilterParamArr([category])
    window.parent.widgetConopOpen('Bumiputera', 'dash_cons_BP_card', linkParamArr, "Bumiputera - " + cardname);
}

function updateBumiCard(con, dom){

    var bumiConsortiumCard = `<span class="clickableCard" onclick="conOpLink('Consortium')">`+con+`</span>`;
    var bumiDomesticCard = `<span class="clickableCard" onclick="conOpLink('Domestic')">`+dom+`</span>`;

	$('#bumiConsortiumCard').html(bumiConsortiumCard);
	$('#bumiDomesticCard').html(bumiDomesticCard);
}

function populateBPPTable(tabInfo){
	var bumiHTML = "";
	if (tabInfo) {
        tabInfo.forEach(function(ele,idx){
            bumiHTML += '<tr onclick=openRecordList(\'' + ele.id + '\')>'
            bumiHTML += '<td>'+((ele.wpc) ? ele.wpc : '')+'</td>'
            bumiHTML += '<td>'+((ele.category) ? ele.category : '')+'</td>'
            bumiHTML += '<td>'+((ele.consortium) ? ele.consortium : '')+'</td>'
            bumiHTML += '<td style="background-color:'+ele.color+';border: thin solid;"></td>'
            bumiHTML += '<td>'+((ele.scope_of_work) ? ele.scope_of_work : '-')+'</td>'
            bumiHTML += '<td>'+((ele.contract_value) ? ele.contract_value : '-')+'</td>'
            bumiHTML += '<td>'+((ele.type) ? ele.type : '-')+'</td>'
            bumiHTML += '</tr>';
        })
	}
	$("#bumiTBody").html(bumiHTML);
}

function openRecordList(recordId) {
	var linkParamArr = processFilterParamArr(['', recordId]);
	if (localStorage.ui_pref == "ri_v3") {
	  window.parent.widgetConopOpen('Bumiputera', "dash_cons_BP_card", linkParamArr, 'Bumiputera');
	}
  }  

function refreshInformation(packId = 'overall', cat = 'overall'){
	if (!bumiInfo) return;

	if(cat == 'all') cat = 'overall';

	var cardInfo = (bumiInfo[packId] && bumiInfo[packId][cat] && bumiInfo[packId][cat]['cnt']) ? bumiInfo[packId][cat]['cnt'] : []; 
	var con = (cardInfo.consortium) ? cardInfo.consortium : 0;
	var dom = (cardInfo.domestic) ? cardInfo.domestic : 0;
	var des = (cardInfo.designated) ? cardInfo.designated : 0;
	var nom = (cardInfo.nominated) ? cardInfo.nominated : 0;
	updateBumiCard(con, dom);

	var tabInfo = (bumiInfo[packId] && bumiInfo[packId][cat] && bumiInfo[packId][cat]['raw']) ? bumiInfo[packId][cat]['raw'] : []; 
	populateBPPTable(tabInfo);
}

function refreshDashboard(){
	var packId = $("#wpcFilter").val();
	var cat = $("#categoryFilter").val();
	refreshInformation(packId, cat);
}

function refreshFromv3 (filterArr){
	var wpc = filterArr.wpc;
    var category = filterArr.category;

    refreshInformation(wpc, category);
}

$(document).ready(function(){
	$('.filterBtn').click(function(){
		if ($(this).hasClass('activeBtn')) {
			$('.filterBtn').removeClass('activeBtn');
		}else{
			$('.filterBtn').removeClass('activeBtn');
			$(this).addClass('activeBtn');
		}
		refreshDashboard();
	})
	$.ajax({
        type: "POST",
        url: 'chartData.json.php',
        dataType: 'json',
        data: {
            page: "bumi"
        },
        success: function (obj) {
        	if (obj.status && obj.status == 'ok') {
        		bumiInfo = obj.data;
        		refreshInformation();
        	}
        }
    });
})