const db = require("../models");
const Op = db.Sequelize.Op;
const Mouse = db.mice;
const Cages = db.cages;

// get mouse and litters
exports.findOne = (req,res) => {
    const mouseId = req.params.id;
    Mouse.findByPk(mouseId, {include: ["litters"]})
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
// match mouse id and get litter
exports.findLitter = (req,res) => {
    const mouseId = req.params.id;
    Mouse.findByPk(mouseId, {include: ["litters"]})
    .then(data => {
        res.send(data.litters);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || " couldn't find specific cage"
        })
    })
}

exports.findNext = (req,res) => {
    Mouse.max("id")
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

exports.updateNote = (req, res) => {
    if(req.body.notes){
        Mouse.update(
            {notes: req.body.notes},
            {where: {id: req.params.mouseId}}
        )
        .then(num=> {
            if(num == 1){
                res.send({
                    message: 'mouse note updated'
                })
            } else {
                res.send({
                    message: 'mouse note could not be added'
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

exports.deactivate = (req, res) => {
    Mouse.update(
        {
            status: 'Inactive',
            dod: req.body.date
        },
        {where: {id: req.params.mouseId}}
    )
    .then(num=> {
        if(num == 1){
            res.send({
                message: 'mouse status updated'
            })
        } else {
            res.send({
                message: 'mouse status could not be updated'
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        })
    })
    Cages.update(
        {count: db.sequelize.literal('IFNULL(count,0) - 1')},
        {where: {id: req.body.cageId}}
    )  
    .catch(err => {
        res.status(500).send({
            message: 'error incrementing cage count after mouse add'
        })
    })
}

exports.transferMouse = (req, res) => {
    // update mouse cage number, strain, and gender
    Mouse.update(
        {
            cageId: req.body.toCage,
            strain: req.body.strain,
            gender: req.body.gender,
        },
        {where: {id: req.params.mouseId}}
    )
    .then(num=> {
        if(num == 1){
            res.send({
                message: 'mouse location updated'
            })
        } else {
            res.send({
                message: 'mouse location could not be updated'
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        })
    })
    // decrement fromCage mouse count and remove from Claim if no claimed mice left
    Cages.update(
        {
            count: db.sequelize.literal('IFNULL(count,0) - 1'),
            claim: req.body.fromClaim
        },
        {where: {id: req.body.fromCage}}
    )    
    // increment toCage mouse count
    Cages.update(
        {
            count: db.sequelize.literal('IFNULL(count,0) + 1'),
            claim: req.body.claim ? req.body.claim : null,
        },
        {where: {id: req.body.toCage}}
    ) 
}

exports.findStrainAdults = (req, res) => {  
    Mouse.findAll({
        where: {
            [Op.and] : [
                {
                    strain: {
                        [Op.eq] : req.params.strain
                    }
                },
                {
                    status: {
                        [Op.eq]: 'Adult'
                    }
                },
                {
                    gender: {
                        [Op.eq]: req.params.gender
                    }
                }
            ]
        },
        order: [
            ['dob', 'DESC']
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

exports.makeBreeder = (req, res) => {
    Mouse.update(
        {
            status: "Breeder",
            cageId: req.params.toCageId
        },
        {where: {id: req.params.mouseId}}
    )
    .then((num) => {
        if(num == 1){
            res.send({
                message: 'mouse successfully updated to breeder'
            })
        }
    })
    .catch((err) => {
        res.status(500).send({
            message: err.message
        })
    })
     // decrement fromCage mouse count
     Cages.update(
        {count: db.sequelize.literal('IFNULL(count,1) - 1')},
        {where: {id: req.params.fromCageId}}
    )    
    // increment toCage mouse count
    Cages.update(
        {count: db.sequelize.literal('IFNULL(count,0) + 1')},
        {where: {id: req.params.toCageId}}
    ) 
}

exports.retireBreeder = (req, res) => {
    // both breeders become adults
        Mouse.update(
            {status: "Adult"},
            {where: {id: req.params.mouseId}}
        )
        .then((num) => {
            if(num == 1){
                res.send({
                    message: 'breeder successfully updated to adult'
                })
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message
            })
        })
}

exports.claimAdult = (req, res) => {
    Mouse.update(
        {claim: req.body.reason},
        {where: {id: req.params.mouseId}}
    )
    .then((num) => {
        if(num == 1){
            res.send({
                message: 'mouse successfully claimed'
            })
        }
    })
    .catch((err) => {
        res.status(500).send({
            message: err.message
        })
    })
}

exports.genotypeAdult = (req, res) => {
    Mouse.update(
        {
            genotype: req.body.genotype,
            notchOne: req.body.notchOne,
            notchTwo: req.body.notchTwo
        },
        {where: {id: req.params.mouseId}}
    )
    .then((num) => {
        if(num == 1){
            res.send({
                message: 'mouse successfully claimed'
            })
        }
    })
    .catch((err) => {
        res.status(500).send({
            message: err.message
        })
    })
}
