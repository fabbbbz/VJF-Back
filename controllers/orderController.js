const User = require('../models/Users')
const Order = require('../models/Orders')
const Meal = require('../models/Meals')
const Restaurant = require('../models/Restaurants')
const dotenv = require('dotenv')
const { getMaxListeners } = require('superagent')
dotenv.config({ path: './config.env' })
const stripeSK = (process.env.SECRET_KEY)
const stripe = require('stripe')(`${stripeSK}`)

const MAX_DISTANCE = 1000 // Distance max de livraison, en km

exports.makeOrder = async (req, res, next) => {
	try {
		// Make sure we have the data from the front
		if (!req.body.mood || !req.body.minprice) {
			res.json({ result: 'fail', message: 'Mood or Budget missing' })
			return
		}
		// Get the current user
		const user = await User.findOne({ token: req.params.token })
		if (!user) {
			res.statusCode = 400
			res.json({
				result: 'fail',
				message: 'Token not found. Cant find the user',
			})
			return
		}
		// make one array with his donts and allergies to compare with the meals ingredients
		const nogo = user.dont.concat(user.allergies) //make 1 array 
		// make everything lowercase
		const nogoLower = nogo.map(nogo => nogo.toLowerCase())
		// handle full random mood
		const mood =
			req.body.mood !== 'all'
				? req.body.mood
				: [
					'healthy',
					'soir de match',
					'comme chez maman',
					'cuisine du monde',
					'a partager',
				]

		const lng = req.body.coords.lat
		const lat = req.body.coords.lng
		const maxDistance = MAX_DISTANCE
		const radius = maxDistance / 6378.1 // radians (unit needed to use $centerSphere, dont ask!)

		// find all the meals that fit the user profile
		const meals = await Meal.find({
			regimeAlim: { $in: user.regimeAlim }, //$in = match 
			mood: { $in: mood },
			price: { $gte: req.body.minprice, $lte: req.body.maxprice }, // gte=plus grand que | lte = plus petit que 
			ingredients: { $nin: nogoLower }, //$nin = dont match 
			_id: { $nin: user.blacklist },
		}).populate({
			path: 'restaurants',
			// populate only matches restaurants 
			match: {
				location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }, //$geoWithin = method mongo related to Restaurant Model
			},
		})

		// Filter to keep only the meals who got their restaurant populated
		const nearbyMeals = meals.filter(meal => meal.restaurants !== null)

		// select one random meal among the returned meals
		const selectedMeal =
			nearbyMeals[Math.floor(Math.random() * nearbyMeals.length)]

		// handle case when no meal fits all the criteria
		if (!selectedMeal) {
			res.json({ result: 'success', message: 'no meal fits' })
			return
		}
		// add a new order to the Order collection
		const order = await Order.create({
			client: user._id,
			meals: selectedMeal._id,
			price: selectedMeal.price,
			quantity: req.body.quantity,
			date: Date.now(),
			status: 'pending',
		})
		// Update the User orders
		const updatedUser = await User.findByIdAndUpdate(
			user._id,
			{ $push: { orders: order._id } },
			{ new: true } // Return the modified document
		)
		// Send to front
		res.json({ result: 'success', selectedMeal, order, updatedUser })
	} catch (err) {
		res.statusCode = 400
		res.json({ result: 'fail', err: err.message })
	}
}

exports.getOrder = async (req, res, next) => {
	try {
		const user = await User.findOne({ token: req.params.token })
		const currentOrder = user.orders[user.orders.length - 1] // get the last order pushed
		// CHECK IF USER HAS A LAST ORDER OR HAS NEVER ORDERED
		if (currentOrder === null) {
			res.json({ result: 'success', message: 'no order yet' })
			return
		}
		// populate le meal du current order & populate restaurant  du meal
		const orderDetails = await Order.findById(currentOrder).populate({
			path: 'meals',
			populate: {
				path: 'restaurants',
			},
		})
		if (orderDetails) {
			res.json({
				result: 'success',
				orderPrice: orderDetails.price,
				mealName: orderDetails.meals[0].name,
				restaurant: orderDetails.meals[0].restaurants.name,
				mealId: orderDetails.meals[0]._id,
				nbPortions: orderDetails.quantity,
			})
		}
	} catch (err) {
		res.statusCode = 400
		res.json({ result: 'fail', err: err.message })
	}
}

exports.updateOrder = async (req, res, next) => {
	try {
		const order = await Order.findByIdAndUpdate(
			req.params.id,
			{ status: 'paid' },
			{ new: true }
		)
		res.json({ result: 'success', order })
	} catch (err) {
		res.statusCode = 400
		res.json({ result: 'fail', err: err.message })
	}
}

exports.makeOrderInFav = async (req, res, next) => {
	try {
		// Get the current user
		const user = await User.findOne({ token: req.params.token })
			.populate('favorites')
		if (!user) {
			res.json({
				result: 'fail',
				message: 'Token not found. Cant find the user',
			})
			return // whaaaat 
		}
		//const meals = await user.populate('favorites')
		// Get meals from favorites
		const favmeals = user.favorites
		// Select one random meal among the returned meals
		const selectedMeal = favmeals[Math.floor(Math.random() * favmeals.length)]
		// Handle case when no meal fits all the criteria
		if (!selectedMeal) {
			res.json({
				result: 'error',
				message: 'impossible to random in favorites',
			})
			return
		}
		// add a new order to the Order collection
		const order = await Order.create({
			client: user._id,
			meals: selectedMeal._id,
			price: selectedMeal.price,
			quantity: req.body.quantity,
			date: Date.now(),
			status: 'pending',
		})
		// Update the User orders
		const updatedUser = await User.findByIdAndUpdate(
			user._id,
			{ $push: { orders: order._id } },
			{ new: true }
		)
		// Send to front
		res.json({ result: 'success', selectedMeal, order, updatedUser })
	} catch (err) {
		res.statusCode = 400
		res.json({ result: 'fail', err: err.message })
	}
}

exports.payment = async (req, res, next) => {
	try {
		var prix = req.body.price * 100 //centime => euro 

		const customer = {
			name: 'Fab', //req.body.name,
			email: 'fabienlegrave@gmail.com',  //req.body.email,
		};
		const paiement = {
			payment_method: ['card'],
			amount: prix,
			currency: "eur",
			description: "Vite j'ai faim World Company"
		};

		const customerInfo = await stripe.customers.create(customer);
		const paymentIntent = await stripe.paymentIntents.create(paiement);
		res.send({
			clientSecret: paymentIntent.client_secret,
		});
	} catch (error) {
		return res.status(400).send({
			error: {
				result: 'fail',
				message: error.message,
			},
		});
	}
}

