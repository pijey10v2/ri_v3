var userProjectArr = [];
var userProjectGroupArr = [];
var newuserlist = [];
var click_user_details;
var flagUserEdit = false;
var rowclicked;
var click_project_details;
var flagEdit = false;
var ownerOrgName;
var contractorSelectizeOrg;
var consultantSelectizeOrg = [];
var contractorSelect;
var consultantSelect;
var constructPackages =[];
var assetPackages =[];

var constructOwnerRoles = ["Bumi Officer","Construction Engineer","Corporate Comm Officer","Director","Doc Controller","Finance Head","Finance Officer","Land Officer","Planning Engineer","Project Manager","Project Monitor","QAQC Engineer","Risk Engineer","Safety Officer","Zone Manager"];
var assetOwnerRoles = ["Senior Quantity Surveyor", "Quantity Surveyor","Divisional Engineer","Assistant Director (Road Asset)","Assistant Engineer (Division)","Civil Engineer (Division)","Senior Civil Engineer (Road Asset)","Facility Management Department","Head of Contract","Head of Finance","Contract Assistance","Head of Section","Asset Engineer Section","Technical Inspector Section"];
var allOwnerRoles = constructOwnerRoles.concat(assetOwnerRoles)

// for process app (construct or asset)
var constructProcessApp = {
    "app_NOI":"Notice Of Improvement (NOI)",
    "app_NCR":"Non Conformance Report (NCR)",
    "app_WIR":"Work Inspection Request (WIR)",
    "app_DCR":"Design Change Request (DCR)",
    "app_RFI":"Request For Information (RFI)",
    "app_MOS":"Method Statement (MS)",
    "app_MS":"Material Acceptance (MT)",
    "app_IR":"Incident (INC)",
    "app_SDL":"Site Daily Log (SDL)",
    "app_SD":"Site Direction (SD)",
    "app_RS":"Report Submission (RS)",
    "app_SA":"Safety Activity (SA)",
    "app_SMH":"Total Man-Hours (SMH)",
    "app_RR":"Risk Register (RR)",
    "app_LR":"Land Registration (LR)",
    "app_LI":"Land Issue (LI)",
    "app_LE":"Land Encumbrances (LE)",
    "app_LS":"Land Summary (LS)",
    "app_PBC":"Public Complaint (PBC)",
    "app_DA":"Approved Design Drawing (DA)",
    "app_PU":"Progress Update (PU)",
    "app_RSDL":"RET’s Site Diary Log (RSDL)"
};

var assetProcessApp = {
    "app_asset_insp":"Inspection",
    "app_asset_assess":"Assesment",
    "app_asset_rm":"Routine Maintainence",
    "app_asset_pm":"Periodic Maintainence",
    "app_asset_ew":"Emergency Works",
    "app_asset_rfi":"Request for Inspection",
    "app_asset_ncp":"Non Conformance Product",
    "app_asset_pca":"Pavement Analysis Upload",
    "app_asset_setup":"Setup"
};

// for both
var constructProcess = {
    ...constructProcessApp,
    ...assetProcessApp
};

getListofOrg();
getListofPackages();

$(document).ready (function (){
    $('#supprotuser').css("display", "none");
    $('#supprotuserimg').css("display", "none");
    contractorSelect = $('#contractorSelector').selectize({
        placeholder: "Please Select ...",
        maxItems: 1,
        highlight: true,
        onChange: function (value) {
            OnChangeContractorSelection(value);
        }
    });

    consultantSelect = $('#consultantSelector').selectize({
        placeholder: "Please Select ...",
        maxOptions: 10,
        highlight: true,
        onChange: function (value) {
            OnChangeConsultantSelection(value);
        }
    });
    
    refreshUserTableBody()
    $('input[name="project_type"]').change(refreshUserTableBody)
});



function addAppList() {
    console.log(click_project_details.applist)
    var app_list = click_project_details.applist;
    if (app_list == null) return;
    
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

function projectDetail(ele) {
    let spanparent = $(ele).parent().parent();
    let idCol = $(spanparent).parent().siblings()[1]
    let projectidnumber = idCol.innerHTML.trim();


    $.ajax({
        type: "POST",
        url: "BackEnd/ProjectFunctions.php",
        dataType: "json",
        data: {
            functionName: "viewProject",
            project_id_number: projectidnumber
        },
        success: function (obj, textstatus) {
            if (!("error" in obj)) {
                $(".addnewprojectForm").show();
                readonlystateproject();
                var created_datetime;
                if (obj.data.created_time != null) {
                    created_datetime = new Date(obj.data.created_time).toDateString();
                } else {
                    created_datetime = "NULL";
                }
                var update_datetime;
                if (obj.data.last_update != null) {
                    update_datetime = new Date(obj.data.last_update).toDateString();
                    //update_datetime = update_datetime.toDateString();
                } else {
                    update_datetime = "NULL";
                }
                var startdate, enddate;
                if (obj.data.start_date != null) {
                    startdate = new Date(obj.data.start_date).toDateString();
                } else {
                    startdate = "";
                }
                if (obj.data.end_date != null) {
                    enddate = new Date(obj.data.end_date).toDateString();
                } else {
                    enddate = "";
                }

                lat1 = parseFloat(obj.data.latitude_1).toFixed(4);
                lat2 = parseFloat(obj.data.latitude_2).toFixed(4);
                long1 = parseFloat(obj.data.longitude_1).toFixed(4);
                long2 = parseFloat(obj.data.longitude_2).toFixed(4);
                let parentid;
                if (obj.data.parent_project_id_number == null) {
                    parentid = null;
                } else {
                    parentid = parseInt(obj.data.parent_project_id_number);
                }
                
                var consultantOrgDb = "";

                if(obj.data && obj.data.consultant_org_id){
                    consultantOrgDb = (obj.data.consultant_org_id).split(";");
                }

                click_project_details = {
                    projectname: obj.data.project_name,
                    projectidnumber: obj.data.project_id_number,
                    projectid: obj.data.project_id,
                    projectowner: obj.data.project_owner,
                    projectwpcid: obj.data.project_wpc_id,
                    projecttype: obj.data.project_type,
                    projectregion: obj.data.region,
                    parentid: parentid, //get parent id number if package project
                    projectindustry: obj.data.industry,
                    projecticon: obj.data.icon_url,
                    projecttimezone: obj.data.time_zone_value,
                    projectlocation: obj.data.location,
                    createdby: obj.data.created_by,
                    projectcreatetime: created_datetime,
                    projectupdateby: obj.data.updated_by,
                    projectupdatetime: update_datetime,
                    projectstatus: obj.data.status,
                    projectcontractor: obj.data.contractor_org_id,
                    projectconsultant: consultantOrgDb,
                    lat1: lat1,
                    lat2: lat2,
                    long1: long1,
                    long2: long2,
                    startdate: startdate,
                    enddate: enddate,
                    duration: obj.data.duration,
                    users: obj.project_users,
                    applist: obj.app_list
                    //parentIDName: obj.parentProjectIDName
                };
                //iterate to populate table with associate users on display project details
                var usershtml = "";
                obj.project_users.forEach(iterateUsersArray);
                var projectUsers = [];

                function iterateUsersArray(item, index) {
                    if (item.added_time != null) {
                        added_time = new Date(item.added_time).toDateString();
                    } else {
                        added_time = "NULL";
                    }
                    //get user group
                    var group = item.project_group.join();
                    usershtml +=
                        '<tr>\
                            <td title="Member\'s name">' + item.user_firstname + " " + item.user_lastname + '</td>\
                            <td title="Member\'s email">' + item.user_email + '</td>\
                            <td title="Member\'s role in the project">' + item.Pro_Role + '</td>\
                            <td title="Member\'s group in the project">' + group + '</td>\
                            <td title="Member\'s organization">' + item.user_org + '</td>\
                            <td title="Admin who added this member">' + item.added_by + '</td>\
                            <td title="Date of member added">' + added_time + '</td>\
                        </tr>';
                }

                $("#users_in_project2").html(usershtml);
                var tbody = document.getElementById("addUserTableBody");
                var addUserTableTr = $(".addUserTableTr");
                $('input:checkbox[class ="addusertable"]').each(function (idx) {
                    var i = 0;
                    while (i < obj.project_users.length) {
                        if ($(this).attr("id") == obj.project_users[i].user_id) {
                            $(this).prop("checked", true);
                            var id = "s" + $(this).attr("id");
                            var slt = document.getElementById(id);
                            slt.value = obj.project_users[i].Pro_Role;
                            slt.style.display = "block";

                            // if users also in child project it will be disabled
                            if (obj.project_users[i].child_projects.length != 0) {
                                $(this).attr("disabled", true);

                                // also add info button to show which child project they in
                                var tdEmail = $(addUserTableTr[idx]).find(".addUserTableTdEmail")
                                if (tdEmail.children().length <1) {
                                    tdEmail.append('<span>&nbsp;<img title="User in project(s): &#10; ' + obj.project_users[i].child_projects.join(", ") + '" style="height: 15px;width: 15px;" src="Images/icons/admin_page/main_project/info.png"></span>');
                                };
                            }
                            break;
                        }
                        i++;
                    }
                });

                // $('input:checkbox[class ="addcontractusertable"]').each(function () {
                //     var i = 0;
                //     while (i < obj.project_users.length) {
                //         if ($(this).attr("id") == obj.project_users[i].user_id) {
                //             $(this).prop("checked", true);
                //             var id = "s" + $(this).attr("id");
                //             var slt = document.getElementById(id);
                //             slt.value = obj.project_users[i].Pro_Role;
                //             slt.style.display = "block";
                //             break;
                //         }
                //         i++;
                //     }
                // });
                // $('input:checkbox[class ="addconsultantusertable"]').each(function () {
                //     var i = 0;
                //     while (i < obj.project_users.length) {
                //         if ($(this).attr("id") == obj.project_users[i].user_id) {
                //             $(this).prop("checked", true);
                //             var id = "s" + $(this).attr("id");
                //             var slt = document.getElementById(id);
                //             slt.value = obj.project_users[i].Pro_Role;
                //             slt.style.display = "block";
                //             break;
                //         }
                //         i++;
                //     }
                // });
                document.getElementById("newprojectheaderDisplay").innerText =
                    obj.data.project_name;
                document.getElementById("projectidnumber").value =
                    obj.data.project_id_number;
                document.getElementById("projectiddisplay").innerText = obj.data.project_id;
                document.getElementById("projectnamedisplay").innerText =
                    obj.data.project_name;
                document.getElementById("projectownerdisplay").innerText = obj.data.project_owner;
                document.getElementById("projectwpciddisplay").innerText = obj.data.project_wpc_id;
                document.getElementById("projectindustrydisplay").innerText =
                    obj.data.industry;
                document.getElementById("projecttimezonedisplay").innerText =
                    obj.data.time_zone_text;
                document.getElementById("projectlocationdisplay").innerText =
                    obj.data.location;
                document.getElementById("projectregiondisplay").innerText =
                    obj.data.region;
                document.getElementById("projecttypedisplay").innerText =
                    obj.data.project_type;
                if (obj.data.updated_by == "" || obj.data.updated_by == null) {
                    document.getElementById("projectlastupdatedisplay").innerText = "";
                } else {
                    document.getElementById("projectlastupdatedisplay").innerText =
                        obj.data.updated_by + " " + update_datetime;
                }
                document.getElementById(
                    "projectstartdatedisplay"
                ).innerText = startdate;
                document.getElementById("projectenddatedisplay").innerText = enddate;
                document.getElementById("projectdurationdisplay").innerText =
                    obj.data.duration;
                document.getElementById("projectcreatetimedisplay").innerText =
                    obj.data.created_by + " " + created_datetime;
                document.getElementById("projectstatusdisplay").innerText =
                    obj.data.status;
                $("#projectimagedisplay").attr(
                    "style",
                    "background-image: url(../" + obj.data.icon_url + ");"
                );

                if(obj.data.project_type == "ASSET"){
                    $('#projectregiondisplaycont').show();
                    $('#projectwpciddisplaycont').hide();
                }else{
                    $('#projectregiondisplaycont').hide();
                    $('#projectwpciddisplaycont').show();
                }
                //check if ovarall project or package
                if (click_project_details.parentid == null) {//overall project
                    $("#overallprojectCheck").prop("checked", true);
                    $("#packagespecificCheck").prop("checked", false);
                    // add the app list
                    addAppList();
                    overallprojectState()

                } else { //package project
                    $("#overallprojectCheck").prop("checked", false);
                    $("#packagespecificCheck").prop("checked", true);
                    packagespecificState()
                    if(obj.data.project_type == "ASSET"){
                        $("#label-projectwpcid").hide() //hide wpcid for asset package
                        $("#projectwpcid").hide() //hide wpcid asset package
                    }
                };
                $("#overallprojectCheck").attr("disabled", true);
                $("#packagespecificCheck").attr("disabled", true);

                document.getElementById("addnewprojectForm").style.display = "block";
                if (lat1 !== lat2) {
                    $("#lat1").html(lat1);
                    $("#long1").html(long1);
                    $("#lat2").html(lat2);
                    $("#long2").html(long2);
                } else {
                    $(".coordComma").hide();
                }

                if ($("#projectstatusdisplay").html() == "archive") {
                    $("#newprojectEdit").css("display", "none");
                    $("#newprojectRestore").css("display", "inline-block");
                    $("#newprojectDelete").css("display", "none");
                    $("#newprojectDeletepermanent").css("display", "inline-block");
                } else {
                    $("#newprojectRestore").css("display", "none");
                    $("#newprojectEdit").css("display", "inline-block");
                    $("#newprojectDeletepermanent").css("display", "none");
                    $("#newprojectDelete").css("display", "inline-block");
                }

                //OnClickOpenReadViewer();
            } else {
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
        },
    });
}

function userDetail(ele) {
    rowclicked = ele.parentNode;
    let email_col = rowclicked.children[2];
    usr_email = email_col.innerHTML.trim();
    $.ajax({
        type: "POST",
        url: "BackEnd/UserFunctions.php",
        dataType: "json",
        data: {
            functionName: 'viewUser',
            usr_email: usr_email,
        },
        success: function (obj, textstatus) {
            if (!("bool" in obj)) {

                readonlystate2();
                var created_datetime = obj.data.created_time;
                var last_logintime = obj.data.last_login;
                var update_datetime = obj.data.last_update;
                if (created_datetime != null) {
                    created_datetime = new Date(created_datetime).toDateString();
                }
                if (last_logintime !== null) {
                    last_logintime = new Date(last_logintime).toDateString();
                }

                if (update_datetime !== null) {
                    update_datetime = new Date(update_datetime).toDateString();
                }

                click_user_details = {
                    id: obj.data.user_id,
                    firstname: obj.data.user_firstname,
                    lastname: obj.data.user_lastname,
                    email: obj.data.user_email,
                    org: obj.data.user_org,
                    org_name: obj.data.orgName,
                    org_type: obj.data.orgType,
                    country: obj.data.user_country,
                    user_type: obj.data.user_type,
                    created_by: obj.data.created_by,
                    created_time: created_datetime,
                    updated_by: obj.data.updated_by,
                    last_update: update_datetime,
                    last_login: last_logintime,
                    support_user: obj.data.support_user
                };
                document.getElementById("newuserInitial").innerText =
                    obj.data.user_firstname.substring(0, 1) + obj.data.user_lastname.substring(0, 1);
                document.getElementById("newuserheaderDisplay").innerText =
                    obj.data.user_firstname + " " + obj.data.user_lastname;
                document.getElementById("newusernamedisplay").innerText =
                    obj.data.user_firstname + " " + obj.data.user_lastname;
                document.getElementById("newemaildisplay").innerText = obj.data.user_email;
                if (obj.data.user_org !== null) {
                    document.getElementById("neworgdisplay").innerText = obj.data.user_org;
                } else {
                    document.getElementById("neworgdisplay").innerText = "";
                }
                if (obj.data.support_user == true) {
                   
                    document.getElementById("supportuser").style.display = "inline-block";
                    document.getElementById("supportuserimg").style.display = "inline-block";
                    document.getElementById("supportbreak").style.display = "inline-block";
                } else {
                    document.getElementById("supportuser").style.display = "none";
                    document.getElementById("supportuserimg").style.display = "none";
                    document.getElementById("supportbreak").style.display = "none";
                }

                if (obj.data.user_country !== null) {
                    document.getElementById("newcountrydisplay").innerText = obj.data.user_country;
                } else {
                    document.getElementById("newcountrydisplay").innerText = "";
                }

                if (obj.data.updated_by !== null) {
                    document.getElementById("lastupdatedisplay").innerText =
                        "Last updated on: " + update_datetime + " By:" + obj.data.updated_by;
                } else {
                    document.getElementById("lastupdatedisplay").innerText = "N/A";
                }

                if (obj.data.created_by !== null) {
                    document.getElementById("createdbydisplay").innerText =
                        "Created on: " + created_datetime + " By: " + obj.data.created_by;
                } else {
                    document.getElementById("createdbydisplay").innerText = "";
                }

                if (last_logintime !== null) {
                    document.getElementById(
                        "lastlogindisplay"
                    ).innerText = last_logintime;
                } else {
                    document.getElementById("lastlogindisplay").innerText = "N/A";
                }
                document.getElementById("addnewuserForm").style.display = "block";

                //populate projects table in user profile
                var projecthtml;
                obj.user_projects.forEach(iterateProjectsArray);

                function iterateProjectsArray(item, index) {
                    added_time = new Date(item.added_time).toDateString();
                    let itemRole = item.Pro_Role;
                    projecthtml +=
                        "<tr>\
                           <td >" +
                        item.project_name +
                        "</td>\
                           <td >" +
                        itemRole +
                        "</td>\
                           <td >" +
                        item.added_by +
                        "</td>\
                           <td >" +
                        added_time +
                        "</td></tr>";
                }
                $("#listprojects_userprofile").html("");
                $("#listprojects_userprofile").html(projecthtml);

                let str = obj.data.user_firstname;
                let initial = str.substring(0, 1);

                if (
                    initial == "A" ||
                    initial == "a" ||
                    initial == "J" ||
                    initial == "j" ||
                    initial == "S" ||
                    initial == "s"
                ) {
                    $(".systemadminformView .formContent .newuserPicture").css(
                        "background",
                        col_ajs
                    );
                    $(
                        ".systemadminformView .formContent .newuserPicture .newuserInitial"
                    ).css("background", col_ajs);
                } else if (
                    initial == "B" ||
                    initial == "b" ||
                    initial == "K" ||
                    initial == "k" ||
                    initial == "T" ||
                    initial == "t"
                ) {
                    $(".systemadminformView .formContent .newuserPicture").css(
                        "background",
                        col_bkt
                    );
                    $(
                        ".systemadminformView .formContent .newuserPicture .newuserInitial"
                    ).css("background", col_bkt);
                } else if (
                    initial == "C" ||
                    initial == "c" ||
                    initial == "L" ||
                    initial == "l" ||
                    initial == "U" ||
                    initial == "u"
                ) {
                    $(".systemadminformView .formContent .newuserPicture").css(
                        "background",
                        col_clu
                    );
                    $(
                        ".systemadminformView .formContent .newuserPicture .newuserInitial"
                    ).css("background", col_clu);
                } else if (
                    initial == "D" ||
                    initial == "d" ||
                    initial == "M" ||
                    initial == "m" ||
                    initial == "V" ||
                    initial == "v"
                ) {
                    $(".systemadminformView .formContent .newuserPicture").css(
                        "background",
                        col_dmv
                    );
                    $(
                        ".systemadminformView .formContent .newuserPicture .newuserInitial"
                    ).css("background", col_dmv);
                } else if (
                    initial == "E" ||
                    initial == "e" ||
                    initial == "N" ||
                    initial == "n" ||
                    initial == "W" ||
                    initial == "w"
                ) {
                    $(".systemadminformView .formContent .newuserPicture").css(
                        "background",
                        col_enw
                    );
                    $(
                        ".systemadminformView .formContent .newuserPicture .newuserInitial"
                    ).css("background", col_enw);
                } else if (
                    initial == "F" ||
                    initial == "f" ||
                    initial == "O" ||
                    initial == "o" ||
                    initial == "X" ||
                    initial == "x"
                ) {
                    $(".systemadminformView .formContent .newuserPicture").css(
                        "background",
                        col_fox
                    );
                    $(
                        ".systemadminformView .formContent .newuserPicture .newuserInitial"
                    ).css("background", col_fox);
                } else if (
                    initial == "G" ||
                    initial == "g" ||
                    initial == "P" ||
                    initial == "p" ||
                    initial == "Y" ||
                    initial == "y"
                ) {
                    $(".systemadminformView .formContent .newuserPicture").css(
                        "background",
                        col_gpy
                    );
                    $(
                        ".systemadminformView .formContent .newuserPicture .newuserInitial"
                    ).css("background", col_gpy);
                } else if (
                    initial == "H" ||
                    initial == "h" ||
                    initial == "Q" ||
                    initial == "q" ||
                    initial == "Z" ||
                    initial == "z"
                ) {
                    $(".systemadminformView .formContent .newuserPicture").css(
                        "background",
                        col_hqz
                    );
                    $(
                        ".systemadminformView .formContent .newuserPicture .newuserInitial"
                    ).css("background", col_hqz);
                } else if (
                    initial == "I" ||
                    initial == "i" ||
                    initial == "R" ||
                    initial == "r"
                ) {
                    $(".systemadminformView .formContent .newuserPicture").css(
                        "background",
                        col_ir
                    );
                    $(
                        ".systemadminformView .formContent .newuserPicture .newuserInitial"
                    ).css("background", col_ir);
                }

                if (click_user_details.user_type == "non_active") {
                    $("#newuserEdit").css("display", "none");
                    $("#reactiveUser").css("display", "inline-block");
                    $("#newuserDelete").css("display", "none");
                    $("#permanentDelete").css("display", "inline-block");
                } else {
                    $("#reactiveUser").css("display", "none");
                    $("#newuserEdit").css("display", "inline-block");
                    $("#permanentDelete").css("display", "none");
                    $("#newuserDelete").css("display", "inline-block");
                }
            } else {
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
        },
    });
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

function toggleProjectType(type = 'CONSTRUCT'){
    if(type == 'CONSTRUCT'){
        $('#projectTypeTitle').html('Construction App')
        $('#projectTypePackageTitle').html('Construct Package')
        
        // $('#assetAppProcess').find('.jogetApp_list').attr('disabled', 'disabled')
        // $('#constructAppProcess').find('.jogetApp_list').removeAttr('disabled')

        $('#constructAppProcess').show();
        $('#assetAppProcess').hide();
    }else{
        $('#projectTypeTitle').html('Asset App')
        $('#projectTypePackageTitle').html('Asset Package')

        // $('#assetAppProcess').find('.jogetApp_list').attr('disabled', 'disabled')
        // $('#assetAppProcess').find('.jogetApp_list').removeAttr('disabled')

        $('#constructAppProcess').hide();
        $('#assetAppProcess').show();       
    }
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

$("#overallprojectCheck").click(function () {

    overallprojectState()
    refreshUserTableBody()
    $("#newprojectheaderDisplay").html("New Project");
    if($('#asset').is(":checked")){
        $('#regionCont').show();
        $('#packageRegionCont').hide();
        $('#inv').show();
        toggleProjectType('ASSET')
    }else{
        $('#regionCont').hide();
        $('#packageRegionCont').hide();
        $('#inv').hide();
        toggleProjectType()
    }
    $('#asset').attr("disabled", false);
    $('#construct').attr("disabled", false);

})

$("#packagespecificCheck").click(function () {
    parentID = []
    parentID.value = $("#parentid").val()
    refreshUserTableBody(parentID)
    packagespecificState()
    $("#newprojectheaderDisplay").html("New Package");
    if($('#asset').is(":checked")){
        $('#regionCont').hide();
        $('#packageRegionCont').show();
        $('#inv').hide();
        toggleProjectType('ASSET')
    }else{
        $('#regionCont').hide();
        $('#packageRegionCont').hide();
        $('#inv').hide();
        toggleProjectType()
    }

})

$(function () {
    var inactivityTime = function () {
        var time;
        window.onload = resetTimer;
        // DOM Events
        document.onmousemove = resetTimer;
        document.onkeypress = resetTimer;

        function logout() {
            $.confirm({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Session Timeout!",
                content: "You'll be logged out in 15 seconds. ",
                autoClose: 'Logout|15000',
                buttons: {
                    Continue: function () {
                        resetTimer()
                        return;
                    },
                    Logout: function () {
                        $("#signOut").trigger("click")
                        return;
                    },
                },
            });
        }

        function resetTimer() {
            clearTimeout(time);
            time = setTimeout(logout, 600000) //change this to 10mins
            // 1000 milliseconds = 1 second
        }
    };
    inactivityTime();
    /////     Pop up window click item     /////
    //animation for clicking the close pop up item//
    $('.popupboxfooter .popupbutton button').on("click", function () {
        let popuptoClose = $(this).attr('rel')
        $('#' + popuptoClose).css('display', 'none')
    })

    var eleSort = document.getElementById("sortable");
    new Sortable(eleSort, {
        animation: 4000,
        ghostClass: 'card-background'
    });

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
            flagUserEdit = false;
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

    //read only state for new user form
    function readonlystate() {
        //$('.newuserPicture').fadeIn()
        $(".newuserContainerBody-edit").css("display", "none");
        $(".newuserContainerBody-edit.active").removeClass("active");
        $(".newuserContainerBody-readonly").css("display", "block");
        $(".newuserContainerBody-readonly").addClass("active");
        $(".newuserFooter .edit-page1").css("display", "none");
        $(".newuserFooter .edit-page2").css("display", "none");
        $(".newuserFooter .readonly").css("display", "block");
        $(".newuserPicture").fadeIn();
    }

    //copy value inside input field and put it on display
    function copyinputvalue() {
        let $email = $("#newemail").val();
        let $fname = $("#newfirstname").val();
        let $lname = $("#newlastname").val();
        if ($('#createNewOrg').is(':checked')) {
            let $neworg = $('#newOrgID').val() + ", " + $('#newOrgName').val() + ", " + $('#newOrgDescription').val() + ", " + $('#newOrgType option:selected').val();
            $("#neworgdisplay").html($neworg);
        } else {
            let $org = $("#neworg option:selected").text();
            $("#neworgdisplay").html($org);
        }

        let $country = $("#newcountry").val();
        $("#newemaildisplay").html($email);
        $("#newusernamedisplay").html($fname + " " + $lname);

        $("#newcountrydisplay").html($country);
        $("#newuserheaderDisplay").html($fname + " " + $lname);
        if ($('#supportUser').is(":checked")) {
            document.getElementById("supportuser").style.display = "inline-block";
            document.getElementById("supportuserimg").style.display = "inline-block";
            document.getElementById("supportbreak").style.display = "inline-block";
        }else{
            document.getElementById("supportuser").style.display = "none";
            document.getElementById("supportuserimg").style.display = "none";
            document.getElementById("supportbreak").style.display = "none";
        }
    }

    //copy value inside div into input fields
    function copydivvalue() {
        $('#newemail').val(click_user_details.email)
        $('#newemail').prop('readonly', true) //making it read only. can edit if check the change email check box.. added for safety
        $('#newfirstname').val(click_user_details.firstname)
        $('#newlastname').val(click_user_details.lastname)
        $('#neworg').val(click_user_details.org).prop('selected', true); //org is the id , org_name, org_type  have other details
        $('#newcountry').val(click_user_details.country)
        $('#newusertype').val(click_user_details.user_type)
        $('#newuserheaderDisplay').html(click_user_details.firstname + ' ' + click_user_details.lastname)
        $('#updateBy').val(click_user_details.updated_by)
        $('#lastUpdate').val(click_user_details.last_update)
        if(click_user_details.support_user == 1){
            $('#supportUser').prop("checked", true);
            $('.column333').css("display", "block");
        }

    }

    //reset all input fields
    function resetinputvalue() {
        $("#newemail").val("");
        $("#newfirstname").val("");
        $("#newlastname").val("");
        $("#neworg").val("");
        $("#newcountry").val("");
        $("#newpassword").val("");
        $("#newconfirmpassword").val("");
        $("#supportUser").prop("checked", false);
        $('.column333').css("display", "none");
        $("#checkresetpassword").prop("checked", false);
        $('#checkresetpassword').prop('disabled', false);
        $("#updateEmail").prop("checked", false);
        if ($(window).width() <= "1366") {
            $("input#newconfirmpassword").css({
                background: "none",
                "border-color": "#d1d1d1",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 4px",
                width: "calc(100% - 37px)",
                padding: "3px 0px",
                "border-radius": "3px",
                "padding-left": "10px",
            });
        } else if (window.devicePixelRatio >= 1.25) {
            $("input#newconfirmpassword").css({
                background: "none",
                "border-color": "#d1d1d1",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 4px",
                width: "calc(100% - 37px)",
                padding: "3px 0px",
                "border-radius": "3px",
                "padding-left": "10px",
            });
        } else {
            $("input#newconfirmpassword").css({
                background: "none",
                "border-color": "#d1d1d1",
                "background-size": "20px",
                "background-repeat": "no-repeat",
                "background-position": "2px 4px",
                width: "calc(100% - 49px)",
                padding: "3px 0px",
                "border-radius": "3px",
                "padding-left": "10px",
            });
        }
        $("input#newpassword").removeClass();
        $(".passindicator").css("display", "none");
    }

    //finding the initial based on first name and last name of user & show in circle
    function findinitial() {
        let $fname = $("#newfirstname").val();
        let $lname = $("#newlastname").val();
        let $finitial = $fname.charAt(0);
        let $linitial = $lname.charAt(0);
        $(".newuserInitial").html($finitial + $linitial);
    }

    //function to remove initial name
    function removeinitial() {
        $(".newuserInitial").html("");
    }

    //function for showing the password strangth meter and text//
    function newpasswordText() {
        let $passfieldVal = $("#newpassword").val()
        let $no = 0

        if ($passfieldVal != "") {
            if ($passfieldVal.length <= 4) $no = 1;
            if ($passfieldVal.length > 4) $no = 2;
            if ($passfieldVal.length > 6) $no = 3;
            if ($passfieldVal.length > 8) $no = 4;

            if ($no == 1) {
                $("#newpasswordstrength").animate({ width: "50px", }, 150);
                $("#newpasswordstrength").css("background-color", "red");
                $("#newpasswordstrengthText").html("Very Weak");
            } else if ($no == 2) {
                $("#newpasswordstrength").animate({ width: "100px", }, 150);
                $("#newpasswordstrength").css("background-color", "orange");
                $("#newpasswordstrengthText").html("Weak");
            } else if ($no == 3) {
                $("#newpasswordstrength").animate({ width: "150px", }, 150);
                $("#newpasswordstrength").css("background-color", "yellow");
                $("#newpasswordstrengthText").html("Good");
            } else if ($no == 4) {
                $("#newpasswordstrength").animate({ width: "200px", }, 150);
                $("#newpasswordstrength").css("background-color", "green");
                $("#newpasswordstrengthText").html("Strong");
            }
        } else { }
    }

    //animation for opening the CREATE NEW USER PROFILE
    $("#adminsub-user #adduser").on("click", function () {
        if (!$("#addnewuserForm").hasClass("active")) {
            resetinputvalue();
            $("#newemail").prop("readonly", false);
            $("#addnewprojectForm.active").removeClass("active");
            $(".subbutton-button").removeClass("active");
            resetOrgSelect()
            $(".newuserContainerBody-edit .hideOnEdit").css("display", "block");
            $("#addnewuserForm").css({ "padding-top": -30, }).animate({ "padding-top": 0, }, 100, function () {
                //   shoe the add new user form
                $("#addnewuserForm").css("display", "block");
                $("#addnewuserForm").addClass("active");
                editstate();

                $(".newuserContainerBody-edit .resetcheck").css("display", "none");
                $(".newuserContainerBody-edit .updatecheck").css("display", "none");
                $(".newuserContainerBody-edit .resetpasswordcontainer").css(
                    "display",
                    "block"
                );
                $('#neworg').prop('disabled', false); //enable the org selection
                $('.column22').css("display", "block"); //show the neworg label and checkbox



                //   hide project involved table
                // Handled by the view on edit class

                //   change the update button to save button
                $("#newuserheaderDisplay").html("New User");
                $(".newuserFooter .edit-page1 #newusernext").css("display", "inline");
                $(".newuserFooter .edit-page1 #newusernext2").css("display", "none");
                $(".newuserFooter .edit-page2 #newuserback").css("display", "inline");
                $(".newuserFooter .edit-page2 #newuserback2").css("display", "none");
                $(".newuserFooter .edit-page2 #newuserSave").css("display", "inline");
                $(".newuserFooter .edit-page2 #newuserUpdate").css("display", "none");

                //   make the email field editable when create new user button is clicked
                $(".newuserContainerBody-edit #newemail").css({
                    "background-color": "white",
                    outline: "default",
                    cursor: "default",
                });
                $(".newuserContainerBody-edit #newemail").prop("readonly", false);
                //$('.newuserContainerBody-edit #newemail').focus(function(){this.focus()})
            });
            updateAllUserSelectOptions();
        } else { }

    });
    $(".newuserContainerBody-edit #checkresetpassword").change(function () {
        event.preventDefault();
        if (this.checked) {
            $(".newuserContainerBody-edit .resetpasswordcontainer").css("display", "block");
        } else {
            $(".newuserContainerBody-edit .resetpasswordcontainer").css("display", "none");
        }
    });
    $(".newuserContainerBody-edit #updateEmail").change(function () {
        /////    code for edit email checkbox
        event.preventDefault();
        if (this.checked) {
            $(".newuserContainerBody-edit #newemail").css({ "background-color": "white", outline: "default", cursor: "default", });
            $(".newuserContainerBody-edit #newemail").prop("readonly", false);
            //$('.newuserContainerBody-edit #newemail').focus(function(){this.focus()})
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Records associated with this email will be updated once the new email is saved.",
            });
        } else {
            $(".newuserContainerBody-edit #newemail").css({ "background-color": "lightgrey", outline: "none", cursor: "not-allowed", });
            $(".newuserContainerBody-edit #newemail").prop("readonly", true);
            //$('.newuserContainerBody-edit #newemail').focus(function(){this.blur()})
        }
    });

    /// animation for showing the password strength//
    $("input#newpassword").on("keyup", function () {
        if (!$(this).val().length == 0) {
            $(".passindicator").css("display", "inline-block");
            newpasswordText();
        } else {
            $(".passindicator").css("display", "none");
        }
    });

    /////for confirm password validation css
    $("#newconfirmpassword").on("keyup", function () {
        if ($(window).width() <= "1366") {
            if (!($("#newconfirmpassword").val() == $("#newpassword").val())) {
                $("input#newconfirmpassword").css({
                    "background": "url(Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "12px",
                    "background-repeat": "no-repeat",
                    "background-position": "4px 4px",
                    "width": "calc(100% - 47px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "20px",
                });
                $("input#newpassword").addClass("invalid");
                $("input#newpassword").removeClass("valid");
            } else {
                $("input#newconfirmpassword").css({
                    "background": "url(Images/icons/gen_button/checked.svg)",
                    "border-color": "hsl(120, 76%, 50%)",
                    "background-size": "12px",
                    "background-repeat": "no-repeat",
                    "background-position": "4px 4px",
                });
                $("input#newpassword").addClass("valid");
                $("input#newpassword").removeClass("invalid");
            }
        } else if (window.devicePixelRatio >= 1.25){
            if (!($("#newconfirmpassword").val() == $("#newpassword").val())) {
                $("input#newconfirmpassword").css({
                    "background": "url(Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "12px",
                    "background-repeat": "no-repeat",
                    "background-position": "4px 4px",
                    "width": "calc(100% - 47px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "20px",
                });
                $("input#newpassword").addClass("invalid");
                $("input#newpassword").removeClass("valid");
            } else {
                $("input#newconfirmpassword").css({
                    "background": "url(Images/icons/gen_button/checked.svg)",
                    "border-color": "hsl(120, 76%, 50%)",
                    "background-size": "12px",
                    "background-repeat": "no-repeat",
                    "background-position": "4px 4px",
                });
                $("input#newpassword").addClass("valid");
                $("input#newpassword").removeClass("invalid");
            }
        } else {
            if (!($("#newconfirmpassword").val() == $("#newpassword").val())) {
                $("input#newconfirmpassword").css({
                    "background": "url(Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "20px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px",
                    "width": "calc(100% - 64px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "25px",
                });
                $("input#newpassword").addClass("invalid");
                $("input#newpassword").removeClass("valid");
            } else {
                $("input#newconfirmpassword").css({
                    "background": "url(Images/icons/gen_button/checked.svg)",
                    "border-color": "hsl(120, 76%, 50%)",
                    "background-size": "20px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px",
                });
                $("input#newpassword").addClass("valid");
                $("input#newpassword").removeClass("invalid");
            }
        }
    });
    $("#newpassword").on('keyup', function () {
        if ($(window).width() <= "1366") {
            if (!($("#newconfirmpassword").val() == $("#newpassword").val())) {
                $("input#newconfirmpassword").css({
                    "background": "url(Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "12px",
                    "background-repeat": "no-repeat",
                    "background-position": "4px 4px",
                    "width": "calc(100% - 47px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "20px",
                })
                $("input#newpassword").addClass("invalid")
                $("input#newpassword").removeClass("valid")
            } else if ($("#newconfirmpassword").val() == $("#newpassword").val()) {
                $("input#newconfirmpassword").css({
                    "background": "url(Images/icons/gen_button/checked.svg)",
                    "border-color": "hsl(120, 76%, 50%)",
                    "background-size": "12px",
                    "background-repeat": "no-repeat",
                    "background-position": "4px 4px",
                })
                $("input#newpassword").addClass("valid")
                $("input#newpassword").removeClass("invalid")
            }
        } else if (window.devicePixelRatio >= 1.25) {
            if (!($("#newconfirmpassword").val() == $("#newpassword").val())) {
                $("input#newconfirmpassword").css({
                    "background": "url(Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "12px",
                    "background-repeat": "no-repeat",
                    "background-position": "4px 4px",
                    "width": "calc(100% - 47px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "20px",
                })
                $("input#newpassword").addClass("invalid")
                $("input#newpassword").removeClass("valid")
            } else if ($("#newconfirmpassword").val() == $("#newpassword").val()) {
                $("input#newconfirmpassword").css({
                    "background": "url(Images/icons/gen_button/checked.svg)",
                    "border-color": "hsl(120, 76%, 50%)",
                    "background-size": "12px",
                    "background-repeat": "no-repeat",
                    "background-position": "4px 4px",
                })
                $("input#newpassword").addClass("valid")
                $("input#newpassword").removeClass("invalid")
            }
        } else {
            if (!($("#newconfirmpassword").val() == $("#newpassword").val())) {
                $("input#newconfirmpassword").css({
                    "background": "url(Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "20px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px",
                    "width": "calc(100% - 64px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "25px",
                })
                $("input#newpassword").addClass("invalid")
                $("input#newpassword").removeClass("valid")
            } else if ($("#newconfirmpassword").val() == $("#newpassword").val()) {
                $("input#newconfirmpassword").css({
                    "background": "url(Images/icons/gen_button/checked.svg)",
                    "border-color": "hsl(120, 76%, 50%)",
                    "background-size": "20px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px"
                })
                $("input#newpassword").addClass("valid")
                $("input#newpassword").removeClass("invalid")
            }
        }
    })
    $("#newconfirmpassword").on("focusout", function () {
        if ($(window).width() <= "1366") {
            if ($("#newpassword").hasClass("invalid")) {
                $("input#newconfirmpassword").css({
                    "background": "url(Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "12px",
                    "background-repeat": "no-repeat",
                    "background-position": "4px 4px",
                    "width": "calc(100% - 47px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "20px",
                });
            } else {
                $("input#newconfirmpassword").css({
                    "background": "url(Images/icons/gen_button/checked.svg)",
                    "border-color": "#d1d1d1",
                    "background-size": "12px",
                    "background-repeat": "no-repeat",
                    "background-position": "4px 4px",
                });
            }
        } else if (window.devicePixelRatio >= 1.25) {
            if ($("#newpassword").hasClass("invalid")) {
                $("input#newconfirmpassword").css({
                    "background": "url(Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "12px",
                    "background-repeat": "no-repeat",
                    "background-position": "4px 4px",
                    "width": "calc(100% - 47px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "20px",
                });
            } else {
                $("input#newconfirmpassword").css({
                    "background": "url(Images/icons/gen_button/checked.svg)",
                    "border-color": "#d1d1d1",
                    "background-size": "12px",
                    "background-repeat": "no-repeat",
                    "background-position": "4px 4px",
                });
            }
        } else {
            if ($("#newpassword").hasClass("invalid")) {
                $("input#newconfirmpassword").css({
                    "background": "url(Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "12px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px",
                    "width": "calc(100% - 64px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "25px",
                });
            } else {
                $("input#newconfirmpassword").css({
                    "background": "url(Images/icons/gen_button/checked.svg)",
                    "border-color": "#d1d1d1",
                    "background-size": "12px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px",
                });
            }
        }
    });

    //animation for closing the CREATE NEW USER PROFILE
    $("#addnewuserForm .formContent #newuserCloseButton").on("click", function () {
        event.preventDefault();
        $("#addnewuserForm").css("display", "none");
        $("#addnewuserForm").removeClass("active");
        minimizenewuser();
    });
    $("#newusernext").on("click", function () {
        event.preventDefault();
        var x = $("#newemail").val();
        var atpos = x.indexOf("@");
        var dotpos = x.lastIndexOf(".");
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Not a valid e-mail address!",
            });
            return;
        }

        if ($("#newfirstname").val() !== "") {
            var x = $("#newfirstname").val();
            var pattern = /[A-Za-z]\S.*/;
            var result = x.match(pattern);
            if (result) {

            } else {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "First Name must be a valid alphabet!",
                });
                return;
            }
        }

        if ($("#newlastname").val() !== "") {
            var x = $("#newlastname").val();
            var pattern = /[A-Za-z]\S.*/;
            var result = x.match(pattern);
            if (result) {

            } else {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Last Name must be a valid alphabet!",
                });
                return;
            }
        }

        if ($("#newOrgID").val() !== "") {
            var x = $("#newOrgID").val();
            var pattern = /[^A-Za-z0-9_]/g;
            var result = x.match(pattern);
            if (result) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Org Id must not contain space and other special chars except '_'.",
                });
                return;
            }
        }

        if (
            !$("#newemail").val() ||
            !$("#newfirstname").val() ||
            !$("#newlastname").val()
        ) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please enter values for email, first name and last name!",
            });
            return;
        }

        if (!$('#newpassword').val()) {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Please enter your password!',
            });
            return;
        }
        if ($("#newpassword").val() !== "") {
            var x = $("#newpassword").val();
            var pattern = /.{5,}/;
            var result = x.match(pattern);
            if (result) {

            } else {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Password must be at least have 5 character!",
                });
                return;
            }
        }
        if (!$('#newconfirmpassword').val()) {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Please confim your password!',
            });
            return;
        }
        if (!($("#newconfirmpassword").val() == $("#newpassword").val())) {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Password did not match!',
            });
            return;
        }

        //check for the password length and special characters
        var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        let $passfieldVal = $("#newpassword").val()
        if ($passfieldVal.match(decimal)) {

        } else {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Password should be between 8 to 15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
            });
            return;
        }

        //check for details of org if checkbox checked
        if ($('#createNewOrg').is(':checked')) {
            if (!$("#newOrgID").val() || !$("#newOrgName").val() || !$("#newOrgType option:selected").val()) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Please enter values for  new Organization!",
                });
                return;
            };
            //check if the orgID is already existing
            let orgID = $('#newOrgID').val();
            let idExists = $('#neworg option').filter(function () { return $(this).val() == orgID; }).length;
            if (idExists) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "The organization ID already exists. Please give another ID to save this organization!",
                });
                return;
            }
        }

        readonlystate();
        copyinputvalue();
        findinitial();
        changebackgroundinitialcolor();

        $(".newuserFooter .edit-page1").css("display", "none");
        $(".newuserFooter .edit-page2").css("display", "block");
        $(".newuserFooter .readonly").css("display", "none");

    });

    $("#newusernext2").on("click", function () {
        event.preventDefault();
        if (
            !$("#newemail").val() ||
            !$("#newfirstname").val() ||
            !$("#newlastname").val()
        ) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please enter values for email, first name, last name and password!",
            });
            return;
        }
        if ($("#checkresetpassword").prop("checked")) {
            if (!$("#newpassword").val() || !$("#newconfirmpassword").val()) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Please enter values for  password!",
                });
                return;
            }
            //check for the password length and special characters
            var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
            let $passfieldVal = $("#newpassword").val()
            if ($passfieldVal.match(decimal)) {

            } else {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Password should be between 8 to 15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
                });
                return;
            }
        }
        readonlystate2();
        copyinputvalue();
        findinitial();
        changebackgroundinitialcolor();

        $(".newuserFooter .edit-page1").css("display", "none");
        $(".newuserFooter .edit-page2").css("display", "block");
        $(".newuserFooter .readonly").css("display", "none");
    });
    $("#newuserback").on("click", function () {
        event.preventDefault();
        editstate();
        $(".newuserFooter .edit-page1").css("display", "block");
        $(".newuserFooter .edit-page2").css("display", "none");
        $(".newuserFooter .readonly").css("display", "none");
    });
    $("#newuserback2").on("click", function () {
        event.preventDefault();
        editstate();
        $(".newuserFooter .edit-page1").css("display", "block");
        $(".newuserFooter .edit-page2").css("display", "none");
        $(".newuserFooter .readonly").css("display", "none");
        $(".idcontainer").css("display", "block");
        $(".doubleinput.idcontainer").css("display", "flex");
    });
    $("#newuserCancel").on("click", function () {
        event.preventDefault();
        $("#addnewuserForm").css("display", "none");
        $("#addnewuserForm").removeClass("active");
        resetOrgSelect()
        shrinkformSize();
        resetinputvalue();
        removeinitial();
        minimizenewuser();
    });
    $("#newuserCancel1").on("click", function () {
        event.preventDefault();
        $("#addnewuserForm").css("display", "none");
        $("#addnewuserForm").removeClass("active");
        resetOrgSelect()
        shrinkformSize();
        resetinputvalue();
        removeinitial();
        minimizenewuser();
    });

    $("#newuserEdit").on("click", function () { //on user Edit
        event.preventDefault();
        flagUserEdit = true;
        editstate();
        removeinitial();
        resetinputvalue();
        if ($('#createNewOrg').is(':checked')) {// remove the new org fields and set the org selection to nothing
            document.getElementById("newOrgDivContainer").style.display = "none";

            $('#createNewOrg').prop('checked', false);
        }
        copydivvalue();
        $('#neworg').prop('disabled', true); //disable the org selection
        $('.column22').css("display", "none"); //show the neworg label and checkbox


        ///code for showing the edit password checkbox///
        $(".newuserContainerBody-edit .hideOnEdit").css("display", "none");  //this does not seem to work Farihan
        $(".newuserContainerBody-edit .resetcheck").css("display", "block");
        $(".newuserContainerBody-edit .resetpasswordcontainer").css(
            "display",
            "none"
        );

        $(".newuserContainerBody-edit #newemail").css({ "background-color": "lightgrey", outline: "none", cursor: "not-allowed", });
        //$('.newuserContainerBody-edit #newemail').focus(function(){this.blur()})
        $(".newuserContainerBody-edit #newemail").prop("readonly", true);

        ///code for displaying the header / update button / hiding the save button / id container / etc ///
        $("#newuserheaderDisplay").html("Edit User");
        $(".newuserFooter .edit-page1 #newusernext").css("display", "none");
        $(".newuserFooter .edit-page1 #newusernext2").css("display", "inline");
        $(".newuserFooter .edit-page2 #newuserback").css("display", "none");
        $(".newuserFooter .edit-page2 #newuserback2").css("display", "inline");
        $(".newuserFooter .edit-page2 #newuserSave").css("display", "none");
        $(".newuserFooter .edit-page2 #newuserUpdate").css("display", "inline");
        $(".idcontainer").css("display", "block");
        $(".doubleinput.idcontainer").css("display", "flex");
    });

    //button for closing the new user form
    $("#newuserClose").on("click", function () {
        event.preventDefault();
        $("#addnewuserForm").css("display", "none");
        $("#addnewuserForm").removeClass("active");

        resetOrgSelect()
        resetinputvalue();
        removeinitial();
        minimizenewuser();
    });

    //copy value inside div into input fields
    function copyprojectdivvalue() {
        //refreshUserTableBody(); // to get all the users if added recently in the project team page.
          
        if(click_project_details.projecttype == "CONSTRUCT"){
            $('#construct').prop("checked", true);
            $('#asset').prop("checked", false);
            $('#construct').attr("disabled", true);
            $('#asset').attr("disabled", true);
            $('#inv').hide();
            toggleProjectType()
        }else{
            $('#construct').prop("checked", false);
            $('#asset').prop("checked", true);
            $('#construct').attr("disabled", true);
            $('#asset').attr("disabled", true);
            $('#inv').show();
            toggleProjectType('ASSET')
        }
        changeJogetPackageList(constructPackages);
        if(click_project_details.projecttype == "ASSET"  && click_project_details.parentid == null ){
            changeJogetPackageList(assetPackages);
           
            $('#regionCont').show();
            $('#region').val(click_project_details.projectregion);
            $('#packageRegionCont').hide()
        }else  if(click_project_details.projecttype == "ASSET" ) {
           
            $('#regionCont').hide();
            $('#packageRegionCont').show();
            document.querySelectorAll('#packageregion option').forEach(option => option.remove());
            let myselectdoc = document.getElementById('packageregion');
            let myoption2 = document.createElement("option");
            myoption2.value = "";
            myoption2.text = click_project_details.projectregion;
            myselectdoc.appendChild(myoption2);
            myselectdoc.selectedIndex = 0;
            $('#packageregion').attr("disabled", true);
            $("#label-projectwpcid").hide() //hide wpcid for overall
            $("#projectwpcid").hide() //hide wpcid for overall
        
           // $('#packageregion').val(click_project_details.projectregion).prop('selected', true);
           // $('#packageregion').prop('disabled', true);

        }else{
            $('#regionCont').hide();
            $('#packageRegionCont').hide()
           

        }
       
        $('#projectid').val(click_project_details.projectid)
        $('#projectid').prop("disabled", true)
        $('#projectname').val(click_project_details.projectname)
        $('#projectowner').val(click_project_details.projectowner).prop('selected', true)
        $('#projectowner').prop("disabled", true)
        $("select#projectowner").addClass("readonly")
        $('#projectwpcid').val(click_project_details.projectwpcid)
        $('#projectwpcid').prop("disabled", true)
        $("input#projectwpcid").addClass("readonly")
        $('#projectindustry').val(click_project_details.projectindustry)
        $('#projecttimezone').val(click_project_details.projecttimezone).prop('selected', true)
        $('#projectlocation').val(click_project_details.projectlocation);
        $('#projectimage').attr('src', '../'+click_project_details.projecticon);
        if (click_project_details.projectcontractor){
            $('#contractorSelector').data('selectize').setValue(click_project_details.projectcontractor);
        }
        if(click_project_details.projectconsultant){
            $('#consultantSelector').data('selectize').setValue(click_project_details.projectconsultant);
        }
        

        let offset = new Date(click_project_details.startdate).getTimezoneOffset();
        let pStartDate = new Date(click_project_details.startdate)
        let pEndDate = new Date(click_project_details.enddate)
        pStartDate = new Date(pStartDate.getTime() - (offset * 60 * 1000))
        pEndDate = new Date(pEndDate.getTime() - (offset * 60 * 1000))
        document.getElementById("projectstartdate").valueAsDate = pStartDate
        document.getElementById("projectenddate").valueAsDate = pEndDate
        $('#projectduration').val(click_project_details.duration);

        if (click_project_details.lat1 !== click_project_details.lat2) {
            $("#latit1").html(click_project_details.lat1);
            $("#latit2").html(click_project_details.lat2);
            $("#longit1").html(click_project_details.long1);
            $("#longit2").html(click_project_details.long2);
            ReadEntity = viewer.entities.add({
                selectable: false,
                show: true,
                rectangle: {
                    coordinates: readRectangle,
                    material: Cesium.Color.YELLOW.withAlpha(0.7),
                },
            });
            viewer.camera.setView({
                destination: readRectangle,
            });

            $("#coordinateval2").show();
        } else {
            viewer.camera.setView({
                destination: defaultview,
            });
        }
       
        var obj = click_project_details.users;
        $(".addusertable").prop("checked", false);
        var addUserTableTr = $(".addUserTableTr");
        $('input:checkbox[class ="addusertable"]').each(function (idx) {
            var i = 0;
            while (i < obj.length) {
                if ($(this).attr("id") == obj[i].user_id) {
                    $(this).prop("checked", true);
                    var id = "s" + $(this).attr("id");
                    var slt = document.getElementById(id);
                    slt.value = obj[i].Pro_Role;
                    slt.style.display = "block";
                    // if users also in child project it will be disabled
                    if (click_project_details.users[i].child_projects.length != 0) {
                        $(this).attr("disabled", true);

                        // also add info button to show which child project they in
                        var tdEmail = $(addUserTableTr[idx]).find(".addUserTableTdEmail")
                        if (tdEmail.children().length <1) {
                            tdEmail.append('<span>&nbsp;<img title="User in project(s): &#10; ' + click_project_details.users[i].child_projects.join(", ") + '" style="height: 15px;width: 15px;" src="Images/icons/admin_page/main_project/info.png"></span>');
                        };
                    }
                    break;
                }
                i++;
            }
        });

        //display the users in group page and group roles
        var projectgroupusers = [];
        for (var i = 0; i < obj.length; i++) {
            var name = obj[i]['user_firstname'] + " " + obj[i]['user_lastname'];
            //var group = obj[i]['project_group'];
            projectgroupusers.push({
                user_id: obj[i]['Usr_ID'],
                user_role: obj[i]['Pro_Role'],
                user_email: obj[i]['user_email'].trim(),
                user_name: name,
                user_org: obj[i]['user_org']
            });
        }
        var flag = displaySelectedUsersForGroupRole(projectgroupusers);
        if (flag) {
            $('input:checkbox[class ="addusergrouptable"]').each(function () {
                var i = 0;
                while (i < obj.length) {
                    if ($(this).attr("id") == obj[i].user_id) {

                        var values = obj[i].project_group;
                        if (values.length > 0) {
                            $(this).prop("checked", true);
                            var id = "gs" + $(this).attr("id");
                            var element = document.getElementById(id);
                            for (var j = 0; j < element.options.length; j++) {
                                element.options[j].selected = values.indexOf(element.options[j].value) >= 0;
                            }
                            element.style.display = "block";
                        }

                        break;
                    }
                    i++;
                }
            });

        }

        refreshParentProjectIDList(click_project_details.parentid);//populating the list and setting the value
        //$('#parentid').val(click_project_details.parentid);
        //update the app list if parent project
        if (click_project_details.parentid == null) {
            let applist = click_project_details.applist;
            if (click_project_details.applist.constructPackage_name != null) {
                let package = applist.constructPackage_name
                let packageId = package.split("::")[0];
                $("#jogetPackage").val(packageId);
                $(".jogetApp_list").prop("disabled", false);
            }
            if (applist.financePackage_name != null) {
                let package = applist.financePackage_name
                let packageId = package.split("::")[0];
                $("#jogetFinancePackage").val(packageId);
                $('#app_CP').prop('disabled', true);
                $(".jogetPFS_App_list:not(#app_CP)").prop("disabled", false);
            }

            if (applist.documentPackage_name != null) {
                let package = applist.documentPackage_name
                let packageId = package.split("::")[0];
                $("#jogetDocPackage").val(packageId);
                $('#app_DR').prop('disabled', true);
                $(".jogetDoc_App_list:not(#app_DR)").prop("disabled", false);
            }

            Object.keys(applist)
                .forEach(function eachKey(key) {
                    if (key != "constructPackage_name" && key != "project_id" && key != "financePackage_name" && key != "documentPackage_name") {
                        if (applist[key] == true) {
                            if (document.getElementById(key)) document.getElementById(key).checked = true;
                        } else {
                            if (document.getElementById(key)) document.getElementById(key).checked = false;
                        }
                    }
                })


            $("select#parentid").addClass("readonly")
            $("select#parentid").attr("disabled", true)
            $('#projectindustry').val(click_project_details.projectindustry).change();
        }
    }

    //reset all input fields
    function resetprojectinputvalue() {
        $(":input").val("");
        $("#users_in_project").html("");
        $("#projectimage").attr("src", "");
        $("#projectindustrydisplay").html("");
        $("#projecttimezonedisplay").html("");
        $(".hideoncreate").css("display", "flex");
        $("#lat1").html(" ");
        $("#lat2").html(" ");
        $("#long1").html(" ");
        $("#long2").html(" ");
        $("#latit1").html("");
        $("#latit2").html("");
        $("#longit1").html("");
        $("#longit2").html("");
        $("#appAssignContainerID").html("");
        $(".jogetPFS_App_list:checkbox:checked").each(function () {
            document.getElementById(this.id).checked = false;
        });
        $('#app_CP').prop('disabled', false); // reset in case it was set to disable earlier (contract)
        $(".jogetApp_list:checkbox:checked").each(function () {
            document.getElementById(this.id).checked = false;
        })

        // $("#appAssignContainerID").hide();
        if(selector) selector.show = false;
        selector2.show = false;

        if (!(selector3 == null)) {
            selector3.show = false;
        }
        if (!(ReadEntity == null)) {
            ReadEntity.show = false;
        }
        $(".addusertable").attr("checked", false); // to clear all the checkboxes for add users
        $(".adduserselect").hide(); // to hide all the user role options till selected

        $('#addContractorUserTableBody').html(""); //clear the list of contract users
        $('#addConsultantUserTableBody').html(""); //clear the list of consultant users
        $(".addcontractusertable").attr("checked", false); // to clear all the checkboxes for add users
        $(".addcontractuserselect").hide(); // to hide all the user role options till selected
        $(".addconsultantusertable").attr("checked", false); // to clear all the checkboxes for add users
        $(".addconsultantuserselect").hide(); // to hide all the user role options till selected
        var selectizeConsultant = consultantSelect[0].selectize;
        selectizeConsultant.clear();
        var selectizeContractor = contractorSelect[0].selectize;
        selectizeContractor.clear();
        $(".jogetApp_list").prop("disabled", true);
        $(".jogetPFS_App_list").prop("disabled", true);
        $(".jogetDoc_App_list").prop("disabled", true);
        $('#regionCont').hide();
        $('#packageRegionCont').hide();


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

    //animation for opening the CREATE NEW PROJECT BUTTON
    $("#adminsub-project #newproject, #newprojectDashboard").on("click", function () {
        flagEdit = false;
        viewer.camera.setView({
            destination: defaultview,
        });
        refreshParentProjectIDList(); //refreshing the list of overall projects in the select
        refreshContractConsultantOrgList(); //refreshing the list of contractors and consultants
        clearError()
        $("select#parentid").removeClass("readonly");
        $("select#parentid").attr("disabled", false);
        $("#packagespecificCheck").attr("disabled", false);
        $("#overallprojectCheck").attr("disabled", false);
        $('#asset').attr("disabled", false);
        $('#construct').attr("disabled", false);
        $('#packageregion').attr("disabled", false);
        $('#regionCont').hide();
        $('#packageRegionCont').hide();
        $('#asset').prop("checked", false);
        $('#construct').prop("checked", true);
        $('#inv').hide();
        toggleProjectType()

        overallprojectState();
        if (!$("#addnewprojectForm").hasClass("active")) {
            $("#addnewuserForm.active").removeClass("active");
            $(".subbutton-button").removeClass("active");
            $("#addnewprojectForm")
                .css({
                    "padding-top": -30,
                })
                .animate({
                    "padding-top": 0,
                },
                    100,
                    function () {
                        $("#addnewprojectForm").css("display", "block");
                        $("#addnewprojectForm").addClass("active");
                        resetprojectinputvalue();
                        projecteditstate();
                        $("#overallprojectCheck").attr("disabled", false);
                        $("#packagespecificCheck").attr("disabled", false);
                        $(".hideoncreate").css("display", "none");
                        $("#newprojectheaderDisplay").html("New Project");
                        $("input.addusertable[type=checkbox]").prop("checked", false);
                        $("input.addconsultantusertable[type=checkbox]").prop("checked", false);
                        $("input.addcontractusertable[type=checkbox]").prop("checked", false);
                        $(".newprojectFooter .edit-page7 #newprojectSave").css(
                            "display",
                            "inline"
                        );
                        $(".newprojectFooter .edit-page8 #newprojectUpdate").css(
                            "display",
                            "none"
                        );
                        $(".newprojectFooter .edit-page8 #newprojectUpdate1").css(
                            "display",
                            "none"
                        );
                    }
                );
            $(".newprojectContainerBody-editpage5 .filterContainer").hide();
            $(".newprojectContainerBody-editpage5 .container-table").css({
                width: "calc(100% - 40px)",
                left: "20px",
                "margin-left": "0px",
            });
            $("#organizeuser").removeClass("active");
        } else { }
    });

    //animation for clicking the organize user button
    $("#organizeuser").on("click", function () {
        event.preventDefault();

        if (!$("#organizeuser").hasClass("active")) {
            /// show filter column
            $(".newprojectContainerBody-editpage4 .filterContainer").fadeIn();
            /// resize table
            $(".newprojectContainerBody-editpage4 .container-table")
                .fadeIn()
                .animate({
                    width: "-=20%",
                    left: "+=19%",
                    "margin-left": "+=30px",
                });
            $("#organizeuser").addClass("active");
        } else {
            /// show filter column
            $(".newprojectContainerBody-editpag4 .filterContainer").fadeOut();
            /// resize table
            $(".newprojectContainerBody-editpage4 .container-table")
                .fadeIn()
                .animate({
                    width: "+=20%",
                    left: "-=19%",
                    "margin-left": "-=30px",
                });
            $("#organizeuser").removeClass("active");
        }
    });

    //animation for clicking the next button for new project form
    $("#newprojectnextpage1").on("click", function () {
        event.preventDefault();
        // checks if project id, project name and parent project details are given
        //checks for space in project ID

        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }

        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            clearError(); //clear any css for invalid project details

            $(".newprojectContainerBody-editpage1").css("display", "none");
            $(".newprojectContainerBody-editpage2").css("display", "none");
            $(".newprojectContainerBody-editpage3").css("display", "block");
            $(".newprojectContainerBody-editpage4").css("display", "none");
            $(".newprojectContainerBody-editpage5").css("display", "none");
            $(".newprojectContainerBody-editpage6").css("display", "none");
            $(".newprojectContainerBody-editpage7").css("display", "none");
            $(".newprojectContainerBody-readonly").css("display", "none");
            $(".newprojectFooter .edit-page1").css("display", "none");
            $(".newprojectFooter .edit-page2").css("display", "none");
            $(".newprojectFooter .edit-page3").css("display", "block");
            $(".newprojectFooter .edit-page4").css("display", "none");
            $(".newprojectFooter .edit-page5").css("display", "none");
            $(".newprojectFooter .edit-page6").css("display", "none");
            $(".newprojectFooter .edit-page7").css("display", "none");
            $(".newprojectFooter .edit-page8").css("display", "none");
            $(".pagenumber .pagecounter#page1").removeClass("active");
            $(".pagenumber .pagecounter#page2").removeClass("active");
            $(".pagenumber .pagecounter#page3").addClass("active");
            $(".pagenumber .pagecounter#page4").removeClass("active");
            $(".pagenumber .pagecounter#page5").removeClass("active");
            $(".pagenumber .pagecounter#page6").removeClass("active");
            $(".pagenumber .pagecounter#page7").removeClass("active");
            $(".pagenumber .pagecounter#page8").removeClass("active");
        });
    });

    $("#newprojectnextpage1-1").on("click", function () {
        event.preventDefault();
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }
        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            clearError(); //clear any css for invalid project details
           
            $(".newprojectContainerBody-editpage1").css("display", "none");
            $(".newprojectContainerBody-editpage2").css("display", "block");
            $(".newprojectContainerBody-editpage3").css("display", "none");
            $(".newprojectContainerBody-editpage4").css("display", "none");
            $(".newprojectContainerBody-editpage5").css("display", "none");
            $(".newprojectContainerBody-editpage6").css("display", "none");
            $(".newprojectContainerBody-editpage7").css("display", "none");
            $(".newprojectContainerBody-readonly").css("display", "none");
            $(".newprojectFooter .edit-page1").css("display", "none");
            $(".newprojectFooter .edit-page2").css("display", "block");
            $(".newprojectFooter .edit-page3").css("display", "none");
            $(".newprojectFooter .edit-page4").css("display", "none");
            $(".newprojectFooter .edit-page5").css("display", "none");
            $(".newprojectFooter .edit-page6").css("display", "none");
            $(".newprojectFooter .edit-page7").css("display", "none");
            $(".newprojectFooter .edit-page8").css("display", "none");
            $(".pagenumber .pagecounter#page1").removeClass("active");
            $(".pagenumber .pagecounter#page2").addClass("active");
            $(".pagenumber .pagecounter#page3").removeClass("active");
            $(".pagenumber .pagecounter#page4").removeClass("active");
            $(".pagenumber .pagecounter#page5").removeClass("active");
            $(".pagenumber .pagecounter#page6").removeClass("active");
            $(".pagenumber .pagecounter#page7").removeClass("active");
            $(".pagenumber .pagecounter#page8").removeClass("active");
        });
    });

    $("#newprojectback1").on("click", function () {
        event.preventDefault();
        $(".newprojectContainerBody-editpage1").css("display", "block");
        $(".newprojectContainerBody-editpage2").css("display", "none");
        $(".newprojectContainerBody-editpage3").css("display", "none");
        $(".newprojectContainerBody-editpage4").css("display", "none");
        $(".newprojectContainerBody-editpage5").css("display", "none");
        $(".newprojectContainerBody-editpage6").css("display", "none");
        $(".newprojectContainerBody-editpage7").css("display", "none");
        $(".newprojectContainerBody-readonly").css("display", "none");
        $(".newprojectFooter .edit-page1").css("display", "block");
        $(".newprojectFooter .edit-page2").css("display", "none");
        $(".newprojectFooter .edit-page3").css("display", "none");
        $(".newprojectFooter .edit-page4").css("display", "none");
        $(".newprojectFooter .edit-page5").css("display", "none");
        $(".newprojectFooter .edit-page6").css("display", "none");
        $(".newprojectFooter .edit-page7").css("display", "none");
        $(".newprojectFooter .edit-page8").css("display", "none");
        $(".pagenumber .pagecounter#page1").addClass("active");
        $(".pagenumber .pagecounter#page2").removeClass("active");
        $(".pagenumber .pagecounter#page3").removeClass("active");
        $(".pagenumber .pagecounter#page4").removeClass("active");
        $(".pagenumber .pagecounter#page5").removeClass("active");
        $(".pagenumber .pagecounter#page6").removeClass("active");
        $(".pagenumber .pagecounter#page7").removeClass("active");
        $(".pagenumber .pagecounter#page8").removeClass("active");
    });

    $("#newprojectnextpage2").on("click", function () {
        event.preventDefault();
        // if (!$("#jogetPackage").val()) {  //removed this check as per Beh's suggestion. user need not select a package GM
        //     $.alert({
        //         boxWidth: "30%",
        //         useBootstrap: false,
        //         title: "Message",
        //         content: "Please select a package!",
        //     });
        //     return;
        // }
        //there is no more wir process to check for claim submission. so removed this check.
        // if ($("#app_IC").prop("checked") == true && $("#app_WIR").prop("checked") == false) {
        //     $.alert({
        //         boxWidth: "30%",
        //         useBootstrap: false,
        //         title: "Message",
        //         content: "WIR in Construction App is a dependecy of Interim Claim. It must be selected. "
        //     });
        //     return;
        // }
        $(".newprojectContainerBody-editpage1").css("display", "none");
        $(".newprojectContainerBody-editpage2").css("display", "none");
        $(".newprojectContainerBody-editpage3").css("display", "block");
        $(".newprojectContainerBody-editpage4").css("display", "none");
        $(".newprojectContainerBody-editpage5").css("display", "none");
        $(".newprojectContainerBody-editpage6").css("display", "none");
        $(".newprojectContainerBody-editpage7").css("display", "none");
        $(".newprojectContainerBody-readonly").css("display", "none");
        $(".newprojectFooter .edit-page1").css("display", "none");
        $(".newprojectFooter .edit-page2").css("display", "none");
        $(".newprojectFooter .edit-page3").css("display", "block");
        $(".newprojectFooter .edit-page4").css("display", "none");
        $(".newprojectFooter .edit-page5").css("display", "none");
        $(".newprojectFooter .edit-page6").css("display", "none");
        $(".newprojectFooter .edit-page7").css("display", "none");
        $(".newprojectFooter .edit-page8").css("display", "none");
        $(".pagenumber .pagecounter#page1").removeClass("active");
        $(".pagenumber .pagecounter#page2").removeClass("active");
        $(".pagenumber .pagecounter#page3").addClass("active");
        $(".pagenumber .pagecounter#page4").removeClass("active");
        $(".pagenumber .pagecounter#page5").removeClass("active");
        $(".pagenumber .pagecounter#page6").removeClass("active");
        $(".pagenumber .pagecounter#page7").removeClass("active");
        $(".pagenumber .pagecounter#page8").removeClass("active");
    });

    $("#newprojectback2").on("click", function () {
        event.preventDefault();

        $(".newprojectContainerBody-editpage1").css("display", "block");
        $(".newprojectContainerBody-editpage2").css("display", "none");
        $(".newprojectContainerBody-editpage3").css("display", "none");
        $(".newprojectContainerBody-editpage4").css("display", "none");
        $(".newprojectContainerBody-editpage5").css("display", "none");
        $(".newprojectContainerBody-editpage6").css("display", "none");
        $(".newprojectContainerBody-editpage7").css("display", "none");
        $(".newprojectContainerBody-readonly").css("display", "none");
        $(".newprojectFooter .edit-page1").css("display", "block");
        $(".newprojectFooter .edit-page2").css("display", "none");
        $(".newprojectFooter .edit-page3").css("display", "none");
        $(".newprojectFooter .edit-page4").css("display", "none");
        $(".newprojectFooter .edit-page5").css("display", "none");
        $(".newprojectFooter .edit-page6").css("display", "none");
        $(".newprojectFooter .edit-page7").css("display", "none");
        $(".newprojectFooter .edit-page8").css("display", "none");
        $(".pagenumber .pagecounter#page2").removeClass("active");
        $(".pagenumber .pagecounter#page3").removeClass("active");
        $(".pagenumber .pagecounter#page4").removeClass("active");
        $(".pagenumber .pagecounter#page5").removeClass("active");
        $(".pagenumber .pagecounter#page6").removeClass("active");
        $(".pagenumber .pagecounter#page7").removeClass("active");
        $(".pagenumber .pagecounter#page8").removeClass("active");
    });

    $("#newprojectback2-2").on("click", function () {
        event.preventDefault();

        $(".newprojectContainerBody-editpage1").css("display", "none");
        $(".newprojectContainerBody-editpage2").css("display", "block");
        $(".newprojectContainerBody-editpage3").css("display", "none");
        $(".newprojectContainerBody-editpage4").css("display", "none");
        $(".newprojectContainerBody-editpage5").css("display", "none");
        $(".newprojectContainerBody-editpage6").css("display", "none");
        $(".newprojectContainerBody-editpage7").css("display", "none");
        $(".newprojectContainerBody-readonly").css("display", "none");
        $(".newprojectFooter .edit-page1").css("display", "none");
        $(".newprojectFooter .edit-page2").css("display", "block");
        $(".newprojectFooter .edit-page3").css("display", "none");
        $(".newprojectFooter .edit-page4").css("display", "none");
        $(".newprojectFooter .edit-page5").css("display", "none");
        $(".newprojectFooter .edit-page6").css("display", "none");
        $(".newprojectFooter .edit-page7").css("display", "none");
        $(".newprojectFooter .edit-page8").css("display", "none");
        $(".pagenumber .pagecounter#page1").removeClass("active");
        $(".pagenumber .pagecounter#page2").addClass("active");
        $(".pagenumber .pagecounter#page3").removeClass("active");
        $(".pagenumber .pagecounter#page4").removeClass("active");
        $(".pagenumber .pagecounter#page5").removeClass("active");
        $(".pagenumber .pagecounter#page6").removeClass("active");
        $(".pagenumber .pagecounter#page7").removeClass("active");
        $(".pagenumber .pagecounter#page8").removeClass("active");
    });

    $("#newprojectnextpage3").on("click", function () {
        event.preventDefault();
        if (typeof selector2 !== "undefined") {
            selector2.show = false;
        }
        Cesium.Camera.DEFAULT_VIEW_RECTANGLE = defaultview;
        Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;
        var enddate = $("#projectenddate").val();
        var startdate = $("#projectstartdate").val();
        if (startdate > enddate) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "End date needs to be after the start date. Please change.",
            });
            return;
        }
        if ($("#latit1").text() === $("#latit2").text()) {
            $("#coordinateval2").hide();
        } else {
            $("#coordinateval2").show();
        }
        $(".newprojectContainerBody-editpage1").css("display", "none");
        $(".newprojectContainerBody-editpage2").css("display", "none");
        $(".newprojectContainerBody-editpage3").css("display", "none");
        $(".newprojectContainerBody-editpage4").css("display", "block");
        $(".newprojectContainerBody-editpage5").css("display", "none");
        $(".newprojectContainerBody-editpage6").css("display", "none");
        $(".newprojectContainerBody-editpage7").css("display", "none");
        $(".newprojectContainerBody-readonly").css("display", "none");
        $(".newprojectFooter .edit-page1").css("display", "none");
        $(".newprojectFooter .edit-page2").css("display", "none");
        $(".newprojectFooter .edit-page3").css("display", "none");
        $(".newprojectFooter .edit-page4").css("display", "block");
        $(".newprojectFooter .edit-page5").css("display", "none");
        $(".newprojectFooter .edit-page6").css("display", "none");
        $(".newprojectFooter .edit-page7").css("display", "none");
        $(".newprojectFooter .edit-page8").css("display", "none");
        $(".pagenumber .pagecounter#page1").removeClass("active");
        $(".pagenumber .pagecounter#page2").removeClass("active");
        $(".pagenumber .pagecounter#page3").removeClass("active");
        $(".pagenumber .pagecounter#page4").addClass("active");
        $(".pagenumber .pagecounter#page5").removeClass("active");
        $(".pagenumber .pagecounter#page6").removeClass("active");
        $(".pagenumber .pagecounter#page7").removeClass("active");
        $(".pagenumber .pagecounter#page8").removeClass("active");
    });

    $("#newprojectback3").on("click", function () {
        event.preventDefault();

        $(".newprojectContainerBody-editpage1").css("display", "none");
        $(".newprojectContainerBody-editpage2").css("display", "none");
        $(".newprojectContainerBody-editpage3").css("display", "block");
        $(".newprojectContainerBody-editpage4").css("display", "none");
        $(".newprojectContainerBody-editpage5").css("display", "none");
        $(".newprojectContainerBody-editpage6").css("display", "none");
        $(".newprojectContainerBody-editpage7").css("display", "none");
        $(".newprojectContainerBody-readonly").css("display", "none");
        $(".newprojectFooter .edit-page1").css("display", "none");
        $(".newprojectFooter .edit-page2").css("display", "none");
        $(".newprojectFooter .edit-page3").css("display", "block");
        $(".newprojectFooter .edit-page4").css("display", "none");
        $(".newprojectFooter .edit-page5").css("display", "none");
        $(".newprojectFooter .edit-page6").css("display", "none");
        $(".newprojectFooter .edit-page7").css("display", "none");
        $(".newprojectFooter .edit-page8").css("display", "none");
        $(".pagenumber .pagecounter#page1").removeClass("active");
        $(".pagenumber .pagecounter#page2").removeClass("active");
        $(".pagenumber .pagecounter#page3").addClass("active");
        $(".pagenumber .pagecounter#page4").removeClass("active");
        $(".pagenumber .pagecounter#page5").removeClass("active");
        $(".pagenumber .pagecounter#page6").removeClass("active");
        $(".pagenumber .pagecounter#page7").removeClass("active");
        $(".pagenumber .pagecounter#page8").removeClass("active");
    });

    $("#newprojectnextpage4").on("click", function () {
        event.preventDefault();
        enlargeformSize();
        $(".newprojectContainerBody-editpage1").css("display", "none");
        $(".newprojectContainerBody-editpage2").css("display", "none");
        $(".newprojectContainerBody-editpage3").css("display", "none");
        $(".newprojectContainerBody-editpage4").css("display", "none");
        $(".newprojectContainerBody-editpage5").css("display", "block");
        $(".newprojectContainerBody-editpage6").css("display", "none");
        $(".newprojectContainerBody-editpage7").css("display", "none");
        $(".newprojectContainerBody-readonly").css("display", "none");
        $(".newprojectFooter .edit-page1").css("display", "none");
        $(".newprojectFooter .edit-page2").css("display", "none");
        $(".newprojectFooter .edit-page3").css("display", "none");
        $(".newprojectFooter .edit-page4").css("display", "none");
        $(".newprojectFooter .edit-page5").css("display", "block");
        $(".newprojectFooter .edit-page6").css("display", "none");
        $(".newprojectFooter .edit-page7").css("display", "none");
        $(".newprojectFooter .edit-page8").css("display", "none");
        $(".pagenumber .pagecounter#page1").removeClass("active");
        $(".pagenumber .pagecounter#page2").removeClass("active");
        $(".pagenumber .pagecounter#page3").removeClass("active");
        $(".pagenumber .pagecounter#page4").removeClass("active");
        $(".pagenumber .pagecounter#page5").addClass("active");
        $(".pagenumber .pagecounter#page6").removeClass("active");
        $(".pagenumber .pagecounter#page7").removeClass("active");
        $(".pagenumber .pagecounter#page8").removeClass("active");
        $("#toggleAllUser").prop("checked", false)
    });

    $("#newprojectback4").on("click", function () {
        event.preventDefault();
        shrinkformSize();

        $(".newprojectContainerBody-editpage1").css("display", "none");
        $(".newprojectContainerBody-editpage2").css("display", "none");
        $(".newprojectContainerBody-editpage3").css("display", "none");
        $(".newprojectContainerBody-editpage4").css("display", "block");
        $(".newprojectContainerBody-editpage5").css("display", "none");
        $(".newprojectContainerBody-editpage6").css("display", "none");
        $(".newprojectContainerBody-editpage7").css("display", "none");
        $(".newprojectContainerBody-readonly").css("display", "none");
        $(".newprojectFooter .edit-page1").css("display", "none");
        $(".newprojectFooter .edit-page2").css("display", "none");
        $(".newprojectFooter .edit-page3").css("display", "none");
        $(".newprojectFooter .edit-page4").css("display", "block");
        $(".newprojectFooter .edit-page5").css("display", "none");
        $(".newprojectFooter .edit-page6").css("display", "none");
        $(".newprojectFooter .edit-page7").css("display", "none");
        $(".newprojectFooter .edit-page8").css("display", "none");
        $(".pagenumber .pagecounter#page1").removeClass("active");
        $(".pagenumber .pagecounter#page2").removeClass("active");
        $(".pagenumber .pagecounter#page3").removeClass("active");
        $(".pagenumber .pagecounter#page4").addClass("active");
        $(".pagenumber .pagecounter#page5").removeClass("active");
        $(".pagenumber .pagecounter#page6").removeClass("active");
        $(".pagenumber .pagecounter#page7").removeClass("active");
        $(".pagenumber .pagecounter#page8").removeClass("active");

        $(".newprojectContainerBody-editpage4 .filterContainer").hide();
        $(".newprojectContainerBody-editpage4 .container-table").css({
            width: "calc(100% - 40px)",
            left: "20px",
            "margin-left": "0px",
        });
        $("#organizeuser").removeClass("active");
        $("#searchEmail1").val("");
        searchForName($("#searchEmail1")[0]);
    });

    $("#newprojectnextpage5").on("click", function () {
        event.preventDefault();
        var flagError = checkSelectedUsers(); //check if the users checked have role selections
        if (flagError == true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please ensure role for each user is assigned.",
            });
            return;
        }

        if (flagEdit) {
            // confirm delete box - check all not checked value if user exists in current project
            var notSel = [];
            $('input:checkbox[class ="addusertable"]:not(:checked)').each(function (idx) {
                notSel.push($(this).attr('id'));
            });
            var projUser = click_project_details.users;
            var userToDelListHtml = '';
            projUser.forEach(function (ele, idx) {
                if (notSel.includes(ele.Usr_ID)) {
                    userToDelListHtml += '<li>';
                    userToDelListHtml += ele.user_firstname + ' ' + ele.user_lastname + ' (' + ele.user_email + ')';
                    userToDelListHtml += '</li>';
                }

            })
            if (userToDelListHtml.length != 0) {
                var message = "<div>You are about to remove the user listed below from the project. Are you confirm?"
                    + "<ul>"
                    + userToDelListHtml
                    + "<ul>";
                $.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: message,
                    buttons: {
                        confirm: newprojectnextpage5func,
                        cancel: function () {
                            return;
                        },
                    },
                });
            } else {
                newprojectnextpage5func();
            }
        } else {
            newprojectnextpage5func();
        }
    });

    function newprojectnextpage5func() {
        enlargeformSize();
        $(".newprojectContainerBody-editpage1").css("display", "none");
        $(".newprojectContainerBody-editpage2").css("display", "none");
        $(".newprojectContainerBody-editpage3").css("display", "none");
        $(".newprojectContainerBody-editpage4").css("display", "none");
        $(".newprojectContainerBody-editpage5").css("display", "none");
        $(".newprojectContainerBody-editpage6").css("display", "block");
        $(".newprojectContainerBody-editpage7").css("display", "none");
        $(".newprojectContainerBody-readonly").css("display", "none");
        $(".newprojectFooter .edit-page5").css("display", "none");
        $(".newprojectFooter .edit-page6").css("display", "block"); //contractor consultant page
        $(".newprojectFooter .edit-page7").css("display", "none");
        $(".newprojectFooter .edit-page8").css("display", "none");
        $(".pagenumber .pagecounter#page1").removeClass("active");
        $(".pagenumber .pagecounter#page2").removeClass("active");
        $(".pagenumber .pagecounter#page3").removeClass("active");
        $(".pagenumber .pagecounter#page4").removeClass("active");
        $(".pagenumber .pagecounter#page5").removeClass("active");
        $(".pagenumber .pagecounter#page6").addClass("active");
        $(".pagenumber .pagecounter#page7").removeClass("active");
        $(".pagenumber .pagecounter#page8").removeClass("active");
        $("#toggleAllContractorUser").prop("checked", false);
        $("#toggleAllConsultantUser").prop("checked", false)

        copyprojectinputvalue();
        $("#searchEmail1").val("");
        searchForName($("#searchEmail1")[0]);
    }


    $("#newprojectback5").on("click", function () {
        event.preventDefault();
        //shrinkformSize()
        selector2.show = false;
        if (!(selector3 == null)) {
            selector3.show = false;
        }
        enlargeformSize();
        $(".newprojectContainerBody-editpage1").css("display", "none");
        $(".newprojectContainerBody-editpage2").css("display", "none");
        $(".newprojectContainerBody-editpage3").css("display", "none");
        $(".newprojectContainerBody-editpage4").css("display", "none");
        $(".newprojectContainerBody-editpage5").css("display", "block");
        $(".newprojectContainerBody-editpage6").css("display", "none");
        $(".newprojectContainerBody-editpage7").css("display", "none");
        $(".newprojectContainerBody-readonly").css("display", "none");
        $(".newprojectFooter .edit-page1").css("display", "none");
        $(".newprojectFooter .edit-page2").css("display", "none");
        $(".newprojectFooter .edit-page3").css("display", "none");
        $(".newprojectFooter .edit-page4").css("display", "none");
        $(".newprojectFooter .edit-page5").css("display", "block");
        $(".newprojectFooter .edit-page6").css("display", "none");
        $(".newprojectFooter .edit-page7").css("display", "none");
        $(".newprojectFooter .edit-page8").css("display", "none");
        $(".pagenumber .pagecounter#page1").removeClass("active");
        $(".pagenumber .pagecounter#page2").removeClass("active");
        $(".pagenumber .pagecounter#page3").removeClass("active");
        $(".pagenumber .pagecounter#page4").removeClass("active");
        $(".pagenumber .pagecounter#page5").addClass("active");
        $(".pagenumber .pagecounter#page6").removeClass("active");
        $(".pagenumber .pagecounter#page7").removeClass("active");
        $(".pagenumber .pagecounter#page8").removeClass("active");
    });

    $("#newprojectnextpage6").on("click", function () {
        event.preventDefault();
        enlargeformSize2();
        $(".newprojectContainerBody-editpage1").css("display", "none");
        $(".newprojectContainerBody-editpage2").css("display", "none");
        $(".newprojectContainerBody-editpage3").css("display", "none");
        $(".newprojectContainerBody-editpage4").css("display", "none");
        $(".newprojectContainerBody-editpage5").css("display", "none");
        $(".newprojectContainerBody-editpage6").css("display", "none");
        $(".newprojectContainerBody-editpage7").css("display", "block");
        $(".newprojectContainerBody-readonly").css("display", "none");
        $(".newprojectFooter .edit-page1").css("display", "none");
        $(".newprojectFooter .edit-page2").css("display", "none");
        $(".newprojectFooter .edit-page3").css("display", "none");
        $(".newprojectFooter .edit-page4").css("display", "none");
        $(".newprojectFooter .edit-page5").css("display", "none");
        $(".newprojectFooter .edit-page6").css("display", "none");
        $(".newprojectFooter .edit-page7").css("display", "block");
        $(".newprojectFooter .edit-page8").css("display", "none");
        $(".pagenumber .pagecounter#page1").removeClass("active");
        $(".pagenumber .pagecounter#page2").removeClass("active");
        $(".pagenumber .pagecounter#page3").removeClass("active");
        $(".pagenumber .pagecounter#page4").removeClass("active");
        $(".pagenumber .pagecounter#page5").removeClass("active");
        $(".pagenumber .pagecounter#page6").removeClass("active");
        $(".pagenumber .pagecounter#page7").addClass("active");
        $(".pagenumber .pagecounter#page8").removeClass("active");

        copyprojectinputvalue();
        $("#searchEmail1").val("");
        searchForName($("#searchEmail1")[0]);

        var flagError = getSelectedProjectUsers(); //get all the users selected
        if (flagError === true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please ensure role for each user is assigned.",
            });
            return false
        }
        displaySelectedUsersForGroupRole(userProjectArr); //display all the selected users with the group
        if (flagEdit) { //if editing a project then check for saved group roles
            var obj = click_project_details.users;
            $('input:checkbox[class ="addusergrouptable"]').each(function () {
                var i = 0;
                while (i < obj.length) {
                    if ($(this).attr("id") == obj[i].user_id) {
                        var values = obj[i].project_group;
                        if (values.length > 0) {
                            $(this).prop("checked", true);
                            var id = "gs" + $(this).attr("id");
                            var element = document.getElementById(id);
                            for (var j = 0; j < element.options.length; j++) {
                                element.options[j].selected = values.indexOf(element.options[j].value) >= 0;
                            }
                            element.style.display = "block";
                        }
                        break;
                    }
                    i++;
                }
            });
        }
    })

    $("#newprojectback6").on("click", function () {
        event.preventDefault();
        //shrinkformSize()
        selector2.show = false;
        if (!(selector3 == null)) {
            selector3.show = false;
        }
        enlargeformSize();
        $(".newprojectContainerBody-editpage1").css("display", "none");
        $(".newprojectContainerBody-editpage2").css("display", "none");
        $(".newprojectContainerBody-editpage3").css("display", "none");
        $(".newprojectContainerBody-editpage4").css("display", "none");
        $(".newprojectContainerBody-editpage5").css("display", "none");
        $(".newprojectContainerBody-editpage6").css("display", "block");
        $(".newprojectContainerBody-editpage7").css("display", "none");
        $(".newprojectContainerBody-readonly").css("display", "none");
        $(".newprojectFooter .edit-page1").css("display", "none");
        $(".newprojectFooter .edit-page2").css("display", "none");
        $(".newprojectFooter .edit-page3").css("display", "none");
        $(".newprojectFooter .edit-page4").css("display", "none");
        $(".newprojectFooter .edit-page5").css("display", "none");
        $(".newprojectFooter .edit-page6").css("display", "block");
        $(".newprojectFooter .edit-page7").css("display", "none");
        $(".newprojectFooter .edit-page8").css("display", "none");
        $(".pagenumber .pagecounter#page1").removeClass("active");
        $(".pagenumber .pagecounter#page2").removeClass("active");
        $(".pagenumber .pagecounter#page3").removeClass("active");
        $(".pagenumber .pagecounter#page4").removeClass("active");
        $(".pagenumber .pagecounter#page5").removeClass("active");
        $(".pagenumber .pagecounter#page6").addClass("active");
        $(".pagenumber .pagecounter#page7").removeClass("active");
        $(".pagenumber .pagecounter#page8").removeClass("active");
    })

    $("#newprojectnextpage7").on("click", function () {
        event.preventDefault();
        // enlargeformSize2();
        // $(".newprojectContainerBody-editpage1").css("display", "none");
        // $(".newprojectContainerBody-editpage2").css("display", "none");
        // $(".newprojectContainerBody-editpage3").css("display", "none");
        // $(".newprojectContainerBody-editpage4").css("display", "none");
        // $(".newprojectContainerBody-editpage5").css("display", "none");
        // $(".newprojectContainerBody-editpage6").css("display", "none");
        // $(".newprojectContainerBody-editpage7").css("display", "none");
        // $(".newprojectContainerBody-readonly").css("display", "block");
        // $(".newprojectFooter .edit-page1").css("display", "none");
        // $(".newprojectFooter .edit-page2").css("display", "none");
        // $(".newprojectFooter .edit-page3").css("display", "none");
        // $(".newprojectFooter .edit-page4").css("display", "none");
        // $(".newprojectFooter .edit-page5").css("display", "none");
        // $(".newprojectFooter .edit-page6").css("display", "none");
        // $(".newprojectFooter .edit-page7").css("display", "none");
        // $(".newprojectFooter .edit-page8").css("display", "block");
        // $(".pagenumber .pagecounter#page1").removeClass("active");
        // $(".pagenumber .pagecounter#page2").removeClass("active");
        // $(".pagenumber .pagecounter#page3").removeClass("active");
        // $(".pagenumber .pagecounter#page4").removeClass("active");
        // $(".pagenumber .pagecounter#page5").removeClass("active");
        // $(".pagenumber .pagecounter#page6").removeClass("active");
        // $(".pagenumber .pagecounter#page7").removeClass("active");
        // $(".pagenumber .pagecounter#page8").addClass("active");

        // // // get the group roles  selected
        pagecounterpage8func(); //added it to this function

        // copyprojectinputvalue();
        // $("#searchEmail1").val("");
        // searchForName($("#searchEmail1")[0]);
    })

    $("#newprojectback7").on("click", function () {
        event.preventDefault();
        //shrinkformSize()
        selector2.show = false;
        if (!(selector3 == null)) {
            selector3.show = false;
        }
        enlargeformSize();
        $(".newprojectContainerBody-editpage1").css("display", "none");
        $(".newprojectContainerBody-editpage2").css("display", "none");
        $(".newprojectContainerBody-editpage3").css("display", "none");
        $(".newprojectContainerBody-editpage4").css("display", "none");
        $(".newprojectContainerBody-editpage5").css("display", "none");
        $(".newprojectContainerBody-editpage6").css("display", "none");
        $(".newprojectContainerBody-editpage7").css("display", "block");
        $(".newprojectContainerBody-readonly").css("display", "none");
        $(".newprojectFooter .edit-page1").css("display", "none");
        $(".newprojectFooter .edit-page2").css("display", "none");
        $(".newprojectFooter .edit-page3").css("display", "none");
        $(".newprojectFooter .edit-page4").css("display", "none");
        $(".newprojectFooter .edit-page5").css("display", "none");
        $(".newprojectFooter .edit-page6").css("display", "none");
        $(".newprojectFooter .edit-page7").css("display", "block");
        $(".newprojectFooter .edit-page8").css("display", "none");
        $(".pagenumber .pagecounter#page1").removeClass("active");
        $(".pagenumber .pagecounter#page2").removeClass("active");
        $(".pagenumber .pagecounter#page3").removeClass("active");
        $(".pagenumber .pagecounter#page4").removeClass("active");
        $(".pagenumber .pagecounter#page5").removeClass("active");
        $(".pagenumber .pagecounter#page6").removeClass("active");
        $(".pagenumber .pagecounter#page7").addClass("active");
        $(".pagenumber .pagecounter#page8").removeClass("active");
    })

    $("#newprojectEdit").on("click", function () {
        event.preventDefault();
        clearError()
        shrinkformSize();
        resetprojectinputvalue();
        projecteditstate();
        copyprojectdivvalue();
        flagEdit = true;

        $("#newprojectheaderDisplay").html("Edit Project");
        $(".newprojectFooter .edit-page8 #newprojectSave").css("display", "none");
        $(".newprojectFooter .edit-page8 #newprojectSave1").css("display", "none");
        $(".newprojectFooter .edit-page8 #newprojectUpdate1").css(
            "display",
            "none"
        );
        $(".newprojectFooter .edit-page8 #newprojectUpdate").css(
            "display",
            "inline"
        );
    });

    $(".newprojectCancel").on("click", function () {
        event.preventDefault();
        $("#addnewprojectForm").css("display", "none");
        $("#addnewprojectForm").removeClass("active");
        shrinkformSize();
        resetprojectinputvalue();
        $("#searchEmail1").val("");
        searchForName($("#searchEmail1")[0]);
        clearError()
    });
    $(".newprojectCancel1").on("click", function () {
        event.preventDefault();
        $("#addnewprojectForm").css("display", "none");
        $("#addnewprojectForm").removeClass("active");
        shrinkformSize();
        resetprojectinputvalue();
        clearError()
    });

    //animation for closing the newproject view
    $('#addnewprojectForm .formContent #newprojectCloseButton').on('click', function () {
        event.preventDefault();
        clearError()
        $('#addnewprojectForm').css('display', 'none')
        $('#addnewprojectForm').removeClass('active');
        shrinkformSize()
        resetprojectinputvalue()
        $("#searchEmail1").val("")
        searchForName($("#searchEmail1")[0])
    })

    //animation for closing the CREATE NEW USER PROFILE
    $(".newprojectFooter .readonly #newprojectClose").on("click", function () {
        event.preventDefault();
        clearError()
        $("#addnewprojectForm").css("display", "none");
        $("#addnewprojectForm").removeClass("active");
        shrinkformSize();
        resetprojectinputvalue();
    });

    $(".pagenumber .pagecounter#page1").on("click", function () {
        event.preventDefault();
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }
        //checks if the same ID and name exists in database.
        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            clearError(); //clear any css for invalid project details
            if (typeof selector2 !== "undefined") {
                selector2.show = false;
            }

            shrinkformSize();
            // enlargeformSize()
            $(".newprojectContainerBody-editpage1").css("display", "block");
            $(".newprojectContainerBody-editpage2").css("display", "none");
            $(".newprojectContainerBody-editpage3").css("display", "none");
            $(".newprojectContainerBody-editpage4").css("display", "none");
            $(".newprojectContainerBody-editpage5").css("display", "none");
            $(".newprojectContainerBody-editpage6").css("display", "none");
            $(".newprojectContainerBody-editpage7").css("display", "none");
            $(".newprojectContainerBody-readonly").css("display", "none");
            $(".newprojectFooter .edit-page1").css("display", "block");
            $(".newprojectFooter .edit-page2").css("display", "none");
            $(".newprojectFooter .edit-page3").css("display", "none");
            $(".newprojectFooter .edit-page4").css("display", "none");
            $(".newprojectFooter .edit-page5").css("display", "none");
            $(".newprojectFooter .edit-page6").css("display", "none");
            $(".newprojectFooter .edit-page7").css("display", "none");
            $(".newprojectFooter .edit-page8").css("display", "none");
            $(".newprojectFooter .readonly").css("display", "none");
            $(".pagenumber .pagecounter#page1").addClass("active");
            $(".pagenumber .pagecounter#page2").removeClass("active");
            $(".pagenumber .pagecounter#page3").removeClass("active");
            $(".pagenumber .pagecounter#page4").removeClass("active");
            $(".pagenumber .pagecounter#page5").removeClass("active");
            $(".pagenumber .pagecounter#page6").removeClass("active");
            $(".pagenumber .pagecounter#page7").removeClass("active");
            $(".pagenumber .pagecounter#page8").removeClass("active");
        });
    });

    $(".pagenumber .pagecounter#page2").on("click", function () {
        event.preventDefault();
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }
        //checks if the same ID and name exists in database.
        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            clearError(); //clear any css for invalid project details
            if (typeof selector2 !== "undefined") {
                selector2.show = false;
            }
            shrinkformSize();
            $(".newprojectContainerBody-editpage1").css("display", "none");
            $(".newprojectContainerBody-editpage2").css("display", "block");
            $(".newprojectContainerBody-editpage3").css("display", "none");
            $(".newprojectContainerBody-editpage4").css("display", "none");
            $(".newprojectContainerBody-editpage5").css("display", "none");
            $(".newprojectContainerBody-editpage6").css("display", "none");
            $(".newprojectContainerBody-editpage7").css("display", "none");
            $(".newprojectContainerBody-readonly").css("display", "none");
            $(".newprojectFooter .edit-page1").css("display", "none");
            $(".newprojectFooter .edit-page2").css("display", "block");
            $(".newprojectFooter .edit-page3").css("display", "none");
            $(".newprojectFooter .edit-page4").css("display", "none");
            $(".newprojectFooter .edit-page5").css("display", "none");
            $(".newprojectFooter .edit-page6").css("display", "none");
            $(".newprojectFooter .edit-page7").css("display", "none");
            $(".newprojectFooter .edit-page8").css("display", "none");
            $(".newprojectFooter .readonly").css("display", "none");
            $(".pagenumber .pagecounter#page1").removeClass("active");
            $(".pagenumber .pagecounter#page2").addClass("active");
            $(".pagenumber .pagecounter#page3").removeClass("active");
            $(".pagenumber .pagecounter#page4").removeClass("active");
            $(".pagenumber .pagecounter#page5").removeClass("active");
            $(".pagenumber .pagecounter#page6").removeClass("active");
            $(".pagenumber .pagecounter#page7").removeClass("active");
            $(".pagenumber .pagecounter#page8").removeClass("active");

            $(".newprojectContainerBody-editpage4 .filterContainer").hide();
            $(".newprojectContainerBody-editpage4 .container-table").css({
                width: "calc(100% - 40px)",
                left: "20px",
                "margin-left": "0px",
            });
            $("#organizeuser").removeClass("active");
            $("#searchEmail1").val("");
            searchForName($("#searchEmail1")[0]);
        });
    });

    $(".pagenumber .pagecounter#page3").on("click", function () {
        event.preventDefault();
       //there is no more wir process to check for claim submission. so removed this check.
        // if ($("#app_IC").prop("checked") == true && $("#app_WIR").prop("checked") == false ) {
        //     $.alert({
        //         boxWidth: "30%",
        //         useBootstrap: false,
        //         title: "Message",
        //         content: "WIR in Construction App is a dependecy of Interim Claim. It must be selected. "
        //     });
        //     return;
        // }
        selector2.show = false;
        if (!(selector3 == null)) {
            selector3.show = false;
        }
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }

        //checks if the same ID and name exists in database.
        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            clearError(); //clear any css for invalid project details
            if (typeof selector2 !== "undefined") {
                selector2.show = false;
            }
            shrinkformSize();
            // enlargeformSize()
            $(".newprojectContainerBody-editpage1").css("display", "none");
            $(".newprojectContainerBody-editpage2").css("display", "none");
            $(".newprojectContainerBody-editpage3").css("display", "block");
            $(".newprojectContainerBody-editpage4").css("display", "none");
            $(".newprojectContainerBody-editpage5").css("display", "none");
            $(".newprojectContainerBody-editpage6").css("display", "none");
            $(".newprojectContainerBody-editpage7").css("display", "none");
            $(".newprojectContainerBody-readonly").css("display", "none");
            $(".newprojectFooter .edit-page1").css("display", "none");
            $(".newprojectFooter .edit-page2").css("display", "none");
            $(".newprojectFooter .edit-page3").css("display", "block");
            $(".newprojectFooter .edit-page4").css("display", "none");
            $(".newprojectFooter .edit-page5").css("display", "none");
            $(".newprojectFooter .edit-page6").css("display", "none");
            $(".newprojectFooter .edit-page7").css("display", "none");
            $(".newprojectFooter .edit-page8").css("display", "none");
            $(".newprojectFooter .readonly").css("display", "none");
            $(".pagenumber .pagecounter#page1").removeClass("active");
            $(".pagenumber .pagecounter#page2").removeClass("active");
            $(".pagenumber .pagecounter#page3").addClass("active");
            $(".pagenumber .pagecounter#page4").removeClass("active");
            $(".pagenumber .pagecounter#page5").removeClass("active");
            $(".pagenumber .pagecounter#page6").removeClass("active");
            $(".pagenumber .pagecounter#page7").removeClass("active");
            $(".pagenumber .pagecounter#page8").removeClass("active");
        });
    });

    $(".pagenumber .pagecounter#page4").on("click", function () {
        event.preventDefault();
       //there is no more wir process to check for claim submission. so removed this check.
        // if ($("#app_IC").prop("checked") == true && $("#app_WIR").prop("checked") == false ) {
        //     $.alert({
        //         boxWidth: "30%",
        //         useBootstrap: false,
        //         title: "Message",
        //         content: "WIR in Construction App is a dependecy of Interim Claim. It must be selected. "
        //     });
        //     return;
        // }
        selector2.show = false;
        if (!(selector3 == null)) {
            selector3.show = false;
        }
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }
        //checks if the same ID and name exists in database.
        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            clearError(); //clear any css for invalid project details
            if (typeof selector2 !== "undefined") {
                selector2.show = false;
            }
            shrinkformSize();
            $(".newprojectContainerBody-editpage1").css("display", "none");
            $(".newprojectContainerBody-editpage2").css("display", "none");
            $(".newprojectContainerBody-editpage3").css("display", "none");
            $(".newprojectContainerBody-editpage4").css("display", "block");
            $(".newprojectContainerBody-editpage5").css("display", "none");
            $(".newprojectContainerBody-editpage6").css("display", "none");
            $(".newprojectContainerBody-editpage7").css("display", "none");
            $(".newprojectContainerBody-readonly").css("display", "none");
            $(".newprojectFooter .edit-page1").css("display", "none");
            $(".newprojectFooter .edit-page2").css("display", "none");
            $(".newprojectFooter .edit-page3").css("display", "none");
            $(".newprojectFooter .edit-page4").css("display", "block");
            $(".newprojectFooter .edit-page5").css("display", "none");
            $(".newprojectFooter .edit-page6").css("display", "none");
            $(".newprojectFooter .edit-page7").css("display", "none");
            $(".newprojectFooter .edit-page8").css("display", "none");
            $(".newprojectFooter .readonly").css("display", "none");
            $(".pagenumber .pagecounter#page1").removeClass("active");
            $(".pagenumber .pagecounter#page2").removeClass("active");
            $(".pagenumber .pagecounter#page3").removeClass("active");
            $(".pagenumber .pagecounter#page4").addClass("active");
            $(".pagenumber .pagecounter#page5").removeClass("active");
            $(".pagenumber .pagecounter#page6").removeClass("active");
            $(".pagenumber .pagecounter#page7").removeClass("active");
            $(".pagenumber .pagecounter#page8").removeClass("active");
        });
    });

    $(".pagenumber .pagecounter#page5").on("click", function () {
       //there is no more wir process to check for claim submission. so removed this check.
        // if ($("#app_IC").prop("checked") == true && $("#app_WIR").prop("checked") == false ) {
        //     $.alert({
        //         boxWidth: "30%",
        //         useBootstrap: false,
        //         title: "Message",
        //         content: "WIR in Construction App is a dependecy of Interim Claim. It must be selected. "
        //     });
        //     return;
        // }
        $("#toggleAllUser").prop("checked", false)
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }
        //checks if the same ID and name exists in database.
        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            clearError(); //clear any css for invalid project details
            if (typeof selector2 !== "undefined") {
                selector2.show = false;
            }
            enlargeformSize();
            $(".newprojectContainerBody-editpage1").css("display", "none");
            $(".newprojectContainerBody-editpage2").css("display", "none");
            $(".newprojectContainerBody-editpage3").css("display", "none");
            $(".newprojectContainerBody-editpage4").css("display", "none");
            $(".newprojectContainerBody-editpage5").css("display", "block");
            $(".newprojectContainerBody-editpage6").css("display", "none");
            $(".newprojectContainerBody-editpage7").css("display", "none");
            $(".newprojectContainerBody-readonly").css("display", "none");
            $(".newprojectFooter .edit-page1").css("display", "none");
            $(".newprojectFooter .edit-page2").css("display", "none");
            $(".newprojectFooter .edit-page3").css("display", "none");
            $(".newprojectFooter .edit-page4").css("display", "none");
            $(".newprojectFooter .edit-page5").css("display", "block");
            $(".newprojectFooter .edit-page6").css("display", "none");
            $(".newprojectFooter .edit-page7").css("display", "none");
            $(".newprojectFooter .edit-page8").css("display", "none");
            $(".newprojectFooter .readonly").css("display", "none");
            $(".pagenumber .pagecounter#page1").removeClass("active");
            $(".pagenumber .pagecounter#page2").removeClass("active");
            $(".pagenumber .pagecounter#page3").removeClass("active");
            $(".pagenumber .pagecounter#page4").removeClass("active");
            $(".pagenumber .pagecounter#page5").addClass("active");
            $(".pagenumber .pagecounter#page6").removeClass("active");
            $(".pagenumber .pagecounter#page7").removeClass("active");
            $(".pagenumber .pagecounter#page8").removeClass("active");
        });
    });

    $(".pagenumber .pagecounter#page6").on("click", function () {
        //there is no more wir process to check for claim submission. so removed this check.
        // if ($("#app_IC").prop("checked") == true && $("#app_WIR").prop("checked") == false ) {
        //     $.alert({
        //         boxWidth: "30%",
        //         useBootstrap: false,
        //         title: "Message",
        //         content: "WIR in Construction App is a dependecy of Interim Claim. It must be selected. "
        //     });
        //     return;
        // }
        if (flagEdit) { // Project is being edited .. so need to check if any users are removed

            // confirm delete box - check all not checked value if user exists in current project
            var notSel = [];
            $('input:checkbox[class ="addusertable"]:not(:checked)').each(function (idx) {
                notSel.push($(this).attr('id'));
            });
            var projUser = click_project_details.users;
            var userToDelListHtml = '';
            projUser.forEach(function (ele, idx) {
                if (notSel.includes(ele.Usr_ID)) {
                    userToDelListHtml += '<li>';
                    userToDelListHtml += ele.user_firstname + ' ' + ele.user_lastname + ' (' + ele.user_email + ')';
                    userToDelListHtml += '</li>';
                }

            })
            if (userToDelListHtml.length != 0) {
                var message = "<div>You are about to remove the user listed below from the project. Are you confirm?"
                    + "<ul>"
                    + userToDelListHtml
                    + "<ul>";
                $.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: message,
                    buttons: {
                        confirm: pagecounterpage6func,
                        cancel: function () {
                            return;
                        },
                    },
                });
            } else {
                pagecounterpage6func();
            }
        } else {
            pagecounterpage6func();
        }
    });

    function pagecounterpage6func() {
        $("#toggleAllContractorUser").prop("checked", false)
        $("#toggleAllConsultantUser").prop("checked", false)
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }
        //checks if the same ID and name exists in database.
        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            clearError(); //clear any css for invalid project details
            if (typeof selector2 !== "undefined") {
                selector2.show = false;
            }
            // var flagError = OnClickAddUsersToProjectNext();
            // if (flagError == false) {
            //     return
            // }
            enlargeformSize();
            $(".newprojectContainerBody-editpage1").css("display", "none");
            $(".newprojectContainerBody-editpage2").css("display", "none");
            $(".newprojectContainerBody-editpage3").css("display", "none");
            $(".newprojectContainerBody-editpage4").css("display", "none");
            $(".newprojectContainerBody-editpage5").css("display", "none");
            $(".newprojectContainerBody-editpage6").css("display", "block");
            $(".newprojectContainerBody-editpage7").css("display", "none");
            $(".newprojectContainerBody-readonly").css("display", "none");
            $(".newprojectFooter .edit-page1").css("display", "none");
            $(".newprojectFooter .edit-page2").css("display", "none");
            $(".newprojectFooter .edit-page3").css("display", "none");
            $(".newprojectFooter .edit-page4").css("display", "none");
            $(".newprojectFooter .edit-page5").css("display", "none");
            $(".newprojectFooter .edit-page6").css("display", "block");
            $(".newprojectFooter .edit-page7").css("display", "none");
            $(".newprojectFooter .edit-page8").css("display", "none");
            $(".newprojectFooter .readonly").css("display", "none");
            $(".pagenumber .pagecounter#page1").removeClass("active");
            $(".pagenumber .pagecounter#page2").removeClass("active");
            $(".pagenumber .pagecounter#page3").removeClass("active");
            $(".pagenumber .pagecounter#page4").removeClass("active");
            $(".pagenumber .pagecounter#page5").removeClass("active");
            $(".pagenumber .pagecounter#page6").addClass("active");
            $(".pagenumber .pagecounter#page7").removeClass("active");
            $(".pagenumber .pagecounter#page8").removeClass("active");
            copyprojectinputvalue();
            $("#searchEmail1").val("");
            searchForName($("#searchEmail1")[0]);
        });
    }

    $(".pagenumber .pagecounter#page7").on("click", function () {
        //there is no more wir process to check for claim submission. so removed this check.
        // if ($("#app_IC").prop("checked") == true && $("#app_WIR").prop("checked") == false ) {
        //     $.alert({
        //         boxWidth: "30%",
        //         useBootstrap: false,
        //         title: "Message",
        //         content: "WIR in Construction App is a dependecy of Interim Claim. It must be selected. "
        //     });
        //     return;
        // }
        if (flagEdit) { // Project is being edited .. so need to check if any users are removed

            // confirm delete box - check all not checked value if user exists in current project
            var notSel = [];
            $('input:checkbox[class ="addusertable"]:not(:checked)').each(function (idx) {
                notSel.push($(this).attr('id'));
            });
            var projUser = click_project_details.users;
            var userToDelListHtml = '';
            projUser.forEach(function (ele, idx) {
                if (notSel.includes(ele.Usr_ID)) {
                    userToDelListHtml += '<li>';
                    userToDelListHtml += ele.user_firstname + ' ' + ele.user_lastname + ' (' + ele.user_email + ')';
                    userToDelListHtml += '</li>';
                }

            })
            if (userToDelListHtml.length != 0) {
                var message = "<div>You are about to remove the user listed below from the project. Are you confirm?"
                    + "<ul>"
                    + userToDelListHtml
                    + "<ul>";
                $.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: message,
                    buttons: {
                        confirm: pagecounterpage7func,
                        cancel: function () {
                            return;
                        },
                    },
                });
            } else {
                pagecounterpage7func();
            }
        } else {
            pagecounterpage7func();
        }
    });

    function pagecounterpage7func() {
        $("#toggleAllContractorUser").prop("checked", false)
        $("#toggleAllConsultantUser").prop("checked", false)
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }
        //checks if the same ID and name exists in database.
        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            clearError(); //clear any css for invalid project details
            if (typeof selector2 !== "undefined") {
                selector2.show = false;
            }
            // var flagError = OnClickAddUsersToProjectNext();
            // if (flagError == false) {
            //     return
            // }
            enlargeformSize();
            $(".newprojectContainerBody-editpage1").css("display", "none");
            $(".newprojectContainerBody-editpage2").css("display", "none");
            $(".newprojectContainerBody-editpage3").css("display", "none");
            $(".newprojectContainerBody-editpage4").css("display", "none");
            $(".newprojectContainerBody-editpage5").css("display", "none");
            $(".newprojectContainerBody-editpage6").css("display", "none");
            $(".newprojectContainerBody-editpage7").css("display", "block");
            $(".newprojectContainerBody-readonly").css("display", "none");
            $(".newprojectFooter .edit-page1").css("display", "none");
            $(".newprojectFooter .edit-page2").css("display", "none");
            $(".newprojectFooter .edit-page3").css("display", "none");
            $(".newprojectFooter .edit-page4").css("display", "none");
            $(".newprojectFooter .edit-page5").css("display", "none");
            $(".newprojectFooter .edit-page7").css("display", "block");
            $(".newprojectFooter .edit-page6").css("display", "none");
            $(".newprojectFooter .edit-page8").css("display", "none");
            $(".newprojectFooter .readonly").css("display", "none");
            $(".pagenumber .pagecounter#page1").removeClass("active");
            $(".pagenumber .pagecounter#page2").removeClass("active");
            $(".pagenumber .pagecounter#page3").removeClass("active");
            $(".pagenumber .pagecounter#page4").removeClass("active");
            $(".pagenumber .pagecounter#page5").removeClass("active");
            $(".pagenumber .pagecounter#page7").addClass("active");
            $(".pagenumber .pagecounter#page6").removeClass("active");
            $(".pagenumber .pagecounter#page8").removeClass("active");
            copyprojectinputvalue();
            $("#searchEmail1").val("");
            searchForName($("#searchEmail1")[0]);
        });
    }



    $(".pagenumber .pagecounter#page8").on("click", function () {
       //there is no more wir process to check for claim submission. so removed this check.
        // if ($("#app_IC").prop("checked") == true && $("#app_WIR").prop("checked") == false ) {
        //     $.alert({
        //         boxWidth: "30%",
        //         useBootstrap: false,
        //         title: "Message",
        //         content: "WIR in Construction App is a dependecy of Interim Claim. It must be selected. "
        //     });
        //     return;
        // }
        if (flagEdit) { // Project is being edited .. so need to check if any users are removed

            // confirm delete box - check all not checked value if user exists in current project
            var notSel = [];
            $('input:checkbox[class ="addusertable"]:not(:checked)').each(function (idx) {
                notSel.push($(this).attr('id'));
            });
            var projUser = click_project_details.users;
            var userToDelListHtml = '';
            projUser.forEach(function (ele, idx) {
                if (notSel.includes(ele.Usr_ID)) {
                    userToDelListHtml += '<li>';
                    userToDelListHtml += ele.user_firstname + ' ' + ele.user_lastname + ' (' + ele.user_email + ')';
                    userToDelListHtml += '</li>';
                }

            })
            if (userToDelListHtml.length != 0) {
                var message = "<div>You are about to remove the user listed below from the project. Are you confirm?"
                    + "<ul>"
                    + userToDelListHtml
                    + "<ul>";
                $.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: message,
                    buttons: {
                        confirm: pagecounterpage8func,
                        cancel: function () {
                            return;
                        },
                    },
                });
            } else {
                pagecounterpage8func();
            }
        } else {
            pagecounterpage8func();
        }
    });

    function pagecounterpage8func() {
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }
        //checks if the same ID and name exists in database.
        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            clearError(); //clear any css for invalid project details
            if (typeof selector2 !== "undefined") {
                selector2.show = false;
            }
            // var flagError = OnClickAddUsersToProjectNext();
            // if (flagError == false) {
            //     return
            // }
            enlargeformSize();
            $(".newprojectContainerBody-editpage1").css("display", "none");
            $(".newprojectContainerBody-editpage2").css("display", "none");
            $(".newprojectContainerBody-editpage3").css("display", "none");
            $(".newprojectContainerBody-editpage4").css("display", "none");
            $(".newprojectContainerBody-editpage5").css("display", "none");
            $(".newprojectContainerBody-editpage6").css("display", "none");
            $(".newprojectContainerBody-editpage7").css("display", "block");
            $(".newprojectContainerBody-readonly").css("display", "none");
            $(".newprojectFooter .edit-page1").css("display", "none");
            $(".newprojectFooter .edit-page2").css("display", "none");
            $(".newprojectFooter .edit-page3").css("display", "none");
            $(".newprojectFooter .edit-page4").css("display", "none");
            $(".newprojectFooter .edit-page5").css("display", "none");
            $(".newprojectFooter .edit-page7").css("display", "block");
            $(".newprojectFooter .edit-page6").css("display", "none");
            $(".newprojectFooter .edit-page8").css("display", "none");
            $(".newprojectFooter .readonly").css("display", "none");
            $(".pagenumber .pagecounter#page1").removeClass("active");
            $(".pagenumber .pagecounter#page2").removeClass("active");
            $(".pagenumber .pagecounter#page3").removeClass("active");
            $(".pagenumber .pagecounter#page4").removeClass("active");
            $(".pagenumber .pagecounter#page5").removeClass("active");
            $(".pagenumber .pagecounter#page7").addClass("active");
            $(".pagenumber .pagecounter#page6").removeClass("active");
            $(".pagenumber .pagecounter#page8").removeClass("active");
            copyprojectinputvalue();
            $("#searchEmail1").val("");
            searchForName($("#searchEmail1")[0]);
        });
    }



    $(".pagenumber .pagecounter#page8").on("click", function () {
       //there is no more wir process to check for claim submission. so removed this check.
        // if ($("#app_IC").prop("checked") == true && $("#app_WIR").prop("checked") == false ) {
        //     $.alert({
        //         boxWidth: "30%",
        //         useBootstrap: false,
        //         title: "Message",
        //         content: "WIR in Construction App is a dependecy of Interim Claim. It must be selected. "
        //     });
        //     return;
        // }
        if (flagEdit) {//project is being edited.. so need to check if any users are being removed
            // confirm delete if got any user unchecked
            var notSel = [];
            $('input:checkbox[class ="addusertable"]:not(:checked)').each(function (idx) {
                notSel.push($(this).attr('id'));
            });
            var projUser = click_project_details.users;
            var userToDelListHtml = '';
            projUser.forEach(function (ele, idx) {
                if (notSel.includes(ele.Usr_ID)) {
                    userToDelListHtml += '<li>';
                    userToDelListHtml += ele.user_firstname + ' ' + ele.user_lastname + ' (' + ele.user_email + ')';
                    userToDelListHtml += '</li>';
                }

            })
            if (userToDelListHtml.length != 0) {
                var message = "<div>You are about to remove the user listed below from the project. Are you confirm?"
                    + "<ul>"
                    + userToDelListHtml
                    + "<ul>";
                $.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: message,
                    buttons: {
                        confirm: pagecounterpage8func,
                        cancel: function () {
                            return;
                        },
                    },
                });
            } else {
                pagecounterpage8func();
            }
        } else {
            pagecounterpage8func();
        }
    });

    function pagecounterpage8func() {
        // checks if project id, project name and parent project details are given
        //checks for space in project ID
        var chkresponse = checkProjectDetails();
        if (chkresponse != true) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: chkresponse
            });
            return;
        }
        //checks if the same ID and name exists in database.
        validateProjectDetails(function (response) {
            if (response != true) {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: response
                });
                return;
            }
            clearError(); //clear any css for invalid project details
            if (typeof selector2 !== "undefined") {
                selector2.show = false;
            }
            var flagError = OnClickAddUsersToProjectNext();
            if (flagError == false) {
                return
            }
            // // get the group roles  selected
            //getSelectedGroupRoles();
            enlargeformSize2();
            $(".newprojectContainerBody-editpage1").css("display", "none");
            $(".newprojectContainerBody-editpage2").css("display", "none");
            $(".newprojectContainerBody-editpage3").css("display", "none");
            $(".newprojectContainerBody-editpage4").css("display", "none");
            $(".newprojectContainerBody-editpage5").css("display", "none");
            $(".newprojectContainerBody-editpage6").css("display", "none");
            $(".newprojectContainerBody-editpage7").css("display", "none");
            $(".newprojectContainerBody-readonly").css("display", "block");
            $(".newprojectFooter .edit-page1").css("display", "none");
            $(".newprojectFooter .edit-page2").css("display", "none");
            $(".newprojectFooter .edit-page3").css("display", "none");
            $(".newprojectFooter .edit-page4").css("display", "none");
            $(".newprojectFooter .edit-page5").css("display", "none");
            $(".newprojectFooter .edit-page6").css("display", "none");
            $(".newprojectFooter .edit-page7").css("display", "none");
            $(".newprojectFooter .edit-page8").css("display", "block");
            $(".pagenumber .pagecounter#page1").removeClass("active");
            $(".pagenumber .pagecounter#page2").removeClass("active");
            $(".pagenumber .pagecounter#page3").removeClass("active");
            $(".pagenumber .pagecounter#page4").removeClass("active");
            $(".pagenumber .pagecounter#page5").removeClass("active");
            $(".pagenumber .pagecounter#page6").removeClass("active");
            $(".pagenumber .pagecounter#page7").removeClass("active");
            $(".pagenumber .pagecounter#page8").addClass("active");
            copyprojectinputvalue();
            $("#searchEmail1").val("");
            searchForName($("#searchEmail1")[0]);
        });
    }



    /*  //delete button function for user table
        $('.utable').on('change', function () {
                if ($("input[type='checkbox']:checked").prop("checked")) {
                    $("#sysadmindeleteUser").fadeIn('fast');
                }
                else {
                    $("#sysadmindeleteUser").fadeOut('fast');
                }
            })
     
        //delete button function for project table
        $('.ptable').on('change', function () {
            if ($("input[type='checkbox']:checked").prop("checked")) {
                $("#sysadmindeleteProject").fadeIn('fast');
            }
            else {
                $("#sysadmindeleteProject").fadeOut('fast');
            }
        })
     
        $('.deleteutable').on('change', function () {
            if ($("input[type='checkbox']:checked").prop("checked")) {
                $("#systemadminrecoverUser").fadeIn('fast');
                $("#systemadmindeleteparmanentUser").fadeIn('fast');
            }
            else {
                $("#systemadminrecoverUser").fadeOut('fast');
                $("#systemadmindeleteparmanentUser").fadeOut('fast');
            }
        })
     
        //delete button function for project table
        $('.deleteptable').on('change', function () {
            if ($("input[type='checkbox']:checked").prop("checked")) {
                $("#systemadminrecoverProject").fadeIn('fast');
                $("#systemadmindeleteparmanentProject").fadeIn('fast');
            }
            else {
                $("#systemadminrecoverProject").fadeOut('fast');
                $("#systemadmindeleteparmanentProject").fadeOut('fast');
            }
        })*/


    $("#newpassword, #newconfirmpassword").on("keyup", function () {
        if ($("#newpassword").val() == $("#newconfirmpassword").val()) {
            $("#newpasswordvalidation").html("Matching").css("color", "green");
        } else {
            $("#newpasswordvalidation").html("Not Matching").css("color", "red");
        }
    });

    $("#newpasswordprofile, #newconfirmpasswordprofile").on("keyup", function () {
        if (
            $("#newpasswordprofile").val() == $("#newconfirmpasswordprofile").val()
        ) {
            $("#newpasswordvalidationprofile").html("Matching").css("color", "green");
        } else {
            $("#newpasswordvalidationprofile")
                .html("Not Matching")
                .css("color", "red");
        }
    });

    //toshow/tohide password add user form
    $(".password-showhide-adduser .imgpassword-show-adduser").click(function () {
        $("#newpassword").attr("type", "text");
        $(".password-showhide-adduser .password-show-adduser").hide();
        $(".password-showhide-adduser .password-hide-adduser").show();
        event.preventDefault();
    });
    $(".password-showhide-adduser .imgpassword-hide-adduser").click(function () {
        $("#newpassword").attr("type", "password");
        $(".password-showhide-adduser .password-hide-adduser").hide();
        $(".password-showhide-adduser .password-show-adduser").show();
        event.preventDefault();
    });

    $(
        ".confirm-password-showhide-adduser .imgconfirm-password-show-adduser"
    ).click(function () {
        $("#newconfirmpassword").attr("type", "text");
        $(
            ".confirm-password-showhide-adduser .confirm-password-show-adduser"
        ).hide();
        $(
            ".confirm-password-showhide-adduser .confirm-password-hide-adduser"
        ).show();
        event.preventDefault();
    });
    $(
        ".confirm-password-showhide-adduser .imgconfirm-password-hide-adduser"
    ).click(function () {
        $("#newconfirmpassword").attr("type", "password");
        $(
            ".confirm-password-showhide-adduser .confirm-password-hide-adduser"
        ).hide();
        $(
            ".confirm-password-showhide-adduser .confirm-password-show-adduser"
        ).show();
        event.preventDefault();
    });

    // $("#sortable").sortable({
    //     placeholder: "highlight"
    // });
    // $("#sortable").disableSelection();

    var eleSort = document.getElementById("sortable");
    new Sortable(eleSort, {
        animation: 150,
        ghostClass: 'blue-background-class'
    });
    getLicenseInfo()
});

function resetOrgSelect() {
    $("#seletedContainer").children().remove()
}

function overallprojectState() {
    $("#packagespecificCheck").prop("checked", false)
    $("#overallprojectCheck").prop("checked", true)
    $(".hiddencontainer#packagedetail").removeClass("active")
    $(".hiddencontainer#projectdetail").addClass("active")
    $("label#label-projectid").html("Project ID")
    $("label#label-projectname").html("Project Name")
    $("label#label-projectowner").html("Project Owner")
    $("#label-projectwpcid").hide() //hide wpcid for overall
    $("#projectwpcid").hide() //hide wpcid for overall
    $("#newprojectnextpage1").hide()
    $("#newprojectnextpage1-1").show()
    $("#newprojectback2").hide()
    $("#newprojectback2-2").show()
    $("#newprojectSave").show()
    $("#newprojectSave1").hide()
    $(".pagenumber .hide").show()
    $("#appAssignContainerID").show()
    $(".formcontainerMainBody .pagenumber").css("padding-left", "calc(50% - 330px)")
    $("select#projectindustry").removeClass("readonly")
    $("select#projectindustry").attr("disabled", false)
    $("select#projecttimezone").removeClass("readonly")
    $("select#projecttimezone").attr("disabled", false)

}

function packagespecificState() {
    $("#overallprojectCheck").prop("checked", false)
    $("#packagespecificCheck").prop("checked", true)
    $(".hiddencontainer#projectdetail").removeClass("active")
    $(".hiddencontainer#packagedetail").addClass("active")
    $("label#label-projectid").html("Package ID")
    $("label#label-projectname").html("Package Name")
    $("label#label-projectowner").html("Package Owner")

    //showing and hiding in the function update industry when parent details are updated. if asset type package no wpc-id
    $("#label-projectwpcid").show() //display wpcid for package 
    $("#projectwpcid").show() //display wpcid for package
    $("#newprojectnextpage1").show()
    $("#newprojectnextpage1-1").hide()
    $("#newprojectback2").show()
    $("#newprojectback2-2").hide()
    $("#newprojectSave").hide()
    $("#newprojectSave1").show()
    $(".pagenumber .hide").hide()
    $(".slash .hide").hide()
    $("#appAssignContainerID").hide()
    $(".formcontainerMainBody .pagenumber").css("padding-left", "calc(50% - 230px)")

    $("select#projectindustry").addClass("readonly")  //package project
    $("select#projectindustry").attr("disabled", true)

    $("select#projecttimezone").addClass("readonly")
    $("select#projecttimezone").attr("disabled", true)

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

function OnClickNewUserSave() {
    event.preventDefault();
    var ufname = $("#newfirstname").val();
    var ulname = $("#newlastname").val();
    var uemail = $("#newemail").val();
    var ucountry = $("#newcountry").val();
    var utype = $("#newusertype").val();
    var upassword = $("#newpassword").val();
    
   
   
    var formdata = new FormData();
    formdata.append("fname", ufname);
    formdata.append("lname", ulname);
    formdata.append("email", uemail);
    formdata.append("country", ucountry);
    formdata.append("usertype", utype);
    formdata.append("password", upassword);

    if ($('#createNewOrg').is(':checked')) {
        let orgid = $('#newOrgID').val();
        let orgname = $('#newOrgName').val();
        let orgdesc = $('#newOrgDescription').val();
        let orgtype = $('#newOrgType option:selected').val();
        formdata.append("orgid", orgid);
        formdata.append("orgname", orgname);
        formdata.append("orgdesc", orgdesc);
        formdata.append("orgtype", orgtype);
        //  formdata.append("neworg" ,true);

    } else {
        var uorg = $("#neworg option:selected").val();
        var uorgname = $("#neworg option:selected").text();
        //  formdata.append("neworg", false);
        formdata.append("orgid", uorg);
        formdata.append("orgname", uorgname);
    }
    var supuser = $('#supportUser').is(':checked') ? true : false ;
    formdata.append("supuser", supuser);
   
    formdata.append("functionName", "addUser")
    $.ajax({
        type: "POST",
        url: 'BackEnd/UserFunctions.php',
        data: formdata,
        processData: false,
        contentType: false,
        success: function (res) {
            var obj = JSON.parse(res);

            if (obj.data == "close") {
                $(":input").val("");
                $("#addnewuserForm").css("display", "none");
                $("#addnewuserForm").removeClass("active");
                refreshUserTableBody();
                updateUserCard();
            }
            if ($('#createNewOrg').is(':checked')) {
                getListofOrg()
            }
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: JSON.stringify(obj.msg),
            });
        }
    })
}

function OnClickUserUpdate() {
    event.preventDefault();
    var ufname = $("#newfirstname").val();
    var ulname = $("#newlastname").val();
    var ucountry = $("#newcountry").val();
    var utype = $("#newusertype").val();
    var userid = click_user_details.id;

    var formdata = new FormData();
    formdata.append("userid", userid);
    formdata.append("fname", ufname);
    formdata.append("lname", ulname);
    formdata.append("country", ucountry);
    formdata.append("usertype", utype);

    var supuser = $('#supportUser').is(':checked') ? true : false ;
    formdata.append("supuser", supuser);
    if(supuser !== click_user_details['support_user']){
        formdata.append("supuserChange", true);
    }

    if ($("#checkresetpassword").prop("checked")) {
        var upassword = $("#newpassword").val();
        formdata.append("password", upassword);
    }
   
    formdata.append("functionName", "updateUser")
    $.ajax({
        type: "POST",
        url: 'BackEnd/UserFunctions.php',
        data: formdata,
        processData: false,
        contentType: false,
        success: function (obj) {
            var resp = JSON.parse(obj);
            if (localStorage.signed_in_email == click_user_details.email && ($("#checkresetpassword").prop("checked") == true || click_user_details.user_type !== utype)) {
                //prompt relogin
                $.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: "You'll be logged out for the changes to take effect. Please sign in back with your newly changed credentials.",
                    buttons: {
                        OK: function () {
                            window.open("signin.php", "_self");
                        },
                    }
                });
            }
            if (resp.data == "close") {
                $(':input').val('');
                $('#addnewuserForm').css('display', 'none')
                $('#addnewuserForm').removeClass('active');
                refreshUserTableBody();
            } else if (resp.data == "update fname") {
                $(':input').val('');
                $('#addnewuserForm').css('display', 'none')
                $('#addnewuserForm').removeClass('active');
                refreshUserTableBody();
                $("#span_initial").text(ufname.substring(0, 1) + ulname.substring(0, 1));
                $("#usernameEmail strong").text("Hi, " + ufname);
                $("#navbar_initial").text(ufname.substring(0, 1) + ulname.substring(0, 1));

            };
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: resp.msg,
            });
        }
    })
}

function OnClickDeleteUser() {
    event.preventDefault();
    var userId = click_user_details.id;
    var userName = document.getElementById("newusernamedisplay").innerText;
    var userEmail = document.getElementById("newemaildisplay").innerText;
    var message = "Are you sure you want to deactivate the User : " + userName + "? <br>";
    var userData_array = [];
    userData_array.push({ 'id': userId, 'name': userName });
    
    // to get all projects from this user
    $("#loadingContainer_user").css("display", "block");
    $.ajax({
        type: "POST",
        url: 'BackEnd/joget.php',
        data: {
            functionName: "getPendingProcessByUser",
            userData: userEmail
        },
        success: function (obj) {
            $("#loadingContainer_user").css("display", "none");
            var parsedObj = JSON.parse(obj);
            var constructProcess = parsedObj.construct;
            var pfsProcess = parsedObj.pfs;
            var documentProcess = parsedObj.document;

            if (constructProcess) {
                message += "Construct Process still active as below: <br>";
                for (var i=0; i < constructProcess.length; i++) {
                    message += "  - Process ID " + constructProcess[i].processId + " in " + constructProcess[i].processName + "<br>";
                }
            }
            
            if (pfsProcess) {
                message += "<br>PFS Process still active as below: <br>";
                for (var i=0; i < pfsProcess.length; i++) {
                    message += "  - Process ID " + pfsProcess[i].processId + " in " + pfsProcess[i].processName + "<br>";
                }
            }

            if (documentProcess) {
                message += "<br>Document Process still active as below: <br>";
                for (var i=0; i < documentProcess.length; i++) {
                    message += "  - Correspondence Doc ID " + documentProcess[i]["correspondence.doc_id"] + " in " + documentProcess[i]["correspondence.doc_subject"] + "<br>";
                }
            }

            message += "<br><font color='red'> WARNING: By deactivate user will REMOVE all the associate project that belong to this user. Please confirm. </font>";

            $.confirm({
                boxWidth: "40%",
                useBootstrap: false,
                title: "Confirm!",
                content: message,
                buttons: {
                    confirm: function () {
                        $("#loadingContainer_user").css("display", "block");
                        var arr = [];
                        arr[0] = click_user_details.id;
                        var formdata = new FormData();
        
                        formdata.append("user_id", JSON.stringify(arr));
                        formdata.append("functionName", "inactivateUser")
                        var request = new XMLHttpRequest();
                        request.open("POST", "BackEnd/UserFunctions.php", true);
                        request.send(formdata);
                        request.onreadystatechange = function () {
                            if (request.readyState == 4 && request.status == "200") {
                                $("#loadingContainer_user").css("display", "none");
                                jsonParse = JSON.parse(request.responseText);
                                $.alert({
                                    boxWidth: "30%",
                                    useBootstrap: false,
                                    title: "Message",
                                    content: jsonParse.msg,
                                });
                                $("#addnewuserForm").css("display", "none");
                                $("#addnewuserForm").removeClass("active");
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
        }
    })
}

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
                var formdata = new FormData();
                formdata.append("user_id", JSON.stringify(userid));
                formdata.append("functionName", 'deleteUser');
                var request = new XMLHttpRequest();
                request.open("POST", "BackEnd/UserFunctions.php", true);
                request.send(formdata);
                request.onreadystatechange = function () {
                    if (request.readyState == 4 && request.status == "200") {
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

function OnClickReactivateUser() {
    event.preventDefault();
    var userid = [];
    userid.push(click_user_details.id);
    var name =
        click_user_details.user_firstname + " " + click_user_details.user_lastname;
    var message = "Are you sure you want to recover this User : " + name + "?";

    $.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Confirm!",
        content: message,
        buttons: {
            confirm: function () {
                var formdata = new FormData();
                formdata.append("user_id", JSON.stringify(userid));
                formdata.append("functionName", "reactivateUser")
                var request = new XMLHttpRequest();
                request.open("POST", "BackEnd/UserFunctions.php", true);
                request.send(formdata);
                request.onreadystatechange = function () {
                    if (request.readyState == 4 && request.status == "200") {
                        jsonParse = JSON.parse(request.responseText);
                        $.alert({
                            boxWidth: "30%",
                            useBootstrap: false,
                            title: "Message",
                            content: jsonParse.message,
                        });
                        $("#addnewuserForm").css("display", "none");
                        $("#addnewuserForm").removeClass("active");
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

function OnClickSysadminDeleteUser() {
    var arr = [], ids = [];
    $("input.utable:checkbox:checked").each(function () {
        var id = parseInt($(this).attr("id"));
        var name = $(this).closest("tr").find("td:eq(3)").text();
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

                message += i + 1 + ")" + data[i].user_name;
                if (data[i].project_info.length > 0) {
                    message += " involved in the following projects: <br>";
                    for (var j = 0; j < data[i].project_info.length; j++) {
                        message += "  -as " + data[i].project_info[j].role + " in " + data[i].project_info[j].project_name;
                        if (j + 1 < data[i].project_info.length) {
                            message += "<br>";
                        }
                    };

                }
                message += "<br><br>";

            };
            $.confirm({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Confirm!",
                content: message,
                buttons: {
                    confirm: function () {
                        $("#sysadmindeleteUser").fadeOut("fast");
                        $("#loadingContainer_main").css("display", "block");
                        $("#main-user .checkcounter #userchecked").html("");
                        $("#main-user .checkcounter #userchecked").fadeOut("fast");
                        var formdata = new FormData();
                        formdata.append("user_id", JSON.stringify(ids));
                        formdata.append("functionName", "inactivateUser")
                        var request = new XMLHttpRequest();
                        request.open("POST", "BackEnd/UserFunctions.php", true);
                        request.send(formdata);
                        request.onreadystatechange = function () {
                            if (request.readyState == 4 && request.status == "200") {
                                $("#loadingContainer_main").css("display", "none");
                                let jsonParse = JSON.parse(request.responseText);
                                $.alert({
                                    boxWidth: "30%",
                                    useBootstrap: false,
                                    title: "Message",
                                    content: jsonParse.msg,
                                });
                                $("#sysadmindeleteUser").fadeOut("fast");
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
        }
    })
}

function OnClickSysadminRecoverUsers() {
    var arr = [],
        name = [];
    if (document.getElementById("checkAllDeleteUsers").checked) {
        name.push("All Inactive Users");
        $("input.deleteutable:checkbox:checked").each(function () {
            arr.push(parseInt($(this).attr("id")));
        });
    } else {
        $("input.deleteutable:checkbox:checked").each(function () {
            arr.push(parseInt($(this).attr("id")));
            name.push($(this).closest("tr").find("td:eq(3)").text());
        });
    }
    var message = "Are you sure you want to recover these Users : " + name + "?";
    $.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Confirm!",
        content: message,
        buttons: {
            confirm: function () {
                $("#systemadminrecoverUser").fadeOut("fast");
                $("#systemadmindeleteparmanentUser").fadeOut("fast");
                $("#archived-user .checkcounter #archiveduserchecked").html("");
                $("#archived-user .checkcounter #archiveduserchecked").fadeOut("fast");
                var formdata = new FormData();
                formdata.append("user_id", JSON.stringify(arr));
                formdata.append("functionName", "reactivateUser")
                var request = new XMLHttpRequest();
                request.open("POST", "BackEnd/UserFunctions.php", true);
                request.send(formdata);
                request.onreadystatechange = function () {
                    if (request.readyState == 4 && request.status == "200") {
                        let jsonParse = JSON.parse(request.responseText);
                        $.alert({
                            boxWidth: "30%",
                            useBootstrap: false,
                            title: "Message",
                            content: jsonParse.message,
                        });
                        $("#systemadminrecoverUser").fadeOut("fast");
                        $("#systemadmindeleteparmanentUser").fadeOut("fast");
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

function OnClickSysadminDeletePermanentUsers() {
    var arr = [],
        name = [];
    if (document.getElementById("checkAllDeleteUsers").checked) {
        name.push("All Inactive Users");
        $("input.deleteutable:checkbox:checked").each(function () {
            arr.push(parseInt($(this).attr("id")));
        });
    } else {
        $("input.deleteutable:checkbox:checked").each(function () {
            arr.push(parseInt($(this).attr("id")));
            name.push($(this).closest("tr").find("td:eq(3)").text());
        });
    }
    var message =
        "Are you sure you want to delete these Users permanently from database : " +
        name +
        "?";
    $.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Confirm!",
        content: message,
        buttons: {
            confirm: function () {
                $("#systemadminrecoverUser").fadeOut("fast");
                $("#systemadmindeleteparmanentUser").fadeOut("fast");
                $("#archived-user .checkcounter #archiveduserchecked").html("");
                $("#archived-user .checkcounter #archiveduserchecked").fadeOut("fast");
                var formdata = new FormData();
                formdata.append("user_id", JSON.stringify(arr));
                formdata.append("functionName", 'deleteUser')
                var request = new XMLHttpRequest();
                request.open("POST", "BackEnd/UserFunctions.php", true);
                request.send(formdata);
                request.onreadystatechange = function () {
                    if (request.readyState == 4 && request.status == "200") {
                        let jsonParse = JSON.parse(request.responseText);
                        $.alert({
                            boxWidth: "30%",
                            useBootstrap: false,
                            title: "Message",
                            content: jsonParse.msg,
                        });
                        $("#systemadminrecoverUser").fadeOut("fast");
                        $("#systemadmindeleteparmanentUser").fadeOut("fast");
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

function addUserToProject(ele) {
    usersUpdateflag = true;
    if ($(ele).is(":checked")) {
        var id = "s" + $(ele).attr("id");
        var slt = document.getElementById(id);
        slt.value = "";
        slt.style.display = "block";
    } else {
        var id = "s" + $(ele).attr("id");
        var slt = document.getElementById(id);
        slt.style.display = "none";
    }
}

$("#projectenddate").on("change", function () {
    var enddate = $("#projectenddate").val();
    var startdate = $("#projectstartdate").val();
    var date1 = new Date(enddate);
    var date2 = new Date(startdate);
    var res = Math.abs(date1.getTime() - date2.getTime());
    var msecday = 1000 * 60 * 60 * 24;
    var duration = Math.ceil(res / msecday);
    $("#projectduration").val(duration);
});

function OnClickAddUsersToProjectNext() {
    // userProjectArr.splice(0, userProjectArr.length);
    // newuserlist.splice(0,newuserlist.length);
    // var flagError = null;
    // var ownerNameFlag = false;
    // ownerOrgName = "";
    // $("input.addusertable:checkbox:checked").each(function () { //adds owner users
    //     var sid = "s" + $(this).attr("id");
    //     var slt = document.getElementById(sid);
    //     if (!slt.options[slt.selectedIndex]) {
    //         flagError = true
    //         return false;
    //     }
    //     var val = slt.options[slt.selectedIndex].value;
    //     var email = $(this).closest("tr").find("td:eq(1)").text();
    //     var name = $(this).closest("tr").find("td:eq(2)").text();
    //     var org = $(this).closest("tr").find("td:eq(3)").text();

    //     if (!ownerNameFlag) {
    //         ownerOrgName = $(this).closest("tr").find("td:eq(3)").text();
    //         if (ownerOrgName != "") {
    //             ownerNameFlag = true;
    //         }

    //     };
    //     userProjectArr.push({
    //         user_id: parseInt($(this).attr("id")),
    //         user_role: val,
    //         user_email: email.trim(),
    //         user_name: name,
    //         user_org: org
    //     });

    //     newuserlist.push({
    //         email: email.trim(),
    //         firstname: name,
    //         role: val,
    //         group:""
    //     });
    // });
    // $("input.addcontractusertable:checkbox:checked").each(function () { //adds contractor users
    //     var sid = "s" + $(this).attr("id");
    //     var slt = document.getElementById(sid);
    //     if (!slt.options[slt.selectedIndex]) {
    //         flagError = true
    //         return false;
    //     }
    //     var val = slt.options[slt.selectedIndex].value;
    //     var email = $(this).closest("tr").find("td:eq(1)").text();
    //     var name = $(this).closest("tr").find("td:eq(2)").text();
    //     var org = $(this).closest("tr").find("td:eq(3)").text();

    //     userProjectArr.push({
    //         user_id: parseInt($(this).attr("id")),
    //         user_role: val,
    //         user_email: email.trim(),
    //         user_name: name,
    //         user_org: org
    //     });

    //     newuserlist.push({
    //         email: email.trim(),
    //         firstname: name,
    //         role: val,
    //         group:""
    //     });
    // });
    // $("input.addconsultantusertable:checkbox:checked").each(function () { //adds consultant users
    //     var sid = "s" + $(this).attr("id");
    //     var slt = document.getElementById(sid);
    //     if (!slt.options[slt.selectedIndex]) {
    //         flagError = true
    //         return false;
    //     }
    //     var val = slt.options[slt.selectedIndex].value;
    //     var email = $(this).closest("tr").find("td:eq(1)").text();
    //     var name = $(this).closest("tr").find("td:eq(2)").text();
    //     var org = $(this).closest("tr").find("td:eq(3)").text();

    //     userProjectArr.push({
    //         user_id: parseInt($(this).attr("id")),
    //         user_role: val,
    //         user_email: email.trim(),
    //         user_name: name,
    //         user_org: org
    //     });

    //     newuserlist.push({
    //         email: email.trim(),
    //         firstname: name,
    //         role: val,
    //         group:""
    //     });
    // });
    var flagError = getSelectedProjectUsers();
    if (flagError === true) {
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "Please ensure role for each user is assigned.",
        });
        return false
    }
    OnClickOpenViewer2();

    getSelectedGroupRoles(); //add the group roles to the review list.

    //to add the app list selected if it is a package project.. check if overall project or package first
    if ($("#overallprojectCheck").is(":checked")) {
        $('#appAssignContainerID').show();

        if ($("#jogetPackage").val() != "") {
            $('#appAssignContainerID').html("<div class='constructContainer' id='constructAssignContainer'></div>");
            let packageName = $("#jogetPackage option:selected").text()
            let packageId = $("#jogetPackage option:selected").val()
            $('#constructAssignContainer').html(" <h3>Construction Application</h3>")
            $('#constructAssignContainer').append(
                "<div class='doubleinput'>\
                    <div class='column1'>\
                        <label>Construct Package</label>\
                    </div>\
                    <div class='column2'>\
                        <input type ='text' appValue = '" + packageId + "::" + packageName + "' readonly value ='" + $("#jogetPackage option:selected").text() + "' class ='conAppList' name = 'constructPackage_name'>\
                    </div>\
                </div>"
            );
        }
        let appflag = false;
        $(".jogetApp_list:checkbox:checked").each(function () {
            let id = this.id;
            let text = constructProcess[id];
            if (!appflag) {
                $('#constructAssignContainer').append(
                    "<div class='doubleinput'>\
                        <div class='column1'>\
                            <label> Selected  Processes </label>\
                        </div>\
                        <div class='column2'>\
                            <input type ='text' appValue = '" + true + "' readonly value ='" + text + "' class ='conAppList' name = '" + this.id + "'>\
                        </div>\
                    </div>"
                );
                appflag = true;
            } else {
                $('#constructAssignContainer').append(
                    "<div class='doubleinput'>\
                        <div class='column1'>\
                        </div>\
                        <div class='column2'>\
                            <input type ='text' appValue = '" + true + "' readonly value ='" + text + "' class ='conAppList' name = '" + this.id + "'>\
                        </div>\
                    </div>"
                );
            }
        });
        if ($("#jogetFinancePackage option:selected").val() != "") {

            $('#appAssignContainerID').append(" <div class='financeContainer' id='fincnceAssignContainer'></div>");

            let packageName = $("#jogetFinancePackage option:selected").text()
            let packageId = $("#jogetFinancePackage option:selected").val()
            $('#fincnceAssignContainer').html("<h3>Finance Application</h3>");
            $('#fincnceAssignContainer').append(
                "<div class='doubleinput'>\
                    <div class='column1'>\
                        <label> Finance Package</label>\
                    </div>\
                    <div class='column2'>\
                        <input type ='text' appValue = '" + packageId + "::" + packageName + "' readonly value ='" + packageName + "' class ='finAppList' name = 'financePackage_name'>\
                    </div>\
                </div>"
            );
            let finAppFlag = false;
            $(".jogetPFS_App_list:checkbox:checked").each(function () {

                let id = this.id;
                let text;
                switch (id) {
                    case "app_CP":
                        text = "Contract Particular";
                        break;
                    case "app_IC":
                        text = "Interim Claim (IC)";
                        break;
                    case "app_VO":
                        text = "Variation Order (VO)";
                        break;
                }
                if (!finAppFlag) {
                    $('#fincnceAssignContainer').append(
                        "<div class='doubleinput'>\
                            <div class='column1'>\
                                <label> Selected Processes </label>\
                            </div>\
                            <div class='column2'>\
                                <input type ='text' appValue = '" + true + "' readonly value ='" + text + "' class ='finAppList' name = '" + this.id + "'>\
                            </div>\
                        </div>"
                    );
                    finAppFlag = true;
                } else {
                    $('#fincnceAssignContainer').append(
                        "<div class='doubleinput'>\
                            <div class='column1'>\
                            </div>\
                            <div class='column2'>\
                                <input type ='text' appValue = '" + true + "' readonly value ='" + text + "' class ='finAppList' name = '" + this.id + "'>\
                            </div>\
                        </div>"
                    );
                }

            });

        }

        // document app review page
        if ($("#jogetDocPackage option:selected").val() != "") {
            $('#appAssignContainerID').append(" <div class='docContainer' id='docAssignContainer'></div>");

            let packageName = $("#jogetDocPackage option:selected").text()
            let packageId = $("#jogetDocPackage option:selected").val()
            $('#docAssignContainer').html("<h3>Document Application</h3>");
            $('#docAssignContainer').append(
                "<div class='doubleinput'>\
                    <div class='column1'>\
                        <label> Document Package</label>\
                    </div>\
                    <div class='column2'>\
                        <input type ='text' appValue = '" + packageId + "::" + packageName + "' readonly value ='" + packageName + "' class ='docAppList' name = 'documentPackage_name'>\
                    </div>\
                </div>"
            );
            let docFirstProcessFlag = true;
            $(".jogetDoc_App_list:checkbox:checked").each(function () {
                let text;
                switch (this.id) {
                    case "app_DR":
                        text = "Document Registration (DR)";
                        break;
                    case "app_CORR":
                        text = "Correspondence (CORR)";
                        break;
                }
                if (docFirstProcessFlag) {
                    $('#docAssignContainer').append(
                        "<div class='doubleinput'>\
                            <div class='column1'>\
                                <label> Selected Processes </label>\
                            </div>\
                            <div class='column2'>\
                                <input type ='text' appValue = '" + true + "' readonly value ='" + text + "' class ='docAppList' name = '" + this.id + "'>\
                            </div>\
                        </div>"
                    );
                    docFirstProcessFlag = false;
                } else {
                    $('#docAssignContainer').append(
                        "<div class='doubleinput'>\
                            <div class='column1'>\
                            </div>\
                            <div class='column2'>\
                                <input type ='text' appValue = '" + true + "' readonly value ='" + text + "' class ='docAppList' name = '" + this.id + "'>\
                            </div>\
                        </div>"
                    );
                }
            });
        }
    } else {
        $('#appAssignContainerID').hide(); //package project, no apps
    };
    //newprojectnextpage5()
}


//copy value inside input field and put it on display
function copyprojectinputvalue() {
    let projectid = $("#projectid").val();
    let projectname = $("#projectname").val();
    let projectowner = $('#projectowner').val();
    let projectwpcid = $('#projectwpcid').val();
    let projectindustry = $("#projectindustry").val();
    let projecttimezone = $("#projecttimezone option:selected").text();
    var projecttype = ($('#asset').is(" :checked"))?"ASSET":"CONSTRUCT" ;
    let projectregion;
    
  
    if($('#overallprojectCheck').is(":checked")){
        projectregion = $('#region').val();

    }else{
        projectregion = $('#packageregion').val();
    }

    let projectlocation = $("#projectlocation").val();
    let projectimage = $("#projectimage").attr("src");
    $("#projectiddisplay").html(projectid);
    $("#projectnamedisplay").html(projectname);
    $('#projectownerdisplay').html(projectowner);
    $('#projectwpciddisplay').html(projectwpcid);
    $("#projectindustrydisplay").html(projectindustry);
    $("#projecttimezonedisplay").html(projecttimezone);
    $("#projectlocationdisplay").html(projectlocation);
    $('#projecttypedisplay').html(projecttype);
    $('#projectregiondisplay').html(projectregion);
    if (projectimage !== "") {
        $("#projectimagedisplay").css(
            "background-image",
            'url("' + projectimage + '")'
        );
    }
    $("#newprojectheaderDisplay").html(projectname);
    $("#lat1").html($("#latit1").html());
    $("#lat2").html($("#latit2").html());
    $("#long1").html($("#longit1").html());
    $("#long2").html($("#longit2").html());
    $("#projectstartdatedisplay").html($("#projectstartdate").val());
    $("#projectenddatedisplay").html($("#projectenddate").val());
    $("#projectdurationdisplay").html($("#projectduration").val());
    if(projecttype == "ASSET"){
        $('#projectregiondisplaycont').show();
        $('#projectwpciddisplaycont').hide();
    }else{
        $('#projectwpciddisplaycont').show();
        $('#projectregiondisplaycont').hide();
    }

    /// Yet to add function for copying the value from second page to the last page. ///
}

function OnClickNewProjectSave() {
    event.preventDefault();

    var pid = $("#projectid").val();
    var pname = $("#projectname").val();
    var powner = $("#projectowner").val();
    var pwpcid = $("#projectwpcid").val();

    //new fields for asset
    var pregion;
    var ptype = ($('#asset').is(" :checked"))?"ASSET":"CONSTRUCT" ;
      
    //****//
    var pind = $("#projectindustry").val();
    var ptz = $("#projecttimezone option:selected").text();
    var ptzvalue = $("#projecttimezone").val();
    var ploc = $("#projectlocation").val();
    var file = document.getElementById("imgInp").files[0];
    var startdate = $("#projectstartdate").val();
    var enddate = $("#projectenddate").val();
    var duration = $("#projectduration").val();
    var contractorOrg = contractorSelectizeOrg;
    var consultantOrg = consultantSelectizeOrg.join(";");
    var formdata = new FormData();
    var lat1 = radians_to_degrees(firstPoint.latitude).toFixed(4);
    var lat2 = radians_to_degrees(tempCartographic.latitude).toFixed(4);
    var long1 = radians_to_degrees(firstPoint.longitude).toFixed(4);
    var long2 = radians_to_degrees(tempCartographic.longitude).toFixed(4);

    formdata.append("projectid", pid);
    formdata.append("projectname", pname);
    formdata.append("projectowner", powner);
    formdata.append("projectwpcid", pwpcid);
    formdata.append("projecttype", ptype);
   
    if (pind) {
        formdata.append("industry", pind);
    }
    if (ptzvalue) {
        formdata.append("timezoneval", ptzvalue);
    }
    if (ptz) {
        formdata.append("timezonetext", ptz);
    }
    if (ploc) {
        formdata.append("location", ploc);
    }
    formdata.append("lat1", lat1);
    formdata.append("lat2", lat2);
    formdata.append("long1", long1);
    formdata.append("long2", long2);
    if (startdate) {
        formdata.append("startdate", startdate);
    }
    if (enddate) {
        formdata.append("enddate", enddate);
    }
    if (duration) {
        formdata.append("duration", duration);
    }
    formdata.append("users", JSON.stringify(userProjectArr));
    formdata.append("userGroup", JSON.stringify(userProjectGroupArr));


    if (file) {
        formdata.append("imgInp", file);
    }

    formdata.append("contractee", ownerOrgName); //to send to joget for adding owner company name in contracts

    if (contractorOrg){
        formdata.append("contractorOrg", contractorOrg); //to send to joget for adding contactor name in contracts
    }
    if(consultantOrg){
        formdata.append("consultantOrg", consultantOrg); //to send to joget for adding consultant name in contracts
    }

    if ($("#overallprojectCheck").is(":checked")) {
        var jogetPackageId = $("#jogetPackage option:selected").val()
        $(".conAppList").each(function () {
            let columnName = this.getAttribute("name");
            let appValue = this.getAttribute("appValue");
            formdata.append(columnName, appValue);
        });
        if ($('#jogetFinancePackage option:selected').val() != null) {
            $(".finAppList").each(function () {
                let columnName = this.getAttribute("name");
                let appValue = this.getAttribute("appValue");
                formdata.append(columnName, appValue);
            });
        }
        if ($('#jogetDocPackage option:selected').val() != null) {
            $(".docAppList").each(function () {
                let columnName = this.getAttribute("name");
                let appValue = this.getAttribute("appValue");
                formdata.append(columnName, appValue);
            });
        }
        pregion =  $('#region').val();
    } else {
        let parentid = $('#parentid :selected').val();
        formdata.append("parentid", parentid);
        pregion = $('#packageregion option:selected').val();
    }
    if(pregion){
        formdata.append("region", pregion);
    }
    formdata.append("functionName", "createProject")

    $.ajax({
        url: 'BackEnd/ProjectFunctions.php',
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (res) {
            var data = JSON.parse(res)
            var message = "";
            if (data.msg.pIdName) {
                message += data.msg.pIdName;
            };
            if (data.msg.pName) {
                message += data.msg.pName;
            }
            if (message == "") {
                message = data.msg;
            }
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: message,
            });
            if (data.data == "close") {
                $(":input").val("");
                $("#addnewprojectForm").css("display", "none");
                $("#addnewprojectForm").removeClass("active");
                $("#projectimage").attr("src", "");
                $("#lat1").html(" ");
                $("#lat2").html(" ");
                $("#long1").html(" ");
                $("#long2").html(" ");
                $(".coordinateVal").html(" ");

                selector.show = false;
                selector2.show = false;
                refreshProjectTableBody();
                updateProjectCard();
                shrinkformSize();
            }
        }
    })
}

function OnClickProjectUpdate() {
    event.preventDefault();
    if (ReadEntity) {
        ReadEntity.show = false;
    };

    var projectUsersUpdate = [];
    var projectGroupUsersUpdate = [];
    var msg =" Are you sure you want to update the roles for these users? <br>"
    for (var i = 0; i < click_project_details.users.length; i++) {
        var id = click_project_details.users[i].Usr_ID;
        let myuser = userProjectArr.find((o, j) => {
            if (o.user_id == id) {
                if (click_project_details.users[i].Pro_Role != userProjectArr[j].user_role) {
                    projectUsersUpdate.push({
                        user_id: o.user_id,
                        user_role: o.user_role,
                        user_email: o.user_email,
                        user_old_role: click_project_details.users[i].Pro_Role
                    });
                    msg +=  o.user_email + " - change role <br>";
                }
                userProjectArr.splice(j, 1);
                return true;
            } else {
                return false;
            }

        });
        if (!myuser) {
            projectUsersUpdate.push({
                user_id: click_project_details.users[i].Usr_ID,
                user_role: "noRole",
                user_email: click_project_details.users[i].user_email,
                user_old_role: click_project_details.users[i].Pro_Role
            });
            msg +=  click_project_details.users[i].user_email + " - remove user <br>";
        }

    }
    for (var i = 0; i < userProjectArr.length; i++) {
        projectUsersUpdate.push({
            user_id: userProjectArr[i].user_id,
            user_role: userProjectArr[i].user_role,
            user_email: userProjectArr[i].user_email,
            user_old_role: "noOldRole"
        });
        msg +=   userProjectArr[i].user_email + " - add user <br>";
    }

    //project group users
    if (userProjectGroupArr.length > 0) {
        for (var i = 0; i < click_project_details.users.length; i++) {
            var groupIDs = "";
            if (click_project_details.users[i].project_group.length > 0) {
                var groupIDs = click_project_details.users[i].project_group; // array
            }
            var id = click_project_details.users[i].Usr_ID;
            let mygroupuser = userProjectGroupArr.find((o, j) => {
                if (o.user_id == id) {
                    let mygroup = userProjectGroupArr[j].user_group;
                    if (groupIDs == "") {
                        projectGroupUsersUpdate.push({
                            user_id: o.user_id,
                            user_group: o.user_group,
                            user_email: o.user_email,
                            user_old_group: "noOldGroup"
                        });
                    } else {
                        var removegroup = [];

                        groupIDs.forEach(function (value, index) {
                            let pos = mygroup.indexOf(value);
                            if (pos == -1) { //not part of current group need to remove
                                removegroup.push(value);

                            } else {
                                if (pos == 0) {
                                    mygroup = mygroup.substring(value.length + 1);
                                } else {
                                    mygroup = mygroup.substring(0, pos - 1);
                                }
                            }
                        })
                        if (removegroup.length > 0 || mygroup != "") {
                            var oldgroup = removegroup.join();
                            if (oldgroup == "") {
                                oldgroup = "noOldGroup";
                            };
                            if (mygroup == "") {
                                mygroup = "noGroup";
                            }
                            projectGroupUsersUpdate.push({
                                user_id: o.user_id,
                                user_group: mygroup,
                                user_email: o.user_email,
                                user_old_group: oldgroup
                            });
                        }
                    }
                    userProjectGroupArr.splice(j, 1);
                    return true;
                } else {
                    return false;
                }

            });
            if (!mygroupuser && groupIDs != "") {
                projectGroupUsersUpdate.push({
                    user_id: click_project_details.users[i].Usr_ID,
                    user_group: "noGroup",
                    user_email: click_project_details.users[i].user_email,
                    user_old_group: click_project_details.users[i].project_group.join()
                });
            }
        }

        for (var i = 0; i < userProjectGroupArr.length; i++) {
            projectGroupUsersUpdate.push({
                user_id: userProjectGroupArr[i].user_id,
                user_group: userProjectGroupArr[i].user_group,
                user_email: userProjectGroupArr[i].user_email,
                user_old_group: "noOldGroup"
            });
        }
    }
    var pid = $("#projectid").val();
    var pname = $("#projectname").val();
   // var powner = $("#projectowner").val(); // not allowed to change
    // var pwpcid = $("#projectwpcid").val(); // not allowed to change
    var pind = $("#projectindustry").val();
    var ptz = $("#projecttimezone option:selected").text();
    var ptzvalue = $("#projecttimezone").val();
    var ploc = $("#projectlocation").val();

    var file = document.getElementById("imgInp").files[0];
    var startdate = $("#projectstartdate").val();
    var enddate = $("#projectenddate").val();
    var duration = $("#projectduration").val();
    var contractorOrg = contractorSelectizeOrg;
    var consultantOrg = consultantSelectizeOrg.join(";");

    var formdata = new FormData();
    var lat1 = radians_to_degrees(firstPoint.latitude).toFixed(4);
    var lat2 = radians_to_degrees(tempCartographic.latitude).toFixed(4);
    var long1 = radians_to_degrees(firstPoint.longitude).toFixed(4);
    var long2 = radians_to_degrees(tempCartographic.longitude).toFixed(4);

    if (
        firstPoint.latitude == 0 &&
        tempCartographic.latitude == 0 &&
        $("#lat1").html() !== ""
    ) {
        lat1 = $("#lat1").html();
        lat2 = $("#lat2").html();
        long1 = $("#long1").html();
        long2 = $("#long2").html();
    }

    formdata.append("projectidnumber", click_project_details.projectidnumber);
    formdata.append("projectid", pid);
    formdata.append("projectname", pname);
    //formdata.append("projectowner", powner); //not allowed to change
    //formdata.append("projectwpcid", pwpcid); //not allowed to change

    if (pind) {
        formdata.append("industry", pind);
    }
    if (ptzvalue) {
        formdata.append("timezoneval", ptzvalue);
    }
    if (ptz) {
        formdata.append("timezonetext", ptz);
    }
    if (ploc) {
        formdata.append("location", ploc);
    }

    if (contractorOrg){
        formdata.append("contractorOrg", contractorOrg); //to send to joget for adding contactor name in contracts
    }
    if(consultantOrg){
        formdata.append("consultantOrg", consultantOrg); //to send to joget for adding consultant name in contracts
    }


    formdata.append("contractee", ownerOrgName);

    formdata.append("lat1", lat1);
    formdata.append("lat2", lat2);
    formdata.append("long1", long1);
    formdata.append("long2", long2);
    if (startdate || startdate !== click_project_details.startdate) {
        formdata.append("startdate", startdate);
    }
    if (enddate || enddate !== click_project_details.enddate) {
        formdata.append("enddate", enddate);
    }
    if (duration) {
        formdata.append("duration", duration);
    }
    formdata.append("users", JSON.stringify(projectUsersUpdate));
    formdata.append("userGroup", JSON.stringify(projectGroupUsersUpdate));
    if (file) {
        formdata.append("imgInp", file);
    }
    var pregion;
    if (click_project_details.parentid == null) { //get the app links to update apps. apps are assigned to overall projects

        $(".conAppList").each(function () {
            let columnName = this.getAttribute("name");
            let appValue = this.getAttribute("appValue");
            formdata.append(columnName, appValue);
        });
        if ($('#jogetFinancePackage option:selected').val() != null) {
            $(".finAppList").each(function () {
                let columnName = this.getAttribute("name");
                let appValue = this.getAttribute("appValue");
                formdata.append(columnName, appValue);
            });
        }
        if ($('#jogetDocPackage option:selected').val() != null) {
            $(".docAppList").each(function () {
                let columnName = this.getAttribute("name");
                let appValue = this.getAttribute("appValue");
                formdata.append(columnName, appValue);
            });
        }
        pregion = $('#region').val();

    } else {
        formdata.append("parentid", click_project_details.parentid);
        pregion = $('#packageregion').val();
    }
    formdata.append("region", pregion);
    formdata.append("functionName", "updateProject");
    if(projectUsersUpdate.length> 0){
        $.confirm({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Confirm!',
            content: msg,
            buttons: {
                confirm: function () {
                    $.ajax({
                        url: 'BackEnd/ProjectFunctions.php',
                        data: formdata,
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        success: function (res) {
                            var data = JSON.parse(res)
                            $.alert({
                                boxWidth: "30%",
                                useBootstrap: false,
                                title: "Message",
                                content: data.msg,
                            });
                            if (data.data == "close") {
                                $(":input").val("");
                                $("#addnewprojectForm").css("display", "none");
                                $("#addnewprojectForm").removeClass("active");
                                $("#projectimage").attr("src", "");
                                selector.show = false;
                                selector2.show = false;
                                refreshProjectTableBody();
                                updateProjectCard();
                            }
                        }
                    })
                },
                cancel: function () {
                    return;
                },
            },
        });
    }else{
        $.ajax({
            url: 'BackEnd/ProjectFunctions.php',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (res) {
                var data = JSON.parse(res)
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: data.msg,
                });
                if (data.data == "close") {
                    $(":input").val("");
                    $("#addnewprojectForm").css("display", "none");
                    $("#addnewprojectForm").removeClass("active");
                    $("#projectimage").attr("src", "");
                    selector.show = false;
                    selector2.show = false;
                    refreshProjectTableBody();
                    updateProjectCard();
                }
            }
        })
    }

}


function OnClickProjectArchive() {
    event.preventDefault();
    var message = "Are you sure you want to archive the Project : " + document.getElementById("projectnamedisplay").innerText + "?";
    $.confirm({
        boxWidth: '30%',
        useBootstrap: false,
        title: 'Confirm!',
        content: message,
        buttons: {
            confirm: function () {
                var arr = [];
                arr[0] = document.getElementById("projectidnumber").value;
                var formdata = new FormData();
                formdata.append("functionName", "archiveProject");
                formdata.append("project_id_number", JSON.stringify(arr));

                $.ajax({
                    type: "POST",
                    url: "BackEnd/ProjectFunctions.php",
                    dataType: "json",
                    data: formdata,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        var obj = res
                        $.alert({
                            boxWidth: '30%',
                            useBootstrap: false,
                            title: "Message",
                            content: obj.msg,
                        });
                        $('#addnewprojectForm').css('display', 'none');
                        $('#addnewprojectForm').removeClass('active');
                        refreshProjectTableBody();
                        updateProjectCard();
                        refreshDeleteProjectTableBody();
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        var str = textStatus + " " + errorThrown;
                    }
                })
            },
            cancel: function () {
                return;
            },
        },
    });
}

function OnClickSysadminDeleteProject() {
    var arr = [], name = [];
    if (document.getElementById('checkAllProjects').checked) {
        name.push("All projects");
        $("input.ptable:checkbox:checked").each(function () {
            arr.push(parseInt($(this).attr("id")));
        });
    } else {
        $('input.ptable:checkbox:checked').each(function () {
            arr.push(parseInt($(this).attr("id")));
            name.push($(this).closest("tr").find("td:eq(3)").text());
        });
    }

    var message = "Are you sure you want to archive these Projects :  <br> ";
    //"Are you sure you want to archive these Projects :  <br> <br>" + name + "? <br> <br> Please note that if an overall project is archived its package projects will also be archived!";
    for (var k = 0; k < name.length; k++) {
        message += "<br>" + name[k];
    };
    message += " ?<br> <br> Please note that if an overall project is archived its package projects will also be archived!";
    $.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Confirm!",
        content: message,
        buttons: {
            confirm: function () {
                $("#sysadmindeleteProject").fadeOut("fast");
                $("#main-project .checkcounter #projectchecked").html("");
                $("#main-project .checkcounter #projectchecked").fadeOut("fast");
                var formdata = new FormData();
                formdata.append("functionName", "archiveProject");
                formdata.append("project_id_number", JSON.stringify(arr));

                $.ajax({
                    type: "POST",
                    url: "BackEnd/ProjectFunctions.php",
                    dataType: "json",
                    data: formdata,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        var obj = res
                        $.alert({
                            boxWidth: '30%',
                            useBootstrap: false,
                            title: "Message",
                            content: obj.msg,
                        });
                        $("#sysadmindeleteProject").fadeOut("fast");
                        refreshProjectTableBody();
                        updateProjectCard();
                        refreshDeleteProjectTableBody();
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        var str = textStatus + " " + errorThrown;
                    }
                })

            },
            cancel: function () {

            },
        }
    });
}

function OnClickProjectDeletePermanent() {
    event.preventDefault();
    var projectid = [];
    projectid.push(click_project_details.projectidnumber);

    var message = "Are you sure you want to delete this Project permanently from the Database: " + projectid[0] + "?";
    $.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Confirm!",
        content: message,
        buttons: {
            confirm: function () {
                var formdata = new FormData();
                formdata.append("project_id_number", JSON.stringify(projectid));
                formdata.append("functionName", "deleteProject");
                var request = new XMLHttpRequest();
                request.open("POST", "BackEnd/ProjectFunctions.php", true);
                request.send(formdata);
                request.onreadystatechange = function () {
                    if (request.readyState == 4 && request.status == "200") {
                        let jsonParse = JSON.parse(request.responseText);
                        $.alert({
                            boxWidth: "30%",
                            useBootstrap: false,
                            title: "Message",
                            content: jsonParse.message,
                        });
                        $("#addnewprojectForm").css("display", "none");
                        $("#addnewprojectForm").removeClass("active");
                        refreshDeleteProjectTableBody();
                        updateProjectCard();
                    }
                };
            },
            cancel: function () {
                return
            }
        }
    });
}

function OnClickProjectRestore() {
    event.preventDefault();
    var projectid = [];
    projectid.push(click_project_details.projectidnumber);
    var message = "Are you sure you want to recover this Project? : " + projectid[0] + "?";
    $.confirm({
        boxWidth: '30%',
        useBootstrap: false,
        title: 'Confirm!',
        content: message,
        buttons: {
            confirm: function () {
                var formdata = new FormData();
                formdata.append("project_id_number", JSON.stringify(projectid));
                formdata.append("functionName", "recoverProject");
                $.ajax({
                    type: "POST",
                    url: "BackEnd/ProjectFunctions.php",
                    dataType: "json",
                    data: formdata,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        var obj = res
                        $.alert({
                            boxWidth: "30%",
                            useBootstrap: false,
                            title: "Message",
                            content: obj.message,
                        });
                        $("#addnewprojectForm").css("display", "none");
                        $("#addnewprojectForm").removeClass("active");
                        refreshDeleteProjectTableBody();
                        refreshProjectTableBody();
                        updateProjectCard();
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        var str = textStatus + " " + errorThrown;
                    },
                });
            },
            cancel: function () {
                return;
            },
        },
    });
}

function OnClickSysadminRecoverProjects() {
    var arr = [], name = [];
    var packageArr = [], packageName = [];
    if (document.getElementById("checkAllDeletedProjects").checked) { //if all projects are checked
        name.push("All Archived  Overall & Package Projects");
        $("input.deleteptable:checkbox:checked").each(function () {

            arr.push(parseInt($(this).attr("id")));
        });
    } else {
        $("input.deleteptable:checkbox:checked").each(function () { //if individual projects are checked
            arr.push(parseInt($(this).attr("id")));
            name.push($(this).closest("tr").find("td:eq(3)").text());
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
    $.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Confirm!",
        content: message,
        buttons: {
            confirm: function () {
                $("#systemadminrecoverProject").fadeOut("fast");
                $("#systemadmindeleteparmanentProject").fadeOut("fast");
                $("#archived-project .checkcounter #archivedprojectchecked").html("");
                $("#archived-project .checkcounter #archivedprojectchecked").fadeOut(
                    "fast"
                );
                var formdata = new FormData();
                formdata.append("project_id_number", JSON.stringify(arr));
                formdata.append("functionName", "recoverProject");
                $.ajax({
                    type: "POST",
                    url: "BackEnd/ProjectFunctions.php",
                    dataType: "json",
                    data: formdata,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        var obj = res
                        $.alert({
                            boxWidth: "30%",
                            useBootstrap: false,
                            title: "Message",
                            content: obj.message,
                        });
                        $("#systemadminrecoverProject").fadeOut("fast");
                        $("#systemadmindeleteparmanentProject").fadeOut("fast");
                        refreshDeleteProjectTableBody();
                        refreshProjectTableBody();
                        updateProjectCard();
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        var str = textStatus + " " + errorThrown;
                    },
                });
            },
            cancel: function () {
                return;
            },
        },
    });
}

function OnClickSysadminDeletePermanentProjects() {
    var arr = [], name = [], parentArr = [];

    if (document.getElementById("checkAllDeletedProjects").checked) {
        name.push("All Archived Projects");
        $("input.deleteptable:checkbox:checked").each(function () {
            arr.push(parseInt($(this).attr("id")));
        });
    } else {
        $("input.deleteptable:checkbox:checked").each(function () {
            arr.push(parseInt($(this).attr("id")));
            name.push($(this).closest("tr").find("td:eq(3)").text());
            var pID = (parseInt($(this).closest("tr").find("td:eq(7)").text()));
            if (Number.isNaN(pID)) {
                parentArr.push(parseInt($(this).attr("id")));
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
    $.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Confirm!",
        content: message,
        buttons: {
            confirm: function () {
                $("#systemadminrecoverProject").fadeOut("fast");
                $("#systemadmindeleteparmanentProject").fadeOut("fast");
                $("#archived-project .checkcounter #archivedprojectchecked").html("");
                $("#archived-project .checkcounter #archivedprojectchecked").fadeOut(
                    "fast"
                );
                var formdata = new FormData();
                formdata.append("project_id_number", JSON.stringify(arr));
                formdata.append("functionName", "deleteProject");
                var request = new XMLHttpRequest();
                request.open("POST", "BackEnd/ProjectFunctions.php", true);
                request.send(formdata);
                request.onreadystatechange = function () {
                    if (request.readyState == 4 && request.status == "200") {
                        let jsonParse = JSON.parse(request.responseText);
                        $.alert({
                            boxWidth: "30%",
                            useBootstrap: false,
                            title: "Message",
                            content: jsonParse.message,
                        });
                        $("#systemadminrecoverProject").fadeOut("fast");
                        $("#systemadmindeleteparmanentProject").fadeOut("fast");
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

function checkAllFormUsers(ele) {
    var checkboxes = document.getElementsByClassName("addusertable");
    var slt = document.getElementsByClassName("adduserselect");
    if (ele.checked) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (!slt[i].value) {
                slt[i].value = "Member"
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
            if (!checkboxes[i].disabled) {
                if (checkboxes[i].type == "checkbox") {
                    checkboxes[i].checked = false;
                }
                slt[i].style.display = "none";
                slt[i].value = ""
                $(".appearoncheck").css("display", "none");
            }
        }
    }
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
function refreshUserTableBody(val, varType, ele) {
    if (!val)
        pid = "None";
    else if (varType == 'int')
        pid = val;
    else
        pid = val.value;

    var ptype = "CONSTRUCT" ;
    if(val) ptype = $(val).find(":selected").attr('project_type'); // for new package
    if(ele) ptype = $(ele).data('projecttype'); // for edit project and package
    var ownerRoles = (ptype == 'ASSET') ? assetOwnerRoles : constructOwnerRoles;

    $.ajax({
        url: "BackEnd/UserFunctions.php",
        type: "POST",
        dataType: "json",
        data: {
            project_id: pid,
            functionName: 'getAllUsers'
        },
        success: function (response) {
            var myhtml = "";
            var adduserhtml = "";
            for (var i = 0; i < response.length; i++) {
                let UserType, supportUser;
                switch (response[i].user_type) {
                    case "user":
                        UserType = "User";
                        break;
                    case "system_admin":
                        UserType = "System Admin";
                        break;
                }
                if(response[i].support_user == '1'){
                    supportUser = "Yes";
                }else{
                    supportUser = "No";
                }
                
                myhtml += '<tr>' +
                    '<td> <input type ="checkbox" class = "utable" id= ' + response[i].user_id + ' onchange = "checkUncheckUsers(this)"></td>' +
                    '<td title="Click to view user\'s Detail" style="display:none">' + response[i].user_id + '</td>' +
                    '<td title="Click to view user\'s Detail" onClick="userDetail(this)">' + response[i].user_email + '</td>' +
                    '<td title="Click to view user\'s Detail" onClick="userDetail(this)">' + response[i].user_firstname + " " + response[i].user_lastname + '</td>' +
                    '<td title="Click to view user\'s Detail" onClick="userDetail(this)">' + response[i].orgName + '</td>' +
                    '<td title="Click to view user\'s Detail" onClick="userDetail(this)">' + response[i].user_country + '</td>' +
                    '<td title="Click to view user\'s Detail" onClick="userDetail(this)">' + UserType + '</td>' +
                    '<td title="Click to view user\'s Detail" onClick="userDetail(this)">' + supportUser + '</td>' +
                    '</tr>';
                // adduserhtml +=
                //     '<tr>' +
                //     '<td> <input type ="checkbox" onchange="addUserToProject(this)" class = "addusertable" id= ' + response[i].user_id + ' ></td>' +
                //     '<td>' + response[i].user_email + '</td>' +
                //     '<td>' + response[i].user_firstname + ' ' + response[i].user_lastname + '</td>' +
                //     '<td>' + response[i].orgName + '</td>' +
                //     '<td>' + response[i].user_country + '</td>';
                switch (response[i].orgType) {
                    case "owner":
                        adduserhtml += '<tr class = "addUserTableTr">' +
                            '<td> <input type ="checkbox" onchange="addUserToProject(this)" class = "addusertable" id= ' + response[i].user_id + ' ></td>' +
                            '<td class="addUserTableTdEmail">' + response[i].user_email + '</td>' +
                            '<td class="addUserTableTdName">' + response[i].user_firstname + ' ' + response[i].user_lastname + '</td>' +
                            '<td class="addUserTableTdOrg">' + response[i].orgName + '</td>' +
                            '<td class="addUserTableTdCountry">' + response[i].user_country + '</td>' +
                            '<td><select id=' + "s" + response[i].user_id + ' class = "adduserselect" style="display: none;">' ;
                            ownerRoles.forEach((ele)=>{
                                adduserhtml += '<option value= "'+ele+'">'+ele+'</option>'
                            })
                        adduserhtml +=    
                            '</select></td>' +
                            '</tr>';

                        break;
                }

            };
            $('#userTableBody').html(myhtml);
            $('#addUserTableBody').html(adduserhtml);
        },
    });


}

// fucntion to refresh deleteUserTableBody
function refreshDeleteUserTableBody() {
    $.ajax({
        url: "BackEnd/UserFunctions.php",
        type: "POST",
        data: {
            functionName: "refreshDeleUserTableBody"
        },
        dataType: "json",
        success: function (response) {
            var myhtml = "";
            for (var i = 0; i < response.length; i++) {
                myhtml +=
                    '<tr title="Click to view user\'s detail">' +
                    '<td><input type ="checkbox" class ="deleteutable" id= ' +
                    response[i].user_id +
                    ' onchange = "checkUncheckDeleteUsers(this)" ></td>' +
                    '<td style="display:none">' +
                    response[i].user_id +
                    "</td>" +
                    '<td onClick="userDetail(this)">' +
                    response[i].user_email +
                    "</td>" +
                    '<td onClick="userDetail(this)">' +
                    response[i].user_firstname +
                    " " +
                    response[i].user_lastname +
                    "</td>" +
                    '<td onClick="userDetail(this)">' +
                    response[i].user_org +
                    "</td>" +
                    '<td onClick="userDetail(this)">' +
                    response[i].user_country +
                    "</td>" +
                    ("</tr>");
            }
            $("#deleteUserTableBody").html(myhtml);
        },
    });
}

// function to refresh projectTableBody
function refreshProjectTableBody(filter) {
    $.ajax({
        url: "BackEnd/ProjectFunctions.php",
        type: "POST",
        dataType: "json",
        data: {
            functionName: "refreshProjecTableBody",
            filter: filter
        },
        success: function (response) {
            var myhtml = "";
            var packageHtml = "";
            for (var i = 0; i < response.length; i++) {
                if (response[i].parent_project_id_number == null) { //overall project
                    myhtml +=
                        "<tr>" +
                        '<td> <input type ="checkbox" class = "ptable" id= ' +
                        response[i].project_id_number +
                        ' onchange = "checkUncheckProjects(this)"></td>' +
                        '<td style = "display:none">' +
                        response[i].project_id_number +
                        "</td>" +
                        '<td><div class="flex"><span><img title="Click to view project details" src="Images/icons/admin_page/main_project/info.png" data-projecttype="'+response[i].project_type+'" onClick="projectDetail(this); refreshUserTableBody(``,``,this)"></span><span>' +
                        response[i].project_id +
                        "</span></div></td>" +
                        '<td onclick="OnClickProjectRow(this)">' +
                        response[i].project_name +
                        "</td>" +
                        '<td onclick="OnClickProjectRow(this)">' +
                        response[i].industry +
                        "</td>" +
                        '<td onclick="OnClickProjectRow(this)">' +
                        response[i].location +
                        "</td>" +
                        '<td onclick="OnClickProjectRow(this)">' +
                        response[i].Frequency +
                        "</td>" +
                        '<td style = "display:none">' +
                        response[i].parent_project_id_number +
                        "</td>" +
                        "</tr>";
                } else { //package project
                    packageHtml +=
                        "<tr>" +
                        '<td> <input type ="checkbox" class = "ptable" id= ' +
                        response[i].project_id_number +
                        ' onchange = "checkUncheckProjects(this)"></td>' +
                        '<td style = "display:none">' +
                        response[i].project_id_number +
                        "</td>" +
                        '<td><div class="flex"><span><img src="Images/icons/admin_page/main_project/info.png" title="Click to view project details" data-projecttype="'+response[i].project_type+'" onClick="projectDetail(this); refreshUserTableBody(' + response[i].project_id_number + ', `int`, this)"></span><span>' +
                        response[i].project_id +
                        "</span></div></td>" +
                        '<td onclick="OnClickProjectRow(this)">' +
                        response[i].project_name +
                        "</td>" +
                        '<td onclick="OnClickProjectRow(this)">' +
                        response[i].industry +
                        "</td>" +
                        '<td onclick="OnClickProjectRow(this)">' +
                        response[i].location +
                        "</td>" +
                        '<td onclick="OnClickProjectRow(this)">' +
                        response[i].Frequency +
                        "</td>" +
                        '<td style = "display:none">' +
                        response[i].parent_project_id_number +
                        "</td>" +
                        "</tr>";
                }
                $("#projectTableBody").html(myhtml);
                $("#packageTableBody").html(packageHtml);
            };
        }
    });
}
//function to refresh parentProjectIDList 
function refreshParentProjectIDList(name) {

    $.ajax({
        url: "BackEnd/ProjectFunctions.php",
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
            myOption.disabled = true;
            mySelect.append(myOption);
            for (var i = 0; i < mydata.length; i++) {
                var myOption = document.createElement("option");
                myOption.value = mydata[i].project_id_number;
                myOption.text = mydata[i].project_id + "/" + mydata[i].project_name;
                myOption.setAttribute("projectOwner", mydata[i].project_owner);
                myOption.setAttribute("industry", mydata[i].industry);
                //  myOption.setAttribute("timeText",  mydata[i].time_zone_text);
                myOption.setAttribute("timeValue", mydata[i].time_zone_value);
                myOption.setAttribute("project_type", mydata[i].project_type);
                myOption.setAttribute("region", mydata[i].region);
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

    $.ajax({
        url: "BackEnd/UserFunctions.php",
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
            // if (name) {//updating project
            //     mySelect.value = name; //setting the parent id value
            //     $("select#parentid").addClass("readonly");
            //     $("select#parentid").attr("disabled", true);

            // }

        }
    });

}

// get the parent industry and time zone details to fill in for package
function updateIndustryTimezone() {
    let sel = document.getElementById('parentid');
    let selected = sel.options[sel.selectedIndex];
    let id = selected.value;
    let timezone = selected.getAttribute("timeValue");
    let industry = selected.getAttribute("industry");
    let projectowner = selected.getAttribute("projectOwner");
    let projectregion = selected.getAttribute("region");
    let projecttype = selected.getAttribute("project_type");
    if(projecttype == "CONSTRUCT"){
        $('#construct').prop("checked", true);
        $('#asset').prop("checked", false);
        $('#construct').attr("disabled", true);
        $('#asset').attr("disabled", true);
        $("#label-projectwpcid").show() //hide wpcid for overall
        $("#projectwpcid").show() //hide wpcid for overall
        $('#packageRegionCont').hide();
        $('#regionCont').hide();


    }else{
        $('#construct').prop("checked", false);
        $('#asset').prop("checked", true);
        $('#construct').attr("disabled", true);
        $('#asset').attr("disabled", true);
        $("#label-projectwpcid").hide() //hide wpcid for overall
        $("#projectwpcid").hide() //hide wpcid for overall

        var reg = projectregion.split(",");
        document.querySelectorAll('#packageregion option').forEach(option => option.remove());
        let myselectdoc = document.getElementById('packageregion');
        let myoption2 = document.createElement("option");
        myoption2.value = "";
        myoption2.text = "Please Select ...";
        myselectdoc.appendChild(myoption2);
        for (let i = 0; i < reg.length; i++) {
            let myoption = document.createElement("option");
            myoption.value = reg[i];
            myoption.text = reg[i];
            myselectdoc.appendChild(myoption);
        }
        $('#packageRegionCont').show();
        $('#regionCont').hide();
    }
   


    $("#projecttimezone")
        .val(timezone)
        .prop("selected", true);
    $("#projectindustry").val(industry).prop("selected", true);
    $("#projectowner").val(projectowner).prop("selected", true);
    $("#projectowner").prop("disabled", true);
    $("select#projectowner").addClass("readonly")


}
function OnChangePackageSelection() {
    let package = $("#jogetPackage option:selected").val();
    $('input[name="project_type"]').val();
    if (package != "") {
        $(".jogetApp_list").prop("disabled", false);
        
        var projType = ($('input[name="project_type"]:checked').attr('id') == 'asset') ? 'ASSET' : 'CONSTRUCT';        
        if(projType == 'ASSET'){
            $('#assetAppProcess').find('.jogetApp_list').attr('checked', 'checked')
            $('#constructAppProcess').find('.jogetApp_list').removeAttr('checked')
        }else{
            $('#constructAppProcess').find('.jogetApp_list').attr('checked', 'checked')
            $('#assetAppProcess').find('.jogetApp_list').removeAttr('checked')          
        }
    } else {
        $(".jogetApp_list").prop("disabled", true);
        $(".jogetApp_list").prop('checked', false);
    }
}
function OnChangeFinancePackageSelection() {
    let package = $("#jogetFinancePackage option:selected").val();
    // let myclass = ".jogetPFS_App_list";
    if (package != "") {
        // $('#app_CP').prop('checked', true);
        $(".jogetPFS_App_list:not(#app_CP)").prop("disabled", false);
        $(".jogetPFS_App_list").prop('checked', true);
    } else {
        $(".jogetPFS_App_list").prop("disabled", true);
        $(".jogetPFS_App_list").prop('checked', false);
    }
    //getJogetAppList(package, myclass);
}

function OnChangeDocPackageSelection() {
    let package = $("#jogetDocPackage option:selected").val();
    if (package != "") {
        $(".jogetDoc_App_list:not(#app_DR)").prop("disabled", false);
        $(".jogetDoc_App_list").prop('checked', true);
    } else {
        $(".jogetDoc_App_list").prop("disabled", true);
        $(".jogetDoc_App_list").prop('checked', false);
    }
}

// fucntion to refresh deletePojectTableBody
function refreshDeleteProjectTableBody() {
    $.ajax({
        url: "BackEnd/ProjectFunctions.php",
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
                        '<tr title="View Project Details">' +
                        '<td> <input type ="checkbox" class = "deleteptable" id= ' +
                        response[i].project_id_number +
                        ' onchange="checkUncheckDeleteProjects(this)"></td>' +
                        '<td style = "display:none">' +
                        response[i].project_id_number +
                        "</td>" +
                        '<td><div class="flex"><span><img src="Images/icons/admin_page/main_project/info.png" title="Click to view project details" onClick="projectDetail(this)"></span><span>' +
                        response[i].project_id +
                        "</span></div></td>" +
                        '<td onClick="OnClickArchivedProjectRow(this)">' +
                        response[i].project_name +
                        "</td>" +
                        '<td onClick="OnClickArchivedProjectRow(this)">' +
                        response[i].industry +
                        "</td>" +
                        '<td onClick="OnClickArchivedProjectRow(this)">' +
                        response[i].location +
                        "</td>" +
                        '<td onClick="OnClickArchivedProjectRow(this)">' +
                        response[i].Frequency +
                        "</td>" +
                        '<td  style = "display:none">' +
                        response[i].parent_project_id_number +
                        "</td>" +
                        "</tr>";
                } else { //package project
                    packageHtml +=
                        '<tr title="View Project Details">' +
                        '<td> <input type ="checkbox" class = "deleteptable" id= ' +
                        response[i].project_id_number +
                        ' onchange="checkUncheckDeleteProjects(this)"></td>' +
                        '<td style = "display:none">' +
                        response[i].project_id_number +
                        "</td>" +
                        '<td><div class="flex"><span><img src="Images/icons/admin_page/main_project/info.png" title="Click to view project details" onClick="projectDetail(this)"></span><span>' +
                        response[i].project_id +
                        "</span></div></td>" +
                        '<td onClick="OnClickArchivedProjectRow(this)">' +
                        response[i].project_name +
                        "</td>" +
                        '<td onClick="OnClickArchivedProjectRow(this)">' +
                        response[i].industry +
                        "</td>" +
                        '<td onClick="OnClickArchivedProjectRow(this)">' +
                        response[i].location +
                        "</td>" +
                        '<td onClick="OnClickArchivedProjectRow(this)">' +
                        response[i].Frequency +
                        "</td>" +
                        '<td  style = "display:none">' +
                        response[i].parent_project_id_number +
                        "</td>" +
                        "</tr>";
                }
            }
            $("#deleteProjectTableBody").html(myhtml);
            $("#deletePackageTableBody").html(packageHtml);
        },
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
            $.alert({
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
    if (lines[0] !== "First Name,Last Name,Email,Organization ID,Organization Name,Organization Description,Organization Type,Country,User Type") {
        $.alert({
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
            $.alert({
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
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: 'Cannot read file!',
        });
    }
}

function OnClickExportUsers() {
    $.ajax({
        type: "POST"
        , url: 'BackEnd/userFunctions.php'
        , dataType: 'json'
        , data: {
            functionName: 'activeUsers'
        }
        , success: function (res) {
            var users = res.data
            var csvFile = "FirstName,LastName,Email,Organization,Country,Type" + '\n';
            for (var i = 0; i < users.length; i++) {
                csvFile += users[i].user_firstname + ',';
                csvFile += users[i].user_lastname + ',';
                csvFile += users[i].user_email + ',';
                csvFile += users[i].user_org + ',';
                csvFile += users[i].user_country + ',';
                csvFile += users[i].user_type + '\n';

            }
            var blob = new Blob([csvFile], {
                type: 'text/csv;charset=utf-8;'
            });
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, "activeUsers.csv");
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) {
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", "activeUsers.csv");
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                };
            }
        }
        , error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
        }
    })
};

//get list of pacakges from joget
function getListofPackages() {
    $.ajax({
        url: 'BackEnd/joget.php',
        type: "POST",
        data: {
            functionName: "getListofPackages"
        },
        dataType: 'json',
        success: function (response) {
            //we are getting two joget packages. store them in global variables to change the options based on assset or construc project
            constructPackages = response['construct'];
            assetPackages = response['asset'];
            changeJogetPackageList(constructPackages);

            // // construct
            // document.querySelectorAll('#jogetPackage option').forEach(option => option.remove());
            // let myselect = document.getElementById('jogetPackage');
            // let myoption = document.createElement("option");
            // myoption.value = "";
            // myoption.text = "Please Select ...";
            // //myoption.disabled = true; //removed this as per Beh's suggestion. user need not select any apps either construct or finance GM//
            // myselect.appendChild(myoption);

            // //for finance package
            // document.querySelectorAll('#jogetFinancePackage option').forEach(option => option.remove());// for finance package
            // let myselectfinance = document.getElementById('jogetFinancePackage');
            // let myoption1 = document.createElement("option");
            // myoption1.value = "";
            // myoption1.text = "Please Select ...";
            // //myoption1.disabled = true;
            // myselectfinance.appendChild(myoption1);

            // // for doc package            
            // document.querySelectorAll('#jogetDocPackage option').forEach(option => option.remove());
            // let myselectdoc = document.getElementById('jogetDocPackage');
            // let myoption2 = document.createElement("option");
            // myoption2.value = "";
            // myoption2.text = "Please Select ...";
            // myselectdoc.appendChild(myoption2);

            // for (let i = 0; i < response.length; i++) {
            //     //for construct package
            //     let myoption = document.createElement("option");
            //     myoption.value = response[i].packageId;
            //     myoption.text = response[i].packageName;
            //     myselect.appendChild(myoption);

            //     //for finance package
            //     let myoption1 = document.createElement("option");
            //     myoption1.value = response[i].packageId;
            //     myoption1.text = response[i].packageName;
            //     myselectfinance.appendChild(myoption1);

            //     //for finance package
            //     let myoption2 = document.createElement("option");
            //     myoption2.value = response[i].packageId;
            //     myoption2.text = response[i].packageName;
            //     myselectdoc.appendChild(myoption2);
            // }
        }
    });
}

function changeJogetPackageList(response){
// construct or asset
    document.querySelectorAll('#jogetPackage option').forEach(option => option.remove());
    let myselect = document.getElementById('jogetPackage');
    let myoption = document.createElement("option");
    myoption.value = "";
    myoption.text = "Please Select ...";
    //myoption.disabled = true; //removed this as per Beh's suggestion. user need not select any apps either construct or finance GM//
    myselect.appendChild(myoption);

    //for finance package
    document.querySelectorAll('#jogetFinancePackage option').forEach(option => option.remove());// for finance package
    let myselectfinance = document.getElementById('jogetFinancePackage');
    let myoption1 = document.createElement("option");
    myoption1.value = "";
    myoption1.text = "Please Select ...";
    //myoption1.disabled = true;
    myselectfinance.appendChild(myoption1);

    // for doc package            
    document.querySelectorAll('#jogetDocPackage option').forEach(option => option.remove());
    let myselectdoc = document.getElementById('jogetDocPackage');
    let myoption2 = document.createElement("option");
    myoption2.value = "";
    myoption2.text = "Please Select ...";
    myselectdoc.appendChild(myoption2);

    for (let i = 0; i < response.length; i++) {
        //for construct package
        let myoption = document.createElement("option");
        myoption.value = response[i].packageId;
        myoption.text = response[i].packageName;
        myselect.appendChild(myoption);

        //for finance package
        let myoption1 = document.createElement("option");
        myoption1.value = response[i].packageId;
        myoption1.text = response[i].packageName;
        myselectfinance.appendChild(myoption1);

        //for finance package
        let myoption2 = document.createElement("option");
        myoption2.value = response[i].packageId;
        myoption2.text = response[i].packageName;
        myselectdoc.appendChild(myoption2);
    }

}

//get list of orgs from our DB(not joget)
function getListofOrg() {
    $.ajax({
        url: 'BackEnd/getListofOrg.php', // changed getting list from joget to our db
        type: "GET",
        dataType: 'json',
        success: function (response) {
            document.querySelectorAll('#neworg option').forEach(option => option.remove());
            var myselect = document.getElementById('neworg');
            var myoption = document.createElement("option");
            myoption.value = "";
            myoption.text = "Please Select ...";
            myoption.disabled = true;
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
    // trigger click on #activeproject
    // $("#activeproject").click();

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

function OnChangeConsultantSelection(selectVal) {
    consultantSelectizeOrg = selectVal;
    if(selectVal.length > 1){
        $(".selectize-control.multi").css("width", "150%");
    }
    else{
        $(".selectize-control.multi").css("width", "100%");

    }

    if (selectVal) {
        $.ajax({
            url: 'BackEnd/ProjectFunctions.php', // update admin dashboard card infomation
            type: "POST",
            dataType: "json",
            data: {
                functionName: "getOrgUsers",
                orgID: selectVal
            },
            success: function (res) {
                let response = res.org_users;
                let userhtml = "";
                if (response) {
                    for (var i = 0; i < response.length; i++) {
                        userhtml +=
                            '<tr>' +
                            '<td> <input type ="checkbox" onchange="addUserToProject(this)" class = "addconsultantusertable" id= ' + response[i].user_id + ' ></td>' +
                            '<td>' + response[i].user_email + '</td>' +
                            '<td>' + response[i].user_firstname + ' ' + response[i].user_lastname + '</td>' +
                            '<td>' + response[i].orgName + '</td>' +
                            '<td>' + response[i].user_country + '</td>' +
                            '<td><select id=' + "s" + response[i].user_id + ' class = "addconsultantuserselect" style ="display:none">' +
                            ' <option value= "Consultant CRE" >Consultant CRE</option>' +
                            '<option value= "Consultant RE">Consultant RE</option>' +
                            '<option value= "Consultant DC">Consultant DC</option>' +
                            '<option value= "Sys Consultant">Sys Consultant</option>' +
                            '<option value= "Consultant QS">Consultant QS</option>' +
                            '</select></td>' +
                            '</tr>';
                    }
                };
                $('#addConsultantUserTableBody').html(userhtml);
                $('input.addconsultantusertable').removeAttr('checked');
                if (click_project_details && flagEdit) {
                    setConsultantUsers();
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: str
                });

            }
        });
    } else {
        $('#addConsultantUserTableBody').html("");
    }


}

function OnChangeContractorSelection(selectVal) {
    contractorSelectizeOrg = selectVal.toString();
    let selectedOrgName = $('#contractorSelector option:selected').text();
    if (selectVal) {
        $.ajax({
            url: 'BackEnd/ProjectFunctions.php', // update admin dashboard card infomation
            type: "POST",
            dataType: "json",
            data: {
                functionName: "getOrgUsers",
                orgID: selectVal
            },
            success: function (res) {
                let response = res.org_users;
                let userhtml = "";
                if (response) {
                    for (var i = 0; i < response.length; i++) {
                        userhtml +=
                            '<tr>' +
                            '<td> <input type ="checkbox" onchange="addUserToProject(this)" class = "addcontractusertable" id= ' + response[i].user_id + ' ></td>' +
                            '<td>' + response[i].user_email + '</td>' +
                            '<td>' + response[i].user_firstname + ' ' + response[i].user_lastname + '</td>' +
                            '<td>' + selectedOrgName + '</td>' +
                            '<td>' + response[i].user_country + '</td>' +
                            '<td><select id=' + "s" + response[i].user_id + ' class = "addcontractuserselect" style ="display:none">' +
                            '<option value= "Contractor PM" >Contractor PM</option>' +
                            '<option value= "Contractor Engineer">Contractor Engineer</option>' +
                            '<option value= "Contractor DC" >Contractor DC</option>' +
                            '<option value= "Site Supervisor">Site Supervisor</option>' +
                            '<option value= "HSET Officer" >HSET Officer</option>' +
                            '<option value= "Contractor CM" >Contractor CM</option>' +
                            '<option value= "QAQC Officer" >QAQC Officer</option>' +
                            '<option value= "Contractor QS" >Contractor QS</option>' +
                            '</select></td>' +
                            '</tr>';
                    }
                };
                $('#addContractorUserTableBody').html(userhtml);
                $('input.addcontractusertable').removeAttr('checked');
                if (click_project_details && flagEdit) {
                    setContractUsers();
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                var str = textStatus + " " + errorThrown;
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: str
                });

            }
        });
    } else {
        $('#addContractorUserTableBody').html("");

    }


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

function checkProjectDetails() {
    if ($("#overallprojectCheck").is(":checked")) {
        if (!$("#projectid").val() || !$("#projectname").val() || !$("#projectowner").val()) {
            msg = "Please enter values for Project Owner, Project ID and Project Name!";
            return (msg);
        }
    } else if ($("#packagespecificCheck").is(":checked")) {
        if (!$("#parentid :selected").val() || !$("#projectid").val() || !$("#projectname").val() || !$("#projectowner").val() ) {
            msg = "Please enter values for Parent Package, Package ID and Package Name!";
            return (msg);
        }
        if($('#construct').is(":checked")){
           if( !$("#projectwpcid").val()){
            msg = "Please enter values for WPC ID!";
            return (msg);
           }
        }
    }
    var pid = $("#projectid").val();
    var pname = $("#projectname").val();
    var pattern = /[^A-Za-z0-9_]/g;
    var result = pid.match(pattern);
    if (result) {
        msg = "Project ID must not contain space and other special chars except '_'.";
        return (msg);
    }
    return true;
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
    $.ajax({
        url: 'BackEnd/ProjectFunctions.php', // to validate the project details
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
    $.ajax({
        url: 'BackEnd/SystemFunctions.php', // to validate the project details
        type: "POST",
        dataType: "json",
        data: {
            functionName: "getLicenseInfo"
        },
        success: function (res) {
            if(!res.data[0]) return
            //compute date duration from purchaseDate and expiryDate
            var duration = dateDiff(res.data[0]['PurchaseDate'], res.data[0]['ExpiryDate'])

            $("#lic_accountId").html(res.data[0]['AccountId'])
            $("#lic_accountName").html(res.data[0]['Company'])
            $("#lic_accountContact").html(res.data[0]['ContactPerson'])
            $("#lic_accountEmail").html(res.data[0]['ContactEmail'])
            $("#lic_accountNumber").html(res.data[0]['ContactNumber'])
            $("#lic_accountPosition").html(res.data[0]['ContactPosition'])
            $("#lic_licenseType").html(res.data[0]['LicenseType'])
            $("#lic_hostingType").html(res.data[0]['HostingType'])
            $("#lic_licenseDuration").html(`${duration.years} years`)
            $("#lic_licenseStart").html(res.data[0]['PurchaseDate'])
            $("#lic_licenseEnd").html(res.data[0]['ExpiryDate'])
            $("#licenseDatesLabel").html(`You had licensed Reveron Insights for a period of ${duration.years} year(s), started from ${res.data[0]['PurchaseDate']} to ${res.data[0]['ExpiryDate']}`)
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

//KKR//////
//function to display the selected users in project group page for group selection -- KKR
function displaySelectedUsersForGroupRole(projectusers) {
    var addgrouphtml = "";
    for (var i = 0; i < projectusers.length; i++) {
        var role = projectusers[i].user_role;
        var email = projectusers[i].user_email;
        var id = projectusers[i].user_id;
        var option = "";
        switch (role) {
            case "Consultant RE":
            case "QAQC Engineer":
            case "Safety Officer":
                option = '<option value= "Technical Reviewer">Technical Reviewer</option>' +
                    '<option value= "MA Committee" >MA Committee</option>';
                break;
            case "Project Manager":
            case "Project Monitor":
            case "Construction Engineer":
                option = '<option value= "MA Committee" >MA Committee</option>';
                break;
            default:
                option = "";
                break;
        }
        addgrouphtml += '<tr class = "addGroupTableTr addUserGroupTableBody">' +
            '<td> <input type ="checkbox" onchange="addUserToProjectGroup(this)" class = "addusergrouptable" id=' + projectusers[i].user_id + ' ></td>' +
            '<td class="addGroupTableTdEmail">' + projectusers[i].user_email + '</td>' +
            '<td class="addGroupTableTdName">' + projectusers[i].user_name + '</td>' +
            '<td class="addGroupTableTdOrg">' + projectusers[i].user_org + '</td>' +
            '<td class="addGroupTableTdRole">' + projectusers[i].user_role + '</td>' +
            '<td><select id=' + "gs" + projectusers[i].user_id + ' class = "addusergroupselect" style="display: none;" multiple ="multiple" size="2">' +
            //'<td class="addGroupTableTdGroup">'+ option  +'</td>' +
            option +
            '</select></td>' +
            '</tr>';
    };
    $('#addUserGroupTableBody').html(addgrouphtml);
    return true;

}

function addUserToProjectGroup(ele) {

    if ($(ele).is(":checked")) {
        var id = "gs" + $(ele).attr("id");
        var slt = document.getElementById(id);
        slt.value = "";
        slt.style.display = "block";
    } else {
        var id = "gs" + $(ele).attr("id");
        var slt = document.getElementById(id);
        slt.style.display = "none";
    }
}

function getSelectedGroupRoles() {

    userProjectGroupArr.splice(0, userProjectGroupArr.length);
    $("input.addusergrouptable:checkbox:checked").each(function () { //adds contractor users
        var sid = "gs" + $(this).attr("id");
        var slt = document.getElementById(sid);
        if (!slt.options[slt.selectedIndex]) {
            flagError = true
            return false;
        }
        var selectedValues = [];
        for (var i = 0; i < slt.selectedOptions.length; i++) {
            selectedValues.push(slt.selectedOptions[i].value);
        }
        // var val = slt.options[slt.selectedIndex].value;
        var email = $(this).closest("tr").find("td:eq(1)").text();
        var name = $(this).closest("tr").find("td:eq(2)").text();

        userProjectGroupArr.push({
            user_id: parseInt($(this).attr("id")),
            user_group: selectedValues.join(),
            user_email: email.trim()
        });
        var ind = newuserlist.findIndex(item => item.email === email);
        if (ind != -1) {
            newuserlist[ind]['group'] = selectedValues.join();
        }
    });
    // need to do the display here as we get the group role.. remove it from top page.
    var myhtml = "";
    for (var i = 0; i < newuserlist.length; i++) {
        myhtml +=
            "<tr><td>" +
            newuserlist[i].firstname +
            "</td>\
        <td>" +
            newuserlist[i].email +
            "</td><td>" +
            newuserlist[i].role +
            "</td>\
            <td>" +
            newuserlist[i].group +
            "</td></tr>";
    }
    $("#users_in_project1").html(myhtml);

}

function getSelectedProjectUsers() {

    userProjectArr.splice(0, userProjectArr.length);
    newuserlist.splice(0, newuserlist.length);
    var flagError = false;
    var ownerNameFlag = false;
    ownerOrgName = "";
    $("input.addusertable:checkbox:checked").each(function () { //adds owner users
        var sid = "s" + $(this).attr("id");
        var slt = document.getElementById(sid);
        if (!slt.options[slt.selectedIndex]) {
            flagError = true
            return;
        }
        var val = slt.options[slt.selectedIndex].value;
        var email = $(this).closest("tr").find("td:eq(1)").text();
        var name = $(this).closest("tr").find("td:eq(2)").text();
        var org = $(this).closest("tr").find("td:eq(3)").text();

        if (!ownerNameFlag) {
            ownerOrgName = $(this).closest("tr").find("td:eq(3)").text();
            if (ownerOrgName != "") {
                ownerNameFlag = true;
            }

        };
        userProjectArr.push({
            user_id: parseInt($(this).attr("id")),
            user_role: val,
            user_email: email.trim(),
            user_name: name,
            user_org: org
        });

        newuserlist.push({
            email: email.trim(),
            firstname: name,
            role: val,
            group: ""
        });
    });
    $("input.addcontractusertable:checkbox:checked").each(function () { //adds contractor users
        var sid = "s" + $(this).attr("id");
        var slt = document.getElementById(sid);
        if (!slt.options[slt.selectedIndex]) {
            flagError = true
            return;
        }
        var val = slt.options[slt.selectedIndex].value;
        var email = $(this).closest("tr").find("td:eq(1)").text();
        var name = $(this).closest("tr").find("td:eq(2)").text();
        var org = $(this).closest("tr").find("td:eq(3)").text();

        userProjectArr.push({
            user_id: parseInt($(this).attr("id")),
            user_role: val,
            user_email: email.trim(),
            user_name: name,
            user_org: org
        });

        newuserlist.push({
            email: email.trim(),
            firstname: name,
            role: val,
            group: ""
        });
    });
    $("input.addconsultantusertable:checkbox:checked").each(function () { //adds consultant users
        var sid = "s" + $(this).attr("id");
        var slt = document.getElementById(sid);
        if (!slt.options[slt.selectedIndex]) {
            flagError = true
            return;
        }
        var val = slt.options[slt.selectedIndex].value;
        var email = $(this).closest("tr").find("td:eq(1)").text();
        var name = $(this).closest("tr").find("td:eq(2)").text();
        var org = $(this).closest("tr").find("td:eq(3)").text();

        userProjectArr.push({
            user_id: parseInt($(this).attr("id")),
            user_role: val,
            user_email: email.trim(),
            user_name: name,
            user_org: org
        });

        newuserlist.push({
            email: email.trim(),
            firstname: name,
            role: val,
            group: ""
        });
    });

    if (flagError) {
        return true;
    } else {
        return false;
    }

}

function checkSelectedUsers() { //check if the checked users have a role selection
    var flagError = false;
    $("input.addusertable:checkbox:checked").each(function () { //adds owner users
        var sid = "s" + $(this).attr("id");
        var slt = document.getElementById(sid);
        if (!slt.options[slt.selectedIndex]) {
            flagError = true;
            return;
        }
    });
    if (flagError) {
        return true;
    } else {
        return false;
    }
}

function updateRolesList(ptype){
    var ownerRoles = (ptype == 'asset') ? assetOwnerRoles : constructOwnerRoles;
    var optHTML = "";
    ownerRoles.forEach((ele)=>{
        optHTML += '<option value= "'+ele+'">'+ele+'</option>'
    })
    $('.adduserselect').html(optHTML)
}


function onProjectTypeClick(ele){
    updateRolesList(ele.id)
    if(ele.id == "construct"){
        $('#inv').hide();
        toggleProjectType()
        $('#regionCont').hide();
        $('#packageRegionCont').hide();
        changeJogetPackageList(constructPackages);
        
    }else if (ele.id == "asset"){
       changeJogetPackageList(assetPackages);
        $('#inv').show();
        if($('#overallprojectCheck').is(":checked")){
            $('#regionCont').show();
            $('#packageRegionCont').hide();
        }else{
            $('#regionCont').hide();
            $('#packageRegionCont').show();
        }
        toggleProjectType('ASSET')
    }
}

function addRegion(){
    var reg = $('#projectRegion').val();
    var region = $('#region').val()
    reg = $.trim(reg);
    reg = reg.toUpperCase();
    if(region !="") region += "," + reg;
    else region =reg;
    $('#region').val(region);
    $('#projectRegion').val("");

}

var onChangeShowLabel = ()=>{
    $('.column333').toggle()
    if ($('#supportUser').is(":checked")) {
        if(flagUserEdit){
            $('#checkresetpassword').prop('checked', true);
            $('#checkresetpassword').prop('disabled', true);
            $(".newuserContainerBody-edit .resetpasswordcontainer").css("display", "block");
        }
    } else {
        if(flagUserEdit){
            $('#checkresetpassword').prop('checked', false);
            $('#checkresetpassword').prop('disabled', false);
            $(".newuserContainerBody-edit .resetpasswordcontainer").css("display", "none");
        }
    }
}

