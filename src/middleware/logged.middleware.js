import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
async function loggedinuser(req,res,next){
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({success:false, message:"Unauthorized"});
        }
        const decodedToken = jwt.verify(token,process.env.jwt_secret);
        const user = await User.findById(decodedToken._id);
        if(!user){
            return res.status(404).json({success:false, message:"User not found"});
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({success:false, message:error.message});
    }
}

export default loggedinuser;