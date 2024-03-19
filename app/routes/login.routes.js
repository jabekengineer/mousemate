module.exports = app => {
    const login = require('../controllers/login.controller.js');
    var router = require("express").Router();

    router.get('/:name',login.checkUser);

    app.use('/login', router)
}