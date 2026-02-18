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
    $id = $data->id;
    $name = $data->name;
    $long = $data->longitude;
    $lat = $data->latitude;
    $height = $data->height;
    $imageName = $data->imageName;
    $headImage =$data->initialHead;
    $headChoice =$data->choice;
    $flagUpdateImage = true;
    $clickX = $data->clickX;

    if (isset($_FILES['imageFile']) && !empty($_FILES['imageFile']['name'])) {
        $imageFName = $_FILES['imageFile']['name'];
        $file_tmp =$_FILES['imageFile']['tmp_name'];
        move_uploaded_file($file_tmp, "../../Data/Projects/".$pid."/".$imageName);
        $imageURL = "Data/Projects/".$pid."/".$imageName;
    }
    else{
        $flagUpdateImage = false;
        $imageURL = $imageName;
    }

    if(isset($user)){
        $params = array();
        $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
        $stmt = sqlsrv_query($conn, "SELECT users.user_email, pro_usr_rel.Pro_Role FROM users left join pro_usr_rel on users.user_ID = pro_usr_rel.Usr_ID WHERE users.user_email='$user' AND pro_usr_rel.Pro_ID = $pid AND pro_usr_rel.Pro_Role IN ('Project Manager', 'Project Manager') ",$params,$options);
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

        if ($flagUpdateImage){
            $sql = "UPDATE earthPin SET imagePinName ='$name', height = '$height',imageURL = '$imageURL', uploadedBy = '$user', uploadedDate = GETDATE(), initHeading = '$headImage', initChoice = '$headChoice', initClick = '$clickX' WHERE projectID ='$pid' AND imagePinID = '$id';";
        }
        else{
            $sql = "UPDATE earthPin SET imagePinName ='$name', height = '$height', uploadedBy = '$user', uploadedDate = GETDATE(), initHeading = '$headImage', initChoice = '$headChoice', initClick = '$clickX' WHERE projectID ='$pid' AND imagePinID = '$id';";
        }
    
        
        $res = sqlsrv_query( $conn, $sql );
        if( $res === false ) {
            $uResult['error'] = 'SQL Error!'; 
            echo(json_encode($uResult));
            exit();
        }
        else{
            $uResult['msg'] = 'Successfully Updated!'; 
            $uResult['imagePath'] = $imageURL;
            $uResult['clickX'] = $clickX;
            echo(json_encode($uResult));
            exit();
        }
    }
?>