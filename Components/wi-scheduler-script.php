<?php
include_once dirname(__DIR__).'/Login/app_properties.php';
global $JOGETASSETDOMAIN, $JOGETASSETIP, $JOGETASSETADMINUSER, $JOGETASSETADMINPWD, $JOGETHOST;
$JOGETHOST = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? $JOGETASSETDOMAIN : $JOGETASSETIP;

notificationDuePlannedDate();
notificationForExceedCommenceDate();
reminderForWorkInstruction();

function notificationDuePlannedDate()
{
    // Will send email notification when current date is 3 days before the planned date (work_date)
    error_log('notificationDuePlannedDate');
    $datalist = getDatalist('list_workInstructionManage?d-5021799-fn_workdate_notification_sent=No', 'ri_asset');
    if (isset($datalist) && $datalist['data']) {
        foreach ($datalist['data'] as $value) {
            $current_date = date('Y-m-d');
            $before_work_date = date('Y-m-d', strtotime('- 3day', strtotime($value['work_date'])));
            if (isset($value['work_date']) && !empty($value['work_date']) && $current_date == $before_work_date) {
                $email_template = constructEmailTemplate($value, 'notificationDuePlannedDate');

                $notification_fields = array(
                    'recipient' => $email_template['recipient'],
                    'email_subject' => $email_template['subject'],
                    'email_body' => $email_template['content']
                );

                $postData = postFormData($value['id'], 'emailNotification', $notification_fields);
                
                if (isset($postData) && $postData['id']) {
                    error_log("Email sent to " . $notification_fields['recipient']);
                    
                    // this to update the flag in work instruction form to prevent sending email multiple times
                    $wi_field = array(
                        'workdate_notification_sent' => 'Yes'
                    );
                    $updateData = postFormData($value['id'], 'workInstructionEdit', $wi_field);
                } else {
                    error_log("ERROR: Unable to send email. Please refer log below: ");
                    error_log(print_r($postData, 1));
                }
            } else {
                // rectification date havent start
            }
        }
    } else {
        error_log("Unable to fetch data from datalist API. ");
    }
}

function notificationForExceedCommenceDate()
{
    // Will send email notification when current date is exceed commence end date (instruction_end_date)
    error_log('notificationForExceedCommenceDate');
    $datalist = getDatalist('list_workInstructionManage?d-5021799-fn_notification_sent=No', 'ri_asset');
    if (isset($datalist) && $datalist['data']) {
        $email_body = '';
        foreach ($datalist['data'] as $value) {
            $current_date = strtotime(date('Y-m-d'));
            $instruction_end_date = strtotime($value['instruction_end_date']); // need to change to commence date instead
            if (isset($value['instruction_end_date']) && !empty($value['instruction_end_date']) && $value['wi_status'] == 'Instructed' && $current_date > $instruction_end_date) {
                // send email notification
                // need to check rectification end date
                if ($value['activity'] == 'R01 : PAVEMENT') {
                    $rectification_period = false;
                } elseif ($value['activity'] == 'B : ROUTINE INSPECTION') {
                    $rectification_period = 14; //days
                } else {
                    $rectification_period = 7; //days
                }
    
                if ($rectification_period != false) {
                    $email_template = constructEmailTemplate($value, 'notificationForExceedCommenceDate');

                    $notification_fields = array(
                        'recipient' => $email_template['recipient'],
                        'email_subject' => $email_template['subject'],
                        'email_body' => $email_template['content']
                    );
                    
                    $postData = postFormData($value['id'], 'emailNotification', $notification_fields);
                    
                    if (isset($postData) && $postData['id']) {
                        error_log("Email sent to " . $notification_fields['recipient']);
                        
                        // this to update the flag in work instruction form to prevent sending email multiple times
                        $wi_field = array(
                            'notification_sent' => 'Yes'
                        );
                        $updateData = postFormData($value['id'], 'workInstructionEdit', $wi_field);
                    } else {
                        error_log("ERROR: Unable to send email. Please refer log below: ");
                        error_log(print_r($postData, 1));
                    }
                } else {
                    error_log('pavement activity not allowed to be rectified');
                }
    
            }
    
        }
    } else {
        error_log("Unable to fetch data from datalist API. ");
    }
}

function reminderForWorkInstruction() 
{
    // Will send email reminder when current date same as reminder interval date
    error_log('reminderForWorkInstruction');
    $datalist = getDatalist('list_workInstructionManage?d-5021799-fn_reminder_sent=No', 'ri_asset');
    if (isset($datalist) && $datalist['data']) {
        foreach ($datalist['data'] as $value) {
            if ($value['reminder_interval'] && $value['reminder_interval'] != "") {
                // check if today's date same with reminder date
                $reminder_date = date('Y-m-d' , strtotime('- '.$value['reminder_interval'].'day', strtotime($value['work_date'])));
                $todays_date = date('Y-m-d');
                if ($todays_date == $reminder_date) {
                    // sent reminder email and update flag to true
                    // this to trigger submit new form and the new form will trigger send email tool
                    // $reminder_field = array(
                    //     'reminder_user' => $value['createdBy'] == 'admin' ? 'faezal.hasriq@reveronconsulting.com' : $value['createdBy'],
                    //     'created_user' => $value['createdByName'],
                    //     'ref_no' => $value['ref_no'],
                    //     'activity' => $value['activity'],
                    //     'reminder_date' => $reminder_date,
                    //     'work_date' => $value['work_date'],
                    // );
                    // $postData = postFormData($value['id'], 'workInstructionReminder', $reminder_field);
                    $email_template = constructEmailTemplate($value, 'reminderForWorkInstruction');

                    $notification_fields = array(
                        'recipient' => $email_template['recipient'],
                        'email_subject' => $email_template['subject'],
                        'email_body' => $email_template['content']
                    );

                    $postData = postFormData($value['id'], 'emailNotification', $notification_fields);

                    if (isset($postData) && $postData['id']) {
                        error_log("Email sent to " . $reminder_field['reminder_user']);
                        
                        // this to update the flag in work instruction form to prevent sending email multiple times
                        $wi_field = array(
                            'reminder_sent' => 'Yes'
                        );
                        $updateData = postFormData($value['id'], 'workInstructionEdit', $wi_field);
                    } else {
                        error_log("ERROR: Unable to send email. Please refer log below: ");
                        error_log(print_r($postData, 1));
                    }
                }
            }
        }
    } else {
        error_log("Unable to fetch data from datalist API. ");
    }
}

function getDatalist($dataListUrl, $app, $row = 0)
{
    global $JOGETHOST, $JOGETASSETADMINUSER, $JOGETASSETADMINPWD;
    
    $url = $JOGETHOST ."jw/web/json/data/list/".$app.'/'.$dataListUrl.'&rows='.(($row != 0) ? $row : '90000');
    $headers = array(
        'Content-Type: application/json',
        'Authorization: Basic ' . base64_encode("$JOGETASSETADMINUSER:$JOGETASSETADMINPWD")
    );
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $return = curl_exec($ch);
    $err    = curl_error($ch);
    curl_close($ch);
    if ($err) {
        return false;
    } else {
        return json_decode($return, true);
    }	
}

function postFormData($id, $idForm, $fieldsArray)
{
    global $JOGETHOST, $JOGETASSETADMINUSER, $JOGETASSETADMINPWD;

    $fieldArr1 = array(
        'j_username' => $JOGETASSETADMINUSER, 
        'j_password' => $JOGETASSETADMINPWD,
    );
    $fieldArr = array_merge($fieldArr1, $fieldsArray);

    $url = $JOGETHOST.'/jw/web/json/data/form/store/ri_asset/'.$idForm .'/'.$id;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($fieldArr));
    curl_setopt($ch, CURLOPT_VERBOSE, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    try {
        $result = curl_exec($ch);
    }
    catch (Error $e) {
        echo $e->getMessage(); // Call to a member function method() on string
    }
    
    $res = json_decode($result, true);
    return $res;

    if (!$res) {
        echo json_encode($ret['error'] = 'Error storing in DB');
        exit();
    }
}

function constructEmailTemplate($data, $type)
{
    //TODO: create a generic function to construct email template
    $result = array();
    $result['recipient'] = $data['createdBy'];
    // $result['recipient'] = "faezal.hasriq@reveronconsulting.com";
    $result['subject'] = "Email Notification";
    $result['content'] = "";
    $record_link = "https://joget.reveronconsulting.com/jw/web/embed/userview/ri_asset/ri_asset/_/list_workInstructionManage?_mode=edit&id=".$data['id'];

    switch ($type) {
        case 'reminderForWorkInstruction':
            $result['subject'] = "Work Instruction Reminder";
            $result['content'] = "Dear {$data['createdBy']}, <br>";
            $result['content'] .= "Your work instruction will be started on {$data['work_date']}. <br>";
            $result['content'] .= "Please click <b style='color:DrakBlue;'><a href='$record_link'>here</a></b> for review.<br/><br/> Thank you.";
            break;
        case 'notificationDuePlannedDate':
            $result['subject'] = "Planned Date is about to start";
            $result['content'] = "Dear {$data['createdBy']}, <br>";
            $result['content'] .= "Your work instruction will be started 3 Days. <br>";
            $result['content'] .= "Please click <b style='color:DrakBlue;'><a href='$record_link'>here</a></b> for review.<br/><br/> Thank you.";
            break;
        case 'notificationForExceedCommenceDate':
            $result['subject'] = "Warning: Your Targeted Date is Exceeded";
            $result['content'] = "Dear {$data['createdBy']}, <br>";
            $result['content'] .= "This is a reminder that your work instruction already exceeded targetted commence date. Please take immediate action. <br>";
            $result['content'] .= "Please click <b style='color:DrakBlue;'><a href='$record_link'>here</a></b> for review.<br/><br/> Thank you.";
            break;
    }

    return $result;
}
