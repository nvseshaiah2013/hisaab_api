const express = require('express');
const app = express();
const db = require('./config/db');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const userRouter = require('./routes/user');
const tokenRouter = require('./routes/token');
const reminderRouter = require('./routes/reminder');
const borrowRouter = require('./routes/borrow');
const http = require('http');
const https = require('https');

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(logger('dev'));

app.use((req,res,next) => {
    res.setHeader('Content-Type','application/json');
    res.statusCode = 200;
    next();
});

app.use('/api/users',userRouter);
app.use('/api/token',tokenRouter);
app.use('/api/reminder',reminderRouter);
app.use('/api/borrow',borrowRouter);

app.use((err,req,res,next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.json({status : false, message : err.message});
});

http.createServer(app).listen(3080);
https.createServer(app).listen(3443);