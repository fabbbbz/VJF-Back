const express = require('express')
const userController = require('./../controllers/userController')
var bcrypt = require('bcrypt');
var uid2 = require('uid2');
const router = express.Router()

// Routes
router.post('/signup', userController.signUp)
router.post('/login', userController.login)
router.get('/users/:id/favorites', userController.favorites)
router.post('/users/:id/favorites', userController.favoritesAdd)
router.delete('/users/:id/favorites', userController.favoritesDel)



module.exports = router
