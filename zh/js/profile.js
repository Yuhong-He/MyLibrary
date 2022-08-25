function updateInfo(oldUsername, oldPassword, newUsername, newPassword, email, authority){
    $.ajax({
        url:"../Assets/common/php/updateProfile.php",
        method:"POST",
        data:{
            username: oldUsername,
            password: oldPassword,
            newUsername: newUsername,
            newPassword: newPassword,
            email: email,
            authority: authority
        },
        success:function(result){
            if(result.code === 200) {
                setCookie(newUsername, newPassword, result.email, result.authority);

                $("#usernameModel").modal('hide');
                $("#passwordModel").modal('hide');
                $("#emailModel").modal('hide');

                const usernameReplace = document.getElementById('username');
                usernameReplace.innerHTML=newUsername;
                checkLoginAndDisplay();

                const passwordReplace = document.getElementById('password');
                let hiddenPassword = "";
                for(let i=0; i<newPassword.length; i++){
                    hiddenPassword = hiddenPassword + "*";
                }
                passwordReplace.innerHTML=hiddenPassword;

                const emailReplace = document.getElementById('email');
                emailReplace.innerHTML=email;
            } else {
                if(result.code === 201){
                    show_validate_msg("#username_password", "error", "密码不正确");
                    show_validate_msg("#old_password", "error", "密码不正确");
                    show_validate_msg("#email_password", "error", "密码不正确");
                } else if(result.code === 202) {
                    show_validate_msg("#new_username", "error", "用户名已存在");
                }
            }
        }
    });
}

function saveUsername(){
    const oldUsername = getCookie("username");
    const newUsername = $("#new_username").val();
    const password = $("#username_password").val();
    const email = getCookie(oldUsername + "Email");
    const authority = getCookie(oldUsername + "Auth");
    const regName = /(^[a-zA-Z]{3,16}$)/;
    if(newUsername===""||newUsername===null){
        show_validate_msg("#new_username", "error", "必须填写用户名");
        return false;
    } else if(!regName.test(newUsername)){
        show_validate_msg("#new_username", "error", "用户名只能是3-16位英文");
        return false;
    } else {
        show_validate_msg("#new_username", "success", "");
    }
    updateInfo(oldUsername, password, newUsername, password, email, authority);
}

function savePassword(){
    const username = getCookie("username");
    const oldPassword = $("#old_password").val();
    const newPassword = $("#new_password").val();
    const repeatPassword = $("#repeat_password").val();
    const email = getCookie(username + "Email");
    const authority = getCookie(username + "Auth");
    if(newPassword.length < 5){
        show_validate_msg("#new_password", "error", "密码至少有五位");
        return false;
    } else {
        show_validate_msg("#new_password", "success", "");
    }
    if(newPassword!==repeatPassword){
        show_validate_msg("#repeat_password", "error", "新密码不一致");
        return false;
    } else {
        show_validate_msg("#repeat_password", "success", "");
    }
    updateInfo(username, oldPassword, username, newPassword, email, authority);
}

function saveEmail(){
    const username = getCookie("username");
    const password = $("#email_password").val();
    const email = $("#new_email").val();
    const authority = getCookie(username + "Auth");
    const regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    if(email === ""){
        show_validate_msg("#new_email", "error", "请输入邮箱");
        return false;
    } else if (!regEmail.test(email)){
        show_validate_msg("#new_email", "error", "邮箱格式不正确")
        return false;
    } else {
        show_validate_msg("#new_email", "success", "")
    }
    updateInfo(username, password, username, password, email, authority);
}