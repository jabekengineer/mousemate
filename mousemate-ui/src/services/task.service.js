import http from "../http-common";


const getAllTasks = () => {
    return http.get("/tasks")
}

const getTasks = (interval) => {
    return http.get(`/tasks/${interval}`)
}

const updateTask = (task) => {
    return http.put("/tasks", task)
}

const createTask = (task) => {
    return http.post("/tasks", task)
}

const cleanTaskList = () => {
    return http.get("/tasks/cleanup")
}

const clearWeanTask = (cageNumber) => {
    return http.put("/tasks/wean", cageNumber)
}

const TaskService = {
    createTask,
    getTasks,
    getAllTasks,
    updateTask,
    cleanTaskList,
    clearWeanTask
};

export default TaskService;