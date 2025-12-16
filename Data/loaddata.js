let data = {
    "users": [
        {
            "id": 1001,
            "username": "teacher1",
            "password": "1234",
            "role": "teacher"
        },
        {
            "id": 1002,
            "username": "teacher2",
            "password": "1234",
            "role": "teacher"
        },
        {
            "id": 1003,
            "username": "teacher3",
            "password": "1234",
            "role": "teacher"
        }
    ],
    "teachers": [
        {
            "id": 1,
            "userId": 1001,
            "course": "Plants",
            "mode": "light"
        },
        {
            "id": 2,
            "userId": 1002,
            "course": "Animals",
            "mode": "light"
        },
        {
            "id": 3,
            "userId": 1003,
            "course": "Planets",
            "mode": "light"
        }
    ],
    "students": [],
    "exams": []
}
if (!localStorage.getItem("initialized")) {

    Object.keys(data).forEach(key => {
        localStorage.setItem(key, JSON.stringify(data[key]));
    });

    localStorage.setItem("initialized", "true");
}