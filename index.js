const express = require('express');
const app = express();
const db = require('./config/db');
const bodyParser = require('body-parser');

app.use(bodyParser.json());


app.listen(3000,'localhost',()=>{
    console.log('Server Started');
});