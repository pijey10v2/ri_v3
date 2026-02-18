<?php
    session_start();
    require ('../login/include/db_connect.php');

    $name =$_POST['userName'];
    $pwd = $_POST['passWord'];

    $email = $_SESSION['email'];
    if(isset($email)){
        $password = base64_encode($pwd);
        $sql = "UPDATE users SET bentley_username = '$name', bentley_password ='$password' WHERE user_email = '$email'";
        $stmt = sqlsrv_query( $conn, $sql);
        if( $stmt === false) {
            $uResult['msg'] = "unable to save the username and password details.";
            $uResult['data'] = "failure";
            echo(json_encode($uResult));
            exit();
        }else{
            $_SESSION['bentley_username']= $name;
            $_SESSION['bentley_password'] = $pwd;
            $uResult['msg'] = "success";
            echo(json_encode($uResult));
            exit();
        }
    }