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

  $query = $con->prepare("SELECT uid FROM users
                                    WHERE uid = ?
                                    AND pword = ?");

  $query->bind_param("ss", $obj->uid, $obj->pword);
  if($query->execute())
  {
      $query->store_result();
      $query->fetch();
  }
  
  if(($query->num_rows) < 1)
  {
    $obj->code = 400;
    $obj->info = "Login was incorrect.";
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