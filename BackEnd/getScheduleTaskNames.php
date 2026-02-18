<?php

    if(!isset($_POST['url'])){
        $myResult['msg'] = "No Url is given to parse the schedule file. Please check";
        echo(json_encode($myResult));
        exit();
    }
    $url = "../".$_POST['url'];
    $sch_file = simplexml_load_file($url); 
    $namespaces = $sch_file->getNamespaces(true);

    if (!isset($namespaces[""])) {
        $myResult['error'] = ' namespace unavailable';
        exit();
    }
    $sch_file->registerXPathNamespace("default", $namespaces[""]);
    $folderXpath = "//default:Tasks";
    $taskMark = "//default:Project//default:Task";
    $number = "//default:Project//default:Task//default:OutlineNumber";
    $myCount = count($sch_file->xpath($number));
  
    $taskData = [];
    $myResult =[];
    $i=0;
    if($myCount >0){
        foreach($sch_file->xpath($taskMark) as $item){
            $taskData[$i]['name'] = trim($item->Name, "\n\t");
            $taskData[$i]['outlineNumber'] = trim($item->OutlineNumber, "\n\t");
            $taskData[$i]['outlineLevel'] = trim($item->OutlineLevel, "\n\t");
            
            $i++;
        };
        $myResult['oNumber'] = "number";
    }else{
        foreach($sch_file->xpath($taskMark) as $item){
            $taskData[$i]['name'] = trim($item->Name, "\n\t");
            $taskData[$i]['outlineLevel'] = trim($item->OutlineLevel, "\n\t");
            
            $i++;
        };
        $myResult['oNumber'] = null;
    }
   
    $myResult['data'] = $taskData;
    echo(json_encode($myResult));
  
?>