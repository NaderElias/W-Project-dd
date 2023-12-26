const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
    managerId: {
        type: String,
        required: true
      }, 
      ticketId: {
        type: String,
        required: true
      },
      ticketTitle: {
        type: String,
        required: true,
      },
      ticketStatus: {
        type: String,
        enum: ["open", "in progress", "closed"],
        required: true
      },
      resolutionTime: {
        type: Date,
      },
      agentPerformance: {
        type: String,
        required: true
      }
});

module.exports = mongoose.model("reportModel", reportSchema);
module.exports.Schema = reportSchema;