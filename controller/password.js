const path = require('path');
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');

exports.showForm = (req, resp) => {

  resp.sendFile(path.join(__dirname, '../views/forgot.html'));
}




exports.forgotpassword = async (req, res) => {
    try {
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        if(user){
            const id = uuid.v4();
            console.log("UUIID generated >>>>>>>>>>>>>>>>>>",id)
            user.createForgotpassword({ id , active: true })
                .catch(err => {
                  console.log(err);
                    throw new Error(err)
                })

            sgMail.setApiKey("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")

            const msg = {
                to: email, // Change to your recipient
                from: 'anshul831904@gmail.com', // Change to your verified sender
                subject: 'Password reset',
                text: 'Click on below link to reset password',
               // html: `<a href="http://localhost:9000/forgot/${id}">Reset password</a>`,
            }

            sgMail
            .send(msg)
            .then((response) => {

                // console.log(response[0].statusCode)
                // console.log(response[0].headers)
                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

            })
            .catch((error) => {
              console.log(error)
                throw new Error(error);
            })

            //send mail
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

// exports.resetPassword = async (req, res, next) => {
//   try{
//     const forgetPasswordId =  req.params.id;
//     console.log("forgetPasswordId>>>>>>>>>>>>>>>",forgetPasswordId)
//     const forgotPasswordRequest = await ForgetPassword.findOne({ where : { id:forgetPasswordId}})
//     if(forgotPasswordRequest)
//     {
//       await ForgetPassword.update({ active: false},{where:{id:forgetPasswordId}});
  
//       const filePath = path.join(__dirname, '..', 'views', 'resetPassword', 'resetPassword.html');
//       console.log('filePath>>>>>>>>>>>', filePath);
//       fs.readFile(filePath, (err, data) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).send('Error loading file');
//         }
//         res.setHeader('Content-Type', 'text/html');
//         res.status(200).send(data);
//       });
//       }
//   }catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error });
//   }
  
//   }

// exports.updatePassword = async(req,res,next) =>{
//   try{
//     const resetId = req.params.id;
//     const password = req.body.passwordAdd;

//     if(!req.params.id){
//       res.status(400).json({message:"Reset Password ID missing"})
//     }
//     const forgotPasswordRequest =  await ForgetPassword.findOne({where:{id:resetId}})
//     console.log("forgotPasswordRequest>>>>>>>>>>>>>>>>",forgotPasswordRequest)
//     const userRequest = await User.findOne({where:{id:forgotPasswordRequest.userId}})
//     console.log("userRequest>>>>>>>>>>>>>>>>>>>>",userRequest)
//     if(userRequest){
//       const saltRound = 10;
//       bcrypt.hash(password,saltRound,async(error,hash) =>{
//         if(error){
//           console.log(error);
//           throw new Error(error);
//         }
//     await User.update({password: hash},{where:{id:userRequest.id}})
//     res.status(201).json({message: 'Successfuly update the new password'})})
//     }
//   }
//   catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error });
//   }

// }