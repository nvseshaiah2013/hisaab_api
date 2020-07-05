const express = require('express');
const router = express();
const bodyParser = require('body-parser');
const BorrowItem = require('../model/borrow').BorrowItem;
const BorrowMoney = require('../model/borrow').BorrowMoney;
const User = require('../model/user');
const isValidDate = require('../utils/dateValidation').isValidDate;
const getFormattedDate = require('../utils/dateValidation').getFormattedDate;
const isAfterOrToday = require('../utils/dateValidation').isAfterOrToday;

router.use(bodyParser.json());

const BorrowController = {
    getBorrowedMoney : (req,res,next) => {

    },
    borrowMoney : (req,res,next) => {
        let expectedReturnDate;
        if(!isValidDate(req.body.expectedReturnDate)){
            let error = new Error(`Expected Return Date Format Does not match`);
            error.status = 400;
            return next(error);
        }
        else if(!isAfterOrToday(req.body.expectedReturnDate)){
            let error = new Error(`Expected Return Date Should be in the future`);
            error.status = 400;
            return next(error);
        }
        else{
            expectedReturnDate = getFormattedDate(req.body.expectedReturnDate);
        }
        User.findOne( { username : req.body.borowee })
            .then((user) => {
                if(!user){
                    let error = new Error(`The user id ${req.body.borowee} does not exist`);
                    error.status = 404;
                    throw error;
                }
                let borrow = new BorrowMoney({
                    borrower : req.user._id,
                    borowee : user._id,
                    expected_return_date : expectedReturnDate,
                    place : req.body.place,
                    occasion : req.body.occasion,
                    amount : req.body.amount
                });
                return borrow.save();
            })
            .then((borrow)=>{
                res.json({ status : true, message : 'Your borrow created! Go Ahead and Validate.', borrow : borrow});
            })
            .catch(err=>next(err));
    },
    getBorrowedItems : (req,res,next) => {
        
    },
    borrowItem : (req,res,next) => {
        let expectedReturnDate;
        if(!isValidDate(req.body.expectedReturnDate)){
            let error = new Error(`Expected Return Date Format Does not match`);
            error.status = 400;
            return next(error);
        }
        else if(!isAfterOrToday(req.body.expectedReturnDate)){
            let error = new Error(`Expected Return Date Should be in the future`);
            error.status = 400;
            return next(error);
        }
        else{
            expectedReturnDate = getFormattedDate(req.body.expectedReturnDate);
        }
        User.findOne( { username : req.body.borowee })
            .then((user) => {
                if(!user){
                    let error = new Error(`The user id ${req.body.borowee} does not exist`);
                    error.status = 404;
                    throw error;
                }
                let borrow = new BorrowItem({
                    borrower : req.user._id,
                    borowee : user._id,
                    expected_return_date : expectedReturnDate,
                    place : req.body.place,
                    occasion : req.body.occasion,
                    itemName : req.body.itemName,
                    description : req.body.description
                });
                return borrow.save();
            })
            .then((borrow)=>{
                res.json({ status : true, message : 'Your borrow created! Go Ahead and Validate.', borrow : borrow});
            })
            .catch(err=>next(err));
    }
};

module.exports = BorrowController;