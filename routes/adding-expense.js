const express = require('express');
const router = express.Router();
const afterLoginControl = require('../controller/loginControl');
const userAuth = require('../middleware/auth');

router.get('/views/afterLogin.html', afterLoginControl.showForm);
router.post('/expense',userAuth.authenticate, afterLoginControl.postExpense);
router.get('/expense', userAuth.authenticate ,afterLoginControl.showUser);
router.delete('/expense/:id',userAuth.authenticate, afterLoginControl.deleteUser);
router.get('/get-expenses/:id',userAuth.authenticate,afterLoginControl.getAllUsers)

//router.get('/download',userAuth.authenticate,afterLoginControl.downloadExpense)
 //router.put('/expense/:id',  afterLoginControl.editUser);

module.exports = router;