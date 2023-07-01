const path = require('path');
const Expense = require('../models/data');
const bcrypt = require('bcrypt');


exports.showForm = (req, resp) => {

  resp.sendFile(path.join(__dirname, '../views/index.html'));
}


exports.postUser = (req, resp) => {
  const userName = req.body.name;
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  try {
    if (userName == undefined || userName.length === 0 || userEmail.length === 0 ||
      userEmail == undefined
      || userPassword.length === 0 || userPassword == undefined) {
      return resp.status(400).json({ err: "bad parameters" })
    }
    bcrypt.hash(userPassword, 10, async (err, hash) => {
      console.log(err)
      await Expense.create({
        name: userName,
        email: userEmail,
        password: hash
      })
      resp.status(201).json({ massage: 'user created successfully' });

    })
  }

  catch (err) {
    console.log('Error:', err);
    resp.status(500).json({ err: 'email already register' });
  };



}





exports.postUserLogin = async (req, resp) => {
  const userEmail = req.body.LoginEmail;
  const userPassword = req.body.LoginPassword;

  try {
    const user = await Expense.findOne({
      where: {
        email: userEmail
      }
    });

    if (!user) {
      return resp.status(404).json({ error: "User not found" });
    }

    bcrypt.compare(userPassword, user.password, (error, result) => {
      if (error) {
        return resp.status(500).json({ error: "Internal server error" });
      }

      if (!result) {
        return resp.status(401).json({ error: "Incorrect password" });
      }
      if(result==true){
       
      resp.status(200).json({ message: "User logged in successfully" });
      
      }
    });
  } catch (err) {
    console.log("Error:", err);
    resp.status(500).json({ error: "Internal server error" });
  }
};


