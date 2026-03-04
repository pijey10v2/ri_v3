<?php
include_once("class/jogetLink.class.php");
$constructLinkObj = new JogetLink();

if(isset($_SESSION['user_id'])){
    $user_id =$_SESSION['user_id'].'user';
}else{
   // $uResult['msg'] = "invalid user. ";
   // echo(json_encode($uResult));
   // exit(); 
   $user_id ='jogetDocViewer'; // flip with comment above after ssl applied. 
}

// $jogetFileUrl = $_GET['src'];
if(isset($_GET['src'])){
    $jogetFileUrl =$_GET['src'];
 }else{
    $uResult['msg'] = "invalid url. ";
    echo(json_encode($uResult));
    exit();
 }

$url = $jogetFileUrl;
$folder = 'doc_temp'; // #demo. add variable for user session ID. Also used for directory of the file.

if(isset($_SESSION['Project_type']) && $_SESSION['Project_type'] == 'ASSET'){
   $project_type = 'asset';
}else{
   $project_type = 'joget';
}

$api_username = $constructLinkObj->getAdminUserName($project_type);
$api_password = $constructLinkObj->getAdminUserPassword($project_type);

//#demojogetdocview change according to the current server
$website_url = $constructLinkObj->riHost.'BackEnd/'; 

//This is to create the user folder if not exist 
if (!file_exists($folder.'/'.$user_id)) {
   mkdir($folder.'/'.$user_id, 0777, true);
}

// somethimes got attachment=true after ?, also need to be removed
if(strpos($url, "?")){
   $url = substr($url, 0, strpos($url, "?"));
}
//filename ID
$filename_arr = explode('/', $url);
$count_of_elements = count($filename_arr);
$file_name = $filename_arr[$count_of_elements - 1];

// file link from JOGET has extra dot at the end, remove last item after explode
$strArr = explode(".", $file_name);
if ($strArr[count($strArr) - 1] == '') {
      array_pop($strArr);
}
$file_name = join('.',$strArr);
// $file_name = substr($file_name, 0, -1);
$file_name = preg_replace('/[^A-Za-z0-9. ]/', '', $file_name);

//file extension
$filename_arr = explode(".", $file_name);
$count_of_elements = count($filename_arr);
$file_extension = $filename_arr[$count_of_elements - 1];

//This area is to check if the file is already exist in the temp folder
//########################
$match=0;
// the function removed as the files will be downloaded for everytime doc clicked to avoid displaying conflict duplicate filename.
//#########################

//Download the file if no match
//##########################################

if ($match == 0)
{  
   $output_filename = $folder.'/'.$user_id.'/'.$file_name ;//.'.'.$file_extension; // to set the file path in the server
   array_map( 'unlink', array_filter((array) glob($folder.'/'.$user_id."/*") ) );
   $download_retry = 0 ;
   while ($match == 0){
      $headers = array(
         'Content-Type: application/json',
         'Authorization: Basic ' . base64_encode("$api_username:$api_password")
      );

      $ch = curl_init();
      $src_str_arr = explode ('/', $jogetFileUrl);
      // version should be replace to "latest"
      $src_str_arr[8] = 'latest';
      $count_of_elements = count($src_str_arr);
      $src_str_arr[$count_of_elements - 1] = curl_escape($ch, $src_str_arr[$count_of_elements - 1]);
      $cur_url = implode("/",$src_str_arr);
      if (strpos($cur_url, 'attachment') == false) {
         $cur_url = $cur_url.'?attachment=true';
      }
      
      curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
      curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    //  curl_setopt($ch, CURLOPT_GET, 1);
    //  curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

      curl_setopt($ch, CURLOPT_URL, $cur_url);
      curl_setopt($ch, CURLOPT_VERBOSE, 1);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($ch,CURLOPT_SSL_VERIFYPEER, false);
      curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
      curl_setopt($ch, CURLOPT_HEADER, 0);
      try{
         $result = curl_exec($ch);
      }
      catch (Error $e) {
         echo $e->getMessage(); // Call to a member function method() on string
      }
      curl_close($ch);
      // the following lines write the contents to a file in the same directory (provided permissions etc)
      $fp = fopen($output_filename, 'w');
      fwrite($fp, $result);
      fclose($fp);

      //This area is to check if the file is already exist in the temp folder
      //########################
      $match=0;
      $files = glob($folder .'/'.$user_id. '/*');
      foreach($files as $file){
      //Make sure that this is a file and not a directory.
         if(is_file($file)){
            $fileName_arr = explode('/',$file);

            if ( $file_name == $fileName_arr[2] )
            {
               echo  '<br>MATCH '.$file;
               $match = 1;
            }
         }
      }
      //#########################
      $download_retry++;
      if ($download_retry > 3){
         echo "<script> alert('Joget Document download failed. Please try again or contact admin.')</script>";
         exit();
      }   
   }
}

//##########################################


$PPdocx_Ext = array ('docx', 'docm', 'dotm', 'dotx', 'doc', 'pptx', 'ppsx', 'ppt', 'pps', 'pptm', 'potm', 'ppam', 'potx', 'ppsm'); // docx and pptx limit 10mb
$excel_Ext = array ('xlsx','xlsb', 'xls', 'xlsm'); // excel file limit 5 mb
$imageView = array ('jpg', 'jpeg', 'png'); //filetype for image viewer

$file_url = $website_url.$output_filename;
$file_extension = strtolower($file_extension);

if (in_array ($file_extension, $PPdocx_Ext))
{   
   if ( (filesize($output_filename)/1000000) < 10 ){
      $url = "https://view.officeapps.live.com/op/view.aspx?src=".$file_url;
      header("Location: ".$url);
      echo '<script type="text/javascript" language="Javascript">window.open("https://view.officeapps.live.com/op/view.aspx?src='.$file_url.'");</script>';  
      $uResult['fileurl'] = $url;
      $uResult['msg'] = "success";
      echo(json_encode($uResult));
   }   else {
      if(!empty($file_name.'.'.$file_extension)){
         // Check file is exists on given path.
         if(file_exists($output_filename))
         {
            header('Content-Disposition: attachment; filename=' . $file_name.'.'.$file_extension);  
            readfile($output_filename); 
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
      header("Location: ".$url);
      echo '<script type="text/javascript" language="Javascript">window.open("https://view.officeapps.live.com/op/view.aspx?src='.$file_url.'");</script>';
      $uResult['fileurl'] = $url;
      $uResult['msg'] = "success";
      echo(json_encode($uResult));
   }   else {
      if(!empty($file_name.'.'.$file_extension)){
         // Check file is exists on given path.
         if(file_exists($output_filename))
         {
            header('Content-Disposition: attachment; filename=' . $file_name.'.'.$file_extension);  
            readfile($output_filename); 
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
      $url = "pdf_viewer.php?file_name=".$output_filename;
      header("Location: ".$url);
      echo '<script type="text/javascript" language="Javascript">window.open("pdf_viewer.php?file_name='.$output_filename.'");</script>';
      $uResult['fileurl'] = $url;
      $uResult['msg'] = "success";
      echo(json_encode($uResult));
   }   else {
      if(!empty($file_name.'.'.$file_extension)){
         // Check file is exists on given path.
         if(file_exists($output_filename))
         {
            header('Content-Disposition: attachment; filename=' . $file_name.'.'.$file_extension);  
            readfile($output_filename); 
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
      header("Location: ".$url);
      echo '<script type="text/javascript" language="Javascript">window.open("//sharecad.org/cadframe/load?url='.$file_url.'");</script>';
      $uResult['fileurl'] = $url;
      $uResult['msg'] = "success";
      echo(json_encode($uResult));
   }   else {
      if(!empty($file_name.'.'.$file_extension)){
         // Check file is exists on given path.
         if(file_exists($output_filename))
         {
            header('Content-Disposition: attachment; filename=' . $file_name.'.'.$file_extension);  
            readfile($output_filename); 
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
      $url ="txt_viewer.php?file_name=".$output_filename;
      header("Location: ".$url);
      echo '<script type="text/javascript" language="Javascript">window.open("txt_viewer.php?file_name='.$output_filename.'");</script>';
      $uResult['fileurl'] = $url;
      $uResult['msg'] = "success";
      echo(json_encode($uResult));
   }   else {
      if(!empty($file_name.'.'.$file_extension)){
         // Check file is exists on given path.
         if(file_exists($output_filename))
         {
            header('Content-Disposition: attachment; filename=' . $file_name.'.'.$file_extension);  
            readfile($output_filename); 
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
      $url ="image_viewer.php?file_name=".$output_filename;
      header("Location: ".$url);
      echo '<script type="text/javascript" language="Javascript">window.open("image_viewer.php?file_name='.$output_filename.'");</script>';
      $uResult['fileurl'] = $url;
      $uResult['msg'] = "success";
      echo(json_encode($uResult));
   }   else {
      if(!empty($file_name.'.'.$file_extension)){
         // Check file is exists on given path.
         if(file_exists($output_filename))
         {
            header('Content-Disposition: attachment; filename=' . $file_name.'.'.$file_extension);  
            readfile($output_filename); 
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
         header('Content-Disposition: attachment; filename=' . $file_name.'.'.$file_extension);  
         readfile($output_filename); 
         exit;
      }else {
         $uResult['msg'] = 'Unable to download the file';
         echo(json_encode($uResult));
        
      }
   }
   
}


?>
