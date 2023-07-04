const path =require('path')
const Expense = require('../models/expense');
const { where } = require('sequelize');
const jwt = require('jsonwebtoken')
const User = require('../models/user')



exports.showForm = (req, resp) => {

    resp.sendFile(path.join(__dirname, '../views/afterLogin.html'));
  }
exports.postExpense = async (req, resp) => {
  const userExpense = req.body.expense;
  const userDescription = req.body.description;
  const userCategory = req.body.category;

  if (!userExpense || !userDescription || !userCategory) {
    // Check if any of the required fields are missing
    return resp.status(400).json({ message: 'Missing required fields' });
  }
try{
const result= await req.user.createExpense({
    expense: userExpense,
    description: userDescription,
    category: userCategory
  })
  
      console.log(result);
      resp.status(200).json({ message: 'Expense created successfully',data:result });
}
    catch(err) {
      console.log(err);
      resp.status(500).json({ message: 'Error creating expense' });
    };
};

  exports.showUser = (req, resp) => {
   
    Expense.findAll({where:{userId: req.user.id}})
      .then((users) => {
       console.log(users);
        resp.status(200).json(users);
      })
      .catch((err) => {
        console.error(err);
        resp.status(500).json({ message: 'Error fetching users' });
      });
  };

  exports.deleteUser = (req, res) => {
    const expenseId = req.params.id;
  
    Expense.destroy({
      where: {
        id:expenseId,
        userId:  req.user.id
      }
    })
      .then((deletedUser) => {
        if (deletedUser) {
          res.send('User deleted successfully');
        } else {
          res.send('User not found');
        }
      })
      .catch((error) => {
        res.status(500).json({ message: 'Internal server error' });
      });
  };
  
exports.editUser = (req, res) => {
  const userId = req.params.id;
  const { name, email, PhoneNumber } = req.body;

  Expense.findOne({ where: { id: userId } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return user.update({ name, email, PhoneNumber });
    })
    .then(() => {
      res.json({ name, email, PhoneNumber });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    });
};