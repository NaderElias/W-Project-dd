const chatModel = require("../Models/chatModel");
const userModel = require("../Models/userModel");
const notificationModel = require("../Models/notificationModel");
const chatsController = {
  createChat: async (req, res) => {
    try {
      const { userID, agentId } = req.body;
      let selectedAgentID = agentId;

      if (!agentId) {
        const agents = await userModel.find({ role: "agent" });
        const notification = await notificationModel.find();
        const notifiedAgentIds = notification.map((notification) =>
          notification.agentId.toString()
        );

        const availableAgents = agents.filter(
          (agent) => !notifiedAgentIds.includes(agent._id.toString())
        );

        if (availableAgents.length === 0) {
          return res.status(400).json({ message: "No available agents" });
        }

        const randomIndex = Math.floor(Math.random() * availableAgents.length);
        selectedAgentID = availableAgents[randomIndex]._id;
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
      const { agentId, message, chatId } = req.body;
      const notification = await notificationModel.findOne({
        agentId: agentId,
        message: message,
        chatId: chatId,
      });

      if (notification) {
        return res.status(400).json({ message: "Notification already exists" });
      }
      const newNotification = new notificationModel({
        agentId,
        message,
        chatId,
      });

      await newNotification.save();
      res.status(200).json({ message: "Notification created successfully" });
    } catch (error) {
      console.error("Error in chatsController.createNotification: ", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  getNotification: async (req, res) => {
    try {
      const { agentId } = req.query;
      const notification = await notificationModel.find({
        agentId: agentId,
      });
      if (!notification) {
        return res.status(400).json({ message: "No notification found" });
      }
      res.status(200).json({ notification: notification });
    } catch (error) {
      console.error("Error in chatsController.getNotification: ", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  deleteNotification: async (req, res) => {
    try {
      const { _id } = req.query;
      const notification = await notificationModel.findById(_id);
      if (!notification) {
        return res.status(400).json({ message: "No notification found" });
      }
      await notificationModel.findByIdAndDelete(_id);
      res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.error("Error in chatsController.deleteNotification: ", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
module.exports = chatsController;
