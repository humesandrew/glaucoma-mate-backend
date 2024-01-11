const mongoose = require("mongoose");
const Medication = require("./models/medicationModel");
const User = require("./models/userModel");

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

    // Check if medications already exist in the database
    const existingMedications = await Medication.countDocuments();

    if (existingMedications === 0) {
      // Data doesn't exist, so you can seed it
      // Find an existing user (you might need to adapt this based on your user creation logic)
      const user = await User.findOne();

      // If there's no user, you need to handle this case appropriately
      if (!user) {
        throw new Error("No user found. Please create a user first.");
      }

      // Map commonMedications to include the user reference
      const commonMedicationsWithUser = commonMedications.map((medication) => ({
        ...medication,
        user: user._id, // Assign the user ID
      }));

      // Insert new medications
      await Medication.insertMany(commonMedicationsWithUser);

      console.log("Medications seeded successfully!");
    } else {
      console.log('Data already exists. No need to seed.');
    }
  } catch (error) {
    console.error("Error seeding medications:", error);
  } 
};

module.exports = seedMedications;


// this is for updating //