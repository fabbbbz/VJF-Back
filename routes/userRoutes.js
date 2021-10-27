var express = require('express')
var router = express.Router()
const {
	signUp,
	signIn,
	favorites,
	favoritesAdd,
	favoritesDel,
	updateUser,
<<<<<<< HEAD
	history,
=======
	getUserInfo,
>>>>>>> 6752d2c7df04010ab846deef03bda75ad2050fd8
} = require('../controllers/userController')

//Route for Sign-Up
router.post('/sign-up', signUp)
//Route for Sign-In
router.post('/sign-in', signIn)
router.get('/favorites/:token', favorites)
router.post('/favorites', favoritesAdd)
router.delete('/favorites/:token/:meal_id', favoritesDel)
router.put('/update-me/:token', updateUser)
<<<<<<< HEAD

router.get('/history/:token', history)

=======
router.get('/me/:token', getUserInfo)
>>>>>>> 6752d2c7df04010ab846deef03bda75ad2050fd8
module.exports = router
