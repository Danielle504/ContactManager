<?php
  $server = "azcontact.mysql.database.azure.com";
  $user = "PGC42@azcontact";
  $password = "P660224chaz0015";
  $database = "contact_manager";
  $con = mysqli_connect($server, $user, $password, $database);

  if (!$con)
  {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    $obj->code = 500;
    $json = json_encode($obj);
    echo $json;
    exit();
  }

  $json = file_get_contents('php://input');
  $obj = json_decode($json);

  $query = $con->prepare("INSERT into users VALUES(?, ?)");
  $query->bind_param("ss", $obj->uid, $obj->pword);
 
  if (!$query->execute())
  {
    $obj->error = ("Error description: " . mysqli_error($con));
    $obj->code = 400;
    $json = json_encode($obj);
    echo $json;
    die();
  }

  $obj->code = 200;
  $json = json_encode($obj);
  echo $json;
  mysqli_close($con);
?>