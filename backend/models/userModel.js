const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
});

// Static signup method
userSchema.statics.signup = async function (email, password) {
  const exists = await this.findOne({ email });

  if (exists) {
    throw new Error("Email already in use.");
  }

  console.log("Password:", password); // Add this line for debugging

  if (typeof password !== 'string') {
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

module.exports = mongoose.model("User", userSchema);
