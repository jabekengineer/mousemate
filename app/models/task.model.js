module.exports = (sequelize, Sequelize) => {
    const Task = sequelize.define("tasks",{
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
        roomId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        completed: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
        date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        type: {
            type: Sequelize.STRING,
            allowNUll: false,
        }
    });
    return Task
}