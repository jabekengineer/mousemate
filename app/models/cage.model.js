module.exports = (sequelize, Sequelize) => {
    const Cage = sequelize.define("cages",{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        claim: {
            type:Sequelize.STRING(45),
            allowNull: true
        },
        roomId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        parentCageId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        breederPairDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        litterId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        strain: {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        status : {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        gender: {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        count: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        notes: {
            type: Sequelize.STRING,
            allowNull: true
        }
    });
    return Cage;
}