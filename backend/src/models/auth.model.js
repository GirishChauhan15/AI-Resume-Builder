import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const authSchema = new mongoose.Schema({
    email :{
        type: String,
        required : true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    refreshToken :{
        type : String,
    }, resumes :[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume"
        }
    ]
},{timestamps:true})

authSchema.pre('save', async function(next){
    if(!this.isModified('password')) {
        return next()
    }
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(this.password, salt)
    this.password = hash
    next()
})

authSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password || ' ')
}

authSchema.methods.genRefreshToken = function () {
    return jwt.sign({userId:this._id}, process.env.REFRESH_TOKEN_SECRET , {expiresIn: process.env.REFRESH_TOKEN_EXPIRY} )
}

authSchema.methods.genAccessToken = function () {
    return jwt.sign({userId:this._id}, process.env.ACCESS_TOKEN_SECRET , {expiresIn: process.env.ACCESS_TOKEN_EXPIRY} )
}

export const Auth = mongoose.model("Auth", authSchema)