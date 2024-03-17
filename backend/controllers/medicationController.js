const Medication = require("../models/medicationModel");
const User = require("../models/userModel");
const mongoose = require('mongoose');

const assignMedicationToUser = async (req, res) => {
  try {
    console.log("Entered assignMedicationToUser route");
    const { userId, medicationId } = req.body;
    console.log("Request Body:", req.body);
    
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // Fetch the user and medication
    const user = await User.findById(userId); // Update the query to use findById
    const medication = await Medication.findById(medicationId);

    if (!user || !medication) {
      return res.status(404).json({ error: "User or Medication not found." });
    }

    // Assign the medication to the user
    console.log("User Medications Before:", user.assignedMedications);
    console.log("Medication to Add:", medication);

    // Example of checking if the medication is already assigned before adding it
    if (
      !user.assignedMedications.some((assignedMed) =>
        assignedMed.equals(medication._id)
      )
    ) {
      user.assignedMedications.push(medication);
      await user.save();
    }

    console.log("User medications after:", user.assignedMedications);

    res.json({ message: "Medication assigned to user successfully." });
  } catch (error) {
    console.error("Error assigning medication to user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  assignMedicationToUser,
};
