//user: create ticket
//assign tickets (auto api not dependant on users)
//agent/manager: get all tickets
//agent: update ticket(close ticket is in here then send email to users)
//agent: update workflow
const express = require('express');
const router = express.Router();
const authorizationMiddleware = require('../Middleware/authorizationMiddleware');
const ticketController = require('../Controller/ticketsController');
//start

module.exports = router;
