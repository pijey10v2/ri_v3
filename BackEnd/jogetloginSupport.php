<?php
	session_start();
    $email = $_SESSION['email'];	
    $password = $_SESSION['password'];	
	$userOrg = $_SESSION['user_org'];
    include_once("../Login/app_properties.php");
	global $JOGETSUPPORTDOMAIN;
	// $constructLinkObj = new JogetLink();
	// $constructLinkObj->setToGlobalJSVariable();

	$userOrg = ($userOrg == 'Reveron') ? 'R001' : $userOrg;

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
</head>
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
		var url = 'https://reveronconsulting.com/php/login.php';
		var form = $('<form action="' + url + '" method="post">' +
		'<div style="dislay:none">'+
		'<input type="hidden" name="username" value="' + username + '" />' +
		'<input type="hidden" name="password" value="'+password+'" />' +
		'<input type="hidden" name="userorg" value="'+userOrg+'" />' +
		'<div/>'+
		'</form>');
		$('body').append(form);
		form.submit();
	}

	var username = "<?php echo $email;?>";
	var password = "<?php echo $password;?>";
	var userOrg = "<?php echo $userOrg;?>";
	console.log(userOrg);
	$(document).ready(function(){
		var loginCallback = {
			success : function(response){
				if(response.username == username){
					OnClickRedirectSupport(username,password)

				}else{
					$.alert({
						boxWidth: "30%",
						useBootstrap: false,
						title: "Message",
						content: "There is a technical issue. Please contact the support team - project.support@reveronconsulting.com",
					});
				}
			}
		};
		//sign out of joget first to signin so the joget session time is in sync with RI session timing
		async function logoutLoginSupport(){
            await AssignmentManager.logout($jogetSupportHost);
            AssignmentManager.login($jogetSupportHost, username, password, loginCallback);
        }
        logoutLoginSupport();
		// AssignmentManager.logout($jogetSupportHost);
		// AssignmentManager.login($jogetSupportHost, username, password, loginCallback);
		
	});
</script>

</body>


