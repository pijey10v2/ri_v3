$(function (){

    ///// expand the second layer button when the first button is clicked /////
    $(".sidebar-container .sidebar-firstlayer .firstlayer-button").on('click', function(){
        let $buttonClicked = $(this).attr('id')
        let $secondlayerShow = $(this).attr('rel')

        if (!$('#' + $secondlayerShow).hasClass('active')){
            $('#' + $buttonClicked + " img").attr('src','../Images/icons/documentation/minus.png')
            $('#' + $secondlayerShow).slideDown(100)
            $('#' + $secondlayerShow).addClass('active')
            //$('#' + buttonClicked + ' a').css('color', 'red')   
        }else {
            $('#' + $buttonClicked + " img").attr('src','../Images/icons/documentation/add.png')
            $('#' + $secondlayerShow).slideUp(100)
            $('#' + $secondlayerShow).removeClass('active')
            //$('#' + buttonClicked + ' a').css('color', 'white')
        }
    })

    ///// expand the third layer button when the second button is clicked /////
    $(".sidebar-secondlayer .secondlayer-button").on('click', function(){
        let $buttonClicked = $(this).attr('id')
        let $thirdlayerShow = $(this).attr('rel')

        if (!$('#' + $thirdlayerShow).hasClass('active')){
            $('#' + $buttonClicked + " img").attr('src','../Images/icons/documentation/minus(1).png')
            $('#' + $thirdlayerShow).slideDown(100)
            $('#' + $thirdlayerShow).addClass('active')
            //$('#' + buttonClicked + ' a').css('color', 'red')
        }else{
            $('#' + $buttonClicked + " img").attr('src','../Images/icons/documentation/add(1).png')
            $('#' + $thirdlayerShow).slideUp(100)
            $('#' + $thirdlayerShow).removeClass('active')
           // $('#' + buttonClicked + ' a').css('color', 'white')
        }
    })
/////////////function to open page/////////////// 
$(".sidebar-homelayer .home-button").on('click', function(){
    let $click = $(this).attr('rel')
    $(".main-container#homepage").load($click + '.php')

})    
/////////////function to open page/////////////// 
    $(".sidebar-secondlayer .secondlayer-button").on('click', function(){
        let $click = $(this).attr('rel')
        if(!$(this).hasClass('active')){
            $(".sidebar-thirdlayer .thirdlayer-button").removeClass('active')
            $(".sidebar-secondlayer .secondlayer-button").removeClass('active')
            $(this).addClass('active')
            $(".main-container#homepage").load($click + '.php')
        }
    })
/////////////function to open page/////////////// 
    $(".sidebar-thirdlayer .thirdlayer-button").on('click', function(){
        let $click = $(this).attr('rel')
        if(!$(this).hasClass('active')){
            $(".sidebar-thirdlayer .thirdlayer-button").removeClass('active')
            $(".sidebar-secondlayer .secondlayer-button").removeClass('active')
            $(this).addClass('active')
            $(".main-container#homepage").load($click + '.php')
        }else{
        }
    })
})

////////////to print section page///////////////
function myfunctionprint() {
    var print_div = document.getElementById("main-documentation");
    var print_area = window.open();
    print_area.document.write(print_div.innerHTML);
    print_area.document.close();
    print_area.print();
    print_area.close();
    event.preventDefault()
    }



