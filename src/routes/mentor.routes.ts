import express from 'express'
import userAuth from '../middlewares/authMiddleware'
import { submitMentorForm } from '../controllers/mentorController'

const routes = express.Router()

routes.post("/submit", userAuth, submitMentorForm)


export default routes