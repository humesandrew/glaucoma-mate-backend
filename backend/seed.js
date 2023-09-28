const mongoose = require('mongoose');
const Medication = require('./models/medicationModel');


const seedMedications = async () => {
    const commonMedications = [
      { name: 'Medication 1', dosage: 5, sig: 'Description 1', capColor: 'teal' },
      { name: 'Medication 2', dosage: 10, sig: 'Description 2', capColor: 'blue' },
      // Add more medications as needed
    ];
  
    try {
      // Connect to your MongoDB database
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      // Clear existing medications (optional)
      await Medication.deleteMany();
  
      // Insert new medications
      await Medication.insertMany(commonMedications);
  
      console.log('Medications seeded successfully!');
    } catch (error) {
      console.error('Error seeding medications:', error);
    } finally {
      // Disconnect from the database
      await mongoose.disconnect();
    }
  };
  
  module.exports = seedMedications;