const express = require('express');
const router = express.Router();
const authenticate = require('../config/auth');
const ReminderController = require('../controller/reminder');
const bodyParser = require('body-parser');
const cors = require('../config/cors');

router.use(bodyParser.json());

router.route('/sent')
    .options(cors.corsWithOptions,(req, res) => res.sendStatus(200))
    .all(cors.corsWithOptions,authenticate.verifyUser)
    .get(ReminderController.viewSentReminders)
    .post(ReminderController.remind);


router.route('/received')
    .options(cors.corsWithOptions,(req, res) => res.sendStatus(200))
    .all(cors.corsWithOptions,authenticate.verifyUser)
    .get(ReminderController.viewReceivedReminders)

router.route('/:reminderId')
    .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
    .all(cors.corsWithOptions,authenticate.verifyUser)
    .post(ReminderController.readReminder)
    .delete(ReminderController.deleteReminder);

module.exports = router;