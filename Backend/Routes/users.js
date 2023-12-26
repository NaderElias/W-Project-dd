//admin: create user
//admin: assign roles
//admin: get all users
//user: update profile
//user: get profile
const express = require("express");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const userController = require("../Controller/userController");

router
  .route("/create")
  .post(authorizationMiddleware(["admin"]), userController.createUser);

router
  .route("/assign-role")
  .post(authorizationMiddleware(["admin"]), userController.assignRole);

router
  .route("/get-all-users")
  .get(authorizationMiddleware(["admin"]), userController.getAllUsers);

router
  .route("/update-profile")
  .put(
    authorizationMiddleware(["user", "admin", "manager", "agent"]),
    userController.updateProfile
  );

router
  .route("/get-profile")
  .get(
    authorizationMiddleware(["user", "admin", "manager", "agent"]),
    userController.getProfile
  );

router
  .route("/change-password")
  .put(
    authorizationMiddleware(["user", "admin", "manager", "agent"]),
    userController.updatePassword
  );

router
  .route("/delete-user")
  .delete(authorizationMiddleware(["admin"]), userController.deleteUser);

module.exports = router;
