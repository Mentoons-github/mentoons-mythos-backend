import express from 'express'
import userAuth from '../middlewares/authMiddleware'
import { applyCareer } from '../controllers/careerController'

const routes = express.Router()

routes.post('/apply',userAuth, applyCareer)

export default routes