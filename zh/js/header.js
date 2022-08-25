function validate_login_form() {
    const userName = $("#userName_login").val();
    if(userName === ""){
        show_validate_msg("#userName_login", "error", "请输入用户名");
        return false;
    } else {
        show_validate_msg("#userName_login", "success", "");
    }
    const password = $("#password_login").val();
    if(password === ""){
        show_validate_msg("#password_login", "error", "请输入密码");
        return false;
    } else {
        show_validate_msg("#password_login", "success", "");
    }
    return true;
}

$("#model_login_btn").click(function() {
    if(!validate_login_form()){
        return false;
    }
    const userName = $("#userName_login").val();
    const password = $("#password_login").val();
    $.ajax({
        url:"../Assets/common/php/login.php",
        method:"POST",
        data:{
            username: userName,
            password: password
        },
        success:function(result){
            if(result.code === 200) {
                setCookie(userName, password, result.email, result.authority);
                displayAfterLoad();
                $("#loginModel").modal('hide');
            } else {
                if(result.code === 201){
                    show_validate_msg("#password_login", "error", "密码不正确");
                } else if(result.code === 400) {
                    show_validate_msg("#userName_login", "error", "用户名不存在");
                }
            }
        }
    });
});

function validate_register_form(userName, password, passwordRepeat, email) {
    const regName = /(^[a-zA-Z]{3,16}$)/;
    if(userName===""||userName===null){
        show_validate_msg("#userName_register", "error", "请输入用户名");
        return false;
    } else if(!regName.test(userName)){
        show_validate_msg("#userName_register", "error", "用户名只能是3-16位英文");
        return false;
    } else {
        show_validate_msg("#userName_register", "success", "");
    }
    if(password.length < 5){
        show_validate_msg("#password_register", "error", "密码至少有五位");
        return false;
    } else {
        show_validate_msg("#password_register", "success", "");
    }
    if(password!==passwordRepeat){
        show_validate_msg("#password_register_repeat", "error", "密码不一致");
        return false;
    } else {
        show_validate_msg("#password_register_repeat", "success", "");
    }
    const regEmail = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    if(email === ""){
        show_validate_msg("#email_register", "error", "请输入邮箱");
        return false;
    } else if (!regEmail.test(email)){
        show_validate_msg("#email_register", "error", "邮箱格式不正确")
        return false;
    } else {
        show_validate_msg("#email_register", "success", "")
    }
    return true;
}

$("#model_register_btn").click(function() {
    const userName = $("#userName_register").val();
    const password = $("#password_register").val();
    const passwordRepeat = $("#password_register_repeat").val();
    const email = $("#email_register").val();
    if(!validate_register_form(userName, password, passwordRepeat, email)){
        return false;
    }
    $.ajax({
        url:"../Assets/common/php/register.php",
        method:"POST",
        data:{
            username: userName,
            password: password,
            email: email
        },
        success:function(result){
            if(result.code === 200) {
                setCookie(userName, password, result.email, result.authority);
                $("#userName_login").val(userName);
                $("#password_login").val(password);
                $("#registerModel").modal('hide');
            } else {
                if(result.code === 202){
                    show_validate_msg("#userName_register", "error", "用户名已存在");
                }
                if(result.code === 203){
                    show_validate_msg("#email_register", "error", "邮箱已被使用");
                }
            }
        }
    });
});