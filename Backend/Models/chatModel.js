const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  senderId: {
    type: Object,
    required: true,
  },
  senderUsername: {
    type: String,
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
    default: Date.now,
  },
});
const chatSchema = mongoose.Schema({
  ticketId: {
    type: Object,
  },
  userID: {
    type: Object,
    required: true,
  },
  agentId: {
    type: Object,
    required: true,
  },
  chat: [messageSchema],
});

module.exports = mongoose.model("chatModel", chatSchema);
module.exports.Schema = chatSchema;
