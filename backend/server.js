const express = require("express");
const mongoose = require("mongoose");
const dosesRoutes = require("./routes/doses");
const userRoutes = require("./routes/user");
const cors = require("cors"); // Import the cors package
require('dotenv').config();

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Add the cors middleware
app.use(cors());

// Establish middleware to monitor requests to server and response
app.use((req, res, next) => {
  console.log("Path is " + req.path + " and method is " + req.method);
  next();
});

// Routes
app.use('/api/doses', dosesRoutes);
app.use('/api/user', userRoutes);

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
