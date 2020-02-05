<?php
  $server = "azcontact.mysql.database.azure.com";
  $user = "PGC42@azcontact";
  $password = "P660224chaz0015";
  $database = "contact_manager";
  $con = mysqli_connect($server, $user, $password, $database);

  if (!$con)
  {
    $obj->error = "Error: Unable to connect to MySQL." . PHP_EOL .
                  "\n" . "Debugging errno: " . mysqli_connect_errno() . PHP_EOL .
                  "\n" . "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    $obj->code = 500;
    $json = json_encode($obj);
    echo $json;
    exit();
  } 

  $json = file_get_contents('php://input');
  $obj = json_decode($json);


  $query = $con->prepare("UPDATE contacts
            SET fname = ?,
                lname = ?,
                email = ?,
                phone = ?
            WHERE
                cid = '$obj->cid'");
                
  $query->bind_param("ssss", $obj->fname, $obj->lname, $obj->email, $obj->phone);
 
  if (!$query->execute())
  {
   $obj->error = "Error: " . mysqli_error($con);
   $obj->code = 400;
   $json = json_encode($obj);
   echo $json;
   mysqli_close($con);
   exit();
  }

  $obj->code = 200;
  $json = json_encode($obj);
  echo $json;
  mysqli_close($con);
?>