<?php
	session_start();
    $email = $_SESSION['email'];	
    $password = $_SESSION['password'];	
    include_once("../BackEnd/class/jogetLink.class.php");
	$constructLinkObj = new JogetLink();
	$constructLinkObj->setToGlobalJSVariable();

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
		
	var url_string = window.location.href
	var url = new URL(url_string);
	var site = url.searchParams.get("page");
	
	var actid = url.searchParams.get("actid");
	var processname = url.searchParams.get("p");

	var constructProcessID = url.searchParams.get("processid");
	var constructActID = url.searchParams.get("actid");
	var constructAppName = url.searchParams.get("processappname");

	var iniateConopBrowser = url.searchParams.get("initConop");
	var eleConopBrowser = url.searchParams.get("data");

	var action = url.searchParams.get("action");
	var $jogetHost = JOGETHOST+'/jw';

	var username = "<?php echo $email;?>";
	var password = "<?php echo $password;?>";
	$(document).ready(function(){
		var loginCallbackAsset = {
			success : function(response){
				AssignmentManager.login($jogetHost, username, password, loginCallback);
			},
			error: function(){
				window.location.href = "include/logout?signOut=1";
            }
		}
		var loginCallback = {
			success : function(response){
				if(response.username != "roleAnonymous" && response.username == username){
					if (actid && processname) {
						window.location.href = "Loading.php?page="+site+"&actid="+actid+"&p="+processname;
					}else if (constructProcessID && constructActID && constructAppName){
						window.location.href = "Loading.php?page="+site+"&processid="+constructProcessID+"&actid="+constructActID+"&processappname="+constructAppName;
					}else if (iniateConopBrowser && eleConopBrowser){
						window.location.href = "Loading.php?page="+site+"&initConop="+iniateConopBrowser+"&data="+eleConopBrowser;
					}else if (action == 'openCorrNoti'){
						// remove page and pidName from url string and sent everthing else
						url.searchParams.delete('page'); 
						url.searchParams.delete('pidName'); 
						window.location.href = "Loading.php?page="+site+'&'+url.search.slice(1);
					}else{
						window.location.href = "Loading.php?page="+site;
					}
				}else{
					window.location.href = "include/logout?signOut=1";
				}
			},
			error: function(){
				window.location.href = "include/logout?signOut=1";
            }
		};

		// if asset host is defined then try login else skip normal login
		if(SYSTEM && SYSTEM == 'KKR'){
			var $jogetAssetHost = JOGETASSETHOST+'/jw';
			AssignmentManager.login($jogetAssetHost, username, password, loginCallbackAsset);
		}else{
			AssignmentManager.login($jogetHost, username, password, loginCallback);
		}	
		
	});
</script>

</body>



