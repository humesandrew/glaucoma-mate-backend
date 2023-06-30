const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Connected to db & listening on port " + process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

  