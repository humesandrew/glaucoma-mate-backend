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
      // If the user doesn't exist, create a new user in the database
      const userRecord = await admin.auth().getUserByEmail(email);
      user = await User.signup(email, userRecord.uid);
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


const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already in use.");
    }

    // Sign up the user using Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password
    });

    console.log("Firebase UID:", userRecord.uid); // Log the firebaseUid

    // Call the signup function with email and Firebase UID
    const user = await User.signup(email, userRecord.uid);

    console.log("User signed up:", user); // Log the user object

    // Create a custom JWT token for your app
    const token = createToken(user._id);

    // Respond with the user data and the custom token
    res.status(200).json({ email, token });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(400).json({ error: error.message });
  }
};


module.exports = { loginUser, signupUser };
