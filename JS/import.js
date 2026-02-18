function optionValue (option_type){
    if(option_type == 'error'){
        $("#importNextButton").prop('disabled', true);
    }else{
        $("#importNextButton").prop('disabled', false);
    }
}

$(document).ready(function () {
    $("#importNextButton").on("click", function () {
        var selVal = $('#process_name').val();
        var landProcess = ['LS', 'LA', 'LI', 'LE', 'LAKMRun'];
        var extendedINCProcess = ['INCWitness', 'INCVictim'];
        if (landProcess.includes(selVal)) {
            var url = JOGETHOST+'jw/web/embed/userview/'+JOGET_CONSTRUCTAPP+'/land/_/bulkImport'+selVal+JOGETLINK.cons_form_bulk;
        } else if(extendedINCProcess.includes(selVal)){
            var url = JOGETHOST+'jw/web/embed/userview/'+JOGET_CONSTRUCTAPP+'/inc/_/bulkImport'+selVal+JOGETLINK.cons_form_bulk;
        } else {
            var url = JOGETHOST+'jw/web/embed/userview/'+JOGET_CONSTRUCTAPP+'/' +selVal.toLowerCase() +'/_/bulkImport'+selVal+JOGETLINK.cons_form_bulk;
        }
        $("#importProcess").css("display", "none");
        $("#ImportIframeDiv").css("display", "block");
        $("#importContentIframe").attr("src", url)
    })
    optionValue($('#process_name').val());
});

