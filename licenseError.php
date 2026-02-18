<?php

echo '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Reveron Insights</title>
    <link rel ="stylesheet" href ="CSS/errorLicense.css" type ="text/css" />
</head>';

echo '
<body>
    <div class = "licensePrompt">
    <img src ="Images/licenseSetting.gif"><h1> An error has occurred: </h1>';
if (isset($_GET['error'])) {
    switch ($_GET['error']) {
        case 'loginfailed':
            echo '<p> Credentials not found </p>';
            break;
        case 'connectionfailed':
            echo '<p> Connection error </p>';
            break;
        default:
            echo '<p>' . $_GET['error'] . '</p>';
            break;

    }

}
echo '
    </div>

</body> ';
