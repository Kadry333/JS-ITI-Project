let examId = sessionStorage.getItem('currentExamId');
if (!examId) {
  alert('No exam selected');
  window.location.href = 'Teacher_Exam.html';
}
let exams = ExamService.getAllExams();
let exam = exams.find((e) => e.id == examId);
if (!exam) {
  alert('Exam not found');
  window.location.href = 'Teacher_Exam.html';
}
let questions = exam.questions || [];
if (questions.length == 0) {
  questions = [{}];
}
let currentIndex = 0;
let currentQuestion = document.getElementById('currentQuestion');
let questionText = document.getElementById('questionText');
let questionImage = document.getElementById('questionImage');
let viewImage = document.getElementById('viewImage');
let answerA = document.getElementById('answerA');
let answerB = document.getElementById('answerB');
let answerC = document.getElementById('answerC');
let answerD = document.getElementById('answerD');
let correctAnswer = document.getElementById('correctAnswer');
let difficulty = document.getElementById('difficulty');
let totalQuestions = Number(exam.totalQuestion);
let score = 100 / totalQuestions;
console.log(totalQuestions);
console.log(score);
let nextBtn = document.getElementById('nextBtn');

function loadQuestion(index) {
  let question = questions[index] || {};
  currentQuestion.textContent = index + 1;
  questionText.value = question.questionText || '';
  if (question.image) {
    viewImage.src = question.image;
    viewImage.style.display = 'block';
  } else {
    viewImage.style.display = 'none';
  }

  answerA.value = question.answerA || '';
  answerB.value = question.answerB || '';
  answerC.value = question.answerC || '';
  answerD.value = question.answerD || '';
  correctAnswer.value = question.correctAnswer || '';
  difficulty.value = question.difficulty || '';
  if (index == totalQuestions - 1) {
    nextBtn.textContent = 'Save Changes';
  } else {
    nextBtn.textContent = 'Next Question →';
  }
}
async function saveNewQuestion() {
  let imageFile = questionImage.files[0];
  let oldImage = questions[currentIndex] || {};
  let imageURL = oldImage.image || '';
  if (imageFile) {
    imageURL = await cloudinaryService.uploadImageToCloudinary(imageFile);
  }
  questions[currentIndex] = {
    questionText: questionText.value,
    image: imageURL,
    answerA: answerA.value,
    answerB: answerB.value,
    answerC: answerC.value,
    answerD: answerD.value,
    correctAnswer: correctAnswer.value,
    difficulty: difficulty.value,
    score: score,
  };
}
nextBtn.addEventListener('click', async function (e) {
  if (
    !questionText.value ||
    !answerA.value ||
    !answerB.value ||
    !answerC.value ||
    !answerD.value ||
    !correctAnswer.value ||
    !difficulty.value
  ) {
    alert('Please Fill All Data');
    return;
  }
  await saveNewQuestion();
  if (currentIndex == totalQuestions - 1) {
    if (!AddQustionService.validateDefiality(questions)) {
      alert(
        'Please make sure to have at least one question of each difficulty level: easy, medium, hard.'
      );
      window.location.href = 'Teacher_Exam.html';
      return;
    }
    exam.questions = questions;
    ExamService.updateExam(exam);
    alert('Exam updated successfully');
    window.location.href = 'Teacher_Exam.html';
    return;
  }
  currentIndex++;
  if (!questions[currentIndex]) {
    questions[currentIndex] = {};
  }
  loadQuestion(currentIndex);
});
loadQuestion(currentIndex);
