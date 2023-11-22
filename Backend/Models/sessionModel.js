const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
	userID: {
		type: Object,
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
	timeStamps: {
		createdAt: {
			type: Date,
			default: { $$NOW: true },
		},
		expiredAt: {
			type: Date,
			required: true,
		},
	},
});

module.exports = mongoose.model('sessionsModel', sessionSchema);
module.exports.Schema = sessionSchema;