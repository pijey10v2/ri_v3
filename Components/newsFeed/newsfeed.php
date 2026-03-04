<?php
require_once '../../Login/include/_include.php';
global $CONN;

function getNFFilePath($id){
    return '../../../Data/images/news/'.$id.'/';
}

function processDescHTML($html, $id){
    return $html;
}

function processFilesUpload($arr, $id){
    $dir = getNFFilePath($id);
    if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
    }

    foreach ($arr as $f) {
        move_uploaded_file($f['tmp_name'], $dir.$f['name']);
    }
}

if(isset($_POST['addnewsfeed'])){
    // handle the files
    $str = '';
    if(isset($_POST['nforg'])){
        $str = implode(",", $_POST['nforg']);
    }

    $valArr = array(
        (isset($_FILES['nfbanner']['name'])) ? $_FILES['nfbanner']['name'] : '',
        $_POST['title'],
        $str,
        $_POST['deschtml'],
        (isset($_FILES['nffiles']['name'])) ? $_FILES['nffiles']['name'] : ''
    );
    $CONN->execute("insert into news_feed (nf_card_img, nf_title, nf_org, nf_desc_html, nf_files) values (:0, :1, :2, :3, :4)", $valArr);
    $nfid = $CONN->getLastInsertID();
    if($_FILES) processFilesUpload($_FILES, $nfid);
}

if(isset($_POST['editNewsFeed']) && $_POST['editNewsFeed'] == 'Update'){
    $orgStr = implode(",", $_POST['nforg']);
    // if has attachment update else leave it - okay?
    if(isset($_FILES['nfbanner']['name']) && $_FILES['nfbanner']['name'] != ''){
        $valArr = array(
            $_POST['title'],
            $orgStr,
            $_POST['deschtml'],
            $_FILES['nfbanner']['name'],
            $_POST['nf_id']
        );
        $CONN->execute("update news_feed set nf_title =:0, nf_org =:1, nf_desc_html =:2, nf_card_img =:3 where nf_id =:4", $valArr);
        if($_FILES) processFilesUpload($_FILES, $_POST['nf_id']);
    }else{
        $valArr = array(
            $_POST['title'],
            $orgStr,
            $_POST['deschtml'],
            $_POST['nf_id']
        );
        $CONN->execute("update news_feed set nf_title =:0, nf_org =:1, nf_desc_html =:2 where nf_id =:3", $valArr);
    }
}

if(isset($_POST['updateUserDefaultValue'])){
    $CONN->execute("update users set show_news_feed = 1");
}

if(isset($_POST['deleteRecordId']) && $_POST['deleteRecordId']){
    $CONN->execute("delete from news_feed where nf_id =:0", array($_POST['deleteRecordId']));
}

$allOrg = $CONN->fetchAll('select * from organization');
$selectVal = '';

if(isset($_GET['mode']) && $_GET['mode'] == 'edit' && isset($_GET['id'])){
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    $editNewsArr = $CONN->fetchRow("select * from news_feed where nf_id = :0", array($id));

    $selOrg = explode(",", $editNewsArr['nf_org']);

    foreach ($allOrg as $org){
        $selectVal .=  '<option value="'.$org['orgID'].'" '.((in_array($org['orgID'], $selOrg)) ? ' selected ' : '').'>'.$org['orgName'].' - '.$org['orgID'].'</option>';
    }
    
    $newDesc = htmlentities($editNewsArr['nf_desc_html']);
    $formHTML = '
    <div class="modeTitleHeader">Edit</div>
    <form class="pure-form"method="post" enctype="multipart/form-data">
        <label for="nf_id">ID</label>
        <input type="text" readonly name="nf_id" value="'.$editNewsArr['nf_id'].'">
        <label for="title">Title</label>
        <input type="text" id="title" name="title" value="'.$editNewsArr['nf_title'].'">
        <label for="nforg">Organization</label><br><br>
        <select class="selectpicker"  id="nforg" name="nforg[]" multiple data-live-search="true">
            '.$selectVal .'
        </select><br><br>
        <label for="nfbanner">Banner</label>
        <input type="file" id="nfbanner" name="nfbanner">
        <label for="deschtml">Description</label>
        <textarea id="deschtml" name="deschtml" style="height:200px">'.$newDesc.'</textarea>
        <input type="submit" name="editNewsFeed" value="Update">
        <input type="submit" onclick="window.location.href = window.location.href.replace(window.location.search,\'\'); return false;" name="cancelEdit" value="Cancel">
    </form>';

}else{
    foreach ($allOrg as $org){
        $selectVal .= '<option value="'.$org['orgID'].'">'.$org['orgName'].' - '.$org['orgID'].'</option>';
    }
    
    $formHTML = '        
    <div class="modeTitleHeader">New</div>
    <form class="pure-form"method="post" enctype="multipart/form-data">
        <label for="title">Title</label>
        <input type="text" id="title" name="title" placeholder="Title..">
        <label for="nforg">Organization</label><br><br>
        <select class="selectpicker"  id="nforg" name="nforg[]" multiple data-live-search="true">
            '.$selectVal .'
        </select><br><br>
        <label for="nfbanner">Banner</label>
        <input type="file" id="nfbanner" name="nfbanner">
        <label for="deschtml">Description</label>
        <textarea id="deschtml" name="deschtml" placeholder="Write something.." style="height:200px"></textarea>
        <input type="submit" name="addnewsfeed" value="Add">
    </form>';
}

echo '
    <head>
    <!-- include libraries(jQuery, bootstrap) -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

    <!-- include summernote css/js -->
    <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"></script>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/css/bootstrap-select.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.12.4/js/bootstrap-select.min.js"></script>

    </head>
    <body>
    <div class="container">
        '.$formHTML.'
    </div>
    <hr>
';

echo '
    <div class="table-container">
    <table>
    <tr>
        <th>ID</th>
        <th>Banner</th>
        <th>Title</th>
        <th>Organization</th>
        <th>Description</th>
        <th>Created Date</th>
        <th></th>
    </tr>';

$news = $CONN->fetchAll("select * from news_feed order by nf_id desc");
foreach ($news as $nw) {
    $imgBannerSrc = getNFFilePath($nw['nf_id']).$nw['nf_card_img'];

    $orgArr = explode(',', $nw['nf_org']);
    $orgHtml = '<ul>';
    foreach ($orgArr as $k) {
        $orgHtml .= '<li>'.$k.'</li>';
    }
    $orgHtml .= '</ul>';
    echo '
        <tr>
            <td>'.$nw['nf_id'].'</td>
            <td><img style="width:300px" src="'.$imgBannerSrc.'"/></td>
            <td>'.$nw['nf_title'].'</td>
            <td>'.$orgHtml.'</td>
            <td>'.processDescHTML($nw['nf_desc_html'], $nw['nf_id']).'</td>
            <td>'.$nw['nf_created_date'].'</td>
            <td>
                <form method="get">
                    <input type="hidden" name="mode" value="edit">
                    <input type="hidden" name="id" value="'.$nw['nf_id'].'">
                    <input type="submit" value="Edit"/>
                </form>
                <form method="post">
                    <input type="hidden" name="deleteRecordId" value="'.$nw['nf_id'].'">
                    <input type="submit"  onclick="return confirm(\'Delete this record?\')"  value="Delete"/>
                </form>
            </td>
        </tr>
    ';
}
echo '
    </table>
    </div>
    <form method="post" style="margin-top:30px">
        <input type="submit"  name="updateUserDefaultValue" onclick="return confirm(\'Are you sure?\')"  value="Alert user"/>
    </form>

    <script>
        $(document).ready(function () {
            $(".selectpicker").selectpicker();            
        })
    </script>
<body/>';


?>
<style>
    table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }

    td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
    }

    tr:nth-child(even) {
        background-color: #dddddd;
    }

    body {font-family: Arial, Helvetica, sans-serif;}
    * {box-sizing: border-box;}

    input[type=text], select, textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        margin-top: 6px;
        margin-bottom: 16px;
        resize: vertical;
    }

    input[type=file], select, textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        margin-top: 6px;
        margin-bottom: 16px;
        resize: vertical;
    }

    input[type=submit] {
        background-color: #04AA6D;
        color: white;
        padding: 12px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    input[type=submit]:hover {
        background-color: #45a049;
    }

    .bootstrap-select{
        width: 100%!important;
    }

    .container {
        border-radius: 5px;
        background-color: #f2f2f2;
        padding: 20px;
    }

    .modeTitleHeader {
        font-size: large;
        font-weight: bolder;
        text-align: center;
    }
</style>

<script>
    $(document).ready(function() {
        $('#deschtml').summernote({
            placeholder: 'Description..',
            tabsize: 2,
            height: 400
        });
    });
</script>