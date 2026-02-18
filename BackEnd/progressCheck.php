<?php
// The file has JSON type.
header('Content-Type: application/json');

$file = "progress.txt";
// Make sure the file is exist.
if (file_exists($file)) {
  // Get the content and echo it.
  $text = file_get_contents($file);
  echo $text;
  

// Convert to JSON to read the status.
  $obj = json_decode($text);
  // If the process is finished, delete the file.
  if ($obj->percent == 100) {
   $percent = 0;
    $arr_content['percent'] = $percent;
    $arr_content['message'] = "";
    
  
  // Write the progress into file and serialize the PHP array into JSON format.
    // The file name is the session id.
    file_put_contents("progress.txt", json_encode($arr_content));
  
    unlink($file);
  }
}
else {
  echo json_encode(array("percent" => null, "message" => null));
}
?>