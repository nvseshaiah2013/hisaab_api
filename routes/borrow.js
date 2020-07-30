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
    .get(BorrowController.getLentMoney)
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
    .get(BorrowController.getLentItems)
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

router.route('/takenMoney')
    .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
    .all(cors.corsWithOptions,authenticate.verifyUser)
    .get(BorrowController.getBorrowedMoney);

router.route('/takenItems')
    .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
    .all(cors.corsWithOptions,authenticate.verifyUser)
    .get(BorrowController.getBorrowedItems);

router.route('/validateborrow/:borrowId')
    .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
    .all(cors.corsWithOptions,authenticate.verifyUser)
    .post(BorrowController.validateBorrow);

router.route('/validatereturn/:borrowId')
    .options(cors.corsWithOptions,(req,res) => res.sendStatus(200))
    .all(cors.corsWithOptions,authenticate.verifyUser)
    .post(BorrowController.validateReturn);

router.route('/reject/:borrowId')
    .options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
    .all(cors.corsWithOptions, authenticate.verifyUser)
    .post(BorrowController.rejectBorrow);
    

module.exports = router;