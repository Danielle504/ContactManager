<?php
  $serverName = "pregradcrisis.database.windows.net";
  $connectionOptions = array("Database" => "contactdb",
      "Uid" => "PGC41",
      "PWD" => "P660224chaz0015");

  $con = sqlsrv_connect($serverName, $connectionOptions);

  if ($con === false)
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

  if (!sqlsrv_query($con, $query))
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
