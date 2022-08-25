<?php
header('Content-Type:text/json;charset=utf-8');
$un=$_POST['username'];
$pw=$_POST['password'];
require_once "db.php";
$username=mysqli_query($db, "SELECT UserName FROM user");
while($row=mysqli_fetch_row($username))
{
    $all_user_name[]=$row[0];
}
$password=mysqli_query($db, "SELECT Password FROM user");
while($row=mysqli_fetch_row($password))
{
    $all_password[]=$row[0];
}
$email=mysqli_query($db, "SELECT Email FROM user");
while($row=mysqli_fetch_row($email))
{
    $all_email[]=$row[0];
}
$authority=mysqli_query($db, "SELECT Authority FROM user");
while($row=mysqli_fetch_row($authority))
{
    $all_auth[]=$row[0];
}
$code=400;
$message="用户名不存在";
for($start=0; $start<sizeof($all_user_name); $start++)
{
    if($un==$all_user_name[$start])
    {
        if($pw==$all_password[$start])
        {
            session_start();
            $_SESSION[$un]=true;
            $code=200;
            $message="密码正确";
            $email=$all_email[$start];
            $authority=$all_auth[$start];
        }
        else
        {
            $code=201;
            $message="密码不正确";
        }
        break;
    }
}
mysqli_close($db);
$str = array
(
    'code'=>$code,
    'message'=>$message,
    'email'=>$email,
    'authority'=>$authority
);
$jsonEncode = json_encode($str);
echo $jsonEncode;
