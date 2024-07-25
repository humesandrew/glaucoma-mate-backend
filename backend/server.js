const express = require("express");
const admin = require("./config/firebase-config.js"); 
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
const corsOptions = {
  origin: function (origin, callback) {
    // Replace 'https://your-static-site.onrender.com' with your actual Render frontend URL
    const allowedOrigins = ['https://glaucoma-mate-frontend.onrender.com', 'http://localhost:3000'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow if it's in the allowed list or not set (server-to-server requests)
    } else {
      callback(new Error('CORS not allowed from this domain'), false);
    }
  },
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));


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
