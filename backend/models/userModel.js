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

userSchema.statics.signup = async function (email, password, firebaseUid) {
  if (!email || (!password && !firebaseUid)) {
    throw Error("Both email and Firebase UID are required for signup.");
  }

  const existingUser = await this.findOne({ email });
  if (existingUser) {
    throw new Error("Email already in use.");
  }

  try {
    const user = await this.create({ email, password, firebaseUid }); // Save user with firebaseUid
    return user;
  } catch (error) {
    console.error("Error while creating user:", error);
    throw new Error("Error while creating user.");
  }
};

userSchema.statics.login = async function (email, firebaseUid) {
  if (!email && !firebaseUid) {
    throw new Error("Either email or Firebase UID is required for login.");
  }

  const query = email ? { email } : { firebaseUid };

  const user = await this.findOne(query).exec();

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

userSchema.statics.findByFirebaseUid = async function (firebaseUid) {
  return this.findOne({ firebaseUid });
};

userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

module.exports = mongoose.model("User", userSchema);
