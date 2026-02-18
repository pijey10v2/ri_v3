<?php
include_once("class/jogetLink.class.php");
include_once ('../Login/app_properties.php');
global $PHPCACERTPATH;
$constructLinkObj = new JogetLink();

error_reporting(E_ALL);
ini_set("display_errors", 1);
//   session_start(); //session starts in jogetlink. so not needed here
   include_once('sharePoint.func.php');
  // header('Access-Control-Allow-Origin: *');
//   header('Content-Type: application/json');
//   header('Access-Control-Methods: POST');
// #demo change to the filename and url that will be provided by Maheswari
/*$user_id = 1 ; // #demo change to user RI ID
$fileName = 'KLCC BLUE CUBE_CENTRAL.pdf';
$url = 'https://wsg.reveronconsulting.com/ws/v2.5/Repositories/Bentley.PW--Reveron-VM.REVERONCONSULTING.COM~3ACELCOM_CAFM/PW_WSG/Document/e6cece5f-266e-43d1-808f-415a44cda4e4/$file';
$folder = 'doc_temp'; // #demo. add variable for user session ID. Also used for directory of the file.
$username = 'pwadmin'; // #demo change username and pwd to user's session cred
$password = 'pwadmin'; // #demo change username and pwd to user's session cred
*/
//echo (json_encode('<script type="text/javascript" language="Javascript">window.open("src='.$fileUrl.'");</script>');  
//echo($_GET['filename']." " .$_GET['fileurl']." ".$_GET['username']." " .$_GET['password']);

$website_url = $constructLinkObj->riHost.'BackEnd/'; //This Variable is use for M.office and cad file at it use the url to be display

$uResult =[];
if(isset($_SESSION['user_id'])){
   $user_id =$_SESSION['user_id'].'user';
   //echo(json_encode($user_id));
}else{
   $uResult['msg'] = "invalid user. ";
   echo(json_encode($uResult));
   exit();
}
$folder = 'doc_temp'; // #demo. add variable for user session ID. Also used for directory of the file.


      

// data from RI

$fileName = $_POST['fileName'];
$fileUrl = $_POST['fileUrl'];

if(isset($_POST['fileMethod']) &&  $_POST['fileMethod'] == 'sp'){
   //#######################################
   //This side handle SharePoint Doc Viewer
   include_once('../login/include/db_connect.php');
   //This is to create the user folder if not exist 
   $folder = 'doc_temp/sp';
   if (!file_exists($folder.'/'.$user_id)) {
      mkdir($folder.'/'.$user_id, 0777, true);
   }
   array_map( 'unlink', array_filter((array) glob($folder.'/'.$user_id."/*") ) );

   $pp_id = $_SESSION['project_id'];
   $sql = "SELECT * FROM configSP WHERE project_id = '$pp_id'";
   $stmt = sqlsrv_query($conn, $sql);
   if ($stmt === false) {
      die(print_r(sqlsrv_errors(), true));
   }
   while ($row = sqlsrv_fetch_Array($stmt, SQLSRV_FETCH_ASSOC)) {
      $fileMethod = $_SESSION['file_method'];
      $spUrl = $row['url'].'/sites/'.$row['site_repo'];
      $spTenantId =  $row['tenant_id'];
      $spClientId =  $row['client_id'];
      $spClientSecret =  $row['client_secret'];
      $spSiteRepo =  $row['site_repo'];
   }
   $ret = array();
   $spInfo = array(
      'url' => $spUrl,
      'tenant_id' => $spTenantId,
      'client_id' => $spClientId,
      'client_secret' => $spClientSecret
   );
   $url = $spUrl;
   $output_spPath = $folder.'/'.$user_id.'/'.$fileName; // to set the file path in the server
   $fileName_exp = explode('.',$fileName);
   $file_extension = end($fileName_exp);
   $output_filename = getFile($spInfo, $fileUrl, $output_spPath );
   
}else{
   //#######################################
   //This side handle ProjectWise Doc Viewer

   //This is to create the user folder if not exist 
   if (!file_exists($folder.'/'.$user_id)) {
      mkdir($folder.'/'.$user_id, 0777, true);
   }

   if(isset ($_POST['userName']) && isset($_POST['passWord'])){
      $username = $_POST['userName'];
      $password = $_POST['passWord'];
      $_SESSION['pwUsername'] = $username;
      $_SESSION['pwPassword'] = $password;
      
   }else{
      if(isset($_SESSION['pwUsername']) && isset($_SESSION['pwPassword'])){
         $username = $_SESSION['pwUsername'];
         $password = $_SESSION['pwPassword'];
      
      }else{
         $uResult['msg'] = "Need PW Credentials to view the file. Please provide them";
         echo(json_encode($uResult));
         exit();
      }
   }

   //filename ID
   $filename_arr = explode('/', $fileUrl);
   $count_of_elements = count($filename_arr);
   $file_name = $filename_arr[$count_of_elements - 2];

   //file extension
   $filename_arr = explode(".", $fileName);
   $count_of_elements = count($filename_arr);
   $file_extension = $filename_arr[$count_of_elements - 1];

   //This area is to check if the file is already exist in the temp folder
   //########################
   $match=0;
   $files = glob($folder .'/'.$user_id. '/*');
   foreach($files as $file){
   //Make sure that this is a file and not a directory.
   if(is_file($file)){
         if (preg_match( '#'.$file_name.'#', $file)  )
         {
         $match = 1;
         }
   }
   }
   //#########################



   $output_filename = $folder.'/'.$user_id.'/'.$file_name.'.'.$file_extension; // to set the file path in the server

   //Download the file if no match
   //##########################################
   if ($match == 0)
   {
      $certificate_location = $PHPCACERTPATH;
   $ch = curl_init();
   curl_setopt($ch, CURLOPT_URL, $fileUrl);
   curl_setopt($ch, CURLOPT_VERBOSE, 1);
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
   curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, $certificate_location);
   curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, $certificate_location);
   curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
   curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
   curl_setopt($ch, CURLOPT_HEADER, 0);
   try{
      $result = curl_exec($ch);
      $check = json_decode($result,true);
      if($check && isset($check['errorMessage'])){
         $uResult['msg'] = $check['errorMessage'];
         echo(json_encode ($uResult));
         exit;
      }
   }
   catch (Error $e) {
      // Handle error
      $uResult['msg'] = $e->getMessage(); // Call to a member function method() on string
      echo(json_encode($uResult));
   }

   curl_close($ch);
   // the following lines write the contents to a file in the same directory (provided permissions etc)
   $fp = fopen($output_filename, 'w');
   fwrite($fp, $result);
   fclose($fp);
   }

   //##########################################

}

$file_url = $website_url.$output_filename;
$file_extension = strtolower($file_extension);

$PPdocx_Ext = array ('docx', 'docm', 'dotm', 'dotx', 'doc', 'pptx', 'ppsx', 'ppt', 'pps', 'pptm', 'potm', 'ppam', 'potx', 'ppsm'); // docx and pptx limit 10mb
$excel_Ext = array ('xlsx','xlsb', 'xls', 'xlsm'); // excel file limit 5 mb
$imageView = array ('jpg', 'jpeg', 'png'); //filetype for image viewer

if (in_array ($file_extension, $PPdocx_Ext))
{   
   if ( (filesize($output_filename)/1000000) < 10 ){
      $url = "https://view.officeapps.live.com/op/view.aspx?src=".$file_url;
      $uResult['fileurl'] = $url;
      $uResult['msg'] = "success";
      echo(json_encode($uResult));
   }else {
      if(!empty($file_name.'.'.$file_extension)){
         // Check file is exists on given path.
         if(file_exists($output_filename))
         {
            $path  = "BackEnd/".$output_filename;
            $uResult['msg'] = "download";
            $uResult['fileurl'] = $path;
            echo( json_encode($uResult));
            exit;
         }else {
            $uResult['msg'] = 'Unable to download the file';
            echo(json_encode($uResult));
           
         }
      }
   }
      
}
else if (in_array ($file_extension, $excel_Ext))
{   
   if ( (filesize($output_filename)/1000000) < 5 )
   {
      $url = "https://view.officeapps.live.com/op/view.aspx?src=".$file_url;
      $uResult['fileurl'] = $url;
      $uResult['msg'] = "success";
      echo(json_encode($uResult));
   }else {
      if(!empty($file_name.'.'.$file_extension)){
         // Check file is exists on given path.
         if(file_exists($output_filename))
         {
            $path  = "BackEnd/".$output_filename;
            $uResult['msg'] = "download";
            $uResult['fileurl'] = $path;
            echo( json_encode($uResult));
            exit;
         }else {
            $uResult['msg'] = 'Unable to download the file';
            echo(json_encode($uResult));
           
         }
      }
   }
    
}
else if ($file_extension == 'pdf')
{
   if ( (filesize($output_filename)/1000000) < 20 )
   {
      $url = "BackEnd/pdf_viewer.php?file_name=".$output_filename;
      $uResult['fileurl'] = $url;
      $uResult['msg'] = "success";
      echo(json_encode($uResult));
   }else {
      if(!empty($file_name.'.'.$file_extension)){
         // Check file is exists on given path.
         if(file_exists($output_filename))
         {
            $path  = "BackEnd/".$output_filename;
            $uResult['msg'] = "download";
            $uResult['fileurl'] = $path;
            echo( json_encode($uResult));
            exit;
         }else {
            $uResult['msg'] = 'Unable to download the file';
            echo(json_encode($uResult));
           
         }
      }
   }
    
  
}
else if ($file_extension == 'dwg')
{
   if ( (filesize($output_filename)/1000000) < 30 )
   {
      $url ="//sharecad.org/cadframe/load?url=".$file_url;
      $uResult['fileurl'] = $url;
      $uResult['msg'] = "success";
      echo(json_encode($uResult));
   }else {
      if(!empty($file_name.'.'.$file_extension)){
         // Check file is exists on given path.
         if(file_exists($output_filename))
         {
            $path  = "BackEnd/".$output_filename;
            $uResult['msg'] = "download";
            $uResult['fileurl'] = $path;
            echo( json_encode($uResult));
            exit;
         }else {
            $uResult['msg'] = 'Unable to download the file';
            echo(json_encode($uResult));
           
         }
      }
   }
   
}
else if ($file_extension == 'txt')
{
   if ( (filesize($output_filename)/1000000) < 10 )
   {
      $url ="BackEnd/txt_viewer.php?file_name=".$output_filename;
      $uResult['fileurl'] = $url;
      $uResult['msg'] = "success";
      echo(json_encode($uResult));
   }else {
      if(!empty($file_name.'.'.$file_extension)){
         // Check file is exists on given path.
         if(file_exists($output_filename))
         {
            $path  = "BackEnd/".$output_filename;
            $uResult['msg'] = "download";
            $uResult['fileurl'] = $path;
            echo( json_encode($uResult));
            exit;
         }else {
            $uResult['msg'] = 'Unable to download the file';
            echo(json_encode($uResult));
           
         }
      }
   }

}
else if (in_array ($file_extension, $imageView))
{
   if ( (filesize($output_filename)/1000000) < 10 ) 
   {
      $url ="BackEnd/image_viewer.php?file_name=".$output_filename;
      $uResult['fileurl'] = $url;
      $uResult['msg'] = "success";
      echo(json_encode($uResult));
   }else {
      if(!empty($file_name.'.'.$file_extension)){
         // Check file is exists on given path.
         if(file_exists($output_filename))
         {
            $path  = "BackEnd/".$output_filename;
            $uResult['msg'] = "download";
            $uResult['fileurl'] = $path;
            echo( json_encode($uResult));
            exit;
         }else {
            $uResult['msg'] = 'Unable to download the file';
            echo(json_encode($uResult));
           
         }
      }
   }
   
}
else{
   if(!empty($file_name.'.'.$file_extension)){
      // Check file is exists on given path.
      if(file_exists($output_filename))
      {
         $path  = "BackEnd/".$output_filename;
         $uResult['msg'] = "download";
         $uResult['fileurl'] = $path;
         echo( json_encode($uResult));
         exit;
      }else {
         $uResult['msg'] = 'Unable to download the file';
         echo(json_encode($uResult));
         
      }
   }
}

?>
