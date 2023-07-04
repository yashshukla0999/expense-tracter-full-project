const express = require('express');

const purchaseController = require('../controller/purchase');

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/purchase', authenticatemiddleware.authenticate,purchaseController.purchasepremium);

router.post('/purchase', authenticatemiddleware.authenticate, purchaseController.updateTransactionStatus)

module.exports = router;