const express = require('express');
const router = express.Router();
const authenticate = require('../config/auth');
const BorrowController = require('../controller/borrow');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.route('/borrowMoney')
    .options((req,res) => res.sendStatus(200))
    .all(authenticate.verifyUser)
    .get(BorrowController.getBorrowedMoney)
    .post(BorrowController.borrowMoney);

router.route('/borrowMoney/:borrowId')
    .options((req,res) => res.sendStatus(200))
    .all(authenticate.verifyUser)
    .put(BorrowController.updateMoneyBorrow)
    .delete(BorrowController.deleteBorrow);

router.route('/borrowMoney/:borrowId/return')
    .options((req,res) => res.sendStatus(200))
    .all(authenticate.verifyUser)
    .post(BorrowController.returnBorrow);

router.route('/borrowItem')
    .options((req,res) => res.sendStatus(200))
    .all(authenticate.verifyUser)
    .get(BorrowController.getBorrowedItems)
    .post(BorrowController.borrowItem);

router.route('/borrowItem/:borrowId')
    .options((req,res) => res.sendStatus(200))
    .all(authenticate.verifyUser)
    .put(BorrowController.updateItemBorrow)
    .delete(BorrowController.deleteBorrow);

router.route('/borrowItem/:borrowId/return')
    .options((req,res) => res.sendStatus(200))
    .all(authenticate.verifyUser)
    .post(BorrowController.returnBorrow);

router.route('/givenMoney')
    .options((req,res) => res.sendStatus(200))
    .all(authenticate.verifyUser)
    .get(BorrowController.getLentMoney);

router.route('/givenItems')
    .options((req,res) => res.sendStatus(200))
    .all(authenticate.verifyUser)
    .get(BorrowController.getLentItems);

router.route('/validateborrow/:borrowId')
    .options((req,res) => res.sendStatus(200))
    .all(authenticate.verifyUser)
    .post(BorrowController.validateBorrow);

router.route('/validatereturn/:borrowId')
    .options((req,res) => res.sendStatus(200))
    .all(authenticate.verifyUser)
    .post(BorrowController.validateReturn);
    

module.exports = router;