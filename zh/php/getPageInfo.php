<?php
$rows=$_GET['rows'];
$table=$_GET['table'];
require_once "../../Assets/common/php/db.php";
$sql = "SELECT * FROM $table ORDER BY hscode DESC";
$result=mysqli_query($db, $sql);
$total_records = mysqli_num_rows($result);
$total_pages = ceil($total_records / $rows);
echo "共有数据<span style='font-weight: bold; color:#73BE73;'>" . $total_records . "</span>条，分为<span style='font-weight: bold; color:#73BE73;'>" . $total_pages . "</span>页";
mysqli_close($db);