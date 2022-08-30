<?php
$rows = $_GET['rows'] ?? '';
$table = $_GET['table'] ?? '';
$column = $_GET['column'] ?? '';
$search = $_GET['search'] ?? '';
if($table != "") {
    require_once "db.php";
    if($search == ""){
        $sql = "SELECT COUNT(*) FROM $table";
    } else {
        $sql = "SELECT COUNT(*) FROM $table WHERE $column LIKE '%$search%'";
    }
    $result=mysqli_query($db, $sql);
    $total_records=0;
    while ($row=mysqli_fetch_row($result))
    {
        $total_records=$row[0];
    }
    $total_pages = ceil($total_records / $rows);
    if($total_pages > 0){
        echo "共有数据<span style='font-weight: bold; color:#73BE73;'>" . $total_records . "</span>条，分为<span style='font-weight: bold; color:#73BE73;'>" . $total_pages . "</span>页";
    }
    mysqli_close($db);
}
