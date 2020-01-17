<?php
  $host = 'https://pregradcrisis.azurewebsites.net/';
  $user = 'PGC41';
  $pword = 'P660224chaz0015';
  $dbase = 'contactdb';
  $con = mysqli_connect($host, $user, $pword, $dbase);

  if ($con->connect_error)
  {
    die("Connection aborted: " . $con->connect_error);
  }

  $json = file_get_contents('php://input');
  $obj = json_decode($json);

  $query = "INSERT INTO users(`uid`, `pword`)
            VALUES ('$obj->uid','$obj->pword')";

  if (!mysqli_query($con, $query))
  {
    die("Error: " . $query . "<br>" . mysqli_error($con));
  }
  mysqli_close($con);
?>
