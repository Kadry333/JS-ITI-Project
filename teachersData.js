(function setupDefaultTeachers() {
  // اقرأ القيم الحالية أو خليها مصفوفات فارغة
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  let teachers = JSON.parse(localStorage.getItem("teachers") || "[]");

  // لو المدرسين موجودين بالفعل متعملش حاجة
  if (teachers.length > 0) {
    return;
  }

  // ---- Teacher 1 ----
  let tUserId1 = 1001;
  users.push({
    id: tUserId1,
    username: "teacher1",
    password: "1234",
    role: "teacher"
  });
  teachers.push({
    id: 1,
    userId: tUserId1,
    course: "Plants"
  });

  // ---- Teacher 2 ----
  let tUserId2 = 1002;
  users.push({
    id: tUserId2,
    username: "teacher2",
    password: "1234",
    role: "teacher"
  });
  teachers.push({
    id: 2,
    userId: tUserId2,
    course: "Planets"
  });

  // ---- Teacher 3 ----
  let tUserId3 = 1003; // لازم تعريف المتغير
  users.push({
    id: tUserId3,
    username: "teacher3",
    password: "1234",
    role: "teacher"
  });
  teachers.push({
    id: 3,
    userId: tUserId3,
    course: "Animals"
  });

  // احفظ التغييرات
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("teachers", JSON.stringify(teachers));
})();
