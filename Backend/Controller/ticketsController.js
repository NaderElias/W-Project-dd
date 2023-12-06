const reportModel = require("../Models/ticketModel");
const sessionModel = require("../Models/sessionModel");
const ticketsModel = require("../Models/ticketModel");
const usersModel =require("../Models/userModel");
const emailService = require("../Controller/emailUpdateController");
const ticketController = {
  createTicket: async (req, res) => {
    try {
      // Extract ticket data from the request body
      const { title, description, category, subCategory } = req.body;
      const targetToken = req.cookies.accessToken;
      const session = await sessionModel
        .findOne({ token: targetToken })
        .select("userID");
      const userId = session.userID;
      const statusTick = open;
      // const priority = hmm;
      const rating = 0;
      const createdAt = new Date();
      // Create a new report
      //machine learning model ---BEWARE---
      const newTicket = new reportModel({
        userId,
        title,
        description,
        statusTick,
        category,
        subCategory,
        //these are to be decided in the algo
        // priority,
        assignedAgentId,
        rating,
        workflow,
        createdAt, //except this mf
        closedAt,
      });
      //check if the ticket already exists
      const existingTicket = await ticketsModel.findOne({
        userId: userId,
        category: category,
        subCategory,
      });
      if (existingTicket) {
        return res.status(400).json({ message: "ticket already exists" });
      }
     
      await newTicket.save();

      res
        .status(201)
        .json({ message: "ticket created successfully", report: newReport });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "server error" });
    }
  },

  getAllTickets: async (req, res) => {
    try {
      //getting all reports and outputting them
      const query = req.query;
      if (query._id) {
        const partTicket = await ticketsModel.findById(query._id); 
        if (!partTicket._id) {
          return res
            .status(404)
            .json({ message: "this ticket does not exist", query: query._id });
        }
        return res.status(200).json({ partTicket: partTicket });
      } else {
        const allTickets = await ticketsModel.find();
        if (!allTickets) {
          res.status(404).json({ message: "no tickets in the database" });
        }
        return res.status(200).json({ allTickets: allTickets });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "server error" });
    }
  },

  updateWorkflow: async (req, res) => {
    try {
      bod = req.body;
      if (!bod._id) {
        return res.status(404).json({ message: "no id provided" });
      }
      const workflow = bod.workflow;
      const updateWorkFlow = await ticketsModel.findById(bod._id);
      updateWorkFlow.workflow = workflow;
      await updateWorkFlow.save();
      //send email
      const mess='workflow updated'
      const tick = await ticketsModel.findById(bod._id);
      const us =await usersModel.findById(tick.userId);
      const em = us.email;
      const ema = emailService.sendUpdateEmail(em,mess);
      return res
        .status(200)
        .json({
          message: "update successfull",
          updateWorkFlow: updateWorkFlow,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "server error" });
    }
  },

  updateTicket: async (req, res) => {
    try {
      bod = req.body;
      var mess = 'ticket updated';
      if (!bod._id) {
        return res.status(400).json({ message: "no ticket id provided" });
      }
      const { status, resolutionDetails, rating, workflow } = req.body;
      const ticketUpdate = await ticketsModel.findById(bod._id);

      if (status&&status == "closed") {
        const closedAt = new Date();
        ticketUpdate.closedAt = closedAt; 
        mess= 'ticket updated and closed'  
      }
      if(resolutionDetails){ ticketUpdate.resolutionDetails = resolutionDetails;}
      if(rating){ticketUpdate.rating=rating;}
      if(workflow){ticketUpdate.workflow = workflow;}
      if(status){ticketUpdate.status = status;}
     
      
      await ticketUpdate.save();
      //send email
      const tick = await ticketsModel.findById(bod._id);
      const us =await usersModel.findById(tick.userId);
      const em = us.email;
      const ema = emailService.sendUpdateEmail(em,mess);
      return res
        .status(200)
        .json({ message: "updated succesfully", ticketUpdate: ticketUpdate });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "server error" });
    }
  },
  updateRating: async(req,res)=>{
  const {rating,_id} = req.body;
    //check if the user is the one who created the ticket
  if(!rating || !_id){return res.status(404).json({message:'rating or id missing'})}
  const ticket = await ticketsModel.findById(_id);
  if(!ticket){return res.status(404).json({message:'no ticket found'})}
  ticket.rating=rating;
  await ticket.save();
  return res.status(200).json({message:'rating successfully updated',ticket,ticket});
  }
};
module.exports = ticketController;
