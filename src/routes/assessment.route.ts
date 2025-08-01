import express from 'express'
import userAuth from '../middlewares/authMiddleware'
import { assessmentSubmission } from '../controllers/assessmentController'

const routes = express.Router()

routes.post('/submit',userAuth,assessmentSubmission)

export default routes