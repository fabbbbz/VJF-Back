var mongoose = require('mongoose')

var mealsSchema = mongoose.Schema({
	name: String,
	restaurants: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
	price: Number,
	ingredients: [{ type: String }],
	regimeAlim: {
		type: [String],
		enum: {
			values: ['omni', 'vegetarian', 'vegan', 'halal', 'cacher'],
			message: 'Not a valid diet',
		},
	},
	mood: {
		type: [String],
		enum: {
			values: [
				'soir de match',
				'comme chez maman',
				'healthy',
				'a partager',
				'cuisine du monde',
			],
			message: 'Not a valid mood',
		},
	},
})

var Meal = mongoose.model('Meals', mealsSchema)

module.exports = Meal
