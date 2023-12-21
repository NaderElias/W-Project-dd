const chatModel = require("../Models/chatModel");
const userModel = require("../Models/userModel");
const notificationModel = require("../Models/notificationModel");
const chatsController = {
  createChat: async (req, res) => {
    try {
      const { userID, agentId } = req.body;
      let selectedAgentID = agentId;
      if (!agentId) {
        const users = await userModel.find({ role: "agent" });
        const randomIndex = Math.floor(Math.random() * users.length);
        selectedAgentID = users[randomIndex]._id;
      }
      const newChat = new chatModel({
        userID,
        agentId: selectedAgentID,
      });
      await newChat.save();
      res.status(200).json({
        message: "Chat created successfully",
        newChat: newChat,
      });
    } catch (error) {
      console.error("Error in chatsController.createChat: ", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  addMessage: async (req, res) => {
    try {
      const { chatID, message } = req.body;
      const chat = await chatModel.findById(chatID);
      chat.chat.push(message);
      await chat.save();
      res.status(200).json({ message: "Message added successfully" });
    } catch (error) {
      console.error("Error in chatsController.addMessage: ", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getMessage: async (req, res) => {
    try {
      const { chatID } = req.query;
      const chat = await chatModel.findById(chatID);
      res.status(200).json({ chat });
    } catch (error) {
      console.error("Error in chatsController.getMessage: ", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  createNotification: async (req, res) => {
    try {
      const { agentId, message } = req.body;
      const notification = await notificationModel.findOne({
        agentId: agentId,
        message: message,
      });

      if (notification) {
        return res.status(400).json({ message: "Notification already exists" });
      }
      const newNotification = new notificationModel({
        agentId,
        message,
      });

      await newNotification.save();
      res.status(200).json({ message: "Notification created successfully" });
    } catch (error) {
      console.error("Error in chatsController.createNotification: ", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
module.exports = chatsController;
