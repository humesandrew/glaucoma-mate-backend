const express = require("express");
const router = express.Router();
const Dose = require("../models/doseModel");

// Get all doses
router.get("/", (req, res) => {
  res.json({ mssg: "GET all doses." });
});

// Get single dose
router.get("/:id", (req, res) => {
  res.json({ mssg: "GET a single dose." });
});

// Post a dose
router.post("/", async (req, res) => {
  const {name, dose, capColor} = req.body;
  try {
    const dose = await Dose.create({ name, dose, capColor });
    res.status(200).json(dose);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a dose
router.delete("/:id", (req, res) => {
  res.json({ mssg: "DELETE a single dose." });
});

// Update a dose
router.patch("/:id", (req, res) => {
  res.json({ mssg: "PATCH a single dose." });
});

module.exports = router;
