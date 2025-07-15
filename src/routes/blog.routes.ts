import express from 'express'
import { addComment, createBlog, fetchBlog, getComments, toggleLike } from '../controllers/blogController'
import userAuth from '../middlewares/authMiddleware'

const routes = express.Router()

routes.post('/create',userAuth, createBlog)
routes.get('/get',userAuth,fetchBlog)
routes.patch('/:blogId/like', userAuth, toggleLike)
routes.post('/:blogId/comment/post-comments',userAuth, addComment)
routes.get('/:blogId/comment/get-comments',userAuth,getComments)

export default routes