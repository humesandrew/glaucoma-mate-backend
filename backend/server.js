const express = require("express");
const admin = require("./config/firebase-config.js"); 
// const serviceAccount = require('./config/serviceAccountKey.json');
const mongoose = require("mongoose");
const dosesRoutes = require("./routes/doses");
const userRoutes = require("./routes/user");
const medicationsRoutes = require("./routes/medications"); 
const seedMedications = require('./seed.js');
const cors = require("cors");
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
app.use('/api/medications', medicationsRoutes); 


mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

  .then(async () => {
    // Seed medications
    await seedMedications();

    // Start the Express server
    app.listen(process.env.PORT || 80, () => {
      console.log('Connected to db and listening on port ' + (process.env.PORT || 80));
    });
  })
  .catch((error) => {
    console.log(error);
  });
