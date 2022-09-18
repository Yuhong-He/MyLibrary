let page = 1;
let rows = 5;
let search = "";
$(document).ready(function(){
    $("#headerContent").load("header.html");
    $("#footerContent").load("footer.html");
    setTimeout(() => navBlockColor(), 50);
    to_page();
    displayAfterLoad();
});

function navBlockColor() {
    $("#nav_books").addClass("active");
    $("#nav_category").addClass("active");
    $("#display_5_rows").addClass("active");
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
        let search_value_before_clean = $("#search_box").val();
        search = search_value_before_clean.replace(/\'/g, "\\'").trim();
        if(search_value_before_clean !== "") {
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

function to_page() {
    $.ajax({
        url:"../PHP/allCategories.php",
        method:"GET",
        data:{
            page: page,
            rows: rows,
            lang: getLang() === "en" ? "en" : "zh",
            search: search
        },
        success:function(result){
            createTableHeader();
            build_categories_table(result);
            build_page_info(result);
            build_page_nav(result);
            extendMainContainerHeight();
        }
    });
}

function createTableHeader() {
    const auth = getCookie(getCookie("username") + "Auth");
    $("#all_categories_table_head").empty();
    const categoryId = $("<th></th>").append(arrLang[lang]["ID"]);
    const categoryName = $("<th></th>").append(arrLang[lang]["CATEGORY_NAME"]);
    const categoryCount = $("<th></th>").append(arrLang[lang]["TOTAL"]);
    const categoryOperate = $("<th></th>").append(arrLang[lang]["OPERATION"]);
    if(auth === "2" || auth === "3") {
        $("<tr></tr>").append(categoryId).append(categoryName).append(categoryCount).append(categoryOperate)
            .appendTo("#all_categories_table_head");
    } else {
        $("<tr></tr>").append(categoryName).append(categoryCount)
            .appendTo("#all_categories_table_head");
    }
}

function build_categories_table(result) {
    const auth = getCookie(getCookie("username") + "Auth");
    if(result.count > 0) {
        $("#all_categories_table_body").empty();
        const category = result.body;
        $.each(category, function(index, item){
            const categoryId = $("<td></td>").append(item.id);
            const categoryName = $("<td></td>").append($("<a></a>")
                .attr("href", "by_category.php?id=" + item.id)
                .append(item.name));
            const categoryTotal = $("<td></td>").append(item.total);
            let editBtn = $("<button></button>").addClass("btn btn-primary btn-sm edit-btn")
                .append($("<span></span>").addClass("glyphicon glyphicon-pencil"));
            editBtn.attr("edit-id", item.id);
            let delBtn = $("<button></button>").addClass("btn btn-danger btn-sm del-btn")
                .append($("<span></span>").addClass("glyphicon glyphicon-trash"));
            delBtn.attr("del-id", item.id);
            const btnTd = $("<td></td>").append(editBtn).append(" ").append(delBtn);
            if(auth === "2" || auth === "3") {
                $("<tr></tr>").append(categoryId).append(categoryName).append(categoryTotal).append(btnTd)
                    .appendTo("#all_categories_table_body");
            } else {
                $("<tr></tr>").append(categoryName).append(categoryTotal)
                    .appendTo("#all_categories_table_body");
            }
        })
    } else {
        if(auth === "2" || auth === "3") {
            document.getElementById("all_categories_table_body").innerHTML=
                "<td colspan='4' style='text-align: center; font-size: large; color: grey;'>" +
                arrLang[lang]["NO_DATA"] +
                "</td>";
        } else {
            document.getElementById("all_categories_table_body").innerHTML=
                "<td colspan='2' style='text-align: center; font-size: large; color: grey;'>" +
                arrLang[lang]["NO_DATA"] +
                "</td>";
        }
    }
}

function build_page_info(result){
    $("#page_info_area").empty();
    if(result.count > 0) {
        $("#page_info_area").append(
            arrLang[lang]["BOOK_PAGE_INFO1"] +
            "<span style='font-weight: bold; color:#73BE73;'>" +
            result.count +
            "</span>" +
            arrLang[lang]["BOOK_PAGE_INFO2"] +
            "<span style='font-weight: bold; color:#73BE73;'>" +
            result.pages +
            "</span>" +
            arrLang[lang]["BOOK_PAGE_INFO3"]
        );
    }
}

function build_page_nav(result){
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

$(document).on("click", "#add_new_category_btn", function(){
    $("#add_category_modal_title").html(arrLang[lang]["ADD_CATEGORY"]);
    reset_form("#addCategoryModal form");
    $("#insert_new_category_btn").css("display", "block");
    $("#update_category_btn").css("display", "none");
    $("#addCategoryModal").modal({
        backdrop: "static"
    });
});

$(document).on("click", "#insert_new_category_btn", function(){
    const id = $("#new_category_id").val().trim();
    if(id === "") {
        show_validate_msg("#new_category_id", "error", arrLang[lang]["CATEGORY_ID_REQUIRED"]);
        return false;
    }
    const regId = /(^[0-9]{6}$)/;
    if(!regId.test(id)) {
        show_validate_msg("#new_category_id", "error", arrLang[lang]["CAT_ID_FORMAT_NOT_MATCH"]);
        return false;
    }
    if(id < 100000) {
        show_validate_msg("#new_category_id", "error", arrLang[lang]["CAT_ID_FORMAT_NOT_MATCH"]);
        return false;
    }
    const zh_name = $("#new_category_zh_name").val().trim();
    if(zh_name === "") {
        show_validate_msg("#new_category_zh_name", "error", arrLang[lang]["CATEGORY_NAME_REQUIRED"]);
        return false;
    }
    const en_name = $("#new_category_en_name").val().trim();
    if(en_name === "") {
        show_validate_msg("#new_category_en_name", "error", arrLang[lang]["CATEGORY_NAME_REQUIRED"]);
        return false;
    }
    $.ajax({
        url:"../PHP/addCategory.php",
        method:"POST",
        data:{
            id: id,
            zh_name: zh_name,
            en_name: en_name,
            rows: rows,
            username: getCookie("username"),
            authority: getCookie(getCookie("username") + "Auth")
        },
        success:function(result){
            if(result.code === 200){
                search = "";
                $("#search_box").val("");
                $("#clean_search_box").css("display", "none");
                page = result.page;
                to_page();
                $("#addCategoryModal").modal('hide');
            } else if(result.code === 201) {
                show_validate_msg("#new_category_id", "error", arrLang[lang]["CATEGORY_ID_REPEAT"]);
            } else if(result.code === 202) {
                show_validate_msg("#new_category_zh_name", "error", arrLang[lang]["CATEGORY_NAME_REPEAT"]);
            } else if(result.code === 203) {
                show_validate_msg("#new_category_en_name", "error", arrLang[lang]["CATEGORY_NAME_REPEAT"]);
            } else if(result.code === 401) {
                $("#add_category_error").html(arrLang[lang]["NO_ACCESS_ADD_CATEGORY"]);
                $("#add_category_fail").css("display", "block");
            } else if(result.code === 402) {
                $("#add_category_error").html(arrLang[lang]["NO_USER_RIGHTS_ADD_BOOK"]);
                $("#add_category_fail").css("display", "block");
            }
        }
    });
});