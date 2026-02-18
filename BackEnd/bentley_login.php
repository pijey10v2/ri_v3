<?php
	session_start();
      require ('../login/include/db_connect.php');
      
    $email =$_SESSION['email'];
    if(isset($_SESSION['bentley_username'])&& isset($_SESSION['bentley_password'])){
        echo("success");
        exit();
    }
   // echo($email);
	
	if(isset($email))
	{
        $sql = "SELECT bentley_username, bentley_password FROM users WHERE user_email ='$email' AND user_type!='non_active';";
            $res = sqlsrv_query($conn,$sql);
           /* $row2 = sqlsrv_has_rows($res);
            if(!$row2){
                echo("nodata");
            }else{*/
                while( $row = sqlsrv_fetch_array( $res, SQLSRV_FETCH_ASSOC) ) {
                    $_SESSION['bentley_username']= $row['bentley_username'];
                    $_SESSION['bentley_password']= base64_decode($row['bentley_password']);
                };
            
               echo($_SESSION['bentley_username']." " .$_SESSION['bentley_password']);
    }      
         
?>