//user/agent: chat with each other
const express = require("express");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const chatsController = require("../Controller/chatsController");

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
router
  .route("/create-notification")
  .post(
    authorizationMiddleware(["agent", "user", "manager"]),
    chatsController.createNotification
  );

router
  .route("/get-notification")
  .get(authorizationMiddleware(["agent"]), chatsController.getNotification);

router
  .route("/delete-notification")
  .delete(
    authorizationMiddleware(["agent"]),
    chatsController.deleteNotification
  );
module.exports = router;
