const uid2 = require('uid2')
const User = require('../models/Users')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validateEmail = require('../functions/validateEmails') //import function to check emails

exports.signUp = async (req, res, next) => {
	let result = false
	let token = null
	console.log('lastname ', req.body.lastNameFromFront)
	console.log('firstname ', req.body.firstNameFromFront)
	console.log('email ', req.body.emailFromFront)
	console.log('pass ', req.body.passwordFromFront)
	try {
		// Check if this user already exist
		let user = await User.findOne({ email: req.body.emailFromFront })
		if (user) {
			// if exist add error in catch
			throw Error('That user already exisits')
		}
		// Check if fields is correctly filled
		if (
			req.body.lastNameFromFront == '' ||
			req.body.firstNameFromFront == '' ||
			req.body.emailFromFront == '' ||
			req.body.passwordFromFront == ''
		) {
			// If field is missing add error is catch
			throw Error('Field is missing!')
		}
		// Check if email is correclty formated
		let checkmail = validateEmail(req.body.emailFromFront)
		if (checkmail === false) {
			// if email is not correct add error in catch
			throw Error('Your Email is not a valid Email adress')
		}
		// Get password from front & execute hash
		var hash = bcrypt.hashSync(req.body.passwordFromFront, 10)
		// Create new user in BDD
		var newUser = new User({
			firstName: req.body.firstNameFromFront,
			lastName: req.body.lastNameFromFront,
			email: req.body.emailFromFront,
			phone: req.body.phoneFromFront,
			password: hash,
			token: uid2(32),
			adresse: [req.body.adresse],
			allergies: [req.body.allergies],
			regimeAlim: req.body.regimeAlim,
			dont: [req.body.dont],
			//orders et favorites doivent recevoir des clées étrangeres, la bdd etant vide on recupère juste des datas depuis postman en attendant
			orders: [req.body.orders],
			favorites: [req.body.favorites],
		})
		// Save user in MongoDB
		saveUser = await newUser.save()
		if (saveUser) {
			result = true
			token = saveUser.token
		}
		// Response Object
		res.json({ result, saveUser, token })
		// Catch error & send to front
	} catch (err) {
		let error = err.message
		// Push error from catch
		console.log(err.message)
		// Response Object
		console.log(error)
		res.json({
			error,
		})
	}
}

exports.signIn = async (req, res, next) => {
	let user = null
	let result = false
	let token = null
	try {
		// Check if fields is correctly filled
		if (req.body.emailFromFront == '' || req.body.passwordFromFront == '') {
			// If field is missing add error is catch
			throw Error('Field is missing!')
		} else {
			user = await User.findOne({
				email: req.body.emailFromFront,
			})
		}
		if (user) {
			if (bcrypt.compareSync(req.body.passwordFromFront, user.password)) {
				result = true
				token = user.token
			} else {
				// Add error in catch
				throw Error('Bad password!')
			}
		} else {
			// Add error in catch
			throw Error('Bad Email!')
		}
		// Response Object
		res.json({ result, user, token })
	} catch (err) {
		// Catch error & send to front
		// Create error variable with err.message
		let error = err.message
		console.log(error)
		// Response Object
		res.json({
			status: 'fail',
			error,
		})
	}
}

exports.favorites = async (req, res, next) => {
	try {
		var userToken = await User.findOne({ token: req.params.token })
		var favorites = userToken // testing
		// bout de code utile sur des clés etrangères
		// var favorites = await User.
		//     findById(userToken)
		//     .populate('favorites')
		console.log(userToken)
		res.json({ result: 'success', favorites: favorites })

		res.json({ result: 'success', favorites: favorites })
	} catch (err) {
		// Catch error
		// console.log(err)
		res.json({ result: false, message: err.message })
	}
}

exports.favoritesAdd = async (req, res, next) => {
	try {
		var addFavorite = await User.updateOne(
			{ token: req.body.token },
			{ $push: { favorites: req.body.meal_id } }
		)

		res.json({ result: 'success', modified: addFavorite.modifiedCount })
	} catch (err) {
		res.json({ result: false, message: err.message })
	}
}

exports.favoritesDel = async (req, res, next) => {
	try {
		var updateFavorites = await User.updateOne(
			{ token: req.params.token },
			{ $pull: { favorites: req.params.meal_id } }
		)

		var favorites = await User.findOne({ token: req.params.token }).populate(
			'favorites'
		)
		res.json({ result: 'success', favorites: favorites })
	} catch (err) {
		// Catch error
		// console.log(err)
		res.json({ result: false, message: err.message })
	}
}

exports.updateUser = async (req, res, next) => {
	try {
		const { diet, dont, allergies } = req.body
		console.log(dont)

		const doc = await User.findOneAndUpdate(
			{ token: req.params.token },
			{ regimeAlim: diet, dont: dont, allergies: allergies },
			{ new: true }
		)
		if (!doc) {
			throw new Error("User could'n be updated")
		}
		res.json({ result: 'success', doc })
	} catch (err) {
		res.json({ result: false, message: err.message })
	}
}
