class AddQustionService {
    static getCurrentExam() {
        let exams = JSON.parse(localStorage.getItem("exams"));
        let examId = sessionStorage.getItem("currentExamId");
        return exams.find(exam => exam.id == examId) || null;
    }
    static saveExams(exams) {
        StorageService.set("exams", exams);
    }

}