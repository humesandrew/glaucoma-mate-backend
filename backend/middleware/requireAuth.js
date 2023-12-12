const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const requireAuth = async (req, res, next) => {
  console.log("requireAuth middleware called");
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required." });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    // Debug: Log the token payload
    console.log("Token Payload:", _id);

    // Fetch the user and populate the assignedMedications field
    req.user = await User.findById(_id).populate("assignedMedications").exec();

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
