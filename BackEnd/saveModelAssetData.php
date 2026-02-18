<?php
    session_start();
    require ('../login/include/db_connect.php');
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    header('Access-Control-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];
    if(isset($_POST['model'])){
        $model = json_decode($_POST['model'],true);
        $x = $model['x'];
        $y = $model['y'];
        $z =$model['z'];
        if($model['shape']=='radiobox'){
            $shape = 0;
        }else{
            $shape = 1;
        }
        $width = $model['width'];
        $length = $model['length'];
        $height = $model['height'];
        $head = $model['head'];
        $picth = $model['pitch'];
        $roll = $model['roll'];
    };
        $modeldetails = json_decode($_POST['modeldetails'],true);
        $layer_id =$modeldetails['layer_id'];
        $bldOwner =$modeldetails['bldOwner'];
        $bldType = $modeldetails['bldType'];
        $assetID = $modeldetails['assetID'];
        $assetName = $modeldetails['assetName'];
        $assetSLA = $modeldetails['assetSLA'];
   if(isset($modeldetails['entityid'])){
       $entityID = $modeldetails['entityid'];
   }
    if(isset($user)){
        $params = array();
        $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
        $stmt = sqlsrv_query($conn, "SELECT users.user_email, pro_usr_rel.Pro_Role FROM users left join pro_usr_rel on users.user_ID = pro_usr_rel.Usr_ID WHERE users.user_email='$user' AND pro_usr_rel.Pro_ID = $pid AND pro_usr_rel.Pro_Role IN ( 'Project Manager', 'Project Monitor') ",$params,$options);
        if( $stmt === false ) {
            die( print_r( sqlsrv_errors(), true));
            exit();
        }
        $row = sqlsrv_has_rows($stmt);
        if($row == false){
            $myresult= array(
            	'msg' => "No Permission."
        	);
            echo (json_encode($myresult));
            exit();
        }
        if(isset($model)){
            $sql = "INSERT INTO Asset_data ([project_id],[layer_id],[AssetID],[AssetName],[X],[Y],[Z],[Shape],[Width],[Length],[Height],[AssetSLA],[BuildingOwner],[BuildingType],[Head],[Pitch],[Roll]) values ('$pid','$layer_id','$assetID','$assetName','$x', '$y','$z','$shape','$width','$length','$height','$assetSLA','$bldOwner','$bldType','$head','$picth','$roll')";

                $res = sqlsrv_query( $conn, $sql );
                if( $res === false ) {
                    if( ($errors = sqlsrv_errors() ) != null) {
                        foreach( $errors as $error ) {
                            echo "SQLSTATE: ".$error[ 'SQLSTATE']."<br />";
                            echo "code: ".$error[ 'code']."<br />";
                            echo "message: ".$error[ 'message']."<br />";
                        }
                    }
                }
                else{
                    $sql = "SELECT * FROM Asset_data WHERE project_id ='$pid' AND layer_id = '$layer_id' AND AssetID = '$assetID' ";
                    $res = sqlsrv_query( $conn, $sql );
                    $res_row = sqlsrv_has_rows($res);
                    $data =[];
				
				    if($res_row==true){
					    while ($row = sqlsrv_fetch_Array($res, SQLSRV_FETCH_ASSOC)) 
					    {	
					    	$data = $row;
					
                        };
                    };
                    
                  $result = [];
                  $result['msg'] = 'Successfully Added.';
                  $result['data'] = $data;
                  echo(json_encode($result));
                }
              

        } else{
            $sql = "UPDATE Asset_data SET layer_id= '$layer_id', AssetID= '$assetID', AssetName= '$assetName', AssetSLA = '$assetSLA', BuildingOwner ='$bldOwner', BuildingType='$bldType' WHERE project_id = $pid AND EntityID = $entityID";

            $res = sqlsrv_query( $conn, $sql );
            if( $res === false ) {
                if( ($errors = sqlsrv_errors() ) != null) {
                    foreach( $errors as $error ) {
                        echo "SQLSTATE: ".$error[ 'SQLSTATE']."<br />";
                        echo "code: ".$error[ 'code']."<br />";
                        echo "message: ".$error[ 'message']."<br />";
                    }
                }
            }
            else{
              $result = array(
                'msg'=>'Successfully Updated.'
              );
              echo(json_encode($result));
            }
          
        }
       
    }
?>