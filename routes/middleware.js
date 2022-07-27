let User = require('../models/admin.model')
const jwt = require('jsonwebtoken');
const Authenticate = async (req, res, next) => {
    try{
        const token1 = req.cookies.jwtoken;
        if(!token1){throw new Error('Please login first')}
        const verifyToken = jwt.verify(token1, process.env.KEY);
        if(!verifyToken){throw new Error('User not found')}
        const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token":token1 });
        if(!rootUser){throw new Error('User not found')}
        req.rootUser=rootUser;
        next();
    }catch (err) {
        res.redirect('/login');
        console.log(err);
    }
}

module.exports = Authenticate;