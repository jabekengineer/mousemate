const db = require('../models');
const Op = db.Sequelize.Op;
const Task = db.tasks;
const Cages = db.cages;

exports.clearCageWeanTasks = (req, res) => {
    Task.update(
        {
            completed: 1
        },
        {
            where: {
                cageId: req.body.cageId,
                type: {
                    [Op.in]: ["Pup Snax", "Wean Litter"]
                }
            }
        }
    )
    .then(num => {
        if(num == 1){
            res.send({
                message: 'cage wean tasks completed'
            })
        } else {
            res.send({
                message: "couldn't clear wean task"
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        })
    })
}


exports.cleanTaskList = (req, res) => {
    Cages.findAll({
        where: {
            count: {
                [Op.lte]: 0
            }
        },
        attributes: ['id']
    })
    .then(emptyCages => { 
        emptyCages = emptyCages.map(function (cage) {return cage.id})
        Task.update(
            {
                completed: 1,
            },
            {where: {
                cageId: {
                    [Op.in]: emptyCages
                },
                date: {
                    [Op.not]: null
                }
            }}
        )
    })
    .then(num => {
        if(num == 1){
            res.send({
                message: 'some tasks were cleaned up'
            })
        } else {
            res.send({
                message: "task cleanup complete, no tasks cleaned"
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        })
    })
}


exports.getTasks = (req,res) => {
    const startDate = new Date();
    Task.findAll({
        where: {
            [Op.or] : [
            // all incomplete tasks before 5 days in the future
            {
                [Op.and] : [
                    {
                        date: {
                            [Op.lte]: new Date(startDate.setDate(startDate.getDate() + (req.params.interval ? Number(req.params.interval) : 5))).setUTCHours(23,59,59)
                        }
                    },
                    {
                        completed: {
                            [Op.eq]: 0
                        }
                    },
                ]
            },
            // all tasks from today
            {
                date: {
                    [Op.between]: [new Date().setUTCHours(0,0,0,0), new Date().setUTCHours(23,59,59)]
                }
            }
            ]
        },
        order: [
            ['date', 'ASC'],
        ]
    })
    .then(data => {
        res.send(data)
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        })
    })
}

exports.getAllTasks = (req, res) => {
    Task.findAll()
    .then(data => [
        res.send(data)
    ])
    .catch(err => {
        res.status(500).send({
            message: err.message
        })
    })
}

exports.updateTask = (req, res) => {
    const date = new Date(req.body.date);
    Task.update(
        {
        completed: req.body.completed,
        date: date
        },
        {where: {id: req.body.id}}
    )
    .then(num => {
        if(num == 1){
            res.send({
                message: 'task updated'
            })
        } else {
            res.send({
                message: "couldn't update task"
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        })
    })
}

exports.createTask = (req, res) => {
    Task.create({
        roomId: req.body.roomId,
        cageId: req.body.cageId,
        type: req.body.type,
        date: req.body.date,
        completed: req.body.completed
    })
    .then(data => {
        res.send(data)
    })
    .catch(err => {
        res.status(500).send({
            message: 
                err.message 
        })
    })
}