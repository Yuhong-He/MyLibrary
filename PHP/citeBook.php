<?php
header('Content-Type:text/json;charset=utf-8');
$id = $_GET['id'] ?? '';
if((is_numeric($id)) && ($id > 0)) {
    require_once "db.php";
    $sql = "SELECT * FROM books WHERE id = $id";
    $result=mysqli_query($db, $sql);
    $check = false;
    while($row = mysqli_fetch_array($result))
    {
        $author = $row['Author'];
        $title = $row['Title'];
        $location = $row['Location'];
        $publisher = $row['Publisher'];
        $year = $row['Year'];
        $code = $row['Code'];
        $check = true;
    }
    mysqli_close($db);
    if($check) {
        $wikipedia = generateWikipediaReference($author, $title, $location, $publisher, $year, $code);
        $gbt7714 = generateGBTReference($author, $title, $location, $publisher, $year);
        $str = array
        (
            'wikipedia'=>$wikipedia,
            'gbt7714'=>$gbt7714
        );
        $jsonEncode = json_encode($str);
        echo $jsonEncode;
    } else {
        echo "Are u trying to do something?\n:(";
    }
} else {
    echo "Are u trying to do something?\n:(";
}

function generateWikipediaReference($author, $title, $location, $publisher, $year, $code): string
{
    if($author != "") {
        $ref_name = refName($author, $year);
        $cleaned_author = cleanAuthorForWP($author);
        $wp_reference = "<ref name=\"" .$ref_name ."\">{{cite book " .$cleaned_author;
    } else {
        $wp_reference = "<ref name=\"" .$title ."\">{{cite book ";
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

function refName($author, $year): string
{
    $first_author_before_trim = cleanAuthorForGBT($author);
    if(substr_count($first_author_before_trim, "，") > 0) {
        $first_comma_digit = strpos($first_author_before_trim, "，");
        $first_author = substr($first_author_before_trim, 0, $first_comma_digit);
    } else {
        $first_author = $first_author_before_trim;
    }
    return $first_author .substr($year, 0, 4);
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

function cleanAuthorForGBT($author): string
{
    $cleaned_author_array = explode("; ", $author);
    for($i = 0; $i < sizeof($cleaned_author_array); $i++) {
        if(strpos($cleaned_author_array[$i], " ")) {
            $spaceDigits = strripos($cleaned_author_array[$i], " ", 0);
            $cleaned_author_array[$i] = substr($cleaned_author_array[$i], 0, $spaceDigits);
        }
        if(substr($cleaned_author_array[$i], -3) == "等") {
            $cleaned_author_array[$i] = substr($cleaned_author_array[$i], 0, -3);
        }
    }
    $cleaned_author_string = implode("，", $cleaned_author_array);
    $cleaned_author_string = preg_replace("/[,]/","，", $cleaned_author_string);
    if(substr_count($cleaned_author_string, "，") > 2) {
        $result = str_n_pos($cleaned_author_string, "，", 3);
        $cleaned_author_string = substr($cleaned_author_string, 0, $result);
        $cleaned_author_string = $cleaned_author_string ."，等";
    }
    return $cleaned_author_string;
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