const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firebaseUid: {
    type: String,
    unique: true,
  },
  assignedMedications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medication' }],
  dailyDoses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Dose'}],
  authToken: {
    type: String,
    unique: true,
  },
});

userSchema.statics.signup = async function (email, password, firebaseUid) {
  if (!email || (!password && !firebaseUid)) {
    throw Error("All fields must be filled.");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid.");
  }

  if (password && !validator.isStrongPassword(password)) {
    throw Error(
      "Password not strong enough. Please include at least 1 capital, 1 number, and 1 special character."
    );
  }

  const existsByEmail = await this.findOne({ email });
  if (existsByEmail) {
    throw new Error("Email already in use.");
  }

  if (firebaseUid) {
    const existsByFirebaseUid = await this.findOne({ firebaseUid });
    if (existsByFirebaseUid) {
      throw new Error("Firebase UID already in use.");
    }
  }

  if (password) {
    if (typeof password !== "string") {
      throw new Error("Password must be a string.");
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const user = await this.create({ email, password: hash, firebaseUid });
      return user;
    } catch (error) {
      console.error("Error while hashing the password:", error);
      throw new Error("Error while hashing the password.");
    }
  } else if (firebaseUid) {
    const user = await this.create({ email, firebaseUid });
    return user;
  }
};

userSchema.statics.login = async function (email, password, firebaseUid) {
  if ((!email || !password) && !firebaseUid) {
    throw new Error("Email and password or Firebase UID are required.");
  }

  if (email && password) {
    const user = await this.findOne({ email }).exec();

    if (!user) {
      throw new Error("User not found.");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Incorrect password.");
    }

    return user;
  } else if (firebaseUid) {
    const user = await this.findOne({ firebaseUid }).exec();

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  }
};

module.exports = mongoose.model("User", userSchema);
