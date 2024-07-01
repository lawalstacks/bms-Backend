const User = require('../model/userModel')
const jwt = require('jsonwebtoken')
const protectedRoute = async(req, res, next)=>{
    try{

        const token = req.cookies.jwt;
        if(!token){
            res.status(400).json({error: "unauthorized"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        req.user = user;
        next();
    }catch (error){
        if(error.code==="ERR_HTTP_HEADERS_SENT") {
            return;
        }
        else{res.status(500)}
    }
}

module.exports = protectedRoute;