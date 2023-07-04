const express = require('express');
const router = express.Router();
const expenseControl = require('../controller/controls')

router.get('/user',expenseControl.showForm)
router.post('/signUp',expenseControl.postUser)
router.post('/login',expenseControl.postUserLogin)




module.exports=router;