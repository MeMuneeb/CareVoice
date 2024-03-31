const express = require("express");
const authController = require("../controllers/authController");
const visitController = require("../controllers/visitController");
const visitRouter = express.Router();

visitRouter.use(authController.protect);
visitRouter
  .route("/")
  .get(visitController.getVisits)
  .post(visitController.createVisit);
module.exports = visitRouter;
