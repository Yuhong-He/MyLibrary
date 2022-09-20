<?php
header('Content-Type:text/json;charset=utf-8');
$un = $_POST['username'] ?? '';
$pw = $_POST['password'] ?? '';
$em = $_POST['email'] ?? '';
if(strlen($un) > 2 && strlen($un) < 16 &&
    strlen($pw) > 4 && strlen($pw) < 16 &&
    strlen($em) > 0 && strlen($em) < 50) {
    if(!preg_match("/[()'\";]/", $em)) {
        require_once "db.php";
        $code = 200;
        $resUsername = mysqli_query($db, "SELECT count(UserName) as num FROM user where UserName = '$un'");
        $rewUsername = mysqli_fetch_assoc($resUsername);
        if ($rewUsername['num'] != 0) {
            $code = 202;
        }
        if ($code != 202) {
            $resEmail = mysqli_query($db, "SELECT count(Email) as num FROM user where Email = '$em'");
            $rewEmail = mysqli_fetch_assoc($resEmail);
            if ($rewEmail['num'] != 0) {
                $code = 203;
            }
        }
        if ($code != 202 && $code != 203) {
            $encryptPW = password_hash($pw, PASSWORD_DEFAULT);
            $sql = "INSERT INTO user (UserName, Password, Email, Authority) VALUES ('$un', '$encryptPW', '$em', 1)";
            mysqli_query($db, $sql);
        }
        mysqli_close($db);
        $str = array
        (
            'code' => $code,
            'email' => $em,
            'authority' => 1
        );
        $jsonEncode = json_encode($str);
        echo $jsonEncode;
    } else {
        echo json_encode(array('code' => 204));
    }
} else {
    echo "Are u trying to do something?\n:(";
}
