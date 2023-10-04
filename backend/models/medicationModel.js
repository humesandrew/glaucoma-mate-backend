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
    // Reference to the User model
    user: {
        // ObjectId type to store the unique identifier of the user //
      type: Schema.Types.ObjectId,
       // Ref indicates the referenced model //
      ref: 'User',
       // The user field is required, as each medication should belong to a user //
      required: true,
    },
  },
    // Enable timestamps to automatically track creation and update times //
  { timestamps: true }
);

module.exports = mongoose.model('Medication', medicationSchema);
