onclickForgotPass = () =>{
    if(!$("#toLogin").hasClass("active")){
        $("#toLogin").addClass("active")
        $(".card-front").addClass("active")
        $(".card-back").addClass("active")
    }else{
        $("#toLogin").removeClass("active")
        $(".card-front").removeClass("active")
        $(".card-back").removeClass("active")
    }
}

$(function(){
    var urlPara = window.location.search;
	const urlParams = new URLSearchParams(urlPara);
	if(urlParams.get("err")){
		switch(urlParams.get("err")){
			case "wrongpw":
				$.alert({
					boxWidth: '30%',
						useBootstrap: false,
					title: 'Message',
					content: 'Wrong password!',
				});
				break;
			case "invalidemail":
				$.alert({
					boxWidth: '30%',
					useBootstrap: false,
					title: 'Message',
					content: 'Invalid email!',
				});
				break;
			case "success":
				break;
			default:
				$.alert({
					boxWidth: '30%',
					useBootstrap: false,
					title: 'Message',
					content: 'Please enter your credentials!',
				});
				break;
		}
	}
})


// When the form is submitted
$('#loginForm').on('submit', function(event) {
	var password = $('#password').val();

	var encryptedPassword = btoa(password);

	$('#password').val(encryptedPassword);
});