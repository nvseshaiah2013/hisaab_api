const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const options = { discriminatorKey: 'type', timestamps: true };

const borrowSchema = new Schema({
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index : true
    },
    borowee: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index : true
    },
    expected_return_date: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    actual_return_date: {
        type: mongoose.Schema.Types.Date
    },
    place : {
        type: mongoose.Schema.Types.String,
        required: true
    },
    occasion: {
        type: mongoose.Schema.Types.String
    },
    status: {
        type: mongoose.Schema.Types.Number,
        required: true,
        default : 0,
        min: 0,        /*  0- Pending 1-Approved 2- rejected 3 - Returned */
        max: 4
    }
},
    options
);

const Borrow = mongoose.model('Borrow', borrowSchema);

const BorrowMoney = Borrow.discriminator('Money', new Schema({
    amount: {
        type: mongoose.Schema.Types.Number,
        required: true
    }
},
    options));

const BorrowItem = Borrow.discriminator('Item',
    new Schema({
        itemName: {
            type: mongoose.Schema.Types.String,
            required: true
        },
        description: {
            type: mongoose.Schema.Types.String,
            required: true
        }
    }),
    options);

module.exports.Borrow = Borrow;
module.exports.BorrowMoney = BorrowMoney;
module.exports.BorrowItem = BorrowItem;