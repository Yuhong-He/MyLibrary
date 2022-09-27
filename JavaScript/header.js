const lang = getLang();
$(document).ready(function(){
    $(".lang").each(function(index, element) {
        $(this).text(arrLang[lang][$(this).attr("key")]);
    });
    displayAfterLoad();
    setLanguageSelect();
});

function login(){
    reset_form("#loginModal form");
    $("#loginModal").modal({
        backdrop:"static"
    });
}

$("#modal_login_btn").click(function() {
    const username = $("#userName_login").val().trim();
    if(username === ""){
        show_validate_msg("#userName_login", "error", arrLang[lang]["ENTER_USERNAME"]);
        return false;
    } else if(username.length > 15) {
        show_validate_msg("#userName_login", "error", arrLang[lang]["USERNAME_TOO_LONG"]);
        return false;
    } else {
        show_validate_msg("#userName_login", "success", "");
    }
    const password = $("#password_login").val().trim();
    if(password === ""){
        show_validate_msg("#password_login", "error", arrLang[lang]["ENTER_PASSWORD"]);
        return false;
    } else if(password.length > 15) {
        show_validate_msg("#password_login", "error", arrLang[lang]["PASSWORD_TOO_LONG"]);
        return false;
    } else {
        show_validate_msg("#password_login", "success", "");
    }
    $.ajax({
        url:"../PHP/login.php",
        method:"POST",
        data:{
            username: username,
            password: password
        },
        success:function(result){
            if(result.code === 200) {
                setUserCookie(username, password, result.email, result.authority, result.id);
                $("#loginModal").modal('hide');
                location.reload();
            } else {
                if(result.code === 201){
                    show_validate_msg("#password_login", "error", arrLang[lang]["PASSWORD_INCORRECT"]);
                } else if(result.code === 400) {
                    show_validate_msg("#userName_login", "error", arrLang[lang]["USERNAME_NOT_EXIST"]);
                }
            }
        }
    });
});

$("#loginLogout_btn").click(function() {
    getCookie("username") === "" ? login() : logout();
});

function logout() {
    $("#logoutModal").modal({
        backdrop:"static"
    });
}

$("#confirm_logout_btn").click(function(){
    const username = getCookie("username");
    $.ajax({
        url:"../PHP/logout.php",
        method:"POST",
        data:{
            username: username
        },
        success:function(){
            const username = getCookie("username");
            destroyCookie(username);
            location.reload();
        }
    });
});

$("#signup_btn").click(function() {
    reset_form("#registerModal form");
    $("#registerModal").modal({
        backdrop:"static"
    });
});

function validate_register_form(userName, password, passwordRepeat, email) {
    const regName = /(^[a-zA-Z0-9]{3,16}$)/;
    if(userName===""||userName===null){
        show_validate_msg("#userName_register", "error", arrLang[lang]["ENTER_USERNAME"]);
        return false;
    } else if(!regName.test(userName)){
        show_validate_msg("#userName_register", "error", arrLang[lang]["INVALID_USERNAME"]);
        return false;
    } else {
        show_validate_msg("#userName_register", "success", "");
    }
    if(password.length < 5 || password.length > 16){
        show_validate_msg("#password_register", "error", arrLang[lang]["INVALID_PASSWORD"]);
        return false;
    } else {
        show_validate_msg("#password_register", "success", "");
    }
    if(password!==passwordRepeat){
        show_validate_msg("#password_register_repeat", "error", arrLang[lang]["PASSWORD_NOT_MATCH"]);
        return false;
    } else {
        show_validate_msg("#password_register_repeat", "success", "");
    }
    const regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    if(email === ""){
        show_validate_msg("#email_register", "error", arrLang[lang]["ENTER_EMAIL"]);
        return false;
    } else if (email.length > 50){
        show_validate_msg("#email_register", "error", arrLang[lang]["EMAIL_TOO_LONG"])
        return false;
    } else if (!regEmail.test(email)){
        show_validate_msg("#email_register", "error", arrLang[lang]["INVALID_EMAIL"])
        return false;
    } else {
        show_validate_msg("#email_register", "success", "")
    }
    return true;
}

$("#modal_register_btn").click(function() {
    const userName = $("#userName_register").val();
    const password = $("#password_register").val();
    const passwordRepeat = $("#password_register_repeat").val();
    const email = $("#email_register").val();
    validate_register_form(userName, password, passwordRepeat, email);
    $.ajax({
        url:"../PHP/register.php",
        method:"POST",
        data:{
            username: userName,
            password: password,
            email: email
        },
        success:function(result){
            if(result.code === 200) {
                setUserCookie(userName, password, result.email, result.authority);
                $("#userName_login").val(userName);
                $("#password_login").val(password);
                $("#registerModal").modal('hide');
            } else {
                if(result.code === 202) {
                    show_validate_msg("#userName_register", "error", arrLang[lang]["USERNAME_EXIST"]);
                } else if(result.code === 203) {
                    show_validate_msg("#email_register", "error", arrLang[lang]["EMAIL_USED"]);
                } else if(result.code === 204) {
                    show_validate_msg("#email_register", "error", arrLang[lang]["EMAIL_INVALID"]);
                }
            }
        }
    });
});

function setLanguageSelect() {
    const language_code = new Map([
        ["en", "select_english"],
        ["hans", "select_hans"],
        ["hant", "select_hant"]
    ]);
    if(lang !== "") {
        chooseLanguage(language_code.get(lang));
    } else {
        switch (navigator.language.toLowerCase()) {
            case "zh-hans":
                chooseLanguage(language_code.get("hans"));
                break;
            case "zh-cn":
                chooseLanguage(language_code.get("hans"));
                break;
            case "zh":
                chooseLanguage(language_code.get("hans"));
                break;
            case "zh-hant":
                chooseLanguage(language_code.get("hant"));
                break;
            case "zh-hk":
                chooseLanguage(language_code.get("hant"));
                break;
            case "zh-tw":
                chooseLanguage(language_code.get("hant"));
                break;
            default:
                chooseLanguage(language_code.get("en"));
                break;
        }
    }
}

function chooseLanguage(language_id) {
    $("#select_english").removeClass("active");
    $("#select_hans").removeClass("active");
    $("#select_hant").removeClass("active");
    $("#" + language_id).addClass("active");
}

$("#select_english").click(function() {
    document.cookie = "lang=en";
    chooseLanguage("select_english");
    location.reload();
});

$("#select_hans").click(function() {
    document.cookie = "lang=hans";
    chooseLanguage("select_hans");
    location.reload();
});

$("#select_hant").click(function() {
    document.cookie = "lang=hant";
    chooseLanguage("select_hant");
    location.reload();
});

$("#username_btn").click(function() {
    if(getCookie("username") !== "") {
        window.location.replace("profile.html");
    } else {
        $("#header_warning_message").html(arrLang[lang]["PLEASE_LOGIN"]);
        $("#header_warning").css("display", "block");
    }
});

$("#nav_request").click(function() {
    if(getCookie("username") !== "") {
        reset_form("#requestModal form");
        $("#request_fail").css("display", "none");
        $("#send_to_email").val(getCookie(getCookie("username") + "Email"));
        $("#requestModal").modal({
            backdrop:"static"
        });
    } else {
        $("#header_warning_message").html(arrLang[lang]["PLEASE_LOGIN"]);
        $("#header_warning").css("display", "block");
    }
});

$("#change_email").click(function() {
    window.location.replace("profile.html");
});

$("#confirm_request_btn").click(function() {
    const book_info = $("#book_title").val().trim();
    if(book_info === ""){
        show_validate_msg("#book_title", "error", arrLang[lang]["ENTER_BOOK_YOU_NEED"]);
        return false;
    }
    $.ajax({
        url:"../PHP/addRequest.php",
        method:"POST",
        data:{
            book: book_info,
            user_name: getCookie("username"),
            user_id: getCookie(getCookie("username") + "Id"),
            email: getCookie(getCookie("username") + "Email")
        },
        success:function(result){
            if(result.code === 200) {
                $("#requestModal").modal('hide');
                window.location.replace("my_requests.html");
            } else {
                if(result.code === 201) {
                    show_validate_msg("#book_title", "error", arrLang[lang]["INVALID_BOOK_TITLE"]);
                } else if(result.code === 401) {
                    $("#request_fail_info").html(arrLang[lang]["NO_ACCESS_REQUEST"]);
                    $("#request_fail").css("display", "block");
                } else if(result.code === 402) {
                    $("#request_fail_info").html(arrLang[lang]["YOU_WERE_BANNED"]);
                    $("#request_fail").css("display", "block");
                }
            }
        }
    });
});

$("#close_header_warning").click(function() {
    $("#header_warning").css("display", "none");
});

$("#close_request_fail").click(function() {
    $("#request_fail").css("display", "none");
});