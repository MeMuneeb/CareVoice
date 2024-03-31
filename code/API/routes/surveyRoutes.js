const express = require('express');
const authController = require('../controllers/authController');
const surveyController = require('../controllers/surveyController');
const surveyRouter = express.Router();

surveyRouter.use(authController.protect);
surveyRouter
  .route('/')
  .post(authController.checkDoctorRole, surveyController.createSurvey)
  .get(authController.checkDoctorRole, surveyController.getSurveyForDoctor);
surveyRouter
  .route('/modifySurvey/:id')
  .post(authController.checkDoctorRole, surveyController.modifySurvey);
surveyRouter
  .route('/getForFeedback/:visitId')
  .get(surveyController.getSurveyForFeedback);
surveyRouter.route('/:id').get(surveyController.getSurvey);
module.exports = surveyRouter;
