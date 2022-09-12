<?php
header('Content-Type:text/json;charset=utf-8');
$un = $_POST['username'] ?? '';
$pw = $_POST['password'] ?? '';
if($un != "") {
    require_once "db.php";
    $code=200;
    $email="";
    $authority="";
    $id="";
    $resUsername = mysqli_query($db, "SELECT count(UserName) as num FROM user where UserName = '$un'");
    $rewUsername = mysqli_fetch_assoc($resUsername);
    if ($rewUsername['num'] == 0) {
        $code=400;
    }
    if($code!=400){
        $resPassword = mysqli_query($db, "SELECT Password FROM user where UserName = '$un'");
        $passwordFromDB = "";
        while($rewPassword = mysqli_fetch_array($resPassword))
        {
            $passwordFromDB = $rewPassword[0];
        }
        if(!password_verify($pw, $passwordFromDB)) {
            $code=201;
        }
    }
    if($code!=201 && $code!= 400){
        $result=mysqli_query($db, "SELECT Email,Authority,id FROM user where UserName = '$un'");
        while($row=mysqli_fetch_row($result))
        {
            $email=$row[0];
            $authority=$row[1];
            $id=$row[2];
        }
        session_start();
        $_SESSION["Username"] = $un;
        $_SESSION[$un ."Password"] = $pw;
        $_SESSION[$un ."Auth"] = $authority;
    }
    mysqli_close($db);
    $str = array
    (
        'code'=>$code,
        'email'=>$email,
        'authority'=>$authority,
        'id'=>$id
    );
    $jsonEncode = json_encode($str);
    echo $jsonEncode;
}
