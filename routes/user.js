const express = require('express');
const router = express.Router();
const UserController = require('../controller/user');

router.post('/login',UserController.login);
router.post('/signup',UserController.signup);
router.post('/changePassword',UserController.changePassword);
router.route('/forgotPassword')
      .get(UserController.requestForgotPassword)
      .post(UserController.forgotPassword);

module.exports = router;
