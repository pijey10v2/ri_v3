<?php
if (session_status() == PHP_SESSION_NONE) session_start();
if (!isset($_SESSION['email'])) die('Session Error!');
if (!isset($_POST['fn'])) json_decode(['res' => 'error', 'msg' => 'undefined function']);

require "./../Login/include/_include.php";
global $CONN, $SYSTEM;

function hideFeed(){
    global $CONN;
    $userid = $_SESSION['user_id'];
    $CONN->execute("update users set show_news_feed = 0 where user_id = :0", array($userid));
    $_SESSION['shownewsfeed'] = 0;
    return array('result' => true);
}

function time_elapsed_string($datetime, $full = false) {
    $now = new DateTime;
    $ago = new DateTime($datetime);
    $diff = $now->diff($ago);

    $weeks = floor($diff->d / 7);
    $days = $diff->d - ($weeks * 7);

    $string = [
        'y' => 'yr',
        'm' => 'mo',
        'w' => 'w',
        'd' => 'd',
        'h' => 'h',
        'i' => 'm',
        's' => 's',
    ];

    $values = [
        'y' => $diff->y,
        'm' => $diff->m,
        'w' => $weeks,
        'd' => $days,
        'h' => $diff->h,
        'i' => $diff->i,
        's' => $diff->s,
    ];

    $result = [];

    foreach ($string as $k => $v) {
        if ($values[$k]) {
            $result[] = $values[$k] . $v;
        }
    }

    if (!$full) {
        $result = array_slice($result, 0, 1);
    }

    return $result ? implode(',', $result) : 'just now';
}

function getnewsfeed($start, $end){
    global $CONN, $SYSTEM;
    $userid = $_SESSION['user_id'];
    $nfOwnerId = '';
    $ownerCol = '';

    $nfProjId = "select Pro_ID from pro_usr_rel where Usr_ID = :0";
    $nf_rel = $CONN->fetchAll($nfProjId, array($userid));

    // Extract all Pro_ID values
    $proIds = array_map(function($item) {
        return $item['Pro_ID'];
    }, $nf_rel);

    // Convert the array of Pro_ID values into a string for the IN clause
    $placeholders = implode(',', array_fill(0, count($proIds), '?'));

    if($SYSTEM == 'KKR'){
        $nfOwnerId = "select project_owner from projects where project_id_number in ($placeholders)";
        // Fetch the results using the array of Pro_ID values
        $nf_pro = $CONN->fetchAll($nfOwnerId, $proIds);

        $projectOwners = array_map(function($item) {
            return $item['project_owner'];
        }, $nf_pro);
    }else{
        $nfOwnerId = "select owner_org_id from projects where project_id_number in ($placeholders)";
        // Fetch the results using the array of Pro_ID values
        $nf_pro = $CONN->fetchAll($nfOwnerId, $proIds);

        $projectOwners = array_map(function($item) {
            return $item['owner_org_id'];
        }, $nf_pro);
    }
    
    // Step 2: Remove duplicates to get unique project owners
    $uniqueOwners = array_unique($projectOwners);

    $ownerCondition = implode(' OR ', array_map(function($owner) {
        return "dd.nf_owner LIKE '%" . $owner . "%'";
    }, $uniqueOwners));
    
    // Construct the full query
    $nfSQL = "SELECT * FROM (
                    SELECT 
                        ROW_NUMBER() OVER (ORDER BY nf_created_date DESC) AS rn,
                        (SELECT COUNT(*) FROM news_feed_like bb WHERE bb.nfl_nf_id = aa.nf_id) AS like_cnt,
                        (SELECT COUNT(*) FROM news_feed_like cc WHERE cc.nfl_nf_id = aa.nf_id AND cc.nfl_user_id = ?) AS liked_flag,
                        aa.*
                    FROM news_feed aa
              ) dd 
              WHERE dd.rn BETWEEN ? AND ? 
              AND ($ownerCondition)";

    $params = array_merge(
        array($userid, $start, $end), // Bind userid, start, and end values
        $uniqueOwners // Bind the unique project owner values
    );

    $nf_row = $CONN->fetchAll($nfSQL, $params);
    foreach ($nf_row as $k => $nf) {
        $nf['elapsed'] = time_elapsed_string($nf['nf_created_date']);
        $nf_row[$k] = $nf;
    }
    return ['data' => $nf_row];
}


function likeFeed($nfid, $liked){
    global $CONN;
    $userid = $_SESSION['user_id'];
    $likeSQL = ($liked) ? "insert into news_feed_like (nfl_user_id, nfl_nf_id) values (:0, :1)" : "delete from news_feed_like where nfl_user_id =:0 and nfl_nf_id =:1";
    $nf_row = $CONN->execute($likeSQL, array($userid, $nfid));
    if (!$nf_row) return ['result' => false];
    $new_cnt = $CONN->fetchOne('select count(*) from news_feed_like where nfl_nf_id=:0', array($nfid));
    return ['result' => true, 'newcnt' => $new_cnt];
}

$fn = filter_input(INPUT_POST, 'fn', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
switch ($fn) {
    case 'getnewsfeed':
        $start = filter_input(INPUT_POST, 'nstart', FILTER_SANITIZE_NUMBER_INT);
        $end = filter_input(INPUT_POST, 'nend', FILTER_SANITIZE_NUMBER_INT);
        $ret = getnewsfeed($start, $end);
        echo json_encode($ret, 1);
        break;
    case 'likeFeed':
        $nfid = filter_input(INPUT_POST, 'nfid', FILTER_SANITIZE_NUMBER_INT);
        $liked = filter_input(INPUT_POST, 'liked', FILTER_VALIDATE_BOOLEAN);
        $ret = likeFeed($nfid, $liked);
        echo json_encode($ret, 1);
        break;
    case 'hideFeed':
        $ret = hideFeed();
        echo json_encode($ret, 1);
        break;
}