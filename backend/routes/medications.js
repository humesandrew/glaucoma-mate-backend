const express = require("express");
const router = express.Router();
const Medication = require("../models/medicationModel");
const User = require("../models/userModel"); // Import the User model
const requireAuth = require("../middleware/requireAuth");

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
// Get medications assigned to the logged-in user
router.get("/assigned", requireAuth, async (req, res) => {
  try {
    const user = req.user; // Get the user from the authenticated request

    // Assuming the User model has a field named 'assignedMedications' for assigned medications.
    // If your field is named differently, adjust it here.
    const assignedMedications = await Medication.find({
      _id: { $in: user.assignedMedications },
    });

    res.json(assignedMedications);
    // console.log(user.assignedMedications);
    // console.log(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Assign a medication to a user
router.post("/assign", requireAuth, async (req, res) => {
  try {
    const { medicationId } = req.body;
    const user = req.user; // Get the user from the authenticated request

    if (user.assignedMedications.includes(medicationId)) {
      return res
        .status(400)
        .json({ error: "Medication is already assigned to the user" });
    }

    // Find the medication
    const medication = await Medication.findById(medicationId);
    if (!medication) {
      return res.status(404).json({ error: "Medication not found" });
    }

    // Ensure the user has a medications array
    if (!user.assignedMedications) {
      user.assignedMedications = []; // Initialize the array if it doesn't exist
    }

    // Assign the medication to the user
    user.assignedMedications.push(medication); // Use .push() for adding the medication
    await user.save();

    res.json({ message: "Medication assigned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/assigned/:medicationId", requireAuth, async (req, res) => {
  try {
    const user = req.user; // Get the logged-in user
    const { medicationId } = req.params;

    // Check if the medication exists and is assigned to the user
    if (!user.assignedMedications.includes(medicationId)) {
      return res
        .status(404)
        .json({ error: "Medication not found or not assigned to the user." });
    }

    // Remove the medication from the user's assignedMedications array
    user.assignedMedications.pull(medicationId);
    await user.save();

    res.json({ message: "Medication removed from the user." });
  } catch (error) {
    console.error("Error removing medication from user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
