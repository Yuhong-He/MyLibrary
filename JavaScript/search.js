let display_rows = 5;
let title_sort_verify = 0;
let author_sort_verify = 0;
let publisher_sort_verify = 0;
let year_sort_verify = 0;
let sort_by_column = "id";
let sort_order = "desc";
let lang = "zh";
let search_value = "";
let extend_body_height = false;

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

$(document).on("click", "#display_5_rows", function(){
    display_rows = 5;
    to_page(1);
    document.getElementById('display_5_rows').className = 'active';
    document.getElementById('display_10_rows').className = 'inactive';
    document.getElementById('display_20_rows').className = 'inactive';
    document.getElementById('display_50_rows').className = 'inactive';
});

$(document).on("click", "#display_10_rows", function(){
    display_rows = 10;
    to_page(1);
    document.getElementById('display_5_rows').className = 'inactive';
    document.getElementById('display_10_rows').className = 'active';
    document.getElementById('display_20_rows').className = 'inactive';
    document.getElementById('display_50_rows').className = 'inactive';
    if(extend_body_height === false) {
        extend_body_height = true;
        setTimeout(() => autoFooter(), 200);
    }
});

$(document).on("click", "#display_20_rows", function(){
    display_rows = 20;
    to_page(1);
    document.getElementById('display_5_rows').className = 'inactive';
    document.getElementById('display_10_rows').className = 'inactive';
    document.getElementById('display_20_rows').className = 'active';
    document.getElementById('display_50_rows').className = 'inactive';
    if(extend_body_height === false) {
        extend_body_height = true;
        setTimeout(() => autoFooter(), 200);
    }
});

$(document).on("click", "#display_50_rows", function(){
    display_rows = 50;
    to_page(1);
    document.getElementById('display_5_rows').className = 'inactive';
    document.getElementById('display_10_rows').className = 'inactive';
    document.getElementById('display_20_rows').className = 'inactive';
    document.getElementById('display_50_rows').className = 'active';
    if(extend_body_height === false) {
        extend_body_height = true;
        setTimeout(() => autoFooter(), 200);
    }
});

function to_page(pn) {
    build_books_table(pn);
    build_page_info();
    build_page_nav(pn);
}

function build_books_table(pn){
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
            document.getElementById("all_books_table_body").innerHTML=result;
        }
    });
}

function build_page_info(){
    $.ajax({
        url:"../PHP/getPageInfo.php",
        method:"GET",
        data:{
            rows: display_rows,
            table: "books",
            column: "Title",
            search: search_value
        },
        success:function(result){
            document.getElementById("page_info_area").innerHTML=result;
        }
    });
}

function build_page_nav(pn){
    $.ajax({
        url:"../PHP/buildPageNav.php",
        method:"GET",
        data:{
            page: pn,
            rows: display_rows,
            table: "books",
            column: "Title",
            search: search_value
        },
        success:function(result){
            document.getElementById("page_nav_area").innerHTML=result;
        }
    });
}

$(document).on("click", "#book_title_header", function(){
    document.getElementById('book_author_sort').src='../Resources/image/sort-solid.svg';
    document.getElementById('book_publisher_sort').src='../Resources/image/sort-solid.svg';
    document.getElementById('book_year_sort').src='../Resources/image/sort-solid.svg';
    if(title_sort_verify === 0){
        sort_by_column = "Title";
        sort_order = "desc";
        document.getElementById('book_title_sort').src='../Resources/image/sort-down-solid.svg';
        title_sort_verify = 1;
    } else if(title_sort_verify === 1){
        sort_by_column = "Title";
        sort_order = "asc";
        document.getElementById('book_title_sort').src='../Resources/image/sort-up-solid.svg';
        title_sort_verify = 0;
    }
    to_page(1);
});

$(document).on("click", "#book_author_header", function(){
    document.getElementById('book_title_sort').src='../Resources/image/sort-solid.svg';
    document.getElementById('book_publisher_sort').src='../Resources/image/sort-solid.svg';
    document.getElementById('book_year_sort').src='../Resources/image/sort-solid.svg';
    if(author_sort_verify === 0){
        sort_by_column = "Author";
        sort_order = "desc";
        document.getElementById('book_author_sort').src='../Resources/image/sort-down-solid.svg';
        author_sort_verify = 1;
    } else if(author_sort_verify === 1){
        sort_by_column = "Author";
        sort_order = "asc";
        document.getElementById('book_author_sort').src='../Resources/image/sort-up-solid.svg';
        author_sort_verify = 0;
    }
    to_page(1);
});

$(document).on("click", "#book_publisher_header", function(){
    document.getElementById('book_title_sort').src='../Resources/image/sort-solid.svg';
    document.getElementById('book_author_sort').src='../Resources/image/sort-solid.svg';
    document.getElementById('book_year_sort').src='../Resources/image/sort-solid.svg';
    if(publisher_sort_verify === 0){
        sort_by_column = "Publisher";
        sort_order = "desc";
        document.getElementById('book_publisher_sort').src='../Resources/image/sort-down-solid.svg';
        publisher_sort_verify = 1;
    } else if(publisher_sort_verify === 1){
        sort_by_column = "Publisher";
        sort_order = "asc";
        document.getElementById('book_publisher_sort').src='../Resources/image/sort-up-solid.svg';
        publisher_sort_verify = 0;
    }
    to_page(1);
});

$(document).on("click", "#book_year_header", function(){
    document.getElementById('book_title_sort').src='../Resources/image/sort-solid.svg';
    document.getElementById('book_author_sort').src='../Resources/image/sort-solid.svg';
    document.getElementById('book_publisher_sort').src='../Resources/image/sort-solid.svg';
    if(year_sort_verify === 0){
        sort_by_column = "Year";
        sort_order = "desc";
        document.getElementById('book_year_sort').src='../Resources/image/sort-down-solid.svg';
        year_sort_verify = 1;
    } else if(year_sort_verify === 1){
        sort_by_column = "Year";
        sort_order = "asc";
        document.getElementById('book_year_sort').src='../Resources/image/sort-up-solid.svg';
        year_sort_verify = 0;
    }
    to_page(1);
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