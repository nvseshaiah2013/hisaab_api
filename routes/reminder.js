const express = require('express');
const router = express.Router();
const authenticate = require('../config/auth');
const ReminderController = require('../controller/reminder');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.route('/sent')
    .options((req, res) => res.sendStatus(200))
    .all(authenticate.verifyUser)
    .get(ReminderController.viewSentReminders)
    .post(ReminderController.remind);


router.route('/received')
    .options((req, res) => res.sendStatus(200))
    .all(authenticate.verifyUser)
    .get(ReminderController.viewReceivedReminders)
    .post(ReminderController.readReminder);

router.route('/delete/:reminderId')
    .options((req,res) => res.sendStatus(200))
    .all(authenticate.verifyUser)
    .delete(ReminderController.deleteReminder);

module.exports = router;