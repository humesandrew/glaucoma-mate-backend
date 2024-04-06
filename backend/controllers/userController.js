const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// Login user
const fetch = require('node-fetch');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Authenticate user using Firebase Authentication REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAts5SVgRfuCSV3kXNFOjWPsPd5hfX-TYY
      `,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message);
    }

    // Check if the user exists in the database
    let user = await User.findByEmail(email);

    if (!user) {
      // Instead of creating a new user, return an error indicating the user was not found
      return res.status(404).json({ error: "User not found. Please signup first." });
    }

    // Create a custom JWT token for your app
    const token = createToken(user._id);

    // Respond with the user data and the custom token
    res.status(200).json({ email, token, firebaseToken: data.idToken, user_id: user._id, firebaseUid: user.firebaseUid });
  } catch (error) {
    console.error('Error during Firebase login:', error);
    res.status(400).json({ error: error.message });
  }
};

// Function to handle new user signup
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists in MongoDB
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already in use.");
    }

    // Create a new user in Firebase Authentication
    const userRecord = await admin.auth().createUser({ email, password });

    // Create a new user in MongoDB with the Firebase UID
    const newUser = await User.signup(email, null, userRecord.uid); // Assuming your User.signup can handle null passwords for Firebase users

    const token = createToken(newUser.firebaseUid);
    res.status(200).json({ email: newUser.email, token, firebaseUid: newUser.firebaseUid });
  } catch (error) {
    console.error('Error during user signup:', error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signupUser };
