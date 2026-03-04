history.pushState(null, null, location.href);

window.onpopstate = function () {
    history.go(1);
}

$(function(){
	$('.tab-panel ul.tabs li').on('click', function (){
		let $panel =$(this).closest('.tab-panel')
		$panel.find('ul.tabs li.active').removeClass('active')
		$(this).addClass('active')

		let panelToShow = $(this).attr('rel')

		$panel.find('.panel.active').hide(0, shownextPanel)

		function shownextPanel(){
			$(this).removeClass('active')
			$('#'+panelToShow).show(0, function(){
			$(this).addClass('active')
			})
		}
	})

	$("#re_password").change(function() {
		if($("#re_password").val() != $("#password2").val())
		alert("Passwords did not match");
	});
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

$(".btn.btn-primary").on('click', function(){
	$(".project-panel").css('display','block');
})


// When the form is submitted
$('#loginForm').on('submit', function(event) {
	var password = $('#password').val();

	var encryptedPassword = btoa(password);

	$('#password').val(encryptedPassword);
});