const lang = getLang();
$(document).ready(function(){
    $(".lang").each(function(index, element) {
        $(this).text(arrLang[lang][$(this).attr("key")]);
    });
    displayAfterLoad();
    setLanguageSelect();
});

$('.dropdown-toggle').dropdown();

function login(){
    reset_form("#loginModel form");
    $("#loginModel").modal({
        backdrop:"static"
    });
}

$("#loginLogout_btn").click(function() {
    const username = getCookie("username");
    if(username===""){
        login();
    } else {
        logout();
    }
});

function logout() {
    $("#logoutModel").modal({
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

$("#username_btn").click(function() {
    window.location.replace("profile.html");
});

$("#signup_btn").click(function() {
    reset_form("#registerModel form");
    $("#registerModel").modal({
        backdrop:"static"
    });
});

function validate_login_form() {
    const userName = $("#userName_login").val();
    if(userName === ""){
        show_validate_msg("#userName_login", "error", arrLang[lang]["ENTER_USERNAME"]);
        return false;
    } else {
        show_validate_msg("#userName_login", "success", "");
    }
    const password = $("#password_login").val();
    if(password === ""){
        show_validate_msg("#password_login", "error", arrLang[lang]["ENTER_PASSWORD"]);
        return false;
    } else {
        show_validate_msg("#password_login", "success", "");
    }
    return true;
}

$("#model_login_btn").click(function() {
    if(!validate_login_form()){
        return false;
    }
    const userName = $("#userName_login").val();
    const password = $("#password_login").val();
    $.ajax({
        url:"../PHP/login.php",
        method:"POST",
        data:{
            username: userName,
            password: password
        },
        success:function(result){
            if(result.code === 200) {
                setCookie(userName, password, result.email, result.authority);
                $("#loginModel").modal('hide');
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

function validate_register_form(userName, password, passwordRepeat, email) {
    const regName = /(^[a-zA-Z]{3,16}$)/;
    if(userName===""||userName===null){
        show_validate_msg("#userName_register", "error", arrLang[lang]["ENTER_USERNAME"]);
        return false;
    } else if(!regName.test(userName)){
        show_validate_msg("#userName_register", "error", arrLang[lang]["INVALID_USERNAME"]);
        return false;
    } else {
        show_validate_msg("#userName_register", "success", "");
    }
    if(password.length < 5){
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
    } else if (!regEmail.test(email)){
        show_validate_msg("#email_register", "error", arrLang[lang]["INVALID_EMAIL"])
        return false;
    } else {
        show_validate_msg("#email_register", "success", "")
    }
    return true;
}

$("#model_register_btn").click(function() {
    const userName = $("#userName_register").val();
    const password = $("#password_register").val();
    const passwordRepeat = $("#password_register_repeat").val();
    const email = $("#email_register").val();
    if(!validate_register_form(userName, password, passwordRepeat, email)){
        return false;
    }
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
                setCookie(userName, password, result.email, result.authority);
                $("#userName_login").val(userName);
                $("#password_login").val(password);
                $("#registerModel").modal('hide');
            } else {
                if(result.code === 202){
                    show_validate_msg("#userName_register", "error", arrLang[lang]["USERNAME_EXIST"]);
                }
                if(result.code === 203){
                    show_validate_msg("#email_register", "error", arrLang[lang]["EMAIL_USED"]);
                }
            }
        }
    });
});

function setLanguageSelect() {
    const language_code = new Map([
        ["en", "select_english"],
        ["hans", "select_hans"],
        ["hant", "select_hant"],
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
    document.getElementById("select_english").className = 'inactive';
    document.getElementById("select_hans").className = 'inactive';
    document.getElementById("select_hant").className = 'inactive';
    document.getElementById(language_id).className = 'active';
}

$("#select_english").click(function() {
    document.cookie="lang=en";
    chooseLanguage("select_english");
    location.reload();
});

$("#select_hans").click(function() {
    document.cookie="lang=hans";
    chooseLanguage("select_hans");
    location.reload();
});

$("#select_hant").click(function() {
    document.cookie="lang=hant";
    chooseLanguage("select_hant");
    location.reload();
});