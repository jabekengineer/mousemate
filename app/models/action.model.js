module.exports = (sequelize, Sequelize) => {
    const Action = sequelize.define("actions",{
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true, 
            allowNull: false,
            autoIncrement: true,
        },
        cageId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        litterId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        user: {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        type: {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        tagline: {
            type: Sequelize.STRING(255),
            allowNull: false
        }
    });
    return Action
}