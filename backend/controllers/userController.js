const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email: email, token: token, user_id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// firebase login user
const firebaseLoginUser = async (req, res) => {
  const { firebaseUser } = req.body;
  try {
    // Assuming you have the necessary logic for handling firebaseUser
    // You can perform actions based on firebaseUser data here
    res.status(200).json('good');
  } catch (error) {
    res.status(400).json({ error: 'Error handling firebase login.' });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, firebaseLoginUser, signupUser };
