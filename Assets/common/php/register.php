<?php
header('Content-Type:text/json;charset=utf-8');
$un=$_POST['username'];
$pw=$_POST['password'];
$em=$_POST['email'];
require_once "db.php";
$code=200;
$resUsername=mysqli_query($db, "SELECT count(UserName) as num FROM user where UserName = '$un'");
$rewUsername = mysqli_fetch_assoc($resUsername);
if ($rewUsername['num'] != 0) {
    $code=202;
}
if($code!=202){
    $resEmail=mysqli_query($db, "SELECT count(Email) as num FROM user where Email = '$em'");
    $rewEmail = mysqli_fetch_assoc($resEmail);
    if ($rewEmail['num'] != 0) {
        $code=203;
    }
}
if($code!=202 && $code!=203){
    $sql="INSERT INTO user (UserName,Password,Email,Authority) VALUES ('$un','$pw','$em',1)";
    mysqli_query($db, $sql);
}
mysqli_close($db);
$str = array
(
    'code'=>$code,
    'email'=>$em,
    'authority'=>1
);
$jsonEncode = json_encode($str);
echo $jsonEncode;