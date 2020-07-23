const express = require('express');
const bodyParser = require('body-parser');
const User = require('../model/user');
const authenticate = require('../config/auth');
const router = express();

router.use(bodyParser.json());

const UserController = {
    login: (req, res, next) => {
        User.findOne({ username: req.body.username })
            .then((user) => {
                if (user) {
                    user.comparePwd(req.body.password, (err, success) => {
                        if (err) {
                            throw err;
                        }
                        else if (success) {
                            let token = authenticate.getToken({ _id: user._id });
                            res.json({ status: true, message: 'You are authenticated!', token: token });
                        }
                        else {
                            let err = new Error('Your credentials are incorrect!')
                            err.status = 401;
                            return next(err);
                        }
                    });
                }
                else {
                    let error = new Error(`Your details do not exist in our system`);
                    error.status = 404;
                    throw error;
                }
            })
            .catch(err => next(err));
    },
    signup: (req, res, next) => {
        let data = req.body;
        User.findOne({ username: data.username })
            .then((user) => {
                if (!user) {
                    return User.create(new User({name : data.name, username : data.username, password : data.password}));
                }
                else {
                    let error = new Error(`The username is already in use. Try Again with different one!`);
                    error.status = 400;
                    throw error;
                }
            })
            .then((user) => {
                res.json({ status: true, message: 'You details saved Successfully!' });
            })
            .catch((err) => next(err));
    },
    changePassword: (req, res, next) => {

    },
    forgotPassword: (req, res, next) => {

    },
    requestForgotPassword: (req, res, next) => {

    }
}

module.exports = UserController;