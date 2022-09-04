function setCookie(username, password, email, authority, id) {
    document.cookie = "username=" + username;
    document.cookie = username + "=" + password;
    document.cookie = username + "Email=" + email;
    document.cookie = username + "Auth=" + authority;
    document.cookie = username + "Id=" + id;
}

function getCookie(cName)
{
    const name = cName + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i<ca.length; i++)
    {
        const c = ca[i].trim();
        if (c.indexOf(name)===0) return c.substring(name.length,c.length);
    }
    return "";
}

function destroyCookie(username) {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = username + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = username + "Email=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = username + "Auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = username + "Id=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

function displayAfterLoad() {
    setTimeout(() => userDisplay(), 50);
    setTimeout(() => adminDisplay(), 50);
    setTimeout(() => webMasterDisplay(), 50);
}

function userDisplay() {
    const lang = getLang();
    const username = getCookie("username");
    if(username === "" || username === null){
        $("#username_btn").html("");
        $("#nav_profile").css("display", "none");
        $("#nav_obtain").css("display", "none");
        $("#nav_manage").css("display", "none");
        $("#loginLogout_btn").html(arrLang[lang]["LOGIN"]);
    } else {
        $("#username_btn").html(username);
        $("#nav_profile").css("display", "block");
        $("#nav_obtain").css("display", "block");
        $("#nav_manage").css("display", "none");
        $("#loginLogout_btn").html(arrLang[lang]["LOGOUT"]);
    }
}

function adminDisplay() {
    const username = getCookie("username");
    const auth = getCookie(username + "Auth");
    if(auth === "2" || auth === "3"){
        $("#nav_manage").css("display", "block");
    } else {
        $("#nav_manage").css("display", "none");
    }
}

function webMasterDisplay() {
    const username = getCookie("username");
    const auth = getCookie(username + "Auth");
    if(auth === "3"){
        $("#nav_manage_user").css("display", "block");
    } else {
        $("#nav_manage_user").css("display", "none");
    }
}

function extendMainContainerHeight() {
    const bodyHeight = $("body").height();
    const footerHeight = $("footer").height();
    const iHeight = document.documentElement.clientHeight || document.body.clientHeight;
    $("#extended_empty_div").remove();
    if (bodyHeight > (iHeight - footerHeight * 2)) {
        $("#main_container").append('<div id="extended_empty_div" style="height: ' + 5 * footerHeight + 'px"></div>');
    }
}

function reset_form(element) {
    $(element)[0].reset();
    $(element).find("*").removeClass("has-error has-success");
    $(element).find(".help-block").text("");
}

function show_validate_msg(element, status, msg) {
    $(element).parent().removeClass("has-success has-error");
    $(element).next("span").text("");
    if("success"===status){
        $(element).parent().addClass("has-success");
        $(element).next("span").text("");
    } else if("error"===status){
        $(element).parent().addClass("has-error");
        $(element).next("span").text(msg);
    }
}

$(function () {
    $('[data-toggle="popover"]').popover()
})

function getLang() {
    let lang = getCookie("lang");
    if(lang === "") {
        switch (navigator.language.toLowerCase()) {
            case "zh-hans":
                lang = "hans";
                break;
            case "zh-cn":
                lang = "hans";
                break;
            case "zh":
                lang = "hans";
                break;
            case "zh-hant":
                lang = "hant";
                break;
            case "zh-hk":
                lang = "hant";
                break;
            case "zh-tw":
                lang = "hant";
                break;
            default:
                lang = "en";
                break;
        }
    }
    return lang;
}