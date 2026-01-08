// StorageService.clearAll();


document.getElementById("studentRegisterForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let grade = document.getElementById("grade").value;
    let mobile = document.getElementById("MobileNumber").value;
    let image = document.getElementById("image").files[0];
    let message = document.getElementById("message");
    let imageUrl = "";
    if (image) {
        imageUrl = await cloudinaryService.uploadImageToCloudinary(image);
    }
    if(!username || !password || !grade || !mobile || !image)
    {
         message.textContent = "Please Complete All Data";
        message.style.color = "red";
        return;
    }
    let regex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!regex.test(password))
    {
        message.textContent = "Invalid Passwod Format";
        message.style.color = "red";
        return;

    }
    let result = StudentService.registerStudent({ username, password, grade, mobile, imageUrl });
    if (!result) {
        message.textContent = "User Already Exsists";
        message.style.color = "red";
        return;
    }
    sessionStorage.setItem("currentUserId", result.id);
    message.textContent = "Registered Successfully";
    message.style.color = "green";
    setTimeout(() => {
        window.location.href = "login.html"

    }, 1000);
});