const User = require('../model/userModel')
const jwt = require('jsonwebtoken')

const protectedRoute = async(req, res, next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            res.status(401).json({error: "unauthorized"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        req.user = user;
        next();
    }catch (error){
        res.status(500).json({error:"error in signing in user"})
        console.log(error)
    }
}

module.exports = protectedRoute;