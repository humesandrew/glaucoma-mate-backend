const express = require("express");
const router = express.Router();
const Dose = require("../models/doseModel");
const { 
  createDose,
  getDoses,
  getDose
 } = require('../controllers/doseController');
 const requireAuth = require('../middleware/requireAuth.js');
router.use(requireAuth);
// Get all doses
// require Auth for all doses routes //
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
