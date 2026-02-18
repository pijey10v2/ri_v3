//var jogetHost = "https://jogetk.reveronconsulting.com/";
var jogetFinanceAppProcesses = JSON.parse(localStorage.appsLinks);
var appid = jogetFinanceAppProcesses['financePackage_name'].split("::")[0];
var projectDetailsFlag = false;
updateNotifications();
updateProjectFinanceDetails();

// //if variable in url the open form
// var url_string = window.location.href
// var url = new URL(url_string);
// var actid = url.searchParams.get("actid");
// var processname = url.searchParams.get("p");
// console.log(actid);
// if (actid && processname) {
//     console.log(actid);
//     openActivityForm(actid, processname);
// }
// update the projects on the side bar menu ******** start/
var projectlist = JSON.parse(localStorage.projectlist);

projectlist.sort((a, b) => (a.project_name.toUpperCase() > b.project_name.toUpperCase()) ? 1 : -1)
// console.log(projectlist);
////////////////////////////////////////////////////
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
        <input  name='buttonclicked' id= 'buttonclicked' value= 'finance' style = 'display:none'>\
        <span class='img'><img src='" + projectIcon(projectlistChild[i].icon_url) + "'></span><span class='atag'><a>" + projectlistChild[i].project_name + "</a></span></button>\
        </form>"
    )
}
for (i = 0; i < projectlistOther.length; i++) {
    $("#projectslistOther").append(
        "<form action='login/postlogin_processing' method='POST'>\
        <button id='proID" + projectlistOther[i].project_id + "' value='" + projectlistOther[i].project_id + "' name ='projectid' action='submit'>\
        <input  name='buttonclicked' id= 'buttonclicked' value= 'finance' style = 'display:none'>\
        <span class='img'><img src='" + projectIcon(projectlistOther[i].icon_url) + "'></span><span class='atag'><a>" + projectlistOther[i].project_name + "</a></span></button>\
        </form>"
    )
}
// update the projects on the side bar menu ******** end/

history.pushState(null, null, location.href);

window.onpopstate = function () {
    history.go(1);
}

function changebackgroundinitialcolor() {
    let $fname = $("#newfirstname").val();
    let initial = $fname.substring(0, 1);

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
        $(".systemadminformView .formContent .newuserPicture .newuserInitial").css(
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
        $(".systemadminformView .formContent .newuserPicture").css(
            "background",
            col_bkt
        );
        $(".systemadminformView .formContent .newuserPicture .newuserInitial").css(
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
        $(".systemadminformView .formContent .newuserPicture").css(
            "background",
            col_clu
        );
        $(".systemadminformView .formContent .newuserPicture .newuserInitial").css(
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
        $(".systemadminformView .formContent .newuserPicture").css(
            "background",
            col_dmv
        );
        $(".systemadminformView .formContent .newuserPicture .newuserInitial").css(
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
        var col_enw = "black";
        $(".systemadminformView .formContent .newuserPicture").css(
            "background",
            col_enw
        );
        $(".systemadminformView .formContent .newuserPicture .newuserInitial").css(
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
        $(".systemadminformView .formContent .newuserPicture").css(
            "background",
            col_fox
        );
        $(".systemadminformView .formContent .newuserPicture .newuserInitial").css(
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
        $(".systemadminformView .formContent .newuserPicture").css(
            "background",
            col_gpy
        );
        $(".systemadminformView .formContent .newuserPicture .newuserInitial").css(
            "background",
            col_gpy
        );
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
        $(".systemadminformView .formContent .newuserPicture .newuserInitial").css(
            "background",
            col_hqz
        );
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
        $(".systemadminformView .formContent .newuserPicture .newuserInitial").css(
            "background",
            col_ir
        );
    }
}

function enlargeformSize() {
    $(".systemadminformView .formContent").animate({
        width: "90%",
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

function enlargeformSize2() {
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

function enlargenewuser() {
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

function minimizenewuser() {
    $(".systemadminformView .formContent").animate({
        width: "40%",
        margin: "5% auto",
    },
        250
    );
    $(".systemadminformView .formContent .formcontainerMainBody").animate({
        height: "60vh",
    },
        250,
        function () {
            $(".newuserPicture").fadeOut();
        }
    );
}

function shrinkformSize() {
    $(".systemadminformView .formContent").animate({
        width: "40%",
        margin: "5% auto",
    },
        250
    );
    $(".systemadminformView .formContent .formcontainerMainBody").animate({
        height: "60vh",
    },
        250
    );
}

function openNavbar() {
    $(window).resize(function () {
        $("#main-claims").css("width", "100%").css("width", "-=340px");
        $("#main-data").css("width", "100%").css("width", "-=340px");
        $("#main-vo").css("width", "100%").css("width", "-=340px");
    });
    $("#sidebar-admin").addClass("active");
    $("#sidebar-admin")
        .css({
            width: 60,
        })
        .animate({
            width: "300px",
        },
            100,
            function () {
                $(".sidebar-items li a").fadeIn(50);
                $(".sidebar-items li div.arrow").fadeIn(50);
            }
        );

    $("#main-claims").css("width", "calc(100% - 70px)").animate({
        width: "-=280px",
    },
        100
    );
    $("#main-data").css("width", "calc(100% - 70px)").animate({
        width: "-=280px",
    },
        100
    );
    $("#main-vo").css("width", "calc(100% - 70px)").animate({
        width: "-=280px",
    },
        100
    );
}

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

    function closeAllMain() {
        $("#main-claims").css("display", "none");
        $("#main-claims").removeClass("active");

        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");

        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
    }

    function openNavbar() {
        $(window).resize(function () {
            $("#main-home").css("width", "calc(100% - 70px)").css("width", "-=280px");
            $("#main-claims").css("width", "calc(100% - 70px)").css("width", "-=280px");
            $("#main-budget").css("width", "calc(100% - 70px)").css("width", "-=280px");
            $("#main-contracts").css("width", "calc(100% - 70px)").css("width", "-=280px");
            $("#main-vo").css("width", "calc(100% - 70px)").css("width", "-=280px");
            $("#main-amendment").css("width", "calc(100% - 70px)").css("width", "-=280px");
        });

        if ($(window).width() <= "1366") {
            $("#sidebar-admin").addClass("active");
            $("#sidebar-admin").fadeIn().css({ width: 43, }).animate({ width: "220px", }, 100, function () {
                $(".sidebar-items li a").fadeIn(50);
                $(".sidebar-items li div.arrow").fadeIn(50);
            });
            $("#main-home").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
            $("#main-claims").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
            $("#main-budget").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
            $("#main-contracts").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
            $("#main-vo").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
            $("#main-amendment").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        } else if (window.devicePixelRatio >= 1.25) {
            $("#sidebar-admin").addClass("active");
            $("#sidebar-admin").fadeIn().css({ width: 43, }).animate({ width: "220px", }, 100, function () {
                $(".sidebar-items li a").fadeIn(50);
                $(".sidebar-items li div.arrow").fadeIn(50);
            });
            $("#main-home").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
            $("#main-claims").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
            $("#main-budget").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
            $("#main-contracts").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
            $("#main-vo").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
            $("#main-amendment").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        } else {
            $("#sidebar-admin").addClass("active");
            $("#sidebar-admin").fadeIn().css({ width: 60, }).animate({ width: "300px", }, 100, function () {
                $(".sidebar-items li a").fadeIn(50);
                $(".sidebar-items li div.arrow").fadeIn(50);
            });
            $("#main-home").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
            $("#main-claims").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
            $("#main-budget").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
            $("#main-contracts").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
            $("#main-vo").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
            $("#main-amendment").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
        }
    }

    function closeNavbar() {
        $(window).resize(function () {
            $("#main-home.active").css("width", "100%").css("width", "-=100px");
            $("#main-claims.active").css("width", "100%").css("width", "-=100px");
            $("#main-contracts.active").css("width", "100%").css("width", "-=100px");
            $("#main-budget.active").css("width", "100%").css("width", "-=100px");
            $("#main-vo.active").css("width", "100%").css("width", "-=100px");
            $("#main-amendment.active").css("width", "100%").css("width", "-=100px");
        });

        if ($(window).width() <= "1366") {
            // actual animation of the sidebar (shrink). The main page will increase width accrding to the sidebar.
            $(".sidebar-items .adminItems.active").removeClass("active");
            $(".sidebar-items .admin-subbuttons").css("display", "none");
            $(".sidebar-items li a").fadeOut(50);
            $(".sidebar-items li div.arrow").fadeOut(50);
            $(".sidebar-items .adminItems div.arrow").removeClass("active");
            $("#sidebar-admin").removeClass("active");
            $("#sidebar-admin").fadeIn().css({ width: 250, }).animate({ width: "43px", }, 100, function () {
                $("#main-home").css("width", "100%").css("width", "-=80px");
                $("#main-claims").css("width", "100%").css("width", "-=80px");
                $("#main-contracts").css("width", "100%").css("width", "-=80px");
                $("#main-budget").css("width", "100%").css("width", "-=80px");
                $("#main-vo").css("width", "100%").css("width", "-=80px");
                $("#main-amendment").css("width", "100%").css("width", "-=80px");
            });
        } else if (window.devicePixelRatio >= 1.25) {
            // actual animation of the sidebar (shrink). The main page will increase width accrding to the sidebar.
            $(".sidebar-items .adminItems.active").removeClass("active");
            $(".sidebar-items .admin-subbuttons").css("display", "none");
            $(".sidebar-items li a").fadeOut(50);
            $(".sidebar-items li div.arrow").fadeOut(50);
            $(".sidebar-items .adminItems div.arrow").removeClass("active");
            $("#sidebar-admin").removeClass("active");
            $("#sidebar-admin").fadeIn().css({ width: 250, }).animate({ width: "43px", }, 100, function () {
                $("#main-home").css("width", "100%").css("width", "-=80px");
                $("#main-claims").css("width", "100%").css("width", "-=80px");
                $("#main-contracts").css("width", "100%").css("width", "-=80px");
                $("#main-budget").css("width", "100%").css("width", "-=80px");
                $("#main-vo").css("width", "100%").css("width", "-=80px");
                $("#main-amendment").css("width", "100%").css("width", "-=80px");
            });
        } else {
            // actual animation of the sidebar (shrink). The main page will increase width accrding to the sidebar.
            $(".sidebar-items .adminItems.active").removeClass("active");
            $(".sidebar-items .admin-subbuttons").css("display", "none");
            $(".sidebar-items li a").fadeOut(50);
            $(".sidebar-items li div.arrow").fadeOut(50);
            $(".sidebar-items .adminItems div.arrow").removeClass("active");
            $("#sidebar-admin").removeClass("active");
            $("#sidebar-admin").fadeIn().css({ width: 300, }).animate({ width: "60px", }, 100, function () {
                $("#main-home").css("width", "100%").css("width", "-=100px");
                $("#main-claims").css("width", "100%").css("width", "-=100px");
                $("#main-contracts").css("width", "100%").css("width", "-=100px");
                $("#main-budget").css("width", "100%").css("width", "-=100px");
                $("#main-vo").css("width", "100%").css("width", "-=100px");
                $("#main-amendment").css("width", "100%").css("width", "-=100px");
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
    $(".sidebar-items .adminItems").on("click", function () {
        let buttonClicked = $(this).attr("id");
        let subbuttonOpen = $(this).attr("rel");
        let subbuttonHide = $(".adminItems.active").attr("rel");
        let arrowchange = $("#" + buttonClicked + " div.arrow");
        $(".subbutton-button.active").removeClass("active")
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active")

        // animation for expanding the 2nd layer button and the menu is active
        if (!$(this).hasClass("active") && $("#sidebar-admin").hasClass("active")) {
            $(".sidebar-items .adminItems.active").removeClass("active");
            $("#" + buttonClicked).addClass("active");
            $("#" + subbuttonOpen).slideDown(100);
            $("#" + subbuttonHide).slideUp(100);
            $(".adminItems div.arrow.active").removeClass("active");
            $(arrowchange).addClass("active");
            $("#" + subbuttonHide).removeClass("active");
        } else {
            if (buttonClicked !== "adminItems-account") {
                $("#" + buttonClicked).removeClass("active");
                $("#" + subbuttonOpen).slideUp(100);
                $("#" + subbuttonHide).slideUp(100);
                $(".adminItems div.arrow.active").removeClass("active");
                $(arrowchange).removeClass("active");
                $("#" + subbuttonHide).removeClass("active");
            } else { }
        }

        // animation for closing the other page and opening the main page
        // check if the clicked amItems is account or other page

        if (
            buttonClicked == "adminItems-budget" &&
            $("#sidebar-admin").hasClass("active")
        ) {
            // if other adminItems is clicked, hide all pages and show the home page.
            closeAllMain()
            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        } else if (
            buttonClicked == "adminItems-budget" &&
            !$("#sidebar-admin").hasClass("active")
        ) {
            openNavbar();
            closeAllMain()

            $(".adminItems#adminItems-budget").addClass("active");
            $(".admin-subbuttons#adminsub-budget").slideDown(100);

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        }
        if (
            buttonClicked == "adminItems-contracts" &&
            $("#sidebar-admin").hasClass("active")
        ) {
            // if other adminItems is clicked, hide all pages and show the home page.
            closeAllMain()
            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        } else if (
            buttonClicked == "adminItems-contracts" &&
            !$("#sidebar-admin").hasClass("active")
        ) {
            openNavbar();
            closeAllMain()

            $(".adminItems#adminItems-contracts").addClass("active");
            $(".admin-subbuttons#adminsub-contracts").slideDown(100);

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        }
        if (
            buttonClicked == "adminItems-claims" &&
            $("#sidebar-admin").hasClass("active")
        ) {
            // if other adminItems is clicked, hide all pages and show the home page.
            closeAllMain()
            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        } else if (
            buttonClicked == "adminItems-claims" &&
            !$("#sidebar-admin").hasClass("active")
        ) {
            openNavbar();
            closeAllMain()

            $(".adminItems#adminItems-claims").addClass("active");
            $(".admin-subbuttons#adminsub-claims").slideDown(100);

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        }
        if (
            buttonClicked == "adminItems-claims-periodic" &&
            $("#sidebar-admin").hasClass("active")
        ) {
            // if other adminItems is clicked, hide all pages and show the home page.
            closeAllMain()
            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        } else if (
            buttonClicked == "adminItems-claims-periodic" &&
            !$("#sidebar-admin").hasClass("active")
        ) {
            openNavbar();
            closeAllMain()

            $(".adminItems#adminItems-claims-periodic").addClass("active");
            $(".admin-subbuttons#adminsub-claims-periodic").slideDown(100);

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        }
        if (
            buttonClicked == "adminItems-claims-hq" &&
            $("#sidebar-admin").hasClass("active")
        ) {
            // if other adminItems is clicked, hide all pages and show the home page.
            closeAllMain()
            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        } else if (
            buttonClicked == "adminItems-claims-hq" &&
            !$("#sidebar-admin").hasClass("active")
        ) {
            openNavbar();
            closeAllMain()

            $(".adminItems#adminItems-claims-hq").addClass("active");
            $(".admin-subbuttons#adminsub-claims-hq").slideDown(100);

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        }
        if (
            buttonClicked == "adminItems-claims-per-hq" &&
            $("#sidebar-admin").hasClass("active")
        ) {
            // if other adminItems is clicked, hide all pages and show the home page.
            closeAllMain()
            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        } else if (
            buttonClicked == "adminItems-claims-per-hq" &&
            !$("#sidebar-admin").hasClass("active")
        ) {
            openNavbar();
            closeAllMain()

            $(".adminItems#adminItems-claims-per-hq").addClass("active");
            $(".admin-subbuttons#adminsub-claims-per-hq").slideDown(100);

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        }
        if (
            buttonClicked == "adminItems-project" &&
            $("#sidebar-admin").hasClass("active")
        ) {
            // if other adminItems is clicked, hide all pages and show the home page.
            closeAllMain()
            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        } else if (
            buttonClicked == "adminItems-project" &&
            !$("#sidebar-admin").hasClass("active")
        ) {
            openNavbar();
            closeAllMain()

            $(".adminItems#adminItems-project").addClass("active");
            $(".admin-subbuttons#adminsub-project").slideDown(100);

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        } else if (
            buttonClicked == "adminItems-amendment" &&
            !$("#sidebar-admin").hasClass("active")
        ) {
            console.log("amend");
            openNavbar();
            closeAllMain()

            $(".adminItems#adminItems-amendment").addClass("active");
            $(".admin-subbuttons#adminsub-amendment").slideDown(100);

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        }
    });

    // animation for clicking the subbuttons on the left bar//
    $(".subbutton-button").on("click", function () {
        //$thigtoOpen = $(this).attr('rel')
        $buttonClicked = $(this).attr("id");

        $(".subbutton-button").removeClass("active");
        $("#" + $buttonClicked).addClass("active");
        //$("#"+ $thigtoOpen).css('display','block')
        //$("#"+ $thigtoOpen).addClass('active')
    });

    function hideButtonandCounter() {
        $("#main-claims .checkcounter #userchecked").html("");
        $("#main-claims .checkcounter #userchecked").fadeOut("fast");
        $("#main-claims .checkcounter #sysadmindeleteUser").css("display", "none");

        $("#main-vo .checkcounter #projectchecked").html("");
        $("#main-vo .checkcounter #projectchecked").fadeOut("fast");
        $("#main-vo .searchTable #sysadmindeleteProject").css(
            "display",
            "none"
        );

        $("#main-amendment .checkcounter #archiveduserchecked").html("");
        $("#main-amendment .checkcounter #archiveduserchecked").fadeOut("fast");
        $("#main-amendment .checkcounter #systemadminrecoverUser").css(
            "display",
            "none"
        );
        $("#main-amendment .checkcounter #systemadmindeleteparmanentUser").css(
            "display",
            "none"
        );

        $("#archived-project .checkcounter #archivedprojectchecked").html("");
        $("#archived-project .checkcounter #archivedprojectchecked").fadeOut(
            "fast"
        );
        $("#archived-project .checkcounter #systemadminrecoverProject").css(
            "display",
            "none"
        );
        $("#archived-project .checkcounter #systemadmindeleteparmanentProject").css(
            "display",
            "none"
        );

        $("table input[type='checkbox']").prop("checked", false);
    }

    ///   Animaiion for the main page to display ///
    // show/hide table when the active user button is clicked

    $(".admin-subbuttons .subbutton-button#addEditDetails").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-contracts.active").css("display", "none");
        $("#main-contracts.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
       
        $("#main-budget").fadeIn(150);
        $("#main-budget").addClass("active");

        hideButtonandCounter();
    });

    $(".admin-subbuttons .subbutton-button#projectDetails").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-contracts.active").css("display", "none");
        $("#main-contracts.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
        
        $("#main-budget").fadeIn(150);
        $("#main-budget").addClass("active");

        hideButtonandCounter();
    });

    $(".admin-subbuttons .subbutton-button#publishedContracts").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
        
        $("#main-contracts").fadeIn(150);
        $("#main-contracts").addClass("active");

        hideButtonandCounter();
    });

    $(".admin-subbuttons .subbutton-button#contractsInbox").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
     
        $("#main-contracts").fadeIn(150);
        $("#main-contracts").addClass("active");

        hideButtonandCounter();
    });

    $(".admin-subbuttons .subbutton-button#newContract").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
        
        $("#main-contracts").fadeIn(150);
        $("#main-contracts").addClass("active");

        hideButtonandCounter();
    });
    $(".admin-subbuttons .subbutton-button#rejectedContract").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
        
        $("#main-contracts").fadeIn(150);
        $("#main-contracts").addClass("active");

        hideButtonandCounter();
    });


    $(".admin-subbuttons .subbutton-button#rejectedContract").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
        
        $("#main-contracts").fadeIn(150);
        $("#main-contracts").addClass("active");

        hideButtonandCounter();
    });

    
    $(".admin-subbuttons .subbutton-button#routineContractAmend").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
        
        $("#main-contracts").fadeIn(150);
        $("#main-contracts").addClass("active");

        hideButtonandCounter();
    });

    $(".admin-subbuttons .subbutton-button#routineContractAmendList").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
        
        $("#main-contracts").fadeIn(150);
        $("#main-contracts").addClass("active");

        hideButtonandCounter();
    });

    $(".admin-subbuttons .subbutton-button#claimsInbox").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
        
        $("#main-claims").fadeIn(150);
        $("#main-claims").addClass("active");

        hideButtonandCounter();
    });

    $(".admin-subbuttons .subbutton-button#currentClaims").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
       
        $("#main-claims").fadeIn(150);
        $("#main-claims").addClass("active");

        hideButtonandCounter();
    });
    $(".admin-subbuttons .subbutton-button#newClaim").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
        
        $("#main-claims").fadeIn(150);
        $("#main-claims").addClass("active");

        hideButtonandCounter();
    });
    $(".admin-subbuttons .subbutton-button#claimsRejected").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
        
        $("#main-claims").fadeIn(150);
        $("#main-claims").addClass("active");


        hideButtonandCounter();
    });
    $(".admin-subbuttons .subbutton-button#claimsApproved").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
        
        $("#main-claims").fadeIn(150);
        $("#main-claims").addClass("active");

        hideButtonandCounter();
    });
// for periodic claims and overall claims for parent project for asset
    $(".admin-subbuttons .subbutton-button.claimpage").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
        
        $("#main-claims").fadeIn(150);
        $("#main-claims").addClass("active");

        hideButtonandCounter();
    });


    // show/hide table when the active project button is clicked
    $(".admin-subbuttons .subbutton-button#currentVO").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
        
        $("#main-vo").fadeIn(150);
        $("#main-vo").addClass("active");

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#newVO").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
        
        $("#main-vo").fadeIn(150);
        $("#main-vo").addClass("active");

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#voInbox").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
       
        $("#main-vo").fadeIn(150);
        $("#main-vo").addClass("active");

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#rejectedVO").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
        
        $("#main-vo").fadeIn(150);
        $("#main-vo").addClass("active");

        hideButtonandCounter();
    }
    );
    $(".admin-subbuttons .subbutton-button#approvedVO").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-amendment.active").css("display", "none");
        $("#main-amendment.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
       
        $("#main-vo").fadeIn(150);
        $("#main-vo").addClass("active");

        hideButtonandCounter();
    }
    );

    // show/hide table when the inactive user button is clicked
    $(".admin-subbuttons .subbutton-button#amendmentInbox").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
        
        $("#main-amendment").fadeIn(150);
        $("#main-amendment").removeClass("active");

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#newAmendment").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
   
        $("#main-amendment").fadeIn(150);
        $("#main-amendment").removeClass("active");

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#amendments").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
      
        $("#main-amendment").fadeIn(150);
        $("#main-amendment").removeClass("active");

        hideButtonandCounter();
    }
    );
    $(".admin-subbuttons .subbutton-button#archivedContracts").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
     
        $("#main-amendment").fadeIn(150);
        $("#main-amendment").removeClass("active");

        hideButtonandCounter();
    }
    );

    // show/hide table when the inactive user button is clicked
    $(".admin-subbuttons .subbutton-button#scheduledatabutton").on("click", function () {

        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-amendment").css("display", "none");
        $("#main-amendment").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
      
        $("#main-schedule").fadeIn(150);
        $("#main-schedule").addClass("active");

        hideButtonandCounter();
    }
    );

    // show/hide table when the inactive user button is clicked
    $(".admin-subbuttons .subbutton-button#importunitsbutton").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-amendment").css("display", "none");
        $("#main-amendment").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
    
        $("#main-unit").fadeIn(150);
        $("#main-unit").addClass("active");

        hideButtonandCounter();
    }
    );

    // show/hide table when the inactive user button is clicked
    $(".admin-subbuttons .subbutton-button#ratesbutton").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-amendment").css("display", "none");
        $("#main-amendment").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
    
        $("#main-rates").fadeIn(150);
        $("#main-rates").addClass("active");

        hideButtonandCounter();
    }
    );

    // show/hide table when the inactive user button is clicked
    $(".admin-subbuttons .subbutton-button#locationfactorbutton").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $("#main-claims.active").css("display", "none");
        $("#main-claims.active").removeClass("active");
        $("#main-vo.active").css("display", "none");
        $("#main-vo.active").removeClass("active");
        $("#main-contracts").css("display", "none");
        $("#main-contracts").removeClass("active");
        $("#main-budget.active").css("display", "none");
        $("#main-budget.active").removeClass("active");
        $("#main-amendment").css("display", "none");
        $("#main-amendment").removeClass("active");
        $("#main-schedule").css("display", "none");
        $("#main-schedule").removeClass("active");
        $("#main-unit").css("display", "none");
        $("#main-unit").removeClass("active");
        $("#main-rates").css("display", "none");
        $("#main-rates").removeClass("active");
        $("#main-location-factor").css("display", "none");
        $("#main-location-factor").removeClass("active");
    
        $("#main-location-factor").fadeIn(150);
        $("#main-location-factor").addClass("active");

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
        if ($buttonClicked == "publishedContracts") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-contracts").addClass("active");
            $(".admin-subbuttons#adminsub-contracts").slideDown(100);
            $(".adminItems#adminItems-contracts .arrow").addClass("active");

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
            $(".admin-subbuttons .subbutton-button#publishedContracts").click();
            // $("#main-home.active").css("display", "none");
            // $("#main-home.active").removeClass("active");
            // $("#main-vo.active").css("display", "none");
            // $("#main-vo.active").removeClass("active");
            // $("#main-amendment.active").css("display", "none");
            // $("#main-amendment.active").removeClass("active");
            // $("#main-claims").css("display", "none");
            // $("#main-claims").removeClass("active");
            // $("#main-budget.active").css("display", "none");
            // $("#main-budget.active").removeClass("active");

            // $("#main-contracts").fadeIn(150);
            // $("#main-contracts").addClass("active");

            // if (!$(".sidebar-items .adminItems#adminItems-contracts").hasClass("active")) {
            //     $(".sidebar-items .adminItems.active").removeClass("active");
            //     $("#" + $subbuttonHide).slideUp(100);
            //     $(".sidebar-items .adminItems#adminItems-contracts").addClass("active");
            //     $("#" + $subbuttonstoShow).slideDown(100);
            //     console.log("true")
            // }

            // $(".sidebar-items .adminItems div.arrow.active").removeClass("active");
            // $(".sidebar-items .adminItems#adminItems-contracts div.arrow").addClass(
            //     "active"
            // );
        } else if ($buttonClicked == "contractsInbox") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-contracts").addClass("active");
            $(".admin-subbuttons#adminsub-contracts").slideDown(100);
            $(".adminItems#adminItems-contracts .arrow").addClass("active");

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
            $(".admin-subbuttons .subbutton-button#contractsInbox").click();

            // $("#main-home.active").css("display", "none");
            // $("#main-home.active").removeClass("active");
            // $("#main-vo.active").css("display", "none");
            // $("#main-vo.active").removeClass("active");
            // $("#main-amendment.active").css("display", "none");
            // $("#main-amendment.active").removeClass("active");
            // $("#archived-project.active").css("display", "none");
            // $("#archived-project.active").removeClass("active");
            // $("#main-account.active").css("display", "none");
            // $("#main-account.active").removeClass("active");
            // $("#main-claims").css("display", "none");
            // $("#main-claims").removeClass("active");
            // $("#main-budget.active").css("display", "none");
            // $("#main-budget.active").removeClass("active");

            // $("#main-contracts").fadeIn(150);
            // $("#main-contracts").addClass("active");


            // if (!$(".sidebar-items .adminItems#adminItems-contracts").hasClass("active")) {
            //     $(".sidebar-items .adminItems.active").removeClass("active");
            //     $("#" + $subbuttonHide).slideUp(100);
            //     $(".sidebar-items .adminItems#adminItems-contracts").addClass("active");
            //     $("#" + $subbuttonstoShow).slideDown(100);
            // }

            // $(".sidebar-items .adminItems div.arrow.active").removeClass("active");
            // $(".sidebar-items .adminItems#adminItems-contracts div.arrow").addClass(
            //     "active"
            // );
        } else if ($buttonClicked == "newContract") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-contracts").addClass("active");
            $(".adminItems#adminItems-contracts .arrow").addClass("active");
            $(".admin-subbuttons#adminsub-contracts").slideDown(100);

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
            $(".admin-subbuttons .subbutton-button#newContract").click();
            // $("#main-home.active").css("display", "none");
            // $("#main-home.active").removeClass("active");
            // $("#main-vo.active").css("display", "none");
            // $("#main-vo.active").removeClass("active");
            // $("#main-amendment.active").css("display", "none");
            // $("#main-amendment.active").removeClass("active");
            // $("#archived-project.active").css("display", "none");
            // $("#archived-project.active").removeClass("active");
            // $("#main-account.active").css("display", "none");
            // $("#main-account.active").removeClass("active");
            // $("#main-claims").css("display", "none");
            // $("#main-claims").removeClass("active");
            // $("#main-budget.active").css("display", "none");
            // $("#main-budget.active").removeClass("active");

            // $("#main-contracts").fadeIn(150);
            // $("#main-contracts").addClass("active");


            // if (!$(".sidebar-items .adminItems#adminItems-contracts").hasClass("active")) {
            //     $(".sidebar-items .adminItems.active").removeClass("active");
            //     $("#" + $subbuttonHide).slideUp(100);
            //     $(".sidebar-items .adminItems#adminItems-contracts").addClass("active");
            //     $("#" + $subbuttonstoShow).slideDown(100);
            // }

            // $(".sidebar-items .adminItems div.arrow.active").removeClass("active");
            // $(".sidebar-items .adminItems#adminItems-contracts div.arrow").addClass(
            //     "active"
            // );

        } else if ($buttonClicked == "rejectedContract") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-contracts").addClass("active");
            $(".admin-subbuttons#adminsub-contracts").slideDown(100);
            $(".adminItems#adminItems-contracts .arrow").addClass("active");

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
            $(".admin-subbuttons .subbutton-button#rejectedContract").click();
            // $("#main-home.active").css("display", "none");
            // $("#main-home.active").removeClass("active");
            // $("#main-vo.active").css("display", "none");
            // $("#main-vo.active").removeClass("active");
            // $("#main-amendment.active").css("display", "none");
            // $("#main-amendment.active").removeClass("active");
            // $("#archived-project.active").css("display", "none");
            // $("#archived-project.active").removeClass("active");
            // $("#main-account.active").css("display", "none");
            // $("#main-account.active").removeClass("active");
            // $("#main-claims").css("display", "none");
            // $("#main-claims").removeClass("active");
            // $("#main-budget.active").css("display", "none");
            // $("#main-budget.active").removeClass("active");

            // $("#main-contracts").fadeIn(150);
            // $("#main-contracts").addClass("active");


            // if (!$(".sidebar-items .adminItems#adminItems-contracts").hasClass("active")) {
            //     $(".sidebar-items .adminItems.active").removeClass("active");
            //     $("#" + $subbuttonHide).slideUp(100);
            //     $(".sidebar-items .adminItems#adminItems-contracts").addClass("active");
            //     $("#" + $subbuttonstoShow).slideDown(100);
            // }

            // $(".sidebar-items .adminItems div.arrow.active").removeClass("active");
            // $(".sidebar-items .adminItems#adminItems-contracts div.arrow").addClass(
            //     "active"
            // );
        } else if ($buttonClicked == "routineContractAmend") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-contracts").addClass("active");
            $(".admin-subbuttons#adminsub-contracts").slideDown(100);
            $(".adminItems#adminItems-contracts .arrow").addClass("active");

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
            $(".admin-subbuttons .subbutton-button#routineContractAmend").click();
           
        } else if ($buttonClicked == "routineContractAmendList") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-contracts").addClass("active");
            $(".admin-subbuttons#adminsub-contracts").slideDown(100);
            $(".adminItems#adminItems-contracts .arrow").addClass("active");

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
            $(".admin-subbuttons .subbutton-button#routineContractAmendList").click();
           
        } else if ($buttonClicked == "claimsInbox") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims").addClass("active");
            $(".admin-subbuttons#adminsub-claims").slideDown(100);
            $(".adminItems#adminItems-claims .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#claimsInbox").click();
            // $("#main-home.active").css("display", "none");
            // $("#main-home.active").removeClass("active");
            // $("#main-vo.active").css("display", "none");
            // $("#main-vo.active").removeClass("active");
            // $("#main-amendment.active").css("display", "none");
            // $("#main-amendment.active").removeClass("active");
            // $("#archived-project.active").css("display", "none");
            // $("#archived-project.active").removeClass("active");
            // $("#main-account.active").css("display", "none");
            // $("#main-account.active").removeClass("active");
            // $("#main-contracts").css("display", "none");
            // $("#main-contracts").removeClass("active");
            // $("#main-budget.active").css("display", "none");
            // $("#main-budget.active").removeClass("active");

            // $("#main-claims").fadeIn(150);
            // $("#main-claims").addClass("active");

            // if (!$(".sidebar-items .adminItems#adminItems-claims").hasClass("active")) {
            //     $(".sidebar-items .adminItems.active").removeClass("active");
            //     $("#" + $subbuttonHide).slideUp(100);
            //     $(".sidebar-items .adminItems#adminItems-claims").addClass("active");
            //     $("#" + $subbuttonstoShow).slideDown(100);
            // }

            // $(".sidebar-items .adminItems div.arrow.active").removeClass("active");
            // $(".sidebar-items .adminItems#adminItems-claims div.arrow").addClass(
            //     "active"
            // );
        } else if ($buttonClicked == "currentClaims") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims").addClass("active");
            $(".admin-subbuttons#adminsub-claims").slideDown(100);
            $(".adminItems#adminItems-claims .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#currentClaims").click();
            // $("#main-home.active").css("display", "none");
            // $("#main-home.active").removeClass("active");
            // $("#main-vo.active").css("display", "none");
            // $("#main-vo.active").removeClass("active");
            // $("#main-amendment.active").css("display", "none");
            // $("#main-amendment.active").removeClass("active");
            // $("#archived-project.active").css("display", "none");
            // $("#archived-project.active").removeClass("active");
            // $("#main-account.active").css("display", "none");
            // $("#main-account.active").removeClass("active");
            // $("#main-contracts").css("display", "none");
            // $("#main-contracts").removeClass("active");
            // $("#main-budget.active").css("display", "none");
            // $("#main-budget.active").removeClass("active");

            // $("#main-claims").fadeIn(150);
            // $("#main-claims").addClass("active");

            // if (!$(".sidebar-items .adminItems#adminItems-claims").hasClass("active")) {
            //     $(".sidebar-items .adminItems.active").removeClass("active");
            //     $("#" + $subbuttonHide).slideUp(100);
            //     $(".sidebar-items .adminItems#adminItems-claims").addClass("active");
            //     $("#" + $subbuttonstoShow).slideDown(100);
            // }

            // $(".sidebar-items .adminItems div.arrow.active").removeClass("active");
            // $(".sidebar-items .adminItems#adminItems-claims div.arrow").addClass(
            //     "active"
            // );
        } else if ($buttonClicked == "newClaim") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims").addClass("active");
            $(".admin-subbuttons#adminsub-claims").slideDown(100);
            $(".adminItems#adminItems-claims .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#newClaim").click();
        } else if ($buttonClicked == "claimsRejected") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims").addClass("active");
            $(".admin-subbuttons#adminsub-claims").slideDown(100);
            $(".adminItems#adminItems-claims .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#claimsRejected").click();
        } else if ($buttonClicked == "claimsApproved") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims").addClass("active");
            $(".admin-subbuttons#adminsub-claims").slideDown(100);
            $(".adminItems#adminItems-claims .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#claimsApproved").click();
        }else if ($buttonClicked == "claimsInboxPeriodic") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims-periodic").addClass("active");
            $(".admin-subbuttons#adminsub-claims-periodic").slideDown(100);
            $(".adminItems#adminItems-claims-periodic .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#claimsInboxPeriodic").click();
           
        } else if ($buttonClicked == "currentClaimsPeriodic") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims-periodic").addClass("active");
            $(".admin-subbuttons#adminsub-claims-periodic").slideDown(100);
            $(".adminItems#adminItems-claims-periodic .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#currentClaimsPeriodic").click();
          
        } else if ($buttonClicked == "newClaimPeriodic") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims-periodic").addClass("active");
            $(".admin-subbuttons#adminsub-claims-periodic").slideDown(100);
            $(".adminItems#adminItems-claims-periodic .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#newClaimPeriodic").click();
        } else if ($buttonClicked == "claimsRejectedPeriodic") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims-periodic").addClass("active");
            $(".admin-subbuttons#adminsub-claims-periodic").slideDown(100);
            $(".adminItems#adminItems-claims-periodic .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#claimsRejectedPeriodic").click();
        } else if ($buttonClicked == "claimsApprovedPeriodic") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims-periodic").addClass("active");
            $(".admin-subbuttons#adminsub-claims-periodic").slideDown(100);
            $(".adminItems#adminItems-claims-periodic .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#claimsApprovedPeriodic").click();
        } 
        else if ($buttonClicked == "claimsInboxHq") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims-hq").addClass("active");
            $(".admin-subbuttons#adminsub-claims-hq").slideDown(100);
            $(".adminItems#adminItems-claims-hq .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#claimsInboxHq").click();
           
        } else if ($buttonClicked == "currentClaimsHq") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims-hq").addClass("active");
            $(".admin-subbuttons#adminsub-claims-hq").slideDown(100);
            $(".adminItems#adminItems-claims-hq .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#currentClaimsHq").click();
          
        } else if ($buttonClicked == "newClaimHq") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims-hq").addClass("active");
            $(".admin-subbuttons#adminsub-claims-hq").slideDown(100);
            $(".adminItems#adminItems-claims-hq .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#newClaimHq").click();
        } else if ($buttonClicked == "claimsRejectedHq") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims-hq").addClass("active");
            $(".admin-subbuttons#adminsub-claims-hq").slideDown(100);
            $(".adminItems#adminItems-claims-hq .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#claimsRejectedHq").click();
        } else if ($buttonClicked == "claimsApprovedHq") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims-hq").addClass("active");
            $(".admin-subbuttons#adminsub-claims-hq").slideDown(100);
            $(".adminItems#adminItems-claims-hq .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#claimsApprovedHq").click();
        }else if ($buttonClicked == "claimsInboxPerHq") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims-per-hq").addClass("active");
            $(".admin-subbuttons#adminsub-claims-per-hq").slideDown(100);
            $(".adminItems#adminItems-claims-per-hq .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#claimsInboxPerHq").click();
           
        } else if ($buttonClicked == "currentClaimsPerHq") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims-per-hq").addClass("active");
            $(".admin-subbuttons#adminsub-claims-per-hq").slideDown(100);
            $(".adminItems#adminItems-claims-per-hq .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#currentClaimsPerHq").click();
          
        } else if ($buttonClicked == "newClaimPerHq") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims-per-hq").addClass("active");
            $(".admin-subbuttons#adminsub-claims-per-hq").slideDown(100);
            $(".adminItems#adminItems-claims-per-hq .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#newClaimPerHq").click();
        } else if ($buttonClicked == "claimsRejectedPerHq") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims-per_hq").addClass("active");
            $(".admin-subbuttons#adminsub-claims-per_hq").slideDown(100);
            $(".adminItems#adminItems-claims-per-hq .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#claimsRejectedPerHq").click();
        } else if ($buttonClicked == "claimsApprovedPerHq") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-claims-per-hq").addClass("active");
            $(".admin-subbuttons#adminsub-claims-per-hq").slideDown(100);
            $(".adminItems#adminItems-claims-per-hq .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#claimsApprovedPerHq").click();
        } else if ($buttonClicked == "voInbox") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-vo").addClass("active");
            $(".admin-subbuttons#adminsub-vo").slideDown(100);
            $(".adminItems#adminItems-claims .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-vo").fadeIn(150);
            $("#main-vo").addClass("active");
            $(".admin-subbuttons .subbutton-button#voInbox").click();
            // $("#main-home.active").css("display", "none");
            // $("#main-home.active").removeClass("active");
            // $("#main-claims.active").css("display", "none");
            // $("#main-claims.active").removeClass("active");
            // $("#main-amendment.active").css("display", "none");
            // $("#main-amendment.active").removeClass("active");
            // $("#archived-project.active").css("display", "none");
            // $("#archived-project.active").removeClass("active");
            // $("#main-account.active").css("display", "none");
            // $("#main-account.active").removeClass("active");
            // $("#main-budget.active").css("display", "none");
            // $("#main-budget.active").removeClass("active");

            // $("#main-vo").fadeIn(150);
            // $("#main-vo").addClass("active");

            // $(".sidebar-items .adminItems.active").removeClass("active");
            // $("#" + $subbuttonHide).slideUp(100);

            // $(".sidebar-items .adminItems#adminItems-project").addClass("active");
            // $("#" + $subbuttonstoShow).slideDown(100);

            // $(".sidebar-items .adminItems div.arrow.active").removeClass("active");
            // $(".sidebar-items .adminItems#adminItems-project div.arrow").addClass(
            //     "active"
            // );
        } else if ($buttonClicked == "currentVO") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-vo").addClass("active");
            $(".admin-subbuttons#adminsub-vo").slideDown(100);
            $(".adminItems#adminItems-vo .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-vo").fadeIn(150);
            $("#main-vo").addClass("active");
            $(".admin-subbuttons .subbutton-button#currentVO").click();
        } else if ($buttonClicked == "newVO") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-vo").addClass("active");
            $(".admin-subbuttons#adminsub-vo").slideDown(100);
            $(".adminItems#adminItems-vo .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-vo").fadeIn(150);
            $("#main-vo").addClass("active");
            $(".admin-subbuttons .subbutton-button#newVO").click();
        } else if ($buttonClicked == "rejectedVO") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-vo").addClass("active");
            $(".admin-subbuttons#adminsub-vo").slideDown(100);
            $(".adminItems#adminItems-vo .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-vo").fadeIn(150);
            $("#main-vo").addClass("active");
            $(".admin-subbuttons .subbutton-button#rejectedVO").click();
        } else if ($buttonClicked == "approvedVO") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-vo").addClass("active");
            $(".admin-subbuttons#adminsub-vo").slideDown(100);
            $(".adminItems#adminItems-vo .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-vo").fadeIn(150);
            $("#main-vo").addClass("active");
            $(".admin-subbuttons .subbutton-button#approvedVO").click();
        } else if ($buttonClicked == "amendmentInbox") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-amendment").addClass("active");
            $(".admin-subbuttons#adminsub-amendment").slideDown(100);
            $(".adminItems#adminItems-amendment .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-amendment").fadeIn(150);
            $("#main-amendment").addClass("active");
            $(".admin-subbuttons .subbutton-button#amendmentInbox").click();
        } else if ($buttonClicked == "newAmendment") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-amendment").addClass("active");
            $(".admin-subbuttons#adminsub-amendment").slideDown(100);
            $(".adminItems#adminItems-amendment .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-amendment").fadeIn(150);
            $("#main-amendment").addClass("active");
            $(".admin-subbuttons .subbutton-button#newAmendment").click();
        } else if ($buttonClicked == "amendments") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-amendment").addClass("active");
            $(".admin-subbuttons#adminsub-amendment").slideDown(100);
            $(".adminItems#adminItems-amendment .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-amendment").fadeIn(150);
            $("#main-amendment").addClass("active");
            $(".admin-subbuttons .subbutton-button#amendments").click();
        } else if ($buttonClicked == "archivedContracts") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $(".adminItems#adminItems-amendment").addClass("active");
            $(".admin-subbuttons#adminsub-amendment").slideDown(100);
            $(".adminItems#adminItems-amendment .arrow").addClass("active");

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-amendment").fadeIn(150);
            $("#main-amendment").addClass("active");
            $(".admin-subbuttons .subbutton-button#archivedContracts").click();
        }
    });

    //if variable in url the open form //to open the activity form from email link
    var url_string = window.location.href
    var url = new URL(url_string);
    var actid = url.searchParams.get("actid");
    var processname = url.searchParams.get("p");
    console.log(actid);
    if (actid && processname) {
        console.log(actid);
        openActivityForm(actid, processname);
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
            switch (e.data.formName) {
                case "Claim Form":
                    $("#claimsBackButton").show()
                    break;
                case "Contract Form":
                    $("#contractsBackButton").show()
                    break;
                case "VO Form":
                    $("#voBackButton").show()
                    break;
                case "Contract Approval Submitted":
                    setTimeout(() => {
                        updateNotifications();
                        OnClickContractsInbox();
                    }, 3000);
                    break;
                case "Claim Approval Submitted":
                    setTimeout(() => {
                        updateNotifications();
                        OnClickClaimsInbox();
                    }, 3000);
                    break;
                case "VO Approval Submitted":
                    setTimeout(() => {
                        updateNotifications();
                        OnClickVOInbox();
                    }, 3000);
                    break;
                case "Project Details Submitted":
                    setTimeout(() => {
                        updateNotifications();
                        $('#addEditProjectDetails').html("Edit");
                        //display the tab
                        $("li.tab.active").removeClass("active")
                        $('#projectInfoTab').parent().addClass("active")
                        $(".tabsContainer").css("display", "block")
                        $(".tabContainer").css("height", "30px")
                        $(".budgetContainer").css("height", "calc(100vh - 180px)")
                        $("#addEditProjectDetails").removeClass("active");
                        $('#addEditProjectDetails').css("display", "inline");
                        OnClickProjectInformationTab();
                    }, 3000);
                    break;
            }
            console.log(e.data)
        },
        false
    );


    //     var eventMethod = window.addEventListener
    //     ? "addEventListener"
    //     : "attachEvent";
    // var eventer = window[eventMethod];
    // var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    // // Listen to message from child window
    // eventer(
    //     messageEvent,
    //     function (e) {​​​​​​​​
    //         if(e.data == "Published Contracts"){​​​​​​​​
    //             console.log("show relevant button")
    //         }​​​​​​​​
    //         console.log('parent received message!:  ',e.data);
    //     }​​​​​​​​,false);


});

//Project Details Functions //
function OnClickProjectDetails() {
    $('#addEditProjectDetails').css("display", "inline");
    $.ajax({
        type: "POST",
        url: 'BackEnd/JogetPFS.php',
        dataType: 'json',
        data: {
            functionName: "getProjectDataList"
        },
        success: function (obj) {
            $("li.tab.active").removeClass("active")
            $('#projectInfoTab').parent().addClass("active")
            $(".tabsContainer").css("display", "block")
            //$(".tabContainer").css("height", "30px")
            $(".budgetContainer").css("height", "calc(100vh - 180px)")
            $("#addEditProjectDetails").removeClass("active")

            if (obj.length > 0 && obj[0].status == "Update") {
                projectDetailsFlag = true;
            }// project details have already been added/ submitted
            OnClickProjectInformationTab();
        }
    });
}

function OnClickProjectInformationTab() {
    let role = localStorage.usr_role;
    let url;
    if (projectDetailsFlag) {
        url = JOGETLINK.finance_list_ProjectInfo;
        if(role == "Finance Officer" || role == "Contract Executive"){
            $('#addEditProjectDetails').css("display", "inline");
             $('#addEditProjectDetails').html("Edit");
        }
    } else {
        url = JOGETLINK.finance_list_ProjectUserInfo;
        if(role == "Finance Officer" || role == "Contract Executive"){
            $('#addEditProjectDetails').css("display", "inline");
             $('#addEditProjectDetails').html("Add Details");
        }
    }
    console.log(url);
    $("#budgetDatalist iframe").attr("src", url)

}

function OnClickWorkflowApprovalTab() {
    let role = localStorage.usr_role;
    let url = JOGETLINK.finance_list_WorkFlowApproval;
    console.log(url);
    if(role == "Finance Officer" || role == "Contract Executive"){
       $('#addEditProjectDetails').html("Edit");
    }
    $("#budgetDatalist iframe").attr("src", url);

}

function OnClickFundingTab() {
    let role = localStorage.usr_role;
    let url = JOGETLINK.finance_list_FundingInfo;
    console.log(url);
    if(role == "Finance Officer" || role == "Contract Executive"){
        $('#addEditProjectDetails').html("Edit");
    }
    $("#budgetDatalist iframe").attr("src", url);

}

function OnClickBudgetTab() {
    let role = localStorage.usr_role;
    let url = JOGETLINK.finance_list_BudgetInfo;
    console.log(url);
    if(role == "Finance Officer" || role == "Contract Executive"){
        $('#addEditProjectDetails').html("Edit");
    }
    $("#budgetDatalist iframe").attr("src", url)
   

}

function OnClickAuditTab() {
    let role = localStorage.usr_role;
    let url = JOGETLINK.finance_list_AuditInfo
    console.log(url);
    if(role == "Finance Officer" || role == "Contract Executive"){
        $('#addEditProjectDetails').html("Edit");
    }
    $("#budgetDatalist iframe").attr("src", url);

}

function OnClickAddEditDetails(e) {
    $('#addEditProjectDetails').css("display", "none");
    let url = JOGETLINK.finance_list_AddEditProjectDetails;
    console.log(url);
    $("#budgetDatalist iframe").attr("src", url)

    if (!$(e).hasClass("active")) {
        console.log("true")
        $(".tabsContainer").css("display", "none")
        $(".tabContainer").css("height", "0px")
        $(".budgetContainer").css("height", "calc(100vh - 150px)")
        $(e).addClass("active")
        $(".budgetContainer").css("margin-top", "23px")
    } else {
        console.log("else")
        $(".tabsContainer").css("display", "block")
        $(".tabContainer").css("height", "30px")
        $(".budgetContainer").css("height", "calc(100vh - 180px)")
        $(e).removeClass("active")
        //$(".budgetContainer").css("margin-top", "0px")
    }
}

//contract functions ///
function OnClickPublishedContract() {
    $('#contractsBackButton').hide();
    updateNotifications();
  
    let url = JOGETLINK.finance_list_PublishedContracts;
    console.log(url);
    $("#pfsContractsDatalist iframe").attr("src", url)
}

function OnClickContractsInbox() {
    $('#contractsBackButton').hide();
    updateNotifications();
    let url = JOGETLINK.finance_list_ContractInbox;
    console.log(url);
    $("#pfsContractsDatalist iframe").attr("src", url)

}

function updateNotifications() {
    console.log("finance");
    $.ajax({
        type: "POST",
        url: 'BackEnd/JogetPFS.php',
        dataType: 'json',
        data: {
            functionName: "getJogetNotifications"
        },
        success: function (obj) {

            // let mydata = JSON.parse(obj);
            // console.log(mydata);
            // let data = mydata['data'];

            let data = obj['data'];
            console.log(obj);
            $('#notiCount').text(obj['total_assignment']);
            document.getElementById('notiDrop').innerHTML = "";
            let i = 0;
            while (i < 5) {
                if (i < data.length) {
                    let process = data[i]['processName'];
                    let status = data[i]['c_status_integration'];
                    console.log(status);
                    console.log(process);

                    var text;
                    switch (process) {
                        case "Process 1":
                            if (status == "info") {
                                text = "More information needed for the Contract"+ " (" + data[i]['title'] + " )";
                            } else {
                                text = "Approval for Contract"+ " (" + data[i]['title'] + " )";
                            };
                            break;
                        case "Claim Process":
                            if (status == "info") {
                                text = "More information needed for the Claim" + " (" + data[i]['myid'] + " )";
                            } else {
                                text = "Approval for Claim" + " (" + data[i]['myid'] + " )";
                            };
                            break;
                        case "VO Process":
                            if (status == "info") {
                                text = "More information needed for the VO"+ " (" + data[i]['myid'] + " )";
                            } else if(status == "Document Upload" ) {
                                text = "Upload Form 205 for VO "+ " (" + data[i]['myid'] + " )";
                            } else {
                                text = (localStorage.project_owner == 'JKR_SABAH') ? "Approval for VO"+ " (" + data[i]['myid'] + " )": "Approval for KPK"+ " (" + data[i]['myid'] + " )";
                            }
                            break;
                        case "Process 1a":
                            data[i]['processApp'] = "Contract_Amend"; // since contracts and amend contracts in same table we will get contract here for amendment also
                            if (status == "info") {
                                text = "More information needed for the Contract Amendment"+ " (" + data[i]['title'] + " )";
                            } else {
                                text = "Approval for Contract Amendment"+ " (" + data[i]['title'] + " )";
                            }
                            break;
                        case "Claim (Routine) - Division":
                    
                            if (status == "Submitted" || status == "Resubmitted") {
                                text = "Verification for Routine Claim"+ " (" + data[i]['title'] + " )";
                            } else  if (status == "Verified") {
                                text = "Approval for Routine Claim"+ " (" + data[i]['title'] + " )";
                            } else  if (status == "Resubmit") {
                                text = "Resubmit for Routine Claim"+ " (" + data[i]['title'] + " )";
                            } 
                            break;
                        case "Claim (Routine) - HQ":
                
                            if  (status == "Resubmit"){
                                text = "Resubmit for Routine Claim Consolidated"+ " (" + data[i]['title'] + " )";
                            } else   {
                                text = "Verification for Routine Claim Consolidated"+ " (" + data[i]['title'] + " )";
                            } 
                            break;
                        case "Claim (Periodic) - HQ":
        
                            if  (status == "Resubmit"){
                                text = "Resubmit for Periodic / Emergency Claim Consolidated"+ " (" + data[i]['title'] + " )";
                            } else   {
                                text = "Verification for Periodic / Emergency Claim Consolidated"+ " (" + data[i]['title'] + " )";
                            } 
                            break;

                    }
                    let concat = '<button class="notiitems"  onclick="openActivityForm(`' + data[i]['activityId'] + '`, `' + data[i]['processApp'] + '`);"><b>' + text + ' </b></button><br>';
                    document.getElementById("notiDrop").innerHTML = document.getElementById("notiDrop").innerHTML + concat;
                } else {
                    break;
                }
                i++;

            }
        }
    });
}

function getFormName(type, role) {
    var formArr = {
        "ClaimRejectOrApprove": {
            "Finance Officer": "claims_fo_ul",
            "Project Manager": "claims_pm_ul",
            "Project Monitor": "claims_pm_ul",
            "Finance Head": "claims_fh_ul",
            "Director": "claims_dir_ul",
            "Construction Engineer": "claims_ce_ul",
            "Contractor PM": "cpm_claim_ul",
            "Contractor Engineer": "ce_claim_ul",
            "Consultant CRE": "claims_cre_ul",
            "Consultant RE": "claims_re_ul"
        },
        "ContractApproved": {
            "Finance Officer": "contracts_ul",
            "Project Manager": "contracts_pm_ul",
            "Project Monitor": "contracts_pm_ul",
            "Finance Head": "contracts_fh_ul",
            "Director": "contracts_dir_ul",
            "Construction Engineer": "contracts_ce_ul",
            "Contractor PM": "cpm_contract_ul",
            "Contractor Engineer": "ce_contract_ul",
            "Consultant CRE": "contracts_ccre_ul",
            "Consultant RE": "contracts_cre_ul",
            "Contract Executive" : "contracts_ul_sslr",
            "Head of Department" : "contracts_hod_sslr"
        },
        "ContractReject": {
            "Finance Officer": "contracts_ul",
            "Finance Head": "contracts_fh_ul",
            "Director": "contracts_dir_ul",
            "Project Manager": "contracts_pm_ul",
            "Project Monitor": "contracts_pm_ul",
            "Contract Executive" : "contracts_ul_sslr",
            "Head of Department" : "contracts_hod_sslr"
        },
        "VORejectOrApprove": {
            "Finance Officer": "vo_fo_ul",
            "Project Manager": "vo_pm_ul",
            "Project Monitor": "vo_pm_ul",
            "Finance Head": "vo_fh_ul",
            "Director": "vo_dir_ul",
            "Construction Engineer": "vo_ce_ul",
            "Contractor PM": "vo_ccpm_ul",
            "Contractor Engineer": "vo_cce_ul",
            "Consultant CRE": "vo_ccre_ul",
            "Consultant RE": "vo_cre_ul"
        }
    };

    return (formArr[type] !== undefined && formArr[type][role] !== undefined) ? formArr[type][role] : false;
}

function openActivityForm(activityId, processApp) {
    $(".dropitem.active").removeClass("active");
    $(".dropitem").css("display", "none");
    processApp = processApp.trim();
    console.log(processApp);
    switch (processApp) {
        case "Contract":
            $(".adminItems#adminItems-contracts").addClass("active");
            $(".admin-subbuttons#adminsub-contracts").slideDown(100);

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
            $(".admin-subbuttons .subbutton-button#contractsInbox").click();
            let url = JOGETLINK.finance_list_ContractActivityForm + activityId + "&_mode=assignment";
            console.log(url)
            $("#pfsContractsDatalist iframe").attr("src", url)

            break

        case "Claim":
            $(".adminItems#adminItems-claims").addClass("active");
            $(".admin-subbuttons#adminsub-claims").slideDown(100);

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#claimsInbox").click();
            let url1 = JOGETLINK.finance_list_ClaimActivityForm + activityId + "&_mode=assignment";
            console.log(url1)
            $("#pfsClaimsDatalist iframe").attr("src", url1)

            break;
        case "Routine Claim":
            $(".adminItems#adminItems-claims").addClass("active");
            $(".admin-subbuttons#adminsub-claims").slideDown(100);

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#claimsInbox").click();
            let url1a = JOGETLINK.finance_list_ClaimActivityFormRoutine + activityId + "&_mode=assignment";
            console.log(url1a)
            $("#pfsClaimsDatalist iframe").attr("src", url1a)

            break;
        case "HQ Routine Claim":
            $(".adminItems#adminItems-claims").addClass("active");
            $(".admin-subbuttons#adminsub-claims").slideDown(100);

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#claimsInbox").click();
            let url1b = JOGETLINK.finance_list_ClaimActivityFormHq + activityId + "&_mode=assignment";
            console.log(url1b)
            $("#pfsClaimsDatalist iframe").attr("src", url1b)

            break;
           
        case "HQ Periodic/Emergency Claim":
            $(".adminItems#adminItems-claims-per-hq").addClass("active");
            $(".admin-subbuttons#adminsub-claims-per-hq").slideDown(100);

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");
            $(".admin-subbuttons .subbutton-button#claimsInboxPerHq").click();
            let url1c = JOGETLINK.finance_list_ClaimActivityFormHq + activityId + "&_mode=assignment";
            $("#pfsClaimsDatalist iframe").attr("src", url1c)
            break;
        case "VO":
            $(".adminItems#adminItems-vo").addClass("active");
            $(".admin-subbuttons#adminsub-vo").slideDown(100);

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-vo").fadeIn(150);
            $("#main-vo").addClass("active");
            $(".admin-subbuttons .subbutton-button#voInbox").click();
            let url2 = JOGETLINK.finance_list_VOActivityForm + activityId + "&_mode=assignment";
            console.log(url2)
            $("#pfsVODatalist iframe").attr("src", url2)

            break;
        case "Contract_Amend":
            $(".adminItems#adminItems-amendment").addClass("active");
            $(".admin-subbuttons#adminsub-amendment").slideDown(100);

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-amendment").fadeIn(150);
            $("#main-amendment").addClass("active");
            $(".admin-subbuttons .subbutton-button#amendmentInbox").click();
            let url3 = JOGETLINK.finance_list_ContractAmendForm + activityId + "&_mode=assignment";
            $("#pfsContractAmendDataList iframe").attr("src", url3)
            break;
        case "ClaimReject": // to display the claim rejected from email - url redirect
        case "ClaimApproved": // to display the claim approved from email - url redirect
            $(".adminItems#adminItems-claims").addClass("active");
            $(".admin-subbuttons#adminsub-claims").slideDown(100);

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-claims").fadeIn(150);
            $("#main-claims").addClass("active");

            if (processApp == "ClaimReject") {
                $(".admin-subbuttons .subbutton-button#claimsRejected").click();
            } else {
                $(".admin-subbuttons .subbutton-button#claimsApproved").click();
            }

            let url4 = JOGETLINK.finance_list_ClaimApprovedRejected + activityId + "&_mode=edit";
            console.log(url4)
            $("#pfsClaimsDatalist iframe").attr("src", url4)

            break;
        case "ContractReject": // to display the contract rejected from email - url redirect
        case "ContractApproved": // to display the contract approved from email - url redirect
            $(".adminItems#adminItems-contracts").addClass("active");
            $(".admin-subbuttons#adminsub-contracts").slideDown(100);

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");

            if (processApp == "ContractReject") {
                // reject can onlly be seen by role
                if (getFormName("ContractReject", localStorage.usr_role)) {
                    $(".admin-subbuttons .subbutton-button#rejectedContract").click();
                }
            } else {
                $(".admin-subbuttons .subbutton-button#publishedContracts").click();
            }

            let url5 = JOGETLINK.finance_list_ContractApprovedRejected + activityId + "&_mode=edit";
            $("#pfsContractsDatalist iframe").attr("src", url5)

            break;
        case "VOReject": // to display the VO rejected from email - url redirect
        case "VOApproved": // to display the VO approved from email - url redirect
            $(".adminItems#adminItems-vo").addClass("active");
            $(".admin-subbuttons#adminsub-vo").slideDown(100);

            $("#main-home").fadeOut(150);
            $("#main-home").removeClass("active");
            $("#main-vo").fadeIn(150);
            $("#main-vo").addClass("active");

            if (processApp == "VOReject") {
                $(".admin-subbuttons .subbutton-button#rejectedVO").click();
            } else {
                $(".admin-subbuttons .subbutton-button#approvedVO").click();
            }
            let url6 = JOGETLINK.finance_list_VOApprovedRejected + activityId + "&_mode=edit";
            console.log(url6)
            $("#pfsVODatalist iframe").attr("src", url6)

            break;
    }
}

function OnClickNewContract() {
    $("#contractsBackButton").hide(); //hide the back button if it was previously displayed
    $.ajax({
        type: "POST",
        url: 'BackEnd/JogetPFS.php',
        dataType: 'json',
        data: {
            functionName: "getContractApprovalFlowDetails"
        },
        success: function (obj) {

            // let mydata = JSON.parse(obj);
            // console.log(mydata);
            // let data = mydata['data'];
            let data = obj;
            console.log(data);
            if (data.length > 0) {
                //make the side bar active if clicked from the top edit button
                $(".adminItems#adminItems-contracts").addClass("active");
                $(".admin-subbuttons#adminsub-contracts").slideDown(100);

                $("#main-home").fadeIn(150);
                $("#main-home").addClass("active");
                if (!$("#sidebar-admin").hasClass("active")) {
                    openNavbar();
                }

                $("#main-home.active").css("display", "none");
                $("#main-home.active").removeClass("active");
                $("#main-vo.active").css("display", "none");
                $("#main-vo.active").removeClass("active");
                $("#main-amendment.active").css("display", "none");
                $("#main-amendment.active").removeClass("active");
                $("#archived-project.active").css("display", "none");
                $("#archived-project.active").removeClass("active");
                $("#main-account.active").css("display", "none");
                $("#main-account.active").removeClass("active");
                $("#main-claims").css("display", "none");
                $("#main-claims").removeClass("active");
                $("#main-budget.active").css("display", "none");
                $("#main-budget.active").removeClass("active");

                $("#main-contracts").fadeIn(150);
                $("#main-contracts").addClass("active");

                $(".sidebar-items .adminItems.active").removeClass("active");
                $("#adminsub-budget").slideUp(100);
                $(".sidebar-items .adminItems#adminItems-contracts").addClass("active");
                $("#adminsub-contracts").slideDown(100);
                $("#newContract").addClass("active")
                $(".sidebar-items .adminItems div.arrow.active").removeClass("active");
                $(".sidebar-items .adminItems#adminItems-contracts div.arrow").addClass("active");

                //call the create contract form from joget
                let url = JOGETLINK.finance_list_NewContract;
                $("#pfsContractsDatalist iframe").attr("src", url)
            } else {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Approval WorkFlow for Contracts has not been set for this Project. Please set the same to create Contracts.',
                });
            }
        }
    })
    updateNotifications();
}

function OnClickRejectedContract() {
    $('#contractsBackButton').hide();
    updateNotifications();
   
    let url = JOGETLINK.finance_list_RejectedContracts;
    console.log(url);
    $("#pfsContractsDatalist iframe").attr("src", url);
}

function OnClickRoutineContractAmend(){
    $('#contractsBackButton').hide();
    updateNotifications();
   
    let url = JOGETLINK.finance_list_AmendRoutineContracts;
    console.log(url);
    $("#pfsContractsDatalist iframe").attr("src", url);
}

function OnClickRoutineContractAmendList(){
    $('#contractsBackButton').hide();
    updateNotifications();
   
    let url = JOGETLINK.finance_list_AmendRoutineContractsList;
    console.log(url);
    $("#pfsContractsDatalist iframe").attr("src", url);
}


// claim functions ///
function OnClickCurrentClaims() {
    $('#claimsBackButton').hide();
    updateNotifications();
   
    let url = JOGETLINK.finance_list_CurrentClaims;
    console.log(url);
    $("#pfsClaimsDatalist iframe").attr("src", url)
}

function OnClickClaimsRejected() {
    $('#claimsBackButton').hide();
    updateNotifications();
  
    let url = JOGETLINK.finance_list_RejectedClaims;
    console.log(url);
    $("#pfsClaimsDatalist iframe").attr("src", url);
}

function OnClickClaimsApproved() {
    $('#claimsBackButton').hide();
    updateNotifications();
  
    let url = JOGETLINK.finance_list_ApprovedClaims;
    console.log(url);
    $("#pfsClaimsDatalist iframe").attr("src", url);
}

function OnClickNewClaim() {
    $('#claimsBackButton').hide();
    updateNotifications();
    $.ajax({
        type: "POST",
        url: 'BackEnd/JogetPFS.php',
        dataType: 'json',
        data: {
            functionName: "getClaimApprovalFlowDetails"
        },
        success: function (obj) {

            // let mydata = JSON.parse(obj);
            // console.log(mydata);
            // let data = mydata['data'];
            let data = obj;
            console.log(data);
            if (data.length > 0) {
                let url = JOGETLINK.finance_list_NewClaim;
                console.log(url);
                $("#pfsClaimsDatalist iframe").attr("src", url);

            } else {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Approval WorkFlow for Claims has not been set for this Project. Please contact the Finance Officer to set the same to create claims.',
                });

            }
        }
    });

}

function OnClickClaimsInbox() {
    $('#claimsBackButton').hide();
    updateNotifications();
    let url = JOGETLINK.finance_list_ClaimInbox;
    console.log(url);
    $("#pfsClaimsDatalist iframe").attr("src", url)

}

function tabClick(e) {
    let tabclicked = $(e).attr("id");
    console.log(tabclicked);
    let role = localStorage.usr_role;

    $("li.tab.active").removeClass("active")
    // $(e).parent().addClass("active")
    if (projectDetailsFlag) {
        $(e).parent().addClass("active")
        switch (tabclicked) {
            case 'projectInfoTab': OnClickProjectInformationTab();
                break;
            case 'workflowApprovalTab': OnClickWorkflowApprovalTab();
                break;
            case 'fundingTab': OnClickFundingTab();
                break;
            case 'budgetTab': OnClickBudgetTab();
                break;
            case 'auditInfoTab': OnClickAuditTab();
                break;
        }
    } else {
        if (tabclicked == 'projectInfoTab') {
            OnClickProjectInformationTab();
        } else {
            $("#projectInfoTab").parent().addClass("active")
            if (role == "Finance Officer" && localStorage.Project_type == "CONSTRUCT") {
                $.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: 'Project details have not been filled in for this project, do you want to add them now?',
                    buttons: {
                        ok: function () {
                            OnClickAddEditDetails(this)
                        },
                        cancel: function () {
                            return;
                        },
                    },
                });

            } else if (role == "Quantity Surveyor" && localStorage.Project_type == "ASSET") {
                $.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: 'Project details have not been filled in for this project, do you want to add them now?',
                    buttons: {
                        ok: function () {
                            OnClickAddEditDetails(this)
                        },
                        cancel: function () {
                            return;
                        },
                    },
                });

            }
            else if (role == "Contract Executive" && localStorage.Project_type == "SSLR2") {
                $.confirm({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Confirm!",
                    content: 'Project details have not been filled in for this project, do you want to add them now?',
                    buttons: {
                        ok: function () {
                            OnClickAddEditDetails(this)
                        },
                        cancel: function () {
                            return;
                        },
                    },
                });

            }
            else {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Project details have not been filled in for this project. Please ask the Finance Officer to fill the details.',
                });
            }
        }
    }
}

function OnClickNewVO() {
    $('#voBackButton').hide();
    updateNotifications();
    $.ajax({
        type: "POST",
        url: 'BackEnd/JogetPFS.php',
        dataType: 'json',
        data: {
            functionName: "getVOApprovalFlowDetails"
        },
        success: function (obj) {

            let data = obj;
            console.log(data);
            if (data.length > 0) {
                let role = localStorage.usr_role;
                let url = JOGETLINK.finance_list_NewVO;
                console.log(url);
                $("#pfsVODatalist iframe").attr("src", url);

            } else {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Approval WorkFlow for VO has not been set for this Project. Please contact the Finance Officer to set the same to create Variation Order.',
                });

            }
        }
    });
}

function OnClickCurrentVO() {
    $('#voBackButton').hide();
    updateNotifications();

    let url = JOGETLINK.finance_list_CurrentVOs;
    console.log(url);
    $("#pfsVODatalist iframe").attr("src", url);

}

function OnClickApprovedVO() {
    $('#voBackButton').hide();
    updateNotifications();
 
    let url = JOGETLINK.finance_list_ApprovedVOs;
    console.log(url);
    $("#pfsVODatalist iframe").attr("src", url);

}

function OnClickRejectedVO() {
    $('#voBackButton').hide();
    updateNotifications();
  
    let url = JOGETLINK.finance_list_RejectedVOs;
    console.log(url);
    $("#pfsVODatalist iframe").attr("src", url);
}

function OnClickVOInbox() {
    $('#voBackButton').hide();
    updateNotifications();
    let url = JOGETLINK.finance_list_VOInbox;
    console.log(url);
    $("#pfsVODatalist iframe").attr("src", url)
}

function OnClickContractsBackButton() {
    if ($("#contractsInbox").hasClass("active")) {
        OnClickContractsInbox();
    } else if ($("#publishedContracts").hasClass("active")) {
        OnClickPublishedContract();
    } else if ($("#rejectedContract").hasClass("active")) {
        OnClickRejectedContract();
    }else if ($("#routineContractAmend").hasClass("active")) {
        OnClickRoutineContractAmend();
    } else if ($("#routineContractAmendList").hasClass("active")) {
        OnClickRoutineContractAmendList();
    }
}

function OnClickClaimsBackButton() {
    if ($("#claimsInbox").hasClass("active")) {
        OnClickClaimsInbox();
    } else if ($("#currentClaims").hasClass("active")) {
        OnClickCurrentClaims();
    } else if ($("#claimsRejected").hasClass("active")) {
        OnClickClaimsRejected();
    } else if ($("#claimsApproved").hasClass("active")) {
        OnClickClaimsApproved();
    }

}

function OnClickVoBackButton() {
    if ($("#voInbox").hasClass("active")) {
        OnClickVOInbox();
    } else if ($("#currentVO").hasClass("active")) {
        OnClickCurrentVO();
    } else if ($("#rejectedVO").hasClass("active")) {
        OnClickRejectedVO();
    } else if ($("#approvedVO").hasClass("active")) {
        OnClickApprovedVO();
    }

}

function OnClickScheduleData() {
    console.log("Schedule");
    let url = JOGETLINK.finance_list_ScheduleData;
    console.log(url);
    $("#pfsScheduleDataList iframe").attr("src", url);
}

function OnClickImportUnit() {
    console.log("unit");
    let url = JOGETLINK.finance_list_ImportUnit;
    console.log(url);
    $("#pfsUnitDataList iframe").attr("src", url)

}

function OnClickNewAmendment() {
    updateNotifications();

    let url = JOGETLINK.finance_list_NewAmendment;
    console.log(url);
    $("#pfsContractAmendDataList iframe").attr("src", url)
}

function OnClickAmendmentInbox() {
    updateNotifications();
    console.log("Amendment Inbox");
    let url = JOGETLINK.finance_list_AmendmentInbox;
    console.log(url);
    $("#pfsContractAmendDataList iframe").attr("src", url)
}

function OnClickContractAmendments() {
    updateNotifications();
   
    let url = JOGETLINK.finance_list_CurrentAmendments;
    console.log(url);
    $("#pfsContractAmendDataList iframe").attr("src", url);

}

function OnClickArchivedContracts() {
    updateNotifications();
    console.log("archived");

    let url = JOGETLINK.finance_list_ArchivedContracts;
    console.log(url);
    $("#pfsContractAmendDataList iframe").attr("src", url);

}

//support
function OnClickRaiseSupport(){
    window.open('BackEnd/jogetloginSupport.php', '_blank');
   
}


//Periodic claims for asset packages
function OnClickClaimsInboxPeriodic(){
    $('#claimsBackButton').hide();
    updateNotifications();
    let url = JOGETLINK.finance_list_ClaimInboxPeriodic;
    console.log(url);
    $("#pfsClaimsDatalist iframe").attr("src", url)
}

function OnClickCurrentClaimsPeriodic(){
    $('#claimsBackButton').hide();
    updateNotifications();
   
    let url = JOGETLINK.finance_list_CurrentClaimsPeriodic;
    console.log(url);
    $("#pfsClaimsDatalist iframe").attr("src", url)

}

function OnClickNewClaimPeriodic(){
    $('#claimsBackButton').hide();
    updateNotifications();
    $.ajax({
        type: "POST",
        url: 'BackEnd/JogetPFS.php',
        dataType: 'json',
        data: {
            functionName: "getClaimApprovalFlowDetailsPeriodic"
        },
        success: function (obj) {

            // let mydata = JSON.parse(obj);
            // console.log(mydata);
            // let data = mydata['data'];
            let data = obj;
            console.log(data);
            if (data.length > 0) {
                let url = JOGETLINK.finance_list_NewClaimPeriodic;
                console.log(url);
                $("#pfsClaimsDatalist iframe").attr("src", url);

            } else {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Approval WorkFlow for Claims has not been set for this Project. Please contact the Finance Officer to set the same to create claims.',
                });

            }
        }
    });

}

function OnClickClaimsRejectedPeriodic(){
    $('#claimsBackButton').hide();
    updateNotifications();
  
    let url = JOGETLINK.finance_list_RejectedClaimsPeriodic;
    console.log(url);
    $("#pfsClaimsDatalist iframe").attr("src", url);

}

function OnClickClaimsApprovedPeriodic(){
    $('#claimsBackButton').hide();
    updateNotifications();
  
    let url = JOGETLINK.finance_list_ApprovedClaimsPeriodic;
    console.log(url);
    $("#pfsClaimsDatalist iframe").attr("src", url);

}

function OnClickClaimsInboxHq(){
    $('#claimsBackButton').hide();
    updateNotifications();
    let url = JOGETLINK.finance_list_ClaimInboxHq;
    console.log(url);
    $("#pfsClaimsDatalist iframe").attr("src", url)
}

function OnClickCurrentClaimsHq(){
    $('#claimsBackButton').hide();
    updateNotifications();
   
    let url = JOGETLINK.finance_list_CurrentClaimsHq;
    console.log(url);
    $("#pfsClaimsDatalist iframe").attr("src", url)

}

function OnClickNewClaimHq(){
    $('#claimsBackButton').hide();
    updateNotifications();
    $.ajax({
        type: "POST",
        url: 'BackEnd/JogetPFS.php',
        dataType: 'json',
        data: {
            functionName: "getClaimApprovalFlowDetails"
        },
        success: function (obj) {

            // let mydata = JSON.parse(obj);
            // console.log(mydata);
            // let data = mydata['data'];
            let data = obj;
            console.log(data);
            if (data.length > 0) {
                let url = JOGETLINK.finance_list_NewClaimHq;
                console.log(url);
                $("#pfsClaimsDatalist iframe").attr("src", url);

            } else {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Approval WorkFlow for Claims has not been set for this Project. Please contact the Finance Officer to set the same to create claims.',
                });

            }
        }
    });

}

function OnClickClaimsRejectedHq(){
    $('#claimsBackButton').hide();
    updateNotifications();
  
    let url = JOGETLINK.finance_list_RejectedClaimsHq;
    console.log(url);
    $("#pfsClaimsDatalist iframe").attr("src", url);
}

function OnClickClaimsApprovedHq(){
    $('#claimsBackButton').hide();
    updateNotifications();
   
    let url = JOGETLINK.finance_list_ApprovedClaimsHq;
    console.log(url);
    $("#pfsClaimsDatalist iframe").attr("src", url)
}

function OnClickRates() {
    let url = JOGETLINK.finance_list_RatesData;
    $("#pfsRatesDataList iframe").attr("src", url);
}

function OnClickRatesView() {
    let url = JOGETLINK.finance_list_RatesData_view;
    $("#pfsRatesDataList iframe").attr("src", url);
}

function OnClickLocationFactor() {
    let url = JOGETLINK.finance_list_LocationFactorData;
    $("#pfsLocationFactorDataList iframe").attr("src", url);
}

function OnClickLocationFactorView() {
    let url = JOGETLINK.finance_list_LocationFactorData_view;
    $("#pfsLocationFactorDataList iframe").attr("src", url);
}

function OnClickClaimsInboxPerHq(){
    $('#claimsBackButton').hide();
    updateNotifications();
    let url = JOGETLINK.finance_list_ClaimInboxPerHq;
    console.log(url);
    $("#pfsClaimsDatalist iframe").attr("src", url)

}

function OnClickCurrentClaimsPerHq(){
    $('#claimsBackButton').hide();
    updateNotifications();
   
    let url = JOGETLINK.finance_list_CurrentClaimsPerHq;
    console.log(url);
    $("#pfsClaimsDatalist iframe").attr("src", url)

}

function OnClickNewClaimPerHq(){
    $('#claimsBackButton').hide();
    updateNotifications();
    $.ajax({
        type: "POST",
        url: 'BackEnd/JogetPFS.php',
        dataType: 'json',
        data: {
            functionName: "getClaimApprovalFlowDetailsPeriodic"
        },
        success: function (obj) {

            // let mydata = JSON.parse(obj);
            // console.log(mydata);
            // let data = mydata['data'];
            let data = obj;
            console.log(data);
            if (data.length > 0) {
                let url = JOGETLINK.finance_list_NewClaimPerHq;
                console.log(url);
                $("#pfsClaimsDatalist iframe").attr("src", url);

            } else {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Approval WorkFlow for Periodic / Emergency Claims has not been set for this Project. Please contact the Quantity Surveyour to set the same to create claims.',
                });

            }
        }
    });

}

function OnClickClaimsApprovedPerHq(){
    $('#claimsBackButton').hide();
    updateNotifications();
   
    let url = JOGETLINK.finance_list_ApprovedClaimsPerHq;
    console.log(url);
    $("#pfsClaimsDatalist iframe").attr("src", url)
}
