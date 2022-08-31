let display_rows = 5;
const sort_verify = {title: 0, author: 0, publisher: 0, year: 0};
let sort_by_column = "id";
let sort_order = "desc";
let lang = "zh";
let search_value = "";
let extend_body_height = false;
let totalRecord, currentPage;

$(document).ready(function(){
    $("#headerContent").load("header.html");
    $("#footerContent").load("footer.html");
    setTimeout(() => navBlockColor(), 50);
    to_page(1);
    displayAfterLoad();
});

function navBlockColor() {
    document.getElementById('nav_books').className += ' active';
    document.getElementById('nav_search').className += 'active';
    document.getElementById('display_5_rows').className += 'active';
}

function active_rows_selector(rows) {
    document.getElementById('display_5_rows').className = 'inactive';
    document.getElementById('display_10_rows').className = 'inactive';
    document.getElementById('display_20_rows').className = 'inactive';
    document.getElementById('display_50_rows').className = 'inactive';
    document.getElementById(rows).className = 'active';
}

function extendBodyHeight(){
    if(extend_body_height === false) {
        extend_body_height = true;
        setTimeout(() => autoFooter(), 200);
    }
}

$(document).on("click", "#display_5_rows", function(){
    display_rows = 5;
    to_page(1);
    active_rows_selector('display_5_rows');
    extendBodyHeight();
});

$(document).on("click", "#display_10_rows", function(){
    display_rows = 10;
    to_page(1);
    active_rows_selector('display_10_rows');
    extendBodyHeight();
});

$(document).on("click", "#display_20_rows", function(){
    display_rows = 20;
    to_page(1);
    active_rows_selector('display_20_rows');
    extendBodyHeight();
});

$(document).on("click", "#display_50_rows", function(){
    display_rows = 50;
    to_page(1);
    active_rows_selector('display_50_rows');
    extendBodyHeight();
});

function to_page(pn) {
    $.ajax({
        url:"../PHP/allBooks.php",
        method:"GET",
        data:{
            page: pn,
            rows: display_rows,
            sortByColumn: sort_by_column,
            sortOrder: sort_order,
            lang: lang,
            search: search_value
        },
        success:function(result){
            build_books_table(result);
            build_page_info(result);
            build_page_nav(result);
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
            "<td colspan='6' style='text-align: center; font-size: large; color: grey;'>暂无数据</td>";
    }
}

function build_page_info(result){
    $("#page_info_area").empty();
    $("#page_info_area").append("共有数据<span style='font-weight: bold; color:#73BE73;'>" + result.count + "</span>条，分为<span style='font-weight: bold; color:#73BE73;'>" + result.pages + "</span>页");
    totalRecord = result.count;
    currentPage = result.currentPage;
}

function build_page_nav(result){
    $("#page_nav_area").empty();

    let ul = $("<ul></ul>").addClass("pagination");
    let firstPageA = $("<a></a>").append("首页").attr("href", "#");
    let firstPageLi = $("<li></li>").append(firstPageA);
    let prePageA = $("<a></a>").append("&laquo;").attr("href", "#");
    let prePageLi = $("<li></li>").append(prePageA);
    if(currentPage === 1) {
        firstPageA.removeAttr("href", "#");
        firstPageLi.addClass("disabled");
        prePageA.removeAttr("href", "#");
        prePageLi.addClass("disabled");
    } else {
        firstPageLi.click(function() {
            to_page(1);
        });
        prePageLi.click(function() {
            to_page(currentPage - 1);
        });
    }
    ul.append(firstPageLi).append(prePageLi);

    $.each(result.navigatePageNums, function(index, item){
        let numLi = $("<li></li>").append($("<a></a>").append(item).attr("href", "#"));
        if(currentPage === item) {
            numLi.addClass("active");
        }
        numLi.click(function() {
            to_page(item);
        });
        ul.append(numLi)
    });

    let nextPageA = $("<a></a>").append("&raquo;").attr("href", "#");
    let nextPageLi = $("<li></li>").append(nextPageA);
    let lastPageA = $("<a></a>").append("末页").attr("href", "#");
    let lastPageLi = $("<li></li>").append(lastPageA);
    if(currentPage === result.pages) {
        nextPageA.removeAttr("href", "#");
        nextPageLi.addClass("disabled");
        lastPageA.removeAttr("href", "#");
        lastPageLi.addClass("disabled");
    } else {
        nextPageLi.click(function() {
            to_page(currentPage + 1);
        });
        lastPageLi.click(function() {
            to_page(result.pages);
        });
    }
    ul.append(nextPageLi).append(lastPageLi);

    let nav = $("<nav></nav>").append(ul);
    nav.appendTo("#page_nav_area");
}

function sort_table(column) {
    document.getElementById('book_title_sort').src='../Resources/image/sort-solid.svg';
    document.getElementById('book_author_sort').src='../Resources/image/sort-solid.svg';
    document.getElementById('book_publisher_sort').src='../Resources/image/sort-solid.svg';
    document.getElementById('book_year_sort').src='../Resources/image/sort-solid.svg';
    sort_by_column = column;
    if(column === "Title") {
        if(sort_verify.title === 0){
            sort_order = "desc";
            document.getElementById('book_title_sort').src='../Resources/image/sort-down-solid.svg';
            sort_verify.title = 1;
        } else if(sort_verify.title === 1){
            sort_order = "asc";
            document.getElementById('book_title_sort').src='../Resources/image/sort-up-solid.svg';
            sort_verify.title = 0;
        }
    }
    if(column === "Author") {
        if(sort_verify.author === 0){
            sort_order = "desc";
            document.getElementById('book_author_sort').src='../Resources/image/sort-down-solid.svg';
            sort_verify.author = 1;
        } else if(sort_verify.author === 1){
            sort_order = "asc";
            document.getElementById('book_author_sort').src='../Resources/image/sort-up-solid.svg';
            sort_verify.author = 0;
        }
    }
    if(column === "Publisher") {
        if(sort_verify.publisher === 0){
            sort_order = "desc";
            document.getElementById('book_publisher_sort').src='../Resources/image/sort-down-solid.svg';
            sort_verify.publisher = 1;
        } else if(sort_verify.publisher === 1){
            sort_order = "asc";
            document.getElementById('book_publisher_sort').src='../Resources/image/sort-up-solid.svg';
            sort_verify.publisher = 0;
        }
    }
    if(column === "Year") {
        if(sort_verify.year === 0){
            sort_order = "desc";
            document.getElementById('book_year_sort').src='../Resources/image/sort-down-solid.svg';
            sort_verify.year = 1;
        } else if(sort_verify.year === 1){
            sort_order = "asc";
            document.getElementById('book_year_sort').src='../Resources/image/sort-up-solid.svg';
            sort_verify.year = 0;
        }
    }
    to_page(1);
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
        let search_value_before_clean = document.getElementById('search_box').value;
        search_value = search_value_before_clean.replace(/\'/g, "\\'");
        to_page(1);
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
            document.getElementById("wikipedia_template").innerHTML=result.wikipedia;
            document.getElementById("gbt7714_2015").innerHTML=result.gbt7714;
        }
    });
    $("#citeBookModal").modal({
        backdrop: "static"
    });
});

$(document).on("click", "#wikipedia_copy_button", function(){
    const copied_body = document.getElementById("wikipedia_template").value;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(copied_body);
    }
});

$(document).on("click", "#gbt7714_copy_button", function(){
    const copied_body = document.getElementById("gbt7714_2015").value;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(copied_body);
    }
});