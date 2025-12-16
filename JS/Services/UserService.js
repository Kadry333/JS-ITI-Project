
class UserService
{
    static getUsers()
    {
        return StorageService.get("users");
    }
    static getStudents()
    {
        return this.getUsers().filter(user=>user.role == "student");
    }
    static getTeachers()
    {
        return this.getUsers().filter(user=>user.role == "teacher");
    }
    static getUsername(username)
    {
        return this.getUsers().find(user=> user.username == username);
    }
    static login(username,password)
    {
        let user = this.getUsername(username);
        if(!user)
            return null;
        if(!user.password == password)
            return null
        return user;
    }
    static registerStudent(data)
    {
        let users = this.getUsers();
        if(users.some(user=>user.username == data.username))
            return null;
        let userId = StorageService.generateId("userId");
        let newUser = {
            id: userId,
            username: data.username,
            password: data.password,
            role: "student"
        };
        users.push(newUser);
        StorageService.set("users",users);
        return newUser;
    }
}