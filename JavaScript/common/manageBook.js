function cleanAddModal() {
    reset_form("#addBookModal form");
    $("#display_book_repeat_checkbox").css("display", "none");
    $("#display_code_repeat_checkbox").css("display", "none");
    $("#add_book_fail").css("display", "none");
}

function validAddBook() {
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
    return true;
}

function addBookError(result) {
    if(result.code === 201) {
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

function addBookData() {
    return {
        author: $("#new_book_author").val().trim(),
        title: $("#new_book_title").val().trim(),
        location: $("#new_book_location").val().trim(),
        publisher: $("#new_book_publisher").val().trim(),
        year: $("#new_book_year").val().trim(),
        code: $("#new_book_code").val().trim(),
        category: $("#new_book_category").val(),
        bookNotRepeat: $("#confirm_book_not_repeat").is(":checked") ? "true" : "",
        codeNotRepeat: $("#confirm_code_not_repeat").is(":checked") ? "true" : "",
        username: getCookie("username"),
        authority: getCookie(getCookie("username") + "Auth")
    };
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
    cleanAddModal();
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
    const book_id = $(this).attr("book-id");
    if(!validAddBook()) {
        return false;
    }
    $.ajax({
        url:"../PHP/updateBook.php",
        method:"POST",
        data:{
            id: book_id,
            author: $("#new_book_author").val().trim(),
            title: $("#new_book_title").val().trim(),
            location: $("#new_book_location").val().trim(),
            publisher: $("#new_book_publisher").val().trim(),
            year: $("#new_book_year").val().trim(),
            code: $("#new_book_code").val().trim(),
            category: $("#new_book_category").val(),
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

function delBookError(result) {
    if(result.code === 401) {
        $("#del_book_error").html(arrLang[lang]["NO_ACCESS_DELETE_BOOK"]);
        $("#del_book_fail").css("display", "block");
    } else if(result.code === 402) {
        $("#add_book_error").html(arrLang[lang]["NO_USER_RIGHTS_DELETE_BOOK"]);
        $("#add_book_fail").css("display", "block");
    }
}

$(document).on("click", "#author_semicolon", function(){
    document.getElementById("new_book_author").value += "; ";
    $("#new_book_author").focus();
});

$(document).on("click", "#author_comma", function(){
    document.getElementById("new_book_author").value += ",";
    $("#new_book_author").focus();
});

$(document).on("click", "#year_comma", function(){
    document.getElementById("new_book_year").value += ",";
    $("#new_book_year").focus();
});

$(document).on("click", "#code_dash", function(){
    document.getElementById("new_book_code").value += "-";
    $("#new_book_code").focus();
});

$(document).on("click", "#code_dot", function(){
    document.getElementById("new_book_code").value += "·";
    $("#new_book_code").focus();
});