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

$permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyz';
do {
  $cid = substr(str_shuffle($permitted_chars), 0, 16);
  $resultset = sqlsrv_query($con, "SELECT cid FROM contacts
                                    WHERE cid = '$cid'"
                                    );
  $numrows = sqlsrv_num_rows($resultset);
} while ($numrows > 0);

$json = file_get_contents('php://input');
$obj = json_decode($json);


$query =  "UPDATE 'contact'
            SET f_name = '$obj->f_name'
                l_name = '$obj->l_name'
                email = '$obj->email'
                phone = '$obj->phone'
            WHERE
                '$obj->cid' = cid";

if (!sqlsrv_query($con, $query))
{
  $obj->code = 400;
  $json = json_encode($obj);
  echo $json;
  exit();
}

$obj->code = 200;
$obj->cid = $cid;
$json = json_encode($obj);
echo $json;
sqlsrv_close($con);
?>
