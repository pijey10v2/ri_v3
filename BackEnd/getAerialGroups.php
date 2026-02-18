<?php
   session_start();
   header('Access-Control-Allow-Origin: *');
   header('Content-Type: application/json');
   header('Access-Control-Methods: POST');
   header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
   require ('../login/include/db_connect.php');
   $arr = [];
   $projectID = $_SESSION['project_id'];
   $aicID = filter_input(INPUT_POST, 'aicID', FILTER_VALIDATE_INT);
 
   if($aicID){

      if($_SESSION['is_Parent'] == "isParent"){
         //IF PARENT

         $sql = "SELECT ga.groupID, ga.groupName, ga.projectID, 
               CASE WHEN aic.AIC_Id IS NOT NULL THEN 'selected' ELSE '' END AS selected 
               FROM groupAerial ga LEFT JOIN AerialImageCompare aic 
               ON aic.Image_Group = ga.groupID 
               AND aic.AIC_Id = '$aicID' 
               AND aic.Project_ID = '$projectID'";

         $sql2 = "SELECT sga.subGroupID, sga.subGroupName, sga.projectID, 
                  CASE WHEN aic.AIC_Id IS NOT NULL THEN 'selected' ELSE '' END AS selected 
                  FROM subGroupAerial sga LEFT JOIN AerialImageCompare aic 
                  ON aic.Image_SubGroup = sga.subGroupID 
                  AND aic.AIC_Id = '$aicID' 
                  AND aic.Project_ID = '$projectID'";
         }
      else{
         //IF CHILD
         $sql = "SELECT ga.groupID, ga.groupName, ga.projectID, 
               CASE WHEN aic.AIC_Id IS NOT NULL THEN 'selected' ELSE '' END AS selected 
               FROM groupAerial ga LEFT JOIN AerialImageCompare aic 
               ON aic.Image_Group = ga.groupID 
               AND aic.AIC_Id = '$aicID' 
               AND aic.Package_ID = '$projectID'";

         $sql2 = "SELECT sga.subGroupID, sga.subGroupName, sga.projectID, 
                  CASE WHEN aic.AIC_Id IS NOT NULL THEN 'selected' ELSE '' END AS selected 
                  FROM subGroupAerial sga LEFT JOIN AerialImageCompare aic 
                  ON aic.Image_SubGroup = sga.subGroupID 
                  AND aic.AIC_Id = '$aicID' 
                  AND aic.Package_ID = '$projectID'";
   
      }
      
   }

   $stmt = sqlsrv_query( $conn, $sql);
   while( $row = sqlsrv_fetch_array( $stmt, SQLSRV_FETCH_ASSOC) ) {
      $arr['group'][] = $row;
   }
   
   $stmt2 = sqlsrv_query( $conn, $sql2);
   while( $row = sqlsrv_fetch_array( $stmt2, SQLSRV_FETCH_ASSOC) ) {
      $arr['subgroup'][] = $row;
   }
					
   

  sqlsrv_free_stmt( $stmt);
  sqlsrv_free_stmt( $stmt2);

  echo(json_encode($arr));
  
 ?>