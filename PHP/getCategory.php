<?php
header('Content-Type:text/json;charset=utf-8');
require_once "db.php";
$lang = $_GET['lang'] ?? '';
if($lang != "") {
    if($lang == "zh"){
        $sql = "SELECT CategoryID, CategoryName FROM category";
    } else {
        $sql = "SELECT CategoryID, EnCatName FROM category";
    }
    $result = mysqli_query($db, $sql);
    $arr = [];
    while($row = mysqli_fetch_array($result))
    {
        $res = ["id"=>$row[0], "name"=>$row[1]];
        $arr[] = $res;
    }
    echo json_encode($arr);
}