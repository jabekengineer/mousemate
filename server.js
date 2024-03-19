// import modules
const express = require("express");

// create the app
const app = express();

// TODO: BUILD 
const path = __dirname + '/app/views/';
app.use(express.static(path));

const cors = require("cors");
var corsOptions = {
  // origin: "http://localhost:3001"
};
app.use(cors(corsOptions));

// parse requests of content type application/json
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }));

// application routes
app.get("/", (req, res) => {
  // TODO: BUILD
  res.sendFile(path + "index.html");
  // TODO: DEV
  // res.json({ message: 'Welcome to mousemate'})
  });


  
// connect to database
const db = require("./app/models");
db.sequelize.sync()

// let server know what routes to use for the HTTP commands it gets
require("./app/routes/cage.routes")(app)
require("./app/routes/mouse.routes")(app)
require("./app/routes/login.routes")(app)
require("./app/routes/action.routes")(app)
require("./app/routes/task.routes")(app)

// set port and listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
});