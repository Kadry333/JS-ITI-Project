
class UserService
{
  
    static async login(username,password)
    {
        let students = StudentService.getStudents();
        let user = students.find(
            student => student.username == username && student.password == password
        );
        if(user)
            return user;
        let teachers = await TeacherService.getTeachers();
        user = teachers.find(
            teacher => teacher.username == username && teacher.password == password
        );
        if(user)
            return user;
        return null;
    }
   
}