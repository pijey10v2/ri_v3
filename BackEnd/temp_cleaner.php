<?php

$folder = 'doc_temp'; // Target folder
$expiryHour = 24; // Hour to file expiration
$dateNow = time();


//Get a list of all of the file names in the folder.
$files = glob($folder . '/*');
//Loop through the file list.
if (file_exists('init/temp_cleaner.init.txt'))
foreach($files as $file){

  if (!file_exists('init/temp_cleaner.init.txt'))
        break;

  //Make sure that this is a directory.
  if(!is_file($file)){

    //Get a list of all of the file names in the folder.
    $files2 = glob($file . '/*');
    //Loop through the file list.
    if (file_exists('init/temp_cleaner.init.txt'))
    foreach($files2 as $file2){

      if (!file_exists('init/temp_cleaner.init.txt'))
        break;

      //Make sure that this is a file and not a directory.
      if(is_file($file2)){
          $dateOrigin = filemtime($file2);
          $timeDifference = ($dateNow - $dateOrigin)/60/60;

          //Delete file That is
          // echo "<br>".$file2." File , age: ".$timeDifference; //#demo
          if ($timeDifference >= $expiryHour)
          {
            echo "\n".$file." File deleted, age: ".$timeDifference;
            unlink($file2);
          }
        }
    }

  }
}

?>
