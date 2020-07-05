const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reminderSchema = new Schema({
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    borrowee: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    header: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    message: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    read: {
        type: mongoose.Schema.Types.Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
);

const Reminder = mongoose.model('Reminder', reminderSchema);
module.exports = Reminder;