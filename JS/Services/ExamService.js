class ExamService {
    static getAllExams() {
         let data = JSON.parse(localStorage.getItem("exams"));
        return data ? data : [];
    }
    static getExam(examId)
    {
        return this.getAllExams().find(e => e.id = examId);
    }
    static getTeacherExams()
    {
        let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
        return this.getAllExams().filter(exam =>
            exam.teacherId == currentUser.id
        );
    }
    static saveExams(exams) {
        StorageService.set("exams", exams);
    }
    static createExam(data) {
        let exams = this.getAllExams();

        let exam = {
            id: StorageService.generateId("examId"),
            name: data.examName,
            duration: data.examDuration,
            totalQuestion: data.questionsCount,
            teacherId: data.teacherId,
            assignedStudents: data.selectedStudents,
            examsExpireDate: data.expireDate,
            questions: []
        };

        exams.push(exam);
        this.saveExams(exams);

        return exam.id;
    }
    static assignExamToStudent(examId,studentId)
    {
        let students = StorageService.get("students");

        students.forEach(student => {
            if(student.id == studentId)
            {
                student.requiredExams.push({
                    examId: examId,
                    status:"pending"
                });
            }
        });
        StorageService.set("students",students);
    }
    static updateExam(updatedExam)
    {
        let allExams = this.getAllExams();
        for(let i = 0; i < allExams.length; i++)
        {
            if(allExams[i].id == updatedExam.id)
            {
                allExams[i] = updatedExam;
                break;
            }
        }
        this.saveExams(allExams);
    }
    static deleteExam(examId)
    {
        let allExams = this.getAllExams();
        let exams = allExams.filter(exam => exam.id != examId);
        this.saveExams(exams);
        let students = StorageService.get("students");
        students.forEach(student => {
            if(student.requiredExams)
                student.requiredExams = student.requiredExams.filter(requiredExam =>
                requiredExam.examId != examId || requiredExam.status != "pending"
            );
            
        });
        StorageService.set("students",students);
       
    }
}