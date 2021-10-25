const mongoose = require('mongoose')

const wishlistSchema = mongoose.Schema({
    title: String,
    urlToImage: String,
    description: String,
    content: String,
    lang: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
})

const wishlistModel = mongoose.model('wishlist', wishlistSchema)

module.exports = wishlistModel