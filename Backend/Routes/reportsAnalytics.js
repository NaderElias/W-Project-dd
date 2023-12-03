//manager: create report -done-
//manager: get reports -done-
//manager: update reports -done-
//manager: analytics
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

  router
  .route('/get-Analytics')
  .get(authorizationMiddleware(['manager']), reportController.getAnalytics);

module.exports = router;
