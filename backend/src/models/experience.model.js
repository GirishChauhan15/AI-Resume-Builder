import mongoose from "mongoose";


const experienceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            default: 'Job Title'
        },
        companyName: {
            type: String,
            default: 'Company Name'
        },
        city: {
            type: String,
            default: 'City'
        },
        state: {
            type: String,
            default: 'State'
        },
        startDate: {
            type: String,
            default: 'Start Date'
        },
        endDate: {
            type: String,
            default: 'End Date'
        },
        currentlyWorking: {
            type: String,
            default: false,
        },
        workSummary: {
            type: String,
            default: 'Briefly describe your background, key skills, and what you specialize in. Highlight your experience and how you can contribute to the role.'
        },
        resumeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
        }
    },
    { timestamps: true }
);

export const Experience = mongoose.model("Experience", experienceSchema);
