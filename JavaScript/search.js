let sort_verify = {title: 0, author: 0, publisher: 0, year: 0};
let sort_by_column = "id";
let sort_order = "desc";
let currentPage;

let allCategory = [];
$.ajax({
    url:"../PHP/getCategory.php",
    method:"GET",
    data:{
        lang: getLang() === "en" ? "en" : "zh"
    },
    success:function(result){
        const array1 = { id: 0, text: '-'};
        allCategory.push(array1);
        $.each(result, function(index, item){
            const category = {id: item.id, text: item.name};
            allCategory.push(category);
        })
    }
});

$(document).ready(function(){
    $("#headerContent").load("header.html");
    $("#footerContent").load("footer.html");
    setTimeout(() => navBlockColor(), 50);
    to_page();
    displayAfterLoad();
    $("#search_box").val(getCookie("search_value"));
    if(document.getElementById('search_box').value !== "") {
        $("#clean_search_box").css("display", "block");
    }
    $('#new_book_category').select2({
        data: allCategory,
        dropdownParent: $('#addBookModal')
    });
});

function navBlockColor() {
    $("#nav_books").addClass("active");
    $("#nav_search").addClass("active");
    const rows_id = new Map([
        ["5", "display_5_rows"],
        ["10", "display_10_rows"],
        ["20", "display_20_rows"],
        ["50", "display_50_rows"]
    ]);
    if(getCookie("book_display_rows") !== "") {
        $("#" + rows_id.get(getCookie("book_display_rows"))).addClass("active");
    } else {
        $("#display_5_rows").addClass("active");
    }
}

function active_rows_selector(rows) {
    $("#display_5_rows").removeClass("active");
    $("#display_10_rows").removeClass("active");
    $("#display_20_rows").removeClass("active");
    $("#display_50_rows").removeClass("active");
    $("#" + rows).addClass("active");
}

$(document).on("click", "#display_5_rows", function(){
    document.cookie = "current_page=" + 1;
    document.cookie = "book_display_rows=" + 5;
    to_page();
    active_rows_selector('display_5_rows');
});

$(document).on("click", "#display_10_rows", function(){
    document.cookie = "current_page=" + 1;
    document.cookie = "book_display_rows=" + 10;
    to_page();
    active_rows_selector('display_10_rows');
});

$(document).on("click", "#display_20_rows", function(){
    document.cookie = "current_page=" + 1;
    document.cookie = "book_display_rows=" + 20;
    to_page();
    active_rows_selector('display_20_rows');
});

$(document).on("click", "#display_50_rows", function(){
    document.cookie = "book_display_rows=" + 50;
    to_page();
    active_rows_selector('display_50_rows');
});

function to_page() {
    const search_lang = getLang() === "en" ? "en" : "zh";
    const display_rows = getCookie("book_display_rows") !== "" ? getCookie("book_display_rows") : 5;
    const search_value = getCookie("search_value") !== "" ? getCookie("search_value") : "";
    const current_page = getCookie("current_page") !== "" ? getCookie("current_page") : 1;
    $.ajax({
        url:"../PHP/allBooks.php",
        method:"GET",
        data:{
            page: current_page,
            rows: display_rows,
            sortByColumn: sort_by_column,
            sortOrder: sort_order,
            lang: search_lang,
            search: search_value
        },
        success:function(result){
            currentPage = result.currentPage;
            document.cookie = "current_page=" + currentPage;
            build_books_table(result);
            build_page_info(result);
            build_page_nav(result);
            extendMainContainerHeight();
        }
    });
}

function build_books_table(result){
    if(result.count > 0) {
        $("#all_books_table_body").empty();
        const book = result.body;
        $.each(book, function(index, item){
            const bookTitle = $("<td></td>").append(item.title);
            const bookAuthor = $("<td></td>").append(item.author);
            const bookPublisher = $("<td></td>").append(item.publisher);
            const bookYear = $("<td></td>").append(item.year);
            const catName = $("<td></td>").append($("<a></a>")
                .attr("href", "by_category.php?id=" + item.catId)
                .append(item.catName));
            const citeBtn = $("<button></button>").addClass("btn btn-default btn-sm cite_btn")
                .append($("<span></span>").addClass("glyphicon glyphicon-book"));
            citeBtn.attr("cite-id", item.id);
            const editBtn = $("<button></button>").addClass("btn btn-primary btn-sm")
                .append($("<span></span>").addClass("glyphicon glyphicon-pencil"));
            const delBtn = $("<button></button>").addClass("btn btn-danger btn-sm")
                .append($("<span></span>").addClass("glyphicon glyphicon-trash"));
            const btnTd = $("<td></td>").append(citeBtn).append(" ").append(editBtn).append(" ").append(delBtn);
            $("<tr></tr>").append(bookTitle).append(bookAuthor).append(bookPublisher)
                .append(bookYear).append(catName).append(btnTd)
                .appendTo("#all_books_table_body");
        })
    } else {
        document.getElementById("all_books_table_body").innerHTML=
            "<td colspan='6' style='text-align: center; font-size: large; color: grey;'>" +
            arrLang[lang]["NO_DATA"] +
            "</td>";
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
        if (currentPage === 1) {
            firstPageA.removeAttr("href", "#");
            firstPageLi.addClass("disabled");
            prePageA.removeAttr("href", "#");
            prePageLi.addClass("disabled");
        } else {
            firstPageLi.click(function () {
                document.cookie = "current_page=" + 1;
                to_page();
            });
            prePageLi.click(function () {
                document.cookie = "current_page=" + (currentPage - 1);
                to_page();
            });
        }
        ul.append(firstPageLi).append(prePageLi);

        $.each(result.navigatePageNums, function (index, item) {
            let numA = $("<a></a>").append(item).attr("href", "#");
            let numLi = $("<li></li>").append(numA);
            if (currentPage === item) {
                numA.css("z-index", 0);
                numLi.addClass("active");
            }
            numLi.click(function () {
                document.cookie = "current_page=" + item;
                to_page();
            });
            ul.append(numLi)
        });

        let nextPageA = $("<a></a>").append("&raquo;").attr("href", "#");
        let nextPageLi = $("<li></li>").append(nextPageA);
        let lastPageA = $("<a></a>").append(arrLang[lang]["LAST_PAGE"]).attr("href", "#");
        let lastPageLi = $("<li></li>").append(lastPageA);
        if (currentPage === result.pages) {
            nextPageA.removeAttr("href", "#");
            nextPageLi.addClass("disabled");
            lastPageA.removeAttr("href", "#");
            lastPageLi.addClass("disabled");
        } else {
            nextPageLi.click(function () {
                document.cookie = "current_page=" + (currentPage + 1);
                to_page();
            });
            lastPageLi.click(function () {
                document.cookie = "current_page=" + result.pages;
                to_page();
            });
        }
        ul.append(nextPageLi).append(lastPageLi);

        let nav = $("<nav></nav>").append(ul);
        nav.appendTo("#page_nav_area");
    }
}

function sort_table(column) {
    $("#book_title_sort").attr("src", "../Resources/image/sort-solid.svg");
    $("#book_author_sort").attr("src", "../Resources/image/sort-solid.svg");
    $("#book_publisher_sort").attr("src", "../Resources/image/sort-solid.svg");
    $("#book_year_sort").attr("src", "../Resources/image/sort-solid.svg");
    sort_by_column = column;
    if(column === "Title") {
        if(sort_verify.title === 0){
            sort_order = "desc";
            $("#book_title_sort").attr("src", "../Resources/image/sort-down-solid.svg");
            sort_verify.title = 1;
        } else if(sort_verify.title === 1){
            sort_order = "asc";
            $("#book_title_sort").attr("src", "../Resources/image/sort-up-solid.svg");
            sort_verify.title = 0;
        }
    }
    if(column === "Author") {
        if(sort_verify.author === 0){
            sort_order = "desc";
            $("#book_author_sort").attr("src", "../Resources/image/sort-down-solid.svg");
            sort_verify.author = 1;
        } else if(sort_verify.author === 1){
            sort_order = "asc";
            $("#book_author_sort").attr("src", "../Resources/image/sort-up-solid.svg");
            sort_verify.author = 0;
        }
    }
    if(column === "Publisher") {
        if(sort_verify.publisher === 0){
            sort_order = "desc";
            $("#book_publisher_sort").attr("src", "../Resources/image/sort-down-solid.svg");
            sort_verify.publisher = 1;
        } else if(sort_verify.publisher === 1){
            sort_order = "asc";
            $("#book_publisher_sort").attr("src", "../Resources/image/sort-up-solid.svg");
            sort_verify.publisher = 0;
        }
    }
    if(column === "Year") {
        if(sort_verify.year === 0){
            sort_order = "desc";
            $("#book_year_sort").attr("src", "../Resources/image/sort-down-solid.svg");
            sort_verify.year = 1;
        } else if(sort_verify.year === 1){
            sort_order = "asc";
            $("#book_year_sort").attr("src", "../Resources/image/sort-up-solid.svg");
            sort_verify.year = 0;
        }
    }
    document.cookie = "current_page=" + 1;
    to_page();
}

$(document).on("click", "#book_title_header", function(){
    sort_table("Title");
});

$(document).on("click", "#book_author_header", function(){
    sort_table("Author");
});

$(document).on("click", "#book_publisher_header", function(){
    sort_table("Publisher");
});

$(document).on("click", "#book_year_header", function(){
    sort_table("Year");
});

$(function() {
    $("#search_box").bind("input propertychange", function () {
        let search_value_before_clean = $("#search_box").val();
        document.cookie = "search_value=" + search_value_before_clean.replace(/\'/g, "\\'");
        if(search_value_before_clean !== "") {
            $("#clean_search_box").css("display", "block");
        } else {
            $("#clean_search_box").css("display", "none");
        }
        document.cookie = "current_page=" + 1;
        to_page();
    });
});

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

$(document).on("click", "#clean_search_box", function(){
    document.cookie = "search_value=";
    $("#search_box").val("");
    $("#clean_search_box").css("display", "none");
    document.cookie = "current_page=" + 1;
    to_page();
});

$(document).on("click", "#add_new_book_btn", function(){
    $("#addBookModal").modal({
        backdrop: "static"
    });
});

$(document).on("click", ".close_model_new_book", function(){
    location.reload();
});

$(document).on("click", "#model_new_book_btn", function(){
    if($("#new_book_title").val() === "") {
        show_validate_msg("#new_book_title", "error", arrLang[lang]["BOOK_TITLE_REQUIRED"]);
        return false;
    }
    if($("#new_book_category").val() === "0") {
        $("#ADD_BOOK_ERROR").html(arrLang[lang]["BOOK_CATEGORY_REQUIRED"]);
        $("#add_book_fail").css("display", "block");
        return false;
    }
    $.ajax({
        url:"../PHP/addBook.php",
        method:"POST",
        data:{
            author: $("#new_book_author").val(),
            title: $("#new_book_title").val(),
            location: $("#new_book_location").val(),
            publisher: $("#new_book_publisher").val(),
            year: $("#new_book_year").val(),
            code: $("#new_book_code").val(),
            category: $("#new_book_category").val(),
            bookNotRepeat: $("#confirm_book_not_repeat").is(":checked") ? "true" : "",
            codeNotRepeat: $("#confirm_code_not_repeat").is(":checked") ? "true" : "",
            username: getCookie("username"),
            authority: getCookie(getCookie("username") + "Auth")
        },
        success:function(result){
            if(result.code === 200){
                document.cookie = "current_page=" + 1;
                document.cookie = "search_value=";
                sort_by_column = "id";
                to_page();
                $("#addBookModal").modal('hide');
                location.reload();
            } else if(result.code === 201) {
                $("#display_book_repeat_checkbox").css("display", "block");
            } else if(result.code === 202) {
                $("#display_code_repeat_checkbox").css("display", "block");
            } else if(result.code === 203) {
                $("#ADD_BOOK_ERROR").html(arrLang[lang]["CATEGORY_NOT_EXIST"]);
                $("#add_book_fail").css("display", "block");
            } else if(result.code === 401) {
                $("#ADD_BOOK_ERROR").html(arrLang[lang]["NO_ACCESS_ADD_BOOK"]);
                $("#add_book_fail").css("display", "block");
            }
        }
    });
});

$(function() {
    $("#new_book_title").bind("input propertychange", function () {
        $("#display_book_repeat_checkbox").css("display", "none");
    });
});

$(function() {
    $("#new_book_code").bind("input propertychange", function () {
        $("#display_code_repeat_checkbox").css("display", "none");
    });
});