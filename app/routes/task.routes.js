module.exports = app => {
    const task = require('../controllers/task.controller.js');
    var router = require("express").Router();

    router.get('/cleanup', task.cleanTaskList);

    router.get('/:interval',task.getTasks);

    router.get('/', task.getAllTasks);

    router.put('/wean', task.clearCageWeanTasks);

    router.put('/', task.updateTask);

    router.post('/', task.createTask);

    

    app.use('/tasks', router)
}