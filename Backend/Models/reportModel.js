const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
    managerId: {
        type: Object,
        required: true
      },
      ticketId: {
        type: Object,
        required: true
      },
      ticketStatus: {
        type: String,
        enum: ["open", "in progress", "closed"],
        required: true
      },
      resolutionTime: {
        type: String,
      },
      agentPerformance: {
        type: String,
        required: true
      }
});

module.exports = mongoose.model("reportModel", reportSchema);
module.exports.Schema = reportSchema;