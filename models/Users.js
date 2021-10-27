var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
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
	orders: [{ type: String }],
	favorites: [{ type: String }],
	// orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders' }],
	// favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meals' }]
})

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

var User = mongoose.model('Users', userSchema);
=======
var User = mongoose.model('Users', userSchema)
>>>>>>> b3efbfd01cc9e41b92744c4b00e4864aedace473

module.exports = User
