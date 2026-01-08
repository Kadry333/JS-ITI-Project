class StorageService {
    static get(key) {
        let data = JSON.parse(localStorage.getItem(key));
        return data ? data : [];
    }

    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static remove(key) {
        localStorage.removeItem(key);
    }
    static generateId(key) {
        let lastId = localStorage.getItem(key);
        if (lastId === null) {
            lastId = 0;
        } else {
            lastId = Number(lastId);
        }
        let newId = lastId + 1;
        localStorage.setItem(key, newId);
        return newId;
    }
    static deleteExpiredExams() {
        let exams = JSON.parse(localStorage.getItem("exams")) || [];
        let currentDate = new Date();
        exams = exams.filter(exam => new Date(exam.examsExpireDate) > currentDate);
        localStorage.setItem("exams", JSON.stringify(exams));
    }
    

    static clearAll() {
            localStorage.clear();
            sessionStorage.clear();
        }
}
