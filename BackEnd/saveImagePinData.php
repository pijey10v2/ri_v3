<?php
    session_start();
    require ('../login/include/db_connect.php');
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];
    $uResult = array();

    if( !isset($_POST['fileInfo']))
    {
        $uResult['msg'] = 'No variable input!'; 
        echo(json_encode($uResult));
        exit();
    }

    $data = json_decode($_POST['fileInfo']);
    $name = $data->name;
    $long = $data->longitude;
    $lat = $data->latitude;
    $height = $data->height;
    $imageName = $data->imageName;
    $headImage = $data->initialHead;
    $headChoice = $data->choice;
    if($headChoice == 1){
        $clickX = $data->clickX;
    }

    if (isset($_FILES['imageFile']) && !empty($_FILES['imageFile']['name'])) {
        $imageFName = $_FILES['imageFile']['name'];
        $file_tmp =$_FILES['imageFile']['tmp_name'];
        move_uploaded_file($file_tmp, "../../Data/Projects/".$pid."/".$imageName);
    }
    else{
        $uResult['no file'] = "Files is not attached";
    }
    
    $imageURL = "Data/Projects/".$pid."/".$imageName;
    
    if(isset($user)){
        $params = array();
        $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
        $stmt = sqlsrv_query($conn, "SELECT users.user_email, pro_usr_rel.Pro_Role FROM users left join pro_usr_rel on users.user_ID = pro_usr_rel.Usr_ID WHERE users.user_email='$user' AND pro_usr_rel.Pro_ID = $pid AND pro_usr_rel.Pro_Role IN ('Project Manager', 'Project Monitor') ",$params,$options);
        if( $stmt === false ) {
            die( print_r( sqlsrv_errors(), true));
            exit();
        }
        $row = sqlsrv_has_rows($stmt);
        if($row == false){
            $uResult['msg'] =  "No Permission.";
            echo (json_encode($uResult));
            exit();
        }

        if($headChoice == 1){
            $sql = "INSERT INTO earthPin([projectID],[imagePinName],[longitude],[latitude],[height],[imageURL],[uploadedBy],[uploadedDate],[initHeading],[initChoice],[initClick]) values('$pid','$name','$long',' $lat','$height','$imageURL','$user',GETDATE(), '$headImage', '$headChoice', '$clickX');";
            $res = sqlsrv_query( $conn, $sql );
        }
        else{
            $sql = "INSERT INTO earthPin([projectID],[imagePinName],[longitude],[latitude],[height],[imageURL],[uploadedBy],[uploadedDate],[initHeading],[initChoice]) values('$pid','$name','$long',' $lat','$height','$imageURL','$user',GETDATE(), '$headImage', '$headChoice');";
            $res = sqlsrv_query( $conn, $sql );
        }
        
        if( $res === false ) {
            $uResult['msg'] = 'SQL Error!'; 
            echo(json_encode($uResult));
            exit();
        }
        else{
            $sql = "SELECT * from earthPin WHERE projectID ='$pid' AND imagePinName = '$name' AND longitude = '$long' AND latitude = '$lat'" ;
            $res = sqlsrv_query( $conn, $sql );
            if( $res === false) {
                die( print_r( sqlsrv_errors(), true) );
                }		
            while( $row = sqlsrv_fetch_array( $res, SQLSRV_FETCH_ASSOC) ) {
                $uResult['data'] = $row;
            }

            $uResult['imageName'] = $imageFName; 
            $uResult['msg'] = 'Successfully Updated!'; 
            echo(json_encode($uResult));
            exit();
        }

       
    }
?>