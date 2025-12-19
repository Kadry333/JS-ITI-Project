
document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    let userName = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let currentUser = await UserService.login(userName, password);
    let loginMessage = document.getElementById("loginMessage");
    if (!currentUser) {
        loginMessage.textContent = "Invalid username or password";
        loginMessage.classList.remove("hidden");
        loginMessage.classList.remove("hidden");
        loginMessage.classList.remove("text-red-700");
        loginMessage.classList.add("text-green-700");
        return;
    }

    loginMessage.textContent = `Welcome Back ${currentUser.username}`;
    loginMessage.classList.remove("hidden");
    loginMessage.classList.remove("hidden");
    loginMessage.classList.remove("text-red-700");
    loginMessage.classList.add("text-green-500");
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
     setTimeout(() => {
        if (currentUser.role == "student")
            window.location.href = "studentProfile.html";
        else
            window.location.href = "Teacher_Exam.html";
    }, 1000);


});