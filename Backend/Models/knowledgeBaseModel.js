const mongoose = require("mongoose");

const knowledgeBaseSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
      },
      issue: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      }
});

module.exports = mongoose.model("knowledgeBaseModel", knowledgeBaseSchema);
module.exports.Schema = knowledgeBaseSchema;