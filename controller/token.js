const express = require('express');
const router = express();
const bodyParser = require('body-parser');
const Token = require('../model/token');
const Borrow = require('../model/borrow').Borrow;

const shortid = require('shortid');

shortid.characters('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#');


router.use(bodyParser.json());

const TokenController = {
    getToken : (req,res,next) => {
        let { borrowId } = req.params;
        Borrow.findOne({ _id : borrowId })
            .then((borrow) => {
                if(!borrow){
                    let error = new Error(`Requested Resource not found!`);
                    error.status = 404;
                    throw error;
                }
                if(borrow.status === 2 || borrow.status === 3){
                    let error = new Error(`Unauthorized Operation : Cannot be Performed`);
                    error.status = 401;
                    throw error;
                }
                if(borrow.status === 0 && borrow.borrower.equals(req.user._id)){
                    let error = new Error(`Unauthorized Operation : Cannot be Performed`);
                    error.status = 401;
                    throw error;
                }
                if(borrow.status === 1 && borrow.borowee.equals(req.user._id)){
                    let error = new Error(`Unauthorized Operation : Cannot be Performed`);
                    error.status = 401;
                    throw error;
                }
                return borrow;
            })
            .then((borrow) => {
                return Token.findOne({ borrow_id : borrowId });
            })
            .then((token) => {
                if(!token) {
                    let error = new Error('Requested Token does not exist. Token needs to be created!');
                    error.status = 404;
                    throw error;
                }
                else {
                    if(token.user_id.equals(req.user._id)){
                        let error = new Error('Unauthorized Operation : Cannot be Performed');
                        error.status = 401;
                        throw error;
                    }
                    else {
                        res.json({ status : true, message : 'Token Fetched!', token  : token.secretToken });
                    }
                }
            })
            .catch(err=>next(err));
    },
    generateToken: (req, res, next) => {
        Borrow.findOne({ _id: req.params.borrowId })
            .then((borrow) => {
                if (!borrow) {
                    let error = new Error(`Requested resource not found!`);
                    error.status = 400;
                    throw error;
                }
                if (!borrow.borowee.equals(req.user._id) && !borrow.borrower.equals(req.user._id)) {
                    let error = new Error(`No, This resourse cannot be accessed by you!`);
                    error.status = 400;
                    throw error;
                }
                if (borrow.status == 2 || borrow.status == 3) {
                    let error = new Error(`Token cannot be generated for borrow for this resource`);
                    error.status = 400;
                    throw error;
                }
                if(borrow.status == 0 && !borrow.borrower.equals(req.user._id)){
                    let error = new Error(`Unauthorized Operation : Cannot be Performed`);
                    error.status = 401;
                    throw error;
                }
                if(borrow.status == 1 && !borrow.borowee.equals(req.user._id)){
                    let error = new Error(`Unauthorized Operation : Cannot be Performed`);
                    error.status = 401;
                    throw error;
                }
                return borrow;
            })
            .then(borrow => {
                return Token.findOne({ user_id: req.user._id, borrow_id: borrow._id });
            })
            .then((token) => {
                if (token) {
                    token.secretToken = shortid.generate();
                    return token.save();
                }
                else {
                    let newToken = new Token({
                        user_id: req.user._id,
                        borrow_id: req.params.borrowId
                    });
                    return newToken.save();
                }
            })
            .then((token) => {
                res.json({ status: true, message: 'Token Generated!', code : 201 });
            })
            .catch(err => next(err));
    },

};

module.exports = TokenController;