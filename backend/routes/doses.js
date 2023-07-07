const express = require("express");
const router = express.Router();
const Dose = require("../models/doseModel");
const { 
  createDose,
  getDoses,
  getDose
 } = require('../controllers/doseController');

// Get all doses
router.get("/", getDoses);

// Get single dose
router.get("/:id", getDose);

// Post a dose
router.post("/", createDose)

// Delete a dose
router.delete("/:id", (req, res) => {
  res.json({ mssg: "DELETE a single dose." });
});

// Update a dose
router.patch("/:id", (req, res) => {
  res.json({ mssg: "PATCH a single dose." });
});

module.exports = router;
