import { Resume } from "../models/resume.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiRes from "../utils/ApiRes.js";
import IsFieldValid from "../utils/IsFieldValid.js";
import { Experience } from "../models/experience.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import dayjs from "dayjs";
import { Education } from "../models/education.model.js";
import { Skill } from "../models/skill.model.js";
import { Project } from "../models/project.model.js";
import { Auth } from "../models/auth.model.js";

const createNewResume = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const { _id: userId } = req?.user;

    let isValidId = isValidObjectId(userId);

    if (!isValidId) throw new ApiError(res, 400, "Invalid user id.");

    const isDataValid = IsFieldValid(title);

    if (!isDataValid) throw new ApiError(res, 400, "All fields required.");

    const resumeCount = await Auth.findOne({ _id: userId }).lean();

    if (resumeCount?.resumes?.length < 3) {
        const createResume = await Resume.create({
            title,
            owner: userId,
        });

        if (!createResume)
            throw new ApiError(
                res,
                500,
                "Failed to create a resume, please try again."
            );

        const createExperience = await Experience.create({
            owner: userId,
            resumeId: createResume?._id,
        });

        const createEducation = await Education.create({
            owner: userId,
            resumeId: createResume?._id,
        });

        const createSkill = await Skill.create({
            owner: userId,
            resumeId: createResume?._id,
        });

        const createProject = await Project.create({
            owner: userId,
            resumeId: createResume?._id,
        });

        if (
            !createExperience ||
            !createEducation ||
            !createSkill ||
            !createProject
        ) {
            if (createProject) {
                await Project.findOneAndDelete({
                    $and: [{ _id: createProject?._id }, { owner: userId }],
                });
            }
            if (createSkill) {
                await Skill.findOneAndDelete({
                    $and: [{ _id: createSkill?._id }, { owner: userId }],
                });
            }
            if (createEducation) {
                await Education.findOneAndDelete({
                    $and: [{ _id: createEducation?._id }, { owner: userId }],
                });
            }
            if (createExperience) {
                await Experience.findOneAndDelete({
                    $and: [{ _id: createExperience?._id }, { owner: userId }],
                });
            }
            await Resume.findOneAndDelete({
                $and: [{ _id: createResume?._id }, { owner: userId }],
            });
            throw new ApiError(
                res,
                500,
                "Failed to create a resume template, please try later."
            );
        }

        const updateUserResume = await Resume.findOneAndUpdate(
            { $and: [{ _id: createResume?._id }, { owner: userId }] },
            {
                $push: {
                    experience: createExperience?._id,
                    education: createEducation?._id,
                    skills: createSkill?._id,
                    projects: createProject?._id,
                },
            },
            { new: true }
        ).lean();

        if (!updateUserResume) {
            await Project.findOneAndDelete({
                $and: [{ _id: createProject?._id }, { owner: userId }],
            });
            await Education.findOneAndDelete({
                $and: [{ _id: createEducation?._id }, { owner: userId }],
            });
            await Experience.findOneAndDelete({
                $and: [{ _id: createExperience?._id }, { owner: userId }],
            });
            await Skill.findOneAndDelete({
                $and: [{ _id: createSkill?._id }, { owner: userId }],
            });
            await Resume.findOneAndDelete({
                $and: [{ _id: createResume?._id }, { owner: userId }],
            });
            throw new ApiError(
                res,
                500,
                "Failed to create a resume template, please try later."
            );
        }

        const updateResumeCount = await Auth.findByIdAndUpdate({_id: userId},{
            $push :{
                resumes : updateUserResume?._id
            }
        },{new:true}).lean()

        return res
            .status(201)
            .json(
                new ApiRes(
                    201,
                    updateUserResume?._id,
                    "Resume created successfully."
                )
            );
    } else {
        throw new ApiError(res, 400, "Maximum of 3 resumes allowed.");
    }
});
const userResume = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;

    let isValidId = isValidObjectId(userId);

    if (!isValidId) throw new ApiError(res, 400, "Invalid user id.");

    const allUserResume = await Resume.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "experiences",
                localField: "experience",
                foreignField: "_id",
                as: "experience",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            companyName: 1,
                            city: 1,
                            state: 1,
                            startDate: 1,
                            endDate: 1,
                            currentlyWorking: 1,
                            workSummary: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "educations",
                localField: "education",
                foreignField: "_id",
                as: "education",
                pipeline: [
                    {
                        $project: {
                            universityName: 1,
                            startDate: 1,
                            endDate: 1,
                            degree: 1,
                            major: 1,
                            description: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "skills",
                localField: "skills",
                foreignField: "_id",
                as: "skills",
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            rating: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "projects",
                localField: "projects",
                foreignField: "_id",
                as: "projects",
                pipeline: [
                    {
                        $project: {
                            projectName: 1,
                            gitHubLink: 1,
                            projectDesc: 1,
                        },
                    },
                ],
            },
        },
        {
            $project: {
                title: 1,
                experience: 1,
                education: 1,
                skills: 1,
                firstName: 1,
                lastName: 1,
                jobTitle: 1,
                address: 1,
                phone: 1,
                email: 1,
                summary: 1,
                themeColor: 1,
                themeBorder: 1,
                themeBg: 1,
                projects: 1,
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiRes(
                200,
                allUserResume,
                "All Resume info fetched successfully."
            )
        );
});
const resumeBYId = asyncHandler(async (req, res) => {
    const { resumeId } = req?.params;

    let isValidId = isValidObjectId(resumeId);

    if (!isValidId) throw new ApiError(res, 400, "Invalid resume id.");

    const resumeInfo = await Resume.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(resumeId),
            },
        },
        {
            $lookup: {
                from: "experiences",
                localField: "experience",
                foreignField: "_id",
                as: "experience",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            companyName: 1,
                            city: 1,
                            state: 1,
                            startDate: 1,
                            endDate: 1,
                            currentlyWorking: 1,
                            workSummary: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "educations",
                localField: "education",
                foreignField: "_id",
                as: "education",
                pipeline: [
                    {
                        $project: {
                            universityName: 1,
                            startDate: 1,
                            endDate: 1,
                            degree: 1,
                            major: 1,
                            description: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "skills",
                localField: "skills",
                foreignField: "_id",
                as: "skills",
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            rating: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "projects",
                localField: "projects",
                foreignField: "_id",
                as: "projects",
                pipeline: [
                    {
                        $project: {
                            projectName: 1,
                            gitHubLink: 1,
                            projectDesc: 1,
                        },
                    },
                ],
            },
        },
        {
            $project: {
                title: 1,
                experience: 1,
                education: 1,
                skills: 1,
                firstName: 1,
                lastName: 1,
                jobTitle: 1,
                address: 1,
                phone: 1,
                email: 1,
                summary: 1,
                themeColor: 1,
                themeBorder: 1,
                themeBg: 1,
                projects: 1,
            },
        },
    ]);
    if (!resumeInfo?.length) throw new ApiError(res, 400, "Invalid resume id.");

    return res
        .status(200)
        .json(
            new ApiRes(200, resumeInfo[0], "Resume info fetched successfully.")
        );
});
const resumeBYIdProtected = asyncHandler(async (req, res) => {
    const { resumeId } = req?.params;
    const { _id: userId } = req.user;

    let isValidUserId = isValidObjectId(userId);

    if (!isValidUserId) throw new ApiError(res, 400, "Invalid user id.");

    let isValidId = isValidObjectId(resumeId);

    if (!isValidId) throw new ApiError(res, 400, "Invalid resume id.");

    const resumeInfo = await Resume.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(resumeId),
            },
        },
        {
            $lookup: {
                from: "experiences",
                localField: "experience",
                foreignField: "_id",
                as: "experience",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            companyName: 1,
                            city: 1,
                            state: 1,
                            startDate: 1,
                            endDate: 1,
                            currentlyWorking: 1,
                            workSummary: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "educations",
                localField: "education",
                foreignField: "_id",
                as: "education",
                pipeline: [
                    {
                        $project: {
                            universityName: 1,
                            startDate: 1,
                            endDate: 1,
                            degree: 1,
                            major: 1,
                            description: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "skills",
                localField: "skills",
                foreignField: "_id",
                as: "skills",
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            rating: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "projects",
                localField: "projects",
                foreignField: "_id",
                as: "projects",
                pipeline: [
                    {
                        $project: {
                            projectName: 1,
                            gitHubLink: 1,
                            projectDesc: 1,
                        },
                    },
                ],
            },
        },
        {
            $project: {
                title: 1,
                experience: 1,
                education: 1,
                skills: 1,
                firstName: 1,
                lastName: 1,
                jobTitle: 1,
                address: 1,
                phone: 1,
                email: 1,
                summary: 1,
                themeColor: 1,
                themeBorder: 1,
                themeBg: 1,
                projects: 1,
            },
        },
    ]);
    if (!resumeInfo?.length) throw new ApiError(res, 400, "Invalid resume id.");

    return res
        .status(200)
        .json(
            new ApiRes(200, resumeInfo[0], "Resume info fetched successfully.")
        );
});
const updateResume = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    const { resumeId } = req.params;
    const { experienceId, educationId, skillId, projectId } = req.query;

    let isValidUserId = isValidObjectId(userId);

    if (!isValidUserId) throw new ApiError(res, 400, "Invalid user id.");

    let isValidId = isValidObjectId(resumeId);

    if (!isValidId) throw new ApiError(res, 400, "Invalid resume id.");

    const {
        firstName,
        lastName,
        jobTitle,
        address,
        phone,
        email,
        summary,
        experience,
        education,
        skill,
        theme,
        project,
    } = req.body;

    let userData;
    if ((firstName, lastName, jobTitle, address, phone, email)) {
        let isDetailValid = IsFieldValid(
            firstName,
            lastName,
            jobTitle,
            address,
            phone,
            email
        );
        if (isDetailValid || !isDetailValid) {
            userData = null;
            if (!isDetailValid)
                throw new ApiError(res, 400, "All given details are required.");

            if (firstName?.length > 25) {
                throw new ApiError(
                    res,
                    400,
                    "First name exceeds maximum length."
                );
            } else if (lastName?.length > 25) {
                throw new ApiError(
                    res,
                    400,
                    "Last name exceeds maximum length."
                );
            } else if (jobTitle?.length > 80) {
                throw new ApiError(
                    res,
                    400,
                    "Job title exceeds maximum length."
                );
            } else if (address?.length > 80) {
                throw new ApiError(res, 400, "Address exceeds maximum length.");
            } else if (phone?.length > 15) {
                throw new ApiError(
                    res,
                    400,
                    "Phone number exceeds maximum length."
                );
            } else if (email?.length > 100) {
                throw new ApiError(res, 400, "Email exceeds maximum length.");
            }
            userData = { firstName, lastName, jobTitle, address, phone, email };
        }
    } else if (summary) {
        let isSummaryValid = IsFieldValid(summary);
        if (isSummaryValid || !isSummaryValid) {
            userData = null;
            if (!isSummaryValid)
                throw new ApiError(res, 400, "Summary detail is required.");

            if (summary?.length > 400) {
                throw new ApiError(res, 400, "Summary exceeds maximum length.");
            }
            userData = { summary };
        }
    } else if (experience) {
        let {
            title,
            companyName,
            city,
            state,
            startDate,
            endDate,
            workSummary,
        } = experience;

        let isExperienceValid = IsFieldValid(
            title,
            companyName,
            city,
            state,
            startDate,
            endDate,
            workSummary
        );
        if (isExperienceValid || !isExperienceValid) {
            userData = null;
            if (!isExperienceValid)
                throw new ApiError(res, 400, "All given details are required.");

            if (title?.length > 100) {
                throw new ApiError(res, 400, "Position Title exceeds maximum length.");
            } else if (companyName?.length > 100) {
                throw new ApiError(
                    res,
                    400,
                    "Company name exceeds maximum length."
                );
            } else if (city?.length > 35) {
                throw new ApiError(res, 400, "City name exceeds maximum length.");
            } else if (state?.length > 35) {
                throw new ApiError(res, 400, "State name exceeds maximum length.");
            } else if (startDate?.length > 10) {
                throw new ApiError(
                    res,
                    400,
                    "Start date exceeds maximum length."
                );
            } else if (endDate?.length > 10) {
                throw new ApiError(
                    res,
                    400,
                    "End date exceeds maximum length."
                );
            } else if (workSummary?.length > 400) {
                throw new ApiError(
                    res,
                    400,
                    "Work summary exceeds maximum length."
                );
            }
            userData = experience;
        }
    } else if (education) {
        let { universityName, startDate, endDate, degree, major, description } =
            education;

        let isEducationValid = IsFieldValid(
            universityName,
            startDate,
            endDate,
            degree,
            major,
            description
        );

        if (isEducationValid || !isEducationValid) {
            userData = null;
            if (!isEducationValid)
                throw new ApiError(res, 400, "All given details are required.");

            if (universityName?.length >= 150) {
                throw new ApiError(res, 400, "University name exceeds maximum length.");
            } else if (startDate?.length > 10) {
                throw new ApiError(res, 400, "Start date exceeds maximum length.");
            } else if (endDate?.length > 10) {
                throw new ApiError(res, 400, "End date exceeds maximum length.");
            } else if (degree?.length > 100) {
                throw new ApiError(res, 400, "Degree exceeds maximum length.");
            } else if (major?.length > 80) {
                throw new ApiError(res, 400, "Major exceeds maximum length.");
            } else if (description?.length > 200) {
                throw new ApiError(res, 400, "Description exceeds maximum length.");
            }
            userData = education;
        }
    } else if (skill) {
        let { name, rating } = skill;

        let isSkillValid = IsFieldValid(name, rating);

        if (isSkillValid || !isSkillValid) {
            userData = null;
            if (!isSkillValid)
                throw new ApiError(res, 400, "All given details are required.");

            if (name?.length >= 50) {
                throw new ApiError(res, 400, "Skill exceeds maximum length.");
            } 
            userData = skill;
        }
    } else if (theme) {
        let { themeColor, themeBg, themeBorder } = theme;

        let isThemeValid = IsFieldValid(themeColor, themeBg, themeBorder);

        if (isThemeValid || !isThemeValid) {
            userData = null;
            if (!isThemeValid)
                throw new ApiError(res, 400, "Invalid theme data, try later.");

            if (themeColor?.length >= 20) {
                throw new ApiError(res, 400, "Theme color exceeds maximum length.");
            } else if (themeBg?.length > 20) {
                throw new ApiError(res, 400, "Theme background exceeds maximum length.");
            } else if (themeBorder?.length > 20) {
                throw new ApiError(res, 400, "Theme border exceeds maximum length.");
            }

            userData = theme;
        }
    } else if (project) {
        let { projectName, gitHubLink, projectDesc } = project;

        let isProjectValid = IsFieldValid(projectName, gitHubLink, projectDesc);

        if (isProjectValid || !isProjectValid) {
            userData = null;
            if (!isProjectValid)
                throw new ApiError(res, 400, "All given details are required.");
            if (projectName?.length >= 100) {
                throw new ApiError(res, 400, "Project name exceeds maximum length.");
            } else if (gitHubLink?.length > 150) {
                throw new ApiError(res, 400, "GitHub link exceeds maximum length.");
            } else if (projectDesc?.length > 400) {
                throw new ApiError(res, 400, "Project description exceeds maximum length.");
            }
            userData = project;
        }
    }

    if (projectId && project && userData) {
        let isValidId = isValidObjectId(projectId);

        if (!isValidId) throw new ApiError(res, 400, "Invalid project Id.");

        const updateProjectInfo = await Project.findOneAndUpdate(
            {
                $and: [
                    { resumeId: resumeId },
                    { owner: userId },
                    { _id: projectId },
                ],
            },
            { ...userData },
            { new: true }
        ).lean();
        if (!updateProjectInfo)
            throw new ApiError(
                res,
                500,
                "Failed to update project info, try again."
            );
        return res.status(200).json(new ApiRes(200, {}, "Details updated."));
    }

    if (resumeId && theme && userData) {
        const updateResumeTheme = await Resume.findOneAndUpdate(
            { $and: [{ _id: resumeId }, { owner: userId }] },
            {
                ...userData,
            },
            { new: true }
        ).lean();

        if (!updateResumeTheme)
            throw new ApiError(res, 500, "Failed to update theme, try later");

        return res.status(200).json(new ApiRes(200, {}, "Details updated."));
    }

    if (skillId && skill && userData) {
        let isValidId = isValidObjectId(skillId);
        if (!isValidId) throw new ApiError(res, 400, "Invalid skill Id.");

        const updateSkill = await Skill.findOneAndUpdate(
            {
                $and: [
                    { _id: skillId },
                    { resumeId: resumeId },
                    { owner: userId },
                ],
            },
            { ...userData },
            { new: true }
        ).lean();

        if (!updateSkill)
            throw new ApiError(
                res,
                500,
                "Failed to update skill info, try again."
            );

        return res.status(200).json(new ApiRes(200, {}, "Details updated."));
    }

    if (educationId && education && userData) {
        let isValidId = isValidObjectId(educationId);

        if (!isValidId) throw new ApiError(res, 400, "Invalid education Id.");

        const updateEducation = await Education.findOneAndUpdate(
            {
                $and: [
                    { _id: educationId },
                    { resumeId: resumeId },
                    { owner: userId },
                ],
            },
            { ...userData },
            { new: true }
        ).lean();
        if (!updateEducation)
            throw new ApiError(
                res,
                500,
                "Failed to update education info, try again."
            );
        return res.status(200).json(new ApiRes(200, {}, "Details updated."));
    }

    if (experienceId && experience && userData) {
        let formattedEndDate = dayjs(userData?.endDate).format("YYYY/MM/DD");
        if (formattedEndDate === dayjs().format("YYYY/MM/DD")) {
            userData = { ...userData, currentlyWorking: true };
        } else {
            userData = { ...userData, currentlyWorking: false };
        }

        let isValidId = isValidObjectId(experienceId);

        if (!isValidId) throw new ApiError(res, 400, "Invalid experience Id.");

        const updateExperience = await Experience.findOneAndUpdate(
            {
                $and: [
                    { resumeId: resumeId },
                    { owner: userId },
                    { _id: experienceId },
                ],
            },
            { ...userData },
            { new: true }
        ).lean();
        if (!updateExperience)
            throw new ApiError(
                res,
                500,
                "Failed to update experience info, try again."
            );
        return res.status(200).json(new ApiRes(200, {}, "Details updated."));
    }

    if (
        (userData && !userData?.companyName,
        !userData?.universityName,
        !userData?.rating,
        !userData?.projectName)
    ) {
        const updateGivenResume = await Resume.findOneAndUpdate(
            { $and: [{ _id: resumeId }, { owner: userId }] },
            { ...userData },
            { new: true }
        ).lean();
        if (!updateGivenResume)
            throw new ApiError(res, 500, "Failed to update, try again.");
        return res.status(200).json(new ApiRes(200, {}, "Details updated."));
    } else {
        throw new ApiError(res, 400, "All given details are required.");
    }
});
const deleteExperience = asyncHandler(async (req, res) => {
    const { experienceId, resumeId } = req.params;
    const { _id: userId } = req?.user;

    let isExperienceIdValid = isValidObjectId(experienceId);

    if (!isExperienceIdValid)
        throw new ApiError(res, 400, "Invalid experience id.");

    let isValidId = isValidObjectId(resumeId);

    if (!isValidId) throw new ApiError(res, 400, "Invalid resume id.");

    let isValidUserId = isValidObjectId(userId);

    if (!isValidUserId) throw new ApiError(res, 400, "Invalid user Id.");

    const deletedExperience = await Experience.findOneAndDelete({
        $and: [{ _id: experienceId }, { owner: userId }],
    }).lean();
    if (!deletedExperience)
        throw new ApiError(res, 400, "Invalid experience Id.");

    const updateUserResume = await Resume.findOneAndUpdate(
        { $and: [{ _id: resumeId }, { owner: userId }] },
        {
            $pull: {
                experience: deletedExperience?._id,
            },
        },
        { new: true }
    ).lean();

    if (!updateUserResume)
        throw new ApiError(
            res,
            500,
            "Failed to remove experience info from resume."
        );

    return res.status(200).json(new ApiRes(200, {}, "Experience removed."));
});
const createNewExperience = asyncHandler(async (req, res) => {
    const { _id: userId } = req?.user;
    const { resumeId } = req?.params;

    let isValidUserId = isValidObjectId(userId);

    if (!isValidUserId) throw new ApiError(res, 400, "Invalid user Id.");

    let isValidId = isValidObjectId(resumeId);

    if (!isValidId) throw new ApiError(res, 400, "Invalid resume id.");

    const experienceCount = await Experience.find({
        $and: [{ owner: userId }, { resumeId }],
    }).lean();
    if (experienceCount?.length < 2) {
        const createExperience = await Experience.create({
            owner: userId,
            resumeId,
        });
        if (!createExperience)
            throw new ApiError(
                res,
                500,
                "Failed to create a experience template, please try later."
            );

        const updateUserResume = await Resume.findOneAndUpdate(
            { $and: [{ _id: resumeId }, { owner: userId }] },
            {
                $push: {
                    experience: createExperience?._id,
                },
            },
            { new: true }
        ).lean();

        if (!updateUserResume) {
            await Experience.findOneAndDelete({
                $and: [{ _id: createExperience?._id }, { owner: userId }],
            });
            throw new ApiError(
                res,
                500,
                "Failed to create a experience template, please try later."
            );
        }

        const experienceInfo = await Experience.findById({
            _id: createExperience?._id,
        }).select(
            " _id title companyName city state startDate endDate currentlyWorking workSummary "
        ).lean();

        if (!experienceInfo)
            throw new ApiError(
                res,
                500,
                "Experience information is temporarily unavailable, try later."
            );

        return res
            .status(201)
            .json(new ApiRes(201, experienceInfo, "Experience created successfully."));
    } else {
        throw new ApiError(res, 400, "Maximum of 2 experience info allowed.");
    }
});
const createEducation = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;
    const { _id: userId } = req?.user;

    let isValidId = isValidObjectId(resumeId);

    if (!isValidId) throw new ApiError(res, 400, "Invalid resume id.");

    let isValidUserId = isValidObjectId(userId);

    if (!isValidUserId) throw new ApiError(res, 400, "Invalid user id.");

    const educationCount = await Education.find({
        $and: [{ owner: userId }, { resumeId }],
    }).lean();

    if (educationCount?.length < 2) {
        const createNewEducation = await Education.create({
            resumeId,
            owner: userId,
        });
        if (!createNewEducation)
            throw new ApiError(
                res,
                500,
                "Failed to create a education template, please try later. "
            );

        const updateResumeEducationList = await Resume.findOneAndUpdate(
            { $and: [{ _id: resumeId }, { owner: userId }] },
            {
                $push: {
                    education: createNewEducation?._id,
                },
            },
            { new: true }
        ).lean();

        if (!updateResumeEducationList) {
            await Education.findOneAndDelete({
                $and: [{ _id: createNewEducation?._id }, { owner: userId }],
            });
            throw new ApiError(
                res,
                500,
                "Failed to create a education template, please try later."
            );
        }

        const educationInfo = await Education.findById({
            _id: createNewEducation?._id,
        }).select(
            " _id universityName startDate endDate degree major description "
        ).lean();
        if (!educationInfo)
            throw new ApiError(
                res,
                500,
                "Education information is temporarily unavailable, try later."
            );

        return res
            .status(201)
            .json(
                new ApiRes(201, educationInfo, "Education template created successfully.")
            );
    } else {
        throw new ApiError(res, 400, "Maximum of 2 education info allowed.");
    }
});
const deleteEducation = asyncHandler(async (req, res) => {
    const { resumeId, educationId } = req.params;
    const { _id: userId } = req?.user;

    let isEducationIdValid = isValidObjectId(educationId);

    if (!isEducationIdValid)
        throw new ApiError(res, 400, "Invalid education id.");

    let isValidId = isValidObjectId(resumeId);

    if (!isValidId) throw new ApiError(res, 400, "Invalid resume id.");

    let isValidUserId = isValidObjectId(userId);

    if (!isValidUserId) throw new ApiError(res, 400, "Invalid user id.");

    const deleteEducationInfo = await Education.findOneAndDelete({
        $and: [{ _id: educationId }, { owner: userId }],
    }).lean();

    if (!deleteEducationInfo)
        throw new ApiError(res, 400, "Invalid education Id.");

    const updateResumeEducationList = await Resume.findOneAndUpdate(
        { $and: [{ _id: resumeId }, { owner: userId }] },
        {
            $pull: {
                education: deleteEducationInfo?._id,
            },
        },
        { new: true }
    ).lean();

    if (!updateResumeEducationList)
        throw new ApiError(
            res,
            500,
            "Failed to remove education info from resume."
        );

    return res.status(200).json(new ApiRes(200, {}, "Education removed."));
});
const createSkill = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;
    const { _id: userId } = req?.user;

    let isValidId = isValidObjectId(resumeId);

    if (!isValidId) throw new ApiError(res, 400, "Invalid resume id.");

    let isValidUserId = isValidObjectId(resumeId);

    if (!isValidUserId) throw new ApiError(res, 400, "Invalid user id.");

    const skillCount = await Skill.find({
        $and: [{ owner: userId }, { resumeId }],
    }).lean();

    if (skillCount?.length < 4) {
        const createNewSkill = await Skill.create({
            resumeId,
            owner: userId,
        });

        if (!createNewSkill)
            throw new ApiError(
                res,
                500,
                "Failed to create a skill template, please try later."
            );

        const updateResumeSkillList = await Resume.findOneAndUpdate(
            { $and: [{ _id: resumeId }, { owner: userId }] },
            {
                $push: {
                    skills: createNewSkill?._id,
                },
            },
            { new: true }
        ).lean();

        if (!updateResumeSkillList) {
            await Skill.findOneAndDelete({
                $and: [{ _id: createNewSkill?._id }, { owner: userId }],
            });
            throw new ApiError(
                res,
                500,
                "Failed to create a skill template, please try later."
            );
        }

        const skillInfo = await Skill.findById({
            _id: createNewSkill?._id,
        }).select(" _id name rating ").lean();

        if (!skillInfo)
            throw new ApiError(
                res,
                500,
                "Skill information is temporarily unavailable, try later."
            );

        return res
            .status(201)
            .json(new ApiRes(201, skillInfo, "Skill template created successfully."));
    } else {
        throw new ApiError(res, 400, "Maximum of 4 skills allowed.");
    }
});
const deleteSkill = asyncHandler(async (req, res) => {
    const { resumeId, skillId } = req.params;
    const { _id: userId } = req?.user;

    let isSkillIdValid = isValidObjectId(skillId);

    if (!isSkillIdValid) throw new ApiError(res, 400, "Invalid skill id.");

    let isValidId = isValidObjectId(resumeId);

    if (!isValidId) throw new ApiError(res, 400, "Invalid resume id.");

    let isValidUserId = isValidObjectId(userId);

    if (!isValidUserId) throw new ApiError(res, 400, "Invalid user id.");

    const deleteSkillInfo = await Skill.findOneAndDelete({
        $and: [{ _id: skillId }, { owner: userId }],
    }).lean();

    if (!deleteSkillInfo) throw new ApiError(res, 400, "Invalid skill Id.");

    const updateResumeSkillList = await Resume.findOneAndUpdate(
        { $and: [{ _id: resumeId }, { owner: userId }] },
        {
            $pull: {
                skills: deleteSkillInfo?._id,
            },
        },
        { new: true }
    ).lean();

    if (!updateResumeSkillList)
        throw new ApiError(
            res,
            500,
            "Failed to remove skill info from resume."
        );

    return res.status(200).json(new ApiRes(200, {}, "Skill removed."));
});
const createProject = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;
    const { _id: userId } = req?.user;

    let isValidId = isValidObjectId(resumeId);

    if (!isValidId) throw new ApiError(res, 400, "Invalid resume id.");

    let isValidUserId = isValidObjectId(userId);

    if (!isValidUserId) throw new ApiError(res, 400, "Invalid user id.");

    const projectCount = await Project.find({
        $and: [{ owner: userId }, { resumeId: resumeId }],
    }).lean();

    if (projectCount?.length < 2) {
        const createNewProject = await Project.create({
            resumeId,
            owner: userId,
        });
        if (!createNewProject)
            throw new ApiError(
                res,
                500,
                "Failed to create a project template, please try later."
            );

        const updateResumeProjectList = await Resume.findOneAndUpdate(
            { $and: [{ _id: resumeId }, { owner: userId }] },
            {
                $push: {
                    projects: createNewProject?._id,
                },
            },
            { new: true }
        ).lean();

        if (!updateResumeProjectList) {
            await Project.findOneAndDelete({
                $and: [{ _id: createNewProject?._id }, { owner: userId }],
            });
            throw new ApiError(
                res,
                500,
                "Failed to create a project template, please try later."
            );
        }

        const projectInfo = await Project.findById({
            _id: createNewProject?._id,
        }).select(" _id projectName gitHubLink projectDesc ").lean();

        if (!projectInfo)
            throw new ApiError(
                res,
                500,
                "Project information is temporarily unavailable, try later."
            );

        return res
            .status(201)
            .json(
                new ApiRes(201, projectInfo, "Project template created successfully.")
            );
    } else {
        throw new ApiError(res, 400, "Maximum of 2 project allowed.");
    }
});
const deleteProject = asyncHandler(async (req, res) => {
    const { resumeId, projectId } = req.params;
    const { _id: userId } = req?.user;

    let isProjectIdValid = isValidObjectId(projectId);

    if (!isProjectIdValid) throw new ApiError(res, 400, "Invalid project id.");

    let isValidId = isValidObjectId(resumeId);

    if (!isValidId) throw new ApiError(res, 400, "Invalid resume id.");

    let isValidUserId = isValidObjectId(userId);

    if (!isValidUserId) throw new ApiError(res, 400, "Invalid user id.");

    const deleteProjectInfo = await Project.findOneAndDelete({
        $and: [{ _id: projectId }, { owner: userId }],
    }).lean();

    if (!deleteProjectInfo) throw new ApiError(res, 400, "Invalid project Id.");

    const updateResumeProjectList = await Resume.findOneAndUpdate(
        { $and: [{ _id: resumeId }, { owner: userId }] },
        {
            $pull: {
                projects: deleteProjectInfo?._id,
            },
        },
        { new: true }
    ).lean();

    if (!updateResumeProjectList)
        throw new ApiError(
            res,
            500,
            "Failed to remove project info from resume."
        );

    return res.status(200).json(new ApiRes(200, {}, "Project removed."));
});
const deleteResume = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    const { resumeId } = req.params;

    let isValidUserId = isValidObjectId(userId);
    if (!isValidUserId) throw new ApiError(res, 400, "Invalid user id.");

    let isValidId = isValidObjectId(resumeId);
    if (!isValidId) throw new ApiError(res, 400, "Invalid resume id.");

    let resumeInfo = await Resume.findOneAndDelete({
        $and: [{ _id: resumeId }, { owner: userId }],
    }).lean();

    if (!resumeInfo) throw new ApiError(res, 400, "Invalid resume id.");

    return res.status(200).json(new ApiRes(200, {}, "Resume info deleted."));
});

export {
    createNewResume,
    userResume,
    updateResume,
    deleteExperience,
    resumeBYId,
    createNewExperience,
    createEducation,
    deleteEducation,
    createSkill,
    deleteSkill,
    createProject,
    deleteProject,
    deleteResume,
    resumeBYIdProtected
};
