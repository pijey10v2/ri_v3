<?php
    session_start();
    require '../Login/include/db_connect.php';
    $user = $_SESSION['email'];
    $pid = $_SESSION['project_id'];

        
    $locationid = $_POST['lID'];
    $status = $_POST['status'];
    $id = $_POST['instanceId'];
    $path = $_POST['filePath'];
    $fileMethod = $_POST['fileMethod'];
    
   
    $myresult = [];

    if(isset($user))
    {
        $params = array();
        $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
        $stmt = sqlsrv_query($conn, "SELECT users.user_email, pro_usr_rel.Pro_Role FROM users left join pro_usr_rel on users.user_ID = pro_usr_rel.Usr_ID WHERE users.user_email='$user' AND pro_usr_rel.Pro_Role IN ('Project Manager' , 'Project Monitor') AND pro_usr_rel.Pro_ID = '$pid'",$params,$options);
        if( $stmt === false ) {
            die( print_r( sqlsrv_errors(), true));
            $myresult['msg'] = "Unable to update the status and path to database.";
            $myresult['data'] = false;
            echo (json_encode($myresult));
            exit();
        }

        $row = sqlsrv_has_rows($stmt);
        if($row == false)
        {
            $myresult['msg'] = "No Permission.";
            $myresult['data'] = false;
           	echo (json_encode($myresult));
        	exit();
        }
        //echo($path);
        $msg ="";
        if ($fileMethod=='sp'){
            $sql = "UPDATE locations SET  status ='$status', sharepointPath = '$path', folderID = '$id' WHERE locationID = '$locationid'";
        }else{
            $sql = "UPDATE locations SET  status ='$status', projectwisePath = '$path', folderID = '$id' WHERE locationID = '$locationid'";
        }
        
        $inresult = sqlsrv_query($conn,$sql);
        if($inresult === false){
            $myresult['msg'] = "Unable to update the status and path to database.";
            $myresult['data'] = false;
            echo (json_encode($myresult));
         exit();
           
        }else{
            $myresult['msg'] = "Updated the status and path to database.";
            $myresult['data'] = true;
            echo (json_encode($myresult));
             exit();
           
        }
        /*
        if($id){
           
            $sql = "SELECT url, userNamePassword from configPwPBi WHERE projectID = '$pid' AND type ='PW'";
            $inresult = sqlsrv_query($conn,$sql);
            if($inresult === false){
                if($msg){
                    $msg = $msg ." ;" . "Unable to get the ProjectWise Config Details to fetch the files";
                }else {
                    $msg ="Unable to get the ProjectWise Config Details to fetch the files";
                };
                $myresult['msg'] =$msg;
                echo(json_encode($myresult));
                exit;
            };
            $url="";
            $base64 ="";
            while( $row = sqlsrv_fetch_array( $inresult, SQLSRV_FETCH_ASSOC) ) {
               $url = $row['url'];
               $base64 = $row['userNamePassword'];
            }
         
            $auth = 'Authorization: Basic '.$base64;
            #echo $auth;
            $my_header = [];
            $my_header[0] =$auth;
            $my_header[1] ='Mas-App-Guid: 9eb0d286-a1a2-4945-ad8f-0a54087ec080';
            $my_header[2] = 'Mas-Uuid: fd9831d0-ff01-4e32-9bca-bcccf7b399d6';
            
            $my_url = $url.'Navigation/NavNode/'.$id.'/NavNode';//Bangsar SC
            $resp = get_data($my_url, $my_header);	
            if($resp){
			    $m = count($resp['instances']);
			    $data =[];
			    for($i=0; $i<$m; $i++){
                    $children = $resp['instances'][$i]['properties']['HasChildren'];
                    if($children){ //Floor1
                        $folderName =  $resp['instances'][$i]['properties']['Label'];
					    $instanceId = $resp['instances'][$i]['instanceId'];
					    $my_url = $url.'Navigation/NavNode/'.$instanceId.'/NavNode';
						$fileresp = get_data($my_url, $my_header);	
					    if(isset($resp)){
						   	$n = count($fileresp['instances']);
					        if($n){
                                for($j=0; $j<$n; $j++){
                                    $children1 = $fileresp['instances'][$j]['properties']['HasChildren'];
                                    if($children1){
                                        $folderName1 =  $fileresp['instances'][$j]['properties']['Label'];
					                    $instanceId1 = $fileresp['instances'][$j]['instanceId'];
					                    $my_url = $url.'Navigation/NavNode/'.$instanceId1.'/NavNode';
						                $fileresp1 = get_data($my_url, $my_header);

                                    }else{
                                        $fileinstanceId = $fileresp['instances'][$j]['properties']['Key_InstanceId'];
                                        $fileName =  $fileresp['instances'][$j]['properties']['FileName'];
                                        $sql = "INSERT into fileData ([locationID],[folderName],[fileName],[projectwiseFileID]) values ('$locationid','$folderName','$fileName','$fileinstanceId')";
                                        $inresult = sqlsrv_query($conn,$sql);
                                        if($inresult === false){
                                            array_push($data, $fileName);
                                        };	
                                    }
                                   
                                            //$file_url = 'https://wsg.reveronconsulting.com/ws/v2.5/Repositories/Bentley.PW--Reveron-VM.REVERONCONSULTING.COM~3ACELCOM_CAFM/PW_WSG/Document/'.$fileinstanceId.'/$file';
                                            //$files[$j]['fileName'] = $fileresp['instances'][$j]['properties']['FileName'];
                                           
                                            //$files[$j]['Url'] = $file_url;
                                           // echo($fileName);
                                           
                                        };
                                    }else{
                                        $sql = "INSERT into  fileData ([locationID],[folderName]) values ('$locationid','$folderName')";
                                        $inresult = sqlsrv_query($conn,$sql);
                                        if($inresult === false){
                                            array_push($data, $folderName);
                                        };	
                                    }
							    };
                               
                               
                            }else {
                                $sql = "INSERT into  fileData ([locationID],[folderName]) values ('$locationid','$folderName')";
                                $inresult = sqlsrv_query($conn,$sql);
					            if($inresult === false){
                                    array_push($data, $folderName);
                                };	
                                       
                            }
						
                        };
                        
				    }
                 };
                 $sql = "SELECT * FROM fileData WHERE locationID = '$locationid'";
                 $inresult = sqlsrv_query($conn,$sql);
                 $arr = [];
                 $i=0;
                 while( $row = sqlsrv_fetch_array( $inresult, SQLSRV_FETCH_ASSOC) ) {
                    $arr[$i] = $row;
                    $i++;
                 }
                // $return_value['data'] = $arr;
               //  $return_json = json_encode($return_value);
                $myresult['msg'] = "Successfully retrieved the files'";
                $myresult['data'] = $arr;
                echo(json_encode($myresult));
                
	        }else{
                $myresult['msg']= "Unable to fetch the files.";
                echo (json_encode($myresult));
				
            };		
        }*/
    }
        
 ?> 