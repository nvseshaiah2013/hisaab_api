const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.getToken = (user) => {
    return jwt.sign(user, process.env.KEY, {expiresIn:3600,issuer:'lane_dane'});
}

const opts = {
    secretOrKey : process.env.KEY,
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken()
}


exports.jwtPassport = passport.use('user-jwt',new JwtStrategy(opts,(jwt_payload,done)=>{
    User.findById(jwt_payload._id,(err,user)=>{
        if(err){
            done(err,false);
        }
        else if(user){
            done(null,user);
        }
        else{
            done(null,false);
        }
    });
}));

exports.verifyUser = passport.authenticate('user-jwt',{session : false});
exports.decodeJwt = (token) => {
    return jwt.verify(token, process.env.KEY);
}