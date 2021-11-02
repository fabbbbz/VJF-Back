var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
	firstName: String,
	lastName: String,
	email: {
		type: String,
		unique: true,
		trim: true,
		lowercase: true,
	},
	phone: String,
	password: String,
	token: String,
	adresse: [{ type: String }],
	allergies: [{ type: String }],
	regimeAlim: {
		type: String,
		enum: {
			values: ['omni', 'vegetarian', 'vegan', 'halal', 'cacher'],
			message: 'Not a valid diet',
		},
		default: 'omni',
	},
	dont: [{ type: String }],
	orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders' }],
	favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meals' }],
	blacklist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meals' }],
})

var User = mongoose.model('Users', userSchema)

module.exports = User
