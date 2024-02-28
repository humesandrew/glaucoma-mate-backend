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
      name: "Bimatoprost",
      dosage: 2,
      sig: "Instill 1 drop every night at bedtime.",
      capColor: "teal",
    },
    {
      name: "Timolol",
      dosage: 2,
      sig: "Instill 1 drop 2 times every day.",
      capColor: "yellow",
    },
    {
      name: "Dorzolamide/Timolol",
      dosage: 2,
      sig: "Instill 1 drop 2 times every day.",
      capColor: "blue",
    },
    {
      name: "Combigan",
      dosage: 2,
      sig: "Instill 1 drop 2 times every day.",
      capColor: "blue",
    },

    {
      name: "Dorzolamide",
      dosage: 2,
      sig: "Instill 1 drop 2 times every day.",
      capColor: "orange",
    },
    {
      name: "Brimonidine",
      dosage: 2,
      sig: "Instill 1 drop 2 times every day.",
      capColor: "purple",
    },
    {
      name: "Alphagan",
      dosage: 2,
      sig: "Instill 1 drop 2 times every day.",
      capColor: "purple",
    },
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
      const user = await User.findOne();

      // If there's no user, handle this case appropriately
      if (!user) {
        throw new Error("No user found. Please create a user first.");
      }

      // Map commonMedications to include the user reference
      const commonMedicationsWithUser = commonMedications.map((medication) => ({
        ...medication,
        user: user._id, // Assign the user ID
      }));

      await Medication.insertMany(commonMedicationsWithUser);

      console.log("Medications seeded successfully!");
    } else {
      console.log("Data already exists. No need to seed.");
    }
  } catch (error) {
    console.error("Error seeding medications:", error);
  }
};

module.exports = seedMedications;


