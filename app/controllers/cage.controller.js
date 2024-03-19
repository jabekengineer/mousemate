const db = require("../models");
const Cages = db.cages;
const Op = db.Sequelize.Op;
const Mouse  = db.mice;

exports.findNext = (req, res) => {
    Cages.max("id")
    .then(max => {
        let data = {"id": (max + 1)};
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "couldn't count cage ids"
        })
    })
}

exports.findAll = (req, res) => {
    Cages.findAll(
        {include: ["mice"]}
    )
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "couldn't retrieve all cages"
        })
    })
}

exports.findEmptyOrNot = (req, res) => {
    let countFloor = req.params.empty === 'true' ? 0 : 1;
    let roomCondition = req.params.experiment === 'true' ? 
    {
        [Op.eq] : 261
    } : 
    {
        [Op.ne] : 261
    }
    Cages.findAll(
        {where: {
            [Op.and]: [
                {
                count: {
                    [Op.gte]: countFloor
                    }
                },
                {
                roomId: roomCondition
                }
            ]
            },
        include: ["mice"]
        },
    )
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "couldn't retrieve all cages"
        })
    })
}

exports.findOne = (req,res) => {
    const cageNum = req.params.id;
    Cages.findByPk(cageNum, {include: ["mice"]})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || " couldn't find specific cage"
        })
    })
};

exports.findStrainGender = (req, res) => {
    let roomCondition = req.params.experiment === 'true' ? 
    {
        [Op.eq] : 261
    } : 
    {
        [Op.ne] : 261
    }
    Cages.findAll({
        where: {
            [Op.and]: [
                {strain: {
                    [Op.eq]: req.params.strain}
                },
                {gender: 
                    {
                    [Op.eq]: req.params.gender}
                    },
                {
                    count: {
                        [Op.gt]: 0
                    }
                },
                {
                    id: {
                        [Op.ne] : req.params.cageId
                    }
                },
                {
                    roomId: roomCondition
                }
            ]
        },
        order: [
            ['id', 'DESC'],
        ]
    })
    .then((data) => {
        res.send(data)
    })
    .catch((err) => {
        res.status(500).send({
            message: err.message
        })
    })
}

exports.findMice = (req,res) => {
    const cageNum = req.params.id;
    Cages.findByPk(cageNum, {include: ["mice"]})
    .then(data => {
        res.send(data.mice);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || " couldn't find specific cage"
        })
    })
}
// foreign key input to function
exports.addMouse = (req, res) => {
    const cageId = req.params.id;
    // create the new mouse
    Mouse.create({
        id: req.body.id,
        dob: req.body.dob,
        weanDate: req.body.weanDate,
        cageId: cageId,
        strain: req.body.strain,
        status: req.body.status,
        gender: req.body.gender,
        generation: req.body.generation,
        notes: req.body.notes ? req.body.notes : ''
    })
    .then(data => {
        res.send(data);
    })
    .catch((err) => {
        res.status(500).send({
            message: 
            err.message || "error adding mouse to cage"
        })
    });

    // increment cage mouse count
    Cages.update(
        {count: db.sequelize.literal('count + 1')},
        {where: {id: cageId}}
    )  
    .catch(err => {
        res.status(500).send({
            message: 'error incrementing cage count after mouse add'
        })
    })
     
}

exports.addCage = (req, res) => {
    const cage = {
        id: req.body.id,
        roomId: req.body.roomId,
        strain: req.body.strain,
        status: req.body.status,
        gender: req.body.gender,
        count: req.body.count ? req.body.count : 0,
        litterId: req.body.litterId ? req.body.litterId : null,
        breederPairDate: req.body.breederPairDate ? req.body.breederPairDate : null,
        notes: req.body.notes ? req.body.notes: '',
        claim: req.body.claim ? req.body.claim : null,
    }
    Cages.create(cage)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: 
            err.message || "Couldn't add this cage to the database"
        })
    })

}

exports.roomChange = (req, res) => {
    if(req.body.roomId){
        Cages.update(
            {roomId: req.body.roomId},
            {where: {id: req.params.id}}
        )
        .then(num => {
            if(num == 1){
                res.send({
                    message: 'cage room updated'
                })
            } else {
                res.send({
                    message: 'cage room not updated'
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

exports.noteUpdate = (req, res) => {
    if(req.body.notes){
        Cages.update(
            {notes: req.body.notes},
            {where: {id: req.params.id}}
        )
        .then(num => {
            if(num == 1){
                res.send({
                    message: 'cage note updated'
                })
            } else {
                res.send({
                    message: 'litter note not updated'
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

exports.retireUpdate = (req, res) => {
    // retiring the male changes the cage gender
    if(!req.body.status && req.body.gender){
        Cages.update(
            {gender: req.body.gender},
            {where: {id: req.params.id}}
        )
        .then(num => {
            if(num == 1){
                res.send({
                    message: 'male in cage retired'
                })
            } else {
                res.send({
                    message: 'cage not updated after male retire'
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
    }
    // retiring the female changes the cage status and gender
    if(req.body.status && req.body.gender && req.body.strain){
        Cages.update(
            {
                gender: req.body.gender,
                status: req.body.status,
                strain: req.body.strain
            },
            {where: {id: req.params.id}}
        )
        .then(num => {
            if(num == 1){
                res.send({
                    message: 'female in cage retired'
                })
            } else {
                res.send({
                    message: 'cage not updated after female retire'
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

exports.claimCage = ((req, res) => {
    Cages.update(
        {claim: req.body.user},
        {where: {id: req.params.id}}
    )
    .then(num => {
        if(num == 1){
            res.send({
                message: 'cage claimed'
            })
        } else {
            res.send({
                message: 'cage not updated after claim'
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        })
    })
})