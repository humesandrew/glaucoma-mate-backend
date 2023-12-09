const mongoose = require("mongoose");

// Define the schema for the Dose model
const doseSchema = new mongoose.Schema({
  // Reference to the User model, indicating the user who took the dose
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Reference to the Medication model, indicating the medication that was taken
  medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },

  // Timestamp indicating when the dose was recorded, defaults to the current time
  timestamp: { type: Date, default: Date.now },

  // Quantity of the medication taken in this dose, defaults to 1
  quantity: { type: Number, default: 1 },
});

// Create and export the Dose model based on the defined schema
module.exports = mongoose.model("Dose", doseSchema);
