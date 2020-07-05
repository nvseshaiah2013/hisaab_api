const express = require('express');
const router = express();
const bodyParser = require('body-parser');
const Reminder = require('../model/reminder');


router.use(bodyParser.json());

const ReminderController = {


};

module.exports = ReminderController;