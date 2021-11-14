var express = require('express')
var router = express.Router()
const {
	testApp
} = require('../controllers/testApp')

router.get('/testapp', testApp)
router.get('/', testApp)
<<<<<<< HEAD
=======

>>>>>>> dbd18a15cec6c2f287b2c03934e766b8e8f8fc10
module.exports = router
