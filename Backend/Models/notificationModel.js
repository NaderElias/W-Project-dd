const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  agentId: {
    type: Object,
    required: true,
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
