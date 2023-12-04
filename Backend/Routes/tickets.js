//user: create ticket
//assign tickets (auto api not dependant on users)-**-with create-**-
//agent/manager: get all tickets
//agent: update ticket(close ticket is in here then send email to users)
//agent: update workflow
const express = require('express');
const router = express.Router();  
const authorizationMiddleware = require('../Middleware/authorizationMiddleware');
const ticketController = require('../Controller/ticketsController');
//start
router
.route('/create-Ticket')
.post(authorizationMiddleware(['user']), ticketController.createTicket);

router
  .route('/get-All-Tickets')
  .get(authorizationMiddleware(['agent', 'manager']), ticketController.getAllTickets); 

  
router
.route('/update-WorkFlow')
.get(authorizationMiddleware(['agent']), ticketController.updateWorkflow); 

router
.route('/update-Ticket')
.get(authorizationMiddleware(['agent']), ticketController.updateTicket); 

router
.route('/update-Rating')
.get(authorizationMiddleware(['user']), ticketController.updateTicket); 
module.exports = router;
