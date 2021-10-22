const express = require('express')

// Get modules
const userRouter = require('./routes/userRoutes')
// const orderRouter = require('./routes/orderRoutes')

// start express app
const app = express()

// routers
// app.use('/', indexRouter)
app.use('/users', userRouter)
// app.use('/orders', oderRouter)

module.exports = app
