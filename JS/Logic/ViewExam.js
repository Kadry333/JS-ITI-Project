let examId = Number(sessionStorage.getItem("currentExamId"));
let exam = ExamService.getExam(examId);
let students = (StorageService.get("students") || []);
let examTakers = students
    .filter(s => s.completedExams.some(e => e.examId == examId));

let currentIndex = 0;

if (!exam || examTakers.length === 0) {
    alert("No results found.");
    location.href = "Teacher_Exam.html";
}

function showStudent(index) {
    let container = document.getElementById("resultsContainer");
    let student = examTakers[index];
    let completed = student.completedExams.find(e => e.examId === examId);

    container.innerHTML = `
        <div class="pagination-controls">
            <button onclick="changePage(-1)" ${index === 0 ? 'disabled' : ''}>Previous</button>
            <button onclick="changePage(1)" ${index === examTakers.length - 1 ? 'disabled' : ''}>Next</button>
        </div>

        <div class="student-card">
            <div class="card-header">
                <span>Student: <strong>${student.username}</strong></span>
                <span>Score: <strong>${completed.percentage}%</strong></span>
                <span>Date: <strong>${completed.dateTaken}</strong></span>
                <span>${index + 1} of ${examTakers.length}</span>
            </div>

  ${completed.answers.map((ans, i) => {

    return `
        <div class="question-block">
            <p><strong>Q${i + 1}:</strong> ${ans.questionText}</p>

            <div class="options-grid">
                ${["A", "B", "C", "D"].map(L => {

                    let isCorrect = L == ans.correct;
                    let isWrong   = L == ans.selected && ans.selected !== ans.correct;

                    return `
                        <div class="option
                            ${isCorrect ? "correct-mark" : ""}
                            ${isWrong ? "wrong-mark" : ""}">
                            ${L}
                        </div>
                    `;
                }).join("")}
            </div>
        </div>
    `;
}).join("")}


        </div>`;
}

window.changePage = step => {
    currentIndex += step;
    showStudent(currentIndex);
};

showStudent(currentIndex);












// let examId = Number(sessionStorage.getItem("currentExamId"));
// let exam = ExamService.getExam(examId);
// let students = (StorageService.get("students") || []);
//  let examTakers = students
//     .filter(s => s.completedExams.some(e => e.examId == examId));
    
    

// let currentIndex = 0;

// if (!exam || examTakers.length === 0) {
//     alert("No results found.");
//     location.href = "Teacher_Exam.html";
// }

// function showStudent(index) {
//     let container = document.getElementById("resultsContainer");
//     let student = examTakers[index];
//     let completed = student.completedExams.find(e => e.examId === examId);

//     container.innerHTML = `
//         <div class="pagination-controls">
//             <button onclick="changePage(-1)" ${index === 0 ? 'disabled' : ''}>Previous</button>
//             <button onclick="changePage(1)" ${index === examTakers.length - 1 ? 'disabled' : ''}>Next</button>
//         </div>

//         <div class="student-card">
//             <div class="card-header">
//                 <span>Student: <strong>${student.username}</strong></span>
//                 <span>Score: <strong>${completed.percentage}%</strong></span>
//                 <span>${index + 1} of ${examTakers.length}</span>
//             </div>

//             ${completed.answers.map((ans, i) => {
//                 let q = exam.questions[i];
//                 let isCorrect = false;
//                 if(ans.selected == ans.correct)
//                   isCorrect = true;
//                 return `
//                     <div>
//                         <p><strong>Q${i + 1}:</strong> ${q.questionText}</p>
//                         <img src="${q.image}" class="q-img">
//                         <div class="options-grid">
//                             ${['A', 'B', 'C', 'D'].map(L => `
//                                 <div class="option ${L == ans.correct ? 'correct-mark' : ''} 
//                                     ${L == ans.selected && !isCorrect ? 'wrong-mark' : ''}">
//                                     ${L}: ${q["answer" + L]}
//                                 </div>
//                             `).join('')}
//                         </div>
//                     </div>`;
//             }).join('')}
//         </div>`;
// }

// window.changePage = step => {
//     currentIndex += step;
//     showStudent(currentIndex);
// };

// showStudent(currentIndex);