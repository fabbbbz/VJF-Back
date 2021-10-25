var mongoose = require('mongoose');


var OrdersSchema = mongoose.Schema({
    client: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    meals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meals' }],
    date: Date,
    price: Number,

});

var OrdersModel = mongoose.model('Orders', OrdersSchema);

module.exports = OrdersModel;