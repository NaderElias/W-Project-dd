const chatModel = require("../Models/chatModel");

const chatsController = {
  createChat: async (req, res) => {
    try {
      const { userID, agentID } = req.body;
      const newChat = new chatModel({
        userID,
        agentID,
      });
      await newChat.save();
      res.status(201).json({ message: "Chat created successfully" });
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
};
module.exports = chatsController;
