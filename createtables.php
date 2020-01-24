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

  $query = "drop database [if exists] contact_manager;

  create database contact_manager;
  
  create table users(
  uid varchar(60) not null,
  pword varchar(25) not null,
  primary key (uid)
  );
  
  create table contact(
  fname varchar(60) not null,
  lname varchar(60),
  phone varchar(60) not null,
  email varchar(60),
  cid varchar(60) not null,
  primary key (cid),
  uid varchar(60) not null,
      FOREIGN KEY (uid)
      REFERENCES users (uid)
      ON DELETE CASCADE
  );";

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
