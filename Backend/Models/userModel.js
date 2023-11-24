const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	salt: {
		type: String,
	        required: true,
	},
	role: {
		type: String,
		enum: ["admin", "user", "agent", "manager"],
		default: "user",
		required: true,
	},
	profile: {
    type: profileSchema,
    required: true,
  },
});

const profileSchema = new mongoose.Schema({
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	email: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('userModel', userSchema);
module.exports.Schema = userSchema;
