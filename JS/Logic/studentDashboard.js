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
const studentInitialsLabel = document.getElementById('student-initials');
const studentNameLabel = document.getElementById('student-name');
const studentRoleLabel = document.getElementById('student-role');
const studentGradeLabel = document.getElementById('student-grade');
const studentMobileLabel = document.getElementById('student-mobile');
const welcomeStudentLabel = document.getElementById('welcome-name');
const completedExamsContainer = document.getElementById('completed-exams-container');
const availableExamsContainer = document.getElementById('available-exams-container');

let difficultyBadgeElement = null;
let loggedInStudent = JSON.parse(sessionStorage.getItem('currentUser'));
let storedExams = JSON.parse(localStorage.getItem('exams')) || [];
let activeExamData = null;
let activeExamQuestions = [];
let currentQuestionIndex = 0;
let chosenAnswersMap = {};
let correctAnswersCount = 0;
let remainingTimeInSeconds = 0;
let countdownTimer = null;
//StorageService.deleteExpiredExams();

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function formatSecondsToTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function difficultyColor(lvl) {
  if (lvl === 'Easy') return 'bg-green-500 text-white';
  if (lvl === 'Medium') return 'bg-yellow-400 text-black';
  if (lvl === 'Hard') return 'bg-red-600 text-white';
  return 'bg-gray-400';
}

window.addEventListener('DOMContentLoaded', () => {
  if (!loggedInStudent) {
    window.location.href = 'login.html';
    return;
  }
  const allStudents = JSON.parse(localStorage.getItem('students')) || [];
  const latestData = allStudents.find((s) => s.id === loggedInStudent.id);
  if (latestData) {
    loggedInStudent = latestData;
    sessionStorage.setItem('currentUser', JSON.stringify(latestData));
  }
  storedExams = JSON.parse(localStorage.getItem('exams')) || [];
  renderDashboardUI();
});

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
  const done = loggedInStudent.completedExams || [];
  if (done.length === 0) {
    completedExamsContainer.innerHTML = `<p>No completed exams yet.</p>`;
    return;
  }
  done.forEach((ex) => {
    const isPassed = ex.finalScore >= 50;
    const statusClass = isPassed
      ? 'bg-green-100 text-green-700 border-green-500'
      : 'bg-red-100 text-red-700 border-red-500';
    const card = document.createElement('div');
    card.className = `border-l-4 rounded p-4 flex justify-between items-center mb-3 bg-white shadow-sm ${statusClass}`;
    card.innerHTML = `
        <div>
          <strong class="block text-gray-800">${ex.name}</strong>
          <p class="text-[10px] opacity-70">${ex.dateTaken}</p>
        </div>
        <div class="text-right">
          <span class="text-lg font-bold">${ex.finalScore}</span>
          <p class="text-[10px] uppercase font-bold">${isPassed ? 'Passed' : 'Failed'}</p>
        </div>
    `;
    completedExamsContainer.appendChild(card);
  });
}

function renderAvailableExamsUI() {
  availableExamsContainer.innerHTML = '';
  const pending = storedExams.filter((ex) =>
    loggedInStudent.requiredExams.some(
      (r) => String(r.examId) === String(ex.id) && r.status === 'pending'
    )
  );
  if (pending.length === 0) {
    availableExamsContainer.innerHTML = `<p>No available exams.</p>`;
    return;
  }
  pending.forEach((ex) => {
    const card = document.createElement('div');
    card.className = 'border rounded p-5 mb-3 bg-white';
    card.innerHTML = `
      <h3 class="font-semibold text-lg">${ex.name}</h3>
      <p class="text-gray-600 text-sm">${ex.totalQuestion} Questions • ${ex.duration} min</p>
      <button class="mt-4 w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition-all font-medium"
       onclick="startExamProcess(${ex.id})">
        Start Exam
      </button>
    `;
    availableExamsContainer.appendChild(card);
  });
}

function startExamProcess(examId) {
  activeExamData = storedExams.find((e) => String(e.id) === String(examId));
  activeExamQuestions = shuffleArray([...activeExamData.questions]);
  chosenAnswersMap = {};
  currentQuestionIndex = 0;
  correctAnswersCount = 0;
  remainingTimeInSeconds = activeExamData.duration * 60;
  startTimer();
  dashboardSection.classList.add('hidden');
  examSection.classList.remove('hidden');
  renderExamUI();
}

function startTimer() {
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    remainingTimeInSeconds--;
    timerDisplay.textContent = formatSecondsToTime(remainingTimeInSeconds);
    if (remainingTimeInSeconds <= 0) {
      clearInterval(countdownTimer);
      submitExam();
    }
  }, 1000);
}

function renderExamUI() {
  document.getElementById('exam-title').textContent = activeExamData.name;
  document.getElementById('current-question-num').textContent = currentQuestionIndex + 1;
  document.getElementById('total-questions').textContent = activeExamQuestions.length;
  const q = activeExamQuestions[currentQuestionIndex];
  questionTextDisplay.textContent = q.questionText;
  if (!difficultyBadgeElement) {
    difficultyBadgeElement = document.createElement('span');
    questionTextDisplay.parentNode.insertBefore(
      difficultyBadgeElement,
      questionTextDisplay.nextSibling
    );
  }
  difficultyBadgeElement.textContent = q.difficulty;
  difficultyBadgeElement.className = `px-2 py-0.5 rounded text-[10px] font-bold ml-2 uppercase ${difficultyColor(
    q.difficulty
  )}`;
  if (q.image) {
    questionImageWrapper.classList.remove('hidden');
    questionImage.src = q.image;
    questionImage.className =
      'max-w-full h-auto max-h-[200px] md:max-h-[250px] mx-auto rounded shadow-sm block object-contain';
  } else {
    questionImageWrapper.classList.add('hidden');
  }
  renderAnswers(q);
  renderNavigator();
  updateButtons();
}

function renderAnswers(question) {
  answersListContainer.innerHTML = '';
  const options = [
    { key: 'A', text: question.answerA },
    { key: 'B', text: question.answerB },
    { key: 'C', text: question.answerC },
    { key: 'D', text: question.answerD },
  ];
  const alreadyAnsweredKey = chosenAnswersMap[currentQuestionIndex];
  options.forEach((ans) => {
    const btn = document.createElement('button');
    btn.className =
      'border p-3 rounded-lg w-full mb-2 text-left transition-all text-sm md:text-base';
    btn.textContent = ans.text;
    btn.dataset.answerKey = ans.key;
    if (alreadyAnsweredKey) {
      btn.disabled = true;
      if (ans.key === question.correctAnswer) {
        btn.classList.add('bg-green-500', 'text-white', 'border-green-500');
      } else if (ans.key === alreadyAnsweredKey) {
        btn.classList.add('bg-red-500', 'text-white', 'border-red-500');
      } else {
        btn.classList.add('bg-gray-50', 'text-gray-400');
      }
    } else {
      btn.classList.add('bg-white', 'hover:border-blue-500', 'hover:bg-blue-50');
      btn.onclick = () => selectAnswer(question, ans.key);
    }
    answersListContainer.appendChild(btn);
  });
  nextButton.disabled = !alreadyAnsweredKey;
}

function selectAnswer(question, key) {
  if (chosenAnswersMap[currentQuestionIndex]) return;
  chosenAnswersMap[currentQuestionIndex] = key;
  if (key === question.correctAnswer) correctAnswersCount++;
  renderExamUI();
}

function renderNavigator() {
  questionsNavigatorContainer.innerHTML = '';
  activeExamQuestions.forEach((q, i) => {
    const btn = document.createElement('button');
    btn.textContent = i + 1;
    btn.className = 'w-9 h-9 rounded-md border font-bold text-xs transition-all';
    if (i === currentQuestionIndex) btn.classList.add('border-blue-600', 'border-2', 'scale-110');
    if (chosenAnswersMap[i]) {
      const isCorrect = chosenAnswersMap[i] === q.correctAnswer;
      btn.classList.add(isCorrect ? 'bg-green-500' : 'bg-red-500', 'text-white', 'border-none');
    }
    btn.onclick = () => {
      currentQuestionIndex = i;
      renderExamUI();
    };
    questionsNavigatorContainer.appendChild(btn);
  });
}

function updateButtons() {
  previousButton.disabled = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === activeExamQuestions.length - 1;
  const allAnsweredCount = Object.keys(chosenAnswersMap).length;
  const totalQuestions = activeExamQuestions.length;
  if (isLastQuestion) {
    submitButton.classList.remove('hidden');
    nextButton.classList.add('hidden');
    submitButton.disabled = allAnsweredCount !== totalQuestions;
    submitButton.className = `px-6 py-2 rounded-lg font-bold transition-all ${
      allAnsweredCount === totalQuestions
        ? 'bg-orange-500 text-white hover:bg-orange-600'
        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
    }`;
  } else {
    submitButton.classList.add('hidden');
    nextButton.classList.remove('hidden');
  }
}

function nextQuestion() {
  if (currentQuestionIndex < activeExamQuestions.length - 1) {
    currentQuestionIndex++;
    renderExamUI();
  }
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderExamUI();
  }
}

function submitExam() {
  const total = activeExamQuestions.length;
  const allAnsweredCount = Object.keys(chosenAnswersMap).length;
  if (allAnsweredCount !== total) {
    alert('يرجى الإجابة على جميع الأسئلة أولاً');
    return;
  }
  clearInterval(countdownTimer);
  const finalScore = Math.round((correctAnswersCount * 100) / total);
  const examResult = {
    examId: activeExamData.id,
    name: activeExamData.name,
    finalScore: finalScore,
    percentage: finalScore,
    dateTaken: new Date().toLocaleDateString(),
    answers: activeExamQuestions.map((q, i) => ({
      questionIndex: i,
      questionText: q.questionText,
      selected: chosenAnswersMap[i],
      correct: q.correctAnswer,
    })),
  };
  if (!loggedInStudent.completedExams) loggedInStudent.completedExams = [];
  loggedInStudent.completedExams.push(examResult);
  if (loggedInStudent.requiredExams) {
    const req = loggedInStudent.requiredExams.find(
      (r) => String(r.examId) === String(activeExamData.id)
    );
    if (req) req.status = 'completed';
  }
  let allStudents = JSON.parse(localStorage.getItem('students')) || [];
  allStudents = allStudents.map((s) => (s.id === loggedInStudent.id ? loggedInStudent : s));
  localStorage.setItem('students', JSON.stringify(allStudents));
  sessionStorage.setItem('currentUser', JSON.stringify(loggedInStudent));
  alert('تم تسليم الامتحان بنجاح!');
  window.location.href = 'Student_Dashboard.html';
}

function handleLogout() {
  sessionStorage.removeItem('currentUser');
  localStorage.removeItem("userId");
  window.location.href = 'login.html';
}
