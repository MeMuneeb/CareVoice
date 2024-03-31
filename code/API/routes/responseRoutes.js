const express = require('express');
const authController = require('../controllers/authController');
const responseController = require('../controllers/responseController');
const responseRouter = express.Router();

responseRouter.use(authController.protect);
responseRouter
  .route('/')
  .post(responseController.createResponse)
  .get(
    authController.checkDoctorRole,
    responseController.getAllResponsesForDoctor
  );
responseRouter.route('/:id').get(responseController.getResponse);
module.exports = responseRouter;
