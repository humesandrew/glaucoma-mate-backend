const express = require("express");
const router = express.Router();

// Get all prescriptions
router.get("/", (req, res) => {
  res.json({ mssg: "GET all prescriptions." });
});

// Get single prescription
router.get("/:id", (req, res) => {
  res.json({ mssg: "GET a single prescription." });
});

// Post a prescription
router.post("/", (req, res) => {
  res.json({ mssg: "POST a single prescription." });
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
