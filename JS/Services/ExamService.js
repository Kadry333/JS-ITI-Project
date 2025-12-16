class ExamService {
    static getExams() {
        return StorageService.get("exams");
    }
    static saveExams(exams) {
        StorageService.set("exams", exams);
    }
    static createExam(data) {
        let exams = this.getExams();

        let exam = {
            id: StorageService.generateId("examId"),
            name: data.examName,
            duration: data.examDuration,
            totalQuestion: data.questionsCount,
            teacherId: data.teacherId,
            assignedStudents: data.selectedStudents,
            questions: []
        };

        exams.push(exam);
        this.saveExams(exams);

        return exam.id;
    }
    static assignExamToStudent(examId,studentUserId)
    {
        let students = StorageService.get("students");
        students.forEach(student => {
            if(student.userId == studentUserId)
            {
                student.requiredExams.push({
                    examId: examId,
                    status:"pending"
                });
            }
        });
        StorageService.set("students",students);
    }
}