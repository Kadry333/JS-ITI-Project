class TeacherService
{
    static teachers = null;
    static async getTeachers()
    {
        if(this.teachers)
            return this.teachers;
        let result = await fetch('/Data/data.json');
        let data = await result.json();
        this.teachers = data;
        return this.teachers;
    }
}