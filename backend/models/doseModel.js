const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const doseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dose: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dose', doseSchema);
