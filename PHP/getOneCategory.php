<?php
header('Content-Type:text/json;charset=utf-8');
$id = $_GET['id'] ?? '';
if($id != '') {
    require_once "db.php";
    $columns = "CategoryID, CategoryName, EnCatName";
    $sql = "SELECT $columns FROM category WHERE CategoryID = $id";
    $result=mysqli_query($db, $sql);
    $res = null;
    while($row = mysqli_fetch_array($result))
    {
        $res = ["id"=>$row['CategoryID'], "zh_name"=>$row['CategoryName'], "en_name"=>$row['EnCatName']];
    }
    mysqli_close($db);
    echo json_encode($res);
}