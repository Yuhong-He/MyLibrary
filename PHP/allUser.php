<?php
header('Content-Type:text/json;charset=utf-8');
include_once("utils/PageHelper.php");
$page = $_GET['page'] ?? '';
$user_name = $_GET['user_name'] ?? '';
$user_auth = $_GET['user_auth'] ?? '';
$search = $_GET['search'] ?? '';
session_start();
if(isset($_SESSION["Username"]) && isset($_SESSION[$user_name ."Auth"])) {
    if ($user_name == $_SESSION["Username"] && $user_auth == $_SESSION[$user_name . "Auth"]) {
        if ($user_auth == 3) {

            require_once "db.php";
            $rows = 5;
            $arr = getRequestsList($page, $rows, $search, $db);
            $str = PageHelper::getPage(getRecordsSQL($search), $rows, $page, $arr, $db, "");
            mysqli_close($db);

            echo json_encode($str);
        } else {
            echo json_encode(array('code' => 401));
        }
    } else {
        echo json_encode(array('code' => 401));
    }
} else {
    echo json_encode(array('code' => 401));
}

function getRequestsList($page, $rows, $search, $db): array
{
    $start_from = ($page - 1) * $rows;
    if($search == "") {
        $sql = "SELECT UserName, Email, Authority, Banned, id FROM user
                ORDER BY id DESC LIMIT $start_from, $rows";
    } else {
        $sql = "SELECT UserName, Email, Authority, Banned, id FROM user
                WHERE UserName LIKE '%$search%'
                ORDER BY id DESC LIMIT $start_from, $rows";
    }
    $result = mysqli_query($db, $sql);
    $arr = [];
    if($result != false) {
        while($row = mysqli_fetch_array($result)) {
            $arr[] = ["username"=>$row['UserName'], "email"=>$row['Email'], "authority"=>$row['Authority'],
                    "banned"=>$row['Banned'], "id"=>$row['id']];
        }
    }
    return $arr;
}

function getRecordsSQL($search): string
{
    if($search == '') {
        $sql = "SELECT COUNT(*) FROM user";
    } else {
        $sql = "SELECT COUNT(*) FROM user WHERE UserName LIKE '%$search%'";
    }
    return $sql;
}
