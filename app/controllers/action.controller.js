const db = require('../models');
const Action = db.actions;

exports.addAction = (req, res) => {
    Action.create({
        cageId: req.params.cageId,
        litterId: req.body.litterId,
        user: req.body.user,
        type: req.body.type,
        tagline: req.body.tagline
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: 
            err.message || "couldn't make new litter"
        })
    })
}

exports.getCageActions = (req,res) => {
    Action.findAll({where: {cageId: req.params.cageId}})
    .then(data => {
        res.send(data)
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        })
    })
}

exports.getAllActions = (req, res) => {
    Action.findAll()
    .then(data => {
        res.send(data)
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        })
    })
}