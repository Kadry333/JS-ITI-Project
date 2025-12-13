document.getElementById("loginForm").addEventListener("submit",function(e)
{
    e.preventDefault();
    let userName = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let exists = false;
    let match = false;
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    let role = "";
    let currentUser = null;

    for(let i = 0; i < users.length; i++)
    {
        if(users[i].username == userName)
        {
            exists = true;
            if(users[i].password == password)
            {
                match = true;
                role = users[i].role;
                currentUser = users[i];
            }
                
            break;
        }
    }
    if(exists && match)
    {
        console.log("correct");
        sessionStorage.setItem("currentUserId",currentUser.id);
        if(role == "student")
             window.location.href = "studentProfile.html";
        else
             window.location.href = "Teacher_Exam.html";
    }
    else if(exists && !match)
        console.log("password is wrong");
    else
        console.log("user not found");

});