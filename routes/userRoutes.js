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

// SigIn SignUp
router.post('/sign-up', signUp)
router.post('/sign-in', signIn)
// Users Info
router.get('/me/:token', getUserInfo)
// History 
router.get('/history/:token', history)
// Update 
router.post('/update-useraddress/:token', updateUserAddress)
router.put('/update-me/:token', updateUser)
router.put('/update-diet', updateDiet)
// Allergies 
router.get('/allergies/:token/', getAllergies)
router.delete('/delallergies/:token/:allergy', delAllergies)
// Favorites 
router.get('/favorites/:token', favorites)
router.post('/favorites', favoritesAdd)
router.delete('/favorites/:token/:meal_id', favoritesDel)
// Blacklist
router.put('/blacklist/:token', addToBlacklist)
// Dont
router.post('/adddonts/:token', adddonts)
router.delete('/deletedonts/:token/:dont', deletedonts)
router.get('/myDonts/:token', donts)

module.exports = router