//admin: get customization for given brand/our website
//admin: create customization for given brand/our website
//admin: update customization for given brand/our website
const express = require("express");
const router = express.Router();
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const brandingController = require("../Controller/brandingController");

router
  .route("/get-customization")
  .get(
    authorizationMiddleware(["user", "admin", "manager", "agent"]),
    brandingController.getCustomization
  );

router
  .route("/create-customization")
  .post(
    authorizationMiddleware(["admin"]),
    brandingController.createCustomization
  );

router
  .route("/update-customization")
  .put(
    authorizationMiddleware(["admin"]),
    brandingController.updateCustomization
  );

module.exports = router;
