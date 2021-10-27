var mongoose = require('mongoose');


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
    // orders: [{ type: String }], // //testing purposes 
    // favorites: [{ type: String }],// //testing purposes 
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders' }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meals' }]
});

var User = mongoose.model('Users', userSchema);

module.exports = User;