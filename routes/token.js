const express = require('express');
const router = express.Router();
const authenticate = require('../config/auth');
const TokenController = require('../controller/token');
const bodyParser = require('body-parser');

router.use(bodyParser.json());


module.exports = router;