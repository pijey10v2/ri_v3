
  <!-- <img src="session/pic.jpg" class="responsive"></img> -->
 

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image</title>
    <style>
img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top : 5%;margin-bottom : 5%;
  max-width : 70%;max-height : 70%;
}
</style>
</head>
<body style=" background: #0e0e0e; display: block;">
    <img class="center" src="<?php echo $_GET['file_name']; ?>">
  </body>
</html>

 