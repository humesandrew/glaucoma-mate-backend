const mongoose = require("mongoose");
const Medication = require("./models/medicationModel");
const User = require("./models/userModel");

const seedMedications = async () => {
  const commonMedications = [
    {
      name: "Latanoprost",
      brand: "Xalatan",
      dosage: 1,
      sig: "One drop every night at bedtime.",
      capColor: "#00b3b3",
    },
    {
      name: "Bimatoprost",
      brand: "Lumigan",
      dosage: 1,
      sig: "One drop every night at bedtime.",
      capColor: "#00b3b3",
    },
    {
      name: "Travoprost",
      brand: "Travatan",
      dosage: 1,
      sig: "One drop every night at bedtime.",
      capColor: "#00b3b3",
    },
    {
      name: "Tafluprost",
      brand: "Zioptan",
      dosage: 1,
      sig: "One drop every night at bedtime.",
      capColor: "#00b3b3",
    },
    {
      name: "Vyzulta",
      brand: "Latanoprostene bunod",
      dosage: 1,
      sig: "One drop every night at bedtime.",
      capColor: "#00b3b3",
    },

    {
      name: "Timolol",
      brand: "Timoptic or Istalol",
      dosage: 2,
      sig: "One drop two times per day.",
      capColor: "#ffff1a",
    },
    {
      name: "Dorzolamide/Timolol",
      brand: "CoSopt",
      dosage: 2,
      sig: "One drop two times per day.",
      capColor: "#4d4dff",
    },
    {
      name: "Brimonidine/Timolol",
      brand: "Combigan",
      dosage: 2,
      sig: "One drop two times per day.",
      capColor: "#4d4dff",
    },

    {
      name: "Dorzolamide",
      brand: "Trusopt",
      dosage: 2,
      sig: "One drop two times per day.",
      capColor: "orange",
    },
    {
      name: "Brinzolamide",
      brand: "Azopt",
      dosage: 2,
      sig: "One drop two times per day.",
      capColor: "orange",
    },
    {
      name: "Brimonidine",
      brand: "Alphagan",
      dosage: 2,
      sig: "One drop two times per day.",
      capColor: "#cc33ff",
    },
    {
      name: "Rocklatan",
      brand: "Netarsudil/latanoprost",
      dosage: 1,
      sig: "One drop every night at bedtime.",
      capColor: "white",
    },
    {
      name: "Simbrinza",
      brand: "Brinzolamide/brimonidine",
      dosage: 3,
      sig: "One drop three times per day.",
      capColor: "white",
    },
  ];

  try {
    // Connect to your MongoDB database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Retrieve existing medications
    const existingMedications = await Medication.find();

    if (existingMedications.length === 0) {
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
      // Data already exists, update medications if necessary
      commonMedications.forEach(async (newMedication) => {
        const existingMedication = existingMedications.find(
          (m) => m.name === newMedication.name
        );

        if (existingMedication) {
          // Update existing medication details
          existingMedication.dosage = newMedication.dosage;
          existingMedication.sig = newMedication.sig;
          existingMedication.capColor = newMedication.capColor;

          await existingMedication.save();
          console.log(`Updated medication: ${existingMedication.name}`);
        } else {
          // Medication doesn't exist, insert it
          const user = await User.findOne();
          if (!user) {
            throw new Error("No user found. Please create a user first.");
          }

          const medicationToInsert = {
            ...newMedication,
            user: user._id,
          };

          await Medication.create(medicationToInsert);
          console.log(`Inserted new medication: ${medicationToInsert.name}`);
        }
      });

      console.log("Medications updated successfully!");
    }
  } catch (error) {
    console.error("Error seeding/updating medications:", error);
  }
};

module.exports = seedMedications;
