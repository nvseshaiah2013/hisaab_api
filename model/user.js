const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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

const User = mongoose.model('User', userSchema);
module.exports = User;