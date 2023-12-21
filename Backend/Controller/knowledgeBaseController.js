const knowledgeBaseModel = require("../Models/knowledgeBaseModel");

const knowledgeBaseController = {
	getKnowledgeBase: async (req, res) => {
		try {
			const { search } = req.body;
      let FAQs;
			if (!search) {
				FAQs = await knowledgeBaseModel.find({});
			} else {
				FAQs = await knowledgeBaseModel.find({
					$or: [
						{ title: { $regex: search, $options: "i" } },
						{ content: { $regex: search, $options: "i" } },
					],
				});
			}
			return res.status(200).json({FAQs: FAQs});
		} catch (error) {
			console.error("Error in knowldegeBaseController", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	},
};
module.exports = knowledgeBaseController;
