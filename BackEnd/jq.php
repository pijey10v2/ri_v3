<?php 
session_start();
require ('../login/include/db_connect.php');
$email =$_SESSION['email'];
if(isset($_SESSION['bentley_username'])&& isset($_SESSION['bentley_password'])){
	echo($email);
}else{
	if(isset($email))
	{
        $sql = "SELECT bentley_username, bentley_password FROM users WHERE user_email ='$email' AND user_type!='non_active';";
            $res = sqlsrv_query($conn,$sql);
               while( $row = sqlsrv_fetch_array( $res, SQLSRV_FETCH_ASSOC) ) {
                    $_SESSION['bentley_username']= $row['bentley_username'];
                    $_SESSION['bentley_password']= base64_decode($row['bentley_password']);
                };
            
			   echo($_SESSION['bentley_username']." " .$_SESSION['bentley_password']);
			   
    }      
}

?>


<!DOCTYPE html>
<html>
<head>
	<title></title>
	<script type="text/JavaScript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js" ></script>
</head>
<body>
	
	<script type="text/javascript">
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

		    f.remove();		    
		}

		//#demo
		submit_post_via_hidden_form(
		    'https://ims.bentley.com/IMS/Account/Login',
		    {
		        EmailAddress	:	"<?php echo $_SESSION['bentley_username'] ;?>", 
				Password		:	"<?php echo $_SESSION['bentley_password']; ?>",
				ShowIconMessage :	"",
				MessageType		: 	"",
				disableEmail	:	"0",
				ReturnUrl		:	"/"
			}
		);
	</script>
	
</body>
</html>