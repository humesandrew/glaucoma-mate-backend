const express = require("express");

const prescriptionsRoutes = require("./routes/prescriptions")
require('dotenv').config();

const app = express();

// establish middle ware to monitor requests to server and response//
app.use((req, res, next) => {
  console.log("Path is " + req.path + "and method is " + req.method);
  next();
})

//routes /////////////////////////////
app.use('/api/prescriptions/', prescriptionsRoutes)

app.listen(process.env.PORT, () => console.log('listening on port 4000.'));