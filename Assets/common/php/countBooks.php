<?php
require_once "db.php";
$sql = "SELECT * FROM books";
$result=mysqli_query($db, $sql);
while ($row=mysqli_fetch_row($result))
{
    $count[]=$row[1];
}
$total=sizeof($count);
mysqli_close($db);
echo $total;