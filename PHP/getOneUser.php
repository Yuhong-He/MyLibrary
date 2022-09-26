<?php
header('Content-Type:text/json;charset=utf-8');
$id = $_GET['id'] ?? '';
if((is_numeric($id)) && ($id > 0)) {
    require_once "db.php";
    $sql = "SELECT * FROM user WHERE id = $id";
    $result = mysqli_query($db, $sql);
    $res = null;
    $check = false;
    while($row = mysqli_fetch_array($result))
    {
        $res = ["code"=>200, "username"=>$row[0], "authority"=>$row[3], "banned"=>$row[4]];
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