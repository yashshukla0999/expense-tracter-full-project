const express = require('express');
const router = express.Router();



const afterLoginCotrol =require('../controller/loginControl')

router.get('/expenses',afterLoginCotrol.showForm);

router.post('/expense',afterLoginCotrol.postExpense)
router.get('/expense',afterLoginCotrol.showUser)
router.delete('/expense/:id', afterLoginCotrol.deleteUser)
router.put('/expense/:id', afterLoginCotrol.editUser)

module.exports = router;