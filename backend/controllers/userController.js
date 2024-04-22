const User = require("../models/userModel");
const admin = require("firebase-admin");

// Function to handle user login using Firebase ID token
// Function to handle user login using Firebase ID token
const loginUser = async (req, res) => {
    const authToken = req.headers.authorization?.split('Bearer ')[1];

    if (!authToken) {
        console.error("No authToken provided.");
        return res.status(401).json({ error: "No authToken provided." });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(authToken);
        console.log("Token verified, UID:", decodedToken.uid);

        // Retrieve the user from MongoDB using the UID from Firebase
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
// Function to handle new user signup
const signupUser = async (req, res) => {
    const { email } = req.body; // Remove the password from request body handling
    console.log("Signup attempt for email:", email);

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error("Email already in use:", email);
            return res.status(400).json({ error: "Email already in use." });
        }

        // Create a new user in Firebase Authentication
        const userRecord = await admin.auth().createUser({ email });

        // Log for debugging
        console.log("Firebase user created with UID:", userRecord.uid);

        // Create a new user in MongoDB with the Firebase UID
        const newUser = await User.create({
            email: email,
            firebaseUid: userRecord.uid
        });

        // Respond with user data
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
