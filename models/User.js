const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, "Please Enter Email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please Enter Valid Email Address"]
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Minimum length of password 6"],
        maxlength: [90, "Minimum length of password 30"]
    }
});

// Fire function after doc saved
userSchema.post('save', function (doc, next) {
    console.log('New User Was Created & Saved', doc);
    next();
})
// static methods for login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email })
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user;
        }
        throw Error("incorrect password")
    }
    throw Error("incorrect email")
};

// Fire function before doc saved
//? Hash password before saved

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    console.log("user about to be created", this);
    next()
})


const User = mongoose.model('user', userSchema)

module.exports = User;


