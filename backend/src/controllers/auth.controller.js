import { Auth } from "../models/auth.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiRes from "../utils/ApiRes.js";
import IsFieldValid from "../utils/IsFieldValid.js";
import jwt from 'jsonwebtoken'

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'None', 
};
const generateAllTokens = async (userId) => {
    try {
        const userInfo = await Auth.findById({ _id: `${userId}` });
        let accessToken = userInfo.genAccessToken();
        let refreshToken = userInfo.genRefreshToken();
        if (refreshToken) {
            userInfo.refreshToken = refreshToken;
        }
        await userInfo.save({ validateBeforeSave: true });
        return { accessToken, refreshToken };
    } catch (error) {
        return false;
    }
};

const register = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    let allFields = IsFieldValid(email, password);

    if (!allFields) return new ApiError(res, 400, "All fields are required.");

    if (email) {
        const isEmailValid = emailRegex.test(email);
        if (!isEmailValid)
            return new ApiError(res, 400, "Enter a valid email address.");
    }

    if (password) {
        const isPasswordValid = passwordRegex.test(password);
        if (!isPasswordValid)
            return new ApiError(
                res,
                400,
                "Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character"
            );
    }

    const isUserPresent = await Auth.findOne({
        email: email?.toLowerCase().trim(),
    }).lean();

    if (isUserPresent)
        return new ApiError(res, 409, "Email already register, please login.");

    const user = await Auth.create({
        email: email?.toLowerCase().trim(),
        password,
    });

    if (!user)
        return new ApiError(
            res,
            500,
            "Failed to create a user, please try again."
        );

let { accessToken, refreshToken } = await generateAllTokens(
    user?._id
);

let isTokenGenerated = IsFieldValid(refreshToken, accessToken);
if (!isTokenGenerated)
    return new ApiError(res, 401, "failed to login, please try later.");

const userInfo = await Auth.findById({ _id: user?._id }).select("_id email").lean();

if(!userInfo) throw new ApiError(res, 400, "No user found.")

return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiRes(200, {...userInfo, accessToken}, "Login successfully"));
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const allFields = IsFieldValid(email, password);

    if (!allFields) return new ApiError(res, 400, "All fields are required.");

    let isUserValid = await Auth.findOne({
        email: email?.toLowerCase().trim(),
    });

    if (!isUserValid) return new ApiError(res, 400, "Invalid user credential.");

    let isPasswordMatch = await isUserValid.isPasswordCorrect(password);

    if (!isPasswordMatch)
        return new ApiError(res, 400, "Invalid user credential.");

    let { accessToken, refreshToken } = await generateAllTokens(
        isUserValid?._id
    );

    let isTokenGenerated = IsFieldValid(refreshToken, accessToken);
    if (!isTokenGenerated)
        return new ApiError(res, 401, "failed to login, please try later.");

    const userInfo = await Auth.findById({ _id: isUserValid?._id }).select("_id email").lean();
    
    if(!userInfo) throw new ApiError(res, 400, "No user found.")

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiRes(200, {...userInfo, accessToken}, "Login successfully"));
});

const logout = asyncHandler(async (req, res) => {
    const userId = req?.user?._id;

    const user = await Auth.findByIdAndUpdate(
        { _id: userId },
        {
            $unset: {
                refreshToken: 1,
            },
        },
        { new: true }
    ).select("-password").lean();
    
    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .json(new ApiRes(200, {}, "Logout successfully"));
});

const generateNewTokens = asyncHandler(async (req,res) => {

    const {refreshToken : oldRefreshToken} = req?.cookies

    let isToken = IsFieldValid(oldRefreshToken)
    
    if(!isToken) return new ApiError(res, 401, "Refresh token is missing.") 

    const decodedInfo = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET)

if(!decodedInfo) return new ApiError(res, 403, "Invalid token.") 

    const user = await Auth.findById({_id: decodedInfo?.userId}).lean()

    if(!user) return new ApiError(res, 403, "Refresh token is expired, please login.") 

    if(oldRefreshToken !== user?.refreshToken) return new ApiError(res, 401, "Token is expired or used.") 
   
    let { accessToken, refreshToken } = await generateAllTokens(
        user?._id
    );

    let isTokenGenerated = IsFieldValid(refreshToken, accessToken);
    if (!isTokenGenerated)
        return new ApiError(res, 500, "failed to generate new token, please login.");
    const userInfo = await Auth.findById({ _id: user?._id }).select("_id email").lean();
    
    if(!userInfo) throw new ApiError(res, 400, "No user found.")

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiRes(200, {...userInfo, accessToken}, "Token refreshed successfully."));
})

const getCurrentUser = asyncHandler(async(req,res)=>{
    const {refreshToken : oldRefreshToken} = req?.cookies

    let isToken = IsFieldValid(oldRefreshToken)
    
    if(!isToken) return new ApiError(res, 401, "Refresh token is missing.") 

    const decodedInfo = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
if(!decodedInfo) return new ApiError(res, 403, "Invalid token.") 

    const user = await Auth.findById({_id: decodedInfo?.userId})

    if(!user) return new ApiError(res, 403, "Refresh token is expired, please login.") 

    if(oldRefreshToken !== user?.refreshToken) return new ApiError(res, 401, "Token is expired or used.") 

        let accessToken = user.genAccessToken();
        if(!user) throw new ApiError(res, 400, "No user found.")
        const userInfo = await Auth.findById({ _id: user?._id }).select("_id email").lean();
        if(!userInfo) throw new ApiError(res, 400, "No user found.")
        if(!accessToken) throw new ApiError(res, 400, "Failed to generate token, retry.")
        
        return res.status(200).json(new ApiRes(200, {...userInfo, accessToken}))
})

export { register, login, logout, generateNewTokens, getCurrentUser };
