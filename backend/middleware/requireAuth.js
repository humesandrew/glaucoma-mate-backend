const admin = require("firebase-admin");
const User = require("../models/userModel.js");

const extractTokenFromHeaders = (headers) => {
  if (!headers || !headers.authorization) {
    return null;
  }
  const token = headers.authorization.split(" ")[1];
  return token;
};

const requireAuth = async (req, res, next) => {
  console.log("requireAuth middleware called");

  const token = extractTokenFromHeaders(req.headers);

  if (!token) {
    return res.status(401).json({ error: "Authorization token required." });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid } = decodedToken;

    // Fetch the user and populate the assignedMedications field
    req.user = await User.findOne({ firebaseUid: uid })
      .populate("assignedMedications")
      .exec();

    if (!req.user) {
      console.log("User not found");
      return res.status(401).json({ error: "User not found" });
    }

    console.log("User found:", req.user);
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = requireAuth;
