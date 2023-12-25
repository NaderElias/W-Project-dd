const workFlowModel =require ("../Models/workFlowModel");


const automationController = {
    getWorkflow: async (req, res) => {
        try {
            const {issueType, subCategory} = req.query;
            console.log(`${issueType}|||${subCategory}`)
            if(!issueType || !subCategory){
                return res.status(400).json({ message: "Invalid credentials" });
            }
            const workFlow = await workFlowModel.findOne({issueType : issueType, subCategory : subCategory});
            res.status(200).json({message: "returned workflow",workFlow: workFlow});
        } catch (error) {
            console.error("Error in automationController.getWorkflow: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
module.exports = automationController;

