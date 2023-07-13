

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const controller = require('../controller/password')

router.get('/views/forgot.html',controller.showforgotPasswordForm)

//router.get('/user/forgotPassword', controller.showforgotPasswordForm )

router.post('/forgot',auth.authenticate,  controller.forgotPassword)

router.get('/forgot/:id', controller.showResetPasswordForm)

router.post('/forgot', controller.updatePassword)

module.exports = router






//module.exports= router;