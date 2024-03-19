const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.cages = require("./cage.model.js")(sequelize, Sequelize);
db.mice = require("./mouse.model.js")(sequelize,Sequelize);
db.litters = require("./litter.model.js")(sequelize,Sequelize);
db.tokens = require("./token.model.js")(sequelize, Sequelize);
db.actions = require("./action.model.js")(sequelize,Sequelize);
db.tasks = require("./task.model.js")(sequelize, Sequelize);

db.cages.hasMany(db.mice, { as: "mice"});
db.mice.belongsTo(db.cages, {
  foreignKey: "cageId"
});

db.litters.hasMany(db.cages, { as: "cages"});
db.cages.belongsTo(db.litters, {
  foreignKey: "litterId"
});

db.mice.hasMany(db.litters, { as: "litters"});
db.litters.belongsTo(db.mice, {
  foreignKey: "mouseId",
});

module.exports = db;