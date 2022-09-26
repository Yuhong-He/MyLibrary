<?php
header('Content-Type:text/json;charset=utf-8');
$un = $_POST['username'] ?? '';
$pw = $_POST['password'] ?? '';
$em = $_POST['email'] ?? '';
$unNew = $_POST['newUsername'] ?? '';
$pwNew = $_POST['newPassword'] ?? '';
$emNew = $_POST['newEmail'] ?? '';
$auth = $_POST['authority'] ?? '';
$id = $_POST['id'] ?? '';
session_start();
if(isset($_SESSION["Username"]) && isset($_SESSION[$un ."Id"])) {
    if ($un == $_SESSION["Username"] && $id == $_SESSION[$un ."Id"]) {
        require_once "db.php";
        $sql = "SELECT Banned FROM user WHERE id = $id";
        $result = mysqli_query($db, $sql);
        $banned = "";
        while ($row = mysqli_fetch_array($result)) {
            $banned = $row[0];
        }
        if($banned == "N") {
            if (strlen($unNew) > 2 && strlen($unNew) < 16 &&
                strlen($pwNew) > 4 && strlen($pwNew) < 16 &&
                strlen($emNew) > 0 && strlen($emNew) < 50) {
                if (!preg_match("/[()'\";]/", $emNew)) {
                    $code = 200;
                    $resPassword = mysqli_query($db, "SELECT Password FROM user where UserName = '$un'");
                    $passwordFromDB = "";
                    while ($rewPassword = mysqli_fetch_array($resPassword)) {
                        $passwordFromDB = $rewPassword[0];
                    }
                    if (!password_verify($pw, $passwordFromDB)) {
                        $code = 201;
                    }
                    if ($code != 201 && $un != $unNew) {
                        $resUsername = mysqli_query($db, "SELECT count(UserName) as num FROM user where UserName = '$unNew'");
                        $rewUsername = mysqli_fetch_assoc($resUsername);
                        if ($rewUsername['num'] != 0) {
                            $code = 202;
                        }
                    }
                    if ($code != 201 && $code != 202 && $em != $emNew) {
                        $resEmail = mysqli_query($db, "SELECT count(Email) as num FROM user where Email = '$emNew'");
                        $rewEmail = mysqli_fetch_assoc($resEmail);
                        if ($rewEmail['num'] != 0) {
                            $code = 203;
                        }
                    }
                    if ($code != 201 && $code != 202 && $code != 203) {
                        $encryptPW = password_hash($pwNew, PASSWORD_DEFAULT);
                        $sql = "UPDATE user SET UserName='$unNew', Password='$encryptPW', Email='$emNew' WHERE id='$id'";
                        mysqli_query($db, $sql);
                        $_SESSION["Username"] = $unNew;
                        $_SESSION[$unNew . "Id"] = $id;
                    }
                    mysqli_close($db);
                    $str = array
                    (
                        'code' => $code,
                        'email' => $emNew,
                        'authority' => $auth,
                        'id' => $id
                    );
                } else {
                    $str = array('code' => 204);
                }
            } else {
                echo "Are u trying to do something?\n:(";
            }
        } else {
            $str = array('code' => 402);
        }
    } else {
        $str = array('code' => 401);
    }
} else {
    $str = array('code' => 401);
}
$jsonEncode = json_encode($str);
echo $jsonEncode;
