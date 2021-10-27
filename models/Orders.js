var mongoose = require('mongoose')

var OrdersSchema = mongoose.Schema({
	client: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
	meals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meals' }],
	date: Date,
	price: Number,
	status: String,
})

<<<<<<< HEAD
var Order = mongoose.model('Orders', OrdersSchema);

module.exports = Order;
=======
var Order = mongoose.model('Orders', OrdersSchema)

module.exports = Order
>>>>>>> 6752d2c7df04010ab846deef03bda75ad2050fd8
