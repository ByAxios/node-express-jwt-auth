const User = require('../models/User')
const jwt = require('jsonwebtoken')
const JWT_SECRET = "!=IzgnBV0QW8f#kKC5bNXjKhLQ#8pt9L5#5}lNgz/Mjk%U0wyK.icVzkKa?bkCe/"

//* Handle Errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' }
    if (err.code == 11000) {
        errors.email = "This email already in use"
        return errors
    }
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}

//* JWT CRYPT
const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: maxAge
    });
}

exports.signup_get = (req, res) => {
    res.render('signup')
}
exports.login_get = (req, res) => {
    res.render('login')
}
exports.signup_post = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id)
        //? max age in seconds
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).send({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).send({ errors });

    }
}
exports.login_post = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id });
    } catch (error) {
        const err = handleErrors(error);
        res.status(400).json({});
    }
}


exports.logout_get = async (req, res) => {
    res.cookie('jwt', "", { maxAge: 1 })
    res.redirect("/")
}