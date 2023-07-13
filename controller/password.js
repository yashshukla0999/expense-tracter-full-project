
const uuid = require('uuid')
const SibApiV3Sdk = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");
// require("dotenv").config(); 
const dotenv = require('dotenv')
dotenv.config()

const path = require('path')
const User = require('../models/user')
const ForgotPassword = require('../models/forgotpassword');

const client = SibApiV3Sdk.ApiClient.instance;
const apikey = client.authentications["api-key"];
apikey.apiKey = process.env.SENGRID_API_KEY;


exports.showforgotPasswordForm = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forgot.html'))
}

exports.forgotPassword = async (req, res) => {
    console.log(req.body)
    try {
        console.log('yash'+req.body.email)
        const { email } = req.body
        const user = await User.findOne({
            where: { email }
        })
        console.log('inside forgoe=tfassword');
        console.log(user);
        console.log(user.email)
        if (user) {
            const id = uuid.v4()
            console.log(id)
            ForgotPassword.create({ id, userId: req.user, isactive: true })
                .catch(err => {
                    console.log(err)
                })
            const sendinblue = new SibApiV3Sdk.TransactionalEmailsApi();
            const sendSmtpemail = {
                to: [{ email }],
                sender: {
                    email: "anshul831904@gmail.com",
                    name: "yash",
                },
                subject: "reset your password",
                htmlContent: `<p>Hello,</p> 
                       <p>Please click the following link to reset your password:</p> 
                       <p><a href="http://localhost:9000/forgot/${id}">Reset password</a></p> 
                       <p>If you did not request a password reset, please ignore this email.</p> 
                       <p>Thank you!</p>`,
            }
            await sendinblue.sendTransacEmail(sendSmtpemail);
            return res.status(200).json({ message: "link has been send to reset password", success: true })
        }
        else {
            console.log('user doesnpt exist')
            return res.status(404).json('user does not exist')
        }
    } catch (err) {
        console.log(err)
        return res.json({ message: err, success: false })
    }
}

exports.showResetPasswordForm = async (req, res) => {
    // console.log(req.)
    try {
        const id = req.params.id
        const idExist = await ForgotPassword.findOne({
            where: {
                id,
                isactive: true
            }
        })
     
        res.sendFile(path.join(__dirname, '..', 'views', 'resetPassword.html'))
    } catch (err) {
        console.log(err)
    }
}

exports.updatePassword = async (req, res) => {
    try{
        const{id, confirmPassword} = req.body;
        const forgotdetails = await ForgotPassword.findOne({
            where:{
                id
            }
        })
        forgotdetails.update({
            isactive: false
        })
        const userId = forgotdetails.userId;
        const user = await User.findOne({
            where: {
                id: userId
            }
        })
        if(user){
            const saltrounds = 10;
            bcrypt.hash(confirmPassword, saltrounds, async(err, hash) => {
                await user.update({
                    password: hash
                })
                res.status(200).json({message: "password updated succesfully"})
                
            })
        }
        else{
            res.status(404).json({message : 'user does not exist', success: false})
        }
    }catch(err){
        console.log(err)
    }
}