import nodeMailer from 'nodemailer';
import { google } from 'googleapis';

require('dotenv').config();

let adminEmail = process.env.MAIL_USER;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

//less secure app => on (google mail)
let sendMail = async (to, subject, htmlContent) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'huynhlx4@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        let options = await transporter.sendMail({
            from: '"Chat Room"' + adminEmail, //sender address
            to: to, //list of receviers
            subject: subject, //subject line
            html: htmlContent, //html body
            text: "Hello World?" //plain text body (có cái này mới gửi đc cho mail outlook)
        });
        console.log(options);
    } catch (error) {
        console.error(error);
    }
}

module.exports = sendMail; 
