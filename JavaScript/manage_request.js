let page = 1;
let total_page = 0;
let total_data = 0;
let display_delete = false;
generalDocumentReady();

function navBlockColor() {
    $("#nav_manage").addClass("active");
    $("#nav_manage_request").addClass("active");
}

$(document).on("click", "#display_deleted_requests", function(){
    display_delete = display_delete === false;
    page = 1;
    to_page();
});

function to_page() {
    $.ajax({
        url:"../PHP/allRequests.php",
        method:"GET",
        data:{
            page: page,
            user_name: getCookie("username"),
            user_auth: getCookie(getCookie("username") + "Auth"),
            display_delete: display_delete
        },
        success:function(result){
            if(result.code === 200) {
                total_page = result.pages;
                total_data = result.count;
                build_all_requests_table(result);
                build_page_info(result);
                build_page_nav(result);
            } else if(result.code === 401) {
                window.location.replace("index.html");
            }
        }
    });
}

function build_all_requests_table(result) {
    if(result.count > 0) {
        $("#all_requests_table_body").empty();
        const request = result.body;
        $.each(request, function(index, item){
            const book = $("<td></td>").append(item.book);
            const user = $("<td></td>").append(item.user);
            const email = $("<td></td>").append(item.email);
            const time = $("<td></td>").append(item.time);
            let status_icon = "";
            if(item.status === "N") {
                status_icon = "<i style='color: red' title='" + arrLang[lang]["NOT_FINISH_YET"]
                    + "' class='fa-regular fa-circle-xmark'></i>";
            } else if(item.status === "Y") {
                status_icon = "<i style='color: green' title='" + arrLang[lang]["FINISH"]
                    + "' class='fa-regular fa-circle-check'></i>";
            } else if(item.status === "D") {
                status_icon = "<i style='color: grey' title='" + arrLang[lang]["DELETED"]
                    + "' class='fa-solid fa-trash-can'></i>";
            }
            const status = $("<td></td>").append(status_icon);
            const admin = $("<td></td>").append(item.admin);
            let doneBtn = "";
            if(item.status === "N") {
                doneBtn = $("<button></button>").addClass("btn btn-primary btn-sm done-btn")
                    .append($("<span></span>").addClass("glyphicon glyphicon-ok"));
                doneBtn.attr("done-id", item.id);
            }
            let delBtn = "";
            if(item.status !== "D") {
                delBtn = $("<button></button>").addClass("btn btn-danger btn-sm del-btn pull-right")
                    .append($("<span></span>").addClass("glyphicon glyphicon-trash"));
                delBtn.attr("del-id", item.id);
            }
            const btnTd = $("<td></td>").append(doneBtn).append(" ").append(delBtn);
            $("<tr></tr>").append(book).append(user).append(email).append(time).append(status).append(admin).append(btnTd)
                .appendTo("#all_requests_table_body");
        })
    } else {
        $("#all_requests_table_body").html(
            "<td colspan='7' style='text-align: center; font-size: large; color: grey;'>" +
            arrLang[lang]["NO_DATA"] +
            "</td>"
        );
    }
}

$(document).on("click", ".done-btn", function(){
    const req_id = $(this).attr("done-id");
    $.ajax({
        url:"../PHP/getOneRequest.php",
        method:"GET",
        data:{
            id: req_id
        },
        success:function(result){
            if(result.code === 200) {
                $("#confirm_mark_done_request_info").html(result.book);
                $("#confirm_mark_done_request").attr("req-id", req_id);
            }
        }
    });
    $("#markDoneRequestModal").modal({
        backdrop: "static"
    });
});

$(document).on("click", "#confirm_mark_done_request", function(){
    const req_id = $(this).attr("req-id");
    $.ajax({
        url:"../PHP/markDoneRequest.php",
        method:"POST",
        data:{
            id: req_id,
            user_name: getCookie("username"),
            user_id: getCookie(getCookie("username") + "Id"),
            user_auth: getCookie(getCookie("username") + "Auth")
        },
        success:function(result){
            if(result.code === 200) {
                to_page();
                $("#markDoneRequestModal").modal('hide');
            } else if(result.code === 401) {
                $("#mark_done_request_error").html(arrLang[lang]["NO_ACCESS_MARK_DONE_REQUEST"]);
                $("#mark_done_request_fail").css("display", "block");
            }
        }
    });
});

$(document).on("click", "#close_mark_done_request_fail", function(){
    $("#mark_done_request_fail").css("display", "none");
});

$(document).on("click", "#confirm_delete_request", function(){
    const req_id = $(this).attr("req-id");
    $.ajax({
        url:"../PHP/deleteRequest.php",
        method:"POST",
        data:{
            id: req_id,
            user_name: getCookie("username"),
            user_id: getCookie(getCookie("username") + "Id"),
            user_auth: getCookie(getCookie("username") + "Auth")
        },
        success:function(result){
            if(result.code === 200) {
                if(display_delete === false) {
                    if((page === total_page) && (total_data % 5 === 1) && (total_data !== 1)) {
                        page = page - 1;
                    }
                }
                to_page();
                $("#delRequestModal").modal('hide');
            } else if(result.code === 401) {
                $("#del_request_error").html(arrLang[lang]["NO_ACCESS_DELETE_REQUEST"]);
                $("#del_request_fail").css("display", "block");
            }
        }
    });
});