<?php
    session_start();
    if(isset($_POST['forgotpw'])){
      require 'db_connect.php';
      include 'mail.php';
      $email = $_POST['email'];
      $sql = "SELECT * FROM users WHERE user_email='$email'";
      $result = sqlsrv_query($conn,$sql);
      $resultCheck = sqlsrv_has_rows($result);
      $data = sqlsrv_fetch_array($result);
      if($resultCheck==false){
        header('Location: ../forgotpw?err=noemail');
        exit();
      }
      else{
        $rand_pw="123456789qwertyuiopasdfghjklzxcvbnm";
        $rand_pw=str_shuffle($rand_pw);
        $rand_pw=substr($rand_pw,0,8);
        $sql = "UPDATE users SET token='$rand_pw' WHERE user_email='$email'";
        $result = sqlsrv_query($conn,$sql);
        if($result ==true)
        {
          // $_SESSION['firstname'] = $data['user_firstname'];
          // $_SESSION['email'] = $data['user_email'];
          echo "<script> alert('Please check your email!')</script>";
          send_token($data['user_firstname'],$rand_pw,$email);
          header('Location: ../resetPassword?email='.$data['user_email']);
        }
      }
      }else{
        header('Location: ../forgotpw?err=nothingdone');
    }
?>
