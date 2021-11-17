const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
)

const options = {
	connectTimeoutMS: 5000,
	useNewUrlParser: true,
	useUnifiedTopology: true,
}

mongoose
	.connect(DB, options)
	.then(() => {
		console.log('DB connection successful')
	})
	.catch(err => {
		console.log(err.message)
		process.exit(1)
	})
