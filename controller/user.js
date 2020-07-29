const express = require('express');
const bodyParser = require('body-parser');
const User = require('../model/user');
const authenticate = require('../config/auth');
const router = express();

router.use(bodyParser.json());

let users = [];

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
                users.push({ name : user.name , username : user.username });
                res.json({ status: true, message: 'You details saved Successfully! Login To Continue.' });
            })
            .catch((err) => next(err));
    },
    changePassword: (req, res, next) => {

    },
    forgotPassword: (req, res, next) => {

    },
    requestForgotPassword: (req, res, next) => {

    },
    getUsers : (req,res,next ) => {
        let username = req.query.username;
        let filtered_users = users.filter(user => user.username.indexOf(username) >= 0 );
        res.json({ status : true, message : 'Searched', users : filtered_users });
    }
}

module.exports.UserController = UserController;
module.exports.fetchUsers =  () => {
    User.find()
        .then((users_)=> users = users_.map(user=> ({ name : user.name, username : user.username })))
        .catch((err)=>console.log(err));
};