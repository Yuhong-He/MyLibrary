let page = 1;
let rows = 5;
let search = "";
let total_page = 0;
let total_data = 0;
let cat_id;

$(document).ready(function(){
    $("#headerContent").load("header.html");
    $("#footerContent").load("footer.html");
    setTimeout(() => navBlockColor(), 50);
    to_page();
    add_book_category_select2();
});

function navBlockColor() {
    $("#nav_books").addClass("active");
    $("#nav_category").addClass("active");
    $("#display_5_rows").addClass("active");
}

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

function to_page() {
    $.ajax({
        url:"../PHP/allBooksInCat.php",
        method:"GET",
        data:{
            page: page,
            rows: rows,
            lang: getLang() === "en" ? "en" : "zh",
            search: search
        },
        success:function(result){
            if(result.code === 200) {
                total_page = result.pages;
                total_data = result.count;
                $("#category_title").html(result.extra1);
                cat_id = result.extra2;
                build_books_table(result);
                build_page_info(result);
                build_page_nav(result);
                extendMainContainerHeight();
            } else if(result.code === 201) {
                window.location.replace("all_category.html");
            }
        }
    });
}

function build_books_table(result) {
    if(result.count > 0) {
        $("#cat_books_table_body").empty();
        const book = result.body;
        $.each(book, function(index, item){
            const title = $("<td></td>").append(item.title);
            const author = $("<td></td>").append(item.author);
            const publisher = $("<td></td>").append(item.publisher);
            const year = $("<td></td>").append(item.year);
            const citeBtn = $("<button></button>").addClass("btn btn-default btn-sm cite_btn")
                .append($("<span></span>").addClass("glyphicon glyphicon-book"));
            citeBtn.attr("cite-id", item.id);
            let editBtn = "";
            let delBtn = "";
            if(getCookie(getCookie("username") + "Auth") === "2" ||
                getCookie(getCookie("username") + "Auth") === "3") {
                editBtn = $("<button></button>").addClass("btn btn-primary btn-sm edit-btn")
                    .append($("<span></span>").addClass("glyphicon glyphicon-pencil"));
                editBtn.attr("edit-id", item.id);
                delBtn = $("<button></button>").addClass("btn btn-danger btn-sm del-btn")
                    .append($("<span></span>").addClass("glyphicon glyphicon-trash"));
                delBtn.attr("del-id", item.id);
            }
            const btnTd = $("<td></td>").append(citeBtn).append(" ").append(editBtn).append(" ").append(delBtn);
            $("<tr></tr>").append(title).append(author).append(publisher).append(year).append(btnTd)
                .appendTo("#cat_books_table_body");
        })
    } else {
        $("#cat_books_table_body").html(
            "<td colspan='5' style='text-align: center; font-size: large; color: grey;'>" +
            arrLang[lang]["NO_DATA"] +
            "</td>"
        );
    }
}

$(document).on("click", ".cite_btn", function(){
    const book_id = $(this).attr("cite-id");
    $.ajax({
        url:"../PHP/citeBook.php",
        method:"GET",
        data:{
            id: book_id
        },
        success:function(result){
            $("#wikipedia_template").html(result.wikipedia);
            $("#gbt7714_2015").html(result.gbt7714);
        }
    });
    $("#citeBookModal").modal({
        backdrop: "static"
    });
});

$(document).on("click", "#wikipedia_copy_button", function(){
    const copied_body = $("#wikipedia_template").val();
    if (navigator.clipboard) {
        navigator.clipboard.writeText(copied_body);
    }
});

$(document).on("click", "#gbt7714_copy_button", function(){
    const copied_body = $("#gbt7714_2015").val();
    if (navigator.clipboard) {
        navigator.clipboard.writeText(copied_body);
    }
});

$(document).on("click", ".edit-btn", function(){
    $("#add_book_modal_title").html(arrLang[lang]["EDIT_BOOK"]);
    reset_form("#addBookModal form");
    $("#display_book_repeat_checkbox").css("display", "none");
    $("#display_code_repeat_checkbox").css("display", "none");
    $("#add_book_fail").css("display", "none");
    const book_id = $(this).attr("edit-id");
    $("#insert_new_book_btn").css("display", "none");
    $("#update_book_btn").css("display", "block").attr("book-id", book_id);
    $.ajax({
        url:"../PHP/getOneBook.php",
        method:"GET",
        data:{
            id: book_id,
            lang: getLang() === "en" ? "en" : "zh"
        },
        success:function(result){
            $("#new_book_author").val(result.author);
            $("#new_book_title").val(result.title);
            $("#new_book_location").val(result.location);
            $("#new_book_publisher").val(result.publisher);
            $("#new_book_year").val(result.year);
            $("#new_book_code").val(result.code);
            $("#select2-new_book_category-container").html(result.catName);
            $("#new_book_category").html('<option value="' + result.catId + '">' + result.catName + '</option>');
        }
    });
    $("#addBookModal").modal({
        backdrop: "static"
    });
});

$(document).on("click", "#update_book_btn", function(){
    const title = $("#new_book_title").val().trim();
    const book_id = $(this).attr("book-id");
    if(title === "") {
        show_validate_msg("#new_book_title", "error", arrLang[lang]["BOOK_TITLE_REQUIRED"]);
        return false;
    }
    const code = $("#new_book_code").val().trim();
    if(code.length > 17) {
        show_validate_msg("#new_book_code", "error", arrLang[lang]["INVALID_BOOK_CODE"]);
        return false;
    }
    const category = $("#new_book_category").val();
    if(category === null) {
        $("#add_book_error").html(arrLang[lang]["BOOK_CATEGORY_REQUIRED"]);
        $("#add_book_fail").css("display", "block");
        return false;
    }
    $.ajax({
        url:"../PHP/updateBook.php",
        method:"POST",
        data:{
            id: book_id,
            author: $("#new_book_author").val(),
            title: title,
            location: $("#new_book_location").val(),
            publisher: $("#new_book_publisher").val(),
            year: $("#new_book_year").val(),
            code: code,
            category: category,
            bookNotRepeat: $("#confirm_book_not_repeat").is(":checked") ? "true" : "",
            codeNotRepeat: $("#confirm_code_not_repeat").is(":checked") ? "true" : "",
            username: getCookie("username"),
            authority: getCookie(getCookie("username") + "Auth")
        },
        success:function(result){
            if(result.code === 200){
                to_page();
                $("#addBookModal").modal('hide');
            } else if(result.code === 201) {
                $("#display_book_repeat_checkbox").css("display", "block");
            } else if(result.code === 202) {
                $("#display_code_repeat_checkbox").css("display", "block");
            } else if(result.code === 203) {
                $("#add_book_error").html(arrLang[lang]["CATEGORY_NOT_EXIST"]);
                $("#add_book_fail").css("display", "block");
            } else if(result.code === 401) {
                $("#add_book_error").html(arrLang[lang]["NO_ACCESS_UPDATE_BOOK"]);
                $("#add_book_fail").css("display", "block");
            } else if(result.code === 402) {
                $("#add_book_error").html(arrLang[lang]["NO_USER_RIGHTS_UPDATE_BOOK"]);
                $("#add_book_fail").css("display", "block");
            }
        }
    });
});

$(document).on("click", "#close_add_book_fail", function(){
    $("#add_book_fail").css("display", "none");
});

$(document).on("click", ".del-btn", function(){
    const book_id = $(this).attr("del-id");
    $("#del_book_fail").css("display", "none");
    $("#confirm_delete_book").attr("book-id", book_id);
    $.ajax({
        url:"../PHP/getOneBook.php",
        method:"GET",
        data:{
            id: book_id,
            lang: getLang() === "en" ? "en" : "zh"
        },
        success:function(result){
            $("#confirm_delete_book_info").html(result.title);
        }
    });
    $("#delBookModal").modal({
        backdrop: "static"
    });
});

$(document).on("click", "#confirm_delete_book", function(){
    const book_id = $(this).attr("book-id");
    $.ajax({
        url:"../PHP/deleteBook.php",
        method:"POST",
        data:{
            id: book_id,
            admin_id: getCookie(getCookie("username") + "Id"),
            username: getCookie("username"),
            authority: getCookie(getCookie("username") + "Auth")
        },
        success:function(result){
            if(result.code === 200) {
                const current_page = parseInt(getCookie("current_page"));
                const total_page = parseInt(getCookie("total_page"));
                const total_data = parseInt(getCookie("total_data"));
                if((current_page === total_page) && (total_data % 5 === 1) && (total_data !== 1)) {
                    page = page - 1;
                }
                to_page();
                $("#delBookModal").modal('hide');
            } else if(result.code === 401) {
                $("#del_book_error").html(arrLang[lang]["NO_ACCESS_DELETE_BOOK"]);
                $("#del_book_fail").css("display", "block");
            } else if(result.code === 402) {
                $("#add_book_error").html(arrLang[lang]["NO_USER_RIGHTS_DELETE_BOOK"]);
                $("#add_book_fail").css("display", "block");
            }
        }
    });
});

$(document).on("click", "#close_del_book_fail", function(){
    $("#del_book_fail").css("display", "none");
});

$(document).on("click", "#add_new_book_btn", function(){
    $("#add_book_modal_title").html(arrLang[lang]["ADD_BOOK"]);
    reset_form("#addBookModal form");
    $("#display_book_repeat_checkbox").css("display", "none");
    $("#display_code_repeat_checkbox").css("display", "none");
    $("#add_book_fail").css("display", "none");
    $.ajax({
        url:"../PHP/getOneCategory.php",
        method:"GET",
        data:{
            id: cat_id
        },
        success:function(result){
            if(getLang() === "zh") {
                $("#select2-new_book_category-container").html(result.en_name);
                $("#new_book_category").html('<option value="' + cat_id + '">' + result.en_name + '</option>');
            } else {
                $("#select2-new_book_category-container").html(result.zh_name);
                $("#new_book_category").html('<option value="' + cat_id + '">' + result.zh_name + '</option>');
            }
        }
    });
    $("#insert_new_book_btn").css("display", "block");
    $("#update_book_btn").css("display", "none");
    $("#addBookModal").modal({
        backdrop: "static"
    });
});

$(document).on("click", "#insert_new_book_btn", function(){
    const title = $("#new_book_title").val().trim();
    if(title === "") {
        show_validate_msg("#new_book_title", "error", arrLang[lang]["BOOK_TITLE_REQUIRED"]);
        return false;
    }
    const code = $("#new_book_code").val().trim();
    if(code.length > 17) {
        show_validate_msg("#new_book_code", "error", arrLang[lang]["INVALID_BOOK_CODE"]);
        return false;
    }
    const category = $("#new_book_category").val();
    if(category === null) {
        $("#add_book_error").html(arrLang[lang]["BOOK_CATEGORY_REQUIRED"]);
        $("#add_book_fail").css("display", "block");
        return false;
    }
    $.ajax({
        url:"../PHP/addBook.php",
        method:"POST",
        data:{
            author: $("#new_book_author").val(),
            title: title,
            location: $("#new_book_location").val(),
            publisher: $("#new_book_publisher").val(),
            year: $("#new_book_year").val(),
            code: code,
            category: category,
            bookNotRepeat: $("#confirm_book_not_repeat").is(":checked") ? "true" : "",
            codeNotRepeat: $("#confirm_code_not_repeat").is(":checked") ? "true" : "",
            username: getCookie("username"),
            authority: getCookie(getCookie("username") + "Auth")
        },
        success:function(result){
            if(result.code === 200){
                page = 1;
                to_page();
                $("#addBookModal").modal('hide');
            } else if(result.code === 201) {
                $("#display_book_repeat_checkbox").css("display", "block");
            } else if(result.code === 202) {
                $("#display_code_repeat_checkbox").css("display", "block");
            } else if(result.code === 203) {
                $("#add_book_error").html(arrLang[lang]["CATEGORY_NOT_EXIST"]);
                $("#add_book_fail").css("display", "block");
            } else if(result.code === 401) {
                $("#add_book_error").html(arrLang[lang]["NO_ACCESS_ADD_BOOK"]);
                $("#add_book_fail").css("display", "block");
            } else if(result.code === 402) {
                $("#add_book_error").html(arrLang[lang]["NO_USER_RIGHTS_ADD_BOOK"]);
                $("#add_book_fail").css("display", "block");
            }
        }
    });
});