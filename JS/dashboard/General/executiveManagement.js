//V3
var execData;
var sectionData;
var overallData;
var ownerProject;
var userOrg;
var colorArr = [];
var chart;
var monthHalftextForPrev = {0:"Dec",1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};
var monthPrev = {"Jan":"Dec","Feb":"Jan","Mar":"Feb","Apr":"Mar","May":"Apr","Jun":"May","Jul":"Jun","Aug":"Jul","Sep":"Aug","Oct":"Sep","Nov":"Oct","Dec":"Nov"};

var monthHalftext = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};
var monthPrev = {"Jan":"Dec","Feb":"Jan","Mar":"Feb","Apr":"Mar","May":"Apr","Jun":"May","Jul":"Jun","Aug":"Jul","Sep":"Aug","Oct":"Sep","Nov":"Oct","Dec":"Nov"};

var legendColorArr = [
    '#183e65' ,'#1374a7','#64c9de','#188cbb', '#d5eaee',
    '#ffd19e', '#dc793f', '#896a43', '#552710', '#811701',
    '#fcc688', '#f1ebcb', '#f3e1ef', '#d9acc9', '#ae75a0',
    '#633158', '#1a040e', '#456c35', '#778f51', '#acc38b', 
    '#c9c8b4', '#fbfdfc', '#f1d780', '#edcb5f', '#f5b901', 
    '#dc5d01', '#f59201'
]

function exitFullScreenHandler(){
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        defaultScreenState()
        $('#projectProgressTable').find('td').attr('style', 'font-size: .65rem; width: auto !important;')
        $('.width').attr('style', 'font-size: .65rem; width: auto !important;')
    }
}

function defaultScreenState(){
    $(".btn-full-screen.active").children().removeClass("fa-compress");
    $(".btn-full-screen.active").children().addClass("fa-expand");
    $(".container-full-screen.active").removeClass("active");
    $(".btn-full-screen.active").removeClass("active");
}

function chartExitFullscreen(){
    defaultScreenState()
    document.exitFullscreen();
}

function chartFullScreen(e){
    var containerActive;
    let tableElement = $(e).parent().parent().find('table').find('td')

    if(!$(e).hasClass("active")){
        $(e).addClass("active");
        $(e).parent().parent().addClass("active");

        $(e).children().removeClass("fa-expand");
        $(e).children().addClass("fa-compress");

        containerActive = $(".container-full-screen.active")[0];


        if(containerActive.requestFullscreen){
            containerActive.requestFullscreen();
        }

        else if(containerActive.mozRequestFullScreen){
            containerActive.mozRequestFullScreen();
        }

        else if(containerActive.webkitRequestFullscreen){
            containerActive.webkitRequestFullscreen();
        }
        else if(containerActive.msRequestFullscreen){
            containerActive.msRequestFullscreen();
        }

        $('#projectProgressTable').find('td').attr('style', 'font-size: 1rem; width: calc(97vw - 400px) !important;')
        $('.width').attr('style', 'font-size: 1rem; width: 400px !important;')
    }else{
        chartExitFullscreen();
    }

}

function removeChart(){
    for(let i = 0; i <= Highcharts.charts.length; i++){
        Highcharts.charts[i] && Highcharts.charts[i].destroy();
    }

    Highcharts.length = 0;
    $('.no-data').html("");
    $(".no-data").removeClass("no-data");
}

function closeDigitalModal(e){
    let modal = $(e).attr('rel')

    $('#wizard').css("display", "none");
    $('#wizard .modal-content').css("display", "block");

    if(!$(e).parent().hasClass("active")){
        $(e).parent().addClass("active")
    }else{
        var flagFilter = false;
        var cardMonthFilter = $('#filterMonth').val();
        var cardYearFilter = $('#filterYear').val();
        var homeMonthFilter = $('#filterMonthDashboard').val();
        var homeYearFilter = $('#filterYearDashboard').val();

        if(cardMonthFilter != homeMonthFilter || cardYearFilter != homeYearFilter){
            flagFilter = true;
        }

        if(modal == 'pictureSlideModal'){
            $('.pictureSlideModal .button').fadeOut(100)
            if($("#imageTop .swiper-slide.active video").length){
                $("#imageTop .swiper-slide.active video")[0].pause();
                $("#imageTop .swiper-slide.active video")[0].currentTime = 0;
            }
            setTimeout(function(){
                $(e).parent().removeClass("active").fadeOut(100)
            }, 150)
        }else if (modal == "digitalContentModal"){
            //reset iframe dashboard
            $('#filterYear').css("display", "inline-block")
            $('#filterMonth').css("display", "inline-block")
            $('div[id^="swiper-wrapper"]').css("transform", "translate3d(0px, 0, 0)")

            //get the filter for month and year from package to set to the project
            var mthMainFilter = $("#filterMonth option:selected").val()
            var yrMainFilter = $("#filterYear option:selected").val()
            $("#filterYearDashboard option[value="+yrMainFilter+"]").prop('selected', true);
            $("#filterMonthDashboard option[value="+mthMainFilter+"]").prop('selected', true);

            new Swiper(".chartContainer", {
                direction: "horizontal",
                initialSlide: 0,
                slidesPerView: 1,
                spaceBetween: 10,
                slidesPerGroup: 1,
                grabCursor: true,
                slidesPerView: "auto",
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                    renderBullet: function (index, className) {
                      return '<span class="' + className + '">' + (index + 1) + "</span>";
                    },
                  },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
                on: {
                    slideChangeTransitionStart: function() {
                        if(ownerProject == "JKR_SARAWAK"){
                            if($('#page-1').hasClass("swiper-slide-active") || $('#page-0').hasClass("swiper-slide-active")){
                                $('#filterYear').css("display", "inline-block")
                                $('#filterMonth').css("display", "inline-block")
                            }else{
                                $('#filterYear').css("display", "none")
                                $('#filterMonth').css("display", "none")
                            }
                        }else{
                            if(userOrg == "KKR"){
                                if($('#page-0').hasClass("swiper-slide-active")){
                                    $('#filterYear').css("display", "inline-block")
                                    $('#filterMonth').css("display", "inline-block")
                                }else{
                                    $('#filterYear').css("display", "none")
                                    $('#filterMonth').css("display", "none")
                                }
                            }else{
                                if($('#page-1').hasClass("swiper-slide-active")){
                                    $('#filterYear').css("display", "inline-block")
                                    $('#filterMonth').css("display", "inline-block")
                                }else{
                                    $('#filterYear').css("display", "none")
                                    $('#filterMonth').css("display", "none")
                                }
                            }
                        }
                    }
                }
            });

            $('.digitalContentModal .button').fadeOut(100)
            $('.digitalContentModal .card').removeClass("active")
            $('.chartContainer').removeClass('active')
            removeChart()
            setTimeout(function(){
                $('.digitalContentModal .card').remove()
                $(e).parent().removeClass("active").fadeOut(100)
            }, 150)

            //reload the digital reporting Main page
            if(userOrg !== "KKR"){
                if(localStorage.project_owner == 'JKR_SABAH' && flagFilter == true){
                    $('.loader').fadeIn(100)
                    submitDashboardExecFilter()
                }
            }
        }
    }
}

function openImageModal (e){
    currentImg = $(e).data("slide")
    totalImg = $('#imageTop .swiper-slide').length

    $(`.pictureSlideModal`).addClass('active').css('display','block')
    $('.pictureSlideModal .button').fadeIn(100)

    $('#imageTop .swiper-slide').hide().removeClass("active")
    $(`#imageResize-${currentImg}`).show().addClass("active")

    if(totalImg !== 1){
        if(currentImg == 0){
            $('.swiper-button-next2').css("opacity", "1")
            $('.swiper-button-prev2').css("opacity", "0")
        }
        if(currentImg > 0 && currentImg < totalImg - 1){
            $('.swiper-button-next2').css("opacity", "1")
            $('.swiper-button-prev2').css("opacity", "1")
        }else if(currentImg == totalImg - 1){
            $('.swiper-button-next2').css("opacity", "0")
            $('.swiper-button-prev2').css("opacity", "1")
        }
    }

    setTimeout(() => {
        changeImageCss()
        pauseVideoOnchange()
    }, 100);
}

nextImageModal = () => {
    currentImg = $('#imageTop .swiper-slide.active').data("slide")
    totalImg = $('#imageTop .swiper-slide').length
    nextImg = currentImg + 1
    
    if(nextImg > 0 && nextImg < totalImg - 1){
        $(`#imageResize-${currentImg}`).removeClass("active")
        $(`#imageResize-${currentImg + 1}`).addClass("active")
        $(`#imageResize-${currentImg + 1}`).show()
        $(`#imageResize-${currentImg}`).hide()
        $('.swiper-button-next2').css("opacity", "1")
        $('.swiper-button-prev2').css("opacity", "1")
    }else if(nextImg == totalImg - 1){
        $(`#imageResize-${currentImg}`).removeClass("active")
        $(`#imageResize-${currentImg + 1}`).addClass("active")
        $(`#imageResize-${currentImg + 1}`).show()
        $(`#imageResize-${currentImg}`).hide()
        $('.swiper-button-next2').css("opacity", "0")
        $('.swiper-button-prev2').css("opacity", "1")
    }

    changeImageCss()
    pauseVideoOnchange()
}

prevImageModal = () => {
    currentImg = $('.swiper-slide.active').data("slide")
    totalImg = $('#imageTop .swiper-slide').length
    prevImg = currentImg - 1

    if(prevImg == 0){
        $(`#imageResize-${currentImg}`).removeClass("active")
        $(`#imageResize-${currentImg - 1}`).addClass("active")
        $(`#imageResize-${currentImg - 1}`).show()
        $(`#imageResize-${currentImg}`).hide()
        $('.swiper-button-prev2').css("opacity", "0")
        $('.swiper-button-next2').css("opacity", "1")
    }else if(prevImg > 0 && prevImg < totalImg - 1){
        $(`#imageResize-${currentImg}`).removeClass("active")
        $(`#imageResize-${currentImg - 1}`).addClass("active")
        $(`#imageResize-${currentImg - 1}`).show()
        $(`#imageResize-${currentImg}`).hide()
        $('.swiper-button-next2').css("opacity", "1")
        $('.swiper-button-prev2').css("opacity", "1")
    }

    changeImageCss()
    pauseVideoOnchange()
}

function closeFilterList(){
    if(!$('.filter-list').hasClass("active")){
        $('.filter-list').addClass("active")
        $('.filter-sort-btn').addClass("active")
        $('.filter-list.active').animate({bottom: '3rem'}, 150)
        $('.appsbar-exec.active').removeClass("active")
        $('.appsbar-exec').animate({left: '-25rem'}, 150)
    }else{
        $('.filter-list.active').removeClass("active")
        $('.filter-sort-btn.active').removeClass("active")
        $('.filter-list').animate({bottom: '-18rem'}, 150)
    }
    event.stopPropagation();
}

function updateCardInfo(data){
    if(data['data']){
        $("#descProgress").html((data['data'].describeField) ? data['data'].describeField : 'N/A');
        $("#problemProgress").html((data['data'].reason_delay) ? data['data'].reason_delay : 'N/A');
        $("#implicationProgress").html((data['data'].implication) ? data['data'].implication : 'N/A');
        $("#actionSorProgress").html((data['data'].act_plan_sor) ? data['data'].act_plan_sor : 'N/A');
        $("#actionpoProgress").html((data['data'].act_plan_po) ? data['data'].act_plan_po : 'N/A');
        $("#spcProgress").html((data['data'].spc_comments) ? data['data'].spc_comments : 'N/A');
        $("#qsProgress").html((data['data'].qs_charge) ? data['data'].qs_charge : 'N/A');
    }else{
        $("#descProgress").html("No Data Available").addClass("no-data")
        $("#problemProgress").html("No Data Available").addClass("no-data")
        $("#implicationProgress").html("No Data Available").addClass("no-data")
        $("#actionSorProgress").html("No Data Available").addClass("no-data")
        $("#actionpoProgress").html("No Data Available").addClass("no-data")
        $("#spcProgress").html("No Data Available").addClass("no-data")
        $("#qsProgress").html("No Data Available").addClass("no-data")
    }

    var fileTag = '';
    var fileExt ='';
    var folderDirect ='';
    if (UI_PREF == 'ri_v3') {
		folderDirect= '../';
	}else{
        folderDirect= '../../';
    }
    if(data['file']){
        $('#insert-nofile').html(`<table style="width:100%;">
                                    <thead id="fileProgressHead">
                                        <tr>
                                            <td></td>
                                            <td>Name</td>
                                            <td>Last Update</td>
                                            <td>Type</td>
                                        </tr>
                                    </thead>
                                    <tbody class = "fileProgress">
                                    </tbody>
                                </table>`)
        data['file'].forEach(file => {
            fileExt = file.name.split('.').pop()
            fileTag +=  `<tr>
                            <td><img src="${folderDirect}Images/icons/connector_page/files/${fileExt}.png" /></td>
                            <td style="width: 125px;"><a href='${file.link}' target='_blank'> ${file.name}</a></td>
                            <td>${file.date}</td>
                            <td>${fileExt} Document</td>
                        </tr>`;
        });

        $(".fileProgress").html(fileTag);
    }else{
        $('.fileProgress').parent().remove();
        $('#insert-nofile').html(`<div class="no-data">No File Attached</div>`)
    }

    var imgTag = '';
    var imgTagSlider = '';
    let i = 0;

    if(data['img']){
        data['img'].forEach(img => {
            imgTag +=   `<div style="display: flex; margin: 5px;">
                            <img src='${img}' data-slide='${i}' onclick="openImageModal(this)" style="width: auto; height: 100px; margin: auto; cursor: pointer">
                        </div>`;

            imgTagSlider += `<div class="swiper-slide" id='imageResize-${i}' data-slide='${i}' style="display: flex;">
                                <img class="imageResize" src='${img}' style='margin: auto; cursor: pointer;'>
                            </div>`;
            i++;
        });
        
    }

    if(data['video']){
        data['video'].forEach(video => {
            imgTag +=   `<div style="display: flex; margin: 5px;">
                            <video src='${video}' data-slide='${i}'  onclick="openImageModal(this)" style="width: auto; height: 100px; margin: auto; cursor: pointer" preload="metadata" constrolsList="nodownload">
                        </div>`;

            imgTagSlider += `<div class="swiper-slide" data-slide="${i}" id="imageResize-${i}" style="display: flex;">
                                <video style="margin: auto; cursor: pointer; width: inherit; height: inherit" controls>
                                    <source src='${video}' type="video/mp4">
                                    <source src='${video}' type="video/webm">
                                    <source src='${video}' type="video/ogg">
                                    <p>Your browser does not support embedded video</p>
                                </video>
                            </div>`;
            i++;
        });
    }

    $(".viewImageJoget").html(imgTag);
    $("#imageTop").html(imgTagSlider);
    $("#imageBottom").html(imgTagSlider);
}

function updateSectionCard(data, year, month){
    let sectionHTML = ''
    data.forEach((item) => {
        var sectionName = item.section;
        var sectionData = (execData.projectProg.all && execData.projectProg.all[sectionName] && execData.projectProg.all[sectionName][year] && execData.projectProg.all[sectionName][year][month]) ? execData.projectProg.all[sectionName][year][month] : [];
        var value = sectionData.data

        var desc
        var reason_delay
        var implication
        var act_plan_sor
        var act_plan_po
        var spc_comments
        var qs_charge
        var physical_schedule_section
        var physical_actual_section
        var variance

        if(value){
            desc = (value.describeField) ? value.describeField : 'N/A';
            reason_delay = (value.reason_delay) ? value.reason_delay : 'N/A';
            implication = (value.implication) ? value.implication : 'N/A';
            act_plan_sor = (value.act_plan_sor) ? value.act_plan_sor : 'N/A';
            act_plan_po = (value.act_plan_po) ? value.act_plan_po : 'N/A';
            spc_comments = (value.spc_comments) ? value.spc_comments : 'N/A';
            qs_charge = (value.qs_charge) ? value.qs_charge : 'N/A';
            physical_schedule_section = (value.physical_schedule_section) ? value.physical_schedule_section : '0';
            physical_actual_section = (value.physical_actual_section) ? value.physical_actual_section : '0';
            variance = physical_schedule_section - physical_actual_section;

        }else{
            desc = 'N/A';
            reason_delay = 'N/A';
            implication = 'N/A';
            act_plan_sor = 'N/A';
            act_plan_po = 'N/A';
            spc_comments = 'N/A';
            qs_charge = 'N/A';
            variance = 'N/A';
        }
        

        sectionHTML += `
            <div class='sectionCard' id='section-${item.section_code}'>
                <div class="cardHeader">${item.section}</div>
                <div class="cardBody">
                    <div class="cont" onClick="moreInfo(this)">
                        <div class="row title">Description</div>
                        <div class="row body">${desc}</div>
                    </div>
                    <div class="cont" onClick="moreInfo(this)">
                        <div class="row title">Problem/Reason For Delay</div>
                        <div class="row body">${reason_delay}</div>
                    </div>
                    <div class="cont" onClick="moreInfo(this)">
                        <div class="row title">Implication</div>
                        <div class="row body">${implication}</div>
                    </div>
                    <div class="cont" onClick="moreInfo(this)">
                        <div class="row title">PLAN PM</div>
                        <div class="row body">${act_plan_sor}</div>
                    </div>
                    <div class="cont" onClick="moreInfo(this)">
                        <div class="row title">Plan PO</div>
                        <div class="row body">${act_plan_po}</div>
                    </div>
                    <div class="cont" onClick="moreInfo(this)">
                        <div class="row title">SPC Comment</div>
                        <div class="row body">${spc_comments}</div>
                    </div>
                </div>
                <div class="cardFooter">
                    <div class="rowFlex">
                        <div class="title">QS Incharge</div>
                        <div class="value">${qs_charge}</div>
                    </div>
                    <div class="rowFlex">
                        <div class="title">Variance</div>
                        <div class="value">${variance}</div>
                    </div>
                </div>
            </div>
        `
    })
    $('#page-0').html("");
    $('#page-0').append(sectionHTML);

}

function createTblePrjProgress(data){
    let projectTbHTML = '';

    if(data['data']){

        $('#projectProgressTable').html(`<table><tbody id = "projectProgress"></tbody></table>`)
        $("#projectProgress").html("");

        projectTbHTML += '<tr>'
        projectTbHTML += '<td class="width">Current Month Activity</td>'
        projectTbHTML += '<td><textarea readonly style="overflow-y:hidden; resize: none; outline: none; font-family: inherit; border: none; background: transparent; font-size: inherit; width:100%; height: auto;">' + ((data['data'].describeField) ? (data['data'].describeField):'N/A') + '</textarea></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td class="width">Problem / Reason for Delay</td>'
        projectTbHTML += '<td><textarea readonly style="font-size: .6rem; overflow-y:hidden; resize: none; outline: none; font-family: inherit; border: none; background: transparent; font-size: inherit; width: 100%; height: auto;">' + ((data['data'].reason_delay) ? (data['data'].reason_delay):'N/A') + '</textarea></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td class="width">Implication to Project</td>'
        projectTbHTML += '<td style = "word-break: break-all;">' + ((data['data'].implication) ? (data['data'].implication):'N/A') + '</td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td class="width">Action Plan (SOR)</td>'
        projectTbHTML += '<td><textarea readonly style="font-size: .6rem; overflow-y:hidden; resize: none; outline: none; font-family: inherit; border: none; background: transparent; font-size: inherit; width: 100%; height: auto;">' + ((data['data'].act_plan_sor) ? (data['data'].act_plan_sor):'N/A') + '</textarea></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td class="width">Remarks</td>'
        projectTbHTML += '<td><textarea readonly style="font-size: .6rem; overflow-y:hidden; resize: none; outline: none; font-family: inherit; border: none; background: transparent; font-size: inherit; width: 100%; height: auto;">' + ((data['data'].act_plan_po) ? (data['data'].act_plan_po):'N/A') + '</textarea></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
    }else{
        $('#projectProgress').parent().remove();
        $('#projectProgressTable').html(`<div class="no-data">No Data Available</div>`)
    }

    $("#projectProgress").html(projectTbHTML);

    var fileTag = '';
    var fileExt ='';
    var folderDirect ='';
    if (UI_PREF == 'ri_v3') {
		folderDirect= '../';
	}else{
        folderDirect= '../../';
    }
    if(data['file']){
        data['file'].forEach(file => {
            fileExt = file.name.split('.').pop()
            fileTag +=  `<tr>
                            <td><img src="${folderDirect}Images/icons/connector_page/files/${fileExt}.png" /></td>
                            <td style="width: 125px;"><a href='${file.link}' target='_blank'> ${file.name}</a></td>
                            <td>${file.date}</td>
                            <td>${fileExt} Document</td>
                        </tr>`;
        });
        $('#insert-nofile').html(`<table style="width:100%;">
                                        <thead id="fileProgressHead">
                                            <tr>
                                                <td></td>
                                                <td>Name</td>
                                                <td>Last Update</td>
                                                <td>Type</td>
                                            </tr>
                                        </thead>
                                        <tbody class = "fileProgress">
                                        </tbody>
                                   </table>`)

        $(".fileProgress").html(fileTag);
    }else{
        $('.fileProgress').parent().remove();
        $('#insert-nofile').html(`<div class="no-data">No File Attached</div>`)
    }

    var imgTag = '';
    var imgTagSlider = '';
    let i = 0;

    if(data['img']){
        data['img'].forEach(img => {
            imgTag +=   `<div style="display: flex; margin: 5px;">
                            <img src='${img}' data-slide='${i}' onclick="openImageModal(this)" style="width: auto; height: 100px; margin: auto; cursor: pointer">
                        </div>`;

            imgTagSlider += `<div class="swiper-slide" id='imageResize-${i}' data-slide='${i}'  style="display: flex;">
                                <img class="imageResize" src='${img}' style='margin: auto; cursor: pointer;'>
                            </div>`;
            i++;
        });
    }

    if(data['video']){
        data['video'].forEach(video => {
            imgTag +=   `<div style="display: flex; margin: 5px;">
                            <video src='${video}' data-slide="${i}"  onclick="openImageModal(this)" style="width: auto; height: 100px; margin: auto; cursor: pointer" preload="metadata" constrolsList="nodownload">
                        </div>`;

            imgTagSlider += `<div class="swiper-slide" data-slide="${i}" id="imageResize-${i}" style="display: flex;">
                                <video style="margin: auto; cursor: pointer; width: inherit; height: inherit" controls>
                                    <source src='${video}' type="video/mp4">
                                    <source src='${video}' type="video/webm">
                                    <source src='${video}' type="video/ogg">
                                    <p>Your browser does not support embedded video</p>
                                </video>
                            </div>`;
            i++;
        });
    }

    $(".viewImageJoget").html(imgTag);
    $("#imageTop").html(imgTagSlider);
    $("#imageBottom").html(imgTagSlider);

    $("textarea").each(function () {
        this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden; resize: none; outline: none; font-family: inherit; border: none; background: transparent; font-size: inherit; width:100%;");
    })
}

function createTblePrjFeature(data){
    let projectTbHTML = '';

    if(data['data']){

        $('#projectFeatureTable').html(`<table><tbody id = "projectFeature"></tbody></table>`)
        $("#projectFeature").html("");

        projectTbHTML += '<tr>'
        projectTbHTML += '<td class="width">Total Road Length (km)</td>'
        projectTbHTML += '<td><textarea readonly style="overflow-y:hidden; resize: none; outline: none; font-family: inherit; border: none; background: transparent; font-size: inherit; width:100%; height: auto;">' + ((data['data'].ttl_road_length) ? (data['data'].ttl_road_length):'N/A') + '</textarea></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td class="width">Single Lane Length (km)</td>'
        projectTbHTML += '<td><textarea readonly style="font-size: .6rem; overflow-y:hidden; resize: none; outline: none; font-family: inherit; border: none; background: transparent; font-size: inherit; width: 100%; height: auto;">' + ((data['data'].single_lane_length) ? (data['data'].single_lane_length):'N/A') + '</textarea></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td class="width">Dual Lane Length (km)</td>'
        projectTbHTML += '<td><textarea readonly style="overflow-y:hidden; resize: none; outline: none; font-family: inherit; border: none; background: transparent; font-size: inherit; width:100%; height: auto;">' + ((data['data'].dual_lane_length) ? (data['data'].dual_lane_length):'N/A') + '</textarea></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td class="width">Three Lane Length (km)</td>'
        projectTbHTML += '<td><textarea readonly style="font-size: .6rem; overflow-y:hidden; resize: none; outline: none; font-family: inherit; border: none; background: transparent; font-size: inherit; width: 100%; height: auto;">' + ((data['data'].three_lane_length) ? (data['data'].three_lane_length):'N/A') + '</textarea></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td class="width">Bridges (No.)</td>'
        projectTbHTML += '<td><textarea readonly style="font-size: .6rem; overflow-y:hidden; resize: none; outline: none; font-family: inherit; border: none; background: transparent; font-size: inherit; width: 100%; height: auto;">' + ((data['data'].bridges_no) ? (data['data'].bridges_no):'N/A') + '</textarea></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td class="width">Total Bridges Length (m)</td>'
        projectTbHTML += '<td><textarea readonly style="font-size: .6rem; overflow-y:hidden; resize: none; outline: none; font-family: inherit; border: none; background: transparent; font-size: inherit; width: 100%; height: auto;">' + ((data['data'].ttl_bridges_length) ? (data['data'].ttl_bridges_length):'N/A') + '</textarea></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td class="width">Flyover (No.)</td>'
        projectTbHTML += '<td><textarea readonly style="font-size: .6rem; overflow-y:hidden; resize: none; outline: none; font-family: inherit; border: none; background: transparent; font-size: inherit; width: 100%; height: auto;">' + ((data['data'].flyover_no) ? (data['data'].flyover_no):'N/A') + '</textarea></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td class="width">Total Flyover Length (m)</td>'
        projectTbHTML += '<td><textarea readonly style="font-size: .6rem; overflow-y:hidden; resize: none; outline: none; font-family: inherit; border: none; background: transparent; font-size: inherit; width: 100%; height: auto;">' + ((data['data'].ttl_flyover_length) ? (data['data'].ttl_flyover_length):'N/A') + '</textarea></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td class="width">Box Culvert Location (No.)</td>'
        projectTbHTML += '<td><textarea readonly style="font-size: .6rem; overflow-y:hidden; resize: none; outline: none; font-family: inherit; border: none; background: transparent; font-size: inherit; width: 100%; height: auto;">' + ((data['data'].box_culvert_location) ? (data['data'].box_culvert_location):'N/A') + '</textarea></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
        projectTbHTML += '<td class="width">Pipe Culvert Location (No.)</td>'
        projectTbHTML += '<td><textarea readonly style="font-size: .6rem; overflow-y:hidden; resize: none; outline: none; font-family: inherit; border: none; background: transparent; font-size: inherit; width: 100%; height: auto;">' + ((data['data'].pipe_culvert_location) ? (data['data'].pipe_culvert_location):'N/A') + '</textarea></td>'
        projectTbHTML += '</tr>'
        projectTbHTML += '<tr>'
    }else{
        $('#projectFeature').parent().remove();
        $('#projectFeatureTable').html(`<div class="no-data">No Data Available</div>`)
    }

    $("#projectFeature").html(projectTbHTML);

    $("textarea").each(function () {
        this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden; resize: none; outline: none; font-family: inherit; border: none; background: transparent; font-size: inherit; width:100%;");
    })
}

function siteDiaryPieChart(data) {
    var dataArr = [];
    if (data) {
        var t = 0;
        for (const [idx, ele] of Object.entries(data)) {
            // convert hours to days, 2 decimal point. Keep here in case they want it again
            // var convertDay = parseFloat(ele / 24).toFixed(2);
            // var tempArr = { name: idx, y: (convertDay) ? parseFloat(convertDay) : 0 , color: legendColorArr[t]};
            var tempArr = { name: idx, y: (ele) ? ele : 0 , color: legendColorArr[t]};
            dataArr.push(tempArr);
            t++
        }
    }
    chart = Highcharts.chart('weatherSDL', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            events: {
                render() {
                  const chart = this;
        
                  if (document.fullscreenElement && chart.updateFlag) {
                    chart.updateFlag = false;
                    chart.update({
                      legend: {
                        symbolHeight: 17,
                        symbolWidth: 17,
                        itemStyle: {
                          fontSize: '17px',
                        }
                      }
                    })
        
                    chart.updateFlag = true;
                  } else if (chart.updateFlag) {
                    chart.updateFlag = false;
        
                    chart.update({
                      legend: {
                        symbolHeight: 13,
                        symbolWidth: 13,
                        itemStyle: {
                          fontSize: '13px',
                        }
                      }
                    })
                    chart.updateFlag = true;
                  }
                }
            }
        },
        title: {
            text: ''
        },
        legend: {
            symbolHeight: 13,
            symbolWidth: 13,
            layout: 'proximate',
            align: 'left',
            verticalAlign: 'middle',
            itemStyle: {
                fontSize: '13px'
            }
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y} hour(s)</b>'
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
                    format: '{series.name}: {point.y} hour(s)',
                    distance: '10%'
                },
                showInLegend: true,
                size:'80%'
            }
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
            data: dataArr
        }],
        credits: false
    }, function(chart) {

        if(!dataArr.length){

            $('#weatherSDL').html(`<div class="no-data">No Data Available</div>`)

            chart.destroy();
        }
    });
    chart.updateFlag = true;
}

function incidentPieChart(data) {
    var dataArr = [];
    if (data) {
        var t = 0;
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = {name: idx, y: (ele) ? parseInt(ele) : 0, color: legendColorArr[t]};
            dataArr.push(tempArr);
            t++
        }
    }

    chart = Highcharts.chart('OverallIncidentsAndAccidentsRecord', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            
        },
        title: {
            text: ''
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y}',
                    distance: '10%'
                },
                size: '90%'							
            }
        },
        credits: false,
        series: [{
            name: 'Total',
            colorByPoint: true,
            data: dataArr
        }]
    }, function(chart) {

        if(!dataArr.length){

            $('#OverallIncidentsAndAccidentsRecord').html(`<div class="no-data">No Data Available</div>`)

            chart.destroy();
        }
    });
}

function riskCategoryPieChart(data) {
    var dataArr = [];
    if (data) {
        var t = 0;
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = { name: idx, y: (ele) ? ele : 0, color: legendColorArr[t]};
            dataArr.push(tempArr);
            t++;
        }
    }

    chart = Highcharts.chart('riskCategoryCharts', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: ''
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        legend: {
            itemStyle: {
              fontSize: '10px'
            },
            layout: 'proximate',
            align: 'left',
            verticalAlign: 'middle',
          },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                showInLegend: true,
                dataLabels: {
                    enabled: true,                        
                    format: '{series.name}: {point.y}',
                    distance: '10%'
                },
                size: '90%'								
            }
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
            data: dataArr
        }],
        credits: false
    });
}

function drawLandChart(divId, data){

	var catArr = [];
	var dataArr = [];
	var districtIdxArr = [];

    if (data) {
        for (const [idx, ele] of Object.entries(data)) {
            catArr.push(idx);

			for (const [idx2, ele2] of Object.entries(ele)) {
				if(!districtIdxArr.includes(idx2)){
					districtIdxArr.push(idx2)
				}
			}
        }

		var t = 0;
		districtIdxArr.forEach(ele => {
			var tempMthYrLand = [];
			var tempMthYrStruct = [];
			catArr.forEach(ele2 => {
				tempMthYrLand.push((data[ele2] && data[ele2][ele] && data[ele2][ele].land) ? parseInt(data[ele2][ele].land) : 0);
				tempMthYrStruct.push((data[ele2] && data[ele2][ele] && data[ele2][ele].structure) ? parseInt(data[ele2][ele].structure) : 0);
			});

			dataArr.push({name: ele, data: tempMthYrLand, stack: 'Land', color: legendColorArr[t], showInLegend : false})
			dataArr.push({name: ele, data: tempMthYrStruct, stack: 'Structure', color: legendColorArr[t]})
			t++;
		});
	}

	chart = Highcharts.chart(divId, {
	title: {
		text: ''
	},
	yAxis: {
		title: {
		text: ''
		},
		allowDecimals: false,
		tickInterval: 5,
		min: 0,
		stackLabels: {
			enabled: true,
			formatter: function() {
				return  this.stack;
			}
		}
	},
	chart: {
		type: 'column',
        events: {
            render() {
              const chart = this;
    
              if (document.fullscreenElement && chart.updateFlag) {
                chart.updateFlag = false;
                chart.update({
                  legend: {
                    symbolHeight: 17,
                    symbolWidth: 17,
                    itemStyle: {
                      fontSize: '17px',
                    }
                  }
                })
    
                chart.updateFlag = true;
              } else if (chart.updateFlag) {
                chart.updateFlag = false;
    
                chart.update({
                  legend: {
                    symbolHeight: 13,
                    symbolWidth: 13,
                    itemStyle: {
                      fontSize: '13px',
                    }
                  }
                })
                chart.updateFlag = true;
              }
            }
        }
	},
	xAxis: {
		categories: catArr
	},
	legend: {
        width: 125,
        useHTML: true,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        symbolHeight: 13,
        symbolWidth: 13,
        itemStyle: {
            fontSize: '13px',
        },
        labelFormatter: function () {
            return '<div style="white-space: normal; word-break: break-word; width: 110px">'+this.name+'</div>';
        }
    },
	plotOptions: {
		column: {
			stacking: 'normal',
			pointPadding: 0.2,
			borderWidth: 0,
			allowPointSelect: true,
        	cursor: 'pointer'
		}
	},
	series: dataArr,
	credits: false,
	responsive: {
		rules: [{
		condition: {
			maxWidth: 500
		},
		chartOptions: {
			legend: {
				layout: 'horizontal',
				align: 'center',
				verticalAlign: 'bottom'
			}
		}
		}]
	}
	}, function(chart) {

        if(!dataArr.length){

            $('#offerIssuedChart').html(`<div class="no-data">No Data Available</div>`)

            chart.destroy();
        }
    });
}

function updateCard(data){
    $("#paymentLand").html((data.paymentLand) ? data.paymentLand : '0/0');
    $("#paymentStructure").html((data.paymentStructure) ? data.paymentStructure : '0/0'); 
}

function cardCertifiedPayment(data){
    var tIpcRecommendAmount = (data.totalIpcRecAmount) ? data.totalIpcRecAmount : 0;
    $("#ttlCertifiedPayment").html(formatCurrency(tIpcRecommendAmount));
}

function pubcPieChart(data){
    var dataArr = [];

    if (data) {
        var t = 0;
        for (const [idx, ele] of Object.entries(data)) {
            var tempArr = { name: idx, y: (ele) ? ele : 0, color: legendColorArr[t]};
            dataArr.push(tempArr);
            t++;
        }
    }

    chart = Highcharts.chart('pcCatChart', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            events: {
                render() {
                  const chart = this;
        
                  if (document.fullscreenElement && chart.updateFlag) {
                    chart.updateFlag = false;
                    chart.update({
                      legend: {
                        symbolHeight: 17,
                        symbolWidth: 17,
                        itemStyle: {
                          fontSize: '17px',
                        },
                        labelFormatter: function () {
                            return this.name
                        }
                      }
                    })
        
                    chart.updateFlag = true;
                  } else if (chart.updateFlag) {
                    chart.updateFlag = false;
        
                    chart.update({
                      legend: {
                        symbolHeight: 13,
                        symbolWidth: 13,
                        itemStyle: {
                          fontSize: '13px',
                        },
                        labelFormatter: function () {
                            return this.name.length > 5 ? [...this.name].splice(0, 5).join('') + '...' : this.name
                        }
                      }
                    })
                    chart.updateFlag = true;
                  }
                }
            }
        },
        title: {
            text: ''
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        legend: {
            symbolHeight: 13,
            symbolWidth: 13,
            itemStyle: {
                fontSize: '13px',
            },
            layout: 'proximate',
            align: 'left',
            verticalAlign: 'middle',
            labelFormatter: function () {
                return this.name.length > 5 ? [...this.name].splice(0, 5).join('') + '...' : this.name
            }
          },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                showInLegend: true,
                dataLabels: {
                    enabled: true,                        
                    format: '{series.name}: {point.y}',
                    distance: '10%'
                },
                size: '90%'								
            }
        },
        series: [{
            colorByPoint: true,
            name: 'Total',
            data: dataArr
        }],
        credits: false
    }, function(chart) {

        if(!dataArr.length){

            $('#pcCatChart').html(`<div class="no-data">No Data Available</div>`)

            chart.destroy();
        }
    });
    chart.updateFlag = true;
}

function refreshInformation(proj = 'overall', year = 'all', month = 'all', resize = false){
    yearPrev = year
    previousMonth = month

    var data = (execData && execData.projectProg && execData.projectProg.all && execData.projectProg.all.overall && execData.projectProg.all.overall[yearPrev] && execData.projectProg.all.overall[yearPrev][previousMonth]) ? execData.projectProg.all.overall[yearPrev][previousMonth] : [];
    var dataFeature = (execData && execData.projectFeature && execData.projectFeature.all && execData.projectFeature.all['all'] && execData.projectFeature.all['all']['all']) ? execData.projectFeature.all['all']['all'] : [];
    var weather = (execData && execData.sdWeather && execData.sdWeather[proj] && execData.sdWeather[proj][yearPrev] && execData.sdWeather[proj][yearPrev][previousMonth] && execData.sdWeather[proj][yearPrev][previousMonth].weather) ? execData.sdWeather[proj][yearPrev][previousMonth].weather : [];
    var incident = (execData && execData.incident && execData.incident[proj] && execData.incident[proj].byCat && execData.incident[proj].byCat[yearPrev] && execData.incident[proj].byCat[yearPrev][previousMonth]) ? execData.incident[proj].byCat[yearPrev][previousMonth] : [];
    var riskCat = (execData && execData.risk && execData.risk[proj] && execData.risk[proj].category && execData.risk[proj].category[yearPrev] && execData.risk[proj].category[yearPrev][previousMonth]) ? execData.risk[proj].category[yearPrev][previousMonth] : [];
    var landDataCard = (execData && execData.land[proj] && execData.land[proj].card && execData.land[proj].card[yearPrev] && execData.land[proj].card[yearPrev][previousMonth]) ? execData.land[proj].card[yearPrev][previousMonth] : [];
    var landDataChart = (execData && execData.land[proj] && execData.land[proj].chart && execData.land[proj].chart[yearPrev] && execData.land[proj].chart[yearPrev][previousMonth] && execData.land[proj].chart[yearPrev][previousMonth].paymentMade) ? execData.land[proj].chart[yearPrev][previousMonth].paymentMade : [];
    var claim = (execData && execData.claim && execData.claim[proj] && execData.claim[proj][yearPrev] && execData.claim[proj][yearPrev] && execData.claim[proj][yearPrev].calculateCard) ? execData.claim[proj][yearPrev].calculateCard : [];
    var pubc = (execData && execData.pubc && execData.pubc[proj] && execData.pubc[proj].pieChart && execData.pubc[proj].pieChart[yearPrev] && execData.pubc[proj].pieChart[yearPrev][previousMonth]) ? execData.pubc[proj].pieChart[yearPrev][previousMonth] : [];
    var dataSection = (sectionData) ? sectionData : [];

    if(ownerProject == "JKR_SABAH"){
        if(!resize){
            createTblePrjProgress(data);
            createTblePrjFeature(dataFeature);
        }
        siteDiaryPieChart(weather);
        incidentPieChart(incident);
        // riskCategoryPieChart(riskCat);
        drawLandChart("offerIssuedChart", landDataChart);
        updateCard(landDataCard);
        cardCertifiedPayment(claim)
        pubcPieChart(pubc)
        
    }
    else{
        updateCardInfo(data);
        updateSectionCard(dataSection, yearPrev, previousMonth);
    }
}

function refreshDashboard(resize = false){
    var selYear = $('#filterYear').val();
	var selMonth = $('#filterMonth').val();
    refreshInformation('overall', selYear, selMonth, resize);
}

function showSubmitButton(){
    $("#filterButton").show()
}

function fetchDataPackage(packageUuid, projectId){
    $('#filterYear').prop('selectedIndex',0);
    $('#filterMonth').prop('selectedIndex',0);
    //get the value of the filter set in Main page
    var mthMainFilter = $("#filterMonthDashboard option:selected").val()
    var yrMainFilter = $("#filterYearDashboard option:selected").val()

    var path_prefix;
    var progressSummaryPath_prefix;
    var procurementPath_prefix;

    if (UI_PREF == 'ri_v3') {
		path_prefix = "../Dashboard/General/chartData.json.php";
        progressSummaryPath_prefix = '../Dashboard/v3/projectSummary.php?noHeader=1';
        if(ownerProject == "JKR_SARAWAK"){
            procurementPath_prefix = '../Dashboard/v3/procurement.php?noHeader=1&digitalReporting=1';
        }else if (ownerProject == "OBYU"){
           progressSummaryPath_prefix = '../Dashboard/V3/OBYU/extend/dashboard_KACC/timeManagement.php?noHeader=1';
           procurementPath_prefix = '../Dashboard/V3/OBYU/extend/dashboard_KACC/timeManagement.php?noHeader=1';

        }else{
            procurementPath_prefix = '../Dashboard/v3/procurement_PBHS.php?noHeader=1';
        }
	}else{
        path_prefix = "chartData.json.php";
        progressSummaryPath_prefix = '../projectSummary.php?noHeader=1';
        if(ownerProject == "JKR_SARAWAK"){
            procurementPath_prefix = '../procurement.php?noHeader=1';
        }else if (ownerProject == "OBYU"){

        }else{
            procurementPath_prefix = '../procurement_PBHS.php?noHeader=1';
        }
    }

    execData = '';
    // load all the chart
    $.ajax({
        type: "POST",
        url: path_prefix,
        dataType: 'json',
        data: {
            page: "executiveManagement",
            packageUuid: packageUuid,
            projectId: projectId,
        },
        success: function (obj) {
            if(obj.section){
                sectionData = obj.section;
            }

            if (obj.status && obj.status == 'ok') {
                execData = obj.data;
                
                var today = new Date();
                var todayYear;
                var todayMonth;
                var previousMonth;
                var yearPrev;

                todayYear = today.getFullYear();
                todayMonth = monthHalftext[today.getMonth() + 1];
                previousMonth = monthHalftext[today.getMonth()];
                yearPrev = todayYear;
                if(todayMonth == 'Jan'){
                    yearPrev = parseInt(todayYear) - 1;
                    previousMonth = monthPrev[todayMonth];
                }

                if(localStorage.project_owner == 'JKR_SABAH'){
                    $("#filterYear option[value="+yrMainFilter+"]").prop('selected', true);
                    $("#filterMonth option[value="+mthMainFilter+"]").prop('selected', true);
                }else{
                    $("#filterYear option[value="+yearPrev+"]").prop('selected', true);
                    $("#filterMonth option[value="+previousMonth+"]").prop('selected', true);
                }


                localStorage.project_owner = execData.project_owner;
                refreshDashboard();
            }
        },
        complete: function () {
            $('#loaderHome').fadeOut()
            $('iframe#digRepIframe').attr('src', progressSummaryPath_prefix);
            $('iframe#digRepIframe').attr('data-owner', ownerProject);
            $('iframe#digRepIframe2').attr('src', procurementPath_prefix);
        },
    });
    
}

// Search Project
function homeSearchExecutive(inpt){
    var filter = inpt.value.toUpperCase();
    $('.cardProjSearch').hide();
    $('.cardProjSearch').each(function(){
        var listText = $(this).text()
        var projectPhase = $(this).data('project_phase');

        

        if(localStorage.userOrg == "HSSI"){
            if ( projectPhase === "1A" && listText.toUpperCase().indexOf(filter) > -1) {
                $(this).show();
            }
        }else if (localStorage.userOrg == "pmc_1b"){
            if ( projectPhase === "1B" && listText.toUpperCase().indexOf(filter) > -1) {
                $(this).show();
            }
        }else{
            if ( listText.toUpperCase().indexOf(filter) > -1) {
                $(this).show();
            }
        } 
    })
}

$(document).ready(function(){
    $('#switchProject').click(function () {
        window.parent.closeModal();
    });

    $(window).bind('resizeEnd', function() {
        for(let i = 0; i <= Highcharts.charts.length; i++){
            Highcharts.charts[i] && Highcharts.charts[i].reflow();
        }
        $("#projectProgress tr td textarea").each(function () {
            this.style.height = 'auto';
            this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden; word-break: break-all; resize: none; outline: none; font-family: inherit; border: none; background: transparent; font-size: inherit; width:100%;");
        })
    });

    $(window).resize(function(){
        if(this.resizeTO) clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function() {
            $(this).trigger('resizeEnd');
        }, 150);
    })

    var swiper = new Swiper(".chartContainer", {
        direction: "horizontal",
        slidesPerView: 1,
        spaceBetween: 10,
        slidesPerGroup: 1,
        grabCursor: true,
        slidesPerView: "auto",
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            renderBullet: function (index, className) {
              return '<span class="' + className + '">' + (index + 1) + "</span>";
            },
          },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        on: {
            slideChangeTransitionStart: function() {
                if(ownerProject == "JKR_SARAWAK"){
                    if($('#page-1').hasClass("swiper-slide-active") || $('#page-0').hasClass("swiper-slide-active")){
                        $('#filterYear').css("display", "inline-block")
                        $('#filterMonth').css("display", "inline-block")
                    }else{
                        $('#filterYear').css("display", "none")
                        $('#filterMonth').css("display", "none")
                    }
                }else{
                    console.log($(".swiper-slide-active"))
                    if(userOrg == "KKR"){
                        if($('#page-0').hasClass("swiper-slide-active")){
                            $('#filterYear').css("display", "inline-block")
                            $('#filterMonth').css("display", "inline-block")
                        }else{
                            $('#filterYear').css("display", "none")
                            $('#filterMonth').css("display", "none")
                        }
                    }else{
                        if($('#page-1').hasClass("swiper-slide-active")){
                            $('#filterYear').css("display", "inline-block")
                            $('#filterMonth').css("display", "inline-block")
                        }else{
                            $('#filterYear').css("display", "none")
                            $('#filterMonth').css("display", "none")
                        }
                    }
                }
            }
        }
    });

    // var swiper2 = new Swiper(".imageContainer", {
    //     direction: "horizontal",
    //     mousewheel: true,
    //     loop: true,
    //     spaceBetween: 10,
    //     keyboard: {
    //         enabled: true
    //     },
    //     pagination: {
    //         el: ".swiper-pagination2",
    //         clickable: true,
    //     },
    //     navigation: {
    //         nextEl: ".swiper-button-next2",
    //         prevEl: ".swiper-button-prev2",
    //     },
    //     on: {
    //         slideChangeTransitionStart: function() {
    //             changeImageCss()
    //         }
    //     }
    // });

    //mixitup sort and animate initiate and config
    const itemContainers = Array.from(document.querySelectorAll('.card-container.mix-wrapper'));
    const config = {
        load: {
            sort: "name:asc"
        },
        animation: {
            easing: 'ease-in-out',
            "duration": 0,
            "nudge": true,
            "effects": "fade translateZ(-40px) stagger(19ms)"
        },
        callbacks: {
            onMixBusy: function(state, originalEvent) {
                 console.log('Mixer busy');
            }
        },
        classNames: {
          elementFilter: 'filter-btn', /* control */
          elementSort: 'sort-btn' /* control */
        }
    };

    const mixers = itemContainers.map(container => mixitup(container, config));

    //function to close menu app from other place
    $(window).click(function(){
        $('.appsbar-exec.active').animate({left: '-25rem'}, 150)
        $('.appsbar-exec.active').removeClass("active")
    })

    //Open AppsBar
    $('#appsbar-menu').on("click", function (event){
        if(!$('.appsbar-exec').hasClass("active")){
            $('.appsbar-exec').addClass("active")
            $('.appsbar-exec.active').animate({left: '0'}, 150)
            $('.filter-list.active').removeClass("active")
            $('.filter-sort-btn.active').removeClass("active")
            $('.filter-list').animate({bottom: '-18rem'}, 150)
        }else{
            $('.appsbar-exec.active').removeClass("active")
            $('.appsbar-exec').animate({left: '-25rem'}, 150)
        }
        event.stopPropagation();
    })

    //Stops appsbar from closing when click
    $('.appsbar-exec').click(function(event){
        event.stopPropagation();
    });

    //toggle filter button
    $('.filterContainer .sort-btn').click(function(event){
        if($(this).hasClass("asc")){
            $(this).css("display", "none")
            $(this).next(".sort-btn:first").css("display", "inline-block")
        }else if($(this).hasClass("desc")){
            $(this).css("display", "none")
            $(this).prev(".sort-btn:first").css("display", "inline-block")
        }else if($(this).hasClass("unset")){
            $('.filterContainer .sort-btn.asc').addClass('unset')
            $('.filterContainer .sort-btn.asc').next(".sort-btn:first").css("display", "none")
            $('.filterContainer .sort-btn.asc').css("display", "inline-block")
            $('.filterContainer .sort-btn.asc').children("i").removeClass('fa-solid fa-sort-up')
            $('.filterContainer .sort-btn.asc').children("i").addClass('fa-solid fa-sort')
            $('.filterContainer .sort-btn.asc').removeClass('asc')

            $(this).removeClass("unset")
            $(this).addClass("asc")
            $(this).children("i").removeClass("fa-solid fa-sort")
            $(this).children("i").addClass("fa-solid fa-sort-up")
        }
    })

    $('.filter-expand').click(function(){
        if(!$(this).hasClass("max")){
            $(this).addClass("max")
            $(this).children().removeClass("fa-solid fa-arrows-down-to-line")
            $(this).children().addClass("fa-solid fa-arrows-up-to-line")
            $('.division').removeClass("active")
            $('.division .row-container').removeClass("active")
            $('.division .row-container').siblings().slideDown(150)
        }else{
            $(this).removeClass("max")
            $(this).children().removeClass("fa-solid fa-arrows-up-to-line")
            $(this).children().addClass("fa-solid fa-arrows-down-to-line")
            $('.division').addClass("active")
            $('.division .row-container').addClass("active")
            $('.division .row-container').siblings().slideUp(150)
        }
    })

    $('.card-container .card.package').click(function(){
        var container = $(this);
        var dataId = container.data('package_uuid');
        var packageId = container.data('package_id');
        ownerProject = container.data('project_owner');
        userOrg = container.data('user_org');
        var pName = container.data('pname');

        localStorage.p_name = pName;

        var clone = container.clone();
        clone.addClass('clone');
        var destination = container.offset();
        var cloneimg = clone.find('img')
        $(cloneimg).attr('id', `imgg${packageId}`)

        clone.css({top: destination.top, left:destination.left});
        clone.appendTo('.digitalContentModal');
        $('.digitalContentModal').fadeIn(200);
        $('#wizard').css("display", "block");
        $('#wizard .modal-content').css("display", "none");

        
        if(ownerProject == 'JKR_SABAH'){
            $('#page-0').hide()
            $('.sarawak_layout').hide()
            $('.sabah_layout').show()
        }else{
            $('#page-0').show()
            $('.sarawak_layout').show()
            $('.sabah_layout').hide()
        }
        fetchDataPackage(dataId, packageId); //to fetch from JOGET

        setTimeout (function(){
            clone.addClass('active');
            $('.digitalContentModal').addClass('active')
        }, 100)

        setTimeout(function(){
            $('.chartContainer').addClass('active')
        }, 250)
        

        $('.digitalContentModal .button').fadeIn(500);
        $('.digitalContentModal .filterContainer').fadeIn(500);
        $('#loaderHome').fadeIn()
    })

    $('.row-container').click(function(event){
        if($(event.target).is(":not(select)")){
            if($(this).hasClass("active")){
                $(this).removeClass("active")
                $(this).parent().removeClass("active")
                $(this).siblings().slideDown(150)
                if(SYSTEM == 'KKR'){
                    if(localStorage.userOrg == 'KKR' && localStorage.projOwnerSbh == "true" && localStorage.projOwnerSwk == "true"){
                        $(this).children().show()
                    }
                }
            }else{
                $(this).addClass("active")
                $(this).parent().addClass("active")
                $(this).siblings().slideUp(150)
                if(SYSTEM == 'KKR'){
                    if(localStorage.userOrg == 'KKR' && localStorage.projOwnerSbh == "true" && localStorage.projOwnerSwk == "true"){
                        $(this).children().hide()
                    }
                }
            }
        }
    })

    $('.select-projectphase').change(function(){
        var selTarget = $(this).data('projectid');
        var selValue = $(this).val();
        var selYear = $('#filterYearDashboard').val();
        var selMonth = $('#filterMonthDashboard').val();
        var cards = $('.division.'+selTarget);
        var cardsAll = cards.find('.card.package');
        var cardsTarget = cards.find('.card.package[data-project_phase="'+selValue+'"]');

        if(selValue == 'all'){
            cardsAll.css('display', 'flex');
        }else{
            cardsAll.hide();
            cardsTarget.css('display', 'flex');
        }
        if(localStorage.userOrg == "pmc_1b" || localStorage.userOrg == "HSSI"){
            $(".select-projectphase").hide()
        }

        getOverallProgress(selValue, selYear, selMonth);
    })

    $('.progressBar .filter-btn').first().addClass("active")

    if (document.addEventListener){
        document.addEventListener('fullscreenchange', exitFullScreenHandler, false);
        document.addEventListener('mozfullscreenchange', exitFullScreenHandler, false);
        document.addEventListener('MSFullscreenChange', exitFullScreenHandler, false);
        document.addEventListener('webkitfullscreenchange', exitFullScreenHandler, false);
    }

    var iframeURL = window.location.search;
    var urlParams = new URLSearchParams(iframeURL);
    var filterYear = urlParams.get('filterYear');
    var filterMonth = urlParams.get('filterMonth');

    const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const d = new Date();
    let name = month[d.getMonth() - 1];
    // if not passing parameter for filterMonth, set the filter with current month (first load)
    if (filterMonth == null || filterMonth == '') {
        $("#filterMonthDashboard > [value=" + name + "]").attr("selected", "true");
    } else {
        $("#filterMonthDashboard > [value=" + filterMonth + "]").attr("selected", "true");
    }
    $("#filterYearDashboard > [value=" + filterYear + "]").attr("selected", "true");
})

function digitalReportLogout(){
    parent.location.href = "../../Login/include/logout?signOut=1";
}

function openSetting(e){
    if($('#rangeSetting').hasClass('active')){
        $('#rangeSetting').removeClass('active').fadeOut(300)
    }else{
        $('#rangeSetting').addClass('active').fadeIn(300)
    }
}

function closeSetting (){
    $('#rangeSetting').removeClass('active').fadeOut(300)
}

function saveRange(){
    
    var red =  ($('#red1').val()??0)+","+($('#red2').val()??0);
    var yellow = ($('#yellow1').val()??0)+","+($('#yellow2').val()??0);
    var green =  ($('#green1').val()??0)+","+($('#green2').val()??0);
    var dataFunction

    if (UI_PREF == 'ri_v3') {
		dataFunction = "../BackEnd/generalFunctionV3.php";
	}else{
        dataFunction = "../../BackEnd/generalFunctionV3.php";
    }

    $.ajax({
        url: dataFunction,
        type: "POST",
        dataType: "JSON",
        data: {functionName: "saveRangeSetting",red:red, yellow:yellow, green:green},
        complete: ()=>{
            window.location.search = '?rangeSaved=true'
        }
    })

}

moreInfo = (e) =>{
    if($(e).hasClass('active')){
        $(e).removeClass('active')
        $(e).children('.row.body').removeClass('active')
        $(e).siblings().show()
        $(e).parent().siblings('.cardFooter').show()
    }else{
        $(e).addClass('active')
        $(e).children('.row.body').addClass('active')
        $(e).siblings().hide()
        $(e).parent().siblings('.cardFooter').hide()
    }
}

function submitDashboardExecFilter() {
    var selYear = $('#filterYearDashboard').val();
    var selMonth = $('#filterMonthDashboard').val();

    window.location.search = '?filterYear='+selYear+'&filterMonth='+selMonth;    
}

changeImageCss = () =>{
    let imageContainerHeight = $("#imageTop").height()
    let imageContainerWidth = $("#imageTop").width()

    let imageNaturalWidth = $("#imageTop .swiper-slide.active img").get(0).naturalWidth
    let imageNaturalHeight = $("#imageTop .swiper-slide.active img").get(0).naturalHeight

    if(imageNaturalWidth > imageNaturalHeight){
        $("#imageTop .swiper-slide.active img").css({'height':'auto', 'width':'100%'})
        let imageHeight = $("#imageTop .swiper-slide.active img").get(0).height
        if(imageHeight > imageContainerHeight){
            $("#imageTop .swiper-slide.active img").css({'height':'100%', 'width':'auto'})
        }
    }else{
        $("#imageTop .swiper-slide.active img").css({'height':'100%', 'width':'auto'})
        let imageWidth = $("#imageTop .swiper-slide.active img").get(0).width
        if(imageWidth > imageContainerWidth){
            $("#imageTop .swiper-slide.active img").css({'height':'auto', 'width':'100%'}) 
        }
    }
}

pauseVideoOnchange = () =>{
    currentImg = $('#imageTop .swiper-slide.active').data("slide")
    nextImg = currentImg + 1
    prevImg = currentImg - 1

    if($(`#imageTop .swiper-slide#imageResize-${nextImg} video`).length){
        $(`#imageTop .swiper-slide#imageResize-${nextImg} video`)[0].pause();
        $(`#imageTop .swiper-slide#imageResize-${nextImg} video`)[0].currentTime = 0;
    }
    if($(`#imageTop .swiper-slide#imageResize-${prevImg} video`).length){
        $(`#imageTop .swiper-slide#imageResize-${prevImg} video`)[0].pause();
        $(`#imageTop .swiper-slide#imageResize-${prevImg} video`)[0].currentTime = 0;
    }
}

//retrieve overall progress data by phase
$(document).ready(function(){
    $.ajax({
      type: "POST",
      url: '../Dashboard/General/overallProgress.php',
      dataType: 'json',
      data: {
          page: "overall"
      },
      success: function (obj) {
        if (obj.status && obj.status == 'ok') {
            overallData = obj.data;

            var selYear = $('#filterYearDashboard').val();
            var selMonth = $('#filterMonthDashboard').val();

            if(localStorage.userOrg == "HSSI"){
                getOverallProgress('1A', selYear, selMonth);
                
            }else if (localStorage.userOrg == "pmc_1b"){
                getOverallProgress('1B', selYear, selMonth);
                
            }else{
                getOverallProgress('all', selYear, selMonth);
            }   
            
        }
      }
  });
})

getOverallProgress = (selPhase, selYear, selMonth) => {
    var curr_physical;
    var prev_physical;
    var variance;

    if(selPhase !== 'all'){
        if(overallData.length != 0){
            if((overallData.overall && (overallData.overall['flag1A'] == true && selPhase == '1A') )|| (overallData.overall &&  (overallData.overall['flag1B'] == true && selPhase == '1B'))){
                curr_physical = '100.00';
            }else{
                curr_physical = (overallData.overall && overallData.overall[selYear] && overallData.overall[selYear][selMonth] && overallData.overall[selYear][selMonth][selPhase] && overallData.overall[selYear][selMonth][selPhase]['prev_month_physical']) ? overallData.overall[selYear][selMonth][selPhase]['curr_month_physical'] : 'N/A';
            }
    
            prev_physical = (overallData.overall && overallData.overall[selYear] && overallData.overall[selYear][selMonth] && overallData.overall[selYear][selMonth][selPhase] && overallData.overall[selYear][selMonth][selPhase]['prev_month_physical']) ? overallData.overall[selYear][selMonth][selPhase]['prev_month_physical'] : 'N/A';
            variance = (overallData.overall && overallData.overall[selYear] && overallData.overall[selYear][selMonth] && overallData.overall[selYear][selMonth][selPhase] && overallData.overall[selYear][selMonth][selPhase]['variance']) ? overallData.overall[selYear][selMonth][selPhase]['variance'] : 'N/A';
        }else{
            curr_physical = 'N/A'
            prev_physical = 'N/A'
            variance = 'N/A' 
        }
        
    }else{
        var temp_curr_physical_1A = (overallData.overall && overallData.overall[selYear] && overallData.overall[selYear][selMonth] && overallData.overall[selYear][selMonth]['1A'] && overallData.overall[selYear][selMonth]['1A']['curr_month_physical']) ? overallData.overall[selYear][selMonth]['1A']['curr_month_physical'] : 'N/A';
        var temp_prev_physical_1A = (overallData.overall && overallData.overall[selYear] && overallData.overall[selYear][selMonth] && overallData.overall[selYear][selMonth]['1A'] && overallData.overall[selYear][selMonth]['1A']['prev_month_physical']) ? overallData.overall[selYear][selMonth]['1A']['prev_month_physical'] : 'N/A';
        var temp_variance_1A = (overallData.overall && overallData.overall[selYear] && overallData.overall[selYear][selMonth] && overallData.overall[selYear][selMonth]['1A'] && overallData.overall[selYear][selMonth]['1A']['variance']) ? overallData.overall[selYear][selMonth]['1A']['variance'] : 'N/A';

        var temp_curr_physical_1B = (overallData.overall && overallData.overall[selYear] && overallData.overall[selYear][selMonth] && overallData.overall[selYear][selMonth]['1B'] && overallData.overall[selYear][selMonth]['1B']['curr_month_physical']) ? overallData.overall[selYear][selMonth]['1B']['curr_month_physical'] : 'N/A';
        var temp_prev_physical_1B = (overallData.overall && overallData.overall[selYear] && overallData.overall[selYear][selMonth] && overallData.overall[selYear][selMonth]['1B'] && overallData.overall[selYear][selMonth]['1B']['prev_month_physical']) ? overallData.overall[selYear][selMonth]['1B']['prev_month_physical'] : 'N/A';
        var temp_variance_1B = (overallData.overall && overallData.overall[selYear] && overallData.overall[selYear][selMonth] && overallData.overall[selYear][selMonth]['1B'] && overallData.overall[selYear][selMonth]['1B']['variance']) ? overallData.overall[selYear][selMonth]['1B']['variance'] : 'N/A';

        curr_physical = '1A : ' + temp_curr_physical_1A + ' <b>|</b> 1B : ' + temp_curr_physical_1B;
        prev_physical = '1A : ' + temp_prev_physical_1A + ' <b>|</b> 1B : ' + temp_prev_physical_1B;
        variance = '1A : ' + temp_variance_1A + ' <b>|</b> 1B : ' + temp_variance_1B;
    }

    $("#curr_month_physical").html(curr_physical);
    $("#prev_month_physical").html(prev_physical);
    $("#variance_physical").html(variance);
}


//DR - to control view access for PMC
function DRonLoad(){
    if(localStorage.userOrg == "HSSI"){
        console.log("DR HSSI 1")
        $(".select-projectphase").val("1A").change();
        
    }else if (localStorage.userOrg == "pmc_1b"){
        console.log("DR pmc_1b 1")
        $(".select-projectphase").val("1B").change(); 
        
    }else{
        console.log("DR none triggered")
    } 
}


$(document).ready(function(){ 
    DRonLoad()
});
