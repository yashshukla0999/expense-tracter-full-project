const express = require("express");
const app = express();
const path = require('path')
const cors = require('cors');
const sequelize = require('./util/database');

const User=require('./models/user')
const Expense = require("./models/expense");
const Order = require('./models/order');

const expenseRoutes = require('./routes/routes')
const premiumRoutes = require('./routes/premium')
const AfterLoginRoutes = require('./routes/adding-expense')
const purchaseRoutes = require('./routes/purchase')
const bodyParser = require("body-parser");
app.use(bodyParser.json({ extended: false }));






app.use(cors());

app.use(premiumRoutes);
 app.use(expenseRoutes);

 app.use(AfterLoginRoutes);
 app.use(purchaseRoutes)

 
 User.hasMany(Expense);
 Expense.belongsTo(User);
 
 User.hasMany(Order);
 Order.belongsTo(User);



sequelize.sync()
.then((result)=>{
    console.log('database connected');
    app.listen(9000);

})
.catch((err)=>{
    console.log(err)
})




