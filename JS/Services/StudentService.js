class StudentService {
    static getStudents() {
        return StorageService.get("students");
    }
    static getStudentByUsername(username) {
        return this.getStudents().find(s => s.username == username);
    }
    static registerStudent(data) {
        let students = this.getStudents();
        if (students.some(student => student.username == data.username))
            return null;
        let studentId = StorageService.generateId("studentId");
        let newStudent = {
            id: studentId,
            username: data.username,
            password: data.password,
            role: "student",
            grade: data.grade,
            mobile: data.mobile,
            imageUrl: data.image,
            completedExams: [],
            requiredExams: [],
            theme: "light"
        };
        students.push(newStudent);
        StorageService.set("students", students);
        return newStudent;
    }
}