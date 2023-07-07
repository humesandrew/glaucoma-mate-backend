const express = require("express");
const mongoose = require("mongoose");
const prescriptionsRoutes = require("./routes/prescriptions");
require('dotenv').config();

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Establish middleware to monitor requests to server and response
app.use((req, res, next) => {
  console.log("Path is " + req.path + " and method is " + req.method);
  next();
});

// Routes
app.use('/api/prescriptions', prescriptionsRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Connected to db and listening on port ' + process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
