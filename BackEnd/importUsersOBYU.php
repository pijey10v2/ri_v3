<?php
    require ('../login/include/db_connect.php');
    require('jogetOBYU.php'); //session start is in joget.php
  
    global $JOGETLINKOBJ;
    $JOGETLINKOBJ = new JogetLink();
    $jogetHostIP = $JOGETLINKOBJ->jogetHost;
    $jogetSupportHostIP = $JOGETLINKOBJ->jogetSupportHost;
	$admin = $_SESSION['email'];
    $userlist = json_decode($_POST['users']);
    $response = array();

	if(isset($_SESSION['email'])){
        $params = array();
        $options =  array( "Scrollable" => SQLSRV_CURSOR_KEYSET );
        $stmt = sqlsrv_query($conn, "SELECT * FROM users WHERE user_email='$admin' AND user_type='system_admin'",$params,$options);
        if( $stmt === false ) {
             die( print_r( sqlsrv_errors(), true));
             exit();
        }
		
        $row = sqlsrv_has_rows($stmt);
        if($row == false){
			$response['msg'] = "No Permission to add the User.";
            echo (json_encode($response));
			exit();
        }
        $data = [];
        $length = count($userlist);
        $orgTypeArray = array('owner','contractor','consultant');
        $userTypeArray = array('user','system_admin');
        for($i=1; $i<$length; $i++){
            
            // Skip empty rows
            if(!isset($userlist[$i]) || trim($userlist[$i]) == ""){
                continue;
            }

            $userdetails = str_getcsv($userlist[$i]);

            if(count($userdetails) != 11){
                array_push($data, (object)[
                    'raw_row' => $userlist[$i],
                    'column_count' => count($userdetails),
                    'reason' => "Column count mismatch"
                ]);
                continue;
            }

            // Check if complete 10 columns exist
            if(count($userdetails) < 11){
                array_push($data, (object)[
                    'email' => isset($userdetails[2]) ? $userdetails[2] : 'N/A',
                    'reason' => "Incomplete row. All 10 columns are required."
                ]);
                continue;
            }

            // Trim all values
            $fname      = trim($userdetails[0]);
            $lname      = trim($userdetails[1]);
            $email      = trim($userdetails[2]);
            $orgid      = trim($userdetails[3]);
            $orgname    = trim($userdetails[4]);
            $orgdesc    = trim($userdetails[5]);
            $orgtype    = trim($userdetails[6]);
            $country    = trim($userdetails[7]);
            $usertype   = trim($userdetails[8]);
            $phone      = trim($userdetails[9]);
            $supportRaw = trim($userdetails[10]);

            // Required Field Validation
            $requiredFields = [
                'First Name' => $fname,
                'Last Name' => $lname,
                'Email' => $email,
                'Organization ID' => $orgid,
                'Organization Name' => $orgname,
                'Organization Description' => $orgdesc,
                'Organization Type' => $orgtype,
                'Country' => $country,
                'User Type' => $usertype,
                'Phone Number' => $phone
            ];

            $missingFields = [];

            foreach ($requiredFields as $fieldName => $value) {
                if ($value === "" || is_null($value)) {
                    $missingFields[] = $fieldName;
                }
            }

            if (!empty($missingFields)) {
                array_push($data, (object)[
                    'email' => $email ?: 'N/A',
                    'reason' => "Missing required field(s): " . implode(", ", $missingFields)
                ]);
                continue;
            }

            // Validate Email Format
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                array_push($data, (object)[
                    'email' => $email,
                    'reason' => "Invalid email format"
                ]);
                continue;
            }

            // Validate Phone Number (digits only)
            if (!preg_match('/^[0-9]+$/', $phone)) {
                array_push($data, (object)[
                    'email' => $email,
                    'reason' => "Phone Number must contain digits only."
                ]);
                continue;
            }

            // Validate Organization Type
            $orgtype = strtolower($orgtype);
            $orgTypeArray = array('owner','contractor','consultant');

            if(!in_array($orgtype, $orgTypeArray, true)){
                array_push($data, (object)[
                    'email' => $email,
                    'reason' => "Invalid orgtype. It must be owner, contractor or consultant.",
                    'orgtype' => $orgtype
                ]);
                continue;
            }

            // Validate User Type
            $usertype = strtolower($usertype);
            $userTypeArray = array('user','system_admin');

            if(!in_array($usertype, $userTypeArray, true)){
                array_push($data, (object)[
                    'email' => $email,
                    'reason' => "Invalid user type. Must be either user or system_admin."
                ]);
                continue;
            }

            // Support User Default Handling
            if ($supportRaw === "" || is_null($supportRaw)) {
                $supportuserValue = 0; // default
                $supportuser = false;
            } else {
                if ($supportRaw == "1") {
                    $supportuserValue = 1;
                    $supportuser = true;
                } elseif ($supportRaw == "0") {
                    $supportuserValue = 0;
                    $supportuser = false;
                } else {
                    array_push($data, (object)[
                        'email' => $email,
                        'reason' => "Support User must be 1 (true) or 0 (false) only."
                    ]);
                    continue;
                }
            }

            $password = "Reveron21+";

            $sql = "SELECT * FROM users WHERE user_email='$email'";
            $result = sqlsrv_query($conn,$sql);
            $res_row = sqlsrv_has_rows($result);
            if($res_row==true){
                array_push($data, array(
                    'email' => $email,
                    'reason' =>"email already exists"
                ));
            } else{
                //check for special characters in name
                if ((!preg_match("/^[ a-zA-z'.]*$/", $fname)) || (!preg_match("/^[ a-zA-z'.]*$/", $lname))) {
                    array_push($data, array(
                        'email' => $email,
                        'reason' =>"Invalid Name. Only alphabets, space and  \"'\" are allowed. No other special characters are allowed"
                    ));
                }

                // check if text has special character ' in it. if so need to add one more to get saved in database
                $pos = strpos($fname, "'", 0);
                if ($pos) {
                    $str_to_insert = "'";
                    $name = substr($fname, 0, $pos) . $str_to_insert . substr($fname, $pos);
                    $fname = $name;
                }
                $pos = strpos($lname, "'", 0);
                if ($pos) {
                    $str_to_insert = "'";
                    $name = substr($lname, 0, $pos) . $str_to_insert . substr($lname, $pos);
                    $lname = $name;
                }

                // need to add the user and org if new to joget here first.. if user and org added then add to database
                if(!empty($orgtype)){
                    $resp = jogetUserRegistration($fname, $lname, $email, $password, $orgid, $orgname, $orgdesc);
                    if($supportuser == true && $jogetSupportHostIP != $jogetHostIP){
                        $resp1 = jogetUserRegistration($fname, $lname, $email, $password, $orgid, $orgname, $orgdesc);
                        $response['support'] = $resp1;
                    }
                }else{
                    $resp = jogetUserRegistration($fname, $lname, $email, $password, $orgid, $orgname);
                    if($supportuser == true && $jogetSupportHostIP != $jogetHostIP){
                        $resp1 = jogetUserRegistration($fname, $lname, $email, $password, $orgid, $orgname);
                        $response['support'] = $resp1;
                    }
                }

                $myresp = json_decode($resp);

                if($myresp == ""){ //user was not created in joget. so exit
                    $response['msg'] = "Unable to add the user/users to the joget system. Please check the joget connection.";
                    echo (json_encode($response));
                    exit();
                }else{
                    if($myresp->message != "User Created"){ //user was not created in joget. so exit
                        array_push($data, array(
                            'email' => $email,
                            'reason' =>$myresp->message
                        )); 
                    }else{// add the user to DB now
                        if($supportuser == true && $jogetSupportHostIP != $jogetHostIP){
                            $myresp1 = json_decode($resp1);
                            $response['msg2'] = $myresp1->message;
                        }

                        //check if the org ID exists already??
                        $sql = "SELECT * from organization where orgID = '$orgid'";
                        $result = sqlsrv_query($conn, $sql);
                        if ($result === false) {
                            array_push($data, array(
                                'email' => $email,
                                'reason' =>"unable to check if the organizations exists due to SQL error!"
                            ));
                        } 
                        if(!sqlsrv_has_rows($result)){
                            // create new org record first
                            $orgtype = trim($orgtype);
                            $sql = "INSERT INTO organization([orgID],[orgName],[orgDescription],[orgType]) values ('$orgid', '$orgname', '$orgdesc', '$orgtype')";
                            $result = sqlsrv_query($conn, $sql);
                            if ($result === false) {
                                array_push($data, array(
                                    'email' => $email,
                                    'reason' =>"unable to add the organization due to SQL error!"
                                ));
                            } 
                        }

                        $passwordHashed= password_hash($password,PASSWORD_DEFAULT);
        
                        $sql = "INSERT INTO users ( [user_firstname], [user_lastname], [user_email], [user_org], [user_country], [user_password],[user_type], [created_by], [created_time], [user_phone], [support_user]) 
                        OUTPUT Inserted.user_id
                        VALUES ('$fname','$lname','$email','$orgid','$country','$passwordHashed','$usertype', '$admin', GETDATE(),'$userphoneno', '$supportuserValue');";
                        
                        $result = sqlsrv_query($conn,$sql);
                        if($result === false){
                            array_push($data, array(
                                'email' => $email,
                                'reason' =>"unable to add user to the DB due to SQL error!"
                            ));
                        }
                        // else{
                            // $sql = "SELECT user_id from users WHERE user_email = '$email'";
                            // $stmt = sqlsrv_query( $conn, $sql);
                            
                            // if( $stmt === false) {
                            //   die( print_r( sqlsrv_errors(), true) );
                            //  }
                                    
                            // while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
                            //   $userid = $row['user_id'];
                            // }
                            
                            // $sql = "INSERT INTO pro_usr_rel ([Pro_ID],[Usr_ID],[Pro_Role],[added_by],[added_time]) values('110','$userid','Member','$user', GETDATE())"; 
                            // $stmt = sqlsrv_query( $conn, $sql);
                        
                            // if( $stmt === false) {
                            //   die( print_r( sqlsrv_errors(), true) );
                            // }
                            
                        // };
                    }
                }

           }
        };
        
        if(count($data)> 0){
            $usersAdded = $length -count($data) -1;
            $response['msg'] = $usersAdded." users were added to system. Other users were not able to be added based on the following reasons";
            $response['data'] = $data;
            echo(json_encode($response));
            exit();

        }else{
            $response['msg'] = "All users were added to the system successfully";
            echo(json_encode($response));
            exit();
        }
 		
  
    }
?>