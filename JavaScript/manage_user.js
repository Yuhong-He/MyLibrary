let page = 1;
let search = "";
generalDocumentReady();

function navBlockColor() {
    $("#nav_manage").addClass("active");
    $("#nav_manage_user").addClass("active");
}

function to_page() {
    $.ajax({
        url:"../PHP/allUser.php",
        method:"GET",
        data:{
            page: page,
            user_name: getCookie("username"),
            user_auth: getCookie(getCookie("username") + "Auth"),
            search: search
        },
        success:function(result){
            if(result.code === 200) {
                build_user_table(result);
                build_page_info(result);
                build_page_nav(result);
            } else if(result.code === 401) {
                window.location.replace("index.html");
            }
        }
    });
}

function build_user_table(result) {
    if(result.count > 0) {
        $("#all_user_body").empty();
        const user = result.body;
        $.each(user, function(index, item){
            const username = $("<td></td>").append(item.username);
            const email = $("<td></td>").append(item.email);
            let authority_name = "";
            if(parseInt(item.authority) === 1) {
                authority_name = arrLang[lang]["USER"];
            } else if (parseInt(item.authority) === 2) {
                authority_name = arrLang[lang]["ADMIN"];
            } else if (parseInt(item.authority) === 3) {
                authority_name = arrLang[lang]["SUPER_ADMIN"];
            }
            const authority = $("<td></td>").append(authority_name);
            let banned;
            if(item.banned === "N") {
                banned = $("<td></td>");
            } else {
                banned = $("<td></td>").append("<i style='color: red' class='fa-solid fa-ban'></i>");
            }
            let manageBtn = $("<button></button>").addClass("btn btn-primary btn-sm manage-btn")
                .append($("<span></span>").addClass("glyphicon glyphicon-cog"));
            manageBtn.attr("manage-id", item.id);
            const btnTd = $("<td></td>").append(manageBtn);
            $("<tr></tr>").append(username).append(email).append(authority).append(banned).append(btnTd)
                .appendTo("#all_user_body");
        })
    } else {
        $("#all_user_body").html(
            "<td colspan='5' style='text-align: center; font-size: large; color: grey;'>" +
            arrLang[lang]["NO_DATA"] +
            "</td>"
        );
    }
}

$(document).on("click", ".manage-btn", function(){
    const user_id = $(this).attr("manage-id");
    reset_form("#manageUserModal form");
    $("#manage_user_fail").css("display", "none");
    $.ajax({
        url:"../PHP/getOneUser.php",
        method:"GET",
        data:{
            id: user_id
        },
        success:function(result){
            if(result.code === 200) {
                if(parseInt(result.authority) === 3) {
                    $("#open_manage_user_fail_info").html(arrLang[lang]["CAN_NOT_MANAGE_SUPER_ADMIN"]);
                    $("#open_manage_user_fail").css("display", "block");
                } else {
                    $("#manage_user_username").val(result.username);
                    $('input[name="authorityOptions"][value="' + result.authority + '"]').prop("checked",true);
                    $('input[name="banOptions"][value="' + result.banned + '"]').prop("checked",true);
                    $("#confirm_manage_user").attr("manage-id", user_id);
                    $("#manageUserModal").modal({
                        backdrop: "static"
                    });
                }
            }
        }
    });
});

$(document).on("click", "#confirm_manage_user", function(){
    const user_id = $(this).attr("manage-id");
    const authority = $('input[name="authorityOptions"]:checked').val();
    const banned = $('input[name="banOptions"]:checked').val();
    $.ajax({
        url:"../PHP/updateUserAuth.php",
        method:"POST",
        data:{
            id: user_id,
            authority: authority,
            banned: banned,
            user_name: getCookie("username"),
            user_auth: getCookie(getCookie("username") + "Auth")
        },
        success:function(result){
            if(result.code === 200) {
                $("#manageUserModal").modal('hide');
                to_page();
            } else if(result.code === 201) {
                $("#manage_user_error").html(arrLang[lang]["CAN_NOT_BAN_ADMIN"]);
                $("#manage_user_fail").css("display", "block");
            } else if(result.code === 401) {
                $("#manage_user_error").html(arrLang[lang]["NO_ACCESS_UPDATE_USER_AUTH"]);
                $("#manage_user_fail").css("display", "block");
            } else if(result.code === 402) {
                $("#manage_user_error").html(arrLang[lang]["NO_USER_RIGHTS_UPDATE_USER_AUTH"]);
                $("#manage_user_fail").css("display", "block");
            }
        }
    });
});

$(document).on("click", "#close_open_manage_user_fail", function(){
    $("#open_manage_user_fail").css("display", "none");
});
$(document).on("click", "#close_manage_user_fail", function(){
    $("#manage_user_fail").css("display", "none");
});