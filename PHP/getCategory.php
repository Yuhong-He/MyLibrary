<?php
header('Content-Type:text/json;charset=utf-8');
require_once "db.php";
$lang = $_GET['lang'] ?? '';
$search = $_GET['search'] ?? '';
if($search != "") {
    if($lang == "zh"){
        $sql = "SELECT CategoryID, CategoryName FROM category WHERE CategoryName LIKE '%$search%'";
    } else {
        $sql = "SELECT CategoryID, EnCatName FROM category WHERE EnCatName LIKE '%$search%'";
    }
    $result = mysqli_query($db, $sql);
    $arr = [];
    while($row = mysqli_fetch_array($result))
    {
        $res = ["id"=>$row[0], "text"=>$row[1]];
        $arr[] = $res;
    }
    echo json_encode($arr);
}