const mongoose = require("mongoose");

const workFlowSchema = mongoose.Schema({
    issueType: {
        type: String,
        required: true
      },
      workflow: [String]
});

module.exports = mongoose.model("workFlowModel", workFlowSchema);
module.exports.Schema = workFlowSchema;