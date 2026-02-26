var userProjectArr = [];
var userProjectGroupArr = [];
var newuserlist = [];
var click_user_details;
var rowclicked;
var click_project_details;
var flagEdit = false;
var flagUserEdit = false;
var ownerOrgName;
var contractorSelectizeOrg;
var consultantSelectizeOrg = [];
var contractorSelect;
var consultantSelect;

const colors = ['#00DFCF', '#8FDAAE', '#C6E18F', '#F3E98E', '#FFDC6B', '#FFB265', '#FF7D61', '#D63C68', '#BC1052', '#7E2571', '#565697', '#6DB9D7']
const gradients = ['#00BAAD', '#57C785', '#ADD45C', '#EDDD53', '#FFC300', '#FF8D1A', '#FF5733', '#C70039', '#900C3F', '#511849', '#3D3D6B', '#2A7B9B'] 

//getListofPackages();
refreshProjectTableBody();
refreshUserTableBody();
refreshDeleteUserTableBody();
refreshDeleteProjectTableBody();

// Search
function searching (inpt){
    var filter = inpt.value.toUpperCase();

    //hide everything first
    $('.searchv3').hide();
    $('.searchv3').each(function(){
        var listText = $(this).text()
        if (listText.toUpperCase().indexOf(filter) > -1) {
            $(this).show(); //show the row based on input from user equal with all details
        }
    })
}

function deleteToken(el) {
    const isActive = Number(el.dataset.is_active);


    if (isActive) {
        alert("Cannot delete an active token.");
        return;
    }

    if (confirm("Are you sure you want to delete this token?")) {

        const formData = new URLSearchParams();
        const token = el.value;
        const tokenId = el.dataset.token_id;
        const tokenType = el.dataset.token_type;

        formData.append('token', token);
        formData.append('token_type', tokenType);
        formData.append('op', 'delete');

        fetch('BackEnd/cesiumTokenMgmt.php', {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            return response.json();
        })
        .then((data) => {
            $('#token-row-' + tokenId + '-' + tokenType).remove();

            alert(data.message);
        })
        .catch((error) => {
            alert("Failed to delete token. Please try again.");

            console.log("Error:", error);
        });
    }
}

function updateToken(el) {
    if (confirm("Are you sure you want to set this token as active?")) {
        const tokenId = el.dataset.token_id;
        const token = el.value;
        const tokenType = el.dataset.token_type;

        const formData = new URLSearchParams();

        formData.append('token', token);
        formData.append('token_type', tokenType);
        formData.append('op', 'updateToken');

        fetch('BackEnd/cesiumTokenMgmt.php', {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
        }).then((response) => response.json())
        .then((data) => {
            if (data.success) {
                el.dataset.is_active = "1";

                const btnDelete = document.getElementById('delTokenBtn-' + tokenId);
                const prevBtnDelete = document.querySelector(`button[data-is_active='1'][data-token_type='${tokenType}']`);

                btnDelete.dataset.is_active = "1";
                prevBtnDelete.dataset.is_active = "0";

                alert(data.message);
            } else {
                alert("Failed to update token. Please try again.");
            }
        }).catch((error) => {
            alert("Error updating token.");
        });
    } else {    
        const prevActive = document.querySelector(`input[name='${el.name}'][checked]`);

        el.checked = !el.checked;
        prevActive.checked = true;
    }
}

function resetTokenMgmtForm() {
    $('#tokenType').val('mapbox'); // select element
    $('#tokenInput').val(''); // text area
    $('input[name="useToken"][value="no"]').prop('checked', true); // radio button
}

$(document).ready (function (){    
    //refreshUserTableBody()
    $('input[name="project_type"]').change(refreshUserTableBody)
});

$(function () {
    /////     Navigation bar click item     //////
    //noti message button

    $("#hideTokenFormBtn, #showTokenFormBtn").click(function(){
        resetTokenMgmtForm();
        
        const showId = this.id === 'hideTokenFormBtn' ? 'token-mgmt-table' : 'token-mgmt-form';

        $("#showTokenFormBtn").css("display", this.id === 'showTokenFormBtn' ? "none" : "block");

        $("#token-mgmt-table, #token-mgmt-form").css("display", "none");
        $("#" + showId).css("display", "block");
    });

    $("#createTokenBtn").click(function(){
        const formData = new URLSearchParams();
        const tokenType = $('#tokenType').val();

        formData.append('token_type', tokenType);
        formData.append('token', $('#tokenInput').val());
        formData.append('isActive', $('input[name="useToken"]:checked').val() === 'yes' ? 1 : 0);
        formData.append('op', 'save');

        fetch('BackEnd/cesiumTokenMgmt.php', {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            return response.json();
        })
        .then((data) => {
            alert(data.message);

            if (!data.success) {
                resetTokenMgmtForm();
                return;
            }

            const formData = new URLSearchParams();

            formData.append('op', 'getFirstRow');
            formData.append('token_type', tokenType);

            const payload = {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData.toString()
            };

            fetch('BackEnd/cesiumTokenMgmt.php', payload)
                .then((response) => response.text())
                .then((data) => {
                    const tblId = $('#tokenType').val() === 'mapbox' ? '#mapBoxTbl' : '#mapTilerTbl';

                    $(tblId).children().first().after(data);
                    $('#hideTokenFormBtn').click();
                });
        })
        .catch((error) => {
            alert("Failed to add token. Please try again.");

            console.log("Error:", error);
        });
    });

    $('#notiMessage').hover(function(){
        if(!$(this).hasClass('active')){
            $(this).addClass('active')
            notiShow(this)
        }else{

        }
    })

    $('#notiMessage').mouseleave(function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active')
            $('.notiContainer').css({
                'display' : 'none',
                'left' : '0',
                'top' : '0'
            })
        }else{
        }
    })

    //disable dev tool
	var prodFlag = localStorage.inspectFlag;

    if(prodFlag == 'true'){
        document.addEventListener("contextmenu", function(event) {
            event.preventDefault();
        });
    
        document.addEventListener("keydown", function(event) {
            if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I") || (event.ctrlKey && event.shiftKey && event.key === "C") || (event.ctrlKey && event.shiftKey && event.key === "J")) {
                event.preventDefault();
            }
        });
    }

    hideLoader()
})

notiShow = (event) =>{
    var notiContainer;
    var notiPointer;
    var x;
    var y;

    notiContainer = $('.notiContainer');
    notiPointer = $('.notiContainer::before');


    var position = $(event).position()

    x = position.left + 25
    y = position.top - 15

    notiContainer.css('left', x + 'px')
    notiContainer.css('top', y + 'px')
    notiContainer.fadeIn(200)
}

//function to open wizard in V3.js
openWizardV3 = (ele, event) =>{

    if($(event.target).is(".columnSmall") || $(event.target).is("input")){
        event.stopPropagation();
        return;
    }

    window.parent.wizardOpenPage(ele)
}

//function to show loader in V3.js
showLoader = () =>{
    window.parent.showLoaderHandler()
}

//function to hide loader in V3.js
hideLoader = () =>{
    window.parent.hideLoaderHandler()
}

closeAllMain = (ele = '') =>{
    $("#dashboard-system-admin").css("display", "none");
    $("#main-active-user").css("display", "none");
    $("#main-inactive-user").css("display", "none");
    $("#main-active-project").css("display", "none");
    $("#main-archived-project").css("display", "none");

    clearAllMain();
    if(ele !== ''){
        window.parent.leftMenuButtonHightlight(ele)
    }
}

clearAllMain = () =>{
    var eleChecked = $(`input[type='checkbox']`);
    let totalChecked = $(`input[type='checkbox']`).length;

    for (var i = 0; i < totalChecked; i++) {
        if (eleChecked[i].type == "checkbox") {
            eleChecked[i].checked = false;
        }
    }

    $(`.searchTable .details-container`).removeClass("active");
    $(`.searchTable button.circle`).removeClass("active");
    $(`.searchTable .details-container .counter`).html("");
}

openDivSysAdmin = (ele) =>{
    let page = $(ele).attr('rel');
    $('.searchInput').val('')
    $('.searchInput').keydown();
    $('.searchInput').keypress();
    $('.searchInput').keyup();
    $('.searchInput').blur();

    if($(ele).hasClass("active")){
        $(ele).removeClass("active")
    }

    $("#"+page).css("display", "block");
}

onchangeButtonVisibility = (ele) =>{
    var currentPage = $(ele).data('page');
    var targetTable = $(ele).data('table');
    let eleChecked = $(`input.${targetTable}.${currentPage}[type='checkbox']`);
    let totalChecked = $(`input.${targetTable}.${currentPage}[type='checkbox']`).length;

    if(ele.checked){
        if($(ele).parent().parent().hasClass('tableHeader')){
            for (var i = 0; i < totalChecked; i++) {
                if (eleChecked[i].type == "checkbox") {
                    eleChecked[i].checked = true;
                }
            }

            if(targetTable == 'ptable'){
                $(`input[type='checkbox']:not(:checked).ptable-header.${currentPage}`).prop('checked', true);
            }

            $(`.searchTable .details-container.${currentPage} .counter`).html(totalChecked);
        }else{
            let countChecked = $(`input.${targetTable}[type='checkbox']:checked`).length;

            if(countChecked == totalChecked){
                $(`input[type='checkbox']:not(:checked).${targetTable}-header.${currentPage}`).prop('checked', true);
            }

            $(`.searchTable .details-container.${currentPage} .counter`).html(countChecked);
        }

        $(`.searchTable .${currentPage}`).addClass("active");
    }else{
        if($(ele).parent().parent().hasClass('tableHeader')){
            for (var i = 0; i < totalChecked; i++) {
                if (eleChecked[i].type == "checkbox") {
                    eleChecked[i].checked = false;
                }
            }

            if(targetTable == 'ptable'){
                $(`input[type='checkbox']:checked.ptable-header.${currentPage}`).prop('checked', false);
            }
        }

        let countChecked = $(`input.${targetTable}[type='checkbox']:checked`).length;

        if(countChecked != 0){
            $(`.searchTable .details-container.${currentPage} .counter`).html(countChecked)
        }else{
            $(`input[type='checkbox']:checked.${targetTable}-header.${currentPage}`).prop('checked', false);
            $(`.searchTable .${currentPage}`).removeClass("active")
        }
    }
}

onchangeButtonVisibilityProject = (ele) =>{
    var currentPage = $(ele).data('page');
    var targetTable = $(ele).data('table');
    let eleChecked = $(`input.${targetTable}.${currentPage}[type='checkbox']`);
    let totalChecked = $(`input.${targetTable}.${currentPage}[type='checkbox']`).length;

    if(ele.checked){
        if($(ele).parent().parent().hasClass('tableHeader')){
            for (var i = 0; i < totalChecked; i++) {
                if (eleChecked[i].type == "checkbox") {
                    eleChecked[i].checked = true;
                }
            }

            if(targetTable == 'ptable' || targetTable == 'deleteptable'){
                $(`input[type='checkbox']:not(:checked).${targetTable}-header.${currentPage}`).prop('checked', true);
            }

            $(`.searchTable .details-container.${currentPage} .counter`).html(totalChecked);
        }else{
            //check if parent project, tick package project too
            var parentIdVal = $(ele).data('parentprojectid');
            var projIdVal = $(ele).data('projectid')
            let ptypeId = $(ele).data('ptypetable');
            var ptypeIdTarget;

            if(parentIdVal !== undefined){
                if(ptypeId == 'activeProjectTable'){
                    ptypeIdTarget = 'activePackageTable'
                }else if(ptypeId == 'deleteProjectTableBody'){
                    ptypeIdTarget = 'deletePackageTableBody'
                }
                var rows = $(`#${ptypeIdTarget} div.row`)
                for (var i = 0; i < rows.length; i++) {
                    var td = $(rows[i]).find('input').data("parentprojectid")
                    if (td == projIdVal) {
                        //tick package related to project
                        let myid = $(rows[i]).find('input');
                        myid.prop("checked", true);
                        myid.attr("disabled", true);
                    }
                }
            }

            let totalptype = $(`#${ptypeId}`).find(`input.${targetTable}[type='checkbox']`).length; // get all length of specific parent or package records
            let countptypeChecked = $(`#${ptypeId}`).find(`input.${targetTable}[type='checkbox']:checked`).length; //get checked=true length of specific parent or package records
            let countTotalptypeChecked = $(`input.${targetTable}[type='checkbox']:checked`).length //get checked=true length of all parent and package records

            if(countptypeChecked == totalptype){
                $(`input[type='checkbox']:not(:checked).${targetTable}-header.${currentPage}.${ptypeId}`).prop('checked', true);
            }

            $(`.searchTable .details-container.${currentPage} .counter`).html(countTotalptypeChecked);
        }


        $(`.searchTable .${currentPage}.delete`).addClass("active");
    }else{
        //check if parent project, tick package project too
        var parentIdVal = $(ele).data('parentprojectid');
        var projIdVal = $(ele).data('projectid');
        let ptypeId = $(ele).data('ptypetable');
        var ptypeIdTarget;

        if(parentIdVal !== undefined){
            if(ptypeId == 'activeProjectTable'){
                ptypeIdTarget = 'activePackageTable'
            }else if(ptypeId == 'deleteProjectTableBody'){
                ptypeIdTarget = 'deletePackageTableBody'
            }
            var rows = $(`#${ptypeIdTarget} div.row`)
            for (var i = 0; i < rows.length; i++) {
                var td = $(rows[i]).find('input').data("parentprojectid")
                if (td == projIdVal) {
                    //tick package related to project
                    let myid = $(rows[i]).find('input');
                    myid.prop("checked", false);
                    myid.attr("disabled", false);
                }
            }
        }

        if($(ele).parent().parent().hasClass('tableHeader')){
            for (var i = 0; i < totalChecked; i++) {
                if (eleChecked[i].type == "checkbox") {
                    eleChecked[i].checked = false;
                    eleChecked[i].disabled = false;
                }
            }

            if(targetTable == 'ptable' || targetTable == 'deleteptable'){
                $(`input[type='checkbox']:checked.${targetTable}-header.${currentPage}`).prop('checked', false);
            }
        }

        let countChecked = $(`input.${targetTable}[type='checkbox']:checked`).length;
        let totalptype = $(`#${ptypeId}`).find(`input.${targetTable}[type='checkbox']`).length; // get all length of specific parent or package records
        let countptypeUnChecked = $(`#${ptypeId}`).find(`input.${targetTable}[type='checkbox']:not(:checked)`).length; //get checked=false length of specific parent or package records
        let countTotalptypeChecked = $(`input.${targetTable}[type='checkbox']:checked`).length //get checked=true length of all parent and package records

        if(countTotalptypeChecked != 0){
            if(totalptype == countptypeUnChecked){
                $(`input[type='checkbox']:checked.${targetTable}-header.${currentPage}.${ptypeId}`).prop('checked', false);
            }

            $(`.searchTable .details-container.${currentPage} .counter`).html(countChecked)
        }else{
            $(`input[type='checkbox']:checked.${targetTable}-header.${currentPage}`).prop('checked', false);
            $(`.searchTable .${currentPage}.delete`).removeClass("active")
        }
    }
}

onclickProjectFilter = (ele, event) =>{
    var myrow = $(ele).find('input');
    var parentIdVal = myrow.data('parentprojectid');
    var projectIdVal = myrow.data('projectid');
    var currentPage = myrow.data('page');
    var ptypeIdTarget;

    if(event.target.nodeName == "INPUT" || event.target.nodeName == "I"){
    }else{
        //parent project need to filter package project
        let ptypeId = myrow.data('ptypetable');
    
        if(ptypeId == 'activeProjectTable'){
            ptypeIdTarget = 'activePackageTable'
        }else if(ptypeId == 'deleteProjectTableBody'){
            ptypeIdTarget = 'deletePackageTableBody'
        }else if(ptypeId == 'activePackageTable'){
            ptypeIdTarget = 'activeProjectTable'
        }else if(ptypeId == 'deletePackageTableBody'){
            ptypeIdTarget = 'deleteProjectTableBody'
        }
    
        if(parentIdVal == undefined){
            var rows = $(`#${ptypeIdTarget} div.row`)
    
            for (var i = 0; i < rows.length; i++) {
                var td = $(rows[i]).find('input').data("parentprojectid")
                //show package related to parent project
                let myid = $(rows[i]);
                if (td == projectIdVal) {
                    myid.css("display", "flex")
                }else{
                    myid.css("display", "none")
                }
            }
        }else{
            var rows = $(`#${ptypeIdTarget} div.row`)
    
            for (var i = 0; i < rows.length; i++) {
                var td = $(rows[i]).find('input').data("projectid")
                //show package related to parent project
                let myid = $(rows[i]);
                if (td == parentIdVal) {
                    myid.css("display", "flex")
                }else{
                    myid.css("display", "none")
                }
            }
        }
    
        if(!$(`.searchTable .${currentPage}.show`).hasClass("active")){
            $(`.searchTable .${currentPage}.show`).addClass("active");
        }
    }
    
}

function addAppList() {
    var app_list = click_project_details.applist;
    if (app_list == null) return;

    var constructProcess = {
        "app_NOI": "Notice Of Improvement (NOI)",
        "app_NCR": "Non Conformance Report (NCR)",
        "app_WIR": "Work Inspection Request (WIR)",
        "app_DCR": "Design Change Request (DCR)",
        "app_RFI": "Request For Information (RFI)",
        "app_MOS": "Method Statement (MS)",
        "app_MS": "Material Acceptance (MT)",
        "app_IR": "Incident (INC)",
        "app_SDL": "Site Daily Log (SDL)",
        "app_SD": "Site Diary (SD)",
        "app_RS": "Report Submission (RS)",
        "app_SA": "Safety Activity (SA)",
        "app_SMH": "Total Man-Hour Works Without LTI (SMH)",
        "app_RR": "Risk Register (RR)",
        "app_LR": "Land Registration (LR)",
        "app_LI": "Land Issue (LI)",
        "app_LE": "Land Encumbrances (LE)",
        "app_LS": "Land Summary (LS)",
        "app_PBC": "Public Complaint (PBC)",
        "app_DA": "Approved Design Drawing (DA)",
        "app_PU": "Progress Update (PU)",
        "app_RSDL": "RET's Site Diary Log (RSDL)"
    }
    var financeProcess = {
        "app_CP": "Contract Particular (CP)",
        "app_IC": "Interim Claim (IC)",
        "app_VO": "Variation Order (VO)",
    };
    var documentProcess = {
        "app_DR": "Document Registration (DR)",
        "app_CORR": "Correspondence (CORR)"
    };

    // handle the app
    var constructApp = { val: '', process: {} };
    var financeApp = { val: '', process: {} };
    var documentApp = { val: '', process: {} };

    Object.keys(app_list).forEach(function (key) {
        if (key == 'constructPackage_name') constructApp.val = app_list[key];
        if (key == 'financePackage_name') financeApp.val = app_list[key];
        if (key == 'documentPackage_name') documentApp.val = app_list[key];
        // process info
        if (constructProcess.hasOwnProperty(key)) constructApp.process[key] = app_list[key];
        if (financeProcess.hasOwnProperty(key)) financeApp.process[key] = app_list[key];
        if (documentProcess.hasOwnProperty(key)) documentApp.process[key] = app_list[key];
    });

    // consturct app
    if (constructApp.val != null) {
        $('#appAssignContainerID').html("<div class='constructContainer' id='constructAssignContainer'></div>");
        $('#constructAssignContainer').html(" <h3>Construction Application</h3>")
        var app = constructApp.val.split("::");
        var text = app[1];

        $('#constructAssignContainer').append(
            "<div class='doubleinput'>\
                <div class='column1'>\
                    <label>Construct Package</label>\
                </div>\
                <div class='column2'>\
                    <input type ='text' appValue = '" + constructApp.val + "' readonly value ='" + text + "'class ='conAppList' name = 'constructPackage_name'>\
                </div>\
            </div>"
        );
        if (constructApp.process) {
            first = true;
            var conProcess = constructApp.process;
            Object.keys(conProcess).forEach(function (idx) {
                if (conProcess[idx] != null) {
                    let text = constructProcess[idx];
                    if (first) {
                        $('#constructAssignContainer').append(
                            "<div class='doubleinput'>\
                                <div class='column1'>\
                                    <label>Selected Process</label>\
                                </div>\
                                <div class='column2'>\
                                    <input type ='text' appValue = '" + conProcess[idx] + "' readonly value ='" + text + "'class ='conAppList' name = 'constructPackage_name'>\
                                </div>\
                            </div>"
                        );
                        first = false;
                    } else {
                        $('#constructAssignContainer').append(
                            "<div class='doubleinput'>\
                                <div class='column1'>\
                                </div>\
                                <div class='column2'>\
                                    <input type ='text' appValue = '" + conProcess[idx] + "' readonly value ='" + text + "'class ='conAppList' name = 'constructPackage_name'>\
                                </div>\
                            </div>"
                        );
                    }
                }
            })
        }
    }

    // finance app
    if (financeApp.val != null) {
        $('#appAssignContainerID').append(" <div class='financeContainer' id='fincnceAssignContainer'></div>");
        $('#fincnceAssignContainer').html(" <h3>Finance Application</h3>")
        var app = financeApp.val.split("::");
        var text = app[1];

        $('#fincnceAssignContainer').append(
            "<div class='doubleinput'>\
                <div class='column1'>\
                    <label>Finance Package</label>\
                </div>\
                <div class='column2'>\
                    <input type ='text' appValue = '" + financeApp.val + "' readonly value ='" + text + "'class ='conAppList' name = 'constructPackage_name'>\
                </div>\
            </div>"
        );
        if (financeApp.process) {
            first = true;
            var finProcess = financeApp.process;
            Object.keys(finProcess).forEach(function (idx) {
                if (finProcess[idx] != null) {
                    let text = financeProcess[idx];
                    if (first) {
                        $('#fincnceAssignContainer').append(
                            "<div class='doubleinput'>\
                                <div class='column1'>\
                                    <label>Selected Process</label>\
                                </div>\
                                <div class='column2'>\
                                    <input type ='text' appValue = '" + finProcess[idx] + "' readonly value ='" + text + "'class ='finAppList' name = 'financePackage_name'>\
                                </div>\
                            </div>"
                        );
                        first = false;
                    } else {
                        $('#fincnceAssignContainer').append(
                            "<div class='doubleinput'>\
                                <div class='column1'>\
                                </div>\
                                <div class='column2'>\
                                    <input type ='text' appValue = '" + finProcess[idx] + "' readonly value ='" + text + "'class ='finAppList' name = 'financePackage_name'>\
                                </div>\
                            </div>"
                        );
                    }
                }
            })
        }
    }

    // document app
    if (documentApp.val != null) {
        $('#appAssignContainerID').append(" <div class='docContainer' id='docAssignContainer'></div>");
        $('#docAssignContainer').html(" <h3>Document Application</h3>")
        var app = documentApp.val.split("::");
        var text = app[1];

        $('#docAssignContainer').append(
            "<div class='doubleinput'>\
                <div class='column1'>\
                    <label>Document Package</label>\
                </div>\
                <div class='column2'>\
                    <input type ='text' appValue = '" + documentApp.val + "' readonly value ='" + text + "'class ='docAppList' name = 'constructPackage_name'>\
                </div>\
            </div>"
        );
        if (documentApp.process) {
            first = true;
            var docProcess = documentApp.process;
            Object.keys(docProcess).forEach(function (idx) {
                if (docProcess[idx] != null) {
                    let text = documentProcess[idx];
                    if (first) {
                        $('#docAssignContainer').append(
                            "<div class='doubleinput'>\
                                <div class='column1'>\
                                    <label>Selected Process</label>\
                                </div>\
                                <div class='column2'>\
                                    <input type ='text' appValue = '" + docProcess[idx] + "' readonly value ='" + text + "'class ='docAppList' name = 'docPackage_name'>\
                                </div>\
                            </div>"
                        );
                        first = false;
                    } else {
                        $('#docAssignContainer').append(
                            "<div class='doubleinput'>\
                                <div class='column1'>\
                                </div>\
                                <div class='column2'>\
                                    <input type ='text' appValue = '" + docProcess[idx] + "' readonly value ='" + text + "'class ='docAppList' name = 'docPackage_name'>\
                                </div>\
                            </div>"
                        );
                    }
                }
            })
        }
    }
}

function readonlystate2() {
    $(".newuserPicture").fadeIn();
    $(".newuserContainerBody-edit").css("display", "none");
    $(".newuserContainerBody-edit.active").removeClass("active");
    $(".newuserContainerBody-readonly").css("display", "block");
    $(".newuserContainerBody-readonly").addClass("active");
    $(".newuserFooter .edit-page1").css("display", "none");
    $(".newuserFooter .edit-page2").css("display", "none");
    $(".newuserFooter .readonly").css("display", "block");
    $(".newuserContainerBody-readonly .viewonedit").css(
        "display",
        "inline-block"
    );
    $(".newuserContainerBody-readonly .container-table.viewonedit").css(
        "display",
        "block"
    );

    $(".systemadminformView .formContent").animate({
        width: "70%",
        margin: "5% auto",
    },
        250
    );
    $(".systemadminformView .formContent .formcontainerMainBody").animate({
        height: "65vh",
    },
        250,
        function () {
            $(".newuserPicture").fadeIn();
        }
    );
}
function readonlystateproject() {
    $(".newprojectContainerBody-readonly").css("display", "block");
    $(".newprojectContainerBody-editpage7").css("display", "none");
    $(".newprojectContainerBody-editpage6").css("display", "none");
    $(".newprojectContainerBody-editpage5").css("display", "none");
    $(".newprojectContainerBody-editpage4").css("display", "none");
    $(".newprojectContainerBody-editpage3").css("display", "none");
    $(".newprojectContainerBody-editpage2").css("display", "none");
    $(".newprojectContainerBody-editpage1").css("display", "none");
    $(".newprojectContainerBody-readonly").addClass("active");
    $(".newprojectContainerBody-editpage8").removeClass("active");
    $(".newprojectContainerBody-editpage7").removeClass("active");
    $(".newprojectContainerBody-editpage6").removeClass("active");
    $(".newprojectContainerBody-editpage5").removeClass("active");
    $(".newprojectContainerBody-editpage4").removeClass("active");
    $(".newprojectContainerBody-editpage3").removeClass("active");
    $(".newprojectContainerBody-editpage2").removeClass("active");
    $(".newprojectContainerBody-editpage1").removeClass("active");
    $(".newprojectFooter .edit-page2").css("display", "none");
    $(".newprojectFooter .edit-page1").css("display", "none");
    $(".newprojectFooter .edit-page3").css("display", "none");
    $(".newprojectFooter .edit-page4").css("display", "none");
    $(".newprojectFooter .edit-page5").css("display", "none");
    $(".newprojectFooter .edit-page6").css("display", "none");
    $(".newprojectFooter .edit-page7").css("display", "none");
    $(".newprojectFooter .edit-page8").css("display", "none");
    $(".newprojectFooter .readonly").css("display", "block");
    $(".hideoncreate").css("display", "flex");
    $(".pagenumber").css("display", "none");

    $(".newprojectContainerBody-readonly .container-table#userlistTable1").css(
        "display",
        "none"
    );
    $(".newprojectContainerBody-readonly .container-table#userlistTable2").css(
        "display",
        "block"
    );

    $(".systemadminformView .formContent").animate({
        width: "70%",
        margin: "2% auto",
    },
        250
    );
    $(".systemadminformView .formContent .formcontainerMainBody").animate({
        height: "75vh",
    },
        250
    );
}

function changebackgroundinitialcolor() {
    let $fname = $('#newfirstname').val()
    let initial = $fname.substring(0, 1)

    if (initial == 'A' || initial == 'a' || initial == 'J' || initial == 'j' || initial == 'S' || initial == 's') {
        $('.systemadminformView .formContent .newuserPicture').css('background', col_ajs)
        $('.systemadminformView .formContent .newuserPicture .newuserInitial').css('background', col_ajs)
    } else if (initial == 'B' || initial == 'b' || initial == 'K' || initial == 'k' || initial == 'T' || initial == 't') {
        $('.systemadminformView .formContent .newuserPicture').css('background', col_bkt)
        $('.systemadminformView .formContent .newuserPicture .newuserInitial').css('background', col_bkt)
    }
    else if (initial == 'C' || initial == 'c' || initial == 'L' || initial == 'l' || initial == 'U' || initial == 'u') {
        $('.systemadminformView .formContent .newuserPicture').css('background', col_clu)
        $('.systemadminformView .formContent .newuserPicture .newuserInitial').css('background', col_clu)
    }
    else if (initial == 'D' || initial == 'd' || initial == 'M' || initial == 'm' || initial == 'V' || initial == 'v') {
        $('.systemadminformView .formContent .newuserPicture').css('background', col_dmv)
        $('.systemadminformView .formContent .newuserPicture .newuserInitial').css('background', col_dmv)
    }
    else if (initial == 'E' || initial == 'e' || initial == 'N' || initial == 'n' || initial == 'W' || initial == 'w') {
        var col_enw = 'black'
        $('.systemadminformView .formContent .newuserPicture').css('background', col_enw)
        $('.systemadminformView .formContent .newuserPicture .newuserInitial').css('background', col_enw)
    }
    else if (initial == 'F' || initial == 'f' || initial == 'O' || initial == 'o' || initial == 'X' || initial == 'x') {
        $('.systemadminformView .formContent .newuserPicture').css('background', col_fox)
        $('.systemadminformView .formContent .newuserPicture .newuserInitial').css('background', col_fox)
    }
    else if (initial == 'G' || initial == 'g' || initial == 'P' || initial == 'p' || initial == 'Y' || initial == 'y') {
        $('.systemadminformView .formContent .newuserPicture').css('background', col_gpy)
        $('.systemadminformView .formContent .newuserPicture .newuserInitial').css('background', col_gpy)
    }
    else if (initial == 'H' || initial == 'h' || initial == 'Q' || initial == 'q' || initial == 'Z' || initial == 'z') {
        $('.systemadminformView .formContent .newuserPicture').css('background', col_hqz)
        $('.systemadminformView .formContent .newuserPicture .newuserInitial').css('background', col_hqz)
    }
    else if (initial == 'I' || initial == 'i' || initial == 'R' || initial == 'r') {
        $('.systemadminformView .formContent .newuserPicture').css('background', col_ir)
        $('.systemadminformView .formContent .newuserPicture .newuserInitial').css('background', col_ir)
    }
}
function enlargeformSize() {
    $('.systemadminformView .formContent').animate({
        width: '90%'
        , margin: '2% auto'
    }, 250);
    $('.systemadminformView .formContent .formcontainerMainBody').animate({
        height: "75vh"
    }, 250);
}

function enlargeformSize2() {
    $('.systemadminformView .formContent').animate({
        width: '70%'
        , margin: '2% auto'
    }, 250);
    $('.systemadminformView .formContent .formcontainerMainBody').animate({
        height: "75vh"
    }, 250);
}

function enlargenewuser() {
    $('.systemadminformView .formContent').animate({
        width: '70%'
        , margin: '5% auto'
    }, 250);
    $('.systemadminformView .formContent .formcontainerMainBody').animate({
        height: "65vh"
    }, 250, function () { $('.newuserPicture').fadeIn() });
}

function minimizenewuser() {
    $('.systemadminformView .formContent').animate({
        width: '40%'
        , margin: '5% auto'
    }, 250);
    $('.systemadminformView .formContent .formcontainerMainBody').animate({
        height: "60vh"
    }, 250, function () { $('.newuserPicture').fadeOut() });
}

function shrinkformSize() {
    $('.systemadminformView .formContent').animate({
        width: '40%'
        , margin: '5% auto'
    }, 250);
    $('.systemadminformView .formContent .formcontainerMainBody').animate({
        height: "60vh"
    }, 250);
}

function errorProjectID() {
    $("#projectid").css({
        "border-color": "red",
        "background": "url(Images/icons/gen_button/cancel.svg)",
        "background-size": "20px",
        "background-repeat": "no-repeat",
        "background-position": "2px 4px",
    })
}

function errorProjectName() {
    $("#projectname").css({
        "border-color": "red",
        "background": "url(Images/icons/gen_button/cancel.svg)",
        "background-size": "20px",
        "background-repeat": "no-repeat",
        "background-position": "2px 4px",
    })
}

function clearError() {
    $("#projectid").css({
        "border-color": "",
        "background": "",
        "background-size": "",
        "background-position": "",
    })
    $("#projectname").css({
        "border-color": "",
        "background": "",
        "background-size": "",
        "background-position": "",
    })
}

$("#projectid").on("keyup", function () {
    $(this).css({
        "border-color": "",
        "background": "",
    })
})

$("#projectname").on("keyup", function () {
    $(this).css({
        "border-color": "",
        "background": "",
    })
})

$(function () {

    refreshInformation()
    
    /////     Pop up window click item     /////
    //animation for clicking the close pop up item//
    $('.popupboxfooter .popupbutton button').on("click", function () {
        let popuptoClose = $(this).attr('rel')
        $('#' + popuptoClose).css('display', 'none')
    })

    function closeAllMain() {
        $("#main-user").css("display", "none");
        $("#main-user").removeClass("active");

        $("#main-project.active").css("display", "none");
        $("#main-project.active").removeClass("active");

        $("#archived-user.active").css("display", "none");
        $("#archived-user.active").removeClass("active");

        $("#archived-project.active").css("display", "none");
        $("#archived-project.active").removeClass("active");

        $("#main-account.active").css("display", "none");
        $("#main-account.active").removeClass("active");
    }

    function openNavbar() {
        $(window).resize(function () {
            $('#main-home').css('width', 'calc(100% - 70px)').css('width', '-=280px');
            $('#main-user').css('width', 'calc(100% - 70px)').css('width', '-=280px');
            $('#main-project').css('width', 'calc(100% - 70px)').css('width', '-=280px');
            $('#archived-user').css('width', 'calc(100% - 70px)').css('width', '-=280px')
            $('#archived-project').css('width', 'calc(100% - 70px)').css('width', '-=280px');
            $('#main-account').css('width', 'calc(100% - 70px)').css('width', '-=280px');
        })
        if ($(window).width() <= "1366") {
            $('#sidebar-admin').addClass('active')
            $('#sidebar-admin').fadeIn().css({ width: 43 }).animate({ width: '220px' }, 100, function () {
                $('.sidebar-items li a').fadeIn(50);
                $('.sidebar-items li div.arrow').fadeIn(50)
            });
            $('#main-home').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
            $('#main-user').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
            $('#main-project').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
            $('#archived-user').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
            $('#archived-project').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
            $('#main-account').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
        } else if (window.devicePixelRatio >= 1.25) {
            $('#sidebar-admin').addClass('active')
            $('#sidebar-admin').fadeIn().css({ width: 43 }).animate({ width: '220px' }, 100, function () {
                $('.sidebar-items li a').fadeIn(50);
                $('.sidebar-items li div.arrow').fadeIn(50)
            });
            $('#main-home').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
            $('#main-user').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
            $('#main-project').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
            $('#archived-user').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
            $('#archived-project').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
            $('#main-account').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
        } else {
            $('#sidebar-admin').addClass('active')
            $('#sidebar-admin').fadeIn().css({ width: 60 }).animate({ width: '300px' }, 100, function () {
                $('.sidebar-items li a').fadeIn(50);
                $('.sidebar-items li div.arrow').fadeIn(50)
            });
            $('#main-home').css('width', 'calc(100% - 70px)').animate({ width: '-=280px' }, 100);
            $('#main-user').css('width', 'calc(100% - 70px)').animate({ width: '-=280px' }, 100);
            $('#main-project').css('width', 'calc(100% - 70px)').animate({ width: '-=280px' }, 100);
            $('#archived-user').css('width', 'calc(100% - 70px)').animate({ width: '-=280px' }, 100);
            $('#archived-project').css('width', 'calc(100% - 70px)').animate({ width: '-=280px' }, 100);
            $('#main-account').css('width', 'calc(100% - 70px)').animate({ width: '-=280px' }, 100);
        }
    }

    function closeNavbar() {
        $(window).resize(function () {
            $('#main-home.active').css('width', '100%').css('width', '-=100px');
            $('#main-user.active').css('width', '100%').css('width', '-=100px');
            $('#main-project.active').css('width', '100%').css('width', '-=100px');
            $('#archived-user.active').css('width', '100%').css('width', '-=100px')
            $('#archived-project.active').css('width', '100%').css('width', '-=100px');
            $('#main-account.active').css('width', '100%').css('width', '-=100px');
        })

        if ($(window).width() <= "1366") {
            // actual animation of the sidebar (shrink). The main page will increase width accrding to the sidebar.
            $('.sidebar-items .adminItems.active').removeClass('active')
            $('.sidebar-items .admin-subbuttons').css('display', 'none')
            $('.sidebar-items li a').fadeOut(50)
            $('.sidebar-items li div.arrow').fadeOut(50)
            $('.sidebar-items .adminItems div.arrow').removeClass('active')
            $('#sidebar-admin').removeClass('active')
            $('#sidebar-admin').fadeIn().css({ width: 220 }).animate({ width: '43px' }, 100, function () {
                $('#main-home').css('width', '100%').css('width', '-=80px');
                $('#main-user').css('width', '100%').css('width', '-=80px');
                $('#main-project').css('width', '100%').css('width', '-=80px');
                $('#archived-user').css('width', '100%').css('width', '-=80px')
                $('#archived-project').css('width', '100%').css('width', '-=80px');
                $('#main-account').css('width', '100%').css('width', '-=80px');
            });
        } else if (window.devicePixelRatio >= 1.25) {
            // actual animation of the sidebar (shrink). The main page will increase width accrding to the sidebar.
            $('.sidebar-items .adminItems.active').removeClass('active')
            $('.sidebar-items .admin-subbuttons').css('display', 'none')
            $('.sidebar-items li a').fadeOut(50)
            $('.sidebar-items li div.arrow').fadeOut(50)
            $('.sidebar-items .adminItems div.arrow').removeClass('active')
            $('#sidebar-admin').removeClass('active')
            $('#sidebar-admin').fadeIn().css({ width: 220 }).animate({ width: '43px' }, 100, function () {
                $('#main-home').css('width', '100%').css('width', '-=80px');
                $('#main-user').css('width', '100%').css('width', '-=80px');
                $('#main-project').css('width', '100%').css('width', '-=80px');
                $('#archived-user').css('width', '100%').css('width', '-=80px')
                $('#archived-project').css('width', '100%').css('width', '-=80px');
                $('#main-account').css('width', '100%').css('width', '-=80px');
            });
        } else {
            //actual animation of the sidebar(shrink).The main page will increase width accrding to the sidebar.
            $('.sidebar-items .adminItems.active').removeClass('active')
            $('.sidebar-items .admin-subbuttons').css('display', 'none')
            $('.sidebar-items li a').fadeOut(50)
            $('.sidebar-items li div.arrow').fadeOut(50)
            $('.sidebar-items .adminItems div.arrow').removeClass('active')
            $('#sidebar-admin').removeClass('active')
            $('#sidebar-admin').fadeIn().css({ width: 300 }).animate({ width: '60px' }, 100, function () {
                $('#main-home').css('width', '100%').css('width', '-=100px');
                $('#main-user').css('width', '100%').css('width', '-=100px');
                $('#main-project').css('width', '100%').css('width', '-=100px');
                $('#archived-user').css('width', '100%').css('width', '-=100px')
                $('#archived-project').css('width', '100%').css('width', '-=100px');
                $('#main-account').css('width', '100%').css('width', '-=100px');
            });
        }
    }
    /////     Navigation bar clikck item     //////
    //animation for clicking the hamburger admin button
    $(".sidebar-items .adminHead").on("click", function () {
        ///  if the sidebar is NOT ACTIVE and it is clicked , --->
        if (!$("#sidebar-admin").hasClass("active")) {
            // main size will shrink when window is resize
            // actual animation of the sidebar (expand). The main page will reduce width accrding to the sidebar.
            openNavbar();
        } else {
            ///  if the sidebar is ACTIVE and it is clicked , --->
            // main size will expand when window is resize
            closeNavbar();
        }
    });

    //animation for clicking the adminItems ( to expand 2nd layer button)
    $('.sidebar-items .adminItems').on('click', function () {
        let buttonClicked = $(this).attr('id')
        let subbuttonOpen = $(this).attr('rel')
        let subbuttonHide = $('.adminItems.active').attr('rel')
        let arrowchange = $('#' + buttonClicked + ' div.arrow')

        // animation for expanding the 2nd layer button
        if ((!$(this).hasClass("active")) && ($('#sidebar-admin').hasClass("active"))) {
            $('.sidebar-items .adminItems.active').removeClass('active')
            $('#' + buttonClicked).addClass('active')
            $('#' + subbuttonOpen).slideDown(100)
            $('#' + subbuttonHide).slideUp(100)
            $('.adminItems div.arrow.active').removeClass('active')
            $(arrowchange).addClass('active')
            $('#' + subbuttonHide).removeClass('active')
        }
        else {
            if (buttonClicked !== 'adminItems-account') {
                $('#' + buttonClicked).removeClass('active')
                $('#' + subbuttonOpen).slideUp(100)
                $('#' + subbuttonHide).slideUp(100)
                $('.adminItems div.arrow.active').removeClass('active')
                $(arrowchange).removeClass('active')
                $('#' + subbuttonHide).removeClass('active')
            } else {

            }
        }

        // animation for closing the other page and opening the main page
        // check if the clicked amItems is account or other page

        if (buttonClicked == "adminItems-user" && $("#sidebar-admin").hasClass("active")) {
            // if other adminItems is clicked, hide all pages and show the home page.
            closeAllMain()
            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        } else if (buttonClicked == "adminItems-user" && !$("#sidebar-admin").hasClass("active")) {
            openNavbar();
            closeAllMain()

            $(".adminItems#adminItems-user").addClass("active");
            $(".admin-subbuttons#adminsub-user").slideDown(100);

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        }
        if (buttonClicked == "adminItems-project" && $("#sidebar-admin").hasClass("active")) {
            // if other adminItems is clicked, hide all pages and show the home page.
            closeAllMain()
            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        } else if (buttonClicked == "adminItems-project" && !$("#sidebar-admin").hasClass("active")) {
            openNavbar();
            closeAllMain()

            $(".adminItems#adminItems-project").addClass("active");
            $(".admin-subbuttons#adminsub-project").slideDown(100);

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        }
        if (buttonClicked == "adminItems-account" && $("#sidebar-admin").hasClass("active")) {
            //if account is clicked, hide other pages open the account page
            closeAllMain()
            showaccountdetails()

            // $("#main-home").fadeIn(150);
            // $("#main-home").addClass("active");
        } else if (buttonClicked == "adminItems-account" && !$("#sidebar-admin").hasClass("active")) {
            openNavbar();
            closeAllMain()
            $(".adminItems#adminItems-account").addClass("active");
            $(".admin-subbuttons#adminsub-account").slideDown(100);

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        }
    });

    // animation for clicking the subbuttons on the left bar//
    $(".subbutton-button").on("click", function () {
        //$thigtoOpen = $(this).attr('rel')
        $buttonClicked = $(this).attr("id");

        $(".subbutton-button").removeClass("active")
        $("#" + $buttonClicked).addClass('active')
        //$("#"+ $thigtoOpen).css('display','block')
        //$("#"+ $thigtoOpen).addClass('active')
    })


    function hideButtonandCounter() {
        $('#main-user .checkcounter #userchecked').html('')
        $('#main-user .checkcounter #userchecked').fadeOut('fast')
        $('#main-user .checkcounter #sysadmindeleteUser').css('display', 'none')

        $('#main-project .checkcounter #projectchecked').html('')
        $('#main-project .checkcounter #projectchecked').fadeOut('fast')
        $('#main-project .searchTable #sysadmindeleteProject').css('display', 'none')

        $('#archived-user .checkcounter #archiveduserchecked').html('')
        $('#archived-user .checkcounter #archiveduserchecked').fadeOut('fast')
        $('#archived-user .checkcounter #systemadminrecoverUser').css('display', 'none')
        $('#archived-user .checkcounter #systemadmindeleteparmanentUser').css('display', 'none')

        $('#archived-project .checkcounter #archivedprojectchecked').html('')
        $('#archived-project .checkcounter #archivedprojectchecked').fadeOut('fast')
        $('#archived-project .checkcounter #systemadminrecoverProject').css('display', 'none')
        $('#archived-project .checkcounter #systemadmindeleteparmanentProject').css('display', 'none')

        $("table input[type='checkbox']").prop("checked", false)
    }

    ///   Animaiion for the main page to display ///
    // show/hide table when the active user button is clicked
    $(".admin-subbuttons .subbutton-button#activeuser").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-project.active").css("display", "none");
        $("#main-project.active").removeClass("active");
        $("#archived-user.active").css("display", "none");
        $("#archived-user.active").removeClass("active");
        $("#archived-project.active").css("display", "none");
        $("#archived-project.active").removeClass("active");
        $("#main-account.active").css("display", "none");
        $("#main-account.active").removeClass("active");

        $("#main-user").fadeIn(150);
        $("#main-user").addClass("active");

        hideButtonandCounter();
    });

    // show/hide table when the active project button is clicked
    $(".admin-subbuttons .subbutton-button#activeproject").on(
        "click",
        function () {
            $("#main-home.active").css("display", "none");
            $("#main-home.active").removeClass("active");
            $("#main-user.active").css("display", "none");
            $("#main-user.active").removeClass("active");
            $("#archived-user.active").css("display", "none");
            $("#archived-user.active").removeClass("active");
            $("#archived-project.active").css("display", "none");
            $("#archived-project.active").removeClass("active");
            $("#main-account.active").css("display", "none");
            $("#main-account.active").removeClass("active");

            $("#main-project").fadeIn(150);
            $("#main-project").addClass("active");

            hideButtonandCounter();
        }
    );

    // show/hide table when the inactive user button is clicked
    $(".admin-subbuttons .subbutton-button#inactiveuser").on(
        "click",
        function () {
            $("#main-home.active").css("display", "none");
            $("#main-home.active").removeClass("active");
            $("#main-user.active").css("display", "none");
            $("#main-user.active").removeClass("active");
            $("#main-project.active").css("display", "none");
            $("#main-project.active").removeClass("active");
            $("#archived-project.active").css("display", "none");
            $("#archived-project.active").removeClass("active");
            $("#main-account.active").css("display", "none");
            $("#main-account.active").removeClass("active");

            $("#archived-user").fadeIn(150);
            $("#archived-user").addClass("active");

            hideButtonandCounter();
        }
    );

    // show/hide table when the archived project button is clicked
    $(".admin-subbuttons .subbutton-button#archivedproject").on(
        "click",
        function () {
            $("#main-home.active").css("display", "none");
            $("#main-home.active").removeClass("active");
            $("#main-user.active").css("display", "none");
            $("#main-user.active").removeClass("active");
            $("#main-project.active").css("display", "none");
            $("#main-project.active").removeClass("active");
            $("#archived-user.active").css("display", "none");
            $("#archived-user.active").removeClass("active");
            $("#main-account.active").css("display", "none");
            $("#main-account.active").removeClass("active");

            $("#archived-project").fadeIn(150);
            $("#archived-project").addClass("active");

            hideButtonandCounter();
        }
    );

    /// animation for clicking list items in the home page  ///
    $(".card-body .list-items .items").on("click", function () {
        let $buttonClicked = $(this).attr("rel");
        let $subbuttonstoShow = $(".subbutton-button#" + $buttonClicked)
            .parent("ul.admin-subbuttons")
            .attr("id");
        let $subbuttonHide = $(".adminItems.active").attr("rel");

        if ($buttonClicked == "activeuser") {
            refreshUserTableBody();
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $("#main-home.active").css("display", "none");
            $("#main-home.active").removeClass("active");
            $("#main-project.active").css("display", "none");
            $("#main-project.active").removeClass("active");
            $("#archived-user.active").css("display", "none");
            $("#archived-user.active").removeClass("active");
            $("#archived-project.active").css("display", "none");
            $("#archived-project.active").removeClass("active");
            $("#main-account.active").css("display", "none");
            $("#main-account.active").removeClass("active");

            $("#main-user").fadeIn(150);
            $("#main-user").addClass("active");

            if (!$(".sidebar-items .adminItems#adminItems-user").hasClass("active")) {
                $(".sidebar-items .adminItems.active").removeClass("active");
                $("#" + $subbuttonHide).slideUp(100);
                $(".sidebar-items .adminItems#adminItems-user").addClass("active");
                $("#" + $subbuttonstoShow).slideDown(100);
            }

            $(".sidebar-items .adminItems div.arrow.active").removeClass("active");
            $(".sidebar-items .adminItems#adminItems-user div.arrow").addClass(
                "active"
            );
        } else if ($buttonClicked == "adduser") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }

            $("#main-home.active").css("display", "none");
            $("#main-home.active").removeClass("active");
            $("#main-project.active").css("display", "none");
            $("#main-project.active").removeClass("active");
            $("#archived-user.active").css("display", "none");
            $("#archived-user.active").removeClass("active");
            $("#archived-project.active").css("display", "none");
            $("#archived-project.active").removeClass("active");
            $("#main-account.active").css("display", "none");
            $("#main-account.active").removeClass("active");
            $(".subbutton-button").removeClass("active");

            $("#main-user").fadeIn(150);
            $("#main-user").addClass("active");

            if (!$(".sidebar-items .adminItems#adminItems-user").hasClass("active")) {
                $(".sidebar-items .adminItems.active").removeClass("active");
                $("#" + $subbuttonHide).slideUp(100);
                $(".sidebar-items .adminItems#adminItems-user").addClass("active");
                $("#" + $subbuttonstoShow).slideDown(100);
            }

            $(".sidebar-items .adminItems div.arrow.active").removeClass("active");
            $(".sidebar-items .adminItems#adminItems-user div.arrow").addClass(
                "active"
            );

            if (!$("#addnewuserForm").hasClass("active")) {
                resetinputvalue();
                $("#newemail").prop("readonly", false);
                $("#addnewprojectForm.active").removeClass("active");
                $("#addnewuserForm")
                    .css({
                        "padding-top": -30,
                    })
                    .animate({
                        "padding-top": 0,
                    },
                        100,
                        function () {
                            //   shoe the add new user form
                            $("#addnewuserForm").css("display", "block");
                            $("#addnewuserForm").addClass("active");
                            editstate();

                            //   change header display to new user
                            $("#newuserheaderDisplay").html("New User");

                            //   hide the password edit checkbox
                            $(".newuserContainerBody-edit .resetcheck").css(
                                "display",
                                "none"
                            );
                            $(".newuserContainerBody-edit .updatecheck").css(
                                "display",
                                "none"
                            );
                            $(".newuserContainerBody-edit .resetpasswordcontainer").css(
                                "display",
                                "block"
                            );

                            //   hide project involved table
                            // Handled by the view on edit class

                            //   change the update button to save button
                            $(".newuserFooter .edit-page1 #newusernext").css(
                                "display",
                                "inline"
                            );
                            $(".newuserFooter .edit-page1 #newusernext2").css(
                                "display",
                                "none"
                            );
                            $(".newuserFooter .edit-page2 #newuserback").css(
                                "display",
                                "inline"
                            );
                            $(".newuserFooter .edit-page2 #newuserback2").css(
                                "display",
                                "none"
                            );
                            $(".newuserFooter .edit-page2 #newuserSave").css(
                                "display",
                                "inline"
                            );
                            $(".newuserFooter .edit-page2 #newuserUpdate").css(
                                "display",
                                "none"
                            );

                            //   make the email field editable when create new user button is clicked
                            $(".newuserContainerBody-edit #newemail").css({
                                "background-color": "white",
                                outline: "default",
                                cursor: "default",
                            });
                            $(".newuserContainerBody-edit #newemail").prop("readonly", false);
                            //$('.newuserContainerBody-edit #newemail').focus(function(){this.focus()})
                        }
                    );
            }
            updateAllUserSelectOptions();
        } else if ($buttonClicked == "inactiveuser") {
            refreshDeleteUserTableBody();
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $("#main-home.active").css("display", "none");
            $("#main-home.active").removeClass("active");
            $("#main-user.active").css("display", "none");
            $("#main-user.active").removeClass("active");
            $("#main-project.active").css("display", "none");
            $("#main-project.active").removeClass("active");
            $("#archived-project.active").css("display", "none");
            $("#archived-project.active").removeClass("active");
            $("#main-account.active").css("display", "none");

            $("#archived-user").fadeIn(150);
            $("#archived-user").addClass("active");

            if (!$(".sidebar-items .adminItems#adminItems-user").hasClass("active")) {
                $(".sidebar-items .adminItems.active").removeClass("active");
                $("#" + $subbuttonHide).slideUp(100);
                $(".sidebar-items .adminItems#adminItems-user").addClass("active");
                $("#" + $subbuttonstoShow).slideDown(100);
            }

            $(".sidebar-items .adminItems div.arrow.active").removeClass("active");
            $(".sidebar-items .adminItems#adminItems-user div.arrow").addClass(
                "active"
            );
        } else if ($buttonClicked == "activeproject") {
            refreshProjectTableBody();
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }

            $("#main-home.active").css("display", "none");
            $("#main-home.active").removeClass("active");
            $("#main-user.active").css("display", "none");
            $("#main-user.active").removeClass("active");
            $("#archived-user.active").css("display", "none");
            $("#archived-user.active").removeClass("active");
            $("#archived-project.active").css("display", "none");
            $("#archived-project.active").removeClass("active");
            $("#main-account.active").css("display", "none");
            $("#main-account.active").removeClass("active");

            $("#main-project").fadeIn(150);
            $("#main-project").addClass("active");

            $(".sidebar-items .adminItems.active").removeClass("active");
            $("#" + $subbuttonHide).slideUp(100);

            $(".sidebar-items .adminItems#adminItems-project").addClass("active");
            $("#" + $subbuttonstoShow).slideDown(100);

            $(".sidebar-items .adminItems div.arrow.active").removeClass("active");
            $(".sidebar-items .adminItems#adminItems-project div.arrow").addClass(
                "active"
            );
        } else if ($buttonClicked == "newproject") {
            flagEdit = false;
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".subbutton-button").removeClass("active");

            $("#main-home.active").css("display", "none");
            $("#main-home.active").removeClass("active");
            $("#main-user.active").css("display", "none");
            $("#main-user.active").removeClass("active");
            $("#archived-user.active").css("display", "none");
            $("#archived-user.active").removeClass("active");
            $("#archived-project.active").css("display", "none");
            $("#archived-project.active").removeClass("active");
            $("#main-account.active").css("display", "none");
            $("#main-account.active").removeClass("active");

            $("#main-project").fadeIn(150);
            $("#main-project").addClass("active");

            if (
                !$(".sidebar-items .adminItems#adminItems-project").hasClass("active")
            ) {
                $(".sidebar-items .adminItems.active").removeClass("active");
                $("#" + $subbuttonHide).slideUp(100);
                $(".sidebar-items .adminItems#adminItems-project").addClass("active");
                $("#" + $subbuttonstoShow).slideDown(100);
            }

            $(".sidebar-items .adminItems div.arrow.active").removeClass("active");
            $(".sidebar-items .adminItems#adminItems-project div.arrow").addClass(
                "active"
            );

        } else if ($buttonClicked == 'activeproject') {
            refreshProjectTableBody();
            if (!$('#sidebar-admin').hasClass("active")) {
                openNavbar()
            }

            $('#main-home.active').css('display', 'none')
            $('#main-home.active').removeClass('active')
            $('#main-user.active').css('display', 'none')
            $('#main-user.active').removeClass('active')
            $('#archived-user.active').css('display', 'none')
            $('#archived-user.active').removeClass('active')
            $('#archived-project.active').css('display', 'none')
            $('#archived-project.active').removeClass('active')
            $('#main-account.active').css('display', 'none')
            $('#main-account.active').removeClass('active')

            $('#main-project').fadeIn(150)
            $('#main-project').addClass('active')

            $('.sidebar-items .adminItems.active').removeClass('active')
            $('#' + $subbuttonHide).slideUp(100)

            $('.sidebar-items .adminItems#adminItems-project').addClass('active')
            $('#' + $subbuttonstoShow).slideDown(100)

            $('.sidebar-items .adminItems div.arrow.active').removeClass('active')
            $('.sidebar-items .adminItems#adminItems-project div.arrow').addClass('active')

        } else if ($buttonClicked == 'newproject') {
            flagEdit = false;
            if (!$('#sidebar-admin').hasClass("active")) {
                openNavbar()
            }
            $(".subbutton-button").removeClass("active")

            $('#main-home.active').css('display', 'none')
            $('#main-home.active').removeClass('active')
            $('#main-user.active').css('display', 'none')
            $('#main-user.active').removeClass('active')
            $('#archived-user.active').css('display', 'none')
            $('#archived-user.active').removeClass('active')
            $('#archived-project.active').css('display', 'none')
            $('#archived-project.active').removeClass('active')
            $('#main-account.active').css('display', 'none')
            $('#main-account.active').removeClass('active')

            $('#main-project').fadeIn(150)
            $('#main-project').addClass('active')

            if (!$('.sidebar-items .adminItems#adminItems-project').hasClass('active')) {
                $('.sidebar-items .adminItems.active').removeClass('active')
                $('#' + $subbuttonHide).slideUp(100)
                $('.sidebar-items .adminItems#adminItems-project').addClass('active')
                $('#' + $subbuttonstoShow).slideDown(100)
            }

            $('.sidebar-items .adminItems div.arrow.active').removeClass('active')
            $('.sidebar-items .adminItems#adminItems-project div.arrow').addClass('active')

            viewer.camera.setView({
                destination: defaultview,
            });
            if (!$("#addnewprojectForm").hasClass("active")) {
                $("#addnewuserForm.active").removeClass("active");
                $("#addnewprojectForm").css({ "padding-top": -30, }).animate({ "padding-top": 0, }, 100, function () {
                    $("#addnewprojectForm").css("display", "block");
                    $("#addnewprojectForm").addClass("active");
                    projecteditstate();
                    $("#newprojectheaderDisplay").html("New Project");

                    $(".newprojectFooter .edit-page8 #newprojectSave").css("display", "inline");
                    $(".newprojectFooter .edit-page8 #newprojectUpdate").css("display", "none");
                    $(".newprojectFooter .edit-page8 #newprojectUpdate1").css("display", "none");
                });
                $(".newprojectContainerBody-editpage5 .filterContainer").hide();
                $(".newprojectContainerBody-editpage5 .container-table").css({ width: "calc(100% - 40px)", left: "20px", "margin-left": "0px" });
                $("#organizeuser").removeClass("active");
            } else { }
        } else if ($buttonClicked == "archivedproject") {
            refreshDeleteProjectTableBody();
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }

            $("#main-home.active").css("display", "none");
            $("#main-home.active").removeClass("active");
            $("#main-user.active").css("display", "none");
            $("#main-user.active").removeClass("active");
            $("#main-project.active").css("display", "none");
            $("#main-project.active").removeClass("active");
            $("#archived-user.active").css("display", "none");
            $("#archived-user.active").removeClass("active");
            $("#main-account.active").css("display", "none");
            $("#main-account.active").removeClass("active");

            $("#archived-project").fadeIn(150);
            $("#archived-project").addClass("active");

            if (!$(".sidebar-items .adminItems#adminItems-project").hasClass("active")) {
                $(".sidebar-items .adminItems.active").removeClass("active");
                $("#" + $subbuttonHide).slideUp(100);
                $(".sidebar-items .adminItems#adminItems-project").addClass("active");
                $("#" + $subbuttonstoShow).slideDown(100);
            }

            $(".sidebar-items .adminItems div.arrow.active").removeClass("active");
            $(".sidebar-items .adminItems#adminItems-project div.arrow").addClass(
                "active"
            );
        }
    });

    //edit state for new user form
    function editstate() {
        $('.newuserContainerBody-edit').css('display', 'block')
        $('.newuserContainerBody-edit.active').addClass('active')
        $('.newuserContainerBody-readonly').css('display', 'none')
        $('.newuserContainerBody-readonly.active').removeClass('active')
        $('.newuserFooter .readonly').css('display', 'none')
        $('.newuserFooter .edit-page1').css('display', 'block')
        $('.newuserFooter .edit-page2').css('display', 'none')
        $(".idcontainer").css('display', 'none')
        $(".doubleinput.idcontainer").css('display', 'none')
        $(".newuserContainerBody-readonly .viewonedit").css('display', 'none')
        $('.newuserPicture').fadeOut(100, function () {
            $('.systemadminformView .formContent').animate({ width: '40%', margin: '5% auto' }, 250);
            $('.systemadminformView .formContent .formcontainerMainBody').animate({ height: "60vh" }, 250);
        })
    }

    function projecteditstate() {
        $(".newprojectContainerBody-editpage1").css("display", "block");
        $(".newprojectContainerBody-editpage2").css("display", "none");
        $(".newprojectContainerBody-editpage3").css("display", "none");
        $(".newprojectContainerBody-editpage4").css("display", "none");
        $(".newprojectContainerBody-editpage5").css("display", "none");
        $(".newprojectContainerBody-editpage6").css("display", "none");
        $(".newprojectContainerBody-editpage7").css("display", "none");
        $(".newprojectContainerBody-readonly").css("display", "none");
        $(".newprojectContainerBody-editpage1").addClass("active");
        $(".newprojectContainerBody-editpage2").removeClass("active");
        $(".newprojectContainerBody-editpage3").removeClass("active");
        $(".newprojectContainerBody-editpage4").removeClass("active");
        $(".newprojectContainerBody-editpage5").removeClass("active");
        $(".newprojectContainerBody-editpage6").removeClass("active");
        $(".newprojectContainerBody-editpage7").removeClass("active");
        $(".newprojectContainerBody-readonly").removeClass("active");
        $(".newprojectFooter .edit-page1").css("display", "block");
        $(".newprojectFooter .edit-page2").css("display", "none");
        $(".newprojectFooter .edit-page3").css("display", "none");
        $(".newprojectFooter .edit-page4").css("display", "none");
        $(".newprojectFooter .edit-page5").css("display", "none");
        $(".newprojectFooter .edit-page6").css("display", "none");
        $(".newprojectFooter .edit-page7").css("display", "none");
        $(".newprojectFooter .edit-page8").css("display", "none");
        $(".newprojectFooter .readonly").css("display", "none");
        $(".pagenumber").css("display", "flex");
        $(".pagenumber .pagecounter#page1").addClass("active");
        $(".pagenumber .pagecounter#page2").removeClass("active");
        $(".pagenumber .pagecounter#page3").removeClass("active");
        $(".pagenumber .pagecounter#page4").removeClass("active");
        $(".pagenumber .pagecounter#page5").removeClass("active");
        $(".pagenumber .pagecounter#page6").removeClass("active");
        $(".pagenumber .pagecounter#page7").removeClass("active");
        $(".pagenumber .pagecounter#page8").removeClass("active");
        $(".newprojectContainerBody-readonly .container-table#userlistTable1").css(
            "display",
            "block"
        );
        $(".newprojectContainerBody-readonly .container-table#userlistTable2").css(
            "display",
            "none"
        );
        $('#projectid').prop("disabled", false);
        $('#projectowner').prop("disabled", false);
        $("select#projectowner").removeClass("readonly")
        $('#projectwpcid').prop("disabled", false);
        $("input#projectwpcid").removeClass("readonly")
    }

    getLicenseInfo()
});


function resetOrgSelect() {
    $("#seletedContainer").children().remove()
}

function showaccountdetails() {
    if (!$("#main-account").hasClass("active")) {
        $("#main-home").css("display", "none");
        $("#main-home").removeClass("active");
        $("#main-user.active").css("display", "none");
        $("#main-user.active").removeClass("active");
        $("#archived-user.active").css("display", "none");
        $("#archived-user.active").removeClass("active");
        $("#archived-project.active").css("display", "none");
        $("#archived-project.active").removeClass("active");
        $("#main-project.active").css("display", "none");
        $("#main-project.active").removeClass("active");

        $("#main-account").fadeIn(150);
        $("#main-account").addClass("active");
    } else {

    }
}

function checkUncheckUsers(ele) {
    if ($("input[type='checkbox']:checked").prop("checked")) {
        $("#sysadmindeleteUser").fadeIn("fast");
        var email = localStorage.signed_in_email;

        if (email == $(ele).closest("tr").find("td:eq(2)").text()) {
            $(ele).prop("checked", false);
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Signed in email User cannot be selected for deleting !",
            });
        }

        let $countchecked = $("table input.utable[type=checkbox]:checked").length;
        let $allcheckbox = $("table input.utable[type=checkbox]").length;
        $("#main-user .checkcounter #userchecked").html(
            "Selected:" + $countchecked
        );
        $("#main-user .checkcounter #userchecked").fadeIn("fast");

        if ($allcheckbox == $countchecked - 1) {
            $("table thead tr th input[type=checkbox]").prop("checked", true);
        } else {
            $("table thead tr th input[type=checkbox]").prop("checked", false);
        }
    } else {
        $("#sysadmindeleteUser").fadeOut("fast");
        $("#main-user .checkcounter #userchecked").html("");
        $("#main-user .checkcounter #userchecked").fadeOut("fast");
    }
}

function checkUncheckProjects(ele) {
    let myrow = ele.parentNode.parentNode;
    let myTableBody = myrow.parentNode.id;

    if (myTableBody == "projectTableBody") {
        let parentid = ele.id;
        var rows = document.getElementById("packageTableBody").rows;
        if (document.getElementById(parentid).checked == true) {
            for (var i = 0; i < rows.length; i++) {
                var td = rows[i].getElementsByTagName("td")[7].innerHTML.trim();
                if (td == parentid) {
                    //  document.getElementById("packageTableBody").rows[i].style.display
                    let myid = rows[i].getElementsByTagName("td")[1].innerHTML.trim();
                    //$('#'+myid).prop("checked",true);
                    let mycheckbox = document.getElementById(myid);
                    mycheckbox.checked = true;
                    mycheckbox.disabled = true;
                }
            }
        } else {
            for (var i = 0; i < rows.length; i++) {
                var td = rows[i].getElementsByTagName("td")[7].innerHTML.trim();
                if (td == parentid) {
                    //  document.getElementById("packageTableBody").rows[i].style.display
                    let myid = rows[i].getElementsByTagName("td")[1].innerHTML.trim();
                    //$('#'+myid).prop("checked",true);
                    let mycheckbox = document.getElementById(myid);
                    mycheckbox.checked = false;
                    mycheckbox.disabled = false;
                }
            }
        }

    }
    if ($("input[type='checkbox']:checked").prop("checked")) {
        $("#sysadmindeleteProject").fadeIn("fast");

        let $countchecked = $("table input.ptable[type=checkbox]:checked").length;
        let $allcheckbox = $("table input.ptable[type=checkbox]").length;
        $("#main-project .checkcounter #projectchecked").html(
            "Selected:" + $countchecked
        );
        $("#main-project .checkcounter #projectchecked").fadeIn("fast");

        if ($allcheckbox == $countchecked) {
            $("table thead tr th input[type=checkbox]").prop("checked", true);
        } else {
            $("table thead tr th input[type=checkbox]").prop("checked", false);
        }
    } else {
        $("#sysadmindeleteProject").fadeOut("fast");
        $("#main-project .checkcounter #projectchecked").html("");
        $("#main-project .checkcounter #projectchecked").fadeOut("fast");
    }
}

function checkUncheckDeleteUsers(ele) {
    let myrow = ele.parentNode.parentNode;
    let myTableBody = myrow.parentNode.id;
    if ($("input[type='checkbox']:checked").prop("checked")) {
        $("#systemadminrecoverUser").fadeIn("fast");
        $("#systemadmindeleteparmanentUser").fadeIn("fast");

        let $countchecked = $("table input.deleteutable[type=checkbox]:checked")
            .length;
        let $allcheckbox = $("table input.deleteutable[type=checkbox]").length;
        $("#archived-user .checkcounter #archiveduserchecked").html(
            "Selected:" + $countchecked
        );
        $("#archived-user .checkcounter #archiveduserchecked").fadeIn("fast");

        if ($allcheckbox == $countchecked) {
            $("table thead tr th input[type=checkbox]").prop("checked", true);
        } else {
            $("table thead tr th input[type=checkbox]").prop("checked", false);
        }
    } else {
        $("#systemadminrecoverUser").fadeOut("fast");
        $("#systemadmindeleteparmanentUser").fadeOut("fast");
        $("#archived-user .checkcounter #archiveduserchecked").html("");
        $("#archived-user .checkcounter #archiveduserchecked").fadeOut("fast");
    }
}

function checkUncheckDeleteProjects(ele) {
    let myrow = ele.parentNode.parentNode;
    let myTableBody = myrow.parentNode.id;
    if (myTableBody == "deleteProjectTableBody") {
        let parentid = ele.id;
        var rows = document.getElementById("deletePackageTableBody").rows;
        if (document.getElementById(parentid).checked == true) {
            for (var i = 0; i < rows.length; i++) {
                var td = rows[i].getElementsByTagName("td")[7].innerHTML.trim();
                if (td == parentid) {
                    //  document.getElementById("packageTableBody").rows[i].style.display
                    let myid = rows[i].getElementsByTagName("td")[1].innerHTML.trim();
                    //$('#'+myid).prop("checked",true);
                    let mycheckbox = document.getElementById(myid);
                    mycheckbox.checked = true;

                }
            }
        } else {
            for (var i = 0; i < rows.length; i++) {
                var td = rows[i].getElementsByTagName("td")[7].innerHTML.trim();
                if (td == parentid) {
                    //  document.getElementById("packageTableBody").rows[i].style.display
                    let myid = rows[i].getElementsByTagName("td")[1].innerHTML.trim();
                    //$('#'+myid).prop("checked",true);
                    let mycheckbox = document.getElementById(myid);
                    mycheckbox.checked = false;
                }
            }
        }

    }

    if ($("input[type='checkbox']:checked").prop("checked")) {
        $("#systemadminrecoverProject").fadeIn("fast");
        $("#systemadmindeleteparmanentProject").fadeIn("fast");

        let $countchecked = $("table input.deleteptable[type=checkbox]:checked")
            .length;
        let $allcheckbox = $("table input.deleteptable[type=checkbox]").length;
        $("#archived-project .checkcounter #archivedprojectchecked").html(
            "Selected:" + $countchecked
        );
        $("#archived-project .checkcounter #archivedprojectchecked").fadeIn("fast");

        if ($allcheckbox == $countchecked) {
            $("table thead tr th input[type=checkbox]").prop("checked", true);
        } else {
            $("table thead tr th input[type=checkbox]").prop("checked", false);
        }
    } else {
        $("#systemadminrecoverProject").fadeOut("fast");
        $("#systemadmindeleteparmanentProject").fadeOut("fast");
        $("#archived-project .checkcounter #archivedprojectchecked").html("");
        $("#archived-project .checkcounter #archivedprojectchecked").fadeOut(
            "fast"
        );
    }

}

$("#newconfirmpassword").change(function () {
    if ($("#newconfirmpassword").val() != $("#newpassword").val())
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "Passwords did not match!",
        });
});

$("#updateEmail").click(function () {
    if ($("#updateEmail").prop("checked") == true) {
        $("#newemail").prop("readonly", false);
    } else {
        $("#divmanager").css("display", "none");
    }
})

$("#updateEmail").click(function () {
    if ($('#updateEmail').prop("checked") == true) {
        $('#newemail').prop('readonly', false);
    } else {
        $('#newemail').prop('readonly', true);
    };
});

function OnClickPermanentDeleteUser() {
    event.preventDefault();
    var userid = [];
    userid.push(click_user_details.id);
    var name =
        click_user_details.user_firstname + " " + click_user_details.user_lastname;
    var message =
        "Are you sure you want to delete this User permanently from the Database: " +
        name +
        "?";
    $.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Confirm!",
        content: message,
        buttons: {
            confirm: function () {
                if(SYSTEM == 'OBYU'){
                    ajaxUrl = 'BackEnd/userFunctionsOBYU.php';
                }else{
                    ajaxUrl = 'BackEnd/UserFunctionsV3.php';
                }

                var formdata = new FormData();
                formdata.append("user_id", JSON.stringify(userid));
                formdata.append("functionName", 'deleteUser');
                var request = new XMLHttpRequest();
                request.open("POST", ajaxUrl, true);
                request.send(formdata);
                request.onreadystatechange = function () {
                    if (request.readyState == 4 && request.status == "200") {
                        console.log(request.responseText);
                        jsonParse = JSON.parse(request.responseText);
                        $.alert({
                            boxWidth: "30%",
                            useBootstrap: false,
                            title: "Message",
                            content: jsonParse.msg,
                        });
                        $("#addnewuserForm").css("display", "none");
                        $("#addnewuserForm").removeClass("active");
                        refreshDeleteUserTableBody();
                        updateUserCard();
                    }
                };
            },
            cancel: function () {
                return;
            },
        },
    });
}

//Archive user(s) when click archive user in active list
archiveUsers = () => {
    var arr = [], ids = [];
    $("input.utable.user-active:checkbox:checked").each(function () {
        var id = parseInt($(this).parent().parent().data("uid"));
        var name = $(this).parent().parent().data("name");
        arr.push({ 'id': id, 'name': name });
        ids.push(id);
    });
    
    $.ajax({
        type: "POST",
        url: 'BackEnd/checkUserProjects.php',
        data: {
            user_ids: JSON.stringify(arr)
        },
        success: function (obj) {
            var data = obj.user_projects;
            var message = "Are you sure you want to deactivate the Users : <br><br>";
            for (var i = 0; i < data.length; i++) {

                message += i + 1 + ") " + data[i].user_name;
                if (data[i].project_info.length > 0) {
                    message += " involved in the following projects: <br>";
                    for (var j = 0; j < data[i].project_info.length; j++) {
                        message += "- as " + data[i].project_info[j].role + " in " + data[i].project_info[j].project_name;
                        if (j + 1 < data[i].project_info.length) {
                            message += "<br>";
                        }
                    };

                }
                message += "<br><br>";

            };
            window.parent.$.confirm({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Confirm!",
                content: message,
                buttons: {
                    confirm: function () {
                        if(SYSTEM == 'OBYU'){
                            ajaxUrl = 'BackEnd/userFunctionsOBYU.php';
                        }else{
                            if(IS_DOWNSTREAM){
                                ajaxUrl = 'BackEnd/userFunctionsOBYU.php';
                            }else{
                                ajaxUrl = 'BackEnd/UserFunctionsV3.php';
                            }
                        }

                        showLoader()
                        var formdata = new FormData();
                        formdata.append("user_id", JSON.stringify(ids));
                        formdata.append("functionName", "inactivateUser")
                        var request = new XMLHttpRequest();
                        request.open("POST", ajaxUrl, true);
                        request.send(formdata);
                        request.onreadystatechange = function () {
                            if (request.readyState == 4 && request.status == "200") {
                                hideLoader()
                                let jsonParse = JSON.parse(request.responseText);
                                window.parent.$.alert({
                                    boxWidth: "30%",
                                    useBootstrap: false,
                                    title: "Message",
                                    content: jsonParse.msg,
                                });
                                refreshUserTableBody();
                                updateUserCard();
                                refreshDeleteUserTableBody();
                            }
                        };
                    },
                    cancel: function () {
                        return;
                    },
                },
            });
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    })
}

//Recover user(s) when click on recover user in archive list
recoverUsers = () => {
    var arr = [],
        name = [];
    if (document.getElementById("checkAllArchivedUsers").checked) {
        name.push("All Inactive Users");
        $("input.utable.user-inactive:checkbox:checked").each(function () {
            arr.push(parseInt($(this).parent().parent().data("uid")));
        });
    } else {
        $("input.utable.user-inactive:checkbox:checked").each(function () {
            arr.push(parseInt($(this).parent().parent().data("uid")));
            name.push($(this).parent().parent().data("name"));
        });
    }
    var message = "Are you sure you want to recover these Users : " + name + "?";
    if(SYSTEM == 'OBYU'){
        ajaxUrl = 'BackEnd/UserFunctionsOBYU.php';
    }else{
        ajaxUrl = 'BackEnd/UserFunctionsV3.php';
    }
    window.parent.$.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Confirm!",
        content: message,
        buttons: {
            confirm: function () {
                showLoader()
                $(`.searchTable .details-container.user-inactive .counter`).html("")
                $(`.searchTable .user-inactive`).removeClass("active")
                var formdata = new FormData();
                formdata.append("user_id", JSON.stringify(arr));
                formdata.append("functionName", "reactivateUser")
                var request = new XMLHttpRequest();
                request.open("POST", ajaxUrl, true);
                request.send(formdata);
                request.onreadystatechange = function () {
                    if (request.readyState == 4 && request.status == "200") {
                        hideLoader()
                        let jsonParse = JSON.parse(request.responseText);
                        window.parent.$.alert({
                            boxWidth: "30%",
                            useBootstrap: false,
                            title: "Message",
                            content: jsonParse.msg,
                        });
                        refreshDeleteUserTableBody();
                        refreshUserTableBody();
                        updateUserCard();
                    }
                };
            },
            cancel: function () {
                return;
            },
        },
    });
}

//Delete user(s) when click on permanent delete user in archived list
deleteUsers = () =>{
    var arr = [],
        name = [];
    if (document.getElementById("checkAllArchivedUsers").checked) {
        name.push("All Inactive Users");
        $("input.utable.user-inactive:checkbox:checked").each(function () {
            arr.push(parseInt($(this).parent().parent().data("uid")));
        });
    } else {
        $("input.utable.user-inactive:checkbox:checked").each(function () {
            arr.push(parseInt($(this).parent().parent().data("uid")));
            name.push($(this).parent().parent().data("name"));
        });
    }
    var message =
        "Are you sure you want to delete these Users permanently from database : " +
        name +
        "?";
    if(SYSTEM == 'OBYU'){
        ajaxUrl = 'BackEnd/UserFunctionsOBYU.php';
    }else{
        if(IS_DOWNSTREAM){
            ajaxUrl = 'BackEnd/UserFunctionsOBYU.php';
        }else{
            ajaxUrl = 'BackEnd/UserFunctionsV3.php';
        }
    }
    window.parent.$.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Confirm!",
        content: message,
        buttons: {
            confirm: function () {
                showLoader()
                $(`.searchTable .details-container.user-inactive .counter`).html("")
                $(`.searchTable .user-inactive`).removeClass("active")
                var formdata = new FormData();
                formdata.append("user_id", JSON.stringify(arr));
                formdata.append("functionName", 'deleteUser')
                var request = new XMLHttpRequest();
                request.open("POST", ajaxUrl, true);
                request.send(formdata);
                request.onreadystatechange = function () {
                    if (request.readyState == 4 && request.status == "200") {
                        hideLoader()
                        let jsonParse = JSON.parse(request.responseText);
                        window.parent.$.alert({
                            boxWidth: "30%",
                            useBootstrap: false,
                            title: "Message",
                            content: jsonParse.msg,
                        });
                        refreshDeleteUserTableBody();
                        updateUserCard();
                    }
                };
            },
            cancel: function () {
                return;
            },
        },
    });
}

// Save Project when click wizard button - Handle in v3.js
// function OnClickNewProjectSave() {
//     event.preventDefault();

//     var pid = $("#projectid").val();
//     var pname = $("#projectname").val();
//     var powner = $("#projectowner").val();
//     var pwpcid = $("#projectwpcid").val();

//     var pind = $("#projectIndustry").val();
//     var ptz = $("#projectTimezone option:selected").text();
//     var ptzvalue = $("#projectTimezone").val();
//     var ploc = $("#projectLocation").val();
//     var file = document.getElementById("imgInp").files[0];
//     var startdate = $("#projectstartdate").val();
//     var enddate = $("#projectenddate").val();
//     var duration = $("#projectduration").val();
//     var contractorOrg = contractorSelectizeOrg;
//     var consultantOrg = consultantSelectizeOrg.join(";");
//     console.log(consultantOrg);
//     var formdata = new FormData();
//     var lat1 = radians_to_degrees(firstPoint.latitude).toFixed(4);
//     var lat2 = radians_to_degrees(tempCartographic.latitude).toFixed(4);
//     var long1 = radians_to_degrees(firstPoint.longitude).toFixed(4);
//     var long2 = radians_to_degrees(tempCartographic.longitude).toFixed(4);

//     formdata.append("projectid", pid);
//     formdata.append("projectname", pname);
//     formdata.append("projectowner", powner);
//     formdata.append("projectwpcid", pwpcid);
//     if (pind) {
//         formdata.append("industry", pind);
//     }
//     if (ptzvalue) {
//         formdata.append("timezoneval", ptzvalue);
//     }
//     if (ptz) {
//         formdata.append("timezonetext", ptz);
//     }
//     if (ploc) {
//         formdata.append("location", ploc);
//     }
//     formdata.append("lat1", lat1);
//     formdata.append("lat2", lat2);
//     formdata.append("long1", long1);
//     formdata.append("long2", long2);
//     if (startdate) {
//         formdata.append("startdate", startdate);
//     }
//     if (enddate) {
//         formdata.append("enddate", enddate);
//     }
//     if (duration) {
//         formdata.append("duration", duration);
//     }
//     formdata.append("users", JSON.stringify(userProjectArr));
//     formdata.append("userGroup", JSON.stringify(userProjectGroupArr));


//     if (file) {
//         formdata.append("imgInp", file);
//     }

//     console.log(ownerOrgName);
//     formdata.append("contractee", ownerOrgName); //to send to joget for adding owner company name in contracts

//     if (contractorOrg){
//         formdata.append("contractorOrg", contractorOrg); //to send to joget for adding contactor name in contracts
//     }
//     if(consultantOrg){
//         formdata.append("consultantOrg", consultantOrg); //to send to joget for adding consultant name in contracts
//     }

//     if ($("#overallprojectCheck").is(":checked")) {
//         var jogetPackageId = $("#jogetPackage option:selected").val()
//         $(".conAppList").each(function () {
//             let columnName = this.getAttribute("name");
//             let appValue = this.getAttribute("appValue");
//             console.log(appValue);
//             formdata.append(columnName, appValue);
//         });
//         if ($('#jogetFinancePackage option:selected').val() != null) {
//             $(".finAppList").each(function () {
//                 let columnName = this.getAttribute("name");
//                 let appValue = this.getAttribute("appValue");
//                 console.log(appValue);
//                 formdata.append(columnName, appValue);
//             });
//         }
//         if ($('#jogetDocPackage option:selected').val() != null) {
//             $(".docAppList").each(function () {
//                 let columnName = this.getAttribute("name");
//                 let appValue = this.getAttribute("appValue");
//                 formdata.append(columnName, appValue);
//             });
//         }
//     } else {
//         let parentid = $('#parentid :selected').val();
//         formdata.append("parentid", parentid);
//     }
//     formdata.append("functionName", "createProject")

//     $.ajax({
//         url: 'BackEnd/ProjectFunctions.php',
//         data: formdata,
//         processData: false,
//         contentType: false,
//         type: 'POST',
//         success: function (res) {
//             var data = JSON.parse(res)
//             var message = "";
//             if (data.msg.pIdName) {
//                 message += data.msg.pIdName;
//             };
//             if (data.msg.pName) {
//                 message += data.msg.pName;
//             }
//             if (message == "") {
//                 message = data.msg;
//             }
//             $.alert({
//                 boxWidth: "30%",
//                 useBootstrap: false,
//                 title: "Message",
//                 content: message,
//             });
//             if (data.data == "close") {
//                 $(":input").val("");
//                 $("#addnewprojectForm").css("display", "none");
//                 $("#addnewprojectForm").removeClass("active");
//                 $("#projectimage").attr("src", "");
//                 $("#lat1").html(" ");
//                 $("#lat2").html(" ");
//                 $("#long1").html(" ");
//                 $("#long2").html(" ");
//                 $(".coordinateVal").html(" ");

//                 selector.show = false;
//                 selector2.show = false;
//                 refreshProjectTableBody();
//                 updateProjectCard();
//                 shrinkformSize();
//             }
//         }
//     })
// }

// handled in v3.js
// function OnClickProjectUpdate() {
//     event.preventDefault();
//     if (ReadEntity) {
//         ReadEntity.show = false;
//     };

//     var projectUsersUpdate = [];
//     var projectGroupUsersUpdate = [];
//     for (var i = 0; i < click_project_details.users.length; i++) {
//         var id = click_project_details.users[i].Usr_ID;
//         console.log(id);
//         let myuser = userProjectArr.find((o, j) => {
//             if (o.user_id == id) {
//                 console.log(o.user_id);
//                 console.log(click_project_details.users[i].Pro_Role);
//                 console.log(userProjectArr[j].user_role);
//                 if (click_project_details.users[i].Pro_Role != userProjectArr[j].user_role) {
//                     console.log("not same role");
//                     projectUsersUpdate.push({
//                         user_id: o.user_id,
//                         user_role: o.user_role,
//                         user_email: o.user_email,
//                         user_old_role: click_project_details.users[i].Pro_Role
//                     });
//                 }
//                 userProjectArr.splice(j, 1);
//                 return true;
//             } else {
//                 return false;
//             }

//         });
//         if (!myuser) {
//             projectUsersUpdate.push({
//                 user_id: click_project_details.users[i].Usr_ID,
//                 user_role: "noRole",
//                 user_email: click_project_details.users[i].user_email,
//                 user_old_role: click_project_details.users[i].Pro_Role
//             });
//         }

//     }
//     for (var i = 0; i < userProjectArr.length; i++) {
//         projectUsersUpdate.push({
//             user_id: userProjectArr[i].user_id,
//             user_role: userProjectArr[i].user_role,
//             user_email: userProjectArr[i].user_email,
//             user_old_role: "noOldRole"
//         });
//     }
//     console.log(projectUsersUpdate);

//     //project group users
//     if (userProjectGroupArr.length > 0) {
//         for (var i = 0; i < click_project_details.users.length; i++) {
//             var groupIDs = "";
//             if (click_project_details.users[i].project_group.length > 0) {
//                 var groupIDs = click_project_details.users[i].project_group; // array
//             }
//             var id = click_project_details.users[i].Usr_ID;
//             console.log(id);
//             console.log(groupIDs);
//             let mygroupuser = userProjectGroupArr.find((o, j) => {
//                 if (o.user_id == id) {
//                     console.log(o.user_id);
//                     let mygroup = userProjectGroupArr[j].user_group;
//                     console.log(mygroup);
//                     if (groupIDs == "") {
//                         console.log("had no group earlier");
//                         projectGroupUsersUpdate.push({
//                             user_id: o.user_id,
//                             user_group: o.user_group,
//                             user_email: o.user_email,
//                             user_old_group: "noOldGroup"
//                         });
//                     } else {
//                         var removegroup = [];

//                         groupIDs.forEach(function (value, index) {
//                             let pos = mygroup.indexOf(value);
//                             if (pos == -1) { //not part of current group need to remove
//                                 console.log("need to remove" + value);
//                                 removegroup.push(value);

//                             } else {
//                                 if (pos == 0) {
//                                     mygroup = mygroup.substring(value.length + 1);
//                                 } else {
//                                     mygroup = mygroup.substring(0, pos - 1);
//                                 }
//                             }
//                         })
//                         console.log(removegroup);
//                         console.log(mygroup);
//                         if (removegroup.length > 0 || mygroup != "") {
//                             var oldgroup = removegroup.join();
//                             if (oldgroup == "") {
//                                 oldgroup = "noOldGroup";
//                             };
//                             if (mygroup == "") {
//                                 mygroup = "noGroup";
//                             }
//                             projectGroupUsersUpdate.push({
//                                 user_id: o.user_id,
//                                 user_group: mygroup,
//                                 user_email: o.user_email,
//                                 user_old_group: oldgroup
//                             });
//                         }
//                     }
//                     userProjectGroupArr.splice(j, 1);
//                     return true;
//                 } else {
//                     return false;
//                 }

//             });
//             if (!mygroupuser && groupIDs != "") {
//                 projectGroupUsersUpdate.push({
//                     user_id: click_project_details.users[i].Usr_ID,
//                     user_group: "noGroup",
//                     user_email: click_project_details.users[i].user_email,
//                     user_old_group: click_project_details.users[i].project_group.join()
//                 });
//             }
//         }

//         for (var i = 0; i < userProjectGroupArr.length; i++) {
//             projectGroupUsersUpdate.push({
//                 user_id: userProjectGroupArr[i].user_id,
//                 user_group: userProjectGroupArr[i].user_group,
//                 user_email: userProjectGroupArr[i].user_email,
//                 user_old_group: "noOldGroup"
//             });
//         }
//     }
//     console.log(projectUsersUpdate);
//     console.log(projectGroupUsersUpdate);

//     var pid = $("#projectid").val();
//     var pname = $("#projectname").val();
//    // var powner = $("#projectowner").val(); // not allowed to change
//     // var pwpcid = $("#projectwpcid").val(); // not allowed to change
//     var pind = $("#projectIndustry").val();
//     var ptz = $("#projectTimezone option:selected").text();
//     var ptzvalue = $("#projectTimezone").val();
//     var ploc = $("#projectLocation").val();

//     var file = document.getElementById("imgInp").files[0];
//     var startdate = $("#projectstartdate").val();
//     var enddate = $("#projectenddate").val();
//     var duration = $("#projectduration").val();
//     var contractorOrg = contractorSelectizeOrg;
//     var consultantOrg = consultantSelectizeOrg.join(";");

//     var formdata = new FormData();
//     var lat1 = radians_to_degrees(firstPoint.latitude).toFixed(4);
//     var lat2 = radians_to_degrees(tempCartographic.latitude).toFixed(4);
//     var long1 = radians_to_degrees(firstPoint.longitude).toFixed(4);
//     var long2 = radians_to_degrees(tempCartographic.longitude).toFixed(4);

//     if (
//         firstPoint.latitude == 0 &&
//         tempCartographic.latitude == 0 &&
//         $("#lat1").html() !== ""
//     ) {
//         lat1 = $("#lat1").html();
//         lat2 = $("#lat2").html();
//         long1 = $("#long1").html();
//         long2 = $("#long2").html();
//     }

//     formdata.append("projectidnumber", click_project_details.projectidnumber);
//     formdata.append("projectid", pid);
//     formdata.append("projectname", pname);
//     //formdata.append("projectowner", powner); //not allowed to change
//     //formdata.append("projectwpcid", pwpcid); //not allowed to change

//     if (pind) {
//         formdata.append("industry", pind);
//     }
//     if (ptzvalue) {
//         formdata.append("timezoneval", ptzvalue);
//     }
//     if (ptz) {
//         formdata.append("timezonetext", ptz);
//     }
//     if (ploc) {
//         formdata.append("location", ploc);
//     }

//     if (contractorOrg){
//         formdata.append("contractorOrg", contractorOrg); //to send to joget for adding contactor name in contracts
//     }
//     if(consultantOrg){
//         formdata.append("consultantOrg", consultantOrg); //to send to joget for adding consultant name in contracts
//     }


//     console.log(ownerOrgName);
//     formdata.append("contractee", ownerOrgName);

//     formdata.append("lat1", lat1);
//     formdata.append("lat2", lat2);
//     formdata.append("long1", long1);
//     formdata.append("long2", long2);
//     if (startdate || startdate !== click_project_details.startdate) {
//         formdata.append("startdate", startdate);
//     }
//     if (enddate || enddate !== click_project_details.enddate) {
//         formdata.append("enddate", enddate);
//     }
//     if (duration) {
//         formdata.append("duration", duration);
//     }
//     formdata.append("users", JSON.stringify(projectUsersUpdate));
//     formdata.append("userGroup", JSON.stringify(projectGroupUsersUpdate));
//     if (file) {
//         formdata.append("imgInp", file);
//     }
//     if (click_project_details.parentid == null) { //get the app links to update apps. apps are assigned to overall projects

//         $(".conAppList").each(function () {
//             let columnName = this.getAttribute("name");
//             let appValue = this.getAttribute("appValue");
//             formdata.append(columnName, appValue);
//         });
//         if ($('#jogetFinancePackage option:selected').val() != null) {
//             $(".finAppList").each(function () {
//                 let columnName = this.getAttribute("name");
//                 let appValue = this.getAttribute("appValue");
//                 formdata.append(columnName, appValue);
//             });
//         }
//         if ($('#jogetDocPackage option:selected').val() != null) {
//             $(".docAppList").each(function () {
//                 let columnName = this.getAttribute("name");
//                 let appValue = this.getAttribute("appValue");
//                 formdata.append(columnName, appValue);
//             });
//         }

//     } else {
//         formdata.append("parentid", click_project_details.parentid);
//     }
//     formdata.append("functionName", "updateProject");
//     $.ajax({
//         url: 'BackEnd/ProjectFunctions.php',
//         data: formdata,
//         processData: false,
//         contentType: false,
//         type: 'POST',
//         success: function (res) {
//             var data = JSON.parse(res)
//             $.alert({
//                 boxWidth: "30%",
//                 useBootstrap: false,
//                 title: "Message",
//                 content: data.msg,
//             });
//             if (data.data == "close") {
//                 console.log("closing")
//                 $(":input").val("");
//                 $("#addnewprojectForm").css("display", "none");
//                 $("#addnewprojectForm").removeClass("active");
//                 $("#projectimage").attr("src", "");
//                 selector.show = false;
//                 selector2.show = false;
//                 refreshProjectTableBody();
//                 updateProjectCard();
//             }
//         }
//     })

// }

// Archive Project when click wizard button - handled in v3.js
// function OnClickProjectArchive() {
//     event.preventDefault();
//     var message = "Are you sure you want to archive the Project : " + document.getElementById("projectnamedisplay").innerText + "?";
//     $.confirm({
//         boxWidth: '30%',
//         useBootstrap: false,
//         title: 'Confirm!',
//         content: message,
//         buttons: {
//             confirm: function () {
//                 showLoader()
//                 var arr = [];
//                 arr[0] = document.getElementById("projectidnumber").value;
//                 var formdata = new FormData();
//                 formdata.append("functionName", "archiveProject");
//                 formdata.append("project_id_number", JSON.stringify(arr));

//                 $.ajax({
//                     type: "POST",
//                     url: "BackEnd/ProjectFunctions.php",
//                     dataType: "json",
//                     data: formdata,
//                     processData: false,
//                     contentType: false,
//                     success: function (res) {
//                         var obj = res
//                         $.alert({
//                             boxWidth: '30%',
//                             useBootstrap: false,
//                             title: "Message",
//                             content: obj.msg,
//                         });
//                         $('#addnewprojectForm').css('display', 'none');
//                         $('#addnewprojectForm').removeClass('active');
//                         refreshProjectTableBody();
//                         refreshInformation();
//                         refreshDeleteProjectTableBody();
//                         hideLoader()
//                     },
//                     error: function (xhr, textStatus, errorThrown) {
//                         var str = textStatus + " " + errorThrown;
//                         console.log(str);
//                     }
//                 })
//             },
//             cancel: function () {
//                 return;
//             },
//         },
//     });
// }

//Archive project(s) when click on archive project button in active project list
function OnClickSysadminDeleteProject() {
    var arr = [], name = [];
    if (document.getElementById('checkAllProjects').checked) {
        name.push("All projects");
        $("input.ptable:checkbox:checked").each(function () {
            arr.push(parseInt($(this).data("projectid")));
        });
    } else {
        $('input.ptable:checkbox:checked').each(function () {
            arr.push(parseInt($(this).data("projectid")));
            name.push($(this).parent().parent().find('div.name').children('span').text());
        });
    }

    var message = "Are you sure you want to archive these Projects :  <br> ";
    //"Are you sure you want to archive these Projects :  <br> <br>" + name + "? <br> <br> Please note that if an overall project is archived its package projects will also be archived!";
    for (var k = 0; k < name.length; k++) {
        message += "<br>" + name[k];
    };
    message += " ?<br> <br> Please note that if an overall project is archived its package projects will also be archived!";
    window.parent.$.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Confirm!",
        content: message,
        buttons: {
            confirm: function () {
                showLoader()
                $("#sysadmindeleteProject").fadeOut("fast");
                $("#main-project .checkcounter #projectchecked").html("");
                $("#main-project .checkcounter #projectchecked").fadeOut("fast");
                var formdata = new FormData();
                formdata.append("functionName", "archiveProject");
                formdata.append("project_id_number", JSON.stringify(arr));

                if(SYSTEM =='OBYU'){
                    ajaxUrl = "BackEnd/ProjectFunctionsOBYU.php";
                }else{
                    ajaxUrl = "BackEnd/ProjectFunctionsV3.php";
                }

                $.ajax({
                    type: "POST",
                    url: ajaxUrl,
                    dataType: "json",
                    data: formdata,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        var obj = res
                        window.parent.$.alert({
                            boxWidth: '30%',
                            useBootstrap: false,
                            title: "Message",
                            content: obj.msg,
                        });
                        window.parent.wizardCancelPage()
                        hideLoader()
                        refreshProjectTableBody();
                        updateProjectCard();
                        refreshDeleteProjectTableBody();
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        var str = textStatus + " " + errorThrown;
                        console.log(str);
                    }
                })

            },
            cancel: function () {

            },
        }
    });
}

// handled in v3.js
// function OnClickProjectRestore() {
//     event.preventDefault();
//     var projectid = [];
//     projectid.push(click_project_details.projectidnumber);
//     var message = "Are you sure you want to recover this Project? : " + projectid[0] + "?";
//     $.confirm({
//         boxWidth: '30%',
//         useBootstrap: false,
//         title: 'Confirm!',
//         content: message,
//         buttons: {
//             confirm: function () {
//                 var formdata = new FormData();
//                 formdata.append("project_id_number", JSON.stringify(projectid));
//                 formdata.append("functionName", "recoverProject");
//                 $.ajax({
//                     type: "POST",
//                     url: "BackEnd/ProjectFunctions.php",
//                     dataType: "json",
//                     data: formdata,
//                     processData: false,
//                     contentType: false,
//                     success: function (res) {
//                         var obj = res
//                         $.alert({
//                             boxWidth: "30%",
//                             useBootstrap: false,
//                             title: "Message",
//                             content: obj.message,
//                         });
//                         $("#addnewprojectForm").css("display", "none");
//                         $("#addnewprojectForm").removeClass("active");
//                         refreshDeleteProjectTableBody();
//                         refreshProjectTableBody();
//                         updateProjectCard();
//                     },
//                     error: function (xhr, textStatus, errorThrown) {
//                         var str = textStatus + " " + errorThrown;
//                         console.log(str);
//                     },
//                 });
//             },
//             cancel: function () {
//                 return;
//             },
//         },
//     });
// }

//Restore project(s) when click on archive project button in active project list
function OnClickSysadminRecoverProjects() {
    var arr = [], name = [];
    var packageArr = [], packageName = [];
    if (document.getElementById("checkAllDeletedProjects").checked) { //if all projects are checked
        name.push("All Archived  Overall & Package Projects");
        $("input.deleteptable:checkbox:checked").each(function () {
            arr.push(parseInt($(this).data("projectid")));
        });
    } else {
        $('input.deleteptable:checkbox:checked').each(function () {
            arr.push(parseInt($(this).data("projectid")));
            name.push($(this).parent().parent().find('div.name').children('span').text());
        });
    }
    // "Are you sure you want to recover these Projects : <br> <br>\
    // "+ name + "? <br> <br>\
    //  Please note that you need to recover the parent overall project first to recover the package projects.";
    var message = "Are you sure you want to recover these Projects : <br>";
    for (var k = 0; k < name.length; k++) {
        message += "<br>" + name[k];
    }
    message += "? <br><br>Please note that you need to recover the parent overall project to recover the package projects.";
    window.parent.$.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Confirm!",
        content: message,
        buttons: {
            confirm: function () {
                showLoader()
                $("#archived-project .checkcounter #archivedprojectchecked").html("");
                $("#archived-project .checkcounter #archivedprojectchecked").fadeOut(
                    "fast"
                );
                var formdata = new FormData();
                formdata.append("project_id_number", JSON.stringify(arr));
                formdata.append("functionName", "recoverProject");

                if(SYSTEM =='OBYU'){
                    ajaxUrl = "BackEnd/ProjectFunctionsOBYU.php";
                }else{
                    ajaxUrl = "BackEnd/ProjectFunctionsV3.php";
                }

                $.ajax({
                    type: "POST",
                    url: ajaxUrl,
                    dataType: "json",
                    data: formdata,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        var obj = res
                        window.parent.$.alert({
                            boxWidth: "30%",
                            useBootstrap: false,
                            title: "Message",
                            content: obj.message,
                        });
                        window.parent.wizardCancelPage()
                        hideLoader()
                        refreshDeleteProjectTableBody();
                        refreshProjectTableBody();
                        updateProjectCard();
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        var str = textStatus + " " + errorThrown;
                        console.log(str);
                    },
                });
            },
            cancel: function () {
                return;
            },
        },
    });
}

// Delete Project Permanent when click wizard - handled in v3.js
// function OnClickProjectDeletePermanent() {
//     event.preventDefault();
//     var projectid = [];
//     projectid.push(click_project_details.projectidnumber);

//     var message = "Are you sure you want to delete this Project permanently from the Database: " + projectid[0] + "?";
//     $.confirm({
//         boxWidth: "30%",
//         useBootstrap: false,
//         title: "Confirm!",
//         content: message,
//         buttons: {
//             confirm: function () {
//                 var formdata = new FormData();
//                 formdata.append("project_id_number", JSON.stringify(projectid));
//                 formdata.append("functionName", "deleteProject");
//                 var request = new XMLHttpRequest();
//                 request.open("POST", "BackEnd/ProjectFunctions.php", true);
//                 request.send(formdata);
//                 request.onreadystatechange = function () {
//                     if (request.readyState == 4 && request.status == "200") {
//                         let jsonParse = JSON.parse(request.responseText);
//                         $.alert({
//                             boxWidth: "30%",
//                             useBootstrap: false,
//                             title: "Message",
//                             content: jsonParse.message,
//                         });
//                         $("#addnewprojectForm").css("display", "none");
//                         $("#addnewprojectForm").removeClass("active");
//                         refreshDeleteProjectTableBody();
//                         updateProjectCard();
//                     }
//                 };
//             },
//             cancel: function () {
//                 return
//             }
//         }
//     });
// }

//Delete project(s) when click on archive project button in inactive project list
function OnClickSysadminDeletePermanentProjects() {
    var arr = [], name = [], parentArr = [];

    if (document.getElementById("checkAllDeletedProjects").checked) {
        name.push("All Archived Projects");
        $("input.deleteptable:checkbox:checked").each(function () {
            arr.push(parseInt($(this).data("projectid")));
        });
    } else {
        $("input.deleteptable:checkbox:checked").each(function () {
            arr.push(parseInt($(this).data("projectid")));
            name.push($(this).parent().parent().find('div.name').children('span').text());
            var pID = (parseInt($(this).data("parentprojectid")));
            if (Number.isNaN(pID)) {
                parentArr.push(parseInt($(this).data("projectid")));
            }

        });
        for (var i = 0; i < parentArr.length; i++) {
            $("input.deleteptable:checkbox").each(function () {
                var pID = (parseInt($(this).closest("tr").find("td:eq(7)").text()));
                if (pID == parentArr[i]) {
                    let id = (parseInt($(this).attr("id")));
                    var j = 0,
                        myflag = false;
                    while (j < arr.length) {
                        if (arr[j] == id) {
                            myflag = true;
                            break
                        };
                        j++;
                    }
                    if (!myflag) {
                        arr.push(id);
                        name.push($(this).closest("tr").find("td:eq(3)").text());
                        $(this).prop("checked", true);
                    }
                }
            });
        }

    }
    var message = "Are you sure you want to delete these Projects permanently from the Database: <br>";
    for (var j = 0; j < name.length; j++) {
        message += "<br>" + name[j];
    }
    message += "? <br> <br> Please note that all package projects of an overall project will also be deleted if an overall project is deleted!"
    window.parent.$.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Confirm!",
        content: message,
        buttons: {
            confirm: function () {
                showLoader()
                $("#systemadminrecoverProject").fadeOut("fast");
                $("#systemadmindeleteparmanentProject").fadeOut("fast");
                $("#archived-project .checkcounter #archivedprojectchecked").html("");
                $("#archived-project .checkcounter #archivedprojectchecked").fadeOut(
                    "fast"
                );

                if(SYSTEM =='OBYU'){
                    ajaxUrl = "BackEnd/ProjectFunctionsOBYU.php";
                }else{
                    ajaxUrl = "BackEnd/ProjectFunctionsV3.php";
                }

                var formdata = new FormData();
                formdata.append("project_id_number", JSON.stringify(arr));
                formdata.append("functionName", "deleteProject");
                var request = new XMLHttpRequest();
                request.open("POST", ajaxUrl, true);
                request.send(formdata);
                request.onreadystatechange = function () {
                    if (request.readyState == 4 && request.status == "200") {
                        let jsonParse = JSON.parse(request.responseText);
                        window.parent.$.alert({
                            boxWidth: "30%",
                            useBootstrap: false,
                            title: "Message",
                            content: jsonParse.message,
                        });
                        window.parent.wizardCancelPage()
                        hideLoader()
                        refreshDeleteProjectTableBody();
                        updateProjectCard();
                    }
                };
            },
            cancel: function () {
                return;
            },
        },
    });
}

function checkAllFormContractorUsers(ele) {
    var checkboxes = document.getElementsByClassName("addcontractusertable");
    var slt = document.getElementsByClassName("addcontractuserselect");
    if (ele.checked) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (!slt[i].value) {
                slt[i].value = ""
                slt[i].checked = true
            }

            if (checkboxes[i].type == 'checkbox') {
                checkboxes[i].checked = true;
            }
            slt[i].style.display = 'block';
            $(".appearoncheck").css('display', 'block');
        }
    } else {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == "checkbox") {
                checkboxes[i].checked = false;
            }
            slt[i].style.display = "none";
            slt[i].value = ""
            $(".appearoncheck").css("display", "none");
        }
    }
}

function checkAllFormConsultantUsers(ele) {
    var checkboxes = document.getElementsByClassName("addconsultantusertable");
    var slt = document.getElementsByClassName("addconsultantuserselect");
    if (ele.checked) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (!slt[i].value) {
                slt[i].value = ""
                slt[i].checked = true
            }

            if (checkboxes[i].type == 'checkbox') {
                checkboxes[i].checked = true;
            }
            slt[i].style.display = 'block';
            $(".appearoncheck").css('display', 'block');
        }
    } else {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == "checkbox") {
                checkboxes[i].checked = false;
            }
            slt[i].style.display = "none";
            slt[i].value = ""
            $(".appearoncheck").css("display", "none");
        }
    }
}

function checkAllProjects(ele) {
    var checkboxes = document.getElementsByClassName("ptable");
    if (ele.checked) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == "checkbox") {
                checkboxes[i].checked = true;
            }
        }
        $("#sysadmindeleteProject").fadeIn("fast");

        let $countchecked = $("table input[type=checkbox]:checked").length;
        let $countnumber = ($countchecked -= 1);
        $("#main-project .checkcounter #projectchecked").html(
            "Selected:" + $countnumber
        );
        $("#main-project .checkcounter #projectchecked").fadeIn("fast");
    } else {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == "checkbox") {
                checkboxes[i].checked = false;
            }
        }
        $("#sysadmindeleteProject").fadeOut("fast");
        $("#main-project .checkcounter #projectchecked").html("");
        $("#main-project .checkcounter #projectchecked").fadeOut("fast");
    }
}

function checkAllDeletedProjects(ele) {
    var checkboxes = document.getElementsByClassName("deleteptable");
    if (ele.checked) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == "checkbox") {
                checkboxes[i].checked = true;
            }
        }
        $("#systemadminrecoverProject").fadeIn("fast");
        $("#systemadmindeleteparmanentProject").fadeIn("fast");

        let $countchecked = $("table input[type=checkbox]:checked").length;
        let $countnumber = ($countchecked -= 1);
        $("#archived-project .checkcounter #archivedprojectchecked").html(
            "Selected:" + $countnumber
        );
        $("#archived-project .checkcounter #archivedprojectchecked").fadeIn("fast");
    } else {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == "checkbox") {
                checkboxes[i].checked = false;
            }
        }
        $("#systemadminrecoverProject").fadeOut("fast");
        $("#systemadmindeleteparmanentProject").fadeOut("fast");

        $("#archived-project .checkcounter #archivedprojectchecked").html("");
        $("#archived-project .checkcounter #archivedprojectchecked").fadeOut(
            "fast"
        );
    }
}

function checkAllUsers(ele) {
    var checkboxes = document.getElementsByClassName("utable");
    if (ele.checked) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == "checkbox") {
                checkboxes[i].checked = true;
            }
        }
        $("#sysadmindeleteUser").fadeIn("fast");
        var email = localStorage.signed_in_email;
        $("input.utable:checkbox:checked").each(function () {
            if (email == $(this).closest("tr").find("td:eq(2)").text()) {
                $(this).prop("checked", false);
            }
        });
        let $countchecked = $("table input[type=checkbox]:checked").length;
        let $countnumber = ($countchecked -= 1);
        $("#main-user .checkcounter #userchecked").html("Selected:" + $countnumber);
        $("#main-user .checkcounter #userchecked").fadeIn("fast");
    } else {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == "checkbox") {
                checkboxes[i].checked = false;
            }
        }
        $("#sysadmindeleteUser").fadeOut("fast");
        $("#main-user .checkcounter #userchecked").html("");
        $("#main-user .checkcounter #userchecked").fadeOut("fast");
    }
}

function checkAllDeletedUsers(ele) {
    var checkboxes = document.getElementsByClassName("deleteutable");
    if (ele.checked) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == "checkbox") {
                checkboxes[i].checked = true;
            }
        }
        $("#systemadminrecoverUser").fadeIn("fast");
        $("#systemadmindeleteparmanentUser").fadeIn("fast");
        let $countchecked = $("table input[type=checkbox]:checked").length;
        let $countnumber = ($countchecked -= 1);
        $("#archived-user .checkcounter #archiveduserchecked").html(
            "Selected:" + $countnumber
        );
        $("#archived-user .checkcounter #archiveduserchecked").fadeIn("fast");
    } else {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == "checkbox") {
                checkboxes[i].checked = false;
            }
        }
        $("#systemadminrecoverUser").fadeOut("fast");
        $("#systemadmindeleteparmanentUser").fadeOut("fast");
        $("#archived-user .checkcounter #archiveduserchecked").html("");
        $("#archived-user .checkcounter #archiveduserchecked").fadeOut("fast");
    }
}

// fucntion to refresh userTableBody
function refreshUserTableBody(val, varType) {
    if (!val){
        pid = "None";
    }else if (varType == 'int') {
        pid = val;
        console.log("not array : " + pid)
    }else{
        pid = val.value;
    }

    if(SYSTEM =='OBYU'){
        ajaxUrl = "BackEnd/UserFunctionsOBYU.php";
    }else{
        ajaxUrl = "BackEnd/UserFunctionsV3.php";
    }

    $.ajax({
        url: ajaxUrl,
        type: "POST",
        dataType: "json",
        data: {
            project_id: pid,
            functionName: 'getAllUsers'
        },
        success: function (response) {
            var myhtml = "";
            for (var i = 0; i < response.length; i++) {
                let userType = '';
                let userSupport = '';
                switch (response[i].user_type) {
                    case "user":
                        userType = "User";
                        break;
                    case "system_admin":
                        userType = "System Admin";
                        break;
                }
                if (response[i].support_user == true) {
                    userSupport = "Yes";
                }else{
                    userSupport = "No";
                }

                myhtml += 
                    `<div class="row system-admin fiveColumn searchv3" rel="editUser" data-width="55" data-height="80" data-uid="${response[i].user_id}" data-name="${response[i].user_firstname} ${response[i].user_lastname}" data-title="Active User" data-activearchived="active" onclick="openWizardV3(this, event)">
                        <span class="text columnSmall"><input class="utable user-active" type="checkbox" data-page="user-active" data-table="utable" onchange="onchangeButtonVisibility(this)" data-userid= '${response[i].user_id}'></span>
                        <div class="columnMiddle textContainer">
                            <span class="text line-clamp" title="Active User Email">${response[i].user_email}</span>
                        </div>
                        <div class="columnMiddle textContainer">
                            <span class="text line-clamp">${response[i].user_firstname} ${response[i].user_lastname}</span>
                        </div>
                        <div class="columnMiddle textContainer">
                            <span class="text line-clamp">${response[i].orgName}</span>
                        </div>
                        <div class="columnMiddle textContainer">
                            <span class="text line-clamp">${response[i].user_country}</span>
                        </div>
                        <div class="columnMiddle textContainer">
                            <span class="text line-clamp">${userType}</span>
                        </div>
                        <div class="columnMiddle textContainer">
                            <span class="text line-clamp">${userSupport}</span>
                        </div>
                    </div>`;
            };
            $('#userTableBody').html(myhtml);
        },
    });


}

// fucntion to refresh deleteUserTableBody
function refreshDeleteUserTableBody() {
    if(SYSTEM =='OBYU'){
        ajaxUrl = "BackEnd/UserFunctionsOBYU.php";
    }else{
        ajaxUrl = "BackEnd/UserFunctionsV3.php";
    }

    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: {
            functionName: "refreshDeleUserTableBody"
        },
        dataType: "json",
        success: function (response) {
            var myhtml = "";
            for (var i = 0; i < response.length; i++) {
                myhtml +=
                `<div class="row system-admin fourColumn searchv3" rel="editUser" data-width="55" data-height="80" data-uid="${response[i].user_id}" data-name="${response[i].user_firstname} ${response[i].user_lastname}" data-title="Archived User" data-activearchived="archived" onclick="openWizardV3(this, event)">
                    <span class="text columnSmall"><input class="utable user-inactive" type="checkbox"  data-page="user-inactive" data-table="utable" onchange="onchangeButtonVisibility(this)" id= '${response[i].user_id}'></span>
                    <div class="columnMiddle textContainer">
                        <span class="text line-clamp" title="Inactive User Email">${response[i].user_email}</span>
                    </div>
                    <div class="columnMiddle textContainer">
                        <span class="text line-clamp">${response[i].user_firstname} ${response[i].user_lastname}</span>
                    </div>
                    <div class="columnMiddle textContainer">
                        <span class="text line-clamp">${response[i].orgName}</span>
                    </div>
                    <div class="columnMiddle textContainer">
                        <span class="text line-clamp">${response[i].user_country}</span>
                    </div>
                </div>`;
            }
            $("#deleteUserTableBody").html(myhtml);
        },
    });
}

// function to refresh projectTableBody
function refreshProjectTableBody(filter) {
    if(SYSTEM == 'OBYU'){
        ajaxUrl = 'BackEnd/ProjectFunctionsOBYU.php';
    }else{
        ajaxUrl = 'BackEnd/ProjectFunctionsV3.php';
    }
    $.ajax({
        url: ajaxUrl,
        type: "POST",
        dataType: "json",
        data: {
            functionName: "refreshProjecTableBody",
            filter: filter
        },
        success: function (response) {
            var projectHtml = "";
            var packageHtml = "";
            for (var i = 0; i < response.length; i++) {
                if (response[i].parent_project_id_number == null) { //overall project
                    projectHtml +=
                        `<div class="row system-admin fiveColumn searchv3"  onclick="onclickProjectFilter(this, event)">
                            <span class="columnSmall"><input class="ptable project-active" type ="checkbox" data-page="project-active" data-projectid="${response[i].project_id_number}" data-parentprojectid="${response[i].parent_project_id_number}" data-table="ptable" data-ptypetable="activeProjectTable" onchange="onchangeButtonVisibilityProject(this)"></span>
                            <span class="columnSmall align-center"><i class="fa-solid fa-circle-info" rel="editProject" data-width="75" data-height="80" data-projecttype="${response[i].project_type}" data-projectid="${response[i].project_id_number}" data-projectowner="${response[i].project_owner}" data-title="Active Project" data-activearchived="active" onclick="openWizardV3(this, event);"></i></span>
                            <div class="columnMiddle textContainer id"><span class="text line-clamp">${(response[i].project_id) ? response[i].project_id: 'N/A'}</span></div>
                            <div class="columnMiddle textContainer name"><span class="text line-clamp">${(response[i].project_name) ? response[i].project_name: 'N/A'}</span></div>
                            <div class="columnMiddle textContainer industry"><span class="text line-clamp">${(response[i].industry) ? response[i].industry: 'N/A'}</span></div>
                            <div class="columnMiddle textContainer location"><span class="text line-clamp">${(response[i].location) ? response[i].location: 'N/A'}</span></div>`;
                            if(SYSTEM == 'OBYU'){
                                projectHtml += `<div class="columnMiddle textContainer owner"><span class="text line-clamp">${(response[i].project_owner) ? response[i].project_owner: 'N/A'}</span></div>`
                            }
                            projectHtml += `<div class="columnMiddle textContainer member"><span class="text line-clamp">${(response[i].Frequency) ? response[i].Frequency: 'N/A'}</span></div>
                        </div>`
                } else { //package project
                    packageHtml +=
                        `<div class="row system-admin fiveColumn searchv3" onclick="onclickProjectFilter(this, event)">
                            <span class="columnSmall"><input class="ptable project-active" type ="checkbox" data-page="project-active" data-projectid="${response[i].project_id_number}" data-parentprojectid="${response[i].parent_project_id_number}" data-table="ptable" data-ptypetable="activePackageTable" onchange="onchangeButtonVisibilityProject(this)"></span>
                            <span class="columnSmall align-center"><i class="fa-solid fa-circle-info" rel="editProject" data-width="75" data-height="80" data-projecttype="${response[i].project_type}" data-projectid="${response[i].project_id_number}" data-projectowner="${response[i].project_owner}" data-parentid="${response[i].parent_project_id_number}" data-title="Active Package"  data-activearchived="active" onclick="openWizardV3(this, event);"></i></span>
                            <div class="columnMiddle textContainer id"><span class="text line-clamp">${(response[i].project_id) ? response[i].project_id: 'N/A'}</span></div>
                            <div class="columnMiddle textContainer name"><span class="text line-clamp">${(response[i].project_name) ? response[i].project_name: 'N/A'}</span></div>
                            <div class="columnMiddle textContainer industry"><span class="text line-clamp">${(response[i].industry) ? response[i].industry: 'N/A'}</span></div>
                            <div class="columnMiddle textContainer location"><span class="text line-clamp">${(response[i].location) ? response[i].location: 'N/A'}</span></div>`
                            if(SYSTEM == 'OBYU'){
                                packageHtml += `<div class="columnMiddle textContainer owner"><span class="text line-clamp">${(response[i].project_owner) ? response[i].project_owner: 'N/A'}</span></div>`
                            }
                            packageHtml += `<div class="columnMiddle textContainer member"><span class="text line-clamp">${(response[i].Frequency) ? response[i].Frequency: 'N/A'}</span></div>
                        </div>`
                }
                $("#activeProjectTable").html(projectHtml);
                $("#activePackageTable").html(packageHtml);
            };
        }
    });
}

// fucntion to refresh deletePojectTableBody
function refreshDeleteProjectTableBody() {
    if(SYSTEM == 'OBYU'){
        ajaxUrl = 'BackEnd/ProjectFunctionsOBYU.php';
    }else{
        ajaxUrl = 'BackEnd/ProjectFunctionsV3.php';
    }
    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: {
            functionName: "refreshDeletProjectTableBody"
        },
        dataType: "json",
        success: function (response) {
            var myhtml = "";
            var packageHtml = "";
            for (var i = 0; i < response.length; i++) {
                if (response[i].parent_project_id_number == null) { //overall project
                    myhtml +=
                        `<div class="row system-admin fiveColumn searchv3" onclick="onclickProjectFilter(this, event)">
                            <span class="columnSmall"><input class="deleteptable project-inactive" type ="checkbox" data-page="project-inactive" data-projectid="${response[i].project_id_number}" data-parentprojectid="${response[i].parent_project_id_number}" data-table="deleteptable" data-ptypetable="deleteProjectTableBody" onchange="onchangeButtonVisibilityProject(this)"></span>
                            <span class="columnSmall align-center"><i class="fa-solid fa-circle-info" rel="editProject" data-width="75" data-height="80" data-projectid="${response[i].project_id_number}" data-title="Archived Project"  data-activearchived="archived" onclick="openWizardV3(this, event)"></i></span>
                            <div class="columnMiddle textContainer id"><span class="text line-clamp">${(response[i].project_id) ? response[i].project_id: 'N/A'}</span></div>
                            <div class="columnMiddle textContainer name"><span class="text line-clamp">${(response[i].project_name) ? response[i].project_name: 'N/A'}</span></div>
                            <div class="columnMiddle textContainer industry"><span class="text line-clamp">${(response[i].industry) ? response[i].industry: 'N/A'}</span></div>
                            <div class="columnMiddle textContainer location"><span class="text line-clamp">${(response[i].location) ? response[i].location: 'N/A'}</span></div>`
                            if(SYSTEM == 'OBYU'){
                                myhtml += `<div class="columnMiddle textContainer owner"><span class="text line-clamp">${(response[i].project_owner) ? response[i].project_owner: 'N/A'}</span></div>`
                            }
                            myhtml += `<div class="columnMiddle textContainer member"><span class="text line-clamp">${(response[i].Frequency) ? response[i].Frequency: 'N/A'}</span></div>
                        </div>`
                } else { //package project
                    packageHtml +=
                        `<div class="row system-admin fiveColumn searchv3" onclick="onclickProjectFilter(this, event)">
                            <span class="columnSmall"><input class="deleteptable project-inactive" type ="checkbox" data-page="project-inactive" data-projectid="${response[i].project_id_number}" data-parentprojectid="${response[i].parent_project_id_number}" data-table="deleteptable" data-ptypetable="deletePackageTableBody" onchange="onchangeButtonVisibilityProject(this)"></span>
                            <span class="columnSmall align-center"><i class="fa-solid fa-circle-info" rel="editProject" data-width="75" data-height="80" data-projectid="${response[i].project_id_number}" data-title="Archived Package"  data-activearchived="archived" onclick="openWizardV3(this, event)"></i></span>
                            <div class="columnMiddle textContainer id"><span class="text line-clamp">${(response[i].project_id) ? response[i].project_id: 'N/A'}</span></div>
                            <div class="columnMiddle textContainer name"><span class="text line-clamp">${(response[i].project_name) ? response[i].project_name: 'N/A'}</span></div>
                            <div class="columnMiddle textContainer industry"><span class="text line-clamp">${(response[i].industry) ? response[i].industry: 'N/A'}</span></div>
                            <div class="columnMiddle textContainer location"><span class="text line-clamp">${(response[i].location) ? response[i].location: 'N/A'}</span></div>`
                            if(SYSTEM == 'OBYU'){
                                packageHtml += `<div class="columnMiddle textContainer owner"><span class="text line-clamp">${(response[i].project_owner) ? response[i].project_owner: 'N/A'}</span></div>`
                            }
                            packageHtml += `<div class="columnMiddle textContainer member"><span class="text line-clamp">${(response[i].Frequency) ? response[i].Frequency: 'N/A'}</span></div>
                        </div>`
                }
            }
            $("#deleteProjectTableBody").html(myhtml);
            $("#deletePackageTableBody").html(packageHtml);
        },
    });
}

//function to refresh parentProjectIDList 
function refreshParentProjectIDList(name) {
    if(SYSTEM == 'OBYU'){
        ajaxUrl = 'BackEnd/ProjectFunctionsOBYU.php';
    }else{
        ajaxUrl = 'BackEnd/ProjectFunctionsV3.php';
    }
    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: {
            functionName: 'getParentProjectIDs'
        },
        success: function (response) {
            let mydata = JSON.parse(response);
            $('#parentid').empty();
            let mySelect = document.getElementById('parentid');
            var myOption = document.createElement("option");
            myOption.value = "";
            myOption.text = "Please Select ...";
            myOption.selected = true;
            myOption.disabled = true;
            mySelect.append(myOption);
            for (var i = 0; i < mydata.length; i++) {
                var myOption = document.createElement("option");
                myOption.value = mydata[i].project_id_number;
                myOption.text = mydata[i].project_id + "/" + mydata[i].project_name;
                myOption.setAttribute("projectOwner", mydata[i].project_owner);
                myOption.setAttribute("industry", mydata[i].industry);
                myOption.setAttribute("timeValue", mydata[i].time_zone_value);
                // myOption.setAttribute("project_type", mydata[i].project_type);
                // myOption.setAttribute("region", mydata[i].region);
                mySelect.append(myOption);
            }
            if (name) {//updating project
                mySelect.value = name; //setting the parent id value
                $("select#parentid").addClass("readonly");
                $("select#parentid").attr("disabled", true);

            }

        }
    });
}

//function to refresh the contractors and consultants select list
function refreshContractConsultantOrgList() {
    if(SYSTEM == 'OBYU'){
        ajaxUrl = 'BackEnd/UserFunctionsOBYU.php';
    }else{
        if(IS_DOWNSTREAM){
            ajaxUrl = 'BackEnd/UserFunctionsOBYU.php';
        }else{
            ajaxUrl = 'BackEnd/UserFunctionsV3.php';
        }
    }
    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: {
            functionName: 'getContractorsConsultantsOrg'
        },
        success: function (response) {
            let mydata = JSON.parse(response);
            $('#contractorSelector').empty();
            let contractSelect = document.getElementById('contractorSelector');
            $('#consultantSelector').empty();
            let consultSelect = document.getElementById('consultantSelector');
            var myOption = document.createElement("option");
            myOption.value = "";
            myOption.text = "Please Select ...";
            // myOption.disabled = true;
            contractSelect.append(myOption);
            var myOption1 = document.createElement("option");
            myOption1.value = "";
            myOption1.text = "Please Select ...";
            //myOption1.disabled = true;
            consultSelect.append(myOption1);
            for (var i = 0; i < mydata.length; i++) {
                var myOption = document.createElement("option");
                myOption.value = mydata[i].orgID;
                myOption.text = mydata[i].orgName;
                if (mydata[i].orgType == "consultant") {
                    consultSelect.append(myOption);
                } else if (mydata[i].orgType == "contractor") {
                    contractSelect.append(myOption);
                }

            }
            $('#addContractorUserTableBody').html("");
            $('#addConsultantUserTableBody').html("");

        }
    });

}

function OnClickImportUsers() {
    var inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = ".csv,text/csv";
    // set onchange event to call callback when user has selected file
    inputElement.addEventListener("change", handleFiles);
    // dispatch a click event to open the file dialog
    inputElement.dispatchEvent(new MouseEvent("click"));
}

function handleFiles(event) {
    [...this.files].forEach(file => {
        if (window.FileReader) {
            // FileReader are supported.
            getAsText(file);
        } else {
            window.parent.$.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'FileReader are not supported in this browser!',
            });
        }
    });
}

function getAsText(fileToRead) {
    var reader = new FileReader();
    // Read file into memory as UTF-8
    reader.readAsText(fileToRead);
    // Handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
}

function loadHandler(event) {
    var csv = event.target.result;
    processData(csv);
}

function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    for (var i = 0; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(';');
        var tarr = "";
        for (var j = 0; j < data.length; j++) {
            if (j != 0) {
                tarr += ",";
            }
            tarr += data[j];
        }
        lines.push(tarr);
    }
    console.log(lines);
    if (lines[0] !== "First Name,Last Name,Email,Organization ID,Organization Name,Organization Description,Organization Type,Country,User Type") {
        window.parent.$.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: "The data is not given in correct order. it should be in this order : First Name,Last Name,Email,Organization ID,Organization Name,Organization Description,Organization Type,Country,User Type "
        });
        return;
    }
    var formdata = new FormData();
    formdata.append("users", JSON.stringify(lines));
    var request = new XMLHttpRequest();
    request.open("POST", "BackEnd/importUsers.php", true);
    request.send(formdata);
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == "200") {
            var response = JSON.parse(request.responseText);
            var msg = response.msg;
            window.parent.$.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: msg
            });
            refreshUserTableBody();
            updateUserCard();
        };
    };
}

function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        window.parent.$.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Cannot read file!',
        });
    }
}

//get list of orgs from our DB(not joget)
function getListofOrg() {
    $.ajax({
        url: 'BackEnd/getListofOrg.php', // changed getting list from joget to our db
        type: "GET",
        dataType: 'json',
        success: function (response) {
            document.querySelectorAll('#userOrg option').forEach(option => option.remove());
            var myselect = document.getElementById('userOrg');
            var myoption = document.createElement("option");
            
            myoption.value = "";
            myoption.text = "Please Select ...";
            myoption.disabled = true;
            console.log(myoption)
            myselect.appendChild(myoption);
            for (var i = 0; i < response.length; i++) {
                var myoption = document.createElement("option");
                myoption.value = response[i].orgID;
                myoption.text = response[i].orgName;
                myselect.appendChild(myoption);
            }
            myselect.value = "";
        }
    });
}

function updateAllUserSelectOptions() { //on click add user get org selection values
    getListofOrg(); //getting list of orgs
    if ($('#createNewOrg').is(':checked')) {// remove the new org fields and set the org selection to nothing
        document.getElementById("newOrgDivContainer").style.display = "none";
        $('#neworg').prop('disabled', false);
        $('#createNewOrg').prop('checked', false);
    }

}

// click new Org button
function OnChangeNewOrg() {
    if ($('#createNewOrg').is(':checked')) {
        document.getElementById("newOrgID").value = "";
        document.getElementById("newOrgName").value = "";
        document.getElementById("newOrgDescription").value = "";
        document.getElementById("newOrgType").value = "";
        document.getElementById("newOrgDivContainer").style.display = "block";
        $('#neworg').val("");
        $('#neworg').prop('disabled', 'disabled'); //disable the selection of existing orgs
    } else {
        document.getElementById("newOrgDivContainer").style.display = "none";
        $('#neworg').prop('disabled', false); //enable selection of existing orgs
    }
}


function OnClickProjectRow(ele) {
    let myrow = ele.parentNode;
    let myTableBody = myrow.parentNode.id;
    let parentid = myrow.children[7].innerHTML.trim();
    if (myTableBody == "packageTableBody") {
        //package project need to check for parent project
        $("#unfilterProject").show()
        var rows = document.getElementById("projectTableBody").rows;
        for (var i = 0; i < rows.length; i++) {
            var td = rows[i].getElementsByTagName("td")[1].innerHTML.trim();
            if (td == parentid) {
                rows[i].style.display = "table-row"
            } else {
                rows[i].style.display = "none"
            }
        }

    } else if (myTableBody == "projectTableBody") {
        //overall project.. need to check for package project
        let myprojectid = myrow.children[1].innerHTML.trim();

        $("#unfilterPackage").show()

        var rows = document.getElementById("packageTableBody").rows;
        for (var i = 0; i < rows.length; i++) {
            var td = rows[i].getElementsByTagName("td")[7].innerHTML.trim();
            if (td == myprojectid) {
                //  document.getElementById("packageTableBody").rows[i].style.display
                rows[i].style.display = "table-row"
            } else {
                rows[i].style.display = "none"
            }

        }

    }
}

function OnClickArchivedProjectRow(ele) {
    let myrow = ele.parentNode;
    let myTableBody = myrow.parentNode.id;
    let parentid = myrow.children[7].innerHTML.trim();
    if (myTableBody == "deletePackageTableBody") {
        //package project need to check for parent project
        $("#unfilterArchivedProject").show()
        var rows = document.getElementById("deleteProjectTableBody").rows;
        for (var i = 0; i < rows.length; i++) {
            var td = rows[i].getElementsByTagName("td")[1].innerHTML.trim();
            if (td == parentid) {
                rows[i].style.display = "table-row"
            } else {
                rows[i].style.display = "none"
            }
        }

    } else if (myTableBody == "deleteProjectTableBody") {
        //overall project.. need to check for package project
        let myprojectid = myrow.children[1].innerHTML.trim();

        $("#unfilterArchivedPackage").show()

        var rows = document.getElementById("deletePackageTableBody").rows;
        for (var i = 0; i < rows.length; i++) {
            var td = rows[i].getElementsByTagName("td")[7].innerHTML.trim();
            if (td == myprojectid) {
                //  document.getElementById("packageTableBody").rows[i].style.display
                rows[i].style.display = "table-row"
            } else {
                rows[i].style.display = "none"
            }

        }

    }
}

function removeselected(e) {
    let $removeitem = $(e).attr("rel")
    let $removeitem2 = $(e).attr("rel2")
    $("#" + $removeitem).remove()

    $("option#" + $removeitem2).prop("disabled", false)

}

function clearFilter(e) {
    $(e).hide()
    refreshProjectTableBody()
}
function clearFilterArchived(e) {
    $(e).hide()
    refreshDeleteProjectTableBody()
}

function projectFilter(filter) {
    refreshProjectTableBody(filter);
    if (!$("#sidebar-admin").hasClass("active")) {
        openNavbar();
    }

    $("#main-home.active").css("display", "none");
    $("#main-home.active").removeClass("active");
    $("#main-user.active").css("display", "none");
    $("#main-user.active").removeClass("active");
    $("#archived-user.active").css("display", "none");
    $("#archived-user.active").removeClass("active");
    $("#archived-project.active").css("display", "none");
    $("#archived-project.active").removeClass("active");
    $("#main-account.active").css("display", "none");
    $("#main-account.active").removeClass("active");

    $("#main-project").fadeIn(150);
    $("#main-project").addClass("active");

    $(".sidebar-items .adminItems div.arrow.active").removeClass("active");
    $(".sidebar-items .adminItems#adminItems-project div.arrow").addClass(
        "active"
    );

    // show 'Show all button'
    $("#unfilterProject").show();
}

// to update User card in main page
function updateUserCard() {
    $.ajax({
        url: 'BackEnd/refreshCardInfo.php', // update admin dashboard card infomation
        type: "POST",
        dataType: "json",
        data: {
            cardType: "user",
        },
        success: function (res) {
            if (res.ok) {
                inActiveUserCnt = res.data.userTotal - res.data.userActive;
                percActive = (res.data.userTotal) ? (res.data.userActive / res.data.userTotal) * 100 : 0;

                $('.user-card-total').html(res.data.userTotal);
                $('.user-card-total').next('.primary').html((res.data.userTotal > 1) ? ' users are created.' : ' user are created.');
                $('.user-card-count > .active').html("<div></div>" + res.data.userActive + " active");
                $('.user-card-count > .inactive').html("<div></div>" + inActiveUserCnt + " inactive");
                $('.user-last-upd').html(res.data.userLastUpd);
                $('#userPercent').css('width', percActive + '%');
            }
        }
    });
}

// to update Project card in main page
function updateProjectCard() {
    $.ajax({
        url: 'BackEnd/refreshCardInfo.php', // update admin dashboard card infomation
        type: "POST",
        dataType: "json",
        data: {
            cardType: "project",
        },
        success: function (res) {
            if (res.ok) {
                $(".proj-card-active").html(res.data.projActive);
                $(".proj-card-inactive").html(res.data.projInactive);
                $(".proj-card-notaccess").html(res.data.projNotAccessByUser);
                $(".proj-card-noduration").html(res.data.projNoDuration);
                $(".proj-card-nolocation").html(res.data.projNoLoc);
                $(".proj-card-nouser").html(res.data.projNoUser);
                $(".proj-card-noadmin").html(res.data.projNoAdminUser);
                $(".proj-card-fin").html(res.data.projFinInTwoMon);

                // project wording
                $(".proj-txt-notaccess").html((res.data.projNotAccessByUser > 1) ? 'Projects' : 'Project');
                $(".proj-txt-noduration").html((res.data.projNoDuration > 1) ? 'Projects' : 'Project');
                $(".proj-txt-nolocation").html((res.data.projNoLoc > 1) ? 'Projects' : 'Project');
                $(".proj-txt-nouser").html((res.data.projNoUser > 1) ? 'projects' : 'project');
                $(".proj-txt-noadmin").html((res.data.projNoAdminUser > 1) ? 'projects' : 'project');
                $(".proj-txt-fin").html((res.data.projFinInTwoMon > 1) ? 'projects' : 'project');
            }
        }
    });
}

function setContractUsers() {
    $('input:checkbox[class ="addcontractusertable"]').each(function () {
        var i = 0;
        while (i < click_project_details.users.length) {
            if ($(this).attr("id") == click_project_details.users[i].user_id) {
                $(this).prop("checked", true);
                var id = "s" + $(this).attr("id");
                var slt = document.getElementById(id);
                slt.value = click_project_details.users[i].Pro_Role;
                slt.style.display = "block";
                break;
            }
            i++;
        }
    });

}

function setConsultantUsers() {
    $('input:checkbox[class ="addconsultantusertable"]').each(function () {
        var i = 0;
        while (i < click_project_details.users.length) {
            if ($(this).attr("id") == click_project_details.users[i].user_id) {
                $(this).prop("checked", true);
                var id = "s" + $(this).attr("id");
                var slt = document.getElementById(id);
                slt.value = click_project_details.users[i].Pro_Role;
                slt.style.display = "block";
                break;
            }
            i++;
        }
    });
}

function validateProjectDetails(callback) {
    var msg = "";
    var pid = $("#projectid").val();
    var pname = $("#projectname").val();
    var pidnumber = null;
    if (flagEdit) {
        pid = null;
        pidnumber = click_project_details.projectidnumber;
    }

    if(SYSTEM =='OBYU'){
        ajaxUrl = "BackEnd/ProjectFunctionsOBYU.php";
    }else{
        ajaxUrl = "BackEnd/ProjectFunctionsV3.php";
    }

    $.ajax({
        url: ajaxUrl, // to validate the project details
        type: "POST",
        dataType: "json",
        data: {
            functionName: "validateProjectDetails",
            project_id: pid,
            project_name: pname,
            project_id_number: pidnumber
        },
        success: function (res) {
            if (res.bool == false) {
                if (res.msg.pIdName) {
                    msg += res.msg.pIdName;
                    errorProjectID();//function to  higlight the error field by css
                };
                if (res.msg.pName) {
                    msg += " " + res.msg.pName;
                    errorProjectName();//function to  higlight the error field by css
                };

                callback(msg);
            } else {
                callback(true);
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            msg = textStatus + " " + errorThrown;
            callback(msg);
        },
    });
}

function getLicenseInfo() {
    if(SYSTEM == 'OBYU'){
        ajaxUrl = 'BackEnd/SystemFunctionsOBYU.php';
    }else{
        ajaxUrl = 'BackEnd/SystemFunctions.php';
    }

    $.ajax({
        url: ajaxUrl, // to validate the project details
        type: "POST",
        dataType: "json",
        data: {
            functionName: "getLicenseInfo"
        },
        success: function (res) {
            if(res && res.data && res.data[0]){
                //compute date duration from purchaseDate and expiryDate
                var duration = dateDiff(res.data[0]['PurchaseDate'], res.data[0]['ExpiryDate'])
                var duration_display = '' 

                $("#lic_accountId").html(res.data[0]['AccountId'])
                $("#lic_accountName").html(res.data[0]['Company'])
                $("#lic_accountContact").html(res.data[0]['ContactPerson'])
                $("#lic_accountEmail").html(res.data[0]['ContactEmail'])
                $("#lic_accountNumber").html(res.data[0]['ContactNumber'])
                $("#lic_accountPosition").html(res.data[0]['ContactPosition'])
                $("#lic_licenseType").html(res.data[0]['LicenseType'])
                $("#lic_hostingType").html(res.data[0]['HostingType'])
                
                if (res.data[0]['LicenseDuration'] && res.data[0]['LicenseDuration'] != ''){
                    duration_display = res.data[0]['LicenseDuration']
                }else{
                    duration_display = duration.years+' years'
                }
                $("#lic_licenseDuration").html(duration_display)
                $("#lic_licenseStart").html(res.data[0]['PurchaseDate'])
                $("#lic_licenseEnd").html(res.data[0]['ExpiryDate'])
                $("#licenseDatesLabel").html(`You had licensed Reveron Insights for a period of ${duration.years} year(s), started from ${res.data[0]['PurchaseDate']} to ${res.data[0]['ExpiryDate']}`)
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            msg = textStatus + " " + errorThrown;
        },
    });
}

//compute date duration from purchaseDate and expiryDate
function dateDiff(start, end) {
    startdate = start.split('-');
    enddate = end.split('-');
    var yy1 = parseInt(startdate[0]);
    var mm1 = parseInt(startdate[1]);
    var dd1 = parseInt(startdate[2]);
    var yy2 = parseInt(enddate[0]);
    var mm2 = parseInt(enddate[1]);
    var dd2 = parseInt(enddate[2]);
    var years, months, days;
    // months
    months = mm2 - mm1;
    if (dd2 < dd1) {
        months = months - 1;
    }
    // years
    years = yy2 - yy1;
    if (mm2 * 100 + dd2 < mm1 * 100 + dd1) {
        years = years - 1;
        months = months + 12;
    }
    // days
    days = Math.floor((new Date(end).getTime() - (new Date(yy1 + years, mm1 + months - 1, dd1)).getTime()) / (24 * 60 * 60 * 1000));
    //
    return { years: years, months: months, days: days };
}

drawProjctUserChart = (data) =>{
    var userDataArr = [];
    var projDataArr = [];
    var warnHTML = '';

   
    if(data.userInfo){
        for(const [idx, ele] of Object.entries(data.userInfo)){
            userDataArr.push({name: idx, y: (ele) ? parseFloat(ele): 0})
        }
    }

    if(data.projectInfo){
        for(const [idx, ele] of Object.entries(data.projectInfo)){
            projDataArr.push({name: idx, y: (ele) ? parseFloat(ele): 0})
        }
    }

    Highcharts.setOptions({
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: ['viewFullscreen']
                }
            }
        }
    });

    Highcharts.chart('userDataContainer', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        credits: {
            enabled: false
        },
        title: {
          text: 'User',
          align: 'center'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b>'
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
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.y}'
            }
          }
        },
        series: [{
            name: 'User(s)',
            colorByPoint: true,
            data: userDataArr,
            colors: colors,
            events: {
                click: function (event) {
                    var category = event.point.name;
                    if(category=='Active'){
                        closeAllMain()
                        $("#main-active-user").css("display", "block");
                        window.parent.$(".subButtonContainer #activeUser").addClass("active");
                    }else{
                        closeAllMain()
                        $("#main-inactive-user").css("display", "block");
                        window.parent.$(".subButtonContainer #inactiveUser").addClass("active");
                    }
                    
                }
            }
        }]
    });

    Highcharts.chart('projectDataContainer', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        credits: {
            enabled: false
        },
        title: {
          text: 'Project',
          align: 'center'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b>'
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
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.y}'
            }
          }
        },
        series: [{
          name: 'Project(s)',
          colorByPoint: true,
          data: projDataArr,
          colors: colors,
          events: {
            click: function (event) {
                var category = event.point.name;
                if(category=='Active'){
                    closeAllMain()
                    $("#main-active-project").css("display", "block");
                    window.parent.$(".subButtonContainer #activeProject").addClass("active");
                }else{
                    closeAllMain()
                    $("#main-archived-project").css("display", "block");
                    window.parent.$(".subButtonContainer #archivedProject").addClass("active");
                }
                
            }
        }
        }]
    });

    if(data.warning){
        if(data.warning.projNoDuration){
            warnHTML += `<div class="notiLabel">
                            <span class="notiSmallLabel"><i class="fa-solid fa-calendar-xmark"></i><i class="fa-solid fa-circle small"></i>
                                Duration
                            </span>
                            <span>${data.warning.projNoDuration} Projects not set with project duration</span>
                        </div>`
        }
        
        if(data.warning.projNoLoc){
            warnHTML += `<div class="notiLabel">
                            <span class="notiSmallLabel"><i class="fa-solid fa-location-dot"></i><i class="fa-solid fa-circle small"></i>
                                Location
                            </span>
                            <span>${data.warning.projNoLoc} Projects are missing area of extent (location)</span>
                        </div>`
        }

        if(data.warning.projNoUser){
            warnHTML += `<div class="notiLabel">
                            <span class="notiSmallLabel"><i class="fa-solid fa-users"></i><i class="fa-solid fa-circle small"></i>
                                User
                            </span>
                            <span>${data.warning.projNoUser}  Projects with no user defined</span>
                        </div>`
        }

        if(data.warning.projNoAdminUser){
            warnHTML += `<div class="notiLabel">
                            <span class="notiSmallLabel"><i class="fa-solid fa-user-xmark"></i><i class="fa-solid fa-circle small"></i>
                                Admin
                            </span>
                            <span>${data.warning.projNoAdminUser}  Projects has no admin</span>
                        </div>`
        }

        // if(data.warning.projFinInTwoMon){
        //     warnHTML += `<div class="notiLabel">
        //                     <span class="notiSmallLabel"><i class="fa-solid fa-question"></i><i class="fa-solid fa-circle small"></i>
        //                         Finish Project
        //                     </span>
        //                     <span>${data.warning.projFinInTwoMon} Projects are about to complete in two months</span>
        //                 </div>`
        // }
    }

    $('#warnHTML').html('').html(warnHTML)

}

refreshInformation = () =>{
    var myObj
    $.ajax({
        type: "POST",
        url: 'BackEnd/sysadminFetchData.php',
        success: function (obj) {
            myObj = JSON.parse(obj)

            drawProjctUserChart(myObj)
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    })
}