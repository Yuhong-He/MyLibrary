let page = 1;
let total_page = 0;
let total_data = 0;
generalDocumentReady();

function navBlockColor() {
    $("#nav_profile").addClass("active");
}

function to_page() {
    $.ajax({
        url:"../PHP/myRequests.php",
        method:"GET",
        data:{
            page: page,
            user_name: getCookie("username"),
            user_id: getCookie(getCookie("username") + "Id")
        },
        success:function(result){
            if(result.code === 200) {
                total_page = result.pages;
                total_data = result.count;
                build_my_requests_table(result);
                build_page_info(result);
                build_page_nav(result);
            } else if(result.code === 401) {
                window.location.replace("index.html");
            }
        }
    });
}

function build_my_requests_table(result){
    if(result.count > 0) {
        $("#my_requests_table_body").empty();
        const request = result.body;
        $.each(request, function(index, item){
            const book = $("<td></td>").append(item.book);
            const time = $("<td></td>").append(item.time);
            let status_icon = "";
            if(item.status === "N") {
                status_icon = "<i style='color: red' title='" + arrLang[lang]["NOT_FINISH_YET"]
                                + "' class='fa-regular fa-circle-xmark'></i>";
            } else if(item.status === "Y") {
                status_icon = "<i style='color: green' title='" + arrLang[lang]["FINISH"]
                                + "' class='fa-regular fa-circle-check'></i>";
            }
            const status = $("<td></td>").append(status_icon);
            const admin = $("<td></td>").append(item.admin);
            let delBtn = $("<button></button>").addClass("btn btn-danger btn-sm del-btn")
                .append($("<span></span>").addClass("glyphicon glyphicon-trash"));
            delBtn.attr("del-id", item.id);
            const btnTd = $("<td></td>").append(delBtn);
            $("<tr></tr>").append(book).append(time).append(status).append(admin).append(btnTd)
                .appendTo("#my_requests_table_body");
        })
    } else {
        $("#my_requests_table_body").html(
            "<td colspan='5' style='text-align: center; font-size: large; color: grey;'>" +
            arrLang[lang]["NO_DATA"] +
            "</td>"
        );
    }
}

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
                if((page === total_page) && (total_data % 5 === 1) && (total_data !== 1)) {
                    page = page - 1;
                }
                to_page();
                $("#delRequestModal").modal('hide');
            } else if(result.code === 201) {
                $("#del_request_error").html(arrLang[lang]["NOT_YOUR_REQUEST"]);
                $("#del_request_fail").css("display", "block");
            } else if(result.code === 401) {
                $("#del_request_error").html(arrLang[lang]["NO_ACCESS_DELETE_REQUEST"]);
                $("#del_request_fail").css("display", "block");
            }
        }
    });
});