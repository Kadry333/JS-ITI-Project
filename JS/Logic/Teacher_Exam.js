//StorageService.clearAll();
let logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click",function(e)
{
    sessionStorage.clear();
    window.location.href = "login.html";
});
class TeacherExamPage {
    constructor() {
        this.studentsList = document.getElementById("studentsList");
        this.examsList = document.getElementById("examsList");
        this.createBtn = document.getElementById("createExamBtn");
        this.loadStudents();
        this.loadExams();
        this.createBtn.addEventListener("click", e => this.handleCreateExam(e));
    }
    loadStudents() {
        let students = StorageService.get("students");
        //let users = StorageService.get("users");
        this.studentsList.innerHTML = "";
        students.forEach(student => {
            //let user = users.find(user=>user.id == student.userId);
            let label = document.createElement("label");
            label.innerHTML = `
                <input 
                    type="checkbox" 
                    class="student-checkbox"
                    value="${student.id}"
                />
                <span>${student.username}</span>
            `;
            this.studentsList.appendChild(label);
        });
    }
   loadExams() {
    this.examsList.innerHTML = "";
    let exams = ExamService.getTeacherExams();
    
    exams.forEach(exam => {
        // if(exam.status !== "published") return;
        
        let li = document.createElement("li");
        li.className = "exam-item";
        
        // Exam name
        let examName = document.createElement("span");
        examName.textContent = exam.name;
        examName.className = "exam-name";
        

        let container = document.createElement("div");
        container.className = "exam-actions";
        
        
        let viewBtn = document.createElement("button");
        viewBtn.textContent = "View";
        viewBtn.className = "action-btn view-btn";
        viewBtn.onclick = (e) => {
            sessionStorage.setItem("currentExamId", exam.id);
            window.location.href = "View_Exam.html";
        };
        
    
        let updateBtn = document.createElement("button");
        updateBtn.textContent = "Update";
        updateBtn.className = "action-btn update-btn";
        updateBtn.onclick = (e) => {
            sessionStorage.setItem("currentExamId", exam.id);
            window.location.href = "Update_Exam.html";
        };
        
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "action-btn delete-btn";
        deleteBtn.onclick = (e) => {
            if(confirm(`Delete exam "${exam.name}"?`)) {
                ExamService.deleteExam(exam.id);
                this.loadExams();
            }
        };
        
        container.append(viewBtn, updateBtn, deleteBtn);
        li.append(examName, container);
        this.examsList.appendChild(li);
    });
}

    handleCreateExam(e) {
        e.preventDefault();
        let examName = document.getElementById("examName").value;
        let examDuration = document.getElementById("examDuration").value;
        let questionsCount = document.getElementById("questionsCount").value;
        let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
        let teacherId = Number(currentUser.id);
        console.log(teacherId);
        // if (!examName || !examDuration || questionsCount < 15) {
        //     alert("Please fill all fields (min 15 questions)");
        //     return;
        // }
        let selectedStudents = [];
        document.querySelectorAll(".student-checkbox:checked")
            .forEach(student => selectedStudents.push(student.value));
        if (selectedStudents.length === 0) {
            alert("Select at least one student!");
            return;
        }
        let examId = ExamService.createExam({
            examName,
            examDuration,
            questionsCount,
            teacherId,
            selectedStudents,
            status: "pending"
        });
        sessionStorage.setItem("currentExamId", examId);
        window.location.href = "Teacher_Questions.html";

    }
}
document.addEventListener("DOMContentLoaded", function () {
    new TeacherExamPage();
});