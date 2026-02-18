<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . "/../login/include/db_connect.php";

if (empty($_SESSION)) {
    $returnResponse['message'] = 'Unauthorized access.';

    echo json_encode($returnResponse);
    exit;
}

$returnResponse = [
    'success' => false,
    'message' => ''
];

function getCesiumTokens($tokenType = 'mapbox', $latestOnly = false) {
    global $conn;
    $selection = $latestOnly ? 'TOP 1 *' : '*';
    $query = "SELECT $selection FROM cesium_tokens WHERE token_type = ? ORDER BY id DESC;";
    $params = [$tokenType];
    $stmt = sqlsrv_query($conn, $query, $params);
    $tokens = [];

    if ($stmt !== false) {
        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            $tokens[] = $row;
        }
    }

    return $tokens;
}

function getDefaultCesiumTokens($tokenType = 'mapbox', $isUpdate = false) {
    $sessionTokenKey = $tokenType === 'mapbox' ? 'mapbox_token' : 'maptiler_token';

    if (empty($_SESSION[$sessionTokenKey]) || $isUpdate) {
        global $conn;
        $query = "SELECT TOP 1 token FROM cesium_tokens WHERE token_type = ? AND is_active = ? ORDER BY id DESC;";
        $params = [$tokenType, 1];
        $stmt = sqlsrv_query($conn, $query, $params);

        $token = false;

        if ($stmt !== false && ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC))) {
            $token = $row['token'];
        }

        $_SESSION[$sessionTokenKey] = $token;
    }

    return $_SESSION[$sessionTokenKey];
}


function getCesiumTokenList($tokenType = 'mapbox', $latestOnly = false) {
    $tokens = getCesiumTokens($tokenType, $latestOnly);
    $html = '';
    
    if (!empty($tokens)) {
        foreach ($tokens as $token) {
            $isActive = $token['is_active'] ? 'checked' : '';
            $radTokenName = $tokenType. '_token_id';
            $html .= '<div class="tableHeader system-admin" id="token-row-'.$token['id'] . '-' . $token['token_type'].'">
                        <span class="radColumn" style="margin-top: auto; margin-bottom: auto;">
                            <input class="radTokenUpdate" type="radio" name="'.$radTokenName.'" data-token_id="'.$token['id'].'" data-token_type="'.$token['token_type'].'" value="'.$token['token'].'" onchange="updateToken(this)" '.$isActive.'>
                        </span>
                        <span class="idColumn">'.$token['id'].'</span>
                        <span class="tokenColumn" title="'.$token['token'].'">'.$token['token'].'</span>
                        <span class="otherColumn">'.($token['token_type'] === 'mapbox' ? 'Mapbox' : 'Maptiler').'</span>
                        <span class="otherColumn" title="'.$token['created_by'].'">'.$token['created_by'].'</span>
                        <span class="otherColumn">'.$token['date_created']->format('Y-m-d').'</span>
                        <span class="actionColumn" style="margin-top: auto; margin-bottom: auto;">
                            <button id="delTokenBtn-'.$token['id'].'" onclick="deleteToken(this)" style="background-color: red; border:none; padding: 5px 10px; border-radius: 5px; color: white;" value="'.$token['token'].'" data-token_type="'.$token['token_type'].'" data-is_active="'.$token['is_active'].'" data-token_id="'.$token['id'].'"><i class="fa-solid fa-trash-can"></i></button>
                        </span>
                    </div>';
        }
    }

    return $html;
}

function saveToken($params) {

    global $conn;
    global $returnResponse;
    $getQuery = "SELECT * FROM cesium_tokens WHERE token_type = ? AND token = ?";
    $getTokenParams = [$params['token_type'], $params['token']];
    $getStmt = sqlsrv_query($conn, $getQuery, $getTokenParams);

    if (sqlsrv_has_rows($getStmt)) {
        $returnResponse['message'] = 'Token already exists.';

        return $returnResponse;
    }

    $isActive = (int)$params['isActive'];

    $createdBy = isset($_SESSION['email']) ? $_SESSION['email'] : 'system';
    $saveQuery = "INSERT INTO cesium_tokens (token_type, token, created_by, is_active) VALUES (?, ?, ?, ?)";
    $sqParams = [$params['token_type'], $params['token'], $createdBy, $isActive];
    $sqStmt = sqlsrv_query($conn, $saveQuery, $sqParams);

    if ($sqStmt === false) {
        $returnResponse['message'] = 'Error saving token.';

        return $returnResponse;
    }
    
    if ($isActive) {
        $updateQuery = "UPDATE cesium_tokens SET is_active = 0 WHERE token_type = ? AND token <> ?";
        $updateTokenQuery = [$params['token_type'], $params['token']];
        
        sqlsrv_query($conn, $updateQuery, $updateTokenQuery);

        getDefaultCesiumTokens($params['token_type'], true);            
    }

    $returnResponse['success'] = true;
    $returnResponse['message'] = 'Token saved successfully.';
    $returnResponse['data'] = $params;

    return $returnResponse;
}

function getToken($params) {
    global $conn;
    global $returnResponse;

    $getQuery = "SELECT * FROM cesium_tokens WHERE token_type = ? ORDER BY id DESC;";
    $sqlParams = [$params['token_type']];
    $getStmt = sqlsrv_query($conn, $getQuery, $sqlParams);

    if ($getStmt === false) {
        $returnResponse['message'] = 'No token found.';

        return $returnResponse;
    }

    if (sqlsrv_has_rows($getStmt)) {
        $returnResponse['data'] = sqlsrv_fetch_array($getStmt, SQLSRV_FETCH_ASSOC);
        $returnResponse['success'] = true;
        $returnResponse['message'] = 'Token fetched successfully.';

        return $returnResponse;
    }

    $returnResponse['message'] = 'Error fetching token.';
    
    return $returnResponse;
}

function deleteToken($params) {
    global $conn;
    global $returnResponse;

    $deleteQuery = "DELETE FROM cesium_tokens WHERE token = ? AND token_type = ?";
    $delParams = [$params['token'], $params['token_type']];
    $delStmt = sqlsrv_query($conn, $deleteQuery, $delParams);

    if ($delStmt === false) {
        $returnResponse['message'] = 'Error deleting token.';

        return $returnResponse;
    }

    $returnResponse['success'] = true;
    $returnResponse['message'] = 'Token deleted successfully.';

    return $returnResponse;
}

function updateToken($params) {
    global $conn;
    global $returnResponse;

    $updateQuery = "UPDATE cesium_tokens SET is_active = 1 WHERE token = ? AND token_type = ?";
    $updateParams = [$params['token'], $params['token_type']];
    $updateStmt = sqlsrv_query($conn, $updateQuery, $updateParams);

    if ($updateStmt === false) {
        $returnResponse['message'] = 'Error updating token.';

        return $returnResponse;
    }
    
    $updateQuery = "UPDATE cesium_tokens SET is_active = 0 WHERE token_type = ? AND token <> ?";
    $updateTokenParams = [$params['token_type'], $params['token']];
    
    sqlsrv_query($conn, $updateQuery, $updateTokenParams);

    getDefaultCesiumTokens($params['token_type'], true);

    $returnResponse['success'] = true;
    $returnResponse['message'] = 'Token updated successfully.';

    return $returnResponse;
}