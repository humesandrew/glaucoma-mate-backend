const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const medicationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dosage: {
      type: Number,
      required: true,
    },
    sig: {
      type: String,
      required: true,
    },
    capColor: {
      type: String,
      required: true,
    },
    // Change the type to String to store the user's ID as a string
    user: {
      type: String,
      required: true,
    },
  },
  // Enable timestamps to automatically track creation and update times
  { timestamps: true }
);

module.exports = mongoose.model('Medication', medicationSchema);
