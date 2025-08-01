import express from 'express'
import userAuth from '../middlewares/authMiddleware'
import { getChats } from '../controllers/chatController'

const routes = express.Router()

routes.get('/:groupId', userAuth,getChats)

export default routes