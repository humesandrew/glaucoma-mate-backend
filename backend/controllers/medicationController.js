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

    // // Assign the medication to the user
    // user.medications.push(medication);
    // await user.save();
    console.log('User Medications Before:', user.medications);
    console.log('Medication to Add:', medication);
    
    // Example of checking if the medication is already assigned before adding it
if (!user.medications.some((assignedMed) => assignedMed.equals(medication._id))) {
  user.medications.push(medication);
  await user.save();
}

console.log('User medications after:', user.medications);




    res.json({ message: 'Medication assigned to user successfully.' });
  } catch (error) {
    console.error('Error assigning medication to user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  assignMedicationToUser,
};
