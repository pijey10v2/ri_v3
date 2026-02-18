<?php
	include 'vendor/autoload.php';
	session_start();
	use Dilab\Network\SimpleRequest;
	use Dilab\Network\SimpleResponse;
	use Dilab\Resumable;
	$projectFolder = $_SESSION['project_id'];
	echo $projectFolder;
	$request = new SimpleRequest();
	$response = new SimpleResponse();
	$dir = "../../../Data/Projects/".$projectFolder;
	$resumable = new Resumable($request, $response);
	$extension = $resumable->getExtension();
	echo $extension;

	$resumable->tempFolder = 'tmps';
	$resumable->uploadFolder = $dir;
	$resumable->process();	
	echo "processing";

	if (true === $resumable->isUploadComplete()) { // true when the final file has been uploaded and chunks reunited.
		echo "Done";
	}




