<?php
  $server = "azcontact.mysql.database.azure.com";
  $user = "PGC42@azcontact";
  $password = "P660224chaz0015";
  $database = "contact_manager";
  $con = mysqli_connect($server, $user, $password, $database);
  if (!$con)
  {
    $obj->error = "Error: Unable to connect to MySQL." . PHP_EOL .
                  "\n" ."Debugging errno: " . mysqli_connect_errno() . PHP_EOL .
                  "\n" . "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    $obj->code = 500;
    $json = json_encode($obj);
    echo $json;
    exit();
  }

  $json = file_get_contents('php://input');
  $obj = json_decode($json);

  $query = "SELECT * FROM contacts
                          WHERE
                          users_uid = '$obj->uid'";
    
  $resultset = mysqli_query($con, $query);
    
  if (!mysqli_query($con, $query))
  {
    $obj->error = "Error: " . mysqli_error($con);
    $obj->code = 400;
    $json = json_encode($obj);
    echo $json;
    mysqli_close($con);
    exit();
  }
               
   $contacts = array();
    
    while ($row = mysqli_fetch_assoc($resultset))
  {
    $contacts[] = $row;
  }

  $obj->contacts = $contacts;
  $obj->code = 200;
  $json = json_encode($obj);
   if ($json === false)
   {
       $json = json_encode(array("jsonError", json_last_error_msg()));
       if ($json === false)
       {
        $json = '{"jsonError": "unknown"}';
       }
       http_response_code(400);
   }
  echo $json;
  mysqli_close($con); 
?>
