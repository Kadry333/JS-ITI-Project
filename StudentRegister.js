function getUsers() {
    return JSON.parse(localStorage.getItem("users")||"[]");
}
function saveUser(arr) {
    localStorage.setItem("users", JSON.stringify(arr));
}
function getStudents() {
    return JSON.parse(localStorage.getItem("students")||"[]");
}
function saveStudents(arr) {
    localStorage.setItem("students", JSON.stringify(arr));
}
function generateId(key) {
    let lastId = localStorage.getItem(key);
    if (lastId === null) {
        lastId = 0;
    } else {
        lastId = Number(lastId);
    }
    let newId = lastId + 1;
    localStorage.setItem(key, newId);
    return newId;
}

document.getElementById("studentRegisterForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let userName = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let grade = document.getElementById("grade").value;
    let mobile = document.getElementById("MobileNumber").value;
    let image = document.getElementById("image").value;
    let message = document.getElementById("message");
    let users = getUsers();
    let students = getStudents();
    let exists = false;
    for(let i = 0; i < users.length;i++)
    {
        if(userName == users[i].username)
        {
            exists = true;
            break;
        }
    }
    if(exists)
    {
        message.textContent = "Username already exists";
        message.style.color = "red";
        return;
    }
    //save user
    let userId = generateId("userId");
    let newUser ={
        id: userId,
        username: userName,
        password: password,
        role: "student"
    };
    users.push(newUser);
    saveUser(users);
    //save Student
    studentId = generateId("studentId");
    let newStudent = {
        id: studentId,
        userId: userId,
        grade: grade,
        mobile: mobile,
        image: image,
        theme:""
    };
    students.push(newStudent);
    saveStudents(students);
    sessionStorage.setItem("currentUserId",userId);
    message.textContent = "Logged in Successfully";
    message.style.color = "green";
    setTimeout(() => {
        window.location.href = "studentProfile.html"
        
    }, 1000);
    

});