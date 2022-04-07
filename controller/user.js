const express = require('express');
const bodyParser = require('body-parser');
const User = require('../model/user');
const authenticate = require('../config/auth');
const Otp = require('../model/otp');
const router = express();
const mailSender = require('../utils/mailSenderUtil');
const shortid = require('shortid');
const isSecretCodeValid = require('../utils/dateValidation').isSecretCodeValid;
const TokenExpiredError = require('jsonwebtoken').TokenExpiredError;

router.use(bodyParser.json());
shortid.characters('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890@#');


let users = [];

const UserController = {
    login: (req, res, next) => {
        User.findOne({ username: req.body.username })
            .then((user) => {
                if (user) {
                    user.comparePwd(req.body.password, (err, success) => {
                        if (err) {
                            return next(err);
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
                    return User.create(new User({ name: data.name, username: data.username, password: data.password }));
                }
                else {
                    let error = new Error(`The username is already in use. Try Again with different one!`);
                    error.status = 400;
                    throw error;
                }
            })
            .then((user) => {
                users.push({ name: user.name, username: user.username });
                res.json({ status: true, message: 'You details saved Successfully! Login To Continue.' });
            })
            .catch((err) => next(err));
    },
    changePassword: (req, res, next) => {
        let { oldPassword, newPassword } = req.body;
        User.findOne({ _id: req.user._id })
            .then((user) => {
                if (!user) {
                    let error = new Error(`The requested resource not found`);
                    error.status = 404;
                    throw error;
                }
                user.comparePwd(oldPassword, (err, success) => {
                    if (err) {
                        return next(err);
                    }
                    else if (success) {
                        user.password = newPassword;
                        return user.save();
                    }
                    else {
                        let err = new Error('Your credentials are incorrect!')
                        err.status = 401;
                        return next(err);
                    }
                });
            })
            .then(user => {
                res.json({ status: true, message: 'Password Changed Successfully!' });
            })
            .catch(err => next(err));
    },
    requestForgotPassword: (req, res, next) => {
        let username = req.query.username;
        let secretToken;
        User.findOne({ username: username })
            .then(user => {
                if (!user) {
                    let error = new Error(`The requested resource is not found`);
                    error.status = 404;
                    throw error;
                }
                return Otp.deleteMany({ username: username });
            })
            .then(otp => {
                secretToken = shortid.generate();
                return Otp.create({ username: username, secretToken : secretToken });
            })
            .then(otp => {
                let token = authenticate.getToken({ secretToken : secretToken, username : username });
                mailSender(username, token);
                res.json({ status : true, message : 'Reset Password Mail Sent'});
            })
            .catch(err => next(err));
    },
    forgotPassword: (req, res, next) => {
        let { password , token, confirm_password } = req.body;
        try {
            let decodedToken = authenticate.decodeJwt(token);
            let { secretToken, username } = decodedToken;
            Otp.findOne({ username : username })
                .then(otp => {
                    if (!otp || !otp.compareToken(secretToken)) {
                        let error = new Error('Some Error Occured');
                        error.status = 400;
                        console.error(`The reset password request for ${username} is rejected as no secret token found`);
                        throw error;
                    }                    
                    let createdDate = otp.createdAt;
                    if (!isSecretCodeValid(createdDate, otp.validTill)) {
                        let error = new Error('The reset password link expired');
                        error.status = 401;
                        console.error(`The reset password token expired for user ${username}`);
                        throw error;
                    }
                    return User.findOne({ username : username });
                })
                .then(user => {
                    if (!user) {
                        let error = new Error('Some Error Occured');
                        error.status = 400;
                        console.error(`The reset password request for ${username} is rejected as no user found`);
                        throw error;
                    }
                    user.password = password;
                    return user.save();
                })
                .then(user => {
                    return Otp.deleteOne({ username : username });
                })
                .then(otp => {
                    res.json({ status : true, message : 'Password Changed Successfully. Login To Continue'});
                })
                .catch(err => next(err));
        } catch(exception) {
            let error = new Error(exception instanceof TokenExpiredError ? exception.message : 'Unknown Error');
            console.error(exception.message);
            throw error;
        }
    },
    getUsers: (req, res, next) => {
        let username = req.query.username;
        let filtered_users = users.filter(user => user.username.indexOf(username) >= 0);
        res.json({ status: true, message: 'Searched', users: filtered_users });
    }
}

module.exports.UserController = UserController;
module.exports.fetchUsers = () => {
    User.find()
        .then((users_) => users = users_.map(user => ({ name: user.name, username: user.username })))
        .catch((err) => console.log(err));
};