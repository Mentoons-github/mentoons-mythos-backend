import express from 'express'
import userAuth from '../middlewares/authMiddleware'
import { deleteReports, fetchReports, fetchSingleReports } from '../controllers/report-blockController'

const routes = express.Router()

routes.get('/reports', userAuth, fetchReports)
routes.get('/reports/:reportId', userAuth, fetchSingleReports)
routes.delete('/reports/:reportId', userAuth, deleteReports)

export default routes