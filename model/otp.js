const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

const saltRounds = 10;

dotenv.config();

const otpSchema = new Schema({
    username : {
        type : mongoose.Schema.Types.String,
        required : true,
        unique : true
    },
    secretToken : {
        type : mongoose.Schema.Types.String,
        required : true,
    }, 
    validTill : {
        type : mongoose.Schema.Types.Number,
        required : true,
        default : 5
    }
}, { timestamps : true});

otpSchema.pre('save', function(next){
    let otp = this;
    bcrypt.hash(otp.secretToken, saltRounds, (err, secretTokenHash) => {
        if (err) return next(err);
        otp.secretToken = secretTokenHash;
        next();
    });
});

otpSchema.methods.compareToken = function(secretToken) {
    return bcrypt.compareSync(secretToken, this.secretToken);
}

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;