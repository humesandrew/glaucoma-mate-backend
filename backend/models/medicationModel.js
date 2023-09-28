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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Medication', medicationSchema);