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
    const { email, firebaseUid } = req.body; // Expect firebaseUid to be provided
    console.log("Signup attempt for email:", email);

    try {
        // Check if the user already exists in MongoDB
        const existingMongoUser = await User.findOne({ email });
        if (existingMongoUser) {
            console.error("Signup error: Email already in use in MongoDB,", email);
            return res.status(400).json({ error: "Backend Email already in use." });
        }

        let userRecord;
        // If firebaseUid is provided, attempt to retrieve the existing Firebase user
        if (firebaseUid) {
            try {
                userRecord = await admin.auth().getUser(firebaseUid);
            } catch (error) {
                // User does not exist in Firebase, so create a new one
                userRecord = await admin.auth().createUser({ email });
            }
        } else {
            // If no firebaseUid provided, create a new Firebase user
            userRecord = await admin.auth().createUser({ email });
        }
        console.log("Signup: Firebase user ensured/created with UID:", userRecord.uid);

        // Create the MongoDB user with the Firebase UID
        const newUser = await User.create({ email, firebaseUid: userRecord.uid });
        console.log("Signup: MongoDB user created with email:", newUser.email);

        res.status(201).json({ email: newUser.email, firebaseUid: newUser.firebaseUid });
    } catch (error) {
        console.error('Signup error:', error);
        if (error.errorInfo && error.errorInfo.code === 'auth/email-already-exists') {
            res.status(400).json({ error: "Firebase: Email already exists." });
        } else {
            res.status(400).json({ error: error.message || 'Failed to create user.' });
        }
    }
};


module.exports = { loginUser, signupUser };
