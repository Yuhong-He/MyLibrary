<?php
header('Content-Type:text/json;charset=utf-8');
$id=$_GET['id'];
require_once "db.php";
$sql = "SELECT * FROM books WHERE id = $id";
$result=mysqli_query($db, $sql);
$author = "";
$title = "";
$location = "";
$publisher = "";
$year = "";
$code = "";
while($row = mysqli_fetch_array($result))
{
    $author = $row['Author'];
    $title = $row['Title'];
    $location = $row['Location'];
    $publisher = $row['Publisher'];
    $year = $row['Year'];
    $code = $row['Code'];
}
mysqli_close($db);
$wikipedia = generateWikipediaReference($author, $title, $location, $publisher, $year, $code);
$gbt7714 = generateGBTReference($author, $title, $location, $publisher, $year);
$str = array
(
    'wikipedia'=>$wikipedia,
    'gbt7714'=>$gbt7714
);
$jsonEncode = json_encode($str);
echo $jsonEncode;

function generateWikipediaReference($author, $title, $location, $publisher, $year, $code): string
{
    if($author != "") {
        $ref_name = refName($author, $year);
        $wp_reference = "<ref name=\"" .$ref_name ."\">{{cite book ";
        $cleaned_author = cleanAuthorForWP($author);
        $wp_reference = $wp_reference .$cleaned_author;
    } else {
        $ref_name = refName($title, $year);
        $wp_reference = "<ref name=\"" .$ref_name ."\">{{cite book ";
    }
    $wp_reference = $wp_reference ."|title=" .$title ." ";
    if($location != "") {
        $wp_reference = $wp_reference ."|location=" .$location ." ";
    }
    if($publisher != "") {
        $wp_reference = $wp_reference ."|publisher=" .$publisher ." ";
    }
    if($year != "") {
        if(strlen($year) > 4) {
            $origin_year = substr($year, 0, 4);
            $republished_year = substr($year, 11, 4);
            $wp_reference = $wp_reference ."|year=" .$republished_year ." |orig-year=" .$origin_year ." ";
        } else {
            $wp_reference = $wp_reference ."|year=" .$year ." ";
        }
    }
    if($code != "") {
        $cleaned_code = cleanCodeForWP($code);
        $wp_reference = $wp_reference .$cleaned_code ." ";
    }
    return $wp_reference ."}}</ref>{{rp|}}";
}

function cleanCodeForWP($code): string
{
    $result = "";
    $new_code = str_replace("-", '', $code);
    $new_code = str_replace("·", '', $new_code);
    $code_nums = str_split($new_code);
    if(sizeof($code_nums) > 9) {
        $result = $result ." |isbn=" .$code;
    }
    else{
        $result = $result ." |csbn=" .$code;
    }

    if(sizeof($code_nums) > 9) {
        $arr_isbn = $code_nums;
        if(sizeof($arr_isbn) == 10) {
            $check_digit = (1*$arr_isbn[0] + 2*$arr_isbn[1] + 3*$arr_isbn[2] + 4*$arr_isbn[3] + 5*$arr_isbn[4] + 6*$arr_isbn[5]
                    + 7*$arr_isbn[6] + 8*$arr_isbn[7] + 9*$arr_isbn[8]) % 11;
            if($check_digit == 10) {
                $check_digit='X';
            }
            if($check_digit!=$arr_isbn[9]) {
                $result = $result ." |ignore-isbn-error=true";
            }
        }
        else if(sizeof($arr_isbn) == 13) {
            $check_digit=(1*$arr_isbn[0] + 3*$arr_isbn[1] + 1*$arr_isbn[2] + 3*$arr_isbn[3] + 1*$arr_isbn[4] + 3*$arr_isbn[5]
                    + 1*$arr_isbn[6] + 3*$arr_isbn[7] + 1*$arr_isbn[8] + 3*$arr_isbn[9] + 1*$arr_isbn[10] + 3*$arr_isbn[11]) % 10;
            if($check_digit != 0) {
                $check_digit = 10 - $check_digit;
            }
            if($check_digit != $arr_isbn[12]) {
                $result = $result ." |ignore-isbn-error=true";
            }
        }
    }
    return $result;
}

function cleanAuthorForWP($author): string
{
    if(substr_count($author, "; ") > 0) {
        $cleaned_author = "|author1=" .$author;
        for($i = 2; $i < substr_count($author, "; ") + 2; $i++) {
            $cleaned_author=preg_replace("/; /", " |author" .$i ."=", $cleaned_author, 1);
        }
        $cleaned_author = $cleaned_author ." ";
    } else {
        $cleaned_author = "|author=" .$author ." ";
    }
    return $cleaned_author;
}

function refName($name, $year): string
{
    $first = substr($name, 0, 3);
    return $first .$year;
}

function generateGBTReference($author, $title, $location, $publisher, $year): string
{
    $gbt_reference = "";
    if($author != "") {
        $cleaned_author = cleanAuthorForGBT($author);
        $gbt_reference = $gbt_reference .$cleaned_author ."．";
    }
    $gbt_reference = $gbt_reference .$title ."[M]．";
    if($location != "") {
        $gbt_reference = $gbt_reference .$location ."：";
    } else if($publisher != "" && (strpos($publisher, "内部") === false)) {
        $gbt_reference = $gbt_reference ."[出版地不详]：";
    }
    if($publisher != "" && $year != "") {
        $gbt_reference = $gbt_reference .$publisher ."，";
    } else if($year != "") {
        $gbt_reference = $gbt_reference ."[出版者不详]，";
    } else {
        $gbt_reference = $gbt_reference ."[出版者不详]．";
    }
    if($year != "") {
        if(strlen($year) > 4) {
            $year = substr($year, 11, 4);
        }
        $gbt_reference = $gbt_reference .$year ."．";
    }
    return $gbt_reference;
}

function cleanAuthorForGBT($author)
{
    $cleaned_author = preg_replace("/[;,]/","，", $author);
    $cleaned_author = str_replace("等 ", '等  ', $cleaned_author);
    $matched_words[] = [
        ' 本篇主编', ' 重新整理', ' 点校主编', ' 分册主编', ' 搜集整理', ' 执行主编', ' 纂录校订', ' 总主编',
        ' 编纂', ' 编撰', ' 编著', ' 编辑', ' 编校', ' 编译', ' 补修', ' 重修', ' 创辑', ' 补注', ' 抄辑', ' 点校',
        ' 校补', ' 校点', ' 校订', ' 校理', ' 校勘', ' 校释', ' 校注', ' 会证',
        ' 搜集', ' 审定', ' 同纂', ' 协修', ' 修抄', ' 修纂', ' 续修', ' 续纂', ' 译注', ' 原校', ' 原译', ' 原纂',
        ' 整理', ' 中译', ' 主编', ' 主纂', ' 增编', ' 增订', ' 增校', ' 增辑', ' 增修', ' 总编', ' 总纂', ' 纂辑', ' 纂修',
        ' 编', ' 补', '等 ', ' 辑', ' 校', ' 修', ' 译', ' 著', ' 注', ' 撰', ' 纂',
        " "
    ];
    foreach ($matched_words as $key => $value) {
        $cleaned_author = str_replace($value, '', $cleaned_author);
    }
    if(substr_count($cleaned_author, "，") > 2) {
        $result = str_n_pos($cleaned_author, "，", 3);
        $cleaned_author = substr($cleaned_author, 0, $result);
        $cleaned_author = $cleaned_author ."，等";
    }
    return $cleaned_author;
}

function str_n_pos($str, $find, $n){
    $pos_val = 0;
    for ($i = 1; $i <= $n; $i++){
        $pos = strpos($str, $find);
        $str = substr($str, $pos + 1);
        $pos_val = $pos + $pos_val + 1;
    }
    return $pos_val - 1;
}