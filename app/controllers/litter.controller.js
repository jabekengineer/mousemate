const db = require("../models");
const Op = db.Sequelize.Op;
const Litter = db.litters;

// get litter and cages
exports.findOne = (req,res) => {
    const litterId = req.params.id;
    Litter.findByPk(litterId, {include: ["cages"]})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || " couldn't find specific cage"
        })
    })
}
// get litter's cages
exports.findLitterCages = (req, res) => {
    const litterId = req.params.id;
    Litter.findByPk(litterId, {include: ["cages"]})
    .then(data => {
        res.send(data.cages);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || " couldn't find specific cage"
        })
    })
}

// get unfinished litters for litterId cross foster options
exports.findUnfinished = (req, res) => {
    const litterId = req.params.id;
    Litter.findAll(
        {
            where : {
                [Op.and]: [
                    {
                        finished: {
                            [Op.ne] : 1
                        }
                    },
                    {
                        id: {
                            [Op.ne]: litterId
                        }
                    },
                    {
                        cfLitterId: {
                            [Op.eq] : null
                        }
                    }
                ]
            }
        }
    )
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: 
            err.message
        })
    })
}

exports.addNew = (req, res) => {
    const mouseId = req.params.id;
    Litter.create({
        id: req.body.id,
        parentCageId: req.body.parentCageId,
        mouseId: mouseId,
        sireId: req.body.sireId,
        damId: req.body.damId,
        generation: req.body.generation,
        dob: req.body.dob,
        weanDate: req.body.weanDate,
        pupCount: req.body.pupCount,
        notes: req.body.notes
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

exports.addPup = (req,res) => {
    Litter.update(
        {pupCount: db.sequelize.literal('IFNULL(pupCount,0) + 1')}, 
        {where: {id: req.params.id}}
    )
    .then(num => {
        if (num==1){
            res.send({
                message: 'pup added to litter'
            })
        } else {
            res.send({
                message: 'cannot add pup to litter'
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 'error adding pup to litter'
        })
    })
}

exports.addCfPup = (req,res) => {
    Litter.update(
        {cfPupCount: db.sequelize.literal('IFNULL(cfPupCount,0) + 1')}, 
        {where: {id: req.params.id}}
    )
    .then(num => {
        if (num==1){
            res.send({
                message: 'cf pup added to litter'
            })
        } else {
            res.send({
                message: 'cannot add cf pup to litter'
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 'error adding cf pup to litter'
        })
    })
}

exports.dropPup = (req,res) => {
    let decrementation = 'IFNULL(pupCount,0) - ' + req.body.count;
    Litter.update(
        {pupCount: db.sequelize.literal(decrementation)}, 
        {where: {id: req.params.id}}
    )
    .then(num => {
        if (num==1){
            res.send({
                message: req.body.count + 'pup(s) dropped from litter'
            })
        } else {
            res.send({
                message: 'cannot drop pup from litter'
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message: 'error dropping pup from litter'
        })
    })
    
    decrementation = 'IFNULL(cfPupCount,0) - ' + req.body.cfCount;
    Litter.update(
        {cfPupCount: db.sequelize.literal(decrementation)}, 
        {where: {id: req.params.id}}
    )
    .catch(err => {
        res.status(500).send({
            message: 'error dropping cf pup from litter'
        })
    })
}

exports.crossFosterUpdate = (req, res) => {
    if(req.body.cfPupCount >= 1) {
        let increment = 'IFNULL(cfPupCount,0) + ' + req.body.cfPupCount;
        Litter.update(
            {cfPupCount: db.sequelize.literal(increment)}, 
            {where: {id: req.params.id}}
        )
        .then(num => {
            if (num==1){
                res.send({
                    message: 'cross foster litter update successful'
                })
            } else {
                res.send({
                    message: "couldn't update litter after cross foster"
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'error adding cf pups to litter'
            })
        })
    }
    if(req.body.litterId) {
        Litter.update(
            {cfLitterId: req.body.fromLitterId},
            {where: {id: req.params.id}}
        )
        .catch(err => {
            res.status(500).send({
                message: 'error changing litter cf status'
            })
        })
    }
}

exports.weanUpdate = (req, res) => {
    if(req.body.gender === "M"){
        let increment = 'IFNULL(malesWeaned,0) + ' + req.body.count;
        Litter.update(
            {
                weanDate: req.body.weanDate,
                malesWeaned: db.sequelize.literal(increment),
                finished: req.body.finished,
                notes: req.body.notes
            },
            {where: {id: req.params.id}}
        )
        .then(num => {
            if(num==1){
                res.send({
                    message: 'litter updated'
                })
            } else {
                res.send({
                    message: 'issue updating litter'
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message:  err.message
            })
        })
    }
    else if(req.body.gender === "F"){
        let increment = 'IFNULL(femalesWeaned,0) + ' + req.body.count;
        Litter.update(
            {
                weanDate: req.body.weanDate,
                femalesWeaned: db.sequelize.literal(increment),
                finished: req.body.finished,
                notes: req.body.notes
            },
            {where: {id: req.params.id}}
        )
        .then(num => {
            if(num==1){
                res.send({
                    message: 'litter updated after wean'
                })
            } else {
                res.send({
                    message: 'issue updating litter after wean'
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message 
            })
        })
    }
    let endCount = (req.body.litter.pupDeaths ? req.body.litter.pupDeaths : 0) + (req.body.litter.femalesWeaned ? req.body.litter.femalesWeaned : 0) +
        (req.body.litter.malesWeaned ? req.body.litter.malesWeaned : 0) + req.body.count;   
    if(req.body.finished) {
        Litter.update(
            {pupCount: endCount},
            {where: {id: req.params.id}}
        )
    }
}

exports.noteUpdate = (req, res) => {
    if(req.body.notes){
        Litter.update(
            {notes: req.body.notes},
            {where: {id: req.params.id}}
            )
            .then(num=> {
                if(num == 1){
                    res.send({
                        message: 'litter note updated'
                    })
                } else {
                    res.send({
                        message: 'litter note could not be added'
                    })
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message
                })
            })
    }
}

exports.finishLitter = (req, res) => {
    let endCount = (req.body.litter.pupDeaths ? req.body.litter.pupDeaths : 0) + (req.body.litter.femalesWeaned ? req.body.litter.femalesWeaned : 0) +
        (req.body.litter.malesWeaned ? req.body.litter.malesWeaned : 0);   
    Litter.update(
        {
            finished: req.body.finished,
            pupCount: endCount
        },
        {where: {id: req.params.id}}
        )
        .then(num=> {
            if(num == 1){
                res.send({
                    message: 'litter finished'
                })
            } else {
                res.send({
                    message: 'litter could not be finished'
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}

exports.pupDeathUpdate = (req, res) => {
        let increment = 'IFNULL(pupDeaths,0) + ' + req.body.count;
        Litter.update(
            {
                notes: req.body.notes,
                pupDeaths: db.sequelize.literal(increment),
                finished: req.body.finished
            },
            {where: {id: req.params.id}}
            )
            .then(num=> {
                if(num == 1){
                    res.send({
                        message: 'litter updated after pup death'
                    })
                } else {
                    res.send({
                        message: 'litter pup deaths and notes could not be added'
                    })
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message
                })
            })

        let endCount = (req.body.litter.pupDeaths ? req.body.litter.pupDeaths : 0) + (req.body.litter.femalesWeaned ? req.body.litter.femalesWeaned : 0) +
        (req.body.litter.malesWeaned ? req.body.litter.malesWeaned : 0) + req.body.count;   
        if(req.body.finished) {
            Litter.update(
                {pupCount: endCount},
                {where: {id: req.params.id}}
            )
        }
}

exports.findNext = (req,res) => {
    Litter.max("id")
    .then(max => {
        let data = {"id": (max + 1)};
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: 
            err.message || "couldn't find next litter Id"
        })
    })
}



