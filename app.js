const express = require("express");
const app = express();
const path = require('path')
const sequelize = require('./util/database');
const expenseRoutes = require('./routes/routes')
const bodyParser = require("body-parser");
app.use(bodyParser.json({ extended: false }));


const cors = require('cors');

app.use(cors());


 app.use(expenseRoutes);


 
sequelize.sync()
.then((result)=>{
    console.log('database connected');
    app.listen(9000);

})
.catch((err)=>{
    console.log(err)
})




