import express from 'express'
import userAuth from '../middlewares/authMiddleware'
import { availbleSlots, bookSlot } from '../controllers/bookCallController'

const routes = express.Router()

routes.get('/available-slots', userAuth, availbleSlots)
routes.post('/book', userAuth, bookSlot)

export default routes