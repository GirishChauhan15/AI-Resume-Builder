import { createEducation, createNewExperience, createNewResume, createProject, createSkill, deleteEducation, deleteExperience, deleteProject, deleteResume, deleteSkill, resumeBYId, updateResume, userResume, resumeBYIdProtected } from "../controllers/resume.controller.js";
import {Router} from "express"
import AuthMiddleware from '../middlewares/AuthMiddleware.js'

const router = Router()

router.route("/create-resume").post(AuthMiddleware, createNewResume)
router.route("/create-experience/:resumeId").post(AuthMiddleware, createNewExperience)
router.route("/create-education/:resumeId").post(AuthMiddleware, createEducation)
router.route("/create-skill/:resumeId").post(AuthMiddleware, createSkill)
router.route("/create-project/:resumeId").post(AuthMiddleware, createProject)

router.route("/all-resume").get(AuthMiddleware, userResume)
router.route("/:resumeId").get(resumeBYId)
router.route("/my-resume/:resumeId").get(AuthMiddleware, resumeBYIdProtected)

router.route("/update/:resumeId").patch(AuthMiddleware, updateResume)

router.route("/delete-experience/:resumeId/:experienceId").delete(AuthMiddleware, deleteExperience)
router.route("/delete-education/:resumeId/:educationId").delete(AuthMiddleware, deleteEducation)
router.route("/delete-skill/:resumeId/:skillId").delete(AuthMiddleware, deleteSkill)
router.route("/delete-project/:resumeId/:projectId").delete(AuthMiddleware, deleteProject)
router.route("/delete-resume/:resumeId").delete(AuthMiddleware, deleteResume)

export default router