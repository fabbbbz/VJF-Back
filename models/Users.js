var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
<<<<<<< HEAD
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    password: String,
    token: String,
    adresse: [{ type: String }],
    allergies: [{ type: String }],
    regimeAlim: String,
    dont: [{ type: String }],
    // orders: [{ type: String }], // //testing purposes 
    // favorites: [{ type: String }],// //testing purposes 
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders' }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meals' }]
});
=======
	firstName: String,
	lastName: String,
	email: String,
	phone: String,
	password: String,
	token: String,
	adresse: [{ type: String }],
	allergies: [{ type: String }],
	regimeAlim: String,
	dont: [{ type: String }],
	orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders' }],
	favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meals' }],
})
>>>>>>> b68b94d8f75b29d71105e1fd6d6bffb92cf71945

var User = mongoose.model('Users', userSchema)

module.exports = User
