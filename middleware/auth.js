const jwt = require('jsonwebtoken');
const User = require('../models/user')

exports.authenticate=(req,resp,next)=>{
    try{
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token,'efvmrwkvmwemrwemrkmvwrgkbrwgblkrwbrklgmblkrwmbrkmb')
        console.log('userID>>>>>>',user.userId)
        User.findByPk(user.userId).then(yash => {
           console.log(yash+'erajngeeeeeeeggggggggggggggggggggg')
            req.user = yash;
           
            next();
        })
        
        .catch((err)=>{
            console.log(err);
        })
    }
    catch(err){
        console.log(err);
        return resp.status(401)
    }
}
