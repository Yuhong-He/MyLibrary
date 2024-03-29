let page = 1;
let rows = 5;
let search = "";
let total_page = 0;
let total_data = 0;
generalDocumentReady();

function navBlockColor() {
    $("#nav_books").addClass("active");
    $("#nav_category").addClass("active");
    $("#display_5_rows").addClass("active");
}

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
            total_page = result.pages;
            total_data = result.count;
            createTableHeader();
            build_categories_table(result);
            build_page_info(result);
            build_page_nav(result);
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
                .attr("href", "#")
                .addClass("cat-link")
                .attr("cat-id", item.id)
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
            $("#all_categories_table_body").html(
                "<td colspan='4' style='text-align: center; font-size: large; color: grey;'>" +
                arrLang[lang]["NO_DATA"] +
                "</td>"
            );
        } else {
            $("#all_categories_table_body").html(
                "<td colspan='2' style='text-align: center; font-size: large; color: grey;'>" +
                arrLang[lang]["NO_DATA"] +
                "</td>"
            );
        }
    }
}

$(document).on("click", "#add_new_category_btn", function(){
    $("#add_category_modal_title").html(arrLang[lang]["ADD_CATEGORY"]);
    reset_form("#addCategoryModal form");
    $("#add_category_fail").css("display", "none");
    $("#insert_new_category_btn").css("display", "block");
    $("#update_category_btn").css("display", "none");
    $("#addCategoryModal").modal({
        backdrop: "static"
    });
});

$(document).on("click", "#insert_new_category_btn", function(){
    if(!validAddCategory()) {
        return false;
    }
    $.ajax({
        url:"../PHP/addCategory.php",
        method:"POST",
        data:{
            id: $("#new_category_id").val().trim(),
            zh_name: $("#new_category_zh_name").val().trim(),
            en_name: $("#new_category_en_name").val().trim(),
            rows: rows,
            username: getCookie("username"),
            authority: getCookie(getCookie("username") + "Auth")
        },
        success:function(result){
            if(result.code === 200){
                closeAddModalAndToPage(result);
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
                $("#add_category_error").html(arrLang[lang]["NO_USER_RIGHTS_ADD_CATEGORY"]);
                $("#add_category_fail").css("display", "block");
            }
        }
    });
});

function closeAddModalAndToPage(result) {
    search = "";
    $("#search_box").val("");
    $("#clean_search_box").css("display", "none");
    page = result.page;
    to_page();
    $("#addCategoryModal").modal('hide');
}

$(document).on("click", ".edit-btn", function(){
    $("#add_category_modal_title").html(arrLang[lang]["EDIT_CATEGORY"]);
    $("#add_category_fail").css("display", "none");
    reset_form("#addCategoryModal form");
    const cat_id = $(this).attr("edit-id");
    $.ajax({
        url:"../PHP/getOneCategory.php",
        method:"GET",
        data:{
            id: cat_id
        },
        success:function(result){
            $("#new_category_id").val(result.id);
            $("#new_category_zh_name").val(result.zh_name);
            $("#new_category_en_name").val(result.en_name);
            $("#insert_new_category_btn").css("display", "none");
            $("#update_category_btn").attr("cat-id", result.id).attr("cat-zh", result.zh_name).attr("cat-en", result.en_name)
                .css("display", "block");
        }
    });
    $("#addCategoryModal").modal({
        backdrop: "static"
    });
});

$(document).on("click", "#update_category_btn", function(){
    const orig_id = $(this).attr("cat-id");
    const orig_zh = $(this).attr("cat-zh");
    const orig_en = $(this).attr("cat-en");
    if(!validAddCategory()) {
        return false;
    }
    $.ajax({
        url:"../PHP/updateCategory.php",
        method:"POST",
        data:{
            orig_id: orig_id,
            orig_zh: orig_zh,
            orig_en: orig_en,
            id: $("#new_category_id").val().trim(),
            zh_name: $("#new_category_zh_name").val().trim(),
            en_name: $("#new_category_en_name").val().trim(),
            rows: rows,
            username: getCookie("username"),
            authority: getCookie(getCookie("username") + "Auth")
        },
        success:function(result){
            if(result.code === 200){
                closeAddModalAndToPage(result);
            } else if(result.code === 201) {
                show_validate_msg("#new_category_id", "error", arrLang[lang]["CATEGORY_ID_REPEAT"]);
            } else if(result.code === 202) {
                show_validate_msg("#new_category_zh_name", "error", arrLang[lang]["CATEGORY_NAME_REPEAT"]);
            } else if(result.code === 203) {
                show_validate_msg("#new_category_en_name", "error", arrLang[lang]["CATEGORY_NAME_REPEAT"]);
            } else if(result.code === 401) {
                $("#add_category_error").html(arrLang[lang]["NO_ACCESS_EDIT_CATEGORY"]);
                $("#add_category_fail").css("display", "block");
            } else if(result.code === 402) {
                $("#add_category_error").html(arrLang[lang]["NO_USER_RIGHTS_EDIT_CATEGORY"]);
                $("#add_category_fail").css("display", "block");
            }
        }
    });
});

function validAddCategory() {
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
    return true;
}

$(document).on("click", ".del-btn", function(){
    $("#del_category_fail").css("display", "none");
    const cat_id = $(this).attr("del-id");
    $.ajax({
        url:"../PHP/getOneCategory.php",
        method:"GET",
        data:{
            id: cat_id
        },
        success:function(result){
            if(getLang() === "en") {
                $("#confirm_delete_category_info").html(result.en_name);
            } else {
                $("#confirm_delete_category_info").html(result.zh_name);
            }
            $("#confirm_delete_category").attr("cat-id", result.id);
        }
    });
    $("#delCategoryModal").modal({
        backdrop: "static"
    });
});

$(document).on("click", "#confirm_delete_category", function(){
    const cat_id = $(this).attr("cat-id");
    $.ajax({
        url:"../PHP/deleteCategory.php",
        method:"POST",
        data:{
            id: cat_id,
            username: getCookie("username"),
            authority: getCookie(getCookie("username") + "Auth")
        },
        success:function(result){
            if(result.code === 200) {
                if((page === total_page) && (total_data % 5 === 1) && (total_data !== 1)) {
                    page = page - 1;
                }
                to_page();
                $("#delCategoryModal").modal('hide');
            } else if(result.code === 201) {
                $("#del_category_error").html(arrLang[lang]["CATEGORY_NOT_EMPTY"]);
                $("#del_category_fail").css("display", "block");
            } else if(result.code === 401) {
                $("#del_category_error").html(arrLang[lang]["NO_ACCESS_DELETE_CATEGORY"]);
                $("#del_category_fail").css("display", "block");
            } else if(result.code === 402) {
                $("#del_category_error").html(arrLang[lang]["NO_USER_RIGHTS_DELETE_CATEGORY"]);
                $("#del_category_fail").css("display", "block");
            }
        }
    });
});

$(document).on("click", "#close_add_category_fail", function(){
    $("#add_category_fail").css("display", "none");
});

$(document).on("click", "#close_del_category_fail", function(){
    $("#del_category_fail").css("display", "none");
});