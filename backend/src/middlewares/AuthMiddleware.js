import { Auth } from "../models/auth.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import IsFieldValid from "../utils/IsFieldValid.js";
import jwt from 'jsonwebtoken'

const AuthMiddleware = asyncHandler(async(req, res, next) =>{
    try {
        let token = req.headers.authorization;

        let accessToken = token?.split(' ')[1]

        let isToken = IsFieldValid(accessToken)
    
        if(!isToken) {
            throw new ApiError(res, 401, "Access token is missing.") 
        }
    
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

        if(!decodedToken) throw new ApiError(res,401, "Unauthorized Request.")

        const user = await Auth.findById({_id: decodedToken?.userId})
        if(!user) {
            throw new ApiError(res, 403, "Access token is expired.") 
        }

        const userInfo = await Auth.findById({_id: user?._id}).select('-password -refreshToken')

        req.user = userInfo
        next()
    } catch (error) {
            throw new ApiError(res, 401, "Forbidden access.") 
    }
})

export default AuthMiddleware
