<?php
header('Content-Type:text/json;charset=utf-8');
$orig_id = $_POST['orig_id'] ?? '';
$orig_zh = $_POST['orig_zh'] ?? '';
$orig_en = $_POST['orig_en'] ?? '';
$id = $_POST['id'] ?? '';
$zh_name = $_POST['zh_name'] ?? '';
$en_name = $_POST['en_name'] ?? '';
$rows = $_POST['rows'] ?? '';
$un = $_POST['username'] ?? '';
$auth = $_POST['authority'] ?? '';
$page = 1;
session_start();
if(isset($_SESSION["Username"]) && isset($_SESSION[$un ."Auth"])) {
    if ($un == $_SESSION["Username"] && $auth == $_SESSION[$un . "Auth"]) {
        if($auth == 2 || $auth == 3) {
            require_once "db.php";
            $code = 200;
            $resID = mysqli_query($db, "SELECT count(*) as num FROM category where CategoryID = '$id'");
            $rewID = mysqli_fetch_assoc($resID);
            if ($rewID['num'] != 0 && $orig_id != $id) {
                $code = 201;
            }
            if ($code == 200) {
                $resZhName = mysqli_query($db, "SELECT count(*) as num FROM category where CategoryName = '$zh_name'");
                $rewZhName = mysqli_fetch_assoc($resZhName);
                if ($rewZhName['num'] != 0 && $orig_zh != $zh_name) {
                    $code = 202;
                }
            }
            if ($code == 200) {
                $resEnName = mysqli_query($db, "SELECT count(*) as num FROM category where EnCatName = '$en_name'");
                $rewEnName = mysqli_fetch_assoc($resEnName);
                if ($rewEnName['num'] != 0 && $orig_en != $en_name) {
                    $code = 203;
                }
            }
            if ($code == 200) {
                $sql = "UPDATE category SET CategoryID = '$id', CategoryName = '$zh_name', EnCatName = '$en_name'
                        WHERE CategoryID = '$orig_id'";
                mysqli_query($db, $sql);

                $sql = "select rownum from (select CategoryID, (@rownum:=@rownum+1) as rownum from category, (select (@rownum:=0)) b order by CategoryID asc) c where CategoryID = '$id'";
                $resCatNum = mysqli_query($db, $sql);
                $rewCatNum = mysqli_fetch_assoc($resCatNum);
                $catNum = $rewCatNum['rownum'];

                $page = ceil($catNum / $rows);
            }
        } else {
            $code = 402;
        }
    } else {
        $code = 401;
    }
} else {
    $code = 401;
}
$str = array
(
    'code' => $code,
    'page' => $page
);
$jsonEncode = json_encode($str);
echo $jsonEncode;