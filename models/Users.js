var mongoose = require('mongoose');


var userSchema = mongoose.Schema({

    firstName: String,
    lastName: String,
    phoneNumber: String,
    adresse: [{ type: String }],
    email: String,
    password: String,
    token: String,
    allergies: [{ type: String }],
    regimeAlim: String,
    dont: [{ type: String }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders' }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meals' }]
});

var userModel = mongoose.model('Users', userSchema);

module.exports = userModel;