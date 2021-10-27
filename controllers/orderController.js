const mongoose = require('mongoose')
const User = require('../models/Users')
const Order = require('../models/Orders')
const Meal = require('../models/Meals')

exports.getOrder = async (req, res, next) => {
	try {
		const user = await User.findOne({ token: req.params.token })
		const meals = await Meal.find({
			regimAlim: { $in: user.regimAlim },
			mood: req.body.mood,
			price: { $gte: req.body.minprice, $lte: req.body.maxprice },
		})
		const selectedMeal = meals[Math.floor(Math.random() * meals.length)]

		res.json({ result: 'success', meals, selectedMeal })
	} catch (err) {
		res.json({ result: 'fail', err: err.message })
	}
}
