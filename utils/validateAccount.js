import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    "503135905501-iaqkouvkkee7msbi3r9k2mg5fa7t1eqv.apps.googleusercontent.com", // ClientID
    "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", // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: "1//04kwN1sOFVXUTCgYIARAAGAQSNwF-L9Ir-hy2zcxsg4iaaUMVciTHFJUStMIjcOySkVWZ1bqptlz8y_lYbFCrHuAm1NvRJSX7ReU"
});
const accessToken = oauth2Client.getAccessToken()


export const sendEmail = () => {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "matpet0412@gmail.com", 
            clientId: "503135905501-iaqkouvkkee7msbi3r9k2mg5fa7t1eqv.apps.googleusercontent.com",
            clientSecret: "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",
            refreshToken: "1//04kwN1sOFVXUTCgYIARAAGAQSNwF-L9Ir-hy2zcxsg4iaaUMVciTHFJUStMIjcOySkVWZ1bqptlz8y_lYbFCrHuAm1NvRJSX7ReU",
            accessToken: accessToken
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    
    var mailOptions = {
        from: 'matpet0412@gmail.com',
        to: 'matpet0412@gmail.com',
        subject: 'Sending Email using Node.js',
        html: `<h1>Test</h1>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    })
};