module.exports = (sequelize, Sequelize) => {
    const Token = sequelize.define("tokens",{
       name: {
            type: Sequelize.STRING(45),
            primaryKey: true,
            allowNull: false
       },
       permissions: {
            type: Sequelize.STRING(45),
            allowNull: false
       }
    });
    return Token;
}