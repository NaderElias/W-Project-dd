const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
	ticketId: {
		type: Object,
		required: true,
	},
	senderId: {
		type: Object,
		required: true,
	},
	receiverId: {
		type: Object,
		required: true,
	},
	chat: [messageSchema],
});

const messageSchema = mongoose.Schema({
	senderId: {
		type: Object,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	securityId: {
		type: Object,
	},
	timestamp: {
		type: Date,
		default: { $$NOW: true },
	},
});

module.exports = mongoose.model("chatModel", chatSchema);
module.exports.Schema = chatSchema;
