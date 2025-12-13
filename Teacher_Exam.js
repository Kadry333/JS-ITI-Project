function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
}

function getStudents() {
    return JSON.parse(localStorage.getItem("students") || "[]");
}

function getExams() {
    return JSON.parse(localStorage.getItem("exams") || "[]");
}

function saveExams(exams) {
    localStorage.setItem("exams", JSON.stringify(exams));
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
function loadStudents() {
    let users = getUsers();
    let container = document.getElementById("studentsList");
    container.innerHTML = "";
    users.forEach(user => {
        if (user.role == "student") {
            let label = document.createElement("label");
            label.className = "flex items-center gap-2";
            label.innerHTML = `<input type="checkbox" />
            ${user.username}`;
            container.appendChild(label);
        }



    });
}
document.getElementById("createExamBtn").addEventListener("click",
    function (e) {
        e.preventDefault();
        let examName = document.getElementById("examName").value;
        let examDuration = document.getElementById("examDuration").value;
        let questionsCount = document.getElementById("questionsCount").value;
        if (!examName || !examDuration || questionsCount < 15) {
            alert("Please fill all fields (min 15 questions)");
            return;
        }
        let selectedStudents = [];
        document.querySelectorAll("#studentsList input:checked").forEach(student => {
            selectedStudents.push(student);
        });
        if (selectedStudents.length == 0) {
            alert("Select at least one student !");
            return;
        }
        let exams = getExams();
        let examId = generateId("examId");
        let exam = {
            id: examId,
            name: examName,
            duration: examDuration,
            students: selectedStudents,
            questions: []
        };
        exams.push(exam);
        saveExams(exams);
        sessionStorage.setItem("currentExamId", examId);
        window.location.href = "Teacher_Questions.html";
    });
function loadExams() {
    let list = document.getElementById("examsList");
    list.innerHTML = "";
    let exams = getExams();
    exams.forEach(exam => {
        let li = document.createElement("li");
        li.className = "cursor-pointer rounded bg-white/5 p-3 hover:bg-white/10";
        li.textContent = exam.name;
        li.addEventListener("click", function () {
            sessionStorage.setItem("currentExamId", exam.id);
            window.location.href = "Teacher_Questions.html";
        });
        list.appendChild(li);

    });
}

document.addEventListener("DOMContentLoaded", function () {
    loadStudents();
    loadExams();
});