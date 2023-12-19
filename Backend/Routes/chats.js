//user/agent: chat with each other
const express = require("express");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const chatsController = require("../Controller/chatController");

router
  .route("/create")
  .post(authorizationMiddleware(["agent", "user"]), chatsController.createChat);

router
  .route("/add-message")
  .put(authorizationMiddleware(["agent", "user"]), chatsController.addMessage);

router
  .route("/get-chat")
  .get(
    authorizationMiddleware(["manager", "user", "agent"]),
    chatsController.getMessage
  );

module.exports = router;
