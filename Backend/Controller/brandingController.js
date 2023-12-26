const brandModel = require("../Models/brandModel");

const brandingController = {
	getAllCustomization: async (req, res) => {
		try {
			const brands = await brandModel.find({});
			res.status(200).json({ brands });
		} catch (error) {
			console.error("Error in brandingController.getCustomization: ", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	},

	getBrand: async (req, res) => {
		try {
			brand = await brandModel.findOne({ selected: true });
			if (brand) {
				res.status(200).json({ brand });
			}else {
        res.status(404).json({message: "no brand found"});
      }
		} catch (error) {
			console.error("Error in brandingController.getCustomization: ", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	},

	createCustomization: async (req, res) => {
		try {
			const { name, colorTheme, color1, color2 } = req.body;

			if (!name || !colorTheme || !color1 || !color2) {
				return res.status(400).json({ message: "Invalid credentials" });
			}
			const customization = await brandModel.findOne({ name: name });
			if (customization) {
				return res.status(400).json({ message: "brand Already Exists" });
			}
			const buttonColors = { color1, color2 };
			const newCustomization = new brandModel({
				name,
				colorTheme,
				buttonColors,
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
			const { _id } = req.query;
			if (!_id) {
				return res.status(400).json({ message: "Invalid credentials" });
			}
			if (_id.length !== 24) {
				return res.status(400).json({ message: "Invalid id" });
			}
			const customization = await brandModel.findById(_id);
			if (!customization) {
				return res.status(400).json({ message: "Invalid credentials" });
			}
			const result = await brandModel.updateMany(
				{},
				{ $set: { selected: false } }
			);
			customization.selected = true;
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
