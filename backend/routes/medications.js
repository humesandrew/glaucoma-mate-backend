const express = require('express');
const router = express.Router();
const Medication = require("../models/medicationModel");
const User = require("../models/userModel"); // Import the User model
const requireAuth = require('../middleware/requireAuth');

// Get all medications
router.get("/", async (req, res) => {
  try {
    const medications = await Medication.find();
    res.json(medications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Assign a medication to a user
router.post('/assign', requireAuth, async (req, res) => {
  try {
    const { medicationId } = req.body;
    const user = req.user; // Get the user from the authenticated request

    // Find the medication
    const medication = await Medication.findById(medicationId);
    if (!medication) {
      return res.status(404).json({ error: "Medication not found" });
    }

    // Assign the medication to the user
    user.medications.push(medication);
    await user.save();

    res.json({ message: "Medication assigned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
