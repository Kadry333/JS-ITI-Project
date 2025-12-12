(function setupDefaultTeachers() {
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  let teachers = JSON.parse(localStorage.getItem("teachers") || "[]");

  if (teachers.length > 0) {
    return;
  }
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

  let tUserId3 = 1003;
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

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("teachers", JSON.stringify(teachers));
})();
