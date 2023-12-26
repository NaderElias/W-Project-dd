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
  encryption: {
    encryptionKey: {
      type: String,
      required: true,
    },
    IV: {
      type: String,
      required: true,
    },
  },
  chat: [messageSchema],
});

module.exports = mongoose.model("chatModel", chatSchema);
module.exports.Schema = chatSchema;
