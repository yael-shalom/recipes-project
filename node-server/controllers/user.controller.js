const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User, generateToken, userValidator } = require('../models/user.model')
//new user singUp -הרשמה 
exports.signUp = async (req, res, next) => {
    //    const {username,email,password,role,address}=req.body;
    const { username, email, password, address } = req.body;
    role = 'registered user'
    const existUser = await User.findOne({ email: email })

    if (existUser)
        return next({ message: 'cant insert exist user', status: 409 });

    const AllUsers = await User.find();
    for (let u of AllUsers) {
        let IsSamePassword = await bcrypt.compare(password, u.password);
        if (IsSamePassword)
            return next({ message: 'cant insert exist user', status: 409 });

    }

    try {
        const user = new User({ username, email, password, role, address })
        await user.save();
        const token = generateToken(user);
        user.password = '****'
        return res.status(201).json({ _id: user._id, username: user.username, token });

    } catch (error) {
        next({ message: error.message, status: 409 })
    }
}
// התחברות 
exports.signIn = async (req, res, next) => {
    const valid = userValidator.logInSchema.validate(req.body)
    if (valid.error)
        return next({ message: valid.error.message });

    const { password, email } = req.body;
    const user = await User.findOne({ email })

    if (user) {
        bcrypt.compare(password, user.password, (err, same) => {
            if (err) {
                return next(new Error(err.message))
            }
            if (same) {
                const token = generateToken(user)
                user.password = '****'
                return res.send({ _id: user._id, username: user.username, token })
            }
            //החזרת תשובה כללית מטעמי אבטחה
            return next({ message: 'Auth Failed  (details are not correct)', status: 401 })
        })

    }
    else {
        // user does not exist 
        return next({ message: 'Auth Failed ( user does not exist )', status: 401 })
    }


}

exports.getAllUsers = async (req, res, next) => {

    try {
        const user = await User.find().select('-__v');
        user.forEach(element => {
            element.password = '****'
        });

        return res.json(user);
    } catch (error) {
        next({ message: error.message, status: 401 })
    }

}