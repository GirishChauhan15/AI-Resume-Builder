import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
    {
        universityName: {
            type: String,
            default: "University Name",
        },
        startDate: {
            type: String,
            default: "Start Date",
        },
        endDate: {
            type: String,
            default: "End Date",
        },
        degree: {
            type: String,
            default: "Degree",
        },
        major: {
            type: String,
            default: "Major",
        },
        description: {
            type: String,
            default: "Summarize your education in 2-3 lines. Include your degree, field of study, and any relevant skills or focus areas.",
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

export const Education = mongoose.model("Education", educationSchema);
