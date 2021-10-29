const express = require('express')
const router = express.Router()
const {
	getOrder,
	makeOrder,
	updateOrder,
	pay,
} = require('../controllers/orderController')

// router.post('/pay', pay)
router.post('/recap/:token', makeOrder) // route used to generate meal (oui le nom est pourrave)
router.get('/recap/:token', getOrder)
router.put('/update-order/:id', updateOrder)

module.exports = router
