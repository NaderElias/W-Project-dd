const reportModel = require("../Models/reportModel");
const sessionModel = require("../Models/sessionModel");
const ticketsModel = require("../Models/ticketModel");
const knowledgeBaseModel = require("../Models/knowledgeBaseModel");
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
				const particReport = await reportModel.findOne({ticketId:bod.ticketId});
				console.log(particReport);
				if(!particReport){return res.status(404).json({message: 'no report exists for thid ticket'})}
				//console.log(particReport.managerId)
				console.log("particular");
				return res.status(200).json({ reportsAnalytics : particReport });
			}
			else {
				const allReports = await reportModel.find();
				if(!allReports){console.log("no db");return res.status(404).json({message: 'no reports in the database'})}
				//console.log(allReports.managerId)
				console.log("all found");
				return res.status(200).json({ reportsAnalytics : allReports });
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
	},

	getAnalytics: async(req,res)=>{
		try{
			const body= req.body;
			const issue = await ticketsModel.aggregate([
				{
				  $group: { 
					_id: '$category', // Group by the 'issue' column
					count: { $sum: 1 } // Count occurrences of each issue
				  }
				},
				{
				  $sort: { count: -1 } // Sort in descending order based on the count
				},
				{
				  $limit: 5 // You can adjust this limit based on how many top issues you want
				}
			  ]);
			  const total = await (async () => await ticketsModel.countDocuments({}))();
			  const statusPercent = await ticketsModel.aggregate([
				{
				  $group: {
					_id: '$status',
					count: { $sum: 1 }
				  }
				},
				{
				  $project: {
					_id: 0,
					status: '$_id',
					percentage: { $multiply: [{ $divide: ['$count', total] }, 100] }
				  }
				}
			  ]);
				const statusPercentfilter = await ticketsModel.aggregate([
					{
					  $match: { $or: [{ status: 'open' }, { status: 'in progress' }] } // Filter by open or in progress status
					},
					{
					  $group: {
						_id: { status: '$status', category: '$category' },
						count: { $sum: 1 }
					  }
					},
					{
					  $project: {
						_id: 0,
						status: '$_id.status',
						category: '$_id.category',
						percentage: { $multiply: [{ $divide: ['$count', total] }, 100] }
					  }
					},
					{
					  $sort: { category: 1 } // Sort by category in ascending order
					}
				  ]);
				  const relation = await ticketsModel.aggregate([
					{
					  $match: { $or: [{ status: 'open' }, { status: 'in progress' }] } // Filter by open or in progress status
					},
					{
					  $group: {
						_id: { status: '$status', category: '$category', priority: '$priority' },
						count: { $sum: 1 }
					  }
					},
					{
					  $project: {
						_id: 0,
						status: '$_id.status',
						category: '$_id.category',
						priority: '$_id.priority',
						percentage: { $multiply: [{ $divide: ['$count', total] }, 100] }
					  }
					},
					{
					  $sort: { category: 1, priority: 1 } // Sort by category and priority in ascending order
					}
				  ]);
			  res
			  .status(200)
			  .json({message:'meh',issue:issue,statusPercent:statusPercent,statusPercentfilter:statusPercentfilter,relation:relation})
			  console.log(issue);
		}
		catch (error){
			console.error(error);
			res.status(500).json({ message: "server error" });
		}
	}
};

module.exports = reportController;