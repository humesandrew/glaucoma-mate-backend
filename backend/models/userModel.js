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
  // New field named assignedMedications, Type of each element in the array is a MongoDB ObjectID
  // Reference to the 'Medication' model //
  assignedMedications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medication' }]
});

// Static signup method
userSchema.statics.signup = async function (email, password) {
  // validation //
  if (!email || !password) {
    throw Error("All fields must be filled.");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid.");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Password not strong enough. Please include at least 1 capitol, 1 number, and 1 special character."
    );
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw new Error("Email already in use.");
  }

  if (typeof password !== "string") {
    throw new Error("Password must be a string.");
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ email, password: hash });
    return user;
  } catch (error) {
    console.error("Error while hashing the password:", error);
    throw new Error("Error while hashing the password.");
  }
};
// login
// login
// login
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw new Error("User doesn't exist.");
  }
  const user = await this.findOne({ email }).exec(); // Add .exec() at the end

  if (!user) {
    throw new Error("User not found.");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Incorrect password.");
  }
  return user;
};

module.exports = mongoose.model("User", userSchema);
