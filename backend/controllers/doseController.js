const Dose = require("../models/doseModel");
const User = require("../models/userModel");
const Medication = require("../models/medicationModel");
const mongoose = require("mongoose");
const moment = require("moment");

// Function for getting all doses
const getDoses = async (req, res) => {
  const doses = await Dose.find().sort({ _id: -1 });
  res.status(200).json(doses);
};

// Function for getting a single dose
const getDose = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No valid id found." });
  }
  const dose = await Dose.findById(id);

  if (!dose) {
    return res.status(404).json({ error: "No such dose" });
  }

  res.status(200).json(dose);
};

// Function for creating a new dose
const createDose = async (req, res) => {
  const { medicationId, timestamp, user: firebaseUid } = req.body; // Retrieve user from request body
  
  try {
    // Find the user by Firebase UID
    const user = await User.findByFirebaseUid(firebaseUid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the provided medication ID is valid
    if (!mongoose.Types.ObjectId.isValid(medicationId)) {
      return res.status(400).json({ error: "Invalid Medication ID" });
    }

    // Check if the maximum dosage has been reached for the calendar day
    const medication = await Medication.findById(medicationId);
    if (!medication) {
      return res.status(404).json({ error: "Medication not found" });
    }

    // Validate the timestamp format using moment.js
    const doseTimestamp = moment(timestamp);
    if (!doseTimestamp.isValid()) {
      return res.status(400).json({ error: "Invalid timestamp format" });
    }

    // Calculate the start and end of the calendar day for the current timestamp
    const startOfDay = doseTimestamp.startOf("day").toDate();
    const endOfDay = doseTimestamp.endOf("day").toDate();

    // Query the database for all doses of the specified medication within the calendar day for the specific user
    const dosesForMedication = await Dose.find({
      medication: medicationId,
      user: user._id, // Include the user in the query
      timestamp: { $gte: startOfDay, $lte: endOfDay },
    });

    // Check if the maximum dosage has been reached for the calendar day
    if (dosesForMedication.length >= medication.dosage) {
      return res
        .status(400)
        .json({ error: "Maximum dosage reached for the medication" });
    }

    // Create the dose with the provided information
    const createdDose = await Dose.create({
      medication: medicationId,
      user: user._id, // Use the user ID from the request body
      timestamp: doseTimestamp.toDate(), // Convert moment object to Date
    });

    // Update the user's dailyDoses array
    await User.findByIdAndUpdate(user._id, { $push: { dailyDoses: createdDose._id } });

    res.status(200).json(createdDose);
   
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createDose,
  getDoses,
  getDose,
};
