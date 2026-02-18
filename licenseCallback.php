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
function ioncube_event_handler($err_code, $params)
{
    echo '
<body>

    <div class = "licensePrompt">
        <img src ="Images/licenseSetting.gif">
        <h1> An error has occurred! </h1>';
    switch ($err_code) {
        case ION_LICENSE_NOT_FOUND:
            echo "<p>License could not be found.</p>";
            break;
        case ION_LICENSE_EXPIRED:
            echo "<p>License is expired.</p>";
            break;
        default:
            echo "<p>Unauthorised usage detected!</p>";
            break;
    }
}
echo '
        </div>

</body> ';
