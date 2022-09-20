<?php
header('Content-Type:text/json;charset=utf-8');
require_once "db.php";
$lang = $_GET['lang'] ?? '';
$search = $_GET['search'] ?? '';
if($search != "") {
    $search = preg_replace("/[\']/","\\'", $search);
    if($lang == "zh"){
        $sql = "SELECT CategoryID, CategoryName FROM category WHERE CategoryName LIKE '%$search%'";
    } else {
        $sql = "SELECT CategoryID, EnCatName FROM category WHERE EnCatName LIKE '%$search%'";
    }
    $result = mysqli_query($db, $sql);
    $arr = [];
    while($row = mysqli_fetch_array($result))
    {
        $arr[] = ["id"=>$row[0], "name"=>$row[1]];
    }
    echo json_encode($arr);
} else {
    echo "Are u trying to do something?\n:(";
}