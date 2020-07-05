const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');

shortid.characters('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890');

const tokenSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    borrow_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Borrow'
    },
    secretToken: {
        type: mongoose.Schema.Types.String,
        default: shortid.generate
    },
    validTill: {
        type: mongoose.Schema.Types.Number,
        default: 10
    }
},
    {
        timestamps: true
    });

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;