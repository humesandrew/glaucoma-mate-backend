const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};
console.log(admin);

// // login user
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.login(email, password);
//     const token = createToken(user._id);
//     res.status(200).json({ email: email, token: token, user_id: user._id });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const loginUser = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the Firebase token is present in the request headers
    const firebaseToken = req.headers.authorization;

    // Verify the Firebase token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    console.log('Decoded Firebase Token:', decodedToken)
    // Now, you can access user information from decodedToken
    // and proceed with your logic
    // For example, you might want to fetch user data from the database:
    const user = await User.findByFirebaseUid(decodedToken.uid);

    if (!user) {
      // If user doesn't exist, you might want to create a new user
      // based on information from decodedToken
      // user = await User.create({
      //   email: decodedToken.email,
      //   // other properties
      // });
    }

    // Create a custom JWT token for your app
    const token = createToken(user._id);

    // Respond with the user data and the custom token
    res.status(200).json({ email: email, token: token, user_id: user._id });
  } catch (error) {
    console.error('Error during Firebase login:', error);
    res.status(400).json({ error: error.message });
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

module.exports = { loginUser, signupUser };
