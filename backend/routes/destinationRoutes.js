const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');


// GET all destinations
router.get('/', async (req, res) => {
  try {

    const destinations = await Destination.find();

    res.json({
      success: true,
      data: destinations
    });

  } catch (err) {

    console.error("Fetch destinations error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
});


// CREATE destination
router.post('/', async (req, res) => {

  try {

    const { name, country, description } = req.body;

    if (!name || !country || !description) {
      return res.status(400).json({
        success: false,
        message: "Name, country and description are required"
      });
    }

    const newDestination = await Destination.create({
      name,
      country,
      description
    });

    res.status(201).json({
      success: true,
      data: newDestination
    });

  } catch (err) {

    console.error("Create destination error:", err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

module.exports = router;