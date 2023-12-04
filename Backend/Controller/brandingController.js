const brandModel = require("../Models/brandModel");

const brandingController = {
  getCustomization: async (req, res) => {
    try {
      const { brand } = req.body;
      if (!brand) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const customization = await brandModel.find({ brand: brand });
      console.log("customization|| " + customization);
      res.status(200).json({ customization });
    } catch (error) {
      console.error("Error in brandingController.getCustomization: ", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  createCustomization: async (req, res) => {
    try {
      const { brand, color } = req.body;

      if (!brand || !color) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const customization = await brandModel.findOne({ brand: brand });
      if (customization) {
        return res.status(400).json({ message: "brand Already Exists" });
      }

      const newCustomization = new brandModel({
        brand,
        color,
      });

      await newCustomization.save();

      res.status(201).json({
        message: "Customization created successfully",
        brand: newCustomization,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "server error" });
    }
  },

  updateCustomization: async (req, res) => {
    try {
      const { _id, color } = req.body;
      if (!_id || !color) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      if (_id.length !== 24) {
        return res.status(400).json({ message: "Invalid id" });
      }
      const customization = await brandModel.findById(_id);
      if (!customization) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      customization.color = color;
      await customization.save();
      res
        .status(200)
        .json({ message: "Customization updated successfully", customization });
    } catch (error) {
      console.error("Error in brandingController.updateCustomization: ", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
module.exports = brandingController;
