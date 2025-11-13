import express from 'express'
import userAuth from '../middlewares/authMiddleware'
import { submitCareerGps } from '../controllers/careerGpsController'

const routes = express.Router()

routes.post("/submit", userAuth, submitCareerGps)

export default routes