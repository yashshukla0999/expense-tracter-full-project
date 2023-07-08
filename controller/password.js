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
            console.log(user+'asdfghjkl')
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
                html: `<a href="http://localhost:9000/forgot/${id}">Reset password</a>`,
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