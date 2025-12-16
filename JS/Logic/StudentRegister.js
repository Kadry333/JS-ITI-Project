//StorageService.clearAll();
document.getElementById("studentRegisterForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let grade = document.getElementById("grade").value;
    let mobile = document.getElementById("MobileNumber").value;
    let image = document.getElementById("image").value;
    let message = document.getElementById("message");
    let students = StorageService.get("students");
    studentId = StorageService.generateId("studentId");
    let result = UserService.registerStudent({ username, password });
    if (!result) {
        message.textContent = "User Already Exsists";
        message.style.color = "red";
        return;
    }

    //save Student

    let newStudent = {
        id: studentId,
        userId: result.id,
        grade: grade,
        mobile: mobile,
        imageUrl: image,
        completedExams: [],
        requiredExams: [],
        theme: "dark"
    };
    students.push(newStudent);
    StorageService.set("students", students);
    sessionStorage.setItem("currentUserId", result.id);
    message.textContent = "Logged in Successfully";
    message.style.color = "green";
    setTimeout(() => {
        window.location.href = "studentProfile.html"

    }, 1000);


});