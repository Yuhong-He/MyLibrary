<?php
header('Content-Type:text/json;charset=utf-8');
$un=$_POST['username'];
$pw=$_POST['password'];
$unNew=$_POST['newUsername'];
$pwNew=$_POST['newPassword'];
$em=$_POST['email'];
$auth=$_POST['authority'];
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
$code=202;
for($start=0; $start<sizeof($all_user_name); $start++)
{
    if($unNew!=$un && $unNew==$all_user_name[$start]){
        break;
    }
    if($un==$all_user_name[$start])
    {
        if($pw==$all_password[$start])
        {
            $sql="UPDATE user SET UserName='$unNew',Password='$pwNew',Email='$em' WHERE UserName='$un'";
            mysqli_query($db,$sql);
            $code=200;
        }
        else
        {
            $code=201;
        }
        break;
    }
}
mysqli_close($db);
$str = array
(
    'code'=>$code,
    'email'=>$em,
    'authority'=>$auth
);
$jsonEncode = json_encode($str);
echo $jsonEncode;