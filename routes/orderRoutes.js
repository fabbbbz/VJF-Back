//Route for Sign-Up
exports.signUp = async (req, res, next) => {
    try {
        // Check if this user already exisits
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            error.push('That user already exisits!')
            return res.status(400).send('That user already exisits!');
        }
        if (req.body.firstNameFromFront == ''
            || req.body.lastNameFromFront == ''
            || req.body.emailFromFront == ''
            || req.body.passwordFromFront == ''
            || req.body.phoneFromFront == ''

        ) {
            error.push('champs vides')
        }

        if (error.length == 0) {

            var hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
            var newUser = new userModel({
                firstName: req.body.firstNameFromFront,
                lastName: req.body.lastNameFromFront,
                email: req.body.emailFromFront,
                phone: req.body.phoneFromFront,
                password: hash,
                token: uid2(32),
            })

            saveUser = await newUser.save()


            if (saveUser) {
                result = true
                token = saveUser.token
            }
        }


        res.json({ result, saveUser, error, token })
    } catch (err) {
        // Catch error
        // console.log(err)
        // res.json({result:false, message:err.message})
    }
}



router.post('/', async (req, res) => {

    // Check if this user already exisits
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        error.push('That user already exisits!')
        return res.status(400).send('That user already exisits!');
    }
    if (req.body.firstNameFromFront == ''
        || req.body.lastNameFromFront == ''
        || req.body.emailFromFront == ''
        || req.body.passwordFromFront == ''
        || req.body.phoneFromFront == ''

    ) {
        error.push('champs vides')
    }

    if (error.length == 0) {

        var hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
        var newUser = new userModel({
            firstName: req.body.firstNameFromFront,
            lastName: req.body.lastNameFromFront,
            email: req.body.emailFromFront,
            phone: req.body.phoneFromFront,
            password: hash,
            token: uid2(32),
        })

        saveUser = await newUser.save()


        if (saveUser) {
            result = true
            token = saveUser.token
        }
    }


    res.json({ result, saveUser, error, token })
});