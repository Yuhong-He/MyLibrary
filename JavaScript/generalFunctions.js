function displayAfterLoad() {
    setTimeout(() => userDisplay(), 50);
    setTimeout(() => adminDisplay(), 50);
}

function userDisplay() {
    const lang = getLang();
    const username = getCookie("username");
    if(username===""||username===null){
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
    if(auth==="2"){
        const manageBlock = document.getElementById('nav_manage');
        manageBlock.style.display = "block";
    } else {
        const manageBlock = document.getElementById('nav_manage');
        manageBlock.style.display = "none";
    }
}

function extendMainContainerHeight() {
    const bodyHeight = $("body").height();
    const footerHeight = $("footer").height();
    const iHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (bodyHeight > (iHeight - footerHeight * 2)) {
        $("#extended_empty_div").remove();
        $("#main_container").append('<div id="extended_empty_div" style="height: ' + 5 * footerHeight + 'px"></div>');
    } else {
        $("#extended_empty_div").remove();
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