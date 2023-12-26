const chatModel = require("../Models/chatModel");
const userModel = require("../Models/userModel");
const notificationModel = require("../Models/notificationModel");
const nodemailer = require("nodemailer");
const emailService = require('../emailService');
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
	sendEmail: async (req, res) => {
		try {
			const { agentId, message } = req.body;
			const getemail = await userModel.findById(agentId).select("email");

			let transporter = nodemailer.createTransport({
				service: "gmail",
				auth: {
					user: "Manchekhalil69@gmail.com", // Replace with your email
					pass: "Manche2002@", // Replace with your email password
				},
			});

			// Define the email options
			let mailOptions = {
				from: "manchekhalil69@gmail.com", // Replace with your email
				to: getemail, // Replace with the recipient's email
				subject: "Test Email",
				text: "Hello, this is a test email sent from itachi!",
			};
      const html = `<p><strong>${message}</strong></p>`;

			// Send the email
			const mama =await emailService.sendEmail(mailOptions.to, mailOptions.subject, mailOptions.text, html);
			res.status(200).json({ message: "good" });
		} catch (error) {
			console.error("Error in chatsController.createNotification: ", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	},
};

module.exports = chatsController;
