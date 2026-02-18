var projectUsers = [];
var currUserList = [];
var dataDetails;
var aicDetails;
var col_ajs = "blue";
var col_bkt = "green";
var col_clu = "coral";
var col_dmv = "red";
var col_enw = "#6A5ACD";
var col_fox = "purple";
var col_gpy = "violet";
var col_hqz = "orange";
var col_ir = "maroon";
var wmsURL = GEOHOST+"/geoserver";
var wmsCapabilities;
var shapefileStyling = false;
var shapefileEditFlag = false;
var flagCheckStyle = false;
var item;
var themeJoget;
var terrainEnabled = false;
var mapTilerAccessToken = MAPTILER_TOKEN;

var constructOwnerRoles_KKR = ["Bumi Officer","Construction Engineer", "Contract Executive", "Corporate Comm Officer","Director","Doc Controller","Finance Head","Finance Officer","Head of Department", "Land Officer","Planning Engineer","Project Director","Project Manager","Project Monitor","QAQC Engineer","Risk Engineer","Safety Officer","Zone Manager"];
var constructOwnerRoles_OBYU = ["Construction Engineer","Corporate Comm Officer","Director","Doc Controller","Finance Head","Finance Officer","Land Officer","Planning Engineer","Project Manager","QAQC Engineer","Risk Engineer","Safety Officer"];
var constructOwnerRoles_SSLR = ["Construction Manager", "Finance Representative", "HOD (Contract and Finance)", "HOD (QSHET)", "HSET Officer", "Land Management Representative", "PMO Representative", "Project Engineer", "QAQC Manager", "Representative", "Site Engineer", "SMO Representative", "Technical Engineer"];
var assetOwnerRoles = ["Assistant Director (Road Asset)","Assistant Engineer (Division)","Assistant Engineer (District)","Asset Engineer Section","Civil Engineer (Division)","Civil Engineer (District)","Civil Engineer (Road Asset)","Contract Assistance","Divisional Engineer","District Engineer",
                       "Facility Management Department","Head of Contract","Head of Finance","Head of Section", "KKR", "Quantity Surveyor","Senior Civil Engineer (Division)","Senior Civil Engineer (District)","Senior Civil Engineer (Road Asset)","Senior Quantity Surveyor","Technical Inspector Section"];
// var allOwnerRoles = constructOwnerRoles.concat(assetOwnerRoles)
var ownerRoles;
if(SYSTEM == 'KKR'){
    if(localStorage.project_owner == 'SSLR2'){
        ownerRoles = constructOwnerRoles_KKR.concat(constructOwnerRoles_SSLR);
    }else{
        ownerRoles = (localStorage.Project_type == 'ASSET') ? assetOwnerRoles :constructOwnerRoles_KKR;
    }
}else{
    ownerRoles = constructOwnerRoles_OBYU;
};
ownerRoles.sort();
var monthToNumAr = {"Jan" : '01',"Feb" : '02',"Mar" : '03',"Apr" : '04',"May" : '05',"Jun" : '06',"Jul" : '07',"Aug" : '08',"Sep" : '09',"Oct" : '10',"Nov" : '11',"Dec" : '12'};

var aicIdEach;

//mixitup sort and animate initiate and config
const config = {
    animation: {
        effects: 'fade stagger(100ms)',
        staggerSequence: function(i) {
            return i % 3;
        }
    },
    callbacks: {
        onMixBusy: function(state, originalEvent) {
            console.log('Mixer busy');
        }
    },
};

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#projectimage").attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        $("#projectimage").attr("src", "");
    }
}

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

function closeAllMain() {
    $("#main-user").css("display", "none");
    $("#main-project").css("display", "none");
    $("#main-layerdata").css("display", "none");
    $("#main-projectwise").css("display", "none");
    $('#main-projectwise365').css('display', 'none') //#webserviceID 
    $('#main-schedule').css('display', 'none')
    $('#main-projectwise365').css('display', 'none') //#webserviceID 
    $("#main-aerial").css("display", "none");
    $("#main-shareAerial").css("display", "none");
    $("#main-schedule").css("display", "none");
    $('#main-schedulemap').css('display', 'none')
    $("#main-powerbi").css("display", "none");
    $("#invitenewuserForm").css("display", "none");
    $("#main-project-dashboard").css("display", "none");
}

function openDivAdmin(openThis){
    $("#"+openThis).css("display", "block");
}

function editProject() {
    $(".project-container .formcontainerMainBody .project-view#readonly").hide();
    $(".project-container .formcontainerMainBody .project-view#edit").show();
    $("#savecurrentProject").show();
    $("#cancelcurrentProject").show();

    //make industry and timezone field readonly
    $("select#projectindustry").attr('disabled', 'disabled');
    $("select#projectindustry").css({ "background": "var(--disabled)", "cursor": "not-allowed" });
    $("select#projecttimezone").attr('disabled', 'disabled');
    $("select#projecttimezone").css({ "background": "var(--disabled)", "cursor": "not-allowed" });

    //copy field value
    $("#projectid").val($("#projectiddisplay").html());
    $("#projectname").val($("#viewprojectnamedisplay").html());
    let ind = $.trim($("#projectindustrydisplay").html());
    $("#projectindustry").val(ind).prop("selected", true);
    let timezone = $.trim($("#projecttimezonedisplay").html());
    if (timezone !== "") {
        $("#projecttimezone option")
            .filter(function () {
                return $.trim($(this).text()) == timezone;
            })
            .attr("selected", true);
    } else {
        $("#projecttimezone").val("");
    }

    if (localStorage.isParent != undefined) {
        $("select#projectindustry").addClass("readonly")  //package project
        $("select#projectindustry").attr("disabled", true)
        $("select#projecttimezone").addClass("readonly")
        $("select#projecttimezone").attr("disabled", true)
    }

    if ($("#projectlocationdisplay").html() !== "") {
        $("#projectlocation").val($("#projectlocationdisplay").html());
    } else {
        $("#projectlocation").val("");
    }
    if ($("#projectstartdatedisplay").html().trim() !== "") {
        var mydate = $("#projectstartdatedisplay").html().split("/");

        var startdate = new Date(mydate[2], mydate[1] - 1, mydate[0]);
        startdate = new Date(startdate.getTime() + 1000 * 24 * 60 * 60)
            .toJSON()
            .slice(0, 10);
        $("#projectstartdate").val(startdate);
        var mydate1 = $("#projectenddatedisplay").html().split("/");
        var enddate = new Date(mydate1[2], mydate1[1] - 1, mydate1[0]);
        enddate = new Date(enddate.getTime() + 1000 * 24 * 60 * 60)
            .toJSON()
            .slice(0, 10);
        $("#projectenddate").val(enddate);
    }

    $("#projectduration").val($("#projectdurationdisplay").html());
    // Warranty date -request from KKR -20/03/2023
    if(SYSTEM == "KKR"){
        if ($("#projectwarrantydatedisplay").html().trim() !== "") {
            var mydate2 = $("#projectwarrantydatedisplay").html().split("/");
            var warrantydate = new Date(mydate2[2], mydate2[1] - 1, mydate2[0]);
            warrantydate = new Date(warrantydate.getTime() + 1000 * 24 * 60 * 60)
                .toJSON()
                .slice(0, 10);
            $("#warrantyenddate").val(warrantydate);
        }
    }
    $('#projectcutoff').val($('#projectcutoffdisplay').html());
    $("#projectimage").attr("src", $("#projectimagedisplay").attr("rel"));

    if ($("#longi2").text() == $("#lat2").text()) {
        $("#lati1").text("");
        $("#lati2").text("");
        $("#longi1").text("");
        $("#longi2").text("");
    }
    $("#latit1").text($("#lati1").text());
    $("#latit2").text($("#lati2").text());
    $("#longit1").text($("#longi1").text());
    $("#longit2").text($("#longi2").text());

    if ($("#latit1").text() === $("#latit2").text()) {
        $("#coordinateval2").css("display", "none");
    }else{
        $("#coordinateval2").css("display", "block");
    }
    
    if(readRectangle !== undefined){
        if(ReadEntity){
            viewer4.entities.remove(ReadEntity)
        }
        ReadEntity = viewer4.entities.add({
            selectable: false,
            show: true,
            rectangle: {
                coordinates: readRectangle,
                material: Cesium.Color.YELLOW.withAlpha(0.1),
            },
        });
        viewer4.camera.setView({
            destination: readRectangle,
        });
    }else{
        ReadEntity = viewer4.entities.add({
            selectable: true,
            show: false,
        });
    }
};

//function to show loader in V3.js
showLoader = () =>{
    window.parent.showLoaderHandler()
}

//function to hide loader in V3.js
hideLoader = () =>{
    window.parent.hideLoaderHandler()
}

$(function () {

    hideLoader()

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

    //show project details at first load
    $("#main-project").css("display", "block");
    OnClickOpenReadViewer(); //for CESIUM


    //animation for clicking the edit project button
    $("#editcurrentProject").on("click", function () {
        editProject()
    });

    //change project icon in edit project
    $("#imgInp").change(function () {
        imginp = document.getElementById("imgInp");
        var pro_Inp = imginp.files[0];
        //filter extension
        var reg = /(.*?)\.(png|bmp|jpeg|jpg)$/;
        if (!pro_Inp.name.toLowerCase().match(reg)) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Input file format is not supported!",
            });
            imginp.value = "";
            $("#projectimage").attr("src", "");
            return;
        }
        //limit file size to 1mb
        if (pro_Inp.size > 1024000) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Maximum file size supported is 1MB!",
            });
            imginp.value = "";
            $("#projectimage").attr("src", "");
            return;
        }
        readURL(imginp);
    });

    $(".editproject").on("click", function () {

        $(".sidebar-items .adminItems.active").removeClass("active");
        $(".adminItems div.arrow.active").removeClass("active");
        $("li.subbuttons.active").parent().slideUp(100)
        $("li.subbuttons.active").removeClass("active")

        closeAllMain();

        $("#main-project").css("display", "block");
        $("#main-project").addClass("active");
        $(".adminItems#adminItems-project").addClass("active")
        editProject()
    });

    //animation for clicking the Cancel edit project button
    $("#cancelcurrentProject").on("click", function () {

        $("select#projectindustry").removeAttr('disabled', 'disabled');
        $("select#projectindustry").css({ "background": "none", "cursor": "default" });
        $("select#projecttimezone").removeAttr('disabled', 'disabled');
        $("select#projecttimezone").css({ "background": "none", "cursor": "default" });

        $(".project-container .formcontainerMainBody .project-view#readonly").show();
        $(".project-container .formcontainerMainBody .project-view#edit").hide();
        $("#editcurrentProject").show();
        $("#savecurrentProject").hide();
        $("#cancelcurrentProject").hide();
        //RESET VALUES TO ORIGIN
        if (typeof selector2 !== "undefined") {
            selector2.show = false;
        }
        if (typeof selector !== "undefined") {
            selector.show = false;
        }
        imginp = document.getElementById("imgInp");
        imginp.value = "";
        $("#projectimage").attr("src", $("#projectimagedisplay").attr("src"));

        //reset submenu tab
        window.parent.leftMenuButtonUnhightlight();

        if(readRectangle !== undefined && ReadEntity2 !== undefined){
            if(ReadEntity2){
                viewer2.entities.remove(ReadEntity2)
            }

            ReadEntity2 = viewer2.entities.add({
                selectable: false
                , show: true
                , rectangle: {
                    coordinates: readRectangle
                    , material: Cesium.Color.BLUE.withAlpha(0.2)
                }
            });
            viewer2.camera.setView({
                destination: readRectangle
            });
            
            Cesium.Camera.DEFAULT_VIEW_RECTANGLE = readRectangle;
        }
    });

    // calculate the duration on change of start date or end date
    $("#projectstartdate").on("change", function () {
        var enddate = $("#projectenddate").val();
        var startdate = $("#projectstartdate").val();

        var date1 = new Date(enddate);
        var date2 = new Date(startdate);
        var res = Math.abs(date1.getTime() - date2.getTime());
        var msecday = 1000 * 60 * 60 * 24;
        var duration = Math.ceil(res / msecday);
        $("#projectduration").val(duration);
    });

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

    //update button for project details
    $("#savecurrentProject").on("click", function () {

        $("select#projectindustry").removeAttr('disabled', 'disabled');
        $("select#projectindustry").css({ "background": "none", "cursor": "default" });
        $("select#projecttimezone").removeAttr('disabled', 'disabled');
        $("select#projecttimezone").css({ "background": "none", "cursor": "default" });

        //reset submenu tab
        window.parent.leftMenuButtonUnhightlight();

        event.preventDefault();
        let startdate = $("#projectstartdate").val();
        let enddate = $("#projectenddate").val();
        if (startdate > enddate) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "End date needs to be after the start date. Please change.",
            });
            return;
        }
        if (startdate == "" || enddate == "") {
            enddate = "";
            startdate = "";
        }
        $.confirm({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Confirm!",
            content: "Are you sure you want to overwrite the project details?",
            buttons: {
                confirm: function () {
                    var pid = $("#projectid").val();
                    var pname = $("#projectname").val();
                    var pind;
                    if ($("#projectindustry").val() == null) {
                        pind = "";
                    } else {
                        pind = $("#projectindustry").val();
                    }
                    var ptz;
                    if ($("#projecttimezone option:selected").html() == null) {
                        ptz = "";
                    } else {
                        ptz = $("#projecttimezone option:selected").html();
                    }
                    var ptzvalue;
                    if ($("#projecttimezone").val() == null) {
                        ptzvalue = "";
                    } else {
                        ptzvalue = $("#projecttimezone").val();
                    }
                  
                    var ploc = $("#projectlocation").val();
                    var sdate = startdate;
                    var edate = enddate;
                    var duration = $("#projectduration").val();
                    var file = document.getElementById("imgInp").files[0];
                    var lat1 = $("#latit1").text();
                    var lat2 = $("#latit2").text();
                    var long1 = $("#longit1").text();
                    var long2 = $("#longit2").text();
                    if (((long1 == long2) == lat1) == lat2) {
                        long1 = long2 = lat1 = lat2 = 0;
                    }
                    var formdata = new FormData();
                    formdata.append("projectid", pid);
                    formdata.append("projectname", pname);
                    formdata.append("industry", pind);
                    formdata.append("timezoneval", ptzvalue);
                    formdata.append("timezonetext", ptz);
                    formdata.append("location", ploc);
                    formdata.append("startdate", sdate);
                    formdata.append("enddate", edate);
                    formdata.append("duration", duration);
                    formdata.append("lat1", lat1);
                    formdata.append("lat2", lat2);
                    formdata.append("long1", long1);
                    formdata.append("long2", long2);
                    if(SYSTEM == 'OBYU'){
                        formdata.append("cutoffday", $("#projectcutoff").val());
                    }
                    var warrantyenddate;
                    if(SYSTEM == 'KKR'){
                          // add warranty end date to projects for KKR
                        warrantyenddate = ($("#warrantyenddate").val() == null) ? "" : $("#warrantyenddate").val();
                        formdata.append("warrantyenddate", warrantyenddate);
                    }
                    if (file) {
                        formdata.append("imgInp", file);
                    };
                    formdata.append("functionName", "updateProjDetails")

                    if(SYSTEM == 'OBYU'){
                        ajaxUrl = 'BackEnd/ProjectFunctionsOBYU.php';
                    }else{
                        ajaxUrl = 'BackEnd/ProjectFunctionsV3.php';
                    }

                    var request = new XMLHttpRequest();
                    request.open("POST", ajaxUrl, true);
                    request.send(formdata);
                    request.onreadystatechange = function () {
                        if (request.readyState == 4) {
                            if (request.status === 200) {
                                localStorage.p_name = pname
                                localStorage.longitude1 = long1
                                localStorage.longitude2 = long2
                                localStorage.latitude1 = lat1
                                localStorage.latitude2 = lat2
                                if (sdate) {
                                    let res = sdate.split("-")
                                    let sdateDisplay = res[2] + "/" + res[1] + "/" + res[0]
                                    localStorage.start_date = sdateDisplay

                                    let res2 = edate.split("-")
                                    let edateDisplay = res2[2] + "/" + res2[1] + "/" + res2[0]
                                    localStorage.end_date = edateDisplay
                                }
                                if(warrantyenddate){
                                    let res3 = warrantyenddate.split("-")
                                    let wdateDisplay = res3[2] + "/" + res3[1] + "/" + res3[0]
                                    localStorage.warranty_end_date = wdateDisplay
                                }

                                if (request.response) {
                                    newIcon = JSON.parse(request.response)
                                    if(newIcon.newIcon){ //update the icon only if changed.
                                        localStorage.iconurl = newIcon.newIcon
                                    }
                                }

                                if(parent) parent.location.reload()                                
                            } else {
                                console.log("Error", request.statusText);
                                $(
                                    ".project-container .formcontainerMainBody .project-view#readonly"
                                ).show();
                                $(
                                    ".project-container .formcontainerMainBody .project-view#edit"
                                ).hide();
                                $("#editcurrentProject").show();
                                $("#savecurrentProject").hide();
                                $("#cancelcurrentProject").hide();
                            }
                        }
                    };
                },
                cancel: function () {
                    return;
                },
            },
        });
    });

    //animation for clicking the close form button
    $(".formContent #addscheduleCloseButton").on("click", function () {
        $("#addscheduleForm").fadeOut(100);
        $("#addscheduleForm").removeClass("active");
        $(".formcontainerMainBody .revisioncontainer").css("display", "none");
        $(".formHeader-addschedule h3").html("Upload Schedule");
        $("#xmlInp").val("");
        $("#revisionnumber").val("");
        $("#revisionremarks").val("");
    });

    //animation to update actual physial/financial schedule for OBYU
    $(".formContent #addactualCloseButton").on("click", function () {
        $("#addactualForm").fadeOut(100);
        $("#addactualForm").removeClass("active");
    });

    $("#addactualcancel").on("click", function () {
        $("#addactualForm").fadeOut(100);
        $("#addactualForm").removeClass("active");
    });

    //animation for clicking the cancel form button
    $("#addschedulecancel").on("click", function () {
        $("#addscheduleForm").fadeOut(100);
        $("#addscheduleForm").removeClass("active");
        $(".formcontainerMainBody .revisioncontainer").css("display", "none");
        $(".formHeader-addschedule span").html("Upload Schedule");
        $("#xmlInp").val("");
        $("#revisionnumber").val("");
        $("#revisionremarks").val("");
    });

    /// function for clicking the add file button to the schedule page ///
    $("#newschedule").on('click', function () {
        if (!$("#scheduleListing li.active").hasClass("active")) {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Please select a schedule from the list to continue.',
            });
            return
        }
        $("#addscheduleForm").fadeIn(100)
        $("#addscheduleForm").addClass('active')
        $(".formcontainerMainBody .revisioncontainer").css('display', 'none')
        $(".formHeader-addschedule h3").html("Upload Schedule")
        $("#schedulename").css({
            "background-color": "var(--background)",
            "cursor": "not-allowed"
        })
        $("#scheduletype").css({
            "background-color": "var(--background)",
            "cursor": "not-allowed"
        })
        $("#scheduledatestart").css({
            "background-color": "var(--background)",
            "cursor": "not-allowed"
        })
        $("#scheduledateend").css({
            "background-color": "var(--background)",
            "cursor": "not-allowed"
        })

        $("#schedulename").val($("#scheduleName").text())
        $("#scheduletype").val($("#scheduleType :selected").text())
        let scheduleStartDate = $(scheduleObj).attr("dataStart")
        let scheduleEndDate = $(scheduleObj).attr("data")
        let startDate = new Date(scheduleStartDate)
        offset = startDate.getTimezoneOffset();
        startDate = new Date(startDate.getTime() - (offset * 60 * 1000));
        startDate = startDate.toISOString().slice(0, 10)

        let endDate = new Date(scheduleEndDate)
        endDate = new Date(endDate.getTime() - (offset * 60 * 1000));
        endDate = endDate.toISOString().slice(0, 10)
        $("#scheduledatestart").val(startDate)
        $("#scheduledateend").val(endDate)
        let version = $("#revisionList li:first-child").attr("data")
        $("#revisionnumber").val("")
        $("#revisionremarks").val("")
    })
    
    /// function for clicking the add/Actual Physical/Financial value schedule page OBYU ///
    $("#newactual").on('click', function () {
        if (!$("#scheduleListing li.active").hasClass("active")) {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Please select a schedule from the list to continue.',
            });
            return
        }
        $("#addactualForm").fadeIn(100)
        $("#addactualForm").addClass('active')

    })
    
    $("#updateActualBtn").on('click', function () {
        if (!$("#scheduleListing li.active").hasClass("active")) {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Please select a schedule from the list to continue.',
            });
            return
        }
        $("#addactualForm").fadeIn(100)
        $("#addactualForm").addClass('active')

    })

    //animation for clicking the edit project button

    /// function for clicking the edit schedule button ///
    $("#reviseschedule").on("click", function () {
        $("#revisionremarks").val("");
        $("#addscheduleForm").fadeIn(100);
        $("#addscheduleForm").addClass("active");
        $(".formcontainerMainBody .revisioncontainer").css("display", "block");
        $(".formHeader-addschedule span").html("Revise Schedule");
        $("#schedulename").css({
            "background-color": "var(--text-container)",
            cursor: "not-allowed",
        });
        $("#scheduletype").css({
            "background-color": "var(--text-container)",
            cursor: "not-allowed",
        });
        $("#scheduledatestart").css({
            "background-color": "var(--text-container)",
            cursor: "not-allowed",
        });
        $("#scheduledateend").css({
            "background-color": "var(--text-container)",
            cursor: "not-allowed",
        });
        $("#revisionnumber").css({
            "background-color": "var(--text-container)",
            cursor: "not-allowed",
        });
        $("#schedulename").val($("#scheduleName").text());
        $("#scheduletype").val($("#scheduleType :selected").text());

        let scheduleStartDate = $(scheduleObj).attr("dataStart");
        let scheduleEndDate = $(scheduleObj).attr("data");

        let startDate = new Date(scheduleStartDate);
        offset = startDate.getTimezoneOffset();
        startDate = new Date(startDate.getTime() - offset * 60 * 1000);
        startDate = startDate.toISOString().slice(0, 10);
        let endDate = new Date(scheduleEndDate);
        endDate = new Date(endDate.getTime() - offset * 60 * 1000);
        endDate = endDate.toISOString().slice(0, 10);
        $("#scheduledatestart").val(startDate);
        $("#scheduledateend").val(endDate);
        let version = $("#revisionList li:first-child").attr("data");
        if (isNaN(version)) {
            $("#revisionnumber").val(1);
        } else {
            $("#revisionnumber").val(Number(version) + 1);
        }
    });


    ////////// function for all things in the Aerial Image poage ///////////

    // function for clicking the registeraerial button //
    $("#adminsub-aerial #registeraerial").on("click", function () {
        changeAicRoutine()
        uploadType = "AIC"
        //  $("#registeraerialForm").fadeIn(100)
        //$("#registeraerialForm").addClass('active')
    })

    // function for clicking the close button on register aerial form //
    $(".formContent #registeraerialCloseButton").on("click", function () {
        //   $("#registeraerialForm").css("display", "none");
        //    $("#registeraerialForm").removeClass("active");
        $("#adminsub-aerial #registeraerial").removeClass("active")
    });

    //animation for clicking the Cancel form button //
    $("#registeraerialCancel").on("click", function () {
        //    $("#registeraerialForm").css("display", "none");
        //    $("#registeraerialForm").removeClass("active");

    });

    // function for clicking the close button on register aerial form //
    $(".formContent #imageviewerCloseButton").on("click", function () {
        $("#imageViewer").css("display", "none");
        $("#imageViewer").removeClass("active");
        $("#imageShow").attr("src", "")
    });


    ////////// function for all things in the USER poage ///////////
    //animation for opening the CREATE NEW USER PROFILE
    $("#adminsub-user #adduser").on("click", function () {
        $("#adminProjectUsersSearch").val("");
        if (!$("#invitenewuserForm").hasClass("active")) {
            $("#invitenewuserForm")
                .css({
                    "padding-top": -30,
                })
                .animate({
                    "padding-top": 0,
                },
                    100,
                    function () {
                        $("#adminProjectUsersSearch").val("");
                        $("#invitenewuserForm").css("display", "block");
                        $("#invitenewuserForm").addClass("active");
                    }
                );
            refreshAdminUserTable();
            $("#adminProjectUsersSearch").val("");

        } else { }
    });

    //animation for clicking the close form button OBYU
    $(".formContent #inviteuserCloseButton").on("click", function () {
        $("#invitenewuserForm").css("display", "none");
        $("#invitenewuserForm").removeClass("active");
        $("#adminProjectUsersSearch").val("");
        $("#adminsub-user #adduser").removeClass("active")
    });

    //animation for clicking the Cancel form button
    $("#inviteuserCancel").on("click", function () {
        $("#invitenewuserForm").css("display", "none");
        $("#invitenewuserForm").removeClass("active");
        $("#adminProjectUsersSearch").val("");
        $("#adminsub-user #adduser").removeClass("active")
        $("#main-project").css("display", "block");
    });

    //delete button function for user table
    $(".utable").on("change", function () {
        if ($("input[type='checkbox']:checked").prop("checked")) {
            $("#admindeleteUser").fadeIn("fast");
        } else {
            $("#admindeleteUser").fadeOut("fast");
        }
    });
    //delete button function for user table form view
    $(".adminutable").on("change", function () {
        if ($("input[type='checkbox']:checked").prop("checked")) {
            $("#formadmindeleteUser").fadeIn("fast");
        } else {
            $("#formadmindeleteUser").fadeOut("fast");
        }
    });

    $("#moveContainer .buttonContainerData #btn_dataStyling").on(
        "click",
        function () {
            $("#moveContainer .buttonContainerData #btn_dataStyling").css(
                "display",
                "none"
            );
            $(".buttonContainerData .hiddencontainer#KmlStylingDiv").fadeIn();
        }
    );

    $("#moveContainer .buttonContainerData #cancelKmlStyle").on(
        "click",
        function () {
            $(".buttonContainerData .hiddencontainer#KmlStylingDiv").css(
                "display",
                "none"
            );
            $(".buttonContainerData .hiddencontainer .subcontainer#shpStyleChk").css(
                "display",
                "none"
            );
            $("#IconStyleDiv").hide()
            $("#LineStyleDiv").hide()
            $("#PolyStyleDiv").hide()
            
            $("#moveContainer .buttonContainerData #btn_dataStyling").fadeIn();
        }
    );

    $("#moveContainer .buttonContainerData #btn_dataAdjustPosition").on(
        "click",
        function () {
            $("#moveContainer .buttonContainerData #btn_dataAdjustPosition").css(
                "display",
                "none"
            );
            $(".buttonContainerData .hiddencontainer#adjustlayerContainer").fadeIn();
        }
    );

    $("#moveContainer .buttonContainerData .hiddencontainer button#cancelAttach"
    ).on("click", function () {
        $(
            "#moveContainer .buttonContainerData .hiddencontainer#attachlayerContainer"
        ).css("display", "none");
        $("#moveContainer .buttonContainerData #btn_dataAttach").fadeIn();
    });

    $("#moveContainerAerial .buttonContainerData .hiddencontainer button#cancelAICAttach"
    ).on("click", function () {
        $("#moveContainerAerial .buttonContainerData .hiddencontainer#attachAICContainer"
        ).css("display", "none");
        
        $("#btn_aerialAttach").css("display", "block");
    });

    $(
        "#moveContainer .buttonContainerData .hiddencontainer button#canceladjustPotition"
    ).on("click", function () {
        $(
            "#moveContainer .buttonContainerData .hiddencontainer#adjustlayerContainer"
        ).css("display", "none");
        $("#moveContainer .buttonContainerData #btn_dataAdjustPosition").fadeIn();
    });

    $('#moveContainer .buttonContainerData #canceladdgroup').on('click', function () {
        $('.buttonContainerData .hiddencontainer#addToGroup').css('display', 'none')
        $('.buttonContainerData .hiddencontainer #editGroupLyrBtn').css('display', 'inline')
        //  $('.buttonContainerData .hiddencontainer #saveGroupLyrBtn').css('display', 'none')
        $('#moveContainer .buttonContainerData #btn_AddToGroup').fadeIn()
        $("#newGroupName").val("");
        $("#newLayerName").val("")
        $('#groupSubLayerSelect').prop("selectedIndex", 0)
        $("#newLayerGroup").text("<Add a new group>")
    })

    $('#canceladdgroupAerial').on('click', function () {
        $('#aicGroup').css('display', 'none')
        $('#hiddenAerialContainer').css('display', 'none')
        $('#hiddenAerialSubContainer').css('display', 'none')

        $("#newGroupAerialName").val("");
        $("#newsubGroupAerialName").val("");
    })

    $('#editpwfiles').on('click', function () {
        /* var url = $('#pwurldisplay').val();
            var n =url.indexOf("v2.5");
            url = url.substr(0,n);
            $('#pwURL').val(url);*/
        OnclickCancelDatasource();
        $(".pwfilesPage.readonly").css("display", "none");
        $(".pwfilesPage.edit").css("display", "block");
        $("#pwPassword").val("");

        $("#main-projectwise .headerButton .readonly").css("display", "none");
        $("#main-projectwise .headerButton .edit").css("display", "inline-block");
    });

    if(SYSTEM == 'KKR'){
        getWMSCap()
    }

    // if add new group is selected
    $("#groupAerialSelect").on('change', function () {
        var valueGroup = $(this).val();
        if(!valueGroup){
            $('#subGroupAerielSelect option[value=""]').attr("selected",true);
            $('#hiddenAerialContainer').css('display', 'none')
        }
        else{
            if (valueGroup == "newAerialGroup") {
                $('#hiddenAerialContainer').css('display', 'block')
            } else {
                $('#hiddenAerialContainer').css('display', 'none')
            }
        }
    })

    // if add new sub group is selected
    $("#subGroupAerielSelect").on('change', function () {
        var valueSubGroup = $(this).val();
        if(!valueSubGroup){
            $('#hiddenAerialSubContainer').css('display', 'none')
        }
        else{
            if (valueSubGroup == "newAerialSubGroup") {
                $('#hiddenAerialSubContainer').css('display', 'block')
            } else {
                $('#hiddenAerialSubContainer').css('display', 'none')
            }
        }
    })

    //FOR SORT LIST IN ADMIN
    $('.tableHeader span button.control').click(function(event){
        if($(this).hasClass("asc")){
            $(this).css("display", "none")
            $(this).next(".control:first").css("display", "inline-block")
        }else if($(this).hasClass("desc")){
            $(this).css("display", "none")
            $(this).prev(".control:first").css("display", "inline-block")
        }else if($(this).hasClass("unset")){
            $(this).css("display", "none")
            $(this).siblings(".desc").css("display", "inline-block")
        }
    })

    themeJoget = window.parent.localStorage.themeJoget
    new MutationObserver(function(mutations) {
        mutations.some(function(mutation) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
            if(mutation.target && mutation.target.localName == 'iframe'){
                setTimeout(function(){
                    themeJoget = window.parent.localStorage.themeJoget
                    $(mutation.target)[0].contentWindow.postMessage(themeJoget, '*');
                    localStorage.themeJoget = themeJoget
                    localStorage.jogetIfame = $(mutation.target).attr('id')
                }, 800)
            }
            return true;
          }
      
          return false;
        });
    }).observe(document.body, {
        attributes: true,
        attributeFilter: ['src'],
        attributeOldValue: true,
        characterData: false,
        characterDataOldValue: false,
        childList: false,
        subtree: true
    });
})

$("#editpwfiles").on("click", function () {
    /* var url = $('#pwurldisplay').val();
    var n =url.indexOf("v2.5");
    url = url.substr(0,n);
    $('#pwURL').val(url);*/
    OnclickCancelDatasource();
    $(".pwfilesPage.readonly").css("display", "none");
    $(".pwfilesPage.edit").css("display", "block");
    $("#pwPassword").val("");

    $("#main-projectwise .headerButton .readonly").css("display", "none");
    $("#main-projectwise .headerButton .edit").css("display", "inline-block");
});

$('#cancelpwfiles').on('click', function () {
    $('.pwfilesPage.readonly').css('display', 'block')
    $('.pwfilesPage.edit').css('display', 'none')
    $('#main-projectwise .headerButton .readonly').css('display', 'inline-block')
    $('#main-projectwise .headerButton .edit').css('display', 'none')
})

$('#editpowerbi').on('click', function () {
    $('.powerbiPage.readonly').css('display', 'none')
    $('.powerbiPage.edit').css('display', 'block')
    $('#main-powerbi .headerButton .readonly').css('display', 'none')
    $('#main-powerbi .headerButton .edit').css('display', 'inline-block')
    $('#powerbiPassword').val("");
})

$('#cancelpowerbi').on('click', function () {
    $('.powerbiPage.readonly').css('display', 'block')
    $('.powerbiPage.edit').css('display', 'none')
    $('#main-powerbi .headerButton .readonly').css('display', 'inline-block')
    $('#main-powerbi .headerButton .edit').css('display', 'none')
})

$('#editprojectwise365').on('click', function () {
    $('.projectwise365Page.readonly').css('display', 'none')
    $('.projectwise365Page.edit').css('display', 'block')
    $('#main-projectwise365 .headerButton .readonly').css('display', 'none')
    $('#main-projectwise365 .headerButton .edit').css('display', 'inline-block')
}) //#webserviceID

$('#cancelprojectwise365').on('click', function () {
    $('.projectwise365Page.readonly').css('display', 'block')
    $('.projectwise365Page.edit').css('display', 'none')
    $('#main-projectwise365 .headerButton .readonly').css('display', 'inline-block')
    $('#main-projectwise365 .headerButton .edit').css('display', 'none')
}) //#webserviceID

///// functions for the eot main page //////


///// functions for the eot main page //////

// function for clicking the add button on the eot main page //
$("#addeot").on("click", function () {
    $("#addeot").addClass("active");
    $(".cards.addnew .readonlypage").css("display", "none");
    $(".cards.addnew .editpage").css("display", "block");
});

// function for clicking the cancel button on the eot main page //
$("#canceladdeot").on("click", function () {
    $("addeot").removeClass("active");
    $(".cards.addnew .readonlypage").css("display", "block");
    $(".cards.addnew .editpage").css("display", "none");
});

//delete button function for user table form view
function checkAllUsers(ele) {
    var checkboxes = $(".utable");
    if (ele.checked) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == "checkbox") {
                checkboxes[i].checked = true;
            }
        }
        $("#admindeleteUser").fadeIn("fast");
    } else {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == "checkbox") {
                checkboxes[i].checked = false;
            }
        }
        $("#admindeleteUser").fadeOut("fast");
    }
}

function closemodal(ele) {
    let modaltoClose = $(ele).attr("rel");
    $("#" + modaltoClose).css("display", "none");
}

//checkboxes check all for container-tableLeft (add/remove users on adminpage)
function checkAllFormUserstableleft(ele) {
    var checkboxes = $(".adminutable");
    if (ele.checked) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == "checkbox") {
                checkboxes[i].checked = true;
            }
        }
    } else {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == "checkbox") {
                checkboxes[i].checked = false;
            }
        }
    }
}

//checkboxes check all for container-tableRight (add/remove users on adminpage)
function checkAllFormUserstableright(ele) {
    var checkboxes = $(".adminselectutable");
    if (ele.checked) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == "checkbox") {
                checkboxes[i].checked = true;
            }
        }
    } else {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == "checkbox") {
                checkboxes[i].checked = false;
            }
        }
    }
}

function OnClickAdminAddUser() {
    var data = [];
    $("#adminUserTableBody")
        .find("div")
        .each(function () {
            var row = $(this);
            if (row.find('input[type="checkbox"]').is(":checked")) {
                if((row.find("div").eq(1).html()) == undefined) return true;
                data.push({
                    id: row.find("div").eq(1).html(),
                    email: row.find("div").eq(2).text(),
                    name: row.find("div").eq(3).html(),
                    org: row.find("div").eq(4).html(),
                    orgType: row.find("div").eq(5).html()
                });
                row.remove();
            }
        });

    for (var i = 0; i < data.length; i++) {
        if(data[i].id == undefined) continue
        let tableForAddUserHTML = '';
        var row = $("#adminSelectUserTableBody").append('<div id="row_'+data[i].id+'" class="row admin fourColumn searchv3"></div>');
        var cell = $("#row_"+data[i].id);
        var selectList = document.createElement("select");
        selectList.id = "s" + data[i].id;
        let myoption = document.createElement("option");
        myoption.value = "";
        myoption.text = "Select a role ..";
        myoption.setAttribute("disabled", true);
        myoption.setAttribute("selected", true);
        selectList.appendChild(myoption);

        switch (data[i].orgType) {
            //Create and append the options
            case "owner":
                ownerRoles.forEach((ele)=>{
                    var myoption1 = document.createElement("option");
                    myoption1.value = ele;
                    myoption1.text = ele;
                    myoption1.dataset.orgsubtype = "";
                    selectList.appendChild(myoption1);
                })
                break;
            case "contractor":
               let coption01 = document.createElement("option");
               coption01.value = "Contractor PM";
               coption01.text = "Contractor PM";
               coption01.dataset.orgsubtype = "";
               selectList.appendChild(coption01);

                let coption02 = document.createElement("option");
                coption02.value = "Contractor Engineer";
                coption02.text = "Contractor Engineer";
                coption02.dataset.orgsubtype = "";
                selectList.appendChild(coption02);

                if(SYSTEM == 'KKR'){
                    let coption03 = document.createElement("option");
                    coption03.value = "Contractor DC";
                    coption03.text = "Contractor DC";
                    coption03.dataset.orgsubtype = "";
                   selectList.appendChild(coption03);
    
                    let coption04 = document.createElement("option");
                    coption04.value = "Site Supervisor";
                    coption04.text = "Site Supervisor";
                    coption04.dataset.orgsubtype = "";
                    selectList.appendChild(coption04);
    
                    let coption05 = document.createElement("option");
                    coption05.value = "HSET Officer";
                    coption05.text = "HSET Officer";
                    coption05.dataset.orgsubtype = "";
                    selectList.appendChild(coption05);
    
                    let coption06 = document.createElement("option");
                    coption06.value = "Contractor CM";
                    coption06.text = "Contractor CM";
                    coption06.dataset.orgsubtype = "";
                    selectList.appendChild(coption06);
    
                    let coption07 = document.createElement("option");
                    coption07.value = "QAQC Officer";
                    coption07.text = "QAQC Officer";
                    coption07.dataset.orgsubtype = "";
                    selectList.appendChild(coption07);
                    
                    let coption08 = document.createElement("option");
                    coption08.value = "Contractor QS";
                    coption08.text = "Contractor QS";
                    coption08.dataset.orgsubtype = "";
                    selectList.appendChild(coption08);
                }
                break;

            case "consultant":
                let noption1 = document.createElement("option");
                noption1.value = "Consultant CRE";
                noption1.text = "Consultant CRE";
                noption1.dataset.orgsubtype = "";
                selectList.appendChild(noption1);

                let noption2 = document.createElement("option");
                noption2.value = "Consultant RE";
                noption2.text = "Consultant RE";
                noption2.dataset.orgsubtype = "";
                selectList.appendChild(noption2);

                if(SYSTEM == 'KKR'){
                    let noption3 = document.createElement("option");
                    noption3.value = "Consultant DC";
                    noption3.text = "Consultant DC";
                    noption3.dataset.orgsubtype = "";
                    selectList.appendChild(noption3);
    
                    let noption4 = document.createElement("option");
                    noption4.value = "Sys Consultant";
                    noption4.text = "Sys Consultant";
                    noption4.dataset.orgsubtype = "";
                    selectList.appendChild(noption4);
    
                    let noption5 = document.createElement("option");
                    noption5.value = "Contractor QS";
                    noption5.text = "Contractor QS";
                    noption5.dataset.orgsubtype = "";
                    selectList.appendChild(noption5);
                }
                break;
            
            case "DBC":
                const contractorRoles = ["Contractor PM", "Contractor Engineer", "Contractor DC", "Site Supervisor", "HSET Officer", "Contractor CM", "QAQC Officer", "Contractor QS"];
                const consultantRoles = ["Consultant CRE", "Consultant RE", "Consultant DC", "Sys Consultant", "Consultant QS"];

                ownerRoles.forEach((ele) => {
                    let doption1 = document.createElement("option");
                    doption1.value = ele;
                    doption1.text = ele;
                    doption1.dataset.orgsubtype = "owner";
                    selectList.appendChild(doption1);
                })

                contractorRoles.forEach((ele) => {
                    let doption2 = document.createElement("option");
                    doption2.value = ele;
                    doption2.text = ele;
                    doption2.dataset.orgsubtype = "contractor";
                    selectList.appendChild(doption2);
                })

                consultantRoles.forEach((ele) => {
                    let doption3 = document.createElement("option");
                    doption3.value = ele;
                    doption3.text = ele;
                    doption3.dataset.orgsubtype = "consultant";
                    selectList.appendChild(doption3);
                })
                break;
        }

        tableForAddUserHTML += `
            <div class="columnSmall textContainer"><input type ="checkbox" id ="`+data[i].id+`" class = "adminselectutable"></div>
            <div style = "display:none">`+data[i].id+`</div>
            <div class="columnLarge textContainer"><span class="textClamp">`+data[i].email+`</span></div>
            <div class="columnMiddle textContainer"><span class="textClamp">`+data[i].name+`</span></div>
            <div class="columnLarge textContainer"><span class="textClamp">`+data[i].org+`</span></div>
            <div class="columnLarge textContainer proRoleSelection"></div>
            <div style = "display:none">`+data[i].orgType+`</div>`;

        if(localStorage.isParent == 'isParent' && localStorage.usr_role == 'Project Monitor' && localStorage.user_org == 'JKR'){
            tableForAddUserHTML += `
            <div class="textContainer"><span class="textClamp"><input type ="checkbox"></span></div>`;
        }
        cell.append(tableForAddUserHTML);
        $('.proRoleSelection').html(selectList);
    }
}

$("#adminUserTableBody").on("dblclick", "div", function () {
    var data = [];
    var row = $(this);
    data.push({
        id: row.find("div").eq(1).html(),
        email: row.find("div").eq(2).text(),
        name: row.find("div").eq(3).html(),
        org: row.find("div").eq(4).html(),
        orgType: row.find("div").eq(5).html()
    });
    if(data[0].id == undefined){
    }else{
        row.remove();

        let tableForAddUserHTML = '';

        for (var i = 0; i < data.length; i++) {
            var row = $("#adminSelectUserTableBody").append('<div id="row_'+data[i].id+'" class="row admin fourColumn searchv3"></div>');
            var cell = $("#row_"+data[i].id);
            var selectList = document.createElement("select");
            selectList.id = "s" + data[i].id;
            let myoption = document.createElement("option");
            myoption.value = "";
            myoption.text = "Select a role ..";
            myoption.setAttribute("disabled", true);
            myoption.setAttribute("selected", true);

            switch (data[i].orgType) {
                //Create and append the options
                case "owner":
                    ownerRoles.forEach((ele)=>{
                        var myoption1 = document.createElement("option");
                        myoption1.value = ele;
                        myoption1.text = ele;
                        selectList.appendChild(myoption1);
                    })
                    break;
                case "contractor":
                    let coption01 = document.createElement("option");
                    coption01.value = "Contractor PM";
                    coption01.text = "Contractor PM";
                    selectList.appendChild(coption01);

                    let coption02 = document.createElement("option");
                    coption02.value = "Contractor Engineer";
                    coption02.text = "Contractor Engineer";
                    selectList.appendChild(coption02);

                    if(SYSTEM == 'KKR'){
                        let coption03 = document.createElement("option");
                        coption03.value = "Contractor DC";
                        coption03.text = "Contractor DC";
                        selectList.appendChild(coption03);
    
                        let coption04 = document.createElement("option");
                        coption04.value = "Site Supervisor";
                        coption04.text = "Site Supervisor";
                        selectList.appendChild(coption04);
    
                        let coption05 = document.createElement("option");
                        coption05.value = "HSET Officer";
                        coption05.text = "HSET Officer";
                        selectList.appendChild(coption05);
    
                        let coption06 = document.createElement("option");
                        coption06.value = "Contractor CM";
                        coption06.text = "Contractor CM";
                        selectList.appendChild(coption06);
    
                        let coption07 = document.createElement("option");
                        coption07.value = "QAQC Officer";
                        coption07.text = "QAQC Officer";
                        selectList.appendChild(coption07);
    
                        let coption08 = document.createElement("option");
                        coption08.value = "Contractor QS";
                        coption08.text = "Contractor QS";
                        selectList.appendChild(coption08);
                    }
                    break;
                case "consultant":
                    let noption1 = document.createElement("option");
                    noption1.value = "Consultant CRE";
                    noption1.text = "Consultant CRE";
                    selectList.appendChild(noption1);

                    let noption2 = document.createElement("option");
                    noption2.value = "Consultant RE";
                    noption2.text = "Consultant RE";
                    selectList.appendChild(noption2);

                    if(SYSTEM == 'KKR'){
                        let noption3 = document.createElement("option");
                        noption3.value = "Consultant DC";
                        noption3.text = "Consultant DC";
                        selectList.appendChild(noption3);
    
                        let noption4 = document.createElement("option");
                        noption4.value = "Sys Consultant";
                        noption4.text = "Sys Consultant";
                        selectList.appendChild(noption4);
    
                        let noption5 = document.createElement("option");
                        noption5.value = "Consultant QS";
                        noption5.text = "Consultant QS";
                        selectList.appendChild(noption5);
                    }
                    break;
                case "DBC":
                    const contractorRoles = ["Contractor PM", "Contractor Engineer", "Contractor DC", "Site Supervisor", "HSET Officer", "Contractor CM", "QAQC Officer", "Contractor QS"];
                    const consultantRoles = ["Consultant CRE", "Consultant RE", "Consultant DC", "Sys Consultant", "Consultant QS"];
    
                    ownerRoles.forEach((ele) => {
                        let doption1 = document.createElement("option");
                        doption1.value = ele;
                        doption1.text = ele;
                        selectList.appendChild(doption1);
                    })
    
                    contractorRoles.forEach((ele) => {
                        let doption2 = document.createElement("option");
                        doption2.value = ele;
                        doption2.text = ele;
                        selectList.appendChild(doption2);
                    })
    
                    consultantRoles.forEach((ele) => {
                        let doption3 = document.createElement("option");
                        doption3.value = ele;
                        doption3.text = ele;
                        selectList.appendChild(doption3);
                    })
                    break;
            }

            tableForAddUserHTML += `
                <div class="columnSmall textContainer"><input type ="checkbox" id ="`+data[i].id+`" class = "adminselectutable"></div>
                <div style = "display:none">`+data[i].id+`</div>
                <div class="columnLarge textContainer"><span class="textClamp">`+data[i].email+`</span></div>
                <div class="columnMiddle textContainer"><span class="textClamp">`+data[i].name+`</span></div>
                <div class="columnLarge textContainer"><span class="textClamp">`+data[i].org+`</span></div>
                <div class="columnLarge textContainer proRoleSelection"></div>
                <div style = "display:none">`+data[i].orgType+`</div>`;

            cell.append(tableForAddUserHTML);
            $('.proRoleSelection').html(selectList);
        }
    }
});

$("#adminSelectUserTableBody").on("dblclick", "div", function () {
    var data = [];
    var row = $(this);
    data.push({
        id: row.find("div").eq(1).html(),
        email: row.find("div").eq(2).text(),
        name: row.find("div").eq(3).html(),
        org: row.find("div").eq(4).html(),
        orgType: row.find("div").eq(6).html() //select is the 5th column
    });
    if(data[0].id == undefined){
    }else{
        row.remove();

        let tableForAddUserHTML = '';

        for (var i = 0; i < data.length; i++) {
            var row = $("#adminUserTableBody").append('<div id="row_'+data[i].id+'" class="row admin threeColumn searchv3"></div>');
            var cell = $("#row_"+data[i].id);

            tableForAddUserHTML += `
                <div class="columnSmall textContainer"><input type ="checkbox" id ="`+data[i].id+`" class = "adminutable" value="`+data[i].id+`"></div>
                <div style = "display:none">`+data[i].id+`</div>
                <div class="columnLarge textContainer"><span class="textClamp">`+data[i].email+`</span></div>
                <div class="columnMiddle textContainer"><span class="textClamp">`+data[i].name+`</span></div>
                <div class="columnLarge textContainer"><span class="textClamp">`+data[i].org+`</span></div>
                <div style = "display:none">`+data[i].orgType+`</div>`;

            cell.append(tableForAddUserHTML);
        }
    }
});

function OnClickAdminRemoveUser() {
    var data = [];
    $("#adminSelectUserTableBody")
        .find("div")
        .each(function () {
            var row = $(this);
            if (row.find("div").eq(0).find("input").is(':checked')) {
                if((row.find("div").eq(1).html()) == undefined) return true;
                data.push({
                    id: row.find("div").eq(1).html(),
                    email: row.find("div").eq(2).text(),
                    name: row.find("div").eq(3).html(),
                    org: row.find("div").eq(4).html(),
                    orgType: row.find("div").eq(6).html() //orgtype is captured in this column
                });
                row.remove();
            }
    });

    for (var i = 0; i < data.length; i++) {
        if(data[i].id == undefined) continue
        let tableForAddUserHTML = '';
        var row = $("#adminUserTableBody").append('<div id="row_'+data[i].id+'" class="row admin threeColumn searchv3"></div>');
        var cell = $("#row_"+data[i].id);

        tableForAddUserHTML += `
            <div class="columnSmall textContainer"><input type ="checkbox" id ="`+data[i].id+`" class = "adminutable" value="`+data[i].id+`"></div>
            <div style = "display:none">`+data[i].id+`</div>
            <div class="columnLarge textContainer"><span class="textClamp">`+data[i].email+`</span></div>
            <div class="columnMiddle textContainer"><span class="textClamp">`+data[i].name+`</span></div>
            <div class="columnLarge textContainer"><span class="textClamp">`+data[i].org+`</span></div>
            <div style = "display:none">`+data[i].orgType+`</div>`;

        cell.append(tableForAddUserHTML);
    }
 
}

function OnClickAdminClearUser() {
    $.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Confirmation!",
        content: "Do you want to remove all the current users from the project? ",
        buttons: {
            Confirm: function () {
    
                var data = [];
                $("#adminSelectUserTableBody")
                    .find("div")
                    .each(function () {
                        var row = $(this);
                        data.push({
                            id: row.find("div").eq(1).html(),
                            email: row.find("div").eq(2).text(),
                            name: row.find("div").eq(3).html(),
                            org: row.find("div").eq(4).html(),
                            orgType: row.find("div").eq(6).html()
                        });
                        row.remove();
                    });

                let tableForAddUserHTML = '';

                for (var i = 0; i < data.length; i++) {
                    if(data[i].id == undefined) continue
                    var row = $("#adminUserTableBody").append('<div id="row_'+data[i].id+'" class="row admin threeColumn searchv3"></div>');
                    var cell = $("#row_"+data[i].id);

                    tableForAddUserHTML += `
                        <div class="columnSmall textContainer"><input type ="checkbox" id ="`+data[i].id+`" class = "adminutable" value="`+data[i].id+`"></div>
                        <div style = "display:none">`+data[i].id+`</div>
                        <div class="columnLarge textContainer"><span class="textClamp">`+data[i].email+`</span></div>
                        <div class="columnMiddle textContainer"><span class="textClamp">`+data[i].name+`</span></div>
                        <div class="columnLarge textContainer"><span class="textClamp">`+data[i].org+`</span></div>
                        <div style = "display:none">`+data[i].orgType+`</div>`;

                    cell.append(tableForAddUserHTML);
                }
                return;
            },
            Cancel: function () {
                return;
            },
        },
    });
}

function OnClickInviteUserSave() {
    var promptRelogin = false;
    event.preventDefault();
    var data = [];
    $("#adminSelectUserTableBody")
        .find("div")
        .each(function () {
            var row = $(this);
            if((row.find("div").eq(1).html()) == undefined) return true;
            data.push({
                id: row.find("div").eq(1).html(),
                projectRole: row.find("select").val(),
                email: row.find("div").eq(2).text(),
                orgsubtype : row.find('select option:selected').data('orgsubtype'),
                reporting: row.find("div").eq(7).find("input").is(':checked')
            });
            if (localStorage.signed_in_email == row.find("div").eq(2).text()) {
                if (localStorage.usr_role != row.find("select").val()) {
                    promptRelogin = true; //  need to relogin
                }
            }
        });
    var usersReportingAccess = [];
    var projectUsersUpdate = [];
    var projectGroupUsersUpdate = [];
    var projectGrpRole1 = ['Consultant RE','QAQC Engineer', 'Safety Officer'];
    var projectGrpRole2 = ['Project Manager','Construction Engineer', 'Project Monitor'];
    var msg =" Are you sure you want to update the roles for these users? <br>"
    for (var i = 0; i < projectUsers.length; i++) {
        var j = 0;
        var idflag = false;
        while (j < data.length) {
            if (projectUsers[i].id == data[j].id) {
                if (projectUsers[i].projectRole != data[j].projectRole) {
                    if(SYSTEM == 'KKR'){
                        projectUsersUpdate.push({
                            user_id: data[j].id,
                            user_role: data[j].projectRole,
                            user_email: data[j].email,
                            user_old_role : projectUsers[i].projectRole,
                            user_orgSubType : data[j].orgsubtype
                        });
                    }else{
                        projectUsersUpdate.push({
                            user_id: data[j].id,
                            user_role: data[j].projectRole,
                            user_email: data[j].email,
                            user_orgSubType : data[j].orgsubtype
                        });
                    }
                    if(SYSTEM == 'KKR'){
                        msg +=  data[j].email + " - change role <br>";
                        if(projectGrpRole1.includes(projectUsers[i].projectRole)){//remove the group role from db
                            projectGroupUsersUpdate.push({
                                user_id: data[j].id,
                                user_group: "noGroup",
                                user_email: data[j].email,
                                user_old_group: "MA Committee,Technical Reviewer"
                            });
    
                        }else if(projectGrpRole2.includes(projectUsers[i].projectRole)){//remove the group role from db
                            projectGroupUsersUpdate.push({
                                user_id: data[j].id,
                                user_group: "noGroup",
                                user_email: data[j].email,
                                user_old_group: "MA Committee"
                            });
                        }
                    }

                }
                //assigning digital reporting access
                if(projectUsers[i].reporting != data[j].reporting){
                    usersReportingAccess.push({
                        user_id: data[j].id,
                        user_email: data[j].email,
                        user_reporting: (data[j].reporting) ? data[j].reporting : 0
                    });
                    msg +=  data[j].email + " - change user access (Digital Reporting)<br>";
                }
                data.splice(j, 1);
                idflag = true;
                break;
            }
            j++;
        }
        if (!idflag) {
            if(SYSTEM == 'KKR'){
                projectUsersUpdate.push({
                    user_id: projectUsers[i].id,
                    user_role: "noRole",
                    user_email: projectUsers[i].email,
                    user_old_role : projectUsers[i].projectRole,
                    user_orgSubType : projectUsers[i].orgsubtype
                });
                msg +=  projectUsers[i].email + " - remove user <br>";
           
                if(projectGrpRole1.includes(projectUsers[i].projectRole)){//remove the group role from db
                    projectGroupUsersUpdate.push({
                        user_id: projectUsers[i].id,
                        user_group: "noGroup",
                        user_email: projectUsers[i].email,
                        user_old_group: "MA Committee,Technical Reviewer"
                    });
    
                }else if(projectGrpRole2.includes(projectUsers[i].projectRole)){//remove the group role from db
                    projectGroupUsersUpdate.push({
                        user_id: projectUsers[i].id,
                        user_group: "noGroup",
                        user_email: projectUsers[i].email,
                        user_old_group: "MA Committee"
                    });
                }
            }else{
                projectUsersUpdate.push({
                    user_id: projectUsers[i].id,
                    user_role: projectUsers[i].projectRole,
                    user_email: projectUsers[i].email,
                    user_orgSubType : projectUsers[i].orgsubtype
                });
            }

            //assigning digital reporting access
            usersReportingAccess.push({
                user_id: projectUsers[i].id,
                user_email: projectUsers[i].email,
                user_reporting: 0
            });
        }
    }
    for (var i = 0; i < data.length; i++) {
        if(SYSTEM == 'KKR'){
            projectUsersUpdate.push({
                user_id: data[i].id,
                user_role: data[i].projectRole,
                user_email: data[i].email,
                user_old_role: "noOldRole",
                user_orgSubType : data[i].orgsubtype
            });
            msg +=   data[i].email + " - add user <br>";
        }else{
            projectUsersUpdate.push({
                user_id: data[i].id,
                user_role: data[i].projectRole,
                user_email: data[i].email,
                user_orgSubType : data[i].orgsubtype
            });
        }

        //assigning digital reporting access
        usersReportingAccess.push({
            user_id: data[i].id,
            user_email: data[i].email,
            user_reporting: (data[i].reporting) ? data[i].reporting : 0
        });
    };

    var formdata = new FormData();
    formdata.append("users", JSON.stringify(projectUsersUpdate));
    if(SYSTEM == 'KKR'){
        if(projectGroupUsersUpdate.length>0){
            formdata.append("userGroup", JSON.stringify(projectGroupUsersUpdate));
        }
    }
    if(usersReportingAccess.length > 0){
        formdata.append("usersReporting", JSON.stringify(usersReportingAccess));
    }
    formdata.append("functionName", "projectAdminUpdateUsers");

    if(SYSTEM == 'OBYU'){
        ajaxUrl = 'BackEnd/ProjectFunctionsOBYU.php';
    }else{
        ajaxUrl = 'BackEnd/ProjectFunctionsV3.php';
    }

    if(projectUsersUpdate.length > 0 || usersReportingAccess.length > 0){
        $.confirm({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Confirm!',
            content: msg,
            buttons: {
                confirm: function () {
                    $.ajax({
                        url: ajaxUrl,
                        data: formdata,
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        success: function (res) {
                            var data = JSON.parse(res)
                            if (promptRelogin == true) {
                                $.confirm({
                                    boxWidth: '30%',
                                    useBootstrap: false,
                                    title: 'Confirm!',
                                    content: 'You\'ll be automatically logged out and logged in again with updated role that you have changed from the system.',
                                    buttons: {
                                        OK: function () {
                                            window.parent.open("signin.php", '_self')
                                        }
                                    }
                                });
                            } else { // no need to relogin
                                $.alert({
                                    boxWidth: '30%',
                                    useBootstrap: false,
                                    title: ((data.bool) ? "Success!" : "Error!") ,
                                    content: ((data.usrs_msg) ? data.usrs_msg : data.msg) 
                                });
                
                                if (data.bool) {
                                    //highlight list user menu
                                    window.parent.leftMenuButtonUnhightlight();
                                    window.parent.$(`.subButtonContainer #listUsers`).addClass("active");

                                    loadProjectUsers();
                
                                    while (projectUsers.length) {
                                        projectUsers.pop();
                                    }
                                    $('#invitenewuserForm').css('display', 'none');
                                    $('#invitenewuserForm').removeClass('active');
                                    $("#adminProjectUsersSearch").val("");
                                }
                            }
                        }
                    });
                },
                cancel: function () {
                    return;
                },
            },
        });
    }
}

function refreshAdminUserTable() {
    $("#invitenewuserForm").css("display", "block");
    $("#adminProjectUsersSearch").val("");

    if(SYSTEM == 'OBYU'){
        ajaxUrl = 'BackEnd/UserFunctionsOBYU.php';
    }else{
        ajaxUrl = 'BackEnd/UserFunctionsV3.php';
    }

    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: {
            functionName: "adminUserTableRefresh"
        },
        dataType: "json",
        success: function (response) {
            var users = response.users;
            var pusers = response.projectUsers;
            document.getElementById('adminUserTableBody').html = "";
            var myhtml = "";
            var userType;
            var userOrg;

            for (var i = 0; i < users.length; i++) {
                myhtml += '<div class="row admin threeColumn searchv3">' +
                                '<div class="columnSmall textContainer"> <input type ="checkbox"  class = "adminutable" value =' + users[i].user_id + '></div>' +
                                '<div style = "display:none">' + users[i].user_id + '</div>' +
                                '<div class="columnLarge textContainer"><span class="textClamp">' + users[i].user_email + '</span></div>' +
                                '<div class="columnMiddle textContainer"><span class="textClamp">' + users[i].user_firstname + '</span></div>' +
                                '<div class="columnLarge textContainer"><span class="textClamp">' + users[i].orgName + '</span></div>' +
                                '<div style = "display:none">' + users[i].orgType + '</div>' +
                            '</div>';
            };
            $('#adminUserTableBody').html(myhtml);
            var phtml = "";
            var puser;
            for (var i = 0; i < pusers.length; i++) {
                phtml +=
                    '<div class="row admin fourColumn searchv3">' +
                    '<div class="columnSmall textContainer"> <input type ="checkbox"  class = "adminselectutable" id =' +
                    pusers[i].user_id +
                    "></div>" +
                    '<div style = "display:none">' +
                    pusers[i].user_id +
                    "</div>" +
                    '<div class="columnLarge textContainer"><span class="textClamp">' +
                    pusers[i].user_email +
                    "</span></div>" +
                    '<div class="columnMiddle textContainer"><span class="textClamp">' +
                    pusers[i].user_firstname +
                    "</span></div>" +
                    '<div class="columnLarge textContainer"><span class="textClamp">' +
                    pusers[i].orgName +
                    "</span></div>";
                let selected = "";
                switch (pusers[i].orgType) {
                    case "owner": phtml +=
                        '<div class="columnLarge textContainer"><select id= "s' +
                        pusers[i].user_id +
                        '" class = "addadminuserselect">';
                        ownerRoles.forEach((ele)=>{
                            phtml += '<option value= "'+ele+'"' + ((pusers[i].Pro_Role == ele) ? "selected" : "") +' data-orgsubtype="">'+ele+'</option>' ;
                        })
                        phtml += "</select></div>";
                        phtml += '<div style ="display:none">owner</div>';
                        break;
                    
                    case "contractor": 
                        phtml +=
                        '<div class="columnLarge textContainer"><select id= "s' +
                        pusers[i].user_id +
                        '" class = "addadminuserselect">' +
                            '<option value= "Contractor PM"';
                        selected = (pusers[i].Pro_Role == "Contractor PM") ? "selected" : "";
                        phtml += selected + ' data-orgsubtype="">Contractor PM</option>' +
                            '<option value= "Contractor Engineer"';
                        selected = (pusers[i].Pro_Role == "Contractor Engineer") ? "selected" : "";
                        phtml += selected + ' data-orgsubtype="">Contractor Engineer</option>';

                        if(SYSTEM == 'OBYU'){
                            phtml +="</select></div>";
                        }else{
                            phtml += '<option value= "Contractor DC"';
                            selected = (pusers[i].Pro_Role == "Contractor DC") ? "selected" : "";
                            phtml += selected + ' data-orgsubtype="">Contractor DC</option>' +
                                '<option value= "Site Supervisor"';
                            selected = (pusers[i].Pro_Role == "Site Supervisor") ? "selected" : "";
                            phtml += selected + ' data-orgsubtype="">Site Supervisor</option>' +
                                '<option value= "HSET Officer"';
                            selected = (pusers[i].Pro_Role == "HSET Officer") ? "selected" : "";
                            phtml += selected + ' data-orgsubtype="">HSET Officer</option>' +
                                '<option value= "Contractor CM"';
                            selected = (pusers[i].Pro_Role == "Contractor CM") ? "selected" : "";
                            phtml += selected + ' data-orgsubtype="">Contractor CM</option>' +
                                '<option value= "QAQC Officer"';
                            selected = (pusers[i].Pro_Role == "QAQC Officer") ? "selected" : "";
                            phtml += selected + ' data-orgsubtype="">QAQC Officer</option>' +
                                '<option value= "Contractor QS"';
                            selected = (pusers[i].Pro_Role == "Contractor QS") ? "selected" : "";
                            phtml += selected + ' data-orgsubtype="">Contractor QS</option>' +
                                "</select></div>";
                        }
                        phtml += '<div style ="display:none">contractor</div>';
                        break;
                    //case "Consultant CRE": case "Consultant RE": phtml +=
                    case "consultant": phtml +=
                        '<div class="columnLarge textContainer" ><select id= "s' +
                        pusers[i].user_id +
                        '" class = "addadminuserselect">' +
                        '<option value= "Consultant CRE"';
                        selected = (pusers[i].Pro_Role == "Consultant CRE") ? "selected" : "";
                        phtml += selected + ' data-orgsubtype="">Consultant CRE</option>' +
                            '<option value= "Consultant RE"';
                        selected = (pusers[i].Pro_Role == "Consultant RE") ? "selected" : "";
                        phtml += selected + ' data-orgsubtype="">Consultant RE</option>'
                        if(SYSTEM == 'OBYU'){
                            phtml +="</select></div>";
                        }else{
                            phtml += '<option value= "Consultant DC"';
                            selected = (pusers[i].Pro_Role == "Consultant DC") ? "selected" : "";
                            phtml += selected + ' data-orgsubtype="">Consultant DC</option>' +
                                '<option value= "Sys Consultant"';
                            selected = (pusers[i].Pro_Role == "Sys Consultant") ? "selected" : "";
                            phtml += selected + ' data-orgsubtype="">Sys Consultant</option>' +
                                '<option value= "Consultant QS"';
                            selected = (pusers[i].Pro_Role == "Consultant QS") ? "selected" : "";
                            phtml += selected + ' data-orgsubtype="">Consultant QS</option>' +
                                "</select></div>";
                        }
                        phtml += '<div style ="display:none">consultant</div>';
                        break;

                    case "DBC":
                        const contractorRoles = ["Contractor PM", "Contractor Engineer", "Contractor DC", "Site Supervisor", "HSET Officer", "Contractor CM", "QAQC Officer", "Contractor QS"];
                        const consultantRoles = ["Consultant CRE", "Consultant RE", "Consultant DC", "Sys Consultant", "Consultant QS"];
                        phtml +=
                        '<div class="columnLarge textContainer"><select id= "s' +
                        pusers[i].user_id +
                        '" class = "addadminuserselect">';
                        ownerRoles.forEach((ele) => {
                            phtml += '<option value="' + ele + '"' + ((pusers[i].Pro_Role == ele) ? " selected" : "") + ' data-orgsubtype="owner">' + ele + '</option>';
                        });
                        contractorRoles.forEach(role => {
                            phtml += '<option value="' + role + '"' + ((pusers[i].Pro_Role == role) ? " selected" : "") + ' data-orgsubtype="contractor">' + role + '</option>';
                        });
                        consultantRoles.forEach(role1 => {
                            phtml += '<option value="' + role1 + '"' + ((pusers[i].Pro_Role == role1) ? " selected" : "") + ' data-orgsubtype="consultant">' + role1 + '</option>';
                        });
                        phtml += "</select></div>";
                        phtml += '<div style ="display:none">DBC</div>';
                        break;
                }
                if(localStorage.isParent == 'isParent' && localStorage.usr_role == 'Project Monitor' && localStorage.user_org == 'JKR'){
                    if(pusers[i].show_reporting == '1'){
                        phtml +=
                        '<div class="textContainer"><span class="textClamp"><input type ="checkbox" checked></span></div>';
                    }else{
                        phtml +=
                        '<div class="textContainer"><span class="textClamp"><input type ="checkbox"></span></div>';
                    }
                }

                phtml += '</div>';
            };
            $('#adminSelectUserTableBody').html(phtml);
            $("#adminSelectUserTableBody")
                .find("div")
                .each(function () {
                    var row = $(this);
                    if((row.find("div").eq(1).html()) == undefined) return true;
                    projectUsers.push({
                        id: row.find("div").eq(1).html(),
                        projectRole: row.find("select").val(),
                        email: row.find("div").eq(2).text(),
                        orgsubtype: row.find("select option:selected").data("orgsubtype"),
                        reporting: row.find("div").eq(7).find("input").is(':checked') //reporting access is captured in this column
                    });
                });
        },
    });
}

function retrieveGroupOpt (){
    $.get("BackEnd/getLayerGroups.php", function (data) {
        var options = '<option disabled selected value> -- select an option -- </option>\
        <option id="newLayerGroup" value="newLayerGroup">&lt;Add a new group&gt;</option>'
        data.forEach(function (item) {
            options += "<option data='" + item.groupView + "' data-flag='" + item.flagROS + "' value='" + item.groupID + "'>" + item.groupName + "</option>"
        })
        $("#groupLayerSelect").html(options);
    })
}

function retrieveSubGroupOpt (){
    var groupID = $('#groupLayerSelect option:selected').val() ? $('#groupLayerSelect option:selected').val() : '';

    $.ajax({
        type: "POST",
        url: "BackEnd/getSubLayerGroups.php",
        data: {groupID: groupID},
        dataType: "json",
        success: function (obj, textstatus) {
            var options = `<option value="default" disabled selected> -- select an option -- </option>
            <option id="mergeSubLayer" value="mergeSubLayer">&lt;Create group for merge layer&gt;</option>`
            obj.forEach(function (item) {
                if(item.subGroupID){
                    options += "<option data-flag='1' value='" + item.subGroupID + "'>" + item.subGroupName + "</option>"
                }
            })
            $("#groupSubLayerSelect").html(options);
        }
    });
}

function checkDataPool(){
    $("#main-layerdata").css("display", "block");
    DataPool_table();
}

let DataPool_flag = false;
function DataPool_table() {
    $.ajax({
        type: "POST",
        url: "BackEnd/DataFunctions.php",
        data: {functionName: 'getCompleteGeoData'},
        dataType: "json",
        success: function (obj, textstatus) {
            let parkCont = $("#parkContainer")[0];
            let movecontainer = document.getElementById("moveContainer");
            parkCont.insertAdjacentElement("afterend", movecontainer);
            $(movecontainer).slideUp(100);
            $("br.spacer").remove();
            $("#dataTable").html("");

            mixitup ('#dataTable', config).destroy();

            for (let row of obj.data) {
                var $attachimgsrc;
                var $attachimgtitle;
                var $shareimgsrc;
                var $shareimgtitle;
                if (row.Share == 0) {
                    $shareimgsrc = "Images/icons/admin_page/datamanage/notshared.png";
                    $shareimgtitle = "Not Shared";
                } else {
                    $shareimgsrc = "Images/icons/admin_page/datamanage/shared.png";
                    $shareimgtitle = "Shared";
                }
                if (row.Project_ID == localStorage.p_id) {
                    $attachimgsrc = "Images/icons/admin_page/datamanage/attached.png";
                    $attachimgtitle = "Attached";
                } else {
                    $attachimgsrc = "Images/icons/admin_page/datamanage/notattached.png";
                    $attachimgtitle = "Not_Attached";
                }
                upload_date = new Date(row.Added_Date);
                upload_date = upload_date.toDateString();
                var sortDataName = (row.Data_Name) ? row.Data_Name : ' ';

                $("#dataTable").append(
                '<div class="row admin eightColumn searchv3 mix" rel="" onclick ="editLayer(this)" data-data-name="' + sortDataName + '" data-data-type="' + row.Data_Type + '" data-data-owner="' + row.Data_Owner + '" data-data-file="' + row.Data_URL + '">\
                    <div class="columnSmall textContainer" style="display:none"><span class="text">' + row.Data_Name + '</span></div>\
                    <div class="columnSmall textContainer"><img title="' + $attachimgtitle + '" src="' + $attachimgsrc + '"></div>\
                    <div class="columnSmall textContainer"><img title="' + $shareimgtitle + '" src="' + $shareimgsrc + '"></div>\
                    <div class="columnLarge textContainer"><span class="text textClamp">' + row.Data_Name + '</span></div>\
                    <div class="columnSmall textContainer"><span class="text textClamp">' + row.Data_Type + '</span></div>\
                    <div class="columnLarge textContainer"><span class="text textClamp">' + row.Data_Owner + '</span></div>\
                    <div class="columnLarge textContainer"><span class="text textClamp">' + decodeURI(row.Data_URL) + '</span></div>\
                    <div class="columnMiddle textContainer"><span class="text textClamp">' + upload_date + '</span></div>\
                    <div class="columnMiddle textContainer textCenter"><span class="text">' + row.Frequency + '</span></div>\
                    <div class="columnSmall textContainer" style="display:none"><span class="text">' + row.Offset + '</span></div>\
                    <div class="columnSmall textContainer" style="display:none"><span class="text">' + row.Data_ID + '</span></div>\
                    <div class="columnSmall textContainer" style="display:none"><span class="text">' + row.Project_ID + '</span></div>\
                    <div class="columnSmall textContainer" style="display:none"><span class="text">' + row.Layer_ID + '</span></div>\
                    <div class="columnSmall textContainer" style="display:none"><span class="text">' + row.layerGroup + '</span></div>\
                    <div class="columnSmall textContainer" style="display:none"><span class="text">' + row.Style + '</span></div>\
                    <div class="columnSmall textContainer" style="display:none"><span class="text">' + row.Data_Owner_ID + '</span></div>\
                    <div class="columnSmall textContainer" style="display:none"><span class="text">' + row.X_Offset + '</span></div>\
                    <div class="columnSmall textContainer" style="display:none"><span class="text">' + row.Y_Offset + '</span></div>\
                </div>'
                )
            }

            mixitup ('#dataTable', config)

        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    })

    retrieveGroupOpt();
    retrieveSubGroupOpt();
    if(SYSTEM == 'KKR'){
        fetchShpStyles()
    }

}
var myData;

function editLayer(ele) {
    let movecontainer = document.getElementById("moveContainer");
    clearStyleInput();
    if ($(ele).hasClass("active")) {
        $(ele).removeClass("active");
        $(ele).siblings().removeClass("active");
        $(movecontainer).slideUp(100);
        $("br.spacer").remove();
    } else {
        $(ele).addClass("active");
        ele.insertAdjacentElement("afterend", movecontainer);
        $("#moveContainer .buttonContainerData .hiddencontainer#renamelayerContainer").css("display", "none");
        $("#moveContainer .buttonContainerData #btn_renameLayer").fadeIn();
        $("#moveContainer .buttonContainerData .hiddencontainer#attachlayerContainer").css("display", "none");
        $("#moveContainer .buttonContainerData #btn_dataAttach").fadeIn();
        $("#moveContainer .buttonContainerData #btn_AddToGroup").fadeIn();
        $("#moveContainer .buttonContainerData #btn_dataAdjustPosition").fadeIn();
        $("#moveContainer .buttonContainerData .hiddencontainer").css("display", "none");
        $("#moveContainer .buttonContainerData #btn_setDefault").fadeIn();

        $(ele).siblings().removeClass("active");
        $(ele).addClass("active");
        $("br.spacer").remove();
        $("#moveContainer").slideDown(100).css("display", "inline-flex");

        let data_type = ele.children[4].innerText;
        if(data_type === "SHP"){
            shapefileStyling = true
        }else{
            shapefileStyling = false;
        }
        let data_url = ele.children[6].innerText;
       
        let data_name = ele.children[3].innerText;
        let data_access = ele.children[2].children[0].title;
        let data_attach = ele.children[1].children[0].title;
        let data_offset = ele.children[9].innerText;
        let data_x_offset = ele.children[16].innerText;
        let data_y_offset = ele.children[17].innerText;
        let data_id = ele.children[10].innerText;
        let frequency = ele.children[8].innerText;
        let layerID = ele.children[12].innerText;
        let layerGroup = ele.children[13].innerText;
        let project_name = localStorage.p_name;
        let Style = ele.children[14].innerText;
        let p_id_name = ele.children[15].innerText;
        $('#heightadjustPosition').val(parseFloat(data_offset).toFixed(3));
        $('#xadjustPosition').val(parseFloat(data_x_offset).toFixed(3));
        $('#yadjustPosition').val(parseFloat(data_y_offset).toFixed(3));

        dataDetails = {
            id: data_id,
            layerID: layerID,
            groupID: layerGroup,
            name: data_name,
            access: data_access,
            ele: ele,
            frequency: frequency,
            type: data_type,
            offset: data_offset,
            xOffset: data_x_offset,
            yOffset: data_y_offset,
            url: data_url,
            Style: Style,
            projectIdName: p_id_name
        };
   
        //hide button if not owner of layer 
        let data_owner = ele.children[5].innerText;
        $("#attachLayer").val("");
        $("#setdefaultLayer")[0].checked = false;
        if (data_access == "Not Shared") {
            $("#btn_dataPermission").html("Share");
        } else {
            $("#btn_dataPermission").html("Unshare");
        }
        if (decodeHtml(data_owner).trim() !== decodeHtml(project_name).trim()) {
            $("#btn_dataStyling").attr("disabled", "")
            $("#btn_dataRename, #btn_dataPermission, #btn_dataDelete").attr("disabled", "")
            if (data_access == "Not Shared" && data_attach == "Not_Attached") {
                $("#btn_dataAttach").attr("disabled", "");
                $("#btn_AddToGroup").attr("disabled", "");
                $("#btn_dataAttach").html("Attach");
            } else if (data_access == "Shared" && data_attach == "Not_Attached") {
                $("#btn_dataAttach").html("Attach");
                $("#btn_AddToGroup").attr("disabled", "");
                $("#btn_dataAttach").removeAttr("disabled");
            } else if (data_access == "Shared" && data_attach == "Attached") {
                $("#btn_dataAttach").html("Detach");
                $("#btn_dataAttach").removeAttr("disabled");
                $("#btn_AddToGroup").removeAttr("disabled");
            } else if (data_access == "Not Shared" && data_attach == "Attached") {
                $("#btn_dataAttach").html("Detach");
                $("#btn_dataAttach").attr("disabled", "");
                $("#btn_AddToGroup").removeAttr("disabled");
            }
        } else {
            $("#btn_dataStyling").removeAttr("disabled");
            $(
                "#btn_dataRename, #btn_dataPermission, #btn_dataDelete,#btn_dataAttach"
            ).removeAttr("disabled");
            if (data_attach == "Not_Attached") {
                $("#btn_dataAttach").html("Attach");
                $("#btn_AddToGroup").attr("disabled", "");
            } else if (data_attach == "Attached" && eval(frequency <= 1)) {
                $("#btn_dataAttach").html("Detach");
                $("#btn_AddToGroup").removeAttr("disabled");
            } else {
                $("#btn_dataPermission").attr("disabled", "");
                $("#btn_dataAttach").html("Detach");
                $("#btn_AddToGroup").removeAttr("disabled");
            }
        }
        if (viewer3.imageryLayers.length >= 1) {
            viewer3.imageryLayers.remove(myData);
        }
        if (myData){
            removeDataFromCesium(myData);
        }
        $("#shpStyleSelect").prop("selectedIndex", 0);
      
        switch (data_type) {
            case "KML":
                $("#btn_dataAdjustPosition").attr("disabled", "");
                myData = new Cesium.KmlDataSource();
                myData.load(data_url);
                dataDetails.tile = myData;
                dataDetails.tiles = myData.entities;
                viewer3.dataSources.add(myData);
                viewer3.flyTo(myData, {
                    duration: 1,
                });
                $("#btn_dataStyling").show();
                $("#btn_dataAdjustPosition").hide();
                break;
            case "B3DM":
                $("#btn_dataAdjustPosition").show()
                if (data_owner.trim() !== project_name.trim()) {
                    $("#btn_dataAdjustPosition").attr("disabled", "")
                } else {
                    $("#btn_dataAdjustPosition").removeAttr("disabled");
                }
                myData = viewer3.scene.primitives.add(
                    new Cesium.Cesium3DTileset({
                        url: data_url,
                        dynamicScreenSpaceError: true,
                        dynamicScreenSpaceErrorDensity: 0.00278,
                        dynamicScreenSpaceErrorFactor: 64.0,
                        dynamicScreenSpaceErrorHeightFalloff: 0.125,
                        baseScreenSpaceError: 4,
                        maximumScreenSpaceError: 8,
                    })
                );

                myData.readyPromise.then(function () {
                    var heightOffset = data_offset;
                    var xAxisOffset = data_x_offset;
                    var yAxisOffset = data_y_offset;

                    var boundingSphere = myData.boundingSphere;
                    var cartographic = Cesium.Cartographic.fromCartesian(
                        boundingSphere.center
                    );

                    var surface = Cesium.Cartesian3.fromRadians(
                        cartographic.longitude,
                        cartographic.latitude,
                        0.0
                    );

                    var xInRadians = Cesium.Math.toRadians(xAxisOffset);
                    var yInRadians = Cesium.Math.toRadians(yAxisOffset);

                    var newLongitude = cartographic.longitude + Cesium.Math.toRadians(Cesium.Math.toRadians(Cesium.Math.toRadians(xInRadians)));
                    var newLatitude = cartographic.latitude + Cesium.Math.toRadians(Cesium.Math.toRadians(Cesium.Math.toRadians(yInRadians)));
                    var newHeight = heightOffset;

                    if(Number.isNaN(newLongitude) || Number.isNaN(newLatitude)){
                        var newPosition = Cesium.Cartesian3.fromRadians(
                            cartographic.longitude, 
                            cartographic.latitude, 
                            heightOffset
                        );
                    }else{
                        var newPosition = Cesium.Cartesian3.fromRadians(
                            newLongitude, 
                            newLatitude, 
                            newHeight
                        );
                    }
                
                    var translation = Cesium.Cartesian3.subtract(
                        newPosition,
                        surface,
                        new Cesium.Cartesian3()
                    );
                    myData.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
                });

                viewer3.flyTo(myData, {
                    duration: 1,
                });
                $("#btn_dataStyling").hide();
                break;
            case "ION":
                $("#btn_dataStyling").hide();
                if (data_owner.trim() !== project_name.trim()) {
                    $("#btn_dataAdjustPosition").attr("disabled", "")
                } else {
                    $("#btn_dataAdjustPosition").removeAttr("disabled");
                }
                myData = viewer3.scene.primitives.add(
                    new Cesium.Cesium3DTileset({
                        url: Cesium.IonResource.fromAssetId(data_url),
                    })
                );
                viewer3.flyTo(myData, {
                    duration: 1,
                });
                break;
            case "SHP":
                var parameters = {}
                if(!dataDetails.Style || dataDetails.Style ==="null"){
                    parameters= {
                        transparent: true,
                        format: "image/png",
                    }
                }else{
                    parameters= {
                        transparent: true,
                        format: "image/png",
                        STYLES: Style
                    }
                }
                let wms = new Cesium.WebMapServiceImageryProvider({
                    url : wmsURL+"/wms",
                    layers : dataDetails.projectIdName+":"+encodeURI(dataDetails.url),
                    parameters : parameters
                });
                myData = viewer3.imageryLayers.addImageryProvider(wms);
                $("#btn_dataAdjustPosition").attr("disabled", "");
                $("#btn_dataStyling").show();
                $("#btn_dataAdjustPosition").hide();
                setTimeout(function(){ wmsFlyTo(data_url) }, 200);
            break;
        }
    }
}

function decodeHtml(str) {
  return new DOMParser()
    .parseFromString(str, "text/html")
    .documentElement.textContent;
}

function permissionToggle() {
    let freq = parseInt(dataDetails.frequency);
    //This check needs to be only when unsharing not when sharing
    // if (freq > 0) {
    //     $.alert({
    //         boxWidth: "30%",
    //         useBootstrap: false,
    //         title: "Message",
    //         content: "Please make sure no project is attached to this data before unshare",
    //     });
    //     return;
    // }
    if (dataDetails.access == "Not Shared") {
        //project
        $.confirm({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Confirm!",
            content: "Share this data to other projects?",
            buttons: {
                confirm: function () {
                    $.ajax({
                        type: "POST",
                        url: "BackEnd/dataAccess.php",
                        dataType: "json",
                        data: {
                            access: 1,
                            data_id: dataDetails.id,
                        },
                        success: function (obj, textstatus) {
                            if (obj.data == "Update successful") {
                                dataDetails.access = "Shared"
                                $(dataDetails.ele.children[2].children[0]).attr("title", "Shared")
                                $(dataDetails.ele.children[2].children[0]).attr("src", "Images/icons/admin_page/datamanage/shared.png")
                                $("#btn_dataPermission").html("Unshare")
                            }
                            if (obj.data == "No Permission") {
                                $.alert({
                                    boxWidth: "30%",
                                    useBootstrap: false,
                                    title: "Message",
                                    content: "You do not have permission to update this!",
                                });
                            }
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
    } else {
        // check if only the owner of the project is attached
        console.log($("#btn_dataAttach").html())
        if ( $("#btn_dataAttach").html() == "Attach"   && freq > 0 ) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please make sure no project is attached to this data before unshare",
            });
            return;
        }else if ( $("#btn_dataAttach").html() == "Detach"   && freq > 1 ) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please make sure no project is attached to this data before unshare",
            });
            return;
        }

        $.confirm({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Confirm!",
            content: "Make this layer available to this project only?",
            buttons: {
                confirm: function () {
                    $.ajax({
                        type: "POST",
                        url: "BackEnd/dataAccess.php",
                        dataType: "json",
                        data: {
                            access: 0,
                            data_id: dataDetails.id,
                        },
                        success: function (obj, textstatus) {
                            if (obj.data == "Update successful") {
                                $(dataDetails.ele.children[2].children[0]).attr("title", "Not Shared")
                                dataDetails.access = "Not Shared"
                                $("#btn_dataPermission").html("Share")
                                $(dataDetails.ele.children[2].children[0]).attr("src", "Images/icons/admin_page/datamanage/notshared.png")
                            }
                            if (obj.data == "No Permission") {
                                $.alert({
                                    boxWidth: "30%",
                                    useBootstrap: false,
                                    title: "Message",
                                    content: "You do not have permission to update this!",
                                });
                            }
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
}

function attachmentToggle() {
    let attachSwap = $("#btn_dataAttach").html();
    if (attachSwap == "Attach") {
        $("#btn_dataAttach").css("display", "none");
        $("#attachlayerContainer").fadeIn();
        $("#attachLayer").val(dataDetails.name);
    } else {
        saveLayerAttach();
    }
}

function saveLayerAttach() {
    let name = $("#attachLayer").val();
    let attachSwap = $("#btn_dataAttach").html();
    let defaultView = $("#setdefaultLayer")[0].checked;
    $.ajax({
        type: "POST",
        url: "BackEnd/fetchDatav3.php",
        dataType: "json",
        data: {
            functionName: "attachOrDetachLayer",
            data_id: dataDetails.id,
            val: attachSwap,
            name: name,
            defaultView: defaultView
        },
        success: function (obj, textstatus) {
            if (obj.bool === true) {
                if (attachSwap == "Attach") {
                    $("#btn_dataAttach").html("Detach");
                    $(dataDetails.ele.children[1].children[0]).attr("title", "Attached")
                    $(dataDetails.ele.children[1].children[0]).attr("src", "Images/icons/admin_page/datamanage/attached.png")
                    freq = parseInt(dataDetails.frequency)
                    freq += 1;
                    dataDetails.ele.children[8].innerText = freq;
                    $('.hiddencontainer#attachlayerContainer').css('display', 'none')
                    $('#btn_dataAttach').fadeIn()
                    $("#btn_AddToGroup").removeAttr("disabled");
                    DataPool_table();
                } else {
                    $("#btn_dataAttach").html("Attach");
                    $("#btn_AddToGroup").attr("disabled", "");
                    $(dataDetails.ele.children[1].children[0]).attr("title", "Not_Attached")
                    $(dataDetails.ele.children[1].children[0]).attr("src", "Images/icons/admin_page/datamanage/notattached.png")
                    freq = parseInt(dataDetails.frequency)
                    freq -= 1;
                    dataDetails.ele.children[8].innerText = freq
                }
                dataDetails.frequency = freq;
            }
            if (obj.data == "No Permission") {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "You do not have permission to update this!!",
                });
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        },
    });
}

function deleteData() {
    let freq = parseInt(dataDetails.frequency);
    if (freq > 0) {
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "Please make sure no project is attached to this data before deleting it",
        });
        return;
    }

    $.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Delete!",
        content: "Delete data from the server?",
        buttons: {
            confirm: function () {
                $.ajax({
                    type: "POST",
                    url: "BackEnd/DataFunctions.php",
                    dataType: "json",
                    data: {
                        functionName: "deleteGeodata", data_id: dataDetails.id,
                    },
                    success: function (obj) {
                        if (obj.bool === true) {
                            dataDetails.ele.parentNode.removeChild(dataDetails.ele);
                            $("#moveContainer").css("display", "none");
                            $(".spacer").remove();
                        } else {
                            if (obj.msg == "Insufficient privileges"){
                                $.alert({
                                    boxWidth: "30%",
                                    useBootstrap: false,
                                    title: "Message",
                                    content: "You do not have permission to delete this!",
                                });
                            }else{
                                console.error(obj.msg)
                            }
                        }
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

function submitDataUsers() {
    $("#layerinfoView").fadeIn(300);
    $("#layerUsersTable").html("");
    $.ajax({
        type: "POST",
        url: "BackEnd/viewDataUsers.php",
        dataType: "json",
        data: {
            data_id: dataDetails.id,
        },
        success: function (obj, textstatus) {
            $("#h3_fullname_layertinfo").html(obj.Data_Name);
            $("#layerinfoName").val(obj.Data_Name);
            $("#layerinfoType").val(obj.Data_Type);
            $("#layerinfoOwner").val(obj.Data_Owner);
            upload_date = new Date(obj.Added_Date.date);
            upload_date = upload_date.toDateString();
            $("#layerinfoAddeddate").val(upload_date);
            let table_D = JSON.parse(obj.table);
            for (let row of table_D) {
                $("#layerUsersTable").append(
                    "\
                <div class='row admin fourColumn searchv3'>"+
                    "<div class='columnMiddle textContainer'>" +
                        "<span class='text line-clamp'>"+ row.Layer_Name +"</span>"+
                    "</div>"+
                    "<div class='columnMiddle textContainer'>" +
                        "<span class='text line-clamp'>"+ row.Project_ID  +"</span>"+
                    "</div>"+
                    "<div class='columnMiddle textContainer'>" +
                        "<span class='text line-clamp'>"+ row.Project_Name +"</span>"+
                    "</div>"+
                    "<div class='columnMiddle textContainer'>" +
                        "<span class='text line-clamp'>"+ row.Attached_By +"</span>"+
                    "</div>"+
                "</div>\
                "
                );
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        },
    });
}

function removeDataFromCesium(myData) {
    if (viewer3.dataSources.length >= 1) {
        viewer3.dataSources.remove(myData);
    } else if (viewer3.scene.primitives.length >= 1) {
        viewer3.scene.primitives.remove(myData);
    }else if (viewer3.imageryLayers.length >= 1) {
        viewer3.imageryLayers.remove(myData);
    }
}

function OnChangeHeightAdjustPositionValues() {
    if (typeof Cesium === 'undefined') {
        return;
    }

    if ($("#heightadjustPosition").length === 0 || $("#xadjustPosition").length === 0 || $("#yadjustPosition").length === 0) {
        return; 
    }
    
    myData.readyPromise.then(function () {
        var heightOffset = parseFloat($("#heightadjustPosition").val()) || 0;
        var xAxisOffset = parseFloat($("#xadjustPosition").val()) || 0;
        var yAxisOffset = parseFloat($("#yadjustPosition").val()) || 0;

        if (isNaN(heightOffset)) {
            heightOffset = 0;
        }
        if (isNaN(xAxisOffset)) {
            xAxisOffset = 0;
        }
        if (isNaN(yAxisOffset)) {
            yAxisOffset = 0;
        }

        var boundingSphere = myData.boundingSphere;
        var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);

        var surface = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            0.0
        );

        var xInRadians = Cesium.Math.toRadians(xAxisOffset);
        var yInRadians = Cesium.Math.toRadians(yAxisOffset);

        var newLongitude = cartographic.longitude + Cesium.Math.toRadians(Cesium.Math.toRadians(Cesium.Math.toRadians(xInRadians)));
        var newLatitude = cartographic.latitude + Cesium.Math.toRadians(Cesium.Math.toRadians(Cesium.Math.toRadians(yInRadians)));
        var newHeight = heightOffset;
    
        var newPosition = Cesium.Cartesian3.fromRadians(
            newLongitude, 
            newLatitude, 
            newHeight
        );
       
        var translation = Cesium.Cartesian3.subtract(
            newPosition,
            surface,
            new Cesium.Cartesian3()
        );
        console.log(translation);
        myData.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    });
}

var weeklySchedule;

function OnClickSaveAdjustPosition() {
    var offset = $("#heightadjustPosition").val();
    var xOffset = $("#xadjustPosition").val();
    var yOffset = $("#yadjustPosition").val();
    $.ajax({
        type: "POST",
        url: "BackEnd/updateOffset.php",
        dataType: "json",
        data: {
            data_id: dataDetails.id,
            offset: offset,
            xOffset: xOffset,
            yOffset: yOffset
        },
        success: function (obj, textstatus) {
            if (obj.data == "Update successful") {
                dataDetails.offset = offset;
                dataDetails.x_offset = xOffset;
                dataDetails.y_offset = yOffset;
                dataDetails.ele.children[9].innerText = offset;
                dataDetails.ele.children[16].innerText = xOffset;
                dataDetails.ele.children[17].innerText = yOffset;
            }
            if (obj.data == "No Permission") {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "You do not have permission to update this!",
                });
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        },
    });
    $(
        "#moveContainer .buttonContainerData .hiddencontainer#adjustlayerContainer"
    ).css("display", "none");
    $("#moveContainer .buttonContainerData #btn_dataAdjustPosition").fadeIn();
}

//to be revised

function loadProjectUsers() {
    $("#main-user").css("display", "block");

    if(SYSTEM == 'OBYU'){
        ajaxUrl = 'BackEnd/ProjectFunctionsOBYU.php';
    }else{
        ajaxUrl = 'BackEnd/ProjectFunctionsV3.php';
    }

    $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: {
            functionName: "viewProjectUsers"
        },
        dataType: "json",
        success: function (response) {
            currUserList = [];
            var myhtml = "";
            mixitup ('#adminProjectUsers', config).destroy();
            for (var i = 0; i < response.project_users.length; i++) {
                let UserType;
                var visibility = (localStorage.project_owner == 'JKR_SABAH') ? 'block' : 'none';
                var userDesignation = (response.project_users[i].user_designation !== null && response.project_users[i].user_designation !== '') ? response.project_users[i].user_designation : 'N/A';
                switch (response.project_users[i].Pro_Role) {
                    case "Project Manager":
                        UserType = "Project Manager";
                        break;
                    case "Project Monitor":
                        UserType = "Project Monitor";
                        break;
                    case "Finance Officer":
                        UserType = "Finance Officer";
                        break;
                    case "QAQC Engineer":
                        UserType = "QAQC Engineer";
                        break;
                    case "Director":
                        UserType = "Director";
                        break;
                    case "Construction Engineer":
                        UserType = "Construction Engineer";
                        break;
                    case "Safety Officer":
                        UserType = "Safety Officer";
                        break;
                    case "Planning Engineer":
                        UserType = "Planning Engineer";
                        break;
                    case "Doc Controller":
                        UserType = "Doc Controller";
                        break;
                    case "Finance Head":
                        UserType = "Finance Head";
                        break;
                    case "Risk Engineer":
                        UserType = "Risk Engineer";
                        break;
                    case "Contractor PM":
                        UserType = "Contractor PM";
                        break;
                    case "Contractor Engineer":
                        UserType = "Contractor Engineer";
                        break;
                    case "Consultant CRE":
                        UserType = "Consultant CRE";
                        break;
                    case "Consultant RE":
                        UserType = "Consultant RE";
                        break;
                    case "Consultant QS":
                        UserType = "Consultant QS";
                        break;
                    case "Corporate Comm Officer":
                        UserType = "Corporate Comm Officer";
                        break;
                    case "Bumi Officer":
                        UserType = "Bumi Officer";
                        break;
                    case "Land Officer":
                        UserType = "Land Officer";
                        break;
                    case "Zone Manager":
                        UserType = "Zone Manager";
                        break;
                    case "Contractor DC":
                        UserType = "Contractor DC";
                        break;
                    case "Site Supervisor":
                        UserType = "Site Supervisor";
                        break;
                    case "HSET Officer":
                        UserType = "HSET Officer";
                        break;
                    case "Consultant DC":
                        UserType = "Consultant DC";
                        break;
                    case "Sys Consultant":
                        UserType = "Sys Consultant";
                        break;
                    case "Contractor CM":
                        UserType = "Contractor CM";
                        break;
                    case "Contractor QS":
                        UserType = "Contractor QS";
                        break;
                    case "QAQC Officer":
                        UserType = "QAQC Officer";
                        break;
                    default:
                        UserType = response.project_users[i].Pro_Role
                }

                myhtml += 
                    '<div class="row admin fiveColumn searchv3 mix" rel="" data-user-email="' + response.project_users[i].user_email + '" data-user-name="' + response.project_users[i].user_firstname + ' ' + response.project_users[i].user_lastname + '" data-user-organisation="' + response.project_users[i].user_org + '" data-user-country="' + response.project_users[i].user_country + '" data-user-role="' + UserType + '">'+
                        '<div class="columnMiddle textContainer" style="display:none"><span class="text textClamp">' + response.project_users[i].Usr_ID + '</span></div>'+
                        '<div class="columnMiddle textContainer"><span class="text textClamp">' + response.project_users[i].user_email + '</span></div>'+
                        '<div class="columnMiddle textContainer"><span class="text textClamp">' + response.project_users[i].user_firstname + ' ' + response.project_users[i].user_lastname + '</span></div>'+
                        '<div class="columnMiddle textContainer"><span class="text textClamp">' + response.project_users[i].user_org + '</span></div>'+
                        '<div class="columnMiddle textContainer"><span class="text textClamp">' + response.project_users[i].user_country + '</span></div>'+
                        '<div class="columnMiddle textContainer"><span class="text textClamp">' + UserType + ' </span></div>'+
                        '<div class="columnMiddle textContainer" style="display:'+ visibility +'"><input class="edit designation" type="text" value="'+ userDesignation +'" disabled></div>'+
                    '</div>';
                
                //append current user list into array. it will be used for user list edit designation.
                currUserList.push({
                    id: response.project_users[i].Usr_ID,
                    email: response.project_users[i].user_email,
                    designation: (response.project_users[i].user_designation !== null && response.project_users[i].user_designation !== '') ? response.project_users[i].user_designation : ''
                });
            };

            $('#adminProjectUsers').html(myhtml);
            mixitup ('#adminProjectUsers', config)

        }
    })
}

var project_start;
var project_end;
var projectlist = JSON.parse(localStorage.projectlist);

projectlist.sort((a, b) => (a.project_name.toUpperCase() > b.project_name.toUpperCase()) ? 1 : -1)
var projectlistChild = [];
var projectlistOther = [];

for (i = 0; i < projectlist.length; i++) {
    if (localStorage.p_id == projectlist[i].project_id) {
        continue; //skip this round
    }
    if (projectlist[i].project_par_id == localStorage.p_id || (localStorage.isParent && (localStorage.isParent == projectlist[i].project_id || localStorage.isParent == projectlist[i].project_par_id))) {
        projectlistChild.push(projectlist[i]);
    } else {
        projectlistOther.push(projectlist[i]);
    }
}

$("#projectslist").append(
    "<button class='activeProject'>\
    <span class='img'><img src='" + localStorage.iconurl + "'></span><span class='atag line-clamp'><a>" + localStorage.p_name + "</a></span>\
    </button>"
)
for (i = 0; i < projectlistChild.length; i++) {
    $("#projectslist").append(
        "<form action='login/postlogin_processing' method='POST'>\
        <button id='proID" + projectlistChild[i].project_id + "' value='" + projectlistChild[i].project_id + "' name ='projectid' action='submit'>\
        <span class='img'><img src='" + projectlistChild[i].icon_url + "'></span><span class='atag line-clamp'><a>" + projectlistChild[i].project_name + "</a></span></button>\
        </form>"
    )
}
for (i = 0; i < projectlistOther.length; i++) {
    $("#projectslistOther").append(
        "<form action='login/postlogin_processing' method='POST'>\
        <button id='proID" + projectlistOther[i].project_id + "' value='" + projectlistOther[i].project_id + "' name ='projectid' action='submit'>\
        <span class='img'><img src='" + projectlistOther[i].icon_url + "'></span><span class='atag line-clamp'><a>" + projectlistOther[i].project_name + "</a></span></button>\
        </form>"
    )
}

Cesium.BingMapsApi.defaultKey =
    "AgWzRGyO26urfR6O6qFMkOAvSW8TZxds6jR_yPiTvbO_Dx9t-s5sheKO0m9vL_SJ"; // For use with this application only
Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzOTg5ZWFlMS1jZGZiLTQ5OGUtYjY3Ni1mMDJmNGNmNWIwY2UiLCJpZCI6MzA1MjAzLCJpYXQiOjE3NDc5MDMzMzF9._AllgIQ2JG23BGarvbIRTv-ZNpkoDj-W0VMRlN1pTuQ";
var mapBoxAccessToken = MAPBOX_TOKEN;

var viewer3 = new Cesium.Viewer("datapreview", {
    baseLayerPicker: false,
    timeline: false,
    homeButton: false,
    animation: false,
    geocoder: false,
    fullscreenButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    infoBox: false,
    imageryProvider: new Cesium.MapboxStyleImageryProvider({
        styleId: 'satellite-v9', 
        accessToken: mapBoxAccessToken
    })
});

viewer3._cesiumWidget._creditContainer.style.display = "none";


var defaultview3 = Cesium.Rectangle.fromDegrees(93.0, -15.0, 133.0, 30.0); // S.E.A. extent
viewer3.camera.setView({
    destination: defaultview3,
});

Cesium.Camera.DEFAULT_VIEW_RECTANGLE = defaultview3;
Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

function getConfigDetails() {
    /* $.get(
           "https://wsg.reveronconsulting.com/ws/v2.5/Repositories",
           function(data) {
               for (var i = 0; i < data.length; i++) {
                   console.log(data[i].id);
               }
           },
           "json"
       );*/
    $.ajax({
        type: "POST",
        url: 'BackEnd/getConfigDetailsPWPBi.php',
        dataType: 'json',
        data: {
            functionName: "getConfigDetails"
        },
        success: function (obj, textstatus) {
            var mydata = obj['data'];
            for (var i = 0; i < mydata.length; i++) {
                if (mydata[i].type == "PW") {
                    var myurl = mydata[i].url;
                    var n = myurl.indexOf("v2.5");
                    myurl = myurl.substr(0, n);
                    $('#pwusernamedisplay').html(mydata[i].userName);
                    $('#pwurldisplay').html(mydata[i].url);
                    $('#pwUserName').val(mydata[i].userName);
                    $('#pwURL').val(myurl);



                } else if (mydata[i].type == "PBI") {
                    $('#powerbiurl').html(mydata[i].url);
                    $('#powerbiusernamedisplay').html(mydata[i].userName);
                    $('#pBiURL').val(mydata[i].url);
                    $('#powerbiUserName').val(mydata[i].userName);
                }
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        },
    });
}

function OnclickGetDatasource() {
    var url = $("#pwURL").val();
    var pos = url.indexOf(":");
    var str = url.substr(0, pos);
    if (str !== "https") {
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "The ProjectWise URL is not SSL certified. Please check.",
        });
        return;
    }

    $("div.loadingcontainer-mainadmin").css("display", "block");
    $("#loadingText").text("Getting PW datasources");
    $.ajax({
        type: "POST",
        url: "BackEnd/getRepositoryList.php",
        dataType: "json",
        data: {
            url: url,
        },
        success: function (obj, textstatus) {
            if (obj) {
                var list = obj["instances"];
                var selectList = document.getElementById("pwRepositoryList");
                selectList.id = "pwRepositoryList";
                for (var i = 0; i < list.length; i++) {
                    var myoption = document.createElement("option");
                    myoption.value = list[i].instanceId;
                    myoption.text = list[i].properties.DisplayLabel;
                    selectList.appendChild(myoption);
                }
                $("#pwUserName").val("");
                $("#pwPassword").val("");
                $(".pwurlContainer .column1").css("width", "calc(50% - 5px)");
                $(".pwurlContainer .column1").css("margin-right", "5px");
                $(".pwurlContainer .column2").css("width", "calc(50% - 5px)");
                $(".pwurlContainer .column2 .hideonclick").css("display", "none");
                $(".pwurlContainer .column2 .hideoncancel").css(
                    "display",
                    "inline-block"
                );
                $(".pwfilesPage.edit .hideoninitial").css("display", "inline-block");
                $("div.loadingcontainer-mainadmin").css("display", "none");
                $(".loader").css("animation-duration", "1000ms");
            } else {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Error getting the DataSources with the given url. Please check the url.",
                });
                $("div.loadingcontainer-mainadmin").css("display", "none");
                $(".loader").css("animation-duration", "1000ms");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Error getting the DataSources. Please try again.",
            });

            $("div.loadingcontainer-mainadmin").css("display", "none");
            $(".loader").css("animation-duration", "1000ms");
        },
    });
}

function OnclickCancelDatasource() {
    $(".pwurlContainer .column1").css("width", "90%");
    $(".pwurlContainer .column1").css("margin-right", "0px");
    $(".pwurlContainer .column2").css("width", "calc(10% - 5px)");
    $(".pwurlContainer .column2 .hideonclick").css("display", "inline-block");
    $(".pwurlContainer .column2 .hideoncancel").css("display", "none");
    $(".pwfilesPage.edit .hideoninitial").css("display", "none");
    $("div.loadingcontainer-mainadmin").css("display", "none");
    $(".loader").css("animation-duration", "1000ms");
}

function OnClickPWDetailsSave() {
    var name = $("#pwUserName").val();
    var pswd = $("#pwPassword").val();
    var url = $("#pwURL").val();
    var repo = $("#pwRepositoryList :selected").val();
    url += "v2.5/Repositories/" + repo + "/";

    if (name == "" || pswd == "" || url == "") {
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "Please give username , password and URL for the Project Wise database to Save.",
        });
        return;
    }

    $("div.loadingcontainer-mainadmin").css("display", "block");
    $("#loadingText").text("Saving and checking the PW config details");
    $.ajax({
        type: "POST",
        url: "BackEnd/saveConfigDetailsPW.php",
        dataType: "json",
        data: {
            username: name,
            password: pswd,
            URL: url,
        },
        success: function (obj, textstatus) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: obj["msg"],
            });
            $("#pwusernamedisplay").html(name);
            $("#pwurldisplay").html(url);
            $("#pwUserName").val(name);

            var n = url.indexOf("v2.5");
            var myurl = url.substr(0, n);
            $("#pwURL").val(myurl);
            $(".pwfilesPage.readonly").css("display", "block");
            $(".pwfilesPage.edit").css("display", "none");
            $("#main-projectwise .headerButton .readonly").css(
                "display",
                "inline-block"
            );
            $("#main-projectwise .headerButton .edit").css("display", "none");
            $("div.loadingcontainer-mainadmin").css("display", "none");
            $(".loader").css("animation-duration", "1000ms");
            return;
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(textStatus);
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Error occured in saving and testing the details! Please try again.",
            });
            $("div.loadingcontainer-mainadmin").css("display", "none");
            $(".loader").css("animation-duration", "1000ms");
        },
    });
}

function OnClickPWDetailsClear() {
    $.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Confirm!",
        content: "Are you sure you want to clear the ProjectWise Config details for this project?",
        buttons: {
            confirm: function () {
                $.ajax({
                    type: "POST",
                    url: "BackEnd/deletePWConfigDetails.php",
                    dataType: "json",
                    success: function (obj, textstatus) {
                        $.alert({
                            boxWidth: "30%",
                            useBootstrap: false,
                            title: "Message",
                            content: obj["msg"],
                        });
                        $("#pwusernamedisplay").html("username here");
                        $("#pwurldisplay").html("url here");
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        var str = textStatus + " " + errorThrown;
                        console.log(str);
                        $.alert({
                            boxWidth: "30%",
                            useBootstrap: false,
                            title: "Message",
                            content: "Unable to clear the ProjectWise Config details due to SQL error!",
                        });
                    },
                });
            },
            cancel: function () {
                return;
            },
        },
    });
}

function OnClickPowerBiDetailsSave() {
    var url = $("#pBiURL").val();
    let username = $('#powerbiUserName').val();
    let pwd = $('#powerbiPassword').val();
    if (url == "" || username == "" || pwd == "") {
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: 'Message',
            content: "Please give  URL and credentials for the Power Bi dashboard to Save."
        });
        return;
    }
    $.ajax({
        type: "POST",
        url: "BackEnd/saveConfigDetailsPBi.php",
        dataType: "json",
        data: {
            URL: url,
            userName: username,
            password: pwd
        },
        success: function (obj, textstatus) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: obj["msg"],
            });
            $('#powerbiurl').html(url);
            $('#pBiURL').val(url);
            $('#powerbiusernamedisplay').html(username);
            $('#powerbiusernamedisplay').val(username);
            $('.powerbiPage.readonly').css('display', 'block')
            $('.powerbiPage.edit').css('display', 'none')
            $('#main-powerbi .headerButton .readonly').css('display', 'inline-block')
            $('#main-powerbi .headerButton .edit').css('display', 'none')
            return;
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        },
    });
}

function OnClickProjectWise365DetailsSave() {
    //#webserviceID
    var url = $('#p365URL').val();
    if (url == "") {
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: "Please give  URL for the ProjectWise 365 dashboard to Save."
        });
        return;
    };
    $.ajax({
        type: "POST",
        url: 'BackEnd/saveConfigDetailsP365.php',
        dataType: 'json',
        data: {
            URL: url
        },
        success: function (obj, textstatus) {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: obj['msg']
            });
            $('#projectwise365url').html(url);
            $('#p365URL').val(url);
            $('.projectwise365Page.readonly').css('display', 'block')
            $('.projectwise365Page.edit').css('display', 'none')
            $('#main-projectwise365 .headerButton .readonly').css('display', 'inline-block')
            $('#main-projectwise365 .headerButton .edit').css('display', 'none')
            return;
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    });

}

$('#flyToData').click(function () {
    if(dataDetails.type == "SHP"){
        wmsFlyTo(dataDetails.url)
    }else {
        viewer3.flyTo(myData, {
            duration: 1,
        });
    }
});

var layerPreviewBrightness = 1;
var imageryLayers = viewer3.imageryLayers;
var layer = imageryLayers.get(0);

$("#adjustBrightness").click(function () {
    let max = "Images/icons/admin_page/layer_preview/sun_max.png";
    let min = "Images/icons/admin_page/layer_preview/sun_min.png";
    let half = "Images/icons/admin_page/layer_preview/sun_mid.png";

    let buttonImg = this.children[0];

    switch (layerPreviewBrightness) {
        case 1: //max
            layer.brightness = 0.6;
            layerPreviewBrightness = 2;
            $(buttonImg).attr("src", half);
            break;
        case 2:
            layer.brightness = 0.2;
            layerPreviewBrightness = 3;
            $(buttonImg).attr("src", min);
            break;
        case 3:
            layer.brightness = 1;
            layerPreviewBrightness = 1;
            $(buttonImg).attr("src", max);
            break;
    }
});

$("#switchTerrainMode").on("click", function () {
    if (terrainEnabled) {
        viewer3.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        terrainEnabled = false;
    } else {
        viewer3.terrainProvider = new Cesium.CesiumTerrainProvider({
			url: "https://api.maptiler.com/tiles/terrain-quantized-mesh-v2/?key="+mapTilerAccessToken,
			credit: new Cesium.Credit(
				'<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> ' +
				'<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>'
			),
			requestVertexNormals: true
		});
        terrainEnabled = true;
    }
})

// $("#switchBaseMaps").click(function(){
//     switch($(this).val()){
//         case "0": //is default, switch to Sat with labels
//             viewer3.imageryLayers.addImageryProvider(
//                 new Cesium.IonImageryProvider({ assetId: 3 })
//             );
//             $(this).val(1)
//             break
//         case "1": //is sat with labels, switch to OSM
//             viewer3.imageryLayers.addImageryProvider(
//                 new Cesium.createOpenStreetMapImageryProvider ({	//new OpenStreetMapProvider in cesium >1.62
//                     url : 'https://a.tile.openstreetmap.org/'
//                 })
//             )
//             $(this).val(2)
//             break;
//         case "2": //is OSM, switch to default
//             viewer3.imageryLayers.addImageryProvider(
//                 new Cesium.IonImageryProvider({ assetId: 2 })
//             );
//             $(this).val(0)
//             break;
//         }
// })

$("#btn_AddToGroup").click(function () {
    $("#editGroupLyrBtn").val("0")
    $('#moveContainer .buttonContainerData #btn_AddToGroup').css('display', 'none')
    $('.buttonContainerData .hiddencontainer#addToGroup').fadeIn()
    $('.buttonContainerData .hiddencontainer #saveGroupLyrBtn').text('Save')
    $('#hiddencontainer2').css('display', 'none')
    $('#hiddencontainer3').css('display', 'none')
    $('#hiddencontainer4').css('display', 'none')
    $('#hiddencontainer5').css('display', 'none')

    $('#groupLayerSelect option').removeAttr('selected')

    if (dataDetails.groupID == "null") {
        $('#groupLayerSelect').prop('selectedIndex', 0);
        return
    }
    $('#groupLayerSelect option[value="' + dataDetails.groupID + '"]').attr("selected", "selected");
    $("#newGroupName").val("")
    $("#newLayerName").val("")
    // $('#groupSubLayerSelect').prop("selectedIndex", 0)
})

$("#groupLayerSelect").on('change', function () {
    var flagVal = $("#groupLayerSelect option:selected").data('flag')
    var flagSubVal = $("#groupSubLayerSelect option:selected").data('flag')

    // if add new group is selected
    if ($(this).val() == "newLayerGroup") {
        $('#hiddencontainer2').css('display', 'block')
        $('#hiddencontainer3').css('display', 'none')
        $('#hiddencontainer4').css('display', 'none')
        $('.buttonContainerData .hiddencontainer #editGroupLyrBtn').css('display', 'none')
        $('.buttonContainerData .hiddencontainer #saveGroupLyrBtn').css('display', 'inline')
    }else if($(this).val() == "mergeLayer" || flagVal == '1'){
        $('#hiddencontainer2').css('display', 'none')

        if(flagVal == '1'){
            $('#hiddencontainer4').css('display', 'block')
            $('#groupSubLayerSelect').prop("selectedIndex", 0)
        }else{
            $('#hiddencontainer3').css('display', 'none')
            $("#newLayerName").val("")
        }
    } else {
        $('#hiddencontainer2').css('display', 'none')
        $('#hiddencontainer4').css('display', 'block')

        if($("#groupSubLayerSelect option:selected").val() == "mergeSubLayer" || flagSubVal == '1'){
            $('#hiddencontainer3').css('display', 'none')
            $('#hiddencontainer5').css('display', 'block')
        }else{
            $('#hiddencontainer3').css('display', 'none')
            $('#hiddencontainer5').css('display', 'none')
        }

        $('.buttonContainerData .hiddencontainer #editGroupLyrBtn').css('display', 'inline')
    }

    retrieveSubGroupOpt()
})

$("#groupSubLayerSelect").on('change', function () {
    var flagVal = $("#groupSubLayerSelect option:selected").data('flag')

    if($(this).val() == "mergeSubLayer"){
        $('#hiddencontainer5').css('display', 'block')
        $('#hiddencontainer3').css('display', 'none')
        $("#newLayerName").val("")
    } else {
        $('#hiddencontainer2').css('display', 'none')
        $('#hiddencontainer3').css('display', 'none')
        $('#hiddencontainer4').css('display', 'block')
        $('#hiddencontainer5').css('display', 'none')
        $('.buttonContainerData .hiddencontainer #editGroupLyrBtn').css('display', 'inline')
    }
    
})

$("#groupLayerName").on('change', function () {
    // if add new layer is selected
    if ($(this).val() == "createLayerName") {
        $('#hiddencontainer4').css('display', 'block')
    } else {
        $('#hiddencontainer4').css('display', 'none')
    }
})

function OnClickRemoveLayerGroup(ele) {
    var prevtdLayer = $(ele).parent().parent().parent().prev();
    var layerId = $(prevtdLayer).find('div:eq(12) span').text();

    var message = "Are you sure you want to remove group layer? ";
    $.confirm({
        boxWidth: "30%",
        useBootstrap: false,
        title: "Confirm!",
        content: message,
        buttons: {
            confirm: function () {
                data = {
                    functionName: "removeLayerGroup",
                    layerId: layerId,
                }
                $.ajax({
                    type: "POST",
                    url: "BackEnd/DataFunctions.php",
                    dataType: "json",
                    data: data,
                    success: function (obj, textstatus) {
                        if (obj.bool === true) {
                            $.alert({
                                boxWidth: '30%',
                                useBootstrap: false,
                                title: 'Success',
                                content: 'Group layer is remove successfully',
                            });
                            if(SYSTEM == 'KKR'){
                                $("#groupLayerSelect").val("");
                            }
                            else{
                                $('#groupLayerSelect').prop('selectedIndex', 0);
                                DataPool_table();
                            }
                        }
                        else{
                            $.alert({
                                boxWidth: '30%',
                                useBootstrap: false,
                                title: 'Message',
                                content: 'Update failed! Please try again',
                            });
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        var str = textStatus + " " + errorThrown;
                        console.log(str);
                        $.alert({
                            boxWidth: "30%",
                            useBootstrap: false,
                            title: "Message",
                            content: "Unable to remove group layer",
                        });
                    },
                });
            },
            cancel: function () {
                return;
            },
        },
    });
}

function OnClickEditLayerGroup(ele) {
    //show relevant fields
    //$('.buttonContainerData .hiddencontainer#addToGroup').css('display', 'none')
    $('.buttonContainerData .hiddencontainer #editGroupLyrBtn').css('display', 'none')
    $('.buttonContainerData .hiddencontainer #saveGroupLyrBtn').css('display', 'inline')
    $('.buttonContainerData .hiddencontainer #saveGroupLyrBtn').text('Save')
    $('#hiddencontainer2').css('display', 'block')
    $('#hiddencontainer3').css('display', 'none')
    $('#hiddencontainer4').css('display', 'none')
    //fill in fields
    $("#newGroupName").val($("#groupLayerSelect option:selected").text())
    var defaultValue = $("#groupLayerSelect option:selected").attr("data")
    if (defaultValue == 0) {
        $("#newGroupCheck").prop('checked', false)
    } else {
        $("#newGroupCheck").prop('checked', true)
    }
    $(ele).val("1")
}

newGroupName = document.getElementById('newGroupName')
newGroupName.oninput = updatevalue;

function updatevalue(e) {
    $("#newLayerGroup").text(e.target.value)
}

function OnClickSaveLayerGroup() {
    var data
    if ($("#groupLayerSelect").val() == "newLayerGroup") { //New group 
        if ($("#newGroupName").val() == "" || $("#newGroupName").val() == "&lt;Add a new group&gt;") {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: "Please enter a valid name"
            });
            return
        }
        data = {
            functionName: "saveLayerGroup",
            layerID: dataDetails.layerID,
            groupName: $("#newGroupName").val(),
            defaultDisplay: $("#newGroupCheck").prop("checked"),
            typeFunc: "newGroup"
        }
    } 
    else if ($("#groupLayerSelect").val() == "mergeLayer"){
        if ($("#newLayerName").val() == "" || $("#newLayerName").val() == "&lt;Add a new layer name&gt;") {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: "Please enter layer name"
            });
            return
        }

        if ($("#newSubGroupName").val() == "" || $("#newSubGroupName").val() == "&lt;Add a new sub group name&gt;") {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: "Please enter sub group name"
            });
            return
        }

        if ($("#groupSubLayerSelect").val() == "mergeSubLayer"){

            data = {
                functionName: "saveSubLayerGroup",
                layerID: dataDetails.layerID,
                subGroupName: $("#newSubGroupName").val() ? $("#newSubGroupName").val() : '',
                layerTitle: $("#newLayerName").val() ? $("#newLayerName").val() : '',
                groupID: $("#groupLayerSelect option:selected").val() ? $("#groupLayerSelect option:selected").val() : ''
            }

        }else{
            data = {
                functionName: "saveLayerGroup",
                layerID: dataDetails.layerID,
                groupID: $("#groupLayerSelect").val(),
                groupName: $("#newSubGroupName").val(),
                layerTitle: $("#newLayerName").val(),
                defaultDisplay: $("#newGroupCheck").prop("checked"),
                typeFunc: "newGrpStud"
            }
        }

        
    }
    else {
        if ($("#editGroupLyrBtn").val() == "1") { //edit details?
            if ($("#newGroupName").val() == "" || $("#newGroupName").val() == "&lt;Add a new group&gt;") {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: "Please enter a valid name"
                });
                return
            }
            data = {
                functionName: "saveLayerGroup",
                layerID: dataDetails.layerID,
                groupName: $("#newGroupName").val(),
                defaultDisplay: $("#newGroupCheck").prop("checked"),
                groupID: $("#groupLayerSelect").val()
            }
        } else {

            if ($("#groupSubLayerSelect option:selected").val() == "mergeSubLayer"){

                data = {
                    functionName: "saveSubLayerGroup",
                    layerID: dataDetails.layerID ? dataDetails.layerID : '',
                    subGroupName: $("#newSubGroupName").val() ? $("#newSubGroupName").val() : '',
                    layerTitle: $("#newSubGroupName").val() ? $("#newSubGroupName").val() : '',
                    groupID: $("#groupLayerSelect option:selected").val() ? $("#groupLayerSelect option:selected").val() : '',
                    typeFunc: ""
                }

            }else if ($("#groupSubLayerSelect option:selected").val() == "default"){
                data = {
                    functionName: "saveLayerGroup",
                    layerID: dataDetails.layerID,
                    groupName: $("#newGroupName").val(),
                    defaultDisplay: $("#newGroupCheck").prop("checked"),
                    groupID: $("#groupLayerSelect").val()
                }

            }else{
                data = {
                            functionName: "saveSubLayerGroup",
                            layerID: dataDetails.layerID ? dataDetails.layerID : '',
                            layerTitle: $("#newSubGroupName").val() ? $("#newSubGroupName").val() : '',
                            groupID: $("#groupLayerSelect option:selected").val(),
                            subGroupID: $("#groupSubLayerSelect option:selected").val(),
                            typeFunc: "addLayer"
                        }
            }

        }
    }
    //save to database and check if name exist
    $.ajax({
        type: "POST",
        url: 'BackEnd/DataFunctions.php',
        dataType: 'json',
        data: data,
        success: function (obj) {
            if(obj.bool === true){
                DataPool_table();
            }
            else{
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: obj.msg
                });
                return
            }
            //edit details, no need to append
            if ($("#editGroupLyrBtn").val() == "1") {
                $("#groupLayerSelect option:selected").text($("#newGroupName").val())
                if (data.defaultDisplay == false) {
                    $("#groupLayerSelect option:selected").attr("data", "0")
                } else {
                    $("#groupLayerSelect option:selected").attr("data", "1")
                }

                //reset value
                $("#editGroupLyrBtn").val("0")
                $("#newGroupCheck").removeAttr('checked')
                $("#newLayerGroup").text("<Add a new group>")
                $("#canceladdgroup").trigger("click")
                $(dataDetails.ele.children[11]).text(data.groupID)
                dataDetails.groupID = data.groupID
                return;
            } 
            else if ($("#newGroupName").val() == "") { //add record only
                $(dataDetails.ele.children[11]).text(data.groupID)
                dataDetails.groupID = data.groupID
                $("#canceladdgroup").trigger("click")
                return;
            }

            //reset value and append new option
            $("#newGroupCheck").removeAttr('checked')
            $("#newLayerGroup").text("<Add a new group>")
            if (data.defaultDisplay == false) {
                $('#groupLayerSelect').append("<option data='0' value='" + obj.savedGroupID + "'>" + $("#newGroupName").val() + "</option>")
            } else {
                $('#groupLayerSelect').append("<option data='1' value='" + obj.savedGroupID + "'>" + $("#newGroupName").val() + "</option>")
            }
            $(dataDetails.ele.children[11]).text(obj.savedGroupID)
            dataDetails.groupID = obj.savedGroupID
            $("#newGroupName").val("")
            $("#newLayerName").val("")
            $('#groupSubLayerSelect').prop("selectedIndex", 0)

            // selectLastIndex = $('#groupLayerSelect option').length
            // $('#groupLayerSelect').prop('selectedIndex',0);
            $("#canceladdgroup").trigger("click")
            return;
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
}

function onChangeUpdateLineWidth() {
    kml = myData.entities.values;
    kml.forEach(function (entity) {
        if (entity._polyline !== undefined) {
            entity._polyline.width = parseFloat($("#kmlWidthVal").val());
        }
    });
}

function parseKMLStyle() {
    if(dataDetails.type === "SHP"){
        $("#shpStylingDiv").show();
        $("#KmlStylingDiv").show();
        $("#shpStyleSelect").val(dataDetails.Style)
        return
    }
    else{
        $("#shpStylingDiv").hide();
    }
    
    $.ajax({
        url: "BackEnd/parseKmlFile.php",
        data: {
            url: dataDetails.url,
        },
        type: "POST",
        dataType: "json",
        success: function (obj) {
            clearStyleInput();
            $("#KmlStylingDiv").show();
            if (obj.error) {
                switch (obj.error) {
                    case "KML namespace unavailable":
                        console.log(
                            "This KML file contains non-standard structure: No Namespace found"
                        );
                        break;
                    case "No style tag found":
                        console.log("No style tag found!");
                        break;
                }
            }

            dataDetails.kmlObj = obj;
            if (obj.pointType) {
                $("#IconStyleDiv").css("display", "");
                if (obj.pointStyle.PointHref) {
                    $("#IconImage-kml").show();
                    $("#IconImage-kml").attr("src", obj.pointStyle.PointHref);
                    $(
                        "#IconStyleHref option[value='" + obj.pointStyle.PointHref + "']"
                    ).prop("selected", true);
                }
                else if (!obj.pointStyle.PointHref || !obj.pointStyle.PointColor || obj.pointStyle.PointColor === null || obj.pointStyle.PointColor == "") {
                    $("#IconImage-kml").hide(); 
                    $("#IconColorVal").val("");
                }
                else{
                    $("#IconStyleBoolean").prop("checked", true);
                    $("#IconInnerDiv").show();
                    $("#IconColorVal").val(obj.pointStyle.PointColor.toUpperCase());
                    $("#IconColorVal").css(
                        "background-color",
                        "#" + obj.pointStyle.PointColor
                    );
                    if (obj.pointStyle.PointOpacity == "") {
                        $("#IconOpacityVal").val(100);
                    } else {
                        $("#IconOpacityVal").val(Math.round(obj.pointStyle.PointOpacity));
                    }
                }
                //obj.pointStyle.PointColorMode
                //obj.pointStyle.MultilpleStyles
                //obj.pointStyle.PointScale
                // obj.pointStyle.PointStyleId
            }

            if (obj.hasOwnProperty("lineType")) {
                $("#LineStyleDiv").css("display", "");
                if (obj.lineStyle.LineColor) {
                    $("#LineColorVal").val(obj.lineStyle.LineColor.toUpperCase());
                    $("#LineColorVal").css(
                        "background-color",
                        "#" + obj.lineStyle.LineColor
                    );
                } else if (obj.lineStyle.MultilpleStyles) {
                    $("#LineColorVal").val("Multiple values found");
                } else {
                    $("#LineColorVal").val("N/A"); //fffff?
                }
                if (!obj.lineStyle.LineWidth) {
                    $("#LineWidthVal").val(1);
                } else {
                    $("#LineWidthVal").val(Math.round(obj.lineStyle.LineWidth));
                }
                //obj.lineStyle.LineColorMode
                //obj.lineStyle.LineStyleId
                //obj.lineStyle.MultilpleStyles
            }

            if (obj.hasOwnProperty("polygonType")) {
                $("#PolyStyleDiv").css("display", "");
                if (obj.polygonStyle.PolygonFill == "0") {
                    $("#PolygonFillBoolean").prop("checked", false);
                    $("#PolygonFillDiv").css("display", "none");
                } else {
                    $("#PolygonFillDiv").show();
                    $("#PolygonFillBoolean").prop("checked", true);
                }
                if (obj.polygonStyle.PolygonColor) {
                    $("#PolygonColorVal").val(
                        obj.polygonStyle.PolygonColor.toUpperCase()
                    );
                    $("#PolygonColorVal").css(
                        "background-color",
                        "#" + obj.polygonStyle.PolygonColor
                    );
                } else if (obj.polygonStyle.MultilpleStyles) {
                    $("#PolygonColorVal").val("Multiple values found");
                } else {
                    $("#PolygonColorVal").val("N/A");
                }
                if (obj.polygonStyle.PolygonOpacity) {
                    $("#PolygonOpacityVal").val(
                        Math.round(obj.polygonStyle.PolygonOpacity)
                    );
                } else {
                    $("#PolygonOpacityVal").val(100);
                }

                if (obj.polygonStyle.PolygonOutl == "0") {
                    $("#OutlineBoolean").prop("checked", false);
                    $("#OutlineDiv").hide();
                } else {
                    $("#OutlineBoolean").prop("checked", true);
                    $("#OutlineDiv").show();
                }

                if (
                    !obj.polygonStyle.PolygonOutlColor ||
                    obj.polygonStyle.PolygonOutlColor == ""
                ) {
                    $("#OutlineColorVal").val("N/A");
                } else {
                    $("#OutlineColorVal").val(
                        obj.polygonStyle.PolygonOutlColor.toUpperCase()
                    );
                    $("#OutlineColorVal").css(
                        "background-color",
                        "#" + obj.polygonStyle.PolygonOutlColor
                    );
                }
            }
            $("#KmlStylingDiv button").show();
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Error",
                content: "Unsupported KML file format for styling",
            });
            $('#cancelKmlStyle').trigger('click');
            return;
        },
    });
}

//removed as this isnt supported in geoserver and dionnald want to standardize both
// function UpdateIconStyle(ele) {
//     iconStyleChecked = $(ele).prop("checked"); //boolean
//     if (iconStyleChecked) {
//         $("#IconInnerDiv").show();
//         if (dataDetails.kmlObj.pointStyle.PointColor == "") {
//             $("#IconColorVal").val("N/A");
//         } else {
//             $("#IconColorVal").val(
//                 dataDetails.kmlObj.pointStyle.PointColor.toUpperCase()
//             );
//             $("#IconColorVal").css(
//                 "background-color",
//                 "#" + dataDetails.kmlObj.pointStyle.PointColor
//             );
//         }
//         if (dataDetails.kmlObj.pointStyle.PointOpacity == "") {
//             $("#IconOpacityVal").val("N/A");
//         } else {
//             $("#IconOpacityVal").val(dataDetails.kmlObj.pointStyle.PointOpacity);
//         }
//     } else {
//         if (dataDetails.tiles !== null) {
//             dataDetails.tiles.values.forEach(function (entity) {
//                 if (entity.billboard) {
//                     entity.billboard.color = undefined;
//                 }
//             });
//         }
//         $("#IconInnerDiv").hide();
//         $("#IconColorVal").val("");
//         $("#IconOpacityVal").val("");
//     }
// }

function UpdateIconHref() {
    if (dataDetails.tiles !== null && !shapefileStyling) {
        dataDetails.tiles.values.forEach(function (entity) {
            if (entity.billboard) {
                entity.billboard.image = $("#IconStyleHref").val();
                $("#IconImage-kml").show();
                $("#IconImage-kml").attr("src", $("#IconStyleHref").val());
            }
        });
    }
    else if (shapefileStyling){
        $("#IconImage-kml").show();
    }
}

function UpdateLineColor() {
    newColorRaw = $("#LineColorVal").css("backgroundColor");
    newColor = newColorRaw.slice(4, newColorRaw.length - 1); //left r,g,b
    newColorWithOpac = "rgba(" + newColor + ", 1)";
    lineWidth = parseInt($("#LineWidthVal").val());
    if (dataDetails.tiles !== null && !shapefileStyling) {
        dataDetails.tiles.values.forEach(function (entity) {
            if (entity.polyline) {
                entity.polyline.material = new Cesium.ColorMaterialProperty(
                    Cesium.Color.fromCssColorString(newColorWithOpac)
                );
                entity.polyline.width = lineWidth;
            }
        });
    }
}

function UpdateFillBoolean(ele) {
    fillChecked = $(ele).prop("checked"); //boolean
    if (fillChecked) {
        $("#PolygonFillDiv").show();
        if (dataDetails.tiles !== null && !shapefileStyling) {
            dataDetails.tiles.values.forEach(function (entity) {
                if (entity.polygon) {
                    entity.polygon.fill = true;
                }
            });
        }
    } else {
        $("#PolygonFillDiv").hide();
        if (dataDetails.tiles !== null && !shapefileStyling) {
            dataDetails.tiles.values.forEach(function (entity) {
                if (entity.polygon) {
                    entity.polygon.fill = false;
                }
            });
        }
    }
}

function UpdateOutlineBoolean(ele) {
    outlineChecked = $(ele).prop("checked"); //boolean
    if (outlineChecked) {
        $("#OutlineDiv").show();
        if (dataDetails.tiles !== null && !shapefileStyling) {
            dataDetails.tiles.values.forEach(function (entity) {
                if (entity.polygon) {
                    entity.polygon.outline = true;
                }
            });
        }
    } else {
        $("#OutlineDiv").hide();
        if (dataDetails.tiles !== null && !shapefileStyling) {
            dataDetails.tiles.values.forEach(function (entity) {
                if (entity.polygon) {
                    entity.polygon.outline = false;
                }
            });
        }
    }
}

function UpdatePolygonColor() {
    //polygon and outline
    polygonOpac = $("#PolygonOpacityVal").val() / 100;
    polygonColorRaw = $("#PolygonColorVal").css("backgroundColor");
    polygonColor = polygonColorRaw.slice(4, polygonColorRaw.length - 1); //left r,g,b
    polygonColorWithOpac = "rgba(" + polygonColor + "," + polygonOpac + ")";
    if (dataDetails.tiles !== null && !shapefileStyling) {
        dataDetails.tiles.values.forEach(function (entity) {
            if (entity.polygon) {
                entity.polygon.material = new Cesium.ColorMaterialProperty(
                    Cesium.Color.fromCssColorString(polygonColorWithOpac)
                );
            }
        });
    }
}

function UpdatePolygonOutline() {
    outlineColorRaw = $("#OutlineColorVal").css("backgroundColor");
    outlineWidth = parseInt($("#OutlineWidth").val());
    outlineColor = outlineColorRaw.slice(4, outlineColorRaw.length - 1); //left r,g,b
    outlineColor = "rgb(" + outlineColor + ")";
    if (dataDetails.tiles !== null && !shapefileStyling) {
        dataDetails.tiles.values.forEach(function (entity) {
            if (entity.polygon) {
                entity.polygon.outline = true;
                entity.polygon.outlineWidth = 1;
                entity.polygon.outlineColor = Cesium.Color.fromCssColorString(
                    outlineColor
                );
            }
        });
    }
}

function clearStyleInput() {
    $(".buttonContainerData .hiddencontainer#KmlStylingDiv").hide();
    $("#IconImage-kml").attr("src", "");
    $("#IconStyleHref").val("");
    $("#IconStyleBoolean").val(false);
    $("#IconColorVal").val("");
    $("#IconColorVal").css("background-color", "");
    $("#IconOpacityVal").val("");
    $("#IconStyleDiv").hide();

    $("#LineColorVal").val("");
    $("#LineColorVal").css("background-color", "");
    $("#LineWidthVal").val("");
    $("#LineStyleDiv").hide();

    $("#PolygonFillBoolean").val(false);
    $("#PolygonColorVal").val("");
    $("#PolygonColorVal").css("background-color", "");
    $("#PolygonOpacityVal").val("");
    $("#OutlineBoolean").val(false);
    $("#OutlineColorVal").val("");
    $("#OutlineColorVal").css("background-color", "");
    $("#PolyStyleDiv").hide();
}

function submitShapeStyle(data_id){
    //check for style name first against geoserver 

    if($("#shpStyleSelect :selected").val() !== "addShpStyle" && !shapefileEditFlag){ //attach style only
        var styleName = $("#shpStyleSelect :selected").val()
        //attach to data
        $.ajax({
            url: "BackEnd/DataFunctions.php",
            dataType: "JSON",
            type: "POST",
            data: {
                functionName: "attachShpStyle",
                data_id: data_id,
                styleName: styleName
            },
            success: (obj)=>{
                dataDetails.Style = styleName
                dataDetails.ele.children[14].innerText = styleName;
                shpClearForm()
                $("#btn_dataStyling").show();
            }
        })
        return;
    }
    //add new style
    var styleName = $("#shpStyleName").val()
    if(styleName === ""){
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Empty Field ",
            content: "Please fill in style name",
        });
        console.error("Please fill in style name")
        return
    }

    var data = {
        functionName: "createSLDFile",
        data_id: data_id,
        styleName: styleName
    }

    if($("#shpStylePointChk").prop("checked")){
        var iconImgStyle = $("#IconStyleHref").val();
        if(!iconImgStyle){
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Empty Field ",
                content: "Please choose icon style",
            });
            console.error("Please choose icon style")
            return
        }
        data.point = {
            url: $("#IconStyleHref").val(),
        }
    }
    if($("#shpStyleLineChk").prop("checked")){
        var lineColor = testHexColor($("#LineColorVal").val());
        if(!lineColor){
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Wrong Field ",
                content: "HEX value is incorrect. Please fill in again",
            });
            console.error("Hex value for color isn't right. Please try again.")
            return
        }
        data.line = {
            color: lineColor,
            width: $("#LineWidthVal").val()
        }
    }
    if($("#shpStylePolygonChk").prop("checked")){
        if(!$("#PolygonFillBoolean").prop("checked") && !$("#OutlineBoolean").prop("checked")){
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Wrong Field ",
                content: "HEX value is incorrect. Please fill in again",
            });
            console.error("Hex value for color isn't right. Please try again.")
            return
        }
        data.polygon = {}
        if($("#PolygonFillBoolean").prop("checked")){
            var polygonColor = testHexColor($("#PolygonColorVal").val());
            data.polygon = {
                fillColor: polygonColor,
                fillOpacity: $("#PolygonOpacityVal").val()
            }
        }
        if($("#OutlineBoolean").prop("checked")){
            var outlineColor = testHexColor($("#OutlineColorVal").val());
            data.polygon.outlineColor = outlineColor
        }
    }

    if(shapefileEditFlag){
        data.editFlag = true
    }

    if(!$("#shpStylePointChk").prop("checked") && !$("#shpStyleLineChk").prop("checked") && !$("#shpStylePolygonChk").prop("checked")){
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Empty Field ",
            content: "Please fill in feature style",
        });
        console.error("No feature style is set")
        return
    }

    $("#loadingContainer_Shp").fadeIn();
    $("#loadingContainer_Shp").css("z-index", "11");

    $.ajax({
        url: "BackEnd/DataFunctions.php",
        dataType: "JSON",
        type: "POST",
        data: data,
        success: (obj)=>{
            if (obj.bool=== true){
                dataDetails.Style = styleName
                dataDetails.ele.children[14].innerText = styleName;
                shpClearForm()
                
                if (myData && Object.prototype.toString.call(myData) === "[object Promise]") {
                    myData.then((value) => {
                        viewer3.imageryLayers.remove(value)
                    })
                } else {
                    viewer3.imageryLayers.remove(myData)
                }
                //load again new wms style
                let wms = new Cesium.WebMapServiceImageryProvider({
                    url : wmsURL+"/wms",
                    layers : dataDetails.projectIdName+":"+encodeURI(dataDetails.url),
                    parameters: {
                        transparent: true,
                        format: "image/png",
                        STYLES: styleName
                      },
                });
                $("#btn_dataStyling").show();
                $("#shpStyleChk").hide()
                if(!shapefileEditFlag){
                    $("#shpStyleSelect").append(`<option value="${styleName}">${styleName}</option>`).val(styleName)
                }
                setTimeout(function(){ 
                    myData = viewer3.imageryLayers.addImageryProvider(wms);
                    $("#loadingContainer_Shp").fadeOut();
                }, 8000);
            } else {
                console.error(resp.msg)
            }
            

        }
    })
}

function shpClearForm(){
    $("#shpStyleName").val("")
    $("#shpStyleSelect").prop("selectedIndex", 0);
    $("#shpStylePointChk, #shpStyleLineChk, #shpStylePolygonChk").prop('checked', false); 
    clearStyleInput()
}

function submitKmlStyle() {
    if(shapefileStyling){
        if(flagCheckStyle){
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Unable to use the style for this type of data",
            });
            return
        }
        else{
            submitShapeStyle(dataDetails.id)
            return 
        }
        
    }
    
    var headData = {
        recordId: dataDetails.id,
        kmlUrl: dataDetails.url, //retrieve from objh
        stylePosition: dataDetails.kmlObj.styleTagPosition,
    };

    var pointData;
    var lineData;
    var polygonData;

    var iconColor = testHexColor($("#IconColorVal").val());
    var lineColor = testHexColor($("#LineColorVal").val());
    var polygonColor = testHexColor($("#PolygonColorVal").val());
    var outlineColor = testHexColor($("#OutlineColorVal").val());

    if (dataDetails.kmlObj.pointType) {
        pointData = {
            icon: true,
            iconStyle: $("#IconStyleBoolean").prop("checked"),
            iconHref: $("#IconStyleHref").val(),
            iconColor: iconColor,
            iconOpac: $("#IconOpacityVal").val(),
        };
    }

    if (dataDetails.kmlObj.lineType) {
        if (dataDetails.kmlObj.lineStyle.LineStyleId) {
            lineData = {
                line: true,
                lineColor: lineColor,
                lineWidth: $("#LineWidthVal").val(),
                lineStyleId: dataDetails.kmlObj.lineStyle.LineStyleId,
            };
        } else {
            lineData = {
                line: true,
                lineColor: lineColor,
                lineWidth: $("#LineWidthVal").val(),
            };
        }
    }

    if (dataDetails.kmlObj.polygonType) {
        if (dataDetails.kmlObj.polygonStyle.PolygonStyleId) {
            polygonData = {
                polygon: true,
                polygonFill: $("#PolygonFillBoolean").prop("checked"),
                polygonColor: polygonColor,
                polygonOpac: $("#PolygonOpacityVal").val(),
                outlineBoolean: $("#OutlineBoolean").prop("checked"),
                outlineColor: outlineColor,
                polygonStyleId: dataDetails.kmlObj.polygonStyle.PolygonStyleId,
            };
        } else {
            polygonData = {
                polygon: true,
                polygonFill: $("#PolygonFillBoolean").prop("checked"),
                polygonColor: polygonColor,
                polygonOpac: $("#PolygonOpacityVal").val(),
                outlineBoolean: $("#OutlineBoolean").prop("checked"),
                outlineColor: outlineColor,
            };
        }
    }
    var data = Object.assign({}, headData, pointData, lineData, polygonData);

    $.ajax({
        type: "POST",
        url: "BackEnd/saveKmlStyling.php",
        data: data,
        success: function (obj) {
            response = JSON.parse(obj);
            clearStyleInput();
            $("#KmlStylingDiv").hide();
            $("#btn_dataStyling").show();
            dataDetails.url = response.newPath;
            dataDetails.ele.children[7].innerText = response.newPath;
        },
    });
}

function testHexColor(val) {
    //test whether hex value is a valid color hex
    if (/^#[0-9A-F]{6}$/i.test("#" + val)) {
        return val;
    } else {
        return false;
    }
}

function checkAic(){
    uploadType = "AIC"

    if (localStorage.start_date == undefined || localStorage.start_date == "") {
        $(".messagecontainer").show();
        $("#gdiv2").hide();
        return
    } else {
        $(".messagecontainer").hide();
        changeAicRoutine();
    }
}

//AIC functions
function shareAic(){
    console.log("shareAic");
    $.ajax({
        url: 'BackEnd/aicRequestsv3.php',
        type: "POST",
        dataType: 'json',
        data: {
            runFunction: 'getAicRoutinesToShare',
           
        }, //weekly
        success: function (obj,textStatus ) {
            console.log(obj);
            var myAICs = obj['myAICs'];
            console.log(myAICs);
            let parkCont = $("#parkContainerAerial")[0];
            let moveContainerAerial = document.getElementById("moveContainerAerial");
            parkCont.insertAdjacentElement("afterend", moveContainerAerial);
            $(moveContainerAerial).slideUp(100);
            $("br.spacer").remove();
            $("#shareAerial").html("");

            mixitup ('#shareAerial', config).destroy();
            for (let row of obj.data) {
                var $attachimgsrc;
                var $attachimgtitle;
                var $shareimgsrc;
                var $shareimgtitle;
                var routineType;
                if (row.Share == 0) {
                    $shareimgsrc = "Images/icons/admin_page/datamanage/notshared.png";
                    $shareimgtitle = "Not Shared";
                } else {
                    $shareimgsrc = "Images/icons/admin_page/datamanage/shared.png";
                    $shareimgtitle = "Shared";
                }
                if (myAICs.indexOf(row.AIC_Id) > -1) {
                    $attachimgsrc = "Images/icons/admin_page/datamanage/attached.png";
                    $attachimgtitle = "Attached";
                } else {
                    $attachimgsrc = "Images/icons/admin_page/datamanage/notattached.png";
                    $attachimgtitle = "Not_Attached";
                }
                console.log(row.Image_Captured_Date.date)
                captured_date = new Date(row.Image_Captured_Date.date);
                captured_date = captured_date.toLocaleDateString('en-GB');
                var sortDataName = (row.Image_URL) ? row.Image_URL : ' ';
                var startdate;
                if(row.Routine_Type == 0){
                    routineType = "Weekly";
                    routine = row.Routine_Id;
                    console.log(routine)
                    console.log(routine.substring(4,14))
                    startdate = new Date( row.Routine_Id.substring(4,14));
                    startdate.setDate(startdate.getDate() + 2)
                    startdate = startdate.toLocaleDateString('en-GB');
                } 
                else if(row.Routine_Type == 1){
                    routineType = "Monthly"
                  //  console.log(row.Routine_Id.substring(12))
                    startdate = row.Routine_Id.substring(12);
                    var dt = startdate.split("_");
                    startdate = parseInt(dt[0]) +1 + "_" +dt[1];
                } 
                else if(row.Routine_Type == 2) {
                    routineType = "Quarterly";
                   // console.log(row.Routine_Id.substring(4))
                    startdate = row.Routine_Id.substring(4);
                }

                $("#shareAerial").append(
                '<div class="row admin eightColumn searchv3 mix" rel="" onclick ="editAerialImage(this, event)" data-aic-id="' + row.AIC_Id +  '" data-img-type="' + row.Image_Type + '" data-img-owner="' + row.Owner_Project_Id  + '" data-img-file="' + row.Image_URL + '">\
                    <div class="columnSmall textContainer"><img title="' + $attachimgtitle + '" src="' + $attachimgsrc + '"></div>\
                    <div class="columnSmall textContainer"><img title="' + $shareimgtitle + '" src="' + $shareimgsrc + '"></div>\
                    <div class="columnLarge textContainer"><span class="text">' + row.Image_URL + '</span></div>\
                    <div class="columnSmall textContainer"><span class="text">' + row.Image_Type + '</span></div>\
                    <div class="columnLarge textContainer"><span class="text">' +captured_date + '</span></div>\
                    <div class="columnLarge textContainer"><span class="text">' + routineType + '</span></div>\
                    <div class="columnMiddle textContainer"><span class="text">' + startdate + '</span></div>\
                    <div class="columnMiddle textContainer textCenter"><span class="text">' + row.Owner_Name + '</span></div>\
                    <div class="columnSmall textContainer textCenter"><span class="text">' + row.Frequency + '</span></div>\
                    <div class="columnSmall textContainer" style="display:none"><span class="text">' + row.Owner_Project_Id + '</span></div>\
                    <div class="columnSmall textContainer" style="display:none"><span class="text">' + row.Owner_Id + '</span></div>\
                    <div class="columnSmall textContainer" style="display:none"><span class="text">' + row.Routine_Id + '</span></div>\
                    <div class="columnSmall textContainer" style="display:none"><span class="text">' + row.AIC_Id + '</span></div>\
                    <div class="columnSmall textContainer" style="display:none"><span class="text">' + row.Routine_Type + '</span></div>\
                    <div class="columnSmall textContainer textCenter" ><button class="aicViewImgBtn" onclick="aicViewImage(\''+ row.Image_URL + '\',\'' + row.Owner_Project_Id + '\', this)">View</button>\</div>\
                </div>'
                )
            }

            mixitup ('#shareAerial', config)
            // if (response.msg) {
            //     $("#aicFormStartDate").val("")
            //     $("#aicFormEndDate").val("")
            //     $("#aicFormRegDate").val("")
            //     $("#aicFormRegBy").val("")
            //     $("#aicFormCapturedDate").val("")
            //     if (localStorage.isParent == "isParent") {
            //         $("#aicFormPackageId").prop("selectedIndex", 0);
            //         $("#aicFormPackageName")
            //     }
            //     return
            // }
            // for (var i = 0; i < response.data.length; i++) {
            //     let obj = response.data[i]
            //     let routineId = obj.Routine_Id;
            //     $("#" + routineId).attr("value", obj.Sch_ID)
            //     $("#" + routineId + " div:first-child").removeClass("late")
            //     $("#" + routineId + " div:first-child").addClass("file")
            // };

            // let latestSchedule;
            // $("#AicRoutineList li").each(function () {
            //     let nodeLi = $(this).children(":first");
            //     if (nodeLi.hasClass("file")) {
            //         latestSchedule = $(this)
            //     }
            // })
            // $(latestSchedule).trigger("click")
            // $(latestSchedule).addClass("active")

            // $("#aicScrollDiv").scrollTop(0);
            // $("#aicScrollDiv").animate({
            //     scrollTop: $(latestSchedule).offset().top - 300
            // }, 500);
        }
    });

    
}

function aerialAttachmentToggle(){
    let attachSwap = $("#btn_aerialAttach").html();
    if (attachSwap == "Attach") {
        $("#btn_aerialAttach").css("display", "none");
        $("#attachAICContainer").fadeIn();
        $("#capturedDate").val(aicDetails.capturedDate);
    } else {
        removeSharedAicRoutineInfo();
    }
}

function aerialPermissionToggle(){
    let freq = parseInt(aicDetails.frequency);
    console.log(aicDetails)
    if (aicDetails.access == "Not Shared") {
        //project
        $.confirm({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Confirm!",
            content: "Share this data to other projects?",
            buttons: {
                confirm: function () {
                    $.ajax({
                        type: "POST",
                        url: "BackEnd/aicRequestsv3.php",
                        dataType: "json",
                        data: {
                            access: 1,
                            AicId: aicDetails.id,
                            runFunction : "updateAicDetails"
                        },
                        success: function (obj, textstatus) {
                            console.log(obj)
                            if (obj.msg == "Success") {
                                aicDetails.access = "Shared"
                                $(aicDetails.ele.children[1].children[0]).attr("title", "Shared")
                                $(aicDetails.ele.children[1].children[0]).attr("src", "Images/icons/admin_page/datamanage/shared.png")
                                $("#btn_aerialPermission").html("Unshare")
                            }
                            if (obj.msg == "No Permission") {
                                $.alert({
                                    boxWidth: "30%",
                                    useBootstrap: false,
                                    title: "Message",
                                    content: "You do not have permission to update this!",
                                });
                            }
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
    } else {
        if (freq > 1) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please make sure no project is attached to this data before unshare",
            });
            return;
        }

        $.confirm({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Confirm!",
            content: "Make this Aic Image available to this project only?",
            buttons: {
                confirm: function () {
                    $.ajax({
                        type: "POST",
                        url: "BackEnd/aicRequestsv3.php",
                        dataType: "json",
                        data: {
                            access: 0,
                            AicId: aicDetails.id,
                            runFunction : "updateAicDetails"
                        },
                        success: function (obj, textstatus) {
                            if (obj.msg == "Success") {
                                $(aicDetails.ele.children[1].children[0]).attr("title", "Not Shared")
                                aicDetails.access = "Not Shared"
                                $("#btn_aerialPermission").html("Share")
                                $(aicDetails.ele.children[1].children[0]).attr("src", "Images/icons/admin_page/datamanage/notshared.png")
                            }
                            if (obj.msg == "No Permission") {
                                $.alert({
                                    boxWidth: "30%",
                                    useBootstrap: false,
                                    title: "Message",
                                    content: "You do not have permission to update this!",
                                });
                            }
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

}

function getAerialDataUsers() {
    console.log(aicDetails);
    var dt = aicDetails.capturedDate.split("-");
    var cdate = dt[2] + "-" + dt[1] + "-" +dt[0];

    $("#aerialinfoView").fadeIn(300);
    $("#aerialUsersTable").html("");
    $("#h3_fullname_aerialtinfo").html(aicDetails.fileName);
    $("#aerialinfoName").val(aicDetails.fileName);
    $("#aerialinfoType").val(aicDetails.type);
    $("#aerialinfoOwner").val(aicDetails.ownerName);
    $("#aerialinfoAddeddate").val(cdate);
    $.ajax({
        type: "POST",
        url: "BackEnd/aicRequestsv3.php",
        dataType: "json",
        data: {
            onwerAicId: aicDetails.id,
            fileName : aicDetails.fileName,
            runFunction : 'getProjectsUsingAIC'
        },
        success: function (obj, textstatus) {
            console.log(obj);
            let table_D = obj.data;
            for (let row of table_D) {
                $("#aerialUsersTable").append(
                    "\
                <div class='row admin fourColumn searchv3'>"+
                    "<div class='columnMiddle textContainer'>" +
                        "<span class='text line-clamp'>"+ row.project_id  +"</span>"+
                    "</div>"+
                    "<div class='columnMiddle textContainer'>" +
                        "<span class='text line-clamp'>"+ row.project_name +"</span>"+
                    "</div>"+
                    "<div class='columnMiddle textContainer'>" +
                        "<span class='text line-clamp'>"+ row.Registered_By +"</span>"+
                    "</div>"+
                "</div>\
                "
                );
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        },
    });
}


var aicData = {
    selected: null,
    imgType: null,
    tableRow: null,
    imgSrc: null
};

function changeAicRoutine() {
    $("#addEditAIC").hide()
    $("#gdiv2 .tablecontainer").hide()
    if (localStorage.start_date == undefined || localStorage.start_date == "" || localStorage.end_date == undefined || localStorage.end_date == "") {
        return
    }
    let fullDate1
    let fullDate2
    let year1
    let year2
    let month1
    let month2
    let day1

    var parts = localStorage.start_date.split("/");
    fullDate1 = new Date(parts[2], parts[1] - 1, parts[0]);
    if(localStorage.warranty_end_date != "null" && localStorage.warranty_end_date != undefined && localStorage.warranty_end_date != "" ){
        var parts1 = localStorage.warranty_end_date.split("/"); // use warranty date if set for ariel image register
    }else{
        var parts1 = localStorage.end_date.split("/");
    }
    fullDate2 = new Date(parts1[2], parts1[1] - 1, parts1[0]);
    day1 = fullDate1.getDay();
    let selectedType = $("#AicRoutineType option:selected")
    switch ($(selectedType).html()) {
        case "Weekly":
            $("#AicRoutineList").html("");
            $(".tableHeader.admin .routineType").text("Type: Weekly")
            var daystoadd = 0;
            switch (day1) {
                case 0: //Sunday
                    daystoadd = 1;
                    daystominus = 7;
                    break;
                case 1: //Monday
                    daystoadd = 7;
                    daystominus = 1;
                    break;
                case 2: //Tuesday
                    daystoadd = 6;
                    daystominus = 2;
                    break;
                case 3: //Wednesday
                    daystoadd = 5;
                    daystominus = 3;
                    break;
                case 4: //Thursday
                    daystoadd = 4;
                    daystominus = 4;
                    break;
                case 5: //Friday
                    daystoadd = 3;
                    daystominus = 5;
                    break;
                case 6: //Saturday
                    daystoadd = 2;
                    daystominus = 6;
                    break;
            };

            let timeinms = 1000 * 24 * 60 * 60;
            var startweekdate = new Date(fullDate1.getTime() - daystominus * timeinms);
            var endweekdate = new Date(fullDate1.getTime() + daystoadd * timeinms);
            let weekISO = fullDate1.toISOString()
            let dataStart = startweekdate.toISOString()
            let i = 1;
            let res = dataStart.split(":")
            let weekID = res[0]
            let endweekISO = endweekdate.toISOString()

            let dateStart = dataStart.split( "T" );
            let dateEnd = endweekISO.split( "T" );
            let dataStartDate = dateStart[0];
            let dataEndDate = dateEnd[0];

            let wklabel = "WK" + i + " " + new Intl.DateTimeFormat('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }).format(fullDate1)
            $("#AicRoutineList").append("<li id='aic_" + weekID + "' onclick='getAicRoutineInfo(this)' dataStartDate ='"+ dataStartDate +"' dataEndDate='"+ dataEndDate +"' dataStart='" + dataStart + "' data='" + endweekISO + "'><div class='status late'></div><div class='revision'></div><a>" + wklabel + "</a></li>")
            while (endweekdate <= fullDate2) {
                startweekID = new Date(endweekdate.getTime() - timeinms);
                startweekdate = new Date(endweekdate.getTime());
                endweekdate = new Date(endweekdate.getTime() + 7 * timeinms);

                weekISO = startweekdate.toISOString()
                dataStartDate = startweekdate.toISOString()

                endweekISO = endweekdate.toISOString()
                dataEndDate = endweekdate.toISOString()

                res = startweekID.toISOString().split(":")
                weekID = res[0]
                console.log(res)
                i++;
                wklabel = "WK" + i + " " + new Intl.DateTimeFormat('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }).format(startweekdate)
                $("#AicRoutineList").append("<li id='aic_" + weekID + "' onclick='getAicRoutineInfo(this)' dataStartDate ='"+ dataStartDate +"' dataEndDate='"+ dataEndDate +"' dataStart='" + weekISO + "' data='" + endweekISO + "'><div class='status late'></div><div class='revision'></div><a>" + wklabel + "</a></li>")
            }

            $.ajax({
                url: 'BackEnd/aicRequestsv3.php',
                type: "POST",
                dataType: 'json',
                data: {
                    runFunction: 'getAicRoutines',
                    routineType: '0'
                }, //weekly
                success: function (response) {
                    if (response.msg) {
                        $("#aicFormStartDate").val("")
                        $("#aicFormEndDate").val("")
                        $("#aicFormRegDate").val("")
                        $("#aicFormRegBy").val("")
                        $("#aicFormCapturedDate").val("")
                        if (localStorage.isParent == "isParent") {
                            $("#aicFormPackageId").prop("selectedIndex", 0);
                            $("#aicFormPackageName")
                        }
                        return
                    }
                    for (var i = 0; i < response.data.length; i++) {
                        let obj = response.data[i]
                        let routineId = obj.Routine_Id;
                        $("#" + routineId).attr("value", obj.Sch_ID)
                        $("#" + routineId + " div:first-child").removeClass("late")
                        $("#" + routineId + " div:first-child").addClass("file")
                    };

                    let latestSchedule;
                    $("#AicRoutineList li").each(function () {
                        let nodeLi = $(this).children(":first");
                        if (nodeLi.hasClass("file")) {
                            latestSchedule = $(this)
                        }
                    })
                    $(latestSchedule).trigger("click")
                    $(latestSchedule).addClass("active")

                    $("#aicScrollDiv").scrollTop(0);
                    $("#aicScrollDiv").animate({
                        scrollTop: $(latestSchedule).offset().top - 300
                    }, 500);
                }
            });

            break;
        case "Monthly":
            $("#aicGroup").hide("");
            $("#AicRoutineList").html("");
            $(".tableHeader.admin .routineType").text("Type: Monthly")
            year1 = fullDate1.getFullYear();
            year2 = fullDate2.getFullYear();
            month1 = fullDate1.getMonth();
            month2 = fullDate2.getMonth();
            let eachMonth = new Date(fullDate1)
            eachMonth.setDate(1)
            let monthISO = fullDate1.toISOString()
            let parts = localStorage.start_date.split("/");
            var endMonth = new Date(parts[2], parts[1] - 1, parts[0]);
            endMonth.setDate(1)
            endMonth.setMonth(month1 + 1)
            let endMonthISO = endMonth.toISOString()
            
            let mthStart = monthISO.split( "T" );
            let mthEnd = endMonthISO.split( "T" );
            let dataStartMth = mthStart[0];
            let dataEndMth = mthEnd[0];

            let monthID = "monthly_" + eachMonth.getMonth() + "_" + eachMonth.getFullYear();
         
            let label = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                year: 'numeric'
            }).format(eachMonth)
            $("#AicRoutineList").append("<li id='aic_" + monthID + "' onclick='getAicRoutineInfo(this)' dataStartDate ='"+ dataStartMth +"' dataEndDate='"+ dataEndMth +"' dataStart='" + monthISO + "' data='" + endMonthISO + "'><div class='status late'></div><div class='revision'></div><a>" + label + "</a></li>")
            let j = month1 + 1;
            let g = j + 1
            while (eachMonth.getMonth() != month2 || year1 < year2) {
                eachMonth.setMonth(j)
                if (g > 12) {
                    g = 1; //feb
                }
                endMonth.setMonth(g)
                j++
                g++
                if (j > 12) {
                    j = 1; //feb
                    year1++
                }

                let endMonthISO = endMonth.toISOString()
                let monthISO = eachMonth.toISOString()
                let monthID = "monthly_" + eachMonth.getMonth() + "_" + eachMonth.getFullYear();

                let mthStart = monthISO.split( "T" );
                let mthEnd = endMonthISO.split( "T" );
                let dataStartMth = mthStart[0];
                let dataEndMth = mthEnd[0];
                console.log(monthID)
                let label = new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    year: 'numeric'
                }).format(eachMonth)
                $("#AicRoutineList").append("<li id='aic_" + monthID + "' onclick='getAicRoutineInfo(this)' dataStartDate ='"+ dataStartMth +"' dataEndDate='"+ dataEndMth +"' dataStart='" + monthISO + "' data='" + endMonthISO + "'><div class='status late'></div><div class='revision'></div><a>" + label + "</a></li>")
            }

            $.ajax({
                url: 'BackEnd/aicRequestsv3.php',
                type: "POST",
                dataType: 'json',
                data: {
                    runFunction: 'getAicRoutines',
                    routineType: '1'
                }, //weekly
                success: function (response) {
                    if (response.msg) {
                        $("#aicFormStartDate").val("")
                        $("#aicFormEndDate").val("")
                        $("#aicFormRegDate").val("")
                        $("#aicFormRegBy").val("")
                        $("#aicFormCapturedDate").val("")
                        if (localStorage.isParent == "isParent") {
                            $("#aicFormPackageId").prop("selectedIndex", 0);
                            $("#aicFormPackageName")
                        }
                        return
                    }
                    for (var i = 0; i < response.data.length; i++) {
                        let obj = response.data[i]
                        let routineId = obj.Routine_Id;
                        $("#" + routineId).attr("value", obj.Sch_ID)
                        $("#" + routineId + " div:first-child").removeClass("late")
                        $("#" + routineId + " div:first-child").addClass("file")
                    };

                    let latestSchedule;
                    $("#AicRoutineList li").each(function () {
                        let nodeLi = $(this).children(":first");
                        if (nodeLi.hasClass("file")) {
                            latestSchedule = $(this)
                        }
                    })
                    $(latestSchedule).trigger("click")
                    $(latestSchedule).addClass("active")
                    $("#aicScrollDiv").scrollTop(0);
                    $("#aicScrollDiv").animate({
                        scrollTop: $(latestSchedule).offset().top - 300
                    }, 500);
                }
            });

            break;
        case "Quarterly":
            $("#aicGroup").hide("");
            $("#AicRoutineList").html("");
            $(".tableHeader.admin .routineType").text("Type: Quarterly")
            var sQuarter = Math.floor((fullDate1.getMonth() + 1) / 3) + 1;
            var eQuarter = Math.floor((fullDate2.getMonth() + 1) / 3) + 1;
            var quarterNames;
            if(SYSTEM == 'KKR'){
                quarterNames = ['Jan', 'Apr', 'Jul', 'Oct', 'Dec'];
            }else{
                quarterNames = ['Jan', 'Apr', 'Jul', 'Oct'];
            }

            if (eQuarter > 4) {
                eQuarter = 4
            }
            if (sQuarter > 4) {
                sQuarter = 4
            }
            var sYear = fullDate1.getYear() + 1900;
            var eYear = fullDate2.getYear() + 1900;
            var endYear = sYear;

            if (sQuarter > 3) {
                endYear++;
            }
            while (sQuarter != eQuarter || sYear != eYear) {
                let value = sYear + "" + sQuarter
                let QuarID = "Q" + sQuarter + "_" + sYear;
                let quarStart = quarterNames[sQuarter - 1] + " " + sYear;
                let quarEnd = quarterNames[sQuarter] + " " + endYear;
                console.log(QuarID);

                let startQuar = sYear +"-"+monthToNumAr[quarterNames[sQuarter - 1]];
                let endQuar = endYear+"-"+monthToNumAr[quarterNames[sQuarter]];

                $("#AicRoutineList").append("<li id='aic_" + QuarID + "' dateYear='" + value + "' dataStartDate ='"+ startQuar +"' dataEndDate='"+ endQuar +"' dataStart='" + quarStart + "' data='" + quarEnd + "' onclick='getAicRoutineInfo(this)'><div class='status late'></div><div class='revision'></div><a>" + QuarID + "</a></li>")
                sQuarter++;
                if (sQuarter > 4) {
                    sQuarter = 1;
                    sYear++;
                }
                if (sQuarter > 3) {
                    endYear++;
                }
            }
            let value = sYear + "" + sQuarter
            let QuarID = "Q" + sQuarter + "_" + sYear;
            let quarStart = quarterNames[sQuarter - 1] + " " + sYear;
            let quarEnd = quarterNames[sQuarter] + " " + endYear;
            let startQuar = sYear +"-"+monthToNumAr[quarterNames[sQuarter - 1]];
            let endQuar = endYear+"-"+monthToNumAr[quarterNames[sQuarter]];

            $("#AicRoutineList").append("<li id='aic_" + QuarID + "' dateYear='" + value + "' dataStartDate ='"+ startQuar +"' dataEndDate='"+ endQuar +"' dataStart='" + quarStart + "' data='" + quarEnd + "' onclick='getAicRoutineInfo(this)'><div class='status late'></div><div class='revision'></div><a>" + QuarID + "</a></li>")

            $.ajax({
                url: 'BackEnd/aicRequestsv3.php',
                type: "POST",
                dataType: 'json',
                data: {
                    runFunction: 'getAicRoutines',
                    routineType: '2'
                }, //weekly
                success: function (response) {
                    if (response.msg) {
                        $("#aicFormStartDate").val("")
                        $("#aicFormEndDate").val("")
                        $("#aicFormRegDate").val("")
                        $("#aicFormRegBy").val("")
                        $("#aicFormCapturedDate").val("")
                        if (localStorage.isParent == "isParent") {
                            $("#aicFormPackageId").prop("selectedIndex", 0);
                            $("#aicFormPackageName")
                        }
                        return
                    }
                    for (var i = 0; i < response.data.length; i++) {
                        let obj = response.data[i]
                        let routineId = obj.Routine_Id;
                        $("#" + routineId).attr("value", obj.Sch_ID)
                        $("#" + routineId + " div:first-child").removeClass("late")
                        $("#" + routineId + " div:first-child").addClass("file")
                    };

                    let latestSchedule;
                    $("#AicRoutineList li").each(function () {
                        let nodeLi = $(this).children(":first");
                        if (nodeLi.hasClass("file")) {
                            latestSchedule = $(this)
                        }
                    })

                    $(latestSchedule).trigger("click")
                    $(latestSchedule).addClass("active")
                    $("#aicScrollDiv").scrollTop(0);
                    $("#aicScrollDiv").animate({
                        scrollTop: $(latestSchedule).offset().top - 300
                    }, 500);
                }
            });
            break;
    }
}

function FillingAicForm(ele) {
    console.log(ele);
    aicData.selected = $(ele).attr('id');
    let startQuarDate = $(ele).attr("dataStartDate")
    let endQuarDate = $(ele).attr("dataEndDate")

    let startDate = new Date(startQuarDate)
    let endDate = new Date(endQuarDate)
    let offset = startDate.getTimezoneOffset();

    startDate = new Date(startDate.getTime() - (offset * 60 * 1000));
    startDate = startDate.toISOString().slice(0, 10)
    endDate = new Date(endDate.getTime() - (offset * 60 * 1000));
    endDate = endDate.toISOString().slice(0, 10)

    $(".tableHeader.admin .startDate").text("Start: " + startDate)
    $(".tableHeader.admin .endDate").text("End: " + endDate)

    let dateNow = new Date();
    dateNow = new Date(dateNow.getTime() - (offset * 60 * 1000));
    dateNow = dateNow.toISOString().slice(0, 10)

    $("#aicFormStartDate").val(startDate)
    $("#aicFormEndDate").val(endDate)
    $("#aicFormRegDate").val(dateNow)
    $("#aicFormRegBy").val(localStorage.signed_in_email)

    if (localStorage.isParent == "isParent") {
        $("#aicFormPackageId").removeAttr("readonly")
    } else {
        $("#aicFormPackageId").attr("readonly", "readonly")
    }
}

function getAicRoutineInfo(ele) {
    $('#aicGroup').css('display', 'none')

    $("#addEditAIC").hide()
    $("#aicRecordTable").html("")
    $("#aicFormCapturedDate").val("")
    $("#aicFormPackageName").val("")
    if (localStorage.isParent == "isParent") {
        $("#aicFormPackageId").prop("selectedIndex", 0);
        $("#aicFormPackageId").removeAttr("disabled")
    }
    $("#aicFormCapturedDate").removeAttr("disabled")
    $("#aicFormImgInput").removeAttr("disabled")
    $("#AicUpdateButton").hide()
    $("#AicSaveButton").show()
    aicClear()
    uploadType = "AIC"; //for uploader
    $("#AicRoutineList li.active").removeClass("active")
    $(ele).addClass("active")
    let nodeStatus = $(ele).children(":first");
    FillingAicForm(ele)

    if (nodeStatus.hasClass("late")) { //late = not available
        $("#gdiv2 .tablecontainer").hide()
        $("#gdiv2 .formcontainer").hide()
        $("#addEditAIC").show()
        $("#aicNewReg").css("visibility", "hidden")
        return
    } else {
        $("#gdiv2 .tablecontainer").show()
        $("#aicNewReg").css("visibility", "visible")

        let data = {
            runFunction: 'getSpecificAicRoutine',
            routineId: $(ele).attr('id')
        }

        $.ajax({
            url: 'BackEnd/aicRequestsv3.php',
            type: "POST",
            dataType: 'json',
            data: data, //weekly
            success: function (response) {
                response.data.forEach(function (row) {
                    var imgURL;
                    if(SYSTEM == 'OBYU'){
                        imgURL = row.Image_URL 
                    }else{
                        imgURL = 'revicons.ico';
                    }
                    var dis ="";
                    var etitle = "Edit the Captured Date";
                    var rtitle = "Revise the Uploaded Image";
                     if(row.Owner_AIC_Id != row.AIC_Id){
                        dis=  "disabled";
                        etitle = "Edit not available as it is a shared Image!";
                        rtitle = "Revise not available as it is a shared Image!";
                     };

                    $("#aicRecordTable").append('\
                    <div class="row admin fiveColumn" data="'+ row.AIC_Id +'" rel="">\
                        <div class="columnMiddle textContainer"><span class="text">' + row.project_id + ' - ' + row.project_name + '</span></div>\
                        <div class="columnMiddle textContainer"><span class="text">' + new Date(row.Image_Captured_Date.date).toDateString() + '</span></div>\
                        <div class="columnMiddle textContainer"><span class="text">' + row.Registered_By + '</span></div>\
                        <div class="columnMiddle textContainer"><span class="text">' + new Date(row.Registered_Date.date).toDateString() + '</span></div>\
                        <div class="columnMiddle textContainer" style="display:none"><span class="text">' + row.AIC_Id + '</span></div>\
                        <div class="columnMiddle textContainer" style="display:none"><span class="text">' + row.Package_Id + '</span></div>\
                        <div class="columnMiddle textContainer" '+(SYSTEM=='OBYU'?'style="display:none"':'')+'><span class="text">'+ row.Image_URL + '</span></div>\
                        <div class="columnMiddle textContainer"><span class="text">' + row.Owner_Project_Name + '</span></div>\
                        <div class="columnMiddle textContainer" style="margin:unset"><img class="aerial" title="" src="'+ imgURL + '">\
                            <div class="buttoncontainer">\
                                <div class="buttonsubcontainer">\
                                    <button title = "View the Image" class="aicViewImgBtn" onclick="aicViewImage(\''+ row.Image_URL + '\',\'' + row.project_id + '\', this)">View</button>\
                                    <button title ="'+ etitle +'" onclick="aicEditRecord(this)" '+dis+'>Edit</button>\
                                </div>\
                                <div class="buttonsubcontainer">\
                                    <button title ="'+ rtitle +'" onclick="aicReviseImage(this)" '+dis+'>Revise</button>\
                                    <button title = "Group the Image" onclick="aicGroup('+ row.AIC_Id + ')">Group</button>\
                                </div>\
                            </div>\
                        </div>\
                    </div>')
                })

            }
        });
    }
}

$("#aicFormPackageId").change(function () {
    $("#aicFormPackageName").val($(this).children("option:selected").attr('data'))
})

// function for previewing the image uploaded //
function aicViewImage(imgfileName, packageId, e) {
    $("#addEditAIC").hide()
    if(SYSTEM == 'OBYU'){
        let image = $(e).parent().siblings().attr("src")
        $("#imageShow").attr("src", image)
        $("#imageViewer").css('display', 'block')
    }else{
        // localStorage.p_id_name
        $("#previewWMS").attr("src", `Components/wmsViewer.php?layer=${imgfileName}&packageId=${packageId}` )

        $("#imageViewer").css('display', 'block')
    }
}

function aicGroup(aicID) {
    aicIdEach = aicID;

    $("#addEditAIC").hide()
    $("#aicGroup").css('display','block')

    $('#groupAerialSelect option').removeAttr('selected')
    $('#subGroupAerielSelect option').removeAttr('selected')

    $.post( "BackEnd/getAerialGroups.php", {
		aicID: aicID
	})
    .done(function( data ) {
        var group ='';
        var subgroup ='';

        var options = ' <option value> -- Choose Group -- </option>\
            <option id="newAerialGroup" value="newAerialGroup">&lt;Add a new group&gt;</option>'

        var optionsSub = ' <option value> -- Choose Sub Group -- </option>\
            <option id="newAerialSubGroup" value="newAerialSubGroup">&lt;Add a new sub group&gt;</option>'

        if(data.group){
            group = data.group

            group.forEach(function (item) {
                if(item.selected){
                    options += "<option value='" + item.groupID + "' selected>" + item.groupName + "</option>"
                }
    
                if(!item.selected){
                    options += "<option value='" + item.groupID + "'>" + item.groupName + "</option>"
                }
            })
        }

        if(data.subgroup){
            subgroup = data.subgroup

            subgroup.forEach(function (item) {
                if(item.selected){
                    optionsSub += "<option value='" + item.subGroupID + "' selected>" + item.subGroupName + "</option>"
                }
    
                if(!item.selected){
                    optionsSub += "<option value='" + item.subGroupID + "'>" + item.subGroupName + "</option>"
                }
            })
        }
        

        $("#groupAerialSelect").html(options);
        $("#subGroupAerielSelect").html(optionsSub);

        if ($("#groupAerialSelect").val() == "newAerialGroup" || $("#editGroupAerialBtn").val() == "1") {
            $("#hiddenAerialContainer").show()
            $("#hiddenAerialSubContainer").show()

        }else{
            $("#hiddenAerialContainer").hide()
            $("#hiddenAerialSubContainer").hide()
        }

        $("#newGroupName").val("")
        $("#newLayerName").val("")
        $('#groupSubLayerSelect').prop("selectedIndex", 0)
    });       
}

function aicNewReg() {
    aicClear()
    $("#gdiv2 .formcontainer").hide()
    $("#addEditAIC").show()
    $("#aicFormCapturedDate").val("")
    if (localStorage.isParent == "isParent") {
        $("#aicFormPackageId").val("")
        $("#aicFormPackageName").val("")
        $("#aicFormPackageId").removeAttr("disabled")
    }
    $("#aicFormCapturedDate").removeAttr("disabled")
    $("#aicFormImgInput").removeAttr("disabled")
    $("#AicUpdateButton").hide()
    $("#AicSaveButton").show()
}

// function for previewing the image uploaded //
function aicEditRecord(e) {
    aicClear()
    if (localStorage.isParent == "isParent") {
        $("#aicFormPackageId").prop("selectedIndex", 0);
        $("#aicFormPackageName").val("")
    }
    $("#aicGroup").hide()
    $("#addEditAIC").show()
    let siblings = $(e).parent().parent().parent().siblings()
    aicData.tableRow = siblings

    let capturedDate = new Date($(siblings[1]).text())
    let offset = capturedDate.getTimezoneOffset();
    capturedDate = new Date(capturedDate.getTime() - (offset * 60 * 1000))
    recordId = $(siblings[4]).text()

    document.getElementById("aicFormCapturedDate").valueAsDate = capturedDate
    if (localStorage.isParent == "isParent") {
        $("#aicFormPackageId").val($(siblings[5]).text()).trigger("change")
        $("#aicFormPackageId").attr("disabled", "disabled")
    }
    $("#aicFormImgInput").attr("disabled", "disabled")
    $("#aicFormCapturedDate").removeAttr("disabled")
    $("#AicUpdateButton").attr("data", "Edit Record")
    $("#AicUpdateButton").show()
    $("#AicSaveButton").hide()
}

function aicReviseImage(e) {
    aicClear()
    if (localStorage.isParent == "isParent") {
        $("#aicFormPackageId").prop("selectedIndex", 0);
        $("#aicFormPackageName").val("")
    }
    $("#aicGroup").hide()
    $("#addEditAIC").show()
    let siblings = $(e).parent().parent().parent().siblings()
    aicData.tableRow = siblings
   

    let capturedDate = new Date($(siblings[1]).text())
    let offset = capturedDate.getTimezoneOffset();
    capturedDate = new Date(capturedDate.getTime() - (offset * 60 * 1000))
    recordId = $(siblings[4]).text()

    document.getElementById("aicFormCapturedDate").valueAsDate = capturedDate
    $("#aicFormPackageId").val($(siblings[5]).text()).trigger("change")
    $("#aicFormCapturedDate").attr("disabled", "disabled")
    $("#aicFormPackageId").attr("disabled", "disabled")
    $("#aicFormImgInput").removeAttr("disabled")
    $("#AicUpdateButton").attr("data", "Revise Image")
    $("#AicUpdateButton").show()
    $("#AicSaveButton").hide()
}

function updateAicRoutineInfo() {
    if ($("#AicUpdateButton").attr("data") == "Edit Record") {
        if ($("#aicFormCapturedDate").val() == "") {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please enter Image Captured Date",
            });
            return
        }

        if (localStorage.isParent == "isParent") {
            if ($("#aicFormPackageId").val() == null || $("#aicFormPackageId").val() == "undefined") {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Please select Package Id.",
                });
                return
            }
        }
        data = {
            runFunction: "updateAicDetails",
            AicId: $(this).attr("recordId"),
            Image_Captured_Date: $("#aicFormCapturedDate").val()
        }
        $.ajax({
            url: 'BackEnd/aicRequestsv3.php',
            type: "POST",
            dataType: 'json',
            data: data,
            success: function (response) {
                if (localStorage.isParent == "isParent") {
                    $(aicData.tableRow[0]).text($("#aicFormPackageId :selected").text() + " - " + $("#aicFormPackageName").val()) // package id - name
                }


                $(aicData.tableRow[1]).text(new Date($("#aicFormCapturedDate").val()).toDateString()) // image captured date
                $("#addEditAIC").hide()
                $("#aicFormCapturedDate").val("")
            }
        });

    } else if ($("#AicUpdateButton").attr("data") == "Revise Image") {
        if ($("#aicFormCapturedDate").val() == "") {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please enter Image Captured Date",
            });
            return
        }
        var fname = aicResumable.files[0].fileName.split(".")[0];
        if(aicData.tableRow[6].innerText.trim() == fname.trim() ){
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "File already exists. Please change the file Name.",
            });
            return
        }
        if (localStorage.isParent == "isParent") {
            if ($("#aicFormPackageId").val() == null || $("#aicFormPackageId").val() == "undefined") {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Please select Package Id.",
                });
                return
            }
            else{
                aicResumable.opts.query.packageId = $("#aicFormPackageId option:selected").attr("data-2")
            }
        }

        if (aicResumable.files.length < 1) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please select an aerial image.",
            });
            return
        }

        validateAicFile(aicResumable.files[0].fileName, addAicFile)
    } else {
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "Error. Please refresh and try again.",
        });
        return;
    }
}

function updateAicImagePath() {
    var recordId = $(aicData.tableRow[4]).text()
    var packageId = $(aicData.tableRow[0]).text().split("-")[0]
    var imgURL
    if (aicResumable.files.length > 0) {
        if(SYSTEM == 'OBYU'){
            imgURL = "../../../Data/AIC/" +aicResumable.files[0].fileName;
        }else{
            imgURL = aicResumable.files[0].fileName
        }
    }
    data = {
        runFunction: "reviseAicImage",
        AicId: recordId,
        imgfileName: imgURL,
        imgType: aicData.imgType
    }

    $.ajax({
        url: 'BackEnd/aicRequestsv3.php',
        type: "POST",
        dataType: 'json',
        data: data,
        success: function (response) {
            $("#addEditAIC").hide()
            $("#aicFormCapturedDate").val("")
            //change params for map viewer
            let changedRow = $("#aicRecordTable tr").filter(function () { return $(this).attr("data") == response.aicId })
            $(changedRow).children().last().children().children().last().children().first().attr("onClick", `aicViewImage('${response.fileName}','${packageId}', this)`)
            $('#AicRoutineList').find('li.active').click();
        }
    });
}

function saveAicRoutineInfo() {
    var imgfileName
    if (aicResumable.files.length > 0) {
        if(SYSTEM == 'OBYU'){
            imgfileName = "../../../Data/AIC/" +aicResumable.files[0].fileName;
        }else{
            imgfileName = aicResumable.files[0].fileName;
        }
    }

    var data = {
        runFunction: "saveAicRoutine",
        startDate: $("#aicFormStartDate").val(),
        endDate: $("#aicFormEndDate").val(),
        regDate: $("#aicFormRegDate").val(),
        regBy: $("#aicFormRegBy").val(),
        capturedDate: $("#aicFormCapturedDate").val(),
        packageId: $("#aicFormPackageId").val(),
        imgfileName: imgfileName,
        routineId: aicData.selected,
        imgType: aicData.imgType,
        routineType: $("#AicRoutineType").val()
    }
    var concatString
    if (localStorage.isParent == "isParent") {
        concatString = '<td>' + $("#aicFormPackageId").val() + ' - ' + $("#aicFormPackageName").val() + '</td>'
    } else {
        concatString = '<td>' + localStorage.p_id + ' - ' + localStorage.p_name + '</td>'
    }

    $.ajax({
        url: 'BackEnd/aicRequestsv3.php',
        type: "POST",
        dataType: 'json',
        data: data,
        success: function (response) {
            $("#" + aicData.selected + " div:first-child").removeClass("late")
            $("#" + aicData.selected + " div:first-child").addClass("file")
            $("#gdiv2 .tablecontainer").show()
            $("#addEditAIC").hide()
            $("#aicFormCapturedDate").val("")
            $("#" + aicData.selected).trigger("click");
        }
    });
}

function saveSharedAicRoutineInfo() {
    var routineId = aicDetails.routineId;
    var routineType = aicDetails.routineType;
    var flag = true;
    var dt = (localStorage.start_date)? localStorage.start_date.split("/") : [];
    var dt1 = [];
    if(localStorage.warranty_end_date != "null"  && localStorage.warranty_end_date != "" ){
        dt1= localStorage.warranty_end_date.split("/");
    } else if (localStorage.end_date != null  && localStorage.end_date != ""){
        dt1 = localStorage.end_date.split("/");
    };
    if(!dt.length > 0 || !dt1.length > 0){
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "Project Start Date / End Date  is not set to add this AIC image. Please set the start and end dates for the project",
        });
        return;
    }
    var st = dt[2] + "-" + dt[1] + "-" + dt[0];
    var pr_start = new Date(st);
    
    var st1 = dt1[2] + "-" + dt1[1] + "-" + dt1[0];
    var pr_end = new Date(st1);
    switch(routineType){
        case "0" :
            console.log("weekly");
            var startdate = new Date(routineId.substring(4,14));
            if(!pr_start.getTime()<=  startdate.getTime() &&  !pr_end.getTime()>= startdate.getTime())
            flag = false;
            break;
        case "1" :
            console.log("monthly");
            var dt2 = routineId.substring(12).split("_");
            var startdate = new Date(dt2[1] +"-" + (parseInt(dt2[0]) +1) + "-01");
            if(!pr_start.getTime()<=  startdate.getTime() &&  !pr_end.getTime()>= startdate.getTime())
            flag = false;
            break;
        case "2" :
            console.log("quarterly");
            var startdate;
            var dt2 = routineId.substring(4).split("_");
            switch (dt2[0]){
                case "Q1" :
                    startdate = new Date(dt2[1] +"-01-01") ;
                    if(!pr_start.getTime()<=  startdate.getTime() &&  !pr_end.getTime()>= startdate.getTime())
                    flag = false;
                    break;
                case "Q2" :
                    startdate = new Date(dt2[1] +"-04-01") ;
                    if(!pr_start.getTime()<=  startdate.getTime() &&  !pr_end.getTime()>= startdate.getTime())
                    flag = false;
                    break;
                case "Q3" :
                    startdate = new Date(dt2[1] +"-07-01");
                    if(!pr_start.getTime()<=  startdate.getTime() &&  !pr_end.getTime()>= startdate.getTime())
                    flag = false;
                    break;
                case "Q4" :
                    startdate = new Date(dt2[1] +"-10-01") ;
                    if(!pr_start.getTime()<=  startdate.getTime() &&  !pr_end.getTime()>= startdate.getTime())
                    flag = false;
                    break;
            }
            break;
    }
    if(flag == false){
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "The selected AIC routine date does not fall within the project start and end dates. so the AIC image cannot be added!"
        });
        return;
    }
//get data from the shared list
    var data = {
        runFunction: "saveSharedAicRoutine",
        capturedDate: $("#capturedDate").val(),
        imgfileName: aicDetails.fileName,
        routineId: aicDetails.routineId,
        imgType: aicDetails.type,
        routineType: aicDetails.routineType,
        owner: aicDetails.ownerName,
        ownerProjectId : aicDetails.owner,
        ownerAicId : aicDetails.id  
    }
    var concatString
    if (localStorage.isParent == "isParent") {
        concatString = '<td>' + $("#aicFormPackageId").val() + ' - ' + $("#aicFormPackageName").val() + '</td>'
    } else {
        concatString = '<td>' + localStorage.p_id + ' - ' + localStorage.p_name + '</td>'
    }
    $.ajax({
        url: 'BackEnd/aicRequestsv3.php',
        type: "POST",
        dataType: 'json',
        data: data,
        success: function (response) {
            $("#moveContainerAerial .buttonContainerData .hiddencontainer#attachAICContainer"
            ).css("display", "none");
            $("#moveContainerAerial .buttonContainerData #cancelAICAttach").fadeIn();
            $("#btn_aerialAttach").html("Detach");
            $("#btn_aerialAttach").css("display", "block");
            $(aicDetails.ele.children[0].children[0]).attr("title", "Attached")
            $(aicDetails.ele.children[0].children[0]).attr("src", "Images/icons/admin_page/datamanage/attached.png")
            freq = parseInt(aicDetails.frequency)
            freq += 1;
            aicDetails.ele.children[8].innerText = freq
            aicDetails.frequency = freq;
        }
    });
}

function removeSharedAicRoutineInfo(){

    var data = {
        runFunction: "removeSharedAicRoutine",
        imgfileName: aicDetails.fileName,
        imgType: aicDetails.type,
        ownerAicId: aicDetails.id       
    }
    
    $.ajax({
        url: 'BackEnd/aicRequestsv3.php',
        type: "POST",
        dataType: 'json',
        data: data,
        success: function (response) {
            $("#btn_aerialAttach").html("Attach");
           
            $(aicDetails.ele.children[0].children[0]).attr("title", "Not_Attached")
            $(aicDetails.ele.children[0].children[0]).attr("src", "Images/icons/admin_page/datamanage/notattached.png")
            freq = parseInt(aicDetails.frequency)
            freq -= 1;
            aicDetails.ele.children[8].innerText = freq;
            aicDetails.frequency = freq;
           
        }
    });

}

function editAerialImage(ele, event){
    if(event.target.nodeName !== "BUTTON"){
        let moveContainerAerial = document.getElementById("moveContainerAerial");
     
        if ($(ele).hasClass("active")) {
            $(ele).removeClass("active");
            $(ele).siblings().removeClass("active");
            $(moveContainerAerial).slideUp(100);
            $("br.spacer").remove();
        } else {
            $(ele).addClass("active");
            ele.insertAdjacentElement("afterend", moveContainerAerial);
        
            $("#moveContainerAerial .buttonContainerData .hiddencontainer#attachAICContainer").css("display", "none");
            $("#moveContainerAerial .buttonContainerData #btn_aerialAttach").fadeIn();
            //$("#moveContainer .buttonContainerData #btn_AddToGroup").fadeIn();
        
        // $("#moveContainer .buttonContainerData .hiddencontainer").css("display", "none");
            //$("#moveContainerAerial .buttonContainerData #btn_setDefault").fadeIn();

            $(ele).siblings().removeClass("active");
            $(ele).addClass("active");
            $("br.spacer").remove();
            $("#moveContainerAerial").slideDown(100).css("display", "inline-flex");
            let Image_attach = ele.children[0].children[0].title;
            let Image_access = ele.children[1].children[0].title;
            let Image_url = ele.children[2].innerText;
            let Image_type = ele.children[3].innerText;
            let Image_captured_date = ele.children[4].innerText;
            let frequency = ele.children[8].innerText;
            let owner_project_id = ele.children[9].innerText;
            let owner_id_number = ele.children[10].innerText;
            let routine_id = ele.children[11].innerText;
            let aic_id = ele.children[12].innerText;
            let routineType =  ele.children[13].innerText;
            let project_id = localStorage.p_id_name
            var dt = Image_captured_date.split("/");
            Image_captured_date = dt[2] + "-" + dt[1] + "-" +dt[0];
            aicDetails = {
                id: aic_id,
                access: Image_access,
                ele: ele,
                frequency: frequency,
                type: Image_type,
                fileName : Image_url,
                capturedDate : Image_captured_date,
                routineId : routine_id,
                routineType : routineType,
                owner : owner_id_number,
                ownerName : owner_project_id
            };
    
            //hide button if not owner of layer 
            // let data_owner = ele.children[5].innerText;
            // $("#attachLayer").val("");
            // $("#setdefaultLayer")[0].checked = false;
            if (Image_access == "Not Shared") {
                $("#btn_aerialPermission").html("Share");
            } else {
                $("#btn_aerialPermission").html("Unshare");
            }
            if (owner_project_id !== project_id) {
                $("#btn_aerialPermission").attr("disabled", "")
                if (Image_access == "Not Shared" && Image_attach == "Not_Attached") {
                    $("#btn_aerialAttach").attr("disabled", "");
                    $("#btn_aerialAttach").html("Attach");
                } else if (Image_access == "Shared" && Image_attach == "Not_Attached") {
                    $("#btn_aerialAttach").html("Attach");
                    $("#btn_aerialAttach").removeAttr("disabled");
                } else if (Image_access == "Shared" && Image_attach == "Attached") {
                    $("#btn_aerialAttach").html("Detach");
                    $("#btn_aerialAttach").removeAttr("disabled");
                } else if (Image_access == "Not Shared" && Image_attach == "Attached") {
                    $("#btn_aerialAttach").html("Detach");
                    $("#btn_aerialAttach").attr("disabled", "");
                }
            } else {
                $("#btn_aerialPermission, #btn_aerialAttach").removeAttr("disabled");
                if (Image_attach == "Not_Attached") {
                    $("#btn_aerialAttach").html("Attach");
                } else if (Image_attach == "Attached" && eval(frequency <= 1)) {
                    $("#btn_aerialAttach").html("Detach");
                    $("#btn_aerialAttach").attr("disabled", "");
                } else {
                    $("#btn_aerialPermission").attr("disabled", "");
                    $("#btn_aerialAttach").html("Detach");
                    $("#btn_aerialAttach").attr("disabled", "");
                }
            }
        }
        
    }
}



function cancelAicForm() {
    aicClear()
    $("#addEditAIC").hide()
}

function getWMSCap() {
	if(!GEOHOST) return; // if geo is not defined skip
	var parser = new ol.format.WMSCapabilities();
	fetch(wmsURL+"/ows?service=wms&version=1.3.0&request=GetCapabilities")
		.then(function (response) {
			return response.text();
		})
		.then(function (text) {
			wmsCapabilities = parser.read(text);
		});
}

function wmsFlyTo(wmsName){
	let layer = wmsCapabilities.Capability.Layer.Layer.find(
		(l) => l.Name === dataDetails.projectIdName+":"+encodeURI(wmsName)
	);
	let extent = layer.BoundingBox[0].extent
    var rect = Cesium.Rectangle.fromDegrees(extent[0], extent[1], extent[2], extent[3]);
	viewer3.camera.flyTo({
		destination : rect
	});
}

function shpStyleSelectChange(){
    shapefileEditFlag = false
    let selectedVal = $("#shpStyleSelect :selected").val()
    $("#shpStyleChk, #IconStyleDiv, #LineStyleDiv, #PolyStyleDiv").hide()
    $("#shpStylePointChk, #shpStyleLineChk, #shpStylePolygonChk").prop('checked', false); 
    if(selectedVal === "addShpStyle"){
        $("#shpStyleChk").show()
        $("#shpStyleName").attr("disabled", false)
        $("#shpStyleEditBtn").attr("disabled", true).hide()
    }else{
        $("#shpStyleEditBtn").attr("disabled", false).show()
        flagCheckStyle = false
        let wms = new Cesium.WebMapServiceImageryProvider({
            url : wmsURL+"/wms",
            layers : dataDetails.projectIdName+":"+encodeURI(dataDetails.url),
            parameters: {
                transparent: true,
                format: "image/png",
                STYLES: selectedVal
              },
        });
        wms.errorEvent.addEventListener((e)=>{
            if(!flagCheckStyle){
                console.error("Unable to use the style for this type of data");
                flagCheckStyle = true
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Unable to use the style for this type of data",
                });
                return;
            }
        })
        if (myData && Object.prototype.toString.call(myData) === "[object Promise]") {
            myData.then((value) => {
                viewer3.imageryLayers.remove(value)
            })
        } else {
            viewer3.imageryLayers.remove(myData)
        }
        myData = viewer3.imageryLayers.addImageryProvider(wms);

    }
}

function fetchShpStyles(){
    $.ajax({
        url: "BackEnd/DataFunctions.php",
        type: "POST",
        dataType: "JSON",
        data: {functionName: "getShpStyle"},
        success: function (obj) {
            var options = '<option disabled selected value> -- select an option -- </option>'
            options += '<option value="addShpStyle">&lt;Add a new style&gt;</option>'
            if(obj.data.length >= 1){
                obj.data.forEach(function (item) {
                    options += `<option value="${item.name}">${item.name}</option>`
                })
            }
            $("#shpStyleSelect").html(options);
        }
    })
}

function shpSymbologyChk(ele){
    var shpStyleCheck = $(ele).prop("id");
    var shpBoxCheck = $(ele).prop("checked");
    switch(shpStyleCheck){
        case "shpStylePointChk":
            $(ele).prop("checked")?$("#IconStyleDiv").show():$("#IconStyleDiv").hide()
        break;
        case "shpStyleLineChk":
            $(ele).prop("checked")?$("#LineStyleDiv").show():$("#LineStyleDiv").hide()
        break;
        case "shpStylePolygonChk":
            $(ele).prop("checked")?$("#PolyStyleDiv").show():$("#PolyStyleDiv").hide()
        break;
    }
    if (shpStyleCheck == "shpStylePointChk" && shpBoxCheck == true){
        $("#IconImage-kml").hide();
    }
}

function parseShpStyle(){
    shapefileEditFlag = true
    if($("#shpStyleSelect :selected").val() === "addShpStyle"){
        return
    }
    $.ajax({
        url: "BackEnd/DataFunctions.php",
        type: "POST",
        dataType: "JSON",
        data: {functionName: "parseShpStyle", styleName: $("#shpStyleSelect :selected").val()},
        success: (obj)=>{
            $("#shpStyleChk").show()
            $("#shpStyleName").val($("#shpStyleSelect :selected").val()).attr("disabled", true)
            $("#shpStylePointChk, #shpStyleLineChk, #shpStylePolygonChk").prop('checked', false); 
            if(obj.pointImg){ //check if it is point
                $("#shpStylePointChk").prop("checked", true).change()
                $("#IconStyleHref").val(obj.pointImg).click()
            }
            if(obj.lineColor || obj.lineWidth){ //check if it is line
                $("#shpStyleLineChk").prop("checked", true).change()
                $("#LineColorVal").val(obj.lineColor.substring(1))
                $("#LineColorVal").css(
                    "background-color", obj.lineColor
                );
                $("#LineWidthVal").val(obj.lineWidth)
            }
            if(obj.fillPolygon || obj.fillOpacity || obj.outLineColor){ //check if it is polygon
                $("#shpStylePolygonChk").prop("checked", true).change()
                if(obj.fillPolygon || obj.fillOpacity){
                    $("#PolygonFillBoolean").prop("checked", true).change()
                    $("#PolygonColorVal").val(obj.fillPolygon.substring(1))
                    $("#PolygonColorVal").css(
                        "background-color", obj.fillPolygon
                    );
                    $("#PolygonOpacityVal").val(obj.fillOpacity * 100)
                }
                if(obj.outLineColor){
                    $("#OutlineBoolean").prop("checked", true).change()
                    $("#OutlineColorVal").val(obj.outLineColor.substring(1))
                    $("#OutlineColorVal").css(
                        "background-color", obj.outLineColor
                    );
                }
            }

        }
    })
}

function OnClickSaveAerialGroup(){
    var data;
    var idGroup = $("#groupAerialSelect").val();
    var idSubGroup = $("#subGroupAerielSelect").val();

    var valueNewGroup = $("#newGroupAerialName").val();
    var valueNewSubGroup = $("#newsubGroupAerialName").val();

    if(!idGroup && idSubGroup){
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Message',
            content: "Please choose group first before saving subgroup"
        });
        return
    }

    //TO REMOVE FROM GROUP AND SUBGROUP
    if(!idGroup && !idSubGroup){ 
        data = {
            functionName: "removeAerialGroup",
            aicID: aicIdEach,
        }
    }
    else{
        //TO SAVE GROUP AND SUBGROUP
        //NEW GROUP
        if (idGroup == "newAerialGroup") {
            if (valueNewGroup == "" || valueNewGroup == "&lt;Add a new group&gt;") {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: "Please enter a valid name"
                });
                return
            }

            if(!idSubGroup){
                //NO SUBGROUP
                data = {
                    functionName: "saveGroupAerial",
                    groupName: valueNewGroup,
                    groupID: idGroup,
                    subgroupName: valueNewSubGroup,
                    subgroupID: idSubGroup,
                    dataID: aicIdEach,
                    typeFunc: "newGroupAndNoSubgroup",
                }
            }
            else if (idSubGroup == "newAerialSubGroup") {
                //NEW SUBGROUP
                if (valueNewSubGroup == "" || valueNewSubGroup == "&lt;Add a new group&gt;") {
                    $.alert({
                        boxWidth: '30%',
                        useBootstrap: false,
                        title: 'Message',
                        content: "Please enter a valid name"
                    });
                    return
                }

                data = {
                    functionName: "saveGroupAerial",
                    groupName: valueNewGroup,
                    groupID: idGroup,
                    subgroupName: valueNewSubGroup,
                    subgroupID: idSubGroup,
                    dataID: aicIdEach,
                    typeFunc: "newGroupAndNewSubgroup",
                }
            }
            else{
                data = {
                    functionName: "saveGroupAerial",
                    groupName: valueNewGroup,
                    groupID: idGroup,
                    subgroupName: valueNewSubGroup,
                    subgroupID: idSubGroup,
                    dataID: aicIdEach,
                    typeFunc: "newGroupAndOldSubgroup",
                }
            }

            
        }
        else{
            if(!idSubGroup){
                //NO SUBGROUP
                data = {
                    functionName: "saveGroupAerial",
                    groupName: valueNewGroup,
                    groupID: idGroup,
                    subgroupName: valueNewSubGroup,
                    subgroupID: idSubGroup,
                    dataID: aicIdEach,
                    typeFunc: "oldGroupAndNoSubgroup",
                }
            }
            else if (idSubGroup == "newAerialSubGroup") {
                //NEW SUBGROUP
                if (valueNewSubGroup == "" || valueNewSubGroup == "&lt;Add a new group&gt;") {
                    $.alert({
                        boxWidth: '30%',
                        useBootstrap: false,
                        title: 'Message',
                        content: "Please enter a valid name"
                    });
                    return
                }

                data = {
                    functionName: "saveGroupAerial",
                    groupName: valueNewGroup,
                    groupID: idGroup,
                    subgroupName: valueNewSubGroup,
                    subgroupID: idSubGroup,
                    dataID: aicIdEach,
                    typeFunc: "oldGroupAndNewSubGroup",
                }
            }
            else{
                data = {
                    functionName: "saveGroupAerial",
                    groupName: valueNewGroup,
                    groupID: idGroup,
                    subgroupName: valueNewSubGroup,
                    subgroupID: idSubGroup,
                    dataID: aicIdEach
                }
            }
        }
    }

    $.ajax({
        type: "POST",
        url: "BackEnd/fetchDatav3.php",
        dataType: 'json',
        data: data,
        success: function (obj) {

            if(obj.bool === true){
            }
            else{
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: obj.msg
                });
                return
            }

            if ($("#editGroupAerialBtn").val() == "1") {
                $("#groupAerialSelect option:selected").text($("#newGroupAerialName").val())
                $("#groupAerialSelect option:selected").attr("data", "0")

                //reset value
                $("#editGroupAerialBtn").val("0")
                $("#newGroupAerialName").text("<Add a new group>")
                $("#canceladdgroupAerial").trigger("click")
                return;
            } else if ($("#newGroupAerialName").val() == "") { //add record only
                $("#canceladdgroupAerial").trigger("click")
                return;
            }

            //reset value and append new option
            $("#newGroupAerialName").text("<Add a new group>")
            $('#groupAerialSelect').append("<option data='1' value='" + data.idGroup + "'>" + $("#newGroupAerialName").val() + "</option>")
            $("#newGroupAerialName").val("")
            $("#canceladdgroupAerial").trigger("click")
            return;
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
}

function openJogetFromProjAdmin(url, form = false, parentTagNameText = ''){

    $("#main-project-dashboard h3").text(parentTagNameText);
    
    if(SYSTEM == 'OBYU'){
        if(!form){
            url = JOGETLINK.dataList[url];
        }
        else{
            url = JOGETLINK.form[url];
        }
    }
    else{
        url = JOGETLINK[url];
    }

    if(url) {
        $("#digitalReportingInfo iframe").attr("src", url).show();
 
    } else {
        $("#digitalReportingInfo iframe").attr("src", url).hide();
 
    }
}

function stickyScroll(){
    
    var isSyncingLeftScroll = false;
    var isSyncingRightScroll = false;
    var leftDiv = document.getElementById('gleft');
    var rightDiv = document.getElementById('gright');

    leftDiv.onscroll = function() {
        if (!isSyncingLeftScroll) {
            isSyncingRightScroll = true;
            rightDiv.scrollTop = this.scrollTop;
        }
        isSyncingLeftScroll = false;
    }

    rightDiv.onscroll = function() {
        if (!isSyncingRightScroll) {
            isSyncingLeftScroll = true;
            leftDiv.scrollTop = this.scrollTop;
        }
        isSyncingRightScroll = false;
    }
}

var eventMethod = window.addEventListener
? "addEventListener"
: "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
// Listen to message from child window

eventer(
    messageEvent,
    function (e) {

        if(e.data && e.data.processName && e.data.processName == "PP"){
            var contentMsg;

            if(e.data.eventType == "submitForm"){
                if(e.data.processName == "PP"){
                    contentMsg = "Project progress successfully submitted!";
                }
            }

            window.parent.$.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Success!',
                content: contentMsg,
                buttons: {
                    OK: function () {
                        showLoader()
                        window.parent.location.reload();
                    },
                }
            });
        }
    },
    false
);

OnClickSaveUserList = () =>{
    var data = [];
    $("#adminProjectUsers")
        .find("div")
        .each(function () {
            var row = $(this);
            if((row.find("div").eq(1).html()) == undefined) return true;
            data.push({
                id: parseInt(row.find("div").eq(0).text()),
                email: row.find("div").eq(1).text(),
                designation: (row.find("div").eq(6).find('input').val() !== 'N/A') ? row.find("div").eq(6).find('input').val() : ''
            });
        });
    var userListUpdate = [];
    var msg =" Are you sure you want to update the designation for these users? <br>";

    for (var i = 0; i < currUserList.length; i++) {
        var j = 0;
        while (j < data.length) {
            if (currUserList[i].id == data[j].id) {
                //assigning designation
                if(currUserList[i].designation != data[j].designation){
                    userListUpdate.push({
                        user_id: data[j].id,
                        user_email: data[j].email,
                        user_designation: data[j].designation
                    });
                    msg +=  data[j].email + " <br>";
                }
                data.splice(j, 1);
                break;
            }
            j++;
        }
    }

    if(userListUpdate.length > 0){
        formdata = new FormData();
        ajaxUrl = 'BackEnd/userFunctionsV3.php';
        formdata.append("userListProjAdmin", JSON.stringify(userListUpdate));
        formdata.append("functionName", "updateUserList");

        $("#main-user .loadingcontainer-mainadmin").show();

        $.confirm({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Confirm!',
            content: msg,
            buttons: {
                confirm: function () {
                    $.ajax({
                        url: ajaxUrl,
                        data: formdata,
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        success: function (res) {
                            var data = JSON.parse(res)
                            if(data.bool && data.bool == true){
                                $.alert({
                                    boxWidth: '30%',
                                    useBootstrap: false,
                                    title: "Success!",
                                    content: data.msg
                                });
                            }else{
                                $.alert({
                                    boxWidth: '30%',
                                    useBootstrap: false,
                                    title: "Error!",
                                    content: data.msg
                                });
                            }
                            loadProjectUsers();
                            $("#main-user .loadingcontainer-mainadmin").hide();
                        }
                    });
                },
                cancel: function () {
                    return;
                },
            },
        });
    }else{
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: "Message!",
            content: "No user update."
        });

        loadProjectUsers();
        $("#main-user .loadingcontainer-mainadmin").hide();
    }
}

OnClickEditUserList = () =>{
    $("#adminProjectUsers").find(".edit").removeAttr("disabled");
}