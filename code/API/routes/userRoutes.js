const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/', authController.protect, userController.getCurrentUser);
userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.get('/logout', authController.logout);
userRouter.get('/:id', authController.protect, userController.getUser);

module.exports = userRouter;
