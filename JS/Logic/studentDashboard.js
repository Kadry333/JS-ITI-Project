// =====================================
// DOM ELEMENTS
// =====================================
const dashboardSection = document.getElementById('dashboard-screen');
const examSection = document.getElementById('exam-screen');

const timerDisplay = document.getElementById('timer');
const questionTextDisplay = document.getElementById('question-text');
const questionImageWrapper = document.getElementById('question-image-container');
const questionImage = document.getElementById('question-image');

const answersListContainer = document.getElementById('answer-options');
const questionsNavigatorContainer = document.getElementById('question-navigator');

const previousButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const submitButton = document.getElementById('submit-btn');

// Dashboard UI elements
const studentInitialsLabel = document.getElementById('student-initials');
const studentNameLabel = document.getElementById('student-name');
const studentRoleLabel = document.getElementById('student-role');
const studentGradeLabel = document.getElementById('student-grade');
const studentMobileLabel = document.getElementById('student-mobile');
const welcomeStudentLabel = document.getElementById('welcome-name');

const completedExamsContainer = document.getElementById('completed-exams-container');
const availableExamsContainer = document.getElementById('available-exams-container');

// =====================================
// STATE VARIABLES
// =====================================
let loggedInStudent = JSON.parse(sessionStorage.getItem('currentUser'));
let storedExams = JSON.parse(localStorage.getItem('exams')) || [];

let activeExamData = null;
let activeExamQuestions = [];
let currentQuestionIndex = 0;
let chosenAnswersMap = {};
let examTotalScore = 0;

let remainingTimeInSeconds = 0;
let countdownTimer = null;

// =====================================
// UTILITY FUNCTIONS
// =====================================
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function formatSecondsToTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// =====================================
// APP INITIALIZATION
// =====================================
window.addEventListener('DOMContentLoaded', () => {
  if (!loggedInStudent) return (window.location.href = 'login.html');
  renderDashboardUI();
});

// =====================================
// DASHBOARD RENDERING
// =====================================
function renderDashboardUI() {
  studentInitialsLabel.textContent = loggedInStudent.username.slice(0, 2).toUpperCase();
  studentNameLabel.textContent = loggedInStudent.username;
  studentRoleLabel.textContent = loggedInStudent.role;
  studentGradeLabel.textContent = loggedInStudent.grade;
  studentMobileLabel.textContent = loggedInStudent.mobile;
  welcomeStudentLabel.textContent = loggedInStudent.username;

  renderCompletedExamsUI();
  renderAvailableExamsUI();
}

function renderCompletedExamsUI() {
  completedExamsContainer.innerHTML = '';

  const finishedExams = loggedInStudent.completedExams || [];

  if (finishedExams.length === 0) {
    completedExamsContainer.innerHTML = `<p>No completed exams yet.</p>`;
    return;
  }

  finishedExams.forEach((exam) => {
    const examCard = document.createElement('div');
    examCard.className = 'border rounded p-4 flex justify-between';

    examCard.innerHTML = `
      <div>
        <strong>${exam.name}</strong>
        <p class="text-sm">${exam.dateTaken}</p>
      </div>
      <span class="px-3 py-1 bg-green-100 text-green-700 rounded">${exam.score}%</span>
    `;

    completedExamsContainer.appendChild(examCard);
  });
}

function renderAvailableExamsUI() {
  availableExamsContainer.innerHTML = '';

  const pendingExams = storedExams.filter((exam) =>
    loggedInStudent.requiredExams.some((req) => req.examId == exam.id && req.status === 'pending')
  );

  if (pendingExams.length === 0) {
    availableExamsContainer.innerHTML = `<p>No available exams.</p>`;
    return;
  }

  pendingExams.forEach((exam) => {
    const examCard = document.createElement('div');
    examCard.className = 'border rounded p-5 mb-3';

    examCard.innerHTML = `
      <h3 class="font-semibold text-lg">${exam.name}</h3>
      <p>${exam.totalQuestion} Questions • ${exam.duration} min</p>
      <button class="mt-4 w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
        onclick="startExamProcess(${exam.id})">
        Start Exam
      </button>
    `;

    availableExamsContainer.appendChild(examCard);
  });
}

// =====================================
// EXAM FLOW CONTROL
// =====================================
function startExamProcess(examId) {
  activeExamData = storedExams.find((e) => e.id == examId);
  activeExamQuestions = shuffleArray([...activeExamData.questions]);

  chosenAnswersMap = {};
  currentQuestionIndex = 0;
  examTotalScore = 0;

  remainingTimeInSeconds = Number(activeExamData.duration) * 60;
  beginCountdownTimer();

  dashboardSection.classList.add('hidden');
  examSection.classList.remove('hidden');

  renderExamUI();
}

function beginCountdownTimer() {
  clearInterval(countdownTimer);

  countdownTimer = setInterval(() => {
    remainingTimeInSeconds--;
    timerDisplay.textContent = formatSecondsToTime(remainingTimeInSeconds);

    if (remainingTimeInSeconds <= 0) {
      clearInterval(countdownTimer);
      submitExamProcess();
    }
  }, 1000);
}

function renderExamUI() {
  document.getElementById('exam-title').textContent = activeExamData.name;
  document.getElementById('total-questions').textContent = activeExamQuestions.length;
  document.getElementById('current-question-num').textContent = currentQuestionIndex + 1;

  const currentQuestion = activeExamQuestions[currentQuestionIndex];

  questionTextDisplay.textContent = currentQuestion.questionText;

  if (currentQuestion.image) {
    questionImageWrapper.classList.remove('hidden');
    questionImage.src = currentQuestion.image;
  } else {
    questionImageWrapper.classList.add('hidden');
  }

  renderAnswersUI(currentQuestion);
  renderQuestionsNavigatorUI();
  updateNavigationControls();
}

function renderAnswersUI(question) {
  answersListContainer.innerHTML = '';

  const shuffledAnswers = shuffleArray([
    { key: 'A', text: question.answerA },
    { key: 'B', text: question.answerB },
    { key: 'C', text: question.answerC },
    { key: 'D', text: question.answerD },
  ]);

  shuffledAnswers.forEach((answer) => {
    const btn = document.createElement('button');
    btn.className = 'border p-3 rounded w-full mb-3 bg-white';
    btn.textContent = answer.text;

    btn.onclick = () => handleAnswerSelection(question, answer.key);

    if (chosenAnswersMap[currentQuestionIndex]) btn.disabled = true;

    answersListContainer.appendChild(btn);
  });

  nextButton.disabled = !chosenAnswersMap[currentQuestionIndex];
}

function handleAnswerSelection(question, selectedKey) {
  if (chosenAnswersMap[currentQuestionIndex]) return;

  chosenAnswersMap[currentQuestionIndex] = selectedKey;

  const correctKey = question.correctAnswer;

  answersListContainer.querySelectorAll('button').forEach((btn) => {
    const text = btn.textContent.trim();

    if (text === question[`answer${correctKey}`]) btn.classList.add('bg-green-500', 'text-white');

    if (text === question[`answer${selectedKey}`] && selectedKey !== correctKey)
      btn.classList.add('bg-red-500', 'text-white');

    btn.disabled = true;
  });

  if (selectedKey === correctKey) examTotalScore += Number(question.score);

  nextButton.disabled = false;

  renderQuestionsNavigatorUI();
  updateNavigationControls();
}

function renderQuestionsNavigatorUI() {
  questionsNavigatorContainer.innerHTML = '';

  activeExamQuestions.forEach((question, index) => {
    const btn = document.createElement('button');
    btn.textContent = index + 1;
    btn.className = 'px-3 py-2 rounded border';

    if (index === currentQuestionIndex) btn.classList.add('bg-blue-500', 'text-white');

    const answeredKey = chosenAnswersMap[index];
    if (answeredKey) {
      btn.classList.add(
        answeredKey === question.correctAnswer ? 'bg-green-500' : 'bg-red-500',
        'text-white'
      );
    }

    btn.onclick = () => {
      currentQuestionIndex = index;
      renderExamUI();
    };

    questionsNavigatorContainer.appendChild(btn);
  });
}

function updateNavigationControls() {
  previousButton.disabled = currentQuestionIndex === 0;

  if (currentQuestionIndex === activeExamQuestions.length - 1) {
    submitButton.classList.remove('hidden');
    nextButton.classList.add('hidden');
  } else {
    submitButton.classList.add('hidden');
    nextButton.classList.remove('hidden');
  }
}

function goToNextQuestion() {
  if (currentQuestionIndex < activeExamQuestions.length - 1) {
    currentQuestionIndex++;
    renderExamUI();
  }
}

function goToPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderExamUI();
  }
}

// =====================================
// SUBMIT EXAM
// =====================================
function submitExamProcess() {
  clearInterval(countdownTimer);

  const today = new Date().toLocaleDateString();

  loggedInStudent.completedExams.push({
    examId: activeExamData.id,
    name: activeExamData.name,
    score: examTotalScore,
    dateTaken: today,
  });

  const required = loggedInStudent.requiredExams.find((r) => r.examId == activeExamData.id);
  if (required) required.status = 'completed';

  let allStudents = JSON.parse(localStorage.getItem('students')) || [];
  allStudents = allStudents.map((stu) => (stu.id === loggedInStudent.id ? loggedInStudent : stu));

  localStorage.setItem('students', JSON.stringify(allStudents));
  sessionStorage.setItem('currentUser', JSON.stringify(loggedInStudent));

  alert(`Exam submitted! Score: ${examTotalScore}`);

  window.location.href = 'Student_Dashboard.html';
}

// =====================================
// LOGOUT
// =====================================
function logoutStudent() {
  sessionStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}
