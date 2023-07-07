const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const prescriptionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dose: {
      type: Number,
      required: true,
    },
    capColor: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
