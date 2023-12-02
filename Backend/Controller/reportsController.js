const reportModel = require("../Models/reportModel");
const sessionModel = require("../Models/sessionModel");
const reportController = {
    createReport: async (req, res) => {

		try {
			// Extract report data from the request body
			const { ticketId, ticketStatus, resolutionTime, agentPerformance } = req.body;
			const targetToken = req.cookies.accessToken;
			const session = await sessionModel.findOne({ token: targetToken }).select('userID');
			const managerId = session.userID;
			// Create a new report
			const newReport = new reportModel({
                managerId,
                ticketId, 
                ticketStatus, 
                resolutionTime, 
                agentPerformance
			});
			//check if the report already exists
            const existingReport = await reportModel.findOne({ ticketId: ticketId });
			if (existingReport) {
				return res.status(400).json({ message: "report already exists" });
			}
			// Save the report to the database
			await newReport.save();
            
            	res
				.status(201)
				.json({ message: "Report created successfully", report: newReport });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "server error" });
		}
	},

	getAllReports: async (req, res) => {
		try {
			//getting all reports and outputting them
			const bod= req.body;
			console.log(bod.ticketId);
			if (bod.ticketId) {
				const particReport = await reportModel.find({ticketId:bod.ticketId});
				if(!particReport.ticketId){console.log("1");res.status(404).json({message: 'no report exists for thid ticket'})}
				//console.log(particReport.managerId)
				console.log("particular");
				res.status(200).json({ reportsAnalytics : particReport });
			}
			else {
				const allReports = await reportModel.find();
				if(!allReports){console.log("no db");res.status(404).json({message: 'no reports in the database'})}
				//console.log(allReports.managerId)
				console.log("all found");
				res.status(200).json({ reportsAnalytics : allReports });
			}
			
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "server error" });
		}
	},

	updateReport: async (req, res) => {
		try {
			// Extract report data from the request body
			const {ticketId, ticketStatus, resolutionTime,agentPerformance } = req.body;
			const report = await reportModel.findOne({ ticketId: ticketId });
			// Update the report

			report.ticketStatus = ticketStatus;
			report.resolutionTime = resolutionTime;
			report.agentPerformance = agentPerformance;

			//check if the report exists
			if(!report.ticketId){
				res
				.status(404)
				.json({ message: "report does not exist"});}
			// check if the current manager is the same one that created it and if it caan be others should i update the managerID
			//
			// Save the updated report to the database
			await report.save();
			res
				.status(200)
				.json({ message: "report updated successfully", report: report });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "server error" });
		}
	}
};

module.exports = reportController;