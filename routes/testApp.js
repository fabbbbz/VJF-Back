var express = require('express')
var router = express.Router()
const {
	testApp
} = require('../controllers/testApp')

router.get('/testapp', testApp)
router.get('/', testApp)
module.exports = router
