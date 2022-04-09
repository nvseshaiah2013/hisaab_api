const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

const whitelist = [process.env.BASE_URL];
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);