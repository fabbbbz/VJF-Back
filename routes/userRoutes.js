var express = require('express');
var router = express.Router();
const { signUp, signIn, favorites, favoritesAdd, favoritesDel } = require('../controllers/userController')

//Route for Sign-Up
router.post('/sign-up', signUp)
//Route for Sign-In
router.post('/sign-in', signIn)
router.get('/users/:id/favorites', favorites)
router.post('/users/:id/favorites', favoritesAdd)
router.delete('/users/:id/favorites', favoritesDel)

module.exports = router
