const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Dose = require("../models/doseModel");
const { 
  createDose,
  getDoses,
  getDose
 } = require('../controllers/doseController');
 const requireAuth = require('../middleware/requireAuth.js');
 
 // require Auth for all doses routes //
router.use(requireAuth);
// Get all doses

router.get("/", getDoses);

// Get single dose
router.get("/:id", getDose);

// Post a dose
router.post("/", createDose)


// Delete a dose
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the provided ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Dose ID" });
    }

    // Find and delete the dose
    const deletedDose = await Dose.findByIdAndDelete(id);

    // If the dose was not found
    if (!deletedDose) {
      return res.status(404).json({ error: "Dose not found" });
    }

    res.status(200).json({ message: "Dose deleted successfully", deletedDose });
  } catch (error) {
    console.error(error);  // Log the error for debugging purposes
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Update a dose
router.patch("/:id", (req, res) => {
  res.json({ mssg: "PATCH a single dose." });
});

module.exports = router;
