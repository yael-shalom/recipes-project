const jwt = require('jsonwebtoken')
exports.userAuth = (req, res, next) => {
    try {
        const { authorization } = req.headers;//extractin the token form the header
        const [, token] = authorization.split(' ');
        const privateKey = process.env.JWT_SECRET || 'JWT_SECRET';
        const data = jwt.verify(token, privateKey);
        req.user = data;
        if (!req.user.role == 'user' || !req.user.role == 'registered user')
            next({ message: 'no promission to invoke this function', status: 403 })
        next()//go the the router middlewares
    } catch (error) {
        next({ message: error, status: 401 })
    }

}


exports.getAuth = (req, res, next) => {
    try {
        const { authorization } = req.headers;//extractin the token form the header
        const [, token] = authorization.split(' ');
        const privateKey = process.env.JWT_SECRET || 'JWT_SECRET';
        const data = jwt.verify(token, privateKey);
        req.user = data;
        if (!req.user.role == 'user' || !req.user.role == 'registered user')
            next({ message: 'no promission to invoke this function', status: 403 })
        next()//go the the router middlewares
    } catch (error) {
        next()
    }

}