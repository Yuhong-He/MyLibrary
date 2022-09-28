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

$(document).on("click", "#add_new_book_btn", function(){
    $("#add_book_modal_title").html(arrLang[lang]["ADD_BOOK"]);
    cleanAddModal();
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
    if(!validAddBook()) {
        return false;
    }
    $.ajax({
        url:"../PHP/addBook.php",
        method:"POST",
        data:addBookData(),
        success:function(result){
            if(result.code === 200){
                page = 1;
                to_page();
                $("#addBookModal").modal('hide');
            } else {
                addBookError(result);
            }
        }
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
            } else {
                delBookError(result);
            }
        }
    });
});

$(document).on("click", "#close_del_book_fail", function(){
    $("#del_book_fail").css("display", "none");
});