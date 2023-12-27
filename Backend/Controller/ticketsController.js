const reportModel = require("../Models/ticketModel");
const sessionModel = require("../Models/sessionModel");
const ticketsModel = require("../Models/ticketModel");
const usersModel = require("../Models/userModel");
const emailService = require("../Controller/emailUpdateController");
const mongoose = require('mongoose');
const { spawn } = require("child_process");
const { PythonShell } = require("python-shell");
const axios = require("axios");
const { Console } = require("console");
async function assignA(Type, Priority) {
  const response = await axios.get(
    "http://127.0.0.1:5000//execute_python_script",
    {
      params: {
        arg1: Type,
        arg2: Priority,
      },
    }
  );

  let dat = response.data.result;

  dat = dat.replace(/'/g, '"');

  let stringDict = dat;

  let resultDict = JSON.parse(stringDict);

  for (let key in resultDict) {
    if (resultDict.hasOwnProperty(key)) {
      resultDict[key] = parseFloat(resultDict[key]);
    }
  }

  return resultDict;
}
async function checkQ() {
  let x = 0;

  const tickets = await ticketsModel.aggregate([
    {
      $match: { status: "open", assignedAgentId: null },
    },
    {
      $addFields: {
        priorityOrder: {
          $cond: {
            if: { $eq: ["$priority", "high"] },
            then: 1,
            else: {
              $cond: {
                if: { $eq: ["$priority", "medium"] },
                then: 2,
                else: {
                  $cond: {
                    if: { $eq: ["$priority", "low"] },
                    then: 3,
                    else: 0,
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $sort: { priorityOrder: 1, createdAt: 1 },
    },
  ]);

  if (!tickets) {
    return;
  }
  for (const ticket of tickets) {
    const agentDict = await assignA(ticket.category, ticket.priority);

    let allAgentsFull = true;

    const sortedAgents = Object.keys(agentDict).sort(
      (a, b) => agentDict[b] - agentDict[a]
    );

    for (const agentName of sortedAgents) {
      const agentUser = await usersModel.findOne({
        "profile.username": agentName,
        role: "agent",
      });

      if (agentUser) {
        const agentTickets = await ticketsModel.find({
          assignedAgentId: agentUser._id.toString(),
        });

        if (agentTickets.length < 5) {
          allAgentsFull = false;

          await ticketsModel.updateOne(
            { _id: ticket._id },
            { assignedAgentId: agentUser._id.toString(), status: "in progress" },
            { status: "in progress" }
          );
          break;
        }
      }
      x++;
      if (x >= 2) {
        x = 0;
        break;
      }
    }

    if (allAgentsFull) {
      console.log("All agents full");
    }
  }

  return;
}

const ticketController = {
  deletea: async (req, res) => {
    checkQ();
    return res.status(200).json({ message: "me" });
  },
  createTicket: async (req, res) => {
    try {
      // Extract ticket data from the request body
      const { title, description, category, subCategory, priority } = req.body;
      const query=req.query;
      const userId = query.userId;
      const status = "open";   
      const rating = 0;
      const createdAt = new Date();
      let assignedAgentId = null;
      const workflow = "";
      let x = 0;
      const newTicket = new ticketsModel({
        userId, 
        title,
        description,
        status,
        category,
        subCategory,
        priority,
        assignedAgentId,
        rating,
        workflow,
        createdAt,
      });
      //check if the ticket already exists
      const existingTicket = await ticketsModel.findOne({
        title: title, 
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
        .json({ message: "ticket created successfully", ticket: newTicket });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "server error" });
    }
  },

  getAllTickets: async (req, res) => {
    try {
      //getting all reports and outputting them
      const query = req.query; 
      if(query.assignedAgentId){
        const agentTickets= await ticketsModel.find({assignedAgentId:query.assignedAgentId}).sort({createdAt:-1});
        return res.status(200).json({message:'agent tickets',tickets:agentTickets});
      }
      if(query.userId){ 
        const userTickets = await ticketsModel.find({userId:query.userId});
        return res.status(200).json({message:'user tickets',tickets:userTickets});
      }
      if (query._id) {
        const partTicket = await ticketsModel.findById(query._id);
        if (!partTicket._id) {
          return res
            .status(404)
            .json({ message: "this ticket does not exist", query: query._id });
        }
        return res.status(200).json({ tickets: partTicket });
      } else {
        const allTickets = await ticketsModel.find();
        if (!allTickets) {
          res.status(404).json({ message: "no tickets in the database" });
        }
        return res.status(200).json({ tickets: allTickets });
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
      const mess = "workflow updated";
      const tick = await ticketsModel.findById(bod._id);
      const us = await usersModel.findById(tick.userId);
      const em = us.email;
      const ema = emailService.sendUpdateEmail(em, mess);
      return res.status(200).json({
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
      const {_id} = req.query
      bod = req.body;
      var mess = "ticket updated";
      if (!_id) {
        return res.status(400).json({ message: "no ticket id provided" });
      }
      const { status, resolutionDetails, rating, workflow } = req.body;
      const ticketUpdate = await ticketsModel.findById(_id);

      if (status && status == "closed") {
        const closedAt = new Date();
        ticketUpdate.closedAt = closedAt;
        mess = "ticket updated and closed";
      }
      if (resolutionDetails) {
        ticketUpdate.resolutionDetails = resolutionDetails;
      }
      if (rating) {
        ticketUpdate.rating = rating;
      }
      if (workflow) {
        ticketUpdate.workflow = workflow;
      }
      if (status) {
        ticketUpdate.status = status;
      }

      await ticketUpdate.save();
      //send email
      const tick = await ticketsModel.findById(_id);
      const us = await usersModel.findById(tick.userId);
      const em = us.email;
      const ema = emailService.sendUpdateEmail(em, mess);
      return res
        .status(200)
        .json({ message: "updated succesfully", ticketUpdate: ticketUpdate });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "server error" });
    }
  },
  updateRating: async (req, res) => {
    const  {_id}  = req.query;
    const {rating} = req.body;
    //check if the user is the one who created the ticket
    if (!rating || !_id) {
      return res.status(404).json({ message: "rating or id missing" });
    }
    const ticket = await ticketsModel.findById(_id);
    if (!ticket) {
      return res.status(404).json({ message: "no ticket found" });
    }
    ticket.rating = rating;
    await ticket.save();
    return res
      .status(200)
      .json({ message: "rating successfully updated", ticket:ticket });
  },
};
module.exports = { ticketController, checkQ };
