import express from 'express'
import { getUsers, loginUser, registerUser, sendOtp, verifyOtpHandler } from '../controllers/authController'
import userAuth from '../middlewares/authMiddleware'

const router = express.Router()

router.post('/register',registerUser)
router.post("/login",loginUser)
router.post('/send-otp',sendOtp)
router.post("/verify-otp",verifyOtpHandler)
router.get("/user",userAuth,getUsers)


export default router