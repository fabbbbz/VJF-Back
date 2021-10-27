const express = require('express')
const router = express.Router()
const { getOrder, updateOrder, pay } = require('../controllers/orderController')

// router.post('/pay', pay)
router.post('/recap/:token', getOrder)
// router.put('/update-paiement-method', updatePaiement)

module.exports = router
