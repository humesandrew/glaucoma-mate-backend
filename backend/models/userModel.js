const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firebaseUid: {
    type: String,
    unique: true,
  },
  assignedMedications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medication' }],
  dailyDoses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dose' }]
});

userSchema.statics.findByFirebaseUid = async function (firebaseUid) {
  return this.findOne({ firebaseUid });
};

userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

userSchema.statics.signup = async function (email, firebaseUid) {
  if (!email || !firebaseUid) {
    throw new Error("Both email and Firebase UID are required for signup.");
  }
  const existingUser = await this.findOne({ email });
  if (existingUser) {
    throw new Error("Email already in use.");
  }
  return this.create({ email, firebaseUid });
};

module.exports = mongoose.model("User", userSchema);
