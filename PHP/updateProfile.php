<?php
header('Content-Type:text/json;charset=utf-8');
$un = $_POST['username'] ?? '';
$pw = $_POST['password'] ?? '';
$em = $_POST['email'] ?? '';
$unNew = $_POST['newUsername'] ?? '';
$pwNew = $_POST['newPassword'] ?? '';
$emNew = $_POST['newEmail'] ?? '';
$auth = $_POST['authority'] ?? '';
$id = $_POST['id'] ?? '';
if($un != "") {
    require_once "db.php";
    $code=200;
    $resPassword=mysqli_query($db, "SELECT count(UserName) as num FROM user where UserName = '$un' and Password = '$pw'");
    $rewPassword = mysqli_fetch_assoc($resPassword);
    if ($rewPassword['num'] != 1) {
        $code=201;
    }
    if($code!=201 && $un!=$unNew){
        $resUsername=mysqli_query($db, "SELECT count(UserName) as num FROM user where UserName = '$unNew'");
        $rewUsername = mysqli_fetch_assoc($resUsername);
        if ($rewUsername['num'] != 0) {
            $code=202;
        }
    }
    if($code!=201 && $code!= 202 && $em!=$emNew){
        $resEmail=mysqli_query($db, "SELECT count(Email) as num FROM user where Email = '$emNew'");
        $rewEmail = mysqli_fetch_assoc($resEmail);
        if ($rewEmail['num'] != 0) {
            $code=203;
        }
    }
    if($code!=201 && $code!= 202 && $code!= 203){
        $sql="UPDATE user SET UserName='$unNew',Password='$pwNew',Email='$emNew', Authority='$auth' WHERE id='$id'";
        mysqli_query($db,$sql);
    }
    mysqli_close($db);
    $str = array
    (
        'code'=>$code,
        'email'=>$emNew,
        'authority'=>$auth,
        'id'=>$id
    );
    $jsonEncode = json_encode($str);
    echo $jsonEncode;
}
