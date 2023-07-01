const path =require('path')
const LoginExpense = require('../models/expense')



exports.showForm=(req,resp)=>{
    resp.sendFile(path.join(__dirname , '../views/afterLogin.html'));

}
exports.postExpense = (req, resp) => {
  const userExpense = req.body.expense;
  const userDescription = req.body.description;
  const userCategory = req.body.category;

  if (!userExpense || !userDescription || !userCategory) {
    // Check if any of the required fields are missing
    return resp.status(400).json({ message: 'Missing required fields' });
  }

  LoginExpense.create({
    expense: userExpense,
    description: userDescription,
    category: userCategory
  })
    .then((result) => {
      console.log(result);
      resp.status(200).json({ message: 'Expense created successfully' });
    })
    .catch((err) => {
      console.log(err);
      resp.status(500).json({ message: 'Error creating expense' });
    });
};

  exports.showUser = (req, resp) => {
    LoginExpense.findAll()
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
    const userId = req.params.id;
  
    LoginExpense.destroy({
      where: {
        id: userId
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

  LoginExpense.findOne({ where: { id: userId } })
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