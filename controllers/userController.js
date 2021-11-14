const uid2 = require('uid2')
const User = require('../models/Users')
const Order = require('../models/Orders')
const bcrypt = require('bcrypt')
const validateEmail = require('../functions/validateEmails') //import function to check emails
const sendEmail = require('../functions/sendEmail') // import function to send emails

exports.signUp = async (req, res, next) => {
	let result = 'fail'
	let token = null
	try {
		// Check if this user already exist
		let user = await User.findOne({ email: req.body.emailFromFront })
		if (user) {
			// if exist add error in catch
			throw Error('That user already exists')
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
			//Génère une chaine de 32 caractères aléatoirement
			token: uid2(32),
			adresse: req.body.adresse,
			allergies: [req.body.allergies],
			regimeAlim: req.body.regimeAlim,
			// dont: [req.body.dont],
			// //orders et favorites doivent recevoir des clées étrangeres, la bdd etant vide on recupère juste des datas depuis postman en attendant
			// orders: [req.body.orders],
			// favorites: [req.body.favorites],
		})
		// Save user in MongoDB
		saveUser = await newUser.save()
		if (saveUser) {
			result = 'succes'
			token = saveUser.token
			// Send email
			const message = `Bonjour à toi jeune aventurier du goût ! Nous sommes ravis que tu aies choisi Vite J'ai Faim. Bon appétit ${saveUser.firstName}`
			await sendEmail({
				email: saveUser.email,
				subject: 'Bienvenue chez VJF!',
				message,
			})
		}
		// Response Object
		res.json({ result, saveUser, token })
		// Catch error & send to front
	} catch (err) {
		// Set status code
		res.statusCode = 400
		// Response Object
		res.json({
			message: err.message,
		})
	}
}

exports.signIn = async (req, res, next) => {
	let user = null
	let result = 'fail'
	let token = null
	try {
		// Check if fields is correctly filled
		if (req.body.emailFromFront == '' || req.body.passwordFromFront == '') {
			// If field is missing add error in catch
			throw Error('Field is missing!')
		} else {
			user = await User.findOne({
				email: req.body.emailFromFront,
			})
		}
		if (user) {
			if (bcrypt.compareSync(req.body.passwordFromFront, user.password)) {
				result = 'success'
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
		// Catch error & send to front
	} catch (err) {
		// Add error status
		res.statusCode = 400
		// Response Object
		res.json({
			status: 'fail',
			message: err.message
		})
	}
}

exports.getUserInfo = async (req, res, next) => {
	try {
		//Get User by token
		var user = await User.findOne({ token: req.params.token })
		var userInfo = {
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			phone: user.phone,
			token: user.token,
			adresse: user.adresse,
			allergies: user.allergies,
			dont: user.dont,
			orders: user.orders,
			favorites: user.favorites,
			regimeAlim: user.regimeAlim,
		}
		res.json({ result: 'success', userInfo })
	} catch (err) {
		res.statusCode = 400
		res.json({ result: 'fail', message: err.message })
	}
}

exports.favorites = async (req, res, next) => {
	try {
		//Get User by token
		var user = await User.findOne({ token: req.params.token })
		res.json({ result: 'success', favorites: user.favorites })
	} catch (err) {
		res.json({ result: 'fail', message: err.message })
	}
}

exports.favoritesAdd = async (req, res, next) => {
	try {
		const user = await User.findOneAndUpdate(
			{ token: req.body.token },
			{ $addToSet: { favorites: req.body.meal_id } },
		)
		res.json({ result: 'success', favorites: user.favorites })
	} catch (err) {
		res.statusCode = 400
		res.json({ result: 'fail', message: err.message })
	}
}

exports.favoritesDel = async (req, res, next) => {
	try {
		await User.updateOne(
			{ token: req.params.token },
			{ $pull: { favorites: req.params.meal_id } }
		)
		var user = await User.findOne({ token: req.params.token })
		res.json({ result: 'success', favorites: user.favorites })
	} catch (err) {
		res.statusCode = 400
		res.json({ result: 'fail', message: err.message })
	}
}

exports.updateUser = async (req, res, next) => {
	try {
		const { diet, dont, allergies } = req.body
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
		res.statusCode = 400
		res.json({ result: 'fail', message: err.message })
	}
}

exports.updateUserAddress = async (req, res, next) => {
	try {
		await User.findOneAndUpdate(
			{ token: req.params.token },
			{ adresse: req.body.address })
		res.json({ result: 'success', })
	} catch (err) {
		res.statusCode = 400
		res.json({ result: 'fail', message: err.message })
	}
}

exports.history = async (req, res, next) => {
	try {
		//Get User by token
		var user = await User.findOne({ token: req.params.token })
		var orders = await Order.find({ client: user._id }).populate('meals')
		var meals = orders.map((order, i) => {
			return {
				mealName: order.meals[0].name,
				date: order.date,
				mealId: order.meals[0]._id,
			}
		})
		res.json({ result: 'success', meals: meals })
	} catch (err) {
		res.statusCode = 400
		res.json({ result: 'fail', message: err.message })
	}
}

exports.getAllergies = async (req, res, next) => {
	try {
		//Get User by token
		var user = await User.findOne({ token: req.params.token })
		res.json({ result: 'success', allergies: user.allergies })
	} catch (err) {
		res.statusCode = 400
		res.json({ result: 'fail', message: err.message })
	}
}

exports.delAllergies = async (req, res, next) => {
	try {
		//Get User by token
		var user = await User.findOne({ token: req.params.token })
		var allergyList = user.allergies
		var allergies = allergyList.filter(element => element !== req.params.allergy)
		await User.updateOne(
			{ token: req.params.token },
			{ allergies: allergies }
		)
		res.json({ result: 'success', allergies: allergies })
	} catch (err) {
		res.statusCode = 400
		res.json({ result: 'fail', message: err.message })
	}
}

exports.donts = async (req, res, next) => {
	try {
		//Get User by token
		var user = await User.findOne({ token: req.params.token })
		res.json({ result: 'sucess', donts: user.dont })
	} catch (err) {
		res.statusCode = 400
		res.json({ result: 'fail', message: err.message })
	}
}

exports.addToBlacklist = async (req, res, next) => {
	try {
		const user = await User.findOneAndUpdate(
			{ token: req.params.token },
			{ $addToSet: { blacklist: req.body.mealId } },
			{ new: true }
		)
		res.json({ result: 'success', user })
	} catch (err) {
		res.statusCode = 400
		res.json({ result: 'fail', message: err.message })
	}
}

exports.adddonts = async (req, res, next) => {
	try {
		const updateDonts = await User.findOneAndUpdate(
			{ token: req.params.token },
			{ $push: { dont: req.body.dont } },
			{ new: true })
		res.json({ result: 'success', donts: updateDonts })
	} catch (err) {
		res.statusCode = 400
		res.json({ result: 'fail', message: err.message })
	}
}

exports.deletedonts = async (req, res, next) => {
	try {
		const updateDonts = await User.findOneAndUpdate(
			{ token: req.params.token },
			{ $pull: { dont: req.params.dont } },
			{ new: true }
		)
		res.json({ result: 'success', donts: updateDonts.dont })
	} catch (err) {
		res.statusCode = 400
		res.json({ result: 'fail', message: err.message })
	}
}
