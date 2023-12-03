//user: get automated workflows
const express = require("express");
const router = express.Router();
const authorizationMiddleware = require('../Middleware/authorizationMiddleware');
const automationController = require("../Controller/automationController");

router
  .route('/get-workflow')
  .get(authorizationMiddleware(['user']), automationController.getWorkflow);

module.exports = router;
