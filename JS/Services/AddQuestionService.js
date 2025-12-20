class AddQustionService {
    static getCurrentExam() {
        let exams = JSON.parse(localStorage.getItem("exams"));
        let examId = sessionStorage.getItem("currentExamId");
        return exams.find(exam => exam.id == examId) || null;
    }
      static getAllExams() {
         let data = JSON.parse(localStorage.getItem("exams"));
        return data ? data : [];
    }
    static saveExams(exams) {
        StorageService.set("exams", exams);
    }
    static validateDefiality(questions) {
        let easy = false;
        let medium = false;
        let hard = false;
        questions.forEach(question => {
            if (question.difficulty == "Easy")
                easy = true;
            if (question.difficulty == "Middle")
                medium = true;
            if (question.difficulty == "Hard")
                hard = true;
        });
        if (easy && medium && hard)
            return true;
        else
            return false;
    }
    // static validateTotalScore(questions) {
    //     let total = 0;
    //     questions.forEach(q => {
    //         total += Number(q.score);
    //     });
    //     if (total == 100)
    //         return true;
    //     else
    //         return false;
    // }
    static deleteExam(examId)
    {
        let exams = this.getAllExams();
        exams = exams.filter(exam => exam.id != examId);
        this.saveExams(exams);
    }

}