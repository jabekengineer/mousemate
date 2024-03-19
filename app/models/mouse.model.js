module.exports = (sequelize, Sequelize) => {
    const Mouse = sequelize.define("mice",{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        claim: {
            type:Sequelize.STRING(45),
            allowNull: true
        },
        dob: {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        weanDate: {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        dod: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        cageId: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        notes : {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        genotype: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        notchOne: {
            type:Sequelize.INTEGER,
            allowNull: true
        },
        notchTwo: {
            type:Sequelize.INTEGER,
            allowNull: true
        },
        generation: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    });
    return Mouse;
}