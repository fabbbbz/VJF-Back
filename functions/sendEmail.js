const nodemailer = require('nodemailer') // import nodemailer
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const sendEmail = async options => {
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD
		},
	})

	const mailOptions = {
		from: "Vite j'ai faim <0c0a73f715-5aadc8@inbox.mailtrap.io>",
		to: options.email,
		subject: options.subject,
		text: options.message,
	}

	await transporter.sendMail(mailOptions)
	console.log('hi from sendEmail')
}

module.exports = sendEmail
