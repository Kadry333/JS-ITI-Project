// sessionStorage.clear();
// localStorage.clear();
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  let userName = document.getElementById('username').value;
  let password = document.getElementById('password').value;
  let currentUser = await UserService.login(userName, password);
  let loginMessage = document.getElementById('loginMessage');
  if (!currentUser) {
    loginMessage.textContent = 'Invalid username or password';
    loginMessage.classList.remove('hidden');
    loginMessage.classList.remove('text-green-500', 'text-green-700');
    loginMessage.classList.add('text-red-500', 'text-red-700');
    loginMessage.style.color = '#ef4444';
    return;
  }

  loginMessage.textContent = `Welcome Back ${currentUser.username}`;
  loginMessage.className =
    'mt-4 rounded-md bg-green-500/10 px-4 py-3 text-center text-green-300 outline outline-1 outline-red-500/30 hidden';
  loginMessage.style.color = 'greenyellow';
  loginMessage.classList.remove('hidden');
  loginMessage.classList.remove('text-red-700');
  loginMessage.classList.add('text-green-500');

  // Set user session
  sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
  localStorage.setItem('userId', currentUser.id);

  // Redirect based on role
  setTimeout(() => {
    if (currentUser.role == 'student') window.location.href = 'Student_Dashboard.html';
    else window.location.href = 'Teacher_Exam.html';
  }, 1000);
});
