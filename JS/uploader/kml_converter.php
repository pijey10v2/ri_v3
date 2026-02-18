<?php
function kml_converter($file_name)
{
    $file = "kml_raw/".$file_name;
    //to read to string
    $xml_file = file_get_contents($file);
    $xml_file =  htmlspecialchars($xml_file);
    $tags=array('Schema','BalloonStyle','visibility');// ,
    $i=0;

    While(isset($tags [$i]))
    {
        while(preg_match('#&lt;'.$tags [$i].'#',$xml_file)&&preg_match('#/'.$tags [$i].'&gt;#',$xml_file))
        {   $pattern1 = htmlspecialchars('<'.$tags [$i]); //remove Element tag
            $pattern2 = htmlspecialchars('/'.$tags [$i].'>');

            $arr1 = explode($pattern1, $xml_file,2); //to split only first occurence
            $arr2 = explode($pattern2, $xml_file,2);

            $xml_file = $arr1[0].''.$arr2[1];
            unset($arr1,$arr2,$pattern1,$pattern2);
        }
        $i++;
    }

    $string = preg_replace('#&lt;SchemaData .*&gt;#', '', $xml_file);
    $string = preg_replace('#&lt;.*SchemaData&gt;#', '', $string);
    $string = str_replace('SimpleData','Data',$string);
    $parts = preg_split('@(?<=Data&gt;)@', $string);

    $i=0;
    While(isset($parts [$i]))
    {
        if(preg_match('#&lt;/Data&gt;#',$parts [$i]))
        {
            $parts[$i] = str_replace('&gt;','&gt;&lt;value&gt;',$parts[$i]);  
            $parts[$i] = str_replace('&lt;/Data&gt;&lt;value&gt;','&lt;/value&gt;&lt;/Data&gt;',$parts[$i]);       
        }
        $i++;
    }

    $xmlfinal = implode("", $parts);
    file_put_contents("../../../Data/KML/".$file_name, htmlspecialchars_decode($xmlfinal));
    }
?>



