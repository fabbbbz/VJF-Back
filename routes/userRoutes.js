var express = require('express');
var router = express.Router();
const { signUp, signIn } = require('../controllers/userController')

//Route for Sign-Up
router.post('/sign-up', signUp)
//Route for Sign-In
router.post('/sign-in', signIn)

module.exports = router;