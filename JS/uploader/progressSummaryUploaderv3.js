// handle the dahboard tab to load the table
// handle the button to populate the hidden 
// handle to button to upload

function populateSectionOption(){
    if(localStorage.page_pageOpen == "" || localStorage.page_pageOpen == undefined){
        if (!$("#progressUploadSectionOptionOutside")) return;
    }else{
        if (!$("#progressUploadSectionOptionInside")) return;
    }
    $.ajax({
        url: '../JS/uploader/progressUploadv3.php',  
        type: 'POST',
        dataType: 'JSON',
        data: {functionName : "sectionOption"},
        success:function(res){
            if (res.status && res.status == 'success') {
                var optHTML = '<option selected="true" disabled="disabled">- Choose Section -</option> ';
                for (const [idx, ele] of Object.entries(res.data)) {
                    optHTML += '<option value="'+ele+'">'+ele+'</option>';
                }
                if(localStorage.page_pageOpen == "" || localStorage.page_pageOpen == undefined){
                    $('#progressUploadSectionOptionOutside').html(optHTML);
                }else{
                    $('#progressUploadSectionOptionInside').html(optHTML);
                }
            }
        }
    });
}

function clearSummaryTable(){
    $("#excelTBodyOutside").html('');
    $("#excelTBodyInside").html('');
}

function loadProgressSummaryTableKKR(){
    $.ajax({
        url: '../JS/uploader/progressUploadv3.php',  
        type: 'POST',
        dataType: 'JSON',
        data: {functionName : "progressTableData"},
        success:function(data){
            if (data.data) {
                let progData = data.data;
                progData.forEach(function(ele,idx){
                    progHTML += '<div class="row summary fiveColumn">'
                    progHTML += '<div class="M textContainer">'+ele.pps_month_year.split(" ")[0]+'</div>'
                    progHTML += '<div class="M textContainer">'+parseFloat(ele.pps_financial_early).toFixed(2)+'</div>'
                    progHTML += '<div class="M textContainer">'+parseFloat(ele.pps_financial_late).toFixed(2)+'</div>'
                    progHTML += '<div class="M textContainer">'+parseFloat(ele.pps_physical_early).toFixed(2)+'</div>'
                    progHTML += '<div class="M textContainer">'+parseFloat(ele.pps_physical_late).toFixed(2)+'</div>'
                    progHTML += '</div>';
                })
            }
            if(localStorage.page_pageOpen == "" || localStorage.page_pageOpen == undefined){
                $("#excelTBodyOutside").html(progHTML);
            }else{
                $("#excelTBodyInside").html(progHTML);
            }
        }
    });
}

function loadProgressSummaryTableOBYU (section = '', plannedVal = '',  plannedFinVal = '', selWPC = false){
    $.ajax({
        url: '../JS/uploader/progressUploadv3.php',
        type: 'POST',
        dataType: 'JSON',
        data: {
            functionName : "progressTableData",
            section : section,
            selWPC : selWPC
        },
        success:function(data){
            let progHTML = '';
            if (data.data) {
                let progData = data.data;
                progData.forEach(function(ele,idx){
                    if(parseFloat(ele.pps_physical_early).toFixed(2) == parseFloat(plannedVal).toFixed(2) || parseFloat(ele.pps_financial_late_cm).toFixed(2) == parseFloat(plannedFinVal).toFixed(2)){
                        progHTML += '<div style="background-color: #ffff99;" class="row summary fiveColumn">'
                    }else{
                        progHTML += '<div class="row summary fiveColumn">'
                    }
                    progHTML += '<div class="M textContainer">'+ele.pps_month_year.split(" ")[0]+'</div>'
                    progHTML += '<div class="M textContainer">'+parseFloat(ele.pps_financial_early_cm).toFixed(2)+'</div>'

                    if(parseFloat(ele.pps_financial_late_cm).toFixed(2) == parseFloat(plannedFinVal).toFixed(2)){
                        progHTML += '<div id="zoomIntoPlannedVal" class="M textContainer" style="background-color: #ffff99;">'+parseFloat(ele.pps_financial_late_cm).toFixed(2)+'</div>'
                    }else{
                        progHTML += '<div id="zoomIntoPlannedVal" class="M textContainer">'+parseFloat(ele.pps_financial_late_cm).toFixed(2)+'</div>'
                    }

                    if(parseFloat(ele.pps_physical_early).toFixed(2) == parseFloat(plannedVal).toFixed(2)){
                        progHTML += '<div id="zoomIntoPlannedVal" class="M textContainer" style="background-color: #ffff99;">'+parseFloat(ele.pps_physical_early).toFixed(2)+'</div>'
                    }else{
                        progHTML += '<div id="zoomIntoPlannedVal" class="M textContainer">'+parseFloat(ele.pps_physical_early).toFixed(2)+'</div>'
                    }
                    progHTML += '<div class="M textContainer">'+parseFloat(ele.pps_physical_late).toFixed(2)+'</div>'
                    progHTML += '</div>';
                })
            }

            if(localStorage.page_pageOpen == "" || localStorage.page_pageOpen == undefined){
				$("#excelTBodyOutside").html(progHTML);
			}else{
				$("#excelTBodyInside").html(progHTML);
			}

            $( document ).ready(function() {
                if(plannedVal !='' || plannedFinVal != ''){
                    if (document.getElementById('zoomIntoPlannedVal')) document.getElementById('zoomIntoPlannedVal').scrollIntoView(); 
                }
            });
        }
    });
}