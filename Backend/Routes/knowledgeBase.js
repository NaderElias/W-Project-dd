//user: get/filter knowledgeBase
const express = require("express");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const knowledgeBaseController = require("../Controller/knowledgeBaseController");

router
  .route("/get-knowledgeBase")
  .get(
    authorizationMiddleware(["user", "admin", "manager", "agent"]),
    knowledgeBaseController.getKnowledgeBase
  );
  module.exports = router;