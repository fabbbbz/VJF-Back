var mongoose = require('mongoose');


var restaurantsSchema = mongoose.Schema({

    name: String,
    lat: Number,
    lon: Number,
    meals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meals' }],
});

var restaurantsModel = mongoose.model('Restaurants', restaurantsSchema);

module.exports = restaurantsModel;