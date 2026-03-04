var projectUsers = [];
var dataDetails;
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

var constructOwnerRoles = ["Bumi Officer","Construction Engineer","Corporate Comm Officer","Director","Doc Controller","Finance Head","Finance Officer","Land Officer","Planning Engineer","Project Manager","Project Monitor","QAQC Engineer","Risk Engineer","Safety Officer","Zone Manager"];
var assetOwnerRoles = ["Senior Quantity Surveyor", "Quantity Surveyor","Divisional Engineer","Assistant Director (Road Asset)","Assistant Engineer (Division)","Civil Engineer (Division)","Senior Civil Engineer (Road Asset)","Facility Management Department","Head of Contract","Head of Finance","Contract Assistance","Head of Section","Asset Engineer Section","Technical Inspector Section"];
var allOwnerRoles = constructOwnerRoles.concat(assetOwnerRoles)
var ownerRoles = (localStorage.Project_type == 'ASSET') ? assetOwnerRoles : constructOwnerRoles;
var monthToNumAr = {"Jan" : '01',"Feb" : '02',"Mar" : '03',"Apr" : '04',"May" : '05',"Jun" : '06',"Jul" : '07',"Aug" : '08',"Sep" : '09',"Oct" : '10',"Nov" : '11',"Dec" : '12'};

var aicIdEach;

function changebackgroundinitialcolor() {
    let initial = obj.firstname.substring(0, 1);
    // /let initial = str.substring(0,1)

    alert(initial);

    if (
        initial == "A" ||
        initial == "a" ||
        initial == "J" ||
        initial == "j" ||
        initial == "S" ||
        initial == "s"
    ) {
        $(".profileUserViewID .infoContent .infoPicture").css(
            "background",
            col_ajs
        );
        $(".profileUserViewID .infoContent .infoPicture .infoInitial").css(
            "background",
            col_ajs
        );
    } else if (
        initial == "B" ||
        initial == "b" ||
        initial == "K" ||
        initial == "k" ||
        initial == "T" ||
        initial == "t"
    ) {
        $(".profileUserViewID .infoContent .infoPicture").css(
            "background",
            col_bkt
        );
        $(".profileUserViewID .infoContent .infoPicture .infoInitial").css(
            "background",
            col_bkt
        );
    } else if (
        initial == "C" ||
        initial == "c" ||
        initial == "L" ||
        initial == "l" ||
        initial == "U" ||
        initial == "u"
    ) {
        $(".profileUserViewID .infoContent .infoPicture").css(
            "background",
            col_clu
        );
        $(".profileUserViewID .infoContent .infoPicture .infoInitial").css(
            "background",
            col_clu
        );
    } else if (
        initial == "D" ||
        initial == "d" ||
        initial == "M" ||
        initial == "m" ||
        initial == "V" ||
        initial == "v"
    ) {
        $(".profileUserViewID .infoContent .infoPicture").css(
            "background",
            col_dmv
        );
        $(".profileUserViewID .infoContent .infoPicture .infoInitial").css(
            "background",
            col_dmv
        );
    } else if (
        initial == "E" ||
        initial == "e" ||
        initial == "N" ||
        initial == "n" ||
        initial == "W" ||
        initial == "w"
    ) {
        $(".profileUserViewID .infoContent .infoPicture").css(
            "background",
            col_enw
        );
        $(".profileUserViewID .infoContent .infoPicture .infoInitial").css(
            "background",
            col_enw
        );
    } else if (
        initial == "F" ||
        initial == "f" ||
        initial == "O" ||
        initial == "o" ||
        initial == "X" ||
        initial == "x"
    ) {
        $(".profileUserViewID .infoContent .infoPicture").css(
            "background",
            col_fox
        );
        $(".profileUserViewID .infoContent .infoPicture .infoInitial").css(
            "background",
            col_fox
        );
    } else if (
        initial == "G" ||
        initial == "g" ||
        initial == "P" ||
        initial == "p" ||
        initial == "Y" ||
        initial == "y"
    ) {
        $(".profileUserViewID .infoContent .infoPicture").css(
            "background",
            col_gpy
        );
        $(
            ".profileUserViewID .infoContent .infoPicture .newuserIninfoInitialitial"
        ).css("background", col_gpy);
    } else if (
        initial == "H" ||
        initial == "h" ||
        initial == "Q" ||
        initial == "q" ||
        initial == "Z" ||
        initial == "z"
    ) {
        $(".profileUserViewID .infoContent .infoPicture").css(
            "background",
            col_hqz
        );
        $(".profileUserViewID .infoContent .infoPicture .infoInitial").css(
            "background",
            col_hqz
        );
    } else if (
        initial == "I" ||
        initial == "i" ||
        initial == "R" ||
        initial == "r"
    ) {
        $(".profileUserViewID .infoContent .infoPicture").css("background", col_ir);
        $(".profileUserViewID .infoContent .infoPicture .infoInitial").css(
            "background",
            col_ir
        );
    }
}

function closeAllMain() {
    $("#main-user.active").css("display", "none");
    $("#main-user.active").removeClass("active");

    $("#main-project").css("display", "none");
    $("#main-project").removeClass("active");

    $("#main-project-dashboard").css("display", "none");
    $("#main-project-dashboard").removeClass("active");

    $("#main-layerdata.active").css("display", "none");
    $("#main-layerdata.active").removeClass("active");

    $("#main-projectwise.active").css("display", "none");
    $("#main-projectwise.active").removeClass("active");

    $('#main-projectwise365.active').css('display', 'none') //#webserviceID 
    $('#main-projectwise365.active').removeClass('active') //#webserviceID

    $('#main-schedule.active').css('display', 'none')
    $('#main-shcedule.active').removeClass('active')

    $('#main-projectwise365.active').css('display', 'none') //#webserviceID 
    $('#main-projectwise365.active').removeClass('active') //#webserviceID

    $("#main-aerial.active").css("display", "none");
    $("#main-aerial.active").removeClass("active");

    $("#main-schedule.active").css("display", "none");
    $("#main-shcedule.active").removeClass("active");

    $('#main-schedulemap.active').css('display', 'none')
    $('#main-shcedulemap.active').removeClass('active')

    $("#main-powerbi.active").css("display", "none");
    $("#main-powerbi.active").removeClass("active");

    $("#main-eot.active").css("display", "none");
    $("#main-eot.active").removeClass("active");
}

function openNavbar() {
    $(window).resize(function () {
        //$('.loadingcontainer-mainadmin').css('width', 'calc(100% - 310px)').animate({width: '-=230px'}, 100);
        $('#main-user').css('width', '100%').css('width', '-=270px')
        $('#main-layerdata').css('width', '100%').css('width', '-=270px');
        $('#main-project').css('width', '100%').css('width', '-=270px');
        $('#main-project-dashboard').css('width', '100%').css('width', '-=270px');
        $('#main-aerial').css('width', '100%').css('width', '-=270px');
        $('#main-schedule').css('width', '100%').css('width', '-=270px');
        $('#main-schedulemap').css('width', '100%').css('width', '-=270px');
        $('#main-projectwise').css('width', '100%').css('width', '-=270px');
        $('#main-powerbi').css('width', '100%').css('width', '-=270px');
        $('#main-projectwise365').css('width', '100%').css('width', '-=270px'); //#webserviceID 
        $('#main-eot').css('width', '100%').css('width', '-=270px');
        //$('.searchUser').css('width', 'calc(100% - 105px)').css('width', 'calc(100% - 350px)'); 
    })

    if ($(window).width() <= "1366") {
        $("#sidebar-admin").addClass("active");
        $("#sidebar-admin").css({ width: 43, }).animate({ width: "220px", }, 100, function () {
            $(".sidebar-items li a").fadeIn(50);
            $(".sidebar-items li div.arrow").fadeIn(50);
        });

        //$('.loadingcontainer-mainadmin').css('width', 'calc(100% - 70px)').animate({width: '-=230px'}, 100);
        $("#main-user").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#main-layerdata").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $('#main-project').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
        $('#main-project-dashboard').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
        $('#main-aerial').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
        $('#main-schedule').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
        $('#main-schedulemap').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
        $('#main-projectwise').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
        $('#main-powerbi').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
        $('#main-projectwise365').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100); //#webserviceID 
        $('#main-eot').css('width', 'calc(100% - 70px)').animate({ width: '-=190px' }, 100);
        //$('.searchUser').css('width', 'calc(100% - 105px)').css('width', 'calc(100% - 355px)');
    } else if (window.devicePixelRatio >= 1.25) {
        $("#sidebar-admin").addClass("active");
        $("#sidebar-admin").css({ width: 43, }).animate({ width: "200px", }, 100, function () {
            $(".sidebar-items li a").fadeIn(50);
            $(".sidebar-items li div.arrow").fadeIn(50);
        });

        //$('.loadingcontainer-mainadmin').css('width', 'calc(100% - 70px)').animate({width: '-=230px'}, 100);
        $("#main-user").css("width", "calc(100% - 70px)").animate({ width: "-=160px", }, 100);
        $("#main-layerdata").css("width", "calc(100% - 70px)").animate({ width: "-=160px", }, 100);
        $('#main-project').css('width', 'calc(100% - 70px)').animate({ width: '-=160px' }, 100);
        $('#main-project-dashboard').css('width', 'calc(100% - 70px)').animate({ width: '-=160px' }, 100);
        $('#main-aerial').css('width', 'calc(100% - 70px)').animate({ width: '-=160px' }, 100);
        $('#main-schedule').css('width', 'calc(100% - 70px)').animate({ width: '-=160px' }, 100);
        $('#main-schedulemap').css('width', 'calc(100% - 70px)').animate({ width: '-=160px' }, 100);
        $('#main-projectwise').css('width', 'calc(100% - 70px)').animate({ width: '-=160px' }, 100);
        $('#main-powerbi').css('width', 'calc(100% - 70px)').animate({ width: '-=160px' }, 100);
        $('#main-projectwise365').css('width', 'calc(100% - 70px)').animate({ width: '-=160px' }, 100); //#webserviceID 
        $('#main-eot').css('width', 'calc(100% - 70px)').animate({ width: '-=160px' }, 100);
    } else {
        $("#sidebar-admin").addClass("active");
        $("#sidebar-admin").css({ width: 60, }).animate({ width: "300px", }, 100, function () {
            $(".sidebar-items li a").fadeIn(50);
            $(".sidebar-items li div.arrow").fadeIn(50);
        });

        //$('.loadingcontainer-mainadmin').css('width', 'calc(100% - 70px)').animate({width: '-=230px'}, 100);
        $("#main-user").css("width", "calc(100% - 70px)").animate({ width: "-=270px", }, 100);
        $("#main-layerdata").css("width", "calc(100% - 70px)").animate({ width: "-=270px", }, 100);
        $('#main-project').css('width', 'calc(100% - 70px)').animate({ width: '-=270px' }, 100);
        $('#main-project-dashboard').css('width', 'calc(100% - 70px)').animate({ width: '-=270px' }, 100);
        $('#main-aerial').css('width', 'calc(100% - 70px)').animate({ width: '-=270px' }, 100);
        $('#main-schedule').css('width', 'calc(100% - 70px)').animate({ width: '-=270px' }, 100);
        $('#main-schedulemap').css('width', 'calc(100% - 70px)').animate({ width: '-=270px' }, 100);
        $('#main-projectwise').css('width', 'calc(100% - 70px)').animate({ width: '-=270px' }, 100);
        $('#main-powerbi').css('width', 'calc(100% - 70px)').animate({ width: '-=270px' }, 100);
        $('#main-projectwise365').css('width', 'calc(100% - 70px)').animate({ width: '-=270px' }, 100); //#webserviceID 
        $('#main-eot').css('width', 'calc(100% - 70px)').animate({ width: '-=270px' }, 100);
        //$('.searchUser').css('width', 'calc(100% - 105px)').css('width', 'calc(100% - 355px)');
    }
}

function closeNavbar() {
    $(window).resize(function () {
        //$('.loadingcontainer-mainadmin').css('width', '100%').css('width', '-=60px');
        $("#main-user").css("width", "100%").css("width", "-=100px");
        $("#main-layerdata").css("width", "100%").css("width", "-=100px");
        $("#main-project").css("width", "100%").css("width", "-=100px");
        $("#main-project-dashboard").css("width", "100%").css("width", "-=100px");
        $("#main-aerial").css("width", "100%").css("width", "-=100px");
        $("#main-schedule").css("width", "100%").css("width", "-=100px");
        $('#main-schedulemap').css('width', '100%').css('width', '-=100px');
        $("#main-projectwise").css("width", "100%").css("width", "-=100px");
        $('#main-projectwise365').css('width', '100%').css('width', '-=100px'); //#webserviceID
        $('#main-powerbi').css('width', '100%').css('width', '-=100px');
        $("#main-eot").css("width", "100%").css("width", "-=100px");
        //$('.searchUser').css('width', 'calc(100% - 355px)').css('width', 'calc(100% - 105px)');
    });

    if ($(window).width() <= "1366") {
        $(".sidebar-items .adminItems").removeClass("active");
        $(".sidebar-items .admin-subbuttons").css("display", "none");
        $(".sidebar-items li a").fadeOut(50);
        $(".sidebar-items li div.arrow").fadeOut(50);
        $(".sidebar-items .adminItems div.arrow").removeClass("active");
        $("#sidebar-admin").removeClass("active");
        $("#sidebar-admin").fadeIn().css({ width: 220, }).animate({ width: "43px", }, 100);

        //$('.loadingcontainer-mainadmin').css('width', '100%').css('width', '-=60px');
        $("#main-user").css("width", "100%").css("width", "-=80px");
        $("#main-layerdata").css("width", "100%").css("width", "-=80px");
        $("#main-project").css("width", "100%").css("width", "-=80px");
        $("#main-project-dashboard").css("width", "100%").css("width", "-=80px");
        $("#main-aerial").css("width", "100%").css("width", "-=80px");
        $("#main-schedule").css("width", "100%").css("width", "-=80px");
        $('#main-schedulemap').css('width', '100%').css('width', '-=80px');
        $('#main-projectwise').css('width', '100%').css('width', '-=80px');
        $('#main-projectwise365').css('width', '100%').css('width', '-=80px'); //#webserviceID
        $('#main-powerbi').css('width', '100%').css('width', '-=80px');
        $("#main-eot").css("width", "100%").css("width", "-=80px");

    } else if (window.devicePixelRatio >= 1.25) {
        $(".sidebar-items .adminItems").removeClass("active");
        $(".sidebar-items .admin-subbuttons").css("display", "none");
        $(".sidebar-items li a").fadeOut(50);
        $(".sidebar-items li div.arrow").fadeOut(50);
        $(".sidebar-items .adminItems div.arrow").removeClass("active");
        $("#sidebar-admin").removeClass("active");
        $("#sidebar-admin").fadeIn().css({ width: 200, }).animate({ width: "43px", }, 100);

        //$('.loadingcontainer-mainadmin').css('width', '100%').css('width', '-=60px');
        $("#main-user").css("width", "100%").css("width", "-=80px");
        $("#main-layerdata").css("width", "100%").css("width", "-=80px");
        $("#main-project").css("width", "100%").css("width", "-=80px");
        $("#main-project-dashboard").css("width", "100%").css("width", "-=80px");
        $("#main-aerial").css("width", "100%").css("width", "-=80px");
        $("#main-schedule").css("width", "100%").css("width", "-=80px");
        $('#main-schedulemap').css('width', '100%').css('width', '-=80px');
        $('#main-projectwise').css('width', '100%').css('width', '-=80px');
        $('#main-projectwise365').css('width', '100%').css('width', '-=80px'); //#webserviceID
        $('#main-powerbi').css('width', '100%').css('width', '-=80px');
        $("#main-eot").css("width", "100%").css("width", "-=80px");
    } else {
        $(".sidebar-items .adminItems").removeClass("active");
        $(".sidebar-items .admin-subbuttons").css("display", "none");
        $(".sidebar-items li a").fadeOut(50);
        $(".sidebar-items li div.arrow").fadeOut(50);
        $(".sidebar-items .adminItems div.arrow").removeClass("active");
        $("#sidebar-admin").removeClass("active");
        $("#sidebar-admin").fadeIn().css({ width: 300, }).animate({ width: "60px", }, 100);

        //$('.loadingcontainer-mainadmin').css('width', '100%').css('width', '-=60px');
        $("#main-user").css("width", "100%").css("width", "-=100px");
        $("#main-layerdata").css("width", "100%").css("width", "-=100px");
        $("#main-project").css("width", "100%").css("width", "-=100px");
        $("#main-project-dashboard").css("width", "100%").css("width", "-=100px");
        $("#main-aerial").css("width", "100%").css("width", "-=100px");
        $("#main-schedule").css("width", "100%").css("width", "-=100px");
        $('#main-schedulemap').css('width', '100%').css('width', '-=100px');
        $('#main-projectwise').css('width', '100%').css('width', '-=100px');
        $('#main-projectwise365').css('width', '100%').css('width', '-=100px'); //#webserviceID
        $('#main-powerbi').css('width', '100%').css('width', '-=100px');
        $("#main-eot").css("width", "100%").css("width", "-=100px");
    }
}

function editProject() {
    $(".project-container .formcontainerMainBody .project-view#readonly").hide();
    $(".project-container .formcontainerMainBody .project-view#edit").show();
    $("#editcurrentProject").hide();
    $("#savecurrentProject").show();
    $("#cancelcurrentProject").show();

    //make industry and timezone field readonly
    $("select#projectindustry").attr('disabled', 'disabled');
    $("select#projectindustry").css({ "background": "lightgrey", "cursor": "not-allowed" });
    $("select#projecttimezone").attr('disabled', 'disabled');
    $("select#projecttimezone").css({ "background": "lightgrey", "cursor": "not-allowed" });


    //copy field value
    $("#projectid").val($("#projectiddisplay").html());
    $("#projectname").val($("#newprojectheaderDisplay").html());
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
    }
    ReadEntity = viewer.entities.add({
        selectable: false,
        show: true,
        rectangle: {
            coordinates: readRectangle,
            material: Cesium.Color.YELLOW.withAlpha(0.1),
        },
    });
    viewer.camera.setView({
        destination: readRectangle,
    });
};

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
    $(".popupboxfooter .popupbutton button").on("click", function () {
        let popuptoClose = $(this).attr("rel");
        $("#" + popuptoClose).css("display", "none");
    });

    //animation for clicking the hamburger admin button
    $(".sidebar-items .adminHead").on("click", function () {
        if (!$("#sidebar-admin").hasClass("active")) {
            openNavbar();
        } else {
            closeNavbar();
        }
    });

    //animation for clicking the user button
    $(".sidebar-items .adminItems").on("click", function () {
        let buttonClicked = $(this).attr("id");
        let subbuttonOpen = $(this).attr("rel");
        let subbuttonHide = $(".adminItems.active").attr("rel");
        var arrowchange = $("#" + buttonClicked + " div.arrow");
        if (!$(this).hasClass("active") && $("#sidebar-admin").hasClass("active")) {
            $(".sidebar-items .adminItems.active").removeClass("active");
            $("#" + buttonClicked).addClass("active");
            $("#" + subbuttonOpen).slideDown(100);
            $("#" + subbuttonHide).slideUp(100);
            $("#" + subbuttonHide).removeClass("active");
            $(".adminItems div.arrow.active").removeClass("active");
            $(arrowchange).addClass("active");
        } else {
            $("#" + buttonClicked).removeClass("active");
            $("#" + subbuttonOpen).slideUp(100);
            $("#" + subbuttonHide).slideUp(100);
            $("#" + subbuttonHide).removeClass("active");
            $(".adminItems div.arrow.active").removeClass("active");
            $(arrowchange).removeClass("active");
        }

        if (buttonClicked == "adminItems-user" && $("#sidebar-admin").hasClass("active")) {
            loadProjectUsers();
            closeAllMain();

            $("#adminProjectUsersSearch").val("");
            $("#main-user").css("display", "block");
            $("#main-user").addClass("active");

            
            // Checking if Opera 8.0+ remove
            var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
            if(isOpera){
                $("#adminProjectUsersSearch").css("display", "none");
            }

        } else if (buttonClicked == "adminItems-user" && !$("#sidebar-admin").hasClass("active")) {
            loadProjectUsers();
            openNavbar();
            closeAllMain();

            $("#main-user").css("display", "block");
            $("#main-user").addClass("active");

            $(".adminItems#adminItems-user").addClass("active")
            $(".admin-subbuttons#adminsub-user").slideDown(100)
            $(arrowchange).addClass("active");

        }
        if (
            buttonClicked == "adminItems-project" &&
            $("#sidebar-admin").hasClass("active")
        ) {
            closeAllMain();

            $("#main-project").css("display", "block");
            $("#main-project").addClass("active");
        } else if (
            buttonClicked == "adminItems-project" &&
            !$("#sidebar-admin").hasClass("active")
        ) {
            openNavbar();
            closeAllMain();

            $("#main-project").css("display", "block");
            $("#main-project").addClass("active");
            $(".adminItems#adminItems-project").addClass("active")
        }
        if (
            (buttonClicked == "projectProgressNew" || buttonClicked == "projectProgressList") &&
            $("#sidebar-admin").hasClass("active")
        ) {
            closeAllMain();

            $("#main-project-dashboard").css("display", "block");
            $("#main-project-dashboard").addClass("active");
        } else if (
            (buttonClicked == "projectProgressNew" || buttonClicked == "projectProgressList") &&
            !$("#sidebar-admin").hasClass("active")
        ) {
            openNavbar();
            closeAllMain();

            $("#main-project-dashboard").css("display", "block");
            $("#main-project-dashboard").addClass("active");
            $(".adminItems#projectProgressNew").addClass("active")
        }
        if (
            buttonClicked == "adminItems-data" &&
            $("#sidebar-admin").hasClass("active")
        ) {
            closeAllMain();

            $("#main-layerdata").css("display", "block");
            $("#main-layerdata").addClass("active");
        } else if (
            buttonClicked == "adminItems-data" &&
            !$("#sidebar-admin").hasClass("active")
        ) {
            openNavbar();
            closeAllMain();

            $("#main-layerdata").css("display", "block");
            $("#main-layerdata").addClass("active");
            $(".adminItems#adminItems-data").addClass("active")
        }
        if (
            buttonClicked == "adminItems-config" &&
            $("#sidebar-admin").hasClass("active")
        ) {
            //closeAllMain()
            getConfigDetails();

            // $('#main-config').css('display','block')
            // $('#main-config').addClass('active')
        } else if (
            buttonClicked == "adminItems-config" &&
            !$("#sidebar-admin").hasClass("active")
        ) {
            openNavbar();
            // closeAllMain()
            getConfigDetails();

            $(".adminItems#adminItems-config").addClass("active")
            $(".admin-subbuttons#adminsub-config").slideDown(100)
            $(arrowchange).addClass("active");
        }
        if (
            buttonClicked == "adminItems-schedule" &&
            $("#sidebar-admin").hasClass("active")
        ) {
            //closeAllMain()
            //$('#main-schedule').css('display','block')
            //$('#main-schedule').addClass('active')
        } else if (
            buttonClicked == "adminItems-schedule" &&
            !$("#sidebar-admin").hasClass("active")
        ) {
            openNavbar();
            //closeAllMain()

            $(".adminItems#adminItems-schedule").addClass("active")
            $(".admin-subbuttons#adminsub-schedule").slideDown(100)
            $(arrowchange).addClass("active");
        }
        if (
            buttonClicked == "adminItems-aerial" &&
            $("#sidebar-admin").hasClass("active")
        ) {
            closeAllMain()
            // $('#main-aerial').css('display', 'block')
            // $('#main-aerial').addClass('active')
            if (localStorage.start_date == undefined || localStorage.start_date == "") {
                $(".messagecontainer").show();
                $("#gdiv2").hide();
                return
            } else {
                $(".messagecontainer").hide();
            }
        } else if (
            buttonClicked == "adminItems-aerial" &&
            !$("#sidebar-admin").hasClass("active")
        ) {
            openNavbar();
            //closeAllMain()
            if (localStorage.start_date == undefined || localStorage.start_date == "") {
                $(".messagecontainer").show();
                return
            } else {
                $(".messagecontainer").hide();
                $(".adminItems#adminItems-aerial").addClass("active")
                $(".admin-subbuttons#adminsub-aerial").slideDown(100)
                $(arrowchange).addClass("active");
            }
        }
    });

    // animation for clicking the subbuttons on the left bar//
    $(".subbuttons").on("click", function () {
        $thigtoOpen = $(this).attr("rel");
        $buttonClicked = $(this).attr("id");
        closeAllMain();

        $(".subbuttons").removeClass("active");
        $("#" + $buttonClicked).addClass("active");
        $("#" + $thigtoOpen).css("display", "block");
        $("#" + $thigtoOpen).addClass("active");
    });

    //animation for clicking the edit project button
    $("#editcurrentProject").on("click", function () {
        editProject()
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
                    if (file) {
                        formdata.append("imgInp", file);
                    };
                    formdata.append("functionName", "updateProjDetails")
                    var request = new XMLHttpRequest();
                    request.open("POST", "BackEnd/ProjectFunctions.php", true);
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
                                if (request.response) {
                                    newIcon = JSON.parse(request.response)
                                    if(newIcon.newIcon){ //update the icon only if changed.
                                        localStorage.iconurl = newIcon.newIcon
                                    }
                                }

                                location.reload()
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

    ////////// function for all things in the schedule page ///////////

    // /animation for clicking the Upload schedule button on sidebar
    // $('#adminsub-schedule #addschedule').on('click', function(){
    //     if(!$('#addscheduleForm').hasClass('active')){
    //         $('#addscheduleForm').css({'padding-top':-30}).animate({'padding-top': 0}, 100, function(){
    //             $('#addscheduleForm').css('display', 'block')
    //             $('#addscheduleForm').addClass('active');
    //             $(".formcontainerMainBody .revisioncontainer").css('display', 'none')
    //             $(".formHeader-addschedule h3").html("Upload Schedule")
    //         })
    //     }else{}
    // })

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

    //animation for clicking the cancel form button
    $("#addschedulecancel").on("click", function () {
        $("#addscheduleForm").fadeOut(100);
        $("#addscheduleForm").removeClass("active");
        $(".formcontainerMainBody .revisioncontainer").css("display", "none");
        $(".formHeader-addschedule h3").html("Upload Schedule");
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
            "background-color": "lightgrey",
            "cursor": "not-allowed"
        })
        $("#scheduletype").css({
            "background-color": "lightgrey",
            "cursor": "not-allowed"
        })
        $("#scheduledatestart").css({
            "background-color": "lightgrey",
            "cursor": "not-allowed"
        })
        $("#scheduledateend").css({
            "background-color": "lightgrey",
            "cursor": "not-allowed"
        })

        $("#schedulename").val($("#scheduleName").text())
        $("#scheduletype").val($("#scheduleType :selected").text())
        let scheduleStartDate = $(scheduleObj).attr("dataStart")
        let scheduleEndDate = $(scheduleObj).attr("data")
        let startDate = new Date(scheduleStartDate)
        // offset = startDate.getTimezoneOffset();
        // startDate = new Date(startDate.getTime() - (offset * 60 * 1000));
        startDate = startDate.toISOString().slice(0, 10)
        let endDate = new Date(scheduleEndDate)
        // endDate = new Date(endDate.getTime() - (offset * 60 * 1000));
        endDate = endDate.toISOString().slice(0, 10)
        $("#scheduledatestart").val(startDate)
        $("#scheduledateend").val(endDate)
        let version = $("#revisionList li:first-child").attr("data")
        $("#revisionnumber").val("")
        $("#revisionremarks").val("")
    })

    //animation for clicking the edit project button

    /// function for cllicking the edit schedule button ///
    $("#reviseschedule").on("click", function () {
        $("#revisionremarks").val("");
        $("#addscheduleForm").fadeIn(100);
        $("#addscheduleForm").addClass("active");
        $(".formcontainerMainBody .revisioncontainer").css("display", "block");
        $(".formHeader-addschedule h3").html("Revise Schedule");
        $("#schedulename").css({
            "background-color": "lightgrey",
            cursor: "not-allowed",
        });
        $("#scheduletype").css({
            "background-color": "lightgrey",
            cursor: "not-allowed",
        });
        $("#scheduledatestart").css({
            "background-color": "lightgrey",
            cursor: "not-allowed",
        });
        $("#scheduledateend").css({
            "background-color": "lightgrey",
            cursor: "not-allowed",
        });
        $("#revisionnumber").css({
            "background-color": "lightgrey",
            cursor: "not-allowed",
        });
        $("#schedulename").val($("#scheduleName").text());
        $("#scheduletype").val($("#scheduleType :selected").text());

        let scheduleStartDate = $(scheduleObj).attr("dataStart");
        let scheduleEndDate = $(scheduleObj).attr("data");

        let startDate = new Date(scheduleStartDate);
        // offset = startDate.getTimezoneOffset();
        // startDate = new Date(startDate.getTime() - offset * 60 * 1000);
        startDate = startDate.toISOString().slice(0, 10);
        let endDate = new Date(scheduleEndDate);
        // endDate = new Date(endDate.getTime() - offset * 60 * 1000);
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

    //animation for clicking the close form button
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

    $(
        "#moveContainer .buttonContainerData .hiddencontainer button#cancelAttach"
    ).on("click", function () {
        $(
            "#moveContainer .buttonContainerData .hiddencontainer#attachlayerContainer"
        ).css("display", "none");
        $("#moveContainer .buttonContainerData #btn_dataAttach").fadeIn();
    });

    $(
        "#moveContainer .buttonContainerData .hiddencontainer button#canceladjustPotition"
    ).on("click", function () {
        $(
            "#moveContainer .buttonContainerData .hiddencontainer#adjustlayerContainer"
        ).css("display", "none");
        $("#moveContainer .buttonContainerData #btn_dataAdjustPosition").fadeIn();
    });

    $('#canceladdgroupAerial').on('click', function () {
        $('#aicGroup').css('display', 'none')
        $('#hiddenAerialContainer').css('display', 'none')
        $('#hiddenAerialSubContainer').css('display', 'none')

        $("#newGroupAerialName").val("");
        $("#newsubGroupAerialName").val("");
    })

    $('#moveContainer .buttonContainerData #canceladdgroup').on('click', function () {
        $('.buttonContainerData .hiddencontainer#addToGroup').css('display', 'none')
        $('.buttonContainerData .hiddencontainer #editGroupLyrBtn').css('display', 'inline')
        //  $('.buttonContainerData .hiddencontainer #saveGroupLyrBtn').css('display', 'none')
        $('#moveContainer .buttonContainerData #btn_AddToGroup').fadeIn()
        $("#newGroupName").val("");
        $("#newLayerGroup").text("<Add a new group>")
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

    getWMSCap()
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
        .find("tr")
        .each(function () {
            var row = $(this);
            if (row.find('input[type="checkbox"]').is(":checked")) {
                data.push({
                    id: row.find("td").eq(1).html(),
                    email: row.find("td").eq(2).html(),
                    name: row.find("td").eq(3).html(),
                    org: row.find("td").eq(4).html(),
                    orgType: row.find("td").eq(5).html()
                });
                row.remove();
            }
        });
    var tbody = document.getElementById("adminSelectUserTableBody");

    for (var i = 0; i < data.length; i++) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "adminselectutable";
        cb.setAttribute("id", data[i].id);
        cell.appendChild(cb);
        cell = row.insertCell();
        cell.style.display = "none";
        cell.innerHTML = data[i].id;
        cell = row.insertCell();
        cell.innerHTML = data[i].email;
        cell = row.insertCell();
        cell.innerHTML = data[i].name;
        cell = row.insertCell();
        cell.innerHTML = data[i].org;
        cell = row.insertCell();
        var selectList = document.createElement("select");
        selectList.id = "s" + data[i].id;
        cell.appendChild(selectList);
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

                let noption3 = document.createElement("option");
                noption3.value = "Consultant DC";
                noption3.text = "Consultant DC";
                selectList.appendChild(noption3);

                let noption4 = document.createElement("option");
                noption4.value = "Sys Consultant";
                noption4.text = "Sys Consultant";
                selectList.appendChild(noption4);

                let noption5 = document.createElement("option");
                noption5.value = "Contractor QS";
                noption5.text = "Contractor QS";
                selectList.appendChild(noption5);

                break;
        }
        cell = row.insertCell();
        cell.innerHTML = data[i].orgType;
        cell.style.display = "none";
    }
}

$("#adminUserTableBody").on("dblclick", "tr", function () {
    var data = [];
    var row = $(this);
    data.push({
        id: row.find("td").eq(1).html(),
        email: row.find("td").eq(2).html(),
        name: row.find("td").eq(3).html(),
        org: row.find("td").eq(4).html(),
        orgType: row.find("td").eq(5).html()
    });
    row.remove();

    var tbody = document.getElementById("adminSelectUserTableBody");
    for (var i = 0; i < data.length; i++) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "adminselectutable";
        cb.setAttribute("id", data[i].id);
        cell.appendChild(cb);
        cell = row.insertCell();
        cell.style.display = "none";
        cell.innerHTML = data[i].id;
        cell = row.insertCell();
        cell.innerHTML = data[i].email;
        cell = row.insertCell();
        cell.innerHTML = data[i].name;
        cell = row.insertCell();
        cell.innerHTML = data[i].org;
        cell = row.insertCell();
        var selectList = document.createElement("select");
        selectList.id = "s" + data[i].id;
        cell.appendChild(selectList);

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
                break;
        }
        cell = row.insertCell();
        cell.innerHTML = data[i].orgType;
        cell.style.display = "none";
    }
});

$("#adminSelectUserTableBody").on("dblclick", "tr", function () {
    var data = [];
    var row = $(this);
    data.push({
        id: row.find("td").eq(1).html(),
        email: row.find("td").eq(2).html(),
        name: row.find("td").eq(3).html(),
        org: row.find("td").eq(4).html(),
        orgType: row.find("td").eq(6).html() //select is the 5th column
    });
    row.remove();
    var tbody = document.getElementById("adminUserTableBody");
    for (var i = 0; i < data.length; i++) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "adminutable";
        cb.setAttribute("id", data[i].id);
        cell.appendChild(cb);
        cell = row.insertCell();
        cell.style.display = "none";
        cell.innerHTML = data[i].id;
        cell = row.insertCell();
        cell.innerHTML = data[i].email;
        cell = row.insertCell();
        cell.innerHTML = data[i].name;
        cell = row.insertCell();
        cell.innerHTML = data[i].org;
        cell = row.insertCell();
        cell.innerHTML = data[i].orgType;
        cell.style.display = "none";
    }
});

function OnClickAdminRemoveUser() {
    var data = [];
    $("#adminSelectUserTableBody")
        .find("tr")
        .each(function () {
            var row = $(this);
            if (row.find('input[type="checkbox"]').is(":checked")) {

                data.push({
                    id: row.find("td").eq(1).html(),
                    email: row.find("td").eq(2).html(),
                    name: row.find("td").eq(3).html(),
                    org: row.find("td").eq(4).html(),
                    orgType: row.find("td").eq(6).html() //orgtype is captured in this column
                });
                row.remove();
            }
    });
    var tbody = document.getElementById("adminUserTableBody");
    for (var i = 0; i < data.length; i++) {
        var row = tbody.insertRow();
        var cell = row.insertCell();
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "adminutable";
        cb.setAttribute("id", data[i].id);
        cell.appendChild(cb);
        cell = row.insertCell();
        cell.style.display = "none";
        cell.innerHTML = data[i].id;
        cell = row.insertCell();
        cell.innerHTML = data[i].email;
        cell = row.insertCell();
        cell.innerHTML = data[i].name;
        cell = row.insertCell();
        cell.innerHTML = data[i].org;
        cell = row.insertCell();
        cell.innerHTML = data[i].orgType;
        cell.style.display = "none";
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
                    .find("tr")
                    .each(function () {
                        var row = $(this);
                        data.push({
                            id: row.find("td").eq(1).html(),
                            email: row.find("td").eq(2).html(),
                            name: row.find("td").eq(3).html(),
                            org: row.find("td").eq(4).html(),
                            orgType: row.find("td").eq(6).html()
                        });
                        row.remove();
                    });

                var tbody = document.getElementById("adminUserTableBody");
                for (var i = 0; i < data.length; i++) {
                    var row = tbody.insertRow();
                    var cell = row.insertCell();
                    var cb = document.createElement("input");
                    cb.type = "checkbox";
                    cb.class = "adminutable";
                    cb.setAttribute("id", data[i].id);
                    cell.appendChild(cb);
                    cell = row.insertCell();
                    cell.style.display = "none";
                    cell.innerHTML = data[i].id;
                    cell = row.insertCell();
                    cell.innerHTML = data[i].email;
                    cell = row.insertCell();
                    cell.innerHTML = data[i].name;
                    cell = row.insertCell();
                    cell.innerHTML = data[i].org;
                    cell = row.insertCell();
                    cell.innerHTML = data[i].orgType;
                    cell.style.display = "none";
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
        .find("tr")
        .each(function () {
            var row = $(this);
            data.push({
                id: row.find("td").eq(1).html(),
                projectRole: row.find("select").val(),
                email: row.find("td").eq(2).html()
            });
            if (localStorage.signed_in_email == row.find("td").eq(2).html()) {
                if (localStorage.usr_role == row.find("select").val()) {
                    promptRelogin = true; // no need to relogin
                }
            }
        });
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
                    projectUsersUpdate.push({
                        user_id: data[j].id,
                        user_role: data[j].projectRole,
                        user_email: data[j].email,
                        user_old_role : projectUsers[i].projectRole
                    });
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
                data.splice(j, 1);
                idflag = true;
                break;
            }
            j++;
        }
        if (!idflag) {
            projectUsersUpdate.push({
                user_id: projectUsers[i].id,
                user_role: "noRole",
                user_email: projectUsers[i].email,
                user_old_role : projectUsers[i].projectRole
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
        }
    }

    console.log(data);

    for (var i = 0; i < data.length; i++) {
        projectUsersUpdate.push({
            user_id: data[i].id,
            user_role: data[i].projectRole,
            user_email: data[i].email,
            user_old_role: "noOldRole"
        });
        msg +=   data[i].email + " - add user <br>";
    };

    console.log(projectUsersUpdate);
    console.log(projectGroupUsersUpdate);
    var formdata = new FormData();
    formdata.append("users", JSON.stringify(projectUsersUpdate));
    if(projectGroupUsersUpdate.length>0){
        formdata.append("userGroup", JSON.stringify(projectGroupUsersUpdate));
    }
    formdata.append("functionName", "projectAdminUpdateUsers");
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
                            if (promptRelogin == false) {
                                $.confirm({
                                    boxWidth: '30%',
                                    useBootstrap: false,
                                    title: 'Confirm!',
                                    content: 'You\'ll be logged out from the system for the changes you had made to take effect.',
                                    buttons: {
                                        OK: function () {
                                            window.open("signin.php", '_self')
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
                                    //refreshUserTable();
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

function refreshUserTable() {
    $.ajax({
        url: "BackEnd/UserFunctions.php",
        type: "POST",
        data: {
            functionName: "adminProjectUser"
        },
        dataType: "json",
        success: function (response) {
            var myhtml;
            for (var i = 0; i < response.length; i++) {
                myhtml += '<tr>' +
                    '<td>' + response[i].user_id + '</td>' +
                    '<td>' + response[i].user_email + '</td>' +
                    '<td>' + response[i].user_firstname + ' ' + response[i].user_lastname + '</td>' +
                    '<td>' + response[i].orgName + '</td>' +
                    '<td>' + response[i].user_country + '</td>' +
                    '<td>' + response[i].user_role + '</td>' +
                    '</tr>';
            };
            $('#adminProjectUsers').html(myhtml);
        }
    });
}

function refreshAdminUserTable() {
    $("#adminProjectUsersSearch").val("");
    $.ajax({
        url: "BackEnd/UserFunctions.php",
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
            for (var i = 0; i < users.length; i++) {
                myhtml += '<tr>' +
                    '<td> <input type ="checkbox"  class = "adminutable" value =' + users[i].user_id + '></td>' +
                    '<td style = "display:none">' + users[i].user_id + '</td>' +
                    '<td>' + users[i].user_email + '</td>' +
                    '<td>' + users[i].user_firstname + '</td>' +
                    '<td>' + users[i].orgName + '</td>' +
                    '<td style = "display:none">' + users[i].orgType + '</td>'
                '</tr>';
            };
            $('#adminUserTableBody').html(myhtml);
            var phtml = "";
            for (var i = 0; i < pusers.length; i++) {
                phtml +=
                    "<tr>" +
                    '<td> <input type ="checkbox"  class = "adminselectutable" id =' +
                    pusers[i].user_id +
                    "></td>" +
                    '<td style = "display:none">' +
                    pusers[i].user_id +
                    "</td>" +
                    "<td>" +
                    pusers[i].user_email +
                    "</td>" +
                    "<td>" +
                    pusers[i].user_firstname +
                    "</td>" +
                    "<td>" +
                    pusers[i].orgName +
                    "</td>";
                let selected = "";
                switch (pusers[i].orgType) {
                    case "owner": phtml +=
                        '<td ><select id= "s' +
                        pusers[i].user_id +
                        '" class = "addadminuserselect">';
                        ownerRoles.forEach((ele)=>{
                            phtml += '<option value= "'+ele+'"' + ((pusers[i].Pro_Role == ele) ? "selected" : "") +'>'+ele+'</option>' ;
                        })
                        phtml += "</select></td>";
                        phtml += '<td style ="display:none">owner</td>';
                        break;
                    
                    case "contractor": phtml +=
                        '<td ><select id= "s' +
                        pusers[i].user_id +
                        '" class = "addadminuserselect">' +
                        '<option value= "Contractor PM"';
                        selected = (pusers[i].Pro_Role == "Contractor PM") ? "selected" : "";
                        phtml += selected + ' >Contractor PM</option>' +
                            '<option value= "Contractor Engineer"';
                        selected = (pusers[i].Pro_Role == "Contractor Engineer") ? "selected" : "";
                        phtml += selected + '>Contractor Engineer</option>' +
                            '<option value= "Contractor DC"';
                        selected = (pusers[i].Pro_Role == "Contractor DC") ? "selected" : "";
                        phtml += selected + '>Contractor DC</option>' +
                            '<option value= "Site Supervisor"';
                        selected = (pusers[i].Pro_Role == "Site Supervisor") ? "selected" : "";
                        phtml += selected + '>Site Supervisor</option>' +
                            '<option value= "HSET Officer"';
                        selected = (pusers[i].Pro_Role == "HSET Officer") ? "selected" : "";
                        phtml += selected + '>HSET Officer</option>' +
                            '<option value= "Contractor CM"';
                        selected = (pusers[i].Pro_Role == "Contractor CM") ? "selected" : "";
                        phtml += selected + '>Contractor CM</option>' +
                            '<option value= "QAQC Officer"';
                        selected = (pusers[i].Pro_Role == "QAQC Officer") ? "selected" : "";
                        phtml += selected + '>QAQC Officer</option>' +
                            '<option value= "Contractor QS"';
                        selected = (pusers[i].Pro_Role == "Contractor QS") ? "selected" : "";
                        phtml += selected + '>Contractor QS</option>' +
                            "</select></td>";
                        phtml += '<td style ="display:none">contractor</td>';
                        break;
                    //case "Consultant CRE": case "Consultant RE": phtml +=
                    case "consultant": phtml +=
                        '<td ><select id= "s' +
                        pusers[i].user_id +
                        '" class = "addadminuserselect">' +
                        '<option value= "Consultant CRE"';
                        selected = (pusers[i].Pro_Role == "Consultant CRE") ? "selected" : "";
                        phtml += selected + ' >Consultant CRE</option>' +
                            '<option value= "Consultant RE"';
                        selected = (pusers[i].Pro_Role == "Consultant RE") ? "selected" : "";
                        phtml += selected + '>Consultant RE</option>' +
                            '<option value= "Consultant DC"';
                        selected = (pusers[i].Pro_Role == "Consultant DC") ? "selected" : "";
                        phtml += selected + '>Consultant DC</option>' +
                            '<option value= "Sys Consultant"';
                        selected = (pusers[i].Pro_Role == "Sys Consultant") ? "selected" : "";
                        phtml += selected + '>Sys Consultant</option>' +
                            '<option value= "Consultant QS"';
                        selected = (pusers[i].Pro_Role == "Consultant QS") ? "selected" : "";
                        phtml += selected + '>Consultant QS</option>' +
                            "</select></td>";
                        phtml += '<td style ="display:none">consultant</td>';
                        break;
                }

                phtml += '</tr>';
            };
            $('#adminSelectUserTableBody').html(phtml);
            $("#adminSelectUserTableBody")
                .find("tr")
                .each(function () {
                    var row = $(this);
                    projectUsers.push({
                        id: row.find("td").eq(1).html(),
                        projectRole: row.find("select").val(),
                        email: row.find("td").eq(2).html()
                    });
                });
            // for (var i = 0; i < pusers.length; i++) {
            //     let mydiv = "s"+pusers[i].user_id;
            //     $('#'+mydiv).val(pusers[i].Pro_Role);
            // }
        },
    });
}

function retrieveGroupOpt (){
    $.get("BackEnd/getLayerGroups.php", function (data) {
        var options = '<option disabled selected value> -- select an option -- </option>\
        <option id="newLayerGroup" value="newLayerGroup">&lt;Add a new group&gt;</option>'
        data.forEach(function (item) {
            options += "<option data='" + item.groupView + "' value='" + item.groupID + "'>" + item.groupName + "</option>"
        })
        $("#groupLayerSelect").html(options);
    })
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
                $("#dataTable").append(
                    "<tr onclick ='editLayer(this)'>\
                    <td style='display:none'> " + row.Data_Name + "</td>\
                    <td style='text-align: center;'><img style='width: 25px; height:25px;' title='" + $attachimgtitle + "' src='" + $attachimgsrc + "'></td>\
                    <td style='text-align: center;'><img style='width: 25px; height:25px;' title='" + $shareimgtitle + "' src='" + $shareimgsrc + "'></td>\
					<td> " + row.Data_Name + "</td>\
					<td>" + row.Data_Type + "</td>\
                    <td>" + row.Data_Owner + "</td>\
                    <td>" + decodeURI(row.Data_URL) + "</td>\
                    <td style='text-align: center;'>" + upload_date + "</td>\
                    <td style = 'text-align: center;' > " + row.Frequency + "</td>\
                    <td style='display:none'>" + row.Offset + "</td>\
                    <td style='display:none'>" + row.Data_ID + "</td>\
                    <td style='display:none'>" + row.Project_ID + "</td>\
                    <td style='display:none'>"+ row.Layer_ID + "</td>\
                    <td style='display:none'>"+ row.layerGroup + "</td>\
                    <td style='display:none'>"+ row.Style + "</td>\
                    <td style='display:none'>"+ row.Data_Owner_ID + "</td>\
				</tr>"
                )
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    })


    retrieveGroupOpt();
    fetchShpStyles()

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
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
        $(movecontainer).after('<br class = "spacer">');
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
        let data_id = ele.children[10].innerText;
        let frequency = ele.children[8].innerText;
        let layerID = ele.children[12].innerText;
        let layerGroup = ele.children[13].innerText;
        let project_name = localStorage.p_name;
        let Style = ele.children[14].innerText;
        let p_id_name = ele.children[15].innerText;
        console.log(data_type + " " + data_url + " " + data_name + " " + data_access + " " + data_attach + " " + data_offset + " " + data_id + " " + frequency);
        $('#heightadjustPosition').val(data_offset);

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
        if (data_owner !== project_name) {
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
                if (data_owner !== project_name) {
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
                    var boundingSphere = myData.boundingSphere;
                    var cartographic = Cesium.Cartographic.fromCartesian(
                        boundingSphere.center
                    );
                    var surface = Cesium.Cartesian3.fromRadians(
                        cartographic.longitude,
                        cartographic.latitude,
                        0.0
                    );
                    var offset = Cesium.Cartesian3.fromRadians(
                        cartographic.longitude,
                        cartographic.latitude,
                        heightOffset
                    );
                    var translation = Cesium.Cartesian3.subtract(
                        offset,
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
                if (data_owner !== project_name) {
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

function permissionToggle() {
    let freq = parseInt(dataDetails.frequency);
    if (freq > 0) {
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "Please make sure no project is attached to this data before unshare",
        });
        return;
    }
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
        url: "BackEnd/DataFunctions.php",
        dataType: "json",
        data: {
            functionName: "attachOrDetachLayer",
            data_id: dataDetails.id,
            val: attachSwap,
            name: name,
            defaultView: defaultView,
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
                <tr><td>" +
                    row.Layer_Name +
                    "</td><td>" +
                    row.Project_ID +
                    "</td>\
                <td>" +
                    row.Project_Name +
                    "</td><td>" +
                    row.Attached_By +
                    "</td></tr>\
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
    myData.readyPromise.then(function () {
        var heightOffset = $("#heightadjustPosition").val();
        var boundingSphere = myData.boundingSphere;
        var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
        var surface = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            0.0
        );
        var offset = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            heightOffset
        );
        var translation = Cesium.Cartesian3.subtract(
            offset,
            surface,
            new Cesium.Cartesian3()
        );
        myData.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    });
}

var weeklySchedule;

function OnClickSaveAdjustPosition() {
    var offset = $("#heightadjustPosition").val();
    $.ajax({
        type: "POST",
        url: "BackEnd/updateOffset.php",
        dataType: "json",
        data: {
            data_id: dataDetails.id,
            offset: offset,
        },
        success: function (obj, textstatus) {
            if (obj.data == "Update successful") {
                dataDetails.offset = offset;
                dataDetails.ele.children[9].innerText = offset;
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
    $.ajax({
        url: "BackEnd/ProjectFunctions.php",
        type: "POST",
        data: {
            functionName: "viewProjectUsers"
        },
        dataType: "json",
        success: function (response) {
            var myhtml = "";
            for (var i = 0; i < response.project_users.length; i++) {
                let UserType;
                UserType = response.project_users[i].Pro_Role
                myhtml += '<tr>' +
                    '<td style="display:none"> ' + response.project_users[i].Usr_ID + '</td>' +
                    '<td> ' + response.project_users[i].user_email + '</td>' +
                    '<td>' + response.project_users[i].user_firstname + " " + response.project_users[i].user_lastname + '</td>' +
                    '<td>' + response.project_users[i].user_org + '</td>' +
                    '<td>' + response.project_users[i].user_country + '</td>' +
                    '<td>' + UserType + '</td>' +
                    '</tr>';
            };
            $('#adminProjectUsers').html(myhtml);
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
    <span class='img'><img src='" + projectIcon(localStorage.iconurl) + "'></span><span class='atag'><a>" + localStorage.p_name + "</a></span>\
    </button>"
)
for (i = 0; i < projectlistChild.length; i++) {
    $("#projectslist").append(
        "<form action='login/postlogin_processing' method='POST'>\
        <button id='proID" + projectlistChild[i].project_id + "' value='" + projectlistChild[i].project_id + "' name ='projectid' action='submit'>\
        <input  name='buttonclicked' id= 'buttonclicked' value= 'admin' style = 'display:none'>\
        <span class='img'><img src='" + projectIcon(projectlistChild[i].icon_url) + "'></span><span class='atag'><a>" + projectlistChild[i].project_name + "</a></span></button>\
        </form>"
    )
}
for (i = 0; i < projectlistOther.length; i++) {
    $("#projectslistOther").append(
        "<form action='login/postlogin_processing' method='POST'>\
        <button id='proID" + projectlistOther[i].project_id + "' value='" + projectlistOther[i].project_id + "' name ='projectid' action='submit'>\
        <input  name='buttonclicked' id= 'buttonclicked' value= 'admin' style = 'display:none'>\
        <span class='img'><img src='" + projectIcon(projectlistOther[i].icon_url) + "'></span><span class='atag'><a>" + projectlistOther[i].project_name + "</a></span></button>\
        </form>"
    )
}

////     hazirah comment this (for "SORTING BASED ON RELEVANT PROJECT GROUP IN APPSBAR")   /////
// $("#projectslist").append(
//     "<button class='activeProject'>\
// 		<span class='img'><img src='" +
//     localStorage.iconurl +
//     "'></span><span class='atag'><a>" +
//     localStorage.p_name +
//     "</a></span>\
// 		</button>"
// );
// for (i = 0; i < projectlist.length; i++) {
//     if (localStorage.p_id == projectlist[i].project_id) {
//         continue; //skip this round
//     }
//     $("#projectslist").append(
//         "<form action='login/postlogin_processing' method='POST'>\
//             <button id='proID" +
//         projectlist[i].project_id +
//         "' value='" +
//         projectlist[i].project_id +
//         "' name ='projectid' action='submit'>\
//             <span class='img'><img src='" +
//         projectlist[i].icon_url +
//         "'></span><span class='atag'><a>" +
//         projectlist[i].project_name +
//         "</a></span></button>\
//             </form>"
//     );
// }

Cesium.BingMapsApi.defaultKey =
    "Ap0nMgqVt8bPjZvIrd_3wrG9bhMs3ZZMRvCvDSj5lDBTQzm7nD_MxHzZwLhCw7bI"; // For use with this application only
Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4YTU2OTcxMC0wNzdmLTQyZDItOWVkNy0xZjU4NTgzYTVjNTUiLCJpZCI6NzI3Miwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU0ODg2ODEwM30.Lc-IQBDSPyhqgPR2v-Ejcb34ksKJLr23mXsOhszBcHI";

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
});

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

    $('#groupLayerSelect option').removeAttr('selected')

    if (dataDetails.groupID == "null") {
        $('#groupLayerSelect').prop('selectedIndex', 0);
        return
    }
    $('#groupLayerSelect option[value="' + dataDetails.groupID + '"]').attr("selected", "selected");
    $("#newGroupName").val("")
})

$("#groupLayerSelect").on('change', function () {
    // if add new group is selected
    if ($(this).val() == "newLayerGroup") {
        $('#hiddencontainer2').css('display', 'block')
        $('.buttonContainerData .hiddencontainer #editGroupLyrBtn').css('display', 'none')
        $('.buttonContainerData .hiddencontainer #saveGroupLyrBtn').css('display', 'inline')
    } else {
        $('#hiddencontainer2').css('display', 'none')
        $('.buttonContainerData .hiddencontainer #editGroupLyrBtn').css('display', 'inline')
    }
})

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

function OnClickRemoveLayerGroup(ele) {
    var prevtdLayer = $(ele).parent().parent().parent().prev();
    var layerId = $(prevtdLayer).find("td:eq(12)").text();

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
                            $("#groupLayerSelect").val("");
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
    } else {
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
            data = {
                functionName: "saveLayerGroup",
                layerID: dataDetails.layerID,
                groupName: $("#newGroupName").val(),
                defaultDisplay: $("#newGroupCheck").prop("checked"),
                groupID: $("#groupLayerSelect").val()
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
                console.log($(dataDetails.ele.children[11]))
                dataDetails.groupID = data.groupID
                return;
            } else if ($("#newGroupName").val() == "") { //add record only
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


var aicData = {
    selected: null,
    imgType: null,
    tableRow: null,
    imgSrc: null
};

function changeAicRoutine() {
    $("#addEditAIC").show().hide()
    $("#gdiv2 .tablecontainer").hide()
    if (localStorage.start_date == undefined || localStorage.start_date == "") {
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
    var parts1 = localStorage.end_date.split("/");
    fullDate2 = new Date(parts1[2], parts1[1] - 1, parts1[0]);
    day1 = fullDate1.getDay();
    let selectedType = $("#AicRoutineType option:selected")
    switch ($(selectedType).html()) {
        case "Weekly":
            $("#AicRoutineList").html("");
            $(".sub-title .column1 h4").text("Type: Weekly")
            var daystoadd = 0;
            switch (day1) {
                case 0: //Sunday
                    daystoadd = 1;
                    break;
                case 1: //Monday
                    daystoadd = 7;
                    break;
                case 2: //Tuesday
                    daystoadd = 6;
                    break;
                case 3: //Wednesday
                    daystoadd = 5;
                    break;
                case 4: //Thursday
                    daystoadd = 4;
                    break;
                case 5: //Friday
                    daystoadd = 3;
                    break;
                case 6: //Saturday
                    daystoadd = 2;
                    break;
            };

            switch (day1) {
                case 0: //Sunday
                    daystominus = 7;
                    break;
                case 1: //Monday
                    daystominus = 1;
                    break;
                case 2: //Tuesday
                    daystominus = 2;
                    break;
                case 3: //Wednesday
                    daystominus = 3;
                    break;
                case 4: //Thursday
                    daystominus = 4;
                    break;
                case 5: //Friday
                    daystominus = 5;
                    break;
                case 6: //Saturday
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
                endweekISO = endweekdate.toISOString()
                res = startweekID.toISOString().split(":")
                weekID = res[0]
                i++;
                wklabel = "WK" + i + " " + new Intl.DateTimeFormat('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }).format(startweekdate)
                $("#AicRoutineList").append("<li id='aic_" + weekID + "' onclick='getAicRoutineInfo(this)' dataStartDate ='"+ dataStartDate +"' dataEndDate='"+ dataEndDate +"' dataStart='" + weekISO + "' data='" + endweekISO + "'><div class='status late'></div><div class='revision'></div><a>" + wklabel + "</a></li>")
            }

            $.ajax({
                url: 'BackEnd/aicRequests.php',
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
            $(".sub-title .column1 h4").text("Type: Monthly")
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

                let label = new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    year: 'numeric'
                }).format(eachMonth)
                $("#AicRoutineList").append("<li id='aic_" + monthID + "' onclick='getAicRoutineInfo(this)' dataStartDate ='"+ dataStartMth +"' dataEndDate='"+ dataEndMth +"' dataStart='" + monthISO + "' data='" + endMonthISO + "'><div class='status late'></div><div class='revision'></div><a>" + label + "</a></li>")
            }

            $.ajax({
                url: 'BackEnd/aicRequests.php',
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
            $(".sub-title .column1 h4").text("Type: Quarterly")
            var sQuarter = Math.floor((fullDate1.getMonth() + 1) / 3) + 1;
            var eQuarter = Math.floor((fullDate2.getMonth() + 1) / 3) + 1;
            var quarterNames = ['Jan', 'Apr', 'Jul', 'Oct', 'Dec'];
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

                // var quarStartMth = quarterNames[sQuarter - 1];
                // var quarStartYr = sYear;
                // var quarEndMth = quarterNames[sQuarter];
                // var quarEndYr = eYear;

                let startQuar = sYear +"-"+monthToNumAr[quarterNames[sQuarter - 1]];
                let endQuar = endYear+"-"+monthToNumAr[quarterNames[sQuarter]];

                $("#AicRoutineList").append("<li id='aic_" + QuarID + "' dateYear='" + value + "' dataStartDate ='"+ startQuar +"' dataEndDate='"+ endQuar +"' dataStart='" + quarStart + "' data='" + quarEnd + "' onclick='getAicRoutineInfo(this)'><div class='status late'></div><div class='revision'></div><a>" + QuarID + "</a></li>")
                // $("#AicRoutineList").append("<li id='aic_" + QuarID + "' dateYear='" + value + "' dataStart='" + quarStart + "' dataStartMth='" + quarStartMth + "' dataStartYr='"+ quarStartYr +"' dataMth='" + quarEndMth + "' dataYr='"+ quarEndYr +"' data='" + quarEnd + "' onclick='getAicRoutineInfo(this)'><div class='status late'></div><div class='revision'></div><a>" + QuarID + "</a></li>")
                
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
            // $("#AicRoutineList").append("<li id='aic_" + QuarID + "' dateYear='" + value + "' dataStart='" + quarStart + "' dataStartMth='" + quarStartMth + "' dataStartYr='"+ quarStartYr +"' dataMth='" + quarEndMth + "' dataYr='"+ quarEndYr +"' data='" + quarEnd + "' onclick='getAicRoutineInfo(this)'><div class='status late'></div><div class='revision'></div><a>" + QuarID + "</a></li>")

            $.ajax({
                url: 'BackEnd/aicRequests.php',
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
    aicData.selected = $(ele).attr('id');
    let startQuarDate = $(ele).attr("dataStartDate")
    let endQuarDate = $(ele).attr("dataEndDate")

    let startDateString = $(ele).attr("dataStart")
    let endDateString = $(ele).attr("data")

    let startDate = new Date(startQuarDate)
    let endDate = new Date(endQuarDate)
    let offset = startDate.getTimezoneOffset();

    startDate = new Date(startDate.getTime() - (offset * 60 * 1000));
    startDate = startDate.toISOString().slice(0, 10)
    endDate = new Date(endDate.getTime() - (offset * 60 * 1000));
    endDate = endDate.toISOString().slice(0, 10)

    $(".sub-title .column2 h4").text("Start: " + startDate)
    $(".sub-title .column3 h4").text("End: " + endDate)

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
    
    $("#addEditAIC").show().hide()
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
        return
    } else {
        $("#gdiv2 .tablecontainer").show()

        let data = {
            runFunction: 'getSpecificAicRoutine',
            routineId: $(ele).attr('id')
        }

        $.ajax({
            url: 'BackEnd/aicRequests.php',
            type: "POST",
            dataType: 'json',
            data: data, //weekly
            success: function (response) {
                response.data.forEach(function (row) {
                    $("#aicRecordTable").append('\
                        <tr data-id="'+ row.AIC_Id + '">\
                        <td>' + row.project_id + ' - ' + row.project_name + '</td>\
                        <td>' + row.Image_URL + '</td>\
                        <td>' + new Date(row.Image_Captured_Date.date).toDateString() + '</td>\
                        <td>' + row.Registered_By + '</td>\
                        <td>' + new Date(row.Registered_Date.date).toDateString() + '</td>\
                        <td style="display:none">' + row.AIC_Id + '</td>\
                        <td style="display:none">' + row.Package_Id + '</td>\
                        <td>\
                            <div class="imagecontainer">\
                                <img src="revicons.ico">\
                                <div class="buttoncontainer">\
                                    <button class="aicViewImgBtn" onclick="aicViewImage(\''+ row.Image_URL + '\',\'' + row.project_id + '\')">View</button>\
                                    <button onclick="aicEditRecord(this)">Edit</button>\
                                    <button onclick="aicReviseImage(this)">Revise</button>\
                                    <button onclick="aicGroup('+ row.AIC_Id + ')">Group</button>\
                                </div>\
                            </div>\
                        </td>\
                    </tr>\
                        ')
                })

            }
        });
    }
}

$("#aicFormPackageId").change(function () {
    $("#aicFormPackageName").val($(this).children("option:selected").attr('data'))
})

// function for previewing the image uploaded //
function aicViewImage(imgfileName, packageId) {
    // localStorage.p_id_name
   $("#previewWMS").attr("src", `Components/wmsViewer.php?layer=${imgfileName}&packageId=${packageId}` )

    $("#imageViewer").css('display', 'block')
}

function aicGroup(aicID) {
    aicIdEach = aicID;

    $("#gdiv2 .formcontainer").hide()
    $("#aicGroup").css('display','flex')

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

    $("#gdiv2 .formcontainer").hide()
    $("#addEditAIC").show()
    let siblings = $(e).parent().parent().parent().siblings()

    aicData.tableRow = siblings

    let capturedDate = new Date($(siblings[2]).text())
    let offset = capturedDate.getTimezoneOffset();
    capturedDate = new Date(capturedDate.getTime() - (offset * 60 * 1000))
    recordId = $(siblings[5]).text()

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
    $("#gdiv2 .formcontainer").hide()
    $("#addEditAIC").show()
    let siblings = $(e).parent().parent().parent().siblings()
    aicData.tableRow = siblings

    let capturedDate = new Date($(siblings[2]).text())
    let offset = capturedDate.getTimezoneOffset();
    capturedDate = new Date(capturedDate.getTime() - (offset * 60 * 1000))
    recordId = $(siblings[5]).text()

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
            url: 'BackEnd/aicRequests.php',
            type: "POST",
            dataType: 'json',
            data: data,
            success: function (response) {
                if (localStorage.isParent == "isParent") {
                    $(aicData.tableRow[0]).text($("#aicFormPackageId :selected").text() + " - " + $("#aicFormPackageName").val()) // package id - name
                }


                $(aicData.tableRow[2]).text(new Date($("#aicFormCapturedDate").val()).toDateString()) // image captured date
                $("#addEditAIC").show().hide()
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
    var recordId = $(aicData.tableRow[5]).text()
    var packageId = $(aicData.tableRow[0]).text().split("-")[0]
    data = {
        runFunction: "reviseAicImage",
        AicId: recordId,
        imgfileName: aicResumable.files[0].fileName
    }

    $.ajax({
        url: 'BackEnd/aicRequests.php',
        type: "POST",
        dataType: 'json',
        data: data,
        success: function (response) {
            $("#addEditAIC").show().hide()
            $("#aicFormCapturedDate").val("")
            //change params for map viewer
            let changedRow = $("#aicRecordTable tr").filter(function () { return $(this).attr("data") == response.aicId })
            $(changedRow).children().last().children().children().last().children().first().attr("onClick", `aicViewImage('${response.fileName}','${packageId}')`)
            $('#AicRoutineList').find('li.active').click();
        }
    });
}

function saveAicRoutineInfo() {
    var imgfileName
    if (aicResumable.files.length > 0) {
        imgfileName = aicResumable.files[0].fileName;
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
        routineType: $("#AicRoutineType").val()
    }
    var concatString
    if (localStorage.isParent == "isParent") {
        concatString = '<td>' + $("#aicFormPackageId").val() + ' - ' + $("#aicFormPackageName").val() + '</td>'
    } else {
        concatString = '<td>' + localStorage.p_id + ' - ' + localStorage.p_name + '</td>'
    }

    $.ajax({
        url: 'BackEnd/aicRequests.php',
        type: "POST",
        dataType: 'json',
        data: data,
        success: function (response) {
            $("#" + aicData.selected + " div:first-child").removeClass("late")
            $("#" + aicData.selected + " div:first-child").addClass("file")
            $("#gdiv2 .tablecontainer").show()
            $("#addEditAIC").show().hide()
            $("#aicFormCapturedDate").val("")
            $("#" + aicData.selected).trigger("click");
        }
    });
}

function cancelAicForm() {
    aicClear()
    $("#addEditAIC").show().hide()
}

function getWMSCap() {
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
        url: 'BackEnd/DataFunctions.php',
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

//support
function OnClickRaiseSupport(){
    window.open('BackEnd/jogetloginSupport.php', '_blank');
   
}

function onClickCreateProjectProgress(){
    let url = JOGETLINK.cons_issue_PPU;

    $("#digitalReportingInfo iframe").attr("src", url);
}

function onClickRetrieveProjectProgress(){
    let url = JOGETLINK.cons_datalist_PPU;

    $("#digitalReportingInfo iframe").attr("src", url);
}

function onClickCreateProjectFeature(){
    let url = JOGETLINK.//jogetClss Link;

    $("#digitalReportingInfo iframe").attr("src", url);
}

function onClickRetrieveProjectFeature(){
    let url = JOGETLINK.//jogetclass Link;

    $("#digitalReportingInfo iframe").attr("src", url);
}

window.addEventListener("message", (event) => {
    if (event.data.eventType && event.data.eventType == "submitForm" && event.data.processName) {
        var contentMsg;
        if(event.data.processName == "PP"){
                contentMsg = "Project progress successfully submitted!";
        }
      
        $.alert({
            boxWidth: '30%',
            useBootstrap: false,
            title: 'Success!',
            content: contentMsg
        });
    }
  
}, false);