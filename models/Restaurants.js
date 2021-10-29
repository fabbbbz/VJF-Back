var mongoose = require('mongoose')

var restaurantsSchema = mongoose.Schema({
	name: String,
	location: {
		type: {
			type: String,
			default: 'Point',
			enum: ['Point'],
		},
		coordinates: [Number],
	},
	meals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meals' }],
})

var Restaurant = mongoose.model('Restaurant', restaurantsSchema)

module.exports = Restaurant
