var nodemailer = require('nodemailer');
require('dotenv').config();

function custom_send_Mail(recipient, subject, content) { /*, to = null*/
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });


    var mailOptions = {
        from: process.env.EMAIL,
        to: recipient,
        // to: to || process.env.EMAIL,
        // bcc: recipient,
        subject: subject,
        html: content
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = custom_send_Mail;