const mongoose = require('mongoose')
const User = require('../models/Users')
const Order = require('../models/Orders')
const Meal = require('../models/Meals')

exports.makeOrder = async (req, res, next) => {
	try {
		console.log(req.body)
		const user = await User.findOne({ token: req.params.token })
		const meals = await Meal.find({
			regimAlim: { $in: user.regimAlim },
			mood: req.body.mood,
			price: { $gte: req.body.minprice, $lte: req.body.maxprice },
		})
		const selectedMeal = meals[Math.floor(Math.random() * meals.length)]

		const order = await Order.create({
			client: user._id,
			meals: selectedMeal._id,
			price: selectedMeal.price,
			date: Date.now(),
			status: 'pending',
		})

		// Update the user orders
		const updatedUser = await User.findByIdAndUpdate(
			user._id,
			{ $push: { orders: order._id } },
			{ new: true }
		)

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
