<?php
// for theme
if (session_status() == PHP_SESSION_NONE) session_start();

// overall duration analysis template file
$fileName = 'risk_overall_duration_analysis.xlsx';
$filePath = './../../Data/sample/'.$fileName;
$fileLinkHTML = '';
if (file_exists($filePath)) {
    $fileLinkHTML = '<span>Template : <a href="'.$filePath.'" download>'.$fileName.'</a></span>';
}else{
    // show error if sample template not found
    $fileLinkHTML = '<span style="color:red;">Template file not found.</span>';
}

$theme = (isset($_SESSION['theme'])) ? $_SESSION['theme'] : 'blue';
$themeClass = (isset($_SESSION['theme_mode'])) ? $_SESSION['theme_mode'] : 'light';

$html = '
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link rel="stylesheet" href="../../CSS/V3/dashboard.css">                <!--     CSS for main CSS-->
        <link rel="stylesheet" href="../../CSS/'.$theme.'/RVguiStyle.css">   
        <script src="../../JS/JsLibrary/jquery-3.5.1.js"></script>                        <!--     JS for jquery-->
        <script src="../../JS/uploader/riskUpload.js"></script>
        <link rel="stylesheet" href="../../JS/JsLibrary/jquery-confirm.min.css">
        <script src="../../JS/JsLibrary/jquery-confirm.min.js"></script>
    </head>
    <body class='.$themeClass.'>
        <div id = "loadingContainer_dashboard" class="loadingcontainer-dashboard">
            <div class="loader"></div>
            <div id="loadingText3">Working...</div>
        </div>';
        if ($_SESSION['is_Parent'] !== "isParent" && $_SESSION['Construct_Rights']['RR']['create']==true) {
            echo'
            <div class="uploadContainer">
        
                <div class="buttoncontainer">
                    <div class="templateDiv">
                        '.$fileLinkHTML.'
                    </div>
                    <div class="vlHeader"></div>
                    <div class="uploadDiv">
                        <span aria-hidden="true" class="progressFileName"></span> 
                        <button type="button" aria-label="Choose file" id="add-file-btn-dash">
                            <span aria-hidden="true">Choose file</span> 
                        </button>
                        <input type="file" name="uploadExcelInput" id="uploadExcelInput" accept=".xls,.xlsx" style="display:none;">
                        <button id="importExcel" name="import" class="btn-submit" style="display:none;">Import</button>
                    </div>
                </div>
                    
                <div id="tableMainContainer">
                    <div class="combineContainer">
                        <div class= "tableTitle">Uploaded Histogram Plot Data ('.date('m-Y').')</div>
                        <div class="tableChildContainer">
                            <table> 
                                <thead>
                                    <th>Bins</th>
                                    <th>Count</th>
                                    <th>Scaled</th>
                                    <th>Cum</th>
                                </thead>
                                <tbody id="uploadedDataTable"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="vl"></div>
                    <div class="combineContainer twoRow">
                        <div class="combineContainer top">
                            <div class= "tableTitle">Uploaded File(s) <span class= "tableNote"></span></div>
                            <div class="tableChildContainer top">
                                <table> 
                                    <thead>
                                        <th>Upload Date</th>
                                        <th>Uploaded by</th>
                                        <th>File</th>
                                    </thead>
                                    <tbody id="uploadedFileTable"></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="combineContainer bottom">
                            <div class= "tableTitle">Uploaded Probability Data ('.date('m-Y').')</div>
                            <div class="tableChildContainer bottom">
                                <table> 
                                    <tbody>
                                        <tr>
                                            <td>Remaining Duration</td>
                                            <td><span id="remainDurVal">N/A</span> month(s)</td>
                                        </tr> 
                                        <tr>
                                            <td>Overall Project Schedule Impact Uncertainty</td>
                                            <td><span id="schImpUncerVal">N/A</span> %</td>
                                        </tr>
                                        <tr>
                                            <td>Probability of Completing per Schedule</td>
                                            <td><span id="compPerSchVal">N/A</span> %</td>
                                        </tr>
                                        <tr>
                                            <td>Timely Completion Probability</td>
                                            <td><span id="timeCompProbVal">N/A</span> %</td>
                                        </tr>
                                    </tbody>
                                    <tbody id="uploadedFileTable"></tbody>
                                </table>
                            </div>    
                        </div>
                    </div>
                </div>
            </div>';
        }else{
            echo'
            <div class="uploadContainer">
          
                <div class="buttoncontainer">
                
                    <div class="uploadDiv">
                        <span aria-hidden="true" class="progressFileName"></span> 
                    </div>
                </div>
                    
                <div id="tableMainContainer">
                    <div class="combineContainer">
                        <div class= "tableTitle">Uploaded Histogram Plot Data ('.date('m-Y').')</div>
                        <div class="tableChildContainer">
                            <table> 
                                <thead>
                                    <th>Bins</th>
                                    <th>Count</th>
                                    <th>Scaled</th>
                                    <th>Cum</th>
                                </thead>
                                <tbody id="uploadedDataTable"></tbody>
                            </table>
                        </div>
                    </div>
                    <div class="vl"></div>
                    <div class="combineContainer twoRow">
                        <div class="combineContainer top">
                            <div class= "tableTitle">Uploaded File(s) <span class= "tableNote"></span></div>
                            <div class="tableChildContainer top">
                                <table> 
                                    <thead>
                                        <th>Upload Date</th>
                                        <th>Uploaded by</th>
                                        <th>File</th>
                                    </thead>
                                    <tbody id="uploadedFileTable"></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="combineContainer bottom">
                            <div class= "tableTitle">Uploaded Probability Data ('.date('m-Y').')</div>
                            <div class="tableChildContainer bottom">
                                <table> 
                                    <tbody>
                                        <tr>
                                            <td>Remaining Duration</td>
                                            <td><span id="remainDurVal">N/A</span> month(s)</td>
                                        </tr> 
                                        <tr>
                                            <td>Overall Project Schedule Impact Uncertainty</td>
                                            <td><span id="schImpUncerVal">N/A</span> %</td>
                                        </tr>
                                        <tr>
                                            <td>Probability of Completing per Schedule</td>
                                            <td><span id="compPerSchVal">N/A</span> %</td>
                                        </tr>
                                        <tr>
                                            <td>Timely Completion Probability</td>
                                            <td><span id="timeCompProbVal">N/A</span> %</td>
                                        </tr>
                                    </tbody>
                                    <tbody id="uploadedFileTable"></tbody>
                                </table>
                            </div>    
                        </div>
                    </div>
                </div>
            </div>';
        }
        echo '
    </body>
</html>
';

echo $html;
?>