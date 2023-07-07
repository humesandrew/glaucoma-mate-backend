const express = require("express");
const mongoose = require("mongoose");
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

// connect to db //////////////////
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => console.log('Connected to db and listening on port 4000.'));
  })
  .catch((error) => {
    console.log(error)
  });

