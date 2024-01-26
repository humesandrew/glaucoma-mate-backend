const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// Login user
const fetch = require('node-fetch');

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Authenticate user using Firebase Authentication REST API
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAts5SVgRfuCSV3kXNFOjWPsPd5hfX-TYY
    `, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message);
    }

    // Get the user from the database using email
    const user = await User.findByEmail(email);

    if (!user) {
      throw new Error("User not found.");
    }

    // Create a custom JWT token for your app
    const token = createToken(user._id);

    // Respond with the user data and the custom token
    res.status(200).json({ email, token, user_id: user._id });
  } catch (error) {
    console.error('Error during Firebase login:', error);
    res.status(400).json({ error: error.message });
  }
};

// Signup user
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sign up the user using Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password
    });

    // Call the signup function with email and Firebase UID
    const user = await User.signup(email, userRecord.uid);

    // Create a custom JWT token for your app
    const token = createToken(user._id);

    // Respond with the user data and the custom token
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signupUser };
