<?php
header('Content-Type:text/json;charset=utf-8');
$un = $_POST['username'] ?? '';
$pw = $_POST['password'] ?? '';
if($un != "") {
    require_once "db.php";
    $code=200;
    $email="";
    $authority="";
    $resUsername=mysqli_query($db, "SELECT count(UserName) as num FROM user where UserName = '$un'");
    $rewUsername = mysqli_fetch_assoc($resUsername);
    if ($rewUsername['num'] == 0) {
        $code=400;
    }
    if($code!=400){
        $resPassword=mysqli_query($db, "SELECT count(UserName) as num FROM user where UserName = '$un' and Password = '$pw'");
        $rewPassword = mysqli_fetch_assoc($resPassword);
        if ($rewPassword['num'] != 1) {
            $code=201;
        }
    }
    if($code!=201 && $code!= 400){
        $result=mysqli_query($db, "SELECT Email,Authority FROM user where UserName = '$un'");
        while($row=mysqli_fetch_row($result))
        {
            $email=$row[0];
            $authority=$row[1];
        }
        session_start();
        $_SESSION[$un]=true;
    }
    mysqli_close($db);
    $str = array
    (
        'code'=>$code,
        'email'=>$email,
        'authority'=>$authority
    );
    $jsonEncode = json_encode($str);
    echo $jsonEncode;
}
