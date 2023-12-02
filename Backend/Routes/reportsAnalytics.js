//manager: create report
//manager: get reports
//manager: update reports
//manager: create analytics
//manager: get analytics
//manager: update analytics
const express = require('express');
const router = express.Router();
const authorizationMiddleware = require('../Middleware/authorizationMiddleware');
const reportController = require('../Controller/reportsController');
//start
router
  .route('/create-Report')
  .post(authorizationMiddleware(['manager']), reportController.createReport);

  router
  .route('/get-All-Reports')
  .get(authorizationMiddleware(['manager']), reportController.getAllReports);

  router
  .route('/update-Reports')
  .put(authorizationMiddleware(['manager']), reportController.updateReport);

module.exports = router;
