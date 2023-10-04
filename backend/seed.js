const mongoose = require("mongoose");
const Medication = require("./models/medicationModel");

const seedMedications = async () => {
  const commonMedications = [
    {
      name: "Latanoprost",
      dosage: 1,
      sig: "Instill 1 drop every night at bedtime.",
      capColor: "teal",
    },
    {
      name: "CoSopt",
      dosage: 2,
      sig: "Instill 1 drop 2 times every day.",
      capColor: "blue",
    },
    {
      name: "Timolol",
      dosage: 2,
      sig: "Instill 1 drop 2 times every day.",
      capColor: "yellow",
    },
    {
      name: "Dorzolamide",
      dosage: 2,
      sig: "Instill 1 drop 2 every day.",
      capColor: "purple",
    },

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

    console.log("Medications seeded successfully!");
  } catch (error) {
    console.error("Error seeding medications:", error);
  } finally {

  }
};

module.exports = seedMedications;



