const express = require('express')
const router = express.Router()
const {
	getOrder,
	makeOrder,
	updateOrder,
	makeOrderInFav,
	payment,
} = require('../controllers/orderController')
// route used to generate meal 
router.post('/recap/:token', makeOrder)
router.get('/recap/:token', getOrder)
router.put('/update-order/:id', updateOrder)
router.get('/makeorderinfav/:token', makeOrderInFav)
router.post('/payment', payment)
module.exports = router
