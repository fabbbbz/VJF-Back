var mongoose = require('mongoose');


var userSchema = mongoose.Schema({

    firstName: String,
    lastName: String,
    phoneNumber: String,
    adresse: [{ type: String }],
    email: String,
    password: String,
    token: String,
    allergies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'allergies' }],
    regimeAlim: [{ type: String }],
    dont: [{ type: mongoose.Schema.Types.ObjectId, ref: 'donts' }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'orders' }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'foods' }]
});

var userModel = mongoose.model('Users', userSchema);

module.exports = userModel;