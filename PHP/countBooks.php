<?php
require_once "db.php";
$sql = "SELECT COUNT(*) FROM books";
$result=mysqli_query($db, $sql);
$total=0;
while ($row=mysqli_fetch_row($result))
{
    $total=$row[0];
}
mysqli_close($db);
echo $total;