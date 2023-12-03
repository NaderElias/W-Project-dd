const workFlowModel =require ("../Models/workFlowModel");


const automationController = {
    getWorkflow: async (req, res) => {
        try {
            const {issueType, subCategory} = req.body;
            if(!issueType || !subCategory){
                return res.status(400).json({ message: "Invalid credentials" });
            }
            const workFlow = await workFlowModel.find({issueType : issueType, subCategory : subCategory});
            res.status(200).json({workFlow});
        } catch (error) {
            console.error("Error in automationController.getWorkflow: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
module.exports = automationController;

