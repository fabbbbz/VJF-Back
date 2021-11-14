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
	getAllergies,
	delAllergies,
	updateUserAddress,
	addToBlacklist,
	donts,
	adddonts,
	deletedonts,
	updateDiet,
} = require('../controllers/userController')

//Route for Sign-Up
router.post('/sign-up', signUp)
//Route for Sign-In
router.post('/sign-in', signIn)
//Routes for User Profile
router.get('/favorites/:token', favorites)
router.post('/favorites', favoritesAdd)
router.delete('/favorites/:token/:meal_id', favoritesDel)
router.post('/update-useraddress/:token', updateUserAddress)
router.put('/update-me/:token', updateUser)
router.get('/me/:token', getUserInfo)
router.get('/history/:token', history)
router.get('/allergies/:token/', getAllergies)
router.delete('/delallergies/:token/:allergy', delAllergies)
router.get('/myDonts/:token', donts)
router.put('/update-diet', updateDiet)

// gestion Blacklist
router.put('/blacklist/:token', addToBlacklist)

router.post('/adddonts/:token', adddonts)
router.delete('/deletedonts/:token/:dont', deletedonts)
module.exports = router
