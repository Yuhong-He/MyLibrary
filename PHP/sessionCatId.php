<?php
header('Content-Type:text/json;charset=utf-8');
$id = $_POST['id'] ?? '';
if((is_numeric($id)) && ($id > 0)) {
    require_once "db.php";
    $sql = "SELECT * FROM category WHERE CategoryID = $id";
    $result = mysqli_query($db, $sql);
    $check = false;
    while(mysqli_fetch_array($result))
    {
        $check = true;
    }
    mysqli_close($db);
    if($check == true) {
        session_start();
        $_SESSION["CategoryID"] = $id;
        echo json_encode(array('code' => 200));
    } else {
        echo json_encode(array('code' => 201));
    }
} else {
    echo "Are u trying to do something?\n:(";
}