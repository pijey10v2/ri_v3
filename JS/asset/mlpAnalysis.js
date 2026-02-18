function populateOptionHTML(opt, id){
    if(('#'+id).length < 1) return;
    var html = '<option val=""></option>';
    opt.forEach(ele => {
        html += '<option val="'+ele+'">'+ele+'</option>';
    });
    $('#'+id).html(html);
}

// fetch data based on date
function fetchData(e){
    $.ajax({
        url: 'mlpAnalysis.json.php',
        data: {func : 'fetchData', date : $(e).val()},
        type: 'POST',
        success: function (ret) {
            res = JSON.parse(ret);
            // titleHeader
            if(res.mlpDataHTML){ $('#mplAnalysisData').html(res.mlpDataHTML) }
            if(res.dateTitle){ $('#titleHeader').html('Date : ' + res.dateTitle) }
        }
    });
}

function filterChainage(e){
    var val = $(e).val().replace(/ /g,'');
    if(val == ''){
        $('.chainageSearch').show();
    }else{
        $('.chainageSearch').hide();
        $('.chainageSearch').each(function(idx, ele){
            var data = $(this).data('search').replace(/ /g,'');
            if(data == val) $(this).show();
        })
    }
}

function populateChgOptions(data) {
    var optHTML = '<option value="" selected></option>';
    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            optHTML += '<option value="' + ele + '">' + ele + '</option>';
        }
    }
    $('.chgOptions').html(optHTML);
}

function filterChg(){
    var chgFromOpt = $('#chgFromOpt').val(); 
    var chgToOpt = $('#chgToOpt').val(); 

    if (chgFromOpt != '' && chgToOpt != ''){
        // both has value
        $('.chainageSearch').hide();
        var maxChg = parseFloat(chgToOpt);
        var minChg = parseFloat(chgFromOpt);
        $('.chainageSearch').each(function(){
            var chgTrMax = parseFloat($(this).data('max'));
            var chgTrMin = parseFloat($(this).data('min'));
            if(chgTrMin >= minChg && chgTrMax <= maxChg) $(this).show();
        })
    }else if (chgFromOpt != '' && chgToOpt == ''){
        // only from has value
        $('.chainageSearch').hide();
        var minChg = parseFloat(chgFromOpt);
        $('.chainageSearch').each(function(){
            var chgTrMin = parseFloat($(this).data('min'));
            if(chgTrMin >= minChg) $(this).show();
        })
    }else if (chgFromOpt == '' && chgToOpt != ''){
        // only to has value
        $('.chainageSearch').hide();
        var maxChg = parseFloat(chgToOpt);
        $('.chainageSearch').each(function(){
            var chgTrMax = parseFloat($(this).data('max'));
            if(chgTrMax <= maxChg) $(this).show();
        })
    }else{
        $('.chainageSearch').show();
    }
}

if(localStorage.ui_pref == 'ri_v3'){
    if(window.parent.$(".mlpAnalysis#paveType:checked")){
        // load the latest data
    $.ajax({
        url: 'mlpAnalysis.json.php',
        data: {func : 'firstLoad'},
        type: 'POST',
        success: function (ret) {
            res = JSON.parse(ret);
            if(res.chgOpt){ populateChgOptions(res.chgOpt) }
            if(res.dateOpt){ populateOptionHTML(res.dateOpt, 'dataDateOpt') }
            $('select[id=dataDateOpt] option:eq(1)').attr('selected', 'selected');
            if(res.mlpDataHTML){ $('#mplAnalysisData').html(res.mlpDataHTML) }
            if(res.dateTitle){ $('#titleHeader').html('Date : ' + res.dateTitle) }
        }
    });

    $("#legendGood").keyup(function(){
        $("#legendFairMin").val($(this).val());
    });

    $("#legendFair").keyup(function(){
        $("#legendPoorMin").val($(this).val());
    });

    $("#legendPoor").keyup(function(){
        $("#legendBad").val($(this).val());
    });
    }
}else{

    if(window.parent.$(".assetAnalysisTab#mlpAnalysis").hasClass("active")){
        // load the latest data
    $.ajax({
        url: 'mlpAnalysis.json.php',
        data: {func : 'firstLoad'},
        type: 'POST',
        success: function (ret) {
            res = JSON.parse(ret);
            if(res.chgOpt){ populateChgOptions(res.chgOpt) }
            if(res.dateOpt){ populateOptionHTML(res.dateOpt, 'dataDateOpt') }
            $('select[id=dataDateOpt] option:eq(1)').attr('selected', 'selected');
            if(res.mlpDataHTML){ $('#mplAnalysisData').html(res.mlpDataHTML) }
            if(res.dateTitle){ $('#titleHeader').html('Date : ' + res.dateTitle) }
        }
    });

    $("#legendGood").keyup(function(){
        $("#legendFairMin").val($(this).val());
    });

    $("#legendFair").keyup(function(){
        $("#legendPoorMin").val($(this).val());
    });

    $("#legendPoor").keyup(function(){
        $("#legendBad").val($(this).val());
    });
    }
}