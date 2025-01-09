import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config();

const admin = process.env.admin;
const pass = process.env.adminPass

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: admin,
        pass: pass,
    },
});

export async function send(to: string, subject: string, text: string, html: string) {
    //    console.log('admin:adminPass:',admin,pass);
    //    console.log('to:subject:text:html:',to,subject,text,html);


    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: admin, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

// main().catch(console.error);
