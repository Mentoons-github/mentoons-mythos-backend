import express from 'express'
import userAuth from '../middlewares/authMiddleware'
import { assessmentSubmission, createAssessment, getAllAssessments, getAssessmentQuestion, getSingleSubmission } from '../controllers/assessmentController'

const routes = express.Router()

routes.post('/submit',userAuth,assessmentSubmission)
routes.post("/new-question", userAuth, createAssessment)
routes.get("/fetch/:name", userAuth,getAssessmentQuestion)
routes.get("/getall", userAuth, getAllAssessments)
routes.get('/getSingle/:submissionId', userAuth, getSingleSubmission)

export default routes 