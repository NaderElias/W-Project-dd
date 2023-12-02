const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	username: {
		type: String,
		required: true,
	},
});

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ['user', 'admin','manager','agent'], 
		default: 'user',
		required: true,
	},
	profile: {
    type: profileSchema,
    required: true,
  },
});

module.exports = mongoose.model('userModel', userSchema);
module.exports.Schema = userSchema;
