$(document).ready(function(){
    const username = getCookie("username");
    if(username===""){
        window.location.replace("index.html");
        return false;
    }
    $("#headerContent").load("header.html");
    $("#footerContent").load("footer.html");
    setTimeout(() => displayInfo(), 50);
    setTimeout(() => navBlockColor(), 50);
});

function navBlockColor() {
    $("#nav_profile").addClass("active");
}

function displayInfo(){
    const username = getCookie("username");
    $("#profile_username").text(username);
    const userID = getCookie(username + "Id");
    $("#profile_user_id").text(userID);
    const password = getCookie(username + "Password");
    let hiddenPassword = "";
    for(let i=0; i<password; i++){
        hiddenPassword = hiddenPassword + "*";
    }
    $("#profile_password").text(hiddenPassword);
    const email = getCookie(username + "Email");
    $("#profile_email").text(email);
    let user_rights;
    if(getCookie(username + "Auth") === "1") {
        user_rights = arrLang[lang]["USER"];
    } else if (getCookie(username + "Auth") === "2") {
        user_rights = arrLang[lang]["ADMIN"];
    } else {
        user_rights = arrLang[lang]["SUPER_ADMIN"];
    }
    $("#profile_user_rights").text(user_rights);
}

$(document).on("click", "#edit_username_button", function(){
    reset_form("#usernameModal form");
    $(".profile_update_fail").css("display", "none");
    $("#new_username").val(getCookie("username"));
    $("#usernameModal").modal({
        backdrop:"static"
    });
});

$(document).on("click", "#edit_password_button", function(){
    reset_form("#passwordModal form");
    $(".profile_update_fail").css("display", "none");
    $("#passwordModal").modal({
        backdrop:"static"
    });
});

$(document).on("click", "#edit_email_button", function(){
    reset_form("#emailModal form");
    $(".profile_update_fail").css("display", "none");
    $("#new_email").val(getCookie(getCookie("username") + "Email"));
    $("#emailModal").modal({
        backdrop:"static"
    });
});

function updateInfo(oldUsername, oldPassword, oldEmail, newUsername, newPassword, newEmail, authority, id){
    $.ajax({
        url:"../PHP/updateUser.php",
        method:"POST",
        data:{
            username: oldUsername,
            password: oldPassword,
            email: oldEmail,
            newUsername: newUsername,
            newPassword: newPassword,
            newEmail: newEmail,
            authority: authority,
            id: id
        },
        success:function(result){
            if(result.code === 200) {
                setUserCookie(newUsername, newPassword, newEmail, result.authority, result.id);

                $("#usernameModal").modal('hide');
                $("#passwordModal").modal('hide');
                $("#emailModal").modal('hide');

                $("#profile_username").html(newUsername);

                let hiddenPassword = "";
                for(let i=0; i<newPassword.length; i++){
                    hiddenPassword = hiddenPassword + "*";
                }
                $("#profile_password").html(hiddenPassword);

                $("#profile_email").html(newEmail);
            } else {
                if(result.code === 201){
                    show_validate_msg("#username_password", "error", arrLang[lang]["PASSWORD_INCORRECT"]);
                    show_validate_msg("#old_password", "error", arrLang[lang]["PASSWORD_INCORRECT"]);
                    show_validate_msg("#email_password", "error", arrLang[lang]["PASSWORD_INCORRECT"]);
                } else if(result.code === 202) {
                    show_validate_msg("#new_username", "error", arrLang[lang]["USERNAME_EXIST"]);
                } else if(result.code === 203) {
                    show_validate_msg("#new_email", "error", arrLang[lang]["EMAIL_USED"]);
                } else if(result.code === 204) {
                    show_validate_msg("#new_email", "error", arrLang[lang]["EMAIL_INVALID"]);
                } else if(result.code === 401) {
                    $(".profile_update_fail_info").html(arrLang[lang]["INVALID_PROFILE_UPDATE"]);
                    $(".profile_update_fail").css("display", "block");
                } else if(result.code === 402) {
                    $(".profile_update_fail_info").html(arrLang[lang]["YOU_WERE_BANNED"]);
                    $(".profile_update_fail").css("display", "block");
                }
            }
        }
    });
}

$(document).on("click", "#save_username_button", function(){
    const oldUsername = getCookie("username");
    const newUsername = $("#new_username").val();
    const password = $("#username_password").val();
    const email = getCookie(oldUsername + "Email");
    const authority = getCookie(oldUsername + "Auth");
    const userId = getCookie(oldUsername + "Id");
    const regName = /(^[a-zA-Z0-9]{3,16}$)/;
    if(newUsername===""||newUsername===null){
        show_validate_msg("#new_username", "error", arrLang[lang]["ENTER_USERNAME"]);
        return false;
    } else if(!regName.test(newUsername)){
        show_validate_msg("#new_username", "error", arrLang[lang]["INVALID_USERNAME"]);
        return false;
    } else {
        show_validate_msg("#new_username", "success", "");
    }
    updateInfo(oldUsername, password, email, newUsername, password, email, authority, userId);
});

$(document).on("click", "#save_password_button", function(){
    const username = getCookie("username");
    const oldPassword = $("#old_password").val();
    const newPassword = $("#new_password").val();
    const repeatPassword = $("#repeat_password").val();
    const email = getCookie(username + "Email");
    const authority = getCookie(username + "Auth");
    const userId = getCookie(username + "Id");
    if(newPassword.length < 5 || newPassword.length > 16){
        show_validate_msg("#new_password", "error", arrLang[lang]["INVALID_PASSWORD"]);
        return false;
    } else {
        show_validate_msg("#new_password", "success", "");
    }
    if(newPassword!==repeatPassword){
        show_validate_msg("#repeat_password", "error", arrLang[lang]["PASSWORD_NOT_MATCH"]);
        return false;
    } else {
        show_validate_msg("#repeat_password", "success", "");
    }
    updateInfo(username, oldPassword, email, username, newPassword, email, authority, userId);
});

$(document).on("click", "#save_email_button", function(){
    const username = getCookie("username");
    const password = $("#email_password").val();
    const oldEmail = getCookie(username + "Email");
    const newEmail = $("#new_email").val();
    const authority = getCookie(username + "Auth");
    const userId = getCookie(username + "Id");
    const regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    if(newEmail === ""){
        show_validate_msg("#new_email", "error", arrLang[lang]["ENTER_EMAIL"]);
        return false;
    }else if (newEmail.length > 50) {
        show_validate_msg("#new_email", "error", arrLang[lang]["EMAIL_TOO_LONG"])
        return false;
    } else if (!regEmail.test(newEmail)){
        show_validate_msg("#new_email", "error", arrLang[lang]["INVALID_EMAIL"])
        return false;
    } else {
        show_validate_msg("#new_email", "success", "")
    }
    updateInfo(username, password, oldEmail, username, password, newEmail, authority, userId);
});