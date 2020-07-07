const express = require('express');
const router = express();
const bodyParser = require('body-parser');
const BorrowItem = require('../model/borrow').BorrowItem;
const BorrowMoney = require('../model/borrow').BorrowMoney;
const Borrow = require('../model/borrow').Borrow;
const Token = require('../model/token');
const User = require('../model/user');
const shortid = require('shortid');
const isValidDate = require('../utils/dateValidation').isValidDate;
const getFormattedDate = require('../utils/dateValidation').getFormattedDate;
const isAfterOrToday = require('../utils/dateValidation').isAfterOrToday;
const isTokenValid = require('../utils/dateValidation').isTokenValid;

router.use(bodyParser.json());

const BorrowController = {
    getBorrowedMoney: (req, res, next) => {
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
        BorrowMoney.find({ borowee: req.user._id })
            .skip((pageNo - 1) * pageSize)
            .limit(pageSize)
            .populate('borrower')
            .lean()
            .then((borrows) => {
                res.json({ status: true, message: 'Borrows Fetched!', borrows: borrows })
            })
            .catch(err => next(err));
    },
    borrowMoney: (req, res, next) => {
        let expectedReturnDate;
        if (!isValidDate(req.body.expectedReturnDate)) {
            let error = new Error(`Expected Return Date Format Does not match`);
            error.status = 400;
            return next(error);
        }
        else if (!isAfterOrToday(req.body.expectedReturnDate)) {
            let error = new Error(`Expected Return Date Should be in the future`);
            error.status = 400;
            return next(error);
        }
        else {
            expectedReturnDate = getFormattedDate(req.body.expectedReturnDate);
        }
        User.findOne({ username: req.body.borowee })
            .then((user) => {
                if (!user) {
                    let error = new Error(`The user id ${req.body.borowee} does not exist`);
                    error.status = 404;
                    throw error;
                }
                let borrow = new BorrowMoney({
                    borrower: req.user._id,
                    borowee: user._id,
                    expected_return_date: expectedReturnDate,
                    place: req.body.place,
                    occasion: req.body.occasion,
                    amount: req.body.amount
                });
                return borrow.save();
            })
            .then((borrow) => {
                let newToken = new Token({
                    borrow_id: borrow._id,
                    user_id: req.user._id
                });
                return newToken.save();
            })
            .then((token) => {
                return BorrowMoney.findOne({ _id: token.borrow_id });
            })
            .then((borrow) => {
                res.json({ status: true, message: 'Your borrow created! Go Ahead and Validate.', borrow: borrow });
            })
            .catch(err => next(err));
    },
    getBorrowedItems: (req, res, next) => {
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
        BorrowItem.find({ borowee: req.user._id })
            .skip((pageNo - 1) * pageSize)
            .limit(pageSize)
            .populate('borrower')
            .lean()
            .then((borrows) => {
                res.json({ status: true, message: 'Borrows Fetched!', borrows: borrows })
            })
            .catch(err => next(err));
    },
    borrowItem: (req, res, next) => {
        let expectedReturnDate;
        if (!isValidDate(req.body.expectedReturnDate)) {
            let error = new Error(`Expected Return Date Format Does not match`);
            error.status = 400;
            return next(error);
        }
        else if (!isAfterOrToday(req.body.expectedReturnDate)) {
            let error = new Error(`Expected Return Date Should be in the future`);
            error.status = 400;
            return next(error);
        }
        else {
            expectedReturnDate = getFormattedDate(req.body.expectedReturnDate);
        }
        User.findOne({ username: req.body.borowee })
            .then((user) => {
                if (!user) {
                    let error = new Error(`The user id ${req.body.borowee} does not exist`);
                    error.status = 404;
                    throw error;
                }
                let borrow = new BorrowItem({
                    borrower: req.user._id,
                    borowee: user._id,
                    expected_return_date: expectedReturnDate,
                    place: req.body.place,
                    occasion: req.body.occasion,
                    itemName: req.body.itemName,
                    description: req.body.description
                });
                return borrow.save();
            })
            .then((borrow) => {
                let newToken = new Token({
                    borrow_id: borrow._id,
                    user_id: req.user._id
                });
                return newToken.save();
            })
            .then((token) => {
                return BorrowItem.findOne({ _id: token.borrow_id });
            })
            .then((borrow) => {
                res.json({ status: true, message: 'Your borrow created! Go Ahead and Validate.', borrow: borrow });
            })
            .catch(err => next(err));
    },
    getLentMoney: (req, res, next) => {
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
        BorrowMoney.find({ borrower: req.user._id })
            .skip((pageNo - 1) * pageSize)
            .limit(pageSize)
            .populate('borowee')
            .lean()
            .then((borrows) => {
                res.json({ status: true, message: 'Lents Fetched!', borrows: borrows })
            })
            .catch(err => next(err));
    },
    getLentItems: (req, res, next) => {
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
        BorrowItem.find({ borrower: req.user._id })
            .skip((pageNo - 1) * pageSize)
            .limit(pageSize)
            .populate('borowee')
            .lean()
            .then((borrows) => {
                res.json({ status: true, message: 'Lents Fetched!', borrows: borrows })
            })
            .catch(err => next(err));
    },
    updateMoneyBorrow: (req, res, next) => {
        let borrowId = req.params.borrowId;
        let updatedBorrow = req.body;
        BorrowMoney.findOne({ _id: borrowId, borrower: req.user._id })
            .then((borrow) => {
                if (!borrower) {
                    let error = new Error(`The borrow with ${borrowId} does not exist`);
                    error.status = 404;
                    throw error;
                }
                let expectedReturnDate;
                if (updatedBorrow.expectedReturnDate) {
                    if (!isValidDate(updatedBorrow.expectedReturnDate)) {
                        let error = new Error(`Expected Return Date Format Does not match`);
                        error.status = 400;
                        throw error;
                    }
                    else if (!isAfterOrToday(updatedBorrow.expectedReturnDate)) {
                        let error = new Error(`Expected Return Date Should be in the future`);
                        error.status = 400;
                        throw error;
                    }
                    else {
                        expectedReturnDate = getFormattedDate(rupdatedBorrow.expectedReturnDate);
                        borrow.expected_return_date = expectedReturnDate;
                    }
                }
                if (updatedBorrow.place) {
                    borrow.place = updatedBorrow.place;
                }
                if (updatedBorrow.occasion) {
                    borrow.occasion = updatedBorrow.occasion;
                }
                if (updatedBorrow.money) {
                    borrow.money = updatedBorrow.money;
                }
                return borrow.save();
            })
            .then((borrow) => {
                return Token.findOne({ borrow_id: borrow._id, user_id: req.user._id });
            })
            .then((token) => {
                if (token) {
                    token.secretToken = shortid.generate();
                    return token.save();
                }
                else {
                    let newToken = new Token({
                        user_id: req.user._id,
                        borrow_id: borrowId,
                        secretToken: shortid.generate()
                    })
                    return newToken.save();
                }
            })
            .then((token) => {
                return BorrowItem.findOne({ _id: token.borrow_id });
            })
            .then((borrow) => {
                res.json({ status: true, message: 'Your borrow created! Go Ahead and Validate.', borrow: borrow });
            })
            .catch(err => next(err));
    },
    updateItemBorrow: (req, res, next) => {
        let borrowId = req.params.borrowId;
        let updatedBorrow = req.body;
        BorrowItem.findOne({ _id: borrowId, borrower: req.user._id })
            .then((borrow) => {
                if (!borrower) {
                    let error = new Error(`The borrow with ${borrowId} does not exist`);
                    error.status = 404;
                    throw error;
                }
                let expectedReturnDate;
                if (updatedBorrow.expectedReturnDate) {
                    if (!isValidDate(updatedBorrow.expectedReturnDate)) {
                        let error = new Error(`Expected Return Date Format Does not match`);
                        error.status = 400;
                        throw error;
                    }
                    else if (!isAfterOrToday(updatedBorrow.expectedReturnDate)) {
                        let error = new Error(`Expected Return Date Should be in the future`);
                        error.status = 400;
                        throw error;
                    }
                    else {
                        expectedReturnDate = getFormattedDate(rupdatedBorrow.expectedReturnDate);
                        borrow.expected_return_date = expectedReturnDate;
                    }
                }
                if (updatedBorrow.place) {
                    borrow.place = updatedBorrow.place;
                }
                if (updatedBorrow.occasion) {
                    borrow.occasion = updatedBorrow.occasion;
                }
                if (updatedBorrow.itemName) {
                    borrow.itemName = updatedBorrow.itemName;
                }
                if (updatedBorrow.description) {
                    borrow.description = updatedBorrow.description;
                }
                return borrow.save();
            })
            .then((borrow) => {
                return Token.findOne({ borrow_id: borrow._id, user_id: req.user._id });
            })
            .then((token) => {
                if (token) {
                    token.secretToken = shortid.generate();
                    return token.save();
                }
                else {
                    let newToken = new Token({
                        user_id: req.user._id,
                        borrow_id: borrowId,
                        secretToken: shortid.generate()
                    })
                    return newToken.save();
                }
            })
            .then((token) => {
                return BorrowItem.findOne({ _id: token.borrow_id });
            })
            .then((borrow) => {
                res.json({ status: true, message: 'Your borrow created! Go Ahead and Validate.', borrow: borrow });
            })
            .catch(err => next(err));
    },
    deleteBorrow: (req, res, next) => {
        let borrowId = req.params.borrowId;
        Borrow.findOne({ _id: borrowId, borrower: req.user._id })
            .then((borrow) => {
                if (!borrow) {
                    let error = new Error(`Borrow with borrow id ${borrowId} does not exist`);
                    error.status = 404;
                    throw error;
                }
                if (borrow.status !== 0 || borrow.status !== 2) {
                    let error = new Error(`This operation is not authorized on borrow ${borrowId}`);
                    error.status = 401;
                    throw error;
                }
                return borrow;
            })
            .then((borrow) => {
                return borrow.deleteOne();
            })
            .then((borrow) => {
                res.json({ status: true, message: 'Borrow Deleted!' });
            })
            .catch(err => next(err));
    },
    returnBorrow: (req, res, next) => {
        let borrowId = req.params.borrowId;
        Borrow.findOne({ _id: borrowId, borowee: req.user._id })
            .then((borrow) => {
                if (!borrow) {
                    let error = new Error(`Borrow with borrow Id ${borrowId} does not exist`);
                    error.status = 404;
                    throw error;
                }
                if (borrow.status !== 1) {
                    let error = new Error(`The operation is not authorized on Borrow id :${borrowId}`);
                    error.status = 404;
                    throw error;
                }
                return borrow;
            })
            .then((borrow) => {
                let newToken = new Token({
                    user_id: req.user._id,
                    borrow_id: borrow._id
                });
                return newToken.save();
            })
            .then((token) => {
                res.json({ status: true, message: 'Return Requested!' });
            })
            .catch(err => next(err));
    },
    validateBorrow: (req, res, next) => {
        let { secretToken } = req.body;
        Borrow.findOne({ _id: req.params.borrowId, borrower: req.user._id })
            .then((borrow) => {
                if (!borrow) {
                    let error = new Error(`Borrow with borrow Id ${req.params.borrowId} does not exist`);
                    error.status = 404;
                    throw error;
                }
                if (borrow.status !== 0) {
                    let error = new Error(`The operation is not authorised on borrow Id ${req.params.borrowId}`);
                    error.status = 401;
                    throw error;
                }
                return borrow;
            })
            .then((borrow) => {
                return Token.findOne({ user_id: req.user._id, borrow_id: borrow._id });
            })
            .then((token) => {
                if (!token) {
                    let error = new Error(`Token not generated for Borrow with id ${req.params.borrowId}`);
                    error.status = 404;
                    throw error;
                }
                console.log(token.updatedAt);
                let valid = isTokenValid(token.updatedAt, token.validTill);
                if (valid) {
                    if (secretToken === token.secretToken)
                        return Borrow.findOneAndUpdate({ _id: token.borrow_id },
                            { $set: { status: 1 } }, { new: true });
                    else {
                        let error = new Error(`Token ${secretToken} does not match our records`);
                        error.status = 404;
                        throw error;
                    }
                }
                else {
                    let error = new Error(`Your token ${secretToken} expired. Try Generating new one`);
                    error.status = 401;
                    throw error;
                }
            })
            .then((borrow) => {
                return Token.deleteMany({ borrow_id: borrow._id });
            })
            .then((token) => {
                res.json({ status: true, message: 'Borrow Returned !' });
            })
            .catch(err => next(err));
    },
    validateReturn: (req, res, next) => {
        let { secretToken } = req.body;
        Borrow.findOne({ _id: req.params.borrowId, borowee: req.user._id })
            .then((borrow) => {
                if (!borrow) {
                    let error = new Error(`Borrow with borrow Id ${req.params.borrowId} does not exist`);
                    error.status = 404;
                    throw error;
                }
                if (borrow.status !== 1) {
                    let error = new Error(`The operation is not authorised on borrow Id ${req.params.borrowId}`);
                    error.status = 401;
                    throw error;
                }
                return borrow;
            })
            .then((borrow) => {
                return Token.findOne({ user_id: req.user._id, borrow_id: borrow._id });
            })
            .then((token) => {
                if (!token) {
                    let error = new Error(`Token not generated for Borrow with id ${req.params.borrowId}`);
                    error.status = 404;
                    throw error;
                }
                console.log(token.updatedAt);
                let valid = isTokenValid(token.updatedAt, token.validTill);
                if (valid) {
                    if (secretToken === token.secretToken)
                        return Borrow.findOneAndUpdate({ _id: token.borrow_id },
                            { $set: { status: 3, actual_return_date: new Date() } }, { new: true });
                    else {
                        let error = new Error(`Token ${secretToken} does not match our records`);
                        error.status = 404;
                        throw error;
                    }
                }
                else {
                    let error = new Error(`Your token ${secretToken} expired. Try Generating new one`);
                    error.status = 401;
                    throw error;
                }
            })
            .then((borrow) => {
                return Token.deleteMany({ borrow_id: borrow._id });
            })
            .then((token) => {
                res.json({ status: true, message: 'Borrow Returned !' });
            })
            .catch(err => next(err));
    }
};

module.exports = BorrowController;