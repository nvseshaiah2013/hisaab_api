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
            <!DOCTYPE html>
            <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
                xmlns:o="urn:schemas-microsoft-com:office:office">
            
            <head>
                <meta charset="utf-8"> <!-- utf-8 works for most cases -->
                <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
                <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
                <meta name="x-apple-disable-message-reformatting">
            </head>
            
            <body>
                <div>
                    <h2 style="text-align: center;"> Please follow the password reset instructions </h2>
            
                    <p style="text-align: center; margin:1.5rem 0;"> If the requester was not you then please write to <a
                            href="mailto:hisaab.kitaab@gmail.com">hisaab.kitaab@gmail.com</a> . </p>
                    <div style='text-align : center;'>
                        <a href="${process.env.BASE_URL}/reset-password?reset-token=${token}" target="_blank"
                            style="padding:10px; color : white; background-color : blue;" rel="noopener noreferrer"> Reset Password </a>
                    </div>
                    <div style="text-align: center; margin:1.5rem;">
                        If the above button does not work then follow the link
                        ${process.env.BASE_URL}/reset-password?reset-token=${token}
                    </div>
                </div>
            </body>
            
            </html>
            `
        });
    
        console.log('message sent %s', info.messageId);
    } catch (error) {
        console.log(error)
    }
}