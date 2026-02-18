
<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>


<script type="text/javascript">

    myWindow = window.open("pbi.php", "_blank", "height=450px,top=230px,location=no,width=750px, directories=no, menubar=no,titlebar=no,toolbar=no,dependent=on");

    // This event hander will listen for messages from the child
    window.addEventListener('message', function(e) {
        ProcessChildMessage_2(e.data); // e.data hold the message
    } , false);

    function ProcessChildMessage_2(message) {
        console.log(message);
        
        setTimeout(() => { 
            location.replace('<?php echo $_GET['url']; ?>');
            myWindow.close();
        }, 5000);
        
    }

</script>
</body>
</html>
