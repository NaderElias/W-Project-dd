//register
//login
const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");

router.post("/register", userController.register);

router.post("/login", userController.login);

router.delete("/logout", userController.logout);
module.exports = router;
