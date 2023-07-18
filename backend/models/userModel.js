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
});

// Static signup method
userSchema.statics.signup = async function (email, password) {


// validation //
if (!email || !password) {
  throw Error("All fields must be filled.");
}

if (!validator.isEmail(email)) {
  throw Error("Email is not valid.")
}
if (!validator.isStrongPassword(password)) {
  throw Error("Password not strong enough. Please include at least 1 capitol, 1 number, and 1 special character.")
}


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
