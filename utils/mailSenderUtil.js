const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

module.exports = async (userEmail, token) => {
    let username = process.env.BUSINESS_EMAIL;
    let password = process.env.BUSINESS_PASSWORD;

    let transporter = nodemailer.createTransport({
        host : 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth : {
            user : username,
            pass : password
        }
    });

    try {        
        let info = await transporter.sendMail({
            from : 'no.reply.hisaab.kitaab@gmail.com',
            to : userEmail,
            subject : 'Reset Your Hisaab Kitaab Account Password',
            text : "Test",
            html : `
                <div> 
                    <h2> Please follow the password reset instructions </h2>

                    <p> If the requester was not you then please write to hisaab.kitaab@gmail.com . </p>
                    <div style='text-align : center;'> 
                        <a href='${process.env.BASE_URL}/reset-password?reset-token=${token}' target='_blank'
                        style='padding:10px; color : white; background-color : blue;'
                        > Reset Password </a>
                    </div>
                    <div>
                    If the above button does not work then follow the link ${process.env.BASE_URL}/reset-password?reset-token=${token}
                    </div>
                </div>
            `
        });
    
        console.log('message sent %s', info.messageId);
    } catch (error) {
        console.log(error)
    }
}