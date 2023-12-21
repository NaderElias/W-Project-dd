const knowledgeBaseModel = require("../Models/knowledgeBaseModel");

const knowledgeBaseController = {
    getKnowledgeBase : async (req, res) =>{
        try {
            const articles = await KnowledgeBase.find();
            res.json(articles);
          } catch (error) {
            console.error("Error in knowldegeBaseController", error);
            res.status(500).json({ message: "Internal Server Error" });
          }
    }
}
module.exports = knowledgeBaseController;