function checkLoginAndDisplay() {
    setTimeout(() => userDisplay(), 50);
    setTimeout(() => adminDisplay(), 50);
}
function userDisplay() {
    const username = getCookie("username");
    if(username===""||username===null){
        const usernameReplaceLogin = document.getElementById('username_btn');
        usernameReplaceLogin.innerHTML = "";
        const usernameBlock = document.getElementById('nav_profile');
        usernameBlock.style.display = "none";
        const obtainBlock = document.getElementById('nav_obtain');
        obtainBlock.style.display = "none";
        const manageBlock = document.getElementById('nav_manage');
        manageBlock.style.display = "none";
        const loginLogout = document.getElementById('loginLogout_btn');
        loginLogout.innerHTML = "登录";
    } else {
        const usernameReplaceLogin = document.getElementById('username_btn');
        usernameReplaceLogin.innerHTML = username;
        const usernameBlock = document.getElementById('nav_profile');
        usernameBlock.style.display = "block";
        const obtainBlock = document.getElementById('nav_obtain');
        obtainBlock.style.display = "block";
        const manageBlock = document.getElementById('nav_manage');
        manageBlock.style.display = "none";
        const loginLogout = document.getElementById('loginLogout_btn');
        loginLogout.innerHTML = "登出";
    }
}

function adminDisplay() {
    const username = getCookie("username");
    const auth = getCookie(username + "Auth");
    if(auth==="2"){
        const manageBlock = document.getElementById('nav_manage');
        manageBlock.style.display = "block";
    } else {
        const manageBlock = document.getElementById('nav_manage');
        manageBlock.style.display = "none";
    }
}