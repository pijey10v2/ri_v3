<?php

$folder = 'doc_temp'; // Target folder name
$sizeLimit_MB = 500 ; //Repository limit in Mb
$makeSpace_percent = 50 ; //clean space in percent
$expiryHour = 24; // Hour to file expiration
$dateNow = time();
$file_list = array();

$size = 0;
function folderSize ($dir)
{
    $size = 0;

    foreach (glob(rtrim($dir, '/').'/*', GLOB_NOSORT) as $each) {
        $size += is_file($each) ? filesize($each) : folderSize($each);
    }

    return $size;
}
$totalSize_MB = foldersize('doc_temp')/1000000;
echo '<br>Total Size is '.$totalSize_MB;


if ($totalSize_MB > $sizeLimit_MB)
{
  echo '<br><br>Delete ';
  $makeSpace_percent = $makeSpace_percent/100;
  $deleted_size = 0 ;
  $i = 0 ;
  $makeSpace_MB = $sizeLimit_MB*$makeSpace_percent; // 
  $total_toDelete_MB = $totalSize_MB * $makeSpace_percent;


if (file_exists('init/size_checker.init.txt'))
while ( ($deleted_size < $makeSpace_MB) or ($deleted_size < $total_toDelete_MB)   ) 
  {
    $expiryHour--;
    $files = glob($folder . '/*');
    if (!file_exists('init/size_checker.init.txt'))
        break;

    //Loop through the file list.
    if (file_exists('init/size_checker.init.txt'))
    foreach($files as $file){
        //Make sure that this is a directory.
        if ($deleted_size > $total_toDelete_MB)
            break;
        if (!file_exists('init/size_checker.init.txt'))
                break;

        if(!is_file($file)){
            //Get a list of all of the file names in the folder.
            $files2 = glob($file . '/*');

           //Loop through the file list.
            if (file_exists('init/size_checker.init.txt'))
            foreach($files2 as $file2){
                if ($deleted_size > $total_toDelete_MB)
                    break;
                if (!file_exists('init/size_checker.init.txt'))
                    break;
                //Make sure that this is a file and not a directory.
                if(is_file($file2)){
                    $dateOrigin = filemtime($file2);
                    $timeDifference = ($dateNow - $dateOrigin)/60/60;

                    //Delete file That is
                    // echo "<br>".$file2." File , age: ".$timeDifference; //#demo
                    if ($timeDifference >= $expiryHour)
                    {
                    echo "<br>".$file2." File deleted, age: ".$timeDifference;
                    $deleted_size += filesize($file2)/1000000;
                    unlink($file2);
                    }
                }
            }

        }
        
    }

  }
  
  echo "<br> Total deleted size : ".$deleted_size;
}

?>
