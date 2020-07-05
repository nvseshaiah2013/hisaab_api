const express = require('express');
const router = express.Router();
const authenticate = require('../config/auth');
const BorrowController = require('../controller/borrow');
const bodyParser = require('body-parser');
const { get } = require('mongoose');

router.use(bodyParser.json());

router.route('/borrowMoney')
    .options((req,res) => res.sendStatus(200))
    .all(authenticate.verifyUser)
    .get(BorrowController.getBorrowedMoney)
    .post(BorrowController.borrowMoney);

router.route('/borrowItem')
    .options((req,res) => res.sendStatus(200))
    .all(authenticate.verifyUser)
    .get(BorrowController.getBorrowedItems)
    .post(BorrowController.borrowItem);
    

module.exports = router;