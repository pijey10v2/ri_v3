<?php
echo ("inPHP");
$str_json = file_get_contents('php://input');
$fp = fopen("../Data/myAssetdata.json","wb");
if($fp==false){
	$msg = "not able to open the file";
	echo($msg);
}else
{
	fwrite($fp, $str_json);
	fclose($fp);
	$msg = "Saved the data";
	echo($msg);
};
?>