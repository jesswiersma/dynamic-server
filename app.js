require("dotenv").config();
const Express = require('express');
const app = Express();
const dbConnection = require("./db");

app.use(Express.json()); //must go above all routes - indicates we want json to be used as we process requests

const controllers = require("./controllers");

app.use(require('./middleware/headers'));

// Controller Routes //
app.use("/user", controllers.userController); 
app.use("/waterloo", controllers.adminController); 
app.use("/schedule", controllers.scheduleController);
app.use("/announcement", controllers.announcementController);

//// Connects server to the database (PgAdmin) ///
dbConnection.authenticate()
  .then(() => dbConnection.sync())
  .then(() => {
      app.listen(process.env.PORT, () => {
          console.log(`[Server]: App is listening on ${process.env.PORT}.`);
      });
    })   
      .catch((err) => {
          console.log(`[Server]: Server crashed. Error = ${err}`);
    });

  

//Test Route//
app.use("/test", (req, res) => {
    res.send("This is a message from the test endpoint")
});

