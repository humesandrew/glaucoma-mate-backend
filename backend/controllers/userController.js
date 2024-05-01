const User = require("../models/userModel");
const admin = require("firebase-admin");

// Function to handle user login using Firebase ID token
const loginUser = async (req, res) => {
    const authToken = req.headers.authorization?.split('Bearer ')[1];
    if (!authToken) {
        console.error("Login error: No authToken provided.");
        return res.status(401).json({ error: "No authToken provided." });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(authToken);
        console.log("Login: Token verified, UID:", decodedToken.uid);

        const user = await User.findOne({ firebaseUid: decodedToken.uid });
        if (!user) {
            console.error("Login error: User not found in database, UID:", decodedToken.uid);
            return res.status(404).json({ error: "User not found. Please signup first." });
        }

        res.status(200).json({
            email: user.email,
            firebaseUid: user.firebaseUid
        });
    } catch (error) {
        console.error('Login error during Firebase verification:', error);
        res.status(401).json({ error: "Unauthorized - " + error.message });
    }
};

// Function to handle new user signup
const signupUser = async (req, res) => {
    const { email } = req.body;
    console.log("Mongo signup attempt for email:", email);

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error("Mongo signup error: Email already in use,", email);
            return res.status(400).json({ error: "Backend Email already in use." });
        }

        const userRecord = await admin.auth().createUser({ email });
        console.log("Backend signup: Firebase user created with UID:", userRecord.uid);

        const newUser = await User.create({ email, firebaseUid: userRecord.uid });
        console.log("Backend signup: MongoDB user created with email:", newUser.email);

        res.status(201).json({ email: newUser.email, firebaseUid: newUser.firebaseUid });
    } catch (error) {
        console.error('Backend signup error:', error);
        if (error.errorInfo && error.errorInfo.code === 'auth/email-already-exists') {
            res.status(400).json({ error: "Backend firebase: Email already exists." });
        } else {
            res.status(400).json({ error: error.message || 'Backend failed to create user.' });
        }
    }
};