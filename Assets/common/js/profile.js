function displayInfo(){
    const username = getCookie("username");
    if(username===""){
        window.location.replace("index.html");
        return false;
    }
    $("#username").text(username);
    const password = getCookie(username);
    let hiddenPassword = "";
    for(let i=0; i<password.length; i++){
        hiddenPassword = hiddenPassword + "*";
    }
    $("#password").text(hiddenPassword);
    const email = getCookie(username + "Email");
    $("#email").text(email);
}

function editUsername(){
    reset_form("#usernameModel form");
    $("#new_username").val(getCookie("username"));
    $("#usernameModel").modal({
        backdrop:"static"
    });
}

function editPassword(){
    reset_form("#passwordModel form");
    $("#passwordModel").modal({
        backdrop:"static"
    });
}

function editEmail(){
    reset_form("#emailModel form");
    $("#new_email").val(getCookie(getCookie("username") + "Email"));
    $("#emailModel").modal({
        backdrop:"static"
    });
}