const knowledgeBaseModel = require("../Models/knowledgeBaseModel");

const knowledgeBaseController = {
	getKnowledgeBase: async (req, res) => {
		try {
			FAQs = await knowledgeBaseModel.find({});
			return res.status(200).json({ FAQs: FAQs });
		} catch (error) {
			console.error("Error in knowldegeBaseController", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	},
};
module.exports = knowledgeBaseController;
