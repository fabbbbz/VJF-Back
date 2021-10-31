const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config({ path: './config.env' })

const sendEmail = async options => {
	const transporter = nodemailer.createTransport({
		host: smtp.mailtrap.io, // REPLACE BY process.env.EMAIL_HOST
		port: 2525, // process.env.EMAIL_PORT
		auth: {
			user: 'ceb9a5dc362475', // EMAIL_USERNAME
			pass: 'e09e8bf5d0e9f8', // EMAIL_PASSWORD
		},
	})

	const mailOptions = {
		from: "Vite j'ai faim <0c0a73f715-5aadc8@inbox.mailtrap.io>",
		to: options.email,
		subject: options.subject,
		text: options.message,
		// html:
	}

	await transporter.sendMail(mailOptions)
	console.log('hi from sendEmail')
}

module.exports = sendEmail
