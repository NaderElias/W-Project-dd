const mongoose = require("mongoose");

const workFlowSchema = mongoose.Schema({
    issueType: {
        type: String,
		enum: ["software", "hardware", "network"],
		required: true,
      },
    subCategory: {
		type: String,
		enum: [
			"Desktops",
			"Laptops",
			"Printers",
			"Servers",
			"Networking equipment",
			"Operating system",
			"Application software",
			"Custom software",
			"Integration issues",
			"Email issues",
			"Internet connection problems",
			"Website errors",
		],
	},
      workflow: [String]
});

module.exports = mongoose.model("workFlowModel", workFlowSchema);
module.exports.Schema = workFlowSchema;
