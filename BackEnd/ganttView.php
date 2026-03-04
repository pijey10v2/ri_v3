<?php
//V3 file
?>
<!DOCTYPE html>

<html>
    <head>
        <title>Reveron Insights</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=yes">
       
        <link rel="stylesheet" href="../JS/ganttV3/gantt.css" type="text/css"/>                   <!--     CSS for gantt chart-->
        <script src="../JS/JsLibrary/jquery-3.5.1.js"></script>                     <!--     JS for jquery-->
                    
        <script src="../JS/ganttV3/gantt.js"></script>                                   <!--     JS for gantt chart-->
        <script src="../JS/JsLibrary/jquery-confirm.min.js"></script>

       
    </head>
    <body style="margin: unset;" data-gr-c-s-loaded="true">
        <div style="position:relative" class="gantt" id="gdiv"></div>
    </body>
    <script language="javascript">
        $(document).ready(function () {
            var url = window.frameElement.getAttribute('data-url');
            var theme = window.frameElement.getAttribute('data-theme');
            //add gantt theme
            $("body").addClass(theme)
            console.log(url)
            var myUrl = '../../' + url;
            //check if the file exists
            $('#gdiv').html("");
            $.ajax({
                url: myUrl,
                type: "GET",
                dataType: 'json',
                error: function () {
                console.log("error")
                window.parent.$('.loader').fadeOut();
                },
                success: function (response) {
                    console.log("got file");
                },
            
            });

            // get the details of mapping for fly to in insights
            let mapping  =[];
            if(localStorage.page_pageOpen == "myInsights"){
                $.ajax({
                    url:  'getScheduleList.php',
                    type: "GET",
                    dataType: 'json',
                    success: function (response) {
                        mapping =response['mapping'];
                        window.parent.$('.loader').fadeOut();
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        var str = textStatus + " " + errorThrown;
                        $.alert({
                            boxWidth: '30%',
                            useBootstrap: false,
                            title: 'Message',
                            content: str
                        });
                        
                    }
                });
            }
            g = new JSGantt.GanttChart(document.getElementById('gdiv'), 'quarter');
            if (g.getDivId() != null) {
                function test(row) {
                    var name = row.getName();
                    if(mapping.length>0){
                        let j=0;
                        while(j< mapping.length){
                            if(name == mapping[j].schName){
                                let k=0;
                                while(k< window.parent.entitiesArray.length){
                                    if(mapping[j].locName == window.parent.entitiesArray[k].name){
                                        window.parent.viewer.camera.flyTo({
                                            destination: window.parent.Cesium.Cartesian3.fromDegrees(window.parent.locations[k].longitude, window.parent.locations[k].latitude, 2000.0),
                                            duration: 2,
                                            complete: function () {
                                                $(".floatbox#floatbox").css("top", "60%")
                                                $(".floatbox#floatbox").css("left", "50%")
                                                $(".floatbox#floatbox").fadeIn(150)
                                            }
                                        });
                                        //close modal wizard gantt chart
                                        window.parent.wizardCancelPageGantt()
                                        break;
                                    };
                                    k++;
                                }
                                break;
                            };
                            j++;
                        }
                    }
                };
                g.setCaptionType('Resource'); // Set to Show Caption (None,Caption,Resource,Duration,Complete)
                g.setDayMajorDateDisplayFormat('dd mon');
                g.setDateTaskDisplayFormat('dd month yyyy HH:MI');
                g.setUseSort(0);
                    // Use the XML file parser
                    
                JSGantt.parseXML(myUrl, g)
                g.setEventClickRow(test)
                g.Draw();
                window.parent.$('#loader').fadeOut();	
            } else {
                $.alert({
                    boxWidth: '30%',
                    useBootstrap: false,
                    title: 'Message',
                    content: 'Unable to create Gantt Chart!',
                });
                window.parent.$('.loader').fadeOut();
            };
        });
   
    </script>
</html>
