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

function closeAllMain() {
    $("#main-home").css("display", "none");
    $("#main-home").removeClass("active");

    $("#main-document.active").css("display", "none");
    $("#main-document.active").removeClass("active");

    $("#main-setup.active").css("display", "none");
    $("#main-setup.active").removeClass("active");

    $("#setup-doc-type.active").css("display", "none");
    $("#setup-doc-type.active").removeClass("active");

    $("#setup-distribution_group.active").css("display", "none");
    $("#setup-distribution_group.active").removeClass("active");

    $("#setup-work-package.active").css("display", "none");
    $("#setup-work-package.active").removeClass("active");

    $("#setup-entity.active").css("display", "none");
    $("#setup-entity.active").removeClass("active");

    $("#setup-group.active").css("display", "none");
    $("#setup-group.active").removeClass("active");

    $("#setup-section.active").css("display", "none");
    $("#setup-section.active").removeClass("active");

    $("#main-inboxCorrespondence.active").css("display", "none");
    $("#main-inboxCorrespondence.active").removeClass("active");

    $("#main-newCorrespondence.active").css("display", "none");
    $("#main-newCorrespondence.active").removeClass("active");

    $("#main-bulkCorrespondenceRegister.active").css("display", "none");
    $("#main-bulkCorrespondenceRegister.active").removeClass("active");

    $("#main-myCorrespondence.active").css("display", "none");
    $("#main-myCorrespondence.active").removeClass("active");

    $("#main-incomingCorrespondence.active").css("display", "none");
    $("#main-incomingCorrespondence.active").removeClass("active");
}

function openNavbar() {
    $(window).resize(function () {
        $("#main-home").css("width", "calc(100% - 70px)").css("width", "-=280px");
        $("#main-document").css("width", "calc(100% - 70px)").css("width", "-=280px");
        $("#main-setup").css("width", "calc(100% - 70px)").css("width", "-=280px");
        $("#register-document").css("width", "calc(100% - 70px)").css("width", "-=280px");
        $("#setup-doc-type").css("width", "calc(100% - 70px)").css("width", "-=280px");
        $("#setup-distribution_group").css("width", "calc(100% - 70px)").css("width", "-=280px");
        $("#setup-work-package").css("width", "calc(100% - 70px)").css("width", "-=280px");
        $("#setup-entity").css("width", "calc(100% - 70px)").css("width", "-=280px");
        $("#setup-group").css("width", "calc(100% - 70px)").css("width", "-=280px");
        $("#setup-section").css("width", "calc(100% - 70px)").css("width", "-=280px");
        $("#main-inboxCorrespondence").css("width", "calc(100% - 70px)").css("width", "-=280px");
        $("#main-newCorrespondence").css("width", "calc(100% - 70px)").css("width", "-=280px");
        $("#main-bulkCorrespondenceRegister").css("width", "calc(100% - 70px)").css("width", "-=280px");
        $("#main-myCorrespondence").css("width", "calc(100% - 70px)").css("width", "-=280px");
        $("#main-incomingCorrespondence").css("width", "calc(100% - 70px)").css("width", "-=280px");
    });

    if ($(window).width() <= "1366") {
        $("#sidebar-admin").addClass("active");
        $("#sidebar-admin").fadeIn().css({ width: 43, }).animate({ width: "220px", }, 100, function () {
            $(".sidebar-items li a").fadeIn(50);
            $(".sidebar-items li div.arrow").fadeIn(50);
        });
        $("#main-home").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#main-document").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#status-document").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#register-document").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#setup-doc-type").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#setup-distribution_group").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#setup-entity").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#setup-group").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#setup-section").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#setup-work-package").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#main-setup").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#main-inboxCorrespondence").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#main-newCorrespondence").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#main-bulkCorrespondenceRegister").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#main-myCorrespondence").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#main-incomingCorrespondence").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
    } else if (window.devicePixelRatio >= 1.25) {
        $("#sidebar-admin").addClass("active");
        $("#sidebar-admin").fadeIn().css({ width: 43, }).animate({ width: "220px", }, 100, function () {
            $(".sidebar-items li a").fadeIn(50);
            $(".sidebar-items li div.arrow").fadeIn(50);
        });
        $("#main-home").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#main-document").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#status-document").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#register-document").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#setup-doc-type").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#setup-distribution_group").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#setup-entity").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#setup-group").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#setup-section").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#setup-work-package").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#main-setup").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#main-inboxCorrespondence").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#main-newCorrespondence").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#main-bulkCorrespondenceRegister").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#main-myCorrespondence").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
        $("#main-incomingCorrespondence").css("width", "calc(100% - 70px)").animate({ width: "-=190px", }, 100);
    } else {
        $("#sidebar-admin").addClass("active");
        $("#sidebar-admin").fadeIn().css({ width: 60, }).animate({ width: "300px", }, 100, function () {
            $(".sidebar-items li a").fadeIn(50);
            $(".sidebar-items li div.arrow").fadeIn(50);
        });
        $("#main-home").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
        $("#main-document").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
        $("#register-document").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
        $("#status-document").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
        $("#setup-doc-type").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
        $("#setup-distribution_group").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
        $("#setup-entity").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
        $("#setup-group").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
        $("#setup-section").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
        $("#setup-work-package").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
        $("#main-setup").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
        $("#main-inboxCorrespondence").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
        $("#main-newCorrespondence").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
        $("#main-bulkCorrespondenceRegister").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
        $("#main-myCorrespondence").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
        $("#main-incomingCorrespondence").css("width", "calc(100% - 70px)").animate({ width: "-=280px", }, 100);
    }
}

function closeNavbar() {
    $(window).resize(function () {
        $("#main-home.active").css("width", "100%").css("width", "-=100px");
        $("#main-document.active").css("width", "100%").css("width", "-=100px");
        $("#register-document.active").css("width", "100%").css("width", "-=100px");
        $("#setup-doc-type.active").css("width", "100%").css("width", "-=100px");
        $("#setup-distribution_group.active").css("width", "100%").css("width", "-=100px");
        $("#setup-entity.active").css("width", "100%").css("width", "-=100px");
        $("#setup-group.active").css("width", "100%").css("width", "-=100px");
        $("#setup-section.active").css("width", "100%").css("width", "-=100px");
        $("#setup-work-package.active").css("width", "100%").css("width", "-=100px");
        $("#main-setup.active").css("width", "100%").css("width", "-=100px");
        $("#main-inboxCorrespondence").css("width", "100%").css("width", "-=100px");
        $("#main-newCorrespondence").css("width", "100%").css("width", "-=100px");
        $("#main-bulkCorrespondenceRegister").css("width", "100%").css("width", "-=100px");
        $("#main-myCorrespondence").css("width", "100%").css("width", "-=100px");
        $("#main-incomingCorrespondence").css("width", "100%").css("width", "-=100px");
    });
    // actual animation of the sidebar (shrink). The main page will increase width accrding to the sidebar.

    if ($(window).width() <= "1366") {
        $(".sidebar-items .adminItems.active").removeClass("active");
        $(".sidebar-items .admin-subbuttons").css("display", "none");
        $(".sidebar-items li a").fadeOut(50);
        $(".sidebar-items li div.arrow").fadeOut(50);
        $(".sidebar-items .adminItems div.arrow").removeClass("active");
        $("#sidebar-admin").removeClass("active");
        $("#sidebar-admin").fadeIn().css({ width: 220, }).animate({ width: "43px", }, 100, function () {
            $("#main-home").css("width", "100%").css("width", "-=80px");
            $("#main-document").css("width", "100%").css("width", "-=80px");
            $("#main-setup").css("width", "100%").css("width", "-=80px");
            $("#register-document").css("width", "100%").css("width", "-=80px");
            $("#status-document").css("width", "100%").css("width", "-=80px");
            $("#setup-doc-type").css("width", "100%").css("width", "-=80px");
            $("#setup-distribution_group").css("width", "100%").css("width", "-=80px");
            $("#setup-entity").css("width", "100%").css("width", "-=80px");
            $("#setup-group").css("width", "100%").css("width", "-=80px");
            $("#setup-section").css("width", "100%").css("width", "-=80px");
            $("#setup-work-package").css("width", "100%").css("width", "-=80px");
            $("#main-inboxCorrespondence").css("width", "100%").css("width", "-=80px");
            $("#main-newCorrespondence").css("width", "100%").css("width", "-=80px");
            $("#main-bulkCorrespondenceRegister").css("width", "100%").css("width", "-=80px");
            $("#main-myCorrespondence").css("width", "100%").css("width", "-=80px");
            $("#main-incomingCorrespondence").css("width", "100%").css("width", "-=80px");
        });
    } else if (window.devicePixelRatio >= 1.25) {
        $(".sidebar-items .adminItems.active").removeClass("active");
        $(".sidebar-items .admin-subbuttons").css("display", "none");
        $(".sidebar-items li a").fadeOut(50);
        $(".sidebar-items li div.arrow").fadeOut(50);
        $(".sidebar-items .adminItems div.arrow").removeClass("active");
        $("#sidebar-admin").removeClass("active");
        $("#sidebar-admin").fadeIn().css({ width: 220, }).animate({ width: "43px", }, 100, function () {
            $("#main-home").css("width", "100%").css("width", "-=80px");
            $("#main-document").css("width", "100%").css("width", "-=80px");
            $("#main-setup").css("width", "100%").css("width", "-=80px");
            $("#register-document").css("width", "100%").css("width", "-=80px");
            $("#status-document").css("width", "100%").css("width", "-=80px");
            $("#setup-doc-type").css("width", "100%").css("width", "-=80px");
            $("#setup-distribution_group").css("width", "100%").css("width", "-=80px");
            $("#setup-entity").css("width", "100%").css("width", "-=80px");
            $("#setup-group").css("width", "100%").css("width", "-=80px");
            $("#setup-section").css("width", "100%").css("width", "-=80px");
            $("#setup-work-package").css("width", "100%").css("width", "-=80px");
            $("#main-inboxCorrespondence").css("width", "100%").css("width", "-=80px");
            $("#main-newCorrespondence").css("width", "100%").css("width", "-=80px");
            $("#main-bulkCorrespondenceRegister").css("width", "100%").css("width", "-=80px");
            $("#main-myCorrespondence").css("width", "100%").css("width", "-=80px");
            $("#main-incomingCorrespondence").css("width", "100%").css("width", "-=80px");
        });
    } else {
        $(".sidebar-items .adminItems.active").removeClass("active");
        $(".sidebar-items .admin-subbuttons").css("display", "none");
        $(".sidebar-items li a").fadeOut(50);
        $(".sidebar-items li div.arrow").fadeOut(50);
        $(".sidebar-items .adminItems div.arrow").removeClass("active");
        $("#sidebar-admin").removeClass("active");
        $("#sidebar-admin").fadeIn().css({ width: 300, }).animate({ width: "60px", }, 100, function () {
            $("#main-home").css("width", "100%").css("width", "-=100px");
            $("#main-document").css("width", "100%").css("width", "-=100px");
            $("#main-setup").css("width", "100%").css("width", "-=100px");
            $("#register-document").css("width", "100%").css("width", "-=100px");
            $("#status-document").css("width", "100%").css("width", "-=100px");
            $("#setup-doc-type").css("width", "100%").css("width", "-=100px");
            $("#setup-distribution_group").css("width", "100%").css("width", "-=100px");
            $("#setup-entity").css("width", "100%").css("width", "-=100px");
            $("#setup-group").css("width", "100%").css("width", "-=100px");
            $("#setup-section").css("width", "100%").css("width", "-=100px");
            $("#setup-work-package").css("width", "100%").css("width", "-=100px");
            $("#main-inboxCorrespondence").css("width", "100%").css("width", "-=100px");
            $("#main-newCorrespondence").css("width", "100%").css("width", "-=100px");
            $("#main-bulkCorrespondenceRegister").css("width", "100%").css("width", "-=100px");
            $("#main-myCorrespondence").css("width", "100%").css("width", "-=100px");
            $("#main-incomingCorrespondence").css("width", "100%").css("width", "-=100px");
        });
    }
}

$(function () {
    //notiIcon
    $("#notiIcon").click(function(){
        openInbox();
    })
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
            <input  name='buttonclicked' id= 'buttonclicked' value= 'doc' style = 'display:none'>\
            <span class='img'><img src='" + projectIcon(projectlistChild[i].icon_url) + "'></span><span class='atag'><a>" + projectlistChild[i].project_name + "</a></span></button>\
            </form>"
        )
    }
    for (i = 0; i < projectlistOther.length; i++) {
        $("#projectslistOther").append(
            "<form action='login/postlogin_processing' method='POST'>\
            <button id='proID" + projectlistOther[i].project_id + "' value='" + projectlistOther[i].project_id + "' name ='projectid' action='submit'>\
            <input  name='buttonclicked' id= 'buttonclicked' value= 'doc' style = 'display:none'>\
            <span class='img'><img src='" + projectIcon(projectlistOther[i].icon_url) + "'></span><span class='atag'><a>" + projectlistOther[i].project_name + "</a></span></button>\
            </form>"
        )
    }
    // update the projects on the side bar menu ******** end/
    
    // open notification based on URL
    var url_string = window.location.href
    var url = new URL(url_string);

    var act = url.searchParams.get("action");
    if (act == "openCorrNoti") {
        openInbox();
    }
    
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

        if (buttonClicked == "adminItems-document" && $("#sidebar-admin").hasClass("active")) {
            // if other adminItems is clicked, hide all pages and show the home page.
            closeAllMain()
            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
            updateCardInformation(); // to update card information where user click
        } else if (buttonClicked == "adminItems-document" && !$("#sidebar-admin").hasClass("active")) {
            openNavbar();
            closeAllMain()

            $(".adminItems#adminItems-document").addClass("active");
            $(".admin-subbuttons#adminsub-document").slideDown(100);

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        }
        if (buttonClicked == "adminItems-correspondence" && $("#sidebar-admin").hasClass("active")) {
            // if other adminItems is clicked, hide all pages and show the home page.
            closeAllMain()
            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        } else if (buttonClicked == "adminItems-correspondence" && !$("#sidebar-admin").hasClass("active")) {
            openNavbar();
            closeAllMain()

            $(".adminItems#adminItems-correspondence").addClass("active");
            $(".admin-subbuttons#adminsub-correspondence").slideDown(100);

            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        }
        if (buttonClicked == "adminItems-setup" && $("#sidebar-admin").hasClass("active")) {
            // if other adminItems is clicked, hide all pages and show the home page.
            closeAllMain()
            $("#main-home").fadeIn(150);
            $("#main-home").addClass("active");
        } else if (buttonClicked == "adminItems-setup" && !$("#sidebar-admin").hasClass("active")) {
            openNavbar();
            closeAllMain()

            $(".adminItems#adminItems-setup").addClass("active");
            $(".admin-subbuttons#adminsub-setup").slideDown(100);

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

    ///   Animaiion for the main page to display ///
    // show/hide table when the active user button is clicked

    // $(".admin-subbuttons .subbutton-button#documentstatus").on("click", function () {
    //     $("#main-home.active").css("display", "none");
    //     $("#main-home.active").removeClass("active");
    //     $(".menu-content-container.active").css("display", "none");
    //     $(".menu-content-container.active").removeClass("active");
    //     $("#docRegister").css("height", "100%")

    //     $("#status-document").fadeIn(150);
    //     $("#status-document").addClass("active");

    //     hideButtonandCounter();
    //     // refreshGraphInfo();
    // });

    $(".admin-subbuttons .subbutton-button#documentstatus").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $(".templateContainer").css("display", "none");
        $(".templateContainer").removeClass("active");
        hideButtonandCounter();
        
        $("#docRegister").css("height", "100%")
        $("#register-document").fadeIn(150);
        $("#register-document").addClass("active");
        $("#register-document > .mainHeader > h3").html('Document Status');
        iframe = $("#register-document > .documentContainer > iframe");
        refreshIframeSrc(iframe, DASHBORDLINK);

    });

    $(".admin-subbuttons .subbutton-button#publishedDocument").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $("#docRegister").css("height", "100%")

        $("#main-document").fadeIn(150);
        $("#main-document").addClass("active");

        iframe = $("#main-document > .documentContainer > iframe");
        refreshIframeSrc(iframe, PUBLISHEDDOCSRC);

        hideButtonandCounter();
    });

    $(".admin-subbuttons .subbutton-button#registerDocument").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $(".templateContainer").css("display", "none")
        $(".templateContainer").removeClass("active")
        $("#docRegister").css("height", "100%")

        $("#register-document").fadeIn(150);
        $("#register-document").addClass("active");

        // need to initiate process before create from
        $("#register-document > .mainHeader > h3").html('Register Document');
        iframe = $("#register-document > .documentContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_form_doc_register);

        hideButtonandCounter();
    });

   
    $(".admin-subbuttons .subbutton-button#bulkDocumentRegister").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");

        $(".templateContainer").css("display", "block")
        $(".templateContainer").addClass("active")
        $("#docRegister").css("height", "calc(100% - 110px)")

        $("#register-document").fadeIn(150);
        $("#register-document").addClass("active");

        // need to initiate process before create from
        $("#register-document > .mainHeader > h3").html('Bulk Register Document');
        iframe = $("#register-document > .documentContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_bulk_doc_register); /// ADD function to load iframe of bulk document register here.

        hideButtonandCounter();
    });
    

    // all list will use same element(iframe and header) as register doc
    $(".admin-subbuttons .subbutton-button#draftDocument").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $(".templateContainer").css("display", "none")
        $(".templateContainer").removeClass("active")
        $("#docRegister").css("height", "100%")

        $("#register-document").fadeIn(150);
        $("#register-document").addClass("active");

        $("#register-document > .mainHeader > h3").html('Draft');
        iframe = $("#register-document > .documentContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_list_doc_draft);

        hideButtonandCounter();
    });

    $(".admin-subbuttons .subbutton-button#listOpen").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $(".templateContainer").css("display", "none")
        $(".templateContainer").removeClass("active")
        $("#docRegister").css("height", "100%")

        $("#register-document").fadeIn(150);
        $("#register-document").addClass("active");

        $("#register-document > .mainHeader > h3").html('Document (Open)');
        iframe = $("#register-document > .documentContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_list_doc_open);

        hideButtonandCounter();
    });

    $(".admin-subbuttons .subbutton-button#listAll").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $(".templateContainer").css("display", "none")
        $(".templateContainer").removeClass("active")
        $("#docRegister").css("height", "100%")

        $("#register-document").fadeIn(150);
        $("#register-document").addClass("active");

        $("#register-document > .mainHeader > h3").html('Document (All)');
        iframe = $("#register-document > .documentContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_list_doc_my);

        hideButtonandCounter();
    });

    $(".admin-subbuttons .subbutton-button#listRestricted").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $(".templateContainer").css("display", "none")
        $(".templateContainer").removeClass("active")
        $("#docRegister").css("height", "100%")

        $("#register-document").fadeIn(150);
        $("#register-document").addClass("active");

        $("#register-document > .mainHeader > h3").html('Document (Restricted)');
        iframe = $("#register-document > .documentContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_list_doc_restricted);

        hideButtonandCounter();
    });

    $(".admin-subbuttons .subbutton-button#listConf").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $(".templateContainer").css("display", "none")
        $(".templateContainer").removeClass("active")
        $("#docRegister").css("height", "100%")

        $("#register-document").fadeIn(150);
        $("#register-document").addClass("active");

        $("#register-document > .mainHeader > h3").html('Document (Confidential)');
        iframe = $("#register-document > .documentContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_list_doc_confidental);

        hideButtonandCounter();
    });

    $(".admin-subbuttons .subbutton-button#listArchived").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $(".templateContainer").css("display", "none")
        $(".templateContainer").removeClass("active")
        $("#docRegister").css("height", "100%")

        $("#register-document").fadeIn(150);
        $("#register-document").addClass("active");

        $("#register-document > .mainHeader > h3").html('Document (Archived)');
        iframe = $("#register-document > .documentContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_list_doc_arch);

        hideButtonandCounter();
    });

    // show/hide table when the active project button is clicked
    $(".admin-subbuttons .subbutton-button#setupDocType").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $("#docRegister").css("height", "100%")

        $("#setup-doc-type").fadeIn(150);
        $("#setup-doc-type").addClass("active");

        iframe = $("#setup-doc-type > .setupContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_setup_lookup_docType);

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#setupDistributionGroup").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $("#docRegister").css("height", "100%")

        $("#setup-distribution_group").fadeIn(150);
        $("#setup-distribution_group").addClass("active");

        iframe = $("#setup-distribution_group > .setupContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_setup_distribution_group);

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#setupEntity").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $("#docRegister").css("height", "100%")

        $("#setup-entity").fadeIn(150);
        $("#setup-entity").addClass("active");

        iframe = $("#setup-entity > .setupContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_setup_lookup_entity);

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#setupGroup").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $("#docRegister").css("height", "100%")

        $("#setup-group").fadeIn(150);
        $("#setup-group").addClass("active");

        iframe = $("#setup-group > .setupContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_setup_lookup_group);

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#setupSection").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $("#docRegister").css("height", "100%")

        $("#setup-section").fadeIn(150);
        $("#setup-section").addClass("active");

        iframe = $("#setup-section > .setupContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_setup_lookup_section);

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#inboxCorrespondence").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $("#docRegister").css("height", "100%")

        $("#main-inboxCorrespondence").fadeIn(150);
        $("#main-inboxCorrespondence").addClass("active");

        iframe = $("#main-inboxCorrespondence > .setupContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_list_corr_inbox);

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#newCorrespondence").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $("#docRegister").css("height", "100%")

        $("#main-newCorrespondence").fadeIn(150);
        $("#main-newCorrespondence").addClass("active");

        iframe = $("#main-newCorrespondence > .setupContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_form_corr_register);

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#bulkCorrespondenceRegister").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $("#docRegister").css("height", "100%")

        $("#main-bulkCorrespondenceRegister").fadeIn(150);
        $("#main-bulkCorrespondenceRegister").addClass("active");

        iframe = $("#main-bulkCorrespondenceRegister > .setupContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_bulk_corr_register);

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#myCorrespondence").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $("#docRegister").css("height", "100%")

        $("#main-myCorrespondence").fadeIn(150);
        $("#main-myCorrespondence").addClass("active");

        iframe = $("#main-myCorrespondence > .setupContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_list_corr_my);

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#allCorrespondenceInt").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $("#docRegister").css("height", "100%")

        $("#main-incomingCorrespondence").fadeIn(150);
        $("#main-incomingCorrespondence").addClass("active");

        iframe = $("#main-incomingCorrespondence > .setupContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_list_corr_int_all);

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#incomingCorrespondenceTp").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $("#docRegister").css("height", "100%")

        $("#main-incomingCorrespondence").fadeIn(150);
        $("#main-incomingCorrespondence").addClass("active");

        iframe = $("#main-incomingCorrespondence > .setupContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_list_corr_tp_incoming);

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#outgoingCorrespondenceTp").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $("#docRegister").css("height", "100%")

        $("#main-incomingCorrespondence").fadeIn(150);
        $("#main-incomingCorrespondence").addClass("active");

        iframe = $("#main-incomingCorrespondence > .setupContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_list_corr_tp_outgoing);

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#openCorrespondence").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $("#docRegister").css("height", "100%")

        $("#main-incomingCorrespondence").fadeIn(150);
        $("#main-incomingCorrespondence").addClass("active");

        iframe = $("#main-incomingCorrespondence > .setupContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_list_corr_open);

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#confidentialCorrespondence").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $("#docRegister").css("height", "100%")

        $("#main-incomingCorrespondence").fadeIn(150);
        $("#main-incomingCorrespondence").addClass("active");

        iframe = $("#main-incomingCorrespondence > .setupContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_list_corr_conf);

        hideButtonandCounter();
    }
    );

    $(".admin-subbuttons .subbutton-button#restrictedCorrespondence").on("click", function () {
        $("#main-home.active").css("display", "none");
        $("#main-home.active").removeClass("active");
        $(".menu-content-container.active").css("display", "none");
        $(".menu-content-container.active").removeClass("active");
        $("#docRegister").css("height", "100%")

        $("#main-incomingCorrespondence").fadeIn(150);
        $("#main-incomingCorrespondence").addClass("active");

        iframe = $("#main-incomingCorrespondence > .setupContainer > iframe");
        refreshIframeSrc(iframe, JOGETLINK.doc_list_corr_restricted);

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
        if ($buttonClicked == "listOpen") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $('#' + $buttonClicked).click();
            $('.subbutton-button').removeClass('active');
            $('#' + $buttonClicked).addClass('active');

            $("#main-home.active").css("display", "none");
            $("#main-home.active").removeClass("active");
            $("#main-setup.active").css("display", "none");
            $("#main-setup.active").removeClass("active");

            if (!$(".sidebar-items .adminItems#adminItems-document").hasClass("active")) {
                $(".sidebar-items .adminItems.active").removeClass("active");
                $("#" + $subbuttonHide).slideUp(100);
                $(".sidebar-items .adminItems#adminItems-document").addClass("active");
                $("#" + $subbuttonstoShow).slideDown(100);
            }

            $(".sidebar-items .adminItems div.arrow.active").removeClass("active");
            $(".sidebar-items .adminItems#adminItems-document div.arrow").addClass(
                "active"
            );
        } else if ($buttonClicked == "registerDocument") {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }

            $('#' + $buttonClicked).click();
            $('.subbutton-button').removeClass('active');
            $('#' + $buttonClicked).addClass('active');


            if (!$(".sidebar-items .adminItems#adminItems-document").hasClass("active")) {
                $(".sidebar-items .adminItems.active").removeClass("active");
                $("#" + $subbuttonHide).slideUp(100);
                $(".sidebar-items .adminItems#adminItems-document").addClass("active");
                $("#" + $subbuttonstoShow).slideDown(100);
            }

            $(".sidebar-items .adminItems div.arrow.active").removeClass("active");
            $(".sidebar-items .adminItems#adminItems-document div.arrow").addClass(
                "active"
            );

        } else if ($buttonClicked == "archivedproject") {
            refreshDeleteProjectTableBody();
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }

            $("#main-home.active").css("display", "none");
            $("#main-home.active").removeClass("active");
            $("#main-document").css("display", "none");
            $("#main-document").removeClass("active");

            $("#main-setup").css("display", "block");
            $("#main-setup").addClass("active");

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
        } else if ($buttonClicked == 'setupDocType' || $buttonClicked == 'setupDistributionGroup' || $buttonClicked == 'setupEntity' || $buttonClicked == 'setupGroup' || $buttonClicked == 'setupSection') {
            if (!$("#sidebar-admin").hasClass("active")) {
                openNavbar();
            }
            $('#' + $buttonClicked).click();
            $('.subbutton-button').removeClass('active');
            $('#' + $buttonClicked).addClass('active');

            if (!$(".sidebar-items .adminItems#adminItems-setup").hasClass("active")) {
                $(".sidebar-items .adminItems.active").removeClass("active");
                $("#" + $subbuttonHide).slideUp(100);
                $(".sidebar-items .adminItems#adminItems-setup").addClass("active");
                $("#" + $subbuttonstoShow).slideDown(100);
            }

            $(".sidebar-items .adminItems div.arrow.active").removeClass("active");
            $(".sidebar-items .adminItems#adminItems-setup div.arrow").addClass(
                "active"
            );
        }
    });
    updateDocNotification();
});

function refreshGraphInfo() {
    $.ajax({
        type: "POST",
        url: 'BackEnd/JogetDocApp.php',
        dataType: 'json',
        data: {
            functionName: "getDocInfo"
        },
        success: function (obj) {
            if (obj.corrDoc) {
                var corrInc, corrOut;
                corrInc = (obj.corrDoc.Incoming) ? obj.corrDoc.Incoming.length : 0;
                corrOut = (obj.corrDoc.Outgoing) ? obj.corrDoc.Outgoing.length : 0;

                // graph for incoming and outgoing
                var ctx = document.getElementById('chart-corr');
                var chartCorr = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ['Incoming', 'Outgoing'],
                        datasets: [{
                            label: 'No of Document Types',
                            data: [corrInc, corrOut],
                            backgroundColor: [
                                'rgba(183, 47, 47, 1)',
                                'rgba(31, 86, 103, 1)'
                            ],
                            borderColor: [
                                'rgba(183, 47, 47, 1)',
                                'rgba(31, 86, 103, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        maintainAspectRatio: true,
                        responsive: true,
                        cutoutPercentage: 0
                    }
                });

                // graph for document status
                var corrStatus = [];
                var corStatusVal = [];
                if (obj.corrDoc.Status) {
                    for (const [key, val] of Object.entries(obj.corrDoc.Status)) {
                        corrStatus.push(key);
                        corStatusVal.push(val.length);
                    }
                }

                var ctx = document.getElementById('chart-corr-status');
                var myChart = new Chart(ctx, {
                    type: 'horizontalBar',
                    data: {
                        labels: corrStatus,
                        datasets: [{
                            data: corStatusVal,
                            backgroundColor: [
                                'rgba(183, 47, 47, 1)',
                                'rgba(31, 86, 103, 1)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(183, 47, 47, 1)',
                                'rgba(31, 86, 103, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        // maintainAspectRatio: true,
                        title: {
                            display: true,
                            text: 'No. of Document by Status'
                        },
                        legend: {
                            display: false
                        },
                        responsive: true,
                        cutoutPercentage: 0,
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }],
                            xAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
            }

            // graph for document status
            var regStatus = [];
            var regStatusVal = [];
            if (obj.registerDoc) {
                for (const [key, val] of Object.entries(obj.registerDoc)) {
                    regStatus.push(key);
                    regStatusVal.push(val.length);
                }
            }
            // graph for document subtype
            var ctx = document.getElementById('chart-doc-subtype');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: regStatus,
                    datasets: [{
                        data: regStatusVal,
                        backgroundColor: [
                            'rgba(183, 47, 47, 1)',
                            'rgba(31, 86, 103, 1)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(183, 47, 47, 1)',
                            'rgba(31, 86, 103, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: 'No. of Document by Type'
                    },
                    legend: {
                        display: false
                    },
                    responsive: true,
                    cutoutPercentage: 0,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });

        }
    });
}

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

    $("#main-setup .checkcounter #archiveduserchecked").html("");
    $("#main-setup .checkcounter #archiveduserchecked").fadeOut("fast");
    $("#main-setup .checkcounter #systemadminrecoverUser").css(
        "display",
        "none"
    );
    $("#main-setup .checkcounter #systemadmindeleteparmanentUser").css(
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

function updateDocNotification() {
    $.ajax({
        type: "POST",
        url: 'BackEnd/JogetDocApp.php',
        dataType: 'json',
        data: {
            functionName: "getJogetDocNotifications"
        },
        success: function (obj) {
            // let mydata = JSON.parse(obj);
            let mydata = obj;
            let data = mydata['data'];
            $('#notiCount').text(data.length);
            document.getElementById('notiDrop').innerHTML = "";
            // let i = 0;
            // while (i < 5) {
            //     if (i < data.length) {
            //         var id = data[i]['id'];
            //         var proj = data[i]['Project'];
            //         var prevact = data[i]['corr_act_user.action'];
            //         var actuserid = data[i]['corr_act_user.id'];
            //         var doc_id = data[i]['doc_id'];

            //         let concat = '<button class="notiitems"  onclick="openCorrespondanceForm(\'' + id + '\', \'' + proj + '\', \'' + prevact + '\', \'' + actuserid + '\');"><b>' + prevact + ' (' + doc_id + ') </b></button><br>';
            //         document.getElementById("notiDrop").innerHTML = document.getElementById("notiDrop").innerHTML + concat;
            //     } else {
            //         break;
            //     }
            //     i++;

            // }
            // let lastConcat = '<button class="notiitems" onclick="openInbox(this);" >View all assignments</button>';
            // document.getElementById("notiDrop").innerHTML = document.getElementById("notiDrop").innerHTML + lastConcat;
        }
    });
}

function openInbox() {

    if ($("#sidebar-admin").hasClass("active")){

    }else{
        openNavbar()
    }
    $("#main-home.active").css("display", "none");
    $("#main-home.active").removeClass("active");
    $(".menu-content-container.active").css("display", "none");
    $(".menu-content-container.active").removeClass("active");

    $("#main-inboxCorrespondence").fadeIn(150);
    $("#main-inboxCorrespondence").addClass("active");

    // open menu 
    $(".subbutton-button").removeClass("active");
    $("#adminsub-correspondence").css("display", "block");
    $("#adminItems-correspondence").addClass("active");
    $("#inboxCorrespondence").addClass("active");
    
    iframe = $("#main-inboxCorrespondence > .setupContainer > iframe");
    refreshIframeSrc(iframe, JOGETLINK.doc_list_corr_inbox);

    hideButtonandCounter();

    $('#notiDrop').hide();
}

function openCorrespondanceForm(recId, projID, prevAct, actid) {
    if ($("#sidebar-admin").hasClass("active")){

    }else{
        openNavbar()
    }
    $("#main-home.active").css("display", "none");
    $("#main-home.active").removeClass("active");
    $(".menu-content-container.active").css("display", "none");
    $(".menu-content-container.active").removeClass("active");

    $("#main-inboxCorrespondence").fadeIn(150);
    $("#main-inboxCorrespondence").addClass("active");

    // open menu 
    $(".subbutton-button").removeClass("active");
    $("#adminsub-correspondence").css("display", "block");
    $("#adminItems-correspondence").addClass("active");
    $("#inboxCorrespondence").addClass("active");

    let iframe = $("#main-inboxCorrespondence > .setupContainer > iframe");
    let url = JOGETLINK.doc_form_corr_respond + "?id=" + recId + "&package_id=" + projID + "&prevact=" + prevAct + "&actuserid=" + actid;

    refreshIframeSrc(iframe, url);

    hideButtonandCounter();
    $('#notiDrop').hide();
}

function OnClickNewContract() {
    console.log(localStorage.p_id);
    console.log(localStorage.p_id_name);
    console.log(localStorage.p_name);
    $("#pfsContractsDatalist iframe").attr("src", $jogetHost+"jw/web/embed/userview/PFS/pfs/_/contractDetails_crud?_mode=add&ProjectIDNo=" + localStorage.p_id + "&projectid=" + localStorage.p_id_name + "&projectname=" + localStorage.p_name)
        .css("height", "100%")
        .css("width", "100%")

}
function checkUncheckContract(ele) {

}

function OnClickContractRow(ele) {

}

function updateCardInformation() {
    $.ajax({
        url: 'BackEnd/docManagement.php',
        type: "POST",
        dataType: "json",
        data: {
            functionName: "getDocDatalistInfo_Joget",
        },
        success: function (res) {
            if (res.ok) {
                if (res.total == 0) {
                    $('.card-no-doc').show();
                    $('.card-doc').hide();
                } else {
                    $('.card-no-doc').hide();
                    $('.card-doc').show();

                    $('.card-doc-total').html(res.total);
                    docText = (res.total == 1) ? 'Document' : 'Documents';
                    $('.card-doc-text').html(docText);

                    if (res.maxDocDate) {
                        $('.card-doc-date').html(res.maxDocDate);
                    }
                }
            }
        }
    });
}

function refreshIframeSrc(ifr, isrc) {
    ifr.hide();
    ifr.attr("src", "");
    ifr.attr("src", isrc);
    ifr.on("load", function () {
        ifr.show();
    });
}

function registerDocProcessInit(ifr) {
    ifr.attr("src", "");
    $.ajax({
        type: "POST",
        url: 'backend/jogetDocApp.php',
        dataType: 'json',
        data: {
            functionName: 'initiateDocJogetProcess',
            processName: 'app_DR'
        },
        success: function (obj) {
            let actId = obj.activityId;
            if (actId) {
                let url = JOGETLINK.doc_form_doc_register + '?_action=assignmentView&activityId=' + actId + '&Project=' + PROJECTID + '&parent_project_id='+localStorage.getItem('parent_project_id');
                ifr.attr("src", url);
            } else {
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Error",
                    content: "Cannot initiate process (Empty Activity ID)",
                });
            }
        }
    })

}

function encryptStr(str) {
    let encodedString = btoa(str);
    let encodedString2 = btoa(encodedString);
    return encodedString2;
}

window.addEventListener("message", (event) => {
    if (event.origin !== JOGETHOST.replace(/\/$/, ""))
        return;

    // redirect to menu based on id
    if (event.data.redirectMenu) {
        var divId = event.data.redirectMenu;
        if ($("#" + divId)) {
            $("#" + divId).trigger('click');
        }
    }

    var updCnt = 0;
    var updInt = setInterval(function () {
        updateDocNotification();
        updCnt++;
        if (updCnt == 6) {
            clearInterval(updInt);
        }
    }, 1500);

}, false);

//support
function OnClickRaiseSupport(){
    window.open('BackEnd/jogetloginSupport.php', '_blank');
   
}