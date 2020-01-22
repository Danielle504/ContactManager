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

$permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyz';
do {
  $cid = substr(str_shuffle($permitted_chars), 0, 16);
  $resultset = mysqli_query($con, "SELECT cid FROM contacts
                                    WHERE cid = '$cid'"
                                    );
  $numrows = mysqli_num_rows($resultset);
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

if (!mysqli_query($con, $query))
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
mysqli_close($con);
?>