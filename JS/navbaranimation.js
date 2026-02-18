var col_ajs = 'blue'
var col_bkt = 'green'
var col_clu = 'coral'
var col_dmv = 'red'
var col_enw = '#6A5ACD'
var col_fox = 'purple'
var col_gpy = 'violet'
var col_hqz = 'orange'
var col_ir = 'maroon'
var role, manager;
var themeFolder;
var loadinganimation = 1000;

newUI =()=> {
    // update ui preference on db
    $.ajax({
        type: "POST",
        url: '../Login/postlogin_processingv3.php',
        data: {
            functionName: "setUIPreference",
            uipref: 'ri_v3'
        },
        success : function(res){
            if(res == 'true'){
                localStorage.prefix_loc = "../"
                window.location.href = 'homepage';
                
            }else{
                alert('Error updating user preference. Please try again.')
            }
        }
    });
}

$("ul#generalInfo-tabs .tab").on("click", function () {
    let $pagetoopen = $(this).attr("rel");
    let $tabclicked = $(this).attr("id");

    $(this).parent().find(".active").removeClass("active")
    $("#" + $tabclicked).addClass("active");

    $(".projectinfoContainerBody.active").css("display", "none");
    $(".projectinfoContainerBody.active").removeClass("active");

    $("#" + $pagetoopen).css("display", "block");
    $("#" + $pagetoopen).addClass("active");
});

$(function () {

    var tables = document.getElementsByClassName('table resize');

    for (var i = 0; i < tables.length; i++) {
        resizableGrid(tables[i]);
    }

    if ((window.location.href.indexOf("postlogin") >= -1) && (window.location.href.indexOf("homepage") >= -1)) {
        $.get("BackEnd/getTheme.php", function (data, status) {
            if (data.theme == 2) {
                themeFolder = "light_color";
            } else {
                themeFolder = "dark_red";
            }
        });
    }

    $(document).click(function (e) {
        var target = e.target;

        if (!$(target).is('#usersetting') && !$(target).parents().is('#usersetting')) {
            $('#profileDrop').hide();
            $('#profileDrop').removeClass("active");
        }
    });

    $(document).click(function (e) {
        var target = e.target;

        if (!$(target).is('#sidebarItemOpen') && !$(target).parents().is('#sidebarItemOpen')) {
            if (!$(".appsbar").hasClass('active')) { } else {
                $(".appscontainer .appsbutton button a").fadeOut(50)
                $(".appsbar").animate({ width: 'toggle' }, 150, function () {
                    //$(".appsbar").css('display', 'none');
                    $(".appsbar.active").removeClass('active');
                });
            }
        }
    });


    // function to make loading faster //
    $('.loader').click(function () {
        $('.loader').css("animation-duration", loadinganimation + 'ms');
        loadinganimation -= 10;
        if (loadinganimation == 0) {
            loadinganimation = 1;
        }
    })

    /////function neutral navbar/////
    function neutralNavbar() {

        //$(".appsbar").animate({width:'toggle'},200);
        if (!$(".appsbar").hasClass('active')) { } else {
            $(".appscontainer .appsbutton button a").fadeOut(50)
            $(".appsbar").animate({
                width: 'toggle'
            }, 150, function () {
                //$(".appsbar").css('display', 'none');
                $(".appsbar.active").removeClass('active');
            });
        }

        if (!$(".nav-bar").hasClass('active')) { } else {
            $(".nav-bar.active").removeClass('active');
            $(".nav-bar").animate({
                height: 'toggle'
            }, 200);
            $(".minimize").css('display', 'block');
            document.getElementById("demo").innerHTML = '&or;';

            $(".dropitem.active").removeClass('active');
            $(".dropitem").css('display', 'none');
        }
    }


    $(".minimize").on("click", function () {

        if (!$(".nav-bar").hasClass('active')) {

            $(".nav-bar").addClass('active');
            $(".nav-bar").animate({
                height: 'toggle'
            }, 200);
            $(".minimize").css('display', 'none');
            document.getElementById("demo").innerHTML = '&or;';

        } else {

            $(".minimize").css('display', 'none');
            document.getElementById("demo").innerHTML = '&or;';

        }
        if (!$(".appsbar").hasClass('active')) { } else {
            $(".appscontainer .appsbutton button a").fadeOut(50)
            $(".appsbar").animate({
                width: 'toggle'
            }, 150, function () {
                //$(".appsbar").css('display', 'none');
                $(".appsbar.active").removeClass('active');
            });
        }

    })

    $('canvas').on("mousedown", function () {
        if (!$(".appsbar").hasClass('active')) { } else {
            $(".appscontainer .appsbutton button a").fadeOut(50)
            $(".appsbar").animate({
                width: 'toggle'
            }, 150, function () {
                //$(".appsbar").css('display', 'none');
                $(".appsbar.active").removeClass('active');
            });
        }
        if (!$(".nav-bar .index").hasClass('active')) {
            $(".minimize").css('display', 'block');
        } else {
            $(".nav-bar.active").removeClass('active');
            $(".nav-bar").animate({
                height: 'toggle'
            }, 200);
            $(".minimize").css('display', 'block');
            document.getElementById("demo").innerHTML = '&or;';

            $(".dropitem.active").removeClass('active');
            $(".dropitem").css('display', 'none');
        }
    });

    $('#RIContainer').on("click", function () {
        if (!$(".nav-bar").hasClass('active')) {
            $(".minimize").css('display', 'block');
        } else {

            $(".nav-bar.active").removeClass('active');
            $(".nav-bar").animate({
                height: 'toggle'
            }, 200);
            $(".minimize").css('display', 'block');

            $(".dropitem.active").removeClass('active');
            $(".dropitem").css('display', 'none');

        }
        if (!$(".appsbar").hasClass('active')) { } else {
            $(".appscontainer .appsbutton button a").fadeOut(50)
            $(".appsbar.active").removeClass('active');
            $(".appsbar").animate({
                width: 'toggle'
            }, 150, function () {
                //$(".appsbar").css('display', 'none');
            });
        }
    })
    //////////neutral dropitem sysadmin&admin page///////////
    $('.sysadmin-page').on("click", function () {
        $(".dropitem.active").removeClass('active');
        $(".dropitem").css('display', 'none');
    })

    $('.admin-page').on("click", function () {
        $(".dropitem.active").removeClass('active');
        $(".dropitem").css('display', 'none');
    })

    $(".nav-bar.active #sidebarItemOpen").on("click", function () {

        if (!$(".appsbar").hasClass('active')) {
            $(".appsbar").addClass('active');
            $(".appsbar").animate({
                width: 'toggle'
            }, 150, function () {
                $(".appscontainer .appsbutton button a").fadeIn(150)
                $(".projectcontainer .appsbutton button a").fadeIn(150)
            })
        }
    })

    $(".appsbar #sidebarItemClose").on("click", function () {

        $(".appscontainer .appsbutton button a").fadeOut(50)
        $(".projectcontainer .appsbutton button a").fadeOut(50)
        $(".appsbar").animate({
            width: 'toggle'
        }, 150)
        $(".appsbar").removeClass('active');
        //$(".financePage").removeClass("active")
        //$(".filterContainer input").removeClass("active")
    })

    $(".nav-bar.active .profile").on("click", function () {

        let itemtoDrop = $(this).attr('rel')
        let buttonLocation = $(this).offset()
        var buttonRightLocation = ($(window).width() - ($(this).offset().left + $(this).outerWidth()));

        if (!$('#' + itemtoDrop).hasClass('active')) {
            //$(".appsbar").animate({width:'toggle'},200);
            $(".dropitem.active").css('display', 'none')
            $(".dropitem.active").removeClass('active')

            $('#' + itemtoDrop).addClass('active');
            $('#' + itemtoDrop).css('display', 'block');
            $('#' + itemtoDrop).css('right', buttonRightLocation + 'px')
        } else {
            $('#' + itemtoDrop).removeClass('active');
            $('#' + itemtoDrop).css('display', 'none');
            $('#' + itemtoDrop).css('right', buttonRightLocation + 'px')
        }
    })

    $(".nav-bar.active .navbarItem").on("click", function () {

        let itemtoDrop = $(this).attr('rel')
        let buttonLocation = $(this).offset()
        var buttonRightLocation = ($(window).width() - ($(this).offset().left + $(this).outerWidth()));

        if (!$('#' + itemtoDrop).hasClass('active')) {
            //$(".appsbar").animate({width:'toggle'},200);
            $(".dropitem.active").css('display', 'none')
            $(".dropitem.active").removeClass('active')

            $('#' + itemtoDrop).addClass('active');
            $('#' + itemtoDrop).css('display', 'block');
            $('#' + itemtoDrop).css('right', buttonRightLocation + 'px')
        } else {
            $('#' + itemtoDrop).removeClass('active');
            $('#' + itemtoDrop).css('display', 'none');
            $('#' + itemtoDrop).css('right', buttonRightLocation + 'px')
        }
    })

    //dropdown for the project list at appsbar
    $(".projectlist-container").on("click", function () {
        if (!$(".projectlist-container").hasClass('active')) {
            $(".projectlist-container").addClass("active")
            $(".appsbutton-subbuttons").css("display", "block");
        } else {
            $(".projectlist-container").removeClass("active")
            $(".appsbutton-subbuttons").css("display", "none");
        }
    })

    //////     RIGHT SIDE OF NAVBAR    /////

    //open view profile from nav bar
    $(".profileitems").on('click', function () {
        let buttonClicked = $(this).attr('id')
        let modaltoOpen = $(this).attr('rel')
        if (!$('#' + modaltoOpen).hasClass('active')) {
            $('#' + modaltoOpen).addClass('active')
            $('#' + modaltoOpen).css('display', 'block')
        } else { }
    })

    //close view profile
    $(".closebutton").on('click', function () {
        let buttonClicked = $(this).attr('id')
        let modaltoClose = $(this).attr('rel')
        if (!$('#' + modaltoClose).hasClass('active')) { } else {
            readonlyuserstate()
            $('#' + modaltoClose).removeClass('active')
            $('#' + modaltoClose).fadeOut(100)
        }
    })

    //open view project from nav bar
    $("#navprojectName").on('click', function () {
        $("#projectViewID").addClass('active')
        $("#projectViewID").css("display", "block")
    })

    //close the setting modal form
    $('.settingFooter #settingCancel').on('click', function () {
        $('#viewSettingID').fadeOut(100)
        $('#viewSettingID').removeClass('active')
    })


    $(".profileuserFooter .readonly #profileuserEdit").on('click', function () {
        edituserstate()
        copyuserinfodivvalue()
    })

    $(".profileuserFooter .readonly #profileuserClose").on('click', function () {
        readonlyuserstate()
        $("#profileUserViewID").removeClass('active')
        $("#profileUserViewID").fadeOut(100)
    })

    $(".profileuserFooter .editPage #profileuserCancel").on('click', function () {
        readonlyuserstate()
    })

    $('.infoContainerBody-edit #checkresetpasswordprofile').change(function () {
        event.preventDefault()
        if (this.checked) {
            $("input#newbentleyusernameprofile").val("")
            $("input#newbentleypasswordprofile").val("")
            $('.infoContainerBody-edit .resetpasswordcontainer').css('display', 'block')
        } else {
            $('.infoContainerBody-edit .resetpasswordcontainer').css('display', 'none')
        }
    })

    $('.infoContainerBody-edit #checkresetbentleycredentials').change(function () {
        event.preventDefault()
        if (this.checked) {

            $('.infoContainerBody-edit .resetbentleycredscontainer').css('display', 'block')
        } else {
            $('.infoContainerBody-edit .resetbentleycredscontainer').css('display', 'none')
        }
    })

    //function for showing the password strangth meter and text FOR THE NAVBAR USER INFO //
    function passwordText() {
        let $passfieldVal = $("#newpasswordprofile").val()
        let $no = 0

        if ($passfieldVal != "") {
            if ($passfieldVal.length <= 4) $no = 1;
            if ($passfieldVal.length > 4) $no = 2;
            if ($passfieldVal.length > 6) $no = 3;
            if ($passfieldVal.length > 8) $no = 4;

            if ($no == 1) {
                $("#passwordstrengthprofile").animate({
                    width: '50px'
                }, 150)
                $("#passwordstrengthprofile").css('background-color', 'red')
                $("#passwordstrengthTextprofile").html('Very Weak')
            } else if ($no == 2) {
                $("#passwordstrengthprofile").animate({
                    width: '100px'
                }, 150)
                $("#passwordstrengthprofile").css('background-color', 'orange')
                $("#passwordstrengthTextprofile").html('Weak')
            } else if ($no == 3) {
                $("#passwordstrengthprofile").animate({
                    width: '150px'
                }, 150)
                $("#passwordstrengthprofile").css('background-color', 'yellow')
                $("#passwordstrengthTextprofile").html('Good')
            } else if ($no == 4) {
                $("#passwordstrengthprofile").animate({
                    width: '200px'
                }, 150)
                $("#passwordstrengthprofile").css('background-color', 'green')
                $("#passwordstrengthTextprofile").html('Strong')
            }
        } else {

        }
    }

    $("input#newpasswordprofile").on('keyup', function () {
        if (!$(this).val().length == 0) {
            $(".passindicator").css('display', 'inline-block')
            passwordText()
        } else {
            $(".passindicator").css('display', 'none')
        }
    })

    /////for confirm password validation css userprofile
    $("#newconfirmpasswordprofile").on('keyup', function () {
        if ($(window).width() <= "1366") {
            if (!($("#newconfirmpasswordprofile").val() == $("#newpasswordprofile").val())) {
                $("input#newconfirmpasswordprofile").css({
                    "background": "url(Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "15px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px",
                    "width": "calc(100% - 64px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "20px"
                })
                $("input#newpasswordprofile").addClass("invalid")
                $("input#newpasswordprofile").removeClass("valid")
            } else if ($("#newconfirmpasswordprofile").val() == $("#newpasswordprofile").val()) {
                $("input#newconfirmpasswordprofile").css({
                    "background": "url(Images/icons/gen_button/checked.svg)",
                    "border-color": "hsl(120, 76%, 50%)",
                    "background-size": "15px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px"
                })
                $("input#newpasswordprofile").addClass("valid")
                $("input#newpasswordprofile").removeClass("invalid")
            }
        } else {
            if (!($("#newconfirmpasswordprofile").val() == $("#newpasswordprofile").val())) {
                $("input#newconfirmpasswordprofile").css({
                    "background": "url(Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "20px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px",
                    "width": "calc(100% - 64px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "25px"
                })
                $("input#newpasswordprofile").addClass("invalid")
                $("input#newpasswordprofile").removeClass("valid")
            } else if ($("#newconfirmpasswordprofile").val() == $("#newpasswordprofile").val()) {
                $("input#newconfirmpasswordprofile").css({
                    "background": "url(Images/icons/gen_button/checked.svg)",
                    "border-color": "hsl(120, 76%, 50%)",
                    "background-size": "20px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px"
                })
                $("input#newpasswordprofile").addClass("valid")
                $("input#newpasswordprofile").removeClass("invalid")
            }
        }
    })
    $("#newpasswordprofile").on('keyup', function () {
        if ($(window).width() <= "1366") {
            if (!($("#newconfirmpasswordprofile").val() == $("#newpasswordprofile").val())) {
                $("input#newconfirmpasswordprofile").css({
                    "background": "url(Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "15px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px",
                    "width": "calc(100% - 64px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "20px"
                })
                $("input#newpasswordprofile").addClass("invalid")
                $("input#newpasswordprofile").removeClass("valid")
            } else if ($("#newconfirmpasswordprofile").val() == $("#newpasswordprofile").val()) {
                $("input#newconfirmpasswordprofile").css({
                    "background": "url(Images/icons/gen_button/checked.svg)",
                    "border-color": "hsl(120, 76%, 50%)",
                    "background-size": "15px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px"
                })
                $("input#newpasswordprofile").addClass("valid")
                $("input#newpasswordprofile").removeClass("invalid")
            }
        } else {
            if (!($("#newconfirmpasswordprofile").val() == $("#newpasswordprofile").val())) {
                $("input#newconfirmpasswordprofile").css({
                    "background": "url(Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "20px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px",
                    "width": "calc(100% - 64px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "25px"
                })
                $("input#newpasswordprofile").addClass("invalid")
                $("input#newpasswordprofile").removeClass("valid")
            } else if ($("#newconfirmpasswordprofile").val() == $("#newpasswordprofile").val()) {
                $("input#newconfirmpasswordprofile").css({
                    "background": "url(Images/icons/gen_button/checked.svg)",
                    "border-color": "hsl(120, 76%, 50%)",
                    "background-size": "20px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px"
                })
                $("input#newpasswordprofile").addClass("valid")
                $("input#newpasswordprofile").removeClass("invalid")
            }
        }
    })
    $("#newconfirmpasswordprofile").on('focusout', function () {
        if ($(window).width() <= "1366") {
            if ($("#newpasswordprofile").hasClass("invalid")) {
                $("input#newconfirmpasswordprofile").css({
                    "background": "url(Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "15px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px",
                    "width": "calc(100% - 64px)",
                    "padding": "3px 0px",
                    "border-radius": "3px",
                    "padding-left": "20px"
                })
            } else if ($("#newpasswordprofile").hasClass("valid")) {
                $("input#newconfirmpasswordprofile").css({
                    "background": "url(Images/icons/gen_button/checked.svg)",
                    "border-color": "#d1d1d1",
                    "background-size": "15px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px"
                })
            }
        } else {
            if ($("#newpasswordprofile").hasClass("invalid")) {
                $("input#newconfirmpasswordprofile").css({
                    "background": "url(Images/icons/gen_button/cancel.svg)",
                    "border-color": "red",
                    "background-size": "20px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px"
                })
            } else if ($("#newpasswordprofile").hasClass("valid")) {
                $("input#newconfirmpasswordprofile").css({
                    "background": "url(Images/icons/gen_button/checked.svg)",
                    "border-color": "#d1d1d1",
                    "background-size": "20px",
                    "background-repeat": "no-repeat",
                    "background-position": "2px 4px"
                })
            }
        }
    })

    $(".profileuserFooter .editPage #profileuserSave").on('click', function () {
        event.preventDefault()
        console.log("change");
        var passwordChange = false;
        if ($("#firstnameprofile").val() !== "") {
            var x = $("#firstnameprofile").val();
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

        if ($("#lastnameprofile").val() !== "") {
            var x = $("#lastnameprofile").val();
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

        if (
            !$("#firstnameprofile").val() ||
            !$("#lastnameprofile").val()
        ) {
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Please enter values for first name and last name!",
            });
            return;
        }

        if ($('#checkresetpasswordprofile').prop('checked')) {
            if (!$('#newpasswordprofile').val()) {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Please enter your password!',
                });
                return;
            }
            if ($("#newpasswordprofile").val() !== "") {
                var x = $("#newpasswordprofile").val();
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
            if (!$('#newconfirmpasswordprofile').val()) {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Please confim your password!',
                });
                return;
            }

            var decimal= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
            let $passfieldVal = $("#newpasswordprofile").val()
            if($passfieldVal.match(decimal)){
                console.log("password ok");
               
            }else{
                $.alert({
                    boxWidth: "30%",
                    useBootstrap: false,
                    title: "Message",
                    content: "Password should be between 8 to 15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
                });
                return;
            }
            
            if (!($("#newconfirmpasswordprofile").val() == $("#newpasswordprofile").val())) {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Password did not match!',
                });
                return;
            }
            passwordChange = true;
        };
        if ($('#checkresetbentleycredentials').prop('checked')) {
            if (!$('#newbentleyusernameprofile').val() || !$('#newbentleypasswordprofile').val()) {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Please enter your username and password!',
                });
                return;
            }
        };
        readonlyuserstate()
        copyuserinfoinputvalue()
        var fname = $('#firstnameprofile').val();
        var lname = $('#lastnameprofile').val();
        var country = $('#countryprofile').val();

        var formdata = new FormData();
        formdata.append('fname', fname);
        formdata.append('lname', lname);
        //  formdata.append('org', org);
        formdata.append('country', country);
        //formdata.append('role',role);

        if ($('#checkresetpasswordprofile').prop('checked')) {
            var upassword = $('#newpasswordprofile').val();
            formdata.append('password', upassword);
        };

        if ($('#checkresetbentleycredentials').prop('checked')) {
            var bentleyuser = $('#newbentleyusernameprofile').val();
            var bentleypass = $('#newbentleypasswordprofile').val();
            formdata.append('bentleyusername', bentleyuser);
            formdata.append('bentleypassword', bentleypass);
        };
        formdata.append('functionName', 'updateUserProfile');

        $.ajax({
            url: 'BackEnd/UserFunctions.php',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (obj) {
                console.log(obj);
                if (localStorage.pid == undefined) { //system admin page
                    refreshUserTableBody();
                }
                if (passwordChange) {
                    $.confirm({
                        boxWidth: '30%',
                        useBootstrap: false,
                        title: 'Confirm!',
                        content: 'You\'ll be logged out for the changes to take effect. Please sign in back with your new password.',
                        buttons: {
                            OK: function () {
                                window.open("../signin.php", '_self')
                            }
                        }
                    });
                } else {
                    $("#span_initial").text(fname.substring(0, 1) + lname.substring(0, 1))
                    $("#usernameEmail strong").text("Hi, " + fname)
                    $("#navbar_initial").text(fname.substring(0, 1) + lname.substring(0, 1))
                    $.alert({
                        boxWidth: '30%',
                        useBootstrap: false,
                        title: 'Message',
                        content: obj['msg'],
                    });
                }
            }
        })
    })

    $("button.password-show").click(function () {
        let inputtochange = $(this).attr("rel")
        console.log(inputtochange)
        $('#' + inputtochange).attr("type", "text");
        $("button.password-show").hide();
        $("button.password-hide").show();
        event.preventDefault();
    });

    $("button.password-hide").click(function () {
        let inputtochange = $(this).attr("rel")
        console.log(inputtochange)
        $('#' + inputtochange).attr("type", "password");
        $("button.password-hide").hide();
        $("button.password-show").show();
        event.preventDefault();
    });

    $("button.password-show-confirm").click(function () {
        let inputtochange = $(this).attr("rel")
        console.log(inputtochange)
        $('#' + inputtochange).attr("type", "text");
        $("button.password-show-confirm").hide();
        $("button.password-hide-confirm").show();
        event.preventDefault();
    });

    $("button.password-hide-confirm").click(function () {
        let inputtochange = $(this).attr("rel")
        console.log(inputtochange)
        $('#' + inputtochange).attr("type", "password");
        $("button.password-hide-confirm").hide();
        $("button.password-show-confirm").show();
        event.preventDefault();
    });

    //prompt to systemadmin and open new project  
    $("#newprojectappbutton").on('click', function () {
        var oNewWindow = window.open("systemadmin.php");
        oNewWindow.onload = function () {
            oNewWindow.$("#adminItems-project.adminItems").addClass('active')
            oNewWindow.$("#adminItems-project.adminItems .arrow").addClass('active')
            oNewWindow.$("#adminsub-project").css('display', 'block')
            oNewWindow.$("#addnewprojectForm.systemadminformView").addClass('active')
            oNewWindow.$("#addnewprojectForm.systemadminformView").css('display', 'block')
        }
    })
})

function sortTable(n, ele, dT) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = ele.parentNode.parentNode.parentNode.parentNode
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;
        loop1: for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            switch (dT) {
                case "A":
                    if (dir == "asc") {
                        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            $('th img.sorted').attr('src', 'Images/icons/table/' + themeFolder + '/defaultsort.png')
                            $('th img.sorted').removeClass('sortedasc')
                            $(ele).attr('src', 'Images/icons/table/' + themeFolder + '/downsort.png')
                            $(ele).addClass('sorted')
                            break loop1;
                        }
                    } else if (dir == "desc") {
                        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                            shouldSwitch = true;
                            $('th img.sorted').attr('src', 'Images/icons/table/' + themeFolder + '/defaultsort.png')
                            $('th img.sorted').removeClass('sortedasc')
                            $(ele).attr('src', 'Images/icons/table/' + themeFolder + '/upsort.png')
                            $(ele).addClass('sorted')
                            break loop1;
                        }
                    }
                    break;
                case "N":
                    if (dir == "asc") {
                        if (Number(x.innerHTML) > Number(y.innerHTML)) {
                            shouldSwitch = true;
                            $('th img.sorted').attr('src', 'Images/icons/table/' + themeFolder + '/defaultsort.png')
                            $('th img.sorted').removeClass('sortedasc')
                            $(ele).attr('src', 'Images/icons/table/' + themeFolder + '/downsort.png')
                            $(ele).addClass('sorted')
                            break loop1;
                        }
                    } else if (dir == "desc") {
                        if (Number(x.innerHTML) < Number(y.innerHTML)) {
                            shouldSwitch = true;
                            $('th img.sorted').attr('src', 'Images/icons/table/' + themeFolder + '/defaultsort.png')
                            $('th img.sorted').removeClass('sortedasc')
                            $(ele).attr('src', 'Images/icons/table/' + themeFolder + '/upsort.png')
                            $(ele).addClass('sorted')
                            break loop1;
                        }
                    }
                    break;
                case "D":
                    if (dir == "asc") {
                        if (new Date(x.innerHTML) < new Date(y.innerHTML)) {
                            shouldSwitch = true;
                            $('th img.sorted').attr('src', 'Images/icons/table/' + themeFolder + '/defaultsort.png')
                            $('th img.sorted').removeClass('sortedasc')
                            $(ele).attr('src', 'Images/icons/table/' + themeFolder + '/downsort.png')
                            $(ele).addClass('sorted')
                            break loop1;
                        }
                    } else if (dir == "desc") {
                        if (new Date(x.innerHTML) > new Date(y.innerHTML)) {
                            shouldSwitch = true;
                            $('th img.sorted').attr('src', 'Images/icons/table/' + themeFolder + '/defaultsort.png')
                            $('th img.sorted').removeClass('sortedasc')
                            $(ele).attr('src', 'Images/icons/table/' + themeFolder + '/upsort.png')
                            $(ele).addClass('sorted')
                            break loop1;
                        }
                    }
                    break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function copyuserinfodivvalue() {
    let $email = $('#img_email').html()
    let $country = $('#img_country').html()
    let $role = $('#img_role').html()

    let $str = $('#img_fullname').html()
    let strs = $str.split(' ')

    let $fname = strs[0]
    let $lname = strs[1]

    $('#firstnameprofile').val($fname)
    $('#lastnameprofile').val($lname)
    $('#countryprofile').val($country)
}

function copyuserinfoinputvalue() {
    event.preventDefault()
    let $country = $('#countryprofile').val()
    let $fname = $('#firstnameprofile').val()
    let $lname = $('#lastnameprofile').val()

    $('#img_country').html($country)
    $('#img_fullname').html($fname + ' ' + $lname)
    $('#h3_fullname_profileuser').html($fname + ' ' + $lname)
}

//function for the profile view (click, animation, etc)
function edituserstate() {

    event.preventDefault()

    //Resize the form.
    $(".infoPicture").hide();
    $(".infoHeader-edit").css("display", "block")
    $(".infoHeader-readonly").css({
        display: "none"
    })
    $(".infoView .infoContent").animate({
        width: '40vw',
        margin: '5% auto',
    })
    $(".infoContainerMainBody").animate({
        height: '60vh',
    })

    //show & hide the main body container
    $(".infoContainerBody-readonly").css('display', 'none')
    $(".infoContainerBody-edit").css('display', 'block')

    //show & hide the footer of the form
    $(".profileuserFooter .readonly").css('display', 'none')
    $(".profileuserFooter .editPage").css('display', 'block')

    //hide password indicator
    $('#checkresetpasswordprofile').prop("checked", false);
    $("input#newconfirmpasswordprofile").css({
        "background": "none",
        "border-color": "#d1d1d1",
        "background-size": "20px",
        "background-repeat": "no-repeat",
        "background-position": "2px 4px",
        "width": "calc(100% - 49px)",
        "padding": "3px 0px",
        "border-radius": "3px",
        "padding-left": "10px"
    })
    $("input#newconfirmpasswordprofile").val("")
    $("input#newpasswordprofile").val("")
    $(".passindicator").css('display', 'none')
    $(".resetpasswordcontainer").css('display', 'none')
    $('#checkresetbentleycredentials').prop("checked", false);
    $("input#newbentleyusernameprofile").val("")
    $("input#newbentleypasswordprofile").val("")
    $('.infoContainerBody-edit .resetbentleycredscontainer').css('display', 'none')
}

function readonlyuserstate() {

    event.preventDefault()

    //Resize the form.
    $(".infoHeader-edit").css("display", "none")
    $(".infoHeader-readonly").css({
        display: "block"
    })
    $(".infoContainerMainBody").animate({
        height: '40vh',
    }, function () {
        $(".infoPicture").fadeIn();
    })
    $(".infoView .infoContent").animate({
        width: '40%',
        margin: '10% auto',
    })


    //show & hide the main body container
    $(".infoContainerBody-readonly").css('display', 'block')
    $(".infoContainerBody-edit").css('display', 'none')

    //show & hide the footer of the form
    $(".profileuserFooter .readonly").css('display', 'block')
    $(".profileuserFooter .editPage").css('display', 'none')
}

////////////////for the navbar initial background///////////////
$(document).ready(function () {
    if (document.getElementById("myprofileEmail") == undefined) {
        return
    }

    if(document.getElementById("navbar_initial")){
        let str = document.getElementById("navbar_initial").innerText;
        let initial = str.substring(0, 1)

        if (initial == 'A' || initial == 'a' || initial == 'J' || initial == 'j' || initial == 'S' || initial == 's') {
            $('#usersetting .navbar-infopicture').css('background', col_ajs)
        } else if (initial == 'B' || initial == 'b' || initial == 'K' || initial == 'k' || initial == 'T' || initial == 't') {
            $('#usersetting .navbar-infopicture').css('background', col_bkt)
        } else if (initial == 'C' || initial == 'c' || initial == 'L' || initial == 'l' || initial == 'U' || initial == 'u') {
            $('#usersetting .navbar-infopicture').css('background', col_clu)
        } else if (initial == 'D' || initial == 'd' || initial == 'M' || initial == 'm' || initial == 'V' || initial == 'v') {
            $('#usersetting .navbar-infopicture').css('background', col_dmv)
        } else if (initial == 'E' || initial == 'e' || initial == 'N' || initial == 'n' || initial == 'W' || initial == 'w') {
            $('#usersetting .navbar-infopicture').css('background', col_enw)
        } else if (initial == 'F' || initial == 'f' || initial == 'O' || initial == 'o' || initial == 'X' || initial == 'x') {
            $('#usersetting .navbar-infopicture').css('background', col_fox)
        } else if (initial == 'G' || initial == 'g' || initial == 'P' || initial == 'p' || initial == 'Y' || initial == 'y') {
            $('#usersetting .navbar-infopicture').css('background', col_gpy)
        } else if (initial == 'H' || initial == 'h' || initial == 'Q' || initial == 'q' || initial == 'Z' || initial == 'z') {
            $('#usersetting .navbar-infopicture').css('background', col_hqz)
        } else if (initial == 'I' || initial == 'i' || initial == 'R' || initial == 'r') {
            $('#usersetting .navbar-infopicture').css('background', col_ir)
        }

    }

});

function ImodelJsButton(e) {
    if ($(e).hasClass("active")) {
        // ImodelJs(false)
        jqwidgetBox("IModelJs", false);
        $(e).removeClass('active')
    } else {

        $(e).addClass('active')
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.responseText == "") {
                } else {
                    myWindow = window.open("BackEnd/jq.php", "_blank", "width=200, height=150");

                    setTimeout(() => {
                        myWindow.close();
                    }, 4000);
                    setTimeout(() => {
                        $('#pwsharepage').html('<object data="https://connect.bentley.com/SelectProject/Index" height="100%" width="100%"></object>');
                        // ImodelJs(true);
                        jqwidgetBox("IModelJs", 1);
                    }, 6000);
                    // setTimeout(() => {  window.open("https://connect.bentley.com/SelectProject/Index"); }, 6000); //#demo

                }
            }
        });
        xhr.open("GET", "BackEnd/bentley_login.php");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Accept", "*/*");
        xhr.send();

    }
}

function PwShareButton(e) {
    if ($(e).hasClass("active")) {
        // PWShare(false)
        jqwidgetBox("PWShare", false);
        $(e).removeClass('active')
    } else {
        // PWShare(true)
        jqwidgetBox("PWShare", 1);
        $(e).addClass('active')
    }
}

function OnClickOpenViewProfile() {
    $("#profileuserEdit").css("display", "inline-block");
    usr_email = document.getElementById("myprofileEmail").innerHTML.trim()
    $.ajax({
        type: "POST",
        url: 'BackEnd/UserFunctions.php',
        dataType: 'json',
        data: {
            functionName: 'viewUser',
            usr_email: usr_email
        },
        success: function (obj, textstatus) {
            console.log(obj);
            if (!('error' in obj)) {
                document.getElementById("span_initial").innerText = obj.data.user_firstname.substring(0, 1) + obj.data.user_lastname.substring(0, 1)
                document.getElementById("h3_fullname_profileuser").innerText = obj.data.user_firstname + " " + obj.data.user_lastname
                if (document.getElementById("h4_role")) {
                    document.getElementById("h4_role").innerText = obj.project_role;
                }
                document.getElementById("img_fullname").innerText = obj.data.user_firstname + " " + obj.data.user_lastname
                document.getElementById("img_email").innerText = obj.data.user_email
                document.getElementById("img_org").innerText = obj.data.orgName
                document.getElementById("img_country").innerText = obj.data.user_country
                $('.profileUserView').show();

                let str = obj.data.user_firstname
                let initial = str.substring(0, 1)

                if (initial == 'A' || initial == 'a' || initial == 'J' || initial == 'j' || initial == 'S' || initial == 's') {
                    $('#profileUserViewID .infoContent .infoPicture').css('background', col_ajs)
                    $('#profileUserViewID .infoContent .infoPicture .infoInitial').css('background', col_ajs)
                    $('#usersetting .navbar-infopicture').css('background', col_ajs)
                } else if (initial == 'B' || initial == 'b' || initial == 'K' || initial == 'k' || initial == 'T' || initial == 't') {
                    $('#profileUserViewID .infoContent .infoPicture').css('background', col_bkt)
                    $('#profileUserViewID .infoContent .infoPicture .infoInitial').css('background', col_bkt)
                    $('#usersetting .navbar-infopicture').css('background', col_bkt)
                } else if (initial == 'C' || initial == 'c' || initial == 'L' || initial == 'l' || initial == 'U' || initial == 'u') {
                    $('#profileUserViewID .infoContent .infoPicture').css('background', col_clu)
                    $('#profileUserViewID .infoContent .infoPicture .infoInitial').css('background', col_clu)
                    $('#usersetting .navbar-infopicture').css('background', col_clu)
                } else if (initial == 'D' || initial == 'd' || initial == 'M' || initial == 'm' || initial == 'V' || initial == 'v') {
                    $('#profileUserViewID .infoContent .infoPicture').css('background', col_dmv)
                    $('#profileUserViewID .infoContent .infoPicture .infoInitial').css('background', col_dmv)
                    $('#usersetting .navbar-infopicture').css('background', col_dmv)
                } else if (initial == 'E' || initial == 'e' || initial == 'N' || initial == 'n' || initial == 'W' || initial == 'w') {
                    $('#profileUserViewID .infoContent .infoPicture').css('background', col_enw)
                    $('#profileUserViewID .infoContent .infoPicture .infoInitial').css('background', col_enw)
                    $('#usersetting .navbar-infopicture').css('background', col_enw)
                } else if (initial == 'F' || initial == 'f' || initial == 'O' || initial == 'o' || initial == 'X' || initial == 'x') {
                    $('#profileUserViewID .infoContent .infoPicture').css('background', col_fox)
                    $('#profileUserViewID .infoContent .infoPicture .infoInitial').css('background', col_fox)
                    $('#usersetting .navbar-infopicture').css('background', col_fox)
                } else if (initial == 'G' || initial == 'g' || initial == 'P' || initial == 'p' || initial == 'Y' || initial == 'y') {
                    $('#profileUserViewID .infoContent .infoPicture').css('background', col_gpy)
                    $('#profileUserViewID .infoContent .infoPicture .infoInitial').css('background', col_gpy)
                    $('#usersetting .navbar-infopicture').css('background', col_gpy)
                } else if (initial == 'H' || initial == 'h' || initial == 'Q' || initial == 'q' || initial == 'Z' || initial == 'z') {
                    $('#profileUserViewID .infoContent .infoPicture').css('background', col_hqz)
                    $('#profileUserViewID .infoContent .infoPicture .infoInitial').css('background', col_hqz)
                    $('#usersetting .navbar-infopicture').css('background', col_hqz)
                } else if (initial == 'I' || initial == 'i' || initial == 'R' || initial == 'r') {
                    $('#profileUserViewID .infoContent .infoPicture').css('background', col_ir)
                    $('#profileUserViewID .infoContent .infoPicture .infoInitial').css('background', col_ir)
                    $('#usersetting .navbar-infopicture').css('background', col_ir)
                }
            } else {
                console.log(obj.error);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    })
}

function expandChild(e) {
    let $itemOpen = $(e).attr('rel')

    if (!$("#" + $itemOpen).hasClass("active")) {
        $(".list-items.active").slideUp(50)
        $(".list-items.active").removeClass('active')
        $("#" + $itemOpen).slideDown(50)
        $("#" + $itemOpen).addClass('active')

    } else {
        // $(".list-items.active").slideUp()
        // $(".list-items.active").removeClass('active')
        $("#" + $itemOpen).slideUp(50)
        $("#" + $itemOpen).removeClass('active')
    }


}

function updateProjectFinanceDetails() {
    $.ajax({
        type: "POST",
        url: 'BackEnd/jogetPFS.php',
        dataType: 'json',
        data: {
            functionName: "getContractDetails"
        },
        success: function (obj, textstatus) {
            // let data = obj['data'];
            let data = obj;
            if (!data) { return };
            let myhtml = "";
            for (var i = 0; i < data.length; i++) {
                let myclass = 'list-items';
                if (i == 0) {
                    myclass = 'list-items active';
                }
                myhtml += "\
                <div class='projectHeader' rel='" + data[i].contract_id + "' onclick='expandChild(this)'><label>" + data[i].contract_title + "</label></div>\
                <div class='"+ myclass + "' id = " + data[i].contract_id + ">\
                    <img src='Images/icons/admin_page/newprojectform/projectid.png' title ='Contract ID'><a id='viewfinanceiddisplay'>"+ data[i].contract_id + "</a><br>\
                    <img src='Images/icons/admin_page/newprojectform/projectname.png' title ='Contract Title'><a id='viewfinancenamedisplay'>"+ data[i].contract_title + "</a><br>\
                    <img src='Images/icons/admin_page/newprojectform/date.png' title ='Completion Date'><a id='viewfinancecompletedatedisplay'>"+ data[i].completion_date + "</a><br>\
                    <img src='Images/icons/admin_page/newprojectform/original_amount.png' title ='Original Amount'><a id='viewfinanceoriginalamountdisplay'>"+ data[i].original_amount + "</a><br>\
                    <img src='Images/icons/admin_page/newprojectform/variation_amount.png' title ='Variation Amount'><a id='viewfinancevariationamount'>"+ data[i].variation_amount + "</a><br>\
                    <img src='Images/icons/admin_page/newprojectform/amount.png' title ='New Amount'><a id='viewfinancenewamount'>"+ data[i].new_amount + "</a><br>\
                    <img src='Images/icons/admin_page/newprojectform/industry.png' title ='LOA Ref No.'><a id='viewfinanceloarefno'>"+ data[i].loa_ref_no + "</a><br>\
                    <img src='Images/icons/admin_page/newprojectform/industry.png' title ='LOA Date'><a id='viewfinanceloadate'>"+ data[i].loa_date + "</a><br>\
                    <img src='Images/icons/admin_page/newprojectform/original_date.png' title ='Original Duration'><a id='viewfinanceoriginalduration'>"+ data[i].original_duration + "</a><br>\
                    <img src='Images/icons/admin_page/newprojectform/variation_date.png' title ='Extension of Time'><a id='viewfinanceextensionoftime'>"+ data[i].extension_of_time + "</a><br>\
                    <img src='Images/icons/admin_page/newprojectform/date.png' title ='New Duration'><a id='viewfinancenewduration'>"+ data[i].new_duration + "</a><br>\
                </div>";
            }
            $('#financeContractInfo').html(myhtml);
        },
        error: function (xhr, textStatus, errorThrown) {
            var str = textStatus + " " + errorThrown;
            console.log(str);
        }
    });
}

function projectIcon(icon){
    if(icon!='favicon.ico'){
        return '../'+icon;
    }
    return icon;
}