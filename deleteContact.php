<?php
$host = 'pregradcrisis.database.windows.net';
$user = 'PGC41@pregradcrisis';
$pword = 'P660224chaz0015';
$dbase = 'contactdb';
$con = mysqli_init();
mysqli_real_connect($con, $host, $user, $pword, $dbase, 3306);

if (mysqli_connect_errno())
{
  $obj->code = 500;
  $json = json_encode($obj);
  echo $json;
  exit();
}

$json = file_get_contents('php://input');
$obj = json_decode($json);

$query = "DELETE FROM contacts
          WHERE
            cid = '$obj->cid'";

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
mysqli_close($con);
?>
