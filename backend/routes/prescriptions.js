const express = require("express");
const router = express.Router();
const Prescription = require("../models/prescriptionModel");

// Get all prescriptions
router.get("/", (req, res) => {
  res.json({ mssg: "GET all prescriptions." });
});

// Get single prescription
router.get("/:id", (req, res) => {
  res.json({ mssg: "GET a single prescription." });
});

// Post a prescription
router.post("/", async (req, res) => {
  const {name, dose, capColor} = req.body;
  try {
    const prescription = await Prescription.create({ name, dose, capColor });
    res.status(200).json(prescription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a prescription
router.delete("/:id", (req, res) => {
  res.json({ mssg: "DELETE a single prescription." });
});

// Update a prescription
router.patch("/:id", (req, res) => {
  res.json({ mssg: "PATCH a single prescription." });
});

module.exports = router;
