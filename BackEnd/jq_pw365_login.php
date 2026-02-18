<?php 
$urlRedirect = $_GET['urlRedirect'];		
?>
<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>

<script type="text/javascript">
	myWindow = window.open("jq.php", "_blank", "width=200, height=150");
	
	setTimeout(() => {  myWindow.close(); }, 5000);
	setTimeout(() => {  location.replace("<?php echo $urlRedirect; ?>"); }, 5000); //#demo
	
</script>
</body>
</html>