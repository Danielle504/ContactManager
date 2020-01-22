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

  $query = "SELECT * FROM contacts
                          WHERE
                          uid = '$obj->uid'";
  $contacts = [];

  if (!sqlsrv_query($con, $query))
  {
    $obj->code = 400;
    $json = json_encode($obj);
    echo $json;
    exit();
  }

  while ($row = sqlsrv_fetch_array($query, SQLSRV_FETCH_NUMERIC))
  {
    $contacts [] = $row;
  }

  $obj->contacts = $contacts [];
  $obj->code = 200;
  $json = json_encode($obj);
  echo $json;
  sqlsrv_close($con);
?>
