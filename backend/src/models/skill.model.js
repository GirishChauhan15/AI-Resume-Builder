
import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name:{
        type:String,
        default:"Skill Name"
    },
    rating:{
        type:String,
        default:80
    },
    resumeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Resume"
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Auth"
    }
},{timestamps:true})

export const Skill = mongoose.model("Skill", skillSchema)