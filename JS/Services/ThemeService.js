// theme.js
function applyTheme() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    }
}

function setupThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return; // Exit if the button isn't on this specific page

    // Update button text based on current state
    themeToggle.textContent = document.body.classList.contains("dark-mode") 
        ? "☀️ Light Mode" 
        : "🌙 Dark Mode";

    themeToggle.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    });
}

// 1. Apply theme immediately (prevents "flash" of white)
applyTheme();

// 2. Setup button logic once DOM is ready
document.addEventListener("DOMContentLoaded", setupThemeToggle);