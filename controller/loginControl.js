const path = require('path')
const Expense = require('../models/expense');
const { where } = require('sequelize');
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const sequelize = require('../util/database');




exports.showForm = (req, resp) => {

  resp.sendFile(path.join(__dirname, '../views/afterLogin.html'));
}
exports.postExpense = async (req, resp) => {
  const trans = await sequelize.transaction();
  const userExpense = req.body.expense;
  const userDescription = req.body.description;
  const userCategory = req.body.category;


  if (!userExpense || !userDescription || !userCategory) {
    // Check if any of the required fields are missing
    return resp.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const result = await req.user.createExpense({
      expense: userExpense,
      description: userDescription,
      category: userCategory,
      userId: req.user.id
    },
      {
        transaction: trans
      })
    console.log('Inside a create expense for a totalExpense')
    const totalExpense = Number(req.user.totalExpenses) + Number(userExpense)


    console.log(totalExpense + 'ikjhgfdsdfghjkl')


    await User.update(

      { totalExpenses: totalExpense },

      { where: { id: req.user.id },

       transaction: trans 
      }
    );
    await trans.commit();
    // console.log(result);
    resp.status(200).json({ message: 'Expense created successfully', data: result });
  }
  catch (err) {
    await trans.rollback();
    console.log(err);
    resp.status(500).json({ message: 'Error creating expense' });
  };
};



exports.showUser = (req, resp) => {

  Expense.findAll({ where: { userId: req.user.id } })
    .then((users) => {
      // console.log(users);
      resp.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      resp.status(500).json({ message: 'Error fetching users' });
    });
};

exports.deleteUser = async(req, res) => {
  const trans = await sequelize.transaction();
  const expenseId = req.params.id;

  Expense.destroy({
    where: {
      id: expenseId,
      userId: req.user.id
    },
    transaction: trans 
  })
    .then(async(deletedUser) => {
      if (deletedUser) {
        await trans.commit();
        res.send('User deleted successfully');
      } else {
        await trans.rollback();
        res.send('User not found');
      }
    })
    .catch(async(error) => {
      await trans.rollback();
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    });
};

// exports.editUser = (req, res) => {
//   const userId = req.params.id;
//   const { name, email, PhoneNumber } = req.body;

//   Expense.findOne({ where: { id: userId } })
//     .then((user) => {
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       return user.update({ name, email, PhoneNumber });
//     })
//     .then(() => {
//       res.json({ name, email, PhoneNumber });
//     })
//     .catch((error) => {
//       console.log(error);
//       res.status(500).json({ message: 'Internal server error' });
//     });
// };