var express = require('express')
var router = express.Router()
const {
	signUp,
	signIn,
	favorites,
	favoritesAdd,
	favoritesDel,
	updateUser,
	history,
	getUserInfo,
	donts,
} = require('../controllers/userController')

//Route for Sign-Up
router.post('/sign-up', signUp)
//Route for Sign-In
router.post('/sign-in', signIn)
router.get('/favorites/:token', favorites)
router.post('/favorites', favoritesAdd)
router.delete('/favorites/:token/:meal_id', favoritesDel)
router.put('/update-me/:token', updateUser)
router.get('/history/:token', history)
router.get('/me/:token', getUserInfo)
router.get('/myDonts/:token', donts)
module.exports = router
