<?php
	session_start();
    $email = $_SESSION['email'];	
    $password = $_SESSION['password'];	
	$userOrg = $_SESSION['user_org'];
    include_once("../Login/app_properties.php");
	global $JOGETSUPPORTDOMAIN, $RIHOST;
	// $constructLinkObj = new JogetLink();
	// $constructLinkObj->setToGlobalJSVariable();

	$userOrg = ($userOrg == 'Reveron') ? 'R001' : $userOrg;
	
	if(_str_contains($RIHOST, 'kkr') || _str_contains($RIHOST, 'bim')){
		$owner = 'KKR';
	}else if(_str_contains($RIHOST, 'maltimur') || _str_contains($RIHOST, 'sslr2')){
		$owner = 'MALTIMUR';
	}else if(_str_contains($RIHOST, 'e-dims') || _str_contains($RIHOST, 'ri_v3')){
		$owner = 'OBYU';
	}

	function _str_contains($haystack, $needle) {
		return stripos($haystack, $needle) !== false;
	}

?>

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=yes">
    <link rel="stylesheet" href="../CSS/loader.css">
	<script src="../JS/JsLibrary/jquery-3.5.1.js"></script>
    <script src="../JS/JsLibrary/jogetUtil.js" ></script>
	<!-- jQuery Confirm CSS -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.4/jquery-confirm.min.css" />

	<!-- jQuery Confirm JS -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.4/jquery-confirm.min.js"></script>
</head>
<style>
	.my-custom-button {
		background-color: #4CAF50; /* Green */
		color: white;
		font-weight: bold;
		padding: 10px 20px;
		border-radius: 8px;
		border: none;
		box-shadow: 0 4px 6px rgba(0,0,0,0.1);
		transition: background-color 0.3s ease;
	}

	.my-custom-button:hover {
		background-color: #45a049;
	}
</style>
<body>
<div class="centerContent">
	<div class="boxes">
		<div class="box">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
		<div class="box">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
		<div class="box">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
		<div class="box">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	</div>
		
		<h2 class="">Now Loading...</h2>
	</div>
	
	<script>
		
	
	//var $jogetSupportHost = 'https://jogetk.reveronconsulting.com/jw';
    //global $JOGETSUPPORTDOMAIN;
	var $jogetSupportHost = "<?php global $JOGETSUPPORTDOMAIN; echo $JOGETSUPPORTDOMAIN; ?>" +"jw";
	
	function OnClickRedirectSupport(username, password) {
		var url = 'https://ri.digile.com/support/php/login.php';
		var form = $('<form action="' + url + '" method="post">' +
		'<div style="dislay:none">'+
		'<input type="hidden" name="username" value="' + username + '" />' +
		'<input type="hidden" name="password" value="'+password+'" />' +
		'<input type="hidden" name="userorg" value="'+userOrg+'" />' +
		'<input type="hidden" name="owner" value="'+owner+'" />' +
		'<div/>'+
		'</form>');
		$('body').append(form);
		form.submit();
	}

	var username = "<?php echo $email;?>";
	var password = "<?php echo $password;?>";
	var userOrg = "<?php echo $userOrg;?>";
	var owner = "<?php echo $owner; ?>";
	console.log(userOrg);
	$(document).ready(function () {
            var loginCallback = {
                success: function (response) {
                    if (response.username === username) {
                        OnClickRedirectSupport(username, password);
                    } else {
                        $.confirm({
							boxWidth: "400px",
							useBootstrap: false,
							title: '<span style="color: black; font-size: 16px">Invalid Password!</span>',
							content: '' +
								'<form action="" class="formName" style="margin-top:15px;">' +
								'<div class="form-group" style="margin-bottom:15px;">' +
								'<label style="font-size: 13px; color: #333;">Your account exists, but the password is invalid.</label>' +
								'<p style="font-size:13px;color:#666;margin:5px 0 10px;">Please enter the correct password you registered in the other system.If not related, please contact support team.</p>' +
								'<input type="password" placeholder="Enter new password" class="password form-control" required style="padding: 10px; width: 100%; border: 1px solid #ccc; border-radius: 6px;" />' +
								'</div>' +
								'</form>',
							buttons: {
								formSubmit: {
									text: 'Sign In',
									btnClass: 'my-custom-button',
									action: function () {
										var newPassword = this.$content.find('.password').val();
										if (!newPassword) {
											$.alert('Please enter your password.');
											return false;
										}

										// Retry login
										AssignmentManager.login($jogetSupportHost, username, newPassword, {
											success: function (retryResponse) {
												if (retryResponse.username === username) {
													OnClickRedirectSupport(username, newPassword);
												} else {
													$.alert({
														title: 'Retry Failed',
														content: 'Login failed again. Please check your password and try again.',
														boxWidth: "350px",
														useBootstrap: false
													});
												}
											},
											error: function () {
												$.alert({
													title: 'Error',
													content: 'Unable to reach the login service. Please try again later.',
													boxWidth: "350px",
													useBootstrap: false
												});
											}
										});
									}
								},
								cancel: {
									text: 'Cancel',
									btnClass: 'btn-default',
									action: function () {
										window.close();
									}
								}
							},
							onContentReady: function () {
								var jc = this;
								this.$content.find('form').on('submit', function (e) {
									e.preventDefault();
									jc.$$formSubmit.trigger('click');
								});
							}
						});

                    }
                }
            };

            async function logoutLoginSupport() {

				try {
					const response = await fetch("checkSupportUser.php", {
						method: "POST",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						},
						body: new URLSearchParams({ username })
					});

					const result = await response.json();

					if (result.total === 1) {
						console.log("user exist")
						AssignmentManager.login($jogetSupportHost, username, password, loginCallback);
					}else{
						alert("Your account does not exist in our system support. Please contact support team to register.");
						window.close();
						// window.location.href = "../Login/homePage"; 
						return;
					}

					await AssignmentManager.logout($jogetSupportHost);

				} catch (err) {
					console.error("Error checking user:", err);
				}
            }

            logoutLoginSupport();
        });
</script>

</body>


