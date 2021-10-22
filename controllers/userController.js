const { json } = require('express')

exports.signUp = async (req, res, next) => {
	try {
		// Sign up process
	} catch (err) {
		// Catch error
		// console.log(err)
		// res.json({result:false, message:err.message})
	}
}

exports.login = async (req, res, next) => {
	try {
		// Login process
		res.json({ result: 'success' })
	} catch (err) {
		// Catch error
		// console.log(err)
		res.json({ result: false, message: err.message })
	}
}
