module.exports = app => {
    const action = require('../controllers/action.controller.js');
    var router = require("express").Router();

    router.get('/all', action.getAllActions);

    router.get('/:cageId',action.getCageActions);

    router.post('/:cageId', action.addAction);

    app.use('/actions', router)
}