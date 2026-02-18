
<?php

##script to filter out 
require 'kml_converter.php';

function kml_filter($file_name)
{
    $file = "kml_raw/".$file_name;
    $xml_file = file_get_contents($file);
    $xml_file =  htmlspecialchars($xml_file);

    $tag_filter_remove=array('Schema','BalloonStyle','visibility','SchemaData','SimpleData');
    $tag_filter_insert=array('value');

    $supported = 1;

    $i=0;
    While(isset($tag_filter_remove [$i]))  //tag element to be remove
    {   
        if(preg_match('#&lt;'.$tag_filter_remove [$i].'#',$xml_file) && preg_match('#/'.$tag_filter_remove [$i].'&gt;#',$xml_file) ) //  
        {   
            $supported = 0; //not supported
        }
        $i++;  
    }
    
    $j=0;
    While(isset($tag_filter_insert [$j]))  //tag element to be insert
    {
        if(!preg_match('#&lt;'.$tag_filter_insert [$j].'#',$xml_file)&&preg_match('#/'.$tag_filter_insert [$j].'&gt;#',$xml_file))
        {   
            $supported = 0; //not supported
        }
        $j++;   
    } 

    // echo $supported;

    if ($supported==1){
        echo 'Supported file';
        if (!copy($file,'../../../Data/KML/'.$file_name)) {
            echo "failed to copy $file_name";
        }
    }
    else{ 
        echo 'Redirect to conversion';
        kml_converter($file_name);
    }


}

?>