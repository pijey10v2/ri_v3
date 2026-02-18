var dfp;
var dfwa;
var dfwb;
var dfwc;
var dfwd;
var dfwe;
var dfwf;
var dfwg;
var dfwh;
var dfwi;
var dfwj;
var dfwk;
var dfwl;
var dfwm;
var dfwn;
var dfwo;
var dfwq;
var dfwr;
var dfws;
var dfwt;
var dfwu;
var dfwv;
var dfwx;
var dfwy;
var dfwz;
var dfwaa;
var dfwbb;
var dfwcc;
var dfwdd;
var $jogetHost = JOGETHOST;

function VideoFrame(bshow) {
    var myVideo = $(videoContainer).find("video")[0];
    if (myVideo !== undefined && bshow == false) {
        $("#videoframe.active").removeClass("active");
        myVideo.pause();
    }
    jqwidgetBox("videoframe", bshow);
}

function Assignments() {
    if (jogetConOpDraw.entity) {
        viewer.entities.remove(jogetConOpDraw.entity)
    }
    $(".conopTab").removeClass("active")
    $(".page-container.active").css("display", "none");
    $(".page-container.active").removeClass("active");

    jqwidgetBox("assignments", 1);
}

function ConOpBrowser() {
    if ($("#conopPage1 iframe").attr("src") !== undefined) { //reload iframe by opening the last opened datalist
        $("#conopPage1 iframe").attr("src", $("#conopPage1 iframe").attr("src"))
    }
    jqwidgetBox("ConOpBrowser", 1);
}

function AssetMtnBrowser() {
    if ($("#conditionPage iframe").attr("src") !== undefined) { //reload iframe by opening the last opened datalist
        $("#conditionPage iframe").attr("src", $("#conditionPage iframe").attr("src"))
    }
    jqwidgetBox("AssetMtnBrowser", 1);
}

function _assetMtnTabToggle(page) {
    $('.main-iframe-div').css('display', 'none');
    $("#"+page).css("display", "block");

    // check if child active or not, if active reload, if not select the first child 
    if($("#"+page).find('.tabs-item')){
        if($("#"+page).find('.tabs-item').find('.tab.active').length != 0) {
            $("#"+page).find('.tabs-item').find('.tab.active').click();
        }else{
            $("#"+page).find('.tabs-item').find('.tab:first').click();
        }
    }
}

function assetMtnTabToggle(ele){
    var page =  $(ele).attr("rel");
    $(ele).addClass("active")
    $("#tabAssetMtn").children().children().removeClass("active")
    $('#conditionMtnAsset').css("display", "none");
    $('#assesmentMtnAsset').css("display", "none");
    $('#nodMtnAsset').css('display', 'none');
    $('#ncpMtnAsset').css('display', 'none');

    $('#routineMaintenance').css('display', 'none');
    $('#periodicMaintenance').css('display', 'none');
    $('#emergencyWork').css('display', 'none');
    _assetMtnTabToggle(page);
}

function getAllPanels() {
    var pans = dfp.getDSXDFPanels(DSXDFUtil.ALL_DSXDFPanel);
    document.getElementById("allpanels").value =
        "Number of All Panels " + pans.length;
}

function getAllFloatPanels() {
    var pans = dfp.getDSXDFPanels(DSXDFUtil.Float_DSXDFPanel);
    document.getElementById("floatpanels").value =
        "Number of All Float Panels " + pans.length;
}

function getAllHiddenPanels() {
    var pans = dfp.getDSXDFPanels(DSXDFUtil.Hidden_DSXDFPanel);
    document.getElementById("hiddenpanels").value =
        "Number of All Hidden Panels " + pans.length;
}

function getAllAutoHidePanels() {
    var pans = dfp.getDSXDFPanels(DSXDFUtil.Hidden_AUTO_DSXDFPanel);
    document.getElementById("autohidepanels").value =
        "Number of All Hidden Panels " + pans.length;
}

function getAutoHidePanelsBySide() {
    var pans = dfp.getAutoHideDSXDFPanels(DSXDFUtil.fixedLeft);
    if (pans != null)
        document.getElementById("leftautohidepanels").value =
            "Number of Hidden Panels in Left Side " + pans.length;
    else {
        document.getElementById("leftautohidepanels").value =
            "Number of Hidden Panels in Left Side 0 ";
    }
}


function changeAppWindowTitle(floatBoxVar, val) {
    if ($("#" + floatBoxVar)) {
        $("#" + floatBoxVar).parent().parent().find(".jqx-window-header").children('div:first').html(val);
    }
}

function showinstruction() {
    $(".instructionbox").fadeIn(150);
}

function instructions(html) {
    $("#instructions").html(html);
}

function hideinstruction() {
    $(".instructionbox").fadeOut(150);
}

function closeAllWindow() {
    var videoContainer = document.getElementById("videoContainer");
    var myVideo = $(videoContainer).find("video")[0];
    if ($(videoContainer).find("video")[0]) {
        myVideo.pause();
    }
    if (tempVideoPin) { // remove temp videoPin
        viewer.entities.removeById(tempVideoPin.id);
    }

    for (var i = 0; i < videoPinsArray.length; i++) {
        videoPinsArray[i].show = false;
    }
    if (Cesium.defined(tempVideoPin)) {
        viewer.entities.remove(tempVideoPin);
    };

    for (var i = 0; i < distEntities.length; i++) {
        viewer.entities.remove(distEntities[i]);
    };

    for (var i = 0; i < distEntities.length; i++) {
        viewer.entities.remove(distEntities[i]);
    };

    // for (var i = 0; i < videoPinsArray.length; i++) {
    //     videoPinsArray[i].show = false;
    // }

    if (tempImagePin) {
        viewer.entities.removeById(tempImagePin.id);
    }
    if (earthPinEdit) {
        var i = earthPinIndex;
        var mypin = addEarthPin(earthPinData[i].imagePinName, earthPinData[i].longitude, earthPinData[i].latitude, earthPinData[i].height, true);
        earthPinsArray.splice(earthPinIndex, 0, mypin);
    }

    // CameraFeed(false)
    // CameraHeight(false)
    $('#ControlDiv.active').css('display', 'none')
    $('#ControlDiv.active').removeClass('active')
    keycontrol_trigger = false;

    $("#ScreenSpaceTool.active").css("display", "none");
    $("#ScreenSpaceTool.active").removeClass("active");

    resetpinpointtoolVlaue();
    markupToolsCleanup();
    hideAllWindow()

    $(".rightclickMenu").removeClass("active")
}

//function for expanding layer group
function togglelist(e) {
    let itemclicked = $(e).parent().attr('id')
    let itemtoopen = $(e).parent().attr('rel')

    if (!$("#" + itemclicked).hasClass('active')) {
        $('ul #' + itemtoopen).slideDown(100)
        $('#' + itemclicked).addClass('active')
    } else {
        $('ul #' + itemtoopen).slideUp(100)
        $('#' + itemclicked).removeClass('active')
    }
}

$(function () {

    // var layerW = 600, 
    //     layerH = 660, 
    //     layerX = 150, 
    //     layerY = 150

    // if ($(document).width() <= 1920){
    //     layerW = 600;
    //     layerH = 660; 
    //     layerX = 150; 
    //     layerY = 150;
    // }

    // if ($(document).width() <= 1366){
    //     layerW = 400;
    //     layerH = 550;
    //     layerX = 150;
    //     layerY = 150;

    // /}

    var layout = [{
        type: 'layoutGroup',
        items: [{

        }]
    }, {
        type: 'floatGroup',
        width: '23vw',
        height: '100vh',
        position: {
            x: 0,
            y: 0
        },
        items: [{
            type: 'documentPanel',
            title: 'Layer',
            contentContainer: 'jqxLayer'
        }]
    }, {
        type: 'floatGroup',
        width: '90vw',
        height: '80vh',
        position: {
            x: '5vw',
            y: '7vh'
        },
        items: [{
            type: 'documentPanel',
            title: 'AIC',
            contentContainer: 'jqxAicViewer'
        }]
    }, {
        type: 'floatGroup',
        width: '20vw',
        height: '100vh',
        position: {
            x: 0,
            y: 0
        },
        items: [{
            type: 'documentPanel',
            title: 'Location Directory',
            contentContainer: 'jqxFolderDirectory'
        }]
    }, {
        type: 'floatGroup',
        width: '40vw',
        height: '60vh',
        position: {
            x: '10vw',
            y: '10vh'
        },
        items: [{
            type: 'documentPanel',
            title: 'Asset Table',
            contentContainer: 'jqxJsonAssetTable'
        }]
    }, {
        type: 'floatGroup',
        width: '65vw',
        height: '70vh',
        position: {
            x: '10vw',
            y: '10vh'
        },
        items: [{
            type: 'documentPanel',
            title: 'Pavement Analysis Upload',
            contentContainer: 'jqxAssetAnalysisUpload'
        }]
    }, {
        type: 'floatGroup',
        width: '85vw',
        height: '70vh',
        position: {
            x: '10vw',
            y: '10vh'
        },
        items: [{
            type: 'documentPanel',
            title: 'Pavement Analysis Report',
            contentContainer: 'jqxAssetPaveAnalysis'
        }]
    }, {
        type: 'floatGroup',
        width: 400,
        height: 250,
        position: {
            x: 550,
            y: 500
        },
        items: [{
            type: 'documentPanel',
            title: 'Thematic',
            contentContainer: 'jqxThematic'
        }]
    },  {
        type: 'floatGroup',
        width: 300,
        height: 350,
        position: {
            x: 220,
            y: 250
        },
        items: [{
            type: 'documentPanel',
            title: 'Legend Tool',
            contentContainer: 'jqxLegendTool'
        }]
    }, {
        type: 'floatGroup',
        width: "80vw",
        height: "35vh",
        position: {
            x: '20vw',
            y: '65vh'
        },
        items: [{
            type: 'documentPanel',
            title: 'Gantt Chart',
            contentContainer: 'jqxGantChart'
        }]
    }, {
        type: 'floatGroup',
        width: '25vw',
        height: '100vh',
        position: {
            x: '0vw',
            y: '0vh'
        },
        items: [{
            type: 'documentPanel',
            title: 'Camera Feed',
            contentContainer: 'jqxCameraFeed'
        }]
    }, {
        type: 'floatGroup',
        width: 300,
        height: 400,
        position: {
            x: 400,
            y: 400
        },
        items: [{
            type: 'documentPanel',
            title: 'Power BI',
            contentContainer: 'jqxPowerBI'
        }]
    }, {
        type: 'floatGroup',
        width: 270,
        height: 170,
        position: {
            x: 200,
            y: 300
        },
        items: [{
            type: 'documentPanel',
            title: 'Draw Tool',
            contentContainer: 'jqxDrawTool'
        }]
    }, {
        type: 'floatGroup',
        width: 300,
        height: 120,
        position: {
            x: 230,
            y: 300
        },
        items: [{
            type: 'documentPanel',
            title: 'Land Configuration',
            contentContainer: 'jqxLandConfigure'
        }]
    },  {
        type: 'floatGroup',
        width: '28vw',
        height: '46vh',
        position: {
            x: 100,
            y: 400
        },
        items: [{
            type: 'documentPanel',
            title: 'Pinpoint Tool',
            contentContainer: 'jqxPintpointTool'
        }]
    }, {
        type: 'floatGroup',
        width: '30vw',
        height: '46vh',
        position: {
            x: '30vw',
            y: '35vh'
        },
        items: [{
            type: 'documentPanel',
            title: 'Camera Configuration',
            contentContainer: 'jqxCameraHeight'
        }]
    },  {
        type: 'floatGroup',
        width: 1850,
        height: 900,
        position: {
            x: 30,
            y: 60
        },
        items: [{
            type: 'documentPanel',
            title: 'iModel',
            contentContainer: 'jqxPWShare'
        }]
    }, {
        type: 'floatGroup',
        width: 1850,
        height: 900,
        position: {
            x: 30,
            y: 60
        },
        items: [{
            type: 'documentPanel',
            title: 'ProjectWise Issue Resolution',
            contentContainer: 'jqxPWIssue'
        }]
    },  {
        type: 'floatGroup',
        width: 300,
        height: 200,
        position: {
            x: 450,
            y: 100
        },
        items: [{
            type: 'documentPanel',
            title: 'Location Directory',
            contentContainer: 'jqxLocationDirectory'
        }]
    },{
        type: 'floatGroup',
        width: '55vw',
        height: '50vh',
        position: {
            x: '22vw',
            y: '20vh'
        },
        items: [{
            type: 'documentPanel',
            title: 'Earthtmine',
            contentContainer: 'jqxEarthmine'
        }]
    },   {
        type: 'floatGroup',
        width: '25vw',
        height: '100vh',
        position: {
            x: 0,
            y: 0
        },
        items: [{
            type: 'documentPanel',
            title: 'View 360 Feed',
            contentContainer: 'jqxEarthFeed'
        }]
    }, {
        type: 'floatGroup',
        width: 420,
        height: 320,
        position: {
            x: 180,
            y: 150
        },
        items: [{
            type: 'documentPanel',
            title: 'Video Frame',
            contentContainer: 'jqxVideoFrame'
        }]
    }, {
        type: 'floatGroup',
        width: '80vw',
        height: '80vh',
        position: {
            x: '10vw',
            y: '10vh'
        },
        items: [{
            type: 'documentPanel',
            title: 'Assignments',
            contentContainer: 'jqxAssignments'
        }]
    }, {
        type: 'floatGroup',
        width: '85vw',
        height: '85vh',
        position: {
            x: '7.5vw',
            y: '7.5vh'
        },
        items: [{
            type: 'documentPanel',
            title: 'ConOp Browser',
            contentContainer: 'jqxConOpBrowser'
        }]
    }, {
        type: 'floatGroup',
        width: '80vw',
        height: '80vh',
        position: {
            x: '10vw',
            y: '10vh'
        },
        items: [{
            type: 'documentPanel',
            title: 'Asset Maintenance Browser',
            contentContainer: 'jqxAssetMtnBrowser'
        }]
    },{
        type: 'floatGroup',
        width: '80vw',
        height: '80vh',
        position: {
            x: '10vw',
            y: '10vh'
        },
        items: [{
            type: 'documentPanel',
            title: 'Assignments',
            contentContainer: 'jqxAssetInboxBrowser'
        }]
    },{
        type: 'floatGroup',
        width: '70vw',
        height: '70vh',
        position: {
            x: '15vw',
            y: '15vh'
        },
        items: [{
            type: 'documentPanel',
            title: 'AppWindow',
            contentContainer: 'jqxAppWindow'
        }]
    }, {
        type: 'floatGroup',
        width: '40vw',
        height: '60vh',
        position: {
            x: '10vw',
            y: '10vh'
        },
        items: [{
            type: 'documentPanel',
            title: 'Image 360 Configuration',
            contentContainer: 'jqxAddImage'
        }]
    }, {
        type: 'floatGroup',
        width: '40vw',
        height: '60vh',
        position: {
            x: '10vw',
            y: '10vh'
        },
        items: [{
            type: 'documentPanel',
            title: 'Bumi Participant List',
            contentContainer: 'jqxbumiParticipant'
        }]
    }, {
        type: 'floatGroup',
        width: '40vw',
        height: '60vh',
        position: {
            x: '10vw',
            y: '10vh'
        },
        items: [{
            type: 'documentPanel',
            title: 'Package List',
            contentContainer: 'jqxbumiParticipant-packageList'
        }]
    }, {
        type: 'floatGroup',
        width: "60vw",
        height: "60vh",
        position: {
            x: '20vw',
            y: '20vh'
        },
        items: [{
            type: 'documentPanel',
            title: 'Aerial Image Edit',
            contentContainer: 'jqxAerialEdit'
        }]
    }
    ];

    $('#jqxDockingLayout').jqxDockingLayout({ width: "100%", height: "100%", layout: layout });
    hideAllWindow();


    /////function neutral navbar/////
    function neutralNavbar() {
        //$(".appsbar").animate({width:'toggle'},200);
        if (!$(".appsbar").hasClass("active")) { } else {
            $(".appscontainer .appsbutton button a").fadeOut(50);
            $(".appsbar").animate({
                width: "toggle",
            },
                150
            );
            $(".appsbar.active").removeClass("active");
        }

        if (!$(".nav-bar").hasClass("active")) { } else {
            $(".nav-bar.active").removeClass("active");
            $(".nav-bar").animate({
                height: "toggle",
            },
                200
            );
            $(".minimize").css("display", "block");
            document.getElementById("demo").innerHTML = "&or;";

            $(".dropitem.active").removeClass("active");
            $(".dropitem").css("display", "none");
        }
    }
    /////     Pop up window click item     /////
    //animation for clicking the close pop up item//
    $(".popupboxfooter .popupbutton button").on("click", function () {
        let popuptoClose = $(this).attr("rel");
        $("#" + popuptoClose).css("display", "none");
    });

    /////function neutral third button/////
    function neutralThirdbuttonActive() {
        $(".sidemenu .third-button .tool").removeClass("active");
        $(".sidemenu .third-button .admin").removeClass("active");
        $(".sidemenu .third-button .measure").removeClass("active");
        $(".sidemenu .third-button .nav").removeClass("active");
             

        $("#imageTool").attr(
            "src",
            "Images/icons/second_button/" + themeFolder + "/tools2.png"
        );
        $("#imageMeasure").attr(
            "src",
            "Images/icons/second_button/" + themeFolder + "/ruler_square2.png"
        );
        $("#imageAdmin").attr(
            "src",
            "Images/icons/second_button/" + themeFolder + "/admin2.png"
        );
        $("#imageNav").attr(
            "src",
            "Images/icons/second_button/" + themeFolder + "/navigate2.png"
        );
        $("#imageAsset").attr(
            "src",
            "Images/icons/second_button/" + themeFolder + "/asset2.png"
        );
        $("#imageBim ").attr(
            "src",
            "Images/icons/second_button/" + themeFolder + "/building2.png"
        );
        $("#imageNrw ").attr(
            "src",
            "Images/icons/second_button/" + themeFolder + "/nrw2.png"
        );
    }

    function resetpinpointtoolVlaue() {
        viewer.scene.primitives.remove(tempModel); //remove the drawing
        //console.log(distEntities.length);
        for (var i = 0; i < distEntities.length; i++) {
            viewer.entities.remove(distEntities[i]);
        };
        distEntities.splice(0, distEntities.length);
        distanceEntity = 0;
        distance = 0;
        //reset all input fields
        $('.inputcontainer .column1').find('input').prop("checked", false);
        $('.inputcontainer .column2').find('input').prop("checked", false);
        $('.inputcontainer .column3').find('input').prop("checked", false);
    }

    function cleanmarkingandcursor() {
        // to clear flags and arrays for measure
        flagMeasure = false;
        for (var i = 0; i < 3; i++) {
            labelEntity[i].label.show = false;
        }
        MeasureTool = "";
        document.getElementsByTagName("body")[0].style.cursor = "default";
        for (var i = 0; i < distEntities.length; i++) {
            viewer.entities.remove(distEntities[i]);
        };
        distEntities.splice(0, distEntities.length);
        distanceEntity = 0;
        distance = 0;
        flagPosEntities = false;
    }

    /////function to close/hide all dockable windows/////
    function cleanUpOnClickOfSecondButton() {
        // to clear flags for identity button
        viewer.selectedEntity = undefined;
        // to clear flags and arrays for measure
        flagMeasure = false;
        for (var i = 0; i < 3; i++) {
            labelEntity[i].label.show = false;
        }
        MeasureTool = "";
        document.getElementsByTagName("body")[0].style.cursor = "default";
        for (var i = 0; i < distEntities.length; i++) {
            viewer.entities.remove(distEntities[i]);
        };
        distEntities.splice(0, distEntities.length);
        distanceEntity = 0;
        distance = 0;
        flagPosEntities = false;

        // to clear for administrative tool
        flagEntity = false;
        flagDraw = false;
        flagEdit = false;
        flagEditModel = false;
        resetpinpointtoolVlaue();

        //to remove video pins
        for (var i = 0; i < videoPinsArray.length; i++) {
            videoPinsArray[i].show = false;
        }
        $("#videoframe").removeClass("active");
        //VideoFrame(false);
        jqwidgetBox("videoframe", false);
        jqwidgetBox("function9-1", false);

        var videoContainer = document.getElementById("videoContainer");
        var myVideo = $(videoContainer).find("video")[0];
        if ($(videoContainer).find("video")[0]) {
            myVideo.pause();
        }
        if (tempVideoPin) {//remove tempVideoPin if not saved
            viewer.entities.removeById(tempVideoPin.id);
        }
        
        viewer.selectedEntity = undefined;
    }

    $(".mydfaClose").on("click", function () {
        document.getElementsByTagName("body")[0].style.cursor = "default";
    });

    $("#button-logo").on("click", function () {
        $(".main-button").animate({
            padding: "toggle",
        },
            100
        );
        $(".second-button").animate({
            width: "toggle",
        },
            100
        );
        $(".sidemenu .second-button").css("display", "flex");
        $(".sidemenu .second-button .button-menu#back").removeClass("active");

        neutralNavbar();
        $(".rightclickMenu").removeClass("active")
    });

    $(".sidemenu .second-button .button-menu#back").on("click", function () {
        neutralThirdbuttonActive();
        cleanUpOnClickOfSecondButton();
        neutralNavbar();
        $(".second-button").animate({
            padding: "toggle",
        },
            100
        );
        $(".main-button").animate({
            padding: "toggle",
        },
            100
        );

        
    });

    $(".sidemenu .second-button .button-menu").on("click", function () {
        let menuToShow = $(this).attr("rel");
        let secondButtonClicked = $(this).attr("id");
        cleanUpOnClickOfSecondButton();

        // logic for locating the location of the second button //
        var rect = this.getBoundingClientRect();
        var postop = rect.top + 15;

        if ($(document).width() <= 1366) {
            var postop = rect.top + 10;
        }

        if (menuToShow == "group3") {
            if (!flagMeasure) {
                flagMeasure = true;
            } else {
                flagMeasure = false;
            }
        }
        if (!$(this).hasClass("active")) {
            neutralThirdbuttonActive();

            if (secondButtonClicked == "tool") {
                $("#imageTool").attr(
                    "src",
                    "Images/icons/second_button/" + themeFolder + "/tools.png"
                );
            } else if (secondButtonClicked == "measure") {
                $("#imageMeasure").attr(
                    "src",
                    "Images/icons/second_button/" + themeFolder + "/ruler_square.png"
                );
            } else if (secondButtonClicked == "admin") {
                $("#imageAdmin").attr(
                    "src",
                    "Images/icons/second_button/" + themeFolder + "/admin.png"
                );
            } else if (secondButtonClicked == "nav") {
                $("#imageNav").attr(
                    "src",
                    "Images/icons/second_button/" + themeFolder + "/navigate.png"
                );
            } else if (secondButtonClicked == "asset") {
                $("#imageAsset").attr(
                    "src",
                    "Images/icons/second_button/" + themeFolder + "/asset.png"
                );
            } else if (secondButtonClicked == "nrw") {
                $("#imageNrw ").attr(
                    "src",
                    "Images/icons/second_button/" + themeFolder + "/nrw.png"
                );
            }

            //deactivate prevous SECOND button and make clicked button active
            $(".sidemenu .second-button .button-menu.active").removeClass("active");
            $(this).addClass("active");

            //animate close and remove any THIRD button from active.
            $(".sidemenu .third-button.active").css("display", "none", function () {
                $(this).removeClass("active");
            });
            // position the third button div besides the second button click //
            $(".third-button").css("top", postop);
            // then, animate to open and make THIRD button to active
            $("#" + menuToShow)
                .animate({
                    margin: "toggle",
                },
                    50
                )
                .css("display", "flex");
            $("#" + menuToShow).addClass("active");

            //deactivate fourth layer button
            $(".admin-function.active").removeClass("active")
            $(".bottommenu").css("display", "none")

            //hide the control div function
            $("#ControlDiv.active").css("display", "none");
            $("#ControlDiv.active").removeClass("active");
            keycontrol_trigger = false;
            $("#ScreenSpaceTool.active").css("display", "none");
            $("#ScreenSpaceTool.active").removeClass("active");
        }
        //if already active:
        else {
            //deactivate previous SECOND button
            $(".sidemenu .second-button .button-menu.active").removeClass('active');

            $('#imageTool').attr('src', 'Images/icons/second_button/dark_red/' + themeFolder + '/tools2.png')
            $('#imageMeasure').attr('src', 'Images/icons/second_button/' + themeFolder + '/ruler_square2.png')
            $('#imageAdmin').attr('src', 'Images/icons/second_button/' + themeFolder + '/admin2.png')
            $('#imageNav').attr('src', '../Images/icons/second_button/' + themeFolder + '/navigate2.png')
            $('#imageAsset').attr('src', 'Images/icons/second_button/' + themeFolder + '/asset2.png')
            $('#imageBim ').attr('src', 'Images/icons/second_button/' + themeFolder + '/building2.png')
            $('#imageNrw ').attr('src', 'Images/icons/second_button/' + themeFolder + '/nrw2.png')

            //deactivate fourth layer button
            $(".admin-function.active").removeClass("active")
            $(".bottommenu").css("display", "none")

            //close THIRD button by:
            //relate SECOND button rel to THIRD button ID
            let menuToShow = $(this).attr('rel');
            //close and remove active class
            $("#" + menuToShow).animate({
                margin: "toggle",
            },
                50,
                function () {
                    $(this).removeClass("active");
                }
            );

            let topmenuToShow = $(".sidemenu  .third-button .admin").attr('rel');

            //close and deactivate FOURTH button row
            $("#" + topmenuToShow)
                .css({
                    "padding-top": 30,
                })
                .animate({
                    "padding-top": 0,
                },
                    100,
                    function () {
                        $(this).css("display", "none");
                        $(this).removeClass("active");
                    }
                );

            //deactivate third button active from showing fourth button
            $(".sidebar").animate({
                width: "0",
            },
                100,
                function () {
                    //$(this).css('width', '25%')
                    $(this).css("display", "none");
                    $(this).removeClass("active");
                }
            );
            neutralThirdbuttonActive();
        }

    })
    /////third button (tool)/////
    //if click third layer button (WITH SPECIFIC BUTTON GROUP, nav)
    $(".sidemenu .third-button .tool").on("click", function () {
        jqwidgetBox("function9-1", false);

        //Relate third button class rel to 4th button menu to be shown
        let thingtoShow = $(this).attr('rel');
        let thirdButtonClicked = $(this).attr('id')


        //Make 4th button active and show fourth button by:
        // checking if the fourth button  is NOT active.
        if (!$('#' + thirdButtonClicked).hasClass("active")) {

            if (thingtoShow == "lastminutetool") {
                $(".lastminutetool#ControlDiv").addClass('active')
                $(".lastminutetool#ControlDiv").css('display', 'flex')
                $(".lastminutetool#ScreenSpaceTool").addClass('active')
                $(".lastminutetool#ScreenSpaceTool").css('display', 'block')
            }

            //then, animate clicked fourth button and add class active
            $(".sidemenu .third-button .tool.active").removeClass('active')
            $('#' + thirdButtonClicked).addClass('active');

            $(".sidemenu .third-button .tool#home").removeClass('active')
            $(".sidemenu .third-button .tool#globe").removeClass('active')
            $(".sidemenu .third-button .tool#SwitchSceneMod").removeClass('active')
            $(".sidemenu .third-button .tool#SetCamAngle").removeClass('active')
            $(".sidemenu .third-button .tool#streetmaptoggle").removeClass('active')

            $(this).closest('button').find('id').not(this).removeClass('active');
            $(this).closest('button').find('id').not(this).css('display', 'none');

            switch (thirdButtonClicked) {
                case 'layer':
                    jqwidgetBox('function9-2-jqx', 1)
                    $(".sidemenu .third-button .tool.active").removeClass('active');
                    break;
                case 'move':
                    keycontrol_trigger = true;
                    break;
                case 'home':
                    OnClickHome();
                    break
                case 'globe':
                    OnClickGlobe();
                    break;
                case 'markupTools':
                    $("#markupTool").css("display", "block")
                    flagMarkupTools = true;
                    $(".sidemenu .third-button .tool.active").removeClass('active');
                    flagMarkupTools = true;
                    break;
                case 'reviewTools':
                    initReviewTools();
                    break;
                case 'reviewList':
                    getAllReviews()
                    break;
            }

        }
        //if already active:
        else {
            //remove active and close.
            $(".sidemenu .third-button .tool.active").removeClass('active')
            $("." + thingtoShow).removeClass('active')
            $("." + thingtoShow).css('display', 'none')
        }
    });

    ///third button (Measure)/////
    //if click third layer button(WITH SPECIFIC BUTTON GROUP, nav)
    $(".sidemenu .third-button .measure").on("click", function () {
        jqwidgetBox("function9-1", false);


        //Relate third button class rel to 4th button menu to be shown
        let sidebarToShow = $(this).attr('rel');
        let thirdButtonClicked = $(this).attr('id')

        // Make 4th button active and show fourth button by:
        // checking if the fourth button  is NOT active.
        if (!$('#' + thirdButtonClicked).hasClass("active")) {
            //then, animate clicked fourth button and add class active
            if (thirdButtonClicked == "aic") {
            } else {
                $(".sidemenu .third-button .measure.active").removeClass('active')
                $('#' + thirdButtonClicked).addClass('active');
            }
        }
        //if already active:
        else {
            //remove active and close.
            $(".sidemenu .third-button .measure.active").removeClass('active')
            $('#' + topbarToShow).css('display', 'none');
            $('#' + topbarToShow).removeClass('active');
        }

    });


    /////third button (admin)/////
    //if click third layer button (WITH SPECIFIC BUTTON GROUP, admin)
    $(".sidemenu .third-button .admin").on("click", function () {

        //Relate third button class rel to 4th button menu to be shown
        let topmenuToShow = $(this).attr('rel');
        let thirdButtonClicked = $(this).attr('id')
        //Make 4th button active and show fourth button by:
        // checking if the fourth button  is NOT active.
        if (!$('#' + thirdButtonClicked).hasClass("active")) {

            $('#' + topmenuToShow).removeClass('active');

            //then, animate clicked fourth button and add class active
            $(".sidemenu .third-button .admin.active").removeClass('active')
            $('#' + thirdButtonClicked).addClass('active');

            $(".admin-function.active").removeClass("active")
            $(".bottommenu").css("display", "none")

            if (thirdButtonClicked == "administrative") {
                $("#" + topmenuToShow).addClass("active");
                $("#" + topmenuToShow).css("display", "block");
                $('#' + thirdButtonClicked).removeClass('active');

                // ShowLocationDirectory(true);
                //jqwidgetBox("function9-1", 1);
            } else if (thirdButtonClicked == "uploadkmlfunction") {
                $("#" + topmenuToShow).addClass("active");
                $("#" + topmenuToShow).css("display", "block");
                $("#" + topmenuToShow)
                    .css({
                        "padding-top": -30,
                    })
                    .animate({
                        "padding-top": 0,
                    },
                        100
                    );
                //$("#kmldiv").show();
                $(".video-statuscontainer").css('display', 'none')
                hideAllWindow()
                $("#administrativeTool").css('display', 'none')
            } else if (thirdButtonClicked == 'layermanagement') {
                let buttoncontainer = document.getElementById("buttoncontainer")
                let lyr_container = document.getElementById("managelayer_container")
                lyr_container.insertAdjacentElement("afterbegin", buttoncontainer);
                $("#buttoncontainer").css("display", "none");
                $("#buttoncontainer").removeClass("active");
                $("#projectLayerManagement").html("")
                $.ajax({
                    type: "POST",
                    url: 'BackEnd/DataFunctions.php',
                    dataType: 'json',
                    data: { functionName: "getProjectLayerList" },
                    success: function (obj) {
                        obj.data.forEach((row) => {
                            let def_view;
                            if (row.Default_View == 0) {
                                def_view = "OFF"
                            } else {
                                def_view = "ON"
                            }
                            upload_date = new Date(row.Added_Date);
                            upload_date = upload_date.toDateString();
                            $("#projectLayerManagement").append(
                                "<tr onclick = 'OnClickLayerEdit(this)'>\
                                        <td>" + row.Data_ID + "</td>\
                                        <td>" + row.Layer_Name + "</td>\
                                        <td>" + row.Data_Type + "</td>\
                                        <td>" + def_view + "</td>\
                                        <td>" + upload_date + "</td>\
                                        <td style='display:none'>" + row.Data_Owner + "</td>\
                                    </tr>"
                            )
                        })
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        var str = textStatus + " " + errorThrown;
                        console.log(str);
                    }
                })

                $("#" + topmenuToShow).addClass("active");
                $("#" + topmenuToShow).css("display", "block");
                $("#" + topmenuToShow)
                    .css({
                        "padding-top": -30,
                    })
                    .animate({
                        "padding-top": 0,
                    },
                        200
                    );
                hideAllWindow()
                $("#administrativeTool").css('display', 'none')
            }  else if (thirdButtonClicked == "bumilist") {
                var datalistActionLink = JOGETLINK['cons_datalist_BP'];
                OnClickOpenBumiIframe(datalistActionLink)
                $(this).removeClass("active")
            }
        }
        //if already active:
        else {

            //remove active and close.
            $(".sidemenu .third-button .admin.active").removeClass('active')
            //remove active and close.
            $(".admin-function.active").removeClass('active')

            $("#" + topmenuToShow)
                .css({
                    "padding-top": 30,
                })
                .animate({
                    "padding-top": 0,
                },
                    100,
                    function () {
                        $("#" + topmenuToShow).css("display", "none");
                        $("#" + topmenuToShow).removeClass("active");
                    }
                );

        }
    });


    /////third button (Navigation)/////
    //if click third layer button (WITH SPECIFIC BUTTON GROUP, nav)
    $(".sidemenu .third-button .nav").on("click", function () {
        jqwidgetBox("function9-1", false);

        //Relate third button class rel to 4th button menu to be shown
        let menuToShow = $(this).attr('rel');
        let thirdButtonClicked = $(this).attr('id')
        if (thirdButtonClicked !== 'camera') {
            for (var i = 0; i < videoPinsArray.length; i++) {
                videoPinsArray[i].show = false;
            }
        }
        //Make 4th button active and show fourth button by:
        // checking if the fourth button  is NOT active.
        if (!$('#' + thirdButtonClicked).hasClass("active")) {
            //then, animate clicked fourth button and add class active

            $('.sidemenu .third-button .nav').removeClass('active');

            $('#' + thirdButtonClicked).addClass('active');

            if (thirdButtonClicked == 'arrangeview') {
                jqwidgetBox("function9-34-jqx", 1); //FolderDirectory
                changeSchedule()
                jqwidgetBox("function11", 1);
                $('#arrangeview').removeClass('active')
            } else if (thirdButtonClicked == 'directory') {
                // ShowFolderDirectory(true)
                jqwidgetBox("function9-34-jqx", 1); //FolderDirectory
                $('#directory').removeClass('active')
            } else if (thirdButtonClicked == 'ganttchart') {
                changeSchedule()
                // ShowGanttChart(true)
                jqwidgetBox("function11", 1);
                $('#ganttchart').removeClass('active')
            } else if (thirdButtonClicked == 'dashboard') {
                // ShowPowerBi(true)
                // ShowFolderDirectory(true)
                $('#dashboard').removeClass('active')
            } else if (thirdButtonClicked == 'camera') {
                //ShowLocationDirectory(false)
                // CameraFeed(true)
                jqwidgetBox("camerafeed", 1);
                jqwidgetBox("cameraheight", false);
                // CameraHeight(false); //tgok here later
                $('#camera').removeClass('active')
                for (var i = 0; i < videoPinsArray.length; i++) {
                    videoPinsArray[i].show = true;
                }
            } else if (thirdButtonClicked == 'assettable') {
                // ShowAssetTable(true)
                jqwidgetBox("json_AssetTable-jqx", 1);
                $('#assettable').removeClass('active')
            } else if (thirdButtonClicked == 'ridashboard') {
                $("#dashboardform").css("display", "block")
                $("#ridashboard").removeClass("active")
                if ($("#loadBoard > iframe").length == 0) {
                    if ($(".dashboardTab[rel='HSE']").length != 0) $(".dashboardTab[rel='projectSummary']").click()
                } else {
                    $(".dashboardTab.active").click();
                }
            }else if (thirdButtonClicked == "bumilistManager") {
                var datalistActionLink = JOGETLINK['cons_datalist_BP']
                OnClickOpenBumiIframe(datalistActionLink)
                $(this).removeClass("active")
            }else if (thirdButtonClicked == 'nrwthematic') {
                $('#thematicLayer').children().remove().end();
                $('#layergrouplist input[type=checkbox]').each(function() {
                    if ($(this).is(":checked")) {
                        var firstCheck = $(this).next(".fileicon")[0];
                        if(firstCheck){
                            var type = firstCheck.attributes.title.nodeValue;
                            var name = $(this).next().next()[0].innerHTML;
                            if (type == "KML/KMZ"){
                                var chkid = $(this).attr('id');
                                chkid = chkid.substring(chkid.indexOf('_')+1);
                                $('#thematicLayer').append($('<option>',
                                    {
                                        value: chkid,
                                        text : name
                                    }
                                ));
                            }
                        }
                        
                    }
                });
                jqwidgetBox("thematic-jqx", 1);
                $('#' + thirdButtonClicked).removeClass('active');
            }else if (thirdButtonClicked == 'earthMine') {
                jqwidgetBox("earthFeed-jqx", 1);
                $('#' + thirdButtonClicked).removeClass('active');
            }

        }
        //if already active:
        else {
            //remove active and close.
            if ($("#" + menuToShow).hasClass("bottommenu")) {
                $(".admin-function.active").removeClass("active")
                $(".bottommenu").css("display", "none")

            } else if ($("#" + menuToShow).hasClass("sidebar")) {
                $("#" + menuToShow).animate({
                    width: "0",
                },
                    100,
                    function () {
                        //$(this).css('width', '25%')
                        $(this).css("display", "none");
                        $(this).removeClass("active");
                    }
                );
            }
            $(".sidemenu .third-button .nav.active").removeClass('active')
        }
    });

 
    /////    Saving and closing the pinpoint tool   /////
    $(".toolcontainer .inputcontainer .column1.button .save").on("click", function () {
        $("#draw.active").removeClass('active')
        $("#addcamera.active").removeClass('active')
    });

    $(".toolcontainer .inputcontainer .column2.button .cancel").on("click", function () {
        $("#draw.active").removeClass('active')
        $("#addcamera.active").removeClass('active')
        hideinstruction()
        instructions("")
        //resetpinpointtoolVlaue();
        document.getElementsByTagName("body")[0].style.cursor = "default";
    });
    var orderStart
    var orderEnd
    $("#sortable").sortable({
        placeholder: "highlight",
        axis: 'y',
        revert: 100
        //    start: function( event, ui ) {
        //        //currently dragged item
        //        orderStart = $(ui.item).index();
        //    },
        //    stop: function(event, ui){
        //    // console.log($(ui.item).index()) //currently dragged item
        //     orderEnd = $(ui.item).index();
        //     let ele = $(ui.item)[0]
        //     let id = ele.id 
        //     kmlOrdering(id, orderStart, orderEnd)
        //    }
    });

    //functin for clicking the right-click menu button

    // $("#rightclickMenu .menu .menu-item").mouseenter(function () {
    //     let menutoOpen = $(this).attr("rel")

    //     if (!$("#" + menutoOpen).hasClass("active")) {
    //         $("#" + menutoOpen).addClass("active")
    //     }
    // })

    // All fucntion for Right Click Menu

    $('.sub-menu-item').mouseover(function(){
        let menuItem = $(this).siblings('[class=menu-item]')

        Array.prototype.forEach.call(menuItem, function(el){
            let rel = $(el).attr('rel')
            
            $('.sub-rightclickMenu#'+rel).removeClass('active')
        })
    })

    $(".menu-item").mouseover(function () {
        let menutoOpen = $(this).attr("rel")
        let parentRel = $(this).parent().parent().attr('id')
        let parentContainer = $(`.menu-item[rel='${parentRel}']`).parent().parent()
        
        let pos = $(this).parent().parent().position()
        let menuwidth = $(this).parent().parent().width()
        let pos2 = $(this).position()

        let windowHeight = $(window).height()
		let windowWidth = $(window).width()
        let subMenuWidth = $("#" + menutoOpen).width()
        let subMenuHeight = $("#" + menutoOpen).height()

        let x = pos.left + menuwidth;
        let y = pos2.top + pos.top;
        let x2 = pos.left - subMenuWidth;


        let remainX = windowWidth - x
        let remainY = windowHeight - y
        let differenceX = remainX - subMenuWidth
        let differenceY = remainY - subMenuHeight

        if (differenceX <0){
                $(".sub-rightclickMenu.active").removeClass("active")
                $(parentContainer).addClass("active")
                $(this).parent().parent().addClass('active')
                $("#" + menutoOpen).css("left", x2 + "px")
                $("#" + menutoOpen).addClass("active")
                if (differenceY <0){
                    $("#" + menutoOpen).css("top", y + differenceY + "px")
                }else{
                    $("#" + menutoOpen).css("top", y + "px")
                }
        }else{
            if (!$("#" + menutoOpen).hasClass("active")) {
                $(".sub-rightclickMenu.active").removeClass("active")
                $(parentContainer).addClass("active")
                $(this).parent().parent().addClass('active')
                $("#" + menutoOpen).css("left", x + "px")
                if (differenceY <0){
                    $("#" + menutoOpen).css("top", y + differenceY + "px")
                }else{
                    $("#" + menutoOpen).css("top", y + "px")
                }
                $("#" + menutoOpen).addClass("active")
            }
        }
    })


    $("#ConOpBrowser-button").on("click", function () {
        ConOpBrowser()
        $("#rightclickMenu").removeClass("active")
    })

    $("#assetMaintenance-button").on("click", function () {
        AssetMtnBrowser()
        $("#rightclickMenu").removeClass("active")
    })

    $(".menu-item").click(
        function () {
            if (!$(this).is('[rel]')) {
                $("#rightclickMenu").removeClass("active")
            }
        })

    $(".sub-menu-item").click(
        function () {
            $(".sub-rightclickMenu.active").removeClass("active")
            $("#rightclickMenu").removeClass("active")

        })

    $(".dashboardTab").on("click", function () {
        $('.printContent').addClass('hasContent')
        $(".dashboardTab").removeClass("active")
        $(this).addClass("active")
        let $pagetoOpen = $(this).attr("rel")
        $pagetoOpen = (localStorage.Project_type == "ASSET") ? "Asset/"+$pagetoOpen : $pagetoOpen;
        $("#loadBoard").html('<iframe id="printf" type="text/html" allow="fullscreen" src="dashboard/' + $pagetoOpen + '.php" ></iframe>');
    })

    $("#printIframeInner").on("click", function () {
        var tabsActive = $('.tabContainer .tabs .dashboardTab.active').attr("rel")

        if(!$('.printContent').hasClass('hasContent')){
        }else{
            $('#printf')[0].contentWindow.postMessage({functionName:'print'})
           
            if(tabsActive == "projectSummary"){
                $('#printf').parent().parent().parent().css("width", "1000px")
                $('#printf').parent().parent().parent().css("height", "750px")
            }else if(tabsActive == "Risk_PBHS" || tabsActive == "Quality_PBHS" || tabsActive == "HSE_PBHS" || tabsActive == "Land_PBHS" || tabsActive == "Document_PBHS")
            {
                $('#printf').parent().parent().parent().css("width", "1300px")
                $('#printf').parent().parent().parent().css("height", "700px")
            }else if(tabsActive == "PublicComplaint_PBHS" || tabsActive == "PlanningManagement_PBHS"){
                $('#printf').parent().parent().parent().css("width", "1300px")
                $('#printf').parent().parent().parent().css("height", "670px")
            }
        }
        
    })

    window.addEventListener("message", (event) => {
        if(event.origin != location.origin) return;
        if(event.data && event.data.functionName && event.data.functionName == 'defaultWidth'){
            $('#printf').parent().parent().parent().css("width", "")
            $('#printf').parent().parent().parent().css("height", "")
        }
    })

    $(".conopButton #changeNameConop").on("click", function () {
        if ($(this).hasClass("active")) {
            $("#changeNameConop").removeClass("active");
        }
        else{
            $("#changeNameConop").addClass("active");
        }

        $('#tabConop > .tabs-item > .tab').each(function(idx, ele){
            var fulltext = $(ele).attr('title');
            var tooltipText = $(ele).html();
            
            $(ele).html(fulltext);
            $(ele).attr('title', tooltipText);
        })

        let conopHeight = $("#conopbrowser").height()
        let tabHeight = $("#conopbrowser #tabConop").height()
        let contentHeight = conopHeight - tabHeight;

        $("#contentConop").css("height", contentHeight)

    })

    $(".conopButton #changeNameAssignment").on("click", function () {
        if ($(this).hasClass("active")) {
            $("#changeNameAssignment").removeClass("active");
        }
        else{
            $("#changeNameAssignment").addClass("active");
        }

        $('#tabAssignment > .tabs-item > .tab').each(function(idx, ele){
            var fulltext = $(ele).attr('title');
            var tooltipText = $(ele).html();
            
            $(ele).html(fulltext);
            $(ele).attr('title', tooltipText);
        })

        let conopHeight = $("#assignmentsContainer").height()
        let tabHeight = $("#tabAssignment").height()
        let contentHeight = conopHeight - tabHeight;

        $("#contentAssignment").css("height", contentHeight)

    })
});

$(".conopButton #changeNameAssetMtn").on("click", function () {
    console.log("-")
    if ($(this).hasClass("active")) {
        $("#changeNameAssetMtn").removeClass("active");
    }
    else{
        $("#changeNameAssetMtn").addClass("active");
    }

    $('#tabAssetMtn > .tabs-item > .tab').each(function(idx, ele){
        var fulltext = $(ele).attr('title');
        var tooltipText = $(ele).html();
        
        $(ele).html(fulltext);
        $(ele).attr('title', tooltipText);
    })

})

$(document).on('change', 'input:radio[name="aerialEditCat"]', function() {
    var column2 = $('#aerialEditContainer').children().children().children('.column2')
   
    column2.css('display', 'flex')
});

/// function for clicking the checkbox button in the edit entitty form in index page///
$("#changePWPath").on("change", function () {
    if (!$("#changePWPath").is(':checked')) {
        $(".modal-container#editentity .doublefield.appearoncheck").css('display', 'none')
        $(".modal-container#editentity #folderRoot.appearoncheck").css('display', 'none')
        //  $(".modal-container#editentity #refreshpwfolder.appearoncheck").css('display','none')
    } else {
        //  $(".modal-container#editentity .doublefield.appearoncheck").css('display','flex')
        $(".modal-container#editentity #folderRoot.appearoncheck").css('display', 'block')
        // $(".modal-container#editentity #refreshpwfolder.appearoncheck").css('display','block')
        getProjectWiseFolders();
    }
});

$("#changeSPPath").on("change", function () {
    if (!$("#changeSPPath").is(':checked')) {
        $(".modal-container#editentity .doublefield.appearoncheck").css('display', 'none')
        $(".modal-container#editentity #folderRootSP.appearoncheck").css('display', 'none')
    } else {
        $(".modal-container#editentity #folderRootSP.appearoncheck").css('display', 'block')
        getSharePointFolders();
    }
});

// function for clicking the theme item in the theme selection window.
function themeselect(ele) {
    let themetoselect = $(ele).attr("rel");
    $(".container-cards .card input.log").prop("checked", false);
    $("input#" + themetoselect).prop("checked", true);
}

// reserved for other tabs and pages (dont remove)

// $("ul .tab").on("click", function () {
//     let $pagetoopen = $(this).attr("rel");
//     let $tabclicked = $(this).attr("id");

//     $(".tabs-item .tab.active").removeClass("active");
//     $("#" + $tabclicked).addClass("active");


function toggleList(e) {
    let $listToToggle = $(e).attr("rel")

    if ($listToToggle == "layer_div") {
        var searchBar = document.getElementById("search_div");
        if (!$(".searchTable").hasClass("active")) {
            $(searchBar).addClass("active")
            $(searchBar).slideDown(100)
        } else {
            $(searchBar).removeClass("active")
            $(searchBar).slideUp(100)
        }
    }

    if (!$("#" + $listToToggle).hasClass("active")) {
        $(e).addClass("active")
        $("#" + $listToToggle).addClass("active")
        $("#" + $listToToggle).slideDown(100)
    } else {
        $(e).removeClass("active")
        $("#" + $listToToggle).removeClass("active")
        $("#" + $listToToggle).slideUp(100)
    }
}


function hideAllWindow() {
    jqwidgetBox("function9-2-jqx", false);
    jqwidgetBox("AicViewer-jqx", false);
    jqwidgetBox("function9-34-jqx", false);
    jqwidgetBox("json_AssetTable-jqx", false);
    jqwidgetBox("thematic-jqx", false);
    jqwidgetBox("dataviewer", false);
    jqwidgetBox("reservoir", false);
    jqwidgetBox("legendToolList", false);
    jqwidgetBox("function11", false);
    jqwidgetBox("camerafeed", false);
    jqwidgetBox("function10", false);
    jqwidgetBox("drawTool", false);
    jqwidgetBox("landConfigure", false);
    jqwidgetBox("function20", false);
    jqwidgetBox("pintpointTool", false);
    jqwidgetBox("cameraheight", false);
    jqwidgetBox("IModelJs", false);
    jqwidgetBox("PWShare", false);
    jqwidgetBox("PWIssue", false);
    jqwidgetBox("function9-1", false);
    jqwidgetBox("earthmine-jqx", false);
    jqwidgetBox("function14", false);
    jqwidgetBox("earthFeed-jqx", false);
    jqwidgetBox("markupTools-jqx", false);
    jqwidgetBox("videoframe", false);
    jqwidgetBox("assignments", false);
    jqwidgetBox("ConOpBrowser", false);
    jqwidgetBox("AssetMtnBrowser", false);
    jqwidgetBox("appWindow", false);
    jqwidgetBox("addImage", false);
    jqwidgetBox("bumiParticipant", false);
    jqwidgetBox("bumiParticipant-packageList", false);
    jqwidgetBox("paveanalysis", false);
    jqwidgetBox("analysisUpl", false);
    jqwidgetBox("AssetInboxBrowser", false);
}

function jqwidgetBox(divID, wshow) {

    if (wshow == true) {
        $("#" + divID).parent().parent().parent().show();
        $("#" + divID).parent().parent().parent().css({'z-index':'3 !important'});
        $("#" + divID).parent().parent().parent().css("width", "auto");
        $("#" + divID).parent().parent().parent().css("height", "auto");

    } else {
        $("#" + divID).parent().parent().parent().hide();
    }
}

var earthPhotosphere;
var planePrimitive;
function earth360(url, long, lat, height, initHeading) {
    url = "../" + url;
    
    viewer.scene.primitives.remove(planePrimitive);
    document.querySelector('#viewer').innerHTML = "";
    var addInit = initHeading * (Math.PI / 180);

    earthPhotosphere = new PhotoSphereViewer.Viewer({
        container: document.querySelector('#viewer'),
        panorama: url,
        defaultLong: addInit
    });

    var position = Cesium.Cartesian3.fromDegrees(long, lat, height);
    var heading = Cesium.Math.toRadians(0.0);
    var pitch = Cesium.Math.toRadians(-20.0);
    var hpRoll = new Cesium.HeadingPitchRoll(heading);
    var fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator(
        "north",
        "west"
    );

    //add model to cesium
    planePrimitive = viewer.scene.primitives.add(
        Cesium.Model.fromGltf({
            url: "Images/Cesium_Man.glb",
            modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
                position,
                hpRoll,
                Cesium.Ellipsoid.WGS84,
                fixedFrameTransform
            ),
            minimumPixelSize: 128,
        })
    );

    var cacheHeading = initHeading; //if there's an initial heading set for the paranoma, replace this
    earthPhotosphere.on("position-updated", (e, position) => {
        var diff = Math.abs(cacheHeading - position.longitude);
        if (position.longitude > cacheHeading) {
            hpRoll.heading += diff;
            if (hpRoll.heading > Cesium.Math.TWO_PI) {
                hpRoll.heading -= Cesium.Math.TWO_PI;
            }
        } else if (position.longitude < cacheHeading) {
            hpRoll.heading -= diff;
            if (hpRoll.heading < 0.0) {
                hpRoll.heading += Cesium.Math.TWO_PI;
            }
        }
        cacheHeading = position.longitude;
    });
    //this is where cesium updates the orientation of model
    viewer.scene.preUpdate.addEventListener(function (scene, time) {
        Cesium.Transforms.headingPitchRollToFixedFrame(
            position,
            hpRoll,
            Cesium.Ellipsoid.WGS84,
            fixedFrameTransform,
            planePrimitive.modelMatrix
        );
    });
}

function markupToolsCleanup() {
    $("#input-text").css('display', "none");
    $("#markupTool").css("display", "none"); //close the tool menu
    flagMarkupTools = false;
    $("body").css("cursor", "default"); // reset the cursor to default
    $("#jqxwindow-text").jqxWindow('close'); //close the text window
    resetDrawMarkupTool(); //remove drawings
    removeBillboardMarkupTool(); // remove pins
    removeLabelMarkupTool(); //remove labels
    flagMarkupTools = false;
    hideinstruction()
    instructions("")
}

function closeAdminTool() {
    hideinstruction()
    instructions("")

    $("#administrativeTool").css("display", "none"); //close the tool menu
    jqwidgetBox("function9-1", false);
}