const express = require('express');
const router = express.Router();
const authenticate = require('../config/auth');
const BorrowController = require('../controller/borrow');
const bodyParser = require('body-parser');
const cors = require('../config/cors');

router.use(bodyParser.json());

router.route('/borrowMoney')
    .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
    .all(cors.corsWithOptions,authenticate.verifyUser)
    .get(BorrowController.getBorrowedMoney)
    .post(BorrowController.borrowMoney);

router.route('/borrowMoney/:borrowId')
    .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
    .all(cors.corsWithOptions,authenticate.verifyUser)
    .put(BorrowController.updateMoneyBorrow)
    .delete(BorrowController.deleteBorrow);

router.route('/borrowMoney/:borrowId/return')
    .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
    .all(cors.corsWithOptions,authenticate.verifyUser)
    .post(BorrowController.returnBorrow);

router.route('/borrowItem')
    .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
    .all(cors.corsWithOptions,authenticate.verifyUser)
    .get(BorrowController.getBorrowedItems)
    .post(BorrowController.borrowItem);

router.route('/borrowItem/:borrowId')
    .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
    .all(cors.corsWithOptions,authenticate.verifyUser)
    .put(BorrowController.updateItemBorrow)
    .delete(BorrowController.deleteBorrow);

router.route('/borrowItem/:borrowId/return')
    .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
    .all(cors.corsWithOptions,authenticate.verifyUser)
    .post(BorrowController.returnBorrow);

router.route('/givenMoney')
    .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
    .all(cors.corsWithOptions,authenticate.verifyUser)
    .get(BorrowController.getLentMoney);

router.route('/givenItems')
    .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
    .all(cors.corsWithOptions,authenticate.verifyUser)
    .get(BorrowController.getLentItems);

router.route('/validateborrow/:borrowId')
    .options((req,res) => res.sendStatus(200))
    .all(authenticate.verifyUser)
    .post(BorrowController.validateBorrow);

router.route('/validatereturn/:borrowId')
    .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
    .all(cors.corsWithOptions,authenticate.verifyUser)
    .post(BorrowController.validateReturn);
    

module.exports = router;