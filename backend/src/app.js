import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import slowDown from 'express-slow-down'

const app = express()

const speedLimiter = slowDown({
  windowMs: 1 * 60 * 1000,
  delayAfter: 60,
  delayMs: (hits) => hits * 200,
  maxDelayMs: 1000,
});

app.use(speedLimiter);

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true,
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(cookieParser())

import authRouter from './routes/auth.route.js'
import resumeRouter from './routes/resume.route.js'

app.use('/api/v1/user', authRouter)
app.use('/api/v1/resume', resumeRouter)


export default app