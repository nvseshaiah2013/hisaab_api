const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const saltRounds = 10;

dotenv.config();


const userSchema = new Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    password: {
        required: true,
        type: mongoose.Schema.Types.String
    }
},
    {
        timestamps: true
    }
);


userSchema.pre('save',function(next) {
    let user = this;
    if(!user.isModified('password')) return next();
    bcrypt.hash(user.password, saltRounds, (err, pwdHash ) => {
        if(err) return next(err);
        user.password = pwdHash;
        next();
    });
});

userSchema.methods.comparePwd = function(password, callback) {
    bcrypt.compare(password,this.password, (err,result) => {
        if(err) return callback(err);
        callback(null,result);
    });
}

userSchema.set('toJSON', {
    transform : (doc, ret, options) => {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;