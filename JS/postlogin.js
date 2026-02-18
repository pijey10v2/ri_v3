var nStart = 1;
var nEnd = Math.round(($(window).height()-100/160) + 1)

$(function () {
    var url_string = window.location.href
    var url = new URL(url_string);
    var appStatus = url.searchParams.get("app");
    var errMsg = url.searchParams.get("err");

    if(errMsg == "loginFailed"){
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Error",
            content: "Login failed. Please try again.",
        });
    }
    
    if (appStatus == "pfs") {
        // alert("Finance Apps have not been set. Please contact the System Admin to set them.");
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "Finance apps have not been set. Please contact the System Admin to set them.",
        });

    } else if (appStatus == "doc") {
        // alert("Finance Apps have not been set. Please contact the System Admin to set them.");
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "Document registration app process has not been set. Please contact the System Admin to set them.",
        });
    } else if (appStatus == "notpfs") {
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "The app set for finance is not correct.  Please contact the System Admin to set the app correctly.",
        });
    } else if (appStatus == "notdoc") {
        $.alert({
            boxWidth: "30%",
            useBootstrap: false,
            title: "Message",
            content: "The app set for Construct does not have Document Management Process.  Please contact the System Admin to set the app correctly.",
        });
    }

    $("div.card").click(function () {
        let $showbutton = $(this).attr("id")
        if($showbutton != "SystemAdmin"){
            let projectid = $showbutton.substring(4)
            if (!$(".card button[rel =" + $showbutton + "]").hasClass("active")) {
                $(this).addClass("active")
                $(".card button[rel =" + $showbutton + "]").fadeIn(250)
                $(".card button[rel =" + $showbutton + "]").addClass("active")
                $(".card .notiBubble[rel =" + $showbutton + "]").fadeOut(250)
                $(".buttonContainer").css("background", "rgba(105, 105, 105, 0.6)")
                $("#" + $showbutton + " .buttonContainer").css("background", "rgba(63, 63, 63, 0.904)")

                $.ajax({
                    type: "POST",
                    url: "../BackEnd/projectSiblings.php",
                    dataType: "json",
                    data: {
                        //functionName : "getAssociatedProjects",
                        project_id_number: projectid
                    },
                    success: function (obj, textstatus) {
                        for (var i = 0; i < obj.length; i++) {
                            let cardID = "card" + obj[i]['project_id_number']
                            console.log(cardID)

                            $('#' + cardID + " .buttonContainer").css("background", "transparent")

                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        var str = textStatus + " " + errorThrown;
                    },
                });
            }
            
        };
    })

    $("div.card").mouseleave(function () {
        let $hidebutton = $(this).attr("id")
        if (!$(".card button[rel =" + $hidebutton + "]").hasClass("active")) {
        }
        else {
            $(this).removeClass("active")
            $(".card button[rel =" + $hidebutton + "]").fadeOut(150)
            $(".card button[rel =" + $hidebutton + "]").removeClass("active")
            $(".card .notiBubble[rel =" + $hidebutton + "]").fadeIn(250)
            $(".buttonContainer").css("background", "transparent")
            $("#" + $hidebutton + " .buttonContainer").css("background", "transparent")
        }
    })

    $('#SystemAdmin').click(function () {
        $('#projectid').val("SystemAdmin");
        $('#buttonclicked').val("SystemAdmin");
        document.forms["projectPageSelection"].submit();

    })
    $(".filterContainer input").focus(function () {
        $(this).css("background", "white")
        if ($(this).val() == "") {
            $("img.clear").css("display", "none")
        } else {
            $("img.clear").css("display", "inline-block")
        }

    })
    $(".filterContainer input").focusout(function () {
        if ($(this).val() == "") {
            $(this).css("background", "#cecece")
            $("img.clear").css("display", "none")
        } else {
            $("img.clear").css("display", "none")
        }

    })
    $(".filterContainer input").change(function () {
        if ($(this).val() == "") {
            $("img.clear").css("display", "none")
        } else {
            $("img.clear").css("display", "inline-block")
        }
    })

    inactivityTime();
    $('.scrollbar-inner').scrollbar();
    const myDiv = document.querySelector('#newsContentContainer')  
    myDiv.addEventListener('scroll', () => {  
      if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
        updateNewsFeed(nStart, nEnd)
      }  
    })
    updateNewsFeed(nStart, nEnd)


    window.closeModal = function () {
        $('#topDashboard').hide();
        window.location.reload();
    };
})

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

function OnClickbutton(ele) {
    let selection = ele.id;
    let pos = selection.indexOf(":");
    $('#projectid').val(selection.substring(0, pos));
    $('#buttonclicked').val(selection.substring(pos + 1));
    document.forms["projectPageSelection"].submit();

}

function openCard(e) {
    let id =$(e).data("id");
    let title = $(e).find(".title").html()
    let banner = $(e).find(".image").html()
    let imgURL = $(e).find(".image img").attr('src')
    let desc = $(e).find(".desc").html()
    let likeBtn = $(e).find(".likeBtn")
    let time = $(e).find(".timeStamp")

    $("#newsModal").find(".image").html(banner)
    $("#newsModal").find(".image").prepend(`<div class="backgroundImage" style="background-image: linear-gradient(#c1c1c13d, #c1c1c13d),url('${imgURL}')"></div>`)
    $("#newsModal").find(".title").html(title)
    $("#newsModal").find("#desc").html(desc)
    $($("#newsModal").find(".footer .timeStamp")).remove()
    $(time).clone().prependTo($("#newsModal").find(".footer"))
    $($("#newsModal").find(".footer .likeBtn")).remove()
    $(likeBtn).clone().appendTo($("#newsModal").find(".footer"))
    $("#newsModal").fadeIn()
}

closeNewsModal = () =>{
    let id = $("#newsModal").find(".likeBtn").data("nfid")
    let cardToAppend = $(`.newsCard#newsCard${id}`)
    let likeBtn = $("#newsModal").find(".likeBtn")

    $($(cardToAppend).find(".footer .likeBtn")).remove()
    $(likeBtn).clone().appendTo($(cardToAppend).find(".footer"))
    $("#newsModal").hide()
}

var fadeInCard = function(elem){
    elem.fadeIn({
        'start':function() {
            $(elem).css('transform','scale(1)')
        },
        'done': function(){
            if($(".newsFeed").hasClass("active")){
                fadeInCard(elem.next("div.newsCard:hidden"));
            }else{
                return;
            }
        },
        'duration':150});
}


function closeFeed(){
    let newsFeed = $(".newsFeed");
    newsFeed.removeClass("active");

    if(!newsFeed.hasClass("active")){
        $("div.newsCard").hide();
        $("div.newsCard").css('transform','scale(.8)')
        newsFeed.css("width", "0px");
        newsFeed.css("transition", "width 0.2s ease-out")
        $('.newsfeedOpen').fadeIn(400)
        $('.headerContainer a').hide()
        newsFeed.hide()
    }

    $.ajax({
        type: "POST",
        url: "../BackEnd/news_feed.json.php",
        dataType: "json",
        data: {
            fn : "hideFeed"
        },
        error: function (xhr, textStatus, errorThrown) {
            console.error(textStatus + " " + errorThrown)
        }
    });
}

function openFeed(){
    let newsFeed = $(".newsFeed");
    newsFeed.addClass("active");

    if(newsFeed.hasClass("active")){
        newsFeed.show()
        $('.newsfeedOpen').css('display', 'none')
        $('.headerContainer a').show()
        newsFeed.css({"width": "380px"})
        fadeInCard($('div.newsCard:hidden').first())
    }
}

openDigitalReporting =()=>{
    $('#topDashboard').css('display','block')
}

function searchForName(ele) {
    var input, filter, container, tr, td, i, txtValue;
    input = ele;
    filter = input.value.toUpperCase();
    container_id = $(ele).attr("rel");
    card = $("#" + container_id + " .card");
    for (i = 0; i < card.length; i++) {
        name = card[i].getAttribute("title");
        if (name) {
            if (name.toUpperCase().indexOf(filter) > -1) {
                card[i].style.display = "";
            } else {
                card[i].style.display = "none";
            }
        }
    }
}

function OnClickViewProfile() {
    $("#profileuserEdit").css("display", "inline-block");
    usr_email = document.getElementById("myprofileEmail").innerHTML.trim()
    $.ajax({
        type: "POST",
        url: '../BackEnd/UserFunctions.php',
        dataType: 'json',
        data: {
            functionName : 'viewUser',
            usr_email: usr_email
        },
        success: function (obj, textstatus) {
            if (!('error' in obj)) {
                document.getElementById("span_initial").innerText = obj.data.user_firstname.substring(0, 1) + obj.data.user_lastname.substring(0, 1)
                document.getElementById("h3_fullname_profileuser").innerText = obj.data.user_firstname + " " + obj.data.user_lastname
                //no role as project is not chosen
                // if (document.getElementById("h4_role")) { 
                //     document.getElementById("h4_role").innerText = obj['project_role'];
                // }
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

$(".profileuserFooter .editPage #postlogin-profileuserSave").on('click', function () {

    event.preventDefault()
    var passwordChange = false;
    if ($('#checkresetpasswordprofile').prop('checked')) {
        if (!$('#newpasswordprofile').val() || !$('#newconfirmpasswordprofile').val()) {
            $.alert({
                boxWidth: '30%',
                useBootstrap: false,
                title: 'Message',
                content: 'Please enter your password!',
            });
            return;
        }

        var decimal= /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        let $passfieldVal = $("#newpasswordprofile").val()
        if($passfieldVal.match(decimal)){
           
        }else{
            $.alert({
                boxWidth: "30%",
                useBootstrap: false,
                title: "Message",
                content: "Password should be between 8 to 15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
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
        url: '../BackEnd/UserFunctions.php',
        data: formdata,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function (obj) {
            var response = JSON.parse(obj)
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
                    content: response.msg,
                });
            }
        }
    })
})

likeNewsFeed  = (ele) => {
    var nfId = $(ele).data('nfid');
    var likedFlg = (($(ele).hasClass('liked'))) ? false : true;
    if(likedFlg){
        $(ele).find("i").removeClass("fa-regular")
        $(ele).find("i").addClass("fa-solid")
    }else{
        $(ele).find("i").removeClass("fa-solid")
        $(ele).find("i").addClass("fa-regular")
    }
    $(ele).toggleClass('liked');
    $(ele).css('pointer-events' , 'none');
    $.ajax({
        type: "POST",
        url: "../BackEnd/news_feed.json.php",
        dataType: "json",
        data: {
            fn : "likeFeed",
            nfid : nfId,
            liked : likedFlg
        },
        success: function (res) {
            if(res.result && res.newcnt){
                $(".likeCnt"+nfId).html(res.newcnt)
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.error(textStatus + " " + errorThrown)
        },
        complete : function (){
            $(ele).css('pointer-events' , 'auto');
        }
    });
}
processNewsDescHTML = (obj) =>{
    var htmlString = obj.nf_desc_html
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlString, "text/html");
    
    var allImg = doc.body.querySelectorAll('img')
    allImg.forEach(function(item){
        var src = item.getAttribute('src') || ''
        if(!src.includes("data:image")){
            var nsrc = "../../Data/images/news/"+obj.nf_id+"/"+src;
            item.setAttribute('src', nsrc)
        }
    })

    if($("#desc-"+obj.nf_id)) $("#desc-"+obj.nf_id).append(doc.body.innerHTML)
}

generateNewsCard = (obj) =>{
    var imgSrc = "../../Data/images/news/"+obj.nf_id+"/"+obj.nf_card_img;

    if (!obj.nf_card_img){
        imgSrc = "../../images/newsDefault2.jpg";
    }else{
        //check file exist
        $.ajax({
            url:imgSrc,
            type:'HEAD',
            error: function()
            {
                imgSrc = "../../images/newsDefault2.jpg";
            },
            success: function()
            {
                imgSrc = "../../../Data/images/news/"+obj.nf_id+"/"+obj.nf_card_img;
            }
        });
    }
    
    var nHTML = `
    <div class="newsCard" id ="newsCard`+obj.nf_id+`" style="display:none;" onclick="openCard(this)">
        <div class="image">
            <img src="`+imgSrc+`">
        </div>
        <div class="flexContainer">
            <div class="title">
            `+obj.nf_title+`
            </div>
            <p class="desc" id="desc-`+obj.nf_id+`"></p>
            <div class="footer">
                <div class="timeStamp"><i class="fa-regular fa-clock"></i> `+obj.elapsed+`</div>
                <button onclick="likeNewsFeed(this);event.stopPropagation()" class="likeBtn `+((obj.liked_flag == 1) ? `liked` : ``)+`" data-nfId ="`+obj.nf_id+`"><i class="fa-solid fa-thumbs-up"></i>&nbsp;<span class="likeCnt`+obj.nf_id+`">  `+obj.like_cnt+`</button>
            </div>
        </div>
    </div>` 
    $(".contentContainer").append(nHTML)
    processNewsDescHTML(obj)
}

updateNewsFeed = (ns, ne) => {
    $.ajax({
        type: "POST",
        url: "../BackEnd/news_feed.json.php",
        dataType: "json",
        data: {
            fn : "getnewsfeed",
            nstart : ns,
            nend : ne,
        },
        success: function (res) {
            var data = res.data;
            if (data){
                data.forEach(ele => {
                    nStart++
                    nEnd++
                    generateNewsCard(ele);
                    fadeInCard($('div.newsCard:hidden').first())
                });
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.error(textStatus + " " + errorThrown)
        },
    });
}

//support
function OnClickRaiseSupport(){
    window.open('../BackEnd/jogetloginSupport.php', '_blank');
   
}