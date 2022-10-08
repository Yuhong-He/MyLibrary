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
        "<td colspan='7' style='text-align: center; font-size: large; color: grey;'>" +
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
            const id = $("<td></td>").append(item.id);
            const title = $("<td></td>").append(item.title);
            const author = $("<td></td>").append(item.author);
            const publisher = $("<td></td>").append(item.publisher);
            const year = $("<td></td>").append(item.year);
            const code = $("<td></td>").append(item.code);
            const citeBtn = $("<button></button>").addClass("btn btn-default btn-sm cite_btn")
                .append($("<span></span>").addClass("glyphicon glyphicon-book"));
            citeBtn.attr("cite-title", item.title);
            citeBtn.attr("cite-author", item.author);
            citeBtn.attr("cite-publisher", item.publisher);
            citeBtn.attr("cite-year", item.year);
            citeBtn.attr("cite-code", item.code);
            let saveBtn = $("<button></button>").addClass("btn btn-primary btn-sm save-btn")
                .append($("<span></span>").addClass("glyphicon glyphicon-plus"));
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
            $("<tr></tr>").append(id).append(title).append(author).append(publisher).append(year).append(code).append(btnTd)
                .appendTo("#all_books_table_body");
        })
    } else {
        $("#all_books_table_body").html(
            "<td colspan='7' style='text-align: center; font-size: large; color: grey;'>" +
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

$(document).on("click", ".cite_btn", function(){
    const title = $(this).attr("cite-title");
    const author = $(this).attr("cite-author");
    const publisher = $(this).attr("cite-publisher");
    const year = $(this).attr("cite-year");
    const code = $(this).attr("cite-code");
    const wikipedia = getWikipediaRef(title, author, publisher, year, code);
    const gbt7714 = getGbt7714Ref(title, author, publisher, year);
    $("#wikipedia_template").html(wikipedia);
    $("#gbt7714_2015").html(gbt7714);
    $("#citeBookModal").modal({
        backdrop: "static"
    });
});

function getWikipediaRef(title, author, publisher, year, code) {
    let reference = "<ref>{{cite book";
    if(author !== "") {
        author = author.replace(/，/g,",");
        author = author.replace(/；/g,"; ");
        reference = reference + " |author=" + author;
    }
    reference = reference + " |title=" + title;
    if(publisher !== "") {
        if(publisher.includes("：")) {
            const index = publisher.indexOf("：");
            const location = publisher.substring(0, index);
            publisher = publisher.substring(index + 1, publisher.length);
            reference = reference + " |location=" + location;
            reference = reference + " |publisher=" + publisher;
        } else {
            reference = reference + " |publisher=" + publisher;
        }
    }
    if(year !== "") {
        reference = reference + " |year=" + year;
    }
    if(code !== "") {
        if(code.includes("\r")) {
            code = code.substring(0, code.length - 1);
        }
        if(code !== "") {
            const pure_code = code.replace(/·/g,"");
            if(pure_code.length < 10) {
                reference = reference + " |csbn=" + code;
            } else {
                reference = reference + " |isbn=" + code;
                if(!checkISBN(code)) {
                    reference = reference + " |ignore-isbn-error=true";
                }
            }
        }
    }
    reference = reference + " }}</ref>";
    return reference;
}

function checkISBN(isbn) {
    const isbn_array = Array.from(isbn);
    if(isbn_array.length === 10) {
        let check_digit = (1 * isbn_array[0] + 2 * isbn_array[1] + 3 * isbn_array[2] + 4 * isbn_array[3] + 5 * isbn_array[4]
            + 6 * isbn_array[5] + 7 * isbn_array[6] + 8 * isbn_array[7] + 9 * isbn_array[8]) % 11;
        if(check_digit === 10) {
            check_digit = 'X';
        }
        if(check_digit != isbn_array[9]) {
            return false;
        }
    } else if(isbn_array.length === 13) {
        let check_digit = (1 * isbn_array[0] + 3 * isbn_array[1] + 1 * isbn_array[2] + 3 * isbn_array[3] + 1 * isbn_array[4] +
            3 * isbn_array[5] + 1 * isbn_array[6] + 3 * isbn_array[7] + 1 * isbn_array[8] + 3 * isbn_array[9] + 1 * isbn_array[10] +
            3 * isbn_array[11]) % 10;
        if(check_digit !== 0) {
            check_digit = 10 - check_digit;
        }
        if(check_digit != isbn_array[12]) {
            return false;
        }
    }
    return true;
}

function getGbt7714Ref(title, author, publisher, year) {
    let reference = "";
    if(author !== "") {
        author = author.replace(/；/g,"，");
        reference = reference + author + "．";
    }
    reference = reference + title + "[M]．";
    if(publisher !== "") {
        if(year !== "") {
            reference = reference + publisher + "，";
        } else {
            reference = reference + publisher + "．";
        }
    }
    if(year !== "") {
        reference = reference + year + "．";
    }
    return reference;
}