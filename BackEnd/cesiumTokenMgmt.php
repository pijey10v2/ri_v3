<?php
session_start();
header('Content-Type: application/json');
require_once("../login/include/db_connect.php");
require_once("cesiumTokenFunctions.php");


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $returnResponse['message'] = 'Invalid request method.';

    echo json_encode($returnResponse);
    exit;
}

if (empty($_SESSION)) {
    $returnResponse['message'] = 'Unauthorized access.';

    echo json_encode($returnResponse);
    exit;
}

$expectedParams = [
    'token_type',
    'token'
];
$tokenType = ['maptiler', 'mapbox'];

if (!in_array($_POST['token_type'], $tokenType)) {
    $returnResponse['message'] = 'Invalid token type.';

    echo json_encode($returnResponse);
    exit;
}

if ($_POST['op'] !== 'getFirstRow') {

    if (!isset($_POST['token']) || empty($_POST['token'])) {
        $returnResponse['message'] = 'Token is required.';

        echo json_encode($returnResponse);
        exit;
    }
}

$params = $_POST;

switch ($params['op']) {
    case 'save':
        $token = saveToken($params);
        echo json_encode($token);
        break;
    case 'get':
        $getToken = getToken($params);
        break;
    case 'getFirstRow':
        echo getCesiumTokenList($params['token_type'], true);
        break;
    case 'delete':
        $token = deleteToken($params);

        echo json_encode($token);
        break;
    case 'updateToken':
        $token = updateToken($params);

        echo json_encode($token);
        break;
    default:
        $returnResponse['message'] = 'Invalid operation.';

        echo json_encode($returnResponse);
        break;
}

exit;