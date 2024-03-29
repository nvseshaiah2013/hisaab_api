const express = require('express');
const router = express();
const bodyParser = require('body-parser');
const Reminder = require('../model/reminder');
const Borrow = require('../model/borrow').Borrow;


router.use(bodyParser.json());

const ReminderController = {
    remind: (req, res, next) => {
        let { header, message, borrowId } = req.body;
        Borrow.findOne({ _id: borrowId, borrower: req.user._id })
            .then((borrow) => {
                if (!borrow) {
                    let error = new Error(`The requested resource not found`);
                    error.status = 404;
                    throw error;
                }
                if (borrow.status !== 1) {
                    let error = new Error(`You cannot send a reminder for this borrow`);
                    error.status = 403;
                    throw error;
                }
                return borrow;
            })
            .then((borrow) => {
                let newReminder = new Reminder({
                    header: header,
                    message: message,
                    borrower: req.user._id,
                    borowee: borrow.borowee,
                    borrow_id: borrow._id
                });
                return newReminder.save();
            })
            .then((reminder) => {
                res.json({ status: true, message: 'Reminder Sent!', reminder: reminder });
            })
            .catch(err => next(err));
    },
    readReminder: (req, res, next) => {
        let { reminderId } = req.params;
        Reminder.findOne({ _id: reminderId, borowee: req.user._id })
            .select('-__v')
            .populate('borrower', '-__v -password -_id')
            .populate('borrow_id')
            .then((reminder) => {
                if (!reminder) {
                    let error = new Error(`The requested resource does not exist!`);
                    error.status = 404;
                    throw error;
                }
                reminder.read = true;
                return reminder.save();
            })
            .then((reminder) => {
                res.json({ status: true, message: 'Reminder Status Updated!', reminder: reminder });
            })
            .catch(err => next(err));
    },
    viewSentReminders: (req, res, next) => {
        let pageSize = 10;
        let pageNo = 1;
        if (req.query.pageNo && !isNaN(req.query.pageNo)) {
            pageNo = parseInt(req.query.pageNo);
        }
        if (req.query.pageNo && isNaN(req.query.pageNo)) {
            let error = new Error(`Invalid Request`);
            error.status = 400;
            return next(err);
        }
        Reminder.find({ borrower: req.user._id })
            .skip((pageNo - 1) * pageSize)
            .limit(pageSize)
            .select('-__v')
            .populate('borowee', '-__v -password -_id')
            .populate('borrow_id')
            .lean()
            .then((reminders) => {
                res.json({ status: true, message: 'Reminders Fetched!', reminders: reminders });
            })
            .catch(err => next(err));
    },
    viewReceivedReminders: (req, res, next) => {
        let pageSize = 10;
        let pageNo = 1;
        if (req.query.pageNo && !isNaN(req.query.pageNo)) {
            pageNo = parseInt(req.query.pageNo);
        }
        if (req.query.pageNo && isNaN(req.query.pageNo)) {
            let error = new Error(`Invalid Request`);
            error.status = 400;
            return next(err);
        }
        Reminder.find({ borowee: req.user._id })
            .skip((pageNo - 1) * pageSize)
            .limit(pageSize)
            .select('-__v')
            .populate('borrower', '-__v -password -_id')
            .populate('borrow_id')
            .lean()
            .then((reminders) => {
                res.json({ status: true, message: 'Reminders Fetched!', reminders: reminders });
            })
            .catch(err => next(err));
    },
    deleteReminder: (req, res, next) => {
        let { reminderId } = req.params;
        Reminder.findOne({ _id: reminderId })
            .then((reminder) => {
                if (!reminder) {
                    let error = new Error(`The requested resouce does not exist!`);
                    error.status = 404;
                    throw error;
                }
                return reminder.deleteOne();
            })
            .then((reminder) => {
                res.json({ status: false, message: 'Reminder Deleted!' });
            })
            .catch(err => next(err));
    }

};

module.exports = ReminderController;