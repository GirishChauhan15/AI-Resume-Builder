import { Router } from 'express'
import { generateNewTokens, getCurrentUser, login, logout, register } from '../controllers/auth.controller.js'
import AuthMiddleware from '../middlewares/AuthMiddleware.js'

const router = Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(AuthMiddleware,logout)
router.route('/get-current-user').get(getCurrentUser)
router.route('/refresh-token').get(generateNewTokens)


export default router