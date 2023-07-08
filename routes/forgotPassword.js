const express = require('express');
const router = express.Router();
const passwordController = require('../controller/password')
const authenticatemiddleware = require('../middleware/auth');

router.get('/views/forgot.html',passwordController.showForm)
router.use('/forgot',passwordController.forgotpassword)



module.exports= router;