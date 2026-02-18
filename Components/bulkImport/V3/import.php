<?php
// for theme
if (session_status() == PHP_SESSION_NONE) session_start();

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
include_once("../../BackEnd/class/jogetLink.class.php");
$constructLinkObj = new JogetLink();
$constructLinkObj->setToGlobalJSVariable();

if($constructLinkObj->currProjectOwner == 'JKR_SARAWAK'){
    $importData = array(
        "NOI" => "Notice Of Improvement",
        "NCR" => "Non Conformance Report",
        "WIR" => "Work Inspection Request",
        "DCR" => "Design Change Request",
        "RFI" => "Request For Information",
        "MS" => "Method Statement",
        "MA" => "Material Approval",
        "INC" => "Incident",
        "SDL" => "Site Diary Log",
        "SD" => "Site Direction",
        "RS" => "Report Submission",
        "SA" => "Safety Activity",
        "SMH" => "Total Man-Hours",
        "RR" => "Risk Register",
        "LA" => "Land Acquisition",
        "LI" => "Land Issue",
        "LE" => "Land Encumbrances",
        "PUBC" => "Public Complaint",
        "RSDL" => "RET's Site Diary Log"    
    );
}else{
    $importData = array(
        "NOI" => "Site Memo / Notice Of Improvement",
        "NCR" => "Non Conformance Report",
        "WIR" => "Request For Inspection",
        "DCR" => "Design Change Request",
        "RFI" => "Request For Information Technical",
        "MS" => "Method Statement",
        "MA" => "Material Acceptance",
        "INC" => "Incident",
        "SDL" => "Site Diary Log",
        "SD" => "Site Instruction",
        "RS" => "Report Submission",
        "SA" => "Safety Activity And Response",
        "SMH" => "Total Man-Hours",
        "RR" => "Risk Register",
        "LA" => "Land Acquisition",
        "LI" => "Land Issue",
        "LE" => "Land Encumbrances",
        "LS" => "Land Summary",
        "PUBC" => "Public Complaint",
        "DA" => "URW - Approved Design Drawing",
        "PU" => "URW - Progress Update"
    );
}


$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/'.$theme.'/menuAnimation.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">  
        <script src="../../JS/JsLibrary/jquery-3.5.1.js"></script>
        <link rel="stylesheet" href="../../JS/JsLibrary/jquery-confirm.min.css">
        <script src="../../JS/JsLibrary/jquery-confirm.min.js"></script>
    </head>
    <body class="defaultBody">
        <div class="importProcessBody" id="" style="height: 100%;">
            <div style="" class="importProcessContainer">
                <div class="importContent" id="importProcess">
                    <div class="scrolldownMenu twoRow">
                        <div class="top">
                            <select onchange="optionValue(this.value)" name="process_name" id="process_name" class="selectOption">
                                <option value="error">Please Select..</option>';
                                foreach ($importData as $key => $val) {
                                    $html .= '<option value="'.$key.'">'.$val.'</option>';
                                }
                                $html .= '
                            </select>
                        </div>
                        <span class="errorMessage" id="errorMessagepopup" style="display:none">Please Select Import type!</span>
                        <div class="bottom">
                            <button type="button" aria-label="Next" id="importNextButton">
                                <span aria-hidden="true">Next</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="importContent" id="ImportIframeDiv" style="display:none">
                    <iframe id="importContentIframe" src=""></iframe>
                </div>
            </div>
        </div>
        <script src="../../JS/Import.js"></script>
    </body>
</html>
';

echo $html;
?>

<style type="text/css">
    .defaultBody{
        background-color: #e4e4e4 !important;
    }
    .errorMessage{
        font-size: 12px;
        color: red;
        text-align: center;
    }
    iframe {
        height: 100%;
        width: 100%;
    }
</style>