import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    projectName:{
        type:String,
        default:"Project Name"
    },
    gitHubLink: {
        type:String,
        default: "GitHub Link"
    },
    projectDesc: {
        type: String,
        default: "Describe key projects in 2-3 lines. Include the project goal, technology used, and the outcome or impact."
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

export const Project = mongoose.model("Project", projectSchema)