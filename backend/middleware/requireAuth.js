const admin = require('firebase-admin');
const User = require("../models/userModel.js");

const requireAuth = async (req, res, next) => {
  console.log("requireAuth middleware called");
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required." });
  }

  const token = authorization.split(" ")[1];

  try {
    // Verify the Firebase ID token using the Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid } = decodedToken;

    // Fetch the user and populate the assignedMedications field
    req.user = await User.findOne({ firebaseUid: uid }).populate("assignedMedications").exec();

    if (!req.user) {
      // Debug: Log if user is not found
      console.log("User not found");
      return res.status(401).json({ error: "User not found" });
    }

    // Debug: Log if user is found
    console.log("User found:", req.user);

    next();
  } catch (error) {
    console.log(error);

    // Debug: Log if request is not authorized
    console.log("Request is not authorized");
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
