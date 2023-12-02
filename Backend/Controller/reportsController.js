const reportModel = require("../Models/reportModel");
//const sessionModel = require("../Models/sessionModel");
const reportController = {
    createReport: async (req, res) => {

		try {
			// Extract report data from the request body
			const {managerId, ticketId, ticketStatus, resolutionTime, agentPerformance } = req.body;
            //const managerid = await sessionModel.findOne({ userID: user._id });
			// Create a new report
			const newReport = new reportModel({
                managerId,
                ticketId, 
                ticketStatus, 
                resolutionTime, 
                agentPerformance
			});
            
			// Save the report to the database
			await newReport.save();
            //console.log(managerid)
            
            	res
				.status(201)
				.json({ message: "Report created successfully", report: newReport });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "server error" });
		}
	}
};

module.exports = reportController;