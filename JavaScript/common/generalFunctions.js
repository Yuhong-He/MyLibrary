function setCookie(username, password, email, authority, id) {
    document.cookie="username=" + username;
    document.cookie=username + "=" + password;
    document.cookie=username + "Email=" + email;
    document.cookie=username + "Auth=" + authority;
    document.cookie=username + "Id=" + id;
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
        const usernameReplaceLogin = document.getElementById('username_btn');
        usernameReplaceLogin.innerHTML = "";
        const usernameBlock = document.getElementById('nav_profile');
        usernameBlock.style.display = "none";
        const obtainBlock = document.getElementById('nav_obtain');
        obtainBlock.style.display = "none";
        const manageBlock = document.getElementById('nav_manage');
        manageBlock.style.display = "none";
        const loginLogout = document.getElementById('loginLogout_btn');
        loginLogout.innerHTML = arrLang[lang]["LOGIN"];
    } else {
        const usernameReplaceLogin = document.getElementById('username_btn');
        usernameReplaceLogin.innerHTML = username;
        const usernameBlock = document.getElementById('nav_profile');
        usernameBlock.style.display = "block";
        const obtainBlock = document.getElementById('nav_obtain');
        obtainBlock.style.display = "block";
        const manageBlock = document.getElementById('nav_manage');
        manageBlock.style.display = "none";
        const loginLogout = document.getElementById('loginLogout_btn');
        loginLogout.innerHTML = arrLang[lang]["LOGOUT"];
    }
}

function adminDisplay() {
    const username = getCookie("username");
    const auth = getCookie(username + "Auth");
    if(auth === "2" || auth === "3"){
        const manageBlock = document.getElementById('nav_manage');
        manageBlock.style.display = "block";
    } else {
        const manageBlock = document.getElementById('nav_manage');
        manageBlock.style.display = "none";
    }
}

function webMasterDisplay() {
    const username = getCookie("username");
    const auth = getCookie(username + "Auth");
    if(auth === "3"){
        const manageBlock = document.getElementById('nav_manage_user');
        manageBlock.style.display = "block";
    } else {
        const manageBlock = document.getElementById('nav_manage_user');
        manageBlock.style.display = "none";
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