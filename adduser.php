<?php
  $server = "azcontact.mysql.database.azure.com";
  $user = "PGC42@azcontact",
  $password = "P660224chaz0015";
  $databse = "azcontact";
  $con = mysqli_connect($server, $user, $password, $database);

  if (!$con)
  {
    $obj->code = 500;
    $json = json_encode($obj);
    echo $json;
    exit();
  }

  $json = file_get_contents('php://input');
  $obj = json_decode($json);

  $query = "INSERT into 'users'(uid, pword)
                            VALUES ('$obj->uid, $obj->pword')";

  if (!mysqli_query($con, $query))
  {
    $obj->code = 400;
    $json = json_encode($obj);
    echo $json;
    exit();
  }

  $obj->code = 200;
  $json = json_encode($obj);
  echo $json;
  sqlsrv_close($con);
?>
