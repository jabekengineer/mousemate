module.exports = (sequelize, Sequelize) => {
    const Litter = sequelize.define("litters",{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        parentCageId: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        mouseId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        sireId : {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        damId : {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        dob : {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        weanDate : {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        pupCount : {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        cfPupCount : {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        cfLitterId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        malesWeaned: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        femalesWeaned: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        pupDeaths: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        finished: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        notes: {
            type: Sequelize.STRING,
            allowNull: true
        },
        generation: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    });
    return Litter;
}