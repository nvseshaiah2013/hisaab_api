const express = require('express');
const router = express.Router();
const authenticate = require('../config/auth');
const TokenController = require('../controller/token');
const bodyParser = require('body-parser');
const cors = require('../config/cors');

router.use(bodyParser.json());

router.route('/:borrowId')
    .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
    .all(cors.corsWithOptions,authenticate.verifyUser)
    .get(TokenController.getToken)
    .post(TokenController.generateToken);

module.exports = router;