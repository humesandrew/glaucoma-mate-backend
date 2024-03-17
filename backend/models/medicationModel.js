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
    // Change the type to ObjectId to reference the User model
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference the User model
      required: true,
    },
  },
  // Enable timestamps to automatically track creation and update times
  { timestamps: true }
);

module.exports = mongoose.model('Medication', medicationSchema);
