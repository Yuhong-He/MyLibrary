<?php
$page=$_GET['page'];
$rows=$_GET['rows'];
$table=$_GET['table'];
require_once "../../Assets/common/php/db.php";
$sql = "SELECT * FROM $table ORDER BY hscode DESC";
$result=mysqli_query($db, $sql);
$total_records = mysqli_num_rows($result);
$total_pages = ceil($total_records / $rows);
echo "<ul class='pagination'>";
if($page == 1) {
    echo "<li class='disabled'><span>首页</span></li>";
    echo "<li class='disabled'><span aria-hidden='true'>&laquo;</span></li>";
} else {
    echo "<li onclick='to_page(1)'><a href='#'>首页</a></li>";
    echo "<li onclick='to_page(" . ($page - 1) . ")'><a href='#'><span aria-hidden='true'>&laquo;</span></a></li>";
}
if($page == 1) {
    echo "<li class='active'><a href='#' style='z-index: 0'>1</a></li>";
    echo "<li onclick='to_page(2)'><a href='#'>2</a></li>";
    echo "<li onclick='to_page(3)'><a href='#'>3</a></li>";
    echo "<li onclick='to_page(4)'><a href='#'>4</a></li>";
    echo "<li onclick='to_page(5)'><a href='#'>5</a></li>";
} else if($page == 2) {
    echo "<li onclick='to_page(1)'><a href='#'>1</a></li>";
    echo "<li class='active'><a href='#' style='z-index: 0'>2</a></li>";
    echo "<li onclick='to_page(3)'><a href='#'>3</a></li>";
    echo "<li onclick='to_page(4)'><a href='#'>4</a></li>";
    echo "<li onclick='to_page(5)'><a href='#'>5</a></li>";
} else if($page == $total_pages) {
    echo "<li onclick='to_page(" . ($total_pages - 4) . ")'><a href='#'>" . ($total_pages - 4) . "</a></li>";
    echo "<li onclick='to_page(" . ($total_pages - 3) . ")'><a href='#'>" . ($total_pages - 3) . "</a></li>";
    echo "<li onclick='to_page(" . ($total_pages - 2) . ")'><a href='#'>" . ($total_pages - 2) . "</a></li>";
    echo "<li onclick='to_page(" . ($total_pages - 1) . ")'><a href='#'>" . ($total_pages - 1) . "</a></li>";
    echo "<li class='active'><a href='#' style='z-index: 0'>" . $total_pages . "</a></li>";
} else if($page == $total_pages - 1) {
    echo "<li onclick='to_page(" . ($total_pages - 4) . ")'><a href='#'>" . ($total_pages - 4) . "</a></li>";
    echo "<li onclick='to_page(" . ($total_pages - 3) . ")'><a href='#'>" . ($total_pages - 3) . "</a></li>";
    echo "<li onclick='to_page(" . ($total_pages - 2) . ")'><a href='#'>" . ($total_pages - 2) . "</a></li>";
    echo "<li class='active'><a href='#' style='z-index: 0'>" . ($total_pages - 1) . "</a></li>";
    echo "<li onclick='to_page(" . $total_pages . ")'><a href='#'>" . $total_pages . "</a></li>";
} else {
    echo "<li onclick='to_page(" . ($page - 2) . ")'><a href='#'>" . ($page - 2) . "</a></li>";
    echo "<li onclick='to_page(" . ($page - 1) . ")'><a href='#'>" . ($page - 1) . "</a></li>";
    echo "<li class='active'><a href='#' style='z-index: 0'>" . $page . "</a></li>";
    echo "<li onclick='to_page(" . ($page + 1) . ")'><a href='#'>" . ($page + 1) . "</a></li>";
    echo "<li onclick='to_page(" . ($page + 2) . ")'><a href='#'>" . ($page + 2) . "</a></li>";
}
if($page == $total_pages) {
    echo "<li class='disabled'><span>末页</span></li>";
    echo "<li class='disabled'><span aria-hidden='true'>&raquo;</span></li>";
} else {
    echo "<li onclick='to_page(" . ($page + 1) . ")'><a href='#'><span aria-hidden='true'>&raquo;</span></a></li>";
    echo "<li onclick='to_page(" . $total_pages . ")'><a href='#'>末页</a></li>";
}
echo "</ul>";
mysqli_close($db);