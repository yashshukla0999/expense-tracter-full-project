const express = require("express");
const app = express();
const path = require('path')
const cors = require('cors');
const fs = require('fs');
const sequelize = require('./util/database');
const helmet  = require('helmet');
const compression  = require('compression')
const morgan =require('morgan')

const User=require('./models/user')
const Expense = require("./models/expense");
const Order = require('./models/order');
const Forgotpassword = require('./models/forgotpassword');
const DownloadUrl = require('./models/fileUrl')

const expenseRoutes = require('./routes/routes')
const premiumRoutes = require('./routes/premium')
const AfterLoginRoutes = require('./routes/adding-expense')
const purchaseRoutes = require('./routes/purchase')
const forgot = require('./routes/forgotPassword')

const bodyParser = require("body-parser");
app.use(bodyParser.json({ extended: false }));


const logStream = fs.createWriteStream(path.join(__dirname,'access.log'), { flags : 'a'})
//app.use(helmet());
app.use(compression());
app.use(morgan('combined',{ stream : logStream}))


app.use(cors());

app.use(premiumRoutes);
 app.use(expenseRoutes);
 app.use(forgot);
 app.use(AfterLoginRoutes);
 app.use(purchaseRoutes)



 User.hasMany(Expense);
 Expense.belongsTo(User);
 
 User.hasMany(Order);
 Order.belongsTo(User);

 User.hasMany(Forgotpassword);
 Forgotpassword.belongsTo(User);

 User.hasMany(DownloadUrl)
DownloadUrl.belongsTo(User)

sequelize.sync()
.then((result)=>{
    console.log('database connected');
    app.listen(9000);

})
.catch((err)=>{
    console.log(err)
})




