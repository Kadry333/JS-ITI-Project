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
  questions = [];
}
let newQuestions = JSON.parse(JSON.stringify(questions));
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
let pageNum = document.getElementById('pageNum');
let nextBtn = document.getElementById('nextPageBtn');
let prevBtn = document.getElementById("prevBtn");
let saveBtn = document.getElementById("saveBtn");

function loadQuestion(index) {
  let question = newQuestions[index] || {};
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
  index == 0 ? prevBtn.disabled = true : prevBtn.disabled = false;
  index == totalQuestions - 1 ? nextBtn.disabled = true : nextBtn.disabled = false;
  pageNum.textContent = `${index + 1} / ${totalQuestions}`;

}
async function saveNewQuestion() {
  let imageFile = questionImage.files[0];
  let oldImage = newQuestions[currentIndex] || {};
  let imageURL = oldImage.image || '';
  if (imageFile) {
    imageURL = await cloudinaryService.uploadImageToCloudinary(imageFile);
  }

  newQuestions[currentIndex] = {
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
  await saveNewQuestion();
  if (currentIndex < totalQuestions - 1) {
    currentIndex++;
    loadQuestion(currentIndex);
  }
});

prevBtn.addEventListener('click', async function (e) {
  await saveNewQuestion();
  if (currentIndex > 0) {
    currentIndex--;
    loadQuestion(currentIndex);
  }
});

saveBtn.addEventListener('click', async function (e) {
  await saveNewQuestion();
  for (let i = 0; i < totalQuestions; i++) {
    let q = newQuestions[i];
    if (!q || !q.questionText || !q.answerA || !q.answerB || !q.answerC || !q.answerD || !q.correctAnswer || !q.difficulty) {
      alert(`Please complete all fields for question ${i + 1}`);
      loadQuestion(i);
      return;
    }
    if (!AddQustionService.validateDefiality(newQuestions)) {
      alert(
        'Please make sure to have at least one question of each difficulty level: easy, medium, hard.'
      );
      return;
    }
    exam.questions = newQuestions;
    ExamService.updateExam(exam);
    alert('Exam questions updated successfully!');
    window.location.href = 'Teacher_Exam.html';
  }

});

loadQuestion(currentIndex);