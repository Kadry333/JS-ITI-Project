/***********************
 * DOM ELEMENTS
 ***********************/
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

const studentAvatarImg = document.getElementById('student-avatar');
const studentNameLabel = document.getElementById('student-name');
const studentRoleLabel = document.getElementById('student-role');
const studentGradeLabel = document.getElementById('student-grade');
const studentMobileLabel = document.getElementById('student-mobile');
const welcomeStudentLabel = document.getElementById('welcome-name');

const completedExamsContainer = document.getElementById('completed-exams-container');
const availableExamsContainer = document.getElementById('available-exams-container');

/***********************
 * STATE VARIABLES
 ***********************/
let loggedInStudent = null;
let storedExams = [];
let coursesData = [];
let difficultyBadgeElement = null;

let activeExamData = null;
let activeExamQuestions = [];
let currentQuestionIndex = 0;
let chosenAnswersMap = {};
let correctAnswersCount = 0;
let remainingTimeInSeconds = 0;
let countdownTimer = null;

// Exam protection event handlers (stored for removal)
let examProtectionHandlers = {
  beforeUnload: null,
  popstate: null,
  contextmenu: null,
  keydown: null,
  beforeunload: null,
};

/***********************
 * HELPERS
 ***********************/
function getCourseName(teacherId) {
  const teacher = coursesData.find((t) => t.id == teacherId);
  return teacher ? teacher.course : 'Unknown Course';
}

// Theme Toggle
function toggleTheme() {
  const body = document.getElementById('app-body');
  const isDark = body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
}

function updateThemeIcon() {
  const body = document.getElementById('app-body');
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.setAttribute('data-lucide', body.classList.contains('dark') ? 'sun' : 'moon');
    lucide.createIcons();
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const body = document.getElementById('app-body');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
  }
  updateThemeIcon();
}

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

/***********************
 * INIT
 ***********************/
window.addEventListener('DOMContentLoaded', async () => {
  loggedInStudent = JSON.parse(sessionStorage.getItem('currentUser'));

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

  try {
    coursesData = await TeacherService.getTeachers();
  } catch (e) {
    console.error(e);
  }

  initTheme();
  renderDashboardUI();

  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

/***********************
 * DASHBOARD
 ***********************/
function renderDashboardUI() {
  studentAvatarImg.src = loggedInStudent.imageUrl || '';
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
    const card = document.createElement('div');
    const courseName = getCourseName(ex.teacherId);

    card.className = `border-l-4 rounded-lg p-4 mb-3 bg-white shadow-sm ${
      isPassed ? 'border-green-500' : 'border-red-500'
    }`;

    card.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <p class="text-xs text-blue-600 font-medium mb-1">${courseName}</p>
          <strong class="text-lg">${ex.name}</strong>
          <p class="text-sm text-gray-500 mt-1">📅 Taken: ${ex.dateTaken || 'N/A'}</p>
        </div>
        <div class="text-right">
          <span class="text-2xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}">${
      ex.finalScore
    }%</span>
          <p class="text-xs font-semibold ${isPassed ? 'text-green-600' : 'text-red-600'}">${
      isPassed ? '✓ Passed' : '✗ Failed'
    }</p>
        </div>
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
    const courseName = getCourseName(ex.teacherId);
    const createdDate = ex.createdAt ? new Date(ex.createdAt).toLocaleDateString() : 'N/A';

    // Get expiry date from exam
    let expiryDateText = 'No expiry date';
    let expiryDateClass = 'text-gray-500';
    if (ex.examsExpireDate) {
      const expiryDate = new Date(ex.examsExpireDate);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

      expiryDateText = `Expires: ${expiryDate.toLocaleDateString()}`;

      if (daysUntilExpiry < 0) {
        expiryDateClass = 'text-red-600 font-semibold';
        expiryDateText = `Expired: ${expiryDate.toLocaleDateString()}`;
      } else if (daysUntilExpiry <= 3) {
        expiryDateClass = 'text-orange-600 font-semibold';
      } else {
        expiryDateClass = 'text-gray-500';
      }
    }

    card.className =
      'border rounded-lg p-5 mb-3 bg-white shadow-sm hover:shadow-md transition-shadow';
    card.innerHTML = `
      <p class="text-xs text-blue-600 font-medium mb-1">${courseName}</p>
      <h3 class="font-semibold text-lg">${ex.name}</h3>
      <div class="flex items-center gap-4 text-gray-500 text-sm mt-2">
        <span>📝 ${ex.totalQuestion} Questions</span>
        <span>⏱️ ${ex.duration} min</span>
      </div>
      <div class="mt-2">
        <span class="text-xs ${expiryDateClass}">📅 ${expiryDateText}</span>
      </div>
      <button class="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg py-2.5 font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
        onclick="startExamProcess(${ex.id})">
        Start Exam
      </button>
    `;

    availableExamsContainer.appendChild(card);
  });
}

/***********************
 * EXAM
 ***********************/
function startExamProcess(examId) {
  activeExamData = storedExams.find((e) => String(e.id) === String(examId));
  activeExamQuestions = shuffleArray([...activeExamData.questions]);
  chosenAnswersMap = {};
  currentQuestionIndex = 0;
  correctAnswersCount = 0;
  remainingTimeInSeconds = activeExamData.duration * 60;

  // Prevent leaving the exam page
  enableExamProtection();

  startTimer();
  dashboardSection.classList.add('hidden');
  examSection.classList.remove('hidden');
  renderExamUI();
}

function enableExamProtection() {
  // Prevent page unload
  examProtectionHandlers.beforeUnload = function (e) {
    e.preventDefault();
    e.returnValue = 'You cannot leave the exam until you submit or time runs out!';
    return e.returnValue;
  };
  window.onbeforeunload = examProtectionHandlers.beforeUnload;

  // Prevent back button
  history.pushState(null, null, location.href);
  examProtectionHandlers.popstate = function (e) {
    history.pushState(null, null, location.href);
    alert('You cannot go back during the exam. Please submit the exam to finish.');
  };
  window.onpopstate = examProtectionHandlers.popstate;

  // Disable right-click context menu
  examProtectionHandlers.contextmenu = function (e) {
    e.preventDefault();
    return false;
  };
  document.addEventListener('contextmenu', examProtectionHandlers.contextmenu);

  // Disable keyboard shortcuts (F5, Ctrl+R, Ctrl+W, etc.)
  examProtectionHandlers.keydown = function (e) {
    // Disable F5 (refresh)
    if (e.key === 'F5') {
      e.preventDefault();
      return false;
    }
    // Disable Ctrl+R (refresh)
    if (e.ctrlKey && e.key === 'r') {
      e.preventDefault();
      return false;
    }
    // Disable Ctrl+W (close tab)
    if (e.ctrlKey && e.key === 'w') {
      e.preventDefault();
      return false;
    }
    // Disable Ctrl+Shift+T (reopen closed tab)
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
      e.preventDefault();
      return false;
    }
    // Disable Alt+Left (back)
    if (e.altKey && e.key === 'ArrowLeft') {
      e.preventDefault();
      return false;
    }
  };
  document.addEventListener('keydown', examProtectionHandlers.keydown);
}

function disableExamProtection() {
  window.onbeforeunload = null;
  window.onpopstate = null;
  if (examProtectionHandlers.contextmenu) {
    document.removeEventListener('contextmenu', examProtectionHandlers.contextmenu);
  }
  if (examProtectionHandlers.keydown) {
    document.removeEventListener('keydown', examProtectionHandlers.keydown);
  }
  if (examProtectionHandlers.beforeunload) {
    window.removeEventListener('beforeunload', examProtectionHandlers.beforeunload);
  }
  // Clear handlers
  examProtectionHandlers = {
    beforeUnload: null,
    popstate: null,
    contextmenu: null,
    keydown: null,
    beforeunload: null,
  };
}

function startTimer() {
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    remainingTimeInSeconds--;
    timerDisplay.textContent = formatSecondsToTime(remainingTimeInSeconds);
    if (remainingTimeInSeconds <= 0) {
      clearInterval(countdownTimer);
      // Disable protection before auto-submitting
      disableExamProtection();
      submitExam();
    }
  }, 1000);
}

function renderExamUI() {
  // Header info
  document.getElementById('exam-title').textContent = activeExamData.name;
  document.getElementById('current-question-num').textContent = currentQuestionIndex + 1;
  document.getElementById('total-questions').textContent = activeExamQuestions.length;

  // Question card info
  document.getElementById('question-number').textContent = currentQuestionIndex + 1;
  document.getElementById('answered-count').textContent = Object.keys(chosenAnswersMap).length;
  document.getElementById('total-questions-2').textContent = activeExamQuestions.length;

  const q = activeExamQuestions[currentQuestionIndex];
  questionTextDisplay.textContent = q.questionText;

  // Difficulty badge
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

  // Question image
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
  // Update button styling will be handled in updateButtons()
}

function selectAnswer(question, key) {
  if (chosenAnswersMap[currentQuestionIndex]) return;
  chosenAnswersMap[currentQuestionIndex] = key;
  if (key === question.correctAnswer) correctAnswersCount++;
  renderAnswers(question);
  updateButtons();
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
  const currentQuestionAnswered = chosenAnswersMap[currentQuestionIndex] !== undefined;

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

    // Style Next button based on whether current question is answered
    if (currentQuestionAnswered) {
      nextButton.className =
        'flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors';
      nextButton.disabled = false;
    } else {
      nextButton.className =
        'flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-200 text-blue-400 cursor-not-allowed transition-colors';
      nextButton.disabled = true;
    }
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
    alert('Please answer all questions first');
    return;
  }
  clearInterval(countdownTimer);
  const finalScore = Math.round((correctAnswersCount * 100) / total);
  const examResult = {
    examId: activeExamData.id,
    name: activeExamData.name,
    teacherId: activeExamData.teacherId,
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

  // Disable exam protection before redirecting
  disableExamProtection();

  alert('Exam submitted successfully!');
  window.location.href = 'Student_Dashboard.html';
}

function handleLogout() {
  sessionStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}
