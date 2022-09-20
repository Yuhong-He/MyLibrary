<?php
header('Content-Type:text/json;charset=utf-8');
$id = $_GET['id'] ?? '';
if((is_numeric($id)) && ($id > 0)) {
    require_once "db.php";
    $columns = "CategoryID, CategoryName, EnCatName";
    $sql = "SELECT $columns FROM category WHERE CategoryID = $id";
    $result = mysqli_query($db, $sql);
    $res = null;
    $check = false;
    while($row = mysqli_fetch_array($result))
    {
        $res = ["id"=>$row['CategoryID'], "zh_name"=>$row['CategoryName'], "en_name"=>$row['EnCatName']];
        $check = true;
    }
    mysqli_close($db);
    if($check == true) {
        echo json_encode($res);
    } else {
        echo "Are u trying to do something?\n:(";
    }
} else {
    echo "Are u trying to do something?\n:(";
}