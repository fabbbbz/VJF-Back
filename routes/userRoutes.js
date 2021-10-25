var express = require('express');
var router = express.Router();
const { signUp, signIn } = require('../controllers/userController')

//Route for Sign-Up
router.post('/sign-up', signUp)
//Route for Sign-In
router.post('/sign-in', signIn)
//router.get('/users/:id/favorites', userController.favorites)
//router.post('/users/:id/favorites', userController.favoritesAdd)
//router.delete('/users/:id/favorites', userController.favoritesDel)

module.exports = router
