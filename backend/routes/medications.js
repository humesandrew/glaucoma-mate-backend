const express = require('express');
const router = express.Router();
const { assignMedicationToUser } = require('../controllers/medicationController'); // Import the corresponding controller function

// Assign a medication to a user
router.post('/assign', assignMedicationToUser);

module.exports = router;
