const Dose = require('../models/doseModel');
const mongoose = require('mongoose');
// Function for getting all doses
const getDoses = async (req, res) => {
  const doses = await Dose.find().sort({ _id: -1 });
  res.status(200).json(doses);
}

// Function for getting a single dose
const getDose = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: "No valid id found."})
  }
  const dose = await Dose.findById(id);
  
  if (!dose) {
    return res.status(404).json({ error: "No such dose" });
  }
  
  res.status(200).json(dose);
}

// Function for creating a new dose
const createDose = async (req, res) => {
  const { name, dose, capColor } = req.body;
  
  try {
    const createdDose = await Dose.create({ name, dose, capColor });
    res.status(200).json(createdDose);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createDose,
  getDoses,
  getDose
}
