var express = require('express');
var router = express.Router();
const { signUp, signIn, favorites, favoritesAdd, favoritesDel } = require('../controllers/userController')

//Route for Sign-Up
router.post('/sign-up', signUp)
//Route for Sign-In
router.post('/sign-in', signIn)
router.get('/favorites/:token', favorites)
router.post('/favorites', favoritesAdd)
router.delete('/favorites/:token/:meal_id', favoritesDel)

module.exports = router
