function exitHandler(){
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.msFullscreenElement) {
        $('#printIframeInner').css('display', 'block')
    }
} 

$(function () {
    let newentityForm = $('#newentityForm')
    let newentityClose = $('#closebutton-newentityForm')

    $(newentityClose).on('click', function () {
        $(newentityForm).fadeOut(150);
        $(".sidemenu .third-button button.active").removeClass('active');
        $("#mark").removeClass('active')
        closeAllWindow()
        jqwidgetBox("function9-1", 1);
        flagEntity = false;
        document.getElementsByTagName("body")[0].style.cursor = "default";
    });

    let editentityForm = $('#editentityForm')
    let editentityClose = $('#closebutton-editentityForm')

    $(editentityClose).on('click', function () {
        $(editentityForm).fadeOut(150);
        $(".sidemenu .third-button button.active").removeClass('active');
    });

    let modalentityForm = $('#modalentityForm')
    let modalentityClose = $('#closebutton-modalentityForm')

    $(modalentityClose).on('click', function () {
        $(modalentityForm).fadeOut(150);
        $(".sidemenu .third-button button.active").removeClass('active');
        $(".admin-function.active").removeClass("active")
    });

    let uploadForm = $('#uploadform')
    let uploadformClose = $('#closebutton-uploadkml')

    $(uploadformClose).on('click', function () {
        $(uploadForm).fadeOut(150);
        $(".sidemenu .third-button button.active").removeClass('active');
        $(".uploadtool .itemscontainer.active").removeClass('active');
        geoDataClear()
    });

    let uploadFormProgressSummary = $('#progressUploadForm')
    let uploadformCloseProgressSummary = $('.closebutton-uploadprogress')

    $(uploadformCloseProgressSummary).on('click', function () {
        $(uploadFormProgressSummary).fadeOut(150);
    });

    let managelayer = $('#managelayer')
    let managelayerClose = $('#closebutton-managelayer')

    $(managelayerClose).on('click', function () {
        $(managelayer).fadeOut(150);
        $(".sidemenu .third-button button.active").removeClass('active');
    });

    let cameraModal = $('#addcameraModal')
    let cameramodalClose = $('#closebutton-addcameraModal')

    $(cameramodalClose).on('click', function () {
        $(cameraModal).fadeOut(150);
        $(".admin-function.active").removeClass("active")
        document.getElementsByTagName("body")[0].style.cursor = "default";
    });

    let loginModal = $('#login')
    let loginmodalClose = $('#closebutton-loginform')

    $(loginmodalClose).on('click', function () {
        $(loginModal).fadeOut(150);
    });

    let floatbox = $('#floatbox')
    let floatboxclose = $('#closebutton-floatbox')

    $(floatboxclose).on('click', function () {
        $(floatbox).fadeOut(150);
        if(pickedLot && pickedLot._polygon && pickedLot._polygon.material){
            pickedLot._polygon.material = new Cesium.Color(polyLotRed, polyLotGreen, polyLotBlue, polyLotAlpha);
        }
    });

    let pwcredentialView = $('#PWCredential')
    let pwcredentialViewClose = $('#credentialCloseButton')

    $(pwcredentialViewClose).on('click', function () {
        $(pwcredentialView).fadeOut(150);
    });

    let jogetNewOrg = $('#addnewOrgForm')
    let jogetNewOrgClose = $('#neworgCloseButton')

    $(jogetNewOrgClose).on('click', function () {
        $(jogetNewOrg).fadeOut(150);
    });

    let jogetNewGroup = $('#addnewGroupForm')
    let jogetNewGroupClose = $('#newgroupCloseButton')

    $(jogetNewGroupClose).on('click', function () {
        $(jogetNewGroup).fadeOut(150);
    });
    
    let reviewToolView = $('#reviewTool')
    let reviewToolClose = $('#closebutton-reviewTool')

    $(reviewToolClose).on('click', function () {
        $(".sidemenu .third-button button.active").removeClass('active');
        $(reviewToolView).fadeOut(150);
    });

    let reviewFormView = $('#reviewForm')
    let reviewFormClose = $('#closebutton-reviewForm')

    $(reviewFormClose).on('click', function () {
        $(".sidemenu .third-button button.active").removeClass('active');
        $(reviewFormView).fadeOut(150);
    });

    let dashboardForm = $('#dashboardform')
    let dashboardFormClose = $('#dashboardCloseButton')

    $(dashboardFormClose).on('click', function () {
        $(dashboardForm).fadeOut(150);
    });

    let bulkImportConfigProcess = $('#bulkImportConfig');
    let bulkImportConfigProcessClose = $('#bulkimportCloseButton');

    $(bulkImportConfigProcessClose).on('click', function () {
        $(bulkImportConfigProcess).fadeOut(150);
    });


    $(".maximizebutton").on("click", function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active")
            $(this).children().attr("src", "Images/icons/form/expand.png")
            $(this).parent().removeClass("active")
            // $('#printIframeInner').css('display', 'block')
        } else {
            $(this).addClass("active")
            $(this).children().attr("src", "Images/icons/form/minimize.png")
            $(this).parent().addClass("active")
            // $('#printIframeInner').css('display', 'none')
        }

    })

    $("#fullscreenbutton").on("click", function () {
        // $('#printIframeInner').css('display', 'none')
        let $window = document.getElementById("fullscreenContainer")

        // if($window.addEventListener){
        //     $window.addEventListener('fullscreenchange', exitHandler);
        //     $window.addEventListener('webkitfullscreenchange', exitHandler);
        //     $window.addEventListener('MSFullscreenChange', exitHandler);
        // }

        if ($window.requestFullscreen) {
            $window.requestFullscreen();
        } else if ($window.webkitRequestFullscreen) { /* Safari */
            $window.webkitRequestFullscreen();
        } else if ($window.msRequestFullscreen) { /* IE11 */
            $window.msRequestFullscreen();
        }
    })

})

//testing if this goes through the bulk asset form branch
// another testing