const uid2 = require('uid2')
const User = require('../models/userModel')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validateEmail = require('../functions/validateEmails') //import function to check emails

exports.signUp = async (req, res, next) => {
    let result = false
    let token = null
    console.log(req.body.lastnameFromFront)
    console.log(req.body.emailFromFront)
    console.log(req.body.passwordFromFront)
    try {
        // Check if this user already exist
        let user = await User.findOne({ email: req.body.emailFromFront });
        if (user) {
            // if exist add error in catch
            throw Error('That user already exisits');
        }
        // Check if fields is correctly filled
        if (req.body.lastNameFromFront == ''
            || req.body.emailFromFront == ''
            || req.body.passwordFromFront == ''
        ) {
            // If field is missing add error is catch 
            throw Error('Field is missing!');
        }
        // Check if email is correclty formated
        let checkmail = validateEmail(req.body.emailFromFront);
        if (checkmail === false) {
            // if email is not correct add error in catch
            throw Error('Your Email is not a valid Email adress');
        }
        // Get password from front & execute hash 
        var hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
        // Create new user in BDD
        var newUser = new User({
            firstName: req.body.firstNameFromFront,
            lastName: req.body.lastNameFromFront,
            email: req.body.emailFromFront,
            phone: req.body.phoneFromFront,
            password: hash,
            token: uid2(32),
        })
        // Save user in MongoDB
        saveUser = await newUser.save()
        if (saveUser) {
            result = true
            token = saveUser.token
        }
        // Response Object 
        res.json({ result, saveUser, token })
        // Catch error & send to front 
    } catch (err) {
        let error = err.message
        // Push error from catch 
        console.log(err.message)
        // Response Object 
        console.log(error)
        res.json({
            error
        })

    }
}

exports.signIn = async (req, res, next) => {
    let user = null
    let result = false
    let token = null
    try {
        // Check if fields is correctly filled
        if (
            req.body.emailFromFront == ''
            || req.body.passwordFromFront == ''
        ) {
            // If field is missing add error is catch 
            throw Error('Field is missing!');
        } else {
            user = await userModel.findOne({
                email: req.body.emailFromFront,
            })
        }
        if (user) {
            if (bcrypt.compareSync(req.body.passwordFromFront, user.password)) {
                result = succes
                token = user.token
            } else {
                // Add error in catch
                throw Error('Bad password!');
            }
        } else {
            // Add error in catch
            throw Error('Bad Email!');
        }
        // Response Object 
        res.json({ result, user, token })
    }
    // Catch error & send to front 
    catch (err) {
        // Create error variable with err.message 
        let error = err.message
        console.log(error)
        // Response Object 
        res.json({
            status: 'fail',
            error
        })
    }
}
