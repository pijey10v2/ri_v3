<!DOCTYPE html>
<html>
<head>
	<title></title>
	<script type="text/JavaScript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js" ></script>
</head>
<body style = "visibility:hidden">

<?php

session_start();
$email = $_SESSION['pbi_userName'];		// pass from session #demo
$password = $_SESSION['pbi_userPass'];	// pass from session #demo

?>
<script type="text/javascript">

loop()
function loop() {
	console.log("Value is :")
	try{
		if(document.getElementsByName("ctx")[0].value == null) {
			console.log("empty");
			loop();
		}else{
			console.log("not empty")
			console.log(document.getElementsByName("ctx")[0].value.length)
			readLoginAttributes();
		}
	}catch(e){
		console.log("empty")
		setTimeout(loop, 100);
	}

}

function readLoginAttributes(){
	setTimeout(() => {  
		var pbi_ctx = document.getElementsByName("ctx")[0].value;
		var pbi_canary = document.getElementsByName("canary")[0].value;
		var pbi_hpgrequestid = document.getElementsByName("hpgrequestid")[0].value;
		var pbi_flowToken = document.getElementsByName("flowToken")[0].value;
		console.log("pbi_ctx")
		console.log(pbi_ctx)
		setTimeout(() => {
			function submit_post_via_hidden_form(url, params) {
				var f = $("<form target='_self' method='POST' style='display:none;'></form>").attr({
					action: url
				}).appendTo(document.body);

				for (var i in params) {
					if (params.hasOwnProperty(i)) {
						$('<input type="hidden" />').attr({
							name: i,
							value: params[i]
						}).appendTo(f);
					}
				} 

				f.submit();
				window.opener.postMessage('Message to the parent', "*");
				f.remove();		    
			}

			submit_post_via_hidden_form(
				'https://login.microsoftonline.com/common/login',
				{
					login	:	"<?php echo $email; ?>",
					loginfmt : "<?php echo $email; ?>",
					passwd		:	"<?php echo base64_decode($password); ?>",
					i13		:	"0",
					type : "",
					LoginOptions : "3",
					lrt : "",
					lrtPartition : "" ,
					hisRegion : "",
					hisScaleUnit : "",
					ps : "2",
					psRNGCDefaultType : "",
					psRNGCEntropy : "",
					psRNGCSLK : "",
					PPSX : "",
					NewUser : "1",
					FoundMSAs : "",
					fspost : "0",
					i21 : "0",
					CookieDisclosure : "0",
					IsFidoSupported : "1",
					isSignupPost : "0",
					i2 : "1",
					i17 : "",
					i18 : "",
					i19 : "",
					canary :  pbi_canary,
					ctx : pbi_ctx,
					hpgrequestid : pbi_hpgrequestid,
					flowToken : pbi_flowToken,
					DontShowAgain : "true",
									
				}
			);
		}, 100);
	}, 100);
}

</script>
<?php 

function get_web_page( $url ) {
    $res = array();
    $options = array( 
        CURLOPT_RETURNTRANSFER => true,     // return web page 
        CURLOPT_HEADER         => false,    // do not return headers 
        CURLOPT_FOLLOWLOCATION => true,     // follow redirects 
		CURLOPT_AUTOREFERER    => true,     // set referer on redirect 
		CURLOPT_SSL_VERIFYPEER => false,	// Use http
        CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect 
        CURLOPT_TIMEOUT        => 120,      // timeout on response 
		CURLOPT_MAXREDIRS      => 10,       // stop after 10 redirects 
		CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
    ); 
    $ch      = curl_init( $url ); 
    curl_setopt_array( $ch, $options ); 
    $content = curl_exec( $ch ); 
    $err     = curl_errno( $ch ); 
    $errmsg  = curl_error( $ch ); 
    $header  = curl_getinfo( $ch ); 
    curl_close( $ch ); 

    $res['content'] = $content;     
    $res['url'] = $header['url'];
    return $res; 
}  


$ctx = get_web_page("http://login.microsoftonline.com");

var_dump($ctx);

?>
	
	
</body>
</html>
