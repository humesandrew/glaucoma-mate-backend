const User = require("../models/userModel");
const admin = require("firebase-admin");

// Function to handle user login using Firebase ID token
const loginUser = async (req, res) => {
    const authToken = req.headers.authorization?.split('Bearer ')[1]; // Properly extract the token

    if (!authToken) {
        console.error("No authToken provided.");
        return res.status(401).json({ error: "No authToken provided." });
    }

    console.log("Attempting to verify ID token");
    try {
        const decodedToken = await admin.auth().verifyIdToken(authToken);
        console.log("Token verified, UID:", decodedToken.uid);

        // Check if the user exists in MongoDB
        const user = await User.findOne({ firebaseUid: decodedToken.uid });
        if (!user) {
            console.error("User not found in database, UID:", decodedToken.uid);
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
    console.log("Signup attempt for email:", email);

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error("Email already in use:", email);
            return res.status(400).json({ error: "Email already in use." });
        }

        console.log("Creating user in Firebase for email:", email);
        const userRecord = await admin.auth().createUser({ email, password });

        console.log("Creating user in MongoDB for UID:", userRecord.uid);
        const newUser = await User.create({
            email: email,
            firebaseUid: userRecord.uid
        });

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
