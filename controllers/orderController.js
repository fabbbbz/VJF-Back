const mongoose = require('mongoose')
const User = require('../models/Users')
const Order = require('../models/Orders')
const Meal = require('../models/Meals')

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
			res.json({
				result: 'fail',
				message: 'Token not found. Cant find the user',
			})
			return
		}

		// make one array with his donts and allergies to compare with the meals ingredients
		const nogo = user.dont.concat(user.allergies)

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

		// find all the meals that fit the user profile
		const meals = await Meal.find({
			regimAlim: { $in: user.regimAlim },
			mood: { $in: mood },
			price: { $gte: req.body.minprice, $lte: req.body.maxprice },
			ingredients: { $nin: nogo },
		})

		// select one random meal among the returned meals
		const selectedMeal = meals[Math.floor(Math.random() * meals.length)]

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
		res.json({ result: 'fail', err: err.message })
	}
}

exports.getOrder = async (req, res, next) => {
	try {
		const user = await User.findOne({ token: req.params.token })
		const currentOrder = user.orders[user.orders.length - 1] // get the last order pushed
		const orderDetails = await Order.findById(currentOrder)
		console.log('get my order')
		res.json({ result: 'success', orderPrice: orderDetails.price })
	} catch (err) {
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
		res.json({ result: 'fail', err: err.message })
	}
}
