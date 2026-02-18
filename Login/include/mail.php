<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

include_once '../app_properties.php';

// get email configuration based on support app
function send_token($fname,$token,$sendto){
  global $PHPCACERTPATH;
  global $JOGETSUPPORTDOMAIN, $JOGETSUPPORTADMINUSER, $JOGETSUPPORTADMINPWD;

  $fieldsArray = array(
    'name' => $fname,
    'email' => $sendto,
    'subject' => 'Reset Password',
    'body' => "<span>Hello $fname, </span><br/> <p>Your temporary token is:</p><p> <strong>$token</strong> </p> Thank you,<br/> Reveron Services."
  );

  $fieldArr1 = array(
      'j_username' => $JOGETSUPPORTADMINUSER, 
      'j_password' => $JOGETSUPPORTADMINPWD,
  );
  $fieldArr = array_merge($fieldArr1, $fieldsArray);

  $url = $JOGETSUPPORTDOMAIN.'/jw/web/json/data/form/store/sysSuppApp/ri_reset_password/';
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
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, $PHPCACERTPATH);
  curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, $PHPCACERTPATH);
  $result = curl_exec($ch);
  $res = json_decode($result, true);

  if (!$res && !isset($res['id'])) {
    // if error send normally
    _send_token($fname,$token,$sendto);
  }
}

function _send_token($fname,$token,$sendto){
  global $PHPCACERTPATH;

  $mail = new PHPMailer();
  $mail -> isSMTP();
  $mail->SMTPOptions = array(
    'ssl' => array(
        'verify_peer' => true,
        'verify_peer_name' => true,
        'allow_self_signed' => false,
        'cafile' => $PHPCACERTPATH
    )
  );
  $mail ->SMTPAuth = true;
  $mail ->SMTPSecure = 'ssl';
  $mail ->Host = 'smtp.gmail.com';
  $mail ->Port = 465;
  $mail ->isHTML();
  $mail ->Username = 'pbh.support@reveronconsulting.com';
  $mail ->Password = 'Reveron@04!5';
  $mail ->SetFrom('pbh.support@reveronconsulting.com');
  $mail ->Subject = "Reset Password";
  $mail ->Body = "<span>Hello $fname, </span><br/> <p>Your temporary token is:</p><p> <strong>$token</strong> </p> Thank you,<br/> Reveron Services.";
  $sendto = preg_replace('/\s+/', '', $sendto);
  $mail ->AddAddress($sendto);
  $mail ->Send();
}
?>


