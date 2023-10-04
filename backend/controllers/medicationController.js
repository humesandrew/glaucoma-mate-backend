const Medication = require('../models/medicationModel');
const User = require('../models/userModel');

const assignMedicationToUser = async (req, res) => {
  try {
    const { userId, medicationId } = req.body;

    // Fetch the user and medication
    const user = await User.findById(userId);
    const medication = await Medication.findById(medicationId);

    if (!user || !medication) {
      return res.status(404).json({ error: 'User or Medication not found.' });
    }

    // Assign the medication to the user
    user.medications.push(medication);
    await user.save();

    res.json({ message: 'Medication assigned to user successfully.' });
  } catch (error) {
    console.error('Error assigning medication to user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  assignMedicationToUser,
};
