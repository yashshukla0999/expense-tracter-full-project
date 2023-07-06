const express = require('express');

const premiumFeatureController = require('../controller/premium');

const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/premium', authenticatemiddleware.authenticate,premiumFeatureController.getUserLeaderBoard);


module.exports = router;