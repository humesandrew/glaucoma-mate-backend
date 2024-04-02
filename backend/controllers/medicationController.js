const Medication = require("../models/medicationModel");
const User = require("../models/userModel");

const assignMedicationToUser = async (req, res) => {
  try {
    console.log("Entered assignMedicationToUser route");
    const { userId, medicationId } = req.body;
    console.log("Request Body:", req.body);

    // Since we're using Firebase user IDs, skip MongoDB ObjectID format validation
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //   return res.status(400).json({ error: "Invalid userId format" });
    // }

    // Fetch the user by Firebase UID instead of MongoDB ObjectID
    const user = await User.findOne({ firebaseUid: userId }); // Adjust this line based on your User model's actual field name
    if (!user) {
      console.error("User not found with ID:", userId);
      return res.status(404).json({ error: "User not found." });
    }
    console.log("User found in controller:", user);

    const medication = await Medication.findById(medicationId);
    if (!medication) {
      console.error("Medication not found with ID:", medicationId);
      return res.status(404).json({ error: "Medication not found." });
    }
    console.log("Medication found in controller:", medication);

    // Check if the medication is already assigned to the user
    const isMedicationAssigned = user.assignedMedications.some(med => med.equals(medication._id));
    if (!isMedicationAssigned) {
      user.assignedMedications.push(medication._id); // Assuming assignedMedications holds medication IDs
      await user.save();
      console.log("Medication assigned to user successfully.");
      res.json({ message: "Medication assigned to user successfully." });
    } else {
      console.log("Medication already assigned to this user.");
      res.status(409).json({ error: "Medication already assigned to this user." });
    }
  } catch (error) {
    console.error("Error assigning medication to user:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = {
  assignMedicationToUser,
};
