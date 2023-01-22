const jwt = require("jsonwebtoken");
const User = require("../models/User")

exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt
    //Check is token exist ?
    if (token) {
        jwt.verify(token, "!=IzgnBV0QW8f#kKC5bNXjKhLQ#8pt9L5#5}lNgz/Mjk%U0wyK.icVzkKa?bkCe/", (err) => {
            if (err) {
                res.redirect("/login")
                console.log(err.message);
            } else {
                next()
            }
        })
    } else {
        res.redirect("/login")
    }
}

exports.checkUser =  (req, res, next) => {
    const token = req.cookies.jwt

    if (token) {
        jwt.verify(token, "!=IzgnBV0QW8f#kKC5bNXjKhLQ#8pt9L5#5}lNgz/Mjk%U0wyK.icVzkKa?bkCe/",async (err,decodedToken) => {
            if (err) {
                next()
                console.log(err.message);
                res.locals.user = null
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user
                next();
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}