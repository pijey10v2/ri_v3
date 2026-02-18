<?php
set_time_limit(0);
include_once('../../Login/app_properties.php');
require '../../login/include/db_connect.php';
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

session_start();

$response = array(
    'success' => false,
	'msg' => ''
);

// Check if the request is valid
if (!isValidUpload('request')) {
    $response['msg'] = 'Invalid request.';

    echo json_encode($response);
    exit;
}

$invalidFiles = [];
$params = [
    'username' => $_SESSION['username'] ?? $_POST['email'],
    'event_date' => $_POST['event_date'] ?? '',
    'weather' => $_POST['weather'] ?? 'Lightning',
];

// Validate parameters
if (!isValidUpload('params')) {
    $response['msg'] = 'Invalid parameters.';
    echo json_encode($response);
    exit;
}

// Validate files
if (!isValidUpload('files')) {
    $response['msg'] = 'Invalid CSV file/s.';
    $response['invalidFiles'] = $invalidFiles;
    echo json_encode($response);
    exit;
}

// Start Uploading files
$uploadedFiles = uploadFiles($_FILES['files']);

if (empty($uploadedFiles)) {
    $response['msg'] = 'Upload failed.';
    echo json_encode($response);
    exit;
}

//Insert file data in the database
sqlsrv_begin_transaction($conn);

try {
    $wlfCreateSql = "INSERT INTO weather_lightning_files (event_date, filename, username) OUTPUT INSERTED.wlf_id VALUES ";
    $wlfCreateStringVal = "(?, ?, ?)";

    $wlfCreate = insertMultipleFileRecords($wlfCreateSql, $uploadedFiles, $wlfCreateStringVal);

    if (!$wlfCreate) {
        throw new Exception("File data insertion failed.");
    }

    // Commit trancsaction
    sqlsrv_commit($conn);

    // Echo the success response
    $response['success'] = true;
    $response['msg'] = 'Successfully uploaded file/s.';
    $uploadedFileIndex = 0;
    
    while ($row = sqlsrv_fetch_array($wlfCreate, SQLSRV_FETCH_ASSOC)) {
        $uploadedFileIndex[$uploadedFileIndex]['wlf_id'] = $row['wlf_id'];
        $uploadedFileIndex++;
    }
    
    $response['data'] = $uploadedFiles;

    echo json_encode($response);
    exit;
} catch (Exception $e) {
    $response['msg'] = 'File upload failed.';
    $response['error'] = sqlsrv_errors();
    echo json_encode($response);
    exit;
}

/**
 * Insert multiple file records into the database
 * 
 * @param string $sql
 * @param array $fileData
 * @param string $stringVal
 * 
 * @return resource
 */
function insertMultipleFileRecords($sql, $fileData, $stringVal) {
    global $conn;
	$values = [];
	$params = [];

	foreach ($fileData as $data) {
		$values[] = $stringVal;
		$params = array_merge($params, array_values((array)$data));
	}

	$sql .= implode(', ', $values);

	return sqlsrv_query($conn, $sql, $params);

}

/**
 * Function to validate the request
 * 
 * @param string $validate
 * 
 * @return bool
 */
function isValidUpload($validate = 'request') {
    switch ($validate) {
        case 'request':
            return $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['files']);
            break;
        case 'params':
            global $params;
            $isValidParams = count(array_filter($params)) === count($params);

            if ($isValidParams) {
                $pattern = "/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/";
                $date = $params['event_date'];

                if (!preg_match($pattern, $date)) {
                    return false;
                }

    
                list($year, $month, $day) = explode('-', $date);
                $isValidDate = checkdate((int)$month, (int)$day, (int)$year);

                if (!$isValidDate) {
                    return false;
                }

                $isValidParams = filter_var($params['username'], FILTER_VALIDATE_EMAIL) !== false;
            }

            return $isValidParams;
            break;
        case 'files':
            $isUploadValid = true;
            $files = $_FILES['files'];
            $allowedTypes = ['text/csv'];
            global $invalidFiles;
            
            for ($fileIndex = 0; $fileIndex < count($files['name']); $fileIndex++) {
                $fileNamePattern = "/^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])[0-5]\dLTG$/";
                $fileName = explode('.', $files['name'][$fileIndex]);

                if (!preg_match($fileNamePattern, $fileName[0])) {
                    $invalidFiles[] = [
                        'error' => 'Invalid file name. Expected format: YYYYMMDDHHmmLTG',
                        'file' => $files['name'][$fileIndex],
                    ];
                    $isUploadValid = false;
                    continue;
                }

                if (!in_array($files['type'][$fileIndex], $allowedTypes)) {
                    $invalidFiles[] = [
                        'error' => 'Invalid file type',
                        'file' => $files['name'][$fileIndex],
                    ];
                    $isUploadValid = false;
                    continue;
                }
            }

            return $isUploadValid;
            break;
        default:
            return false;
    }
}

/**
 * Function to upload files
 * 
 * @param array $files
 * 
 * @return array
 */
function uploadFiles($files) {
    global $params;
    $uploadedFiles = [];
    $mainDir = '../../../Data/Weather/' . $params['weather'];

    if (!is_dir($mainDir)) {
        mkdir($mainDir, 0777, true);
    }

    foreach ($files['name'] as $fileIndex => $fileName) {
        $subDir = substr(basename($fileName), 0, 8);
        $subDirPath = $mainDir . '/' . $subDir;

        if (!is_dir($subDirPath)) {
            mkdir($subDirPath, 0777, true);
        }

        $filePath = $subDirPath . '/' . basename($fileName);

        if (file_exists($filePath)) {
            unlink($filePath);
        }
        
        if (move_uploaded_file($files['tmp_name'][$fileIndex], $filePath)) {
            $uploadedFiles[] = [
                'event_date' => $params['event_date'],
                'filename' => $fileName,
                'username' => $params['username']
            ];
        }
    }

    return $uploadedFiles;
}