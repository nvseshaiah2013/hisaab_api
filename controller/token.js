const express = require('express');
const router = express();
const bodyParser = require('body-parser');
const Token = require('../model/token');
const Borrow = require('../model/borrow').Borrow;

const shortid = require('shortid');

shortid.characters('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#');


router.use(bodyParser.json());

const TokenController = {
    generateToken: (req, res, next) => {
        Borrow.findOne({ _id: req.params.borrowId })
            .then((borrow) => {
                if (!borrow) {
                    let error = new Error(`No Borrow with ${req.params.borrowId} found`);
                    error.status = 400;
                    throw error;
                }
                if (borrow.borowee !== req.user._id && borrow.borrower !== req.user._id) {
                    let error = new Error(`No Borrow with ${req.params.borrowId} does not belong to you`);
                    error.status = 400;
                    throw error;
                }
                if (borrow.status == 2 || borrow.status == 3) {
                    let error = new Error(`Token cannot be generated for borrow ${req.params.borrowId}!`);
                    error.status = 400;
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
                res.json({ status: true, message: 'Token Generated!' });
            })
            .catch(err => next(err));
    },

};

module.exports = TokenController;