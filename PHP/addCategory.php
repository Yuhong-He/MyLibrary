<?php
header('Content-Type:text/json;charset=utf-8');
$id = $_POST['id'] ?? '';
$zh_name = $_POST['zh_name'] ?? '';
$en_name = $_POST['en_name'] ?? '';
$rows = $_POST['rows'] ?? '';
$un = $_POST['username'] ?? '';
$auth = $_POST['authority'] ?? '';
$str = array();
session_start();
if(isset($_SESSION["Username"]) && isset($_SESSION[$un ."Auth"])) {
    if ($un == $_SESSION["Username"] && $auth == $_SESSION[$un . "Auth"]) {
        if($auth == 2 || $auth == 3) {
            require_once "db.php";
            $code = 200;
            $resID = mysqli_query($db, "SELECT count(*) as num FROM category where CategoryID = '$id'");
            $rewID = mysqli_fetch_assoc($resID);
            if ($rewID['num'] != 0) {
                $code = 201;
            }
            if ($code == 200) {
                $resZhName = mysqli_query($db, "SELECT count(*) as num FROM category where CategoryName = '$zh_name'");
                $rewZhName = mysqli_fetch_assoc($resZhName);
                if ($rewZhName['num'] != 0) {
                    $code = 202;
                }
            }
            if ($code == 200) {
                $resEnName = mysqli_query($db, "SELECT count(*) as num FROM category where EnCatName = '$en_name'");
                $rewEnName = mysqli_fetch_assoc($resEnName);
                if ($rewEnName['num'] != 0) {
                    $code = 203;
                }
            }
            if ($code == 200) {
                $sql = "INSERT INTO category (CategoryID, CategoryName, EnCatName) VALUES ('$id', '$zh_name', '$en_name')";
                mysqli_query($db, $sql);

                $sql = "select rownum from (select CategoryID, (@rownum:=@rownum+1) as rownum from category, (select (@rownum:=0)) b order by CategoryID asc) c where CategoryID = '$id'";
                $resCatNum = mysqli_query($db, $sql);
                $rewCatNum = mysqli_fetch_assoc($resCatNum);
                $catNum = $rewCatNum['rownum'];

                $page = ceil($catNum / $rows);
                $str = array
                (
                    'code' => $code,
                    'page' => $page
                );
                mysqli_close($db);
            } else {
                $str = array('code' => $code);
            }
        } else {
            $code = 402;
            $str = array('code' => $code);
        }
    } else {
        $code = 401;
        $str = array('code' => $code);
    }
} else {
    $code = 401;
    $str = array('code' => $code);
}
$jsonEncode = json_encode($str);
echo $jsonEncode;