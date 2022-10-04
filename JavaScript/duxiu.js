let page = 1;
let search = "general";
generalDocumentReady();

function navBlockColor() {
    $("#nav_books").addClass("active");
    $("#nav_duxiu").addClass("active");
}

function to_page() {
    $("#all_books_table_body").html("");
    $("#page_info_area").html("");
    $("#page_nav_area").html("");
    $("#progress_bar").show();
    const author = $("#book_author").val().trim();
    const keyword1 = search === "advanced" ? $("#book_title1").val().trim() : $("#search_box_duxiu").val().trim();
    const keyword2 = $("#book_title2").val().trim();
    const publisher = $("#book_publisher").val().trim();
    if(keyword1 === "" && author === "" && keyword2 === "" && publisher === "") {
        setTimeout(() => initialTable(), 50);
    } else {
        $.ajax({
            url:"../PHP/searchDuxiu.php",
            method:"GET",
            data:{
                page: page,
                author: author,
                keyword1: keyword1,
                keyword2: keyword2,
                publisher: publisher
            },
            success:function(result){
                $("#progress_bar").hide();
                build_book_table(result);
                build_page_info(result);
                build_page_nav(result);
            }
        });
    }
}

function initialTable() {
    $("#progress_bar").hide();
    $("#all_books_table_body").html(
        "<td colspan='6' style='text-align: center; font-size: large; color: grey;'>" +
        arrLang[lang]["NO_DATA"] +
        "</td>"
    );
}

function build_book_table(result) {
    const auth = getCookie(getCookie("username") + "Auth");
    if(result.count > 0) {
        $("#all_books_table_body").empty();
        const book = result.body;
        $.each(book, function(index, item){
            const title = $("<td></td>").append(item.title);
            const author = $("<td></td>").append(item.author);
            const publisher = $("<td></td>").append(item.publisher);
            const year = $("<td></td>").append(item.year);
            const code = $("<td></td>").append(item.code);
            const citeBtn = $("<button></button>").addClass("btn btn-default btn-sm cite_btn")
                .append($("<span></span>").addClass("glyphicon glyphicon-book"));
            citeBtn.attr("cite-id", item.id);
            citeBtn.attr("cite-title", item.title);
            citeBtn.attr("cite-author", item.author);
            citeBtn.attr("cite-publisher", item.publisher);
            citeBtn.attr("cite-year", item.year);
            citeBtn.attr("cite-code", item.code);
            let saveBtn = $("<button></button>").addClass("btn btn-primary btn-sm save-btn")
                .append($("<span></span>").addClass("glyphicon glyphicon-plus"));
            saveBtn.attr("save-id", item.id);
            saveBtn.attr("save-title", item.title);
            saveBtn.attr("save-author", item.author);
            saveBtn.attr("save-publisher", item.publisher);
            saveBtn.attr("save-year", item.year);
            saveBtn.attr("save-code", item.code);
            let btnTd;
            if(auth === "2" || auth === "3") {
                btnTd = $("<td></td>").append(citeBtn).append(" ").append(saveBtn);
            } else {
                btnTd = $("<td></td>").append(citeBtn);
            }
            $("<tr></tr>").append(title).append(author).append(publisher).append(year).append(code).append(btnTd)
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

$(document).on("click", "#general_search", function(){
    reset_form("#advancedSearchModal form");
    search = "general";
    to_page();
});

$(document).on("click", "#advance_search", function(){
    $("#search_box_duxiu").val("");
    $("#clean_search_box_duxiu").css("display", "none");
    $("#advancedSearchModal").modal({
        backdrop: "static"
    });
});

$(document).on("click", "#modal_search_btn", function(){
    search = "advanced";
    $("#advancedSearchModal").modal('hide');
    to_page();
});

$(document).on("click", "#modal_clear_btn", function(){
    reset_form("#advancedSearchModal form");
});

$(function() {
    $("#search_box_duxiu").bind("input propertychange", function () {
        if($("#search_box_duxiu").val().trim() !== "") {
            $("#clean_search_box_duxiu").css("display", "block");
        } else {
            $("#clean_search_box_duxiu").css("display", "none");
        }
    });
});

$(document).on("click", "#clean_search_box_duxiu", function(){
    $("#search_box_duxiu").val("");
    $("#clean_search_box_duxiu").css("display", "none");
});