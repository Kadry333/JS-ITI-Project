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

    let result = StudentService.registerStudent({ username, password, grade, mobile, imageUrl });
    if (!result) {
        message.textContent = "User Already Exsists";
        message.style.color = "red";
        return;
    }
    sessionStorage.setItem("currentUserId", result.id);
    message.textContent = "Logged in Successfully";
    message.style.color = "green";
    setTimeout(() => {
        window.location.href = "studentProfile.html"

    }, 1000);


});