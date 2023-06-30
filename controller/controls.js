const path = require('path');
const Expense = require('../models/data');


exports.showForm=(req,resp)=>{
    
    resp.sendFile(path.join(__dirname,'../views/index.html'));
    }


exports.postUser=(req,resp)=>{
    const userName = req.body.name;
    const userEmail = req.body.email;
    const userPassword=req.body.password;
    // Expense.findOne(
    //     { email: userEmail })
    // .then((existingUser) => {
    //   if (existingUser) {
    //     // Email already exists, send error response
    //     resp.status(403).send('Email already exists. Please use a different email.');
    //   } else {
        
        Expense.create({
          name: userName,
          email: userEmail,
          password: userPassword
        })
          .then((result) => {
            console.log(result);
            resp.sendStatus(200);
          })
          .catch((err) => {
            console.log('Error:', err);
            resp.sendStatus(500);
          });
      }
   // })
//     .catch((err) => {
//       console.log('Error:', err);
//       resp.sendStatus(500);
//     });

// }