<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';


function sendThresholdBreachNotification($fname,$asset_id,$type,$value,$timestamp,$sensorColour,$sendto){
  global $PHPCACERTPATH;

//   echo '<pre>';
//   print_r("123");
  $sendto ='maheswari.ghantala@reveronconsulting.com';
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
  
  $bodyText ="";
  if($sensorColour == "grey"){
    $bodyText = " The following sensor is not sending any data. The details are as follows.";
  }else{
    $bodyText = " The following sensor has crossed the threshold values set for ". $sensorColour.". The details are as follows.";
  }

//   print_r("<br>");
//   print_r($bodyText);
//   print_r("<br>");
//   print_r($sendto);
//   print_r("<br>");
//   print_r($PHPCACERTPATH);

  $mail ->SMTPAuth = true;
  $mail ->SMTPSecure = 'ssl';
  $mail ->Host = 'smtp.gmail.com';
  $mail ->Port = 465;
  $mail ->isHTML();
  $mail ->Username = 'pbh.support@reveronconsulting.com';
  $mail ->Password = 'Digile@0415';
  $mail ->SetFrom('pbh.support@reveronconsulting.com');
  $mail ->Subject = "Reset Password";
  $mail ->Body = "<span>Hello $fname, </span><br/> <p>".$bodyText. " :</p><p> Asset ID :<strong>$asset_id</strong></p> Please check the sensor. Thank you,<br/> Reveron Services.";
  $sendto = preg_replace('/\s+/', '', $sendto);
  $mail ->AddAddress($sendto);
  $mail ->Send();
  if (!$mail->Send()) {
    return("Error: " . $mail->ErrorInfo);
} else {
    return("Email sent successfully.");
}

}
?>


