const express = require('express');
const router = express.Router();
const UserController = require('../controller/user').UserController;
const cors = require('../config/cors');


router.route('/')
      .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
      .get(UserController.getUsers);

router.route('/login')
      .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
      .post(cors.corsWithOptions,UserController.login);

router.route('/signup')
      .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
      .post(cors.corsWithOptions,UserController.signup);

router.route('/changePassword')
      .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
      .post(cors.corsWithOptions,UserController.changePassword);

router.route('/forgotPassword')
      .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
      .get(cors.corsWithOptions,UserController.requestForgotPassword)
      .post(cors.corsWithOptions,UserController.forgotPassword);

module.exports = router;
