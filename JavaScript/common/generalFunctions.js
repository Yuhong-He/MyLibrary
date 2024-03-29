function setUserCookie(username, password, email, authority, id) {
    document.cookie = "username=" + username;
    document.cookie = username + "Password=" + password.length;
    document.cookie = username + "Email=" + email;
    document.cookie = username + "Auth=" + authority;
    document.cookie = username + "Id=" + id;
}

function getCookie(cName) {
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
    document.cookie = username + "Password=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = username + "Email=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = username + "Auth=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = username + "Id=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

function displayAfterLoad() {
    setTimeout(() => userDisplay(), 50);
    setTimeout(() => adminDisplay(), 50);
    setTimeout(() => superAdminDisplay(), 50);
}

function userDisplay() {
    const lang = getLang();
    const username = getCookie("username");
    if(username === "" || username === null){
        $("#username_btn").html("");
        $("#nav_profile").css("display", "none");
        $("#nav_request").css("display", "none");
        $("#nav_manage").css("display", "none");
        $("#loginLogout_btn").html(arrLang[lang]["LOGIN"]);
    } else {
        $("#username_btn").html(username);
        $("#nav_profile").css("display", "block");
        $("#nav_request").css("display", "block");
        $("#nav_manage").css("display", "none");
        $("#loginLogout_btn").html(arrLang[lang]["LOGOUT"]);
    }
}

function adminDisplay() {
    const username = getCookie("username");
    const auth = getCookie(username + "Auth");
    if(auth === "2" || auth === "3"){
        $("#nav_manage").css("display", "block");
        $("#add_new_book_btn").css("visibility", "visible");
        $("#add_new_category_btn").css("visibility", "visible");
    } else {
        $("#nav_manage").css("display", "none");
        $("#add_new_book_btn").css("visibility", "hidden");
        $("#add_new_category_btn").css("visibility", "hidden");
    }
}

function superAdminDisplay() {
    const username = getCookie("username");
    const auth = getCookie(username + "Auth");
    if(auth === "3"){
        $("#nav_manage_user").css("display", "block");
    } else {
        $("#nav_manage_user").css("display", "none");
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

$('.dropdown-toggle').dropdown();

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

function build_page_info(result){
    const page_info_area = $("#page_info_area");
    page_info_area.empty();
    if(result.count > 0) {
        page_info_area.append(
            arrLang[lang]["LIST_PAGE_INFO1"] +
            "<span style='font-weight: bold; color:#73BE73;'>" +
            result.count +
            "</span>" +
            arrLang[lang]["LIST_PAGE_INFO2"] +
            "<span style='font-weight: bold; color:#73BE73;'>" +
            result.pages +
            "</span>" +
            arrLang[lang]["LIST_PAGE_INFO3"]
        );
    }
}

function build_page_nav(result) {
    $("#page_nav_area").empty();
    if(result.count > 0) {
        let ul = $("<ul></ul>").addClass("pagination");
        let firstPageA = $("<a></a>").append(arrLang[lang]["FIRST_PAGE"]).attr("href", "#");
        let firstPageLi = $("<li></li>").append(firstPageA);
        let prePageA = $("<a></a>").append("&laquo;").attr("href", "#");
        let prePageLi = $("<li></li>").append(prePageA);
        if (page === 1) {
            firstPageA.removeAttr("href", "#");
            firstPageLi.addClass("disabled");
            prePageA.removeAttr("href", "#");
            prePageLi.addClass("disabled");
        } else {
            firstPageLi.click(function () {
                page = 1;
                to_page();
            });
            prePageLi.click(function () {
                page = page - 1;
                to_page();
            });
        }
        ul.append(firstPageLi).append(prePageLi);

        $.each(result.navigatePageNums, function (index, item) {
            let numA = $("<a></a>").append(item).attr("href", "#");
            let numLi = $("<li></li>").append(numA);
            if (page === item) {
                numA.css("z-index", 0);
                numLi.addClass("active");
            }
            numLi.click(function () {
                page = item;
                to_page();
            });
            ul.append(numLi)
        });

        let nextPageA = $("<a></a>").append("&raquo;").attr("href", "#");
        let nextPageLi = $("<li></li>").append(nextPageA);
        let lastPageA = $("<a></a>").append(arrLang[lang]["LAST_PAGE"]).attr("href", "#");
        let lastPageLi = $("<li></li>").append(lastPageA);
        if (page === result.pages) {
            nextPageA.removeAttr("href", "#");
            nextPageLi.addClass("disabled");
            lastPageA.removeAttr("href", "#");
            lastPageLi.addClass("disabled");
        } else {
            nextPageLi.click(function () {
                page = page + 1;
                to_page();
            });
            lastPageLi.click(function () {
                page = result.pages;
                to_page();
            });
        }
        ul.append(nextPageLi).append(lastPageLi);

        let nav = $("<nav></nav>").append(ul);
        nav.appendTo("#page_nav_area");
    }
}

$(document).on("click", ".cat-link", function(){
    const cat_id = $(this).attr("cat-id");
    $.ajax({
        url:"../PHP/sessionCatId.php",
        method:"POST",
        data:{
            id: cat_id
        },
        success:function(result){
            if(result.code === 200) {
                window.location.replace("category.html");
            } else if(result.code === 201) {
                $("#general_fail_info").html(arrLang[lang]["CATEGORY_NOT_EXIST"]);
                $("#general_fail").css("display", "block");
            }
        }
    });
});

$(document).on("click", "#close_general_fail", function(){
    $("#general_fail").css("display", "none");
});

function generalDocumentReady() {
    $(document).ready(function(){
        $("#headerContent").load("header.html");
        $("#footerContent").load("footer.html");
        setTimeout(() => navBlockColor(), 50);
        to_page();
    });
}

function active_rows_selector(rows) {
    $("#display_5_rows").removeClass("active");
    $("#display_10_rows").removeClass("active");
    $("#display_20_rows").removeClass("active");
    $("#display_50_rows").removeClass("active");
    $("#" + rows).addClass("active");
}

$(document).on("click", "#display_5_rows", function(){
    page = 1;
    rows = 5;
    to_page();
    active_rows_selector('display_5_rows');
});

$(document).on("click", "#display_10_rows", function(){
    page = 1;
    rows = 10;
    to_page();
    active_rows_selector('display_10_rows');
});

$(document).on("click", "#display_20_rows", function(){
    page = 1;
    rows = 20;
    to_page();
    active_rows_selector('display_20_rows');
});

$(document).on("click", "#display_50_rows", function(){
    page = 1;
    rows = 50;
    to_page();
    active_rows_selector('display_50_rows');
});

$(function() {
    $("#search_box").bind("input propertychange", function () {
        let search_value = $("#search_box").val().trim();
        search = search_value;
        if(search_value !== "") {
            $("#clean_search_box").css("display", "block");
        } else {
            $("#clean_search_box").css("display", "none");
        }
        page = 1;
        to_page();
    });
});

$(document).on("click", "#clean_search_box", function(){
    search = "";
    $("#search_box").val("");
    $("#clean_search_box").css("display", "none");
    page = 1;
    to_page();
});

function add_book_category_select2() {
    let select2_language;
    if(getLang() === "hans") {
        select2_language = "zh-CN";
    } else if (getLang() === "hant") {
        select2_language = "zh-TW";
    } else {
        select2_language = "en";
    }
    $('#new_book_category').select2({
        ajax: {
            url: "../PHP/getCategory.php",
            dataType: 'json',
            type : 'GET',
            delay: 250,
            data: function (params) {
                return {
                    search: params.term,
                    lang: getLang() === "en" ? "en" : "zh"
                };
            },
            processResults: function (result) {
                let allCategory = [];
                $.each(result, function(index, item){
                    const category = {id: item.id, text: item.name};
                    allCategory.push(category);
                })
                return {
                    results: allCategory
                };
            },
            cache: true
        },
        minimumInputLength: 1,
        dropdownParent: $('#addBookModal'),
        language: select2_language
    });
}