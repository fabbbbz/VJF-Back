const mongoose = require('mongoose')
const User = require('../models/Users')
const Order = require('../models/Orders')
const Meal = require('../models/Meals')
const Restaurant = require('../models/Restaurants')

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

		// HARD CODED COORDINATES
		const lng = 48.887482
		const lat = 2.303685
		const maxDistance = 2
		const radius = maxDistance / 6378.1 // radians (unit needed to use $centerSphere, dont ask!)

		// find all the meals that fit the user profile
		const meals = await Meal.find({
			regimAlim: { $in: user.regimAlim },
			mood: { $in: mood },
			price: { $gte: req.body.minprice, $lte: req.body.maxprice },
			ingredients: { $nin: nogo },
		}).populate({
			path: 'restaurants',
			match: {
				location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
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
		const orderDetails = await Order.findById(currentOrder).populate({
			path: 'meals',
			populate: {
				path: 'restaurants',
			},
		})
		console.log('get my order')
		console.log(orderDetails)
		console.log('//////')
		console.log('restaurant:', orderDetails.meals[0].restaurants)
		if (orderDetails) {
			res.json({
				result: 'success',
				orderPrice: orderDetails.price,
				mealName: orderDetails.meals[0].name,
				restaurant: orderDetails.meals[0].restaurants.name,
			})
		}
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
