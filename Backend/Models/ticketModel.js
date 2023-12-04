const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
	userId: {
		type: Object,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: ["open", "in progress", "closed"],
		required: true,
	},
	category: {
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
	priority: {
		type: String,
		required: true,
	},
	assignedAgentId: {
		type: Object,
		required: true,
	},
	resolutionDetails: {
		type: String,
	},
	rating: {
		type: Number,
	},
	workflow: {
		type: String,
	},
	createdAt: {
		type: Date,
		
	},
	closedAt: {
		type: Date,
	},
});

module.exports = mongoose.model("ticketModel", ticketSchema);
module.exports.Schema = ticketSchema;
