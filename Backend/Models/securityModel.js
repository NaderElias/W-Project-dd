const mongoose = require("mongoose");

const securitySchema = mongoose.Schema({
    encryptionKey: {
        type: String,
        required: true
      },
      backupFrequency: {
        type: String,
        required: true
      },
      backupRetention: {
        type: Number,
        required: true
      }
});

module.exports = mongoose.model("securityModel", securitySchema);
module.exports.Schema = securitySchema;