const path = require('path')
const Expense = require('../models/expense');
const { where } = require('sequelize');
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const sequelize = require('../util/database');
const AWS = require('aws-sdk');
const { response } = require('express');
const { error } = require('console');





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

exports.getAllUsers = async (req, res, next) => {
  const page = req.params.id
  const Items_Per_Page = parseInt(req.query.limit || 2);
  try {
    let count = await Expense.count({where: { userId: req.user.id}})

    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      offset: (page-1)*Items_Per_Page,
      limit: Items_Per_Page
    })  
    res.status(200).json({
      expenses,
      info: {
          currentPage: page,
          hasNextPage: count > page * Items_Per_Page,
          hasPreviousPage: page > 1,
          nextPage: +page + 1,
          previuosPage: +page - 1,
          lastPage: Math.ceil(count / Items_Per_Page) 
      }
  });
    // Expense.findAll({ where: { userId: req.user.id } }).then((expense) => {
    // res.status(201).json({ expense });
    // });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

exports.downloadExpense = async(req,resp)=>
{
  try{
  const expenses = await req.user.getExpenses();
 // console.log(expenses);
  const stringify = JSON.stringify(expenses);
  const userId = req.user.id;

  const fileName =`expense${userId}/${new Date()}.txt`;
  const fileUrl = await uploadToS3(stringify,fileName);
  console.log(fileUrl+'zxc,xmzczxmcmzcmmxxcm')
  resp.status(200).json({fileUrl,success:true})
  }
  catch{
    console.log(error);
    resp.status(500).json({fileUrl,success:false,error:error})
  }
}





function uploadToS3(data,fileName){
  const BUCKET_NAME ='expenseaws';
  const IAM_USER_NAME='AKIAYJN4DFRBBUELRYTF';
  const IAM_USER_SECRET ='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';

  let s3bucket = new AWS.S3({
    accessKeyId:IAM_USER_NAME,
    secretAccessKey:IAM_USER_SECRET,
  
  })


  var params ={
    Bucket:BUCKET_NAME,
    Key:fileName,
    Body:data,
    ACL:'public-read'
  }
console.log(params.Key+'asdfghjkl;')

return new Promise((resolve,reject)=>{
  s3bucket.upload(params,(err,response)=>{
    if(err){
      //console.log(params.Key)
      console.log(err,'something went wrong')
      reject(err);
    }
    else{
     // console.log(params.Key)
      console.log('success',response)
      resolve (response.Location);
    }
  })


})
  

}

























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