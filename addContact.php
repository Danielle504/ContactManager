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
    
    $permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    do {
      $cid = substr(str_shuffle($permitted_chars), 0, 16);
      $resultset = mysqli_query($con, "SELECT cid FROM contacts
                                        WHERE cid = '$cid'");
      $numrows = mysqli_query($resultset);
    } while ($numrows > 0);
    
    $json = file_get_contents('php://input');
    $obj = json_decode($json);
    
    $query = $con->prepare("INSERT INTO contacts VALUES ('$cid', ?, ?, ?, ?, ?)");
    
    $query->bind_param("sssss", $obj->uid, $obj->fname, $obj->lname, $obj->phone, $obj->email);
    
    if (!$query->execute())
    {
        $obj->error = "Error: " . mysqli_error($con);
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