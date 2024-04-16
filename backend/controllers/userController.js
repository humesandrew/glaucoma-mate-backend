const User = require("../models/userModel");
const admin = require("firebase-admin");

// Function to handle user login using Firebase ID token
const loginUser = async (req, res) => {
    const { authToken } = req.headers;  // Expect authToken in the request headers

    try {
        // Verify the ID token using Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(authToken);
        const uid = decodedToken.uid;

        // Check if the user exists in MongoDB
        const user = await User.findOne({ firebaseUid: uid });
        if (!user) {
            return res.status(404).json({ error: "User not found. Please signup first." });
        }

        // Respond with the user data
        res.status(200).json({
            email: user.email,
            firebaseUid: user.firebaseUid
        });
    } catch (error) {
        console.error('Error during Firebase login:', error);
        res.status(401).json({ error: "Unauthorized - " + error.message });
    }
};

// Function to handle new user signup
const signupUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user already exists in MongoDB
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use." });
        }

        // Create a new user in Firebase Authentication
        const userRecord = await admin.auth().createUser({ email, password });

        // Create a new user in MongoDB with the Firebase UID
        const newUser = await User.create({
            email: email,
            firebaseUid: userRecord.uid
        });

        // Respond with user data without waiting for a custom token
        res.status(201).json({
            email: newUser.email,
            firebaseUid: newUser.firebaseUid
        });
    } catch (error) {
        console.error('Error during user signup:', error);
        res.status(400).json({ error: error.message });
    }
};

module.exports = { loginUser, signupUser };
