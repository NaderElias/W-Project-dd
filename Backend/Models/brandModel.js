const mongoose = require("mongoose");

const brandSchema = mongoose.Schema({
    brand: {
        type: String,
        required: true
      },
      colors: {
        type: String,
        required: true
      }
});

module.exports = mongoose.model("brandModel", brandSchema);
module.exports.Schema = brandSchema;