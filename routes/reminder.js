const express = require('express');
const router = express.Router();
const authenticate = require('../config/auth');
const ReminderController = require('../controller/reminder');
const bodyParser = require('body-parser');

router.use(bodyParser.json());


module.exports = router;