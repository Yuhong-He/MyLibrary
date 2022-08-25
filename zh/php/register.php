<?php
header('Content-Type:text/json;charset=utf-8');
$un=$_POST['username'];
$pw=$_POST['password'];
$em=$_POST['email'];
require_once "../../Assets/common/db.php";
$username=mysqli_query($db, "SELECT UserName FROM user");
while($row=mysqli_fetch_row($username))
{
    $all_user_name[]=$row[0];
}
$code=202;
$message="用户名已存在";
for($start=0; $start<sizeof($all_user_name); $start++)
{
    if($un==$all_user_name[$start])
    {
        break;
    } else {
        $sql="INSERT INTO user (UserName,Password,Email,Authority)
			VALUES ('$un','$pw','$em',1)";
        $result=mysqli_query($db,$sql);
        if($result==true){
            $code=200;
            $message="注册成功";
        }
    }
}
$str = array
(
    'code'=>$code,
    'message'=>$message,
    'email'=>$em,
    'authority'=>1
);
$jsonEncode = json_encode($str);
echo $jsonEncode;