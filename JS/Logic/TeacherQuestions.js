
let currentQuestionIndex = 1;
let currentQuestion = document.getElementById("currentQuestion");
let currentExam = AddQustionService.getCurrentExam();
if (!currentExam) {
    alert("No exam selected");
    window.location.href = "Teacher_Exam.html";
}
let totalQuestions = parseInt(currentExam.totalQuestion);
document.getElementById("totalQuestions").textContent = totalQuestions;
console.log(totalQuestions);
console.log(typeof (totalQuestions));
let form = document.getElementById("questionForm");
let nextButton = document.getElementById("nextButton");
let questions = [];

form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (currentQuestionIndex > totalQuestions) {
        return;
    }

    let image = document.getElementById("questionImage").files[0];
    let imageUrl = "";
    if (image) {
        imageUrl = await cloudinaryService.uploadImageToCloudinary(image);
    }
    let newQuestion =
    {
        questionText: document.getElementById("questionText").value,
        image: imageUrl,
        answerA: document.getElementById("answerA").value,
        answerB: document.getElementById("answerB").value,
        answerC: document.getElementById("answerC").value,
        answerD: document.getElementById("answerD").value,
        correctAnswer: document.getElementById("correctAnswer").value,
        difficulty: document.getElementById("difficulty").value,
        score: 100/totalQuestions
    };

    if (!newQuestion.questionText || !newQuestion.correctAnswer) {
        alert("Please complete the question");
        return;
    }
    questions.push(newQuestion);
    if (currentQuestionIndex == totalQuestions) {
        if (!AddQustionService.validateDefiality(questions)) {
            alert("Please make sure to have at least one question of each difficulty level: easy, medium, hard.");
            return;
        }
        currentExam.questions = questions;
        currentExam.status = "published";
        let allExams = ExamService.getAllExams();
        let exam = allExams.find(exam => exam.id == currentExam.id);
        let index = allExams.indexOf(exam);
        allExams.splice(index, 1, currentExam)
        ExamService.saveExams(allExams);
        currentExam.assignedStudents.forEach(studentId => {
            ExamService.assignExamToStudent(currentExam.id, studentId);
        });
        alert("Exam saved successfully");
        window.location.href = "Teacher_Exam.html";
        return;
    }
    currentQuestionIndex++;
    currentQuestion.textContent = currentQuestionIndex;

    if (currentQuestionIndex == totalQuestions) {
        console.log("Changing button text");
        nextButton.textContent = "Save Exam";
    }
    form.reset();

});