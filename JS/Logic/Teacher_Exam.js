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
        let users = StorageService.get("users");
        this.studentsList.innerHTML = "";
        students.forEach(student => {
            let user = users.find(user=>user.id == student.userId);
            let label = document.createElement("label");
            label.innerHTML = `
                <input 
                    type="checkbox" 
                    class="student-checkbox"
                    value="${student.userId}"
                />
                <span>${user.username}</span>
            `;
            this.studentsList.appendChild(label);
        });
    }
    loadExams() {
        this.examsList.innerHTML = "";
        let exams = ExamService.getExams();
        exams.forEach(exam => {
            let li = document.createElement("li");
            li.className = "cursor-pointer rounded bg-white/5 p-3 hover:bg-white/10";
            li.textContent = exam.name;

            li.addEventListener("click", () => {
                sessionStorage.setItem("currentExamId", exam.id);
                window.location.href = "Teacher_Questions.html";
            });

            this.examsList.appendChild(li);
        });
    }
    handleCreateExam(e) {
        e.preventDefault();
        let examName = document.getElementById("examName").value;
        let examDuration = document.getElementById("examDuration").value;
        let questionsCount = document.getElementById("questionsCount").value;
        let teachetId = sessionStorage.getItem("currentUserId");
        if (!examName || !examDuration || questionsCount < 15) {
            alert("Please fill all fields (min 15 questions)");
            return;
        }
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
            teachetId,
            selectedStudents,
        });
        document.querySelectorAll(".student-checkbox:checked")
            .forEach(s => {
                ExamService.assignExamToStudent(examId, s.value);
            });
        sessionStorage.setItem("currentExamId", examId);
        window.location.href = "Teacher_Questions.html";

    }
}
document.addEventListener("DOMContentLoaded", function () {
    new TeacherExamPage();
});