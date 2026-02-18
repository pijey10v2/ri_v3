/*https://stackoverflow.com/questions/48719873/how-to-get-median-and-quartiles-percentiles-of-an-array-in-javascript-or-php*/
// sort array ascending
const asc = arr => arr.sort((a, b) => a - b);
// quantile calculation
const quantile = (arr, q) => {
    const sorted = asc(arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};
const q50 = arr => quantile(arr, .50).toFixed(2);
const q85 = arr => quantile(arr, .85).toFixed(2);
//////////////////////////////////////////////////////////////////////////

const populateFWdOptionHTML = (opt, id) => {
    if(('#'+id).length < 1) return;
    var html = '<option val=""></option>';
    opt.forEach(ele => {
        html += '<option val="'+ele+'">'+ele+'</option>';
    });
    $('#'+id).html(html);
}

const average = arr => (arr.reduce((a,b) => a + b, 0) / arr.length).toFixed(2);
const fwdCalculation = () => {
    var rawData = [];
    $('.calcTr:visible').each(function(idx, ele){
        var childTd = $(this).children();
        if(childTd.length != 0){
            childTd.each(function(idx2, ele2){
                if(!rawData[idx2]) rawData[idx2] = [];
                rawData[idx2].push(parseFloat($(ele2).text()));
            })
        }
    })
    var calculatedData = [];
    calculatedData['avg'] = [];
    calculatedData['q50'] = [];
    calculatedData['q85'] = [];
    // calculate the average 
    rawData.forEach(function(ele3, idx3){
        if(!calculatedData['avg'][idx3]) calculatedData['avg'][idx3] = [];
        calculatedData['avg'][idx3] = average(ele3);
        if(!calculatedData['q50'][idx3]) calculatedData['q50'][idx3] = [];
        calculatedData['q50'][idx3] = q50(ele3);
        if(!calculatedData['q85'][idx3]) calculatedData['q85'][idx3] = [];
        calculatedData['q85'][idx3] = q85(ele3);
    });
    return calculatedData;
}

const loadFwdCalculation = () =>{
    var calculatedData = fwdCalculation();
    var calcHTML = '<tr class="blank_row"></tr>';    
    for (const [idx, ele] of Object.entries(calculatedData)) {
        calcHTML += '<tr>';
        ele.forEach(function(ele2,idx2){
            if (idx2 == 0){
                switch (idx) {
                    case 'avg':
                        calcHTML += '<td><b>Average</b></td>';
                        break;
                    case 'q50':
                        calcHTML += '<td><b>50% tile</b></td>';
                        break;
                    case 'q85':
                        calcHTML += '<td><b>85% tile</b></td>';
                        break;
                }
                return;
            }
            calcHTML += '<td>'+ele2+'</td>';
        })
        calcHTML += '</tr>';
    }
    $("#fwdAvgCalcData").html(calcHTML);
} 

// fetch data based on date
function fetchData(e){
    $.ajax({
        url: 'fwdAnalysis.json.php',
        data: {func : 'fetchData', date : $(e).val()},
        type: 'POST',
        success: function (ret) {
            res = JSON.parse(ret);
            if(res.fwdDataHTML){ $('#fwdAnalysisData').html(res.fwdDataHTML) }
            if(res.dateTitleHTML){ $('.titleHeader').html(res.dateTitleHTML) }
            loadFwdCalculation();
        }
    });
}

function filterChg(){
    var chgFromOpt = $('#chgFromOpt').val(); 
    var chgToOpt = $('#chgToOpt').val(); 

    if (chgFromOpt != '' && chgToOpt != ''){
        // both has value
        $('.calcTr').hide();
        var maxChg = parseFloat(chgToOpt);
        var minChg = parseFloat(chgFromOpt);
        $('.calcTr').each(function(){
            var chgTr = parseFloat($(this).children(':first').text());
            if(chgTr >= minChg && chgTr <= maxChg) $(this).show();
        })
    }else if (chgFromOpt != '' && chgToOpt == ''){
        // only from has value
        $('.calcTr').hide();
        var minChg = parseFloat(chgFromOpt);
        $('.calcTr').each(function(){
            var chgTr = parseFloat($(this).children(':first').text());
            if(chgTr >= minChg) $(this).show();
        })
    }else if (chgFromOpt == '' && chgToOpt != ''){
        // only to has value
        $('.calcTr').hide();
        var maxChg = parseFloat(chgToOpt);
        $('.calcTr').each(function(){
            var chgTr = parseFloat($(this).children(':first').text());
            if(chgTr <= maxChg) $(this).show();
        })
    }else{
        $('.calcTr').show();
    }
    loadFwdCalculation();
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

if(localStorage.ui_pref == 'ri_v3'){
    if(window.parent.$(".fwdAnalysis#paveType:checked")){
        $.ajax({
            url: 'fwdAnalysis.json',
            data: {func : 'firstLoad'},
            type: 'POST',
            success: function (ret) {
                res = JSON.parse(ret);
                if(res.chgOpt){ populateChgOptions(res.chgOpt) }
                if(res.dateOpt){ populateFWdOptionHTML(res.dateOpt, 'dataDateOpt')}
                if(res.fwdDataHTML){$('#fwdAnalysisData').html(res.fwdDataHTML)}
                if(res.dateTitleHTML){ $('.titleHeader').html(res.dateTitleHTML) }
                loadFwdCalculation();
            }
        });
    }
}else{

    if(window.parent.$(".assetAnalysisTab#fwdAnalysis").hasClass("active")){
        $.ajax({
            url: 'fwdAnalysis.json',
            data: {func : 'firstLoad'},
            type: 'POST',
            success: function (ret) {
                res = JSON.parse(ret);
                if(res.chgOpt){ populateChgOptions(res.chgOpt) }
                if(res.dateOpt){ populateFWdOptionHTML(res.dateOpt, 'dataDateOpt')}
                if(res.fwdDataHTML){$('#fwdAnalysisData').html(res.fwdDataHTML)}
                if(res.dateTitleHTML){ $('.titleHeader').html(res.dateTitleHTML) }
                loadFwdCalculation();
            }
        });
    }
}


