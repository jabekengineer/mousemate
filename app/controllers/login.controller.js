const db = require('../models');
const Op = db.Sequelize.Op;
const Token = db.tokens;

exports.checkUser = (req,res) => {
        Token.findAll({
            where: {
                [Op.and]: [
                    {name: req.params.name || null},
                ]
            }
        })
        .then((data) => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}