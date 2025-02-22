import mongoose from 'mongoose'

const resumeSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Auth',
        required:true
    },
    firstName:{
        type:String,
        default: 'First Name',
    },
    lastName:{
        type:String,
        default: 'Last Name'
    },
    jobTitle:{
        type:String,
        default: 'Your Job Title'
    },
    address:{
        type:String,
        default: 'Your Address'
    },
    phone:{
        type:String,
        default: 'Your Phone'
    },
    email:{
        type:String,
        default: 'Your Email'
    },
    summary : {
        type:String,
        default: 'Outline your work experience by listing your roles and core responsibilities in 2-3 lines. Begin with your current or most recent position. Focus on key tasks, projects, and any notable accomplishments or results.'
    },
    experience :[{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Experience'
    }],
    education:[{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Education'
    }],
    skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill"
    }],
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }],
    themeColor:{
        type:String,
        default:"text-[#ff6666]"
    },
    themeBorder:{
        type:String,
        default:"border-[#ff6666]"
    },
    themeBg:{
        type:String,
        default:"bg-[#ff6666]"
    },
},{timestamps:true})

resumeSchema.pre('findOneAndDelete', async function (next) {
    try {
        const doc = await this.model.findOne(this.getQuery());

        const expDelete = await mongoose.model('Experience').deleteMany({
            _id: { $in: doc.experience }
        });

        const eduDelete = await mongoose.model('Education').deleteMany({
            _id: { $in: doc.education }
        });

        const skillDelete = await mongoose.model('Skill').deleteMany({
            _id: { $in: doc.skills }
        });

        const projDelete = await mongoose.model('Project').deleteMany({
            _id: { $in: doc.projects }
        });
        next();
    } catch (error) {
        next(error);
    }
});


export const Resume = mongoose.model('Resume', resumeSchema)