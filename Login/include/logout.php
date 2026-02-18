<?php
if(isset($_GET["signOut"]))
{
  //logout
  session_start();
  session_unset();
  session_destroy();
  echo '
  <script>
    window.localStorage.clear();
    window.location.href = "../../signin?logout=success";
  </script>
  ';
  exit();
}
?>
