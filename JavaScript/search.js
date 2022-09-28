let sort_verify = {title: 0, author: 0, publisher: 0, year: 0};

$(document).ready(function(){
    $("#headerContent").load("header.html");
    $("#footerContent").load("footer.html");
    setTimeout(() => navBlockColor(), 50);
    checkSortIcon();
    to_page();
    $("#search_box").val(getCookie("search_value"));
    if(document.getElementById('search_box').value !== "") {
        $("#clean_search_box").css("display", "block");
    }
    add_book_category_select2();
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

function checkSortIcon() {
    const column = getCookie("book_display_sort_column").toLowerCase();
    const order = getCookie("book_display_sort_order");
    if(order === "desc"){
        $("#book_" + column + "_sort").html('<i class="fa-solid fa-sort-down"></i>');
    } else if(order === "asc"){
        $("#book_" + column + "_sort").html('<i class="fa-solid fa-sort-up"></i>');
    }
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
    document.cookie = "current_page=" + 1;
    document.cookie = "book_display_rows=" + 50;
    to_page();
    active_rows_selector('display_50_rows');
});

function to_page() {
    const display_rows = getCookie("book_display_rows") !== "" ? getCookie("book_display_rows") : 5;
    const sort_column = getCookie("book_display_sort_column") !== "" ? getCookie("book_display_sort_column") : "id";
    const sort_order = getCookie("book_display_sort_order") !== "" ? getCookie("book_display_sort_order") : "desc";
    const search_value = getCookie("search_value") !== "" ? getCookie("search_value") : "";
    const current_page = getCookie("current_page") !== "" ? getCookie("current_page") : 1;
    $.ajax({
        url:"../PHP/allBooks.php",
        method:"GET",
        data:{
            page: current_page,
            rows: display_rows,
            sortByColumn: sort_column,
            sortOrder: sort_order,
            lang: getLang() === "en" ? "en" : "zh",
            search: search_value
        },
        success:function(result){
            document.cookie = "current_page=" + result.currentPage;
            document.cookie = "total_page=" + result.pages;
            document.cookie = "total_data=" + result.count;
            build_books_table(result);
            build_page_info(result);
            search_book_build_page_nav(result);
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
                .attr("href", "#")
                .addClass("cat-link")
                .attr("cat-id", item.catId)
                .append(item.catName));
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
            $("<tr></tr>").append(bookTitle).append(bookAuthor).append(bookPublisher)
                .append(bookYear).append(catName).append(btnTd)
                .appendTo("#all_books_table_body");
        })
    } else {
        $("#all_books_table_body").html(
            "<td colspan='6' style='text-align: center; font-size: large; color: grey;'>" +
            arrLang[lang]["NO_DATA"] +
            "</td>"
        );
    }
}

function search_book_build_page_nav(result){
    $("#page_nav_area").empty();
    if(result.count > 0) {
        let ul = $("<ul></ul>").addClass("pagination");
        let firstPageA = $("<a></a>").append(arrLang[lang]["FIRST_PAGE"]).attr("href", "#");
        let firstPageLi = $("<li></li>").append(firstPageA);
        let prePageA = $("<a></a>").append("&laquo;").attr("href", "#");
        let prePageLi = $("<li></li>").append(prePageA);
        if (parseInt(getCookie("current_page")) === 1) {
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
                document.cookie = "current_page=" + (parseInt(getCookie("current_page")) - 1);
                to_page();
            });
        }
        ul.append(firstPageLi).append(prePageLi);

        $.each(result.navigatePageNums, function (index, item) {
            let numA = $("<a></a>").append(item).attr("href", "#");
            let numLi = $("<li></li>").append(numA);
            if (parseInt(getCookie("current_page")) === item) {
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
        if (parseInt(getCookie("current_page")) === result.pages) {
            nextPageA.removeAttr("href", "#");
            nextPageLi.addClass("disabled");
            lastPageA.removeAttr("href", "#");
            lastPageLi.addClass("disabled");
        } else {
            nextPageLi.click(function () {
                document.cookie = "current_page=" + (parseInt(getCookie("current_page")) + 1);
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
    const book_title_sort = $("#book_title_sort");
    const book_author_sort = $("#book_author_sort");
    const book_publisher_sort = $("#book_publisher_sort");
    const book_year_sort = $("#book_year_sort");
    book_title_sort.html('<i class="fa-solid fa-sort"></i>');
    book_author_sort.html('<i class="fa-solid fa-sort"></i>');
    book_publisher_sort.html('<i class="fa-solid fa-sort"></i>');
    book_year_sort.html('<i class="fa-solid fa-sort"></i>');
    document.cookie = "book_display_sort_column=" + column;
    if(column === "Title") {
        if(sort_verify.title === 0){
            document.cookie = "book_display_sort_order=desc";
            book_title_sort.html('<i class="fa-solid fa-sort-down"></i>');
            sort_verify.title = 1;
        } else if(sort_verify.title === 1){
            document.cookie = "book_display_sort_order=asc";
            book_title_sort.html('<i class="fa-solid fa-sort-up"></i>');
            sort_verify.title = 0;
        }
    }
    if(column === "Author") {
        if(sort_verify.author === 0){
            document.cookie = "book_display_sort_order=desc";
            book_author_sort.html('<i class="fa-solid fa-sort-down"></i>');
            sort_verify.author = 1;
        } else if(sort_verify.author === 1){
            document.cookie = "book_display_sort_order=asc";
            book_author_sort.html('<i class="fa-solid fa-sort-up"></i>');
            sort_verify.author = 0;
        }
    }
    if(column === "Publisher") {
        if(sort_verify.publisher === 0){
            document.cookie = "book_display_sort_order=desc";
            book_publisher_sort.html('<i class="fa-solid fa-sort-down"></i>');
            sort_verify.publisher = 1;
        } else if(sort_verify.publisher === 1){
            document.cookie = "book_display_sort_order=asc";
            book_publisher_sort.html('<i class="fa-solid fa-sort-up"></i>');
            sort_verify.publisher = 0;
        }
    }
    if(column === "Year") {
        if(sort_verify.year === 0){
            document.cookie = "book_display_sort_order=desc";
            book_year_sort.html('<i class="fa-solid fa-sort-down"></i>');
            sort_verify.year = 1;
        } else if(sort_verify.year === 1){
            document.cookie = "book_display_sort_order=asc";
            book_year_sort.html('<i class="fa-solid fa-sort-up"></i>');
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
        let search_value = $("#search_box").val();
        document.cookie = "search_value=" + search_value;
        if(search_value !== "") {
            $("#clean_search_box").css("display", "block");
        } else {
            $("#clean_search_box").css("display", "none");
        }
        document.cookie = "current_page=" + 1;
        to_page();
    });
});

$(document).on("click", "#clean_search_box", function(){
    document.cookie = "search_value=";
    $("#search_box").val("");
    $("#clean_search_box").css("display", "none");
    document.cookie = "current_page=" + 1;
    to_page();
});

$(document).on("click", "#add_new_book_btn", function(){
    $("#add_book_modal_title").html(arrLang[lang]["ADD_BOOK"]);
    cleanAddModal();
    $("#new_book_category").html("");
    $("#insert_new_book_btn").css("display", "block");
    $("#update_book_btn").css("display", "none");
    $("#addBookModal").modal({
        backdrop: "static"
    });
});

$(document).on("click", "#insert_new_book_btn", function(){
    if(!validAddBook()) {
        return false;
    }
    $.ajax({
        url:"../PHP/addBook.php",
        method:"POST",
        data:addBookData(),
        success:function(result){
            if(result.code === 200){
                restoreSearchPage();
                to_page();
                $("#addBookModal").modal('hide');
            } else {
                addBookError(result);
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
                    document.cookie = "current_page=" + (current_page - 1);
                }
                to_page();
                $("#delBookModal").modal('hide');
            } else {
                delBookError(result);
            }
        }
    });
});

$(document).on("click", "#close_del_book_fail", function(){
    $("#del_book_fail").css("display", "none");
});

$(document).on("click", "#restore_search_page", function(){
    restoreSearchPage();
    to_page();
});

function restoreSearchPage() {
    $("#book_title_sort").html('<i class="fa-solid fa-sort"></i>');
    $("#book_author_sort").html('<i class="fa-solid fa-sort"></i>');
    $("#book_publisher_sort").html('<i class="fa-solid fa-sort"></i>');
    $("#book_year_sort").html('<i class="fa-solid fa-sort"></i>');
    document.cookie = "book_display_rows=" + 5;
    active_rows_selector('display_5_rows');
    document.cookie = "current_page=" + 1;
    $("#search_box").val("");
    $("#clean_search_box").css("display", "none");
    document.cookie = "search_value=";
    document.cookie = "book_display_sort_column=id";
    document.cookie = "book_display_sort_order=desc";
}