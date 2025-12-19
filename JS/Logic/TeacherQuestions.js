
let currentQuestionIndex = 1;
let currentQuestion = document.getElementById("currentQuestion");
let currentExam = AddQustionService.getCurrentExam();
if (!currentExam) {
    alert("No exam selected");
    window.location.href = "Teacher_Exam.html";
}
let totalQuestions = parseInt(currentExam.totalQuestion);
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
        score: document.getElementById("score").value
    };

    if (!newQuestion.questionText || !newQuestion.correctAnswer || !newQuestion.score) {
        alert("Please complete the question");
        return;
    }
    questions.push(newQuestion);
    if (currentQuestionIndex == totalQuestions) {
        currentExam.questions = questions;
        let allExams = ExamService.getAllExams();
        let exam = allExams.find(exam => exam.id == currentExam.id);
        let index = allExams.indexOf(exam);
        allExams.splice(index, 1, currentExam)
        ExamService.saveExams(allExams)
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